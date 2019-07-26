import * as ActionTypes from "../constants/ActionTypes";

const initialState = {};
const themeReducer = (state = initialState, action) => {
    switch (action.type) {
    case ActionTypes.SET_THEME:
        return {
            ...state,
            theme: action.payload,
        };
   
    default:
        return state;
    }
};
export default themeReducer;