import {connect} from "react-redux";
import React, {Component} from "react";
import {Collapse, Tabs, Row, Col, Card, Icon} from "antd";
import AlertsMonitor from "./AlertsMonitor";
import MarketRisk from "./MarketRisk";
class RiskMonitorMain extends Component {
    state = {
        
    }

    componentDidMount() {
        
    }

    componentWillReceiveProps(nextProps) {

    }

    render() {
        // const cardHeight = document.documentElement.clientHeight - 50 - 57;
        return (
            <div style={{display: "flex"}}>
                {/*<div style={{display: "flex",flex: "1", height: cardHeight, marginTop: 5}}>*/}
                <div style={{flex: 1, marginRight: 10}}>
                    <MarketRisk/>
                </div>
                <div style={{flex: 1}}>
                    <AlertsMonitor/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    
});

const mapDispatchToProps = dispatch => ({
    
});

export default connect(mapStateToProps,mapDispatchToProps)(RiskMonitorMain);