import {connect} from "react-redux";
import React, {Component} from "react";
import { message, Card, Row, Col, Table, Tabs, Form, Input, Icon, Button, Checkbox, Radio, Select, Collapse, InputNumber } from "antd";
// import {getSymbolList} from "../../../actions/symbolList";
import WebSocketClient from "../../../socket/WebSocketClient";
import {getMarketPriceConfigList} from "../../../actions/corePrice";
import { getCounterPartyList } from "../../../actions/counterParty";
import { manualTradingQuoteRequestPost } from "../../../actions/manualTrading";
import { findTodayQuoteRequestGet, saveManualRequestInfo } from "../../../actions/manualTrading";
import {orderbookWebSocket} from "../../../../common/marketApi";
import {checkLogin} from "../../../actions/marketDetail";
import FormPart from "./formPart";
import {setManualTrading} from "../../../actions/clientFlow";
import RequestTabList from "./requestTabList";

let myClear;
class RFQ extends Component {
    constructor(props){
        super(props);
        this.state = {
            symbolList: [],
            marketPriceConfigList: [],
            counterPartyList: [],
            counterPartyInfoList: [],
            manualQuoteRequestInfo: "",
            unit: "",
            qty: "",
            tenor: "",
            tenor1: "",
            tenor2: "",
            tenor3: "",
            loading: false,
            contentHeight: 0,
        };
    }

    componentDidMount() {
        this.props.getMarketPriceConfigList((data)=>{});
        this.props.getCounterPartyList();
        this.props.form.validateFields();
        this.props.checkLogin((data) => {
            if (data) {
                let that = this;
                // WebSocketClient.connect();
                this.manualQuoteId = WebSocketClient.subscribeMessage({
                    mtype: orderbookWebSocket,
                    callback: (message)=>{
                        that.props.saveManualRequestInfo(message);
                    },
                    // params:{instanceId:this.props.strategyParam},
                    scope: that
                });
            }
        });
        this.setTableHeight(this.props.showManualTrading, this.props.showRradeBlotter, this);
    }

    componentWillReceiveProps(nextProps){
        if(JSON.stringify(nextProps.marketPriceConfigList) !== JSON.stringify(this.state.marketPriceConfigList)){
            let symbolList = [];
            nextProps.marketPriceConfigList.forEach(item => {
                if (symbolList.indexOf(item.symbol) === -1) {
                    symbolList.push(item.symbol);
                }
            });
            this.setState({
                marketPriceConfigList: nextProps.marketPriceConfigList,
                symbolList: symbolList
            });
        }
        if(JSON.stringify(nextProps.counterPartyInfoList) !== JSON.stringify(this.state.counterPartyInfoList)){
            let counterPartyList = [];
            for(let i in nextProps.counterPartyInfoList){
                counterPartyList.push(nextProps.counterPartyInfoList[i].name);
            }
            // console.log(counterPartyList);
            this.setState({
                counterPartyInfoList: nextProps.counterPartyInfoList,
                counterPartyList: counterPartyList,
            });
        }
        
        if(JSON.stringify(nextProps.manualQuoteRequestInfo) !== JSON.stringify(this.state.manualQuoteRequestInfo)){
            this.setState({
                manualQuoteRequestInfo: nextProps.manualQuoteRequestInfo
            });
        }
        this.setTableHeight(nextProps.showManualTrading, nextProps.showRradeBlotter, this);
    }

    hasErrors = (fieldsError) => {
        return Object.keys(fieldsError).some(field => fieldsError[field]);
    }

    chengeTenor1 = (e) => {
        this.setState({
            tenor1: e
        });
    }

    chengeTenor2 = (e,i) => {
        // console.log(i);
        this.setState({
            tenor2: e,
            tenor2key: i.key
        });
    }

    chengeTenor3 = (e,i) => {
        this.setState({
            tenor3: e,
            tenor3key: i.key
        });
    }

    changeType = (e) => {
        this.setState({
            type: e.target.value,
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            this.setState({
                tenor: values.Type === "FORWARD"?this.state.tenor1:values.Type === "SWAP"?`${this.state.tenor2+"x"+this.state.tenor3}`:""
            },() => {
                // console.log(values,this.state.unit);
                if (!err) {
                    let param = {
                        action: "quoteRequest",
                        symbol: values.Symbol,
                        type: values.Type,
                        tenor: this.state.tenor,
                        requestType: values.RequestType,
                        side: values.Side,
                        qty: this.state.qty,
                        unit: this.state.unit,
                        status: "rfq",
                        source: "CFETS",
                        // counterParty: values.CounterParty,
                        counterParty: values.CounterParty[0]
                    };
                    this.setState({loading:true});
                    this.props.manualTradingQuoteRequestPost(param,(success)=>{
                        this.setState({loading:false},()=>{
                            if(success){
                                message.success("Success！");
                                // this.chengeUnit(1);
                                myClear = setTimeout(this.props.form.resetFields,2000);
                                this.props.findTodayQuoteRequestGet();
                            } else {
                                message.error("Failed！");
                            }
                        });
                    });
                } else {
                    console.log("表单出错啦");
                }
            });
        });
    }
    componentWillUnmount(){
        clearTimeout(myClear);
        this.props.setManualTrading(true);
    }

