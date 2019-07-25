import * as ActionTypes from "../constants/ActionTypes";
import { findCpty } from "../../common/marketApi/index";

const getCounterPartyList = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.COUNTER_LIST_LOADING, payload: true });
            const result = await findCpty(params);
            // setTimeout(()=>{
            // const data = [
            //     {a: "USD/CNY", b: "SPOT", c: "1,000,000", d: "6298000", e: "+82,992.00", f: "100 Mil", g: "100 Mil"},
            //     {a: "USD/CNY", b: "SPOT", c: "1,000,000", d: "6298000", e: "+82,992.00", f: "100 Mil", g: "100 Mil"},
            //     {a: "USD/CNY", b: "SPOT", c: "1,000,000", d: "6298000", e: "+82,992.00", f: "100 Mil", g: "100 Mil"},
            //     {a: "USD/CNY", b: "SPOT", c: "1,000,000", d: "6298000", e: "+82,992.00", f: "100 Mil", g: "100 Mil"},
            //     {a: "USD/CNY", b: "SPOT", c: "1,000,000", d: "6298000", e: "+82,992.00", f: "100 Mil", g: "100 Mil"},
            //     {a: "USD/CNY", b: "SPOT", c: "1,000,000", d: "6298000", e: "+82,992.00", f: "100 Mil", g: "100 Mil"},
            //     {a: "USD/CNY", b: "SPOT", c: "1,000,000", d: "6298000", e: "+82,992.00", f: "100 Mil", g: "100 Mil"},
            //     {a: "USD/CNY", b: "SPOT", c: "1,000,000", d: "6298000", e: "+82,992.00", f: "100 Mil", g: "100 Mil"},
            // ];
            dispatch({ type: ActionTypes.COUNTERPARTY_LIST, payload: result.data });
            dispatch({ type: ActionTypes.COUNTER_LIST_LOADING, payload: false });
            // }, 2000);
        } catch (e) {
            console.log(e);
        }
    };
};

const updatePositionList = (positionList) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.POSITION_LIST, payload: positionList });
        } catch (e) {
            console.log(e);
        }
    };
};

export { getCounterPartyList, updatePositionList };