import axios from "axios";
import fetch from "./request";
// import '../mock';

let baseURL = "";
const NODE_ENV = process.env.NODE_ENV;
if (NODE_ENV === "development") {
    baseURL = "";
}
axios.defaults.baseURL = baseURL;
// console.log(axios.defaults);

// axios.defaults.headers.post["Content-Type"] = "application/json";
// axios.defaults.headers.delete["Content-Type"] = "application/json";
// axios.defaults.headers.put["Content-Type"] = "application/json";


// account
export const login = params => fetch("/api/v1/user/login", params, "POST");
export const logout = params => fetch("/api/v1/user/logout", params, "POST");
export const getUser = () => fetch("/api/v1/user/info", null, "GET");
export const changePassword = params => fetch("/api/v1/user/pwd/change", params, "POST");

// 策略列表
export const getStrategyListData = () => fetch("/api/v1/strategy", null, "GET");
export const getResultDetail = params => fetch("/api/v1/marketmaker/report/results", params, "GET");

// 回测结果
export const getBackTest = params => fetch("/api/v1/backtest/record/detail", params, "GET");
export const performance = params => fetch("/api/v1/backtest/record/performance", params, "GET");
export const getAssetOption = params => fetch("/api/v1/backtest/record/dataset/name", params, "GET");
export const getTradeList = params => fetch("/api/v1/backtest/record/transaction/analysis", params, "GET");
export const resultDetailCharts = params => fetch("/api/v1/backtest/result/detail", params, "GET");
//symbol: result_id** ,start,end,
// 交易记录
export const transactionRecord = params => fetch("/api/v1/backtest/result/transactionrecord", params, "GET");
export const exportCsv = params => fetch("/api/v1/backtest/result/export", params, "GET");

// 性能对比
export const performanceList = () => fetch("/api/v1/backtest/performance/compare/list", null, "GET");
export const performanceCurve = params => fetch("/api/v1/backtest/performance/compare/curve", params, "POST_JSON");
export const deploy = params => fetch("/api/v1/marketmaker/strategy/deploy", params, "POST");

// 策略编辑
export const getStrategyList = () => fetch("/api/v1/backtest/file/all", null, "GET");
export const saveStrategyName = params => fetch("/api/v1/backtest/file/code", params, "POST");

// 变量设置
export const historyList = params => fetch("/api/v1/marketmaker/strategy/history/list", params, "GET");

export const currentParams = params => fetch("/api/v1/backtest/script/params", params, "GET");
export const setParams = params => fetch("/api/v1/backtest/script/params", params, "POST");
export const deleteParams = params => fetch("/api/v1/backtest/script/params", params, "DELETE");

export const enteryFunctions = params => fetch("/api/v1/backtest/script/variables", params, "POST");
export const getPatterns = () => fetch("/api/v1/marketmaker/patterns", null, "GET");
export const getRunParams = params => fetch("/api/v1/marketmaker/strategy/runparams", params, "GET");
export const getTargetDataset = () => fetch("/api/v1/marketmaker/strategy/target_dataset", null, "GET");
export const runStrategy = params => fetch("/api/v1/marketmaker/strategy/run", params, "POST_JSON");
 