import {connect} from "react-redux";
import React, {Component} from "react";
import {Collapse, Tabs, Row, Col, Card, Icon} from "antd";
import CounterParty from "./CounterParty";
import PricingGroups from "./PricingGroups";
import {getSelectValue, setMarketRisk, showMarket, showOperation} from "../../../actions/marketRisk";
const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;
class CreditMng extends Component {
    state = {
        operation: "",
        marketHeight: 0,
        operationHeight: 0,
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
    }

    render() {
        const cardHeight = document.documentElement.clientHeight - 50 - 52;
        return (
            <div style={{display: "flex", flex: "1",margin:10, height: cardHeight-40}}>
                <CounterParty/>
                <PricingGroups cardHeight={cardHeight}/>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    showMarket: state.marketRiskReducer.showMarket,
    showOperation: state.marketRiskReducer.showOperation,
});

const mapDispatchToProps = dispatch => ({
    setMarket: (params) => dispatch(showMarket(params)),
    setOperation: (params) => dispatch(showOperation(params)),
});
export default connect(mapStateToProps,mapDispatchToProps)(CreditMng);