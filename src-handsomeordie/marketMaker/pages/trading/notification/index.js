import {connect} from "react-redux";
import React, {Component} from "react";
import { Radio, Select, Row, Col, Table, Card, Form, Button, Collapse, Icon, Spin } from "antd";
import { systemAlert } from "../../../actions/systemAlert";
import WebSocketClient from "../../../socket/WebSocketClient";
import {checkLogin} from "../../../actions/marketDetail";
import {riskMonitorWebSocket, systemAlertSorket} from "../../../../common/marketApi";
import {setSocketConnected} from "../../../actions/globalAction";
import moment from "moment";

class Notification extends Component {

    constructor(props){
        super(props);
        this.state = {
            heightContent: document.documentElement.clientHeight - 50 - 40 - 10 - 2,
            list: [],
            spinning: false,
        };
    }

    componentDidMount(){
        window.addEventListener("resize", ()=>{
            this.setState({heightContent: document.documentElement.clientHeight - 50 - 40 - 10 - 2});
        });
        this.props.systemAlert({maxRecords:200},(data)=>{
            // console.log(data);
            this.setState({
                list: data
            });
            this.getSocket(data);
        });
    }
    refreshMsg = () => {
        this.setState({spinning: true});
        this.props.systemAlert({maxRecords:200},(data)=>{
            // console.log(data);
            this.setState({
                list: data,
                spinning: false,
            });
        });
    };
    getSocket = (list) => {
        this.props.checkLogin((data) => {
            if (data) {
                if (!window.conn) {
                    window.conn = true;
                    WebSocketClient.connect({onError: this.onError, onOpen: this.onOpen, onReconnect: this.onReconnect, });
                }
                this.getSystemAlert = WebSocketClient.subscribeMessage({
                    mtype: systemAlertSorket,
                    callback: (message)=>{
                        this.state.list.unshift(message);
                        if(this.state.list.length>500){
                            this.state.list = this.state.list.slice(0,500);
                        }
                        this.setState({
                            list: this.state.list
                        },()=>{
                            // console.log(_this.state.list);
                        });
                    },
                    params: {

                    },
                    scope: this
                });
            }
        });
    };

    onError = () => {
        this.props.setSocketConnected(3);
    };

    onOpen = () => {
        this.props.setSocketConnected(1);
    };

    onReconnect = () => {
        this.props.setSocketConnected(2);
    };

    componentWillReceiveProps(nextProps) {

    }

    componentWillUnmount() {
        this.setState = (state,callback)=>{
            return;
        };
        WebSocketClient.unsubscribeMessage({ subscriptionId: this.getSystemAlert, mtype: systemAlertSorket });
    }

    render() {
        const {list} = this.state;
        // console.log(list);
        return (
            <Card id="riskMonitor" className="tradingCard" style={{margin:"5px 5px 5px 0",}}>
                <div style={{
                    paddingLeft: 20,
                    height: 40,
                    background: "#3B3F42",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                }} onClick={()=>{}}>
                    <div><span className="collapse-name">Notification</span></div>
                    <div style={{marginRight: 20}}>
                        <Icon className="icon-style-self" onClick={(e)=>{
                            this.refreshMsg();
                        }} type="sync" style={{marginRight: 10, fontSize: 18}}/>
                    </div>
                </div>
                <Spin spinning={this.state.spinning}>
                    <div style={{height: this.state.heightContent,fontSize:"12px",padding:10,overflowY:"scroll"}}>
                        {
                            list instanceof Array && list.length ? list.map((item,index) => (
                                <div key={index+1}>
                                    <p style={{color:"#DD4B51",marginBottom:5}}>• {item.module} {moment(item.alertTime).format("HH:mm:ss")} {item.level}</p>
                                    <p>{item.message}</p>
                                    <p>{item.action}</p>
                                </div>
                            )):""
                        }
                    </div>
                </Spin>
            </Card>
        );
    }
}

const mapStateToProps = state => ({
    systemAlertReducer: state.systemAlertReducer.systemAlert
});

const mapDispatchToProps = dispatch => ({
    systemAlert: (param,cb) => dispatch(systemAlert(param,cb)),
    setSocketConnected: (params) => dispatch(setSocketConnected(params)),
    checkLogin:(cb) =>dispatch(checkLogin(cb)),
});
export default connect(mapStateToProps,mapDispatchToProps)(Notification);