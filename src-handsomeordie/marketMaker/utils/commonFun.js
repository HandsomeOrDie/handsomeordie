export const formatStr =(tmp)=>{
    var str;
    if(tmp){
        switch(tmp.toString().length){
        case 1:
            return  str = tmp+".0000";
            break;
        case 2:
            return  str =tmp + "0000";
            break;
        case 3:
            return str =tmp +"000";
            break;
        case 4:
            return  str =tmp + "00";
            break;
        case 5:
            return  str =tmp +"0";
        default:
        //  return  str =(Math.round(tmp)*10000)/10000;
            return  str =tmp+"";
            break;
        }
    }else{
        return "0.0000";
    }
}; 
export const formatNumber =(value) =>{
    return   Math.round(Number(value)*10000);
};


export const sumNumber =(value,index) =>{
    var val =0;
    for(var i = 0; i<=index;i++){
        if (value) {
            val += Number(value[i]);
        }
    }
    return val;
};

export const getSpread = (bid, offer, minTick) => {
    const offset = getOffset(minTick);
    return offer * offset - bid * offset;
};

export const getBidPrice = (BidPrice, minTick) => {
    const offset = getOffset(minTick);
    return (BidPrice * offset - 1) * offset;
};
export const getQuoteSpread = (BidPrice, minTick) => {
    const offset = getOffset(minTick);
    return (BidPrice * offset - 1) * offset;
};

export const getSingleBid = (currentStrategy, minTick) => {
    const offset = getOffset(minTick);
    currentStrategy.quoteBidPrice = (currentStrategy.quoteBidPrice * offset + 1) / offset;
    let quoteSpread = currentStrategy.quoteOfferPrice * offset - currentStrategy.quoteBidPrice * offset;
    quoteSpread = Math.round(quoteSpread);
    let midQuotePrice = currentStrategy.quoteBidPrice * offset + currentStrategy.quoteOfferPrice * offset;
    let midMarketPrice = currentStrategy.marketBidPrice * offset + currentStrategy.marketOfferPrice * offset;
    let quoteSkew = (midQuotePrice - midMarketPrice) / 2;
    quoteSkew = Math.round(quoteSkew);
    // currentStrategy.quoteSpread = quoteSpread;
    // currentStrategy.quoteSkew = quoteSkew;

    return {currentStrategy, spread: quoteSpread, skew: quoteSkew};
};

export const getSubtrctBid = (currentStrategy, minTick) => {
    const offset = getOffset(minTick);
    currentStrategy.quoteBidPrice = (currentStrategy.quoteBidPrice * offset - 1) / offset;
    let quoteSpread = currentStrategy.quoteOfferPrice * offset - currentStrategy.quoteBidPrice * offset;
    quoteSpread = Math.round(quoteSpread);
    let midQuotePrice = currentStrategy.quoteBidPrice * offset + currentStrategy.quoteOfferPrice * offset;
    let midMarketPrice = currentStrategy.marketBidPrice * offset + currentStrategy.marketOfferPrice * offset;
    let quoteSkew = (midQuotePrice - midMarketPrice) / 2;
    quoteSkew = Math.round(quoteSkew);
    // currentStrategy.quoteSpread = quoteSpread;
    // currentStrategy.quoteSkew = quoteSkew;

    return {currentStrategy, spread: quoteSpread, skew: quoteSkew};
};

export const getAddOfferPrice = (currentStrategy, minTick) => {
    const offset = getOffset(minTick);
    currentStrategy.quoteOfferPrice = (currentStrategy.quoteOfferPrice * offset + 1) / offset;
    let quoteSpread = currentStrategy.quoteOfferPrice * offset - currentStrategy.quoteBidPrice * offset;
    quoteSpread = Math.round(quoteSpread);
    let midQuotePrice = currentStrategy.quoteBidPrice * offset + currentStrategy.quoteOfferPrice * offset;
    let midMarketPrice = currentStrategy.marketBidPrice * offset + currentStrategy.marketOfferPrice * offset;
    let quoteSkew = (midQuotePrice - midMarketPrice) / 2;
    quoteSkew = Math.round(quoteSkew);
    // currentStrategy.quoteSpread = quoteSpread;
    // currentStrategy.quoteSkew = quoteSkew;

    return {currentStrategy, spread: quoteSpread, skew: quoteSkew};
};

