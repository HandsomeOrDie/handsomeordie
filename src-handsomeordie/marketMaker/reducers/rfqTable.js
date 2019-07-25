import * as ActionTypes from "../constants/ActionTypes";


const initialState = {
    quoteList:[],
    quoteID:null
};

export default (state = initialState, action) => {
    switch (action.type) {
    case ActionTypes.FIND_PENDING:
        return {
            ...state,
            quoteList:action.payload
        };
    case ActionTypes.QUOTE_SOURCE:
        return {
            ...state,
            quoteSource:action.payload
        };
    case ActionTypes.QUOTE_ID:
        return {
            ...state,
            quoteID:action.payload
        };
    case ActionTypes.QUOTE_MESSAGE:
        return {
            ...state,
            quoteMessage:action.payload
        };

    default:
        return state;
    }
};
