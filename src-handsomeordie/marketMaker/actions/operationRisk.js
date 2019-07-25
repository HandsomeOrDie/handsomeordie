import * as ActionTypes from "../constants/ActionTypes";
import {
    operationSelectOption,
    findOperationRisk,
    updateOperationRisk,
    findCreditCpty
} from "../../common/marketApi/index";

const getOperationRisk = (params) => {
    return async dispatch => {
        try {
            const anyField = ["group", "riskUser", "book", "productType", "counterParty", "ccy", "symbol", "window", "strategy","dimension",];
            const baseField = ["pricingCcy"];
            dispatch({ type: ActionTypes.OPERATION_RISK_LOADING, payload: true });
            const result = await findOperationRisk(params);
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
            dispatch({ type: ActionTypes.OPERATION_RISK_LIST, payload: data });
            dispatch({ type: ActionTypes.OPERATION_RISK_UNSAVED, payload: false });
            dispatch({ type: ActionTypes.OPERATION_RISK_LOADING, payload: false });
        } catch (e) {
            console.log(e);
        }
    };
};

const deleteOperationRisk = (key, list) => {
    return async dispatch => {
        try {
            list.splice(list.findIndex(item => item.key === key), 1);
            let arr = [];
            arr = arr.concat(list);
            dispatch({ type: ActionTypes.OPERATION_RISK_UNSAVED, payload: true });
            dispatch({ type: ActionTypes.OPERATION_RISK_LIST, payload: arr });
        } catch (e) {
            console.log(e);
        }
    };
};

const addOperationRisk = (list) => {
    return async dispatch => {
        try {
            const newData = {
                key: list.length,
                editing: true,
                // cpty: "CMB",
            };
            dispatch({ type: ActionTypes.OPERATION_RISK_LIST, payload: [...list, newData] });
            dispatch({ type: ActionTypes.OPERATION_RISK_UNSAVED, payload: true });
        } catch (e) {
            console.log(e);
        }
    };
};

const setSelectValue = (selectValue) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.OPERATION_RISK_SELECT_VALUE, payload: {...selectValue} });
        } catch (e) {
            console.log(e);
        }
    };
};

const saveOperationRisk  = (list, cb) => {
    return async dispatch => {
        try {
            const baseField = ["pricingCcy"];
            list.map((item, index) => {
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
            dispatch({ type: ActionTypes.OPERATION_RISK_LOADING, payload: true });
            const response = await updateOperationRisk(list);
            cb(response);
            dispatch({ type: ActionTypes.OPERATION_RISK_UNSAVED, payload: false });
            dispatch({ type: ActionTypes.OPERATION_RISK_LOADING, payload: false });
        } catch (e) {
            console.log(e);
        }
    };
};

const setUnsaved = () => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.OPERATION_RISK_UNSAVED, payload: true });
        } catch (e) {
            console.log(e);
        }
    };
};

