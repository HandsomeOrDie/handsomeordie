import { connect } from "react-redux";
import React, { Component } from "react";
import {Card, Row,Col, InputNumber, Checkbox, Button, Icon} from "antd";
import {formatStr,formatNumber,getSingleBid,
    getSpread, getDisplayBig, getDisplaySmall, getDisplaySmallRight,
    getSubtrctBid, getAddOfferPrice, getSubtrctOfferPrice,
    getDoubleDown, getDoubleLeft, getDoubleRight, getDoubleUp, getOffset
} from "../../../utils/commonFun";
import {setCurrentStrategy} from "../../../actions/setCurrentStrategy";
import {setApplyBtn} from "../../../actions/symbolList";
import {setOrderBookValue, saveMinTick} from "../../../actions/globalAction";
import {getCorePriceList} from "../../../actions/corePrice";

class AdjustBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSpreadBlur:false,
            currentStrategy:{},
            isFixed:true,
            spread: undefined,
            skew: undefined,
            quoteBidPrice: undefined,
            quoteOfferPrice: undefined,
            minTicks: {},
        };
        
    }
    // componentWillReceiveProps(nextProps){
    //     // console.log(nextProps.currentStrategy.currentStrategy);
    //     if(JSON.stringify(nextProps.currentStrategy.currentStrategy) !== JSON.stringify(this.state.currentStrategy)){
    //         // console.log(nextProps.currentStrategy.currentStrategy);
    //         this.setState({
    //             currentStrategy:nextProps.currentStrategy.currentStrategy
    //         });
    //     }
    // }

    // static getDerivedStateFromProps(nextProps,prevState){
    //     // console.log(nextProps.currentStrategy.currentStrategy);
    //     if ( nextProps.currentStrategy.currentStrategy && nextProps.currentStrategy.currentStrategy.mktPxConfigId !== prevState.currentStrategy.mktPxConfigId) {
    //         // nextProps.currentStrategy.currentStrategy["quoteSpreadFixed"] = true;
    //         console.log(1);
    //         return {
    //             currentStrategy: nextProps.currentStrategy.currentStrategy,
    //             isFixed: true,
    //             spread: undefined,
    //             skew: undefined,
    //         };
    //     }else {
    //         return {
    //             currentStrategy: nextProps.currentStrategy.currentStrategy,
    //             isFixed: true,
    //         };
    //     }
    //     return null;
    // }
    componentDidMount() {
        this.props.handleRef(this);
        this.props.getCorePriceList((result, data)=>{
            // console.log(result, data);
            let minTicks = {};
            data.map(item => {
                minTicks[item.id] = item.minTick;
            });
            this.props.saveMinTick(minTicks);
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            currentStrategy: nextProps.currentStrategy.currentStrategy,
            // isFixed: true,
            minTicks: nextProps.minTicks,
        });
        if (this.props.currentStrategy.currentStrategy && nextProps.currentStrategy.currentStrategy.mktPxConfigId !== this.props.currentStrategy.currentStrategy.mktPxConfigId){
            this.setState({
                spread: undefined,
                skew: undefined,
                quoteBidPrice: undefined,
                quoteOfferPrice: undefined,
                isSpreadBlur: false,
            });
        }
        // console.log("this.props.applyBtn:", this.props.applyBtn);
        if (this.props.applyBtn){
            this.setState({
                spread: undefined,
                skew: undefined,
                quoteBidPrice: undefined,
                quoteOfferPrice: undefined,
            });
            this.props.setApplyBtn(false);
        }
        // console.log(1);
        if (nextProps.currentStrategy.currentStrategy) {
            const currentStrategy = nextProps.currentStrategy.currentStrategy;
            // console.log("+++++", currentStrategy);
            let quoteSpread = typeof this.state.spread !== "undefined" ? this.state.spread : currentStrategy.quoteSpread;
            const skew = typeof this.state.skew !== "undefined" ? this.state.skew : currentStrategy.quoteSkew;
            const minTick = this.state.minTicks[currentStrategy.mktPxConfigId];
            const aclSpread = this.getSpread(quoteSpread, minTick);
            const aclSkew = this.getSpread(skew, minTick);
            let {quoteBidPrice, quoteOfferPrice, isFixed} = this.state;
            const offset = getOffset(minTick);
            let spreadR = aclSpread/2;
            // console.log("spreadR:", spreadR);
            // console.log("skew:", skew);
            if (isFixed && !(skew === 0 && quoteSpread === 0)){
                const marketPrice = currentStrategy.marketBidOfferPrices;
                const midMarketPrice = (marketPrice[0] + marketPrice[1])/2;
                quoteBidPrice = midMarketPrice + aclSkew * minTick - spreadR * minTick;
                quoteOfferPrice = midMarketPrice + aclSkew * minTick + spreadR * minTick;
            }else {
                const marketPrice = currentStrategy.marketBidOfferPrices;
                // console.log("marketPrice:", marketPrice);
                quoteBidPrice = marketPrice[0] + aclSkew * minTick - spreadR * minTick;
                quoteOfferPrice = marketPrice[1] + aclSkew * minTick + spreadR * minTick;
            }

            // console.log("quoteBidPrice:", quoteBidPrice);
            // console.log("quoteOfferPrice:", quoteOfferPrice);
            quoteBidPrice = Math.round((quoteBidPrice * offset) + minTick/10) / offset;
            quoteOfferPrice = Math.round((quoteOfferPrice * offset) + minTick/10) / offset;
            this.setState({quoteBidPrice, quoteOfferPrice});
            this.props.setOrderBookValue({quoteBidPrice, quoteOfferPrice});
        }
    }

    // addSingleBid = () => {
    //     let currentStrategy= this.props.currentStrategy.currentStrategy;
    //     // console.log("currentStrategy1：", currentStrategy);
    //     let {quoteBidPrice, quoteOfferPrice, isFixed} = this.state;
    //     quoteBidPrice = quoteBidPrice || currentStrategy.quoteBidPrice;
    //     quoteOfferPrice = quoteOfferPrice || currentStrategy.quoteOfferPrice;
    //     let spread = getSpread(quoteBidPrice, quoteOfferPrice, this.state.minTicks[currentStrategy.mktPxConfigId]);
    //     if (Math.round(spread)  > 1) {
    //         const minTick = this.state.minTicks[currentStrategy.mktPxConfigId];
    //         const offset = getOffset(minTick);
    //         quoteBidPrice = (quoteBidPrice * offset + 1) / offset;
    //         let quoteSpread = quoteOfferPrice * offset - quoteBidPrice * offset;
    //         quoteSpread = Math.round(quoteSpread);
    //         let quoteSkew;
    //         if (isFixed){
    //             //
    //             const marketPrice = currentStrategy.marketBidOfferPrices;
    //             const midMarketPrice = (marketPrice[0] + marketPrice[1])/2;
    //             quoteSkew = (quoteBidPrice - midMarketPrice + quoteSpread/2 * minTick) * offset;
    //         }else {
    //             const marketPrice = currentStrategy.marketBidOfferPrices;
    //             quoteSkew = (quoteBidPrice - marketPrice[0] - quoteSpread/2 * minTick) * offset;
    //         }
    //         quoteSkew = Math.round(quoteSkew * 10) / 10;
    //         this.setState({quoteBidPrice, quoteOfferPrice, spread: quoteSpread, skew: quoteSkew});
    //         this.props.setOrderBookValue({quoteBidPrice, quoteOfferPrice});
    //     } else {
    //         //
    //     }
    // }

    addSingleBid = () => {
        let currentStrategy= this.props.currentStrategy.currentStrategy;
        let {quoteBidPrice, quoteOfferPrice, skew, spread, isFixed} = this.state;
        const minTick = this.state.minTicks[currentStrategy.mktPxConfigId];
        const marketPrice = currentStrategy.marketBidOfferPrices;
        const offset = getOffset(minTick);
        spread = spread || currentStrategy.quoteSpread;
        let aclSpread;
        let minSpread = this.getMinSpread(minTick);
        if (spread === 0){
            aclSpread = (marketPrice[1] - marketPrice[0]) * offset - this.getSpread(1, minTick);
            if (aclSpread < 0){
                spread = minSpread;
                aclSpread = this.getSpread(spread, minTick);
            }else {
                aclSpread = Math.round(aclSpread);
                spread = this.getDisplaySpread(aclSpread, minTick);
            }
        }else {
            spread = spread - 1;
            if (spread < minSpread)
                spread = minSpread;
            spread = spread + 0.00001;
            spread = this.formatNum(spread, 1);
            aclSpread = this.getSpread(spread, minTick);
        }
        skew = (skew || currentStrategy.quoteSkew) + 0.5;
        // const aclSpread = this.getSpread(spread, minTick);
        const aclSkew = this.getSkew((skew || currentStrategy.quoteSkew) + 0.5, minTick);
        if (isFixed){
            const midMarketPrice = (marketPrice[0] + marketPrice[1])/2;
            quoteBidPrice = midMarketPrice + aclSkew * minTick - aclSpread/2 * minTick;
            quoteOfferPrice = midMarketPrice + aclSkew * minTick + aclSpread/2 * minTick;
        }else {
            const marketPrice = currentStrategy.marketBidOfferPrices;
            quoteBidPrice = marketPrice[0] + aclSkew * minTick - aclSpread/2 * minTick;
            quoteOfferPrice = marketPrice[1] + aclSkew * minTick + aclSpread /2 * minTick;
        }
        quoteBidPrice = Math.round((quoteBidPrice * offset) + minTick/10) / offset;
        quoteOfferPrice = Math.round((quoteOfferPrice * offset) + minTick/10) / offset;
        this.setState({quoteBidPrice, quoteOfferPrice, spread: spread, skew: skew});
        this.props.setOrderBookValue({quoteBidPrice, quoteOfferPrice});
    }
    // subtrctBid = () => {
    //     let currentStrategy= this.props.currentStrategy.currentStrategy;
    //     const minTick = this.state.minTicks[currentStrategy.mktPxConfigId];
    //     let {quoteBidPrice, quoteOfferPrice, isFixed} = this.state;
    //     quoteBidPrice = quoteBidPrice || currentStrategy.quoteBidPrice;
    //     quoteOfferPrice = quoteOfferPrice || currentStrategy.quoteOfferPrice;
    //     const offset = getOffset(minTick);
    //     quoteBidPrice = (quoteBidPrice * offset - 1) / offset;
    //     let quoteSpread = quoteOfferPrice * offset - quoteBidPrice * offset;
    //     quoteSpread = Math.round(quoteSpread);
    //     let quoteSkew;
    //     if (isFixed){
    //         const marketPrice = currentStrategy.marketBidOfferPrices;
    //         const midMarketPrice = (marketPrice[0] + marketPrice[1])/2;
    //         quoteSkew = (quoteBidPrice - midMarketPrice + quoteSpread/2 * minTick) * offset;
    //     }else {
    //         const marketPrice = currentStrategy.marketBidOfferPrices;
    //         quoteSkew = (quoteBidPrice - marketPrice[0] - quoteSpread/2 * minTick) * offset;
    //     }
    //     quoteSkew = Math.round(quoteSkew * 10) / 10;
    //     this.setState({quoteBidPrice, quoteOfferPrice, spread: quoteSpread, skew: quoteSkew});
    //     this.props.setOrderBookValue({quoteBidPrice, quoteOfferPrice});
    // };
    subtrctBid = () => {
        let currentStrategy= this.props.currentStrategy.currentStrategy;
        let {quoteBidPrice, quoteOfferPrice, skew, spread, isFixed} = this.state;
        const minTick = this.state.minTicks[currentStrategy.mktPxConfigId];
        const marketPrice = currentStrategy.marketBidOfferPrices;
        const offset = getOffset(minTick);
        spread = spread || currentStrategy.quoteSpread;
        let aclSpread;
        if (spread === 0){
            aclSpread = Math.round(this.getSpread(1, minTick) + (marketPrice[1] - marketPrice[0]) * offset);
        }else {
            spread = spread + 1;
            aclSpread = this.getSpread(spread, minTick);
        }
        const aclSkew = this.getSkew((skew || currentStrategy.quoteSkew) - 0.5, minTick);
        console.log(aclSpread);
        console.log(aclSkew);
        console.log(minTick);
        spread = this.getDisplaySpread(aclSpread, minTick);
        skew = (skew || currentStrategy.quoteSkew) - 0.5;
        if (isFixed){
            const midMarketPrice = (marketPrice[0] + marketPrice[1])/2;
            console.log(midMarketPrice);
            console.log(aclSpread/2 * minTick);
            console.log(aclSkew * minTick);
            quoteBidPrice = midMarketPrice + aclSkew * minTick - aclSpread/2 * minTick;
            quoteOfferPrice = midMarketPrice + aclSkew * minTick + aclSpread/2 * minTick;
        }else {
            quoteBidPrice = marketPrice[0] + aclSkew * minTick - aclSpread/2 * minTick;
            quoteOfferPrice = marketPrice[1] + aclSkew * minTick + aclSpread /2 * minTick;
        }
        console.log("quoteBidPrice:", quoteBidPrice);
        console.log("quoteOfferPrice:", quoteOfferPrice);
        quoteBidPrice = Math.round((quoteBidPrice * offset) + minTick/10) / offset;
        quoteOfferPrice = Math.round((quoteOfferPrice * offset) + minTick/10) / offset;
        this.setState({quoteBidPrice, quoteOfferPrice, spread: spread, skew: skew});
        this.props.setOrderBookValue({quoteBidPrice, quoteOfferPrice});


        // let currentStrategy= this.props.currentStrategy.currentStrategy;
        // let {quoteBidPrice, quoteOfferPrice, skew, spread, isFixed} = this.state;
        // const minTick = this.state.minTicks[currentStrategy.mktPxConfigId];
        // const offset = getOffset(minTick);
        // spread = (spread || currentStrategy.quoteSpread) + 1;
        // //实际的spread
        // const aclSpread = this.getSpread(spread, minTick, 10000);
        // skew = (skew || currentStrategy.quoteSkew) - 0.5;
        // if (isFixed){
        //     const marketPrice = currentStrategy.marketBidOfferPrices;
        //     const midMarketPrice = (marketPrice[0] + marketPrice[1])/2;
        //     quoteBidPrice = midMarketPrice + skew * minTick - aclSpread/2 * minTick;
        //     quoteOfferPrice = midMarketPrice + skew * minTick + aclSpread/2 * minTick;
        // }else {
        //     const marketPrice = currentStrategy.marketBidOfferPrices;
        //     quoteBidPrice = marketPrice[0] + skew * minTick - aclSpread/2 * minTick;
        //     quoteOfferPrice = marketPrice[1] + skew * minTick + aclSpread /2 * minTick;
        // }
        // quoteBidPrice = Math.round((quoteBidPrice * offset) + minTick/10) / offset;
        // quoteOfferPrice = Math.round((quoteOfferPrice * offset) + minTick/10) / offset;
        // this.setState({quoteBidPrice, quoteOfferPrice, spread: spread, skew: skew});
        // this.props.setOrderBookValue({quoteBidPrice, quoteOfferPrice});
    };

    // addOfferPrice = () => {
    //     let currentStrategy= this.props.currentStrategy.currentStrategy;
    //     let {quoteBidPrice, quoteOfferPrice, isFixed} = this.state;
    //     quoteBidPrice = quoteBidPrice || currentStrategy.quoteBidPrice;
    //     quoteOfferPrice = quoteOfferPrice || currentStrategy.quoteOfferPrice;
    //     let spread = getSpread(quoteBidPrice, quoteOfferPrice, this.state.minTicks[currentStrategy.mktPxConfigId]);
    //     if (Math.round(spread)  > 1) {
    //         const minTick = this.state.minTicks[currentStrategy.mktPxConfigId];
    //         const offset = getOffset(minTick);
    //         quoteOfferPrice = (quoteOfferPrice * offset + 1) / offset;
    //         let quoteSpread = quoteOfferPrice * offset - quoteBidPrice * offset;
    //         quoteSpread = Math.round(quoteSpread);
    //         let quoteSkew;
    //         if (isFixed){
    //             //
    //             const marketPrice = currentStrategy.marketBidOfferPrices;
    //             const midMarketPrice = (marketPrice[0] + marketPrice[1])/2;
    //             quoteSkew = (quoteBidPrice - midMarketPrice - quoteSpread/2 * minTick) * offset;
    //         }else {
    //             const marketPrice = currentStrategy.marketBidOfferPrices;
    //             quoteSkew = (quoteBidPrice - marketPrice[0] - quoteSpread/2 * minTick) * offset;
    //         }
    //         quoteSkew = Math.round(quoteSkew * 10) / 10;
    //         this.setState({quoteBidPrice, quoteOfferPrice, spread: quoteSpread, skew: quoteSkew});
    //         this.props.setOrderBookValue({quoteBidPrice, quoteOfferPrice});
    //     } else {
    //         //
    //     }
    // }
    addOfferPrice = () => {
        let currentStrategy= this.props.currentStrategy.currentStrategy;
        let {quoteBidPrice, quoteOfferPrice, skew, spread, isFixed} = this.state;
        const minTick = this.state.minTicks[currentStrategy.mktPxConfigId];
        const marketPrice = currentStrategy.marketBidOfferPrices;
        const offset = getOffset(minTick);
        spread = spread || currentStrategy.quoteSpread;
        let aclSpread;
        if (spread === 0){
            aclSpread = Math.round(this.getSpread(1, minTick) + (marketPrice[1] - marketPrice[0]) * offset);
        }else {
            spread = spread + 1;
            aclSpread = this.getSpread(spread, minTick);
        }
        const aclSkew = this.getSkew((skew || currentStrategy.quoteSkew) + 0.5, minTick);
        spread = this.getDisplaySpread(aclSpread, minTick);
        skew = (skew || currentStrategy.quoteSkew) + 0.5;
        if (isFixed){
            const midMarketPrice = (marketPrice[0] + marketPrice[1])/2;
            quoteBidPrice = midMarketPrice + aclSkew * minTick - aclSpread/2 * minTick;
            quoteOfferPrice = midMarketPrice + aclSkew * minTick + aclSpread/2 * minTick;
        }else {
            quoteBidPrice = marketPrice[0] + aclSkew * minTick - aclSpread/2 * minTick;
            quoteOfferPrice = marketPrice[1] + aclSkew * minTick + aclSpread /2 * minTick;
        }
        quoteBidPrice = Math.round((quoteBidPrice * offset) + minTick/10) / offset;
        quoteOfferPrice = Math.round((quoteOfferPrice * offset) + minTick/10) / offset;
        this.setState({quoteBidPrice, quoteOfferPrice, spread: spread, skew: skew});
        this.props.setOrderBookValue({quoteBidPrice, quoteOfferPrice});
    }
    // subtrctOfferPrice = () => {
    //     let currentStrategy= this.props.currentStrategy.currentStrategy;
    //     const minTick = this.state.minTicks[currentStrategy.mktPxConfigId];
    //     let {quoteBidPrice, quoteOfferPrice, isFixed} = this.state;
    //     quoteBidPrice = quoteBidPrice || currentStrategy.quoteBidPrice;
    //     quoteOfferPrice = quoteOfferPrice || currentStrategy.quoteOfferPrice;
    //     const offset = getOffset(minTick);
    //     quoteOfferPrice = (quoteOfferPrice * offset - 1) / offset;
    //     let quoteSpread = quoteOfferPrice * offset - quoteBidPrice * offset;
    //     quoteSpread = Math.round(quoteSpread);
    //     let quoteSkew;
    //     if (isFixed){
    //         //
    //         const marketPrice = currentStrategy.marketBidOfferPrices;
    //         const midMarketPrice = (marketPrice[0] + marketPrice[1])/2;
    //         quoteSkew = (quoteBidPrice - midMarketPrice - quoteSpread/2 * minTick) * offset;
    //     }else {
    //         const marketPrice = currentStrategy.marketBidOfferPrices;
    //         quoteSkew = (quoteBidPrice - marketPrice[0] - quoteSpread/2 * minTick) * offset;
    //     }
    //     quoteSkew = Math.round(quoteSkew * 10) / 10;
    //     this.setState({quoteBidPrice, quoteOfferPrice, spread: quoteSpread, skew: quoteSkew});
    //     this.props.setOrderBookValue({quoteBidPrice, quoteOfferPrice});
    // }
    subtrctOfferPrice = () => {
        let currentStrategy= this.props.currentStrategy.currentStrategy;
        let {quoteBidPrice, quoteOfferPrice, skew, spread, isFixed} = this.state;
        const minTick = this.state.minTicks[currentStrategy.mktPxConfigId];
        const marketPrice = currentStrategy.marketBidOfferPrices;
        const offset = getOffset(minTick);
        spread = spread || currentStrategy.quoteSpread;
        let aclSpread;
        let minSpread = this.getMinSpread(minTick);
        if (spread === 0){
            aclSpread = (marketPrice[1] - marketPrice[0]) * offset - this.getSpread(1, minTick);
            if (aclSpread < 0){
                spread = minSpread;
                aclSpread = this.getSpread(spread, minTick);
            }else {
                aclSpread = Math.round(aclSpread);
                spread = this.getDisplaySpread(aclSpread, minTick);
            }
        }else {
            spread = spread - 1;
            if (spread < minSpread)
                spread = minSpread;
            spread = spread + 0.00001;
            spread = this.formatNum(spread, 1);
            aclSpread = this.getSpread(spread, minTick);
        }
        const aclSkew = this.getSkew((skew || currentStrategy.quoteSkew) - 0.5, minTick);
        skew = (skew || currentStrategy.quoteSkew) - 0.5;
        if (isFixed){
            const midMarketPrice = (marketPrice[0] + marketPrice[1])/2;
            quoteBidPrice = midMarketPrice + aclSkew * minTick - aclSpread/2 * minTick;
            quoteOfferPrice = midMarketPrice + aclSkew * minTick + aclSpread/2 * minTick;
        }else {
            const marketPrice = currentStrategy.marketBidOfferPrices;
            quoteBidPrice = marketPrice[0] + aclSkew * minTick - aclSpread/2 * minTick;
            quoteOfferPrice = marketPrice[1] + aclSkew * minTick + aclSpread /2 * minTick;
        }
        quoteBidPrice = Math.round((quoteBidPrice * offset) + minTick/10) / offset;
        quoteOfferPrice = Math.round((quoteOfferPrice * offset) + minTick/10) / offset;
        this.setState({quoteBidPrice, quoteOfferPrice, spread: spread, skew: skew});
        this.props.setOrderBookValue({quoteBidPrice, quoteOfferPrice});
    }
    formatNum = (f, digit) => {
        var m = Math.pow(10, digit);
        return parseInt(f * m, 10) / m;
    }
    subtrctBidOffer = () => {
        let currentStrategy= this.props.currentStrategy.currentStrategy;
        let {quoteBidPrice, quoteOfferPrice, skew, spread, isFixed} = this.state;
        const minTick = this.state.minTicks[currentStrategy.mktPxConfigId];
        const marketPrice = currentStrategy.marketBidOfferPrices;
        const offset = getOffset(minTick);
        spread = spread || currentStrategy.quoteSpread;
        let aclSpread;
        if (spread === 0){
            aclSpread = (marketPrice[1] - marketPrice[0]) * offset;
            aclSpread = Math.round(aclSpread);
            spread = this.getDisplaySpread(aclSpread, minTick);
        }else {
            aclSpread = this.getSpread(spread, minTick);
        }
        const aclSkew = this.getSkew((skew || currentStrategy.quoteSkew) + 1, minTick);
        skew = (skew || currentStrategy.quoteSkew) + 1;
        if (isFixed){
            const midMarketPrice = (marketPrice[0] + marketPrice[1])/2;
            quoteBidPrice = midMarketPrice + aclSkew * minTick - aclSpread/2 * minTick;
            quoteOfferPrice = midMarketPrice + aclSkew * minTick + aclSpread/2 * minTick;
        }else {
            const marketPrice = currentStrategy.marketBidOfferPrices;
            quoteBidPrice = marketPrice[0] + aclSkew * minTick - aclSpread/2 * minTick;
            quoteOfferPrice = marketPrice[1] + aclSkew * minTick + aclSpread /2 * minTick;
        }
        quoteBidPrice = Math.round((quoteBidPrice * offset) + minTick/10) / offset;
        quoteOfferPrice = Math.round((quoteOfferPrice * offset) + minTick/10) / offset;
        this.setState({quoteBidPrice, quoteOfferPrice, spread: spread, skew: skew});
        this.props.setOrderBookValue({quoteBidPrice, quoteOfferPrice});
    }

    addBidOff = () => {
        let currentStrategy= this.props.currentStrategy.currentStrategy;
        let {quoteBidPrice, quoteOfferPrice, skew, spread, isFixed} = this.state;
        const minTick = this.state.minTicks[currentStrategy.mktPxConfigId];
        const marketPrice = currentStrategy.marketBidOfferPrices;
        const offset = getOffset(minTick);
        spread = spread || currentStrategy.quoteSpread;
        let aclSpread;
        if (spread === 0){
            aclSpread = (marketPrice[1] - marketPrice[0]) * offset;
            aclSpread = Math.round(aclSpread);
            spread = this.getDisplaySpread(aclSpread, minTick);
        }else {
            aclSpread = this.getSpread(spread, minTick);
        }
        const aclSkew = this.getSkew((skew || currentStrategy.quoteSkew) - 1, minTick);
        skew = (skew || currentStrategy.quoteSkew) - 1;
        if (isFixed){
            const midMarketPrice = (marketPrice[0] + marketPrice[1])/2;
            quoteBidPrice = midMarketPrice + aclSkew * minTick - aclSpread/2 * minTick;
            quoteOfferPrice = midMarketPrice + aclSkew * minTick + aclSpread/2 * minTick;
        }else {
            const marketPrice = currentStrategy.marketBidOfferPrices;
            quoteBidPrice = marketPrice[0] + aclSkew * minTick - aclSpread/2 * minTick;
            quoteOfferPrice = marketPrice[1] + aclSkew * minTick + aclSpread /2 * minTick;
        }
        quoteBidPrice = Math.round((quoteBidPrice * offset) + minTick/10) / offset;
        quoteOfferPrice = Math.round((quoteOfferPrice * offset) + minTick/10) / offset;
        this.setState({quoteBidPrice, quoteOfferPrice, spread: spread, skew: skew});
        this.props.setOrderBookValue({quoteBidPrice, quoteOfferPrice});
    }
    addDouble = () => {
        let currentStrategy= this.props.currentStrategy.currentStrategy;
        let {quoteBidPrice, quoteOfferPrice, skew, spread, isFixed} = this.state;
        const minTick = this.state.minTicks[currentStrategy.mktPxConfigId];
        const marketPrice = currentStrategy.marketBidOfferPrices;
        console.log("marketPrice:", marketPrice);
        const offset = getOffset(minTick);
        spread = spread || currentStrategy.quoteSpread;
        let aclSpread;
        if (spread === 0){
            aclSpread = (marketPrice[1] - marketPrice[0]) * offset + this.getSpread(2, minTick);
            aclSpread = Math.round(aclSpread);
            console.log("aclSpread:", aclSpread);
            spread = this.getDisplaySpread(aclSpread, minTick);
        }else {
            spread = spread + 2;
            aclSpread = this.getSpread(spread, minTick);
        }
        console.log("skew: ", skew || currentStrategy.quoteSkew);
        const aclSkew = this.getSkew((skew || currentStrategy.quoteSkew), minTick);
        console.log("aclSkew:", aclSkew);
        if (isFixed){
            let midMarketPrice = (marketPrice[0] + marketPrice[1])/2;
            console.log("midMarketPrice:", midMarketPrice);
            console.log("aclSkew * minTick", aclSkew * minTick);
            console.log("aclSpread/2 * minTick", aclSpread/2 * minTick);
            quoteBidPrice = midMarketPrice + aclSkew * minTick - aclSpread/2 * minTick;
            quoteOfferPrice = midMarketPrice + aclSkew * minTick + aclSpread/2 * minTick;
        }else {
            const marketPrice = currentStrategy.marketBidOfferPrices;
            quoteBidPrice = marketPrice[0] + aclSkew * minTick - aclSpread/2 * minTick;
            quoteOfferPrice = marketPrice[1] + aclSkew * minTick + aclSpread /2 * minTick;
        }
        quoteBidPrice = Math.round((quoteBidPrice * offset) + minTick/10) / offset;
        quoteOfferPrice = Math.round((quoteOfferPrice * offset) + minTick/10) / offset;
        this.setState({quoteBidPrice, quoteOfferPrice, spread: spread, skew: skew});
        this.props.setOrderBookValue({quoteBidPrice, quoteOfferPrice});
    }
    getMinSpread = (minTick) => {
        let displayQty = 10000;
        let currentStrategy = this.props.currentStrategy.currentStrategy;
        if (currentStrategy) {
            const symbol = currentStrategy.symbol;
            if (symbol === "USDJPY" || symbol === "EURJPY" || symbol.indexOf(".") !== -1) {
                displayQty = 100;
            }
            const offset = getOffset(minTick);
            return displayQty/offset;
        }
    }
    subtrctDouble = () => {
        let currentStrategy= this.props.currentStrategy.currentStrategy;
        let {quoteBidPrice, quoteOfferPrice, skew, spread, isFixed} = this.state;
        const minTick = this.state.minTicks[currentStrategy.mktPxConfigId];
        const marketPrice = currentStrategy.marketBidOfferPrices;
        // console.log("marketPrice:", marketPrice);
        const offset = getOffset(minTick);
        spread = spread || currentStrategy.quoteSpread;
        let aclSpread;
        const minSpread = this.getMinSpread(minTick);
        if (spread === 0){
            aclSpread = (marketPrice[1] - marketPrice[0]) * offset - this.getSpread(1, minTick);
            if (aclSpread < 0){
                spread = minSpread;
                aclSpread = this.getSpread(spread, minTick);
            }else {
                aclSpread = Math.round(aclSpread);
                spread = this.getDisplaySpread(aclSpread, minTick);
            }
        }else {
            spread = spread - 2;
            console.log(spread);
            console.log(minSpread);
            if (spread < minSpread)
                spread = minSpread;
            spread = spread + 0.00001;
            spread = this.formatNum(spread, 1);
            aclSpread = this.getSpread(spread, minTick);
        }
        const aclSkew = this.getSkew((skew || currentStrategy.quoteSkew), minTick);
        if (isFixed){
            let midMarketPrice = (marketPrice[0] + marketPrice[1])/2;
            console.log("midMarketPrice:", midMarketPrice);
            console.log("aclSkew * minTick", aclSkew * minTick);
            console.log("aclSpread/2 * minTick", aclSpread/2 * minTick);
            quoteBidPrice = midMarketPrice + aclSkew * minTick - aclSpread/2 * minTick;
            quoteOfferPrice = midMarketPrice + aclSkew * minTick + aclSpread/2 * minTick;
        }else {
            const marketPrice = currentStrategy.marketBidOfferPrices;
            quoteBidPrice = marketPrice[0] + aclSkew * minTick - aclSpread/2 * minTick;
            quoteOfferPrice = marketPrice[1] + aclSkew * minTick + aclSpread /2 * minTick;
        }
        quoteBidPrice = Math.round((quoteBidPrice * offset) + minTick/10) / offset;
        quoteOfferPrice = Math.round((quoteOfferPrice * offset) + minTick/10) / offset;
        this.setState({quoteBidPrice, quoteOfferPrice, spread: spread, skew: skew});
        this.props.setOrderBookValue({quoteBidPrice, quoteOfferPrice});
    }
    onChangeSpread = (value) => {
        if (typeof value === "string"){
            return;
        }
        let currentStrategy= this.props.currentStrategy.currentStrategy;
        const minTick = this.state.minTicks[currentStrategy.mktPxConfigId];
        let {quoteBidPrice, quoteOfferPrice, spread, skew, isFixed} = this.state;
        skew = skew || currentStrategy.quoteSkew;
        const marketPrice = currentStrategy.marketBidOfferPrices;
        const offset = getOffset(minTick);
        // let quoteSpread = Math.round(value);
        console.log(currentStrategy.quoteSpread);
        //当spread为空时，调上下按钮的计算方式
        if (currentStrategy.quoteSpread === 0){
            if (value === 0 && !spread) {
                value = (marketPrice[1] - marketPrice[0]) * offset;
                value = this.getDisplaySpread(value, minTick) - 1;
            }else if (value === 1 && !spread) {
                value = (marketPrice[1] - marketPrice[0]) * offset;
                value = this.getDisplaySpread(value, minTick) + 1;
            }
        }
        if (value <= 0){
            value = this.getMinSpread(minTick);
        }
        value = value + 0.00001;
        value = this.formatNum(value, 1);
        console.log(value);
        let quoteSpread = this.getSpread(value, minTick);
        console.log("quoteSpread: ", quoteSpread);

        if (value + "" === "NaN"){
            return;
        }
        if (isFixed && !(skew === 0 && quoteSpread === 0)){
            //
            let spreadR = quoteSpread/2;
            const midMarketPrice = (marketPrice[0] + marketPrice[1])/2;
            quoteBidPrice = midMarketPrice + skew * minTick - spreadR * minTick;
            quoteOfferPrice = midMarketPrice + skew * minTick + spreadR * minTick;
        }else {
            // const marketPrice = currentStrategy.marketBidOfferPrices;
            quoteBidPrice = marketPrice[0] + skew * minTick - quoteSpread/2 * minTick;
            quoteOfferPrice = marketPrice[1] + skew * minTick + quoteSpread /2 * minTick;
        }

        quoteBidPrice = Math.round((quoteBidPrice * offset) + minTick/10) / offset;
        quoteOfferPrice = Math.round((quoteOfferPrice * offset) + minTick/10) / offset;
        this.setState({quoteBidPrice, quoteOfferPrice, spread: value});
        this.props.setOrderBookValue({quoteBidPrice, quoteOfferPrice});
    }

    getSpread = (spread, minTick) => {
        let displayQty = 10000;
        let currentStrategy = this.props.currentStrategy.currentStrategy;
        if (currentStrategy) {
            const symbol = currentStrategy.symbol;
            if (symbol === "USDJPY" || symbol === "EURJPY" || symbol.indexOf(".") !== -1) {
                displayQty = 100;
            }
            const offset = getOffset(minTick);
            return offset / displayQty * spread;
        }
    }
    getSkew = (skew, minTick) => {
        let displayQty = 10000;
        let currentStrategy = this.props.currentStrategy.currentStrategy;
        if (currentStrategy) {
            const symbol = currentStrategy.symbol;
            if (symbol === "USDJPY" || symbol === "EURJPY" || symbol.indexOf(".") !== -1) {
                displayQty = 100;
            }
            const offset = getOffset(minTick);
            return offset / displayQty * skew;
        }
    }
    getDisplaySpread = (aclSpread, minTick)=>{
        let displayQty = 10000;
        let currentStrategy = this.props.currentStrategy.currentStrategy;
        if (currentStrategy) {
            const symbol = currentStrategy.symbol;
            if (symbol === "USDJPY" || symbol === "EURJPY" || symbol.indexOf(".") !== -1) {
                displayQty = 100;
            }
            const offset = getOffset(minTick);
            return aclSpread /(offset/displayQty) ;
        }
    }

    onChangeSkew = (value) => {
        if (typeof value === "string"){
            return;
        }
        if (typeof value === "undefined"){
            value = 0;
        }
        // return;
        let currentStrategy= this.props.currentStrategy.currentStrategy;
        const minTick = this.state.minTicks[currentStrategy.mktPxConfigId];
        let {quoteBidPrice, quoteOfferPrice, spread, isFixed} = this.state;
        spread = spread || currentStrategy.quoteSpread;
        spread = this.getSpread(spread, minTick, 10000);
        const offset = getOffset(minTick);
        let quoteSkew = value;
        let spreadR = spread/2;
        if (isFixed && !(quoteSkew === 0 && spread === 0)){
            //
            const marketPrice = currentStrategy.marketBidOfferPrices;
            const midMarketPrice = (marketPrice[0] + marketPrice[1])/2;
            const skewMin = quoteSkew * minTick;
            const spreadMin = spreadR * minTick;
            quoteBidPrice = midMarketPrice + skewMin - spreadMin;
            quoteOfferPrice = midMarketPrice + skewMin + spreadMin;
        }else {
            const marketPrice = currentStrategy.marketBidOfferPrices;
            quoteBidPrice = marketPrice[0] + quoteSkew * minTick - spreadR * minTick;
            quoteOfferPrice = marketPrice[1] + quoteSkew * minTick + spreadR * minTick;
        }
        quoteBidPrice = Math.round((quoteBidPrice * offset) + minTick/10) / offset;
        quoteOfferPrice = Math.round((quoteOfferPrice * offset) + minTick/10) / offset;
        quoteSkew = Math.ceil(quoteSkew * 10) / 10;
        this.setState({quoteBidPrice, quoteOfferPrice, skew: quoteSkew});
        this.props.setOrderBookValue({quoteBidPrice, quoteOfferPrice});

    }
    spreadBlur =()=>{
        // this.setState({isSpreadBlur:false});
    }
    spreadFocus =() =>{
        let currentStrategy = this.props.currentStrategy.currentStrategy;
        if (currentStrategy) {
            const minTick = this.state.minTicks[currentStrategy.mktPxConfigId];
            const marketPrice = currentStrategy.marketBidOfferPrices;
            const offset = getOffset(minTick);
            const stateSpread = this.state.spread;
            if (marketPrice && marketPrice[0] === 0 && marketPrice[1] === 0){
                return;
            }
            if (!stateSpread && !currentStrategy.quoteSpread) {
                let spread = marketPrice[1] - marketPrice[0];
                spread = Math.round(spread * offset) / offset;
                let displaySpread = this.getDisplaySpread(spread * offset, minTick);
                displaySpread = Math.round((displaySpread + 0.01) * 10)/10;
                this.setState({isSpreadBlur: true, spread: displaySpread});
            }
        }
    }
    skewBlur =() =>{
        this.setState({isSkew:false});
    }
    skewFocus =() =>{
        this.setState({isSkew:true});
    }
    onChangeFixed =()=>{
        const {isFixed} =this.state;
        // let {currentStrategy} = this.props.currentStrategy;
        this.setState({isFixed:!isFixed},()=>{
            const currentStrategy = this.props.currentStrategy.currentStrategy;
            let quoteSpread = typeof this.state.spread !== "undefined" ? this.state.spread : currentStrategy.quoteSpread;
            let skew = typeof this.state.skew !== "undefined" ? this.state.skew : currentStrategy.quoteSkew;

            const minTick = this.state.minTicks[currentStrategy.mktPxConfigId];
            let {quoteBidPrice, quoteOfferPrice, isFixed} = this.state;
            const offset = getOffset(minTick);
            let spread;
            if (isFixed) {
                spread = quoteSpread + currentStrategy.marketSpread;
            }else {
                spread = quoteSpread - currentStrategy.marketSpread;
            }
            console.log("currentStrategy.marketSpread:", currentStrategy.marketSpread);
            console.log("sprea: ", spread);
            if (spread <= 0){
                // spread = this.getMinSpread(minTick);
                spread = 1;
            }
            spread = spread + 0.00001;
            spread = this.formatNum(spread, 1);

            quoteSpread = this.getSpread(spread, minTick);
            skew = this.getSkew(skew, minTick);
            if (isFixed && !(skew === 0 && quoteSpread === 0)){
                let spreadR = quoteSpread/2;
                const marketPrice = currentStrategy.marketBidOfferPrices;
                const midMarketPrice = (marketPrice[0] + marketPrice[1])/2;
                quoteBidPrice = midMarketPrice + skew * minTick - spreadR * minTick;
                quoteOfferPrice = midMarketPrice + skew * minTick + spreadR * minTick;
            }else {
                const marketPrice = currentStrategy.marketBidOfferPrices;
                quoteBidPrice = marketPrice[0] + skew * minTick - quoteSpread/2 * minTick;
                quoteOfferPrice = marketPrice[1] + skew * minTick + quoteSpread /2 * minTick;
            }

            quoteBidPrice = Math.round((quoteBidPrice * offset) + minTick/10) / offset;
            quoteOfferPrice = Math.round((quoteOfferPrice * offset) + minTick/10) / offset;
            console.log("quoteBidPrice:", quoteBidPrice);
            this.setState({quoteBidPrice, quoteOfferPrice, spread: spread});
            this.props.setOrderBookValue({quoteBidPrice, quoteOfferPrice});
        });
    }

    render() {

        let {isFixed,currentStrategy, quoteBidPrice, quoteOfferPrice, isSpreadBlur} =this.state;
        currentStrategy = currentStrategy || {};
        let minTicks = this.state.minTicks;
        const minTick = minTicks[currentStrategy.mktPxConfigId];
        // console.log(currentStrategy);
        const currentBtnStatus = this.props.btnIndex;
        let spread = typeof this.state.spread === "undefined" ?  currentStrategy && currentStrategy.quoteSpread : this.state.spread;
        if (spread === 0 && !isSpreadBlur){
            spread = "";
        }
        return (
            <div>
                <Row type="flex" justify="space-between" align="bottom" className="adjust-price">
                    <Col span={3} className="adjust-price-1"><div className="adjust-price-single-left"><div onClick={this.addSingleBid}>︿</div><div onClick={this.subtrctBid}>﹀</div></div></Col>
                    <Col span={7} className="adjust-bidprice">
                        <div>{minTick && currentStrategy.status === "STARTED" ? getDisplaySmall(quoteBidPrice || currentStrategy.quoteBidPrice, minTick) : "--"}</div>
                        <div className="adjust-price-large-left "><div>Bid</div><div  >{minTick && currentStrategy.status === "STARTED" ? getDisplayBig(quoteBidPrice || currentStrategy.quoteBidPrice, minTick) : "--"}</div></div>
                        <div>{minTick && currentStrategy.status === "STARTED" ? getDisplaySmallRight(quoteBidPrice || currentStrategy.quoteBidPrice, minTick) : "--"}</div>
                    </Col>
                    <Col span={4} style={{marginBottom:10}} className="adjust-price-center">
                        <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                            <div style={{flex:1}} onClick={this.subtrctBidOffer}>〈</div>
                            <div style={{flex:1,margin:"0 5px"}}><div onClick={this.addDouble}>︿</div><div onClick={this.subtrctDouble}>﹀</div></div>
                            <div style={{flex:1}} onClick={this.addBidOff}>〉</div>
                        </div>
                    </Col>
                    <Col span={7} className="adjust-askprice">
                        <div>{minTick && currentStrategy.status === "STARTED" ? getDisplaySmall(quoteOfferPrice || currentStrategy.quoteOfferPrice, minTick) : "--"}</div>
                        <div className="adjust-price-large-right "><div>Ask</div><div>{minTick && currentStrategy.status === "STARTED" ? getDisplayBig(quoteOfferPrice || currentStrategy.quoteOfferPrice, minTick) : "--"}</div></div>
                        <div>{minTick && currentStrategy.status === "STARTED" ? getDisplaySmallRight(quoteOfferPrice || currentStrategy.quoteOfferPrice, minTick) : "--"}</div>

                        {/*<div><div>{currentStrategy && currentStrategy.quoteBidOfferPrice instanceof Array && currentStrategy.quoteBidOfferPrice[1]!==0?formatStr(currentStrategy.quoteBidOfferPrice[1].toString()).slice(0, 4):"0.00"}</div></div>*/}
                        {/*<div className="adjust-price-large-right"><div>Ask</div><div >{currentStrategy && currentStrategy.quoteOfferPrice?formatStr(currentStrategy.quoteOfferPrice.toString()).slice(-2):"00"}</div></div></Col>    */}
                    </Col>
                    <Col span={3} className="adjust-price-1"><Icon type="sync" onClick={()=>{
                        this.setState({
                            spread: undefined,
                            skew: undefined,
                            quoteBidPrice: undefined,
                            quoteOfferPrice: undefined,
                            isSpreadBlur: false,
                        });
                    }}/><div className="adjust-price-single-left"><div onClick={this.addOfferPrice} >︿</div><div onClick={this.subtrctOfferPrice}>﹀</div></div></Col>
                </Row>
                <div style={{display:"flex"}} className="spread-flexd-skew">
                    <div style={{flex:1,display:"flex",alignContent:"center"}}>
                        <span style={{flex:1,maxWidth:50,lineHeight:"24px"}}>{this.state.isFixed ? "Spread" : "+Spread"}</span>
                        <InputNumber type={"number"} style={{flex:1}} min={0} step={1} value={spread} onBlur={this.spreadBlur} onFocus={this.spreadFocus} onChange={this.onChangeSpread} size="small"/>
                    </div>
                    <div style={{flex:1,display:"flex",justifyContent:"center",minWidth:66}}><Checkbox ref="fixedCheck" onClick={this.onChangeFixed} checked={isFixed}>Fixed</Checkbox></div>
                    <div style={{flex:1,display:"flex",alignContent:"center"}}><span style={{flex:1,maxWidth:50,lineHeight:"24px"}}>Skew</span>
                        <InputNumber type={"number"} style={{flex:1}} step={1} value={typeof this.state.skew === "undefined" ?  currentStrategy && currentStrategy.quoteSkew : this.state.skew } onBlur={this.skewBlur} onFocus={this.skewFocus} onChange={this.onChangeSkew} size="small"/></div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    applyBtn: state.SymbolListReducer.applyBtn,
    currentStrategy: state.currentStrategyReducer,
    minTicks: state.globalReducer.minTicks,
    btnIndex:state.bookHeader.btnIndex,
});

const mapDispatchToProps = dispatch => ({
    // setTheme: (theme) => dispatch(setTheme(theme))
    setCurrentStrategy: (data) => dispatch(setCurrentStrategy(data)),
    setApplyBtn: (bool) => dispatch(setApplyBtn(bool)),
    setOrderBookValue: (params) => dispatch(setOrderBookValue(params)),
    getCorePriceList:(cb)=>dispatch(getCorePriceList(cb)),
    saveMinTick: (minTicks)=>dispatch(saveMinTick(minTicks)),
});
export default connect(mapStateToProps, mapDispatchToProps)(AdjustBook);