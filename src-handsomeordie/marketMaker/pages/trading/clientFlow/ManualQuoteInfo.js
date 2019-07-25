import {connect} from "react-redux";
import React, {Component} from "react";
import {  Select, Table, Form, Row, Col, Button, Input, message, InputNumber } from "antd";
import { sendQuote, getQuoteSource, setManualQuoteList } from "../../../actions/manualQuote";
import "../../../../common/styles/marketPages/clientFlow.scss";

const Option = Select.Option;

class ManualQuoteInfo extends Component {
    state = {
        spreadValue: 0,
        skewValue: 0,
        sourceValue: undefined,

        askPxs: [],
        bidPxs: [],
        askQties: [],
        bidQties: [],

        quoteSource: [],

        acceptedMsg: false,
    };

    componentDidMount(){
        this.props.getQuoteSource(this.props.record.symbol, (result) => {
            const quoteSource = result.data;
            if (quoteSource.length > 0) {
                if (this.state.sourceValue) {
                    this.showBidAsk();
                } else {
                    const source = quoteSource[0].source;
                    const tradingType = quoteSource[0].tradingType;
                    this.setState({sourceValue: `${source}-${tradingType}-${this.props.record.symbol}`}, () => {
                        this.showBidAsk();
                    });
                }
                this.setState({quoteSource: quoteSource});
            }
        });
        this.props.handleRef(this);
    }

    showBidAsk = () => {
        let srclist = this.state.sourceValue.split("-");
        const quoteOutput = this.props.quoteOutput;
        // console.log("quoteOutput:", quoteOutput);
        if (quoteOutput) {
            // this.props.acceptMsg();
            // console.log("srclist: ", srclist);
            // console.log("quoteOutput: ", quoteOutput);
            // console.log(quoteOutput.bidPxs);
            // console.log("quoteOutput: ", quoteOutput);
            // console.log(quoteOutput.askPxs);
            const source = quoteOutput.source;
            const tradingType = quoteOutput.tradingType;
            const symbol = quoteOutput.symbol;
            if (srclist[0] === source && srclist[1] === tradingType && srclist[2] === symbol && quoteOutput.bidQties.length > 0 && quoteOutput.askPxs.length > 0) {
                let manualQuoteList = this.props.manualQuoteList;
                const record = this.props.record;
                if (!record.acceptedMsg) {
                    const index = manualQuoteList.findIndex(item => item.id === record.id);
                    if (index !== -1){
                        manualQuoteList[index].acceptedMsg = true;
                        this.props.setManualQuoteList([...manualQuoteList]);
                    }
                    // console.log("manualQuoteList:", manualQuoteList);
                }
                this.setState({bidPxs: quoteOutput.bidPxs, askPxs: quoteOutput.askPxs, bidQties: quoteOutput.bidQties, askQties: quoteOutput.askQties});
            }
        }
    };

    componentWillUnmount(){
        console.log(123);
    }

    componentWillReceiveProps (nextProps) {
        const quoteSource = this.state.quoteSource;
        // console.log("quoteSource:", quoteSource);
        if (quoteSource.length > 0) {
            // console.log(this.state.sourceValue);
            if (this.state.sourceValue){
                this.showBidAsk();
            } else {
                const source = quoteSource[0].source;
                const tradingType = quoteSource[0].tradingType;
                this.setState({sourceValue: `${source}-${tradingType}-${this.props.record.symbol}`}, () => {
                    this.showBidAsk();
                });
            }
        }
    }

    sendQuote = (cb) => {
        // console.log("GG");
        const record = this.props.record;
        let params = {};
        params.symbol = record.symbol;
        params.source = this.state.sourceValue && this.state.sourceValue.split("-")[0];
        params.tradingType = "RFQ";
        params.counterParty = record.counterParty;
        params.counterParty = record.counterParty;
        params.askPxs = this.state.askPxs;
        params.bidPxs = this.state.bidPxs;
        params.askQties = this.state.askQties;
        params.bidQties = this.state.bidQties;
        params.requestID = record.requestId;
        params.side = record.side;
        params.spreadValue = this.state.spreadValue;
        params.skewValue = this.state.skewValue;
        params.requestType = "RFQ";
        params.messageType = "QUOTE_DATA";
        params.mdEntryGroup = "";
        params.marketDataKey = "";
        this.props.sendQuote(params, function (response) {
            // console.log(response);
            if (response.success){
                message.success("Success！", 2);
                cb();
            } else {
                message.error("Failed！", 2);
            }
        });

    };

