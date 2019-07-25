import {connect} from "react-redux";
import React, {Component} from "react";
import {Icon, Card, Collapse, Radio} from "antd";
import {checkLogin} from "../../../actions/marketDetail";
import ClientFlowTable from "./ClientFlowTable";
import ManualTable from "./ManualTable";
import { getManualQuoteList } from "../../../actions/manualQuote";
import { setClientFlow } from "../../../actions/clientFlow";
import "../../../../common/styles/marketPages/clientFlow.scss";
import "../../../../common/styles/marketPages/trading.scss";
const Panel = Collapse.Panel;
class ClientFlow extends Component {
    constructor(props){
        super(props);
        this.state = {
            showManualTable: true,
            contentHeight: 0,
            initHeight: 0,
            tab: "pending"
        };
    }
    componentWillMount(){
    }
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return;
        };
        this.props.setClientFlow(true);
    }
    componentDidMount() {
        // const cardHeight = document.getElementById("clientFlow").clientHeight;
        // // const del = this.state.showManualTable ? 150 : 180;
        // this.setState({initHeight: cardHeight}, ()=>{
        //     this.setTableHeight(this.props.showClientFlow, this.props.showRradeBlotter);
        // });

        this.props.getManualQuoteList({
            params: {
                statusIn: ["RFQ", "LASTLOOK"],
                direction: 2
            }
        });

        this.setTableHeight(this.props.showClientFlow, this.props.showRradeBlotter, this);
        window.addEventListener("resize", ()=>{this.setTableHeight(this.props.showClientFlow, this.props.showRradeBlotter, this);});
    }

    onCollapseChange = () => {
        this.props.setClientFlow(!this.props.showClientFlow);
    };

    componentWillReceiveProps(nextProps) {
        // if (nextProps.showClientFlow){
        //     this.setTableHeight(nextProps.showClientFlow, nextProps.showRradeBlotter);
        // }
        this.setTableHeight(nextProps.showClientFlow, nextProps.showRradeBlotter, this);
    }

    setTableHeight = (showClientFlow, showRradeBlotter, thiz) => {
        if (showClientFlow){
            const browserHeight = document.documentElement.clientHeight;
            try {
                // setTimeout(function () {
                let contentHeight;
                if (showRradeBlotter){
                    contentHeight = (browserHeight - 50 - 15 - 80)/2;
                } else {
                    contentHeight = (browserHeight - 50 - 15 - 80 - 2);
                }
                thiz.setState({contentHeight});
                // }, 0);
            }catch (e) {
                console.log(e);
            }

        }
        // const _this = this;
        // //这里是为了优化两个Collapse都展开的渲染，直接从state获取高度值，消除卡顿
        // if (showClientFlow && showRradeBlotter) {
        //     this.setState({tableHeight: this.state.initHeight});
        // }else {
        //     setTimeout(function () {
        //         // const del = _this.state.showManualTable ? 150 : 180;
        //         const cardHeight = document.getElementById("clientFlow").clientHeight;
        //         let tableHeight = cardHeight;
        //         _this.setState({tableHeight: tableHeight});
        //     }, 300);
        // }
    };

    handleRef = (thiz) => {
        this.manual = thiz;
    }
    onTabChange = (e) => {
        this.setState({ tab: e.target.value },()=>{
            if(e.target.value==="pending"){
                this.props.getManualQuoteList({
                    params: {
                        statusIn: ["RFQ", "LASTLOOK"],
                        direction: 2
                    }
                });
            }
            if(e.target.value==="quotes"){
                this.props.getManualQuoteList({
                    params: {
                        statusIn: ["QUOTED"],
                        direction: 2
                    }
                });
            }
            if(e.target.value==="confirmed"){
                this.props.getManualQuoteList({
                    params: {
                        statusIn: ["ACCEPTED", "REJECTED"],
                        direction: 2
                    }
                });
            }
        });
    }

    render() {
        const {tab} = this.state;
        const browserHeight = document.documentElement.clientHeight;
        const minHeight = (browserHeight - 50 - 15)/2;
        const cardStyle = this.props.showClientFlow ? {flex: 1, margin:5, minHeight: this.props.showRradeBlotter && minHeight} : { margin: 5};
        return (
            <Card id="clientFlow" className="tradingCard" style={cardStyle}>
                <div style={{
                    paddingLeft: 20,
                    height: 40,
                    background: "#3B3F42",
                    display: "flex",
                    alignItems: "center",
                }}>
                    <div style={{display:"flex",flex:1}}>
                        <div style={{marginRight:20}}><span className="collapse-name">Client Flow ( {this.props.totalCount?this.props.totalCount:0} )</span></div>
                        <Radio.Group value={tab} onChange={this.onTabChange}>
                            <Radio.Button className="tabButton" value="pending">Pending</Radio.Button>
                            <Radio.Button className="tabButton" value="quotes">Quotes</Radio.Button>
                            <Radio.Button className="tabButton" value="confirmed">Confirmed</Radio.Button>
                        </Radio.Group>
                    </div>
                    <div style={{marginRight: 20}}>
                        <Icon className="icon-style-self" onClick={(e)=>{
                            this.props.getManualQuoteList({
                                params: {
                                    statusIn: tab==="pending"?["RFQ", "LASTLOOK"]:tab==="quotes"?["QUOTED"]:tab==="confirmed"?["ACCEPTED", "REJECTED"]:[],
                                    direction: 2
                                }
                            });
                        }} type="sync" style={{marginRight: 10, fontSize: 18}}/>
                        <Icon onClick={()=>{this.onCollapseChange();}} className="icon-style-self" type={this.props.showClientFlow ? "down" : "right"} />
                    </div>
                </div>
                {
                    <div style={{ display: this.props.showClientFlow ? "inherit" : "none"}}>
                        <div>
                            {/* <Radio.Group defaultValue="manual" buttonStyle="solid" onChange={()=>{this.setState({showManualTable: !this.state.showManualTable});}}>
                                <Radio.Button value="manual">Manual Quoting Rules</Radio.Button>
                                <Radio.Button value="auto">Auto Quoting Rules</Radio.Button>
                            </Radio.Group> */}
                        </div>
                        <div>

                            {/* this.state.showManualTable ? <ManualTable tableHeight={this.state.contentHeight - 54 }/> : <ClientFlowTable tableHeight={this.state.contentHeight - 110 - 45}/> */}
                            {
                                <ManualTable tab={tab} handleRef={this.handleRef} tableHeight={this.state.contentHeight - 54 }/>
                            }
                        </div>
                    </div>
                }
            </Card>
        );
    }
}

const mapStateToProps = state => ({
    showClientFlow: state.clientFlowReducer.showClientFlow,
    showRradeBlotter: state.clientFlowReducer.showRradeBlotter,
    totalCount: state.manualQuoteReducer.manualQuoteList.length,
});

const mapDispatchToProps = dispatch => ({
    getManualQuoteList:(params) => dispatch(getManualQuoteList(params)),
    checkLogin:(cb) =>dispatch(checkLogin(cb)),
    setClientFlow:(params, cb) =>dispatch(setClientFlow(params, cb)),
});
export default connect(mapStateToProps,mapDispatchToProps)(ClientFlow);