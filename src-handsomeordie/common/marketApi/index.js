import axios from "axios";
import fetch from "../api/request";
let baseURL = "";
const NODE_ENV = process.env.NODE_ENV;
if (NODE_ENV === "development") {
    baseURL = "";
}
axios.defaults.baseURL = baseURL;
// console.log(axios.defaults);

//查询marketprice config 列表
// export const getMarketPriceConfigListFetch = () => fetch("/data/marketPriceConfig/find.json", null, "GET");
// export const getMarketGroups = () => fetch("/strategy/fx/marketMakingGroup/find.json", null, "GET");
// export const getCorePriceListFetch = () => fetch("/data/referencePriceConfig/find.json", null, "GET");
export const updateCorePrice = (params) => fetch("/data/referencePriceConfig/update.json", params, "POST_JSON");
export const createCorePrice = (params) => fetch("/data/referencePriceConfig/create.json", params, "POST_JSON");
export const deleteCorePrice = (id) => fetch("/data/referencePriceConfig/delete.json", { id: id }, "GET");
export const getCorePriceByIdFetch = (id) => fetch("/strategy/fx/marketMakingPricingList/findRefPxCfgByInstanceId.json", { refPxCfgId: id }, "GET");
export const updateSourceInitStatus = (sourceId, targetStatus) => fetch("/strategy/fx/marketMakingPricingList/updateRefPxCfgByInstanceId.json?id=" + sourceId + "&init=" + targetStatus, null, "POST");

// export const createMarketGroups = params => fetch("/strategy/fx/marketMakingGroup/create.json", params, "POST");
// export const updateMarketGroups = params => fetch("/strategy/fx/marketMakingGroup/update.json", params, "POST");
// export const deleteMarketGroups = params => fetch("/strategy/fx/marketMakingGroup/delete.json", params, "POST");
export const getReferencePrice = () => fetch("/data/referencePriceConfig/find.json", null, "GET");
// export const saveConfigDataFetch = (params) => fetch("/data/marketPriceConfig/create.json", params, "POST");

// export const marketMakingPricingList_save = params => fetch("/strategy/fx/marketMakingPricingList/updateList.json", params, "POST");
// export const marketMakingPricingList_find = () => fetch("/strategy/fx/marketMakingPricingList/find.json", null, "GET");
// export const marketMakingPricingList_delete = params => fetch("/strategy/fx/marketMakingPricingList/delete.json", params, "POST");

//smbolList
export const symbolListGet = () => fetch("/strategy/fx/marketMaking/findInstance.json", null, "GET");

//检查是否登录
export const checktLoginFetch = () => fetch("/finone-quantexecutor-spdb/jcgn/yhyz/hqyhxx.json", null, "GET");

//登录
export const getLoginFetch = (params) => fetch("/finone-quantexecutor-spdb/jcgn/yhyz/dl.json", params, "POST");

//distribution
export const getDistributionListByInstanceIdFetch = (instanceId) => fetch("/data/marketMakingDistribution/find.json", { instanceId: instanceId }, "GET");
export const createDistribution = (distribution) => fetch("/data/marketMakingDistribution/create.json", distribution, "POST_JSON");
export const updateDistribution = (distribution) => fetch("/data/marketMakingDistribution/update.json", distribution, "POST_JSON");
export const deleteDistribution = (id) => fetch("/data/marketMakingDistribution/delete.json?id=" + id, null, "GET");
export const CounterParty = (id) => fetch("/data/marketMakingCounterParty/find.json", null, "GET");
export const getQuoteSourceListFetch = () => fetch("/trading/quoteSource/findOption.json", null, "GET");

//orderbook apply
export const applyOrderBookFetch =(param) =>fetch("/strategy/fx/marketMaking/updateInstance.json",param,"POST");

export const applyInstance_list =(param) =>fetch("/strategy/fx/marketMaking/updateInstanceList.json",param,"POST");

//manual start
export const toStartStrategyFetch =(param) =>fetch("/strategy/fx/marketMaking/startInstance.json",param,"POST");

export const  toPauseStrategyFetch =(param) =>fetch("/strategy/fx/marketMaking/stopInstance.json",param,"POST");

