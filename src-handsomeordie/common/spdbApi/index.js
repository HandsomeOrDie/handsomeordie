import axios from "axios";
import fetch from "../api/request";
let baseURL = "";
const NODE_ENV = process.env.NODE_ENV;
if (NODE_ENV === "development") {
    baseURL = "";
}
axios.defaults.baseURL = baseURL;

export const findInstance = () => fetch("/finone-quantexecutor-spdb/strategy/fi/marketMaking/findInstance.json", null, "GET");
export const findMarketPriceConfig = () => fetch("/finone-quantexecutor-spdb/data/fi/marketPriceConfig/find.json", null, "GET");
export const start = (params) => fetch("/finone-quantexecutor-spdb/strategy/fi/marketMaking/startInstance.json", params, "POST");
export const stop = (params) => fetch("/finone-quantexecutor-spdb/strategy/fi/marketMaking/stopInstance.json", params, "POST");
export const update = (params) => fetch("/finone-quantexecutor-spdb/strategy/fi/marketMaking/updateInstance.json", params, "POST");
export const deleteStrategy = (params) => fetch("/finone-quantexecutor-spdb/strategy/fi/marketMaking/deleteInstance.json", params, "POST");
export const upload =(params) => fetch("/finone-quantexecutor-spdb/strategy/strategyScript/fx/upload.json",params,"POST", true);

export const findDefinitionList =() => fetch("/finone-quantexecutor-spdb/strategy/fi/marketMaking/findDefinitionList.json",null,"GET");
export const findAlgo =() =>fetch("/finone-quantexecutor-spdb/strategy/fi/marketMaking/findAlgo.json",null,"GET");
export const tradingvarietymanage =() =>fetch("/finone-quantexecutor-spdb/tradingvariety/tradingvarietymanage/find.json",null,"GET");
export const quoteOutput = "com.finone.quantexecutor.entity.QuoteOutput";
export const makingInstanceOutput = "com.finone.quantexecutor.entity.fi.BondMarketMakingInstanceOutput";
export const jksaoOutput = "com.finone.quantexecutor.entity.fi.BondMarketPriceStatisticsOutput";
export const findQuotes = (params) => fetch("/finone-quantexecutor-spdb/strategy/fi/bondMarketPriceStatistics/find.json", params, "GET");

// 头组
export const findBookByUser =(params) =>fetch("/finone-quantexecutor-spdb/book/findByUser.json",params,"POST_JSON");

export const batchBindInstance =(params) =>fetch("/finone-quantexecutor-spdb/strategy/fi/marketMaking/batchBindInstance.json",params,"POST_JSON");

export const createBookIds =(params) =>fetch("/finone-quantexecutor-spdb/book/create.json",params,"POST_JSON");
export const deleteBookIds =(params) =>fetch("/finone-quantexecutor-spdb/book/delete.json",params,"POST_JSON");
export const userList =(params) =>fetch("/finone-quantexecutor-spdb/qxgl/yhgl/czyh",params,"GET");

export const cancelOrderBatch =(params) =>fetch("/finone-quantexecutor-spdb/fi/trading/manualTrading/cancelOrderBatch.json",params,"POST_JSON");
