import * as ActionTypes from "../constants/ActionTypes";
import { findCreditCpty, updateCreditCpty, findCptyGroup, createCptyGroup, updateCptyGroup, deleteCptyGroup, findAllCreditCpty} from "../../common/marketApi/index";

const getCptyList = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.COUNTER_PARTY_LOADING, payload: true });
            const result = await findCreditCpty(params);
            dispatch({ type: ActionTypes.COUNTER_PARTY_LIST, payload: result.data });
            dispatch({ type: ActionTypes.COUNTER_PARTY_LOADING, payload: false });
        } catch (e) {
            console.log(e);
        }
    };
};

const getAllCreditCpty = (params, cb) => {
    return async dispatch => {
        try {
            const result = await findAllCreditCpty(params);
            cb && cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};

const setCptyList = (list) => {
    // console.log("list: ", list);
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.COUNTER_PARTY_LIST, payload: [...list] });
        } catch (e) {
            console.log(e);
        }
    };
};

const saveCpty = (params, cb) => {
    return async dispatch => {
        try {
            const result = await updateCreditCpty(params);
            cb && cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};

const getGroupList = (params, cb) => {
    return async dispatch => {
        try {
            const selectedCpty = [];
            dispatch({ type: ActionTypes.CPTY_GROUP_LOADING, payload: true });
            const result = await findCptyGroup(params);
            let data = result.data;
            data.map((item, index) => {
                item.editing = false;
                item.key = index;
                item.counterParties.map((it, ind) => {
                    it.key = ind;
                    selectedCpty.push(it.code);
                });
            });
            cb && cb(data[0], data);
            await dispatch({ type: ActionTypes.CPTY_GROUP_LIST, payload: [...data] });
            dispatch({ type: ActionTypes.SELECTED_CPTY, payload: [...selectedCpty] });
            dispatch({ type: ActionTypes.CPTY_GROUP_LOADING, payload: false });
        } catch (e) {
            console.log(e);
        }
    };
};

const addGroup = (list) => {
    return async dispatch => {
        try {
            const newData = {
                key: list.length,
                editing: true,
            };
            dispatch({ type: ActionTypes.CPTY_GROUP_LIST, payload: [...list, newData] });
        } catch (e) {
            console.log(e);
        }
    };
};

const saveGroup = (params, cb) => {
    return async dispatch => {
        try {
            const result = await createCptyGroup(params);
            cb && cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};

const updateGroup = (params, cb) => {
    return async dispatch => {
        try {
            const result = await updateCptyGroup(params);
            cb && cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};

const deleteGroup = (params, cb) => {
    return async dispatch => {
        try {
            const result = await deleteCptyGroup(params);
            cb && cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};

const setCurrentGroup = (currentGroup) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.CURRENT_GROUP, payload: currentGroup });
        } catch (e) {
            console.log(e);
        }
    };
};

const setSelectedCpty = (selectedCpty) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.SELECTED_CPTY, payload: selectedCpty });
        } catch (e) {
            console.log(e);
        }
    };
};

export {
    getCptyList,
    setCptyList,
    saveCpty,
    getGroupList,
    addGroup,
    saveGroup,
    updateGroup,
    deleteGroup,
    setCurrentGroup,
    setSelectedCpty,
    getAllCreditCpty,
};
