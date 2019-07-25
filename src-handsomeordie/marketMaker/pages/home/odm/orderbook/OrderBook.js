import React from "react";
import {Select, InputNumber, Checkbox, Button, Icon, Modal, Form, Input, Upload, Row, Col, message, Radio} from "antd/lib/index";
const Option = Select.Option;
import StrategyAdd from "./StrategyAdd";
import AdjustBook from "./AdjustBook";
import ManualBook from "./ManualBook";
import ButtonBook from "./ButtonBook";
import {
    getDefinitionList,
    uploadScirpt,
    getAlgo,
} from "../../../../actions/spdb/odmAction";
import "../../../../../common/styles/home/ODM/orderBook.scss";
import {connect} from "react-redux";
class OrderBook extends React.Component {
    state = {
        addVisible: false,
        currentStrategy: undefined,
        strategyScriptParamsMap: {},
        bookIdMap: {},

        algos: [],
    }

    componentDidMount() {
        const instance = this.props.instance;
        if (instance) {
            this.setState({
                currentStrategy: instance.algo,
                strategyScriptParamsMap: instance.strategyScriptParamsMap || {},
                bookIdMap: instance.bookIdMap || {},
            });
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {

    }

    handleRef = (thiz) => {
        this.strategyAdd = thiz;
    }
    setAdjustState = (thiz) => {
        this.adjustState = thiz;
    }
    setManualState = (thiz) => {
        this.manualState = thiz;
    }
    getAdjustState = () => {
        return this.adjustState;
    }

    getManualState = () => {
        return this.manualState;
    }
    addStrategy = (name, params) => {
        const { strategyScriptParamsMap } = this.state;
        strategyScriptParamsMap[name] = params;
        this.setState({currentStrategy: name, strategyScriptParamsMap});
    }

    updateParamsMap = (strategyScriptParamsMap) => {
        console.log(strategyScriptParamsMap);
        this.setState({strategyScriptParamsMap});
    }
    updateCurrentStrategy = (currentStrategy) => {
        this.setState({currentStrategy});
    }
    updateBookIdMap = (bookIdMap) => {
        this.setState({bookIdMap});
    }
    showCode = (text) => {
        const {tradingvarietymanage} = this.props;
        // console.log(tradingvarietymanage);
        for(let i in tradingvarietymanage){
            if(tradingvarietymanage[i].key === text){
                return tradingvarietymanage[i].displayName;
            }
        }
        return "";
    }

    componentWillUnmount() {
        this.setState = (state,callback)=>{
            return;
        };
    }

    render() {

        const { index, instance } = this.props;

        return (
            <div className={"book"}>
                <div className={"title"} style={{background: instance && this.props.clickId === instance.key && "rgb(62, 152, 150)"}}>
                    <div className={"logo"}>
                        <div className={"bar"} style={{
                            width: index !== -1 ? 5 : 0,
                            // background: index === 0 ? "#2DC9AC" : index === 1 ? "#A365D3" : "#F3E439",
                            background: instance && instance.color,
                        }}
                        />
                        <div className={"name"}>{instance ? this.showCode(instance.code) : "--"}</div>
                    </div>
                    <div className={"upload"}>
                        <Icon onClick={()=>{
                            if (!this.props.instance){
                                return;
                            }
                            this.props.getAlgo({}, (result)=>{
                                this.setState({ algos: result.data});
                            });
                            this.strategyAdd.setState({addVisible: true});
                        }} className={"add-icon"} type="plus-square" />
                        {/*<Icon className={"delete-icon"} type="delete" />*/}
                        <span style={{marginLeft: 5}}>策略</span>
                        <div style={{marginLeft: 5}}>
                            <Select
                                style={{width: 95}}
                                value={this.state.currentStrategy} onChange={value => {
                                    if (value === "Manual") {
                                        this.manualState.setManualParams();
                                    }
                                    this.setState({currentStrategy: value});
                                }}>
                                {
                                    Object.keys(this.state.strategyScriptParamsMap).map((item, index)=>(<Option key={index} value={item}>{item === "Manual" ? "手动" : item}</Option>))
                                }
                            </Select>
                        </div>
                    </div>
                </div>
                <div className={"content"}>
                    <AdjustBook instance={instance && {...instance}} index={index} setAdjustState={this.setAdjustState}/>
                    <ManualBook
                        instance={instance}
                        index={index}
                        adjustState={this.adjustState}
                        setManualState={this.setManualState}
                        currentStrategy={this.state.currentStrategy}
                        strategyScriptParamsMap={{...this.state.strategyScriptParamsMap}}
                        updateParamsMap={this.updateParamsMap}
                    />
                    <ButtonBook
                        instance={instance}
                        index={index}
                        getAdjustState={this.getAdjustState}
                        getManualState={this.getManualState}
                        symbolList={this.props.symbolList}
                        currentStrategy={this.state.currentStrategy}
                        bookIdMap={this.state.bookIdMap}
                        strategyScriptParamsMap={this.state.strategyScriptParamsMap}
                    />
                </div>
                <StrategyAdd
                    handleRef={this.handleRef}
                    instance={instance}
                    symbolList={this.props.symbolList}
                    addStrategy={this.addStrategy}
                    currentStrategy={this.state.currentStrategy}
                    strategyScriptParamsMap={this.state.strategyScriptParamsMap}
                    bookIdMap={this.state.bookIdMap}
                    updateParamsMap={this.updateParamsMap}
                    updateCurrentStrategy={this.updateCurrentStrategy}
                    updateBookIdMap={this.updateBookIdMap}
                    algos={this.state.algos}
                />
            </div>
        );
    }

}
const mapStateToProps = state => ({
    tradingvarietymanage: state.odmReducer.tradingvarietymanage,
    clickId: state.odmReducer.clickId
});

const mapDispatchToProps = dispatch => ({
    getAlgo: (params, cb) => dispatch(getAlgo(params, cb)),
});
export default connect(mapStateToProps,mapDispatchToProps)(Form.create()(OrderBook));
