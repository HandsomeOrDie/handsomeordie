import * as ActionTypes from "../constants/ActionTypes";
import {
    getMarketPriceConfigListFetch,
    getCorePriceListFetch,
    updateCorePrice,
    createCorePrice,
    deleteCorePrice,
    getCorePriceByIdFetch,
    updateSourceInitStatus
} from "../../common/marketApi";


const getMarketPriceConfigList = () => {
    return async dispatch => {
        try {
            let result = await getMarketPriceConfigListFetch();
            let marketConfigData = [];
            if (result && result.data && result.data.length > 0) {
                result.data.forEach(item => {
                    let tenor = "";
                    let tenorDate1 = undefined;
                    let tenorDate2 = undefined;
                    if (item.tenor) {
                        if (item.tenor === "SPOT") {
                            tenor = "SPOT";
                        } else if (item.tenor.indexOf("/") !== -1) {
                            tenor = "SWAP";
                            tenorDate1 = item.tenor.split("/")[0];
                            tenorDate2 = item.tenor.split("/")[1];
                        } else {
                            tenor = "FORWARD";
                            tenorDate1 = item.tenor;
                        }
                    }
                    let marketConfig = {
                        id: item.id,
                        symbol: item.symbol,
                        fullName: item.fullName,
                        tenorType: tenor,
                        tenorDate1: tenorDate1,
                        tenorDate2: tenorDate2,
                        mode: item.mode,
                        isAF: item.sanityCheck,
                        isPF: item.spikeFilter,
                        isTF: item.staleFilter,
                        quality: item.quality,
                        connectivity: item.connectivity,
                        minTick: item.minTick,
                        status: item.status,
                    };
                    marketConfigData.push(marketConfig);
                });
            }
            dispatch({ type: ActionTypes.CORE_PRICE_MAERKET_CONFIG_LIST, payload: marketConfigData });
        } catch (e) {
            console.log(e);
        }
    };
};

const getCorePriceList = (cb) => {
    return async dispatch => {
        try {
            let result = await getCorePriceListFetch();
            let data = [];
            cb(result.success && result.data && result.data.length?result.data[result.data.length-1]:{}, result.data);
            if (result && result.data && result.data.length > 0) {
                data = result.data;
                dispatch({ type: ActionTypes.GET_CORE_PRICE_LIST, payload: data});
            }
        } catch (e) {
            console.log(e);
        }
    };
};

const saveCorePrice = (corePrice,cb) => {
    return async dispatch => {
        try {
            if (corePrice.id) {
                let result = await updateCorePrice(corePrice);
                cb(corePrice.id);
                dispatch({ type: ActionTypes.SAVE_CORE_PRICE, payload: result.data });
            } else {
                let result = await createCorePrice(corePrice);
                cb(result.data.id);
                dispatch({ type: ActionTypes.CREATE_CORE_PRICE, payload: result.data });
            }
        } catch (e) {
            console.log(e);
        }
    };
};

const deleteCorePriceById = (id,cb) => {
    return async dispatch => {
        try {
            let result = await deleteCorePrice(id);
            if(result.success){
                cb();
            }
            dispatch({ type: ActionTypes.DELETE_CORE_PRICE, payload: id });
        } catch (e) {
            console.log(e);
        }
    };
};

const getCorePriceById = (id) => {
    return async dispatch => {
        let result = await getCorePriceByIdFetch(id);
        dispatch({ type: ActionTypes.GET_CORE_PRICE_BY_ID, payload: result.data });
    };
};

const changeSourceInitStatus = (sourceItemId, targetStatus) => {
    return async dispatch => {
        let params = {
            sourceItemId: sourceItemId,
            targetStatus: targetStatus
        };
        let result = await updateSourceInitStatus(sourceItemId, targetStatus);
        dispatch({ type: ActionTypes.CHANGE_SOURCE_INIT_STATUS, payload: params });
    };
};

export { getMarketPriceConfigList, getCorePriceList, saveCorePrice, deleteCorePriceById, getCorePriceById, changeSourceInitStatus };
