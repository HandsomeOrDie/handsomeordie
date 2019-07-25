import * as ActionTypes from "../constants/ActionTypes";

const initialState = {
    orderList: [],
    totalRecords: 0,
    loading: false,
};

const TradeBlotterReducer = (state = initialState, action) => {
    switch (action.type) {
    case ActionTypes.FIND_REALTIME_ORDER:
        return {
            ...state,
            orderList: action.payload.data,
            totalRecords: action.payload.totalRecords,
        };
    case ActionTypes.TRADE_ORDER_LIST_LOADING:
        return {
            ...state,
            loading: action.payload,
        };

    default:
        return state;
    }
};

export default TradeBlotterReducer;