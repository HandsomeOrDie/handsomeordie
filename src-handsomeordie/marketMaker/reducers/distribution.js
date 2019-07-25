import * as ActionTypes from "../constants/ActionTypes";

const initialState = {
    distributionList: [],
    distributionQuoteList: [],
    quoteSourceList: []
};

export default (state = initialState, action) => {
    let newDistributionList = [...state.distributionList];

    switch (action.type) {
    case ActionTypes.GET_DISTRIBUTION_LIST_BY_INSTANCE_ID:
        return {
            ...state,
            distributionList: action.payload,
            distributionQuoteList: [],
            lastActionType: action.type
        };
    case ActionTypes.SAVE_DISTRIBUTION:
        for (let i = 0; i < newDistributionList.length; i++) {
            if (newDistributionList[i].id === action.payload.id) {
                newDistributionList[i] = action.payload;
                break;
            }
        }
        return {
            ...state,
            distributionList: newDistributionList,
            lastActionType: action.type
        };
    case ActionTypes.ADD_DISTRIBUTION:
        newDistributionList.push(action.payload);
        return {
            ...state,
            distributionList: newDistributionList,
            lastActionType: action.type
        };
    case ActionTypes.DELETE_DISTRIBUTION_BY_ID:
        for (let i = 0; i < newDistributionList.length; i++) {
            if (newDistributionList[i].id === action.payload) {
                newDistributionList.splice(i, 1);
                break;
            }
        }
        return {
            ...state,
            distributionList: newDistributionList,
            lastActionType: action.type
        };
    case ActionTypes.SAVE_QUOTE:
        return {
            ...state,
            distributionQuoteList: [...action.payload],
            lastActionType: action.type
        };
    case ActionTypes.GET_QUOTE_SOURCE_LIST:
        return {
            ...state,
            quoteSourceList: action.payload
        };
    default:
        return state;
    }
};
