import {connect} from "react-redux";
import React, {Component} from "react";
import {  Select, Table, Icon, message, Badge, Form, Input, InputNumber  } from "antd";
import { getHedgeList, deleteHedge, addHedgeList, saveHedgeList, setHedgeUnsaved, getHedgeSelectValue, setHedgeList, setSelectValue } from "../../../actions/autohedge";
import { DragDropContext, DragSource, DropTarget } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import update from "immutability-helper";
import ProfileSetting from "./ProfileSetting";
const Option = Select.Option;
const iconStyle = {fontSize: 20};

const FormItem = Form.Item;
const EditableContext = React.createContext();

let dragingIndex = -1;

const rowSource = {
    beginDrag(props) {
        // console.log("xxx:", props);
        dragingIndex = props.index;
        return {
            index: props.index,
        };
    },
};

const rowTarget = {
    drop(props, monitor) {
        // console.log("6666666666", props);
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
        handleSave({ ...record, ...values }, {dataIndex, value});
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
                                            showSearch
                                            filterOption={(input, option) =>
                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            className="qit-select-bg"
                                            // placeholder="Please select"
                                            size="small"
                                            defaultValue={record[dataIndex]}
                                            dropdownStyle={{marginLeft: 0}}
                                            autoFocus={!record.editing} //新增一条时不能自动获取焦点，因为有很多select，不能同时获取焦点
                                            defaultOpen={!record.editing} //新增一条时不能默认展开，因为有很多select，同时展开影响布局
                                            onSelect={(value)=>{this.save(dataIndex, value);}}
                                            // onFocus={()=>{console.log("onFoucs:", record);}}
                                            onBlur={()=>{
                                                //失去焦点时不显示select，如果是select是未选择，失去焦点也要显示select
                                                // console.log("onBlur:", record);
                                                record[dataIndex] && this.toggleEdit();
                                            }}
                                            style={{width: selectWidth || 80}}
                                        >
                                            {
                                                options.map(item => (<Option key={item.value} value={item.value}>{item.text}</Option>))
                                            }
                                        </Select>
                                    </FormItem>);
                                }else if (type === "input"){
                                    // if (dataIndex === "hedgingValue"){
                                    //     if (record.hedgingBy === "Amount"){
                                    //         return <div
                                    //             className="editable-cell-value-wrap"
                                    //             // style={{ paddingRight: 24 }}
                                    //             onClick={this.toggleEdit}
                                    //         >
                                    //             {restProps.children}
                                    //         </div>;
                                    //     }
                                    // }
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
                                        style={{ width: "100%", height: record[index] ? "100%" : 20 }}
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

class HedgeTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            clickRowId: undefined,
            hedgeList: [],
        };
    }

    componentDidMount(){
        this.props.getHedgeSelectValue();
        this.props.getHedgeList();
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

    deleteHedge = () => {
        if (!this.state.clickRowId && this.state.clickRowId !== 0){
            return;
        }
        this.props.deleteHedge(this.state.clickRowId, this.state.hedgeList);
        this.setState({clickRowId: undefined});
    };

    refreshHedge = () => {
        this.props.getHedgeList();
    };

    saveHedge = () => {
        const _this = this;
        // console.log("this.props.hedgeList: ", this.props.hedgeList);
        // return;
        this.props.saveHedgeList(this.state.hedgeList, function (response) {
            if (response.success){
                _this.props.getHedgeList();
                message.success("Success!", 2);
            } else {
                message.error("Failed！", 2);
            }
        });
    };

    addHedge = () => {
        const { hedgeList } = this.state;
        this.props.addHedgeList(hedgeList);
    };

    componentWillReceiveProps(nextProps) {
        this.setState({hedgeList: nextProps.hedgeList});
    }

    handleSave = (row, column) => {
        const newData = [...this.state.hedgeList];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        const record = {
            ...item,
            ...row,
        };
        // let selectValue = record.selectValue;
        // if (column){
        //     const { dataIndex, value } = column;
        //     if (dataIndex === "type") {
        //         if (value.toLowerCase() === "latest" && record.criteria.toLowerCase() === "pnl"){
        //             selectValue.hedgingBy = [{text: "Reset to", value: "Reset to"}, {text: "Amount", value: "Amount"}];
        //         }else if (value.toLowerCase() === "flow" && record.criteria.toLowerCase() === "position"){
        //             selectValue.hedgingBy = [{text: "Ratio", value: "Ratio"}, {text: "Amount", value: "Amount"}];
        //         }else if (value.toLowerCase() === "latest" && record.criteria.toLowerCase() === "position"){
        //             selectValue.hedgingBy = [{text: "Reset to", value: "Reset to"}, {text: "Amount", value: "Amount"}];
        //         } else {
        //             selectValue.hedgingBy = [{text: "Ratio", value: "Ratio"}, {text: "Amount", value: "Amount"}];
        //         }
        //         record.selectValue = selectValue;
        //     }
        //     if (dataIndex === "criteria") {
        //         if (value.toLowerCase() === "pnl") {
        //             selectValue.type = [{text: "Latest", value: "Latest"}];
        //         }else {
        //             selectValue.type = selectValue.typeCopy;
        //         }
        //         record.selectValue = selectValue;
        //     }
        //     if (dataIndex === "hedgingBy") {
        //         if (value.toLowerCase() === "amount"){
        //             record.hedgingValue = "-";
        //         }
        //     }
        // }
        newData.splice(index, 1, record);
        this.props.setHedgeUnsaved();
        //这里不能使用setState修改hedgeList，
        // 因为当执行componentWillReceiveProps时老的redux中的hedgeList会覆盖掉新的this.state中的hedgeList
        this.props.setHedgeList(newData);
        // this.setState({ hedgeList: newData });
    };

    moveRow = (dragIndex, hoverIndex) => {
        const { hedgeList } = this.state;
        const dragRow = hedgeList[dragIndex];
        this.props.setHedgeUnsaved();
        this.setState(
            update(this.state, {
                hedgeList: {
                    $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
                },
            }),
            ()=>{
                this.props.setHedgeList(this.state.hedgeList);
            });

    };

    handleRef=(that)=>{
        this.profileSetting = that;
    }


    render() {
        const components = {
            body: {
                row: DragableBodyRow,
                // wrapper: DragableBodyRow,
                cell: EditableCell,
            },
        };
        const selectValue = this.props.selectValue;
        // console.log("selectValue2", selectValue);
        const columns = [
            {
                title: "Criteria",
                dataIndex: "criteria",
                children: [
                    {
                        title: "Id",
                        dataIndex: "id",
                        align: "center",
                        width: "4%",
                        onCell: record => ({
                            record,
                            dataIndex: "id",
                        }),
                    },
                    {
                        title: "User",
                        dataIndex: "user",
                        align: "center",
                        width: "5%",
                        editable: true,
                        onCell: record => ({
                            record,
                            editable: true,
                            title: "User",
                            dataIndex: "user",
                            type: "select",
                            options: selectValue.user,
                            handleSave: this.handleSave,
                        }),
                    },
                    {
                        title: "Cpty",
                        dataIndex: "cpty",
                        align: "center",
                        width: "5%",
                        editable: true,
                        onCell: record => ({
                            record,
                            editable: true,
                            title: "Cpty",
                            dataIndex: "cpty",
                            type: "select",
                            options: selectValue.cpty,
                            handleSave: this.handleSave,
                        }),
                    },
                    {
                        title: "ProductType",
                        dataIndex: "productType",
                        align: "center",
                        width: "7%",
                        editable: true,
                        onCell: record => ({
                            record,
                            editable: true,
                            title: "ProductType",
                            dataIndex: "productType",
                            type: "select",
                            options: selectValue.productType,
                            handleSave: this.handleSave,
                        }),
                    },
                    {
                        title: "CCY",
                        dataIndex: "ccy",
                        align: "center",
                        width: "5%",
                        editable: true,
                        onCell: record => ({
                            record,
                            editable: true,
                            title: "CCY",
                            dataIndex: "ccy",
                            type: "select",
                            options: selectValue.ccy,
                            handleSave: this.handleSave,
                        }),
                    },
                    {
                        title: "Symbol",
                        dataIndex: "symbol",
                        align: "center",
                        width: "7%",
                        editable: true,
                        onCell: record => ({
                            record,
                            editable: true,
                            title: "Symbol",
                            dataIndex: "symbol",
                            type: "select",
                            selectWidth: 100,
                            options: selectValue.symbol,
                            handleSave: this.handleSave,
                        }),
                    },
                    {
                        title: "Time",
                        dataIndex: "rangeTime",
                        align: "center",
                        width: "7%",
                        editable: true,
                        onCell: record => ({
                            record,
                            editable: true,
                            title: "Time",
                            dataIndex: "rangeTime",
                            type: "select",
                            options: selectValue.rangeTime,
                            handleSave: this.handleSave,
                        }),
                    },
                    {
                        title: "Scenario",
                        dataIndex: "scenario",
                        align: "center",
                        width: "7%",
                        editable: true,
                        onCell: record => ({
                            record,
                            editable: true,
                            title: "Scenario",
                            dataIndex: "scenario",
                            type: "select",
                            options: selectValue.scenario,
                            handleSave: this.handleSave,
                        }),
                    },
                ]
            },
            {
                title: "Threshold",
                dataIndex: "threshold",
                children: [
                    {
                        title: "Criteria",
                        dataIndex: "criteria",
                        align: "center",
                        width: "7%",
                        editable: true,
                        onCell: record => ({
                            record,
                            editable: true,
                            title: "Criteria",
                            dataIndex: "criteria",
                            type: "select",
                            options: selectValue.criteria,
                            handleSave: this.handleSave,
                        }),
                    },
                    {
                        title: "Window",
                        dataIndex: "window",
                        align: "center",
                        width: "7%",
                        editable: true,
                        onCell: record => ({
                            record,
                            editable: true,
                            title: "Window",
                            dataIndex: "window",
                            type: "select",
                            options: selectValue.window,
                            handleSave: this.handleSave,
                        }),
                    },
                    {
                        title: "Dir",
                        dataIndex: "dir",
                        align: "center",
                        width: "5%",
                        editable: true,
                        onCell: record => ({
                            record,
                            editable: true,
                            title: "Dir",
                            dataIndex: "dir",
                            selectWidth: 60,
                            type: "select",
                            options: selectValue.dir,
                            handleSave: this.handleSave,
                        }),
                    },
                    {
                        title: "Value",
                        dataIndex: "thresholdValue",
                        align: "center",
                        width: "5%",
                        editable: true,
                        onCell: record => ({
                            record,
                            editable: true,
                            title: "Value",
                            dataIndex: "thresholdValue",
                            type: "input",
                            handleSave: this.handleSave,
                        }),
                    },
                    {
                        title: "Pricing CCY",
                        dataIndex: "pricingCcy",
                        align: "center",
                        width: "7%",
                        editable: true,
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
                        width: "5%",
                        editable: true,
                        onCell: record => ({
                            record,
                            editable: true,
                            title: "Unit",
                            dataIndex: "unit",
                            selectWidth: 60,
                            type: "select",
                            options: selectValue.unit,
                            handleSave: this.handleSave,
                        }),
                    },
                ]
            },
            {
                title: "Hedging",
                dataIndex: "hedging",
                children: [
                    {
                        title: "HedgingBy",
                        dataIndex: "hedgingBy",
                        align: "center",
                        width: "7%",
                        editable: true,
                        onCell: record => ({
                            record,
                            editable: true,
                            title: "HedgingBy",
                            dataIndex: "hedgingBy",
                            type: "select",
                            options: selectValue.hedgingBy,
                            handleSave: this.handleSave,
                        }),
                    },
                    {
                        title: "HedgingSymbol",
                        dataIndex: "hedgingSymbol",
                        align: "center",
                        width: "7%",
                        editable: true,
                        onCell: record => ({
                            record,
                            editable: true,
                            title: "HedgingSymbol",
                            dataIndex: "hedgingSymbol",
                            type: "select",
                            selectWidth: 90,
                            options: selectValue.hedgingSymbol,
                            handleSave: this.handleSave,
                        }),
                    },
                    {
                        title: "HedgingValue",
                        dataIndex: "hedgingValue",
                        align: "center",
                        width: "7%",
                        editable: true,
                        onCell: record => ({
                            record,
                            editable: true,
                            title: "HedgingValue",
                            dataIndex: "hedgingValue",
                            type: "input",
                            handleSave: this.handleSave,
                        }),
                    },
                    {
                        title: "HedgingUnit",
                        dataIndex: "hedgingUnit",
                        align: "center",
                        width: "7%",
                        editable: true,
                        onCell: record => ({
                            record,
                            editable: true,
                            title: "HedgingUnit",
                            dataIndex: "hedgingUnit",
                            selectWidth: 60,
                            type: "select",
                            options: selectValue.hedgingUnit,
                            handleSave: this.handleSave,
                        }),
                    },
                    {
                        title: "Algo",
                        dataIndex: "algo",
                        align: "center",
                        width: "7%",
                        editable: true,
                        onCell: record => ({
                            record,
                            editable: true,
                            title: "Algo",
                            dataIndex: "algo",
                            type: "select",
                            options: selectValue.algo,
                            handleSave: this.handleSave,
                        }),
                    },
                    {
                        title: <div style={{display: "flex", justifyContent: "space-around"}}><div>Profile</div><div><Icon onClick={()=>{this.profileSetting.showModal();}} type={"setting"}/></div></div>,
                        dataIndex: "hedgingProfile",
                        align: "center",
                        editable: true,
                        onCell: record => ({
                            record,
                            editable: true,
                            title: "Profile",
                            dataIndex: "hedgingProfile",
                            type: "select",
                            selectWidth: 90,
                            options: selectValue.hedgingProfile,
                            handleSave: this.handleSave,
                        }),
                    },
                ]
            },
        ];
        const browserHeight = document.documentElement.clientHeight;
        return (
            <div className="autoHedgePage" style={{width: document.documentElement.clientWidth - 270, margin:10}}>
                <Table
                    className="ant-tr-hover maxHeightTable"
                    title={()=>(
                        <div>
                            <label>Auto Hedging Rules</label>
                            <span style={{float: "right"}}>
                                <a onClick={this.addHedge} style={{marginRight: 10}}><Icon type="plus-circle" style={iconStyle}/></a>
                                <a onClick={this.deleteHedge} style={{marginRight: 30}}><Icon type="minus-circle" style={{fontSize: 20}}/></a>
                                <a onClick={this.refreshHedge} style={{marginRight: 10}}><Icon type="sync" style={iconStyle}/></a>
                                <a onClick={this.saveHedge} style={{marginRight: 10}}>
                                    <Badge count={this.props.unsaved ? <img src={require("../../../images/asterisk.svg")}/> : 0}>
                                        {/*<img style={iconStyle} src={require("../../../images/save.svg")}/>*/}
                                        <Icon type="save" style={iconStyle}/>
                                    </Badge>
                                </a>
                            </span>
                        </div>
                    )}
                    components={components}
                    style={{height:browserHeight-110}}
                    scroll={{x: 1700, y: this.props.tableHeight}}
                    columns={columns}
                    dataSource={this.state.hedgeList}
                    onRow={this.onClickRow}
                    rowClassName={this.setRowClassName}
                    loading={this.props.loading}
                    size="small"
                    pagination={false}
                />
                <ProfileSetting handleRef={this.handleRef}/>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    loading: state.autoHedgeReducer.loading,
    unsaved: state.autoHedgeReducer.unsaved,
    hedgeList: state.autoHedgeReducer.hedgeList,
    selectValue: state.autoHedgeReducer.selectValue,
});

const mapDispatchToProps = dispatch => ({
    getHedgeList: (params) => dispatch(getHedgeList(params)),
    deleteHedge: (id, hedgeList) => dispatch(deleteHedge(id, hedgeList)),
    addHedgeList: (hedgeList) => dispatch(addHedgeList(hedgeList)),
    saveHedgeList: (hedgeList, cb) => dispatch(saveHedgeList(hedgeList, cb)),
    setHedgeUnsaved: () => dispatch(setHedgeUnsaved()),
    getHedgeSelectValue: () => dispatch(getHedgeSelectValue()),
    setHedgeList: (hedgeList) => dispatch(setHedgeList(hedgeList)),
    setSelectValue: (selectValue) => dispatch(setSelectValue(selectValue)),
});
export default connect(mapStateToProps,mapDispatchToProps)(HedgeTable);
