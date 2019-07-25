import {connect} from "react-redux";
import React, {Component} from "react";
import {Select, Table, Form, Row, Col, Button, Input, message, Modal, InputNumber,} from "antd";
import { sendQuote, getQuoteSource, setManualQuoteList } from "../../../actions/manualQuote";
import "../../../../common/styles/marketPages/clientFlow.scss";
import {getNetPositions, handlePlaceOrder} from "../../../actions/manualTrading";
import moment from "./PlaceOrder";

const Option = Select.Option;

class ExpandLayerInfo extends Component {
    state = {
        spreadValue: 0,
        skewValue: 0,
        sourceValue: undefined,

        askPxs: [],
        bidPxs: [],
        askQties: [],
        bidQties: [],
        bidProviders: [],
        askProviders: [],

        quoteSource: [],

        acceptedMsg: false,
        visible: false,
        counterParty: undefined,

        qty: 0,
        maxQty: 0,
        side: undefined,
        price: 0,
    };

    componentWillMount(){
    }

    showBidAsk = () => {
    };

    componentDidMount(){
        // console.log(this.props.record.marketPrice);
        this.showSocketInfo(this.props);
    }

    componentWillReceiveProps (nextProps) {
        this.showSocketInfo(nextProps);
    }

    showSocketInfo = (props) => {
        // console.log(props.record.marketPrice);
        const marketPrice = props.record.marketPrice || {};
        const quoteOutput = props.record.quoteOutput || {};
        const referencePrice = props.record.referencePrice || {};
        const record = this.props.record;
        // let quoteCondi = false;
        // let marketCondi = false;
        // const symbol = record.symbol.replace(/\//, "");
        // let type = record.type;
        // if (record.type === "ESP SWEEP" || record.type === "ESP FULL"){
        //     type = "ESP";
        // }
        // if (record.type === "ODM" || record.type === "ESP SWEEP"){
        //     quoteCondi = symbol === quoteOutput.symbol && type === quoteOutput.tradingType && record.source === quoteOutput.source;
        //     marketCondi = symbol === marketPrice.symbol && type === marketPrice.tradingType && record.source === marketPrice.dataSource;
        // }else {
        //     quoteCondi = symbol === quoteOutput.symbol && type === quoteOutput.tradingType && record.source === quoteOutput.source && record.counterparty === quoteOutput.counterparty;
        //     marketCondi = symbol === marketPrice.symbol && record.source === marketPrice.dataSource && type === marketPrice.tradingType && record.counterparty === quoteOutput.counterparty;
        // }
        if (quoteOutput.symbol){
            this.setState({
                askPxs: quoteOutput.askPxs,
                bidPxs: quoteOutput.bidPxs,
                askQties: quoteOutput.askQties,
                bidQties: quoteOutput.bidQties,
            });
        }
        if (marketPrice.symbol){
            this.setState({
                askPxs: marketPrice.askPxs,
                bidPxs: marketPrice.bidPxs,
                askQties: marketPrice.askQties,
                bidQties: marketPrice.bidQties,
            });
            if (record.type === "ESP FULL" && record.counterparty === "ALL"){
                this.setState({
                    bidProviders: marketPrice.bidProviders,
                    askProviders: marketPrice.askProviders,
                });
            }
        }
        if (referencePrice.symbol){
            this.setState({
                askPxs: referencePrice.askPxs,
                bidPxs: referencePrice.bidPxs,
                askQties: referencePrice.askQties,
                bidQties: referencePrice.bidQties,
            });
        }

    };

    getFormatQtie = (num) => {
        if (typeof num !== "undefined"){
            if (num >= 1000000) {
                return this.fmoney(num/1000000, 2) + "M";
            }
            if (num < 1000000 && num >= 1000){
                return this.fmoney(num/1000, 2) + "K";
            }
            return num;
        }
    };

    cptyClick = (maxQty, counterParty, side, price) => {
        console.log(maxQty);
        console.log(counterParty);
        this.setState({maxQty, counterParty, side, price, visible: true}, ()=>{
            this.props.getNetPositions({code: this.props.record.symbol + "@" + this.props.record.source}, (result)=>{
                this.props.form.setFieldsValue({netPosition: this.formatNetPosition(result.data, 0)});
            });
        });
    };

