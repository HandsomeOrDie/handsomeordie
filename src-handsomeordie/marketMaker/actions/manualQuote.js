import * as ActionTypes from "../constants/ActionTypes";
import {FetchFindPendingTab, FetchFindQuoteSource, quote, approve, reject} from "../../common/marketApi/index";

const getManualQuoteList = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.MANUAL_QUOTE_LIST_LOADING, payload: true });
            const result = await FetchFindPendingTab(params);
            // const result = {};
            // const data = [
            //     {requestId: "RFQ300022", symbol: "USDCNY", tenor: "3M/6M", counterPty: "China Petrol", status: "RFQ", bid: "6.2871", ask: "6.2872", side: "Bid", price: "6.2871", qty: "1", time: Date.now()},
            //     {requestId: "RFQ300022", symbol: "USDCNY", tenor: "3M/6M", counterPty: "China Petrol", status: "Lastlook", bid: "6.2871", ask: "6.2872", side: "Bid", price: "6.2871", qty: "1", time: Date.now()},
            //     {requestId: "RFQ300022", symbol: "USDCNY", tenor: "3M/6M", counterPty: "China Petrol", status: "RFQ", bid: "6.2871", ask: "6.2872", side: "Bid", price: "6.2871", qty: "1", time: Date.now()},
            //     {requestId: "RFQ300022", symbol: "USDCNY", tenor: "3M/6M", counterPty: "China Petrol", status: "Lastlook", bid: "6.2871", ask: "6.2872", side: "Bid", price: "6.2871", qty: "1", time: Date.now()},
            //     {requestId: "RFQ300022", symbol: "USDCNY", tenor: "3M/6M", counterPty: "China Petrol", status: "RFQ", bid: "6.2871", ask: "6.2872", side: "Bid", price: "6.2871", qty: "1", time: Date.now()},
            // ];
            // result.data = data;
            // result.data[1].status = "LAStLOOK";
            dispatch({ type: ActionTypes.MANUAL_QUOTE_LIST, payload: result.data || [] });
            dispatch({ type: ActionTypes.MANUAL_QUOTE_LIST_LOADING, payload: false });
        } catch (e) {
            console.log(e);
        }
    };
};

const setManualQuoteList = (list, cb) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.MANUAL_QUOTE_LIST, payload: list || [] });
            cb && cb();
        } catch (e) {
            console.log(e);
        }
    };
};

const getQuoteSource = (params, cb) => {
    return async dispatch => {
        try {
            const result = await FetchFindQuoteSource(params);
            cb(result);
            dispatch({ type: ActionTypes.QUOTE_SOURCE, payload: result.data });
        } catch (e) {
            console.log(e);
        }
    };
};

const onApprove = (params, cb) => {
    return async dispatch => {
        try {
            const response  = await approve(params);
            cb(response);
            // dispatch({ type: ActionTypes.QUOTE_RFQ, payload: response);
        } catch (e) {
            console.log(e);
        }
    };
};

const onReject = (params, cb) => {
    return async dispatch => {
        try {
            const response  = await reject(params);
            cb(response);
            // dispatch({ type: ActionTypes.QUOTE_RFQ, payload: response);
        } catch (e) {
            console.log(e);
        }
    };
};

const sendQuote = (params, cb) => {
    return async dispatch => {
        try {
            const response  = await quote(params);
            cb(response);
            // dispatch({ type: ActionTypes.QUOTE_RFQ, payload: response);
        } catch (e) {
            console.log(e);
        }
    };
};

const saveQuoteOutput = (message) => {
    return async dispatch => {
        dispatch({ type: ActionTypes.SAVE_QUOTE_OUTPUT, payload: message});
    };
};

const updatePositionList = (positionList) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.POSITION_LIST, payload: positionList });
        } catch (e) {
            console.log(e);
        }
    };
};

export { getManualQuoteList, sendQuote, getQuoteSource, saveQuoteOutput, onApprove, onReject, setManualQuoteList };
