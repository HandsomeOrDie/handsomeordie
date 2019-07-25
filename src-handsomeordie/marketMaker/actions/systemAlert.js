import * as ActionTypes from "../constants/ActionTypes";
import {getSystemAlert} from "../../common/marketApi/index";


const systemAlert = (param,cb) => {
    return async dispatch => {
        try {
            const data = await getSystemAlert(param);
            if(data.success){
                cb(data.data);
            }
            dispatch({ type: ActionTypes.GET_SYSTEM_ALERT, payload: data });
        } catch (e) {
            console.log(e);
        }
    };
};

export {  systemAlert };