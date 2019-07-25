import { GET_SYMBOLLIST, SAVE_APPLY_BTN } from "../constants/ActionTypes";

const initialState = {
    applyBtn: false,
};

const SymbolListReducer = (state=initialState, action) => {
    switch (action.type) {
    case GET_SYMBOLLIST:
        return {
            ...state,
            normal_list: action.normal_list,
            group_list: action.group_list,
            group_name: action.group_name,
        };
    case SAVE_APPLY_BTN:
        return {
            ...state,
            applyBtn: action.payload,
        };
    default:
        return state;
    }
};

export default SymbolListReducer;