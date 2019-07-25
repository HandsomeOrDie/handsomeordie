import { SET_CURRENT_STRATEGY } from "../constants/ActionTypes";

const initialState = {};

const currentStrategy = (state=initialState, action) => {
    // console.log(action);
    switch (action.type) {
    case SET_CURRENT_STRATEGY:
        return {
            ...state,
            currentStrategy: action.currentStrategy,
            isFixed: action.isFixed
        };
    default:
        return state;
    }
};

export default currentStrategy;