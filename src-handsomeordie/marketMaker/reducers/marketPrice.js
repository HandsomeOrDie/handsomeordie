import * as ActionTypes from "../constants/ActionTypes";

const initialState = {
    marketPriceList:[],
    dragValue:[],
    isFlashData:false
};

export default (state = initialState, action) => {
    switch (action.type) {
    case ActionTypes.MAERKET_CONFIG_LIST:
        return {
            ...state,
            marketPriceList: action.payload,
        };
    case ActionTypes.GET_DRAG_VAL:
        return {
            ...state,
            dragValue:[...action.payload],
        }  ;  
    case ActionTypes.SAVE_CONFIG_DADA:
        return {
            ...state,
            marketPriceList: action.payload.data,
            isFlashData:action.payload.isFlashData,
        }  ;  
    default:
        return state;
    }
};