export const getSubtrctOfferPrice = (currentStrategy, minTick) => {
    const offset = getOffset(minTick);
    currentStrategy.quoteOfferPrice = (currentStrategy.quoteOfferPrice * offset - 1) / offset;
    let quoteSpread = currentStrategy.quoteOfferPrice * offset - currentStrategy.quoteBidPrice * offset;
    quoteSpread = Math.round(quoteSpread);
    let midQuotePrice = currentStrategy.quoteBidPrice * offset + currentStrategy.quoteOfferPrice * offset;
    let midMarketPrice = currentStrategy.marketBidPrice * offset + currentStrategy.marketOfferPrice * offset;
    let quoteSkew = (midQuotePrice - midMarketPrice) / 2;
    quoteSkew = Math.round(quoteSkew);
    // currentStrategy.quoteSpread = quoteSpread;
    // currentStrategy.quoteSkew = quoteSkew;

    return {currentStrategy, spread: quoteSpread, skew: quoteSkew};
};

export const getDoubleUp = (currentStrategy, minTick) => {
    const offset = getOffset(minTick);
    currentStrategy.quoteBidPrice = (currentStrategy.quoteBidPrice * offset - 1) / offset;
    currentStrategy.quoteOfferPrice = (currentStrategy.quoteOfferPrice * offset + 1) / offset;
    let quoteSpread = currentStrategy.quoteOfferPrice * offset - currentStrategy.quoteBidPrice * offset;
    quoteSpread = Math.round(quoteSpread);
    let midQuotePrice = currentStrategy.quoteBidPrice * offset + currentStrategy.quoteOfferPrice * offset;
    let midMarketPrice = currentStrategy.marketBidPrice * offset + currentStrategy.marketOfferPrice * offset;
    let quoteSkew = (midQuotePrice - midMarketPrice) / 2;
    quoteSkew = Math.round(quoteSkew);
    // currentStrategy.quoteSpread = quoteSpread;
    // currentStrategy.quoteSkew = quoteSkew;

    return {currentStrategy, spread: quoteSpread, skew: quoteSkew};
};

export const getDoubleDown = (currentStrategy, minTick) => {
    const offset = getOffset(minTick);
    currentStrategy.quoteBidPrice = (currentStrategy.quoteBidPrice * offset + 1) / offset;
    currentStrategy.quoteOfferPrice = (currentStrategy.quoteOfferPrice * offset - 1) / offset;
    let quoteSpread = currentStrategy.quoteOfferPrice * offset - currentStrategy.quoteBidPrice * offset;
    quoteSpread = Math.round(quoteSpread);
    let midQuotePrice = currentStrategy.quoteBidPrice * offset + currentStrategy.quoteOfferPrice * offset;
    let midMarketPrice = currentStrategy.marketBidPrice * offset + currentStrategy.marketOfferPrice * offset;
    let quoteSkew = (midQuotePrice - midMarketPrice) / 2;
    quoteSkew = Math.round(quoteSkew);
    // currentStrategy.quoteSpread = quoteSpread;
    // currentStrategy.quoteSkew = quoteSkew;

    return {currentStrategy, spread: quoteSpread, skew: quoteSkew};
};

