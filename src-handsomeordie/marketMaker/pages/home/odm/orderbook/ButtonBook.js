import React from "react";
import {Button, message,} from "antd/lib/index";
import "../../../../../common/styles/home/ODM/orderBook.scss";
import { updateInstance,} from "../../../../actions/spdb/odmAction";
import {connect} from "react-redux";
class ButtonBook extends React.Component {
    state = {
        applyLoading: false,
        startLoading: false,
    }

    handleRef = (thiz) => {
        this.strategyAdd = thiz;
    }

    handlerApply =()=>{
        this.setState({applyLoading: true});
        const { instance, currentStrategy, strategyScriptParamsMap } = this.props;
        const manualState = this.props.getManualState().state;
        const adjustState = this.props.getAdjustState().state;
        console.log("manualState", manualState.state);
        console.log("adjustState", adjustState);
        const spread = typeof adjustState.spread === "undefined" ? instance.quoteSpread : adjustState.spread;
        const skew = typeof adjustState.skew === "undefined" ? instance.quoteSkew : adjustState.skew;
        const quoteOfferPrice = adjustState.quoteOfferPrice;
        const quoteBidPrice = adjustState.quoteBidPrice;
        let tmpObj;
        let manualParams;
        if(currentStrategy === "Manual"){
            tmpObj = {
                bidQuantities: manualState.bidQuantities,
                askQuantities: manualState.askQuantities,
                bidPricesStep: manualState.bidPricesStep,
                askPricesStep: manualState.askPricesStep,
            };
            manualParams = JSON.parse(JSON.stringify(tmpObj));
            tmpObj = JSON.stringify(tmpObj).replace(/\[|]|"|}|{/g, "");
            tmpObj = tmpObj.replace(/,a/g, ";a");
            tmpObj = tmpObj.replace(/,b/g, ";b");
            tmpObj = tmpObj.replace(/:/g, "=");

        }else{
            tmpObj = strategyScriptParamsMap[currentStrategy];
            manualParams = JSON.parse(JSON.stringify(tmpObj));
            tmpObj = JSON.stringify(tmpObj).replace(/\[|]|"|}|{/g, "");
            tmpObj = tmpObj.replace(/,/g, ";");
            tmpObj = tmpObj.replace(/:/g, "=");

        }
        let params = {
            strategyScriptName: currentStrategy,
            instanceId: instance.instanceId,
            quoteSpread: spread,
            quoteSkew: skew,
            strategyScriptParams: tmpObj,
            quoteSpreadFixed: adjustState.isFixed,
            bookId: this.props.bookIdMap[currentStrategy],
        };
        this.props.updateInstance({input:JSON.stringify(params)},(result)=>{
            if (result.success){
                message.success("修改成功！", 2);
                const data = this.props.symbolList.state.data;
                const index = data.findIndex(item => item.instanceId === instance.instanceId);
                data[index].quoteSpread = spread;
                data[index].quoteSkew = skew;
                data[index].algo = currentStrategy;
                data[index].strategyScriptParamsMap[currentStrategy] = manualParams;
                if (currentStrategy === "Manual"){
                    data[index].strategyScriptParams =  manualParams;
                }
                this.props.symbolList.setState({ data });
                this.setState({applyLoading: false});
            } else {
                this.setState({applyLoading: false});
                message.error("修改失败！", 2);
            }
        });
    }

    render() {
        const { instance } = this.props;
        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                <div className={"btn-col"}>
                    <Button className={"apply"} disabled={!this.props.instance} loading={this.state.applyLoading} onClick={this.handlerApply}>应用</Button>
                    {
                        instance && instance.status === "STARTED" ?
                            <Button className={"stop"} disabled={!this.props.instance} loading={this.state.startLoading} onClick={()=>{
                                this.setState({startLoading: true});
                                this.props.symbolList.stop(instance.instanceId, ()=>{
                                    this.setState({startLoading: false});
                                });
                            }}>停止</Button>:
                            <Button className={"start"} disabled={!this.props.instance} loading={this.state.startLoading} onClick={()=>{
                                this.setState({startLoading: true});
                                this.props.symbolList.start(instance.instanceId, ()=>{
                                    this.setState({startLoading: false});
                                });
                            }}>启动</Button>
                    }
                </div>
            </div>
        );
    }

}
const mapStateToProps = state => ({
    orderBookList: state.odmReducer.orderBookList,
});

const mapDispatchToProps = dispatch => ({
    updateInstance: (params, cb) => dispatch(updateInstance(params, cb)),
});
export default connect(mapStateToProps,mapDispatchToProps)(ButtonBook);
