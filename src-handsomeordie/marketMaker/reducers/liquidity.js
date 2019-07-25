import * as ActionTypes from "../constants/ActionTypes";

const initialState = {
    list: [],
    totalRecords: 0,
    loading: false,
    addList: [],
    addListCopy: [],
    addLoading: false,
    mktPriceMsg: {},
    referencePrice: {}
};

const LiquidityReducer = (state = initialState, action) => {
    switch (action.type) {
    case ActionTypes.LIQUIDITY_LIST:
        return {
            ...state,
            list: action.payload,
            totalRecords: action.payload.totalRecords,
        };
    case ActionTypes.LIQUIDITY_LIST_LOADING:
        return {
            ...state,
            loading: action.payload,
        };
    case ActionTypes.L_SYMBOL_LIST_LOADING:
        return {
            ...state,
            addLoading: action.payload,
        };
    case ActionTypes.L_SYMBOL_LIST:
        return {
            ...state,
            addList: action.payload,
        };
    case ActionTypes.L_SYMBOL_LIST_COPY_LOADING:
        return {
            ...state,
            addListCopy: action.payload,
        };
    case ActionTypes.MARKET_PRICE_LIQUIDITY:
        return {
            ...state,
            mktPriceMsg: action.payload,
        };
    case ActionTypes.LIQUIDITY_REFERENCE:
        return {
            ...state,
            referencePrice: action.payload,
        };


    default:
        return state;
    }
};

export default LiquidityReducer;