export const toHaltStrategyFetch=(params)=>fetch("/strategy/fx/marketMaking/suspendInstance.json",params,"POST");

//获取 策略列表
export const fetchGetStrategyList =() =>fetch("/strategy/fx/marketMaking/findAlgo.json",null,"GET");

//退出登录
export const fetchLoginOut =() =>fetch("/finone-quantexecutor-spdb/jcgn/yhyz/dc.json",null,"GET");

//询价交易列表
export const FetchFindPending =(params) => fetch("/trading/quoteRequest/findPending.json",params,"GET");
export const FetchFindPendingTab =(params) => fetch("/trading/quoteRequest/find.json",params,"POST_JSON");
//报价来源
export const FetchFindQuoteSource =(param) =>fetch(`/data/marketMakingDistribution/findManualReference.json?symbol=${param}`,null,"GET");

//订单列表
// export const FetchFindRealtimeOrder =(params) => fetch("/trading/tradingOrder/findRealtimeOrder.json",params,"GET");
export const FetchFindRealtimeOrder =(params) => fetch("/trading/tradingOrder/findRealtimeOrder.json" + params, {},"GET_ENCODE");
// export const FetchFindRealtimeOrderTab =(params) => fetch("/trading/tradingOrder/find.json", params, "POST_JSON");
export const quoteRfq =(params) => fetch("/trading/manualQuote/quoteRfq.json",params,"POST");

//头寸列表
export const findPosition =(params) => fetch("/position/positionStatus/findExposure.json",params,"GET");
export const findCcyPosi =(params) => fetch("/position/positionStatus/findAllByCcyPair.json",params,"GET");
//自动平盘列表
export const findHedge =(params) => fetch("/trading/autoHedgingConfig/find.json",params,"GET");
//更新自动平盘列表
export const updateHedge =(params) => fetch("/trading/autoHedgingConfig/updateList.json",params,"POST_JSON");
//获取 添加自动平盘的SELECT候选项
export const findHedgeSelectValue =(params) => fetch("/trading/autoHedgingConfig/dict.json",params,"GET");
//自动平盘中cpty下拉选候选项列表
export const findCpty =(params) => fetch("/data/counterParty/find.json",params,"GET");

//自动报价列表
export const findClientFlow =(params) => fetch("/trading/autoQuotingConfig/find.json",params,"GET");
//更新自动报价列表
export const updateClientFlow =(params) => fetch("/trading/autoQuotingConfig/updateList.json",params,"POST_JSON");
//获取 添加自动报价的SELECT候选项
export const findSelectValue =(params) => fetch("/trading/autoQuotingConfig/dict.json",params,"GET");

//手动报价列表
export const findManualQuote =(params) => fetch("/trading/autoQuotingConfig/find.json",params,"GET");
//quote按钮
export const quote =(params) => fetch("/trading/manualQuote/quote.json",params,"POST_JSON");
//approve按钮
export const approve =(params) => fetch("/trading/manualQuote/approve.json",params,"POST");
//reject按钮
export const reject =(params) => fetch("/trading/manualQuote/reject.json",params,"POST");

//订单列表
export const findOrder =(params) => fetch("/trading/autoQuotingConfig/find.json",params,"GET");

// 手动交易
export const manualTradingQuoteRequest =(params) => fetch("/trading/manualTrading/quoteRequest.json",params,"POST_JSON");
// export const placeOrder =(params) => fetch("/trading/manualTrading/placeOrderRFQ.json",params,"POST");
export const findTodayQuoteRequest =() => fetch("/trading/manualTrading/findTodayQuoteRequest.json",{direction:1},"GET");
export const findTodayOrder =() => fetch("/trading/manualTrading/findTodayOrder.json",null,"GET");

//风险监测管理
//市场风险监测列表
export const findMarketRisk =(params) => fetch("/risk/marketRiskConfig/find.json",params,"GET");
//市场风险监测更新
export const updateMarketRisk =(params) => fetch("/risk/marketRiskConfig/updateList.json",params,"POST_JSON");
export const findSelectOption =(params) => fetch("/risk/marketRiskConfig/findOption.json",params,"GET");

