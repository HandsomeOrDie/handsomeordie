import {connect} from "react-redux";
import React, {Component} from "react";
import {  Select, Table, Icon, message, Badge, Form, Input, InputNumber  } from "antd";
import { getClientFlowList, deleteClientFlow, addClientFlowList, saveClientFlowList, setClientFlowUnsaved, getSelectValue, setClientFlowList } from "../../../actions/clientFlow";
import {getQuoteSource} from "../../../actions/manualQuote";
const Option = Select.Option;
const iconStyle = {fontSize: 20};

const FormItem = Form.Item;
const EditableContext = React.createContext();

class EditableCell extends React.Component {
    state = {
        editing: this.props.record.editing,
        values: {},
    };

    toggleEdit = () => {
        console.log("xxxx");
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
                                            // placeholder="请选择"
                                            size="small"
                                            defaultValue={record[dataIndex]}
                                            dropdownStyle={{marginLeft: 0}}
                                            autoFocus={!record.editing} //新增一条时不能自动获取焦点，因为有很多select，不能同时获取焦点
                                            defaultOpen={!record.editing} //新增一条时不能默认展开，因为有很多select，同时展开影响布局
                                            onSelect={(value)=>{this.save(dataIndex, value);}}
                                            onChange={(value)=>{this.props.onChange && this.props.onChange(value);}}
                                            onBlur={()=>{
                                                //失去焦点时不显示select，如果是select是未选择，失去焦点也要显示select
                                                record[dataIndex] && this.toggleEdit();
                                            }}
                                            style={{width: selectWidth || 90}}
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
                                            style={{width: selectWidth || 75}}
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

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form} {...props}>
        <tr {...props}/>
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class ClientFlowTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            clickRowId: undefined,
            clientFlowList: [],

