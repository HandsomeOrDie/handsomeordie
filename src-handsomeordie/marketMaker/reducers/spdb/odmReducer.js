import * as ActionTypes from "../../constants/spdb/ActionTypes";

const initialState = {
    orderBookList: [],
    tradingvarietymanage: [],
    selectedQuotes: [],

    orderBook1: undefined,
    orderBook2: undefined,
    orderBook3: undefined,

    mkData: {},
    clickId: undefined,

    allBook: [],
    paintPrice: {},

    socketConnected: 3,
};

export default (state = initialState, action) => {
    switch (action.type) {
    case ActionTypes.ORDER_BOOK_LIST:
        return {
            ...state,
            orderBookList: action.payload,
        };
    case ActionTypes.TRADINGVARIETYMANAGE_FIND:
        return {
            ...state,
            tradingvarietymanage: action.payload,
        };
    case ActionTypes.SELECTED_QUOTES:
        return {
            ...state,
            selectedQuotes: action.payload,
        };
    case ActionTypes.SET_ORDER_BOOK:
        return {
            ...state,
            orderBook1: action.payload.orderBook1,
            orderBook2: action.payload.orderBook2,
            orderBook3: action.payload.orderBook3,
        };
    case ActionTypes.SET_ORDER_BOOK_1:
        return {
            ...state,
            orderBook1: action.payload,
        };
    case ActionTypes.SET_ORDER_BOOK_2:
        return {
            ...state,
            orderBook2: action.payload,
        };
    case ActionTypes.SET_ORDER_BOOK_3:
        return {
            ...state,
            orderBook3: action.payload,
        };
    case ActionTypes.MARKET_PRICE_DATA:
        return {
            ...state,
            mkData: action.payload,
        };
    case ActionTypes.CLICK_SYMBOL_ID:
        return {
            ...state,
            clickId: action.payload,
        };
    case ActionTypes.SAVE_ALL_BOOK:
        return {
            ...state,
            allBook: action.payload,
        };
    case ActionTypes.PAINT_PRICE:
        return {
            ...state,
            paintPrice: action.payload,
        };
    case ActionTypes.SOCKET_CONNECTED:
        return {
            ...state,
            socketConnected: action.payload,
        };
    default:
        return state;
    }
};
