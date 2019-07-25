import * as ActionTypes from "../constants/ActionTypes";

const initialState = {
    marketData: [],
    appliedMarket: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
    case ActionTypes.MARKET_DATA:
        return {
            ...state,
            marketData: action.payload,
        };
    case ActionTypes.APPLIED_MARKET:
        return {
            ...state,
            appliedMarket: action.payload,
        };
    default:
        return state;
    }
};
