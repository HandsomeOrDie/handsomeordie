import * as ActionTypes from "../constants/ActionTypes";

const account = sessionStorage.getItem("account");

const initialState = {
    account: JSON.parse(account),
    isLogin: !!account
};

export default (state = initialState, action) => {
    switch (action.type) {
    case ActionTypes.LOGIN_SUCCESS:
        return {
            ...state,
            isLogin: true,
            account: action.payload
        };
    case ActionTypes.LOGOUT:
        return {
            ...state,
            isLogin: false,
            account: null
        };
    default:
        return state;
    }
};
