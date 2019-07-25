import { connect } from "react-redux";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Icon, Input, Button, Checkbox, message } from "antd";
import {getLogin,checkLogin} from "../actions/marketDetail";
import WebsocketClient from "../socket/WebSocketClient";
const FormItem = Form.Item;
class Login extends React.Component {
    // constructor(props){
    //   super(props);
    // }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log("Received values of form: ", values);
                // this.props.dispatch({
                //     type: 'login/login',
                //     payload: values
                // }).then(() => {
                //     if (this.props.login.isLogin) {
                //         // this.props.history.push('/index')
                //         // this.props.dispatch({})
                //     }
                // })
                // let _this =this;
                // console.log(values);
                this.props.getLogin(values,(data)=>{
                    if(data){
                        this.props.checkLogin((data)=>{
                            if(data){
                                sessionStorage.setItem("username", data.name);
                                localStorage.setItem("userInfo", JSON.stringify(data));
                                this.props.history.push({pathname:"/"});
                                // this.props.history.push({pathname:"/"});

                            } else {
                                this.props.history.push({ pathname: "/marketlogin" });
                                // message.error("获取不到用户信息，请重新登录！");
                            }
                        });
                    } else {
                        message.error("Login failed, please check the user name and password!");
                        return;
                    }
                  
                });
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login-form-box">
                <div >
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <FormItem>
                            {getFieldDecorator("username", {
                                rules: [{ required: true, message: "Please input your username!" }],
                            })(
                                <Input prefix={<Icon type="user" style={{ color: "white" }} />} placeholder="Username" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator("password", {
                                rules: [{ required: true, message: "Please input your Password!" }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ color: "white" }} />} type="password" placeholder="Password" />
                            )}
                        </FormItem>
                        <FormItem>
                            {/* {getFieldDecorator("remember", {
                                valuePropName: "checked",
                                initialValue: true,
                            })(
                                <Checkbox>Remember me</Checkbox>
                            )} */}
                            {/* <a  href="">Forgot password</a> */}
                            <Button style={{width:"100%",borderRadius:0}} type="primary" htmlType="submit"  >
                                Log in
                            </Button>
                            {/* Or <a href="">register now!</a> */}
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }

}
const MarketLogin = Form.create()(Login);

const mapStateToProps = state => ({
    // themeReducer: state.themeReducer
});

const mapDispatchToProps = dispatch => ({
    getLogin: (param,cb) => dispatch(getLogin(param,cb)),
    checkLogin:(cb)=>dispatch(checkLogin(cb))
});
export default connect(mapStateToProps, mapDispatchToProps)(MarketLogin);