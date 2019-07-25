import { connect } from "react-redux";
import { Layout } from "antd";
import React, { Component } from "react";

import TabPage from "../pages/marketMarking/tabPage";
import Header from "./Header";
import Index from "../pages/marketMarking/index";
import { checkLogin, getReferencePrice, getInstance_output } from "../actions/marketDetail";
import { save_Param, save_socket } from "../actions/symbolList";
import {setCurrentStrategy} from "../actions/setCurrentStrategy";
import { saveQuote } from "../actions/distribution";
import WebSocketClient from "../socket/WebSocketClient";
import MarketSetting from "../../marketMaker/pages/marketConfig";
import {
    ReferencePriceOutput,
    MarketMakingInstanceOutput,
    orderbookWebSocket,
    marketPriceWebSocket
} from "../../common/marketApi/index";
import moment from "moment";
import "../../common/styles/marketPages/marketSetting.scss";
import { formatStr, formatNumber, sumNumber } from "../../marketMaker/utils/commonFun";
import {setSocketConnected, updateMarketPrice, updateMinTick} from "../actions/globalAction";
class MarketConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mktPxConfigId: null
        };
    }
    componentWillMount() {
        this.props.checkLogin((data) => {
            if (!data) {
                this.props.history.push({ pathname: "/marketlogin" });
            } else {
                WebSocketClient.connect({onError: this.onError, onOpen: this.onOpen, onReconnect: this.onReconnect, });
                // let this = this;
                this.subIdMarketPrice = WebSocketClient.subscribeMessage({
                    mtype: ReferencePriceOutput,
                    // callback:this.marketPriceCallback,
                    // params: {symbol:window.location.hash.substring(34,40)},
                    callback: (message) => {
                        // console.log(scope);
                        // console.log(message);
                        this.props.save_socket(message);
                        this.props.updateMinTick(message, this.props.minTicks);
                        if (this.state.mktPxConfigId && message.configId == this.state.mktPxConfigId) {
                            this.props.getReferencePrice(message);
                            // console.log("jrwjf");
                        }
                        //   else {
                        //     this.props.getReferencePrice(undefined);
                        // }
                    },
                    scope: this
                });
                this.subInstance_update = WebSocketClient.subscribeMessage({
                    mtype: MarketMakingInstanceOutput,
                    callback: (message) => {
                        // console.log(message);
                        this.props.getInstance_output(message);
                    },
                    scope: this
                });
                this.orderBookId = WebSocketClient.subscribeMessage({
                    mtype: orderbookWebSocket,
                    callback: (message) => {
                        // console.log(message);
                        this.OrderBookOutPut(message);
                        this.handleDistributionQuoteMessage(message);
                    },
                    // params:{instanceId:this.props.strategyParam},
                    scope: this
                });

                // this.distributionQuoteOutput = WebSocketClient.subscribeMessage({
                //     mtype: "com.finone.quantexecutor.entity.QuoteOutput",
                //     callback: (message) => {
                //         // console.log(message);
                //     },
                //     scope: this
                // });
                
                // this.marketPriceId = WebSocketClient.subscribeMessage({
                //     mtype: marketPriceWebSocket,
                //     callback: function(message){
                //         this.props.updateMarketPrice(message, this.props.marketPrice);
                //     },
                //     // params:{instanceId:this.props.strategyParam},
                //     scope: this
                // });
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

    OrderBookOutPut = (message) => {
        // console.log(moment(new Date()).format("MM/DD/YYYY HH:mm:ss:SSS"));
        if (this.props.strategyParam && this.props.strategyParam.instanceId && (message.generateBy == this.props.strategyParam.instanceId)) {
            // console.log("%c@@@@output","color:green",message);
            // console.log(message);
            let tmpdata = this.props.strategyParam;
            // tmpdata.marketBidPrice=tmpdata.marketBidOfferPrices[0];
            // tmpdata.marketOfferPrice =tmpdata.marketBidOfferPrices[1];
            tmpdata.quoteBidPrice = message.bidPxs[0];
            tmpdata.quoteOfferPrice = message.askPxs[0];
            tmpdata.quoteBidOfferPrice[0] = message.bidPxs[0];
            tmpdata.quoteBidOfferPrice[1] = message.askPxs[0];
            if (this.props.strategyParam.algo == "Manual") {
                if (!tmpdata.strategyScriptParams.bidPrice) {
                    tmpdata.strategyScriptParams.bidPrice = [];
                    tmpdata.strategyScriptParams.askPrice = [];
                }
                tmpdata.strategyScriptParams.bidQuantities && tmpdata.strategyScriptParams.bidQuantities.map((item, idx) => {
                    tmpdata.strategyScriptParams.bidPrice[idx] = formatStr(Number(formatNumber(tmpdata.quoteBidPrice) - sumNumber(tmpdata.strategyScriptParams.bidPricesStep, idx)) / 10000);
                    tmpdata.strategyScriptParams.askPrice[idx] = formatStr(Number(formatNumber(tmpdata.quoteOfferPrice) + sumNumber(tmpdata.strategyScriptParams.askPricesStep, idx)) / 10000);
                });
            }
            // console.log("%c@@@@quoteBidOfferPrice","color:green",tmpdata.quoteBidOfferPrice);
            tmpdata.status ="STARTED";
            //选择Top后老是切回Manual，所以把这里注释掉，不知道会不会有问题
            // this.props.save_Param(tmpdata,()=>{
            //     this.props.setCurrentStrategy(this.props.currentStrategy);
            // },);
        }

    }

    handleDistributionQuoteMessage = (message) => {
        // console.log(message);
        if (this.props.distributionList
            && this.props.distributionList.filter(item => item.id == message.generateBy).length > 0) {
            
            let distributionQuoteList = this.props.distributionQuoteList;
            // console.log(distributionQuoteList),message;
            let exists = false;
            for (let i = 0; i < distributionQuoteList.length; i++) {
                // console.log(distributionQuoteList[i],message);
                if (distributionQuoteList[i].generateBy == message.generateBy) {
                    // console.log(distributionQuoteList[i] , message);
                    distributionQuoteList[i] = message;
                    exists = true;
                }
            }
            if (!exists) {
                distributionQuoteList.push(message);
            }
            // console.log(distributionQuoteList);
            this.props.saveQuote(distributionQuoteList);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.strategyParam != this.props.strategyParam) {
            this.setState({ mktPxConfigId: nextProps.strategyParam.mktPxConfigId });
            this.props.getReferencePrice(undefined);
        }
    }

    componentWillUnmount() {
        WebSocketClient.unsubscribeMessage({ subscriptionId: this.subIdMarketPrice, mtype: ReferencePriceOutput });
        WebSocketClient.unsubscribeMessage({ subscriptionId: this.subInstance_update, mtype: MarketMakingInstanceOutput });
        WebSocketClient.unsubscribeMessage({ subscriptionId: this.orderBookId, mtype: orderbookWebSocket });
    }
    marketPriceCallback = (message, scope) => {
        //  console.log("%c@@@@@message","color:green",message);
        //  console.log("%c@@@@@message","color:green",this.props.paramReducer);
        // console.log(scope);
        if (this.state.mktPxConfigId && message.configId == this.state.mktPxConfigId) {
            this.props.getReferencePrice(message);
            // console.log("jrwjf");
        }

    }

    render() {
        const { Content } = Layout;
        const { showDetailPage } = this.props;
        // console.log(showDetailPage);
        return (
            <div style={{display:"flex",flex:1}}>
                {/* {showDetailPage ? <Index /> : <TabPage />} */}
                <Index />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    showDetailPage: state.marketDetail.showDetailPage,
    strategyParam: state.paramReducer.strategyParam,
    distributionList: state.Distribution && state.Distribution.distributionList,
    distributionQuoteList: state.Distribution && state.Distribution.distributionQuoteList,
    currentStrategy: state.currentStrategyReducer.currentStrategy,
    minTicks: state.globalReducer.minTicks,
    marketPrice: state.globalReducer.marketPrice,
});

const mapDispatchToProps = dispatch => ({
    // setTheme: (theme) => dispatch(setTheme(theme))
    checkLogin: (cb) => dispatch(checkLogin(cb)),
    getReferencePrice: (param) => dispatch(getReferencePrice(param)),
    getInstance_output: (param) => dispatch(getInstance_output(param)),
    save_socket: (param) => dispatch(save_socket(param)),
    save_Param: (param,cb) => dispatch(save_Param(param,cb)),
    saveQuote: (quoteList) => dispatch(saveQuote(quoteList)),
    setCurrentStrategy: (data) => dispatch(setCurrentStrategy(data)),
    updateMinTick: (message, minTicks) => dispatch(updateMinTick(message, minTicks)),
    updateMarketPrice: (message, marketPrice)=> dispatch(updateMarketPrice(message, marketPrice)),
    setSocketConnected: (params) => dispatch(setSocketConnected(params)),
});
export default connect(mapStateToProps, mapDispatchToProps)(MarketConfig);
