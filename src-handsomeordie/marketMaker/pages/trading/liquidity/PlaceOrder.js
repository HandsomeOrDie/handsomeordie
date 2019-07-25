import {connect} from "react-redux";
import React, {Component} from "react";
import { DatePicker, Button, Input, Form, Select, message, Row, Col, InputNumber } from "antd";
import {getVenues, getSymbols, getNetPositions, handlePlaceOrder} from "../../../actions/manualTrading";
import { onPlaceOrderRFQ } from "../../../actions/liquidity";
import "../../../../common/styles/marketPages/liquidity.scss";
import moment from "moment";
const Option = Select.Option;
class PlaceOrder extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            contentHeight: 0,

            venues: [],
            selectedVenues: undefined,

            symbols: [],
            code: undefined,


            netPosition: undefined,
            side: undefined,

            selectedSide: true,

            msgLen: 4,
            // askPxs: [6.5022, 6.5023, 6.5024, 6.5025, 6.5026, 6.5027, 6.5028, 6.5029, 6.503, 6.5031],
            // askQties: [34,40,12,120,136,95,180,666,770,632],
            // bidPxs: [6.5021,6.502,6.5019,6.5018,6.5017,6.5016,6.5015,6.5014,6.5013,6.5012],
            // bidQties: [24,8,195,444,419,182,926,4015,4597,4742],
            askPxs: [],
            askQties: [],
            bidPxs: [],
            bidQties: [],

            orderType: undefined,
            selectedM: false,
            selectedK: false,
            qty: 0,
            qtyFocus: false,
        };
    }

    componentDidMount() {
        this.props.handleRef(this);
        this.showSocketInfo(this.props);
        // this.props.getVenues({}, (result)=>{
        //     const venues = result.data.map(item => ({text: item.tradingSource, value: item.tradingSource}));
        //     this.setState({venues});
        // });

        this.props.getNetPositions({code: this.props.record.symbol + "@" + this.props.record.source}, (result)=>{
            // this.setState({netPosition: result.data,});
            this.props.form.setFieldsValue({netPosition: this.formatNetPosition(result.data, 0)});
        });
        window.onmousewheel = document.onmousewheel = this.wheel;
    }

    wheel = (event)=>{
        var delta = 0;
        if (!event) event = window.event;
        if (event.wheelDelta) {//IE、chrome浏览器使用的是wheelDelta，并且值为“正负120”
            delta = event.wheelDelta/120;
            if (window.opera) delta = -delta;//因为IE、chrome等向下滚动是负值，FF是正值，为了处理一致性，在此取反处理
        } else if (event.detail) {//FF浏览器使用的是detail,其值为“正负3”
            delta = -event.detail/3;
        }
        if (delta){
            if (this.state.qtyFocus){
                this.handle(delta);
            }
        }
    }

    //上下滚动时的具体处理函数
    handle = (delta) => {
        let qty = this.state.qty;
        if (delta < 0){//向下滚动
            if (qty > 0) qty --;
        }else{//向上滚动
            qty ++;
        }
        // console.log(qty);
        this.qtyChange(qty, true);
    }

    componentWillReceiveProps(nextProps){
        // if (JSON.stringify(this.props.marketPrice) !== JSON.stringify(nextProps.marketPrice) || JSON.stringify(this.props.quoteOutput) !== JSON.stringify(nextProps.quoteOutput)){
        this.showSocketInfo(nextProps);
        // }
    }

    showSocketInfo = (props) => {
        const marketPrice = props.record.marketPrice || {};
        const quoteOutput = props.record.quoteOutput || {};
        const referencePrice = props.record.referencePrice || {};
        // const record = this.props.record;
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
            if (this.props.clickAsk) {
                this.setPriceValue(quoteOutput.askPxs[0]);
            }else {
                this.setPriceValue(quoteOutput.bidPxs[0]);
            }
        }
        if (marketPrice.symbol){
            // console.log(marketPrice);
            this.setState({
                askPxs: marketPrice.askPxs,
                bidPxs: marketPrice.bidPxs,
                askQties: marketPrice.askQties,
                bidQties: marketPrice.bidQties,
            });
            if (this.props.clickAsk) {
                this.setPriceValue(marketPrice.askPxs[0]);
            }else {
                this.setPriceValue(marketPrice.bidPxs[0]);
            }
        }
        if (referencePrice.symbol){
            this.setState({
                askPxs: referencePrice.askPxs,
                bidPxs: referencePrice.bidPxs,
                askQties: referencePrice.askQties,
                bidQties: referencePrice.bidQties,
            });
            if (this.props.clickAsk) {
                this.setPriceValue(referencePrice.askPxs[0]);
            }else {
                this.setPriceValue(referencePrice.bidPxs[0]);
            }
        }
    };

    setPriceValue = (value) => {
        const price = this.props.form.getFieldValue("price");
        if (!price && this.state.orderType !== "MARKET" && this.state.orderType !== "ALGO"){
            // this.props.form.setFields({price: {value: value}});
            this.props.form.setFieldsValue({price: value});
        }else {
            // this.props.form.setFieldsValue({price: undefined});
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

    fmoney =(s, n) =>{
        const result = s.toFixed(n);
        if (result.substring(result.length-3, result.length) === ".00"){
            return result.substring(0, result.length - 3);
        }
        return result;
    }

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

    onPlaceOrder = (cb) => {
        const record = this.props.record;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log("Received values of form: ", values);
                values.tradingType = record.type;
                if (record.type.indexOf("ESP") !== -1){
                    values.tradingType = "ESP";
                }
                values.type = values.orderType;
                if (record.counterparty && record.counterparty !== "ALL"){
                    values.counterparty = record.counterparty;
                }
                values.symbol = values.symbol.replace(/\//, "");
                values.code = values.symbol + "@" + values.venue;
                values.quantity = this.state.qty;

                if (values.startTime){
                    values.startTime = moment(values.startTime).format("HH:mm:ss MM/DD/YYYY");
                }
                if (values.endTime){
                    values.endTime = moment(values.endTime).format("HH:mm:ss MM/DD/YYYY");
                }
                values.tradeType = "HEDGE";
                if (record.type === "RFQ" || record.type === "RFS"){
                    values.requestId = record.requestId;
                    this.props.onPlaceOrderRFQ(values, (result)=>{
                        cb(result);
                    });
                } else {
                    this.props.handlePlaceOrder(values, (result) => {
                        cb(result);
                    });
                }
            }
        });
    };

    qtyChange = (val, src) => {
        // console.log(val);
        // this.setState({qty: val, selectedM: false, selectedK: false});
        // console.log(typeof val);
        if (!src){
            this.setState({qty: val});
            return;
        }
        const { selectedM, selectedK } = this.state;
        if (!selectedM && !selectedK){
            this.setState({qty: val});
        }
        if (selectedM && !selectedK){
            // if (val < 1000) {
            //     this.setState({qty: val * 1000000});
            // }
            // if (val >= 1000) {
            if (val > this.state.qty){
                this.setState({qty: val + 1000000 - 1});
            }else {
                this.setState({qty: val - 1000000 + 1});
            }
            // }
        }
        if (!selectedM && selectedK){
            // if (val < 1000) {
            //     this.setState({qty: val * 1000});
            // }
            // if (val >= 1000) {
            if (val > this.state.qty){
                this.setState({qty: val + 1000 - 1});
            }else {
                this.setState({qty: val - 1000 + 1});
            }
            // }
        }
    };

    onVenuesChange = (value) => {
        this.setState({symbols: []});
        this.props.form.setFieldsValue({symbol: undefined});
        this.props.getSymbols({exchangeCode: value}, (result)=>{
            // const symbols = result.data.map(item => ({text: item.displayName, value: item.displayName}));
            this.setState({symbols: result.data});
        });
    };
    onSymbolsChange = (value) => {
        const symbols = this.state.symbols;
        const index = symbols.findIndex(item => item.displayName === value);
        this.setState({code: symbols[index].code});
        this.props.getNetPositions({code: symbols[index].code}, (result)=>{
            this.setState({netPosition: result.data, bidPxs: [], bidQties: [], askPxs: [], askQties: []});
        });
    };

    // fmoney =(s, n) =>{
    //     // console.log("s:", s);
    //     n = n > 0 && n <= 20 ? n : 0;
    //     s = parseFloat((s + "").replace(/[^\d\\.-]/g, "")).toFixed(n) + "";
    //     var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
    //     let t = "";
    //     for (let i = 0; i < l.length; i++) {
    //         t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? "," : "");
    //     }
    //     let result = "";
    //     if (n === 0){
    //         result = t.split("").reverse().join("");
    //     }else{
    //         result = t.split("").reverse().join("") + "." + r;
    //     }
    //     result = result.replace("-,", "-");
    //     if (result.substring(result.length-4, result.length) === ".000"){
    //         return result.substring(0, result.length - 4);
    //     }
    //     // console.log(result);
    //     return result;
    // }

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

        const formItemLayout2 = {
            labelCol: {
                xs: { span: 10 },
                sm: { span: 10
                },
            },
            wrapperCol: {
                xs: { span: 10 },
                sm: { span: 10 },
            },
        };

        const {askPxs, askQties, bidPxs, bidQties, orderType} = this.state;
        const record = this.props.record;
        // const username = sessionStorage.getItem("username");
        const userInfo = localStorage.getItem("userInfo");
        const username = userInfo && userInfo !== "undefined" && JSON.parse(userInfo).name;
        return (
            <div id="place-order" style={{display:"flex", flexDirection: "column"}}>
                <div style={{display: "flex"}}>
                    <div style={{flex: 3}}>
                        <Form id="place-order-form">
                            <Form.Item colon={false} style={{margin:0}} {...formItemLayout} label="Account Setting">
                                {getFieldDecorator("accountSetting", {
                                    initialValue: username,
                                    // rules: [{ message: "Please input your Account Setting!", required: true  }],
                                })(
                                    <Select
                                        className="qit-select-bg"
                                        // placeholder="请选择"
                                        style={{width: "100%"}}
                                        size="small"
                                        onChange={(value)=>{
                                        }}
                                    >
                                        <Option key={username} value={username}>{username}</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item colon={false} style={{margin:0}} {...formItemLayout} label="Symbol">
                                {getFieldDecorator("symbol", {
                                    // rules: [{ message: "Please input your Symbol!", required: true  }],
                                    initialValue: record.symbol,
                                })(
                                    <Select
                                        className="qit-select-bg"
                                        // placeholder="请选择"
                                        style={{width: "100%"}}
                                        size="small"
                                        onChange={(value)=>{this.onVenuesChange(value);}}
                                    >
                                        <Option key="1" value={record.symbol}>{record.symbol}</Option>
                                        {/*{*/}
                                        {/*this.state.venues.map(item => (<Option key={item.value} value={item.value}>{item.text}</Option>))*/}
                                        {/*}*/}
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item colon={false} style={{margin:0}} {...formItemLayout} label="Venue">
                                {getFieldDecorator("venue", {
                                    // rules: [{ message: "Please input your Venue!", required: true  }],
                                    initialValue: record.source,
                                })(
                                    <Select
                                        className="qit-select-bg"
                                        // placeholder="请选择"
                                        style={{width: "50%"}}
                                        size="small"
                                        onChange={(value)=>{
                                        }}
                                    >
                                        <Option key="1" value={record.source}>{record.source}</Option>
                                        {/*<Option key="FXALL" value="FXALL">FXALL</Option>*/}
                                        {/*<Option key="CFETS" value="CFETS">CFETS</Option>*/}
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item colon={false} style={{margin:0}} {...formItemLayout} label="Qty">
                                {getFieldDecorator("quantity", {
                                    // rules: [{ message: "Please input your Qty!", required: true  }],
                                })(
                                    <div id={"place-order-input"} style={{display: "flex", alignItems: "center", height: 39}}>
                                        <InputNumber  min={0} value={this.state.qty} onBlur={()=>{
                                            this.setState({qtyFocus: false});
                                        }} onFocus={()=>{
                                            this.setState({qtyFocus: true});
                                        }} onChange={(e)=>{this.qtyChange(e, false);}} style={{width: "50%"}} size="small"/>
                                        <div className="ajustBtn" onClick={()=>{
                                            if (!this.state.selectedM) {
                                                this.setState({selectedK: false});
                                            }
                                            if (this.state.qty >= 1000000){
                                                this.setState({selectedM: !this.state.selectedM});
                                            } else {
                                                this.setState({selectedM: false});
                                            }
                                            if (this.state.qty < 1000){
                                                this.setState({qty: 1000000 * this.state.qty});
                                            }
                                            if (this.state.qty >= 1000 && this.state.qty < 1000000){
                                                this.setState({qty: 1000000 + this.state.qty});
                                            }

                                            // this.setState({selectedM: !this.state.selectedM});
                                        }} style={{width: 30,  background: this.state.selectedM?"#2D81E5":"grey", textAlign: "center", border: "1px solid white" }}>
                                            <div style={{height: 20,display: "flex", justifyContent: "center", alignItems: "center"}}>M</div>
                                        </div>
                                        <div className="ajustBtn" onClick={()=>{
                                            if (!this.state.selectedK) {
                                                this.setState({selectedM: false, });
                                            }
                                            if (this.state.qty >= 1000){
                                                this.setState({selectedK: !this.state.selectedK});
                                            } else {
                                                this.setState({selectedK: false});
                                            }
                                            if (this.state.qty < 1000){
                                                this.setState({qty: 1000 * this.state.qty});
                                            }
                                            // this.setState({selectedK: !this.state.selectedK});
                                        }} style={{width: 30, background: this.state.selectedK?"#2D81E5":"grey", textAlign: "center", border: "1px solid white" }}>
                                            <div style={{height: 20,display: "flex", justifyContent: "center", alignItems: "center"}}>K</div>
                                        </div>
                                    </div>
                                )}
                            </Form.Item>
                            <Form.Item colon={false} style={{margin:0}} {...formItemLayout} label="Side">
                                {getFieldDecorator("side", {
                                    initialValue: this.props.clickAsk ? "BUY" : "SELL",
                                    // rules: [{ message: "Please input your Side!", required: true  }],
                                })(
                                    <Select
                                        className="qit-select-bg"
                                        // placeholder="请选择"
                                        style={{width: "50%"}}
                                        size="small"
                                        onChange={(value)=>{
                                        }}
                                    >
                                        <Option key="BUY" value="BUY">BUY</Option>
                                        <Option key="SELL" value="SELL">SELL</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item colon={false} style={{margin:0}} {...formItemLayout} label="Net Position">
                                {getFieldDecorator("netPosition", {
                                    // rules: [{ message: "Please input your Side!", required: true  }],
                                })(
                                    <Input disabled={true} style={{width: 114}} size="small"/>
                                )}
                            </Form.Item>
                        </Form>
                    </div>
                    <div style={{flex: 2, border: "2px solid black", padding: 5}}>
                        <div style={{display: "flex", fontWeight: "bold", justifyContent: "space-between", borderBottom: "2px solid black", padding: 2}}>
                            <div>{record.symbol}</div>
                            <div>ALLESP</div>
                            <div>VWAP</div>
                        </div>
                        <div style={{display: "flex", height: 30}}>
                            <div style={{flex: 1, background: "#00CC99", display: "flex", justifyContent: "center", alignItems: "center"}}><div>{bidPxs[0] || "-"}</div></div>
                            <div style={{flex: 1, background: "#EA4F53", display: "flex", justifyContent: "center", alignItems: "center"}}><div>{askPxs[0] || "-"}</div></div>
                        </div>
                        <div>
                            {
                                bidPxs.map((item, index) => {
                                    return (
                                        <div key={index} style={{display: "flex", height: 32,}}>
                                            <div style={{flex: 5, display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid #6A6A6A"}}>{item}</div>
                                            <div style={{flex: 4, display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid #6A6A6A"}}>{this.getFormatQtie(bidQties[index])}</div>
                                            <div style={{flex: 4, display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid #6A6A6A"}}>{this.getFormatQtie(askQties[index])}</div>
                                            <div style={{flex: 5, display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid #6A6A6A"}}>{askPxs[index]}</div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
                <div>
                    <div style={{display: "flex"}}>
                        <div>Parameters</div>
                        <div style={{flex: 1, marginLeft: 20, display: "flex", alignItems: "center"}}><div style={{flex: 1}}><hr/></div></div>
                    </div>
                    <div style={{display: "flex"}}>
                        <div style={{flex: 3}}>
                            <Form id="place-order-form">
                                <Form.Item colon={false} style={{margin:0}} {...formItemLayout2} label="Preset">
                                    {getFieldDecorator("preset", {
                                        // rules: [{ message: "Please input your Side!", required: true  }],
                                    })(
                                        <Select
                                            className="qit-select-bg"
                                            // placeholder="请选择"
                                            style={{width: 100, marginLeft: -10}}
                                            size="small"
                                            onChange={(value)=>{
                                            }}
                                        >
                                            {/*<Option key="LIMIT" value="LIMIT">LIMIT</Option>*/}
                                            {/*<Option key="MARKET" value="MARKET">MARKET</Option>*/}
                                        </Select>
                                    )}
                                </Form.Item>
                                {
                                    orderType === "ALGO" ?
                                        <Form.Item colon={false} style={{margin:0}} {...formItemLayout2} label="Start Time">
                                            {getFieldDecorator("startTime", {
                                                // rules: [{ message: "Please input your Start Time!", required: true  }],
                                            })(
                                                <DatePicker
                                                    // className="noboderpicker"
                                                    style={{border:0,width:150,marginLeft: -10}}
                                                    showTime
                                                    size="small"
                                                    format="YY/MM/DD HH:mm:ss"
                                                    placeholder="StartTime"
                                                />
                                            )}
                                        </Form.Item>:
                                        <Form.Item colon={false} style={{margin:0}} {...formItemLayout2} label="Price">
                                            {getFieldDecorator("price", {
                                                // rules: [{ message: "Please input your Price!", required: true  }],
                                            })(
                                                <Input disabled={orderType && orderType !== "LIMIT"} style={{width: 100,marginLeft: -10}} size="small"/>
                                            )}
                                        </Form.Item>
                                }
                                {
                                    orderType === "ALGO" ?
                                        <Form.Item colon={false} style={{margin:0}} {...formItemLayout2} label="No.Slice">
                                            {getFieldDecorator("slice", {
                                                // rules: [{ message: "Please input your No.Slice!", required: true  }],
                                            })(
                                                <Input style={{width: 100,marginLeft: -10}} size="small"/>
                                            )}
                                        </Form.Item>:null
                                }

                            </Form>
                        </div>
                        <div style={{flex: 3}}>
                            <Form id="place-order-form">
                                <Form.Item colon={false} style={{margin:0}} {...formItemLayout} label="Order Type">
                                    {getFieldDecorator("orderType", {
                                        initialValue: "LIMIT"
                                        // rules: [{ message: "Please input your Order Type!", required: true  }],
                                    })(
                                        <Select
                                            className="qit-select-bg"
                                            // placeholder="请选择"
                                            style={{width: 100}}
                                            size="small"
                                            onChange={(value)=>{
                                                this.setState({orderType: value});
                                                if (value !== "LIMIT"){
                                                    // this.props.form.setFields({price: {value: undefined}});
                                                    // this.props.form.resetFields(["price"]);
                                                    this.props.form.setFieldsValue({price: undefined});
                                                }
                                            }}
                                        >
                                            <Option key="LIMIT" value="LIMIT">LIMIT</Option>
                                            <Option key="MARKET" value="MARKET">MARKET</Option>
                                            <Option key="ALGO" value="ALGO">ALGO</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                                {
                                    orderType === "ALGO" ?
                                        <Form.Item colon={false} style={{margin:0}} {...formItemLayout} label="End Time">
                                            {getFieldDecorator("endTime", {
                                                // rules: [{ message: "Please input your Start End Time!", required: true  }],
                                            })(
                                                <DatePicker
                                                    // className="noboderpicker"
                                                    style={{border:0,width:150}}
                                                    showTime
                                                    size="small"
                                                    format="YY/MM/DD HH:mm:ss"
                                                    placeholder="EndTime"
                                                />
                                            )}
                                        </Form.Item>:
                                        <Form.Item colon={false} style={{margin:0}} {...formItemLayout} label="Time In Force">
                                            {getFieldDecorator("timeInForce", {
                                                // rules: [{ message: "Please input your Time In Force!", required: true  }],
                                            })(
                                                <Select
                                                    className="qit-select-bg"
                                                    // placeholder="请选择"
                                                    style={{width: 100}}
                                                    size="small"
                                                >
                                                    {
                                                        ["FOK", "GFD", "GFT", "GTC", "GTD", "IOC"].map(item => (<Option key={item} value={item}>{item}</Option>))
                                                    }
                                                </Select>
                                            )}
                                        </Form.Item>
                                }
                                {
                                    orderType === "ALGO" ?
                                        <Form.Item colon={false} style={{margin:0}} {...formItemLayout} label="Algo">
                                            {getFieldDecorator("algo", {
                                                // rules: [{ message: "Please input your Algo!", required: true  }],
                                            })(
                                                <Select
                                                    className="qit-select-bg"
                                                    // placeholder="请选择"
                                                    style={{width: 100}}
                                                    size="small"
                                                    onChange={(value)=>{
                                                    }}
                                                >
                                                    <Option key="TWAP" value="TWAP">TWAP</Option>
                                                    <Option key="VWAP" value="VWAP">VWAP</Option>
                                                </Select>
                                            )}
                                        </Form.Item>:null
                                }
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    // mktPriceMsg: state.globalReducer.mktPriceMsg,
    // minTicks: state.globalReducer.minTicks,
    // todayOrder: state.manualTradingReducer.findTodayOrderGet,
    showManualTrading: state.clientFlowReducer.showManualTrading,
    showRradeBlotter: state.clientFlowReducer.showRradeBlotter,
});

const mapDispatchToProps = dispatch => ({
    getVenues: (params, cb)=>dispatch(getVenues(params, cb)),
    getSymbols: (params, cb)=>dispatch(getSymbols(params, cb)),
    getNetPositions: (params, cb)=>dispatch(getNetPositions(params, cb)),
    handlePlaceOrder: (params, cb)=>dispatch(handlePlaceOrder(params, cb)),
    onPlaceOrderRFQ: (params, cb)=>dispatch(onPlaceOrderRFQ(params, cb)),
});
const PlaceOrderForm = Form.create()(PlaceOrder);
export default connect(mapStateToProps,mapDispatchToProps)(PlaceOrderForm);
