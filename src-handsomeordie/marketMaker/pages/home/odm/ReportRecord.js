import React from "react";
import { Spin, Icon, Select } from "antd";
import { InfinityTable as Table } from "antd-table-infinity";
import { FetchFindRealtimeOrderTab, findAlgoList } from "../../../../common/marketApi";

import {checkLogin} from "../../../../marketMaker/actions/marketDetail";
import WebSocketClient from "../../../socket/WebSocketClient";
import { tradingWebSocket } from "../../../../common/marketApi/index";
import {setSocketConnected} from "../../../actions/globalAction";
import moment from "moment";
import {connect} from "react-redux";

import "../../../../common/styles/home/ODM/odm.scss";

class ReportRecord extends React.Component {
    state = {
        data: [],
        loading: false,
        algoList: []
    };

    onError = () => {
        this.props.setSocketConnected(3);
    };

    onOpen = () => {
        this.props.setSocketConnected(1);
    };

    onReconnect = () => {
        this.props.setSocketConnected(2);
    };

    componentWillMount() {
        this.props.checkLogin((data) => {
            if (data) {
                if (!window.conn) {
                    window.conn = true;
                    WebSocketClient.connect({onError: this.onError, onOpen: this.onOpen, onReconnect: this.onReconnect, });
                }
                this.tradingWebSocket = WebSocketClient.subscribeMessage({
                    mtype: tradingWebSocket,
                    callback: (message) => {
                        // console.log(message);
                        let inArr = false;
                        for(let i in this.state.data){
                            if(this.state.data[i].id===message.id){
                                inArr = true;
                                this.state.data[i] = message;
                                let newArr = [];
                                newArr.push(message);
                                this.setState(({ data }) => ({
                                    loading: false,
                                    data: data
                                }));
                            }
                            if(inArr){
                                break;
                            }
                        }
                        if(!inArr){
                            let newArr = [];
                            newArr.push(message);
                            this.setState(({ data }) => ({
                                loading: false,
                                data: newArr.concat(data || []),
                            }));
                        }
                    },
                    scope: this
                });
                findAlgoList().then((data)=>{
                    // console.log(data.data);
                    let arr = [{
                        text: "手动",
                        value: "Manual",
                    }];
                    if(data.success){
                        for(let i in data.data){
                            arr.push({text: data.data[i].algo, value: data.data[i].algo});
                        }
                    }
                    this.setState({
                        algoList: arr
                    });
                });
            }

        });
    }

    componentWillUnmount() {
        WebSocketClient.unsubscribeMessage({ subscriptionId: this.tradingWebSocket, mtype: tradingWebSocket });
        this.setState = (state,callback)=>{
            return;
        };
    }

    handleFetch = () => {
        this.setState({ loading: true },()=>{
            FetchFindRealtimeOrderTab({
                "startRecord": this.state.data.length,
                "maxRecords": 20,
                "params": {
                    "generateSource": "find-all"
                }
            }).then(newData => {
                // 新数据最后一条与元数据第一条作对比，小于等于，丢弃，直到大于才拼接
                if(newData.data.length>0 && this.state.data.length>0) {
                    for (let i=newData.data.length; i >= 0; i--){
                        if(newData.data.length>0 && this.state.data.length>0 && parseInt(newData.data[newData.data.length-1].id)<=parseInt(this.state.data[0].id)) {
                            newData.data.pop();
                        } else {
                            this.setState({
                                loading: false,
                                data: newData.data.concat(this.state.data),
                            });
                        }
                    }
                } else if(this.state.data.length == 0){
                    this.setState(({ data }) => ({
                        loading: false,
                        data: newData.data.concat(data),
                    }));
                }
            });
        });

    };

    loadMoreContent = () => (
        <div
            style={{
                textAlign: "center",
                paddingTop: 10,
                paddingBottom: 10,
                // border: "1px solid #e8e8e8",
            }}
        >
            <Spin tip="Loading..." />
        </div>
    );

    showCode = (text,record) => {
        const {tradingvarietymanage} = this.props;
        for(let i in tradingvarietymanage){
            if(tradingvarietymanage[i].key === text){
                return tradingvarietymanage[i].displayName;
            }
        }
        return "";
    }

    showStatus = (text) => {
        switch (text) {
        case "CREATED":
            return "已创建";
            break;
        case "ACCEPTED":
            return "已接受";
            break;
        case "REJECTED":
            return "已拒绝";
            break;
        case "FILLED_PARTIALLY":
            return "部分成交";
            break;
        case "FILLED_FULLY":
            return "全部成交";
            break;
        case "CANCEL_PENDING":
            return "撤单中";
            break;
        case "CANCEL_ACCEPTED":
            return "撤单已接受";
            break;
        case "CANCEL_REJECTED":
            return "撤单已拒绝";
            break;
        case "CANCEL_BY_MARKET":
            return "市场主动撤单";
            break;
        default:
            return;
        }
    }

