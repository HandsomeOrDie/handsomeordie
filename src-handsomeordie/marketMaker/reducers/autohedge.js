import * as ActionTypes from "../constants/ActionTypes";

const initialState = {
    loading: false,
    unsaved: false,
    hedgeList: [],
    selectValue: {},
};

export default (state = initialState, action) => {
    switch (action.type) {
    case ActionTypes.HEDGE_LIST:
        return {
            ...state,
            hedgeList: action.payload,
        };
    case ActionTypes.HEDGE_LIST_LOADING:
        return {
            ...state,
            loading: action.payload,
        };
    case ActionTypes.HEDGE_LIST_UNSAVED:
        return {
            ...state,
            unsaved: action.payload,
        };
    case ActionTypes.HEDGE_SELECT_VALUE:
        return {
            ...state,
            selectValue: action.payload,
        };
    default:
        return state;
    }
};
