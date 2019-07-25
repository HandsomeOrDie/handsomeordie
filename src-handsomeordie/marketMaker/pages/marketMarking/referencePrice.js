import { connect } from "react-redux";
import React, { Component } from "react";
import { Row, Col, Icon, message, Card } from "antd";
import { formatDispay } from "../../utils/commonFun";

import { getCorePriceById, changeSourceInitStatus } from "../../actions/corePrice";


class ReferencePrice extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    formatPriceCount = (count) => {
        // if (count > 1000 * 1000 * 1000) {
        //     return (count/1000/1000/1000).toFixed(0) + "G";
        // }
        if (count >= 1000 * 1000) {
            return (count/1000/1000).toFixed(0) + "M";
        }

        // if (count > 1000) {
        //     return (count/1000).toFixed(0) + "K";
        // }

        return count;
    }

    preparePriceDataSource = () => {
        let priceDataSource = {
            bestPriceInfo: {
                bestBidPrice: undefined,
                bestAskPrice: undefined,
                spread: undefined
            },
            spread: undefined,
            bidPriceList: [],
            askPriceList: []
        };

        let referencePriceData = this.props.referencePriceData;
        if (referencePriceData && referencePriceData.askPxs) {
            priceDataSource.bestPriceInfo.bestBidPrice = referencePriceData.bidPxs[0];
            priceDataSource.bestPriceInfo.bestAskPrice = referencePriceData.askPxs[0];
            priceDataSource.spread = referencePriceData.spread;

            referencePriceData.bidPxs.forEach((bidPrice, index) => {
                let bidPriceInfo = {
                    dateTime: referencePriceData.timeInLocal,
                    count: this.formatPriceCount(referencePriceData.bidQties[index]),
                    price: bidPrice
                };
                priceDataSource.bidPriceList.push(bidPriceInfo);
            });
            referencePriceData.askPxs.forEach((askPrice, index) => {
                let askPriceInfo = {
                    dateTime: referencePriceData.timeInLocal,
                    count: this.formatPriceCount(referencePriceData.askQties[index]),
                    price: askPrice
                };
                priceDataSource.askPriceList.push(askPriceInfo);
            });
        }
        return priceDataSource;
    }

    componentWillMount() {
        if (this.props.referenceConfigId) {
            this.props.getCorePriceById(this.props.referenceConfigId);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.referenceConfigId !== nextProps.referenceConfigId) {
            this.props.getCorePriceById(nextProps.referenceConfigId);
        }
    }

    setStatusForSourceItem = (sourceItem) => {
        if (this.props.referencePriceData
            && this.props.referencePriceData.mktPxInfos
            && this.props.referencePriceData.mktPxInfos) {
            this.props.referencePriceData.mktPxInfos.forEach((mktPxInfo) => {
                if (sourceItem.mktPxConfigId === parseInt(mktPxInfo.configId)) {
                    sourceItem.status = mktPxInfo.status;
                    // sourceItem.init = mktPxInfo.enable === "true" ? true : false;
                }
            });
        }
    }

    prepareGroupTableDataSource = () => {
        let groupTableDataSource = [];
        if (this.props.dataSource
            && this.props.dataSource.referencePriceSourceGroups
            && this.props.dataSource.referencePriceSourceGroups.length > 0) {
            this.props.dataSource.referencePriceSourceGroups.forEach(groupItem => {
                let groupTableItem = {
                    groupName: groupItem.groupName,
                    aggregation: groupItem.aggregation,
                    sourceList: []
                };
                this.props.dataSource.referencePriceSourceLists.forEach(sourceItem => {
                    if (sourceItem.groupName === groupItem.groupName) {
                        this.setStatusForSourceItem(sourceItem);
                        groupTableItem.sourceList.push(sourceItem);
                    }
                });
                if (groupTableItem.sourceList.length > 0) {
                    groupTableDataSource.push(groupTableItem);
                }
            });

            let noGroupTableItem = {
                groupName: "-",
                aggregation: "",
                sourceList: []
            };
            this.props.dataSource.referencePriceSourceLists.forEach(sourceItem => {
                if (!sourceItem.groupName || sourceItem.groupName === "") {
                    this.setStatusForSourceItem(sourceItem);
                    noGroupTableItem.sourceList.push(sourceItem);
                }
            });
            if (noGroupTableItem.sourceList.length > 0) {
                groupTableDataSource.push(noGroupTableItem);
            }
        }
        return groupTableDataSource;
    }

    changeInitStatus = (sourceItemId, targetStatus) => {
        if (!targetStatus) {
            let onCount = this.props.dataSource.referencePriceSourceLists.filter(sourceItem => sourceItem.init).length;
            if (onCount <= this.props.dataSource.minSources) {
                message.error("Actived sources count can not be less than the minSources value");
                return;
            }
        }
        this.props.changeSourceInitStatus(sourceItemId, targetStatus);
    }

    onBidPriceListScroll = () => {
        this.refs.askPriceList.scrollTop = this.refs.bidPriceList.scrollTop;
    }

    render() {

        const dataSource = this.props.dataSource || {};
        const priceDataSource = this.preparePriceDataSource();
        // console.log("referenceConfigId: ", this.props.referenceConfigId);
        const minTick = this.props.minTicks[this.props.referenceConfigId];
        // console.log("minTick:", minTick);

        return (
            <Card bodyStyle={{overflow:"auto",display:"flex",flex:1,flexDirection:"column"}}
                size="small" headStyle={{color:"#fff"}} title="Reference Price"
                style={{marginLeft:5,marginRight:5,flex:13,fontSize:"12px",display:"flex",flexDirection:"column",minWidth: 350}} className="reference-price-wrapper">
                {/* <div className="title">Reference Price</div> */}
                <div style={{display:"flex",width:"100%",overflow:"auto"}} className="basic-info-wrapper">
                    <div className="field-wrapper">
                        <label className="field-label">Preset Name</label>
                        <label style={{marginLeft:4}} className="field-value">{dataSource.preset}</label>
                    </div>
                    <div style={{marginLeft:5}} className="field-wrapper">
                        <label className="field-label">Aggregation</label>
                        <label style={{marginLeft:4}} className="field-value">{dataSource.algo}</label>
                    </div>
                    <div style={{marginLeft:5}} className="field-wrapper">
                        <label className="field-label">Min Source</label>
                        <label style={{marginLeft:4}} className="field-value">{dataSource.minSources}</label>
                    </div>
                </div>

                <div className="source-list-wrapper">
                    <Row>
                        <Col className="source-column" span={3}></Col>
                        <Col className="source-column" span={9}>Source</Col>
                        {/*<Col className="source-column" span={4}>Mode</Col>*/}
                        <Col className="source-column" span={4}>Status</Col>
                        <Col className="source-column" span={4}>Filter</Col>
                        <Col className="source-column" span={4}>Switch</Col>
                    </Row>
                    <div style={{height:126,overflow:"auto"}} className="list-content-wrapper">
                        {
                            this.prepareGroupTableDataSource().map((groupItem, index) => (
                                <div className="source-sub-group-wrapper" key={index}>
                                    <div className="group-title-wrapper">{groupItem.groupName + " " + groupItem.aggregation}</div>
                                    <div className="source-sub-group-list-wrapper">
                                        {
                                            groupItem.sourceList.map((sourceItem, idx) => (
                                                <Row className="source-row" key={idx}>
                                                    <Col className="source-column" span={3}>
                                                        <div className="init-status-wrapper">
                                                            <div onClick={() => { this.changeInitStatus(sourceItem.id, !sourceItem.init); }} className="init-status-background">
                                                                {sourceItem.init ?
                                                                    (<div className="init-status-on">ON</div>) :
                                                                    (<div className="init-status-off">OFF</div>)
                                                                }
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col className="source-column" span={9}>
                                                        <div className="source-name" title={sourceItem.sourceName}>{sourceItem.sourceName}</div>
                                                    </Col>
                                                    {/*<Col className="source-column" span={4}>{sourceItem.type}</Col>*/}
                                                    <Col className="source-column" span={4}>
                                                        <div className={sourceItem.status === "SPIKE" ?
                                                            "status-text-spike" :
                                                            sourceItem.status === "ERROR" ? "status-text-error" : "status-text-ok"}>{sourceItem.status}</div>
                                                    </Col>
                                                    <Col className="source-column" span={4}>
                                                        <div className="status-icon-wrapper">
                                                            <div className={["status-icon", sourceItem.isAF ? "status-icon-enabled" : ""].join(" ")}>A</div>
                                                            <div className={["status-icon", sourceItem.isPF ? "status-icon-enabled" : ""].join(" ")}>P</div>
                                                            <div className={["status-icon", sourceItem.isTF ? "status-icon-enabled" : ""].join(" ")}>T</div>
                                                        </div>
                                                    </Col>
                                                    <Col className="source-column" span={4}>
                                                        <div className="switch-wrapper">
                                                            <div className="switch1">{sourceItem.switch1}</div>
                                                            <div className="switch2">{sourceItem.switch2}</div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            ))
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                {
                    priceDataSource.bidPriceList.length === 0 ? (
                        <div style={{flex:1,height:200}} className="price-info-no-data">
                            No price data
                        </div>
                    ) :
                        (
                            <div style={{flex:1,height:200,overflow:"auto",paddingBottom:34}} className="price-info-wrapper">
                                {/* <div className="best-price-wrapper">
                                    <div className="best-bid-price">{formatDispay(priceDataSource.bestPriceInfo.bestBidPrice, minTick)}</div>
                                    <div className="spread">{priceDataSource.spread}</div>
                                    <div className="best-ask-price">{formatDispay(priceDataSource.bestPriceInfo.bestAskPrice, minTick)}</div>
                                </div> */}
                                <div className="price-list-wrapper">
                                    <div className="bid-price-list" ref="bidPriceList" onScroll={this.onBidPriceListScroll}>
                                        {
                                            priceDataSource.bidPriceList.map((bidPrice, idx) => (
                                                <div className="price-row" key={idx}>
                                                    {/* <div>{bidPrice.dateTime}</div> */}
                                                    <div>{bidPrice.count}</div>
                                                    <div>{formatDispay(bidPrice.price, minTick)}</div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <div className="ask-price-list" ref="askPriceList">
                                        {
                                            priceDataSource.askPriceList.map((askPrice, idx) => (
                                                <div className="price-row" key={idx}>
                                                    {/* <div>{askPrice.dateTime}</div> */}
                                                    <div>{formatDispay(askPrice.price, minTick)}</div>
                                                    <div>{askPrice.count}</div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                }
                <div style={{position:"absolute",bottom:0,left:0,right:0,height:44,background:"#1c1d21"}}></div>
            </Card>

        );
    }
}

const mapStateToProps = state => {
    return {
        dataSource: state.corePrice.currentCorePrice,
        referenceConfigId: state.paramReducer && state.paramReducer.strategyParam && state.paramReducer.strategyParam.mktPxConfigId,
        referencePriceData: state.stocketReducer.referencePriceData,
        minTicks: state.globalReducer.minTicks
    };
};

const mapDispatchToProps = dispatch => ({
    getCorePriceById: (id) => dispatch(getCorePriceById(id)),
    changeSourceInitStatus: (sourceItemId, targetStatus) => dispatch(changeSourceInitStatus(sourceItemId, targetStatus))
});
export default connect(mapStateToProps, mapDispatchToProps)(ReferencePrice);