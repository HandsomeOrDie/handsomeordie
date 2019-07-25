import {connect} from "react-redux";
import React, {Component} from "react";
import {Card, Tabs, Collapse, Icon} from "antd";
import {setManualTrading} from "../../../actions/clientFlow";
import RFQ from "./rfq";
import ODM from "./odm";
import ESP from "./esp";
import Sweepable from "./sweepable";

class ManualTradingQuoteRequestPost extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
        };
    }

    componentDidMount() {
        this.setTableHeight(this.props.showManualTrading, this.props.showRradeBlotter, this);
        window.addEventListener("resize", ()=>{this.setTableHeight(this.props.showManualTrading, this.props.showRradeBlotter, this);});
    }

    componentWillUnmount(){
        this.props.setManualTrading(true);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setTableHeight(nextProps.showManualTrading, nextProps.showRradeBlotter, this);
    }

    setTableHeight = (showManualTrading, showRradeBlotter, thiz) => {
        if (showManualTrading){
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
                // }, 300);
            }catch (e) {
                console.log(e);
            }
        }
    };

    onCollapseChange = () => {
        this.props.setManualTrading(!this.props.showManualTrading);
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
                    <div><span className="collapse-name">Manual Trading</span></div>
                    <div style={{marginRight: 20}}><Icon onClick={()=>{this.onCollapseChange();}} type={this.props.showManualTrading ? "down" : "right"} /></div>
                </div>
                {
                    <div style={{display: this.props.showManualTrading ? "inherit" : "none"}}>
                        <Tabs animated={false} className="manualTradingTabs" tabBarStyle={{background:"#979797"}} size="small" defaultActiveKey="1">
                            <TabPane tab="ODM" key="1">
                                <ODM contentHeight={this.state.contentHeight - 39}/>
                            </TabPane>
                            <TabPane tab="ESP" key="2">
                                <ESP contentHeight={this.state.contentHeight - 39}/>
                            </TabPane>
                            <TabPane tab="SWEEPABLE" key="3">
                                <Sweepable contentHeight={this.state.contentHeight - 39}/>
                            </TabPane>
                            <TabPane tab="RFQ" key="4">
                                <RFQ contentHeight={this.state.contentHeight - 39}/>
                            </TabPane>
                        </Tabs>
                    </div>
                }
            </Card>
        );
    }
}

const mapStateToProps = state => ({
    showManualTrading: state.clientFlowReducer.showManualTrading,
    showRradeBlotter: state.clientFlowReducer.showRradeBlotter,
});

const mapDispatchToProps = dispatch => ({
    setManualTrading:(params, cb) =>dispatch(setManualTrading(params, cb)),
});

export default connect(mapStateToProps,mapDispatchToProps)(ManualTradingQuoteRequestPost);