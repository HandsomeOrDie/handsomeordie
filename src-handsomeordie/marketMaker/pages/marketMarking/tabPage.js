import { connect } from "react-redux";
import { Tabs, Button, Layout, Modal, Icon } from "antd";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Route, Switch, withRouter } from "react-router";
import React, { Component } from "react";
import Pricing from "../marketConfig/Pricing";
import HeadGroup from "../marketConfig/spdbConfig/headGroup";
import UserManage from "../marketConfig/spdbConfig/userManage";
import CorePrice from "../marketConfig/CorePrice";
import MarketPrice from "../marketConfig/MarketPrice";
import MarketData from "../marketConfig/MarketData";
import ClientFlowTable from "../trading/clientFlow/ClientFlowTable";
import BodyRow from "../trading/tradingMoniter/HedgeTable";

import RiskMonitorMain from "../riskMonitor/riskMonitor/index";
import RiskMng from "../riskMonitor/riskMng/index";
import CreditMng from "../riskMonitor/creditMng/index";

import { showPage } from "../../actions/marketDetail";
import { DragDropContext, DragSource, DropTarget } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

const confirm = Modal.confirm;

class TabPage extends Component {
    state = {
        isShowWindow: false,
        showTab: "market",
        selectedKey: 3,
    }
    static contextTypes = {
        router: PropTypes.object.isRequired,
    }
    test = () => {
        this.context.router.history.push("/marketmaker/test");
    }


    showPage = () => {
        const history = require("history").createBrowserHistory;
        // this.props.showPage(true);
        history.goBack();
    }
    // jumpTostrategy = (record) => {
    //     switch (record) {
    //         case "1":
    //             this.context.router.history.push("/pricing");
    //             return;
    //         case "2":
    //             this.context.router.history.push("/coreprice");
    //             return;
    //         case "3":
    //             this.context.router.history.push("/marketprice");
    //             return;
    //         default:
    //             return this.context.router.history.push("/");
    //     }
    // }
    jumpPricing = (param,key) => {
        this.setState({selectedKey: key},()=>{
            if (this.state.showTab === "core" && param !== "core") {
                let corePriceRef = this.refs.corePrice.getWrappedInstance();
                if (corePriceRef.state.editView) {
                    corePriceRef.showDiscardChangePop(() => {
                        this.setState({ showTab: param });
                    });
                    return;
                }
            }
            if (this.state.showTab === "market" && param !== "market") {
                if (this.market.state.editView) {
                    this.market.showDiscardChangePop(() => {
                        this.setState({ showTab: param });
                    });
                    return;
                }
            }
            this.setState({ showTab: param });
        });
    }
    handleRef = (thiz) => {
        this.market = thiz;
    }
    showTab = () => {
        switch (this.state.showTab) {
        case "pricing":
            return <Pricing />;
        case "core":
            return <CorePrice ref="corePrice" />;
        case "market":
            return <MarketPrice handleRef={this.handleRef}/>;
        case "mktdata":
            return <MarketData />;
        case "autoQuotingRules":
            return <ClientFlowTable />;
        case "autoHedge":
            return <BodyRow />;
        case "riskMonitorMain":
            return <RiskMonitorMain />;
        case "riskMng":
            return <RiskMng />;
        case "creditMng":
            return <CreditMng />;
        case "headGroup":
            return <HeadGroup />;
        case "userManage":
            return <UserManage />;
        }
    }

    handleClick = ( key ) => {
        this.setState({selectedKey: key});
    };

    getClassName = (key) => {
        if (this.state.selectedKey === key) {
            return "tow-rank menu-active";
        } else {
            return "tow-rank";
        }
    };

