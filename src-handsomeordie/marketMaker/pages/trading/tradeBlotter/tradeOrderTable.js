import {connect} from "react-redux";
import React, {Component} from "react";
import {Table, Pagination, Card, Icon, Modal,Tooltip} from "antd";
import {findRealtimeOrder, setTradeBlotter, findExecution} from "../../../actions/tradeBlotter";
import moment from "moment";
import WebSocketClient from "../../../socket/WebSocketClient";
import {tradingWebSocket} from "../../../../common/marketApi/index";
import {checkLogin} from "../../../actions/marketDetail";
import {updatePositionList} from "../../../actions/riskmonitor";

// websocket
import {setSocketConnected} from "../../../actions/globalAction";

import "../../../../common/styles/marketPages/tradeOrder.scss";

const defaultPageSize = 50;

class TradeOrderTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderList: [],
            queryParams: {
                startRecord: 0,
                maxRecords: defaultPageSize
            },
            pagination: {
                defaultCurrent: 1,
                defaultPageSize: defaultPageSize,
                hideOnSinglePage: false,
                simple: true,
                size: "small"
            },
            modalVisible: false,
            execution: []
        };
    }
    componentWillMount(){
        this.props.handleRef(this);
        let params = this.state.queryParams;
        // this.props.findRealtimeOrder(params);

        // this.props.checkLogin((data) => {
        //     if (data) {
        //         const _this = this;
        //         WebSocketClient.connect();
        //         this.tradeOrderId = WebSocketClient.subscribeMessage({
        //             mtype: tradingWebSocket,
        //             callback: this.tradeOrderOutPut,
        //             scope: this
        //         });
        //     }
        // });
    }
    componentDidMount() {
        this.getSocket();
    }
    componentWillReceiveProps (nextProps) {
        let pagination = this.state.pagination;
        pagination.total = nextProps.totalRecords;
        if(nextProps.current===1){
            console.log(nextProps);
            pagination.current = 1;
        } else {
            delete pagination["current"];
        }
        // console.log(nextProps,this.props);
        if((nextProps.tab!==this.props.tab) || (nextProps.tabType!==this.props.tabType)){
            this.getSocket(nextProps);
        }
        this.setState({
            pagination: pagination,
            orderList: this.props.orderList || [],
        });
    }
    componentWillUnmount() {
        this.props.setTradeBlotter();
        WebSocketClient.unsubscribeMessage({ subscriptionId: this.tradeOrderId, mtype: tradingWebSocket });
        // WebSocketClient.unsubscribeMessage({ subscriptionId: this.riskMonitorWsId, mtype: riskMonitorWebSocket });
    }
    tradeOrderOutPut = (message) => {
        // console.log("%c@@@@output","color:green",message);
    };
    handleTableChange = (pagination, filters, sorter) => {
        let params = this.state.queryParams;
        params.params = {
            statusIn: this.props.tabType === "Trade"?["FILLED_PARTIALLY", "FILLED_FULLY"]:this.props.tabType === "Order"?["ACCEPTED"]:[],
            tradingPurposeNot: this.props.tabType === "Trade" && this.props.tab === "Client"?"HEDGE":null,
            tradingPurpose: this.props.tabType === "Trade" && this.props.tab === "Hedging"?"HEDGE":null
        };
        params.startRecord = pagination.pageSize * (pagination.current - 1);
        this.setState({
            queryParams: params,
            pagination: pagination
        });

        this.props.findRealtimeOrder(params);
    };

    getSocket = (nextProps) => {
        // const {tabType,tab} = nextProps;
        // if(nextProps && (nextProps.tab!==this.props.tab || nextProps.tabType!==this.props.tabType)){
        this.props.checkLogin((data) => {
            // if (data) {
            if (!window.conn) {
                window.conn = true;
                WebSocketClient.connect({onError: this.onError, onOpen: this.onOpen, onReconnect: this.onReconnect, });
            }

            this.getTradingWebSocket = WebSocketClient.subscribeMessage({
                mtype: tradingWebSocket,
                callback: (message)=>{
                    if(JSON.stringify(message) !== JSON.stringify(this.state.orderList[0])){
                        this.state.orderList.unshift(message);
                        // this.props.getCurrent
                        this.setState({
                            orderList: this.state.orderList
                        },() => {
                            // console.log(_this.state.list);
                        });
                    }
                },
                params:{
                    statusIn: nextProps && nextProps.tabType && nextProps.tabType === "Trade"?["FILLED_PARTIALLY", "FILLED_FULLY"]:nextProps && nextProps.tabType && nextProps.tabType === "Order"?["ACCEPTED"]:["FILLED_PARTIALLY", "FILLED_FULLY"],
                    tradingPurposeNot: nextProps && nextProps.tabType && nextProps.tabType === "Trade" && nextProps.tab && nextProps.tab === "Client"?"HEDGE":null,
                    tradingPurpose: nextProps && nextProps.tabType && nextProps.tabType === "Trade" && nextProps.tab && nextProps.tab === "Hedging"?"HEDGE":null
                },
                scope: this
            });
            // }
        });
        // }
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

    fmoney =(s, n) =>{
        // console.log("s:", s);
        n = n > 0 && n <= 20 ? n : 2;
        s = parseFloat((s + "").replace(/[^\d\\.-]/g, "")).toFixed(n) + "";
        var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
        let t = "";
        for (let i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? "," : "");
        }
        let result = t.split("").reverse().join("") + "." + r;
        result = result.replace("-,", "-");
        if (result.substring(result.length-4, result.length) === ".000"){
            return result.substring(0, result.length - 4);
        }
        // console.log(result);
        return result;
    }

    showExecution = (orderId) => {
        let params = {
            orderId: orderId
        };
        this.setState({
            modalVisible: true,
        });
        this.props.findExecution(params,(data)=>{
            this.setState({
                execution: data
            });
        });
    }

    handleCancel = () => {
        this.setState({
            modalVisible: false,
        });
    };

    render() {
        const columns = [
            { title: "OrderID", dataIndex: "id", align: "center", width: "14%" },
            { title: "Time", dataIndex: "time", key: "time" , align: "center",
                render: val => (moment(val).format("HH:mm:ss MM/DD/YYYY")),
                width: "12%" },
            { title: "Code", dataIndex: "code", align: "center", width: "10%" },
            { title: "Side", dataIndex: "side", align: "center", width: "5%" },
            { title: "Type", dataIndex: "type", align: "center", width: "5%" },
            { title: "Price", dataIndex: "price", align: "center", width: "5%" },
            { title: "Quantity", dataIndex: "quantity", align: "center", width: "6%", render: text=>{return text && this.fmoney(text, 3);}},
            { title: "FillQty", dataIndex: "filledQuantity", align: "center", width: "6%", render: text=>{return text && this.fmoney(text, 3);}},
            { title: "AvgPrice", dataIndex: "avgPrice", align: "center", width: "6%",
                render: val => {
                    const tick = String(val).split(".");
                    if (tick[1] && tick[1].length > 5) {
                        return tick[0] + "." + tick[1].substring(0, 5) + "...";
                    }
                    return val;
                }
            },
            { title: "Purpose", dataIndex: "tradeType", align: "center", width: "5%" },
            { title: "Channel", dataIndex: "tradingType", align: "center", width: "5%" },
            { title: "Counter Party", dataIndex: "counterparty", align: "center", width: "7%" },
            { title: "Trader", dataIndex: "createdBy", align: "center", width: "5%" },
            { title: "Status", dataIndex: "status", align: "center",  },
        ];
        const executionColumns = [
            {
                title: "OrderId",
                dataIndex: "orderId",
                key: "orderId",
                width: 200
            },
            {
                title: "MarketOrderId",
                dataIndex: "marketOrderId",
                key: "marketOrderId",
                width: 200
            },
            {
                title: "Time",
                dataIndex: "time",
                key: "time",
                width: 150,
                render: val => (moment(val).format("YYYY/MM/DD HH:mm:ss")),
            },
            {
                title: "Code",
                dataIndex: "code",
                key: "code",
                width: 150,
            },
            {
                title: "Side",
                dataIndex: "side",
                key: "side",
                width: 50,
            },
            {
                title: "Type",
                dataIndex: "type",
                key: "type",
                width: 50,
            },
            {
                title: "Price",
                dataIndex: "price",
                key: "price",
                width: 100,
            },
            {
                title: "Quantity",
                dataIndex: "quantity",
                key: "quantity",
                width: 100,
            },
            {
                title: "Counterparty",
                dataIndex: "counterparty",
                key: "counterparty",
                width: 100,
            },
            {
                title: "Status",
                dataIndex: "status",
                key: "status",
                width: 100,
            },
            {
                title: "StatusMessage",
                dataIndex: "statusMessage",
                key: "statusMessage",
                render: (text,record)=>{
                    return (<Tooltip placement="rightTop" title={record.statusMessage}>
                        <div style={{width:80,overflow:"hidden",textOverflow:"ellipsis",whiteSpace: "nowrap"}}>{text}</div>
                    </Tooltip>);
                }
            },
            {
                title: "CreatedBy",
                dataIndex: "createdBy",
                key: "createdBy",
                width: 100,
            },
        ];
        
        return (
            <div className="tradeOrderBox cardTableFullHeight" style={{minHeight: this.props.tableHeight}}>
                <Table
                    id="tradeOrder"
                    // title={()=>(
                    //     <div>
                    //         <label>Trade Blotter</label>
                    //         <a style={{float: "right", marginRight: 10}} onClick={()=>{this.props.findRealtimeOrder(this.state.queryParams);}}>
                    //             <Icon type="sync" style={{fontSize: 20}}/>
                    //         </a>
                    //     </div>
                    // )}
                    size="small"
                    rowKey={(record,key)=>key}
                    scroll={{x: 1300, y: this.props.tableHeight - 130 + 38 + 57 + 6}}
                    // bordered={true}
                    columns={columns}
                    loading={this.props.loading}
                    dataSource={this.state.orderList}
                    pagination={this.state.pagination}
                    onChange={this.handleTableChange}
                    onRow={(record, index) => {
                        return {
                            onDoubleClick: (event) => {
                                this.showExecution(record.id);
                            }
                        };
                    }}
                />
                <Modal
                    className="executionModel"
                    width="600px"
                    title="Execution List"
                    visible={this.state.modalVisible}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <Table bordered className="executionList" bodyStyle={{height: 500, background:"#2B2B2B"}} pagination={false} scroll={{x:1400,y:500}} dataSource={this.state.execution} columns={executionColumns} />
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    loading: state.tradeBlotterReducer.loading,
    orderList: state.tradeBlotterReducer.orderList,
    totalRecords: state.tradeBlotterReducer.totalRecords,
});

const mapDispatchToProps = dispatch => ({
    findRealtimeOrder:(params)=>dispatch(findRealtimeOrder(params)),
    checkLogin:(cb) =>dispatch(checkLogin(cb)),
    updatePositionList: (positionList) => dispatch(updatePositionList(positionList)),
    setTradeBlotter: () => dispatch(setTradeBlotter()),
    setSocketConnected: (params) => dispatch(setSocketConnected(params)),
    findExecution: (params,cb) => dispatch(findExecution(params,cb)),
});
export default connect(mapStateToProps,mapDispatchToProps)(TradeOrderTable);