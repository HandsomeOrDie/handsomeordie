import * as ActionTypes from "../constants/ActionTypes";
import { findClientFlow, updateClientFlow, findSelectValue, findCpty } from "../../common/marketApi/index";
const baseField = ["pricingCcy"];
const getClientFlowList = (params) => {
    return async dispatch => {
        try {
            const anyField = ["cpty", "symbol", "tenor", "rangeTime", "scenario",];
            dispatch({ type: ActionTypes.CLIENT_FLOW_LIST_LOADING, payload: true });
            const result = await findClientFlow(params);
            const data = result.data;
            data.map((item, index) => {
                item.editing = false;
                item.key = index;
                Object.keys(item).map(i => {
                    if (item[i] === null && anyField.indexOf(i) !== -1) {
                        item[i] = "any";
                    }
                    if (item[i] === null && baseField.indexOf(i) !== -1) {
                        item[i] = "base";
                    }
                });
            });
            dispatch({ type: ActionTypes.CLIENT_FLOW_LIST, payload: data });
            dispatch({ type: ActionTypes.CLIENT_FLOW_LIST_UNSAVED, payload: false });
            dispatch({ type: ActionTypes.CLIENT_FLOW_LIST_LOADING, payload: false });
        } catch (e) {
            console.log(e);
        }
    };
};

const deleteClientFlow = (key, list) => {
    return async dispatch => {
        try {
            list.splice(list.findIndex(item => item.key === key), 1);
            let arr = [];
            arr = arr.concat(list);
            dispatch({ type: ActionTypes.CLIENT_FLOW_LIST_UNSAVED, payload: true });
            dispatch({ type: ActionTypes.CLIENT_FLOW_LIST, payload: arr });
        } catch (e) {
            console.log(e);
        }
    };
};

const addClientFlowList = (list) => {
    return async dispatch => {
        try {
            const newData = {
                key: list.length,
                editing: true,
                // cpty: "CMB",
            };
            dispatch({ type: ActionTypes.CLIENT_FLOW_LIST, payload: [...list, newData] });
            dispatch({ type: ActionTypes.CLIENT_FLOW_LIST_UNSAVED, payload: true });
        } catch (e) {
            console.log(e);
        }
    };
};

const saveClientFlowList = (list, cb) => {
    return async dispatch => {
        try {
            list.map((item, index) => {
                Object.keys(item).map(i => {
                    if (item[i] === "any") {
                        item[i] = undefined;
                    }
                    if (item[i] === "base" && baseField.indexOf(i) !== -1) {
                        item[i] = undefined;
                    }
                });
            });
            dispatch({ type: ActionTypes.CLIENT_FLOW_LIST_LOADING, payload: true });
            const response = await updateClientFlow(list);
            cb(response);
            dispatch({ type: ActionTypes.CLIENT_FLOW_LIST_UNSAVED, payload: false });
            dispatch({ type: ActionTypes.CLIENT_FLOW_LIST_LOADING, payload: false });
        } catch (e) {
            console.log(e);
        }
    };
};

const setClientFlowUnsaved = () => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.CLIENT_FLOW_LIST_UNSAVED, payload: true });
        } catch (e) {
            console.log(e);
        }
    };
};

const getSelectValue = () => {
    let data = {
        productType: [
            {text: "SPOT", value: "SPOT"},
            {text: "FORWARD", value: "FORWARD"},
            {text: "SWAP", value: "SWAP"},
        ],
        cpty: [
            {text: "CMB", value: "CMB"},
            {text: "BOC", value: "BOC"},
            {text: "HSBC", value: "HSBC"},
        ],
        symbol: [
        ],
        tenor: [
            {text: "SPOT", value: "SPOT"},
            {text: "3M", value: "3M"},
            {text: "6M", value: "6M"},
            {text: "9M", value: "9M"},
            {text: "3M/6M", value: "3M/6M"},
        ],
        rangeTime: [
            {text: "AM CN", value: "AM CN"},
            {text: "PM CN", value: "PM CN"},
            {text: "OPN CN", value: "OPN CN"},
            {text: "OPN UK", value: "OPN UK"},
            {text: "OPN NY", value: "OPN NY"},
        ],
        scenario: [
            {text: "HIG VOL", value: "HIG VOL"},
            {text: "LOW VOL", value: "LOW VOL"},
        ],
        autoQuote: [
            {text: "YES", value: "YES"},
            {text: "NO", value: "NO"},
        ],
        quote: [
            {text: "YES", value: "YES"},
            {text: "NO", value: "NO"},
        ],
        criteria: [
            {text: "Trade", value: "Trade"},
            {text: "PnL", value: "PnL"},
            {text: "Position", value: "Position"},
        ],
        dir: [
            {text: ">", value: ">"},
            {text: ">=", value: ">="},
            {text: "=", value: "="},
            {text: "<=", value: "<="},
            {text: "<", value: "<"},
        ],
        pricingCcy: [
            // {text: "USD", value: "USD"},
            // {text: "CNY", value: "CNY"},
        ],
        unit: [
            {text: "1", value: "1"},
            {text: "k", value: "k"},
            {text: "m", value: "m"},
        ],
        autoLastlook: [
            {text: "YES", value: "YES"},
            {text: "NO", value: "NO"},
        ],
    };
    return async dispatch => {
        try {
            let response = await findSelectValue();
            const anyField = ["cpty", "symbol", "tenor", "rangeTime", "scenario",];
            const selectValue = response.data;
            if (selectValue.symbol){
                selectValue.symbol = selectValue.symbol.sort();
            }
            if (data.symbol){
                data.symbol = data.symbol.sort();
            }
            Object.keys(selectValue).map(item => {
                data[item] = selectValue[item].map(i => {
                    return {text: i, value: i};
                });
            });
            Object.keys(data).map(item => {
                if (anyField.indexOf(item) !== -1) {
                    data[item].splice(0, 0, {text: "any", value: "any"});
                }
                if (baseField.indexOf(item) !== -1) {
                    data[item].splice(0, 0, {text: "base", value: "base"});
                }
            });
            // data.cpty.unshift({text: "all", value: "all"});
            // data.symbol.unshift({text: "all", value: "all"});
            // data.rangeTime.unshift({text: "all", value: "all"});
            // data.scenario.unshift({text: "all", value: "all"});
            // console.log("data:",data);
            dispatch({ type: ActionTypes.CLIENT_FLOW_SELECT_VALUE, payload: data });
        } catch (e) {
            console.log(e);
        }
    };
};

const setClientFlowList = (list) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.CLIENT_FLOW_LIST, payload: list});
        } catch (e) {
            console.log(e);
        }
    };
};

const setClientFlow = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.CHANGE_SHOW_CLIENTFLOW, payload: params});
        } catch (e) {
            console.log(e);
        }
    };
};

const setRiskMonitor = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.CHANGE_SHOW_RISKMONITOR, payload: params});
        } catch (e) {
            console.log(e);
        }
    };
};

const setManualTrading = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.CHANGE_SHOW_TRADING, payload: params});
        } catch (e) {
            console.log(e);
        }
    };
};

const setTradeBlotter = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.CHANGE_SHOW_BLOTTER, payload: params});
        } catch (e) {
            console.log(e);
        }
    };
};

export {
    getClientFlowList, deleteClientFlow, addClientFlowList, saveClientFlowList, setClientFlowUnsaved, getSelectValue, setClientFlowList,
    setClientFlow, setRiskMonitor, setManualTrading, setTradeBlotter
};