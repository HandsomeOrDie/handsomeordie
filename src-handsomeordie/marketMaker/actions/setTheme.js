import * as ActionTypes from "../constants/ActionTypes";

const setTheme = (record) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.SET_THEME, payload: record });
        } catch (e) {
            console.log(e);
        }
    };
};

export {  setTheme };