    render() {
        // console.log(this.props.tradingvarietymanage);
        const { Option } = Select;
        let arr = this.props.allBook || [];
        let allBookFilter = arr.map((item)=>({text:item.name,value:item.name,}));
        // console.log("allBookFilter",allBookFilter);
        // console.log("data",this.state.data);
        const columns = [
            {
                title: "合约类型",
                align: "center",
                width: "5%",
                dataIndex: "id",
                render: (text,record) => record.extraParamsStr && JSON.parse(record.extraParamsStr).marketIndicator && JSON.parse(record.extraParamsStr).marketIndicator === "4" ? "现券" : ""
            },
            {
                title: "订单类型",
                dataIndex: "type",
                align: "center",
                width: "6%"
            },
            {
                title: "市场订单编号",
                dataIndex: "marketOrderId",
                align: "center",
                width: "10%"
            },
            {
                title: "时间",
                dataIndex: "time",
                align: "center",
                width: "10%",
                render: (text) => (moment(text).format("YYYY/MM/DD HH:mm:ss"))
            },
            {
                title: "代码",
                dataIndex: "code",
                align: "center",
                width: "8%",
                render: (text,record) => {
                    return this.showCode(text,record);
                }
            },
            {
                title: "清算速度",
                dataIndex: "settlType",
                align: "center",
                width: "4%",
                render: (text,record) => record.settlType && record.settlType === "1" ? "T+0" : record.settlType === "2" ? "T+1" : ""
            },
            {
                title: "报价",
                dataIndex: "price",
                align: "center",
                width: "8%",
                render: (text) => text && text.toFixed(4)
            },
            {
                title: "方向",
                dataIndex: "side",
                align: "center",
                width: "6%"
            },
            {
                title: "报单量(万)",
                dataIndex: "quantity",
                align: "center",
                width: "5%",
                render: (text,record) => record.quantity / 10000
            },
            {
                title: "来源",
                dataIndex: "generateSource",
                align: "center",
                render: (text)=>(<div style={{height: 15, background: "#3e9896", lineHeight: "15px", margin: "0 5px"}}>{text==="Manual"?"手动":text}</div>),
                width: "8%",
                filters: this.state.algoList,
                filterMultiple: true,
                onFilter: (value, record) => record.generateSource.indexOf(value) === 0,
            },
            {
                title: "状态",
                dataIndex: "status",
                align: "center",
                width: "9%",
                render: (text)=> this.showStatus(text),
                filters: [
                    {
                        text: "已创建",
                        value: "CREATED",
                    },
                    {
                        text: "已接受",
                        value: "ACCEPTED",
                    },
                    {
                        text: "已拒绝",
                        value: "REJECTED",
                    },
                    {
                        text: "部分成交",
                        value: "FILLED_PARTIALLY",
                    },
                    {
                        text: "全部成交",
                        value: "FILLED_FULLY",
                    },
                    {
                        text: "撤单中",
                        value: "CANCEL_PENDING",
                    },
                    {
                        text: "撤单已接受",
                        value: "CANCEL_ACCEPTED",
                    },
                    {
                        text: "撤单已拒绝",
                        value: "CANCEL_REJECTED",
                    },
                    {
                        text: "市场主动撤单",
                        value: "CANCEL_BY_MARKET",
                    },
                ],
                filterMultiple: true,
                onFilter: (value, record) => record.status.indexOf(value) === 0,
            // },
            // {
            //     title: "操作",
            //     dataIndex: "operation",
            //     align: "center",
            //     render: ()=>(<a>撤单</a>)
            },
            {
                title: "客户参考编号",
                dataIndex: "clOrdId",
                align: "center",
                width: "13%",
                render: (text,record) => {
                    return record.extraParamsStr ? JSON.parse(record.extraParamsStr).clOrdId || "" : "";
                }
            },
            {
                title: "头组名称",
                dataIndex: "bookName",
                align: "center",
                width: "13%",
                filters:  allBookFilter ,
                filterMultiple: true,
                onFilter: (value, record) => record.bookName.indexOf(value) === 0,
            }
        ];
        // console.log(this.state.data);
        return (
            <div style={{display:this.props.footer==="ReportRecord"?"":"none"}} className={"symbol-wrapper"}>
                <Table
                    rowKey={record => record.id}
                    onFetch={this.handleFetch}
                    loadingIndicator={this.loadMoreContent()}
                    loading={this.state.loading}
                    className={"ant-tr-hover"}
                    columns={columns}
                    dataSource={this.state.data}
                    bordered={false}
                    debug={false}
                    scroll={{y: this.props.tradeRecordContentHeight - 35}}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    tradingvarietymanage: state.odmReducer.tradingvarietymanage,
    allBook: state.odmReducer.allBook,
});

const mapDispatchToProps = dispatch => ({
    checkLogin: (cb) => dispatch(checkLogin(cb)),
    setSocketConnected: (params) => dispatch(setSocketConnected(params)),
});

export default connect(mapStateToProps,mapDispatchToProps)(ReportRecord);
