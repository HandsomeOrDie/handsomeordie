import {connect} from "react-redux";
import React, {Component} from "react";
import {  Select, Table, Icon, message, Badge, Form, Input, InputNumber, Dropdown, Menu  } from "antd";
import { getOperationRisk, deleteOperationRisk, addOperationRisk, saveOperationRisk, setUnsaved, getSelectValue, setOperationRisk } from "../../../actions/operationRisk";
import { DragDropContext, DragSource, DropTarget } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import update from "immutability-helper";
// import WebSocketClient from "../../../socket/WebSocketClient";
// import { riskMonitorWebSocket } from "../../../../common/marketApi";
const Option = Select.Option;
const iconStyle = {fontSize: 20,color:"#bfbfbf"};

const FormItem = Form.Item;
const EditableContext = React.createContext();

let dragingIndex = -1;

const rowSource = {
    beginDrag(props) {
        dragingIndex = props.index;
        return {
            index: props.index,
        };
    },
};

const rowTarget = {
    drop(props, monitor) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }

        // Time to actually perform the action
        props.moveRow(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    },
};

class EditableCell extends React.Component {
    state = {
        editing: this.props.record.editing,
        values: {},
    };

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                this.input && this.input.focus();
            }
        });
    };

    save = (dataIndex, value) => {
        const { record, handleSave } = this.props;
        let values = this.state.values;
        if (dataIndex){
            values[dataIndex] = value;
        }
        this.toggleEdit();
        handleSave({ ...record, ...values });
    };

    saveInput = (dataIndex, value) => {
        if (!value || value === ""){
            return;
        }
        const { record, handleSave } = this.props;
        let values = this.state.values;
        if (dataIndex){
            values[dataIndex] = value;
        }
        this.toggleEdit();
        handleSave({ ...record, ...values });
    };

    render() {
        const { editing } = this.state;
        const Option = Select.Option;
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            type,
            options,
            selectWidth,
            ...restProps
        } = this.props;
        // console.log("this.state.values::", this.state.values);
        return (
            <td ref={node => (this.cell = node)} {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>
                        {(form) => {
                            this.form = form;
                            if (editing){
                                if (type === "select"){
                                    return (<FormItem help="" style={{ margin: 0 }}>
                                        <Select
                                            className="qit-select-bg"
                                            // placeholder="请选择"
                                            size="small"
                                            defaultValue={record[dataIndex]}
                                            dropdownStyle={{marginLeft: 0}}
                                            autoFocus={!record.editing} //新增一条时不能自动获取焦点，因为有很多select，不能同时获取焦点
                                            defaultOpen={!record.editing} //新增一条时不能默认展开，因为有很多select，同时展开影响布局
                                            onSelect={(value)=>{this.save(dataIndex, value);}}
                                            onBlur={()=>{
                                                //失去焦点时不显示select，如果是select是未选择，失去焦点也要显示select
                                                record[dataIndex] && this.toggleEdit();
                                            }}
                                            style={{width: selectWidth || 85}}
                                        >
                                            {
                                                options.map(item => (<Option key={item.value} value={item.value}>{item.text}</Option>))
                                            }
                                        </Select>
                                    </FormItem>);
                                }else if (type === "input"){
                                    return (<FormItem help="" style={{ margin: 0 }}>
                                        <Input
                                            ref={node => (this.input = node)}
                                            size="small"
                                            defaultValue={record[dataIndex]}
                                            // formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                            onPressEnter={(e)=>{this.saveInput(dataIndex, e.target.value);}}
                                            onBlur={(e)=>{this.saveInput(dataIndex, e.target.value);}}
                                        />
                                    </FormItem>);
                                }
                            } else {
                                return (
                                    <div
                                        className="editable-cell-value-wrap"
                                        // style={{ paddingRight: 24 }}
                                        onClick={this.toggleEdit}
                                    >
                                        {restProps.children}
                                    </div>
                                );
                            }
                        }}
                    </EditableContext.Consumer>
                ) : restProps.children}
            </td>
        );
    }
}

