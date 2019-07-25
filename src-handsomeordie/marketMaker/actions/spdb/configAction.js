import * as ActionTypes from "../../constants/spdb/ActionTypes";
import { findBookByUser,createBookIds,userList,deleteBookIds } from "../../../common/spdbApi";

const findBook = (params, cb) => {
    return async dispatch => {
        try {
            const result = await findBookByUser(params);
            if(result.success){
                cb && cb(result);
            }
        } catch (e) {
            console.log(e);
        }
    };
};

const findBookSaveRedux = (params) => {
    return async dispatch => {
        try {
            const result = await findBookByUser(params);
            dispatch({ type: ActionTypes.SAVE_ALL_BOOK, payload: result.data });
        } catch (e) {
            console.log(e);
        }
    };
};

const createBook = (params, cb) => {
    return async dispatch => {
        try {
            const result = await createBookIds(params);
            if(result.success){
                cb && cb(result);
            }
        } catch (e) {
            console.log(e);
        }
    };
};

const deleteBook = (params, cb) => {
    return async dispatch => {
        try {
            const result = await deleteBookIds(params);
            if(result.success){
                cb && cb(result);
            }
        } catch (e) {
            console.log(e);
        }
    };
};

const getUserList = (params, cb) => {
    return async dispatch => {
        try {
            const result = await userList(params);
            if(result.success){
                cb && cb(result);
            }
        } catch (e) {
            console.log(e);
        }
    };
};

export { findBook,findBookSaveRedux,createBook,getUserList,deleteBook };
