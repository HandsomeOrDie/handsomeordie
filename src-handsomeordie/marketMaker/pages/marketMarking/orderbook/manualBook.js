import { connect } from "react-redux";
import React, { Component } from "react";
import { Row, Col, Button, InputNumber, Modal ,Radio} from "antd";
import {formatNumber, formatStr,sumNumber} from "../../../utils/commonFun";
import {getParamList, setInputInfo} from "../../../actions/bookHeader";
import { getPixs, getOffset } from "../../../utils/commonFun";
import { number } from "prop-types";

class ManualBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStrategy:{},
            visible: false,
            fillVisible:false ,

            isEnabled:true,
            layersNumber:0,
            askQuantities:[],
            bidQuantities:[],
            avgBidSpread:undefined,
            avgAskSpread:undefined,

            stragetyList:[]
        };
        
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.currentStrategy!= this.props.currentStrategy){
            // 参数列表  
            const {stragetyList} =this.state;
            if(!nextProps.currentStrategy.algo!=="Manual"){
                for (var item in nextProps.currentStrategy.strategyScriptParams) {
                    stragetyList.push({ name: item, value: nextProps.currentStrategy.strategyScriptParams[item][0] });
                }
                this.setState({
                    currentStrategy:nextProps.currentStrategy,
                    stragetyList
                });
            }

            let paramList = this.props.paramList;
            // console.log("paramList:", paramList);
            let paramsMap = nextProps.strategyParam.strategyScriptParamsMap;
            // console.log("paramsMap", paramsMap);
            let flag = false;
            // console.log("paramsMap:", paramsMap);
            // console.log("paramsList:", paramList);
            paramList.map(item => {
                if (item.algo === "Manual" && paramsMap){
                    flag = true;
                    item.config = [];
                    item.config[0] = paramsMap.Manual;
                }
            });
            flag && this.props.getParamList([...paramList]);
        }

    }
    adjustBidStep=(e,index)=>{
        // const currentStrategy =this.props.currentStrategy.currentStrategy;
        // const minTick = this.props.minTicks[currentStrategy.mktPxConfigId];
        // currentStrategy.strategyScriptParams.bidPricesStep[index] = e? e :0;
        // for(var i =index;i<currentStrategy.strategyScriptParams.bidPricesStep.length;i++){
        //     currentStrategy.strategyScriptParams.bidPrice[i] = (currentStrategy.quoteBidPrice * getOffset(minTick)- sumNumber(currentStrategy.strategyScriptParams.bidPricesStep,i))/getOffset(minTick);
        // }
        // 把变化的值存到redux
        // this.props.changeBidAsk(currentStrategy);
        const currentStrategy =this.props.currentStrategy.currentStrategy;
        const minTick = this.props.minTicks[currentStrategy.mktPxConfigId];
        const {btnIndex,paramList} =this.props;
        paramList[btnIndex.index].config[0].bidPricesStep[index] = e ? e :0;
        // for(let i=index; i<paramList[btnIndex.index].config[0].bidPricesStep.length; i++){
        //     paramList[btnIndex.index].config[0].bidPrice = [];
        //     let stepAll = sumNumber(paramList[btnIndex.index].config[0].bidPricesStep,i);
        //     stepAll = this.getStepAll(stepAll, minTick, 10000);
        //     const price = (currentStrategy.quoteBidPrice * getOffset(minTick) - stepAll)/getOffset(minTick);
        //     paramList[btnIndex.index].config[0].bidPrice[i] = price;
        // }
        console.log(paramList);
        this.props.getParamList([...paramList]);
    }

    getStepAll = (stepAll, minTick) => {
        let displayQty = 10000;
        let currentStrategy = this.props.currentStrategy.currentStrategy;
        if (currentStrategy) {
            const symbol = currentStrategy.symbol;
            if (symbol === "USDJPY" || symbol === "EURJPY" || symbol.indexOf(".") !== -1) {
                displayQty = 100;
            }
            const offset = getOffset(minTick);
            return offset / displayQty * stepAll;
        }
    }
    adjustAskStep =(e,index) =>{
        // const currentStrategy =this.props.currentStrategy.currentStrategy;
        // const minTick = this.props.minTicks[currentStrategy.mktPxConfigId];
        // currentStrategy.strategyScriptParams.askPricesStep[index] = e ? e :0;
        // for(var i =index;i<currentStrategy.strategyScriptParams.bidPricesStep.length;i++){
        //     currentStrategy.strategyScriptParams.askPrice[i] = (currentStrategy.quoteOfferPrice * getOffset(minTick) + sumNumber(currentStrategy.strategyScriptParams.askPricesStep,i))/getOffset(minTick);
        // }
        // this.props.changeBidAsk(currentStrategy);

        const currentStrategy =this.props.currentStrategy.currentStrategy;
        const minTick = this.props.minTicks[currentStrategy.mktPxConfigId];
        const {btnIndex,paramList} =this.props;
        paramList[btnIndex.index].config[0].askPricesStep[index] = e ? e :0;
        for(let i =index;i<paramList[btnIndex.index].config[0].bidPricesStep.length;i++){
            paramList[btnIndex.index].config[0].askPrice = [];
            paramList[btnIndex.index].config[0].askPrice[i] = (currentStrategy.quoteOfferPrice * getOffset(minTick) + sumNumber(paramList[btnIndex.index].config[0].askPricesStep,i))/getOffset(minTick);
        }
        this.props.changeBidAsk(currentStrategy);
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    showFillModal = () => {
        this.setState({
            fillVisible: true,
        });
    }
    
      handleOk = (e) => {
          const {isEnabled,bidQuantities,askQuantities}  =this.state;
          const currentStrategy =this.props.currentStrategy.currentStrategy;
          const {btnIndex,paramList} =this.props;   
          if(isEnabled){
              //   currentStrategy.strategyScriptParams.bidQuantities=[1,3,5,10,15];
              //   currentStrategy.strategyScriptParams.askQuantities=[1,3,5,10,15];
              paramList[btnIndex.index].config[0].bidQuantities=["1M","3M","5M","10M","15M"];
              paramList[btnIndex.index].config[0].askQuantities=["1M","3M","5M","10M","15M"];
          }else{
              //   currentStrategy.strategyScriptParams.bidQuantities=bidQuantities;
              //   currentStrategy.strategyScriptParams.askQuantities=askQuantities;
              paramList[btnIndex.index].config[0].bidQuantities=bidQuantities;
              paramList[btnIndex.index].config[0].askQuantities=askQuantities;
          }
          for(var i =0;i<bidQuantities.length;i++){
              //   currentStrategy.strategyScriptParams.bidPrice[i] = (formatNumber(currentStrategy.quoteBidPrice )- sumNumber(currentStrategy.strategyScriptParams.bidPricesStep,i))/10000;
              //   currentStrategy.strategyScriptParams.askPrice[i] = (formatNumber(currentStrategy.quoteOfferPrice )+ sumNumber(currentStrategy.strategyScriptParams.askPricesStep,i))/10000;
              console.log("paramsList:", paramList);
              if (!paramList[btnIndex.index].config[0].bidPrice){
                  paramList[btnIndex.index].config[0].bidPrice = [];
              }
              if (!paramList[btnIndex.index].config[0].askPrice){
                  paramList[btnIndex.index].config[0].askPrice = [];
              }
              paramList[btnIndex.index].config[0].bidPrice[i] =(formatNumber(currentStrategy.quoteBidPrice )- sumNumber(paramList[btnIndex.index].config[0].bidPricesStep,i))/10000;
              paramList[btnIndex.index].config[0].askPrice[i] =(formatNumber(currentStrategy.quoteOfferPrice )- sumNumber(paramList[btnIndex.index].config[0].askPricesStep,i))/10000;
          }
          this.setState({
              visible: false,
          });
          //   this.props.changeBidAsk(currentStrategy);
          this.props.getParamList(paramList);
      }
    
      handleCancel = (e) => {
          //   console.log(e);
          this.setState({
              visible: false,
          });
      }
      handleFillOk = (e) => {
          const {avgAskSpread,avgBidSpread,bidQuantities} =this.state;
          const currentStrategy =this.props.currentStrategy.currentStrategy;
          const {btnIndex,paramList} =this.props;   
          if(avgAskSpread || avgBidSpread){
              //   currentStrategy.strategyScriptParams.bidPricesStep.map((item,idx)=>{
              //       idx==0?currentStrategy.strategyScriptParams.bidPricesStep[0]=0:currentStrategy.strategyScriptParams.bidPricesStep[idx]=avgBidSpread;
              //       idx==0?currentStrategy.strategyScriptParams.askPricesStep[0]=0: currentStrategy.strategyScriptParams.askPricesStep[idx] =avgAskSpread;
              //   });
              paramList[btnIndex.index].config[0].bidQuantities.map((item,idx)=>{
                  idx==0?paramList[btnIndex.index].config[0].bidPricesStep[0]=0:paramList[btnIndex.index].config[0].bidPricesStep[idx]=avgBidSpread;
                  idx==0?paramList[btnIndex.index].config[0].askPricesStep[0]=0: paramList[btnIndex.index].config[0].askPricesStep[idx] =avgAskSpread;
              });
          }
          for(var i =0;i<bidQuantities.length;i++){
              //   currentStrategy.strategyScriptParams.bidPrice[i] = (formatNumber(currentStrategy.quoteBidPrice )- sumNumber(currentStrategy.strategyScriptParams.bidPricesStep,i))/10000;
              //   currentStrategy.strategyScriptParams.askPrice[i] = (formatNumber(currentStrategy.quoteOfferPrice )+ sumNumber(currentStrategy.strategyScriptParams.askPricesStep,i))/10000;
              paramList[btnIndex.index].config[0].bidPrice[i] = (formatNumber(currentStrategy.quoteBidPrice )- sumNumber(paramList[btnIndex.index].config[0].bidPricesStep,i))/10000;
              paramList[btnIndex.index].config[0].askPrice[i] = (formatNumber(currentStrategy.quoteOfferPrice )+ sumNumber(paramList[btnIndex.index].config[0].askPricesStep,i))/10000;
          }
          this.setState({
              fillVisible: false,
          });
          paramList[btnIndex.index].mktPxConfigId = currentStrategy.mktPxConfigId;
          //   this.props.changeBidAsk(currentStrategy);
          this.props.getParamList(paramList);
      }
    
      handleFillCancel = (e) => {
          //   console.log(e);
          this.setState({
              fillVisible: false,
          });
      }

      // layermodal 
      onEnabled =()=>{
          this.setState({isEnabled:!this.state.isEnabled});  
      }
    changeLayersNumber=(e)=>{
        // console.log(e);
        // const {askQuantities ,bidQuantities} =this.state;
        let askQuantities=[],bidQuantities=[];
        for(var i =0; i<e;i++){
            bidQuantities.push(undefined);
            askQuantities.push(undefined);
        }
        this.setState({layersNumber:e,askQuantities,bidQuantities});
    }
    changeBidQty =(e,index) =>{
        const {bidQuantities}  =this.state;
        bidQuantities[index] =e;
        this.setState({bidQuantities});
    }
    changeAskQty =(e,index) =>{
        const {askQuantities} =this.state;
        askQuantities[index] =e;
        this.setState({askQuantities});
    }

    //fillmodal 
    changeAvgBidSpread =(e) =>{
        this.setState({avgBidSpread:e});
    }
    changeAvgAskSpread =(e)=>{
        this.setState({avgAskSpread:e});
    }

    getFormatValue = (value) => {
        const currentStrategy =this.props.currentStrategy.currentStrategy;
        if (currentStrategy) {
            const minTick = this.props.minTicks[currentStrategy.mktPxConfigId];
            if (!minTick) {
                return "";
            }
            const offset = getOffset(minTick);
            let temp = Math.round((value * offset) + minTick / 10) / offset;
            return temp.toFixed(getPixs(minTick));
        }
    }
    render() {
        const {isEnabled, layersNumber,askQuantities,bidQuantities,avgAskSpread,avgBidSpread,stragetyList} =this.state;
        const {btnName,paramList,btnIndex} =this.props;
        // console.log("0.0.0.0.0",this.props.currentStrategy.currentStrategy);
        // console.log("%c@@@@@@@test","color:green",paramList[btnIndex.index].config);
        const currentStrategy =this.props.currentStrategy.currentStrategy;
        const minTick = currentStrategy && this.props.minTicks[currentStrategy.mktPxConfigId];

        const quoteBidPrice = this.props.orderBook.quoteBidPrice || (currentStrategy && currentStrategy.quoteBidPrice) || 0;
        const quoteOfferPrice = this.props.orderBook.quoteOfferPrice || (currentStrategy && currentStrategy.quoteOfferPrice) || 0;
        let temp;
        let tempB;
        // console.log(paramList);
        return (
            <div>

                {btnIndex&&paramList&&btnIndex.name=="Manual" && paramList[btnIndex.index].config?
                    <div >
                        <div className="layers-fill">
                            <Button style={{width:"60px"}} onClick={this.showModal} size="small">LAYERS</Button>
                            <Button style={{width:"60px"}} size="small" onClick={this.showFillModal}>FILL</Button>
                        </div>
                        <div className="manual-book">
                            {paramList[btnIndex.index].config[0].bidQuantities && paramList[btnIndex.index].config[0].bidQuantities.map((item,index)=>{
                                {/* console.log("111", paramList[btnIndex.index].config[0]); */}
                                if (index === 0){
                                    // temp = paramList[btnIndex.index].config[0].bidPrice[index];
                                    // tempB = parseFloat(paramList[btnIndex.index].config[0].askPrice[index]);
                                    temp = quoteBidPrice;
                                    tempB = quoteOfferPrice;
                                    return (<div key={index} className="manual-book-price">
                                        {/* <div className="manual-book-price-item-bid"><span>{item}</span><span>{formatStr(Number(formatNumber(currentStrategy.quoteBidPrice)+sumNumber(currentStrategy.strategyUserParams.bidPricesStep,index))/10000)}</span></div> */}
                                        <div className="manual-book-price-item-bid">
                                            <span>{typeof(item)=="string" && item!=="" && item.indexOf("M") != -1 ? item : parseInt(item)>=1000000?`${parseInt(item) / 1000000}M`:parseInt(item)}</span>
                                            <span>{currentStrategy && currentStrategy.status === "STARTED" && this.getFormatValue(temp)}</span>
                                        </div>
                                        <div className="manual-book-price-item-bid-input"><InputNumber step={1} min={1} formatter={value => Math.round(value)} disabled={index==0? true :false} value={0} onChange={(e)=>this.adjustBidStep(e,index)} size="small"/></div>
                                        <div className="manual-book-price-item-ask-input"><InputNumber step={1} min={1} formatter={value => Math.round(value)} disabled={index==0? true :false} value={0} onChange={(e)=>this.adjustAskStep(e,index)} size="small"/></div>
                                        {/* <div className="manual-book-price-item-ask"><span>{formatStr(Number(formatNumber(currentStrategy.quoteOfferPrice)+sumNumber(currentStrategy.strategyUserParams.askPricesStep,index))/10000)}</span><span>{currentStrategy.strategyUserParams.askQuantities[index]}</span></div> */}
                                        <div className="manual-book-price-item-ask">
                                            <span>{currentStrategy && currentStrategy.status === "STARTED" && this.getFormatValue(tempB)}</span>
                                            <span>{paramList[btnIndex.index].config[0].askQuantities[index][paramList[btnIndex.index].config[0].askQuantities[index].length-1]==="M"?paramList[btnIndex.index].config[0].askQuantities[index]:parseInt(paramList[btnIndex.index].config[0].askQuantities[index])>=1000000?`${parseInt(paramList[btnIndex.index].config[0].askQuantities[index]) / 1000000}M`:parseInt(paramList[btnIndex.index].config[0].askQuantities[index])}</span>
                                        </div>
                                    </div>);
                                } else {
                                    const domA = (<div key={index} className="manual-book-price">
                                        {/* <div className="manual-book-price-item-bid"><span>{item}</span><span>{formatStr(Number(formatNumber(currentStrategy.quoteBidPrice)+sumNumber(currentStrategy.strategyUserParams.bidPricesStep,index))/10000)}</span></div> */}
                                        <div className="manual-book-price-item-bid">
                                            <span>{typeof(item)=="string" && item!=="" && item.indexOf("M") != -1 ? item : parseInt(item)>=1000000?`${parseInt(item) / 1000000}M`:parseInt(item)}</span>
                                            <span>{currentStrategy && currentStrategy.status === "STARTED" && this.getFormatValue(temp - (this.getStepAll(paramList[btnIndex.index].config[0].bidPricesStep[index], minTick, 10000) || 0) * minTick)}</span>
                                        </div>
                                        <div className="manual-book-price-item-bid-input"><InputNumber step={1} min={0} disabled={index==0? true :false} value={paramList[btnIndex.index].config[0].bidPricesStep[index]} onChange={(e)=>this.adjustBidStep(e,index)} size="small"/></div>
                                        <div className="manual-book-price-item-ask-input"><InputNumber step={1} min={0} disabled={index==0? true :false} value={paramList[btnIndex.index].config[0].askPricesStep[index]} onChange={(e)=>this.adjustAskStep(e,index)} size="small"/></div>
                                        {/* <div className="manual-book-price-item-ask"><span>{formatStr(Number(formatNumber(currentStrategy.quoteOfferPrice)+sumNumber(currentStrategy.strategyUserParams.askPricesStep,index))/10000)}</span><span>{currentStrategy.strategyUserParams.askQuantities[index]}</span></div> */}
                                        <div className="manual-book-price-item-ask">
                                            <span>{currentStrategy && currentStrategy.status === "STARTED" && this.getFormatValue(tempB + (this.getStepAll(paramList[btnIndex.index].config[0].askPricesStep[index], minTick, 10000) || 0) * minTick)}</span>
                                            <span>{paramList[btnIndex.index].config[0].askQuantities[index][paramList[btnIndex.index].config[0].askQuantities[index].length-1]==="M"?paramList[btnIndex.index].config[0].askQuantities[index]:parseInt(paramList[btnIndex.index].config[0].askQuantities[index])>=1000000?`${parseInt(paramList[btnIndex.index].config[0].askQuantities[index]) / 1000000}M`:parseInt(paramList[btnIndex.index].config[0].askQuantities[index])}</span>
                                        </div>
                                    </div>);
                                    temp = temp - (this.getStepAll(paramList[btnIndex.index].config[0].bidPricesStep[index], minTick, 10000) || 0) * minTick;
                                    tempB = tempB + (this.getStepAll(paramList[btnIndex.index].config[0].askPricesStep[index], minTick, 10000) || 0) * minTick;
                                    return domA;
                                }
                            })}
                        </div>
                        <Modal
                            visible={this.state.visible}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            maskClosable={true}
       
                        >
                            {/* <LayersModal   /> */}
                            <div>
                                {isEnabled ?null:  <div><span>Number of Layers</span><InputNumber step={1} min={1} formatter={value => Math.round(value)} size="small" value={layersNumber} onChange={this.changeLayersNumber}/></div>}
                                <Row>
                                    <Col span={6}>
                                        <Radio.Group onChange={this.onEnabled} value={isEnabled} >
                                            <Radio value={true}>Standard</Radio> <Radio value={false}> Manual</Radio>
                                        </Radio.Group>
                                    </Col>
                                    {
                                        !isEnabled &&
                                        <Col span={8}>
                                            {bidQuantities.length>=1 &&
                                            <div className="layers-bid-ask"><span>Bid Qty</span><span>Ask Qty</span> </div>}
                                            {bidQuantities.length>=1 ?bidQuantities.map((item,index)=>(
                                                <div key={index} className="layers-set-input"><InputNumber value={item} onChange={(e)=>this.changeBidQty(e,index)} size="small"/><InputNumber onChange={(e)=>this.changeAskQty(e,index)} value={askQuantities[index]} size="small"/></div>
                                            )):null}
                                        </Col>
                                    }
                                </Row>
                                <Row>
 
                                </Row>
                            </div>
                        </Modal>
                        <Modal
                            visible={this.state.fillVisible}
                            onOk={this.handleFillOk}
                            onCancel={this.handleFillCancel}
                        >
                            {/* <FillModal /> */}
                            <div>
                                <div><span style={{marginRight:"5%"}}>Bid Spread</span><span>Ask Spread</span></div>
                                <div><InputNumber min={0} formatter={value => Math.round(value)} style={{marginRight:"1%"}} size="small" value={avgBidSpread} onChange={this.changeAvgBidSpread}/><InputNumber min={0} formatter={value => Math.round(value)} size="small" value={avgAskSpread} onChange={this.changeAvgAskSpread}/></div>
                            </div>
                        </Modal>
                    </div>:null}
                <div >
                    <table className="strategy-table">
                        <tbody>
                            {(() => {
                                // console.log(btnIndex.name);
                                if (btnIndex.name!=="Manual"){
                                    const inputInfo = this.props.inputInfo;
                                    // console.log("inputInfo:", inputInfo);
                                    // console.log(inputInfo[btnIndex.name]);
                                    if (inputInfo[btnIndex.name]){
                                        const returnDom = Object.keys(inputInfo[btnIndex.name]).map((item,idx) => (
                                            <tr key={idx}>
                                                <td>{item}</td>
                                                <td><InputNumber onChange={(val)=>{
                                                    // console.log(typeof val);
                                                    inputInfo[btnIndex.name][item] = val;
                                                    this.props.setInputInfo({...inputInfo});
                                                }} size="small" value={inputInfo[btnIndex.name][item]}/></td>
                                            </tr>
                                        ));

                                        return returnDom;
                                    }
                                    // const paramsMap = currentStrategy && currentStrategy.strategyScriptParamsMap;
                                    // if (paramsMap && paramsMap[btnIndex.name]) {
                                    //     const current = paramsMap[btnIndex.name];
                                    //     return Object.keys(current).map((item, idx) => <tr key={idx}>
                                    //         <td>{item}</td>
                                    //         <td><InputNumber size="small" value={current[item]}/></td>
                                    //     </tr>);
                                    // }else {
                                    //     paramList[btnIndex.index]&&paramList[btnIndex.index].config.map((item,idx)=>(
                                    //         <tr key={idx}>
                                    //             <td>{item.name}</td>
                                    //             <td><InputNumber size="small" value={item.value} /></td>
                                    //         </tr>
                                    //     ));
                                    // }
                                }
                            })()}
                        </tbody>
                    </table>
                
                </div>
 
            </div>
                           

        );
    }
}

const mapStateToProps = state => ({
    // allParams: state.setAllParamsReducer
    btnName:state.bookHeader.btnName,
    paramList:state.bookHeader.paramList,
    btnIndex:state.bookHeader.btnIndex,
    currentStrategy: state.currentStrategyReducer,
    strategyParam: state.paramReducer.strategyParam,

    minTicks: state.globalReducer.minTicks,
    orderBook: state.globalReducer.orderBook,
    inputInfo:state.bookHeader.inputInfo,
});

const mapDispatchToProps = dispatch => ({
    // setTheme: (theme) => dispatch(setTheme(theme))
    getParamList:(param)=>dispatch(getParamList(param)),
    setInputInfo:(inputInfo)=>dispatch(setInputInfo(inputInfo)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ManualBook);