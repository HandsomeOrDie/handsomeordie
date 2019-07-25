import * as ActionTypes from "../constants/ActionTypes";
import { findPosition, findCcyPosi } from "../../common/marketApi/index";

const getPositionList = (params, marketPrice) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.POSITION_LIST_LOADING, payload: true });
            const result = await findPosition(params);
            let data = result.data || [];
            // console.log(marketPrice);
            data.map(item => {
                const pair1 = item.crncy + "USD";
                const pair2 = "USD" + item.crncy;
                // const mktPrice = marketPrice && (marketPrice[pair1] || marketPrice[pair2]);
                if (marketPrice && marketPrice[pair1]){
                    const rate = item.position > 0 ? marketPrice[pair1].bid : marketPrice[pair1].ask;
                    item.marketValue = item.position * rate;
                } else if (marketPrice && marketPrice[pair2]){
                    const rate = item.position > 0 ? marketPrice[pair2].bid : marketPrice[pair2].ask;
                    item.marketValue = item.position / rate;
                } else if (item.crncy === "USD") {
                    item.marketValue = item.position;
                }
                if (item.position === 0) {
                    item.marketValue = 0;
                }
                item.pnl = item.marketValue - item.cost;
            });
            // console.log(data);
            dispatch({ type: ActionTypes.POSITION_LIST, payload:  data});
            dispatch({ type: ActionTypes.POSITION_LIST_LOADING, payload: false });
            // }, 2000);
        } catch (e) {
            console.log(e);
        }
    };
};

const getCcyPosiList = (params, marketPrice) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.CCYPOSI_LIST_LOADING, payload: true });
            const result = await findCcyPosi(params);
            let data = result.data || [];
            data.map(item => {
                const symbol = item.code;
                const position = item.position;
                if (marketPrice && marketPrice[symbol]){
                    const rate = position > 0 ? marketPrice[symbol].bid : marketPrice[symbol].ask;
                    item.marketValue = position * rate;
                }
                if (position === 0) {
                    item.marketValue = 0;
                }
                item.pnl = item.marketValue - item.cost;
            });
            dispatch({ type: ActionTypes.CCYPOSI_LIST, payload:  data});
            dispatch({ type: ActionTypes.CCYPOSI_LIST_LOADING, payload: false });
        } catch (e) {
            console.log(e);
        }
    };
};

// const getCcyPosiList = (cb) => {
//     return async dispatch => {
//         try {
//             const result = await findCcyPosi();
//             cb && cb();
//         } catch (e) {
//             console.log(e);
//         }
//     };
// };


const updatePositionList = (positionList) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.POSITION_LIST, payload: positionList });
        } catch (e) {
            console.log(e);
        }
    };
};

const updateMarketPrice = (message, marketPrice, positionList) => {
    return async dispatch => {
        try {
            const symbol = message.symbol;
            const bidPxs = message.bidPxs;
            const askPxs = message.askPxs;
            marketPrice[symbol] = {};
            marketPrice[symbol].bid = bidPxs[0];
            marketPrice[symbol].ask = askPxs[0];
            positionList.map(item => {
                const position = item.position;
                const rate = position > 0 ? bidPxs[0] : askPxs[0];
                if ((item.crncy + "USD") === symbol) {
                    item.marketValue = position * rate;
                }else if (("USD" + item.crncy) === symbol) {
                    item.marketValue = position / rate;
                }else if (item.crncy === "USD"){
                    item.marketValue = item.position;
                }
                item.pnl = item.marketValue - item.cost;
            });
            const data = [...positionList];
            dispatch({ type: ActionTypes.POSITION_LIST, payload: data });
            dispatch({ type: ActionTypes.MARKET_PRICE, payload: {...marketPrice} });
            dispatch({ type: ActionTypes.MARKET_PRICE_MSG, payload: {...message} });
            // dispatch({ type: ActionTypes.MARKET_PRICE_ALL, payload: {marketPrice: {...marketPrice}, mktPriceMsg: {...message}} });
        } catch (e) {
            console.log(e);
        }
    };
};

const updateCcyPosi = (message, marketPrice, ccyPosiList, cb) => {
    return async dispatch => {
        try {
            const symbol = message.symbol;
            const bidPxs = message.bidPxs;
            const askPxs = message.askPxs;
            marketPrice[symbol] = {};
            marketPrice[symbol].bid = bidPxs[0];
            marketPrice[symbol].ask = askPxs[0];
            ccyPosiList.map(item => {
                if (item.code === symbol) {
                    const position = item.position;
                    const rate = position > 0 ? bidPxs[0] : askPxs[0];
                    item.marketValue = position * rate;
                }
                item.pnl = item.marketValue - item.cost;
            });
            const data = [...ccyPosiList];
            dispatch({ type: ActionTypes.CCYPOSI_LIST, payload: data });
            dispatch({ type: ActionTypes.MARKET_PRICE, payload: {...marketPrice} });
            dispatch({ type: ActionTypes.MARKET_PRICE_MSG, payload: {...message} });
            cb();
        } catch (e) {
            console.log(e);
        }
    };
};


export { getPositionList, updatePositionList, updateMarketPrice, getCcyPosiList, updateCcyPosi };