//操作监测列表
export const findOperationRisk =(params) => fetch("/risk/operationRiskConfig/find.json",params,"GET");
//操作监测更新
export const updateOperationRisk =(params) => fetch("/risk/operationRiskConfig/updateList.json",params,"POST_JSON");
export const findOperationSelectValue =(params) => fetch("/risk/operationRiskConfig/findOption.json",params,"GET");
export const operationSelectOption =(params) => fetch("/risk/operationRiskConfig/findOption.json",params,"GET");

//授信 CounterParty
export const findCreditCpty =(params) => fetch("/data/counterParty/find.json",params,"GET");
export const updateCreditCpty =(params) => fetch("/data/counterParty/update.json",params,"POST_JSON");
export const findAllCreditCpty =(params) => fetch("/data/counterPartyCredit/findAll.json",params,"GET");
//授信 分组
export const findCptyGroup =(params) => fetch("/data/counterPartyGroup/find.json",params,"GET");
export const createCptyGroup =(params) => fetch("/data/counterPartyGroup/create.json",params,"POST_JSON");
export const deleteCptyGroup =(params) => fetch("/data/counterPartyGroup/delete.json",params,"POST_JSON");
export const updateCptyGroup =(params) => fetch("/data/counterPartyGroup/update.json",params,"POST_JSON");
// 市场风险监控
export const marketRiskStatus =() => fetch("/risk/marketRiskStatus/find.json",null,"GET");
// 风控提示监控
export const riskAlert =() => fetch("/risk/riskAlert/find.json",null,"GET");

//一键停止所有报价
export const batchStopQuote =(params) => fetch("/strategy/fx/marketMaking/stopAllInstances.json",params,"GET");

//行情源
//查询市场价格
export const findMarketData =(params) => fetch("/data/marketPriceConfig/find.json",params,"GET");
export const updateMarketData =(params) => fetch("/data/marketPriceConfig/updateStatus.json",params,"POST");
// 查询行情源列表
export const findMarketSrc =(params) => fetch("/data/dataSource/find.json",params,"GET");
export const updateMarketSrc =(params) => fetch("/data/dataSource/updateStatus.json",params,"POST");
export const findDirty =(params) => fetch("/data/marketPrice/findDirty.json",params,"GET");
export const addNewSource =(params) => fetch("/data/dataSource/create.json",params,"POST_JSON");

//ODM
export const findVenue =(params) => fetch("/trading/tradingSource/find.json",params,"GET");
export const findSymbol =(params) => fetch("/tradingvariety/tradingvarietymanage/findByExchangeCode.json",params,"GET");
export const findNetPosition =(params) => fetch("/position/positionStatus/findNetPositionByCode.json",params,"GET");
export const onPlaceOrder =(params) => fetch("/trading/manualTrading/placeOrder.json",params,"POST");
//ESP
export const findVenueESP =(params) => fetch("/trading/tradingSource/findByTradingTypes.json",params,"GET");

export const uploadScirpt =(params) => fetch("/strategy/strategyScript/fx/upload.json",params,"POST", true);

export const deleteQuidity =(params) => fetch("/data/userPriceConfig/delete.json",params,"GET", );
export const createQuidity =(params) => fetch("/data/userPriceConfig/create.json",params,"POST_JSON", );
export const findQuidity =(params) => fetch("/data/userPriceConfig/find.json",params,"GET", );
export const updateQuidity =(params) => fetch("/data/userPriceConfig/update.json",params,"POST_JSON", );
//查询所有的品种(symbol)
export const findAllSymbol =(params) => fetch("/tradingvariety/tradingvarietymanage/find.json",params,"GET");
// systemAlert
export const getSystemAlert = (param) => fetch("/common/systemAlert/find.json",param,"GET");
// trading blotter 推送(tradingWebSocket)

export const findProfileSetting = (param) => fetch("/data/profileSetting/findAll.json",param,"GET");
export const updateProfileSetting =(params) => fetch("/data/profileSetting/update.json",params,"POST_JSON", );

export const findExecutionByOrderId = (param) => fetch("/trading/tradingOrder/findExecutionByOrderId.json",param,"GET");

//trading websocket
export const tradingWebSocket = "com.qit.finance.trading.entity.OrderOutput";

