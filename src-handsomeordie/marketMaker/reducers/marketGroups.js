import { GET_GROUPS, CREATE_GROUPS, UPDATE_GROUPS, DELETE_GROUPS } from "../constants/ActionTypes";

const initialState = {};

const GroupsReducer = (state=initialState, action) => {
    switch (action.type) {
    case GET_GROUPS:
        return {
            ...state,
            list: action.payload
        };
    case CREATE_GROUPS:
        return {
            ...state,
            list: action.list
        };
    case UPDATE_GROUPS:
        return {
            ...state,
            list_update: action.list
        };
    case DELETE_GROUPS:
        return {
            ...state,
            list: action.list
        };
    default:
        return state;
    }
};

export default GroupsReducer;