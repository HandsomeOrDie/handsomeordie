import * as ActionTypes from "../constants/ActionTypes";

import {
    getMarketGroups,
    createMarketGroups,
    updateMarketGroups,
    deleteMarketGroups,
    marketMakingPricingList_save,
    marketMakingPricingList_find,
    marketMakingPricingList_delete,
} from "../../common/marketApi";




const getGroups = (cb) => {
    return async dispatch => {
        try {
            const list = await getMarketGroups();
            dispatch({ type: ActionTypes.GET_GROUPS, payload: list.data });
            cb();
        } catch (e) {
            console.log(e);
        }
    };
};
const createGroups = (record) => {
    return async dispatch => {
        try {
            const list = await createMarketGroups(record);
            dispatch({ type: ActionTypes.CREATE_GROUPS, list: list.data });
            // if(list)  cb();
        } catch (e) {
            console.log(e);
        }
    };
};
const updateGroups = (record) => {
    return async dispatch => {
        try {
            const list = await updateMarketGroups(record);
            dispatch({ type: ActionTypes.UPDATE_GROUPS, list: list.data });
        } catch (e) {
            console.log(e);
        }
    };
};
const deleteGroups = (record,cb) => {
    return async dispatch => {
        try {
            const list = await deleteMarketGroups(record);
            if(list.success){
                cb();
            }
            dispatch({ type: ActionTypes.DELETE_GROUPS, list: list.data });
        } catch (e) {
            console.log(e);
        }
    };
};

const Save_tr = (record) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.SAVE_TR, payload: record});
        } catch (e) {
            console.log(e);
        }
    };
};
const Save_PricingList = (record) => {
    return async dispatch => {
        try {
            const list = await marketMakingPricingList_save(record);
            dispatch({ type: ActionTypes.SAVE_PRICING_LIST, payload: list.data});
        } catch (e) {
            console.log(e);
        }
    };
};
const Find_PricingList = (cb) => {
    return async dispatch => {
        try {
            const list = await marketMakingPricingList_find();
            // if(list.success){
            cb();
            // }
            dispatch({ type: ActionTypes.FIND_PRICING_LIST, payload: list.data});
        } catch (e) {
            console.log(e);
        }
    };
};
const Delete_PricingList = (record) => {
    return async dispatch => {
        try {
            const list = await marketMakingPricingList_delete(record);
            dispatch({ type: ActionTypes.DELETE_PRICING_LIST, payload: list.data});
        } catch (e) {
            console.log(e);
        }
    };
};



export {  getGroups, createGroups, updateGroups, deleteGroups, 
    Save_tr,Save_PricingList, Find_PricingList,Delete_PricingList };
