import * as ActionTypes from "../constants/ActionTypes";

const initialState = {
    loading: false,
    counterPartyList: []
};

export default (state = initialState, action) => {
    switch (action.type) {
    case ActionTypes.COUNTERPARTY_LIST:
        return {
            ...state,
            counterPartyList: action.payload,
        };
    case ActionTypes.COUNTER_LIST_LOADING:
        return {
            ...state,
            loading: action.payload,
        };
    default:
        return state;
    }
};
