import { connect } from "react-redux";
import React, { Component } from "react";
import { Card } from "antd";
import AdjustBook from "./adjustBook";
import ManualBook from "./manualBook";
import ButtonBook from "./buttonBook";
import {formatStr,sumNumber,formatNumber} from "../../../utils/commonFun";
import {setCurrentStrategy} from "../../../actions/setCurrentStrategy";

class OrderBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStrategy:{
                // instanceId: "",
                // marketBidPrice: "",
                // marketOfferPrice: "",
                // marketSpread: "",
                // pnl: "",
                // quota: "",
                // quoteBidPrice: "",
                // quoteOfferPrice: "",
                // quoteSkew: "",
                // quoteSpread: "",
                // status: "",
                // strategyName: "",
                // strategyUserParams: {bidPricesStep: ["0", "1", "1", "1","1","1","1"],bidPrice:["6.5010","6.5009","6.5008","6.5007","6.5006","6.5005","6.5004"], bidQuantities: ["1", "2", "3", "4", "5","1","1"],askPricesStep: ["0", "2", "2", "2","2","2","2"],askQuantities: ["3", "4", "5", "6", "7","1","1"],askPrice:["6.5012","6.5014","6.5016","6.5018","6.5020","6.5022","6.5024"]},
                // symbols: "",
                // time: "",
                algo: "Manual",
                strategyScriptParams:{
                    askPricesStep: [],
                    askQuantities: [],
                    bidPricesStep: [],
                    bidPrice:[],
                    askPrice:[],
                    bidQuantities: [],
                },      
                displayName: "aq",
                duration: null,
                flag: null,
                groupId: null,
                groupName: null,
                instanceId: "MarketMaking.20190112162751117",
                instanceName: null,
                lastPrice: null,
                lastQty: null,
                lastSide: null,
                marketBidOfferPrices:[0, 0],
                marketBp: null,
                marketSpread: null,
                mktPxConfigId: 1,
                mtype: null,
                pnl: null,
                position: null,
                pricingListId: 49,
                quota: null,
                quoteBidOfferPrice:  [0, 0],
                quoteSkew: 0,
                quoteSpread: 0,
                retraceMax: null,
                status: "STOPPED",
                symbol: "USDCNY",
                time: "12:54:17",
                transTimesTotal: null,
                transTimesUnit: null,
                volatility: null,
                marketBidPrice:"",
                marketOfferPrice:"",
                quoteBidPrice:"",
                quoteOfferPrice:""
            },

        };
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.strategyParam!=this.props.strategyParam  ||(this.props.strategyParam &&nextProps.strategyParam.quoteBidOfferPrice!==this.props.strategyParam.quoteBidOfferPrice) ){
            let tmpdata  =nextProps.strategyParam;
            // if(tmpdata.marketBidOfferPrices&&tmpdata.marketBidOfferPrices.length&&tmpdata.quoteBidOfferPrice&&tmpdata.quoteBidOfferPrice.length){
            tmpdata.marketBidPrice=tmpdata.marketBidOfferPrices&&tmpdata.marketBidOfferPrices.length?tmpdata.marketBidOfferPrices[0]:0;
            tmpdata.marketOfferPrice =tmpdata.marketBidOfferPrices&&tmpdata.marketBidOfferPrices.length>1?tmpdata.marketBidOfferPrices[1]:0;
            tmpdata.quoteBidPrice =tmpdata.quoteBidOfferPrice&&tmpdata.quoteBidOfferPrice.length?tmpdata.quoteBidOfferPrice[0]:0;
            tmpdata.quoteOfferPrice =tmpdata.quoteBidOfferPrice&&tmpdata.quoteBidOfferPrice.length>1?tmpdata.quoteBidOfferPrice[1]:0;
            if(nextProps.strategyParam.algo=="Manual"){
                if (tmpdata.strategyScriptParams) {
                    if(!tmpdata.strategyScriptParams.bidPrice){
                        tmpdata.strategyScriptParams.bidPrice=[];
                        tmpdata.strategyScriptParams.askPrice=[];
                    }
                    tmpdata.strategyScriptParams.bidQuantities ? tmpdata.strategyScriptParams.bidQuantities.map((item,idx)=>{
                        tmpdata.strategyScriptParams.bidPrice[idx] =formatStr(Number(formatNumber(tmpdata.quoteBidPrice)-sumNumber(tmpdata.strategyScriptParams.bidPricesStep,idx))/10000);
                        tmpdata.strategyScriptParams.askPrice[idx] =formatStr(Number(formatNumber(tmpdata.quoteOfferPrice)+sumNumber(tmpdata.strategyScriptParams.askPricesStep,idx))/10000);
                    }) : [];
                    // tmpdata.strategyScriptParams.bidPrice=[tmpdata.quoteBidOfferPrice[0],tmpdata.quoteBidOfferPrice[0],tmpdata.quoteBidOfferPrice[0],tmpdata.quoteBidOfferPrice[0],tmpdata.quoteBidOfferPrice[0]];
                    // tmpdata.strategyScriptParams.askPrice=[tmpdata.quoteBidOfferPrice[1],tmpdata.quoteBidOfferPrice[1],tmpdata.quoteBidOfferPrice[1],tmpdata.quoteBidOfferPrice[1],tmpdata.quoteBidOfferPrice[1]];
                }
            }

            this.setState({ currentStrategy:tmpdata});

            this.props.setCurrentStrategy(tmpdata);
            // }
        }
        // if (nextProps.referencePriceData != this.props.referencePriceData){
        //     const {currentStrategy} =this.state;
        //     currentStrategy.quoteBidPrice =nextProps.referencePriceData.bidPxs[0];
        //     currentStrategy.quoteOfferPrice=nextProps.referencePriceData.askPxs[0];
        //     this.setState({currentStrategy:Object.assign({},currentStrategy)});
        // }
    }
    onChangeBidAsk =(data,cb) =>{
        // let newArr =[];
        // newArr.concat(data.);
        let param = Object.assign({}, data, { strategyScriptParams: data.strategyScriptParams });
        this.setState({currentStrategy:param});
        this.props.setCurrentStrategy(param);
    }

    onChangeCurrentStrategy =(data) =>{
        this.setState({currentStrategy:data});
        this.props.setCurrentStrategy(data);
    }

    handleRef = (thiz) => {
        this.ajustBook = thiz;
    }

    render() {
        return (
            // <Card title="Order Book">
            <Card size="small" style={{flex:11,fontSize:"12px",display:"flex",flexDirection:"column", minWidth: 350}} headStyle={{color:"#fff"}}
                title={<div>PRICING ALGO{this.props.btnIndex && " - " + this.props.btnIndex.name}</div>} bodyStyle={{overflow:"auto",display:"flex",flexDirection:"column",flex:1}}>
                {/* <div className="order-book-title">Order Book</div> */}
                <AdjustBook currentStrategyData={this.state.currentStrategy} handleRef={this.handleRef}/>
                <ManualBook ajustBook={this.ajustBook} changeBidAsk={this.onChangeBidAsk}/>
                <ButtonBook symbolList={this.props.symbolList} ajustBook={this.ajustBook}/>
            </Card>
            // </Card>
        );
    }
}

const mapStateToProps = state => ({
    strategyParam: state.paramReducer.strategyParam,
    currentStrategy: state.currentStrategyReducer,
    btnIndex:state.bookHeader.btnIndex,
    // referencePriceData: state.marketDetail.referencePriceData
});

const mapDispatchToProps = dispatch => ({
    setCurrentStrategy: (data) => dispatch(setCurrentStrategy(data))
});
export default connect(mapStateToProps, mapDispatchToProps)(OrderBook);