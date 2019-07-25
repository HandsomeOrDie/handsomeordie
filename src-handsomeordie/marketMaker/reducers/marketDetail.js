import * as ActionTypes from "../constants/ActionTypes";

const initialState = {
    showDetailPage:true
};

export default (state = initialState, action) => {
    switch (action.type) {
    case ActionTypes.MARKET_PAGE_EX:
        return {
            ...state,
            showDetailPage: action.payload,
        };
        // case ActionTypes.GET_REFERENCE:
        //     return {
        //         ...state,
        //         referencePriceData: action.payload,
        //     };
        
    default:
        return state;
    }
};
