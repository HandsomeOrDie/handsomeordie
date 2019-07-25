import {connect} from "react-redux";
import React, {Component} from "react";
import {Form, Table, Icon, Button, message, Modal, Input, Select} from "antd";
import {getAppliedMarket, getMarketData, updateMktData, updateMktSrc, getDirtyList, addNewSrc} from "../../actions/marketData";
import "../../../common/styles/marketPages/marketData.scss";
import moment from "moment";
const Option = Select.Option;
class RenderCell extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            tdWidth: 10,
        };
    }

    componentDidMount() {
        // const tdWidth = document.getElementById("render-id").style.width;
        // this.setState({tdWidth});
    }

    getColor = (params) => {
        if (params === 1){
            return "#3A6447";
        }else if (params === 2){
            return "#57562C";
        }else{
            return "#57342C";
        }
    }

    render() {
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            width,
            custom,
            ...restProps
        } = this.props;
        // console.log(width);
        return (
            <td id="render-td" style={{width: width}} key={Math.random()*10000}>
                {
                    custom ?
                        <div style={{background: this.getColor(record[dataIndex]), width: width * (record[dataIndex] === 1 ? 1 : record[dataIndex] === 2 ? 2/3 : 1/3), height: "inherit"}}/>
                        :
                        <div>
                            {
                                restProps.children
                            }
                        </div>
                }
            </td>
        );
    }
}

class MarketData extends Component {
    state = {
        tdWidth: 10,
        tableWidth: 10,
        loading: false,
        srcLoading: false,

        visible: false,
        pagination: {defaultCurrent: 1, pageSize: 10, total: 0},
        dirtyList: [],
        dirtyLoading: false,

        addVisible: false,
    };

