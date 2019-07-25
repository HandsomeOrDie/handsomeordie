import {connect} from "react-redux";
import React, {Component} from "react";
import { Tabs, Form, Button, Select, Collapse, InputNumber, message } from "antd";
import { placeOrderPost, findTodayOrderGet } from "../../../actions/manualTrading";
let myClear;
class Part extends Component {
    constructor(props){
        super(props);
        this.state = {
            unit: "",
            qty: ""
        };
    }

    componentDidMount() {
        this.props.form.validateFields();
    }

    componentWillUnmount(){
        clearTimeout(myClear);
    }

    hasErrors = (fieldsError) => {
        return Object.keys(fieldsError).some(field => fieldsError[field]);
    }

    handleSubmit = (e) => {
        // console.log(this.props);
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let data = {
                    QuoteID: this.props.manualQuoteRequestInfo.quoteId,
                    requestId: this.props.manualQuoteRequestInfo.requestId,
                    action: "new",
                    symbol: this.props.manualQuoteRequestInfo.symbol,
                    code: `${this.props.manualQuoteRequestInfo.symbol}@CFETS`,
                    side: values.Side,
                    quantity: values.Qty,
                    unit: this.state.unit,
                    CountryParty: this.props.manualQuoteRequestInfo.counterParty,
                    type: "LIMIT",
                    Price: values.Side==="SELL"?this.props.manualQuoteRequestInfo.bidPxs[this.props.selectedQuoteIndex?this.props.selectedQuoteIndex:0]:values.Side==="BUY"?this.props.manualQuoteRequestInfo.askPxs[this.props.selectedQuoteIndex?this.props.selectedQuoteIndex:0]:null
                };
                // console.log("Received values of form: ",this.props.manualQuoteRequestInfo, data, values);
                this.props.placeOrderPost(data,(success)=>{
                    // this.setState({loading:false},()=>{
                    if(success){
                        message.success("Success！");
                        myClear = setTimeout(this.props.form.resetFields,2000);
                        this.props.findTodayOrderGet();
                    } else {
                        message.error("Failed！");
                    }
                    // });
                });
            }
        });
    }

    setUnit = (e) => {
        // console.log(e);
        this.setState({unit: e});
    }

    setQty = (val) => {
        this.setState({
            qty: val
        });
        // console.log(val);
    }

    render() {
        // console.log(this.props);
        const formItemLayoutRight = {
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
        
        const {unit, qty} = this.state;
        const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;

        // Only show error after a field is touched.
        const sideError = isFieldTouched("Side") && getFieldError("Side");
        const qtyError = isFieldTouched("Qty") && getFieldError("Qty");
        const {manualQuoteRequestInfo} = this.props;
        return (
            <Form layout="horizontal" onSubmit={this.handleSubmit}>
                            
                <Form.Item {...formItemLayoutRight}
                    style={itemStyle}
                    label="Price"
                >
                    {this.props.selectedQuote ? this.props.selectedQuote:""}
                </Form.Item>

                <Form.Item {...formItemLayoutRight}
                    style={itemStyle}
                    label="CounterParty"
                >
                    <span>{manualQuoteRequestInfo?manualQuoteRequestInfo.counterParty:null}</span>
                </Form.Item>

                <Form.Item {...formItemLayoutRight}
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
                            {/* <Select.Option value="two way">two way</Select.Option> */}
                        </Select>
                    )}
                </Form.Item>

                <Form.Item {...formItemLayoutRight}
                    style={itemStyle}
                    label="OrderQty"
                    help={qtyError || ""}
                >
                    {getFieldDecorator("Qty", {
                        rules: [{ message: "Please input the OrderQty!" }],
                    })(
                        <div>
                            <InputNumber onChange={this.setQty} min={0} max={10000000} style={{width:"75%",marginRight:"5%"}} size="small" placeholder="OrderQty" />
                            <Select onChange={this.setUnit} style={{width:"20%"}} size="small" className="qit-select-bg">
                                <Select.Option value="1">1</Select.Option>
                                <Select.Option value="K">K</Select.Option>
                                <Select.Option value="M">M</Select.Option>
                            </Select>
                        </div>
                    )}
                </Form.Item>

                <Form.Item wrapperCol={{ span: 14, offset: 10 }} style={{marginBottom:0}}>
                    <Button
                        size="small"
                        htmlType="submit"
                        disabled={this.hasErrors(getFieldsError()) || !unit || !qty}
                    >SUBMIT</Button>
                </Form.Item>
            </Form>
        );
    }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    placeOrderPost:(params,cb) => dispatch(placeOrderPost(params,cb)),
    findTodayOrderGet: () => dispatch(findTodayOrderGet()),
});
const PartForm = Form.create({ name: "horizontal_login" })(Part);

export default connect(mapStateToProps,mapDispatchToProps)(PartForm);