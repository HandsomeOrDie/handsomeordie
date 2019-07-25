import * as ActionTypes from "../constants/ActionTypes";

const initialState = {
    loading: false,
    groupLoading: false,
    cptyList: [],
    groupList: [],

    currentGroup: {},
    selectedCpty: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
    case ActionTypes.COUNTER_PARTY_LIST:
        return {
            ...state,
            cptyList: action.payload,
        };
    case ActionTypes.COUNTER_PARTY_LOADING:
        return {
            ...state,
            loading: action.payload,
        };
    case ActionTypes.CPTY_GROUP_LIST:
        return {
            ...state,
            groupList: action.payload,
        };
    case ActionTypes.CPTY_GROUP_LOADING:
        return {
            ...state,
            groupLoading: action.payload,
        };
    case ActionTypes.CURRENT_GROUP:
        return {
            ...state,
            currentGroup: action.payload,
        };
    case ActionTypes.SELECTED_CPTY:
        return {
            ...state,
            selectedCpty: action.payload,
        };
    default:
        return state;
    }
};
