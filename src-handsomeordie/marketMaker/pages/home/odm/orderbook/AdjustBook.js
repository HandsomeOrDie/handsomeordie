import React from "react";
import {InputNumber, Checkbox, Statistic, Button, } from "antd/lib/index";
import "../../../../../common/styles/home/ODM/orderBook.scss";
import {getOffset, getPixs} from "../../../../utils/commonFun";
import {getInstance, updateOrderBookList} from "../../../../actions/spdb/odmAction";
import {connect} from "react-redux";
import {setOrderBookValue} from "../../../../actions/globalAction";
class AdjustBook extends React.Component {
    state = {
        spread: undefined,
        skew: undefined,
        quoteBidPrice: undefined,
        quoteOfferPrice: undefined,
        isFixed: true,
        isSpreadBlur: false,
        marketBidOfferPrices: undefined,
    }

    componentDidMount() {
        this.props.setAdjustState(this);
        const instance = this.props.instance;
        if (instance){
            this.setState({
                spread: instance.quoteSpread,
                skew: instance.quoteSkew,
                quoteBidPrice: instance.marketBidOfferPrices[0],
                quoteOfferPrice: instance.marketBidOfferPrices[1],
                marketBidOfferPrices: instance.marketBidOfferPrices,
            });
            const orderBook = this.props.orderBook;
            orderBook[instance.instanceId] = {
                quoteBidPrice: instance.marketBidOfferPrices[0],
                quoteOfferPrice: instance.marketBidOfferPrices[1],
            };
            this.props.setOrderBookValue(orderBook);
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const instance = this.props.instance;
        const mkData = nextProps.mkData;

        // let marketPrice;
        // let flag = false;
        // if (instance && !mkData[instance.instanceId]){
        //     marketPrice = instance.marketBidOfferPrices;
        //     if (JSON.stringify())
        // }else if (instance && mkData[instance.instanceId] && JSON.stringify(this.state.marketBidOfferPrices) !== JSON.stringify(mkData[instance.instanceId].marketBidOfferPrices)) {
        //     flag = true;
        //     marketPrice = mkData[instance.instanceId] && mkData[instance.instanceId].marketBidOfferPrices;
        // }
        if (instance) {
            let marketPrice = mkData && mkData[instance.instanceId] && mkData[instance.instanceId].marketBidOfferPrices || instance.marketBidOfferPrices;
            if (JSON.stringify(marketPrice) !== JSON.stringify(this.state.marketBidOfferPrices)) {
                let quoteSpread = typeof this.state.spread !== "undefined" ? this.state.spread : instance.quoteSpread;
                const skew = typeof this.state.skew !== "undefined" ? this.state.skew : instance.quoteSkew;
                const minTick = instance.minTick;
                const aclSpread = this.getSpread(quoteSpread, minTick);
                const aclSkew = this.getSpread(skew, minTick);
                let {quoteBidPrice, quoteOfferPrice, isFixed} = this.state;
                const offset = getOffset(minTick);
                let spreadR = aclSpread / 2;

                if (isFixed && !(skew === 0 && quoteSpread === 0)) {
                    const midMarketPrice = (marketPrice[0] + marketPrice[1]) / 2;
                    quoteBidPrice = midMarketPrice + aclSkew * minTick - spreadR * minTick;
                    quoteOfferPrice = midMarketPrice + aclSkew * minTick + spreadR * minTick;
                } else {
                    quoteBidPrice = marketPrice[0] + aclSkew * minTick - spreadR * minTick;
                    quoteOfferPrice = marketPrice[1] + aclSkew * minTick + spreadR * minTick;
                }

                quoteBidPrice = Math.round((quoteBidPrice * offset) + minTick / 10) / offset;
                quoteOfferPrice = Math.round((quoteOfferPrice * offset) + minTick / 10) / offset;
                this.setState({
                    quoteBidPrice,
                    quoteOfferPrice,
                    marketBidOfferPrices: marketPrice,
                });
                const orderBook = this.props.orderBook;
                orderBook[instance.instanceId] = {
                    quoteBidPrice,
                    quoteOfferPrice,
                };
                this.props.setOrderBookValue(orderBook);
            }
        }
        // if (instance && JSON.stringify(this.props.instance.marketBidOfferPrices) !== JSON.stringify(nextProps.instance.marketBidOfferPrices)) {
        //     this.setState({
        //         quoteBidPrice: instance.marketBidOfferPrices[0],
        //         quoteOfferPrice: instance.marketBidOfferPrices[1],
        //     });
        //     const orderBook = this.props.orderBook;
        //     orderBook[instance.instanceId] = {
        //         quoteBidPrice: instance.marketBidOfferPrices[0],
        //         quoteOfferPrice: instance.marketBidOfferPrices[1],
        //     };
        //     this.props.setOrderBookValue(orderBook);
        // }
    }

    addLeftBid = () => {
        let instance = this.props.instance;
        if (instance) {
            let {quoteBidPrice, quoteOfferPrice, skew, spread, isFixed} = this.state;
            const minTick = instance.minTick;
            // const mkData = this.props.mkData;
            // let marketPrice = mkData[instance.instanceId] && mkData[instance.instanceId].marketBidOfferPrices || instance.marketBidOfferPrices;
            let marketPrice = this.state.marketBidOfferPrices;
            const offset = getOffset(minTick);
            spread = spread || instance.quoteSpread;
            let aclSpread;
            let minSpread = this.getMinSpread(minTick);
            if (spread === 0) {
                aclSpread = (marketPrice[1] - marketPrice[0]) * offset - this.getSpread(1, minTick);
                if (aclSpread < 0) {
                    spread = minSpread;
                    aclSpread = this.getSpread(spread, minTick);
                } else {
                    aclSpread = Math.round(aclSpread);
                    spread = this.getDisplaySpread(aclSpread, minTick);
                }
            } else {
                spread = spread - 1;
                if (spread < minSpread)
                    spread = minSpread;
                spread = spread + 0.00001;
                spread = this.formatNum(spread, 1);
                aclSpread = this.getSpread(spread, minTick);
            }
            skew = (skew || instance.quoteSkew) + 0.5;
            const aclSkew = this.getSkew((skew || instance.quoteSkew) + 0.5, minTick);
            if (isFixed) {
                const midMarketPrice = (marketPrice[0] + marketPrice[1]) / 2;
                quoteBidPrice = midMarketPrice + aclSkew * minTick - aclSpread / 2 * minTick;
                quoteOfferPrice = midMarketPrice + aclSkew * minTick + aclSpread / 2 * minTick;
            } else {
                quoteBidPrice = marketPrice[0] + aclSkew * minTick - aclSpread / 2 * minTick;
                quoteOfferPrice = marketPrice[1] + aclSkew * minTick + aclSpread / 2 * minTick;
            }
            quoteBidPrice = Math.round((quoteBidPrice * offset) + minTick / 10) / offset;
            quoteOfferPrice = Math.round((quoteOfferPrice * offset) + minTick / 10) / offset;
            this.setState({quoteBidPrice, quoteOfferPrice, spread: spread, skew: skew});
            const orderBook = this.props.orderBook;
            orderBook[instance.instanceId] = {quoteBidPrice, quoteOfferPrice};
            this.props.setOrderBookValue({...orderBook});
        }
    }

    subLeftBid = () => {
        let instance = this.props.instance;
        if (instance) {
            let {quoteBidPrice, quoteOfferPrice, skew, spread, isFixed} = this.state;
            const minTick = instance.minTick;
            // const mkData = this.props.mkData;
            // let marketPrice = mkData[instance.instanceId] && mkData[instance.instanceId].marketBidOfferPrices || instance.marketBidOfferPrices;
            let marketPrice = this.state.marketBidOfferPrices;
            const offset = getOffset(minTick);
            spread = spread || instance.quoteSpread;
            let aclSpread;
            if (spread === 0) {
                aclSpread = Math.round(this.getSpread(1, minTick) + (marketPrice[1] - marketPrice[0]) * offset);
            } else {
                spread = spread + 1;
                aclSpread = this.getSpread(spread, minTick);
            }
            const aclSkew = this.getSkew((skew || instance.quoteSkew) - 0.5, minTick);
            spread = this.getDisplaySpread(aclSpread, minTick);
            skew = (skew || instance.quoteSkew) - 0.5;
            if (isFixed) {
                const midMarketPrice = (marketPrice[0] + marketPrice[1]) / 2;
                quoteBidPrice = midMarketPrice + aclSkew * minTick - aclSpread / 2 * minTick;
                quoteOfferPrice = midMarketPrice + aclSkew * minTick + aclSpread / 2 * minTick;
            } else {
                quoteBidPrice = marketPrice[0] + aclSkew * minTick - aclSpread / 2 * minTick;
                quoteOfferPrice = marketPrice[1] + aclSkew * minTick + aclSpread / 2 * minTick;
            }
            quoteBidPrice = Math.round((quoteBidPrice * offset) + minTick / 10) / offset;
            quoteOfferPrice = Math.round((quoteOfferPrice * offset) + minTick / 10) / offset;
            this.setState({quoteBidPrice, quoteOfferPrice, spread: spread, skew: skew});
            const orderBook = this.props.orderBook;
            orderBook[instance.instanceId] = {quoteBidPrice, quoteOfferPrice};
            this.props.setOrderBookValue({...orderBook});
        }
    };

    addRightOffer = () => {
        let instance = this.props.instance;
        if (instance) {
            let {quoteBidPrice, quoteOfferPrice, skew, spread, isFixed} = this.state;
            const minTick = instance.minTick;
            // const mkData = this.props.mkData;
            // let marketPrice = mkData[instance.instanceId] && mkData[instance.instanceId].marketBidOfferPrices || instance.marketBidOfferPrices;
            let marketPrice = this.state.marketBidOfferPrices;
            const offset = getOffset(minTick);
            spread = spread || instance.quoteSpread;
            let aclSpread;
            if (spread === 0) {
                aclSpread = Math.round(this.getSpread(1, minTick) + (marketPrice[1] - marketPrice[0]) * offset);
            } else {
                spread = spread + 1;
                aclSpread = this.getSpread(spread, minTick);
            }
            const aclSkew = this.getSkew((skew || instance.quoteSkew) + 0.5, minTick);
            spread = this.getDisplaySpread(aclSpread, minTick);
            skew = (skew || instance.quoteSkew) + 0.5;
            if (isFixed) {
                const midMarketPrice = (marketPrice[0] + marketPrice[1]) / 2;
                quoteBidPrice = midMarketPrice + aclSkew * minTick - aclSpread / 2 * minTick;
                quoteOfferPrice = midMarketPrice + aclSkew * minTick + aclSpread / 2 * minTick;
            } else {
                quoteBidPrice = marketPrice[0] + aclSkew * minTick - aclSpread / 2 * minTick;
                quoteOfferPrice = marketPrice[1] + aclSkew * minTick + aclSpread / 2 * minTick;
            }
            quoteBidPrice = Math.round((quoteBidPrice * offset) + minTick / 10) / offset;
            quoteOfferPrice = Math.round((quoteOfferPrice * offset) + minTick / 10) / offset;
            this.setState({quoteBidPrice, quoteOfferPrice, spread: spread, skew: skew});
            const orderBook = this.props.orderBook;
            orderBook[instance.instanceId] = {quoteBidPrice, quoteOfferPrice};
            this.props.setOrderBookValue({...orderBook});
        }
    }

    subRightOffer = () => {
        let instance = this.props.instance;
        if (instance) {
            let {quoteBidPrice, quoteOfferPrice, skew, spread, isFixed} = this.state;
            const minTick = instance.minTick;
            // const mkData = this.props.mkData;
            // let marketPrice = mkData[instance.instanceId] && mkData[instance.instanceId].marketBidOfferPrices || instance.marketBidOfferPrices;
            let marketPrice = this.state.marketBidOfferPrices;
            const offset = getOffset(minTick);
            spread = spread || instance.quoteSpread;
            let aclSpread;
            let minSpread = this.getMinSpread(minTick);
            if (spread === 0) {
                aclSpread = (marketPrice[1] - marketPrice[0]) * offset - this.getSpread(1, minTick);
                if (aclSpread < 0) {
                    spread = minSpread;
                    aclSpread = this.getSpread(spread, minTick);
                } else {
                    aclSpread = Math.round(aclSpread);
                    spread = this.getDisplaySpread(aclSpread, minTick);
                }
            } else {
                spread = spread - 1;
                if (spread < minSpread)
                    spread = minSpread;
                spread = spread + 0.00001;
                spread = this.formatNum(spread, 1);
                aclSpread = this.getSpread(spread, minTick);
            }
            const aclSkew = this.getSkew((skew || instance.quoteSkew) - 0.5, minTick);
            skew = (skew || instance.quoteSkew) - 0.5;
            if (isFixed) {
                const midMarketPrice = (marketPrice[0] + marketPrice[1]) / 2;
                quoteBidPrice = midMarketPrice + aclSkew * minTick - aclSpread / 2 * minTick;
                quoteOfferPrice = midMarketPrice + aclSkew * minTick + aclSpread / 2 * minTick;
            } else {
                quoteBidPrice = marketPrice[0] + aclSkew * minTick - aclSpread / 2 * minTick;
                quoteOfferPrice = marketPrice[1] + aclSkew * minTick + aclSpread / 2 * minTick;
            }
            quoteBidPrice = Math.round((quoteBidPrice * offset) + minTick / 10) / offset;
            quoteOfferPrice = Math.round((quoteOfferPrice * offset) + minTick / 10) / offset;
            this.setState({quoteBidPrice, quoteOfferPrice, spread: spread, skew: skew});
            const orderBook = this.props.orderBook;
            orderBook[instance.instanceId] = {quoteBidPrice, quoteOfferPrice};
            this.props.setOrderBookValue({...orderBook});
        }
    }

    leftBidOffer = () => {
        let instance = this.props.instance;
        if (instance) {
            let {quoteBidPrice, quoteOfferPrice, skew, spread, isFixed} = this.state;
            const minTick = instance.minTick;
            // const mkData = this.props.mkData;
            // let marketPrice = mkData[instance.instanceId] && mkData[instance.instanceId].marketBidOfferPrices || instance.marketBidOfferPrices;
            let marketPrice = this.state.marketBidOfferPrices;
            const offset = getOffset(minTick);
            spread = spread || instance.quoteSpread;
            let aclSpread;
            if (spread === 0) {
                aclSpread = (marketPrice[1] - marketPrice[0]) * offset;
                aclSpread = Math.round(aclSpread);
                spread = this.getDisplaySpread(aclSpread, minTick);
            } else {
                aclSpread = this.getSpread(spread, minTick);
            }
            const aclSkew = this.getSkew((skew || instance.quoteSkew) + 1, minTick);
            skew = (skew || instance.quoteSkew) + 1;
            if (isFixed) {
                const midMarketPrice = (marketPrice[0] + marketPrice[1]) / 2;
                quoteBidPrice = midMarketPrice + aclSkew * minTick - aclSpread / 2 * minTick;
                quoteOfferPrice = midMarketPrice + aclSkew * minTick + aclSpread / 2 * minTick;
            } else {
                quoteBidPrice = marketPrice[0] + aclSkew * minTick - aclSpread / 2 * minTick;
                quoteOfferPrice = marketPrice[1] + aclSkew * minTick + aclSpread / 2 * minTick;
            }
            quoteBidPrice = Math.round((quoteBidPrice * offset) + minTick / 10) / offset;
            quoteOfferPrice = Math.round((quoteOfferPrice * offset) + minTick / 10) / offset;
            this.setState({quoteBidPrice, quoteOfferPrice, spread: spread, skew: skew});
            const orderBook = this.props.orderBook;
            orderBook[instance.instanceId] = {quoteBidPrice, quoteOfferPrice};
            this.props.setOrderBookValue({...orderBook});
        }
    }
    topBidOffer = () => {
        let instance = this.props.instance;
        if (instance) {
            let {quoteBidPrice, quoteOfferPrice, skew, spread, isFixed} = this.state;
            const minTick = instance.minTick;
            // const mkData = this.props.mkData;
            // let marketPrice = mkData[instance.instanceId] && mkData[instance.instanceId].marketBidOfferPrices || instance.marketBidOfferPrices;
            let marketPrice = this.state.marketBidOfferPrices;
            const offset = getOffset(minTick);
            spread = spread || instance.quoteSpread;
            let aclSpread;
            if (spread === 0) {
                aclSpread = (marketPrice[1] - marketPrice[0]) * offset + this.getSpread(2, minTick);
                aclSpread = Math.round(aclSpread);
                console.log("aclSpread:", aclSpread);
                spread = this.getDisplaySpread(aclSpread, minTick);
            } else {
                spread = spread + 2;
                aclSpread = this.getSpread(spread, minTick);
            }
            const aclSkew = this.getSkew((skew || instance.quoteSkew), minTick);
            if (isFixed) {
                let midMarketPrice = (marketPrice[0] + marketPrice[1]) / 2;
                quoteBidPrice = midMarketPrice + aclSkew * minTick - aclSpread / 2 * minTick;
                quoteOfferPrice = midMarketPrice + aclSkew * minTick + aclSpread / 2 * minTick;
            } else {
                quoteBidPrice = marketPrice[0] + aclSkew * minTick - aclSpread / 2 * minTick;
                quoteOfferPrice = marketPrice[1] + aclSkew * minTick + aclSpread / 2 * minTick;
            }
            quoteBidPrice = Math.round((quoteBidPrice * offset) + minTick / 10) / offset;
            quoteOfferPrice = Math.round((quoteOfferPrice * offset) + minTick / 10) / offset;
            this.setState({quoteBidPrice, quoteOfferPrice, spread: spread, skew: skew});
            const orderBook = this.props.orderBook;
            orderBook[instance.instanceId] = {quoteBidPrice, quoteOfferPrice};
            this.props.setOrderBookValue({...orderBook});
        }
    }
    bottomBidOffer = () => {
        let instance = this.props.instance;
        if (instance) {
            let {quoteBidPrice, quoteOfferPrice, skew, spread, isFixed} = this.state;
            const minTick = instance.minTick;
            // const mkData = this.props.mkData;
            // let marketPrice = mkData[instance.instanceId] && mkData[instance.instanceId].marketBidOfferPrices || instance.marketBidOfferPrices;
            let marketPrice = this.state.marketBidOfferPrices;
            const offset = getOffset(minTick);
            spread = spread || instance.quoteSpread;
            let aclSpread;
            const minSpread = this.getMinSpread(minTick);
            if (spread === 0) {
                aclSpread = (marketPrice[1] - marketPrice[0]) * offset - this.getSpread(1, minTick);
                if (aclSpread < 0) {
                    spread = minSpread;
                    aclSpread = this.getSpread(spread, minTick);
                } else {
                    aclSpread = Math.round(aclSpread);
                    spread = this.getDisplaySpread(aclSpread, minTick);
                }
            } else {
                spread = spread - 2;
                console.log(spread);
                console.log(minSpread);
                if (spread < minSpread)
                    spread = minSpread;
                spread = spread + 0.00001;
                spread = this.formatNum(spread, 1);
                aclSpread = this.getSpread(spread, minTick);
            }
            const aclSkew = this.getSkew((skew || instance.quoteSkew), minTick);
            if (isFixed) {
                let midMarketPrice = (marketPrice[0] + marketPrice[1]) / 2;
                quoteBidPrice = midMarketPrice + aclSkew * minTick - aclSpread / 2 * minTick;
                quoteOfferPrice = midMarketPrice + aclSkew * minTick + aclSpread / 2 * minTick;
            } else {
                quoteBidPrice = marketPrice[0] + aclSkew * minTick - aclSpread / 2 * minTick;
                quoteOfferPrice = marketPrice[1] + aclSkew * minTick + aclSpread / 2 * minTick;
            }
            quoteBidPrice = Math.round((quoteBidPrice * offset) + minTick / 10) / offset;
            quoteOfferPrice = Math.round((quoteOfferPrice * offset) + minTick / 10) / offset;
            this.setState({quoteBidPrice, quoteOfferPrice, spread: spread, skew: skew});
            const orderBook = this.props.orderBook;
            orderBook[instance.instanceId] = {quoteBidPrice, quoteOfferPrice};
            this.props.setOrderBookValue({...orderBook});
        }
    }
    rightBidOffer = () => {
        let instance = this.props.instance;
        if (instance) {
            let {quoteBidPrice, quoteOfferPrice, skew, spread, isFixed} = this.state;
            const minTick = instance.minTick;
            // const mkData = this.props.mkData;
            // let marketPrice = mkData[instance.instanceId] && mkData[instance.instanceId].marketBidOfferPrices || instance.marketBidOfferPrices;
            let marketPrice = this.state.marketBidOfferPrices;
            const offset = getOffset(minTick);
            spread = spread || instance.quoteSpread;
            let aclSpread;
            if (spread === 0) {
                aclSpread = (marketPrice[1] - marketPrice[0]) * offset;
                aclSpread = Math.round(aclSpread);
                spread = this.getDisplaySpread(aclSpread, minTick);
            } else {
                aclSpread = this.getSpread(spread, minTick);
            }
            const aclSkew = this.getSkew((skew || instance.quoteSkew) - 1, minTick);
            skew = (skew || instance.quoteSkew) - 1;
            if (isFixed) {
                const midMarketPrice = (marketPrice[0] + marketPrice[1]) / 2;
                quoteBidPrice = midMarketPrice + aclSkew * minTick - aclSpread / 2 * minTick;
                quoteOfferPrice = midMarketPrice + aclSkew * minTick + aclSpread / 2 * minTick;
            } else {
                quoteBidPrice = marketPrice[0] + aclSkew * minTick - aclSpread / 2 * minTick;
                quoteOfferPrice = marketPrice[1] + aclSkew * minTick + aclSpread / 2 * minTick;
            }
            quoteBidPrice = Math.round((quoteBidPrice * offset) + minTick / 10) / offset;
            quoteOfferPrice = Math.round((quoteOfferPrice * offset) + minTick / 10) / offset;
            this.setState({quoteBidPrice, quoteOfferPrice, spread: spread, skew: skew});
            const orderBook = this.props.orderBook;
            orderBook[instance.instanceId] = {quoteBidPrice, quoteOfferPrice};
            this.props.setOrderBookValue({...orderBook});
        }
    }

    onChangeSpread = (value) => {
        if (typeof value === "string"){
            return;
        }
        let instance = this.props.instance;
        if (instance) {
            const minTick = instance.minTick;
            let {quoteBidPrice, quoteOfferPrice, spread, skew, isFixed} = this.state;
            skew = skew || instance.quoteSkew;
            // const mkData = this.props.mkData;
            // let marketPrice = mkData[instance.instanceId] && mkData[instance.instanceId].marketBidOfferPrices || instance.marketBidOfferPrices;
            let marketPrice = this.state.marketBidOfferPrices;
            const offset = getOffset(minTick);
            //当spread为空时，调上下按钮的计算方式
            if (instance.quoteSpread === 0){
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
            let quoteSpread = this.getSpread(value, minTick);
            if (value + "" === "NaN"){
                return;
            }
            if (isFixed && !(skew === 0 && quoteSpread === 0)){
                let spreadR = quoteSpread/2;
                const midMarketPrice = (marketPrice[0] + marketPrice[1])/2;
                quoteBidPrice = midMarketPrice + skew * minTick - spreadR * minTick;
                quoteOfferPrice = midMarketPrice + skew * minTick + spreadR * minTick;
            }else {
                quoteBidPrice = marketPrice[0] + skew * minTick - quoteSpread/2 * minTick;
                quoteOfferPrice = marketPrice[1] + skew * minTick + quoteSpread /2 * minTick;
            }

            quoteBidPrice = Math.round((quoteBidPrice * offset) + minTick/10) / offset;
            quoteOfferPrice = Math.round((quoteOfferPrice * offset) + minTick/10) / offset;
            this.setState({quoteBidPrice, quoteOfferPrice, spread: value});
            const orderBook = this.props.orderBook;
            orderBook[instance.instanceId] = {quoteBidPrice, quoteOfferPrice};
            this.props.setOrderBookValue({...orderBook});
        }
    }
    onChangeSkew = (value) => {
        if (typeof value === "string"){
            return;
        }
        if (typeof value === "undefined"){
            value = 0;
        }
        let instance = this.props.instance;
        if (instance) {
            const minTick = instance.minTick;
            let {quoteBidPrice, quoteOfferPrice, spread, isFixed} = this.state;
            spread = spread || instance.quoteSpread;
            spread = this.getSpread(spread, minTick, 10000);
            const offset = getOffset(minTick);
            let quoteSkew = value;
            let spreadR = spread / 2;
            // const mkData = this.props.mkData;
            // let marketPrice = mkData[instance.instanceId] && mkData[instance.instanceId].marketBidOfferPrices || instance.marketBidOfferPrices;
            let marketPrice = this.state.marketBidOfferPrices;
            if (isFixed && !(quoteSkew === 0 && spread === 0)) {
                const midMarketPrice = (marketPrice[0] + marketPrice[1]) / 2;
                const skewMin = quoteSkew * minTick;
                const spreadMin = spreadR * minTick;
                quoteBidPrice = midMarketPrice + skewMin - spreadMin;
                quoteOfferPrice = midMarketPrice + skewMin + spreadMin;
            } else {
                quoteBidPrice = marketPrice[0] + quoteSkew * minTick - spreadR * minTick;
                quoteOfferPrice = marketPrice[1] + quoteSkew * minTick + spreadR * minTick;
            }
            quoteBidPrice = Math.round((quoteBidPrice * offset) + minTick / 10) / offset;
            quoteOfferPrice = Math.round((quoteOfferPrice * offset) + minTick / 10) / offset;
            quoteSkew = Math.ceil(quoteSkew * 10) / 10;
            this.setState({quoteBidPrice, quoteOfferPrice, skew: quoteSkew});
            const orderBook = this.props.orderBook;
            orderBook[instance.instanceId] = {quoteBidPrice, quoteOfferPrice};
            this.props.setOrderBookValue({...orderBook});
        }

    }
    getDisplaySpread = (aclSpread, minTick)=>{
        let displayQty = 10000;
        let instance = this.props.instance;
        if (instance) {
            const symbol = instance.symbol;
            // if (symbol === "USDJPY" || symbol === "EURJPY" || symbol.indexOf(".") !== -1) {
            //     displayQty = 100;
            // }
            const offset = getOffset(minTick);
            return aclSpread /(offset/displayQty) ;
        }
    }
    getMinSpread = (minTick) => {
        let displayQty = 10000;
        let instance = this.props.instance;
        if (instance) {
            const symbol = instance.symbol;
            // if (symbol === "USDJPY" || symbol === "EURJPY" || symbol.indexOf(".") !== -1) {
            //     displayQty = 100;
            // }
            const offset = getOffset(minTick);
            return displayQty/offset;
        }
    }
    formatNum = (f, digit) => {
        var m = Math.pow(10, digit);
        return parseInt(f * m, 10) / m;
    }
    getSpread = (spread, minTick) => {
        let displayQty = 10000;
        let instance = this.props.instance;
        if (instance) {
            const symbol = instance.symbol;
            // if (symbol === "USDJPY" || symbol === "EURJPY" || symbol.indexOf(".") !== -1) {
            //     displayQty = 100;
            // }
            const offset = getOffset(minTick);
            return offset / displayQty * spread;
        }
    }
    getSkew = (skew, minTick) => {
        let displayQty = 10000;
        let instance = this.props.instance;
        if (instance) {
            const symbol = instance.symbol;
            // if (symbol === "USDJPY" || symbol === "EURJPY" || symbol.indexOf(".") !== -1) {
            //     displayQty = 100;
            // }
            const offset = getOffset(minTick);
            return offset / displayQty * skew;
        }
    }
    getFormatValue = (value) => {
        const instance =this.props.instance;
        if (instance) {
            const minTick = instance.minTick;
            const offset = getOffset(minTick);
            let temp = Math.round((value * offset) + minTick / 10) / offset;
            return temp.toFixed(getPixs(minTick));
        }
    }

    onChangeFixed =()=>{
        const {isFixed} =this.state;
        this.setState({isFixed:!isFixed},()=>{
            const instance = this.props.instance;
            let quoteSpread = typeof this.state.spread !== "undefined" ? this.state.spread : instance.quoteSpread;
            let skew = typeof this.state.skew !== "undefined" ? this.state.skew : instance.quoteSkew;

            const minTick = instance.minTick;
            let {quoteBidPrice, quoteOfferPrice, isFixed} = this.state;
            const offset = getOffset(minTick);
            let spread;
            // const mkData = this.props.mkData;
            // let marketPrice = mkData[instance.instanceId] && mkData[instance.instanceId].marketBidOfferPrices || instance.marketBidOfferPrices;
            let marketPrice = this.state.marketBidOfferPrices;
            instance.marketSpread = (marketPrice[1] - marketPrice[0])*10000;
            if (isFixed) {
                spread = quoteSpread + instance.marketSpread;
            }else {
                spread = quoteSpread - instance.marketSpread;
            }
            console.log("currentStrategy.marketSpread:", instance.marketSpread);
            console.log("sprea: ", spread);
            if (spread <= 0){
                spread = 1;
            }
            spread = spread + 0.00001;
            spread = this.formatNum(spread, 1);

            quoteSpread = this.getSpread(spread, minTick);
            skew = this.getSkew(skew, minTick);
            let spreadR = quoteSpread/2;
            if (isFixed && !(skew === 0 && quoteSpread === 0)){
                const midMarketPrice = (marketPrice[0] + marketPrice[1])/2;
                quoteBidPrice = midMarketPrice + skew * minTick - spreadR * minTick;
                quoteOfferPrice = midMarketPrice + skew * minTick + spreadR * minTick;
            }else {
                console.log(marketPrice);
                quoteBidPrice = marketPrice[0] + skew * minTick - spreadR * minTick;
                console.log(quoteBidPrice);
                quoteOfferPrice = marketPrice[1] + skew * minTick + spreadR * minTick;
                console.log(quoteOfferPrice);
            }

            quoteBidPrice = Math.round((quoteBidPrice * offset) + minTick/10) / offset;
            quoteOfferPrice = Math.round((quoteOfferPrice * offset) + minTick/10) / offset;
            console.log("quoteBidPrice:", quoteBidPrice);
            this.setState({quoteBidPrice, quoteOfferPrice, spread: spread});
            const orderBook = this.props.orderBook;
            orderBook[instance.instanceId] = {quoteBidPrice, quoteOfferPrice};
            this.props.setOrderBookValue({...orderBook});
        });
    }

    spreadFocus =() =>{
        let instance = this.props.instance;
        if (instance) {
            const minTick = instance.minTick;
            // const mkData = this.props.mkData;
            // let marketPrice = mkData[instance.instanceId] && mkData[instance.instanceId].marketBidOfferPrices || instance.marketBidOfferPrices;
            let marketPrice = this.state.marketBidOfferPrices;
            const offset = getOffset(minTick);
            const stateSpread = this.state.spread;
            if (marketPrice && marketPrice[0] === 0 && marketPrice[1] === 0){
                return;
            }
            if (!stateSpread && !instance.quoteSpread) {
                let spread = marketPrice[1] - marketPrice[0];
                spread = Math.round(spread * offset) / offset;
                let displaySpread = this.getDisplaySpread(spread * offset, minTick);
                displaySpread = Math.round((displaySpread + 0.01) * 10)/10;
                this.setState({isSpreadBlur: true, spread: displaySpread});
            }
        }
    }

    render() {
        let { instance } = this.props;
        let { quoteBidPrice, quoteOfferPrice, spread, isSpreadBlur, isFixed} = this.state;
        if (spread === 0 && !isSpreadBlur){
            spread = "";
        }
        instance = instance || {};
        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                <div className={"adjust-col"}>
                    <div className={"left-adjust"}>
                        <div className={"clickable"} onClick={this.addLeftBid}>︿</div>
                        <div className={"clickable"} onClick={this.subLeftBid}>﹀</div>
                    </div>
                    <div className={"left-bid"}>
                        {/*<div className={"bid"}>bid</div>*/}
                        <div className={"value"}>
                            <span>{quoteBidPrice && instance.status === "STARTED" ? <Statistic value={quoteBidPrice} precision={4} /> : "--"}</span>
                            {/*<span>{instance ? "7350" : "-"}</span>*/}
                        </div>
                    </div>
                    <div className={"mid"}>
                        <div className={"mid-left-adjust clickable"} onClick={this.leftBidOffer}>〈</div>
                        <div className={"mid-adjust"}>
                            <div className={"top clickable"} onClick={this.topBidOffer}>︿</div>
                            <div className={"bottom clickable"} onClick={this.bottomBidOffer}>﹀</div>
                        </div>
                        <div className={"mid-right-adjust clickable"} onClick={this.rightBidOffer}>〉</div>
                    </div>
                    <div className={"right-ask"}>
                        {/*<div className={"ask"}>ask</div>*/}
                        <div className={"value"}>
                            <span>{quoteOfferPrice && instance.status === "STARTED" ? <Statistic value={quoteOfferPrice} precision={4} />  : "--"}</span>
                            {/*<span>{instance ? "7351" : "-"}</span>*/}
                        </div>
                    </div>
                    <div className={"right-adjust"}>
                        <div className={"clickable"} onClick={this.addRightOffer}>︿</div>
                        <div className={"clickable"} onClick={this.subRightOffer}>﹀</div>
                    </div>
                </div>
                <div className={"fixed-col"}>
                    <div className={"spread-wrapper"}>
                        <div>点差</div>
                        <div className={"spread-input"}>
                            <InputNumber value={spread} onChange={this.onChangeSpread} onFocus={this.spreadFocus}/>
                        </div>
                    </div>
                    <div className={"fixed-wrapper"}>
                        <div>
                            {/*<Checkbox disabled={!this.props.instance} checked={this.state.isFixed} onClick={this.onChangeFixed}/>*/}
                            <Button disabled={!this.props.instance} style={{background: isFixed ? "rgb(62, 152, 150)" : "grey", borderRadius: "2px"}}
                                onClick={this.onChangeFixed}
                            >固定</Button>
                        </div>
                        <div className={"fixed-label"}>
                            <Button disabled={!this.props.instance} style={{background: !isFixed ? "rgb(62, 152, 150)" : "grey", borderRadius: "2px"}}
                                onClick={this.onChangeFixed}
                            >浮动</Button>
                        </div>
                    </div>
                    <div className={"skew-wrapper"}>
                        <div>偏移</div>
                        <div className={"skew-input"}>
                            <InputNumber type={"number"} value={this.state.skew} onChange={this.onChangeSkew}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
const mapStateToProps = state => ({
    orderBook: state.globalReducer.orderBook,
    orderBookList: state.odmReducer.orderBookList,
    mkData: state.odmReducer.mkData,
});

const mapDispatchToProps = dispatch => ({
    setOrderBookValue: (params) => dispatch(setOrderBookValue(params)),
});
export default connect(mapStateToProps,mapDispatchToProps)(AdjustBook);