    componentDidMount() {
        this.setState({tdWidth: (document.documentElement.clientWidth - 20 - 10)/6, loading: true, srcLoading: true});
        window.addEventListener("resize",()=>{this.setState({tdWidth: (document.documentElement.clientWidth - 20 - 10)/6, });});
        this.props.getMarketData({}, ()=>{
            this.setState({loading: false});
        });
        this.props.getAppliedMarket({}, ()=>{
            this.setState({srcLoading: false});
        });
    }

    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return;
        };
    }

    getSelectData = (set) => {
        // let filterSelect = [];
        // Array.from(set).map(item => {
        //     filterSelect.push({text: item, value: item});
        // });
        //
        // return filterSelect;

        return Array.from(set).map(item => ({text: item, value: item}));
    };
    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        pager.pageSize = pagination.pageSize;
        this.setState({
            pagination: pager,
            dirtyLoading: true
        });
        this.props.getDirtyList({startRecord: pager.current, maxRecords: pager.pageSize}, (result)=>{
            this.setState({dirtyList: result.data, dirtyLoading: false, pagination: {...this.state.pagination, total: result.totalRecords}});
        });
    };

    addNewSource = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.props.addNewSrc(values, (result)=>{
                    if (result.success){
                        message.success("Success!", 2);
                        this.setState({srcLoading: true, addVisible: false});
                        this.props.getAppliedMarket({}, ()=>{
                            this.setState({srcLoading: false});
                        });
                    }else {
                        message.error("Failed!", 2);
                    }
                });
                // this.setState({addVisible: false});
            }
        });
    };
    
    render() {
        const components = {
            body: {
                cell: RenderCell,
            },
        };

        const marketData = this.props.marketData;

        let sourceSet = new Set();
        let productSet = new Set();
        let symbolSet = new Set();
        let qualitySet = new Set();
        let statusSet = new Set();
        let hasSrc;
        let hasPro;
        let hasSym;
        let hasQty;
        let hasSta;
        marketData.map(item => {
            hasSrc = item.venue || hasSrc;
            hasPro = item.varietyType || hasPro;
            hasSym = item.symbol || hasSym;
            hasQty = item.quality || hasQty;
            hasSta = item.status || hasSta;
            item.venue && sourceSet.add(item.venue);
            item.varietyType && productSet.add(item.varietyType);
            item.symbol && symbolSet.add(item.symbol);
            item.quality && qualitySet.add(item.quality);
            item.status && statusSet.add(item.status);
        });

        let columns = [
            {
                title: "Source",
                dataIndex: "venue",
                align: "center",
                width: this.state.tdWidth,
                filters: hasSrc && this.getSelectData(sourceSet),
                onFilter: hasSrc && sourceSet.size > 0 && sourceSet[0] !== "" ? (value, record) => record.venue.indexOf(value) === 0 : undefined,
                sorter: hasSrc ? (a, b) => {return a.venue > b.venue ? 1 : a.venue < b.venue ? -1 : 0;} : undefined,
                sortDirections: hasSrc && ["descend", "ascend"],
                onCell: record => ({
                    record,
                    dataIndex: "venue",
                    title: "Source",
                    width: this.state.tdWidth,
                })
            }, {
                title: "Product",
                dataIndex: "varietyType",
                align: "center",
                width: this.state.tdWidth,
                filters: hasPro && this.getSelectData(productSet),
                onFilter: hasPro ? (value, record) => record.varietyType.indexOf(value) === 0 : undefined,
                sorter: hasPro ? (a, b) => {return a.varietyType > b.varietyType ? 1 : a.varietyType < b.varietyType ? -1 : 0;} : undefined,
                sortDirections: hasPro && ["descend", "ascend"],
                onCell: record => ({
                    record,
                    dataIndex: "varietyType",
                    title: "Product",
                    width: this.state.tdWidth,
                })
            }, {
                title: "Symbol",
                dataIndex: "symbol",
                align: "center",
                width: this.state.tdWidth,
                filters: hasSym && this.getSelectData(symbolSet),
                onFilter: hasSym ? (value, record) => record.symbol.indexOf(value) === 0 : undefined,
                sorter: hasSym ? (a, b) => {return a.symbol > b.symbol ? 1 : a.symbol < b.symbol ? -1 : 0;} : undefined,
                sortDirections: hasSym && ["descend", "ascend"],
                onCell: record => ({
                    record,
                    dataIndex: "symbol",
                    title: "Symbol",
                    width: this.state.tdWidth,
                })

            // }, {
            //     title: "Market Data Quality",
            //     dataIndex: "quality",
            //     align: "center",
            //     width: this.state.tdWidth,
            //     filters: hasQty && this.getSelectData(qualitySet),
            //     onFilter: hasQty ? (value, record) => record.quality.indexOf(value) === 0 : undefined,
            //     sorter: hasQty ? (a, b) => {return a.quality > b.quality ? 1 : a.quality < b.quality ? -1 : 0;} : undefined,
            //     sortDirections: hasQty && ["descend", "ascend"],
            //     onCell: record => ({
            //         record,
            //         dataIndex: "quality",
            //         title: "Market Data Quality",
            //         custom: "xxx",
            //         width: this.state.tdWidth,
            //     })
            }, {
                title: "Status",
                dataIndex: "status",
                align: "center",
                width: this.state.tdWidth,
                filters: hasSta && this.getSelectData(statusSet),
                onFilter: hasSta ? (value, record) => record.status.indexOf(value) === 0 : undefined,
                sorter: hasSta ? (a, b) => {return a.status > b.status ? 1 : a.status < b.status ? -1 : 0;} : undefined,
                sortDirections: hasSta && ["descend", "ascend"],
                onCell: record => ({
                    record,
                    dataIndex: "status",
                    title: "Status",
                    width: this.state.tdWidth,
                })
            }, {
                title: "Action",
                dataIndex: "action",
                key: "action1",
                align: "center",
                width: this.state.tdWidth,
                onCell: record => ({
                    record,
                    dataIndex: "Action",
                    title: "action1",
                    width: this.state.tdWidth,
                }),
                render: (text, record, index)=>{
                    return (
                        <div>
                            <Button key={index} style={{background: "#3F918E"}} size="small" onClick={()=>{
                                this.setState({loading: true});
                                this.props.updateMktData({id: record.id, status: record.status === "ENABLED" ? "DISABLED" : "ENABLED"}, (result)=>{
                                    if (result.success){
                                        this.props.getMarketData({}, ()=>{
                                            this.setState({loading: false});
                                        });
                                        message.success("Success!", 2);
                                    }else {
                                        this.setState({loading: false});
                                        message.error("Failed!:" + result.message, 2);
                                    }
                                });
                            }}>{record.status === "ENABLED" ? "DISABLE" : "ENABLE"}</Button>
                        </div>
                    );
                }
            }
        ];

        const columns2 = [
            {
                title: "Source",
                dataIndex: "name",
                align: "center",
                width: "25%",
                // sortDirections: ["descend", "ascend"],
                // filters: this.getSelectData(sourceSet),
                // onFilter: (value, record) => record.venue.indexOf(value) === 0,
                // sorter: (a, b) => {return a.venue > b.venue ? 1 : a.venue < b.venue ? -1 : 0;},
            },  {
                title: "Status",
                dataIndex: "status",
                align: "center",
                width: "25%"
            }, {
                title: "Action",
                dataIndex: "action",
                align: "center",
                key: "action2",
                width: "25%",
                render: (text, record, index)=>{
                    return (
                        <div>
                            <Button key={index} style={{background: "#3F918E"}} size="small" onClick={()=>{
                                this.setState({srcLoading: true});
                                this.props.updateMktSrc({id: record.id, name: record.name, status: record.status === "ENABLED" ? "DISABLED" : "ENABLED"}, (result)=>{
                                    if (result.success){
                                        this.setState({loading: true});
                                        this.props.getAppliedMarket({}, ()=>{
                                            this.setState({srcLoading: false});
                                            this.props.getMarketData({}, ()=>{
                                                this.setState({loading: false});
                                            });
                                        });
                                        message.success("Success!", 2);
                                    }else {
                                        this.setState({srcLoading: false});
                                        message.error("Failed:" + result.message, 2);
                                    }
                                });
                            }}>{record.status === "ENABLED" ? "DISABLE" : "ENABLE"}</Button>
                        </div>
                    );
                }
            },
            // {
            //     title: "Action",
            //     dataIndex: "action",
            //     align: "center",
            //     width: "25%",
            //     render: (text, record, index)=>{
            //         return (
            //             <div>
            //                 <Button key={index} onClick={()=>{
            //                     this.setState({visible: true, dirtyLoading: true});
            //                     this.props.getDirtyList({dataSource: record.name, startRecord: 0, maxRecords: 10}, (result)=>{
            //                         this.setState({dirtyList: result.data, dirtyLoading: false, pagination: {...this.state.pagination, total: result.totalRecords}});
            //                     });
            //                 }} style={{background: "#3F918E"}} size="small">CLEANSING REPORT</Button>
            //             </div>
            //         );
            //     }
            // }
        ];
        const columns3 = [
            {
                title: "Source",
                dataIndex: "dataSource",
                align: "center",
                width: "16%",
            },
            {
                title: "Symbol",
                dataIndex: "symbol",
                align: "center",
                width: "16%",
            },
            {
                title: "TradingType",
                dataIndex: "tradingType",
                align: "center",
                width: "16%",
            },
            {
                title: "Channels",
                dataIndex: "channels",
                align: "center",
                width: "16%",
            },
            {
                title: "Status",
                dataIndex: "status",
                align: "center",
                width: "16%"
            },
            {
                title: "CreatedTime",
                dataIndex: "createdTime",
                align: "center",
                width: "20%",
                render: val => (moment(val).format("HH:mm:ss MM/DD/YYYY")),
            },
        ];
        const contentHeight = document.documentElement.clientHeight - 200;

        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 14 },
                sm: { span: 14 },
            },
        };
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="marketData" style={{width:"100%"}}>
                <div style={{height: 40, display: "flex", alignItems: "center"}}>
                    <div style={{color: "#3F918E", fontSize: 18, fontWeight: 700}}>Market Data Management</div>
                </div>
                <div style={{height: contentHeight, display: "flex", flexDirection: "column"}}>
                    
                    <div style={{flex: "1"}}>
                        <Table
                            rowKey={(record)=>record.key}
                            scroll={{y: contentHeight/3 - 40}}
                            bordered
                            pagination={false}
                            style={{width: "100%"}}
                            size="small"
                            dataSource={this.props.appliedMarket}
                            columns={columns2}
                            loading={this.state.srcLoading}
                        />
                    </div>
                    <div style={{flex: "2", marginTop: 5}}>
                        <Table
                            rowKey={(record)=>record.key}
                            components={components}
                            scroll={{y: contentHeight * 2/3 - 35,}}
                            bordered
                            pagination={false}
                            size="small"
                            dataSource={this.props.marketData}
                            columns={columns}
                            loading={this.state.loading}
                        />
                    </div>
                </div>
                <div style={{height: 60, display: "flex", alignItems: "center", marginLeft: 10}}>
                    <Icon style={{fontSize: 20, marginRight: 10,color:"#bfbfbf"}} type={"plus-circle"}/>
                    {/*<Button type="primary" style={{background: "#1890ff"}}>Add New Source</Button>*/}
                    <Button type="primary" onClick={()=>{
                        this.setState({addVisible: true});
                    }} style={{background: "#3F918E"}}>ADD NEW SOURCE</Button>
                </div>

                <Modal
                    title="Dirty List"
                    visible={this.state.visible}
                    width={900}
                    onOk={()=>{
                        this.setState({visible: false});
                    }}
                    onCancel={()=>{
                        this.setState({visible: false});
                    }}
                >
                    <Table
                        id="dirty"
                        rowKey={(record)=>record.id}
                        bordered
                        pagination={{...this.state.pagination,}}
                        size="small"
                        dataSource={this.state.dirtyList}
                        columns={columns3}
                        loading={this.state.dirtyLoading}
                        onChange={this.handleTableChange}
                    />
                </Modal>

                <Modal
                    title="Add New Source"
                    visible={this.state.addVisible}
                    width={500}
                    onOk={()=>{
                        this.addNewSource();
                    }}
                    onCancel={()=>{
                        this.setState({addVisible: false});
                    }}
                >
                    <Form>
                        <Form.Item style={{margin:0}} {...formItemLayout} label="name">
                            {getFieldDecorator("name", {
                                rules: [{ message: "Please input name!", required: true  }],
                            })(
                                <Input/>
                            )}
                        </Form.Item>
                    </Form>
                    <Form>
                        <Form.Item style={{margin:0}} {...formItemLayout} label="status">
                            {getFieldDecorator("status", {
                                rules: [{ message: "Please select status!", required: true  }],
                            })(
                                <Select
                                    className="qit-select-bg"
                                    // placeholder="请选择"
                                    // onChange={(value)=>{this.onSymbolsChange(value);}}
                                >
                                    <Option key="ENABLED" value="ENABLED">ENABLED</Option>
                                    <Option key="DISABLED" value="DISABLED">DISABLED</Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    marketData: state.marketDataReducer.marketData,
    appliedMarket: state.marketDataReducer.appliedMarket,
});

const mapDispatchToProps = dispatch => ({
    getMarketData: (params, cb)=> dispatch(getMarketData(params, cb)),
    getAppliedMarket: (params, cb)=> dispatch(getAppliedMarket(params, cb)),
    updateMktData: (params, cb)=> dispatch(updateMktData(params, cb)),
    updateMktSrc: (params, cb)=> dispatch(updateMktSrc(params, cb)),
    getDirtyList: (params, cb)=> dispatch(getDirtyList(params, cb)),
    addNewSrc: (params, cb)=> dispatch(addNewSrc(params, cb)),
});
const MarketDataForm = Form.create()(MarketData);
export default connect(mapStateToProps,mapDispatchToProps)(MarketDataForm);