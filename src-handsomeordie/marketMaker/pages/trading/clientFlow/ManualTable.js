import {connect} from "react-redux";
import React, {Component} from "react";
import {Select, Table, Form, Row, Col, Button, message, Icon} from "antd";
import { getManualQuoteList, getQuoteSource, sendQuote, saveQuoteOutput, onApprove, onReject } from "../../../actions/manualQuote";
import WebSocketClient from "../../../socket/WebSocketClient";
import {orderbookWebSocket, quoteRequestOutput} from "../../../../common/marketApi";
import {checkLogin} from "../../../actions/marketDetail";
import ManualQuoteInfo from "./ManualQuoteInfo";
import "../../../../common/styles/marketPages/clientFlow.scss";
import moment from "moment";
import {setSocketConnected} from "../../../actions/globalAction";


const Option = Select.Option;
const ButtonGroup = Button.Group;

class ManualTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            expandedRows: [],
            acceptedMsg: false,
            manualQuoteList: []
        };
    }

    componentDidMount(){
        this.props.handleRef(this);
        // this.props.getManualQuoteList();
        const {tab} = this.props;
        this.props.checkLogin((data) => {
            if (data) {
                if (!window.conn) {
                    window.conn = true;
                    WebSocketClient.connect({onError: this.onError, onOpen: this.onOpen, onReconnect: this.onReconnect, });
                }
                this.manualQuoteId = WebSocketClient.subscribeMessage({
                    mtype: orderbookWebSocket,
                    callback: (message)=>{
                        this.props.saveQuoteOutput(message);
                    },
                    // params:{instanceId:this.props.strategyParam},
                    scope: this
                });

                this.clientFlowSocket = WebSocketClient.subscribeMessage({
                    mtype: quoteRequestOutput,
                    callback: (message)=>{
                        this.state.manualQuoteList.unshift(message);
                        // this.props.getCurrent
                        this.setState({
                            manualQuoteList: this.state.manualQuoteList
                        },()=>{
                            // console.log(_this.state.list);
                        });
                    },
                    params: {
                        statusIn: tab==="pending"?["RFQ", "LASTLOOK"]:tab==="quotes"?["QUOTED"]:tab==="confirmed"?["ACCEPTED", "REJECTED"]:[],
                        direction: 2
                    },
                    scope: this
                });
            }
        });
    }

    componentWillReceiveProps (nextProps) {
        if(nextProps.tab!==this.props.tab){
            this.clientFlowSocket = WebSocketClient.subscribeMessage({
                mtype: quoteRequestOutput,
                callback: (message)=>{

                    if(JSON.stringify(message) !== JSON.stringify(this.state.manualQuoteList[0])){
                        this.state.manualQuoteList.unshift(message);
                        // this.props.getCurrent
                        this.setState({
                            manualQuoteList: this.state.manualQuoteList
                        },()=>{
                            // console.log(_this.state.list);
                        });
                    }
                },
                params: {
                    statusIn: nextProps.tab==="pending"?["RFQ", "LASTLOOK"]:nextProps.tab==="quotes"?["QUOTED"]:nextProps.tab==="confirmed"?["ACCEPTED", "REJECTED"]:[],
                    direction: 2
                },
                scope: this
            });
        }
        this.setState({
            manualQuoteList: this.props.manualQuoteList
        });
    }

    onError = () => {
        this.props.setSocketConnected(3);
    };

    onOpen = () => {
        this.props.setSocketConnected(1);
    };

    onReconnect = () => {
        this.props.setSocketConnected(2);
    };
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return;
        };
        WebSocketClient.unsubscribeMessage({ subscriptionId: this.manualQuoteId, mtype: orderbookWebSocket });
    }

    sendQuote = (record) => {
        const { spreadValue, skewValue } = this.state;

        if(this.props.quoteMessage){
            let bid = this.props.quoteMessage.bidPxs;
            let ask = this.props.quoteMessage.askPxs;
            let askPxs = [], bidPxs = [];
            bid.map((elem, i)=>{
                let mid = (ask[i]+bid[i])/2;
                let bid_item = (mid-spreadValue/2)+skewValue,
                    ask_item = (mid+spreadValue/2)+skewValue;
                askPxs.push(ask_item);
                bidPxs.push(bid_item);
            });
            let params = {
                askPxs: askPxs,
                bidPxs: bidPxs,
                generateBy: record.id
            };
            this.props.sendQuote(params, (response)=>{
                console.log("response: ", response);
            });
        }else{
            message.error("请先设置...");
        }

    };

    onQuoteClick = (e, record) => {
        e.stopPropagation();
        const {tab} = this.props;
        this.quoteInfo.sendQuote(()=> {
            this.props.getManualQuoteList({
                params: {
                    statusIn: tab==="pending"?["RFQ", "LASTLOOK"]:tab==="quotes"?["QUOTED"]:tab==="confirmed"?["ACCEPTED", "REJECTED"]:[],
                    direction: 2
                }
            });
            this.setState({expandedRows: []});
        });
    };
    onApproveClick = (e, record) => {
        e.stopPropagation();
        const {tab} = this.props;
        this.props.onApprove({requestId: record.requestId, orderId: record.orderId}, (response)=> {
            if (response.success){
                message.success("Success!", 2);
                this.props.getManualQuoteList({
                    params: {
                        statusIn: tab==="pending"?["RFQ", "LASTLOOK"]:tab==="quotes"?["QUOTED"]:tab==="confirmed"?["ACCEPTED", "REJECTED"]:[],
                        direction: 2
                    }
                });
            } else {
                message.error("Failed！", 2);
            }
        });
    };
    onRejectClick = (e, record) => {
        e.stopPropagation();
        const {tab} = this.props;
        this.props.onReject({requestId: record.requestId, orderId: record.orderId}, (response)=> {
            if (response.success){
                message.success("Success！", 2);
                this.props.getManualQuoteList({
                    params: {
                        statusIn: tab==="pending"?["RFQ", "LASTLOOK"]:tab==="quotes"?["QUOTED"]:tab==="confirmed"?["ACCEPTED", "REJECTED"]:[],
                        direction: 2
                    }
                });
            } else {
                message.error("Failed！", 2);
            }
        });
    };

    handleRef = (thiz) => {
        this.quoteInfo = thiz;
    };

    acceptMsg = () => {
        if (!this.state.acceptedMsg) {
            this.setState({acceptedMsg: true,});
        }
    }

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
    render() {
        // console.log(this.state.expandedRows);
        return (
            <div style={{height: this.props.tableHeight}}>
                <Table
                    rowKey={(record,key)=>key}
                    // title={()=>(
                    //     <div>
                    //         <label>Manual Quoting Rules</label>
                    //         <a style={{float: "right", marginRight: 10}} onClick={()=>{this.props.getManualQuoteList();}}>
                    //             <Icon type="sync" style={{fontSize: 20}}/>
                    //         </a>
                    //     </div>
                    // )}
                    // bordered={true}
                    size="small"
                    className="ant-tr-hover"
                    loading={this.props.loading}
                    scroll={{ y: this.props.tableHeight + 21}}
                    columns={[
                        {title: "RequestID", dataIndex: "requestId", width: "8%", align: "center"},
                        {title: "CCY Pair", dataIndex: "symbol", width: "8%", align: "center"},
                        {title: "Tenor", dataIndex: "tenor", width: "8%", align: "center"},
                        {title: "Client", dataIndex: "counterParty", width: "8%", align: "center"},
                        {title: "Status", dataIndex: "status", width: "8%", align: "center"},
                        {title: "Bid", dataIndex: "bid", width: "8%", align: "center", render: (text, record)=>{
                            return <div style={{color: "#00ff00"}}>{text}</div>;
                        }},
                        {title: "Offer", dataIndex: "ask", width: "8%", align: "center", render: (text, record)=>{
                            return <div style={{color: "red"}}>{text}</div>;
                        }},
                        {title: "Side", dataIndex: "side", width: "9%", align: "center"},
                        {title: "Price", dataIndex: "price", width: "8%", align: "center"},
                        {title: "Qty", dataIndex: "qty", width: "8%", align: "center",render: text=>{return text && this.fmoney(text, 3);}},
                        {title: "Time", dataIndex: "time", width: "8%", align: "center", render: (text) => (moment(text).format("HH:mm:ss")),},
                        {title: "Action", dataIndex: "action", align: "center", width: "11%", render: (text, record, index) => {
                            if (record.status.toUpperCase() === "RFQ"){
                                return (
                                    <Button disabled={!(this.state.expandedRows.indexOf(index) !== -1 && record.acceptedMsg)} onClick={(e)=>{this.onQuoteClick(e, record);}}
                                        style={{background: "#3B84B7", width: 58, fontSize: 12}} size="small">
                                        QUOTE
                                    </Button>
                                );
                            }else if (record.status.toUpperCase() === "LASTLOOK") {
                                return (
                                    <div style={{display: "flex",}}>
                                        <Button onClick={(e)=>{this.onApproveClick(e, record);}} size="small" style={{background: "#33A280", marginRight: 2}}>
                                            <Icon type="check" />
                                        </Button>
                                        <Button onClick={(e)=>{this.onRejectClick(e, record);}} size="small" style={{background: "#E13136",}}>
                                            <Icon type="close" />
                                        </Button>
                                    </div>
                                );
                            }
                        }},
                    ]}
                    expandedRowKeys={this.state.expandedRows}
                    onExpandedRowsChange={(expandedRows)=>{this.setState({expandedRows});}}
                    expandRowByClick={true}
                    expandedRowRender={record => record.status.toUpperCase() === "RFQ" ? <ManualQuoteInfo record={record} acceptMsg={this.acceptMsg} handleRef={this.handleRef}/> : false}
                    dataSource={this.state.manualQuoteList}
                    pagination={false}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    manualQuoteList: state.manualQuoteReducer.manualQuoteList,
    loading: state.manualQuoteReducer.loading,
});

const mapDispatchToProps = dispatch => ({
    checkLogin:(cb) => dispatch(checkLogin(cb)),
    getManualQuoteList:(params) => dispatch(getManualQuoteList(params)),
    getQuoteSource:() => dispatch(getQuoteSource()),
    sendQuote:() => dispatch(sendQuote()),

    saveQuoteOutput: (message) => dispatch(saveQuoteOutput(message)),
    onApprove:(params, cb) => dispatch(onApprove(params, cb)),
    onReject:(params, cb) => dispatch(onReject(params, cb)),
    setSocketConnected: (params) => dispatch(setSocketConnected(params)),
});
export default Form.create()(connect(mapStateToProps,mapDispatchToProps)(ManualTable));