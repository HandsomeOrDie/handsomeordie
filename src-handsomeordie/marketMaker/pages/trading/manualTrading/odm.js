import {connect} from "react-redux";
import React, {Component} from "react";
import { DatePicker, Button, Input, Form, Select, message, Row, Col } from "antd";
import {getVenues, getSymbols, getNetPositions, handlePlaceOrder} from "../../../actions/manualTrading";
const Option = Select.Option;
class ODM extends Component {
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
            priceEdit: true,
        };
    }

    componentDidMount() {
        this.setTableHeight(this.props.showManualTrading, this.props.showRradeBlotter, this);
        this.props.getVenues({}, (result)=>{
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
            if (mktPriceMsg.dataSource === formValue.venue && mktPriceMsg.symbol === symbol && mktPriceMsg.tradingType === "ODM"){
                mktPriceMsg.askPxs.map(item => {
                    const tickLen = (item + "").split(".")[1].length;
                    if (tickLen > msgLen){
                        msgLen = tickLen;
                    }
                });
                this.setState({msgLen, askPxs: mktPriceMsg.askPxs, askQties: mktPriceMsg.askQties, bidPxs: mktPriceMsg.bidPxs, bidQties: mktPriceMsg.bidQties});
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
                values.tradingType = "ODM";
                // console.log("values:", values);
                this.props.handlePlaceOrder(values, (result)=>{
                    if (result.success){
                        message.success("Success!", 2);
                        // this.props.form.resetFields();
                        // this.setState({side: undefined, symbols: []});
                    } else {
                        message.error("Failed!", 2);
                    }
                });
            }
        });
    };


    render() {
        let odmVertical = "start";
        this.props.showRradeBlotter?odmVertical="start":odmVertical="center";
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
                xs: { span: 12 },
                sm: { span: 12 },
            },
            wrapperCol: {
                xs: { span: 8 },
                sm: { span: 8 },
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
                    span: 12,
                    offset: 8,
                },
                sm: {
                    span: 12,
                    offset: 8,
                },
            },
        };
        const {askPxs, askQties, bidPxs, bidQties, msgLen} = this.state;
        // console.log(this.props);
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
                        <div style={{display: "flex", flexDirection: "column", color:"#EA4F53"}}>
                            {
                                askQties.length > 0 && askQties.map((item, index) => (
                                    <div key={index} style={{height: 27,  display: "flex", alignItems: "center", justifyContent: "center"}}>{item}</div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div style={{flex:11,alignItems: odmVertical,justifyContent: "center",display: "flex",overflow:"scroll"}}>
                    <Form onSubmit={this.handleSubmit}>
                        {/*<Form.Item style={{margin:0}} {...formItemLayout} label="Product Type">*/}
                        {/*{getFieldDecorator("nickname", {*/}
                        {/*rules: [{ message: "Please input your nickname!" }],*/}
                        {/*})(*/}
                        {/*<Input style={{border:0}}/>*/}
                        {/*)}*/}
                        {/*</Form.Item>*/}
                        <Form.Item style={{margin:0, marginTop: 35}} {...formItemLayout} label="Venue">
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
                                rules: [{ message: "Please input your Net Position!", required: true }],
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

                        {/* <Form.Item style={{margin:0}} {...formItemLayout}>
                            {getFieldDecorator("nickname", {
                                rules: [{ message: "Please input your nickname!" }],
                            })( */}
                        <Row>
                            <Col span={20}>
                                <div style={{marginTop: 3, marginBottom: 3, display: "flex", justifyContent: "flex-end"}}>
                                    <DatePicker
                                        className="noboderpicker"
                                        style={{border:0,width:"38%"}}
                                        showTime
                                        format="YY/MM/DD HH:mm:ss"
                                        placeholder="StartTime"
                                    />
                                    <DatePicker
                                        className="noboderpicker"
                                        style={{border:0,width:"38%",marginLeft:"2%"}}
                                        showTime
                                        format="YY/MM/DD HH:mm:ss"
                                        placeholder="EndTime"
                                    />
                                    <Input placeholder="Slice" style={{border:0,width:"15%",marginLeft:"2%"}}/>
                                </div>
                            </Col>
                        </Row>
                        {/* )}
                        </Form.Item> */}

                        {/* <div style={{display:"flex",flexDirection:"column"}}>
                            <div></div>
                            <div></div>
                            <div><Input style={{border:0}}/></div>
                        </div> */}

                        <Form.Item style={{margin:0}} {...formItemLayout} label="Order Type">
                            {getFieldDecorator("type", {
                                rules: [{ message: "Please input your Order Type!", required: true  }],
                            })(
                                <Select
                                    className="qit-select-bg"
                                    // placeholder="请选择"
                                    onChange={(value)=>{
                                        if (value === "LIMIT"){
                                            this.setState({priceEdit: true});
                                            this.props.form.setFieldsValue({price: undefined});
                                        } else {
                                            this.setState({priceEdit: false});
                                            this.props.form.setFieldsValue({price: 0});
                                        }
                                    }}
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
                                    <Input style={{border:0,flex:2,width:"33%"}}/>
                                    <Button size="small" onClick={()=>{
                                        this.setState({side: "BUY", selectedSide: true});
                                    }} style={{background: this.state.side === "BUY" ? "#ffCC99" : "#00CC99",flex:2,width:"30%",marginLeft:"3%"}}>BUY</Button>
                                    <Button size="small" onClick={()=>{
                                        this.setState({side: "SELL", selectedSide: true});
                                    }} style={{background: this.state.side === "SELL" ? "#ffCC99" : "#EA4F53",flex:2,width:"30%",marginLeft:"3%"}}>SELL</Button>
                                    <div style={{color: "red", display: this.state.selectedSide ? "none" : "inline"}}>Please select side!</div>
                                </div>

                            )}
                        </Form.Item>
                        <Form.Item style={{margin:0}} {...formItemLayout} label="Price">
                            {getFieldDecorator("price", {
                                rules: [{ message: "Please input Price!", required: true  }],
                            })(
                                <Input disabled={!this.state.priceEdit} style={{border:0}}/>
                            )}
                        </Form.Item>
                        <Form.Item style={{margin:0}} {...formItemLayout} label="Time in Force">
                            {getFieldDecorator("timeInForce", {
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
});
const ODMForm = Form.create()(ODM);
export default connect(mapStateToProps,mapDispatchToProps)(ODMForm);