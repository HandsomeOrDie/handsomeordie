import * as ActionTypes from "../constants/ActionTypes";

import {
    getMarketPriceConfigListFetch, saveConfigDataFetch, deleteMarketPriceItemFetch
} from "../../common/marketApi";


const getMarketPriceConfigList = (cb) => {
    return async dispatch => {
        try {
            const strategyList = await getMarketPriceConfigListFetch();
            // if (strategyList.data) {
            //     strategyList.data.map((v, i) => {
            //         v["key"] = i;
            //     });
            // }
            dispatch({ type: ActionTypes.MAERKET_CONFIG_LIST, payload: strategyList.data });
            if(strategyList){
                cb(strategyList.data);
            }
        } catch (e) {
            console.log(e);
        }
    };
};

// 设置拖拽的数据
const getDrageValue = (data,cb) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.GET_DRAG_VAL, payload: data });
            cb(data);
        } catch (e) {
            console.log(e);
        }
    };
};
// 提交market price data 
const saveConfigData = (data) => {
    return async dispatch => {
        try {
            const list = await saveConfigDataFetch(data.item);
            if(list.success){
                const strategyList = await getMarketPriceConfigListFetch();
                // let marketPriceList = data.data;
                // marketPriceList.splice(marketPriceList.findIndex(item => item.id === list.marketPriceConfig.id, 1, list.marketPriceConfig));
                dispatch({ type: ActionTypes.MAERKET_CONFIG_LIST, payload: strategyList.data });
            }
        } catch (e) {
            console.log(e);
        }
    };
};

// 删除 

const deleteMarketPriceItem = (param, cb) => {
    return async dispatch => {
        try {
            const data = await deleteMarketPriceItemFetch(param);
            // dispatch({ type: ActionTypes.RESET_MARKET_LIST, payload: data });
            if (data) cb();
        } catch (e) {
            console.log(e);
        }
    };
};

export {
    getMarketPriceConfigList,
    getDrageValue, saveConfigData, deleteMarketPriceItem
};