    render() {
        const TabPane = Tabs.TabPane;
        return (
            <div style={{display: "flex", flexDirection: "column", flex: 1, background: "#F2F2F2",overflow:"auto"}}>
                {/* <div style={{height: 40,lineHeight:"40px", background: "#313131", display: "flex", alignItems: "center", fontSize:  19,position:"relative"}}>
                    <div style={{marginLeft: 20}}>Configurations</div>

                    <div style={{background:"initial",position:"absolute",right:"10px"}}><Icon type="close" onClick={this.showPage}></Icon></div>
                </div> */}
                <div style={{flex: "1", display: "flex"}}>
                    <div style={{width: 250, background: "#ececec"}}>
                        {/* <div className="one-rank">Pricing</div> */}
                        {/* <div className={this.getClassName(4)} onClick={()=>this.jumpPricing("mktdata",4)}>
                            <div className="left-bar" style={{display: this.state.selectedKey === 4 ? "block" : "none"}}/>
                            <div className="menu-name">Market Data</div>
                        </div> */}
                        <div className={this.getClassName(3)} onClick={()=>this.jumpPricing("market",3)}>
                            <div className="left-bar" style={{display: this.state.selectedKey === 3 ? "block" : "none"}}/>
                            <div className="menu-name">市场数据</div>
                        </div>
                        {/* <div className={this.getClassName(2)} onClick={()=>this.jumpPricing("core",2)}>
                            <div className="left-bar" style={{display: this.state.selectedKey === 2 ? "block" : "none"}}/>
                            <div className="menu-name">Core Price</div>
                        </div> */}
                        <div className={this.getClassName(1)} onClick={()=>this.jumpPricing("pricing",1)}>
                            <div className="left-bar" style={{display: this.state.selectedKey === 1 ? "block" : "none"}}/>
                            <div className="menu-name">添加报价</div>
                        </div>
                        <div className={this.getClassName(2)} onClick={()=>this.jumpPricing("headGroup",2)}>
                            <div className="left-bar" style={{display: this.state.selectedKey === 2 ? "block" : "none"}}/>
                            <div className="menu-name">头组设置</div>
                        </div>
                        <div className={this.getClassName(4)} onClick={()=>this.jumpPricing("userManage",4)}>
                            <div className="left-bar" style={{display: this.state.selectedKey === 4 ? "block" : "none"}}/>
                            <div className="menu-name">账号管理</div>
                        </div>
                        {/* <div className="one-rank">Trading</div>
                        <div className={this.getClassName(5)} onClick={()=>this.jumpPricing("autoQuotingRules",5)}>
                            <div className="left-bar" style={{display: this.state.selectedKey === 5 ? "block" : "none"}}/>
                            <div className="menu-name">Auto Quoting Rules</div>
                        </div>
                        <div className={this.getClassName(6)} onClick={()=>this.jumpPricing("autoHedge",6)}>
                            <div className="left-bar" style={{display: this.state.selectedKey === 6 ? "block" : "none"}}/>
                            <div className="menu-name">Auto Hedge</div>
                        </div>

                        <div className="one-rank">Risk</div>
                        <div className={this.getClassName(7)} onClick={()=>this.jumpPricing("riskMng",7)}>
                            <div className="left-bar" style={{display: this.state.selectedKey === 7 ? "block" : "none"}}/>
                            <div className="menu-name">Risk Management</div>
                        </div>
                        <div className={this.getClassName(8)} onClick={()=>this.jumpPricing("creditMng",8)}>
                            <div className="left-bar" style={{display: this.state.selectedKey === 8 ? "block" : "none"}}/>
                            <div className="menu-name">Credit Management</div>
                        </div> */}
                    </div>
                    <div className="configPage" style={{flex: 1,display:"flex",background:"#fff",margin: 10}}>
                        {
                            this.showTab()
                        }
                    </div>
                </div>
                {/* <div style={{display:"flex",flex:1,flexDirection:"column",maxWidth:"100%"}}>
                <div style={{height:50}}>
                    <ul className="navgation-type">
                        <li onClick={() => this.jumpPricing("pricing")} className={this.state.showTab == "pricing" ? "navgation-type-li-bg" : null}>Pricing</li>
                        <li onClick={() => this.jumpPricing("core")} className={this.state.showTab == "core" ? "navgation-type-li-bg" : null}>Core Price</li>
                        <li onClick={() => this.jumpPricing("market")} className={this.state.showTab == "market" ? "navgation-type-li-bg" : null}>Market Price</li>
                        <li onClick={() => this.jumpPricing("mktdata")} className={this.state.showTab === "mktdata" ? "navgation-type-li-bg" : null}>Market Data</li>
                        <li onClick={() => this.jumpPricing("autoQuotingRules")} className={this.state.showTab === "autoQuotingRules" ? "navgation-type-li-bg" : null}>Auto Quoting Rules</li>
                        <li onClick={() => this.jumpPricing("autoHedge")} className={this.state.showTab === "autoHedge" ? "navgation-type-li-bg" : null}>Auto hedge</li>
                        <li onClick={() => this.jumpPricing("riskMng")} className={this.state.showTab === "riskMng" ? "navgation-type-li-bg" : null}>Risk Management</li>
                        <li onClick={() => this.jumpPricing("creditMng")} className={this.state.showTab === "creditMng" ? "navgation-type-li-bg" : null}>Credit Management</li>
                        <li style={{flex:1, textAlign:"right", background:"initial"}}><Icon type="close" onClick={this.showPage}></Icon></li>
                    </ul>
                </div>
                {
                    this.showTab()
                }
            </div> */}
            </div>
            
        );
    }
}

const mapStateToProps = state => ({
    // allParams: state.setAllParamsReducer
});

const mapDispatchToProps = dispatch => ({
    showPage: (param) => dispatch(showPage(param))
    // setTheme: (theme) => dispatch(setTheme(theme))
});
export default DragDropContext(HTML5Backend)(connect(mapStateToProps, mapDispatchToProps)(TabPage));