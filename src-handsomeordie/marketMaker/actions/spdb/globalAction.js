import * as ActionTypes from "../../constants/spdb/ActionTypes";
const setSocketConnected = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.SOCKET_CONNECTED, payload: params });
        } catch (e) {
            console.log(e);
        }
    };
};


export { setSocketConnected };
