import * as ActionTypes from "../constants/ActionTypes";

const initialState = {
    loading: false,
    unsaved: false,
    list: [],
    selectValue: {},

    showMarket: true,
    showOperation: true,
};

export default (state = initialState, action) => {
    switch (action.type) {
    case ActionTypes.MARKET_RISK_LIST:
        return {
            ...state,
            list: action.payload,
        };
    case ActionTypes.MARKET_RISK_LOADING:
        return {
            ...state,
            loading: action.payload,
        };
    case ActionTypes.MARKET_RISK_UNSAVED:
        return {
            ...state,
            unsaved: action.payload,
        };
    case ActionTypes.MARKET_RISK_SELECT_VALUE:
        return {
            ...state,
            selectValue: action.payload,
        };
    case ActionTypes.CHANGE_SHOW_MARKET:
        return {
            ...state,
            showMarket: action.payload,
        };
    case ActionTypes.CHANGE_SHOW_OPERATION:
        return {
            ...state,
            showOperation: action.payload,
        };
    case ActionTypes.MARKET_SELECT_VALUE:
        return {
            ...state,
            selectValue: action.payload,
        };
    default:
        return state;
    }
};