//头寸 websocket
export const riskMonitorWebSocket = "com.qit.finance.trading.entity.LocPositionOutput！！";

//web socket  com.finone.quantexecutor.entity.ReferencePriceOutput
export const ReferencePriceOutput ="com.finone.quantexecutor.entity.ReferencePriceOutput";
export const MarketMakingInstanceOutput ="com.finone.quantexecutor.entity.MarketMakingInstanceOutput";

//orderbook  websocket
export const orderbookWebSocket ="com.finone.quantexecutor.entity.QuoteOutput";
//交易汇率 websocket
export const marketPriceWebSocket = "com.finone.quantexecutor.entity.MarketPriceOutput";

export const riskSorket = "com.qit.finance.trading.entity.MarketRiskStatusOutput";

export const systemAlertSorket = "com.qit.finance.common.entity.SystemAlertOutput";

// client flow 推送
export const quoteRequestOutput = "com.qit.finance.data.QuoteRequestOutput";


// export const marketMakingPricingListFind = (param) => fetch("/finone-quantexecutor/strategy/fi/marketMakingPricingList/find.json",param,"GET");
// export const marketMakingPriceFind = (param) => fetch("/finone-quantexecutor/data/fi/marketPriceConfig/find.json",param,"GET");
// export const marketMakingGroupFind = (param) => fetch("/finone-quantexecutor/strategy/fi/marketMakingGroup/find",param,"GET");





// 浦发 Pricing
export const getCorePriceListFetch = () => fetch("/finone-quantexecutor-spdb/data/fi/marketPriceConfig/find.json", null, "GET");
export const getMarketGroups = () => fetch("/finone-quantexecutor-spdb/strategy/fi/marketMakingGroup/find.json", null, "GET");
export const marketMakingPricingList_find = () => fetch("/finone-quantexecutor-spdb/strategy/fi/marketMakingPricingList/find.json", null, "GET");
export const marketMakingPricingList_save = params => fetch("/finone-quantexecutor-spdb/strategy/fi/marketMakingPricingList/updateList.json", params, "POST");
export const marketMakingPricingList_delete = params => fetch("/finone-quantexecutor-spdb/strategy/fi/marketMakingPricingList/delete.json", params, "POST");
export const createMarketGroups = params => fetch("/finone-quantexecutor-spdb/strategy/fi/marketMakingGroup/create.json", params, "POST");
export const updateMarketGroups = params => fetch("/finone-quantexecutor-spdb/strategy/fi/marketMakingGroup/update.json", params, "POST");
export const deleteMarketGroups = params => fetch("/finone-quantexecutor-spdb/strategy/fi/marketMakingGroup/delete.json", params, "POST");

// 浦发 Market Price
export const getMarketPriceConfigListFetch = () => fetch("/finone-quantexecutor-spdb/data/fi/marketPriceConfig/find.json", null, "GET");
export const saveConfigDataFetch = (params) => fetch("/finone-quantexecutor-spdb/data/fi/marketPriceConfig/create.json", params, "POST");
export const deleteMarketPriceItemFetch = params => fetch("/finone-quantexecutor-spdb/data/fi/marketPriceConfig/delete.json", params, "GET");

// 交易记录 TAB
// 报单记录
export const FetchFindRealtimeOrderTab =(params) => fetch("/finone-quantexecutor-spdb/trading/fi/tradingOrder/find.json", params, "POST_JSON");
export const FetchFindRealtimeOrderRecordTab =(params) => fetch("/finone-quantexecutor-spdb/trading/fi/tradingOrder/findExecution.json", params, "POST_JSON");

export const findExecution =(params) => fetch("/finone-quantexecutor-spdb/trading/fi/tradingOrder/findExecution.json", params, "POST_JSON");

//获取 策略列表
export const findAlgoList =() =>fetch("/finone-quantexecutor-spdb/strategy/fi/marketMaking/findAlgo.json",null,"GET");
export const dealRecordSocket = "com.qit.finance.trading.entity.ExecutionOutput";

// 手动下单
export const placeOrder =(params) => fetch("finone-quantexecutor-spdb/fi/trading/manualTrading/placeOrder.json", params, "POST_JSON");
