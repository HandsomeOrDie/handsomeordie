import {connect} from "react-redux";
import React, {Component} from "react";
import { DatePicker, Button, Input, Form, Select, message, InputNumber } from "antd";
import {getVenues, getVenueESP, getSymbols, getNetPositions, handlePlaceOrder} from "../../../actions/manualTrading";
const Option = Select.Option;
class Sweepable extends Component {
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

            price: undefined,
            amountBidMax: undefined,
            amountAskMax: undefined,
            amount: undefined,
        };
    }

    componentDidMount() {
        this.setTableHeight(this.props.showManualTrading, this.props.showRradeBlotter, this);
        this.props.getVenueESP({tradingTypes: "ESP"}, (result)=>{
            const venues = result.data.map(item => ({text: item.tradingSource, value: item.tradingSource}));
            this.setState({venues});
        });
    }

    componentWillReceiveProps(nextProps){
        this.setTableHeight(nextProps.showManualTrading, nextProps.showRradeBlotter, this);
        const formValue = this.props.form.getFieldsValue();
        // console.log(nextProps.mktPriceMsg);
        // console.log(nextProps.mktPriceMsg.bidQties[0]);
        if (nextProps.mktPriceMsg.askPxs && formValue.symbol){
            const mktPriceMsg = nextProps.mktPriceMsg;
            let msgLen = 0;
            const symbol = this.state.code && this.state.code.split("@")[0];
            // console.log(mktPriceMsg.dataSource, mktPriceMsg.symbol, mktPriceMsg.tradingType, symbol);
            if (mktPriceMsg.dataSource === formValue.venue && mktPriceMsg.symbol === symbol && mktPriceMsg.tradingType === "ESP"){
                let amountBidMax;
                let amountAskMax;
                mktPriceMsg.askPxs.map(item => {
                    const tickLen = (item + "").split(".")[1].length;
                    if (tickLen > msgLen){
                        msgLen = tickLen;
                    }
                });
                //下面是根据推送的市场价格来限制amount输入的最大值
                mktPriceMsg.bidQties.map(item => {
                    if (!amountBidMax || amountBidMax < item){
                        amountBidMax = item;
                    }
                });
                mktPriceMsg.askQties.map(item => {
                    if (!amountAskMax || amountAskMax < item){
                        amountAskMax = item;
                    }
                });
                this.setState({
                    msgLen,
                    askPxs: mktPriceMsg.askPxs,
                    askQties: mktPriceMsg.askQties,
                    bidPxs: mktPriceMsg.bidPxs,
                    bidQties: mktPriceMsg.bidQties,
                    amountBidMax,
                    amountAskMax,
                });
            }
        }
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

    onPlaceOrder = () => {
        if (!this.state.side){
            this.props.form.validateFieldsAndScroll();
            this.setState({selectedSide: false});
            return;
        }
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                values.side = this.state.side;
                values.code = this.state.code;
                values.price = 0;
                values.quantity = this.state.amount;
                values.tradingType = "ESP";
                // console.log("values:", values);
                this.props.handlePlaceOrder(values, (result)=>{
                    if (result.success){
                        message.success("Success!", 2);
                        // this.props.form.resetFields();
                        // this.setState({
                        //     side: undefined,
                        //     netPosition: undefined,
                        //     symbols: [],
                        //     price: undefined,
                        //     amountBidMax: undefined,
                        //     amountAskMax: undefined,
                        //     amount: undefined,
                        // });
                    } else {
                        message.error("Failed!", 2);
                    }
                });
            }
        });
    };

    onAmountChange = (value) => {
        //根据输入的amount值和选的side来确定price的值
        const side = this.state.side;
        value = parseInt(value);
        // console.log(value);
        let bidQties = [...this.state.bidQties];
        bidQties = bidQties.sort(function (a, b) {
            return a - b;
        });
        // console.log("bidQties：", bidQties);
        let askQties = [...this.state.askQties];
        askQties = askQties.sort(function (a, b) {
            return a - b;
        });
        // console.log("askQties：", askQties);
        let price;
        let layerVal;
        if (side === "BUY"){
            bidQties.map((item, index)=>{
                if (item === value){
                    layerVal = item;
                }
            });
            if (typeof layerVal === "undefined"){
                for (let i=0;i<bidQties.length;i++){
                    if (bidQties[i] > value){
                        layerVal = bidQties[i];
                        break;
                    }
                }
            }
            const index = this.state.bidQties.findIndex(item => item === layerVal);
            price = this.state.bidPxs[index];
        }else if (side === "SELL") {
            askQties.map((item, index)=>{
                if (item === value){
                    layerVal = item;
                }
            });
            if (typeof layerVal === "undefined"){
                for (let i=0;i<askQties.length;i++){
                    if (askQties[i] > value){
                        layerVal = askQties[i];
                        break;
                    }
                }
            }
            const index = this.state.askQties.findIndex(item => item === layerVal);
            price = this.state.askPxs[index];
        }

        console.log(value);
        this.setState({price: price, amount: value});
    };

    render() {
        const { RangePicker } = DatePicker;
        const bestPrice = {
            fontSize:16,
            verticalAlign:"top",
            position:"relative",
            top:10
        };
        const bidPriceItem = {
            display:"flex",
            justifyContent:"flex-end",
            alignItems :"baseline"
        };
        const bidPrice = {
            flex:1,
            maxWidth:80,
            textAlignLast:"right"
        };
        const askPriceItem = {
            display:"flex",
            alignItems :"baseline"
        };
        const askPrice = {
            flex:1,
            maxWidth:80
        };
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 10 },
                sm: { span: 10 },
            },
            wrapperCol: {
                xs: { span: 14 },
                sm: { span: 14 },
            },
        };

        const formItemLayoutTime = {
            labelCol: {
                xs: { span: 4 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 4 },
                sm: { span: 4 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 14,
                    offset: 10,
                },
                sm: {
                    span: 14,
                    offset: 10,
                },
            },
        };
        const bankStyle = {
            display: "inline-block",
            width: 60,
            height: 20,
            textAlign: "center",
            background: "#141416",
            color: "#F5A623",
        };
        const {askPxs, askQties, bidPxs, bidQties, msgLen} = this.state;
        return (
            <div style={{padding:"10px 30px",display:"flex", height: this.props.contentHeight,overflow:"auto"}}>
                <div style={{flex:8,display: this.props.form.getFieldsValue().symbol ? "flex" : "none", flexDirection: "column",justifyContent:"center", }}>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        {
                            // bidPxs.length > 0 &&
                            <div style={{color:"#00CC99", marginRight: 30}}>
                                <span style={bestPrice}>{bidPxs.length > 0 ? (bidPxs[0].toFixed(msgLen)).substring(0, (bidPxs[0].toFixed(msgLen)).length - 2): "--"}</span>
                                <span style={{fontSize:45}}>{bidPxs.length > 0 ? (bidPxs[0].toFixed(msgLen)).substring((bidPxs[0].toFixed(msgLen)).length - 2, (bidPxs[0].toFixed(msgLen)).length): "--"}</span>
                            </div>
                        }
                        {
                            // askPxs.length > 0 &&
                            <div style={{color:"#EA4F53", marginLeft: 30}}>
                                <span style={bestPrice}>{askPxs.length > 0 ? (askPxs[0].toFixed(msgLen)).substring(0, (askPxs[0] + "").length - 2): "--"}</span>
                                <span style={{fontSize:45}}>{askPxs.length > 0 ? (askPxs[0].toFixed(msgLen)).substring((askPxs[0].toFixed(msgLen)).length - 2, (askPxs[0].toFixed(msgLen)).length): "--"}</span>
                            </div>
                        }
                    </div>
                    <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <div style={{display: "flex", flexDirection: "column", marginRight: 20, color:"#00CC99"}}>
                            {
                                bidQties.length > 0 && bidQties.map((item, index) => (
                                    <div style={{height: 27, display: "flex", alignItems: "center"}}>
                                        <div style={bankStyle}>
                                            BOC
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div style={{display: "flex", flexDirection: "column", marginRight: 30, color:"#00CC99"}}>
                            {
                                bidQties.length > 0 && bidQties.map((item, index) => (
                                    <div key={index} style={{height: 27, display: "flex", alignItems: "center", justifyContent: "center"}}>{item}</div>
                                ))
                            }
                        </div>
                        <div style={{display: "flex", flexDirection: "column", marginRight: 30, color:"#00CC99"}}>
                            {
                                bidPxs.length > 0 && bidPxs.map((item, index) => (
                                    <div key={index}><span>{item.toFixed(msgLen).substring(0, item.toFixed(msgLen).length - 2)}</span><span style={{fontSize: 18}}>{item.toFixed(msgLen).substring(item.toFixed(msgLen).length - 2, item.toFixed(msgLen).length)}</span></div>
                                ))
                            }
                        </div>
                        <div style={{display: "flex", flexDirection: "column", marginRight: 30, color:"#EA4F53"}}>
                            {
                                askPxs.length > 0 && askPxs.map((item, index) => (
                                    <div key={index}><span>{item.toFixed(msgLen).substring(0, item.toFixed(msgLen).length - 2)}</span><span style={{fontSize: 18}}>{item.toFixed(msgLen).substring(item.toFixed(msgLen).length - 2, item.toFixed(msgLen).length)}</span></div>
                                ))
                            }
                        </div>
                        <div style={{display: "flex", flexDirection: "column", marginRight: 20, color:"#EA4F53"}}>
                            {
                                askQties.length > 0 && askQties.map((item, index) => (
                                    <div key={index} style={{height: 27,  display: "flex", alignItems: "center", justifyContent: "center"}}>{item}</div>
                                ))
                            }
                        </div>
                        <div style={{display: "flex", flexDirection: "column", color:"#00CC99"}}>
                            {
                                bidQties.length > 0 && bidQties.map((item, index) => (
                                    <div style={{height: 27, display: "flex", alignItems: "center"}}>
                                        <div style={bankStyle}>
                                            CMB
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div style={{flex:11,alignItems: "center",justifyContent: "center",display: "flex"}}>
                    <Form onSubmit={this.handleSubmit}>
                        {/*<Form.Item style={{margin:0}} {...formItemLayout} label="Product Type">*/}
                        {/*{getFieldDecorator("nickname", {*/}
                        {/*rules: [{ message: "Please input your nickname!" }],*/}
                        {/*})(*/}
                        {/*<Input style={{border:0}}/>*/}
                        {/*)}*/}
                        {/*</Form.Item>*/}
                        <Form.Item style={{margin:0,}} {...formItemLayout} label="Venue">
                            {getFieldDecorator("venue", {
                                rules: [{ message: "Please input venue!", required: true }],
                            })(
                                <Select
                                    className="qit-select-bg"
                                    // placeholder="请选择"
                                    onChange={(value)=>{this.onVenuesChange(value);}}
                                >
                                    {
                                        this.state.venues.map(item => (<Option key={item.value} value={item.value}>{item.text}</Option>))
                                    }
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item style={{margin:0}} {...formItemLayout} label="Symbol">
                            {getFieldDecorator("symbol", {
                                rules: [{ message: "Please input Symbol!", required: true }],
                            })(
                                <Select
                                    className="qit-select-bg"
                                    // placeholder="请选择"
                                    onChange={(value)=>{this.onSymbolsChange(value);}}
                                >
                                    {
                                        this.state.symbols.map(item => (<Option key={item.displayName} value={item.displayName}>{item.displayName}</Option>))
                                    }
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item style={{margin:0}} {...formItemLayout} label="Net Position">
                            {getFieldDecorator("netPosition", {
                                initialValue: this.state.netPosition,
                                rules: [{ message: "Please input your Net Position!", required: true  }],
                            })(
                                <Input style={{border:0}}/>
                            )}
                        </Form.Item>
                        <Form.Item style={{margin:0}} {...formItemLayout} label="Algo">
                            {getFieldDecorator("algo", {
                                // rules: [{ message: "Please input your nickname!" }],
                            })(
                                <Select
                                    className="qit-select-bg"
                                    // placeholder="请选择"
                                    // onChange={(value)=>{this.onSymbolsChange(value);}}
                                >
                                    {
                                        [].map(item => (<Option key={item.displayName} value={item.displayName}>{item.displayName}</Option>))
                                    }
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item style={{margin:0}} {...formItemLayout} label="Order Type">
                            {getFieldDecorator("type", {
                                rules: [{ message: "Please input your Order Type!", required: true  }],
                            })(
                                <Select
                                    className="qit-select-bg"
                                    // placeholder="请选择"
                                    // onChange={(value)=>{this.onSymbolsChange(value);}}
                                >
                                    <Option key="LIMIT" value="LIMIT">LIMIT</Option>
                                    <Option key="MARKET" value="MARKET">MARKET</Option>
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item style={{margin:0}} {...formItemLayout} label="Amount">
                            {getFieldDecorator("quantity", {
                                // rules: [{ message: "Please input your nickname!" }],
                            })(
                                <div>
                                    <InputNumber min={1} max={this.state.side === "BUY" ? this.state.amountBidMax : this.state.amountAskMax} value={this.state.amount} onChange={this.onAmountChange} style={{border:0,flex:2,width:"33%"}}/>
                                    <Button size="small" onClick={()=>{
                                        this.setState({side: "BUY", selectedSide: true,});
                                    }} style={{background: this.state.side === "BUY" ? "#ffCC99" : "#00CC99",flex:2,width:"30%",marginLeft:"3%"}}>BUY</Button>
                                    <Button size="small" onClick={()=>{
                                        this.setState({side: "SELL", selectedSide: true,});
                                    }} style={{background: this.state.side === "SELL" ? "#ffCC99" : "#EA4F53",flex:2,width:"30%",marginLeft:"3%"}}>SELL</Button>
                                    <div style={{color: "red", display: this.state.selectedSide ? "none" : "inline"}}>Please select side!</div>
                                </div>

                            )}
                        </Form.Item>
                        <Form.Item style={{margin:0}} {...formItemLayout} label="Avg Price">
                            {getFieldDecorator("price", {
                                // rules: [{ message: "Please input Price!", required: true  }],
                            })(
                                <div>
                                    {/*<Input disabled style={{border:0}}/>*/}
                                    {this.state.price ? this.state.price : "--"}
                                </div>
                            )}
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout} style={{textAlign:"right",marginBottom:10,marginTop:10}}>
                            <Button style={{background:"#2D81BD"}} onClick={()=>{this.onPlaceOrder();}} type="primary" htmlType="submit">PLACE ORDER</Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    mktPriceMsg: state.globalReducer.mktPriceMsg,
    showManualTrading: state.clientFlowReducer.showManualTrading,
    showRradeBlotter: state.clientFlowReducer.showRradeBlotter,
});

const mapDispatchToProps = dispatch => ({
    getVenueESP: (params, cb)=>dispatch(getVenueESP(params, cb)),
    getSymbols: (params, cb)=>dispatch(getSymbols(params, cb)),
    getNetPositions: (params, cb)=>dispatch(getNetPositions(params, cb)),
    handlePlaceOrder: (params, cb)=>dispatch(handlePlaceOrder(params, cb)),
});
const SweepableForm = Form.create()(Sweepable);
export default connect(mapStateToProps,mapDispatchToProps)(SweepableForm);