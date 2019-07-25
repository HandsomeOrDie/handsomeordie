import {connect} from "react-redux";
import React, {Component} from "react";
import {  Select, Table, Form, Row, Col, Button } from "antd";
import { getPositionList, updatePositionList, updateMarketPrice } from "../../../actions/riskmonitor";
import WebSocketClient from "../../../socket/WebSocketClient";
import { riskMonitorWebSocket, marketPriceWebSocket, ReferencePriceOutput} from "../../../../common/marketApi";
import {checkLogin} from "../../../actions/marketDetail";
import {setSocketConnected, updateReferencePrice} from "../../../actions/globalAction";

const Option = Select.Option;
let time = 0;
let flag = true;
class PositionTable extends Component {

    componentDidMount(){
        this.props.handleRef(this);
        this.props.getPositionList({}, this.props.marketPrice);
        this.props.checkLogin((data) => {
            if (data) {
                let _this = this;
                if (!window.conn) {
                    window.conn = true;
                    WebSocketClient.connect({onError: this.onError, onOpen: this.onOpen, onReconnect: this.onReconnect, });
                }
                this.riskMonitorWsId = WebSocketClient.subscribeMessage({
                    mtype: riskMonitorWebSocket,
                    callback: function(message){
                        // const result = message.result;
                        message.longPosition = message.positionLong;
                        message.shortPosition = message.positionShort;
                        // console.log("this.props.positionList:", _this.props.positionList);
                        let positionList = [..._this.props.positionList];

                        const marketPrice = _this.props.marketPrice;

                        // const crtMktPrice = marketPrice[message.crncy + "USD"] || marketPrice["USD" + message.crncy];
                        if (marketPrice[message.crncy + "USD"]){
                            // console.log(cnypair);
                            const rate = message.position > 0 ? marketPrice[message.crncy + "USD"].bid : marketPrice[message.crncy + "USD"].ask;
                            message.marketValue = message.position * rate;
                            message.pnl = message.marketValue - message.cost;
                        }else if (marketPrice["USD" + message.crncy]) {
                            const rate = message.position > 0 ? marketPrice["USD" + message.crncy].bid : marketPrice["USD" + message.crncy].ask;
                            message.marketValue = message.position / rate;
                            message.pnl = message.marketValue - message.cost;
                        }else if (message.crncy === "USD") {
                            message.marketValue = message.position * 1;
                            message.pnl = message.marketValue - message.cost;
                        }

                        // const pnlList = String(message.pnl).split(".");
                        // const marketValueList = String(message.marketValue).split(".");
                        // if (pnlList[1] && pnlList[1].length > 5){
                        //     message.pnl = pnlList[0] + "." + pnlList[1].substring(0, 5) + "...";
                        // }
                        // if (marketValueList[1] && marketValueList[1].length > 5){
                        //     message.marketValue = marketValueList[0] + "." + marketValueList[1].substring(0, 5) + "...";
                        // }
                        const index = positionList.findIndex(item => item.crncy === message.crncy && item.tenor === message.tenor);
                        if (index === -1){
                            positionList.push(message);
                        }else {
                            positionList.splice(index, 1, message);
                        }
                        _this.props.updatePositionList(positionList);
                    },
                    // params:{instanceId:this.props.strategyParam},
                    scope: this
                });
                this.marketPriceId = WebSocketClient.subscribeMessage({
                    mtype: marketPriceWebSocket,
                    callback: function(message){
                        // console.log("111");
                        // if (flag) {
                        //     flag = false;
                        //     setTimeout(function () {
                        //         if (time === 60) {
                        //             flag = true;
                        //             return;
                        //         }
                        //         time = time + 30;
                        //         flag = true;
                        //     }, 5);
                        // }
                        // if (time === 60){
                        //     time = 0;
                        _this.props.updateMarketPrice(message, _this.props.marketPrice, _this.props.positionList);
                        // }
                    },
                    params:{key: "15235168"},
                    scope: this
                });
                // this.referencePriceId = WebSocketClient.subscribeMessage({
                //     mtype: ReferencePriceOutput,
                //     callback: function(message){
                //         _this.props.updateReferencePrice(message);
                //     },
                //     // params:{instanceId:this.props.strategyParam},
                //     scope: this
                // });
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
        this.props.getPositionList({}, this.props.marketPrice);
    };
    componentWillUnmount(){
        WebSocketClient.unsubscribeMessage({ subscriptionId: this.riskMonitorWsId, mtype: riskMonitorWebSocket });
        WebSocketClient.unsubscribeMessage({ subscriptionId: this.marketPriceId, mtype: marketPriceWebSocket });
        // WebSocketClient.unsubscribeMessage({ subscriptionId: this.referencePriceId, mtype: ReferencePriceOutput });
    }

    onTenorChange = (key, value) => {
        // this.props.getPositionList();
        const formValue = this.props.form.getFieldsValue();
        formValue[key] = value;
        // console.log(formValue);
        this.props.getPositionList(formValue, this.props.marketPrice);
    };

    onResetClick = () => {
        this.props.form.resetFields();
        this.props.getPositionList({}, this.props.marketPrice);
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

    render() {
        const { getFieldDecorator } = this.props.form;

        const Option = Select.Option;
        return (
            <div style={{height: this.props.tableHeight}}>
                <Table
                    rowKey={(record)=>record.id}
                    className="ant-tr-hover"
                    loading={this.props.loading}
                    // title={()=>(
                    //     <div>
                    //         <Form>
                    //             <Row>
                    //                 <Col span={8}>
                    //                     <Form.Item
                    //                         label="TENOR:"
                    //                         labelCol={{ span: 8 }}
                    //                         wrapperCol={{ span: 12 }}
                    //                         style={{marginBottom: 0}}
                    //                     >
                    //                         {getFieldDecorator("tenor", {
                    //                         })(
                    //                             <Select
                    //                                 size="small"
                    //                                 className="qit-select-bg"
                    //                                 // placeholder="请选择"
                    //                                 onChange={(value)=>{this.onTenorChange("tenor", value);}}
                    //                                 style={{width: "100%"}}
                    //                             >
                    //                                 <Option key="SPOT">SPOT</Option>
                    //                                 <Option key="FORWARD">FORWARD</Option>
                    //                             </Select>
                    //                         )}
                    //                     </Form.Item>
                    //                 </Col>
                    //                 <Col span={16}>
                    //                     <Button size="small" onClick={this.onResetClick} style={{float: "right", position: "relative", top: 7}}>RESET</Button>
                    //                 </Col>
                    //             </Row>
                    //         </Form>
                    //     </div>
                    // )}
                    // bordered={true}
                    scroll={{y: this.props.tableHeight + 21}}
                    columns={[
                        {title: "CCY", dataIndex: "crncy", width: "20%", align: "center"},
                        // {title: "TENOR", dataIndex: "tenor", width: "12%", align: "center"},
                        {title: "Delta", dataIndex: "position", width: "20%", align: "center", render: (text)=>{
                            return <div style={{color: text < 0 ? "red" : text > 0 ? "#00ff00" : "white"}}>{text && !isNaN(text)?this.fmoney(text, 3):""}</div>;
                        }},
                        {title: "Delta($)", dataIndex: "marketValue", width: "20%", align: "center", render: (text)=>{
                            return <div style={{color: text < 0 ? "red" : text > 0 ? "#00ff00" : "white"}}>{text && !isNaN(text)?this.fmoney(text, 3):""}</div>;
                        }},
                        // {title: "PnL", dataIndex: "pnl", width: "13%", align: "center"},
                        {title: "Long Limit", dataIndex: "longLimit", width: "20%", align: "center"},
                        {title: "Short Limit", dataIndex: "shortLimit", width: "20%", align: "center"},
                    ]}
                    dataSource={this.props.positionList}
                    size="small"
                    pagination={false}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    marketPrice: state.globalReducer.marketPrice,
    positionList: state.riskMonitorReducer.positionList,
    loading: state.riskMonitorReducer.loading,
});

const mapDispatchToProps = dispatch => ({
    checkLogin:(cb) =>dispatch(checkLogin(cb)),
    getPositionList: (params, marketPrice) => dispatch(getPositionList(params, marketPrice)),
    updatePositionList: (positionList) => dispatch(updatePositionList(positionList)),
    updateMarketPrice: (message, marketPrice, positionList) => dispatch(updateMarketPrice(message, marketPrice, positionList)),
    setSocketConnected: (params) => dispatch(setSocketConnected(params)),
    updateReferencePrice: (message) => dispatch(updateReferencePrice(message)),
});
export default Form.create()(connect(mapStateToProps,mapDispatchToProps)(PositionTable));