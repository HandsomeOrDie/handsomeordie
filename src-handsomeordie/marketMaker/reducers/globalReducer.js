import * as ActionTypes from "../constants/ActionTypes";

const initialState = {
    marketPrice: {},
    marketPriceRecord: {},
    referencePrice: {},
    mktPriceMsg: {},
    minTicks: {},
    orderBook: {},
    connected: 3,

    showNotification: true,
};

export default (state = initialState, action) => {
    // console.log("action:", action);
    switch (action.type) {
    case ActionTypes.MARKET_PRICE:
        return {
            ...state,
            marketPrice: action.payload,
        };
    case ActionTypes.REFERENCE_PRICE:
        return {
            ...state,
            referencePrice: action.payload,
        };
    case ActionTypes.MARKET_PRICE_MSG:
        return {
            ...state,
            mktPriceMsg: action.payload,
        };
    case ActionTypes.MARKET_PRICE_ALL:
        return {
            ...state,
            marketPrice: action.payload.marketPrice,
            mktPriceMsg: action.payload.mktPriceMsg,
        };
    case ActionTypes.SAVE_MINTICK:
        return {
            ...state,
            minTicks: action.payload,
        };
    case ActionTypes.ORDER_BOOK_VALUE:
        return {
            ...state,
            orderBook: action.payload,
        };
    case ActionTypes.SOCKET_CONNECTED:
        return {
            ...state,
            connected: action.payload,
        };
    case ActionTypes.SHOW_NOTIFICATION:
        return {
            ...state,
            showNotification: action.payload,
        };
    default:
        return state;
    }
};
