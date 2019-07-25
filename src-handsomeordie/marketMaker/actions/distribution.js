import * as ActionTypes from "../constants/ActionTypes";
import {
    getDistributionListByInstanceIdFetch,
    createDistribution,
    updateDistribution,
    deleteDistribution,
    CounterParty,
    getQuoteSourceListFetch
} from "../../common/marketApi";


const getDistributionListByInstanceId = (instanceId, cb) => {
    return async dispatch => {
        try {
            let result = await getDistributionListByInstanceIdFetch(instanceId);
            // let result = {
            //     data: [
            //         {
            //             id: 1,
            //             tradingType: "ESP",
            //             displayName: "CFETS ESP",
            //             spread: 0,
            //             skew: 0,
            //             noLiquidity: "HALT",
            //             freq: 2,
            //             thresholdSpread: 5,
            //             thresholdMove: 2
            //         },
            //         {
            //             id: 2,
            //             tradingType: "ESP",
            //             displayName: "CFETS ESP",
            //             spread: 0,
            //             skew: 0,
            //             noLiquidity: "HALT",
            //             freq: 2,
            //             thresholdSpread: 5,
            //             thresholdMove: 2
            //         }
            //     ]
            // };
            dispatch({ type: ActionTypes.GET_DISTRIBUTION_LIST_BY_INSTANCE_ID, payload: result.data });
            cb && cb(result.data);
        } catch (e) {
            console.log(e);
        }
    };
};

const saveDistribution = (distributionItem, cb) => {
    return async dispatch => {
        let result = { data: distributionItem };
        if (distributionItem.id) {
            let result = await updateDistribution(distributionItem);
            dispatch({ type: ActionTypes.SAVE_DISTRIBUTION, payload: result.data });
        } else {
            let result = await createDistribution(distributionItem);
            dispatch({ type: ActionTypes.ADD_DISTRIBUTION, payload: result.data });
        }
        cb && cb();
    };
};

const deleteDistributionById = (id) => {
    return async dispatch => {
        let result = await deleteDistribution(id);
        dispatch({ type: ActionTypes.DELETE_DISTRIBUTION_BY_ID, payload: id });
    };
};

const getData = (data) => {
    let obj = {},
        group = data.counterPartyGroups;
    for (let i = 0; i < group.length; i++) {
        let elem = group[i];
        obj[elem.id] = elem.name;
    }
    return obj;
};
const getCounterParty = () => {
    return async dispatch => {
        try {
            const list = await CounterParty();
            if (list.success) {
                dispatch({
                    type: ActionTypes.COUNTER_PARTY,
                    payload: list.data,
                    nameObj: getData(list.data),
                });
            }

        } catch (e) {
            console.log(e);
        }
    };
};
const getCounterParty_drag = (data) => {
    return async dispatch => {
        try {
            dispatch({
                type: ActionTypes.COUNTER_PARTY_DRAG,
                payload: data
            });
        } catch (e) {
            console.log(e);
        }
    };
};
const getCounterParty_save = (data) => {
    return async dispatch => {
        try {
            dispatch({
                type: ActionTypes.COUNTER_PARTY_SAVE,
                payload: data
            });
        } catch (e) {
            console.log(e);
        }
    };
};

const saveQuote = (quoteList) => {
    return async dispatch => {
        try {
            dispatch({
                type: ActionTypes.SAVE_QUOTE,
                payload: quoteList
            });
        } catch (e) {
            console.log(e);
        }
    };
};

const getQuoteSourceList = () => {
    return async dispatch => {
        let result = await getQuoteSourceListFetch();
        dispatch({ type: ActionTypes.GET_QUOTE_SOURCE_LIST, payload: result.data });
    };
};

export { getDistributionListByInstanceId, saveDistribution, deleteDistributionById, getCounterParty, getCounterParty_drag, getCounterParty_save, saveQuote, getQuoteSourceList };
