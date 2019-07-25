import * as ActionTypes from "../constants/ActionTypes";

const initialState = {
};

const find_PrincingReducer = (state = initialState, action) => {
   
    switch (action.type) {
    case ActionTypes.SAVE_PRICING_LIST:
        return {
            ...state,
            pricingList: action.payload,
        };
   
    case ActionTypes.FIND_PRICING_LIST:

        return {
            ...state,
            pricingList: action.payload,
        };
   
    case ActionTypes.DELETE_PRICING_LIST:
        return {
            ...state,
            pricingList: action.payload,
        };
   
    default:
        return state;
    }
};
export default find_PrincingReducer;