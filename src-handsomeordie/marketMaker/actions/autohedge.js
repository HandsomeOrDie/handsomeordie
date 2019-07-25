import * as ActionTypes from "../constants/ActionTypes";
import { findHedge, updateHedge, findHedgeSelectValue, findCpty, findProfileSetting, updateProfileSetting } from "../../common/marketApi/index";
const anyField = ["user", "cpty", "ccy", "symbol", "productType", "rangeTime", "scenario", "hedgingSymbol"];
const baseField = ["pricingCcy"];
const getHedgeList = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.HEDGE_LIST_LOADING, payload: true });
            const result = await findHedge(params);
            const data = result.data || [];
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
            // const data = [
            //     {id: 1, cpty: "CMB", ccy: "-", tenor: "SPOT", time: "-", scenario: "Normal", criteria: "Trade Size", range: "-", dir: ">=", value: "2,000,000", type: "Flow", by: "Ratio", h_value: "1", algo: "Market", profile: "Aggresive"},
            //     {id: 2, cpty: "CMB", ccy: "-", tenor: "SPOT", time: "-", scenario: "Normal", criteria: "Trade Size", range: "-", dir: ">=", value: "2,000,000", type: "Flow", by: "Ratio", h_value: "1", algo: "Market", profile: "Aggresive"},
            //     {id: 3, cpty: "CMB", ccy: "-", tenor: "SPOT", time: "-", scenario: "Normal", criteria: "Trade Size", range: "-", dir: ">=", value: "2,000,000", type: "Flow", by: "Ratio", h_value: "1", algo: "Market", profile: "Aggresive"},
            //     {id: 4, cpty: "CMB", ccy: "-", tenor: "SPOT", time: "-", scenario: "Normal", criteria: "Trade Size", range: "-", dir: ">=", value: "2,000,000", type: "Flow", by: "Ratio", h_value: "1", algo: "Market", profile: "Aggresive"},
            //     {id: 5, cpty: "CMB", ccy: "-", tenor: "SPOT", time: "-", scenario: "Normal", criteria: "Trade Size", range: "-", dir: ">=", value: "2,000,000", type: "Flow", by: "Ratio", h_value: "1", algo: "Market", profile: "Aggresive"},
            //     {id: 6, cpty: "CMB", ccy: "-", tenor: "SPOT", time: "-", scenario: "Normal", criteria: "Trade Size", range: "-", dir: ">=", value: "2,000,000", type: "Flow", by: "Ratio", h_value: "1", algo: "Market", profile: "Aggresive"},
            //     {id: 7, cpty: "CMB", ccy: "-", tenor: "SPOT", time: "-", scenario: "Normal", criteria: "Trade Size", range: "-", dir: ">=", value: "2,000,000", type: "Flow", by: "Ratio", h_value: "1", algo: "Market", profile: "Aggresive"},
            //     {id: 8, cpty: "CMB", ccy: "-", tenor: "SPOT", time: "-", scenario: "Normal", criteria: "Trade Size", range: "-", dir: ">=", value: "2,000,000", type: "Flow", by: "Ratio", h_value: "1", algo: "Market", profile: "Aggresive"},
            //     {id: 9, cpty: "CMB", ccy: "-", tenor: "SPOT", time: "-", scenario: "Normal", criteria: "Trade Size", range: "-", dir: ">=", value: "2,000,000", type: "Flow", by: "Ratio", h_value: "1", algo: "Market", profile: "Aggresive"},
            // ];
            dispatch({ type: ActionTypes.HEDGE_LIST, payload: data });
            dispatch({ type: ActionTypes.HEDGE_LIST_UNSAVED, payload: false });
            dispatch({ type: ActionTypes.HEDGE_LIST_LOADING, payload: false });
        } catch (e) {
            console.log(e);
        }
    };
};

const deleteHedge = (key, hedgeList) => {
    return async dispatch => {
        try {
            hedgeList.splice(hedgeList.findIndex(item => item.key === key), 1);
            let arr = [];
            arr = arr.concat(hedgeList);
            dispatch({ type: ActionTypes.HEDGE_LIST_UNSAVED, payload: true });
            dispatch({ type: ActionTypes.HEDGE_LIST, payload: arr });
        } catch (e) {
            console.log(e);
        }
    };
};

const addHedgeList = (hedgeList) => {
    return async dispatch => {
        try {
            const newData = {
                key: hedgeList.length,
                editing: true,
            };
            dispatch({ type: ActionTypes.HEDGE_LIST, payload: [...hedgeList, newData] });
            dispatch({ type: ActionTypes.HEDGE_LIST_UNSAVED, payload: true });
        } catch (e) {
            console.log(e);
        }
    };
};

const saveHedgeList = (hedgeList, cb) => {
    return async dispatch => {
        try {
            // console.log("hedgeList:", hedgeList);
            hedgeList.map((item, index) => {
                item.displayOrder = index;
                Object.keys(item).map(i => {
                    if (item[i] === "any") {
                        item[i] = undefined;
                    }
                    if (item[i] === "base" && baseField.indexOf(i) !== -1) {
                        item[i] = undefined;
                    }
                });
            });
            dispatch({ type: ActionTypes.HEDGE_LIST_LOADING, payload: true });
            const response = await updateHedge(hedgeList);
            cb(response);
            dispatch({ type: ActionTypes.HEDGE_LIST_UNSAVED, payload: false });
            dispatch({ type: ActionTypes.HEDGE_LIST_LOADING, payload: false });
        } catch (e) {
            console.log(e);
        }
    };
};

