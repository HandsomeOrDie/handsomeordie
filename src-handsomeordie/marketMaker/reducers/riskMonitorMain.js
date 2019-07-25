import * as ActionTypes from "../constants/ActionTypes";

const initialState = {
    marketRiskStatus: [],
    riskAlert: [],
};

export default (state = initialState, action) => {
    // console.log("+++", state);
    switch (action.type) {
    case ActionTypes.MARKET_RISK_STATUS:
        return {
            ...state,
            marketRiskStatus: action.payload,
        };
    case ActionTypes.RISK_ALERT:
        return {
            ...state,
            riskAlert: action.payload,
        };
    default:
        return state;
    }
};
