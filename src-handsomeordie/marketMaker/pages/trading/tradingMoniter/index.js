import {connect} from "react-redux";
import React, {Component} from "react";
import { Radio, Select, Row, Col, Table, Card, Form, Button, Collapse, Icon, } from "antd";
import { getPositionList } from "../../../actions/riskmonitor";
import PositionTable from "./PositionTable";
import CcyPosiTable from "./CcyPosiTable";
import HedgeTable from "./HedgeTable";
import CounterPartyTable from "./CounterPartyTable";
import WebSocketClient from "../../../socket/WebSocketClient";
import {riskMonitorWebSocket} from "../../../../common/marketApi";
import { setRiskMonitor } from "../../../actions/clientFlow";
const Panel = Collapse.Panel;

const Option = Select.Option;

class TradingMoniter extends Component {

    constructor(props){
        super(props);
        this.state = {
            showWhichTable: "Position",

            initHeight: 0,
            contentHeight: 10, //这里不要给0，否则初始化时table的scrollY值为0，相当于没设scroll值，导致列表的列全部展开，再次设置scrollY值时无效

            tabValue: "Exposure",
        };
    }

    componentWillMount(){
        // this.props.getPositionList();
        // let _this = this;
        // WebSocketClient.connect();
        // this.riskMonitorWsId = WebSocketClient.subscribeMessage({
        //     mtype: riskMonitorWebSocket,
        //     callback: function(message){
        //         console.log("*********************");
        //         console.log("message: ", message);
        //         _this.handleSocketMsg(message);
        //     },
        //     // params:{instanceId:this.props.strategyParam},
        //     scope: _this
        // });
    }

    componentDidMount() {
        // const cardHeight = document.getElementById("riskMonitor").clientHeight;
        // this.setState({initHeight: cardHeight - 230}, ()=>{
        //     this.setTableHeight(this.props.showManualTrading, this.props.showRiskMonitor);
        // });
        this.setTableHeight(this.props.showManualTrading, this.props.showRiskMonitor, this);

        window.addEventListener("resize", ()=>{this.setTableHeight(this.props.showManualTrading, this.props.showRiskMonitor, this);});
    }

    onRadioChange = (e) => {
        this.setState({showWhichTable: e.target.value});
    };

    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return;
        };
        // WebSocketClient.unsubscribeMessage({ subscriptionId: this.riskMonitorWsId, mtype: riskMonitorWebSocket });
        this.props.setRiskMonitor(true);
    }

    onCollapseChange = () => {
        this.props.setRiskMonitor(!this.props.showRiskMonitor);
    };

    componentWillReceiveProps(nextProps) {
        // if (nextProps.showRiskMonitor){
        //     this.setTableHeight(nextProps.showManualTrading, nextProps.showRiskMonitor);
        // }
        this.setTableHeight(nextProps.showManualTrading, nextProps.showRiskMonitor, this);
    }

    setTableHeight = (showManualTrading, showRiskMonitor, thiz) => {
        if (showRiskMonitor) {
            try {
                const browserHeight = document.documentElement.clientHeight;
                // setTimeout(function () {
                let contentHeight;
                if (showManualTrading) {
                    contentHeight = (browserHeight - 50 - 15 - 80) / 2;
                } else {
                    contentHeight = (browserHeight - 50 - 15 - 80 - 2);
                }
                thiz.setState({contentHeight});
                // }, 0);
            }catch (e) {
                console.log(e);
            }

        }
    }

    handleRef = (thiz) => {
        this.position = thiz;
    }

    render() {
        const cardStyle = this.props.showRiskMonitor ? {flex: 1, margin:"0 5px 5px 0"} : { margin:"0 5px 5px 0"};
        const browserHeight = document.documentElement.clientHeight;
        const minHeight = (browserHeight - 50 - 15)/2;
        // console.log("minHeight:", minHeight);
        return (
            <Card id="riskMonitor" className="tradingCard" style={{minHeight: this.props.showRiskMonitor && minHeight, ...cardStyle}}>
                <div style={{
                    paddingLeft: 20,
                    height: 40,
                    background: "#3B3F42",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}>
                    <div style={{display:"flex",flex:1}}>
                        <div className="collapse-name">Risk Monitor</div>
                        <Radio.Group style={{marginLeft: 20}} value={this.state.tabValue} onChange={(e)=>{this.setState({tabValue: e.target.value});}}>
                            <Radio.Button className="tabButton" value="Exposure">Exposure</Radio.Button>
                            <Radio.Button className="tabButton" value="Position">Position</Radio.Button>
                        </Radio.Group>
                    </div>
                    <div style={{marginRight: 20}}>
                        <Icon className="icon-style-self" onClick={(e)=>{
                            this.position.refreshTable();
                        }} type="sync" style={{marginRight: 10, fontSize: 18}}/>
                        <Icon onClick={()=>{this.onCollapseChange();}} className="icon-style-self" type={this.props.showRiskMonitor ? "down" : "right"} />
                    </div>
                </div>
                {
                    <div style={{ display: this.props.showRiskMonitor ? "inherit" : "none"}}>
                        <div>
                            {/*{*/}
                            {/*    this.state.showWhichTable === "Position" ? <PositionTable handleRef={this.handleRef} tableHeight={this.state.contentHeight - 54}/> : this.state.showWhichTable === "Counter" ? <CounterPartyTable/> : <HedgeTable tableHeight={this.state.contentHeight - 160}/>*/}
                            {/*}*/}
                            {
                                this.state.tabValue === "Exposure" ? <PositionTable handleRef={this.handleRef} tableHeight={this.state.contentHeight - 54}/>:
                                    <CcyPosiTable handleRef={this.handleRef} tableHeight={this.state.contentHeight - 54}/>
                            }
                        </div>
                    </div>
                }

            </Card>
        );
    }
}

const mapStateToProps = state => ({
    positionList: state.riskMonitorReducer.positionList,
    showRiskMonitor: state.clientFlowReducer.showRiskMonitor,
    showManualTrading: state.clientFlowReducer.showManualTrading,
});

const mapDispatchToProps = dispatch => ({
    getPositionList: (params) => dispatch(getPositionList(params)),
    setRiskMonitor:(params) =>dispatch(setRiskMonitor(params)),
});
export default Form.create()(connect(mapStateToProps,mapDispatchToProps)(TradingMoniter));
