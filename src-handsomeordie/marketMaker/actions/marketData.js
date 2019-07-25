import * as ActionTypes from "../constants/ActionTypes";
import { findMarketData, updateMarketData, findMarketSrc, updateMarketSrc, findDirty, addNewSource } from "../../common/marketApi/index";

const getMarketData = (params, cb) => {
    return async dispatch => {
        try {
            const result = await findMarketData(params);
            const data = result.data;
            // const data = [
            //     {
            //         source: "ODM",
            //         product: "SPOT",
            //         symbol: "USDCNY",
            //         marketDataQuality: 1,
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "ODM",
            //         product: "SPOT",
            //         symbol: "USDCNY",
            //         marketDataQuality: 2,
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "ODM",
            //         product: "SPOT",
            //         symbol: "USDCNY",
            //         marketDataQuality: 3,
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "ODM",
            //         product: "SPOT",
            //         symbol: "USDCNY",
            //         marketDataQuality: 4,
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "ODM",
            //         product: "FORWARD",
            //         symbol: "USDCNY",
            //         marketDataQuality: 5,
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "ODM",
            //         product: "FORWARD",
            //         symbol: "USDCNY",
            //         marketDataQuality: 1,
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "ODM",
            //         product: "FORWARD",
            //         symbol: "USDCNY.12M",
            //         marketDataQuality: 2,
            //         status: "NOT APPLIED",
            //     },
            //
            //     {
            //         source: "BOC",
            //         product: "SPOT",
            //         symbol: "USDCNY",
            //         marketDataQuality: 3,
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "BOC",
            //         product: "SPOT",
            //         symbol: "USDCNY",
            //         marketDataQuality: 4,
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "BOC",
            //         product: "SPOT",
            //         symbol: "USDCNY",
            //         marketDataQuality: 5,
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "BOC",
            //         product: "FORWARD",
            //         symbol: "USDCNY",
            //         marketDataQuality: 1,
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "BOC",
            //         product: "SWAP",
            //         symbol: "USDCNY",
            //         marketDataQuality: 2,
            //         status: "NOT APPLIED",
            //     },
            //     {
            //         source: "BOC",
            //         product: "SWAP",
            //         symbol: "USDCNY.12M",
            //         marketDataQuality: 3,
            //         status: "APPLIED",
            //     },
            //
            //     {
            //         source: "CMB",
            //         product: "SWAP",
            //         symbol: "USDCNY.1M/12M",
            //         marketDataQuality: 4,
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "CMB",
            //         product: "SWAP",
            //         symbol: "USDCNY.1M/12M",
            //         marketDataQuality: 5,
            //         status: "APPLIED",
            //     },
            //
            //     //
            //     {
            //         source: "ODM",
            //         product: "SPOT",
            //         symbol: "USDCNY",
            //         marketDataQuality: 1,
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "ODM",
            //         product: "SPOT",
            //         symbol: "USDCNY",
            //         marketDataQuality: 2,
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "ODM",
            //         product: "SPOT",
            //         symbol: "USDCNY",
            //         marketDataQuality: 3,
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "ODM",
            //         product: "SPOT",
            //         symbol: "USDCNY",
            //         marketDataQuality: 4,
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "ODM",
            //         product: "FORWARD",
            //         symbol: "USDCNY",
            //         marketDataQuality: 5,
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "ODM",
            //         product: "FORWARD",
            //         symbol: "USDCNY",
            //         marketDataQuality: 1,
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "ODM",
            //         product: "FORWARD",
            //         symbol: "USDCNY.12M",
            //         marketDataQuality: 2,
            //         status: "NOT APPLIED",
            //     },
            //
            //     {
            //         source: "BOC",
            //         product: "SPOT",
            //         symbol: "USDCNY",
            //         marketDataQuality: 3,
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "BOC",
            //         product: "SPOT",
            //         symbol: "USDCNY",
            //         marketDataQuality: 4,
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "BOC",
            //         product: "SPOT",
            //         symbol: "USDCNY",
            //         marketDataQuality: 5,
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "BOC",
            //         product: "FORWARD",
            //         symbol: "USDCNY",
            //         marketDataQuality: 1,
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "BOC",
            //         product: "SWAP",
            //         symbol: "USDCNY",
            //         marketDataQuality: 2,
            //         status: "NOT APPLIED",
            //     },
            //     {
            //         source: "BOC",
            //         product: "SWAP",
            //         symbol: "USDCNY.12M",
            //         marketDataQuality: 3,
            //         status: "APPLIED",
            //     },
            //
            //     {
            //         source: "CMB",
            //         product: "SWAP",
            //         symbol: "USDCNY.1M/12M",
            //         marketDataQuality: 4,
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "CMB",
            //         product: "SWAP",
            //         symbol: "USDCNY.1M/12M",
            //         marketDataQuality: 5,
            //         status: "APPLIED",
            //     },
            // ];
            data.map((item, index) => {
                item.key = index;
            });
            dispatch({ type: ActionTypes.MARKET_DATA, payload: data });
            cb && cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};

const updateMktData = (params, cb) => {
    return async dispatch => {
        try {
            const result = await updateMarketData(params);
            cb && cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};

const getAppliedMarket = (params, cb) => {
    return async dispatch => {
        try {
            const result = await findMarketSrc(params);
            const data = result.data;
            // const data = [
            //     {
            //         source: "ODM",
            //         product: "SPOT",
            //         symbol: "USDCNY",
            //         marketDataQuality: "",
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "ODM",
            //         product: "SPOT",
            //         symbol: "USDCNY",
            //         marketDataQuality: "",
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "ODM",
            //         product: "SPOT",
            //         symbol: "USDCNY",
            //         marketDataQuality: "",
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "ODM",
            //         product: "SPOT",
            //         symbol: "USDCNY",
            //         marketDataQuality: "",
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "ODM",
            //         product: "FORWARD",
            //         symbol: "USDCNY",
            //         marketDataQuality: "",
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "ODM",
            //         product: "FORWARD",
            //         symbol: "USDCNY",
            //         marketDataQuality: "",
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "ODM",
            //         product: "FORWARD",
            //         symbol: "USDCNY.12M",
            //         marketDataQuality: "",
            //         status: "APPLIED",
            //     },
            //
            //     {
            //         source: "BOC",
            //         product: "SPOT",
            //         symbol: "USDCNY",
            //         marketDataQuality: "",
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "BOC",
            //         product: "SPOT",
            //         symbol: "USDCNY",
            //         marketDataQuality: "",
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "BOC",
            //         product: "SPOT",
            //         symbol: "USDCNY",
            //         marketDataQuality: "",
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "BOC",
            //         product: "FORWARD",
            //         symbol: "USDCNY",
            //         marketDataQuality: "",
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "BOC",
            //         product: "SWAP",
            //         symbol: "USDCNY",
            //         marketDataQuality: "",
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "BOC",
            //         product: "SWAP",
            //         symbol: "USDCNY.12M",
            //         marketDataQuality: "",
            //         status: "APPLIED",
            //     },
            //
            //     {
            //         source: "CMB",
            //         product: "SWAP",
            //         symbol: "USDCNY.1M/12M",
            //         marketDataQuality: "",
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "CMB",
            //         product: "SWAP",
            //         symbol: "USDCNY.1M/12M",
            //         marketDataQuality: "",
            //         status: "APPLIED",
            //     },
            //
            //     //
            //     {
            //         source: "ODM",
            //         product: "SPOT",
            //         symbol: "USDCNY",
            //         marketDataQuality: "",
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "ODM",
            //         product: "SPOT",
            //         symbol: "USDCNY",
            //         marketDataQuality: "",
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "ODM",
            //         product: "SPOT",
            //         symbol: "USDCNY",
            //         marketDataQuality: "",
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "ODM",
            //         product: "SPOT",
            //         symbol: "USDCNY",
            //         marketDataQuality: "",
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "ODM",
            //         product: "FORWARD",
            //         symbol: "USDCNY",
            //         marketDataQuality: "",
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "ODM",
            //         product: "FORWARD",
            //         symbol: "USDCNY",
            //         marketDataQuality: "",
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "ODM",
            //         product: "FORWARD",
            //         symbol: "USDCNY.12M",
            //         marketDataQuality: "",
            //         status: "APPLIED",
            //     },
            //
            //     {
            //         source: "BOC",
            //         product: "SPOT",
            //         symbol: "USDCNY",
            //         marketDataQuality: "",
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "BOC",
            //         product: "SPOT",
            //         symbol: "USDCNY",
            //         marketDataQuality: "",
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "BOC",
            //         product: "SPOT",
            //         symbol: "USDCNY",
            //         marketDataQuality: "",
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "BOC",
            //         product: "FORWARD",
            //         symbol: "USDCNY",
            //         marketDataQuality: "",
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "BOC",
            //         product: "SWAP",
            //         symbol: "USDCNY",
            //         marketDataQuality: "",
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "BOC",
            //         product: "SWAP",
            //         symbol: "USDCNY.12M",
            //         marketDataQuality: "",
            //         status: "APPLIED",
            //     },
            //
            //     {
            //         source: "CMB",
            //         product: "SWAP",
            //         symbol: "USDCNY.1M/12M",
            //         marketDataQuality: "",
            //         status: "APPLIED",
            //     },
            //     {
            //         source: "CMB",
            //         product: "SWAP",
            //         symbol: "USDCNY.1M/12M",
            //         marketDataQuality: "",
            //         status: "APPLIED",
            //     },
            // ];
            data.map((item, index) => {
                item.key = index;
            });
            dispatch({ type: ActionTypes.APPLIED_MARKET, payload: data });
            cb && cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};

const updateMktSrc = (params, cb) => {
    return async dispatch => {
        try {
            const result = await updateMarketSrc(params);
            cb && cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};

const getDirtyList = (params, cb) => {
    return async dispatch => {
        try {
            const result = await findDirty(params);
            cb && cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};

const addNewSrc = (params, cb) => {
    return async dispatch => {
        try {
            const result = await addNewSource(params);
            cb && cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};

export { getMarketData, getAppliedMarket, updateMktSrc, updateMktData, getDirtyList, addNewSrc };