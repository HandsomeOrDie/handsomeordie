import * as ActionTypes from "../constants/ActionTypes";

const initialState = {
    corePriceList: [],
    marketConfigList: [],
    currentCorePrice: {}
};

export default (state = initialState, action) => {
    let newCorePriceList = [...state.corePriceList];
    let newCurrentCorePrice = { ...state.currentCorePrice };
    switch (action.type) {
    case ActionTypes.GET_CORE_PRICE_LIST:
        return {
            ...state,
            corePriceList: action.payload
        };
    case ActionTypes.SAVE_CORE_PRICE:
        for (let i = 0; i < newCorePriceList.length; i++) {
            if (newCorePriceList[i].id === action.payload.id) {
                newCorePriceList[i] = action.payload;
                break;
            }
        }
        return {
            ...state,
            corePriceList: newCorePriceList
        };
    case ActionTypes.CREATE_CORE_PRICE:
        newCorePriceList.push(action.payload);
        return {
            ...state,
            corePriceList: newCorePriceList
        };
    case ActionTypes.CORE_PRICE_MAERKET_CONFIG_LIST:
        return {
            ...state,
            marketConfigList: action.payload
        };
    case ActionTypes.DELETE_CORE_PRICE:
        for (let i = 0; i < newCorePriceList.length; i++) {
            if (newCorePriceList[i].id === action.payload) {
                newCorePriceList.splice(i, 1);
                break;
            }
        }
        return {
            ...state,
            corePriceList: newCorePriceList
        };
    case ActionTypes.GET_CORE_PRICE_BY_ID:
        state.currentCorePrice = action.payload;
        return {
            ...state
        };
    case ActionTypes.CHANGE_SOURCE_INIT_STATUS:
        for (let i = 0; i < newCurrentCorePrice.referencePriceSourceLists.length; i++) {
            if (newCurrentCorePrice.referencePriceSourceLists[i].id === action.payload.sourceItemId) {
                newCurrentCorePrice.referencePriceSourceLists[i].init = action.payload.targetStatus;
                break;
            }
        }
        return {
            ...state,
            currentCorePrice: newCurrentCorePrice
        };
    default:
        return state;
    }
};
