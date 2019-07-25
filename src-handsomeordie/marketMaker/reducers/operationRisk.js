import * as ActionTypes from "../constants/ActionTypes";

const initialState = {
    loading: false,
    unsaved: false,
    list: [],
    selectValue: {},
};

export default (state = initialState, action) => {
    switch (action.type) {
    case ActionTypes.OPERATION_RISK_LIST:
        return {
            ...state,
            list: action.payload,
        };
    case ActionTypes.OPERATION_RISK_LOADING:
        return {
            ...state,
            loading: action.payload,
        };
    case ActionTypes.OPERATION_RISK_UNSAVED:
        return {
            ...state,
            unsaved: action.payload,
        };
    case ActionTypes.OPERATION_RISK_SELECT_VALUE:
        return {
            ...state,
            selectValue: action.payload,
        };
    default:
        return state;
    }
};
