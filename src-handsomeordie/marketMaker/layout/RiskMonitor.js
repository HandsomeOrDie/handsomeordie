import {connect} from "react-redux";
import React, {Component} from "react";
import {Layout, Tabs, Row, Col, Card} from "antd";
import RiskMng from "../pages/riskMonitor/riskMng";
import CreditMng from "../pages/riskMonitor/creditMng";
import RiskMonitorMain from "../pages/riskMonitor/riskMonitor";
import "../../common/styles/marketPages/riskMonitor.scss";
import { DragDropContext, DragSource, DropTarget } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
const TabPane = Tabs.TabPane;

class RiskMonitor extends Component {
    state = {
    }
   
    render() {
        const cardHeight = document.documentElement.clientHeight - 50 - 13;
        return (
            <div style={{ margin: 5}}>
                {/* <Card bodyStyle={{height: cardHeight,}}> */}
                {/*<Tabs className="risk-tabs" onChange={()=>{}} defaultActiveKey={"1"} type="card">*/}
                {/*<TabPane tab="Risk Monitor" key="1">*/}
                <RiskMonitorMain/>
                {/*</TabPane>*/}
                {/*<TabPane tab="Risk Management" key="2">*/}
                {/*<RiskMng/>*/}
                {/*</TabPane>*/}
                {/*<TabPane tab="Credit Management" key="3" >*/}
                {/*<CreditMng/>*/}
                {/*</TabPane>*/}
                {/*</Tabs>*/}
                {/* </Card> */}
            </div>
        );
    }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});
export default DragDropContext(HTML5Backend)(connect(mapStateToProps,mapDispatchToProps)(RiskMonitor));