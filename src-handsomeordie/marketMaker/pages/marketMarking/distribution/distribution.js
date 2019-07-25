import { connect } from "react-redux";
import React, { Component } from "react";
import { Row, Col, Icon, message, Modal, Card } from "antd";

import { getDistributionListByInstanceId, saveDistribution, deleteDistributionById, getQuoteSourceList } from "../../../actions/distribution";
import DistributionItem from "./distributionItem.js";
import AddDistributionContent from "./addDistributionContent";
import WebSocketClient from "../../../socket/WebSocketClient";

import * as ActionTypes from "../../../constants/ActionTypes";


class Distribution extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowIndex: -1,
            dataSource: []
        };
    }

    componentWillMount() {
        const _this = this;
        if (this.props.instanceId) {
            this.props.getDistributionListByInstanceId(this.props.instanceId, function (data) {
                _this.setState({dataSource: data});
            });
        }

        if (!this.props.quoteSourceList || this.props.quoteSourceList.length === 0) {
            this.props.getQuoteSourceList();
        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        // console.log("nextProps.instanceId:", nextProps.instanceId);
        const _this = this;
        if (nextProps.instanceId && this.props.instanceId !== nextProps.instanceId) {
            this.props.getDistributionListByInstanceId(nextProps.instanceId, function (data) {
                _this.setState({dataSource: data});
            });
            // return;
        }

        if (nextProps.lastActionType === ActionTypes.SAVE_QUOTE) {
            this.updateQuote();
            // return;
        }

        if (JSON.stringify(this.props.distributionList) === JSON.stringify(nextProps.distributionList)) {
            // no change
            // return;
        }

        let selectedRowIndex = this.state.selectedRowIndex;
        switch (nextProps.lastActionType) {
        case ActionTypes.GET_DISTRIBUTION_LIST_BY_INSTANCE_ID:
            selectedRowIndex = -1;
            break;
        case ActionTypes.SAVE_DISTRIBUTION:
            break;
        case ActionTypes.ADD_DISTRIBUTION:
            selectedRowIndex = nextProps.distributionList.length - 1;
            break;
        case ActionTypes.DELETE_DISTRIBUTION_BY_ID:
            selectedRowIndex = selectedRowIndex === nextProps.distributionList.length ?
                nextProps.distributionList.length - 1 : selectedRowIndex;
            break;
        }


        // console.log(this.props.instanceId);
        // console.log(nextProps.instanceId);
        // console.log(nextProps.distributionList);
        // if (this.props.instanceId !== nextProps.instanceId){
        //     console.log("222");
        //     let dataSource = JSON.parse(JSON.stringify(nextProps.distributionList));

        this.setState({
            selectedRowIndex: selectedRowIndex,
            // dataSource: dataSource
        },()=>{
            this.updateQuote();
        });
        // } else {
        //     this.setState({
        //         selectedRowIndex: selectedRowIndex,
        //     },()=>{
        //         this.updateQuote();
        //     });
        // }

    }

    updateQuote = () => {
        let dataSource = this.state.dataSource;
        let distributionQuoteList = this.props.distributionQuoteList;
        if (dataSource.length > 0 && distributionQuoteList.length > 0) {
            let changed = false;
            for (let i = 0; i < dataSource.length; i++) {
                let dataItem = dataSource[i];
                let matchedQuotes = distributionQuoteList.filter(item => item.generateBy == dataItem.id);
                if (matchedQuotes && matchedQuotes.length > 0) {
                    // console.log(111);
                    let matchedQuote = matchedQuotes[0];
                    // console.log(matchedQuote);
                    let askPrice = matchedQuote.askPxs;
                    let askQties = matchedQuote.askQties;
                    let bidPrice = matchedQuote.bidPxs;
                    let bidQties = matchedQuote.bidQties;
                    if (JSON.stringify(dataItem.askPrice) !== JSON.stringify(askPrice) || JSON.stringify(dataItem.bidPrice) !== JSON.stringify(bidPrice)) {
                        changed = true;
                        dataItem.askPrice = askPrice;
                        dataItem.askQties = askQties;
                        dataItem.bidPrice = bidPrice;
                        dataItem.bidQties = bidQties;
                    }
                }
            }
            this.setState({
                dataSource: dataSource
            });
        }
    }

    addMenuClick = () => {
        let emptyDistribution = {
            status: "STOPPED",
            noLiquidity: "HALT",
            instanceId: this.props.instanceId
        };
        if (this.props.quoteSourceList && this.props.quoteSourceList.length > 0) {
            let firstQuoteSource = this.props.quoteSourceList[0];
            let source = firstQuoteSource.code;
            let tradingType = firstQuoteSource.tradingTypes.split(",")[0];
            emptyDistribution.source = source;
            emptyDistribution.tradingType = tradingType;
        }
        this.state.dataSource.push(emptyDistribution);
        this.setState({
            dataSource: this.state.dataSource,
            selectedRowIndex: this.state.dataSource.length - 1
        });
    }
    deleteMenuClick = () => {
        let selectedRowIndex = this.state.selectedRowIndex;
        if (selectedRowIndex >= 0 && selectedRowIndex < this.state.dataSource.length) {
            let selectedItem = this.state.dataSource[selectedRowIndex];
            this.state.dataSource.splice(selectedRowIndex, 1);
            if (selectedRowIndex === this.state.dataSource.length) {
                selectedRowIndex = selectedRowIndex - 1;
            }
            this.setState({
                dataSource: this.state.dataSource,
                selectedRowIndex: selectedRowIndex
            });

            if (selectedItem.id) {
                this.props.deleteDistributionById(selectedItem.id);
            }
        }

    }

    onCreateCancel = (index) => {
        let currentSelectedItem = this.state.dataSource[index];
        if (!currentSelectedItem.id) {
            this.state.dataSource.splice(this.state.selectedRowIndex, 1);
            if (index === this.state.dataSource.length) {
                index = index - 1;
            }
            this.setState({
                dataSource: this.state.dataSource,
                selectedRowIndex: index
            });
        } else {
            console.error("Edit mode does not support cancel");
        }
    }

    onDistributionItemSave = (distributionItem) => {
        if (!this.validateDistributionItem(distributionItem)) {
            return false;
        }

        if (!distributionItem.id &&
            (distributionItem.tradingType === "ESP" || distributionItem.tradingType === "ODM")) {
            let sameTransactionModeItemCount = this.props.distributionList.filter(item => item.tradingType === distributionItem.tradingType
                && item.source === distributionItem.source).length;
            if (sameTransactionModeItemCount > 1) {
                message.error("There is already a distribution with the same transaction mode " + distributionItem.tradingType + "in the source " + distributionItem.source);
                return;
            }
        }
        
        const _this = this;
        this.props.saveDistribution(distributionItem, function () {
            _this.props.getDistributionListByInstanceId(_this.props.instanceId, function (data) {
                _this.setState({dataSource: data});
            });
        });
        return true;
    }

    onDistributionItemClick = (index) => {
        this.setState({
            selectedRowIndex: index
        });
    }

    prepareModeSourceList = () => {
        let modeSourceList = [];
        if (this.props.quoteSourceList && this.props.quoteSourceList.length > 0) {
            this.props.quoteSourceList.forEach(quoteSourceItem => {
                let tradingTypeArray = quoteSourceItem.tradingTypes.split(",");
                if (tradingTypeArray.length > 0) {
                    tradingTypeArray.forEach(tradingType => {
                        let modeSource = quoteSourceItem.code + " " + tradingType;
                        modeSourceList.push(modeSource);
                    });
                }
            });
        }
        return modeSourceList;
    }

    validateDistributionItem = (distributionItem) => {
        const isNull = (value) => {
            return value === undefined || value === null || value === "";
        };
        if (isNull(distributionItem.tradingType)) {
            message.error("Transaction mode is required");
            return false;
        }

        if (isNull(distributionItem.displayName)) {
            message.error("DisplayName is required");
            return false;
        }

        if (isNull(distributionItem.spread)) {
            message.error("Spread is required");
            return false;
        }

        if (isNull(distributionItem.skew)) {
            message.error("Skew is required");
            return false;
        }

        if (isNull(distributionItem.skew)) {
            message.error("Skew is required");
            return false;
        }
        if (isNull(distributionItem.noLiquidity)) {
            message.error("No Liquidity is required");
            return false;
        }
        if (isNull(distributionItem.freq)) {
            message.error("Freq is required");
            return false;
        }

        if (isNull(distributionItem.thresholdSpread)) {
            message.error("Threshold Spread is required");
            return false;
        }

        if (isNull(distributionItem.thresholdMove)) {
            message.error("Threshold Move is required");
            return false;
        }

        if (distributionItem.tradingType === "RFQ"
            || distributionItem.tradingType === "RFS") {
            let counterParties = distributionItem.counterParties || [];
            let counterPartyGroups = distributionItem.counterPartyGroups || [];
            if (counterParties.length === 0 && counterPartyGroups.length === 0) {
                message.error("Counter party is required");
                return false;
            }
        }
        
        if (this.props.distributionList.filter(item =>
            item.displayName === distributionItem.displayName
            && item.tradingType === distributionItem.tradingType
            && item.source === distributionItem.source
            && (!distributionItem.id || distributionItem.id !== item.id)).length > 1) {
            message.error("Display Name in the same mode & source is unique");
            return false;
        }

        return true;
    }
    componentWillUnmount() {
        this.setState = (state,callback)=>{
            return;
        };
    }

    render() {

        const dataSource = this.state.dataSource || [];
        const modeSourceList = this.prepareModeSourceList();
        const disHeight = (document.documentElement.clientHeight - 70) * 2 / 5 - 50;
        // console.log(dataSource);
        return (
            <Card
                style={{
                    height: 250,
                    marginTop: 5,
                    marginBottom: 5,
                    display:"flex",flexDirection:"column"
                }}
                headStyle={{color:"#fff"}} size="small" title="Distribution"
                bodyStyle={{overflow:"auto" }}
                extra={
                    <div className="menu-wrapper">
                        <Icon onClick={this.addMenuClick} type="plus-square" />
                        <Icon onClick={this.deleteMenuClick} className="second-icon" type="minus-square" />
                    </div>
                } className="distribution-wrapper">
                {/* <div className="title-wrapper">
                    <Row type="flex" justify="space-between">
                        <div className="distribution-title">Distribution</div>
                        
                    </Row>
                </div> */}
                <div className="list-wrapper" ref="listWrapper">
                    <div className={"no-data-wrapper" + (dataSource.length ? " hidden" : "")}> No Data </div>
                    {
                        dataSource.map((dataItem, index) => (
                            <DistributionItem onClick={() => {
                                this.onDistributionItemClick(index);
                            }}
                            selected={index === this.state.selectedRowIndex}
                            onSave={this.onDistributionItemSave}
                            selectedRowIndex={this.state.selectedRowIndex}
                            distributionList={dataSource}
                            dataSource={dataItem}
                            modeDataSource={modeSourceList}
                            key={index}
                            onCreateCancel={() => {
                                this.onCreateCancel(index);
                            }} />
                        ))
                    }
                </div>
            </Card>

        );
    }
}

const mapStateToProps = state => {
    return {
        distributionList: state.Distribution && state.Distribution.distributionList,
        lastActionType: state.Distribution && state.Distribution.lastActionType,
        instanceId: state.paramReducer && state.paramReducer.strategyParam && state.paramReducer.strategyParam.instanceId,
        distributionQuoteList: state.Distribution && state.Distribution.distributionQuoteList,
        quoteSourceList: state.Distribution && state.Distribution.quoteSourceList,
    };
};

const mapDispatchToProps = dispatch => ({
    getDistributionListByInstanceId: (instanceId, cb) => dispatch(getDistributionListByInstanceId(instanceId, cb)),
    saveDistribution: (distributionItem, cb) => dispatch(saveDistribution(distributionItem, cb)),
    deleteDistributionById: (id) => dispatch(deleteDistributionById(id)),
    getQuoteSourceList: () => dispatch(getQuoteSourceList())
});
export default connect(mapStateToProps, mapDispatchToProps)(Distribution);