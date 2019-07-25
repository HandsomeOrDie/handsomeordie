import * as ActionTypes from "../constants/ActionTypes";

const initialState = {
    systemAlert: []
};

const systemAlertReducer = (state = initialState, action) => {
    switch (action.type) {
    case ActionTypes.GET_SYSTEM_ALERT:
        return {
            ...state,
            systemAlert: action.payload.data
        };

    default:
        return state;
    }
};

export default systemAlertReducer;