import * as ActionTypes from "../constants/ActionTypes";
import {
    manualTradingQuoteRequest, findTodayQuoteRequest, findTodayOrder, placeOrder,
    findVenue, findSymbol, findNetPosition, onPlaceOrder, findVenueESP,
} from "../../common/marketApi/index";
let requestId = "";
const manualTradingQuoteRequestPost = (param,cb) => {
    return async dispatch => {
        try {
            const data  = await manualTradingQuoteRequest(param);
            // console.log(data);
            if(data.success){
                cb(data.success);
            }
            dispatch({ type: ActionTypes.MANUAL_TRADING_QUOTEREQUEST, payload:data.data  });
        } catch (e) {
            console.log(e);
            cb(false);
        }
    };
};

const findTodayQuoteRequestGet = () => {
    return async dispatch => {
        try {
            const data  = await findTodayQuoteRequest();
            // console.log(data);
            if(data && data.data && data.data.length){
                requestId = data.data[0].requestId;
            } else {
                requestId = "";
            }
            dispatch({ type: ActionTypes.FIND_TODAY_QUOTE_REQUEST, payload:data.data, currentQuoteRequestId: requestId });
            dispatch({ type: ActionTypes.SET_QUOTE_REQUEST_ID, currentQuoteRequestId: requestId });
        } catch (e) {
            console.log(e);
        }
    };
};


const setQuoteRequestId = (id) => {
    return async dispatch => {
        try {
            // console.log(id);
            requestId = id;
            dispatch({ type: ActionTypes.SET_QUOTE_REQUEST_ID, currentQuoteRequestId: id });
        } catch (e) {
            console.log(e);
        }
    };
};

const saveManualRequestInfo = (message) => {
    return async dispatch => {
        try {
            // const data  = await findTodayQuoteRequest();
            // console.log(message.requestId,requestId);
            if(message.requestId === requestId){
                dispatch({ type: ActionTypes.SAVE_MANUAL_REQUEST_INFO, payload: message });
            }
        } catch (e) {
            console.log(e);
        }
    };
};

const findTodayOrderGet = () => {
    return async dispatch => {
        try {
            const data  = await findTodayOrder();
            // console.log(data);
            dispatch({ type: ActionTypes.FIND_TODAY_ORDER, payload: data.data });
        } catch (e) {
            console.log(e);
        }
    };
};

const placeOrderPost = (params,cb) => {
    return async dispatch => {
        try {
            const data  = await placeOrder(params);
            if(data.success){
                cb(data.success);
            }
            // console.log(data);
            dispatch({ type: ActionTypes.PLACE_ORDER, payload: data });
        } catch (e) {
            console.log(e);
        }
    };
};

const getVenues = (params,cb) => {
    return async dispatch => {
        try {
            const result = await findVenue(params);
            cb && cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};

const getSymbols = (params,cb) => {
    return async dispatch => {
        try {
            const result = await findSymbol(params);
            cb && cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};

const getNetPositions = (params,cb) => {
    return async dispatch => {
        try {
            const result = await findNetPosition(params);
            cb && cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};

const handlePlaceOrder = (params,cb) => {
    return async dispatch => {
        try {
            const result = await onPlaceOrder(params);
            cb && cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};

const getVenueESP = (params,cb) => {
    return async dispatch => {
        try {
            const result = await findVenueESP(params);
            cb && cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};

export {
    manualTradingQuoteRequestPost, findTodayQuoteRequestGet, saveManualRequestInfo, findTodayOrderGet, setQuoteRequestId, placeOrderPost,
    getVenues, getSymbols, getNetPositions, handlePlaceOrder, getVenueESP,
};


