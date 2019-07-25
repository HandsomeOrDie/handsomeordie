import * as ActionTypes from "../constants/ActionTypes";

const initialState = {};
const Save_trReducer = (state = initialState, action) => {
    switch (action.type) {
    case ActionTypes.SAVE_TR:
        return {
            ...state,
            list: action.payload,
        };
   
    default:
        return state;
    }
};
export default Save_trReducer;