            quotes: [],
            autoQuote: [
                {text: "YES", value: "YES"},
                {text: "NO", value: "NO"},
            ],
            maxPositionByCpty: [
                {text: "YES", value: "YES"},
                {text: "NO", value: "NO"},
            ],
        };
    }

    componentDidMount(){
        this.props.getSelectValue();
        this.props.getClientFlowList();
    }

    onClickRow = (record,index) => {
        return {
            onClick: () => {
                this.setState({
                    clickRowId: record.key,
                });
            },
        };
    };

    setRowClassName = (record) => {
        return record.key === this.state.clickRowId ? "qit-tr-active" : "";
    };

    deleteClientFlow = () => {
        if (!this.state.clickRowId && this.state.clickRowId !== 0){
            return;
        }
        this.props.deleteClientFlow(this.state.clickRowId, this.state.clientFlowList);
        this.setState({clickRowId: undefined});
    };

    refreshClientFlow = () => {
        this.props.getClientFlowList();
    };

    saveClientFlow = () => {
        const _this = this;
        this.props.saveClientFlowList(this.state.clientFlowList, function (response) {
            if (response.success){
                _this.props.getClientFlowList();
                message.success("Success!", 2);
            } else {
                message.error("Failed！", 2);
            }
        });
    };

    addClientFlow = () => {
        const { clientFlowList } = this.state;
        this.props.addClientFlowList(clientFlowList );
    };

    componentWillReceiveProps(nextProps) {
        this.setState({clientFlowList: nextProps.clientFlowList});
    }

    handleSave = (row) => {
        const newData = [...this.state.clientFlowList];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        this.props.setClientFlowUnsaved();
        //这里不能使用setState修改hedgeList，
        // 因为当执行componentWillReceiveProps时老的redux中的hedgeList会覆盖掉新的this.state中的hedgeList
        this.props.setClientFlowList(newData);
        // this.setState({ hedgeList: newData });
    };

    onSymbolChange = (value) => {
        console.log(value);
        this.props.getQuoteSource(value, (result) => {
            const quoteSource = result.data;
            let quotes = quoteSource.map(item => ({text: item.displayName, value: item.displayName}));
            if (quoteSource.length === 0) {
                this.setState({autoQuote: [{text: "NO", value: "NO"}]});
            }else {
                this.setState({autoQuote: [
                    {text: "YES", value: "YES"},
                    {text: "NO", value: "NO"},
                ]});
            }
            this.setState({quotes});
        });
    };

    render() {
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        // console.log("this.props.tableHeight:", this.props.tableHeight);
        const selectValue = this.props.selectValue;
        const columns = [
            {
                title: "Range",
                dataIndex: "range",
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
                        title: "ProductType",
                        dataIndex: "productType",
                        align: "center",
                        width: "8%",
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
                        title: "Symbol",
                        dataIndex: "symbol",
                        align: "center",
                        editable: true,
                        width: "10%",
                        onCell: record => ({
                            record,
                            editable: true,
                            title: "Symbol",
                            dataIndex: "symbol",
                            type: "select",
                            options: selectValue.symbol,
                            selectWidth: 90,
                            onChange: this.onSymbolChange,
                            handleSave: this.handleSave,
                        }),
                    },
                    {
                        title: "Counter Pty",
                        dataIndex: "cpty",
                        align: "center",
                        width: "8%",
                        editable: true,
                        onCell: record => ({
                            record,
                            editable: true,
                            title: "Counter Pty",
                            dataIndex: "cpty",
                            type: "select",
                            options: selectValue.cpty,
                            handleSave: this.handleSave,
                        }),
                    },
                    // {
                    //     title: "Tenor",
                    //     dataIndex: "tenor",
                    //     align: "center",
                    //     width: "10%",
                    //     editable: true,
                    //     onCell: record => ({
                    //         record,
                    //         editable: true,
                    //         title: "Tenor",
                    //         dataIndex: "tenor",
                    //         type: "select",
                    //         options: selectValue.tenor,
                    //         handleSave: this.handleSave,
                    //     }),
                    // },
                    {
                        title: "Time",
                        dataIndex: "rangeTime",
                        align: "center",
                        width: "8%",
                        editable: true,
                        onCell: record => ({
                            record,
                            editable: true,
                            title: "Time",
                            dataIndex: "rangeTime",
                            type: "select",
                            selectWidth: 100,
                            options: selectValue.rangeTime,
                            handleSave: this.handleSave,
                        }),
                    },
                    {
                        title: "Scenario",
                        dataIndex: "scenario",
                        align: "center",
                        width: "10%",
                        editable: true,
                        onCell: record => ({
                            record,
                            editable: true,
                            title: "Scenario",
                            dataIndex: "scenario",
                            type: "select",
                            selectWidth: 90,
                            options: selectValue.scenario,
                            handleSave: this.handleSave,
                        }),
                    },
                ]
            },
            {
                title: "Quoting",
                dataIndex: "quoting",
                children: [
                    {
                        title: "Auto Quote",
                        dataIndex: "autoQuote",
                        align: "center",
                        width: "6%",
                        editable: true,
                        onCell: record => ({
                            record,
                            editable: true,
                            title: "Auto Quote",
                            dataIndex: "autoQuote",
                            type: "select",
                            options: this.state.autoQuote,
                            handleSave: this.handleSave,
                        }),
                    },
                    {
                        title: "Quote",
                        dataIndex: "quote",
                        align: "center",
                        width: "8%",
                        editable: true,
                        onCell: record => ({
                            record,
                            editable: true,
                            title: "Quote",
                            dataIndex: "quote",
                            type: "select",
                            options: this.state.quotes,
                            handleSave: this.handleSave,
                        }),
                    },
                ]
            },
            {
                title: "Lastlook",
                children: [
                    // {
                    //     title: "Criteria",
                    //     dataIndex: "criteria",
                    //     align: "center",
                    //     width: "8%",
                    //     editable: true,
                    //     onCell: record => ({
                    //         record,
                    //         editable: true,
                    //         title: "Criteria",
                    //         dataIndex: "criteria",
                    //         type: "select",
                    //         options: selectValue.criteria,
                    //         handleSave: this.handleSave,
                    //     }),
                    // },
                    {
                        title: "Max Position",
                        dataIndex: "maxPosition",
                        align: "center",
                        width: "8%",
                        editable: true,
                        onCell: record => ({
                            record,
                            editable: true,
                            title: "Max Position",
                            dataIndex: "maxPosition",
                            type: "input",
                            handleSave: this.handleSave,
                        }),
                    },
                    {
                        title: "Max Qty",
                        dataIndex: "maxQty",
                        align: "center",
                        width: "6%",
                        editable: true,
                        onCell: record => ({
                            record,
                            editable: true,
                            title: "Max Qty",
                            dataIndex: "maxQty",
                            type: "input",
                            handleSave: this.handleSave,
                        }),
                    },
                    {
                        title: "Max Deviation(%)",
                        dataIndex: "maxDeviation",
                        align: "center",
                        width: "6%",
                        editable: true,
                        onCell: record => ({
                            record,
                            editable: true,
                            title: "Max Deviation(%)",
                            dataIndex: "maxDeviation",
                            type: "input",
                            handleSave: this.handleSave,
                        }),
                    },
                    {
                        title: "Max Position By Cpty",
                        dataIndex: "maxPositionByCpty",
                        align: "center",
                        width: "8%",
                        editable: true,
                        onCell: record => ({
                            record,
                            editable: true,
                            title: "Max Position By Cpty",
                            dataIndex: "maxPositionByCpty",
                            type: "select",
                            options: this.state.maxPositionByCpty,
                            handleSave: this.handleSave,
                        }),
                    },
                    {
                        title: "Pricing Ccy",
                        dataIndex: "pricingCcy",
                        align: "center",
                        width: "8%",
                        editable: true,
                        onCell: record => ({
                            record,
                            editable: true,
                            title: "Pricing Ccy",
                            dataIndex: "pricingCcy",
                            type: "select",
                            options: selectValue.pricingCcy,
                            handleSave: this.handleSave,
                        }),
                    },
                    // {
                    //     title: "Dir",
                    //     dataIndex: "dir",
                    //     align: "center",
                    //     width: "6%",
                    //     editable: true,
                    //     onCell: record => ({
                    //         record,
                    //         editable: true,
                    //         title: "Dir",
                    //         dataIndex: "dir",
                    //         type: "select",
                    //         options: selectValue.dir,
                    //         handleSave: this.handleSave,
                    //     }),
                    // },
                    {
                        title: "Unit",
                        dataIndex: "unit",
                        align: "center",
                        width: "8%",
                        editable: true,
                        onCell: record => ({
                            record,
                            editable: true,
                            title: "Unit",
                            dataIndex: "unit",
                            type: "select",
                            options: selectValue.unit,
                            handleSave: this.handleSave,
                        }),
                    },
                    {
                        title: "Auto Lastlook",
                        dataIndex: "autoLastlook",
                        align: "center",
                        width: "6%",
                        editable: true,
                        onCell: record => ({
                            record,
                            editable: true,
                            title: "Auto Lastlook",
                            dataIndex: "autoLastlook",
                            type: "select",
                            options: selectValue.autoLastlook,
                            handleSave: this.handleSave,
                        }),
                    },

                ]
            },
        ];

        const browserHeight = document.documentElement.clientHeight;
        return (
            <div className="autoHedgePage" style={{width: document.documentElement.clientWidth - 270}}>
                <Table
                    className="ant-tr-hover maxHeightTable"
                    title={()=>(
                        <div>
                            <label>Auto Quoting Rules</label>
                            <span style={{float: "right"}}>
                                <a onClick={this.addClientFlow} style={{marginRight: 10}}><Icon type="plus-circle" style={iconStyle}/></a>
                                <a onClick={this.deleteClientFlow} style={{marginRight: 30}}><Icon type="minus-circle" style={{fontSize: 20}}/></a>
                                <a onClick={this.refreshClientFlow} style={{marginRight: 10}}><Icon type="sync" style={iconStyle}/></a>
                                <a disabled={!this.props.unsaved} onClick={this.saveClientFlow} style={{marginRight: 10}}>
                                    {/*<Badge count={this.props.unsaved ? <img src={require("../../../images/asterisk.svg")}/> : 0}>*/}
                                    {/*<img style={iconStyle} src={require("../../../images/save.svg")}/>*/}
                                    <Icon type="save" style={iconStyle}/>
                                    {/*</Badge>*/}
                                </a>
                            </span>
                        </div>
                    )}
                    style={{margin:10,width:"100%", height:browserHeight-110}}
                    components={components}
                    scroll={{x: 940, y: this.props.tableHeight - 100}}
                    columns={columns}
                    dataSource={this.state.clientFlowList}
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
    loading: state.clientFlowReducer.loading,
    unsaved: state.clientFlowReducer.unsaved,
    clientFlowList: state.clientFlowReducer.clientFlowList,
    selectValue: state.clientFlowReducer.selectValue,
});

const mapDispatchToProps = dispatch => ({
    getClientFlowList: (params) => dispatch(getClientFlowList(params)),
    deleteClientFlow: (id, list) => dispatch(deleteClientFlow(id, list)),
    addClientFlowList: (list) => dispatch(addClientFlowList(list)),
    saveClientFlowList: (list, cb) => dispatch(saveClientFlowList(list, cb)),
    setClientFlowUnsaved: () => dispatch(setClientFlowUnsaved()),
    getSelectValue: () => dispatch(getSelectValue()),
    setClientFlowList: (list) => dispatch(setClientFlowList(list)),
    getQuoteSource:(params, cb) => dispatch(getQuoteSource(params, cb)),
});
export default connect(mapStateToProps,mapDispatchToProps)(ClientFlowTable);