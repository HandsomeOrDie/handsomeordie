import {connect} from "react-redux";
import React, {Component} from "react";
import {Collapse, Tabs, Row, Col, Card, Icon} from "antd";
import MarketRisk from "./MarketRisk";
import OperationRisk from "./OperationRisk";
import {getSelectValue, setMarketRisk, showMarket, showOperation} from "../../../../actions/marketRisk";
const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;
class RiskMng extends Component {
    state = {
        operation: "",
        marketHeight: 0,
        operationHeight: 0,
    }

    componentDidMount() {
        // console.log([][1].index);
        this.setTableHeight(this.props.showMarket, this.props.showOperation, this);
    }

    onMarketChange = () => {
        this.props.setMarket(!this.props.showMarket);
    };
    onOperationChange = () => {
        this.props.setOperation(!this.props.showOperation);
    };

    componentWillReceiveProps(nextProps) {
        this.setTableHeight(nextProps.showMarket, nextProps.showOperation, this);
    }

    setTableHeight = (showMarket, showOperation, thiz) => {
        const browserHeight = document.documentElement.clientHeight;
        let marketHeight = 0;
        let operationHeight = 0;
        const halfHeight = (browserHeight - 50 - 20 - 120 - 40)/2 - 75;
        const fullHeight = (browserHeight - 50 - 20 - 80 - 20 - 40) - 75;
        if (showMarket){
            setTimeout(function () {
                if (showOperation){
                    marketHeight = halfHeight;
                    operationHeight = halfHeight;
                } else {
                    marketHeight = fullHeight;
                }
                thiz.setState({marketHeight, operationHeight});
            }, 300);
        }else {
            setTimeout(function () {
                if (showOperation){
                    operationHeight = fullHeight;
                }
                thiz.setState({marketHeight, operationHeight});
            }, 300);
            //
        }
    };

    render() {
        let marketStyle;
        let operationStyle;
        const showMarket = this.props.showMarket;
        const showOperation = this.props.showOperation;
        if (showMarket){
            if (showOperation){
                marketStyle = { marginTop: 5, flex: 1};
                operationStyle = { marginTop: 5, flex: 1};
            } else {
                marketStyle = { marginTop: 5, flex: 1};
                operationStyle = { marginTop: 5,};
            }
        } else {
            if (showOperation){
                marketStyle = { marginTop: 5};
                operationStyle = { marginTop: 5, flex: 1};
            } else {
                marketStyle = { marginTop: 5};
                operationStyle = { marginTop: 5};
            }
        }
        const cardHeight = document.documentElement.clientHeight - 50 - 13;
        // style={{display: "flex", flexDirection: "column", }}
        return (
            <div style={{display: "flex", flex: "1", flexDirection: "column", height: cardHeight-40}}>
                <Card style={marketStyle}>
                    <Collapse bordered={false} defaultActiveKey={["1"]} onChange={()=>{this.onMarketChange();}}>
                        <Panel header={<div><span className="collapse-name">Market Risk Rule Engine</span></div>} key="1">
                            <MarketRisk tableHeight={this.state.marketHeight}/>
                        </Panel>
                    </Collapse>
                </Card>
                <Card style={operationStyle}>
                    <Collapse bordered={false} defaultActiveKey={["1"]} onChange={()=>{this.onOperationChange();}}>
                        <Panel header={<div><span className="collapse-name">Operation Risk Engine Rule</span></div>} key="1">
                            <OperationRisk tableHeight={this.state.operationHeight}/>
                        </Panel>
                    </Collapse>
                </Card>
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
export default connect(mapStateToProps,mapDispatchToProps)(RiskMng);