import {connect} from "react-redux";
import React, {Component} from "react";
import PropTypes from "prop-types";
import {Layout, Tabs, Row, Col} from "antd";
import ClientFlow from "../../marketMaker/pages/trading/clientFlow";
import TradingMonitor from "../../marketMaker/pages/trading/tradingMoniter";
import ManualTradingQuoteRequestPost from "../../marketMaker/pages/trading/manualTrading";
import TradeBlotter from "../../marketMaker/pages/trading/tradeBlotter";
import Notification from "../../marketMaker/pages/trading/notification";
import Liquidity from "../../marketMaker/pages/trading/liquidity";
import WebSocketClient from "../socket/WebSocketClient";
import {setSocketConnected} from "../actions/globalAction";
import {checkLogin} from "../actions/marketDetail";
import { DragDropContext, DragSource, DropTarget } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
class Trading extends Component {
    state = {
        theme: "", 
        theme_shadow: ""
    }
    componentWillMount() {
        this.props.checkLogin((data) => {
            if (!data) {
                this.props.history.push({pathname: "/marketlogin"});
            } else {
                // WebSocketClient.connect({onError: this.onError, onOpen: this.onOpen, onReconnect: this.onReconnect, });
            }
        });

    }

    onError = () => {
        this.props.setSocketConnected(3);
    };

    onOpen = () => {
        this.props.setSocketConnected(1);
    };

    onReconnect = () => {
        this.props.setSocketConnected(2);
    };
    render() {
        const widthCustom = document.documentElement.clientWidth * 3/7;
        const widthNotification = document.documentElement.clientWidth /7;
        return (
            <div style={{display:"flex",flex:1,overflow:"auto"}}>
                <div style={{display:"flex",flex:3,flexDirection:"column", minWidth: 670}}>
                    <ClientFlow/>
                    <TradeBlotter/>
                </div>
                <div style={{display:"flex",flex:3,flexDirection:"column", minWidth: widthCustom}}>
                    <Liquidity/>
                    <TradingMonitor/>
                </div>
                {
                    this.props.showNotification ?
                        <div style={{flex: 1, minWidth: widthNotification}}>
                            <Notification/>
                        </div> : null
                }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    // themeReducer: state.themeReducer
    showNotification: state.globalReducer.showNotification,
});

const mapDispatchToProps = dispatch => ({
    // setTheme: (theme) => dispatch(setTheme(theme))
    setSocketConnected: (params) => dispatch(setSocketConnected(params)),
    checkLogin:(cb) =>dispatch(checkLogin(cb)),
});
export default DragDropContext(HTML5Backend)(connect(mapStateToProps,mapDispatchToProps)(Trading));
// export default connect(mapStateToProps,mapDispatchToProps)(Trading);
