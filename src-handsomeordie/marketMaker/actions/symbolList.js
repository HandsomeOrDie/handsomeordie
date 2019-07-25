import {SAVE_PARAM, GET_SYMBOLLIST, START_INSTANCE, SAVE_SOCKET,BTN_NAME,PARAM_LIST,BTN_INDEX, SAVE_APPLY_BTN} from "../constants/ActionTypes";

import { symbolListGet, applyInstance_list, batchStopQuote} from "../../common/marketApi";
import {formatStr,formatNumber,sumNumber} from "../utils/commonFun";

const initData = (list) => {
    let no_group = [], group_name = [], group_list = [];
    let obj = { };
    for(let i=0;i<list.length;i++){
        let listN = list[i];
        if(listN.groupName===""){
            // console.log(listN);
            no_group.push(listN);
        }else{
            if(obj[listN.groupName]){
                obj[listN.groupName].push(listN);
            }else{
                obj[listN.groupName] = [];
                obj[listN.groupName].push(listN);
            }
        }
    }
    for(let k in obj){
        group_name.push(k);
        group_list.push(obj[k]);
    }
    // console.log(obj);
    return{
        normal_list: no_group,
        group_list: group_list,
        group_name: group_name,
    };
};

const getSymbolList = (cb) => {
    return async dispatch => {
        try {
            const list = await symbolListGet();
            let obj = list.data instanceof Array && list.data.length?initData(list.data):{};
            // console.log(obj);
            if(list.success){
                dispatch({ 
                    type: GET_SYMBOLLIST,
                    ...obj
                });
                // console.log(obj);
                if(obj.normal_list.length){
                    //xuhuang 修改
                    // cb(obj.normal_list);
                    cb(obj.normal_list[0], obj.normal_list, obj.group_list);
                }else if(obj.group_list.length){
                    let arr = obj.group_list;
                    if(arr.length && arr[0].length){
                        cb(arr[0][0], [], obj.group_list);
                    }
                }
          
            }
          
        } catch (e) {
            console.log(e);
        }
    };
};
const save_Param = (record,cb) => {
    // console.log(record);
    return async dispatch => {
        try {
            // console.log(record);
            dispatch({ 
                type: SAVE_PARAM,
                strategyParam:record
            });
            if(cb){
                cb();
            }
            let tmpArr =[];
            if(record.algo=="Manual" && record.strategyScriptParams.bidQuantities instanceof Array){
                record.strategyScriptParams.bidQuantities.map((item,idx)=>{
                    record.strategyScriptParams.bidPrice = record.strategyScriptParams.bidPrice || [];
                    record.strategyScriptParams.askPrice = record.strategyScriptParams.askPrice || [];
                    record.strategyScriptParams.bidPrice[idx] =formatStr(Number(formatNumber(record.quoteBidPrice)-sumNumber(record.strategyScriptParams.bidPricesStep,idx))/10000);
                    record.strategyScriptParams.askPrice[idx] =formatStr(Number(formatNumber(record.quoteOfferPrice)+sumNumber(record.strategyScriptParams.askPricesStep,idx))/10000);
                });
                tmpArr.push({algo:record.algo,config:[record.strategyScriptParams],status:record.status});
            }else{
                //由于后台数据，数据强转，
                let tmpObj=[],configData=[];
                for(var item in record.strategyScriptParams){
                    tmpObj.push(item);
                }
                for(var i =0; i<tmpObj.length;i++){
                    configData[i] = {name:tmpObj[i],value:record.strategyScriptParams[tmpObj[i]][0]};
                }
                let obj ={bidPricesStep: ["0"],bidPrice:[record.quoteBidOfferPrice instanceof Array && record.quoteBidOfferPrice.length? record.quoteBidOfferPrice[0]:0], bidQuantities: ["0"],askPricesStep: ["0"],askQuantities: ["0"],askPrice:[record.quoteBidOfferPrice instanceof Array && record.quoteBidOfferPrice.length>1?record.quoteBidOfferPrice[1]:0]};
                // tmpArr.push({algo:"Manual",config:[obj],status:"STOPED"});
                //上面的一句是原先的代码，下面一句是自己加的
                tmpArr.push({algo:"Manual",config:[record.strategyScriptParamsMap && record.strategyScriptParamsMap.Manual?record.strategyScriptParamsMap.Manual:""],status:"STOPED"});
                tmpArr.push({algo:record.algo,config:configData,status:record.status});
            }
            // console.log("tmpArr:", tmpArr);
            dispatch({ type: BTN_NAME, payload: record.algo });
            dispatch({ type: PARAM_LIST, payload: tmpArr });
            dispatch({type: BTN_INDEX, payload: tmpArr.length==2?{name:tmpArr[1].algo,index:1,status:tmpArr[1].status}:{name:tmpArr[0].algo,index:0,status:tmpArr[0].status}});
            
        } catch (e) {
            console.log(e);
        }
    };
};

const save_socket = (obj) => {
    return async dispatch => {
        // console.log(obj);
        try {
            dispatch({ 
                type: SAVE_SOCKET,socketList: obj
            });
        } catch (e) {
            console.log(e);
        }
    };
};

const setApplyBtn = (bool) => {
    return async dispatch => {
        // console.log(obj);
        try {
            dispatch({
                type: SAVE_APPLY_BTN,
                payload: bool
            });
        } catch (e) {
            console.log(e);
        }
    };
};

const applyInstanceList =(param, cb) =>{
    return async dispatch => {
        try {
            const loginDetail = await applyInstance_list(param);
            cb(loginDetail);
        } catch (e) {
            console.log(e);
        }
    };
};

const stopAllQuote =(params, cb) =>{
    return async dispatch => {
        try {
            const result = await batchStopQuote(params);
            cb(result);
        } catch (e) {
            console.log(e);
        }
    };
};
export {getSymbolList, save_Param, save_socket, applyInstanceList, setApplyBtn, stopAllQuote};