    render() {
        // console.log("this.state.bidPxs: ", this.state.bidPxs);
        // console.log("this.state.askPxs: ", this.state.askPxs);
        // console.log(this.props);
        const record = this.props.record;
        const { spreadValue, skewValue } = this.state;
        const { quoteSource } = this.state;
        return (
            <div>
                <div style={{height: 150, display: "flex", justifyContent: "flex-end"}}>
                    <div style={{display: "flex"}}>
                        <div style={{width: 50, display: "flex", justifyContent: "flex-start", alignItems: "flex-end", flexDirection: "column", marginRight: 20}}>
                            <div style={{fontWeight: "bold", marginRight: 8}}>Bid</div>
                            {
                                record.acceptedMsg && this.state.bidPxs.map((item, index) => {
                                    // if (index === 0) {
                                    //     return (
                                    //         <div key={index} style={{fontSize: 18, color: "#00ff00"}}>{item}</div>
                                    //     );
                                    // } else {
                                    return (
                                        <div key={index} style={{color: "#00ff00"}}>{item}</div>
                                    );
                                    // }
                                })
                            }
                        </div>
                        {/*<div style={{display: "flex", justifyContent: "flex-start", alignItems: "center", flexDirection: "column", marginRight: 10}}>*/}
                        {/*{*/}
                        {/*this.state.bidQties.map((item, index) => {*/}
                        {/*if (index === 0) {*/}
                        {/*return (*/}
                        {/*<div key={index} style={{fontSize: 18}}>{item}</div>*/}
                        {/*);*/}
                        {/*} else {*/}
                        {/*return (*/}
                        {/*<div key={index}>{item}</div>*/}
                        {/*);*/}
                        {/*}*/}
                        {/*})*/}
                        {/*}*/}
                        {/*</div>*/}
                        {/*<div style={{display: "flex", justifyContent: "flex-start", alignItems: "center", flexDirection: "column", marginRight: 10}}>*/}
                        {/*{*/}
                        {/*this.state.askQties.map((item, index) => {*/}
                        {/*if (index === 0) {*/}
                        {/*return (*/}
                        {/*<div key={index} style={{fontSize: 18}}>{item}</div>*/}
                        {/*);*/}
                        {/*} else {*/}
                        {/*return (*/}
                        {/*<div key={index}>{item}</div>*/}
                        {/*);*/}
                        {/*}*/}
                        {/*})*/}
                        {/*}*/}
                        {/*</div>*/}
                        <div style={{width: 50, display: "flex", justifyContent: "flex-start", alignItems: "flex-start", flexDirection: "column", marginRight: 10}}>
                            {/*<div style={{alignSelf: "center"}}>Offer</div>*/}
                            <div style={{fontWeight: "bold", marginLeft: 3}}>Offer</div>
                            {
                                record.acceptedMsg && this.state.askPxs.map((item, index) => {
                                    // if (index === 0) {
                                    //     return (
                                    //         <div key={index} style={{fontSize: 18, color: "red"}}>{item}</div>
                                    //     );
                                    // } else {
                                    return (
                                        <div key={index} style={{color: "red"}}>{item}</div>
                                    );
                                    // }
                                })
                            }
                        </div>
                    </div>
                    <div style={{display: "flex", }}>
                        <div style={{display: "flex", justifyContent: "center", alignItems: "center", marginLeft: 10, height: 30}}>
                            <div style={{marginRight: 5}}>+Spread</div>
                            <InputNumber min={0} onChange={(value)=>{
                                this.setState({spreadValue: value});
                            }} value={spreadValue} size="small" style={{width: 60, padding: 0, textAlign: "center", marginRight: 5}} />
                            {/*<div style={{marginRight: 10}}>*/}
                            {/*<div className="arrow-hover" onClick={()=>{*/}
                            {/*this.setState({spreadValue: spreadValue + 1});*/}
                            {/*}}>︿</div>*/}
                            {/*<div className="arrow-hover" onClick={()=>{*/}
                            {/*this.setState({spreadValue: spreadValue - 1});*/}
                            {/*}}>﹀</div>*/}
                            {/*</div>*/}
                        </div>
                        <div style={{display: "flex", justifyContent: "center", alignItems: "center", marginLeft: 10, height: 30}}>
                            <div style={{marginRight: 5}}>+Skew</div>
                            <InputNumber onChange={(value)=>{
                                if (typeof value === "string"){
                                    return;
                                }
                                if (typeof value === "undefined"){
                                    value = 0;
                                }
                                this.setState({skewValue: value});
                            }} defaultValue={skewValue} value={skewValue} size="small" style={{width: 60, padding: 0, textAlign: "center", marginRight: 5}} />
                            {/*<div style={{marginRight: 20}}>*/}
                            {/*<div className="arrow-hover" onClick={()=>{*/}
                            {/*this.setState({skewValue: skewValue + 1});*/}
                            {/*}}>︿</div>*/}
                            {/*<div className="arrow-hover" onClick={()=>{*/}
                            {/*this.setState({skewValue: skewValue - 1});*/}
                            {/*}}>﹀</div>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                    <div style={{display: "flex", justifyContent: "center", alignItems: "center", marginLeft: 10, height: 30}}>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <div style={{marginRight: 5, display: "flex", alignItems: "center"}}><div>Pricing</div></div>
                            <Select size="small" style={{width: 90}} defaultValue="streaming" className="qit-select-bg">
                                <Option value="streaming">Streaming</Option>
                            </Select>
                        </div>
                        <div style={{display: "flex", marginLeft: 10, justifyContent: "center"}}>
                            <div style={{marginRight: 5, display: "flex", alignItems: "center"}}><div>Quotes</div></div>
                            <Select size="small" style={{width: 110,}} value={this.state.sourceValue} onChange={(val)=>{this.setState({sourceValue: val}, ()=> {this.showBidAsk();});}} className="qit-select-bg">
                                {
                                    quoteSource.map((item,index)=>(
                                        <Option key={index} value={`${item.source}-${item.tradingType}-${this.props.record.symbol}`}>{item.displayName}</Option>
                                    ))
                                }
                            </Select>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    quoteSource: state.manualQuoteReducer.quoteSource,
    quoteOutput: state.manualQuoteReducer.quoteOutput,
    manualQuoteList: state.manualQuoteReducer.manualQuoteList,
});

const mapDispatchToProps = dispatch => ({
    getQuoteSource:(params, cb) => dispatch(getQuoteSource(params, cb)),
    sendQuote:(params, cb) => dispatch(sendQuote(params, cb)),
    setManualQuoteList:(list, cb) => dispatch(setManualQuoteList(list, cb)),

});
export default Form.create()(connect(mapStateToProps,mapDispatchToProps)(ManualQuoteInfo));