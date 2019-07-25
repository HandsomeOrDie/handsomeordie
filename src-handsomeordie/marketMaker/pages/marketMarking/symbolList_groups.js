import { connect } from "react-redux";
import React, { Component } from "react";
import { Table,Icon,Button, message} from "antd";
import square from "../../images/square.png";
import sanjiao from "../../images/sanjiao.png";
import {applyOrderBook, toStartStrategy, toPauseStrategy} from "../../actions/marketDetail";
import {setCurrentStrategy} from "../../actions/setCurrentStrategy";

import {applyInstanceList, save_Param, setApplyBtn} from "../../actions/symbolList";
import {formatStr, getOffset} from "../../utils/commonFun";
import { ServerResponse } from "http";
import {getClickBtnName} from "../../actions/bookHeader";
import moment from "moment";
class SymbolList_groups extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLightColor: false,
            list: [],
            isTimeShow: false,
        };
    }
    componentWillReceiveProps (nextProps) {
        if(nextProps.socketList !== this.props.socketList){
            // console.log(nextProps.socketList);
            let data = nextProps.socketList.socketList || {};
            const {list} = this.state;
            if(list.length){
                list.map((elem,index) => {
                    if(elem.mktPxConfigId === data.configId){
                        let isNew = false;
                        if(elem.marketBidOfferPrices[0] !== data.bidPxs[0]){
                            elem["bidRedGreen"] = "";
                            if(data.bidPxs[0] > elem.marketBidOfferPrices[0]){
                                // 大 红闪
                                elem["bidRedGreen"]="red";
                            }
                            if(data.bidPxs[0] < elem.marketBidOfferPrices[0]){
                                // 小 绿闪
                                elem["bidRedGreen"]="green";
                            }
                            elem.marketBidOfferPrices[0] =  data.bidPxs[0];
                            isNew = true;
                        }
                        if(elem.marketBidOfferPrices[1] !== data.askPxs[0]){elem["askRedGreen"] = "";
                            if(data.askPxs[0] > elem.marketBidOfferPrices[1]){
                            // 大 红闪
                                elem["askRedGreen"]="red";
                            }
                            if(data.askPxs[0] < elem.marketBidOfferPrices[1]){
                            // 小 绿闪
                                elem["askRedGreen"]="green";
                            }
                            elem.marketBidOfferPrices[1] =  data.askPxs[0];
                            isNew = true;
                        }
                        if(isNew){
                            this.setState({list:list});
                        }

                    }
                });
            }

        }
        // console.log(nextProps.socket_instanceList);
        if(nextProps.socket_instanceList !== this.props.socket_instanceList){
            // console.log(nextProps.socket_instanceList);
            this.updateList(nextProps.socket_instanceList);
        }
    }
    componentDidMount(){
        // console.log(this.props.data);
        this.setState({list: this.props.data});
    }
    updateList (message){

        // clearTimeout(this.timeout4,this.timeout5);
        const {list} = this.state;
        if(list.length){
            list.map((elem) => {
                let isNew = false;
                // console.log(message);
                if(elem.mktPxConfigId === message.mktPxConfigId){
                    let old_price = elem.quoteBidOfferPrice + "";
                    let new_price = message.quoteBidOfferPrice + "";

                    if(old_price && new_price){

                        if(message.quoteBidOfferPrice[0] !== elem.quoteBidOfferPrice[0]){
                            elem["quoteBidRedGreen"] = "";
                            if(message.quoteBidOfferPrice[0] > elem.quoteBidOfferPrice[0]){
                            // 大 红闪
                                elem["quoteBidRedGreen"]="red";
                            }
                            if(message.quoteBidOfferPrice[0] < elem.quoteBidOfferPrice[0]){
                            // 小 绿闪
                                elem["quoteBidRedGreen"]="green";
                            }
                            elem.quoteBidOfferPrice[0] =  message.quoteBidOfferPrice[0];
                            isNew = true;
                        }
                        if(message.quoteBidOfferPrice[1] !== elem.quoteBidOfferPrice[1]){
                            elem["quoteAskRedGreen"] = "";
                            if(elem.quoteBidOfferPrice[1] < message.quoteBidOfferPrice[1]){
                            // 大 红闪
                                elem["quoteAskRedGreen"]="red";
                            }
                            if(elem.quoteBidOfferPrice[1] > message.quoteBidOfferPrice[1]){
                            // 小 绿闪
                                elem["quoteAskRedGreen"]="green";
                            }
                            elem.quoteBidOfferPrice[1] =  message.quoteBidOfferPrice[1];
                            isNew = true;
                        }
                        // elem.quoteBidOfferPrice = message.quoteBidOfferPrice; isNew = true;
                    }
                    if(message.quoteSpread && !message.quoteSpread_copy){
                        elem.quoteSpread = message.quoteSpread; isNew = true;
                    }
                    if(message.quoteSkew && !message.quoteSkew_copy){
                        elem.quoteSkew = message.quoteSkew; isNew = true;
                    }
                    if(message.marketSpread){
                        elem.marketSpread = message.marketSpread; isNew = true;
                    }
                    if(message.time){
                        elem.time = message.time.slice(11,19); isNew = true;
                    }
                    if(message.quota){
                        elem.quota = message.quota; isNew = true;
                    }
                    if(message.pnl){
                        elem.pnl = message.pnl; isNew = true;
                    }
                    if(message.algo){
                        elem.algo = message.algo; isNew = true;
                    }
                    if(message.status){
                        elem.status = message.status; isNew = true;
                    }
                    if(isNew){
                        this.setState({list:list});
                    }
                }
            });
        }
    }
    changeStatus = (text, record, index) => {
        let obj = {instanceId:  record.instanceId};
        const{operation} = this.props;
        const{list} = this.state;
        let status = operation[text];
        let tr_record = this.props.strategyParam;
        let fun = {
            "started": "toPauseStrategy",
            "stopped": "toStartStrategy",
        };
        let funName = fun[status];
        this.props[funName](obj, (str) => {
            // console.log(this.props.btnIndex.name, record.displayName);
            record.status = str;
            // if (this.props.btnIndex.name === record.displayName ){
            //     this.props.getClickBtnName({...this.props.btnIndex, status:str});
            // }
            this.setState({list});
            if(tr_record.instanceId === record.instanceId){
                this.props.setCurrentStrategy(record);
                this.clickTr(record);
            }
        });
    }
    clickTr = (record,apply) => {
        // console.log(this.props.strategyParam.instanceId , record.instanceId);

        if(apply){
            this.props.save_Param(record,()=>{
                this.props.setCurrentStrategy(this.props.currentStrategy);
            });
            return;
        }
        if(this.props.strategyParam.instanceId === record.instanceId){
            return;
        } else {
            this.props.save_Param(record,()=>{
                this.props.setCurrentStrategy(this.props.currentStrategy);
            });
        }
    }
    formatNum = (f, digit) => {
        var m = Math.pow(10, digit);
        return parseInt(f * m, 10) / m;
    }
    clickUp = (param,record) => {//原始值另存
        let num;
        if (param === "quoteSpread") {
            num = typeof(record[param+"_copy"]) === "number" ?  record[param+"_copy"] + 1 :  record[param] + 1;
        }else {
            num = typeof(record[param+"_copy"]) === "number" ?  record[param+"_copy"] + 0.5 :  record[param] + 0.5;
        }
        record[param+"_copy"] = this.formatNum(num + 0.000001, 1);
        const{ list} = this.state;
        this.setState({list});
    }
    clickDown = (param,record) => {
        let num;
        if (param === "quoteSpread") {
            num = typeof(record[param+"_copy"]) === "number" ?  record[param+"_copy"] - 1 :  record[param] - 1;
            if (num < 0){
                num = 0;
            }
        }else {
            num = typeof(record[param+"_copy"]) === "number" ?  record[param+"_copy"] - 0.5 :  record[param] - 0.5;
        }
        record[param+"_copy"] = this.formatNum(num + 0.000001, 1);
        const{ list} = this.state;
        this.setState({list});
        // }
    }
    reset = (record) => {
        // if(record.quoteSkew_copy !== undefined){
        //     record.quoteSkew = record.quoteSkew_copy;
        //     record.quoteSkew_copy = undefined;
        // }
        // if(record.quoteSpread_copy !== undefined){
        //     record.quoteSpread = record.quoteSpread_copy;
        //     record.quoteSpread_copy = undefined;//清0
        // }
        record.quoteSpread_copy = undefined;//清0
        record.quoteSkew_copy = undefined;
        const{ list} = this.state;
        this.setState({list});
    }
    getSpread = (record, spread, minTick) => {
        let displayQty = 10000;
        let currentStrategy = record;
        if (currentStrategy) {
            const symbol = currentStrategy.symbol;
            if (symbol === "USDJPY" || symbol === "EURJPY" || symbol.indexOf(".") !== -1) {
                displayQty = 100;
            }
            const offset = getOffset(minTick);
            return offset / displayQty * spread;
        }
    }
    getSkew = (record, skew, minTick) => {
        let displayQty = 10000;
        let currentStrategy = record;
        if (currentStrategy) {
            const symbol = currentStrategy.symbol;
            if (symbol === "USDJPY" || symbol === "EURJPY" || symbol.indexOf(".") !== -1) {
                displayQty = 100;
            }
            const offset = getOffset(minTick);
            return offset / displayQty * skew;
        }
    }
    apply = (record) => {
        const minTick = this.props.minTicks[record.mktPxConfigId];
        if (!minTick){
            message.error("Unable to get minTick!", 2);
            return;
        }
        let param ={
            instanceId:record.instanceId,
            quoteSpread: typeof(record.quoteSpread_copy) === "number" ? record.quoteSpread_copy : record.quoteSpread,
            quoteSkew: typeof(record.quoteSkew_copy) === "number" ? record.quoteSkew_copy : record.quoteSkew,
        };
        param.quoteSpread = this.getSpread(record, param.quoteSpread, minTick);
        param.quoteSkew = this.getSkew(record, param.quoteSkew, minTick);
        this.props.applyOrderBook({input:JSON.stringify(param)}, (str) => {
            if(str === "success"){
                record.quoteSpread = record.quoteSpread_copy || record.quoteSpread;
                record.quoteSkew = record.quoteSkew_copy || record.quoteSkew;
                record.quoteSpread_copy = undefined;//清0
                record.quoteSkew_copy = undefined;
                const{ list} = this.state;
                this.setState({list});
                let tr_record = this.props.strategyParam;
                if(tr_record.instanceId === record.instanceId){
                    this.clickTr(record,1);
                }
                message.success("Success!", 2);
            }else{
                this.reset(record);
                message.error("Strategy status abnormal!");
            }
        });
        this.props.setApplyBtn(true);
    }
    clickCaretUp = (type) => {
        const {list} = this.state;
        if (type === "quoteSpread"){
            list.map((record)=>{
                const num = typeof(record[type+"_copy"]) === "number" ?  record[type+"_copy"] + 2 : record[type] + 2;
                record[type+"_copy"] = this.formatNum(num + 0.000001, 1);
            });
        } else {
            list.map((record)=>{
                const num = typeof(record[type+"_copy"]) === "number" ?  record[type+"_copy"] + 0.5 : record[type] + 0.5;
                record[type+"_copy"] = this.formatNum(num + 0.000001, 1);
            });
        }
        this.setState({isTimeShow: true, list});
    }
    clickCaretDown = (type) => {
        const {list} = this.state;
        if (type === "quoteSpread"){
            list.map((record)=>{
                const num = typeof(record[type+"_copy"]) === "number" ?  record[type+"_copy"] - 2 : record[type] - 2;
                record[type+"_copy"] = num < 0 ? 0 : this.formatNum(num + 0.000001, 1);
            });
        } else {
            list.map((record)=>{
                const num = typeof(record[type+"_copy"]) === "number" ?  record[type+"_copy"] - 0.5 : record[type] - 0.5;
                record[type+"_copy"] = this.formatNum(num + 0.000001, 1);
            });
        }
        this.setState({isTimeShow: true, list});
    }
    reset_caret = () => {
        const {list} = this.state;
        list.map((record)=>{
            record.quoteSkew_copy = undefined;
            record.quoteSpread_copy = undefined;//清0
        });
        this.setState({isTimeShow: false, list});
    }
    apply_caret = () => {
        const {list} = this.state;
        let tr_record = this.props.strategyParam;
        let arr = [];
        list.map((elem)=>{
            const minTick = this.props.minTicks[elem.mktPxConfigId];
            const spread = typeof(elem.quoteSpread_copy) === "number" ? elem.quoteSpread_copy : elem.quoteSpread;
            const skew = typeof(elem.quoteSkew_copy) === "number" ? elem.quoteSkew_copy : elem.quoteSkew;
            arr.push({
                instanceId:elem.instanceId,
                quoteSpread: this.getSpread(elem, spread, minTick),
                quoteSkew: this.getSkew(elem, skew, minTick),
                displayName:elem.displayName,
            });
            if(tr_record.instanceId === elem.instanceId){
                this.clickTr(elem);
            }
        });
        this.props.applyInstanceList({input:JSON.stringify(arr)}, (str) => {
            // console.log("str:", str);
            if(str.success){
                list.map((record)=>{
                    record.quoteSpread = record.quoteSpread_copy || record.quoteSpread;
                    record.quoteSkew = record.quoteSkew_copy || record.quoteSpread;
                    record.quoteSpread_copy = undefined;//清0
                    record.quoteSkew_copy = undefined;
                });
                this.setState({list, isTimeShow: false});
            }else{
                this.reset_caret();
                message.error("Strategy status abnormal!");
            }
        });
        this.props.setApplyBtn(true);
    }
    
    // shouldComponentUpdate(nextProps,nextState){
    //     if(JSON.stringify(nextProps.data) === JSON.stringify(this.props.data)){
    //         return false;
    //     }
    //     return true;
    // }
    // shouldComponentUpdate(nextProps,nextState){
    //     if(nextProps.symbolListReducer === this.props.symbolListReducer){
    //         return false;
    //     }
    //     // if(JSON.stringify(nextProps.socketList) === JSON.stringify(this.props.socketList)){
    //     //     return false;
    //     // }
    //     // if(JSON.stringify(nextProps.socket_instanceList) === JSON.stringify(this.props.socket_instanceList)){
    //     //     return false;
    //     // }
    //     return true;
    // }

    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return;
        };
    }

    render() {
        // console.log(222);
        const {operation} = this.props;
        const {showLightColor} = this.state;
        const column = [
            { title: this.props.name, dataIndex: "displayName", align: "left",width:108,
                render: (text, record) => (
                    <div style={{ wordWrap: "break-word", wordBreak: "break-all",paddingLeft:5 }}>
                        <span className="activeHead"></span>
                        {text}
                    </div>
                )
            },
            { title: "Biid/Offer", dataIndex: "marketBidOfferPrices", className: "symbolList_opacity", align: "center",
                render: (text, record) => {
                    let text1 = formatStr(text[0])+"";
                    let text2 = formatStr(text[1])+"";
                    // console.log(record);
                    return (
                        <div style={{ wordWrap: "break-word", wordBreak: "break-all" }}>
                            {/* <span className="symbolList_color_red"> */}
                            <span style={{position:"relative"}} className={record.bidRedGreen=="red"?"redLight":record.bidRedGreen=="green"?"greenLight":""}>
                                <span style={{display:"inline-block",textAlign:"right"}}>{text1.substr(0,4)} </span>
                                <span style={{padding:"0 5px 0 5px"}} className="symbolList_font_size">{text1.substr(4,2)}</span>
                                <span style={{verticalAlign:"top",position:"absolute"}}>{text1.substr(6,1)?text1.substr(6,2):record.minTick===0.00001||record.minTick===0.001?"0":""}</span>
                            </span>
                            <span className="symbolList_font_size" style={{display:"inline-block",width:15,marginLeft:5}}> / </span>
                            {/* <span className="symbolList_color_green"> */}
                            <span style={{position:"relative"}} className={record.askRedGreen=="red"?"redLight":record.askRedGreen=="green"?"greenLight":""}>
                                <span style={{padding:"0 5px 0 5px"}} className="symbolList_font_size">{text2.substr(4,2)}</span>
                                <span style={{verticalAlign:"top",position:"absolute"}}>{text2.substr(6,1)?text2.substr(6,2):record.minTick===0.00001||record.minTick===0.001?"0":""} </span>
                                <span>{text2 && text2.indexOf(".")===3?text2.substr(0,4):text2.substr(0,4)}</span>
                            </span>
                        </div>
                    );
                } },
            // { title: "Mkt Sprd", dataIndex: "marketSpread", className: "symbolList_opacity",align: "center",width:60,
            //     render: (text, record) => (
            //         <div style={{ wordWrap: "break-word", wordBreak: "break-all" }}>
            //             {text}
            //         </div>
            //     )
            // },
            { title: "Quote", dataIndex: "quoteBidOfferPrice", className: "symbolList_opacity",align: "center",
                render: (text, record) => {
                    text = record.status === "STARTED" ? text : [0, 0];
                    let text1 = formatStr(text[0])+"";
                    let text2 = formatStr(text[1])+"";
                    return (
                        <div style={{ wordWrap: "break-word", wordBreak: "break-all" }}>
                            {/* <span className="symbolList_color_red"> */}
                            <span style={{position:"relative"}} className={record.quoteBidRedGreen=="red"?"redLight":record.quoteBidRedGreen=="green"?"greenLight":""}>
                                <span style={{display:"inline-block",textAlign:"right"}}>{text1.substr(0,4)} </span>
                                <span style={{padding:"0 5px 0 5px"}} className="symbolList_font_size">{text1.substr(4,2)}</span>
                                <span style={{verticalAlign:"top",position:"absolute"}}>{text1.substr(6,1)?text1.substr(6,2):record.minTick===0.00001||record.minTick===0.001?"0":""}</span>
                            </span>
                            <span className="symbolList_font_size" style={{display:"inline-block",width:15,marginLeft:5}}> / </span>
                            {/* <span className="symbolList_color_green"> */}
                            <span style={{position:"relative"}} className={record.quoteAskRedGreen=="red"?"redLight":record.quoteAskRedGreen=="green"?"greenLight":""}>
                                <span style={{padding:"0 5px 0 5px"}} className="symbolList_font_size">{text2.substr(4,2)}</span>
                                <span style={{verticalAlign:"top",position:"absolute"}}>{text2.substr(6,1)?text2.substr(6,2):record.minTick===0.00001||record.minTick===0.001?"0":""} </span>
                                <span>{text2 && text2.indexOf(".")===3?text2.substr(0,4):text2.substr(0,4)}</span>
                            </span>
                        </div>
                    );
                }  },
            {  title: (record)=>{
                return (
                    <div style={{ wordWrap: "break-word", wordBreak: "break-all",display: "flex",alignItems:"flex-end",flexDirection:"row",justifyContent:"flex-end" }}>
                        <div className="symbolList_up_down"><Icon type="up" onClick={()=>{this.clickCaretUp("quoteSpread");}}/></div>
                        <div className="symbolList_up_down"><Icon type="down" onClick={()=>{this.clickCaretDown("quoteSpread");}}/></div>
                    </div>
                );
            } , dataIndex: "quoteSpread",align: "center",
            width: 80,
            render: (text, record) => {
                let result = 0;
                if(typeof(record.quoteSpread_copy) === "number"){
                    result = record.quoteSpread_copy;
                }else{
                    result = text;
                }
                return (
                    <div style={{ wordWrap: "break-word", wordBreak: "break-all",display: "flex",alignItems:"center" }}>
                        <span className="symbolList_font_size" style={{flex:1,paddingRight:5,textAlign:"right"}}>{result}</span>
                        <div>
                            <div className="symbolList_up_down"><Icon type="up" onClick={(e)=>{ e.stopPropagation();this.clickUp("quoteSpread",record);}}/></div>
                            <div className="symbolList_up_down"><Icon type="down" onClick={(e)=>{ e.stopPropagation();this.clickDown("quoteSpread",record);}}/></div>
                        </div>
                    </div>
                );
            }
            },
            {  title: ()=>{
                return (
                    <div style={{ wordWrap: "break-word", wordBreak: "break-all",display: "flex",alignItems:"flex-end",flexDirection:"row",justifyContent:"flex-end" }}>
                        <div className="symbolList_up_down"><Icon type="up" onClick={()=>{this.clickCaretUp("quoteSkew");}}/></div>
                        <div className="symbolList_up_down"><Icon type="down" onClick={()=>{this.clickCaretDown("quoteSkew");}}/></div>
                    </div>
                );
            } , dataIndex: "quoteSkew",align: "center",
            width: 80,
            render: (text, record) => {
                let result = 0;
                if(typeof(record.quoteSkew_copy) === "number"){
                    result = record.quoteSkew_copy;
                }else{
                    result = text;
                }
                return (
                    <div style={{ wordWrap: "break-word", wordBreak: "break-all",display: "flex",alignItems:"center" }}>
                        <span className="symbolList_font_size" style={{flex:1,paddingRight:5,textAlign:"right"}}>{result}</span>
                        <div>
                            <div className="symbolList_up_down" onClick={(e)=>{ e.stopPropagation();this.clickUp("quoteSkew",record);}}> <Icon type="up"/></div>
                            <div className="symbolList_up_down" onClick={(e)=>{ e.stopPropagation();this.clickDown("quoteSkew",record);}}> <Icon type="down"/></div>
                        </div>
                    </div>
                );
            }
            },
            { title: "Mkt Sprd", dataIndex: "marketSpread", className: "symbolList_opacity",align: "center",width:70,
                render: (text, record) => (
                    <div style={{ wordWrap: "break-word", wordBreak: "break-all" }}>
                        {text}
                    </div>
                )
            },
            // { title: "Quota", dataIndex: "quota", className: "symbolList_opacity",align: "center",width:60,
            //     render:(text, record)=>{
            //         let str =  `${parseFloat(text*1000) > 100 ? 100 : parseFloat(text*1000).toFixed(1)}%`;
            //         return(
            //             <div style={{width:"100%",background:"#e1e1e1",height:"18px",color:"#000",wordWrap: "break-word", wordBreak: "break-all"}}>
            //                 <div style={{height:"100%",background:"#2d81bd",width:`${text?text*1000+"%":0}`,textAlign:"center",maxWidth:"100%"}}>
            //                     <span style={{display:"block",width:50}}>{str}</span>
            //                 </div>
            //             </div>
            //         );
            //     }
            // },
            // { title: "TD PnL", dataIndex: "pnl",  className: "symbolList_opacity",align: "center",width:60,
            //     render: (text, record) => {
            //         let str =  parseFloat(text).toFixed(1);
            //         // console.log(text,str);
            //         return <div style={{ wordWrap: "break-word", wordBreak: "break-all" }}>{text?str:"0.000"}</div>;
            //     }
            // },
            // { title: "Range", dataIndex: "id",  className: "symbolList_opacity", align: "center",width: 60,
            //     render:(text,record)=>{
            //         return (
            //             <div style={{background:"#2d81bd",textAlign:"center",height:3,wordWrap: "break-word", wordBreak: "break-all"}}>
            //                 <span style={{height:5,display:"block",width:2,background:"#fff",position:"relative",top:"-1px",marginLeft:"10%"}} className="dot"></span>
            //             </div>
            //         );
            //     }
            // },
            { title: () => {
                if(this.state.isTimeShow){
                    return (
                        <div >
                            <div> <Button className="symbolList_btn btn_reset btn_group_reset" onClick={this.reset_caret}>reset</Button></div>
                            <div> <Button className="symbolList_btn btn_group_reset" onClick={this.apply_caret}>apply</Button></div>
                        </div>
                    );
                }
            }, dataIndex: "time",align: "center",
            width:70,
            render: (text, record) => {

                if((record.quoteSkew_copy !== undefined || record.quoteSpread_copy !== undefined) && !this.state.isTimeShow ){
                    return (
                        <div style={{ wordWrap: "break-word", wordBreak: "break-all" }}>
                            <div> <Button className="symbolList_btn btn_reset" onClick={(e)=>{ e.stopPropagation();this.reset(record);}}>reset</Button></div>
                            <div> <Button className="symbolList_btn" onClick={(e)=>{ e.stopPropagation();this.apply(record);}}>apply</Button></div>
                        </div>
                    );
                }else{
                    // return <div style={{ wordWrap: "break-word", wordBreak: "break-all" }}>{text}</div>;
                    if (text === 0){
                        return "";
                    }
                    return typeof text === "string" ? text : moment(text/1000).format("HH:mm:ss");
                }
            }
            },
            { title: "Algo/Status", dataIndex: "algo", className: "symbolList_opacity",align: "center",width: 80,
                render:(text,record)=>{
                    return (
                        <div style={{background:"#2d81bd",textAlign:"center",wordWrap: "break-word", wordBreak: "break-all"}}>
                            <span>{text}</span>
                        </div>
                    );
                }
            },
            { title: "Operation", dataIndex: "status", className: "symbolList_opacity",align: "center",width: 68,
                render: (text, record, index) => {
                    return (
                        <div className="symbolList_icon">
                            <img style={{width:15,cursor:"pointer"}} onClick={
                                (e) => {
                                    e.stopPropagation();
                                    this.changeStatus(text,record,index);
                                }
                            } src={operation[text]==="stopped"?sanjiao:operation[text]==="started"?square:""} alt=""/>
                        </div>);
                }
            },
        ];
        let instance_Id = "";
        if(this.props.strategyParam){
            instance_Id = this.props.strategyParam.instanceId;
        }
        // console.log(this.props.data);
        return (
            <Table
                bordered
                style={{minWidth:880}}
                pagination={false}
                className="symbolList_groups"
                columns={column}
                dataSource={this.state.list}
                rowKey={record => record.instanceId}
                onRow={(record) => {
                    return {
                        onClick: (event) => {
                            this.props.clickTr(record);
                        },
                    };
                }}
                rowClassName={(record) => {
                    if (record.instanceId === instance_Id)
                        return "qit-tr-active-head-dark";
                }}
            />

        );
    }
}

const mapStateToProps = state => ({
    symbolListReducer: state.SymbolListReducer,
    socketList: state.stocketReducer,
    strategyParam: state.paramReducer.strategyParam,
    socket_instanceList: state.stocketReducer.socket_instanceList,
    currentStrategy: state.currentStrategyReducer.currentStrategy,
    btnIndex:state.bookHeader.btnIndex,
    minTicks: state.globalReducer.minTicks,
});

const mapDispatchToProps = dispatch => ({
    toStartStrategy: (obj, cb) => dispatch(toStartStrategy(obj, cb)),
    toPauseStrategy: (obj, cb) => dispatch(toPauseStrategy(obj, cb)),
    save_Param: (obj,cb) => dispatch(save_Param(obj,cb)),
    applyOrderBook: (param, cb) => dispatch(applyOrderBook(param, cb)),
    applyInstanceList: (param, cb) => dispatch(applyInstanceList(param, cb)),
    setCurrentStrategy: (data) => dispatch(setCurrentStrategy(data)),
    setApplyBtn: (bool) => dispatch(setApplyBtn(bool)),
    getClickBtnName: (param) => dispatch(getClickBtnName(param)),
});
export default connect(mapStateToProps, mapDispatchToProps)(SymbolList_groups);