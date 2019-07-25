import { connect } from "react-redux";
import React, { Component } from "react";
import { Button ,Row,Col, message} from "antd";
import {applyOrderBook,toStartStrategy,toPauseStrategy,toHaltStrategy} from "../../../actions/marketDetail";
import {getSymbolList} from "../../../actions/symbolList";
import {setCurrentStrategy} from "../../../actions/setCurrentStrategy";
import {getOffset} from "../../../utils/commonFun";
class ButtonBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStrategy:{},
            currentBtnStatus:{}
        };
        
    }
    componentWillReceiveProps(nextProps){
        // if(nextProps.currentStrategy!= this.props.currentStrategy){
        //     this.setState({
        //         currentStrategy:nextProps.currentStrategy
        //     });
        // }
        // if(nextProps.btnIndex!=this.props.btnIndex){
        //     this.setState({currentBtnStatus:nextProps.btnIndex});
        // }
    }
    getSpread = (spread, minTick) => {
        let displayQty = 10000;
        let currentStrategy = this.props.currentStrategy.currentStrategy;
        if (currentStrategy) {
            const symbol = currentStrategy.symbol;
            if (symbol === "USDJPY" || symbol === "EURJPY" || symbol.indexOf(".") !== -1) {
                displayQty = 100;
            }
            const offset = getOffset(minTick);
            return offset / displayQty * spread;
        }
    }
    getSkew = (skew, minTick) => {
        let displayQty = 10000;
        let currentStrategy = this.props.currentStrategy.currentStrategy;
        if (currentStrategy) {
            const symbol = currentStrategy.symbol;
            if (symbol === "USDJPY" || symbol === "EURJPY" || symbol.indexOf(".") !== -1) {
                displayQty = 100;
            }
            const offset = getOffset(minTick);
            return offset / displayQty * skew;
        }
    }
    handlerApply =()=>{
        // console.log(this.props.minTicks);
        // return;
        let {currentStrategy,isFixed} =this.props.currentStrategy;
        let minTick = currentStrategy && this.props.minTicks[currentStrategy.mktPxConfigId];
        if (!minTick){
            message.error("Unable to get minTick!", 2);
            return;
        }

        const {btnIndex,paramList} =this.props;
        const ajustState = this.props.ajustBook.state;
        currentStrategy = {...currentStrategy};
        currentStrategy.quoteSpread = this.getSpread(typeof ajustState.spread === "undefined" ? currentStrategy.quoteSpread : ajustState.spread, minTick);
        currentStrategy.quoteSkew = this.getSpread(typeof ajustState.skew === "undefined" ? currentStrategy.quoteSkew : ajustState.skew, minTick);
        currentStrategy.quoteOfferPrice = ajustState.quoteOfferPrice;
        currentStrategy.quoteBidPrice = ajustState.quoteBidPrice;
        let tmpObj={};
        if(btnIndex.name=="Manual"){
            tmpObj={...paramList[btnIndex.index].config[0]};
            delete tmpObj.askPrice;
            delete tmpObj.bidPrice;
            console.log("1", JSON.stringify(tmpObj));
            tmpObj.askPricesStep = tmpObj.askPricesStep.map(item => {
                return this.getSpread(item, minTick);
            });
            tmpObj.bidPricesStep = tmpObj.bidPricesStep.map(item => {
                return this.getSpread(item, minTick);
            });
            console.log("1", JSON.stringify(tmpObj));
            tmpObj = JSON.stringify(tmpObj).replace(/\[|]|"|}|{/g, "");
            // console.log("temObj: ", tmpObj);
            tmpObj = tmpObj.replace(/,a/g, ";a");
            // console.log("temObj2: ", tmpObj);
            tmpObj = tmpObj.replace(/,b/g, ";b");
            // console.log("temObj3: ", tmpObj);
            tmpObj = tmpObj.replace(/:/g, "=");

            // console.log("tmpObj:", JSON.stringify({...tmpObj}));
            // tmpObj = JSON.stringify(tmpObj).replace(/\[|\]/g, "");
            // console.log("tmpObj:", JSON.stringify({...tmpObj}));
            // tmpObj = JSON.stringify(tmpObj).replace(/"/g, "");
            // console.log("tmpObj:", JSON.stringify({...tmpObj}));
            // tmpObj = JSON.stringify(tmpObj).replace(/,a/g, ";a");
            // console.log("tmpObj:", JSON.stringify({...tmpObj}));
            // tmpObj = JSON.stringify(tmpObj).replace(/,b/g, ";b");
            // console.log("tmpObj:", JSON.stringify({...tmpObj}));
            // tmpObj = JSON.stringify(tmpObj).replace(/'/g, "");
            // console.log("tmpObj:", JSON.stringify({...tmpObj}));
            // tmpObj = JSON.stringify(tmpObj).replace(/\\/g, "");
            // console.log("tmpObj:", tmpObj);
        }else{
            const inputInfo = this.props.inputInfo;
            console.log("inputInfo[btnIndex.name]:", inputInfo[btnIndex.name]);
            tmpObj = {...inputInfo[btnIndex.name]};
            // paramList[btnIndex.index].config.map((item,idx)=>{
            //     tmpObj[item.name] =item.value;
            // });

            // console.log(tmpObj);
            tmpObj = JSON.stringify(tmpObj).replace(/\[|]|"|}|{/g, "");
            tmpObj = tmpObj.replace(/,/g, ";");
            tmpObj = tmpObj.replace(/:/g, "=");
            // console.log(tmpObj);

        }
        // console.log(currentStrategy);
        let param ={
            strategyScriptName:btnIndex.name,
            instanceId:currentStrategy.instanceId,
            quoteSpread:currentStrategy.quoteSpread,
            quoteSkew:currentStrategy.quoteSkew,
            // strategyScriptParams:currentStrategy.strategyScriptParams,
            strategyScriptParams:tmpObj,
            // quoteSpreadFixed: isFixed
            quoteSpreadFixed: this.props.ajustBook.state.isFixed
        };
        this.props.applyOrderBook({input:JSON.stringify(param)},(result)=>{
            if (result === "success"){
                message.success("Success!", 2);
                this.props.symbolList.refreshSymbolList();
            } else {
                message.error(result, 2);
            }
        });
    }
    startStrategy =(e)=>{
        // console.log(e.currentTarget.innerText);
        const currentBtnStatus= this.props.btnIndex;
        const currentStrategy =this.props.currentStrategy.currentStrategy;
        // if(currentStrategy.status =="STARTED"){
        //     message.error(`${currentStrategy.algo}正在启动，`);
        //     return ;
        // }
        // const thiz = this;
        if(e.currentTarget.innerText=="START"){
            this.props.toStartStrategy({ instanceId:currentStrategy.instanceId},(status, success)=>{
                // this.props.getSymbolList();
                if (success) {
                    message.success("Success!", 2);
                    currentBtnStatus.status = status;
                    this.setState({currentBtnStatus});
                    this.props.setCurrentStrategy({...currentStrategy, status});
                    // this.props.getSymbolList(()=>{});
                    let normal_list = this.props.symbolList.state.normal_list;
                    let group_list = this.props.symbolList.state.group_list;
                    if (currentStrategy.groupId) {
                        group_list.map(group => {
                            group.map(item => {
                                if (item.instanceId === currentStrategy.instanceId) {
                                    item.status = status;
                                }
                            });
                        });
                        this.props.symbolList.setState({group_list: group_list});
                    } else {
                        normal_list.map(item => {
                            if (item.instanceId === currentStrategy.instanceId) {
                                item.status = status;
                            }
                        });
                        this.props.symbolList.setState({normal_list: normal_list});
                    }
                }else {
                    message.error("Failed!", 2);
                }
            });
        }else{
            this.props.toPauseStrategy({ instanceId:currentStrategy.instanceId},(status, success)=>{
                if (success) {
                    message.success("Success!", 2);
                    currentBtnStatus.status = status;
                    this.setState({currentBtnStatus});
                    this.props.setCurrentStrategy({...currentStrategy, status});
                    let normal_list = this.props.symbolList.state.normal_list;
                    let group_list = this.props.symbolList.state.group_list;
                    if (currentStrategy.groupId) {
                        group_list.map(group => {
                            group.map(item => {
                                if (item.instanceId === currentStrategy.instanceId) {
                                    // item.quoteBidOfferPrice = [0, 0];
                                    item.status = status;
                                }
                            });
                        });
                        this.props.symbolList.setState({group_list: group_list});
                    } else {
                        normal_list.map(item => {
                            if (item.instanceId === currentStrategy.instanceId) {
                                // item.quoteBidOfferPrice = [0, 0];
                                item.status = status;
                            }
                        });
                        this.props.symbolList.setState({normal_list: normal_list});
                    }
                }else {
                    message.error("Failed!", 2);
                }
            });
        }
        
    }
    haltStrategy=() =>{
        // const {currentStrategy}= this.state;
        const currentBtnStatus= this.props.btnIndex;
        const currentStrategy =this.props.currentStrategy.currentStrategy;
        this.props.toHaltStrategy({ instanceId:currentStrategy.instanceId},(status)=>{
            console.log("status", status);
            currentBtnStatus.status=status;
            this.setState({currentBtnStatus:currentBtnStatus});
            this.props.getSymbolList(()=>{});
        });
    }
    renderBtn=(btnIndex) =>{
        if(btnIndex.status =="CREATED"||btnIndex.status =="STARTED"){
            return "btn-start";
        }else{
            return "btn-stop";
        }
    }
    renderHaltBtn =(btnIndex) =>{
        if(btnIndex.status=="SUSPENDED" ||btnIndex.status =="ABNORMAL_STOPPED"){
            return "";
            // return "btn-halt-nonomal";
        }else{
            return "";
        }
    }
    render() {
        const currentStrategy = this.props.currentStrategy.currentStrategy || {};
        // console.log("currentStrategy..", currentStrategy);
        // const {btnIndex} =this.props;
        return (
            <Row className="order-book-button" >
                <Col span={3}></Col>
                <Col span={6}><Button size="small" className={this.renderBtn(currentStrategy)} onClick={this.startStrategy}>{currentStrategy.status=="STARTED"?"STOP":"START"}</Button></Col>
                {/* <Col span={6}><Button size="small" className={this.renderHaltBtn(currentStrategy)} onClick={this.haltStrategy} style={currentStrategy.status === "SUSPENDED" ? {backgroundColor: "#ffcc33", color: "white",opacity: 1} : {display: "inline"}} disabled={currentStrategy.status=="STARTED"? false:true}>HALT</Button></Col> */}
                <Col span={6}></Col>
                <Col span={6}><Button size="small"  onClick={this.handlerApply}>APPLY</Button></Col>
                <Col span={3}></Col>
            </Row>


        );
    }
}

const mapStateToProps = state => ({
    // allParams: state.setAllParamsReducer
    btnName:state.bookHeader.btnName,
    paramList:state.bookHeader.paramList,
    btnIndex:state.bookHeader.btnIndex,
    currentStrategy: state.currentStrategyReducer,
    inputInfo:state.bookHeader.inputInfo,
    minTicks: state.globalReducer.minTicks,
});

const mapDispatchToProps = dispatch => ({
    applyOrderBook: (param, cb) => dispatch(applyOrderBook(param, cb)),
    toStartStrategy: (param,cb) => dispatch(toStartStrategy(param,cb)),
    toPauseStrategy: (param,cb) => dispatch(toPauseStrategy(param,cb)),
    toHaltStrategy: (param,cb) => dispatch(toHaltStrategy(param,cb)),
    getSymbolList: (cb) => dispatch(getSymbolList(cb)),
    setCurrentStrategy: (data) => dispatch(setCurrentStrategy(data)),

    
});
export default connect(mapStateToProps, mapDispatchToProps)(ButtonBook);