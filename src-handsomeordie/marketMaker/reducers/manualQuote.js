import * as ActionTypes from "../constants/ActionTypes";

const initialState = {
    loading: false,
    manualQuoteList: [],
    quoteSource: [],
    quoteOutput: undefined,
};

export default (state = initialState, action) => {
    switch (action.type) {
    case ActionTypes.MANUAL_QUOTE_LIST:
        return {
            ...state,
            manualQuoteList: action.payload,
        };
    case ActionTypes.MANUAL_QUOTE_LIST_LOADING:
        return {
            ...state,
            loading: action.payload,
        };
    case ActionTypes.QUOTE_SOURCE:
        return {
            ...state,
            quoteSource: action.payload,
        };
    case ActionTypes.SAVE_QUOTE_OUTPUT:
        return {
            ...state,
            quoteOutput: action.payload,
        };
    default:
        return state;
    }
};
