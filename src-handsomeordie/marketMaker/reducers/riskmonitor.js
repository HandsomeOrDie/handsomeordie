import * as ActionTypes from "../constants/ActionTypes";

const initialState = {
    loading: false,
    ccyPosiLoading: false,
    positionList: [],
    ccyPosiList: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
    case ActionTypes.POSITION_LIST:
        return {
            ...state,
            positionList: action.payload,
        };
    case ActionTypes.POSITION_LIST_LOADING:
        return {
            ...state,
            loading: action.payload,
        };

    case ActionTypes.CCYPOSI_LIST:
        return {
            ...state,
            ccyPosiList: action.payload,
        };
    case ActionTypes.CCYPOSI_LIST_LOADING:
        return {
            ...state,
            ccyPosiLoading: action.payload,
        };
    default:
        return state;
    }
};
