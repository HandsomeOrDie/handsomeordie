import {connect} from "react-redux";
import React, {Component} from "react";
import {Tabs, Card, Icon, Collapse,Radio, Select} from "antd";
import TradeOrderTable from "./tradeOrderTable";
import {setTradeBlotter} from "../../../actions/clientFlow";
import {findRealtimeOrder} from "../../../actions/tradeBlotter";

const Panel = Collapse.Panel;

class TradeBlotter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contentHeight: 0,
            initHeight: 0,
            tab: "All",
            tabType: "Trade",
            current: 0
        };
    }

    componentDidMount() {
        // const cardHeight = document.getElementById("blotter").clientHeight;
        // this.setState({initHeight: cardHeight - 218, tableHeight: cardHeight - 180}, ()=>{
        //     this.setTableHeight(this.props.showRradeBlotter, this.props.showManualTrading);
        // });

        // this.props.findRealtimeOrder({
            
        // });
        this.setTableHeight(this.props.showRradeBlotter, this.props.showClientFlow, this);

        let params =  {
            params: {
                statusIn: ["FILLED_PARTIALLY", "FILLED_FULLY"]
            },
            startRecord: 0,
            maxRecords: 50,
        };
        this.props.findRealtimeOrder(params);
        window.addEventListener("resize", ()=>{this.setTableHeight(this.props.showRradeBlotter, this.props.showClientFlow, this);});
    }

    onCollapseChange = () => {
        this.props.setTradeBlotter(!this.props.showRradeBlotter);
    };

    componentWillUnmount() {
        this.setState = (state,callback)=>{
            return;
        };
        this.props.setTradeBlotter(true);
    }

    componentWillReceiveProps(nextProps) {
        // if (nextProps.showRradeBlotter){
        //     this.setTableHeight(nextProps.showRradeBlotter, nextProps.showClientFlow);
        // }
        this.setTableHeight(nextProps.showRradeBlotter, nextProps.showClientFlow, this);
    }

    setTableHeight = (showRradeBlotter, showClientFlow, thiz) => {
        if (showRradeBlotter){
            const browserHeight = document.documentElement.clientHeight;
            try {
                // setTimeout(function () {
                let contentHeight;
                if (showClientFlow){
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
        // const _this = this;
        // //这里是为了优化两个Collapse都展开的渲染，直接从state获取高度值，消除卡顿
        // if (showRradeBlotter && showClientFlow) {
        //     this.setState({tableHeight: this.state.initHeight});
        // }else {
        //     setTimeout(function () {
        //         const cardHeight = document.getElementById("blotter").clientHeight;
        //         let tableHeight = cardHeight - 218;
        //         _this.setState({tableHeight: tableHeight});
        //     }, 300);
        // }
    };
    handleRef = (thiz) => {
        this.trade = thiz;
    }
    onTabChange = (e) => {
        this.setState({ tab: e.target.value });

        if(e.target.value==="All"){
            let params =  {
                params: {
                    statusIn: ["FILLED_PARTIALLY", "FILLED_FULLY"]
                },
                startRecord: 0,
                maxRecords: 50,
            };
            this.props.findRealtimeOrder(params);
        }
        if(e.target.value==="Client"){
            let params =  {
                startRecord: 0,
                maxRecords: 50,
                params: {
                    statusIn: ["FILLED_PARTIALLY", "FILLED_FULLY"],
                    tradingPurposeNot: "HEDGE"
                },
            };
            this.props.findRealtimeOrder(params);
        }
        if(e.target.value==="Hedging"){
            let params =  {
                startRecord: 0,
                maxRecords: 50,
                params: {
                    statusIn: ["FILLED_PARTIALLY", "FILLED_FULLY"],
                    tradingPurpose: "HEDGE"
                },
            };
            this.props.findRealtimeOrder(params);
        }
    }
    typeChanged = (value) => {
        this.setState({
            tabType: value
        });

        if(value==="Trade"){
            let params =  {
                startRecord: 0,
                maxRecords: 50,
                params: {
                    statusIn: ["FILLED_PARTIALLY", "FILLED_FULLY"]
                }
            };
            
            this.props.findRealtimeOrder(params);
        }
        if(value==="Order"){
            let params =  {
                startRecord: 0,
                maxRecords: 50,
                params: {
                    statusIn: ["ACCEPTED"]
                }
            };
            this.props.findRealtimeOrder(params);
        }
    }
    updateList = () => {
        const {tab, tabType, current} = this.state;
        this.trade.props.findRealtimeOrder({
            startRecord: 0,
            maxRecords: 50,
            params:{
                statusIn: tabType === "Trade"?["FILLED_PARTIALLY", "FILLED_FULLY"]:tabType === "Order"?["ACCEPTED"]:[],
                tradingPurposeNot: tabType === "Trade" && tab === "Client"?"HEDGE":null,
                tradingPurpose: tabType === "Trade" && tab === "Hedging"?"HEDGE":null
            }
        });
        this.setState({
            current: 1
        },()=>{
            setTimeout(()=>{
                this.setState({
                    current: 0
                });
            },100);
        });
    }

    render() {
        const Option = Select.Option;
        const {tab, tabType, current} = this.state;
        const browserHeight = document.documentElement.clientHeight;
        const minHeight = (browserHeight - 50 - 15)/2;
        const cardStyle = this.props.showRradeBlotter ? {flex: 1, marginLeft: 5, marginBottom: 5, marginRight: 5} : { marginLeft: 5, marginBottom: 5, marginRight: 5};
        return (

            <Card id="blotter" className="tradingCard" style={{minHeight: this.props.showRradeBlotter && minHeight, ...cardStyle}}>
                <div style={{
                    paddingLeft: 20,
                    height: 40,
                    background: "#3B3F42",
                    display: "flex",
                    alignItems: "center",
                }}>
                    <div style={{flex:1,display:"flex",minWidth:460}}>
                        <div style={{marginRight:20}}><span className="collapse-name">{tabType} Blotter ( {this.props.totalRecords?this.props.totalRecords:this.props.orderListCount} ) <Select className="tradeBlotterType" size="small" onChange={this.typeChanged} value={tabType}>
                            <Option value="Trade">Trade</Option>
                            <Option value="Order">Order</Option>
                        </Select></span></div>
                        <Radio.Group value={tab} onChange={this.onTabChange} style={{display:tabType==="Trade"?"":"none"}}>
                            <Radio.Button className="tabButton" value="All">All</Radio.Button>
                            <Radio.Button className="tabButton" value="Client">Client</Radio.Button>
                            <Radio.Button className="tabButton" value="Hedging">Hedging</Radio.Button>
                        </Radio.Group>
                    </div>
                    <div style={{marginRight: 20}}>
                        <Icon className="icon-style-self" onClick={this.updateList} type="sync" style={{marginRight: 10, fontSize: 18}}/>
                        <Icon onClick={()=>{this.onCollapseChange();}} className="icon-style-self" type={this.props.showRradeBlotter ? "down" : "right"} />
                    </div>
                </div>
                {
                    <div style={{display: this.props.showRradeBlotter ? "inherit" : "none"}}>
                        <TradeOrderTable current={current} tabType={tabType} tab={tab} handleRef={this.handleRef} tableHeight={this.state.contentHeight - 2}/>
                    </div>
                }
            </Card>
        );
    }
}

const mapStateToProps = state => ({
    showClientFlow: state.clientFlowReducer.showClientFlow,
    showRradeBlotter: state.clientFlowReducer.showRradeBlotter,
    totalRecords: state.tradeBlotterReducer.totalRecords,
    orderListCount: state.tradeBlotterReducer.orderList instanceof Array && state.tradeBlotterReducer.orderList.length ? state.tradeBlotterReducer.orderList.length:0,
});

const mapDispatchToProps = dispatch => ({
    findRealtimeOrder:(params)=>dispatch(findRealtimeOrder(params)),
    setTradeBlotter:(params) =>dispatch(setTradeBlotter(params))
});
export default connect(mapStateToProps,mapDispatchToProps)(TradeBlotter);