const getSelectValue = () => {

    let data = {
        // team: [
        //     {text: "FX PROP", value: "FX PROP"},
        //     {text: "FX DEALER", value: "FX DEALER"},
        //     {text: "METAL", value: "METAL"},
        //     {text: "RATES", value: "RATES"},
        //     {text: "BONDS", value: "BONDS"},
        // ],
        group: [
            {text: "CNY", value: "CNY"},
            {text: "G7", value: "G7"},
            {text: "EMERGING", value: "EMERGING"},
        ],
        riskUser: [
            {text: "roll.gan", value: "roll.gan"},
        ],
        book: [
            {text: "G7 Dealing", value: "G7 Dealing"},
            {text: "CNY Dealing", value: "CNY Dealing"},
        ],
        // portfolio: [
        //     {text: "CFETS", value: "CFETS"},
        // ],
        counterParty: [
            {text: "BCHO", value: "BCHO"},
            {text: "CMHO", value: "CMHO"},
            {text: "CTIB", value: "CTIB"},
            {text: "CTSH", value: "CTSH"},
            {text: "DBSC", value: "DBSC"},
            {text: "JPSH", value: "JPSH"},
        ],
        productType: [
            {text: "SPOT", value: "SPOT"},
            {text: "FORWARD", value: "FORWARD"},
            {text: "SWAP", value: "SWAP"},
        ],
        ccy: [
            {text: "JPY", value: "JPY"},
            {text: "CNY", value: "CNY"},
            {text: "USD", value: "USD"},
            {text: "EUR", value: "EUR"},
            {text: "AUD", value: "AUD"},
            {text: "NZD", value: "NZD"},
            {text: "CAD", value: "CAD"},
        ],
        symbol: [
            {text: "USDCNY", value: "USDCNY"},
            {text: "GBPUSD", value: "GBPUSD"},
            {text: "USDJPY6M", value: "USDJPY6M"},
        ],
        window: [
            {text: "Immediate", value: "Immediate"},
            {text: "1 Minute", value: "1 Minute"},
            {text: "10 Minutes", value: "10 Minutes"},
            {text: "60 Minutes", value: "60 Minutes"},
            {text: "Today", value: "Today"},
        ],
        // assetClass: [
        //     {text: "FX", value: "FX"},
        //     {text: "METAL", value: "METAL"},
        // ],
        // strategyGroup: [
        //     {text: "Active", value: "Active"},
        //     {text: "Passive", value: "Passive"},
        // ],
        strategy: [
            {text: "TOP", value: "TOP"},
            {text: "Pegging", value: "Pegging"},
            {text: "Watching", value: "Watching"},
        ],
        dimension: [
            {text: "Risk Axis", value: "Risk Axis"},
            {text: "Asset", value: "Asset"},
            {text: "Total", value: "Total"},
            {text: "Trade", value: "Trade"},
        ],
        criteria: [
            // {text: "-", value: "-"},
            {text: "TradeSize", value: "TradeSize"},
            {text: "TradeCount", value: "TradeCount"},
            {text: "TradeAmount", value: "TradeAmount"},
            {text: "OrderCount", value: "OrderCount"},
            {text: "OrderSize", value: "OrderSize"},
            {text: "OrderPriceSkew", value: "OrderPriceSkew"},
            {text: "CapitalUsage", value: "CapitalUsage"},
        ],
        direction: [
            // {text: "-", value: "-"},
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
            {text: "%", value: "%"},
            {text: "1", value: "1"},
            {text: "k", value: "k"},
            {text: "m", value: "m"},
        ],
        level: [
            // {text: "-", value: "-"},
            {text: "Severe", value: "Severe"},
            {text: "Moderate", value: "Moderate"},
            {text: "Critical", value: "Critical"},
            {text: "Low", value: "Low"},
        ],
        action: [
            // {text: "-", value: "-"},
            {text: "Alert Only", value: "Alert Only"},
            {text: "Block Trade", value: "Block Trade"},
            {text: "Stop Trading", value: "Stop Trading"},
            {text: "Stop Trading STrategy", value: "Stop Trading STrategy"},
        ],
    };
    return async dispatch => {
        try {
            const anyField = ["group", "riskUser", "book", "productType", "counterParty", "ccy", "symbol", "window", "strategy","dimension",];
            const baseField = ["pricingCcy"];
            let response = await operationSelectOption();
            let counterParty = await findCreditCpty();
            if (counterParty.data.length > 0)
                data.counterParty = counterParty.data.map(item => ({text: item.code, value: item.code}));
            let selectValue = response.data;
            if (selectValue.symbol){
                selectValue.symbol = selectValue.symbol.sort();
            }
            if (data.symbol){
                data.symbol = data.symbol.sort();
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
                // if (item === "riskUser"){
                //     data[item].splice(1, 0, {text: "all", value: "all"});
                // }
                // if (item === "action"){
                // data[item].splice(0, 0, {text: "Allow", value: "Allow"});
                // }
            });
            data.symbolCopy = data.symbol;
            data.criteriaCopy = data.criteria;
            dispatch({ type: ActionTypes.OPERATION_RISK_SELECT_VALUE, payload: data });
        } catch (e) {
            console.log(e);
        }
    };
};

const setOperationRisk = (list) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.OPERATION_RISK_LIST, payload: list});
        } catch (e) {
            console.log(e);
        }
    };
};

export {
    getOperationRisk,
    deleteOperationRisk,
    addOperationRisk,
    saveOperationRisk,
    setUnsaved,
    getSelectValue,
    setOperationRisk,
    setSelectValue,
};