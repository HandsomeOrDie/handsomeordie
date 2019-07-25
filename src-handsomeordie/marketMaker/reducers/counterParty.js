import { COUNTER_PARTY, COUNTER_PARTY_DRAG,COUNTER_PARTY_SAVE } from "../constants/ActionTypes";

const initialState = {};

const CounterPartyReducer = (state=initialState, action) => {
    switch (action.type) {
    case COUNTER_PARTY:
        console.log(action);
        return {
            ...state,
            list: action.payload,
            nameObj: action.nameObj
        };
    case COUNTER_PARTY_DRAG:
        return {
            ...state,
            list_drag: action.payload
        };
    case COUNTER_PARTY_SAVE:
        return {
            ...state,
            list_save: action.payload
        };
    default:
        return state;
    }
};

export default CounterPartyReducer;