const setHedgeUnsaved = () => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.HEDGE_LIST_UNSAVED, payload: true });
        } catch (e) {
            console.log(e);
        }
    };
};

const getHedgeSelectValue = () => {
    // const username = sessionStorage.getItem("username");
    const userInfo = localStorage.getItem("userInfo");
    const username = userInfo && userInfo !== "undefined" && JSON.parse(userInfo).name;
    // console.log("tttttttttttt");
    console.log(username);
    let data = {
        user: [
            {text: username, value: username},
        ],
        cpty: [
            {text: "CMB", value: "CMB"},
            {text: "BOC", value: "BOC"},
            {text: "HSBC", value: "HSBC"},
        ],
        ccy: [
            {text: "all", value: "all"},
            {text: "USD", value: "USD"},
            {text: "GBP", value: "GBP"},
            {text: "EUR", value: "EUR"},
        ],
        symbol: [
            {text: "EURGBP", value: "EURGBP"},
            {text: "EURJPY", value: "EURJPY"},
        ],
        productType: [
            {text: "SPOT", value: "SPOT"},
            {text: "SWAP", value: "SWAP"},
            {text: "FORWARD", value: "FORWARD"},
        ],
        rangeTime: [
            // {text: "all", value: "all"},
            {text: "AM CN", value: "AM CN"},
            {text: "PM CN", value: "PM CN"},
            {text: "OPN CN", value: "OPN CN"},
            {text: "OPN UK", value: "OPN UK"},
            {text: "OPN NY", value: "OPN NY"},
        ],
        scenario: [
            // {text: "all", value: "all"},
            {text: "HIG VOL", value: "HIG VOL"},
            {text: "LOW VOL", value: "LOW VOL"},
        ],
        window: [
            {text: "Intrday", value: "Intrday"},
            {text: "1min", value: "1min"},
            {text: "5min", value: "5min"},
            {text: "60min", value: "60min"},
        ],
        criteria: [
            {text: "Trade", value: "Trade"},
            {text: "PnL", value: "PnL"},
            {text: "Position", value: "Position"},
        ],
        thresholdRange: [
            // {text: "all", value: "all"},
            {text: "Intrday", value: "Intrday"},
            {text: "60m", value: "60m"},
            {text: "5m", value: "5m"},
            {text: "1m", value: "1m"},
        ],
        dir: [
            {text: ">", value: ">"},
            {text: ">=", value: ">="},
            {text: "=", value: "="},
            {text: "<=", value: "<="},
            {text: "<", value: "<"},
        ],
        pricingCcy: [
            {text: "USD", value: "USD"},
            {text: "CNY", value: "CNY"},
        ],
        unit: [
            {text: "1", value: "1"},
            {text: "k", value: "k"},
            {text: "m", value: "m"},
        ],
        hedgingBy: [
            {text: "Ratio", value: "Ratio"},
            {text: "Reset To", value: "Reset To"},
            {text: "Amount", value: "Amount"},
        ],
        hedgingSymbol: [
            {text: "EURGBP", value: "EURGBP"},
            {text: "EURJPY", value: "EURJPY"},
        ],
        hedgingUnit: [
            {text: "1", value: "1"},
            {text: "k", value: "k"},
            {text: "m", value: "m"},
        ],
        algo: [
            {text: "SimpleSplit", value: "SimpleSplit"},
            {text: "Market", value: "Market"},
            {text: "Limit", value: "Limit"},
            {text: "VWAP", value: "VWAP"},
            {text: "TWAP", value: "TWAP"},
        ],
        hedgingProfile: [
            {text: "Aggresive", value: "Aggresive"},
            {text: "CFETS", value: "CFETS"},
        ],
    };
    return async dispatch => {
        try {
            // const anyField = ["user", "cpty", "ccy", "symbol", "productType", "rangeTime", "scenario", ];
            let response = await findHedgeSelectValue();
            const profile = await findProfileSetting();
            let selectValue = response.data;
            selectValue.hedgingProfile = profile.data.map(item => item.name);
            if (selectValue.symbol){
                selectValue.symbol = selectValue.symbol.sort();
            }
            if (data.symbol){
                data.symbol = data.symbol.sort();
            }
            if (selectValue.hedgingSymbol){
                selectValue.hedgingSymbol = selectValue.hedgingSymbol.sort();
            }
            if (data.hedgingSymbol){
                data.hedgingSymbol = data.hedgingSymbol.sort();
            }
            if (selectValue.ccy){
                selectValue.ccy = selectValue.ccy.sort();
            }
            if (data.ccy){
                data.ccy = data.ccy.sort();
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
            dispatch({ type: ActionTypes.HEDGE_SELECT_VALUE, payload: data });
        } catch (e) {
            console.log(e);
        }
    };
};

const setSelectValue = (selectValue) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.HEDGE_SELECT_VALUE, payload: {...selectValue} });
        } catch (e) {
            console.log(e);
        }
    };
};

const setHedgeList = (hedgeList) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.HEDGE_LIST, payload: hedgeList});
        } catch (e) {
            console.log(e);
        }
    };
};

const updateProfile = (params, cb) => {
    return async dispatch => {
        try {
            const result = await updateProfileSetting(params);
            cb && cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};

const getProfile = (params, cb) => {
    return async dispatch => {
        try {
            const result = await findProfileSetting(params);
            cb && cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};

export {
    getHedgeList,
    deleteHedge,
    addHedgeList,
    saveHedgeList,
    setHedgeUnsaved,
    getHedgeSelectValue,
    setHedgeList,
    setSelectValue,
    updateProfile,
    getProfile,
};
