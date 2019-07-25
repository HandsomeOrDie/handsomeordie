import {connect} from "react-redux";
import React, {Component} from "react";
import {  Select, Table, Form, Row, Col, Button } from "antd";
import { getCounterPartyList } from "../../../actions/counterParty";
import WebSocketClient from "../../../socket/WebSocketClient";
import { ReferencePriceOutput, riskMonitorWebSocket} from "../../../../common/marketApi";

const Option = Select.Option;

class CounterPartyTable extends Component {

    componentDidMount(){
        this.props.getCounterPartyList();
        let _this = this;
        // WebSocketClient.connect();
        // console.log("111111111");
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
        // this.subIdMarketPrice = WebSocketClient.subscribeMessage({
        //     mtype: ReferencePriceOutput,
        //     // callback:_this.marketPriceCallback,
        //     // params: {symbol:window.location.hash.substring(34,40)},
        //     callback: function (message) {
        //         console.log("xxxxxxxxxxxx");
        //     },
        //     scope: _this
        // });
    }

    handleSocketMsg = (message) => {
        const result = message.result;
        let positionList = this.props.positionList;
        positionList.splice(positionList.findIndex(item => item.code === result.code), 1, result);
        this.props.updatePositionList(positionList);
    };

    componentWillUnmount(){
        // console.log("2222222");
        // WebSocketClient.unsubscribeMessage({ subscriptionId: this.riskMonitorWsId, mtype: riskMonitorWebSocket });
        // WebSocketClient.unsubscribeMessage({ subscriptionId: this.subIdMarketPrice, mtype: ReferencePriceOutput });
    }

    onTenorChange = (key, value) => {
        // this.props.getPositionList();
        console.log("---",value);
        const formValue = this.props.form.getFieldsValue();
        formValue[key] = value;
        console.log(formValue);
        this.props.getPositionList(formValue);
    };

    onResetClick = () => {
        this.props.form.resetFields();
        this.props.getPositionList();
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        const Option = Select.Option;
        return (
            <div>

            </div>
        );
    }
}

const mapStateToProps = state => ({
    counterPartyList: state.riskMonitorReducer.counterPartyList,
    loading: state.riskMonitorReducer.loading,
});

const mapDispatchToProps = dispatch => ({
    getCounterPartyList: (params) => dispatch(getCounterPartyList(params)),
});
export default Form.create()(connect(mapStateToProps,mapDispatchToProps)(CounterPartyTable));