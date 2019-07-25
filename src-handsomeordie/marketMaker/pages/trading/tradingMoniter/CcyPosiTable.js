import {connect} from "react-redux";
import React, {Component} from "react";
import {  Select, Table, Form, Row, Col, Button } from "antd";
import { getPositionList, updatePositionList, updateMarketPrice, getCcyPosiList, updateCcyPosi } from "../../../actions/riskmonitor";
import WebSocketClient from "../../../socket/WebSocketClient";
import { riskMonitorWebSocket, marketPriceWebSocket,} from "../../../../common/marketApi";
import {checkLogin} from "../../../actions/marketDetail";
import {setSocketConnected, updateReferencePrice} from "../../../actions/globalAction";

class CcyPosiTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            ccyPosiList: []
        };
    }

    componentDidMount(){
        this.props.handleRef(this);
        this.props.getCcyPosiList({}, this.props.marketPrice);
        this.props.checkLogin((data) => {
            if (data) {
                if (!window.conn) {
                    window.conn = true;
                    WebSocketClient.connect({onError: this.onError, onOpen: this.onOpen, onReconnect: this.onReconnect, });
                }
                // this.riskMonitorWsId = WebSocketClient.subscribeMessage({
                //     mtype: riskMonitorWebSocket,
                //     callback: function(message){
                //         message.longPosition = message.positionLong;
                //         message.shortPosition = message.positionShort;
                //         let positionList = [..._this.props.positionList];
                
                //         const marketPrice = _this.props.marketPrice;
                
                //         if (marketPrice[message.crncy + "USD"]){
                //             const rate = message.position > 0 ? marketPrice[message.crncy + "USD"].bid : marketPrice[message.crncy + "USD"].ask;
                //             message.marketValue = message.position * rate;
                //             message.pnl = message.marketValue - message.cost;
                //         }else if (marketPrice["USD" + message.crncy]) {
                //             const rate = message.position > 0 ? marketPrice["USD" + message.crncy].bid : marketPrice["USD" + message.crncy].ask;
                //             message.marketValue = message.position / rate;
                //             message.pnl = message.marketValue - message.cost;
                //         }else if (message.crncy === "USD") {
                //             message.marketValue = message.position * 1;
                //             message.pnl = message.marketValue - message.cost;
                //         }
                
                //         const index = positionList.findIndex(item => item.crncy === message.crncy && item.tenor === message.tenor);
                //         if (index === -1){
                //             positionList.push(message);
                //         }else {
                //             positionList.splice(index, 1, message);
                //         }
                //         _this.props.updatePositionList(positionList);
                //     },
                //     scope: this
                // });
                this.marketPriceId = WebSocketClient.subscribeMessage({
                    mtype: marketPriceWebSocket,
                    callback: (message)=>{
                        let ccyPosiList = this.props.ccyPosiList;
                        let marketPrice = this.props.marketPrice;
                        let symbol = message.symbol;
                        let bid = marketPrice && marketPrice[symbol] && marketPrice[symbol].bid;
                        let ask = marketPrice && marketPrice[symbol] && marketPrice[symbol].ask;
                        for(let i in ccyPosiList){
                            if(ccyPosiList[i].code.split("@")[0] === symbol){
                                if(ccyPosiList[i].longPrice){
                                    ccyPosiList[i].pnlShow = (bid - ccyPosiList[i].longPrice) * ccyPosiList[i].position;
                                    // console.log((bid - ccyPosiList[i].longPrice,1)*ccyPosiList[i].position);
                                } else {
                                    ccyPosiList[i].pnlShow = (ask - ccyPosiList[i].shortPrice) * ccyPosiList[i].position;
                                    // console.log(ask - ccyPosiList[i].shortPrice,2);
                                }
                            }
                        }
                        // console.log(this.state.ccyPosiList);
                        if(JSON.stringify(this.state.ccyPosiList) !== JSON.stringify(ccyPosiList)){
                            this.props.updateCcyPosi(message, this.props.marketPrice, ccyPosiList,()=>{
                            // console.log(message,this.props.marketPrice,this.props.ccyPosiList);
                                this.setState({
                                    ccyPosiList: ccyPosiList
                                });
                            });
                        }
                    },
                    params:{key: "15235168"},
                    scope: this
                });
            }
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

    refreshTable = () => {
        this.props.getCcyPosiList({}, this.props.marketPrice);
    };
    componentWillUnmount(){
        // WebSocketClient.unsubscribeMessage({ subscriptionId: this.riskMonitorWsId, mtype: riskMonitorWebSocket });
        WebSocketClient.unsubscribeMessage({ subscriptionId: this.marketPriceId, mtype: marketPriceWebSocket });
    }

    onTenorChange = (key, value) => {
        const formValue = this.props.form.getFieldsValue();
        formValue[key] = value;
        this.props.getCcyPosiList(formValue, this.props.marketPrice);
    };

    onResetClick = () => {
        this.props.form.resetFields();
        this.props.getCcyPosiList({}, this.props.marketPrice);
    };

    fmoney =(s, n) =>{
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
        return (
            <div style={{height: this.props.tableHeight}}>
                <Table
                    rowKey={(record)=>record.id}
                    className="ant-tr-hover"
                    loading={this.props.ccyPosiLoading}
                    scroll={{y: this.props.tableHeight + 21}}
                    columns={[
                        {title: "Symbol", dataIndex: "code", width: 100, align: "center", render: (text)=>{
                            let result = text.split("@");
                            return result[0];
                        }},
                        {title: "Counterparty", dataIndex: "counterparty", width: 150, align: "center"},
                        {title: "Position", dataIndex: "position", width: 200, align: "center", render: (text)=>{
                            return <div style={{color: text < 0 ? "red" : text > 0 ? "#00ff00" : "white"}}>{text && !isNaN(text)?this.fmoney(text, 3):""}</div>;
                        }},
                        {title: "Average Price", dataIndex: "longPrice", width: 100, align: "center",render: (text, record)=>{
                            return text!==0?text.toFixed(4):record.shortPrice.toFixed(4);
                        }},
                        {title: "pnl", dataIndex: "pnlShow", align: "center", render: (text)=>{
                            return <div style={{color: text < 0 ? "red" : text > 0 ? "#00ff00" : "white"}}>{text && !isNaN(text)?this.fmoney(text, 3):""}</div>;
                        }},
                    ]}
                    dataSource={this.state.ccyPosiList}
                    size="small"
                    pagination={false}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    marketPrice: state.globalReducer.marketPrice,
    ccyPosiList: state.riskMonitorReducer.ccyPosiList,
    ccyPosiLoading: state.riskMonitorReducer.ccyPosiLoading,
});

const mapDispatchToProps = dispatch => ({
    checkLogin:(cb) =>dispatch(checkLogin(cb)),
    getCcyPosiList: (params, marketPrice) => dispatch(getCcyPosiList(params, marketPrice)),
    // updatePositionList: (positionList) => dispatch(updatePositionList(positionList)),
    updateCcyPosi: (message, marketPrice, positionList, cb) => dispatch(updateCcyPosi(message, marketPrice, positionList, cb)),
    setSocketConnected: (params) => dispatch(setSocketConnected(params)),
});
export default Form.create()(connect(mapStateToProps,mapDispatchToProps)(CcyPosiTable));