export const getDoubleLeft = (currentStrategy, minTick) => {
    const offset = getOffset(minTick);
    currentStrategy.quoteBidPrice = (currentStrategy.quoteBidPrice * offset - 1) / offset;
    currentStrategy.quoteOfferPrice = (currentStrategy.quoteOfferPrice * offset - 1) / offset;
    let quoteSpread = currentStrategy.quoteOfferPrice * offset - currentStrategy.quoteBidPrice * offset;
    quoteSpread = Math.round(quoteSpread);
    let midQuotePrice = currentStrategy.quoteBidPrice * offset + currentStrategy.quoteOfferPrice * offset;
    let midMarketPrice = currentStrategy.marketBidPrice * offset + currentStrategy.marketOfferPrice * offset;
    let quoteSkew = (midQuotePrice - midMarketPrice) / 2;
    quoteSkew = Math.round(quoteSkew);
    // currentStrategy.quoteSpread = quoteSpread;
    // currentStrategy.quoteSkew = quoteSkew;

    return {currentStrategy, spread: quoteSpread, skew: quoteSkew};
};

export const getDoubleRight = (currentStrategy, minTick) => {
    const offset = getOffset(minTick);
    currentStrategy.quoteBidPrice = (currentStrategy.quoteBidPrice * offset + 1) / offset;
    currentStrategy.quoteOfferPrice = (currentStrategy.quoteOfferPrice * offset + 1) / offset;
    let quoteSpread = currentStrategy.quoteOfferPrice * offset - currentStrategy.quoteBidPrice * offset;
    quoteSpread = Math.round(quoteSpread);
    let midQuotePrice = currentStrategy.quoteBidPrice * offset + currentStrategy.quoteOfferPrice * offset;
    let midMarketPrice = currentStrategy.marketBidPrice * offset + currentStrategy.marketOfferPrice * offset;
    let quoteSkew = (midQuotePrice - midMarketPrice) / 2;
    quoteSkew = Math.round(quoteSkew);

    return {currentStrategy, spread: quoteSpread, skew: quoteSkew};
};

export const onChangeSpread = (currentStrategy, spread, minTick) => {

};

export const getDisplayBig = (num, minTick) => {
    if (num && minTick) {
        const pixs = getPixs(minTick);
        num = num.toFixed(pixs);
        if (pixs > 4) {
            return num.split(".")[1].substring(2, 4);
        } else if (pixs === 4) {
            return num.split(".")[1].substring(num.split(".")[1].length - 2, num.split(".")[1].length);
        }else {
            return num.split(".")[1]?num.split(".")[1].substring(0, 2):"";
        }
    }
};

export const getDisplaySmall = (num, minTick) => {
    if (num && minTick) {
        const pixs = getPixs(minTick);
        const numStr = num.toFixed(pixs);
        if (pixs > 4) {
            return numStr.split(".")[0] + "." + numStr.split(".")[1].substring(0, 2);
        } else if (pixs === 4) {
            return numStr.split(".")[0] + "." + numStr.split(".")[1].substring(0, numStr.split(".")[1].length - 2);
        } else {
            return numStr.split(".")[0] + ".";
        }
    }
};

export const getDisplaySmallRight = (num, minTick) => {
    if (num && minTick) {
        const pixs = getPixs(minTick);
        num = num.toFixed(pixs);
        // console.log("num:", num);
        if (pixs > 4) {
            return num.split(".")[1].substring(4, num.split(".")[1].length);
        } else if (pixs === 4) {
            return "";
        } else if (pixs === 3) {
            return num.split(".")[1] && num.split(".")[1].substring(num.split(".")[1].length - 1, num.split(".")[1].length);
        } else {
            return "";
        }
    }
};

export const formatDispay = (num, minTick) => {
    if (num && minTick) {
        const pixs = getPixs(minTick);
        return num.toFixed(pixs);
    }
};

export const getPixs = (minTick) => {
    if (minTick === 0.001){
        return 3;
    } else if (minTick === 0.0001){
        return 4;
    } else if (minTick === 0.00001){
        return 5;
    } else if (minTick === 0.01){
        return 2;
    }
};

export const getOffset = (minTick) => {
    if (minTick === 0.001){
        return 1000;
    } else if (minTick === 0.0001){
        return 10000;
    } else if (minTick === 0.00001){
        return 100000;
    }else if (minTick === 0.000001){
        return 1000000;
    }else if (minTick === 0.01){
        return 100;
    }
};