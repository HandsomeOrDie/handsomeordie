import React from "react";
import {Icon, Menu, Dropdown, message} from "antd";
import "./../../../../common/styles/home/QUO/quo.scss";
import DeepQuo from "./DeepQuo";
import {checkLogin} from "../../../actions/marketDetail";
import {connect} from "react-redux";
import {getInstance, updateSelectedQuotes} from "../../../actions/spdb/odmAction";
import WebSocketClient from "../../../socket/WebSocketClient";
import {marketPriceWebSocket} from "../../../../common/marketApi";
import {jksaoOutput, makingInstanceOutput, quoteOutput} from "../../../../common/spdbApi";
// const DeepQuo = React.lazy(() => import("./DeepQuo"));

let messages = [];
class QUO extends React.Component {
    state = {
        visible: false,
        instances: [],
    }
    componentDidMount() {
        this.props.checkLogin((data) => {
            if (!data) {
                this.props.history.push("/marketlogin");
                return;
            }
        });

        this.props.getInstance({}, ( result )=>{
            if (!result.success) {
                message.error("报价查询失败！", 2);
                this.setState({loading: false});
                return;
            }
            const data = result.data;
            data.map((item, index) => {
                const selectedQuotes = this.props.selectedQuotes;
                item.selected = selectedQuotes.indexOf(item.instanceId) !== -1;
                item.symbol = this.showCode(item.code);
            });

            this.setState({ instances: data});
        });

        // this.subscrible();
    }

    handleEvent =() =>{

    }

    subscrible = () => {
        this.props.checkLogin((data) => {
            if (data) {
                if (!window.conn) {
                    window.conn = true;
                    WebSocketClient.connect({onError: this.onError, onOpen: this.onOpen, onReconnect: this.onReconnect, });
                }
                this.jksaoOutputId = WebSocketClient.subscribeMessage({
                    mtype: jksaoOutput,
                    callback: (message)=>{
                        // if (message.userName && message.userName !== "sa"){
                        //     return;
                        // }
                        const instances = this.state.instances;
                        let isEdit = false;
                        const priceLstMap = message.priceLstMap;
                        Object.keys(priceLstMap).map(ls => {
                            instances.map(instance => {
                                if (ls === instance.code){
                                    isEdit = true;
                                    instance.quotes = priceLstMap[ls];
                                    // if (message.userName){
                                    //     instance.updateMySize = true;
                                    // } else {
                                    //     instance.updateMySize = false;
                                    // }
                                    instance.userName = message.userName;
                                }
                            });
                        });
                        isEdit && this.setState({ instances });
                    },
                    scope: this
                });
            }
        });
    }

    onError = () => {
        // this.props.setSocketConnected(3);
    };

    onOpen = () => {
        // this.props.setSocketConnected(1);
    };

    onReconnect = () => {
        // this.props.setSocketConnected(2);
    };

    showCode = (text) => {
        const {tradingvarietymanage} = this.props;
        for(let i in tradingvarietymanage){
            if(tradingvarietymanage[i].key === text){
                return tradingvarietymanage[i].displayName;
            }
        }
        return "";
    }

    unsubscribleMsg = () => {
        WebSocketClient.unsubscribeMessage({ subscriptionId: this.jksaoOutputId, mtype: jksaoOutput });
    };

    componentWillUnmount() {
        this.setState = (state,callback)=>{
            return;
        };
        this.unsubscribleMsg();
    }

    handleMenuClick = e => {
        const instances = this.state.instances;
        const selectedQuotes = this.props.selectedQuotes;
        if (instances[e.key].selected){
            instances[e.key].selected = false;
            selectedQuotes.splice(selectedQuotes.findIndex(item => item === instances[e.key].instanceId), 1);
        } else {
            let selectedNum = 0;
            instances.map(item => {
                if (item.selected){
                    selectedNum ++;
                }
            });
            if (selectedNum < 4 ){
                instances[e.key].selected = true;
                selectedQuotes.push(instances[e.key].instanceId);
            }
        }
        this.props.updateSelectedQuotes(selectedQuotes);
        this.setState({ instances });

    };

    handleVisibleChange = flag => {
        this.setState({ visible: flag });
    };

    getMenuItems = () => {
        const instances = this.state.instances;
        const items = [];
        instances.map((item, index)=> {
            items.push(<Menu.Item key={index}>
                <span>{item.symbol}</span>
                <span style={{marginLeft: 40}}>{item.selected && <Icon type="check" />}</span>
            </Menu.Item>);
        });
        return items;
    }



    getContent = () => {
        let contents = [];
        let count = 0;
        this.state.instances.map((item, index)=>{
            // console.log(index);
            if (item.selected){
                count ++;
                contents.push(<div className={
                    count === 1 ? "one" :
                        count === 2 ? "two" :
                            count === 3 ? "three" : "four"
                } key={index}><DeepQuo key={index} instance={{...item}}/></div>);
            }
        });
        if (count === 1) {
            contents.push(<div key={997} className={"two"}></div>);
            contents.push(<div key={998} className={"three"}></div>);
            contents.push(<div key={999} className={"four"}></div>);
        }
        if (count === 2) {
            contents.push(<div key={998} className={"three"}></div>);
            contents.push(<div key={999} className={"four"}></div>);
        }
        if (count === 3) {
            contents.push(<div key={999} className={"four"}></div>);
        }
        return contents;
    }

    render() {
        const menu = (
            <Menu onClick={this.handleMenuClick}>
                {
                    this.getMenuItems()
                }
            </Menu>
        );
        return (
            <div className={"quo"}>
                <div className={"tool-bar"}>
                    <div className={"add"}>
                        <Dropdown
                            overlay={menu}
                            onVisibleChange={this.handleVisibleChange}
                            visible={this.state.visible}
                            trigger={["click"]}
                        >
                            <a className="ant-dropdown-link" href="#">
                                添加行情<Icon style={{marginLeft: 5}} type="plus" />
                            </a>
                        </Dropdown>
                    </div>
                </div>
                <div className={"content"}>
                    {
                        this.getContent()
                    }
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => ({
    tradingvarietymanage: state.odmReducer.tradingvarietymanage,
    selectedQuotes: state.odmReducer.selectedQuotes
});

const mapDispatchToProps = dispatch => ({
    getInstance: (params, cb) => dispatch(getInstance(params, cb)),
    checkLogin:(cb) =>dispatch(checkLogin(cb)),
    updateSelectedQuotes: (params, cb) =>dispatch(updateSelectedQuotes(params, cb)),
});

export default connect(mapStateToProps,mapDispatchToProps)(QUO);
