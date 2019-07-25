import {connect} from "react-redux";
import React, {Component} from "react";
import {Card, Tabs, Collapse, Icon} from "antd";
import LiquidityTable from "./LiquidityTable";
import {setManualTrading} from "../../../actions/clientFlow";

class Liquidity extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
        };
    }

    componentDidMount() {
        this.setTableHeight(this.props.showManualTrading, this.props.showRiskMonitor, this);
        window.addEventListener("resize", ()=>{this.setTableHeight(this.props.showManualTrading, this.props.showRiskMonitor, this);});
    }

    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return;
        };
        this.props.setManualTrading(true);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setTableHeight(nextProps.showManualTrading, nextProps.showRiskMonitor, this);
    }

    setTableHeight = (showManualTrading, showRiskMonitor, thiz) => {
        if (showManualTrading){
            const browserHeight = document.documentElement.clientHeight;
            try {
                // setTimeout(function () {
                let contentHeight;
                if (showRiskMonitor){
                    contentHeight = (browserHeight - 50 - 15 - 80)/2;
                } else {
                    contentHeight = (browserHeight - 50 - 15 - 80 - 2);
                }
                thiz.setState({contentHeight});
                // }, 300);
            }catch (e) {
                console.log(e);
            }
        }
    };

    onCollapseChange = () => {
        this.props.setManualTrading(!this.props.showManualTrading);
    };

    handleRef = (thiz) => {
        this.lqtTable = thiz;
    };

    render() {
        const browserHeight = document.documentElement.clientHeight;
        const minHeight = (browserHeight - 50 - 15)/2;
        const {Panel} = Collapse;
        const {TabPane} = Tabs;
        const cardStyle = this.props.showManualTrading ? {margin:"5px 5px 5px 0",flex:1} : {margin:"5px 5px 5px 0",};
        return (
            <Card id="manualTrading" className="tradingCard"  style={{minHeight: this.props.showManualTrading && minHeight, ...cardStyle}}>
                <div style={{
                    paddingLeft: 20,
                    height: 40,
                    background: "#3B3F42",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}>
                    <div><span className="collapse-name">Liquidity</span></div>
                    <div style={{marginRight: 20}}>
                        <Icon className="icon-style-self" onClick={(e)=>{
                            e.stopPropagation();
                            this.lqtTable.openAddTable();
                        }} type="plus-circle" style={{marginRight: 10, fontSize: 18}}/>
                        <Icon className="icon-style-self" onClick={(e)=>{
                            e.stopPropagation();
                            this.lqtTable.deleteLiquidity();
                        }} type="minus-circle" style={{marginRight: 10, fontSize: 18}}/>
                        <Icon onClick={()=>{this.onCollapseChange();}} className="icon-style-self" type={this.props.showManualTrading ? "down" : "right"} />
                    </div>
                </div>
                {
                    <div style={{display: this.props.showManualTrading ? "inherit" : "none"}}>
                        <LiquidityTable tableHeight={this.state.contentHeight} handleRef={this.handleRef}/>
                    </div>
                }
            </Card>
        );
    }
}

const mapStateToProps = state => ({
    showManualTrading: state.clientFlowReducer.showManualTrading,
    showRiskMonitor: state.clientFlowReducer.showRiskMonitor,
});

const mapDispatchToProps = dispatch => ({
    setManualTrading:(params, cb) =>dispatch(setManualTrading(params, cb)),
});

export default connect(mapStateToProps,mapDispatchToProps)(Liquidity);