    formatNetPosition =(s, n) =>{
        // console.log("s:", s);
        n = n > 0 && n <= 20 ? n : 0;
        s = parseFloat((s + "").replace(/[^\d\\.-]/g, "")).toFixed(n) + "";
        var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
        let t = "";
        for (let i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? "," : "");
        }
        let result = "";
        if (n === 0){
            result = t.split("").reverse().join("");
        }else{
            result = t.split("").reverse().join("") + "." + r;
        }
        result = result.replace("-,", "-");
        if (result.substring(result.length-4, result.length) === ".000"){
            return result.substring(0, result.length - 4);
        }
        // console.log(result);
        return result;
    }

    fmoney =(s, n) =>{
        const result = s.toFixed(n);
        if (result.substring(result.length-3, result.length) === ".00"){
            return result.substring(0, result.length - 3);
        }
        return result;
    }

    qtyChange = (value) => {
        // const maxQty = this.state.maxQty;
        // if (value > maxQty){
        //     value = maxQty;
        // }
        // this.props.form.setFieldsValue({quantity: value});
    };

    onPlaceOrder = () => {
        let counterParty = this.state.counterParty;
        const record = this.props.record;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log("Received values of form: ", values);
                values.tradingType = record.type;
                if (record.type.indexOf("ESP") !== -1){
                    values.tradingType = "ESP";
                }
                console.log("this.state.counterparty:", counterParty);
                values.counterparty = counterParty;
                values.venue = record.source;
                values.symbol = record.symbol.replace(/\//, "");
                values.code = values.symbol + "@" + record.venue;
                values.price = this.state.price;
                values.side = this.state.side;
                values.type = "LIMIT";
                // values.quantity = this.state.qty;
                values.tradeType = "HEDGE";
                this.props.handlePlaceOrder(values, (result) => {
                    if (result.success) {
                        this.play();
                        message.success("Order Submitted!", 2);
                        this.setState({visible: false});
                    } else {
                        message.error("Failed!", 2);
                    }
                });
            }
        });
    };
    play = () => {
        document.getElementById("ddsound").play();
        setTimeout(function () {
            document.getElementById("ddsound") && document.getElementById("ddsound").pause();
        }, 8000);
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 8 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 14 },
                sm: { span: 14 },
            },
        };
        return (
            <div>
                <div style={{height: 200, display: "flex", justifyContent: "center"}}>
                    <div style={{display: "flex"}}>
                        <div style={{marginTop: 27, display: "flex", justifyContent: "flex-start", alignItems: "flex-end", flexDirection: "column", marginRight: 10}}>
                            {
                                this.state.bidProviders.map((item, index) => {
                                    return (
                                        <div onClick={()=>{this.cptyClick(this.state.bidQties[index], item, "SELL", this.state.bidPxs[index]);}} className={"counter-party-hover"} key={index} style={{height: 25, color: "#2BB48F",  display: "flex", alignItems: "center"}}><div style={{border: "1px solid #797979", background: "#000", color: "#CF9300", width: 50, textAlign: "center"}}>{item}</div></div>
                                    );
                                })
                            }
                        </div>
                        <div style={{display: "flex", justifyContent: "flex-start", alignItems: "flex-end", flexDirection: "column", marginRight: 10}}>
                            {
                                this.state.bidPxs.length > 0 && <div key={-1} style={{fontSize: 18, color: "#2BB48F", fontWeight: "bold"}}>{this.state.bidPxs[0]}</div>
                            }
                            {
                                this.state.bidPxs.map((item, index) => {
                                    // if (index === 0) {
                                    //     return (
                                    //         <div key={index} style={{fontSize: 18, color: "#2BB48F"}}>{item}</div>
                                    //     );
                                    // } else {
                                    return (
                                        <div key={index} style={{height: 25, color: "#2BB48F", display: "flex", alignItems: "center"}}>{item}</div>
                                    );
                                    // }
                                })
                            }
                        </div>
                        <div style={{display: "flex", justifyContent: "flex-start", alignItems: "center", flexDirection: "column", marginRight: 10}}>
                            {
                                this.state.bidQties.length > 0 && <div key={-1} style={{fontSize: 18,}}>-</div>
                            }
                            {
                                this.state.bidQties.map((item, index) => {
                                    // if (index === 0) {
                                    //     return (
                                    //         <div key={index} style={{fontSize: 18}}>{item}</div>
                                    //     );
                                    // } else {
                                    return (
                                        <div key={index} style={{height: 25, display: "flex", alignItems: "center"}}>{this.getFormatQtie(item)}</div>
                                    );
                                    // }
                                })
                            }
                        </div>
                        <div style={{display: "flex", justifyContent: "flex-start", alignItems: "center", flexDirection: "column", marginRight: 10}}>
                            {
                                this.state.askQties.length > 0 && <div key={-1} style={{fontSize: 18,}}>-</div>
                            }
                            {
                                this.state.askQties.map((item, index) => {
                                    // if (index === 0) {
                                    //     return (
                                    //         <div key={index} style={{fontSize: 18}}>{this.getFormatQtie(item)}</div>
                                    //     );
                                    // } else {
                                    return (
                                        <div key={index} style={{height: 25, display: "flex", alignItems: "center"}}>{this.getFormatQtie(item)}</div>
                                    );
                                    // }
                                })
                            }
                        </div>
                        <div style={{display: "flex", justifyContent: "flex-start", alignItems: "flex-start", flexDirection: "column", marginRight: 10}}>
                            {
                                this.state.askPxs.length > 0 && <div key={-1} style={{fontSize: 18, color: "#DD4B51", fontWeight: "bold"}}>{this.state.askPxs[0]}</div>
                            }
                            {
                                this.state.askPxs.map((item, index) => {
                                    // if (index === 0) {
                                    //     return (
                                    //         <div key={index} style={{fontSize: 18, color: "#DD4B51"}}>{this.getFormatQtie(item)}</div>
                                    //     );
                                    // } else {
                                    return (
                                        <div key={index} style={{height: 25, color: "#DD4B51", display: "flex", alignItems: "center"}}><div>{this.getFormatQtie(item)}</div></div>
                                    );
                                    // }
                                })
                            }
                        </div>
                        <div style={{marginTop: 27, display: "flex", justifyContent: "flex-start", alignItems: "flex-end", flexDirection: "column", marginRight: 10}}>
                            {
                                this.state.askProviders.map((item, index) => {
                                    return (
                                        <div onClick={()=>{this.cptyClick(this.state.askQties[index], item, "BUY", this.state.askPxs[index]);}} className={"counter-party-hover"} key={index} style={{height: 25, color: "#2BB48F",  display: "flex", alignItems: "center"}}><div style={{border: "1px solid #797979", background: "#000", color: "#CF9300", width: 50, textAlign: "center"}}>{item}</div></div>
                                    );
                                })
                            }
                        </div>
                    </div>
                    <audio id='ddsound' src={require("../../../../marketMaker/images/placeOrder.wav")}/>
                </div>

                <Modal
                    id="liquidity-modal"
                    visible={this.state.visible}
                    title="Order Entry"
                    bodyStyle={{background: "#151516"}}
                    onOk={()=>{
                        this.onPlaceOrder();
                        // this.setState({visible: false});
                    }}
                    width={500}
                    onCancel={()=>{
                        this.setState({visible: false});
                    }}
                    className="darkTheme liquidity-modal"
                    closable={false}
                    destroyOnClose={true}
                    okButtonProps={{style: {background: "#2D81E5"}}}
                    okText={"Place Order"}
                >
                    <div id={"place-order"} style={{width:"100%",}}>
                        <Form>
                            <Form.Item colon={false} style={{margin:0}} {...formItemLayout} label="Qty">
                                {getFieldDecorator("quantity", {
                                    // rules: [{ message: "Please input your Qty!", required: true  }],
                                })(
                                    <InputNumber min={0} max={this.state.maxQty} style={{width: 100}} onChange={(value)=>{this.qtyChange(value);}} size="small"/>
                                )}
                            </Form.Item>
                            <Form.Item colon={false} style={{margin:0}} {...formItemLayout} label="Net Position">
                                {getFieldDecorator("netPosition", {
                                    // rules: [{ message: "Please input your Side!", required: true  }],
                                })(
                                    <Input disabled={true} style={{width: 100}} size="small"/>
                                )}
                            </Form.Item>
                        </Form>
                    </div>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    quoteSource: state.manualQuoteReducer.quoteSource,
    // quoteOutput: state.manualQuoteReducer.quoteOutput,
    manualQuoteList: state.manualQuoteReducer.manualQuoteList,
});

const mapDispatchToProps = dispatch => ({
    getQuoteSource:(params, cb) => dispatch(getQuoteSource(params, cb)),
    sendQuote:(params, cb) => dispatch(sendQuote(params, cb)),
    setManualQuoteList:(list, cb) => dispatch(setManualQuoteList(list, cb)),
    getNetPositions: (params, cb)=>dispatch(getNetPositions(params, cb)),
    handlePlaceOrder: (params, cb)=>dispatch(handlePlaceOrder(params, cb)),
});
export default Form.create()(connect(mapStateToProps,mapDispatchToProps)(ExpandLayerInfo));
