import * as ActionTypes from "../constants/ActionTypes";
import {
    FetchFindRealtimeOrder,
    getCorePriceListFetch,
    getMarketPriceConfigListFetch,
    createQuidity,
    findQuidity,
    deleteQuidity,
    findAllSymbol, findCreditCpty, updateQuidity,
    manualTradingQuoteRequest,
    placeOrder,
} from "../../common/marketApi/index";

const getLiquidityList = (params, cb) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.LIQUIDITY_LIST_LOADING, payload: true });
            const result = await findQuidity();
            const data = result.data;
            // const data = [
            //     {index: 0, symbol: "EURJPY", source: "FXALL", type: "ODM", mode: "CLOB", time: "13:01:15", qty: "TOP", highLow: "2.2137/6.2130"},
            //     {index: 1, symbol: "EURGBP", source: "FXALL", type: "ODM", mode: "CLOB", time: "13:01:15", qty: "TOP", highLow: "2.2137/6.2130"},
            //     {index: 2, symbol: "USDCNY", source: "CFETS", type: "rfq", mode: "CLOB", time: "13:01:15", qty: "TOP", highLow: "2.2137/6.2130"},
            //     {index: 3, symbol: "USDCNY", source: "CFETS", type: "ODM", mode: "CLOB", time: "13:01:15", qty: "TOP", highLow: "2.2137/6.2130"},
            //     {index: 4, symbol: "USDCNY", source: "CFETS", type: "rfq", mode: "CLOB", time: "13:01:15", qty: "TOP", highLow: "2.2137/6.2130"},
            //     {index: 5, symbol: "USDCNY", source: "CFETS", type: "ODM", mode: "CLOB", time: "13:01:15", qty: "TOP", highLow: "2.2137/6.2130"},
            //     {index: 6, symbol: "USDCNY", source: "CFETS", type: "ODM", mode: "CLOB", time: "13:01:15", qty: "TOP", highLow: "2.2137/6.2130"},
            //     {index: 7, symbol: "USDCNY", source: "CFETS", type: "ODM", mode: "CLOB", time: "13:01:15", qty: "TOP", highLow: "2.2137/6.2130"},
            // ];
            data.map((item, index) => {
                item.index = index;
                item.source = item.venue;
                item.type = item.market;
            });
            dispatch({ type: ActionTypes.LIQUIDITY_LIST, payload: data });
            dispatch({ type: ActionTypes.LIQUIDITY_LIST_LOADING, payload: false });
            cb && cb(data);
        } catch (e) {
            console.log(e);
        }
    };
};
const setLiquidityList = (list, cb) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.LIQUIDITY_LIST, payload: list });
            cb && cb();
        } catch (e) {
            console.log(e);
        }
    };
};

const setMarketPrice = (message) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.MARKET_PRICE_LIQUIDITY, payload: message });
        } catch (e) {
            console.log(e);
        }
    };
};

const setReferencePrice = (message) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.LIQUIDITY_REFERENCE, payload: message });
        } catch (e) {
            console.log(e);
        }
    };
};

const setAddList = (list, cb) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.L_SYMBOL_LIST, payload: list });
            cb && cb();
        } catch (e) {
            console.log(e);
        }
    };
};

const getSymbolList = (params, cb) => {
    // return async dispatch => {
    //     try {
    //         dispatch({ type: ActionTypes.L_SYMBOL_LIST_LOADING, payload: true });
    //         const data = [];
    //         let pricingList = await getCorePriceListFetch();
    //         const corePriceList = await getMarketPriceConfigListFetch();
    //         pricingList.data.map(item => {
    //             item.from = "RP";
    //             item.tenor = item.tenorType;
    //             item.source = "referencePrice";
    //         });
    //         corePriceList.data.map(item => {
    //             item.from = "MP";
    //         });
    //
    //         data.push(...corePriceList.data);
    //         data.push(...pricingList.data);
    //         data.map((item, index) => {
    //             item.key = index;
    //         });
    //         dispatch({ type: ActionTypes.L_SYMBOL_LIST, payload: data });
    //         dispatch({ type: ActionTypes.L_SYMBOL_LIST_COPY_LOADING, payload: data });
    //         dispatch({ type: ActionTypes.L_SYMBOL_LIST_LOADING, payload: false });
    //         cb && cb();
    //     } catch (e) {
    //         console.log(e);
    //     }
    // };
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.L_SYMBOL_LIST_LOADING, payload: true });
            const result = await findAllSymbol();
            const reference = await getCorePriceListFetch();
            const referenceData = reference.data;
            const data = result.data;
            data.map(item => {
                item.symbol = item.code.split("@")[0];
                item.venue = item.exchangeCode;
                item.fromREF = false;
            });
            referenceData.map(item => {
                item.varietyType = item.tenorType;
                item.exchangeCode = "REF";  //referencePriceConfig中获取不到venue
                item.key = item.id;   //用于选中
                item.fromREF = true;
            });
            data.push(...referenceData);
            dispatch({ type: ActionTypes.L_SYMBOL_LIST, payload: data });
            dispatch({ type: ActionTypes.L_SYMBOL_LIST_COPY_LOADING, payload: data });
            dispatch({ type: ActionTypes.L_SYMBOL_LIST_LOADING, payload: false });
            cb && cb();
        } catch (e) {
            console.log(e);
        }
    };
};


const getCptyList = (params, cb) => {
    return async dispatch => {
        try {
            const result = await findCreditCpty(params);
            cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};

const updateList = (params, cb) => {
    return async dispatch => {
        try {
            const result = await updateQuidity(params);
            cb&& cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};

const addQuidity = (params, cb) => {
    return async dispatch => {
        try {
            let result = await createQuidity(params);
            cb && cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};

const deleteQdy = (params, cb) => {
    return async dispatch => {
        try {
            let result = await deleteQuidity(params);
            cb && cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};

const sendQuoteReq = (params, cb) => {
    return async dispatch => {
        try {
            let result = await manualTradingQuoteRequest(params);
            cb && cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};

const onPlaceOrderRFQ = (params, cb) => {
    return async dispatch => {
        try {
            let result = await placeOrder(params);
            cb && cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};

const setTradeBlotter = () => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.FIND_REALTIME_ORDER, payload: [] });
        } catch (e) {
            console.log(e);
        }
    };
};

export {  getLiquidityList, setTradeBlotter, setLiquidityList, getSymbolList, setAddList,
    addQuidity, deleteQdy, getCptyList, updateList, sendQuoteReq, onPlaceOrderRFQ, setMarketPrice, setReferencePrice };
