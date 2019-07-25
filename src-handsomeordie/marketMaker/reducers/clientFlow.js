import * as ActionTypes from "../constants/ActionTypes";

const initialState = {
    loading: false,
    unsaved: false,
    clientFlowList: [],
    selectValue: {},

    showClientFlow: true,
    showRiskMonitor: true,

    showManualTrading: true,
    showRradeBlotter: true,
};

export default (state = initialState, action) => {
    switch (action.type) {
    case ActionTypes.CLIENT_FLOW_LIST:
        return {
            ...state,
            clientFlowList: action.payload,
        };
    case ActionTypes.CLIENT_FLOW_LIST_LOADING:
        return {
            ...state,
            loading: action.payload,
        };
    case ActionTypes.CLIENT_FLOW_LIST_UNSAVED:
        return {
            ...state,
            unsaved: action.payload,
        };
    case ActionTypes.CLIENT_FLOW_SELECT_VALUE:
        return {
            ...state,
            selectValue: action.payload,
        };
    case ActionTypes.CHANGE_SHOW_CLIENTFLOW:
        return {
            ...state,
            showClientFlow: action.payload,
        };
    case ActionTypes.CHANGE_SHOW_RISKMONITOR:
        return {
            ...state,
            showRiskMonitor: action.payload,
        };
    case ActionTypes.CHANGE_SHOW_TRADING:
        return {
            ...state,
            showManualTrading: action.payload,
        };
    case ActionTypes.CHANGE_SHOW_BLOTTER:
        return {
            ...state,
            showRradeBlotter: action.payload,
        };
    default:
        return state;
    }
};
