import React from "react";
import { InputNumber, Button, Modal, Form, Radio, Input} from "antd/lib/index";
import "../../../../../common/styles/home/ODM/orderBook.scss";
import {getOffset, getPixs} from "../../../../utils/commonFun";
import {getInstance, updateOrderBookList} from "../../../../actions/spdb/odmAction";
import {connect} from "react-redux";
class ManualBook extends React.Component {
    state = {
        batchVisible: false,
        layerVisible: false,
        layerRadioValue: 2,
        layerNum: undefined,
        bidQuantities: [],
        askQuantities: [],
        bidQuantitiesCopy: [],
        askQuantitiesCopy: [],
        bidPricesStep: [],
        askPricesStep: [],

        batchBid: undefined,
        batchAsk: undefined,

        showInputQtyError: false,
    }

    componentDidMount() {
        this.props.setManualState(this);
        const instance = this.props.instance;
        if (instance && instance.algo === "Manual" && instance.strategyScriptParams) {
            const { bidQuantities, askQuantities, bidPricesStep, askPricesStep} = instance.strategyScriptParams;
            this.setState({
                bidQuantities: bidQuantities || [],
                askQuantities: askQuantities || [],
                bidPricesStep: bidPricesStep || [],
                askPricesStep: askPricesStep || [],
            });
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
    }

    setManualParams = () => {
        const instance = this.props.instance;
        let params = {};
        if (instance && instance.algo === "Manual"){
            params = instance.strategyScriptParams;
        } else if (instance && instance.strategyScriptParamsMap) {
            params = instance.strategyScriptParamsMap.Manual;
        }
        const { bidQuantities, askQuantities, bidPricesStep, askPricesStep} = params;
        this.setState({
            bidQuantities: bidQuantities || [],
            askQuantities: askQuantities || [],
            bidPricesStep: bidPricesStep || [],
            askPricesStep: askPricesStep || [],
        });
    }

    handleLayerOk = () => {

        const { askQuantitiesCopy, bidQuantitiesCopy, layerRadioValue } = this.state;
        console.log(askQuantitiesCopy, bidQuantitiesCopy);
        if (layerRadioValue === 2) {
            let askQtyError = askQuantitiesCopy.findIndex(item => typeof item === "undefined") !== -1;
            let bidQtyError = bidQuantitiesCopy.findIndex(item => typeof item === "undefined") !== -1;

            if (askQtyError || bidQtyError) {
                this.setState({showInputQtyError: true});
                return;
            }
            this.setState({
                bidQuantities: bidQuantitiesCopy,
                askQuantities: askQuantitiesCopy,
            });
        }else {
            this.setState({
                bidQuantities: [10000000, 30000000, 50000000, 100000000, 150000000],
                askQuantities: [10000000, 30000000, 50000000, 100000000, 150000000],
            });
        }
        this.setState({
            bidPricesStep: [],
            askPricesStep: [],
            layerVisible: false,
            layerNum: undefined,
            layerRadioValue: 1,
            showInputQtyError: false
        });
    }

    handleLayerCancel = () => {
        this.setState({layerVisible: false, layerNum: undefined, layerRadioValue: 1, showInputQtyError: false});
    }

    handleBatchOk = () => {
        const { batchBid, batchAsk, bidQuantities, } = this.state;
        let bidPricesStep = [];
        let askPricesStep = [];
        if (typeof batchBid === "undefined" && typeof batchAsk === "undefined"){
            this.setState({batchVisible: false,});
            return;
        }
        for (let i=0;i<bidQuantities.length;i++){
            bidPricesStep[i] = batchBid;
            askPricesStep[i] = batchAsk;
        }
        bidPricesStep[0] = 0;
        askPricesStep[0] = 0;

        this.setState({
            bidPricesStep,
            askPricesStep,
            batchBid: undefined,
            batchAsk: undefined,
            batchVisible: false,
        });
    }

    handleBatchCancel = () => {
        this.setState({
            batchBid: undefined,
            batchAsk: undefined,
            batchVisible: false
        });
    }

    handleRef = (thiz) => {
        this.strategyAdd = thiz;
    }

    onLayerRadioChange = (e) => {
        this.setState({
            layerRadioValue: e.target.value,
        });
    }

    getBidInputNumber = () => {
        const { layerNum, bidQuantitiesCopy } = this.state;
        let inputs = [];
        for (let i=0;i<layerNum;i++){
            inputs.push(<InputNumber key={i} onChange={(val)=>{
                bidQuantitiesCopy[i] = val * 10000000;
                this.setState({ bidQuantitiesCopy });
            }} className={"layer-input"}/>);
        }
        return inputs;
    }

    getAskInputNumber = () => {
        const { layerNum, askQuantitiesCopy } = this.state;
        let inputs = [];
        for (let i=0;i<layerNum;i++){
            inputs.push(<InputNumber key={i} onChange={(val)=>{
                askQuantitiesCopy[i] = val * 10000000;
                this.setState({ askQuantitiesCopy });
            }} className={"layer-input"}/>);
        }
        return inputs;
    }

    bidStepChange = (val, index) => {
        const { bidPricesStep } = this.state;
        bidPricesStep[index] = val;
        this.setState({ bidPricesStep });
    }

    askStepChange = (val, index) => {
        const { askPricesStep } = this.state;
        askPricesStep[index] = val;
        this.setState({ askPricesStep });
    }

    getLayerBidPrice = (index) => {
        const adjustState = this.props.adjustState;
        const { bidQuantities } = this.state;

    }

    getLayerAskPrice = (index) => {

    }

    getStepAll = (stepAll, minTick) => {
        // console.log(stepAll);
        if (!stepAll) {
            return 0;
        }
        let displayQty = 10000;
        let instance = this.props.instance;
        if (instance) {
            const symbol = instance.symbol;
            // if (symbol === "USDJPY" || symbol === "EURJPY" || symbol.indexOf(".") !== -1) {
            //     displayQty = 100;
            // }
            const offset = getOffset(minTick);
            // console.log(offset);
            // console.log(offset / displayQty * stepAll || 0);
            return offset / displayQty * stepAll || 0;
        }
    }
    getFormatValue = (value) => {
        const instance =this.props.instance;
        if (instance) {
            const minTick = instance.minTick;
            const offset = getOffset(minTick);
            let temp = Math.round((value * offset) + minTick / 10) / offset;
            return temp.toFixed(getPixs(minTick));
        }
    }
    getOtherStrategyParamsDom = () => {
        const { currentStrategy, strategyScriptParamsMap } = this.props;
        console.log(strategyScriptParamsMap);
        if (currentStrategy){
            const dom = [];
            Object.keys(strategyScriptParamsMap[currentStrategy]).map((item, index)=>{
                dom.push(<div key={index} style={{display: "flex", marginTop: 3}}>
                    <div style={{width: 120}}>{item}</div>
                    <InputNumber
                        value={strategyScriptParamsMap[currentStrategy][item]}
                        onChange={value => {
                            strategyScriptParamsMap[currentStrategy][item] = value;
                            console.log(strategyScriptParamsMap);
                            this.props.updateParamsMap(strategyScriptParamsMap);
                        }}
                    />
                </div>);
            });
            return dom;
        }
    }

    render() {
        const { layerRadioValue, layerNum, bidQuantities, askQuantities, bidPricesStep, askPricesStep } = this.state;
        let { instance, orderBook, currentStrategy } = this.props;
        let tempBid = instance && orderBook[instance.instanceId] && orderBook[instance.instanceId].quoteBidPrice || 0;
        let tempAsk = instance && orderBook[instance.instanceId] && orderBook[instance.instanceId].quoteOfferPrice || 0;
        instance = instance || {};
        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                {
                    currentStrategy === "Manual" ?
                        <div style={{display: "flex", flexDirection: "column", }}>
                            <div className={"layer-col"}>
                                <Button className={"layer-btn"} onClick={()=>{
                                    this.setState({layerVisible: true});
                                }}>层数</Button>
                            </div>
                            <div className={"manual-name-col"}>
                                <div><div>报买量(万)</div></div>
                                <div><div>报买价</div></div>
                                <div style={{visibility: bidQuantities.length > 1 ? "visible" : "hidden"}}><Button onClick={()=>{
                                    this.setState({
                                        batchVisible: true
                                    });
                                }} className={"adjust-btn"}>批量调节</Button></div>
                                <div><div>报卖价</div></div>
                                <div><div>报卖量(万)</div></div>
                            </div>
                            <div className={"manual-col"}>
                                {
                                    (()=>{
                                        let returnDom = [];
                                        let bidQty = [];
                                        let bidPrice = [];
                                        let askPrice = [];
                                        let askQty = [];
                                        let bidAdjust = [];
                                        let askAdjust = [];
                                        for (let i=0;i<bidQuantities.length;i++){
                                            tempBid = tempBid - this.getStepAll(bidPricesStep[i], instance.minTick) * instance.minTick;
                                            tempAsk = tempAsk + this.getStepAll(askPricesStep[i], instance.minTick) * instance.minTick;
                                            bidQty.push(<div key={i} className={"qty-div"}>{bidQuantities[i]/10000}</div>);
                                            bidPrice.push(<div key={i} className={"price-div"}>{instance && instance.status === "STARTED" && this.getFormatValue(tempBid)}</div>);
                                            bidAdjust.push(<div key={i}><InputNumber value={bidPricesStep[i]} onChange={(val)=>{this.bidStepChange(val, i);}}/></div>);
                                            askAdjust.push(<div key={i}><InputNumber value={askPricesStep[i]} onChange={(val)=>{this.askStepChange(val, i);}}/></div>);
                                            askPrice.push(<div key={i} className={"price-div"}>{instance && instance.status === "STARTED" && this.getFormatValue(tempAsk)}</div>);
                                            askQty.push(<div key={i}><div className={"qty-div"}>{askQuantities[i]/10000}</div></div>);
                                        }
                                        bidAdjust.splice(0, 1, <div key={"blank-div1"} className={"blank-div"}/>);
                                        askAdjust.splice(0, 1, <div key={"blank-div2"} className={"blank-div"}/>);
                                        returnDom.push(<div key={"bid-qty"} className={"bid-qty"}>{bidQty}</div>);
                                        returnDom.push(<div key={"bid-price"} className={"bid-price"}>{bidPrice}</div>);
                                        returnDom.push(<div key={"bid-adjust"} className={"bid-adjust"}>{bidAdjust}</div>);
                                        returnDom.push(<div key={"ask-adjust"} className={"ask-adjust"}>{askAdjust}</div>);
                                        returnDom.push(<div key={"ask-price"} className={"ask-price"}>{askPrice}</div>);
                                        returnDom.push(<div key={"ask-qty"} className={"ask-qty"}>{askQty}</div>);
                                        return returnDom;
                                    })()
                                }
                            </div>
                        </div> :
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            marginTop: 10,
                            height: 161,
                            overflow: "auto"
                        }}>
                            {
                                this.getOtherStrategyParamsDom()
                            }
                        </div>
                }
                <Modal
                    className="darkTheme orderbook"
                    title={"层数"}
                    width={350}
                    bodyStyle={{background: "#2a2a2a"}}
                    visible={this.state.layerVisible}
                    onOk={this.handleLayerOk}
                    onCancel={this.handleLayerCancel}
                    closable={false}
                    okButtonProps={{className: "ok-btn"}}
                    cancelButtonProps={{className: "cancel-btn"}}
                    destroyOnClose={true}
                    okText={"确定"}
                    cancelText={"取消"}
                >
                    <div className={"layer-wrapper"}>
                        <Radio.Group onChange={this.onLayerRadioChange} value={layerRadioValue}>
                            {/*<Radio value={1}>标准</Radio>*/}
                            {/*<br/>*/}
                            <Radio value={2}>手动</Radio>
                        </Radio.Group>
                        {
                            layerRadioValue === 2 &&
                            <div className={"layer-content"}>
                                <div className={"layer-title"}>
                                    <div className={"layer-label"}>层数</div>
                                    <div className={"layer-num"}>
                                        <InputNumber value={layerNum} onChange={(val)=>{
                                            let askQuantitiesCopy = [], bidQuantitiesCopy = [];
                                            for(let i =0;i<val;i++){
                                                bidQuantitiesCopy.push(undefined);
                                                askQuantitiesCopy.push(undefined);
                                            }
                                            this.setState({showInputQtyError: false, layerNum: val, askQuantitiesCopy, bidQuantitiesCopy});
                                        }}/>
                                    </div>
                                </div>
                                {
                                    layerNum > 0 &&
                                    <div className={"layer-qty"}>
                                        <div className={"layer-bid"}>
                                            <div>Bid Qty(千万)</div>
                                            {
                                                this.getBidInputNumber()
                                            }
                                        </div>
                                        <div className={"layer-ask"}>
                                            <div>Ask Qty(千万)</div>
                                            {
                                                this.getAskInputNumber()
                                            }
                                            {/*<InputNumber className={"layer-input"}/>*/}
                                        </div>
                                    </div>
                                }
                                <div style={{color: "red", display: this.state.showInputQtyError ? "block" : "none"}}>
                                    请输入所有的分层量！
                                </div>
                            </div>
                        }
                    </div>
                </Modal>
                <Modal
                    className="darkTheme orderbook"
                    title={"批量调节"}
                    width={350}
                    bodyStyle={{background: "#2a2a2a"}}
                    visible={this.state.batchVisible}
                    onOk={this.handleBatchOk}
                    onCancel={this.handleBatchCancel}
                    closable={false}
                    okButtonProps={{className: "ok-btn"}}
                    cancelButtonProps={{className: "cancel-btn"}}
                    destroyOnClose={true}
                    okText={"确定"}
                    cancelText={"取消"}
                >
                    <div className={"batch-wrapper"}>
                        <div className={"batch-bid"}>
                            <div>Bid Spread</div>
                            <div><InputNumber value={this.state.batchBid} onChange={(val)=>{this.setState({batchBid: val});}}/></div>
                        </div>
                        <div className={"batch-ask"}>
                            <div>Ask Spread</div>
                            <div><InputNumber value={this.state.batchAsk} onChange={(val)=>{this.setState({batchAsk: val});}}/></div>
                        </div>
                    </div>
                </Modal>
            </div>

        );
    }

}
const mapStateToProps = state => ({
    orderBook: state.globalReducer.orderBook,
});

const mapDispatchToProps = dispatch => ({
});
export default connect(mapStateToProps,mapDispatchToProps)(ManualBook);
