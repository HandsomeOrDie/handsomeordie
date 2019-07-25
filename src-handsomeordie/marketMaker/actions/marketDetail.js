import * as ActionTypes from "../constants/ActionTypes";
import {
    checktLoginFetch,getLoginFetch,applyOrderBookFetch,toStartStrategyFetch,toPauseStrategyFetch,toHaltStrategyFetch
    ,fetchLoginOut
} from "../../common/marketApi";
import Global from "../socket/Global";
// import WebSocketClient from "../socket/WebSocketClient";
const showPage = (param) => {
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.MARKET_PAGE_EX, payload: param });
        } catch (e) {
            console.log(e);
        }
    };
};

// 查询用户信息 
const checkLogin = (cb) => {
    return async dispatch => {
        try {
            if(!localStorage.getItem("userInfo")){
                const loginDetail = await checktLoginFetch();
                // console.log(333);
                if(loginDetail.data){
                //  dispatch({ type: ActionTypes.MARKET_POST_LOGIN, payload: loginDetail.data });
                // Global.userInfo=loginDetail.data;
                    localStorage.setItem("userInfo",JSON.stringify(loginDetail.data)); //存入 参数： 1.调用的值 2.所要存入的数据 
                    // console.log(JSON.parse(localStorage.getItem("userInfo")));//输出
                }
                cb(loginDetail.data);
            } else {
                console.log("已登录");
                cb(JSON.parse(localStorage.getItem("userInfo")));
            }
        } catch (e) {
            console.log(e);
            cb(false);
        }
    };
};

//登录
const getLogin =(param,cb) => {
    return async dispatch => {
        try {
            const loginDetail = await getLoginFetch(param);
            // console.log(loginDetail);
            if(loginDetail.data){
                dispatch({ type: ActionTypes.MARKET_LOGIN, payload: loginDetail.data });
            }
            cb(loginDetail.data);
            // dispatch({ type: ActionTypes.MARKET_LOGIN, payload: param });
        } catch (e) {
            console.log(e);
        }
    };
};


// 设置reference price 实时更新数据 
const getReferencePrice =(param) =>{
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.GET_REFERENCE, payload: param });
        } catch (e) {
            console.log(e);
        }
    };
};
//
const getInstance_output =(param) =>{
    return async dispatch => {
        try {
            dispatch({ type: ActionTypes.SAVE_SOCKET_INSTANCEOUTPUT, payload: param });
        } catch (e) {
            console.log(e);
        }
    };
};

// apply order book data
const applyOrderBook =(param, cb) =>{
    return async dispatch => {
        try {
            const loginDetail = await applyOrderBookFetch(param);
            cb(loginDetail.updateInfo);
        } catch (e) {
            console.log(e);
        }
    };
};

// manual 启动
const toStartStrategy =(param,cb) =>{
    return async dispatch => {
        try {
            const data = await toStartStrategyFetch(param);
            /// 此处要将 策略的状态更新到右侧列表   预留
            if(data&&data.instanceStatus){
                cb(data.instanceStatus, data.success);
            }
        } catch (e) {
            console.log(e);
        }
    };
};
// 停止
const toPauseStrategy =(param,cb) =>{
    return async dispatch => {
        try {
            const data = await toPauseStrategyFetch(param);
            /// 此处要将 策略的状态更新到右侧列表   预留
            if(data&&data.instanceStatus){
                cb(data.instanceStatus, data.success);
            }
        } catch (e) {
            console.log(e);
        }
    };
};
const toHaltStrategy =(param,cb) =>{
    return async dispatch => {
        try {
            const data = await toHaltStrategyFetch(param);
            /// 此处要将 策略的状态更新到右侧列表   预留
            if(data&&data.instanceStatus){
                cb(data.instanceStatus);
            }
        } catch (e) {
            console.log(e);
        }
    };
};
//登出
const loginOut =(cb) =>{
    return async dispatch => {
        try {
            const data = await fetchLoginOut();
            if(data.success){
                cb(data.success);
                localStorage.removeItem("userInfo");
            }
        } catch (e) {
            console.log(e);
        }
    };
};
export {
    showPage, checkLogin ,getLogin,getReferencePrice ,applyOrderBook,toStartStrategy ,
    toPauseStrategy,toHaltStrategy,getInstance_output,loginOut
};
