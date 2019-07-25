import {connect} from "react-redux";
import {Row, Button, message} from "antd";
import React, {Component} from "react";
import SymbolList from "../../pages/marketMarking/symbolList";
import {showPage} from "../../actions/marketDetail";
import ReferencePrice from "./referencePrice";
import OrderBook from "./orderbook/orderBook";
import Distribution from "./distribution/distribution.js";
import BookHeader from "./strategyBookHeader";
import {stopAllQuote} from "../../actions/symbolList";

import {setCurrentStrategy} from "../../actions/setCurrentStrategy";
class HeaderSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            symbolList: undefined,
        };
    }

    showPage = () => {
        this
            .props
            .showPage(false);
    }

    handleRef = (thiz) => {
        this.setState({symbolList: thiz});
    }

    render() {

        return (

            <div style={{display: "flex",flex:1,overflow:"auto"}}>
                <div style={{display: "flex",flex:1,flexDirection:"column"}}>
                    <div style={{flex:3,display: "flex",flexDirection:"column"}}>
                        <BookHeader/>
                        <div style={{flex:1,display: "flex"}}>
                            <ReferencePrice referenceConfigId={1}/>
                            <OrderBook symbolList={this.state.symbolList}/>
                        </div>
                    </div>
                    <Distribution/>
                </div>
                <div style={{flex: 1,display:"flex",flexDirection:"column"}}>
                    <div
                        style={{
                            marginLeft: 5,
                            marginRight: 5,
                            marginTop: 5,
                            height:45,
                            alignItems: "center"
                        }}
                        className="market-detail-setting-book">
                        <div style={{fontSize:"16px",marginLeft:10,float:"left",fontWeight:"bold",marginTop:12}}>Symbol List</div>
                        <Button size="small" onClick={()=>{
                            this.props.stopAllQuote({}, (result) => {
                                if (result.success){
                                    this.state.symbolList.refreshSymbolList();
                                    this.props.setCurrentStrategy({...this.props.currentStrategy, status: "STOPPED"});
                                    message.success("Success!", 2);
                                }else {
                                    message.error("Failed!", 2);
                                }
                            });
                        }} style={{background: "red", float: "right", marginRight: 20,marginTop:12}}>ALL STOP</Button>
                        {/* <Icon
                            style={{
                                marginRight: 20
                            }}
                            type="setting"
                            onClick={this.showPage}/> */}
                    </div>
                    <SymbolList handleRef={this.handleRef}/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    showDetailPage: state.marketDetail.showDetailPage,
    marketPrice: state.globalReducer.marketPrice,
    currentStrategy: state.currentStrategyReducer.currentStrategy,
});

const mapDispatchToProps = dispatch => ({
    showPage: (param) => dispatch(showPage(param)),
    stopAllQuote: (params, cb) => dispatch(stopAllQuote(params, cb)),
    setCurrentStrategy: (data) => dispatch(setCurrentStrategy(data))
});
export default connect(mapStateToProps, mapDispatchToProps)(HeaderSetting);