import {SAVE_PARAM, SAVE_SOCKET} from "../constants/ActionTypes";

const initialState = {};
const paramReducer = (state = initialState, action) => {
    switch (action.type) {
    case SAVE_PARAM:
        return {
            ...state,
            strategyParam: action.strategyParam,
        };
    default:
        return state;
    }
};
export default paramReducer;