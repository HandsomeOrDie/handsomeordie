import {connect} from "react-redux";
import React, {Component} from "react";
import {Collapse, Tabs, Row, Col, Card, Icon} from "antd";
import AlertsMonitor from "./alertsMonitor";
import MarketRiskMOnitor from "./marketRiskMOnitor";
class RiskMonitorMain extends Component {
    state = {
        
    }

    componentDidMount() {
        
    }

    componentWillReceiveProps(nextProps) {

    }

    render() {
        const cardHeight = document.documentElement.clientHeight - 5 - 57;
        return (
            <div style={{display: "flex",flex: "1", height: cardHeight-1,width:"100%",overflow:"auto" }}>
                <MarketRiskMOnitor/>
                <AlertsMonitor/>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    
});

const mapDispatchToProps = dispatch => ({
    
});

export default connect(mapStateToProps,mapDispatchToProps)(RiskMonitorMain);