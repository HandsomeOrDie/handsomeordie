import * as ActionTypes from "../constants/ActionTypes";
import {
    fetchGetStrategyList,
    uploadScirpt,
} from "../../common/marketApi";


const getStrategyList = () => {
    return async dispatch => {
        try {
            const data =await fetchGetStrategyList();
            // console.log(data.data);
            if(data){
                // cb(data.data);
            }
            dispatch({ type: ActionTypes.STRATEGY_LIST, payload: data.data });
        } catch (e) {
            console.log(e);
        }
    };
};
const getClickBtnName = (data) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.BTN_INDEX, payload: data });
        } catch (e) {
            console.log(e);
        }
    };
};
const getBtnNameList = (data) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.BTN_NAME, payload: data });
        } catch (e) {
            console.log(e);
        }
    };
};
const getParamList =(param, cb) =>{
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.PARAM_LIST, payload: param });
            cb && cb();
        } catch (e) {
            console.log(e);
        }
    };
};

const uploadScirptFile =(param, cb) =>{
    return async dispatch => {
        try {
            const result = await uploadScirpt(param);
            cb && cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};

const setInputInfo =(inputInfo) =>{
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.INPUT_INFO, payload: inputInfo });
        } catch (e) {
            console.log(e);
        }
    };
};

export {
    getStrategyList,getClickBtnName,getParamList,getBtnNameList, setInputInfo, uploadScirptFile};
