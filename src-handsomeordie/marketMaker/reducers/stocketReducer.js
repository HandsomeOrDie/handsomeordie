import {GET_REFERENCE, SAVE_SOCKET, SAVE_SOCKET_INSTANCEOUTPUT} from "../constants/ActionTypes";

const initialState = {};
const stocketReducer = (state = initialState, action) => {
    switch (action.type) {
    case GET_REFERENCE:
        return {
            ...state,
            referencePriceData: action.payload,
        };
        
    case SAVE_SOCKET:
        // console.log(action.socketList);
        return {
            ...state,
            socketList: action.socketList
        };
    case SAVE_SOCKET_INSTANCEOUTPUT:
        return {
            ...state,
            socket_instanceList: action.payload
        };
    default:
        return state;
    }
};
export default stocketReducer;