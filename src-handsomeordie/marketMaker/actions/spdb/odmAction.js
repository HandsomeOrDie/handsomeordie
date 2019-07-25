import * as ActionTypes from "../../constants/spdb/ActionTypes";
import { findInstance, start, stop, update, upload, findDefinitionList, findAlgo, deleteStrategy,tradingvarietymanage, findQuotes, batchBindInstance,
    cancelOrderBatch, } from "../../../common/spdbApi";
import { placeOrder } from "../../../common/marketApi";

const updateOrderBookList = (orderBookList, cb) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.ORDER_BOOK_LIST, payload: [...orderBookList] });
            cb && cb();
        } catch (e) {
            console.log(e);
        }
    };
};

const getInstance = (params, cb) => {
    return async dispatch => {
        try {
            let arr = await Promise.all([
                findInstance(params),
            ]);
            const instances = arr[0];
            cb && cb(instances);
        } catch (e) {
            console.log(e);
        }
    };
};

const startInstance = (params, cb) => {
    return async dispatch => {
        try {
            console.log(params);
            const result = await start(params);
            cb && cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};

const stopInstance = (params, cb) => {
    return async dispatch => {
        try {
            const result = await stop(params);
            cb && cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};

const updateInstance = (params, cb) => {
    return async dispatch => {
        try {
            const result = await update(params);
            cb && cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};

const uploadScirpt = (params, cb) => {
    return async dispatch => {
        try {
            const result = await upload(params);
            cb && cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};

const getDefinitionList = (params, cb) => {
    return async dispatch => {
        try {
            const result = await findDefinitionList(params);
            cb && cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};

const getAlgo = (params, cb) => {
    return async dispatch => {
        try {
            const result = await findAlgo(params);
            cb && cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};

const deleteStrategyById = (params, cb) => {
    return async dispatch => {
        try {
            const result = await deleteStrategy(params);
            cb && cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};

const tradingvarietymanageFind = (params, cb) => {
    return async dispatch => {
        try {
            const result = await tradingvarietymanage(params);
            // console.log(result,111);
            let arr = [];
            if(result.success){
                for(let i in result.data){
                    arr.push({
                        key: result.data[i].key,
                        displayName: result.data[i].displayName,
                    });
                }
            }
            dispatch({ type: ActionTypes.TRADINGVARIETYMANAGE_FIND, payload: arr });
            cb && cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};


const getQuotes = (params, cb) => {
    return async dispatch => {
        try {
            const result = await findQuotes(params);
            cb && cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};

const updateSelectedQuotes = (selectedQuotes, cb) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.SELECTED_QUOTES, payload: [...selectedQuotes] });
            cb && cb();
        } catch (e) {
            console.log(e);
        }
    };
};

const setOrderBook = (orderBook, cb) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.SET_ORDER_BOOK, payload: {...orderBook} });
            cb && cb();
        } catch (e) {
            console.log(e);
        }
    };
};
const setOrderBook1 = (orderBook1, cb) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.SET_ORDER_BOOK_1, payload: {...orderBook1} });
            cb && cb();
        } catch (e) {
            console.log(e);
        }
    };
};
const setOrderBook2 = (orderBook2, cb) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.SET_ORDER_BOOK_2, payload: {...orderBook2} });
            cb && cb();
        } catch (e) {
            console.log(e);
        }
    };
};
const setOrderBook3= (orderBook3, cb) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.SET_ORDER_BOOK_3, payload: {...orderBook3} });
            cb && cb();
        } catch (e) {
            console.log(e);
        }
    };
};
const setMarketData = (params, cb) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.MARKET_PRICE_DATA, payload: {...params} });
            cb && cb();
        } catch (e) {
            console.log(e);
        }
    };
};

const placeOrderPost = (params, cb) => {
    return async dispatch => {
        try {
            const result = await placeOrder(params);
            cb && cb(result.success);
        } catch (e) {
            console.log(e);
        }
    };
};

const setSymbolClickId = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.CLICK_SYMBOL_ID, payload: params});
        } catch (e) {
            console.log(e);
        }
    };
};
const batchUpdateStrategy = (params, cb) => {
    return async dispatch => {
        try {
            const result = await batchBindInstance(params);
            cb && cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};

const setPaintPrice = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.PAINT_PRICE, payload: params});
        } catch (e) {
            console.log(e);
        }
    };
};

const batchCancelOrder = (params, cb) => {
    return async dispatch => {
        try {
            const result = await cancelOrderBatch(params);
            cb && cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};

export { updateOrderBookList, getInstance, startInstance, stopInstance, updateInstance, uploadScirpt,
    getDefinitionList, getAlgo, deleteStrategyById, tradingvarietymanageFind, getQuotes, updateSelectedQuotes,
    setOrderBook, setOrderBook1, setOrderBook2, setOrderBook3, setMarketData, placeOrderPost, setSymbolClickId,
    batchUpdateStrategy, setPaintPrice, batchCancelOrder, };
