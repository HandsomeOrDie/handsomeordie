import * as ActionTypes from "../constants/ActionTypes";
import {FetchFindRealtimeOrderTab, findExecutionByOrderId} from "../../common/marketApi/index";

const findRealtimeOrder = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.TRADE_ORDER_LIST_LOADING, payload: true });
            // params.orders = "[{\"time\":\"DESC\"}]";
            let paramsStr = "";
            Object.keys(params).map(key => {
                paramsStr = paramsStr + key + "=" + params[key] + "&";
            });
            paramsStr = "?" + paramsStr + encodeURI("orders=[{\"time\":\"DESC\"}]");
            const data =await FetchFindRealtimeOrderTab(params);
            // console.log(data);
            dispatch({ type: ActionTypes.FIND_REALTIME_ORDER, payload: data });
            dispatch({ type: ActionTypes.TRADE_ORDER_LIST_LOADING, payload: false });
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

const findExecution = (params,cb) => {
    return async dispatch => {
        try {
            const data = await findExecutionByOrderId(params);
            if(data.success){
                cb(data.data);
            }
            dispatch({ type: ActionTypes.FIND_EXECUTION_BY_ORDER_ID, payload: data });
        } catch (e) {
            console.log(e);
        }
    };
};

export {  findRealtimeOrder, setTradeBlotter, findExecution };