    chengeUnit = (e) => {
        this.setState({unit:e});
    }

    changeQty = (e) => {
        console.log(e);
        this.setState({qty:e});
    }

    selectQuote = (manualQuoteRequestInfo,key) => {
        // console.log(manualQuoteRequestInfo);
        let str = "";
        str = manualQuoteRequestInfo.bidPxs[key] + " " + manualQuoteRequestInfo.bidQties[key] + " " + manualQuoteRequestInfo.askQties[key] + " "+manualQuoteRequestInfo.askPxs[key];
        // console.log(str);
        this.setState({
            selectedQuote: str,
            selectedQuoteIndex: key
        });
        // console.log(manualQuoteRequestInfo,manualQuoteRequestInfo.bidQties[key],manualQuoteRequestInfo.askQties[key]);
    }

    setTableHeight = (showManualTrading, showRradeBlotter, thiz) => {
        if (showManualTrading){
            const browserHeight = document.documentElement.clientHeight;
            try {
                setTimeout(function () {
                    let contentHeight;
                    if (showRradeBlotter){
                        contentHeight = (browserHeight - 48 - 15 - 120)/2;
                    } else {
                        contentHeight = (browserHeight - 48 - 15 - 100);
                    }
                    thiz.setState({contentHeight});
                }, 300);
            }catch (e) {
                console.log(e);
            }
        }
    };


    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 7 },
                sm: { span: 7 },
            },
            wrapperCol: {
                xs: { span: 16 },
                sm: { span: 16 },
            },
        };

        const itemStyle = {
            margin: 0,
            fontSize: "12px"
        };

        const {manualQuoteRequestInfo, symbolList, counterPartyList, type, tenor1, tenor2, tenor3, tenor2key, tenor3key, unit, qty} = this.state;
        const {TabPane} = Tabs;
        const {Panel} = Collapse;
        const {Option} = Select;
        const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;

        // Only show error after a field is touched.
        const symbolError = isFieldTouched("Symbol") && getFieldError("Symbol");
        const typeError = isFieldTouched("Type") && getFieldError("Type");
        const requestTypeError = isFieldTouched("RequestType") && getFieldError("RequestType");
        const sideError = isFieldTouched("Side") && getFieldError("Side");
        const OrderQtyError = isFieldTouched("OrderQty") && getFieldError("OrderQty");
        const counterPartyError = isFieldTouched("CounterParty") && getFieldError("CounterParty");
        
        // console.log("this.state.tableHeight：", this.state.tableHeight);
        const cardBodyHeight = (document.documentElement.clientHeight - 50 - 15)/2 - 60;
        const cardStyle = this.props.showManualTrading ? {margin:"5px 5px 5px 0",display:"flex",flex:1} : {margin:"5px 5px 5px 0",display:"flex"};
        return (
            <div style={{overflow:"auto", height: this.props.contentHeight}}>
                <div style={{display:"flex",flex:3,}}>
                    <div style={{flex:7,fontSize:"12px"}}>
                        <Form layout="horizontal" onSubmit={this.handleSubmit}>

                            <Form.Item {...formItemLayout}
                                style={itemStyle}
                                label="Symbol"
                                validateStatus={symbolError ? "error" : "success"}
                                help={symbolError || ""}
                            >
                                {getFieldDecorator("Symbol", {
                                    rules: [{ required: true, message: "Please input the Symbol!" }],
                                })(
                                    <Select className="qit-select-bg" size="small" placeholder="Symbol">
                                        {
                                            symbolList.map(symbol => (
                                                <Option key={symbol} value={symbol}>{symbol}</Option>
                                            ))
                                        }
                                    </Select>
                                )}
                            </Form.Item>

                            <Form.Item {...formItemLayout}
                                style={itemStyle}
                                label="Type"
                                validateStatus={typeError ? "error" : "success"}
                                help={typeError || ""}
                            >
                                {getFieldDecorator("Type", {
                                    rules: [{ required: true, message: "Please check the Type!" }],
                                })(
                                    <Radio.Group style={{ width: "100%" }} onChange={this.changeType}>
                                        <div style={{display:"flex",flexDirection:"column"}}>
                                            <Radio style={{flex:1,marginBottom: 5}} value="SPOT">SPOT</Radio>
                                            <Radio style={{flex:1,marginBottom: 5}} value="FORWARD">
                                                <div style={{width:60,display:"inline-block"}}>FORWARD</div>
                                                <Select disabled={type !== "FORWARD"} onChange={this.chengeTenor1} style={{width:60,marginLeft:5,display:"inline-block"}} size="small" className="qit-select-bg">
                                                    <Select.Option key={1} value="1W">1W</Select.Option>
                                                    <Select.Option key={2} value="1M">1M</Select.Option>
                                                    <Select.Option key={3} value="3M">3M</Select.Option>
                                                    <Select.Option key={4} value="6M">6M</Select.Option>
                                                    <Select.Option key={5} value="9M">9M</Select.Option>
                                                    <Select.Option key={6} value="1Y">1Y</Select.Option>
                                                </Select>
                                            </Radio>
                                            <Radio style={{flex:1,marginBottom: 5}} value="SWAP">
                                                <div style={{width:60,display:"inline-block"}}>SWAP</div>
                                                <div style={{display:"inline-block"}}>
                                                    <Select disabled={type !== "SWAP"} onChange={this.chengeTenor2} style={{width:60,marginLeft:5}} size="small" className="qit-select-bg">
                                                        <Select.Option disabled={tenor3key && tenor3key<2} key={1} value="1W">1W</Select.Option>
                                                        <Select.Option disabled={tenor3key && tenor3key<3} key={2} value="1M">1M</Select.Option>
                                                        <Select.Option disabled={tenor3key && tenor3key<4} key={3} value="3M">3M</Select.Option>
                                                        <Select.Option disabled={tenor3key && tenor3key<5} key={4} value="6M">6M</Select.Option>
                                                        <Select.Option disabled={tenor3key && tenor3key<6} key={5} value="9M">9M</Select.Option>
                                                        <Select.Option disabled={!!tenor3key} key={6} value="1Y">1Y</Select.Option>
                                                    </Select>
                                                    <Select disabled={type !== "SWAP"} onChange={this.chengeTenor3} style={{width:60,marginLeft:5}} size="small" className="qit-select-bg">
                                                        <Select.Option disabled={!!tenor2key} key={1} value="1W">1W</Select.Option>
                                                        <Select.Option disabled={tenor2key && tenor2key>=2} key={2} value="1M">1M</Select.Option>
                                                        <Select.Option disabled={tenor2key && tenor2key>=3} key={3} value="3M">3M</Select.Option>
                                                        <Select.Option disabled={tenor2key && tenor2key>=4} key={4} value="6M">6M</Select.Option>
                                                        <Select.Option disabled={tenor2key && tenor2key>=5} key={5} value="9M">9M</Select.Option>
                                                        <Select.Option disabled={tenor2key && tenor2key>=6} key={6} value="1Y">1Y</Select.Option>
                                                    </Select>
                                                </div>
                                            </Radio>
                                        </div>
                                    </Radio.Group>
                                )}
                            </Form.Item>

                            <Form.Item {...formItemLayout}
                                style={itemStyle}
                                label="RequestType"
                                validateStatus={requestTypeError ? "error" : "success"}
                                help={requestTypeError || ""}
                            >
                                {getFieldDecorator("RequestType", {
                                    rules: [{ required: true, message: "Please check the RequestType!" }],
                                })(
                                    <Radio.Group style={{ width: "100%" }}>
                                        <Row>
                                            <Radio value="RFQ">RFQ</Radio>
                                            <Radio value="RFS">RFS</Radio>
                                        </Row>
                                    </Radio.Group>
                                )}
                            </Form.Item>

                            <Form.Item {...formItemLayout}
                                style={itemStyle}
                                label="Side"
                                validateStatus={sideError ? "error" : "success"}
                                help={sideError || ""}
                            >
                                {getFieldDecorator("Side", {
                                    rules: [{ required: true, message: "Please check the Side!" }],
                                })(
                                    <Select size="small" className="qit-select-bg">
                                        <Select.Option value="SELL">SELL</Select.Option>
                                        <Select.Option value="BUY">BUY</Select.Option>
                                        <Select.Option value="TWOWAY">TWO WAY</Select.Option>
                                    </Select>
                                )}
                            </Form.Item>

                            <Form.Item {...formItemLayout}
                                style={itemStyle}
                                label="OrderQty"
                                help={OrderQtyError || ""}
                            >
                                {getFieldDecorator("OrderQty", {
                                    rules: [{ message: "Please input the OrderQty!" }],
                                })(
                                    <div>
                                        <InputNumber onChange={this.changeQty} min={0} max={10000000} style={{width:"75%",marginRight:"5%"}} size="small" placeholder="OrderQty" />
                                        <Select onChange={this.chengeUnit} style={{width:"20%"}} size="small" className="qit-select-bg">
                                            <Select.Option value="1">1</Select.Option>
                                            <Select.Option value="K">K</Select.Option>
                                            <Select.Option value="M">M</Select.Option>
                                        </Select>
                                    </div>
                                )}
                            </Form.Item>

                            <Form.Item {...formItemLayout}
                                style={itemStyle}
                                label="CounterParty"
                                validateStatus={counterPartyError ? "error" : "success"}
                                help={counterPartyError || ""}
                            >
                                {getFieldDecorator("CounterParty", {
                                    rules: [{ required: true, message: "Please check the RequestType!" }],
                                })(
                                    <Checkbox.Group style={{ width: "100%" }}>
                                        {
                                            counterPartyList.map(item => (
                                                <Checkbox key={item} style={{width:"33.33%",margin:0}} value={item}>{item}</Checkbox>
                                            ))
                                        }
                                    </Checkbox.Group>
                                )}
                            </Form.Item>

                            <Form.Item wrapperCol={{ span: 12, offset: 6 }} style={{marginBottom:0}}>
                                {/* <Button
                                                style={{marginRight:10}}
                                                size="small"
                                                type="primary"
                                                htmlType="cancel"
                                            >cancel</Button> */}
                                <Button
                                    size="small"
                                    type="primary"
                                    htmlType="submit"
                                    disabled={this.hasErrors(getFieldsError()) || (type==="FORWARD"&&!tenor1) || (type==="SWAP"&&(!tenor2||!tenor3))}
                                >SUBMIT</Button>
                            </Form.Item>
                        </Form>
                    </div>
                    <div style={{flex:5,fontSize:"12px"}}>
                        <Row style={{paddingBottom:10,borderBottom:"1px dashed #ccc",height:132,overflow:"auto"}}>
                            <Col span={12}>
                                {/* <div style={{float:"left",width:"25%"}}>{manualQuoteRequestInfo}:</div> */}
                                <div style={{float:"left",width:"75%"}}>
                                                Quote List：
                                    {manualQuoteRequestInfo.counterParty}
                                    {
                                        manualQuoteRequestInfo && manualQuoteRequestInfo.bidPxs ? manualQuoteRequestInfo.bidPxs.map((item,key) => (
                                            <Button onClick={()=>this.selectQuote(manualQuoteRequestInfo,key)} size="small" key={key} style={{marginBottom:5,fontSize:"12px"}}>
                                                {manualQuoteRequestInfo && manualQuoteRequestInfo.bidPxs?manualQuoteRequestInfo.bidPxs[key]:""}
                                                <div style={{margin:"0 8px",display:"inline-block"}}>
                                                    {manualQuoteRequestInfo && manualQuoteRequestInfo.bidQties?manualQuoteRequestInfo.bidQties[key]:""}
                                                    {manualQuoteRequestInfo && manualQuoteRequestInfo.askQties?manualQuoteRequestInfo.askQties[key]:""}
                                                </div>
                                                {manualQuoteRequestInfo && manualQuoteRequestInfo.askPxs ?manualQuoteRequestInfo.askPxs[key]:""}
                                            </Button>
                                        )):null
                                    }
                                </div>
                            </Col>
                        </Row>
                        {/* 另一个表单 */}
                        <FormPart
                            selectedQuote={this.state.selectedQuote}
                            selectedQuoteIndex={this.state.selectedQuoteIndex}
                            manualQuoteRequestInfo={manualQuoteRequestInfo}/>
                    </div>
                </div>
                {/* 记录列表 */}
                <RequestTabList tableHeight={400}/>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    counterPartyInfoList: state.counterPartyList.counterPartyList,
    loading: state.counterPartyList.loading,
    marketPriceConfigList: state.corePrice.marketConfigList,
    showManualTrading: state.clientFlowReducer.showManualTrading,
    showRradeBlotter: state.clientFlowReducer.showRradeBlotter,
    manualQuoteRequestInfo: state.manualTradingReducer.manualQuoteRequestInfo,
    currentQuoteRequestId: state.manualTradingReducer.currentQuoteRequestId
});

const mapDispatchToProps = dispatch => ({
    getMarketPriceConfigList: (cb) => dispatch(getMarketPriceConfigList(cb)),
    getCounterPartyList: (cb) => dispatch(getCounterPartyList(cb)),
    manualTradingQuoteRequestPost: (param,cb) => dispatch(manualTradingQuoteRequestPost(param,cb)),
    setManualTrading:(params, cb) =>dispatch(setManualTrading(params, cb)),
    findTodayQuoteRequestGet: () => dispatch(findTodayQuoteRequestGet()),
    checkLogin:(cb) => dispatch(checkLogin(cb)),
    saveManualRequestInfo:(message) => dispatch(saveManualRequestInfo(message)),
});
const ManualTradingQuoteRequestRFQ = Form.create()(RFQ);

export default connect(mapStateToProps,mapDispatchToProps)(ManualTradingQuoteRequestRFQ);