class BodyRow extends React.Component {
    render() {
        const {
            isOver,
            connectDragSource,
            connectDropTarget,
            moveRow,
            ...restProps
        } = this.props;
        const style = { ...restProps.style, cursor: "move" };

        let className = restProps.className;
        if (isOver) {
            if (restProps.index > dragingIndex) {
                className += " drop-over-downward";
            }
            if (restProps.index < dragingIndex) {
                className += " drop-over-upward";
            }
        }

        return connectDragSource(
            connectDropTarget(
                <tr
                    {...restProps}
                    className={className}
                    style={style}
                />
            )
        );
    }
}

const DragableBodyRow = DropTarget(
    "row",
    rowTarget,
    (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
    }),
)(
    DragSource(
        "row",
        rowSource,
        (connect) => ({
            connectDragSource: connect.dragSource(),
        }),
    )(BodyRow),
);

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form} {...props}>
        <DragableBodyRow/>
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class OperationRisk extends Component {
    constructor(props){
        super(props);
        this.state = {
            clickRowId: undefined,
            list: [],
        };
    }

    componentDidMount(){
        this.props.getSelectValue();
        this.props.getOperationRisk();
    }

    onClickRow = (record,index) => {
        return {
            onClick: () => {
                this.setState({
                    clickRowId: record.key,
                });
            },
            index,
            moveRow: this.moveRow,
        };
    };

    setRowClassName = (record) => {
        return record.key === this.state.clickRowId ? "qit-tr-active" : "";
    };

    deleteOperationRisk = () => {
        if (!this.state.clickRowId && this.state.clickRowId !== 0){
            return;
        }
        this.props.deleteOperationRisk(this.state.clickRowId, this.state.list);
        this.setState({clickRowId: undefined});
    };

    refresh = () => {
        this.props.getOperationRisk();
    };

    saveOperationRisk = () => {
        const _this = this;
        // console.log("this.props.list: ", this.props.list);
        // return;
        this.props.saveOperationRisk(this.state.list, function (response) {
            if (response.success){
                _this.props.getOperationRisk();
                message.success("Success！", 2);
            } else {
                message.error("Failed！", 2);
            }
        });
    };

    addOperationRisk = () => {
        const { list } = this.state;
        this.props.addOperationRisk(list);
    };

    componentWillReceiveProps(nextProps) {
        this.setState({list: nextProps.list});
    }

    handleSave = (row) => {
        const newData = [...this.state.list];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        this.props.setUnsaved();
        //这里不能使用setState修改list，
        // 因为当执行componentWillReceiveProps时老的redux中的list会覆盖掉新的this.state中的list
        this.props.setOperationRisk(newData);
        // this.setState({ list: newData });
    };

    moveRow = (dragIndex, hoverIndex) => {
        const { list } = this.state;
        const dragRow = list[dragIndex];
        this.props.setUnsaved();
        this.setState(
            update(this.state, {
                list: {
                    $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
                },
            }),
            ()=>{
                this.props.setOperationRisk(this.state.list);
            });

    };


    render() {
        const components = {
            body: {
                row: DragableBodyRow,
                // wrapper: DragableBodyRow,
                cell: EditableCell,
            },
        };
        const selectValue = this.props.selectValue;
        const columns = [
            // {
            //     title: "Team",
            //     dataIndex: "team",
            //     align: "center",
            //     editable: true,
            //     width: "8%",
            //     onCell: record => ({
            //         record,
            //         editable: true,
            //         title: "Team",
            //         dataIndex: "team",
            //         type: "select",
            //         selectWidth: 90,
            //         options: selectValue.team,
            //         handleSave: this.handleSave,
            //     }),
            // },
            {
                title: "Group",
                dataIndex: "riskGroup",
                align: "center",
                editable: true,
                width: "5%",
                onCell: record => ({
                    record,
                    editable: true,
                    title: "Group",
                    dataIndex: "riskGroup",
                    type: "select",
                    // selectWidth: 90,
                    selectWidth: 100,
                    options: selectValue.group,
                    handleSave: this.handleSave,
                }),
            },
            {
                title: "User",
                dataIndex: "riskUser",
                align: "center",
                editable: true,
                width: "5%",
                onCell: record => ({
                    record,
                    editable: true,
                    title: "User",
                    dataIndex: "riskUser",
                    type: "select",
                    options: selectValue.riskUser,
                    handleSave: this.handleSave,
                }),
            },
            {
                title: "Book",
                dataIndex: "book",
                align: "center",
                editable: true,
                width: "6%",
                onCell: record => ({
                    record,
                    editable: true,
                    title: "Book",
                    dataIndex: "book",
                    type: "select",
                    selectWidth: 110,
                    options: selectValue.book,
                    handleSave: this.handleSave,
                }),
            },
            // {
            //     title: "Portfolio",
            //     dataIndex: "portfolio",
            //     align: "center",
            //     editable: true,
            //     width: "5%",
            //     onCell: record => ({
            //         record,
            //         editable: true,
            //         title: "Portfolio",
            //         dataIndex: "portfolio",
            //         type: "select",
            //         options: selectValue.portfolio,
            //         handleSave: this.handleSave,
            //     }),
            // },
            // {
            //     title: "Asset Class",
            //     dataIndex: "assetClass",
            //     align: "center",
            //     editable: true,
            //     width: "5%",
            //     onCell: record => ({
            //         record,
            //         editable: true,
            //         title: "Asset Class",
            //         dataIndex: "assetClass",
            //         type: "select",
            //         options: selectValue.assetClass,
            //         handleSave: this.handleSave,
            //     }),
            // },
            {
                title: "CounterParty",
                dataIndex: "counterParty",
                align: "center",
                editable: true,
                width: "5%",
                onCell: record => ({
                    record,
                    editable: true,
                    title: "CounterParty",
                    dataIndex: "counterParty",
                    type: "select",
                    selectWidth: 100,
                    options: selectValue.counterParty,
                    handleSave: this.handleSave,
                }),
            },
            {
                title: "ProductType",
                dataIndex: "productType",
                align: "center",
                editable: true,
                width: "5%",
                onCell: record => ({
                    record,
                    editable: true,
                    title: "ProductType",
                    dataIndex: "productType",
                    type: "select",
                    selectWidth: 100,
                    options: selectValue.productType,
                    handleSave: this.handleSave,
                }),
            },
            {
                title: "CCY",
                dataIndex: "ccy",
                align: "center",
                editable: true,
                width: "5%",
                onCell: record => ({
                    record,
                    editable: true,
                    title: "CCY",
                    dataIndex: "ccy",
                    type: "select",
                    // selectWidth: 100,
                    options: selectValue.ccy,
                    handleSave: this.handleSave,
                }),
            },
            {
                title: "Symbol",
                dataIndex: "symbol",
                align: "center",
                editable: true,
                width: "6%",
                onCell: record => ({
                    record,
                    editable: true,
                    title: "Symbol",
                    dataIndex: "symbol",
                    selectWidth: 100,
                    type: "select",
                    options: selectValue.symbol,
                    handleSave: this.handleSave,
                }),
            },
            {
                title: "Window",
                dataIndex: "window",
                align: "center",
                editable: true,
                width: "7%",
                onCell: record => ({
                    record,
                    editable: true,
                    title: "Window",
                    dataIndex: "window",
                    selectWidth: 110,
                    type: "select",
                    options: selectValue.window,
                    handleSave: this.handleSave,
                }),
            },
            // {
            //     title: "Strategy Group",
            //     dataIndex: "strategyGroup",
            //     align: "center",
            //     editable: true,
            //     width: "5%",
            //     onCell: record => ({
            //         record,
            //         editable: true,
            //         title: "Strategy Group",
            //         dataIndex: "strategyGroup",
            //         type: "select",
            //         options: selectValue.strategyGroup,
            //         handleSave: this.handleSave,
            //     }),
            // },
            {
                title: "Strategy",
                dataIndex: "strategy",
                align: "center",
                editable: true,
                width: "6%",
                onCell: record => ({
                    record,
                    editable: true,
                    title: "Strategy",
                    dataIndex: "strategy",
                    type: "select",
                    selectWidth: 100,
                    options: selectValue.strategy,
                    handleSave: this.handleSave,
                }),
            },
            // {
            //     title: "Dimension",
            //     dataIndex: "dimension",
            //     align: "center",
            //     editable: true,
            //     width: "5%",
            //     onCell: record => ({
            //         record,
            //         editable: true,
            //         title: "Dimension",
            //         dataIndex: "dimension",
            //         type: "select",
            //         options: selectValue.dimension,
            //         handleSave: this.handleSave,
            //     }),
            // },
            {
                title: "Criteria",
                dataIndex: "criteria",
                align: "center",
                editable: true,
                width: "8%",
                onCell: record => ({
                    record,
                    editable: true,
                    title: "Criteria",
                    dataIndex: "criteria",
                    type: "select",
                    selectWidth: 130,
                    options: selectValue.criteria,
                    handleSave: this.handleSave,
                }),
            },
            // {
            //     title: "Order Type",
            //     dataIndex: "orderType",
            //     align: "center",
            //     editable: true,
            //     width: "5%",
            //     onCell: record => ({
            //         record,
            //         editable: true,
            //         title: "Order Type",
            //         dataIndex: "orderType",
            //         type: "select",
            //         options: selectValue.orderType,
            //         handleSave: this.handleSave,
            //     }),
            // },
            {
                title: "Direction",
                dataIndex: "direction",
                align: "center",
                editable: true,
                width: "4%",
                onCell: record => ({
                    record,
                    editable: true,
                    title: "Direction",
                    dataIndex: "direction",
                    type: "select",
                    selectWidth: 60,
                    options: selectValue.direction,
                    handleSave: this.handleSave,
                }),
            },
            {
                title: "Value",
                dataIndex: "value",
                align: "center",
                editable: true,
                width: "4%",
                onCell: record => ({
                    record,
                    editable: true,
                    title: "Value",
                    dataIndex: "value",
                    type: "input",
                    handleSave: this.handleSave,
                }),
            },
            {
                title: "Pricing CCY",
                dataIndex: "pricingCcy",
                align: "center",
                editable: true,
                width: "6%",
                onCell: record => ({
                    record,
                    editable: true,
                    title: "Pricing CCY",
                    dataIndex: "pricingCcy",
                    type: "select",
                    options: selectValue.pricingCcy,
                    handleSave: this.handleSave,
                }),
            },
            {
                title: "Unit",
                dataIndex: "unit",
                align: "center",
                editable: true,
                width: "4%",
                onCell: record => ({
                    record,
                    editable: true,
                    title: "Unit",
                    dataIndex: "unit",
                    type: "select",
                    selectWidth: 60,
                    options: selectValue.unit,
                    handleSave: this.handleSave,
                }),
            },
            {
                title: "LowBound",
                dataIndex: "lowBound",
                align: "center",
                editable: true,
                width: "5%",
                onCell: record => ({
                    record,
                    editable: true,
                    title: "LowBound",
                    dataIndex: "lowBound",
                    type: "input",
                    handleSave: this.handleSave,
                }),
            },
            {
                title: "UpBound",
                dataIndex: "upBound",
                align: "center",
                editable: true,
                width: "5%",
                onCell: record => ({
                    record,
                    editable: true,
                    title: "UpBound",
                    dataIndex: "upBound",
                    type: "input",
                    handleSave: this.handleSave,
                }),
            },
            {
                title: "Level",
                dataIndex: "level",
                align: "center",
                editable: true,
                width: "6%",
                onCell: record => ({
                    record,
                    editable: true,
                    title: "Level",
                    dataIndex: "level",
                    type: "select",
                    options: selectValue.level,
                    handleSave: this.handleSave,
                }),
            },
            {
                title: "Action",
                dataIndex: "action",
                align: "center",
                editable: true,
                onCell: record => ({
                    record,
                    editable: true,
                    title: "Action",
                    dataIndex: "action",
                    type: "select",
                    selectWidth: 150,
                    options: selectValue.action,
                    handleSave: this.handleSave,
                }),
                // render: (text, record) => {
                //     return (
                //         <Dropdown overlay={
                //             <Menu>
                //                 <Menu.Item key="0">
                //                     <a style={{fontSize: 12}}>Alert Only</a>
                //                 </Menu.Item>
                //                 <Menu.Item key="1">
                //                     <a style={{fontSize: 12}}>Block Trade</a>
                //                 </Menu.Item>
                //                 <Menu.Item key="2">
                //                     <a style={{fontSize: 12}}>Stop Trading</a>
                //                 </Menu.Item>
                //                 <Menu.Item key="3">
                //                     <a style={{fontSize: 12}}>Stop Trading STrategy</a>
                //                 </Menu.Item>
                //             </Menu>
                //         } trigger={["click"]}>
                //             <a className="ant-dropdown-link" href="#">
                //                 Operation <Icon type="down" />
                //             </a>
                //         </Dropdown>
                //     );
                // }
            },
        ];
        return (
            <div>
                <Table
                    rowKey={(record)=>record.id}
                    className="ant-tr-hover"
                    title={()=>(
                        <div>
                            <label>Operation Risk Engine Rule</label>
                            <span style={{float: "right"}}>
                                <a onClick={this.addOperationRisk} style={{marginRight: 10}}><Icon type="plus-circle" style={iconStyle}/></a>
                                <a onClick={this.deleteOperationRisk} style={{marginRight: 30}}><Icon type="minus-circle" style={iconStyle}/></a>
                                <a onClick={this.refresh} style={{marginRight: 10}}><Icon type="sync" style={iconStyle}/></a>
                                <a onClick={this.saveOperationRisk} style={{marginRight: 10}}>
                                    <Badge count={this.props.unsaved ? <img src={require("../../../images/asterisk.svg")}/> : 0}>
                                        {/*<img style={iconStyle} src={require("../../../images/save.svg")}/>*/}
                                        <Icon type="save" style={iconStyle}/>
                                    </Badge>
                                </a>
                            </span>
                        </div>
                    )}
                    components={components}
                    bordered={true}
                    // scroll={{x: 1880, y: this.props.tableHeight}}
                    scroll={{x: 2200, y: this.props.tableHeight}}
                    columns={columns}
                    dataSource={this.state.list}
                    onRow={this.onClickRow}
                    rowClassName={this.setRowClassName}
                    loading={this.props.loading}
                    size="small"
                    pagination={false}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    loading: state.operationRiskReducer.loading,
    unsaved: state.operationRiskReducer.unsaved,
    list: state.operationRiskReducer.list,
    selectValue: state.operationRiskReducer.selectValue,
});

const mapDispatchToProps = dispatch => ({
    getOperationRisk: (params) => dispatch(getOperationRisk(params)),
    deleteOperationRisk: (id, list) => dispatch(deleteOperationRisk(id, list)),
    addOperationRisk: (list) => dispatch(addOperationRisk(list)),
    saveOperationRisk: (list, cb) => dispatch(saveOperationRisk(list, cb)),
    setUnsaved: () => dispatch(setUnsaved()),
    getSelectValue: () => dispatch(getSelectValue()),
    setOperationRisk: (list) => dispatch(setOperationRisk(list)),
});
// export default DragDropContext(HTML5Backend)(connect(mapStateToProps,mapDispatchToProps)(OperationRisk));
export default connect(mapStateToProps,mapDispatchToProps)(OperationRisk);