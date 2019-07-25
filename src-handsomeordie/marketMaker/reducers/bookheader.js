import * as ActionTypes from "../constants/ActionTypes";

const initialState = {
    // strategyBtnList:[]
    btnName:{},
    paramList:[],
    btnIndex:{},
    inputInfo: {},
};

export default (state = initialState, action) => {
    switch (action.type) {
    case ActionTypes.STRATEGY_LIST:
        return {
            ...state,
            strategyList: action.payload,
        };
    case ActionTypes.BTN_NAME:
        return {
            ...state,
            btnName: action.payload,
        };
    case ActionTypes.BTN_INDEX:
        return {
            ...state,
            btnIndex: action.payload,
        };
    case ActionTypes.PARAM_LIST:
        return {
            ...state,
            paramList: action.payload,
        };
    case ActionTypes.INPUT_INFO:
        return {
            ...state,
            inputInfo: action.payload,
        };
        
    default:
        return state;
    }
};
