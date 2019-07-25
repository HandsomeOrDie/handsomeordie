import { combineReducers } from "redux";

import marketPrice from "../../marketMaker/reducers/marketPrice";
import groupsReducer from "../../marketMaker/reducers/marketGroups";
import corePrice from "../../marketMaker/reducers/corePrice";
import Save_trReducer from "../../marketMaker/reducers/save_tr";
import Save_PricingList from "../../marketMaker/reducers/save_pricingList";
import themeReducer from "../../marketMaker/reducers/setTheme";
import marketDetail from "../../marketMaker/reducers/marketDetail";
import SymbolListReducer from "../../marketMaker/reducers/symbolList";
import Distribution from "../../marketMaker/reducers/distribution";
import paramReducer from "../../marketMaker/reducers/saveParam";
import stocketReducer from "../../marketMaker/reducers/stocketReducer";
import bookHeader from "../../marketMaker/reducers/bookheader";
import CounterPartyReducer from "../../marketMaker/reducers/counterParty";
import counterPartyList from "../../marketMaker/reducers/counterpty";
import rfqTable from "../../marketMaker/reducers/rfqTable";
import tradeBlotterReducer from "../../marketMaker/reducers/tradeBlotter";
import LiquidityReducer from "../../marketMaker/reducers/liquidity";

import riskMonitorReducer from "../../marketMaker/reducers/riskmonitor";
import autoHedgeReducer from "../../marketMaker/reducers/autohedge";
import clientFlowReducer from "../../marketMaker/reducers/clientFlow";
import manualQuoteReducer from "../../marketMaker/reducers/manualQuote";
import globalReducer from "../../marketMaker/reducers/globalReducer";
import currentStrategyReducer from "../../marketMaker/reducers/currentStrategy";
// 手动交易
import manualTradingReducer from "../../marketMaker/reducers/manualTrading";
import marketRiskReducer from "../../marketMaker/reducers/marketRisk";
import operationRiskReducer from "../../marketMaker/reducers/operationRisk";
import riskMonitorMain from "../../marketMaker/reducers/riskMonitorMain";
import creditCptyReducer from "../../marketMaker/reducers/creditCounterParty";
import marketDataReducer from "../../marketMaker/reducers/marketDataReducer";
import systemAlertReducer from "../../marketMaker/reducers/systemAlertReducer";

//spdb
import odmReducer from "../../marketMaker/reducers/spdb/odmReducer";

const rootReducer = combineReducers({
    // TODO

    marketPrice,
    groupsReducer,
    corePrice,
    Save_trReducer,
    Save_PricingList,
    themeReducer,
    marketDetail,
    SymbolListReducer,
    Distribution,
    paramReducer,
    stocketReducer,
    bookHeader,
    CounterPartyReducer,
    counterPartyList,
    rfqTable,
    tradeBlotterReducer,
    globalReducer,

    riskMonitorReducer,
    autoHedgeReducer,
    clientFlowReducer,
    manualQuoteReducer,
    currentStrategyReducer,
    manualTradingReducer,
    marketRiskReducer,
    operationRiskReducer,
    creditCptyReducer,
    riskMonitorMain,

    marketDataReducer,
    LiquidityReducer,
    systemAlertReducer,

    odmReducer,
});

export default rootReducer;
