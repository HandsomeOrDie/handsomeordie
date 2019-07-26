import * as ActionTypes from "../constants/ActionTypes";

const updateMarketPrice = (message, marketPrice) => {
    return async dispatch => {
        try {
            const symbol = message.symbol;
            const bidPxs = message.bidPxs;
            const askPxs = message.askPxs;
            marketPrice[symbol] = {};
            marketPrice[symbol].bid = bidPxs[0];
            marketPrice[symbol].ask = askPxs[0];
            dispatch({ type: ActionTypes.MARKET_PRICE, payload: {...marketPrice} });
        } catch (e) {
            console.log(e);
        }
    };
};

const updateReferencePrice = (message) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.REFERENCE_PRICE, payload: {...message} });
        } catch (e) {
            console.log(e);
        }
    };
};

const updateMinTick = (message, minTicks) => {
    return async dispatch => {
        try {
            const minTick = message.minTick;
            const configId = message.configId;
            if (!minTicks[configId] || minTicks[configId] !== minTick){
                minTicks[configId] = minTick;
                dispatch({ type: ActionTypes.SAVE_MINTICK, payload: {...minTicks} });
            }
        } catch (e) {
            console.log(e);
        }
    };
};

const saveMinTick = (minTicks) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.SAVE_MINTICK, payload: {...minTicks} });
        } catch (e) {
            console.log(e);
        }
    };
};

const setOrderBookValue = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.ORDER_BOOK_VALUE, payload: {...params} });
        } catch (e) {
            console.log(e);
        }
    };
};

const setSocketConnected = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.SOCKET_CONNECTED, payload: params });
        } catch (e) {
            console.log(e);
        }
    };
};

const setNotification = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.SHOW_NOTIFICATION, payload: params });
        } catch (e) {
            console.log(e);
        }
    };
};


export { updateMarketPrice, updateMinTick, setOrderBookValue, setSocketConnected, updateReferencePrice, setNotification, saveMinTick };
