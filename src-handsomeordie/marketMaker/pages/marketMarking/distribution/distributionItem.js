import { connect } from "react-redux";
import React, { Component } from "react";
import { Row, Col, Icon, message, Button, Input, Select, Form, Table, Modal, InputNumber } from "antd";

import Counter from "../counterList/counter";
import {getOffset} from "../../../utils/commonFun";
class DistributionItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            singleLineMode: true,
            editView: false,
            currentTradingType: undefined,
            currentCounterPartyInfo: {},
            counter_Show: false,
        };
    }

    componentWillMount() {
        let editView = false;
        if (!this.props.dataSource.id) {
            editView = true;
        }
        let currentCounterPartyInfo = {
            counterParties: this.props.dataSource.counterParties,
            counterPartyGroups: this.props.dataSource.counterPartyGroups
        };
        this.setState({
            singleLineMode: true,
            editView: editView,
            currentTradingType: this.props.dataSource.tradingType,
            currentCounterPartyInfo: currentCounterPartyInfo
        });
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.dataSource) !== JSON.stringify(this.props.dataSource)) {
            this.props.form.resetFields();
            let editView = false;
            if (!nextProps.dataSource.id) {
                editView = true;
            }
            let currentCounterPartyInfo = {
                counterParties: nextProps.dataSource.counterParties,
                counterPartyGroups: nextProps.dataSource.counterPartyGroups
            };
            this.setState({
                singleLineMode: true,
                editView: editView,
                currentTradingType: nextProps.dataSource.tradingType,
                currentCounterPartyInfo: currentCounterPartyInfo
            });
        }
    }

    onResetClick = () => {
        this.props.form.resetFields();
        this.setState({
            editView: false,
            currentCounterPartyInfo: {
                counterParties: this.props.dataSource.counterParties,
                counterPartyGroups: this.props.dataSource.counterPartyGroups
            }
        });
    }

    onCancelClick = () => {
        this.props.onCreateCancel && this.props.onCreateCancel();
    }

    getSpread = (record, spread, minTick) => {
        let displayQty = 10000;
        let currentStrategy = record;
        if (currentStrategy) {
            const symbol = currentStrategy.symbol;
            if (symbol === "USDJPY" || symbol === "EURJPY" || symbol.indexOf(".") !== -1) {
                displayQty = 100;
            }
            const offset = getOffset(minTick);
            return offset / displayQty * spread;
        }
    }
    getSkew = (record, skew, minTick) => {
        let displayQty = 10000;
        let currentStrategy = record;
        if (currentStrategy) {
            const symbol = currentStrategy.symbol;
            if (symbol === "USDJPY" || symbol === "EURJPY" || symbol.indexOf(".") !== -1) {
                displayQty = 100;
            }
            const offset = getOffset(minTick);
            return offset / displayQty * skew;
        }
    }

    onApplyButtonClick = () => {
        let distributionItem = this.props.dataSource;
        const displayName = this.props.form.getFieldValue("displayName");
        // console.log("displayName:", displayName);
        let count = 0;
        const distributionList = JSON.parse(JSON.stringify(this.props.distributionList));
        // console.log("distributionList:", distributionList);
        // console.log("key", this.props.selectedRowIndex);
        distributionList.splice(this.props.selectedRowIndex, 1);
        // console.log("distributionList:", distributionList);
        distributionList.map(item => {
            if (item.displayName === displayName) {
                count++;
            }
        });
        // console.log("count: ", count);
        if (this.props.distributionList.length > 1 && count !== 0) {
            if (count >= 1) {
                message.error("Name cannot be repeated!", 2);
                return;
            }
        }
        let newValues = this.props.form.getFieldsValue();
        distributionItem = Object.assign(distributionItem, newValues);
        if (distributionItem.mode) {
            distributionItem.source = distributionItem.mode.split(" ")[0];
            distributionItem.tradingType = distributionItem.mode.split(" ")[1];
        }

        if (distributionItem.tradingType === "RFS" ||
            distributionItem.tradingType === "RFQ") {
            distributionItem.counterParties = this.state.currentCounterPartyInfo.counterParties;
            distributionItem.counterPartyGroups = this.state.currentCounterPartyInfo.counterPartyGroups;
        }
        const currentStrategy = this.props.currentStrategy;
        const minTick = this.props.minTicks[currentStrategy.mktPxConfigId];
        if (!minTick){
            message.error("Unable to get minTick!", 2);
            return;
        }
        distributionItem.spread = this.getSpread(currentStrategy, distributionItem.spread, minTick);
        distributionItem.skew = this.getSkew(currentStrategy, distributionItem.skew, minTick);
        if (!this.props.onSave || this.props.onSave(distributionItem)) {
            this.setState({
                editView: false
            });
        }
    }

    onStartButtonClick = () => {
        let distributionItem = this.props.dataSource;
        distributionItem.status = "STARTED";
        this.props.onSave && this.props.onSave(distributionItem);
    }
    onHaltButtonClick = () => {
        let distributionItem = this.props.dataSource;
        distributionItem.status = "HALTED";
        this.props.onSave && this.props.onSave(distributionItem);
    }
    onStopButtonClick = () => {
        let distributionItem = this.props.dataSource;
        distributionItem.status = "STOPPED";
        this.props.onSave && this.props.onSave(distributionItem);
    }

    renderSubCounterParties = (record) => {
        return (
            record.subParties.map(subParty => (
                <div key={subParty.name} className="sub-party-info-wrapper">
                    <Row>
                        <Col span={11}>{subParty.name}</Col>
                        <Col span={11}>
                            <div className="sub-party-status-wrapper">
                                {subParty.status === "Live" ? (
                                    <div className="sub-party-status-icon-live"></div>
                                ) : (
                                    <div className="sub-party-status-icon-offline"></div>)}
                                <div className="sub-party-status-vaule">{subParty.status}</div>
                            </div>
                        </Col>
                    </Row>
                </div>
            ))
        );
    }

    getExpandedIcon = (props) => {
        if (props.record.subParties && props.record.subParties.length > 0) {
            if (props.expanded) {
                return (
                    <Icon type="caret-down" onClick={e => props.onExpand(props.record, e)} />
                );
            } else {
                return (
                    <Icon type="caret-right" onClick={e => props.onExpand(props.record, e)} />
                );
            }
        }
    }

    counterPartySettingClick = () => {
        if (this.state.editView) {
            // show counter party setting window
            this.setState({
                counter_Show: true
            });
        }
    }

    onCounterPartyInfoSave = (newCountPartyInfo) => {
        this.setState({
            currentCounterPartyInfo: newCountPartyInfo,
            counter_Show: false
        });
    }

    onModeChange = (value) => {
        let currentTradingType = value.split(" ")[1];
        this.setState({
            currentTradingType: currentTradingType
        });
    }

    prepareCounterPartyDataSource = () => {
        let counterPartyDataSource = [];
        if (this.state.currentCounterPartyInfo) {
            let counterParties = this.state.currentCounterPartyInfo.counterParties;
            let counterPartyGroups = this.state.currentCounterPartyInfo.counterPartyGroups;
            if (counterPartyGroups && counterPartyGroups.length > 0) {
                counterPartyGroups.forEach(counterPartyGroup => {
                    let dataSourceGroupItem = {
                        name: counterPartyGroup.name,
                        subParties: []
                    };
                    let liveCount = 0;
                    let totalCount = 0;
                    if (counterPartyGroup.counterParties
                        && counterPartyGroup.counterParties.length > 0) {
                        counterPartyGroup.counterParties.forEach(counterParty => {
                            if (counterParty.status === "Live") {
                                liveCount++;
                            }
                            totalCount++;

                            let counterPartyItem = {
                                name: counterParty.code,
                                status: counterParty.status
                            };
                            dataSourceGroupItem.subParties.push(counterPartyItem);
                        });
                    }
                    dataSourceGroupItem.status = "(" + liveCount + "/" + totalCount + ")";
                    counterPartyDataSource.push(dataSourceGroupItem);
                });
            }

            if (counterParties) {
                counterParties.forEach(counterParty => {
                    let counterPartyItem = {
                        name: counterParty.code,
                        status: counterParty.status
                    };
                    counterPartyDataSource.push(counterPartyItem);
                });
            }
        }
        return counterPartyDataSource;
    }
    setModal_ok = () => {
        this.setState({ counter_Show: true });
    }
    setModal_cancel = () => {
        this.setState({ counter_Show: false });
    }
    getItemHeight = (a, b) => {
        if (a && b) {
            return 170;
        }
        if (a || b) {
            return 160;
        }else {
            return 145;
        }

    }

    bidFormate = (dataSource,index) => {
        if(dataSource.status ==="STARTED" && dataSource.bidQties && dataSource.bidQties[index]){
            if(0 < dataSource.bidQties[index] && dataSource.bidQties[index] < 1000000){
                return dataSource.bidQties[index];
            } else {
                return dataSource.bidQties[index] / 1000000 + "M";
            }
        }else {
            return "";
        }
        
    }

    askFormate = (dataSource,index) => {
        if(dataSource.status ==="STARTED" && dataSource.askQties && dataSource.askQties[index]){
            if(0 < dataSource.askQties[index] && dataSource.askQties[index] < 1000000){
                return dataSource.askQties[index];
            } else {
                return dataSource.askQties[index] / 1000000 + "M";
            }
        }else {
            return "";
        }
        
    }
    render() {

        const dataSource = this.props.dataSource || {};

        const createMode = dataSource.id ? false : true;

        const {
            getFieldDecorator
        } = this.props.form;

        const counterPartyColumns = [
            {
                title: "Name",
                dataIndex: "name",
                key: "name",
            }, {
                title: "Status",
                dataIndex: "status",
                key: "status",
                render: (status) => (
                    <div className="sub-party-status-wrapper">
                        {status === "Live" ? (
                            <div className="sub-party-status-icon-live"></div>
                        ) : status === "Offline" ? (
                            <div className="sub-party-status-icon-offline"></div>) : (null)}
                        <div className="sub-party-status-vaule">{status}</div>
                    </div>
                )
            }
        ];
        
        const Option = Select.Option;
        const counterPartyDataSource = this.prepareCounterPartyDataSource();
        // console.log(this.props.dataSource);
        return (
            <div className="distribution-item-wrapper" onClick={this.props.onClick}>
                {this.state.singleLineMode ?
                    (<div className={"single-line-content-wrapper" + (this.props.selected ? " selected-row" : "")} >
                        <Row type="flex" align="middle">
                            <Col span={4}>
                                <div style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}} className="display-name">{dataSource.displayName}</div>
                            </Col>
                            <Col span={5}>
                                <div className="info-wrapper">
                                    <div className="info-label" style={{lineHeight:"39px"}}>Mode </div>
                                    <div className="info-value" style={{lineHeight:"39px"}}>{dataSource.source + " " + dataSource.tradingType}</div>
                                </div>
                            </Col>
                            <Col span={5}>
                                <div className="quote-info-wrapper">
                                    <div className="bid-quote-info">{dataSource.status ==="STARTED" && dataSource.askPrice && dataSource.bidPrice[0] || "--"}</div>
                                    <div className="ask-quote-info">{dataSource.status ==="STARTED" && dataSource.askPrice && dataSource.askPrice[0] || "--"}</div>
                                </div>
                            </Col>
                            <Col span={3}>
                                <div className="info-wrapper">
                                    <div className="info-label">+Spread</div>
                                    <div className="info-value">{dataSource.spread}</div>
                                </div>
                            </Col>
                            <Col span={3}>
                                <div className="info-wrapper">
                                    <div className="info-label">+Skew</div>
                                    <div className="info-value">{dataSource.skew}</div>
                                </div>
                            </Col>
                            <Col span={3}>
                                {createMode ? (null) : (<div className="operation-menu-wrapper">
                                    {/* {
                                        dataSource.status === "STARTED" || dataSource.status === "HALTED" || dataSource.status === "STOPPED" ?
                                            (<Button disabled={dataSource.status === "HALTED" || dataSource.status === "STOPPED"} onClick={this.onHaltButtonClick} size="small" style={dataSource.status === "HALTED" && {backgroundColor: "#ffcc33", color: "white",opacity: 1}}>HALT</Button>) : null
                                    } */}
                                    {
                                        dataSource.status === "STARTED" ?
                                            (<Button disabled={dataSource.status === "STOPPED"} onClick={this.onStopButtonClick} size="small" className="stop-btn" type="danger">STOP</Button>) : null
                                    }
                                    {
                                        dataSource.status === "STOPPED" || dataSource.status === "HALTED" ?
                                            (<Button onClick={this.onStartButtonClick} size="small" className="start-btn">START</Button>) : null
                                    }
                                </div>
                                )}
                            </Col>
                            <Col span={1}>
                                <div className="expand-menu-wrapper">
                                    <Icon style={{fontSize:"20px"}} type="arrows-alt" onClick={() => { this.setState({ singleLineMode: false }); }} />
                                </div>
                            </Col>
                        </Row>
                    </div>) : (
                        <div style={{height: this.getItemHeight(createMode, this.state.currentTradingType === "RFQ" || this.state.currentTradingType === "RFS"), overflow:"auto", }} className={"multi-line-content-wrapper" + (this.props.selected ? " selected-row" : "")}>
                            <Form>
                                <div style={{display: "flex", }}>
                                    <div style={{flex: 3, display: "flex", flexDirection: "column", marginTop: this.state.currentTradingType === "RFQ" ||
                                        this.state.currentTradingType === "RFS" ? 10 : 10}}>
                                        {/* <div style={{flex: 1}}>
                                            <Form.Item>
                                                {getFieldDecorator("displayName",
                                                    { initialValue: dataSource.displayName })(
                                                    <Input disabled={!this.state.editView} className="display-name-input" />)}
                                            </Form.Item>
                                        </div> */}
                                        <div style={{flex: 1}}>
                                            <div className="quote-info-wrapper">
                                                <div className="bid-quote-info" style={{marginRight:5}}>{dataSource.status ==="STARTED" && dataSource.bidPrice && dataSource.bidPrice[0] || "--"}</div>
                                                <div style={{width:30,fontWeight:300,textAlign:"right"}}>{this.bidFormate(dataSource,0)}</div>
                                                <div style={{width:30,fontWeight:300,textAlign:"left",marginLeft:10}}>{this.askFormate(dataSource,0)}</div>
                                                <div className="ask-quote-info">{dataSource.status ==="STARTED" && dataSource.askPrice && dataSource.askPrice[0] || "--"}</div>
                                            </div>
                                            <div className="quote-info-wrapper">
                                                <div className="bid-quote-info" style={{marginRight:5}}>{dataSource.status ==="STARTED" && dataSource.bidPrice && dataSource.bidPrice[1] || "--"}</div>
                                                <div style={{width:30,fontWeight:300,textAlign:"right"}}>{this.bidFormate(dataSource,1)}</div>
                                                <div style={{width:30,fontWeight:300,textAlign:"left",marginLeft:10}}>{this.askFormate(dataSource,1)}</div>
                                                <div className="ask-quote-info">{dataSource.status ==="STARTED" && dataSource.askPrice && dataSource.askPrice[1] || "--"}</div>
                                            </div>
                                            <div className="quote-info-wrapper">
                                                <div className="bid-quote-info" style={{marginRight:5}}>{dataSource.status ==="STARTED" && dataSource.bidPrice && dataSource.bidPrice[2] || "--"}</div>
                                                <div style={{width:30,fontWeight:300,textAlign:"right"}}>{this.bidFormate(dataSource,2)}</div>
                                                <div style={{width:30,fontWeight:300,textAlign:"left",marginLeft:10}}>{this.askFormate(dataSource,2)}</div>
                                                <div className="ask-quote-info">{dataSource.status ==="STARTED" && dataSource.askPrice && dataSource.askPrice[2] || "--"}</div>
                                            </div>
                                            <div className="quote-info-wrapper">
                                                <div className="bid-quote-info" style={{marginRight:5}}>{dataSource.status ==="STARTED" && dataSource.bidPrice && dataSource.bidPrice[3] || "--"}</div>
                                                <div style={{width:30,fontWeight:300,textAlign:"right"}}>{this.bidFormate(dataSource,3)}</div>
                                                <div style={{width:30,fontWeight:300,textAlign:"left",marginLeft:10}}>{this.askFormate(dataSource,3)}</div>
                                                <div className="ask-quote-info">{dataSource.status ==="STARTED" && dataSource.askPrice && dataSource.askPrice[3] || "--"}</div>
                                            </div>
                                            <div className="quote-info-wrapper">
                                                <div className="bid-quote-info" style={{marginRight:5}}>{dataSource.status ==="STARTED" && dataSource.bidPrice && dataSource.bidPrice[4] || "--"}</div>
                                                <div style={{width:30,fontWeight:300,textAlign:"right"}}>{this.bidFormate(dataSource,4)}</div>
                                                <div style={{width:30,fontWeight:300,textAlign:"left",marginLeft:10}}>{this.askFormate(dataSource,4)}</div>
                                                <div className="ask-quote-info">{dataSource.status ==="STARTED" && dataSource.askPrice && dataSource.askPrice[4] || "--"}</div>
                                            </div>
                                        </div>
                                        <div style={{display: "flex", justifyContent: "center"}}>
                                            {/* {createMode ? (null) : ( */}
                                            <div className="operation-menu-wrapper" style={{display: "flex", justifyContent: "center", margin:"5px 15px 5px 0"}}>
                                                {/* {
                                                        dataSource.status === "STARTED" || dataSource.status === "HALTED" || dataSource.status === "STOPPED" ?
                                                            (<Button disabled={dataSource.status === "HALTED" || dataSource.status === "STOPPED"} onClick={this.onHaltButtonClick} size="small" style={dataSource.status === "HALTED" ? {backgroundColor: "#ffcc33", color: "white",opacity: 1} : {display: "inline"}}>HALT</Button>) : null
                                                    } */}
                                                {
                                                    dataSource.status === "STARTED" ?
                                                        (<Button disabled={dataSource.status === "STOPPED"} onClick={this.onStopButtonClick} size="small" className="stop-btn" type="danger">STOP</Button>) : null
                                                }
                                                {
                                                    dataSource.status === "STOPPED" || dataSource.status === "HALTED" ?
                                                        (<Button onClick={this.onStartButtonClick} size="small" className="start-btn">START</Button>) : null
                                                }
                                            </div>
                                            {/* )} */}
                                        </div>
                                    </div>
                                    <div style={{ fontSize:12, marginLeft: 5, marginRight: 5, marginTop: this.state.currentTradingType === "RFQ" ||
                                        this.state.currentTradingType === "RFS" ? 0 : 0}}>
                                        <div style={{display: "flex", flexDirection: "column", alignItems: "stretch", justifyContent: "flex-start"}}>
                                            {/*<div className="info-row">*/}
                                            <div className="info-wrapper" style={{display: "flex", justifyContent: "space-between"}}>

                                                <div style={{width:120,marginRight:10}}>
                                                    <Form.Item>
                                                        {getFieldDecorator("displayName",
                                                            { initialValue: dataSource.displayName })(
                                                            <Input style={{padding:0}} disabled={!this.state.editView} className="display-name-input" />)}
                                                    </Form.Item>
                                                </div>
                                                <div style={{flex: 1,display:"flex"}}>
                                                    <div className="info-label" style={{lineHeight:"39px"}}>Mode </div>
                                                    {createMode ? (
                                                        <Form.Item>
                                                            {getFieldDecorator("mode",
                                                                { rules: [{ require: true }], initialValue: this.props.modeDataSource[0] })(
                                                                <Select size="small"
                                                                    className="transaction-mode-select"
                                                                    // style={{width: 110, fontSize: 12}}
                                                                    onChange={this.onModeChange}>
                                                                    {
                                                                        this.props.modeDataSource.map(mode => (
                                                                            <Option key={mode} value={mode}>{mode}</Option>
                                                                        ))
                                                                    }
                                                                </Select>)}
                                                        </Form.Item>) : (
                                                        <div className="info-value" style={{lineHeight:"39px"}}>{dataSource.source + " " + dataSource.tradingType}</div>
                                                    )}
                                                                    
                                                </div>
                                            </div>
                                            {/*</div>*/}
                                            {/*<div className="info-row">*/}
                                            <div style={{display:"flex"}}>
                                                <div className="info-wrapper" style={{display: "flex",marginRight:5}}>
                                                    <div className="info-label">+Spread</div>
                                                    <div className="info-value-wrapper" style={{marginLeft: 5}}>
                                                        <Form.Item>
                                                            {getFieldDecorator("spread",
                                                                { initialValue: dataSource.spread })(
                                                                <InputNumber style={{width: 30}} min={0} disabled={!this.state.editView} size="small" className="spread-value-input" />)}
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                            
                                                <div className="info-wrapper" style={{display: "flex"}}>
                                                    <div className="info-label"> +Skew</div>
                                                    <div className="info-value-wrapper" style={{marginLeft: 5}}>
                                                        <Form.Item>
                                                            {getFieldDecorator("skew",
                                                                { initialValue: dataSource.skew })(
                                                                <InputNumber style={{width: 30}} size="small" step={0.5} disabled={!this.state.editView} className="skew-value-input" />)}
                                                        </Form.Item>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-end"}}>

                                            
                                            <div className="info-wrapper">
                                                <div className="threshold-info-wrapper" style={{display: "flex", flexDirection: this.state.currentTradingType === "RFQ" ||
                                                    this.state.currentTradingType === "RFS" ? "row" : "row", alignItems: "flex-end", marginLeft: 0}}>

                                                    <div className="info-wrapper">
                                                        <div className="info-label">Throttle</div>
                                                        <div className="info-value-wrapper" style={{marginLeft: 5}}>
                                                            <Form.Item>
                                                                {getFieldDecorator("freq",
                                                                    { initialValue: dataSource.freq })(
                                                                    <InputNumber style={{width: 30}} size="small" min={0}  disabled={!this.state.editView} className="freq-value-input" />)}
                                                            </Form.Item>
                                                        </div>
                                                        <div style={{marginLeft:5}} className="info-label">second, </div>
                                                    </div>
                                                    <div style={{marginLeft:5}} className="spread-wrapper">
                                                        <label style={{width:77}}>Spread break</label>
                                                        <div style={{marginLeft: 1}}>
                                                            <Form.Item>
                                                                {getFieldDecorator("thresholdSpread",
                                                                    { initialValue: dataSource.thresholdSpread })(
                                                                    <InputNumber style={{width: 30}} size="small" min={0} disabled={!this.state.editView} className="threshold-spread-input" />)}
                                                            </Form.Item>
                                                        </div>
                                                        <label>bps</label>
                                                    </div>

                                                    <div style={{display: "flex", alignItems: "center"}} className="move-wrapper" >
                                                        <label style={{width:66}}>move break</label>
                                                        <div style={{marginLeft: 1}}>
                                                            <Form.Item>
                                                                {getFieldDecorator("thresholdMove",
                                                                    { initialValue: dataSource.freq })(
                                                                    <InputNumber style={{width: 30}} size="small" step={0.5} disabled={!this.state.editView} className="threshold-move-input" />)}
                                                            </Form.Item>
                                                        </div>
                                                        <label>bps</label>
                                                    </div>

                                                </div>
                                            </div>
                                            {/*</div>*/}
                                        </div>
                                    </div>
                                    {/* <div style={{flex: this.state.currentTradingType === "RFQ" ||
                                        this.state.currentTradingType === "RFS" ? 7 : 10, fontSize:12, marginLeft: 10, marginTop: this.state.currentTradingType === "RFQ" ||
                                        this.state.currentTradingType === "RFS" ? 10 : 20}}>
                                        <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-end"}}>

                                            <div style={{height: createMode ? 39 : 21}} className="info-wrapper">

                                            </div>
                                            <div className="info-wrapper">
                                                <div className="info-label">Freq</div>
                                                <div className="info-value-wrapper" style={{marginLeft: 5}}>
                                                    <Form.Item>
                                                        {getFieldDecorator("freq",
                                                            { initialValue: dataSource.freq })(
                                                            <InputNumber style={{width: 30}} size="small" min={0}  disabled={!this.state.editView} className="freq-value-input" />)}
                                                    </Form.Item>
                                                </div>
                                            </div>
                                            <div className="info-wrapper">
                                                <div className="threshold-info-wrapper" style={{display: "flex", flexDirection: this.state.currentTradingType === "RFQ" ||
                                                    this.state.currentTradingType === "RFS" ? "column" : "row", alignItems: "flex-end", marginLeft: 0}}>
                                                    <div className="spread-wrapper">
                                                        <label>spread</label>
                                                        <div style={{marginLeft: 1}}>
                                                            <Form.Item>
                                                                {getFieldDecorator("thresholdSpread",
                                                                    { initialValue: dataSource.thresholdSpread })(
                                                                    <InputNumber style={{width: 30}} size="small" min={0} disabled={!this.state.editView} className="threshold-spread-input" />)}
                                                            </Form.Item>
                                                        </div>
                                                        <label>bps</label>
                                                    </div>
                                                    <div style={{display: "flex", alignItems: "center"}} className="move-wrapper" >
                                                        <label>move</label>
                                                        <div style={{marginLeft: 1}}>
                                                            <Form.Item>
                                                                {getFieldDecorator("thresholdMove",
                                                                    { initialValue: dataSource.freq })(
                                                                    <InputNumber style={{width: 30}} size="small" step={0.5} disabled={!this.state.editView} className="threshold-move-input" />)}
                                                            </Form.Item>
                                                        </div>

                                                        <label>bps</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                    <div style={{width:200}}>

                                        {/* <div style={{width:270,flex: this.state.currentTradingType === "RFQ" ||
                                        this.state.currentTradingType === "RFS" ? 6 : 3, fontSize:12,overflow:"auto"}}> */}
                                        {this.state.currentTradingType === "RFQ" ||
                                        this.state.currentTradingType === "RFS" ? (
                                                <div>
                                                    <Row type="flex" justify="space-between" className="info-row">
                                                        <Col>
                                                            <div style={{height:40,lineHeight:"30px"}} className="info-label">
                                                                Counter Party
                                                            </div>
                                                        </Col>
                                                        <Col>
                                                            <div className="counter-party-setting-icon-wrapper">
                                                                <Icon className={this.state.editView ? null : "icon-disabled"}
                                                                    type="setting"
                                                                    onClick={this.counterPartySettingClick} />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <div className="counter-party-table-wrapper">
                                                            <Table dataSource={counterPartyDataSource}
                                                                expandedRowRender={this.renderSubCounterParties}
                                                                expandIcon={this.getExpandedIcon}
                                                                columns={counterPartyColumns}
                                                                pagination={false}
                                                                rowKey="name" />
                                                        </div>
                                                    </Row>
                                                </div>) : (null)}
                                    </div>

                                    <div style={{fontSize:12, flex: 1}}>
                                        <Row className="info-row">
                                            <Col span={24}>
                                                <div className="shrink-menu-wrapper" style={{display: "flex", justifyContent: "flex-end"}}>
                                                    {!this.state.editView ? <Icon style={{fontSize:"20px"}} type="form" onClick={() => this.setState({ editView: true })} /> : null}
                                                    <Icon className="shrink-icon" style={{fontSize:"20px"}} type="shrink" onClick={() => { this.setState({ singleLineMode: true }); }} />
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className="info-row">
                                            <Col span={24}>
                                                <div className="reset-button-wrapper">
                                                    {
                                                        createMode ? (
                                                            <Button disabled={!this.state.editView} onClick={this.onCancelClick} size="small">CANCEL</Button>
                                                        ) :
                                                            (
                                                                <Button disabled={!this.state.editView} onClick={this.onResetClick} size="small">RESET</Button>
                                                            )
                                                    }
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className="info-row">
                                            <Col span={24}>
                                                <div className="apply-button-wrapper">
                                                    <Button onClick={this.onApplyButtonClick} disabled={!this.state.editView} className="apply-button" size="small">APPLY</Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    )}
                <Modal width="60%"
                    visible={this.state.counter_Show}
                    onCancel={this.setModal_cancel}
                    onOk={this.setModal_ok}
                    footer={null}
                    className="darkTheme "
                >
                    <Counter onSave={this.onCounterPartyInfoSave} currentCounterPartyInfo={this.state.currentCounterPartyInfo} />
                </Modal>
            </div>
        );
    }
}

const WrappedDistributionItem = Form.create()(DistributionItem);

const mapStateToProps = state => ({
    minTicks: state.globalReducer.minTicks,
    currentStrategy: state.currentStrategyReducer.currentStrategy,
});


const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(WrappedDistributionItem);