import * as ActionTypes from "../constants/ActionTypes";
import { marketRiskStatus, riskAlert } from "../../common/marketApi/index";

const marketRiskStatusFind = (cb) => {
    return async dispatch => {
        try {
            const result = await marketRiskStatus();
            if(result.success){
                cb(result.data);
            }
            dispatch({ type: ActionTypes.MARKET_RISK_STATUS, payload: result.data });
        } catch (e) {
            console.log(e);
        }
    };
};

const riskAlertFind = (cb) => {
    return async dispatch => {
        try {
            const result = await riskAlert();
            if(result.success){
                cb(result.data);
            }
            dispatch({ type: ActionTypes.RISK_ALERT, payload: result.data });
        } catch (e) {
            console.log(e);
        }
    };
};


export { marketRiskStatusFind, riskAlertFind };