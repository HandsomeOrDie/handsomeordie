import { connect } from "react-redux";
import React, { Component } from "react";
import { Table,Icon,Button, message, Card} from "antd";
import SymbolList_groups from "./symbolList_groups";
import {getSymbolList, save_Param, setApplyBtn, stopAllQuote} from "../../actions/symbolList";
import {applyOrderBook, toStartStrategy, toPauseStrategy, } from "../../actions/marketDetail";
import {updateMinTick} from "../../actions/globalAction";
import square from "../../images/square.png";
import sanjiao from "../../images/sanjiao.png";
import {formatStr, getOffset} from "../../utils/commonFun";
import {setCurrentStrategy} from "../../actions/setCurrentStrategy";
import {getClickBtnName} from "../../actions/bookHeader";
import moment from "moment";
// import WebSocketClient from "../../socket/WebSocketClient";
// import {ReferencePriceOutput} from "../../../common/marketApi/index";
// import reqwest from "reqwest";
class SymbolList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            symbolList: {},
            normal_list: [],
            group_list: [],
            group_name: [],
            // operation: {
            //     SUSPENDED: "started",//默认不会出现
            //     STOPPED: "started",
            //     ABNORMAL_STOPPED: "started",
            //     CREATED: "started",
            //     STARTED: "stopped",
            //     RESTARTED: "stopped"
            // }
            operation: {
                SUSPENDED: "stopped",//默认不会出现
                STOPPED: "stopped",
                ABNORMAL_STOPPED: "stopped",
                CREATED: "stopped",
                STARTED: "started",
                RESTARTED: "started"
            }
        };
    }

    componentWillMount(){
        this.props.handleRef(this);
        this.props.getSymbolList((list, normal_list, group_list)=>{
            // console.log("normal_list:", normal_list);
            this.setState({normal_list: normal_list, group_list: group_list});
            this.props.save_Param(list,()=>{
                this.props.setCurrentStrategy(list);
            });
        });
    }

    refreshSymbolList = () => {
        this.props.getSymbolList((list, normal_list, group_list)=>{
            this.setState({normal_list: normal_list, group_list: group_list});
        });
    };
    
    componentWillReceiveProps (nextProps) {
        // console.log(nextProps.symbolListReducer,this.props.symbolListReducer);

        // if(JSON.stringify(nextProps.symbolListReducer) !== JSON.stringify(this.props.symbolListReducer)){
        // let normalProps = nextProps.symbolListReducer.normal_list;
        // let normalState = this.state.normal_list;
        this.setState({
            normal_list: nextProps.symbolListReducer.normal_list,
            group_name: nextProps.symbolListReducer.group_name,
            group_list: nextProps.symbolListReducer.group_list,
        });
        if(JSON.stringify(nextProps.socketList) !== JSON.stringify(this.props.socketList)){
            let data = nextProps.socketList || {};
            // console.log(data);
            const {normal_list, group_list} = this.state;
            if(normal_list && normal_list.length){
                normal_list.map((elem,index) => {
                    if(elem.mktPxConfigId === data.configId){
                        let isNew = false;
                        elem["minTick"] = data.minTick;
                        elem.time = data.generateTime;
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
                        if(elem.marketBidOfferPrices[1] !== data.askPxs[0]){
                            elem["askRedGreen"] = "";
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
                        elem.marketSpread = data.spread;
                        // if(isNew){
                        this.setState({
                            normal_list: normal_list,
                        });
                    }
                });
            }
            if(group_list && group_list.length){
                // console.log(group_list);
                group_list.map((group) => {
                    group.map((elem,index) => {
                        if(elem.mktPxConfigId === data.configId){
                            let isNew = false;
                            elem["minTick"] = data.minTick;
                            elem.time = data.generateTime;
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
                            if(elem.marketBidOfferPrices[1] !== data.askPxs[0]){
                                elem["askRedGreen"] = "";
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

                            // console.log(nextProps.socket_instanceList);

                            elem.marketSpread = data.spread;
                            // if(isNew){
                            this.setState({
                                group_list: group_list,
                            });
                            // }
                        }
                    });
                });
            }
            let currentStrategy = this.props.currentStrategy;
            // console.log("aaa", currentStrategy);
            if (currentStrategy && currentStrategy.mktPxConfigId === data.configId) {
                // console.log("aaa", JSON.parse(JSON.stringify(currentStrategy)));
                currentStrategy.marketBidOfferPrices[0] = data.bidPxs[0];
                currentStrategy.marketBidOfferPrices[1] = data.askPxs[0];
                // console.log("bbb", JSON.parse(JSON.stringify(currentStrategy)));
                this.props.setCurrentStrategy(currentStrategy);
            }
        }  

        if(JSON.stringify(nextProps.socket_instanceList) !== JSON.stringify(this.props.socket_instanceList)){
            this.updateList(nextProps.socket_instanceList);
        }
        // }

    }

    updateList (message){
        const {normal_list} = this.state;
        // console.log(normal_list);
        if(normal_list instanceof Array && normal_list.length){
            normal_list.map((elem,index) => {
                let isNew = false;
                if(elem.mktPxConfigId === message.mktPxConfigId){
                    let old_price = elem.quoteBidOfferPrice + "";
                    let new_price = message.quoteBidOfferPrice + "";
                    if(old_price !== new_price){
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
                        // elem.quoteBidOfferPrice = message.quoteBidOfferPrice;
                    }

                    if(message.quoteSpread && !message.quoteSpread_copy){
                        elem.quoteSpread = message.quoteSpread; isNew = true;
                    }
                    if(message.quoteSkew && !message.quoteSkew){
                        elem.quoteSkew = message.quoteSkew; isNew = true;
                    }
                    if(message.marketSpread){
                        elem.marketSpread = message.marketSpread; isNew = true;
                    }
                    // if(message.time){
                    //     elem.time = message.time.slice(11,19); isNew = true;
                    // }
                    if(message.quota){
                        elem.quota = message.quota; isNew = true;
                    }
                    if(message.pnl){
                        elem.pnl = message.pnl; isNew = true;
                    }
                    if(message.algo){
                        elem.algo = message.algo; isNew = true;
                    }
                    // if(message.minTick){
                    //     elem.minTick = message.minTick; isNew = true;
                    // }
                    // console.log(elem);
                    if(isNew){
                        this.setState({normal_list:normal_list});
                    }
                }
            });
        }
    }
    changeStatus = (text, record, index) => {
        let obj = {instanceId:  record.instanceId};
        const{operation, normal_list} = this.state;
        let tr_record = this.props.strategyParam;
        let status = operation[text];
        // let fun = {
        //     "started": "toPauseStrategy",
        //     "stopped": "toStartStrategy",
        // };
        let fun = {
            "stopped": "toStartStrategy",
            "started": "toPauseStrategy",
        };
        let funName = fun[status];
        this.props[funName](obj, (str) => {
            record.status = str;
            // console.log(this.props.btnIndex.name, record.displayName);
            // if (this.props.btnIndex.index === index ){
            //     this.props.getClickBtnName({...this.props.btnIndex, status:str});
            // }
            this.setState({normal_list}, ()=>{
                if(tr_record.instanceId === record.instanceId){
                    this.props.setCurrentStrategy(record);
                    this.clickTr(record);
                }
            });
        });
    }

    clickTr = (record,apply) => {
        const{ normal_list} = this.state;
        let param = {};
        for(let i in normal_list){
            if(normal_list[i].instanceId === record.instanceId){
                param = normal_list[i];
                // this.props.getClickBtnName({name: record.displayName, index: i, status:record.status});
            }
        }
        if(apply){
            // this.props.setCurrentStrategy(param);
            this.props.save_Param(record,()=>{
                // console.log(record,param);
                this.props.setCurrentStrategy(param);
            });
            return;
        }
        if(this.props.strategyParam.instanceId === record.instanceId){
            return;
        } else {
        // console.log(this.props.strategyParam.instanceId,record.instanceId);
            this.props.save_Param(record,()=>{
            // console.log(record,param);
                this.props.setCurrentStrategy(param);
            });
        }
    }

    formatNum = (f, digit) => {
        var m = Math.pow(10, digit);
        return parseInt(f * m, 10) / m;
    }

    clickUp = (param,record) => {
        let num = typeof(record[param+"_copy"]) === "number" ?  record[param+"_copy"] + 1 :  record[param] + 1;
        // console.log(record);
        record[param+"_copy"] = this.formatNum(num + 0.000001, 1);
        // record[param] = record[param+"_copy"];
        const{ normal_list} = this.state;

        this.setState({normal_list});
        // console.log(normal_list);
    }
    clickDown = (param,record) => {
        // console.log(record[param+"_copy"]);
        let num = typeof(record[param+"_copy"]) === "number" ?  record[param+"_copy"] - 1 :  record[param] - 1;
        // let num =  ( || ]) - 1;
        // if(num > 0 || num === 0){
        record[param+"_copy"] = num < 0 ? 0 : this.formatNum(num + 0.000001, 1);
        // record[param] = record[param+"_copy"];
        const{ normal_list} = this.state;
        this.setState({normal_list});
        // }
    }
   
    reset = (record) => {
        record.quoteSpread_copy = undefined;//清0
        record.quoteSkew_copy = undefined;
        const{ normal_list} = this.state;
        this.setState({normal_list});
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
                this.props.getSymbolList((list, normal_list, group_list)=>{
                    // console.log("group_list:", group_list);
                    this.setState({normal_list: normal_list, group_list: group_list});
                });
                record.quoteSpread = record.quoteSpread_copy || record.quoteSpread;
                record.quoteSkew = record.quoteSkew_copy || record.quoteSkew;
                record.quoteSpread_copy = undefined;//清0
                record.quoteSkew_copy = undefined;
                // const{ list} = this.state;
                // this.setState({list});
                // console.log(1);
                let tr_record = this.props.strategyParam;
                if(tr_record.instanceId === record.instanceId){
                    // console.log(record);
                    this.clickTr(record,1);
                }
                message.success("Success!", 2);
            }else{
                // console.log(2);
                this.reset(record);
                message.error("Strategy status abnormal!");
            } 
        });
        this.props.setApplyBtn(true);
    }

    // shouldComponentUpdate(nextProps,nextState){
    //     if(JSON.stringify(nextProps.symbolListReducer) === JSON.stringify(this.props.symbolListReducer)){
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
        const{normal_list,group_name,group_list, operation} = this.state;
        // console.log(group_list);
        const columns = [
            { title: "Symbol", dataIndex: "displayName", align: "left",width:108,
                render: (text, record) => (
                    <div style={{ wordWrap: "break-word", wordBreak: "break-all",paddingLeft:5 }}>
                        <span className="activeHead"></span>
                        {text}
                    </div>
                )
            },
            { title: "Reference", dataIndex: "marketBidOfferPrices", align: "center",
                render: (text, record) => {
                    let text1 = formatStr(text[0])+"";
                    let text2 = formatStr(text[1])+"";
                    // console.log(text1,typeof(text1));
                    return (
                        <div style={{ wordWrap: "break-word", wordBreak: "break-all" }}>
                            {/* <span className="symbolList_color_red"> */}
                            <span style={{position:"relative"}} className={record.bidRedGreen=="red"?"redLight":record.bidRedGreen=="green"?"greenLight":""}>
                                <span style={{display:"inline-block",textAlign:"right"}}>{text1?text1.substr(0,4):""} </span>
                                <span style={{padding:"0 5px 0 5px"}} className="symbolList_font_size">{text1?text1.substr(4,2):""}</span>
                                <span style={{verticalAlign:"top",position:"absolute"}}>{text1.substr(6,1)?text1.substr(6,2):record.minTick===0.00001||record.minTick===0.001?"0":""}</span>
                            </span>
                            <span className="symbolList_font_size"  style={{display:"inline-block",width:15,marginLeft:5}}> / </span>
                            {/* <span className="symbolList_color_green"> */}
                            <span style={{position:"relative"}} className={record.askRedGreen=="red"?"redLight":record.askRedGreen=="green"?"greenLight":""}>
                                <span style={{padding:"0 5px 0 5px"}} className="symbolList_font_size">{text2?text2.substr(4,2):""}</span>
                                <span style={{verticalAlign:"top",position:"absolute"}}>{text2.substr(6,1)?text2.substr(6,2):record.minTick===0.00001||record.minTick===0.001?"0":""} </span>
                                <span>{text2 && text2.indexOf(".")===3?text2.substr(0,4):text2.substr(0,4)}</span>
                            </span>
                        </div>
                    );
                }
            },
            // { title: "Mkt Sprd", dataIndex: "marketSpread",align: "center",width:60,
            //     render: (text, record) => (
            //         <div style={{ wordWrap: "break-word", wordBreak: "break-all" }}>
            //             {text}
            //         </div>
            //     )
            // },
            { title: "Quote", dataIndex: "quoteBidOfferPrice",align: "center",
                render: (text, record) => {
                    text = record.status === "STARTED" ? text : [0, 0];
                    let text1 = formatStr(text[0])+"";
                    let text2 = formatStr(text[1])+"";
                    return (
                        <div style={{ wordWrap: "break-word", wordBreak: "break-all" }}>
                            {/* <span className="symbolList_color_red"> */}
                            <span style={{position:"relative"}} className={record.quoteBidRedGreen=="red"?"redLight":record.quoteBidRedGreen=="green"?"greenLight":""}>
                                <span style={{display:"inline-block",textAlign:"right"}}>{text1?text1.substr(0,4):""} </span>
                                <span style={{padding:"0 5px 0 5px"}} className="symbolList_font_size">{text1?text1.substr(4,2):""}</span>
                                <span style={{verticalAlign:"top",position:"absolute"}}>{text1.substr(6,1)?text1.substr(6,2):record.minTick===0.00001||record.minTick===0.001?"0":""}</span>
                            </span>
                            <span className="symbolList_font_size"  style={{display:"inline-block",width:15,marginLeft:5}}> / </span>
                            {/* <span className="symbolList_color_green"> */}
                            <span style={{position:"relative"}} className={record.quoteAskRedGreen=="red"?"redLight":record.quoteAskRedGreen=="green"?"greenLight":""}>
                                <span style={{padding:"0 5px 0 5px"}} className="symbolList_font_size">{text2?text2.substr(4,2):""}</span>
                                <span style={{verticalAlign:"top",position:"absolute"}}>{text2.substr(6,1)?text2.substr(6,2):record.minTick===0.00001||record.minTick===0.001?"0":""} </span>
                                <span>{text2 && text2.indexOf(".")===3?text2.substr(0,4):text2.substr(0,4)}</span>
                            </span>
                        </div>
                    );
                }
            },
            { //title: "Sprd",
                title: (record)=>{
                    return (
                        <div style={{ wordWrap: "break-word", wordBreak: "break-all" }} className="symbolList_caret_up" style={{margin:"0 auto"}}>Sprd</div> 
                    );
                },align: "center",
                dataIndex: "quoteSpread",
                width: 80,
                render: (text, record, index) => {
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
                                <div className="symbolList_up_down"><Icon type="up" onClick={()=>{this.clickUp("quoteSpread",record);}}/></div>
                                <div className="symbolList_up_down"><Icon type="down" onClick={()=>{this.clickDown("quoteSpread",record);}}/></div>
                            </div>
                        </div>
                    );
                }
            },
            { //title: "Skew",
                title: (record)=>{
                    return (
                        <div style={{ wordWrap: "break-word", wordBreak: "break-all" }} className="symbolList_caret_up" style={{margin:"0 auto"}}>Skew</div> 
                    );
                } ,  dataIndex: "quoteSkew",align: "center",
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
                                <div className="symbolList_up_down" onClick={()=>{this.clickUp("quoteSkew",record);}}> <Icon type="up"/></div>
                                <div className="symbolList_up_down" onClick={()=>{this.clickDown("quoteSkew",record);}}> <Icon type="down"/></div>
                            </div>
                        </div>
                    );
                }
            },
            { title: "Mkt Sprd", dataIndex: "marketSpread",align: "center",width:70,
                render: (text, record) => (
                    <div style={{ wordWrap: "break-word", wordBreak: "break-all" }}>
                        {text}
                    </div>
                )
            },
            // { title: "Quota", dataIndex: "quota",align: "center",width: 60,
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
            // { title: "TD PnL", dataIndex: "pnl",align: "center",width:60,
            //     render: (text, record) => {
            //         let str =  parseFloat(text).toFixed(1);
            //         return <div style={{ wordWrap: "break-word", wordBreak: "break-all" }}>{str instanceof Number?str:"0.000"}</div>;
            //     }
            // },
            // { title: "Range", dataIndex: "id",align: "center",width: 60,
            //     render:(text,record)=>{
            //         return (
            //             <div style={{background:"#2d81bd",textAlign:"center",height:3,wordWrap: "break-word", wordBreak: "break-all"}}>
            //                 <span style={{height:5,display:"block",width:2,background:"#fff",position:"relative",top:"-1px",marginLeft:"10%"}} className="dot"></span>
            //             </div>
            //         );
            //     }
            // },
            { title: "Time", dataIndex: "time",align: "center",width:70,
                render: (text, record) => {
                    if(typeof(record.quoteSkew_copy) === "number" || typeof(record.quoteSpread_copy) === "number"){
                        return (
                            <div style={{ wordWrap: "break-word", wordBreak: "break-all" }}>
                                <div> <Button className="symbolList_btn btn_reset" onClick={()=>{this.reset(record);}}>reset</Button></div>
                                <div> <Button className="symbolList_btn" onClick={()=>this.apply(record)}>apply</Button></div>
                            </div>
                        );
                    }else{
                        // console.log("text:", text);
                        // console.log("moment:", moment(text).format("HH:mm:ss"));
                        // return <div style={{ wordWrap: "break-word", wordBreak: "break-all" }}>{text}</div>;
                        if (text === 0){
                            return "";
                        }
                        return typeof text === "string" ? text : moment(text/1000).format("HH:mm:ss");
                    }
                    
                }
            },
            { title: "Algo/Status", dataIndex: "algo",align: "center",width: 80,
                render:(text,record)=>{
                    return (
                        <div style={{background:"#2d81bd",textAlign:"center",wordWrap: "break-word", wordBreak: "break-all"}}>
                            <span>{text}</span>
                        </div>
                    );
                }
            },
            { title: "Operation", dataIndex: "status",align: "center",width: 68,
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

        const bodyHeight = document.documentElement.clientHeight - 141;
        // console.log(group_list);
        const showNormal = normal_list instanceof Array && normal_list.length?true:false;
        return (
            <Card id="symbol-list-card" headStyle={{color:"#fff"}} bodyStyle={{ display: "flex", flexDirection: "column", height:bodyHeight}} size="small" style={{marginLeft: 5, marginBottom: 5, marginRight: 5,flex:1,overflowY:"scroll",overflowX:"hidden"}} className="symbolList">

                <Table
                    bordered
                    className="symbolList"
                    style={{minWidth:880}}
                    pagination={false}
                    columns={columns}
                    dataSource={normal_list}
                    rowKey={record => record.instanceId}
                    onRow={(record) => {
                        return {
                            onClick: (event) => {
                                this.clickTr(record);
                            },       // 点击行
                        };
                    }}
                    rowClassName={(record) => {
                        if (record.instanceId === instance_Id)
                            return "qit-tr-active-head-dark";
                    }}
                />
                
                {
                    group_list instanceof Array?group_list.map((elem,i)=>{
                        return <SymbolList_groups
                            clickTr = {(record)=>{this.clickTr(record);}}
                            key={i}
                            data = {elem}
                            operation = {operation}
                            name = {group_name[i]}/>;
                    }):null
                }
            </Card>
        );
    }
}

const mapStateToProps = state => ({
    symbolListReducer: state.SymbolListReducer,
    strategyParam: state.paramReducer.strategyParam,
    socketList: state.stocketReducer.socketList,
    socket_instanceList: state.stocketReducer.socket_instanceList,
    currentStrategy: state.currentStrategyReducer.currentStrategy,
    btnIndex:state.bookHeader.btnIndex,
    minTicks: state.globalReducer.minTicks,
});

const mapDispatchToProps = dispatch => ({
    getSymbolList: (cb) => dispatch(getSymbolList(cb)),
    save_Param: (elem,cb) => dispatch(save_Param(elem,cb)),
    toStartStrategy: (obj, cb) => dispatch(toStartStrategy(obj, cb)),
    toPauseStrategy: (obj, cb) => dispatch(toPauseStrategy(obj, cb)),
    applyOrderBook: (param, cb) => dispatch(applyOrderBook(param, cb)),
    setCurrentStrategy: (data) => dispatch(setCurrentStrategy(data)),
    setApplyBtn: (bool) => dispatch(setApplyBtn(bool)),
    getClickBtnName: (param) => dispatch(getClickBtnName(param)),
    stopAllQuote: (params, cb) => dispatch(stopAllQuote(params, cb)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SymbolList);