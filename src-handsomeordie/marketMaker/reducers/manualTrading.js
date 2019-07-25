import * as ActionTypes from "../constants/ActionTypes";

const initialState = {
    manualTradingQuoteRequest: {},
    todayQuoteRequest: [],
    manualQuoteRequestInfo: {},

    // venueSelectValue: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
    case ActionTypes.MANUAL_QUOTE_LIST:
        return {
            ...state,
            manualTradingQuoteRequest: action.payload,
        };

    case ActionTypes.FIND_TODAY_QUOTE_REQUEST:
        return {
            ...state,
            todayQuoteRequest: action.payload
        };
    
    case ActionTypes.SET_QUOTE_REQUEST_ID:
        return {
            ...state,
            currentQuoteRequestId: action.currentQuoteRequestId
        };
        
    case ActionTypes.SAVE_MANUAL_REQUEST_INFO:
        return {
            ...state,
            manualQuoteRequestInfo: action.payload,
        };

    case ActionTypes.FIND_TODAY_ORDER:
        return {
            ...state,
            findTodayOrderGet: action.payload,
        };

    default:
        return state;
    }
};
