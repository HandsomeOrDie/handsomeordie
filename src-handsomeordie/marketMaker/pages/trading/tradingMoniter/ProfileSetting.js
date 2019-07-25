import {connect} from "react-redux";
import React, {Component} from "react";
import { DatePicker, Button, Input, Form, Select, message, Modal, Radio, InputNumber } from "antd";
import {getHedgeSelectValue, setSelectValue, updateProfile, getProfile} from "../../../actions/autohedge";
import "../../../../common/styles/marketPages/liquidity.scss";
import moment from "moment";
const Option = Select.Option;
class ProfileSetting extends Component {
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            algo: "Market",
        };
    }

    componentDidMount() {
        this.props.handleRef(this);
    }

    componentWillReceiveProps(nextProps){
    }

    showModal = () => {
        this.setState({visible: true});
    };

    onConfirm = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log(values);
                const params = {};
                params.name = values.name;
                params.algo = values.algo;
                params.venue = values.venue;
                delete values.name;
                delete values.algo;
                delete values.venue;
                values = JSON.stringify(values).replace(/\[|]|"|}|{/g, "");
                values = values.replace(/,/g, ";");
                values = values.replace(/:/g, "=");
                params.params = values;

                this.props.updateProfile(params, (result)=>{
                    if (result.success){
                        this.props.getProfile({}, (response)=>{
                            const profile = response.data;
                            const selectValue = this.props.selectValue;
                            selectValue.hedgingProfile = profile.map(item => ({text: item.name, value: item.name}));
                            console.log(selectValue);
                            this.props.setSelectValue(selectValue);
                            this.setState({visible: false});
                            message.success("Success!", 2);
                        });
                    }else {
                        message.error("failed!", 2);
                    }
                });

            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        const { algo } = this.state;

        const formItemLayout = {
            labelCol: {
                xs: { span: 8 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 16 },
                sm: { span: 16 },
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

        return (
            <Modal
                id="liquidity-modal"
                visible={this.state.visible}
                title="Profile Setting"
                bodyStyle={{background: "#151516"}}
                confirmLoading={this.state.confirmLoading}
                onOk={()=>{
                    this.onConfirm();
                    // this.setState({visible: false});
                }}
                width={500}
                onCancel={()=>{
                    this.setState({visible: false});
                }}
                className="darkTheme liquidity-modal"
                closable={false}
                destroyOnClose={true}
                okText={"Confirm"}
            >
                <div id="place-order" style={{display:"flex", flexDirection: "column"}}>
                    <div style={{display: "flex"}}>
                        <div style={{flex: 3}}>
                            <Form id="place-order-form">
                                <Form.Item colon={false} style={{margin:0}} {...formItemLayout} label="New Profile Name">
                                    {getFieldDecorator("name", {
                                        // rules: [{ message: "Please input your Symbol!", required: true  }],
                                    })(
                                        <Input/>
                                    )}
                                </Form.Item>
                                <Form.Item colon={false} style={{margin:0}} >
                                    {getFieldDecorator("algo", {
                                        initialValue: "Market"
                                        // rules: [{ message: "Please input your Symbol!", required: true  }],
                                    })(
                                        <Radio.Group onChange={(e)=>{this.setState({algo: e.target.value});}}>
                                            <Radio value={"Market"}>Market</Radio>
                                            <Radio value={"LIMIT"}>LIMIT</Radio>
                                            <Radio value={"VWAP"}>VWAP</Radio>
                                            <Radio value={"TWAP"}>TWAP</Radio>
                                        </Radio.Group>
                                    )}
                                </Form.Item>
                                <Form.Item colon={false} style={{margin:0}} {...formItemLayout} label="Venue">
                                    {getFieldDecorator("venue", {
                                        // rules: [{ message: "Please input your Venue!", required: true  }],
                                    })(
                                        <Select
                                            className="qit-select-bg"
                                            // placeholder="请选择"
                                            style={{width: "100%"}}
                                            size="small"
                                            onChange={(value)=>{
                                                // this.setState({})
                                            }}
                                        >
                                            <Option key={"CFETS"} value={"CFETS"}>CFETS</Option>
                                            <Option key={"FXALL"} value={"FXALL"}>FXALL</Option>
                                            <Option key={"360T"} value={"360T"}>360T</Option>
                                            <Option key={"JPM"} value={"JPM"}>JPM</Option>
                                            <Option key={"XTX"} value={"XTX"}>XTX</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                                {
                                    algo === "Market" &&
                                    <Form.Item colon={false} style={{margin:0}} label={"Slippage"} {...formItemLayout}>
                                        {getFieldDecorator("slippage", {
                                            // rules: [{ message: "Please input your Symbol!", required: true  }],
                                        })(
                                            <div style={{display: "flex"}}><Input/><div>bp</div></div>
                                        )}
                                    </Form.Item>
                                }
                                {
                                    algo === "LIMIT" &&
                                    <Form.Item colon={false} style={{margin:0}} label={<div style={{lineHeight: 1}}>Distance to best <br/>market price</div>} {...formItemLayout}>
                                        {getFieldDecorator("distanceToBestMarketPrice", {
                                            // rules: [{ message: "Please input your Symbol!", required: true  }],
                                        })(
                                            <div style={{display: "flex"}}><Input/><div>bp</div></div>
                                        )}
                                    </Form.Item>
                                }
                                {
                                    (algo === "VWAP" || algo === "TWAP") &&
                                        <div>
                                            <Form.Item colon={false} style={{margin:0}} label={"Mode"} {...formItemLayout}>
                                                {getFieldDecorator("mode", {
                                                    initialValue: "Normal"
                                                    // rules: [{ message: "Please input your Symbol!", required: true  }],
                                                })(
                                                    <Radio.Group onChange={(e)=>{}}>
                                                        <Radio value={"Normal"}>Normal</Radio>
                                                        <Radio value={"Aggresive"}>Aggresive</Radio>
                                                    </Radio.Group>
                                                )}
                                            </Form.Item>
                                            <div style={{display: "flex", alignItems: "center"}}>
                                                <div style={{marginRight: 5}}>WAIT</div>
                                                <Form.Item colon={false} style={{margin:0}}>
                                                    {getFieldDecorator("wait", {
                                                        // rules: [{ message: "Please input your Symbol!", required: true  }],
                                                    })(
                                                        <InputNumber min={0} style={{width: 60, height: 24}}/>
                                                    )}
                                                </Form.Item>
                                                <div style={{marginLeft: 5}}>
                                                    <Form.Item colon={false} style={{margin:0}}>
                                                        {getFieldDecorator("waitUnit", {
                                                            initialValue: "s"
                                                            // rules: [{ message: "Please input your Symbol!", required: true  }],
                                                        })(
                                                            <Select
                                                                className="qit-select-bg"
                                                                style={{width: "40px"}}
                                                                size="small"
                                                                onChange={(value)=>{
                                                                    // this.setState({})
                                                                }}
                                                            >
                                                                <Option key={"s"} value={"s"}>s</Option>
                                                                <Option key={"m"} value={"m"}>m</Option>
                                                                <Option key={"h"} value={"h"}>h</Option>
                                                            </Select>
                                                        )}
                                                    </Form.Item>
                                                </div>
                                                <div style={{marginRight: 5, marginLeft: 10}}>DURATION</div>
                                                <Form.Item colon={false} style={{margin:0}}>
                                                    {getFieldDecorator("duration", {
                                                        // rules: [{ message: "Please input your Symbol!", required: true  }],
                                                    })(
                                                        <InputNumber min={0} style={{width: 60, height: 24}}/>
                                                    )}
                                                </Form.Item>
                                                <div style={{marginLeft: 5}}>
                                                    <Form.Item colon={false} style={{margin:0}}>
                                                        {getFieldDecorator("durationUnit", {
                                                            initialValue: "s"
                                                            // rules: [{ message: "Please input your Symbol!", required: true  }],
                                                        })(
                                                            <Select
                                                                className="qit-select-bg"
                                                                style={{width: "40px"}}
                                                                size="small"
                                                                onChange={(value)=>{
                                                                    // this.setState({})
                                                                }}
                                                            >
                                                                <Option key={"s"} value={"s"}>s</Option>
                                                                <Option key={"m"} value={"m"}>m</Option>
                                                                <Option key={"h"} value={"h"}>h</Option>
                                                            </Select>
                                                        )}
                                                    </Form.Item>
                                                </div>
                                                <Form.Item colon={false} style={{margin:0, marginLeft: 10}} label={"Slice"} {...formItemLayout}>
                                                    {getFieldDecorator("slice", {
                                                        // rules: [{ message: "Please input your Symbol!", required: true  }],
                                                    })(
                                                        <InputNumber min={0} style={{width: 60, marginLeft: 5, height: 24}}/>
                                                    )}
                                                </Form.Item>
                                            </div>
                                        </div>
                                }
                            </Form>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    selectValue: state.autoHedgeReducer.selectValue,
});

const mapDispatchToProps = dispatch => ({
    updateProfile: (params, cb)=>dispatch(updateProfile(params, cb)),
    setSelectValue: (selectValue) => dispatch(setSelectValue(selectValue)),
    getProfile: (params, cb)=>dispatch(getProfile(params, cb)),
});
const PlaceOrderForm = Form.create()(ProfileSetting);
export default connect(mapStateToProps,mapDispatchToProps)(PlaceOrderForm);
