import { connect } from "react-redux";

import React, { Component } from "react";
import { Input, Checkbox, Radio, Row, Col, Button, Card, message } from "antd";
import Target from "./target";
import { saveConfigData, getDrageValue } from "../../actions/marketPrice";
class MarketPriceConfig extends Component {
    state = {
        isSubmit: false,
        configrationValue: {
            symbol: "",
            id: "",
            channels: "",
            fullName: "",
            tenor: "",
            base: "",
            venue: "",
            market: "",
            minTick: null,
            sanityCheck: null,
            spikeFilter: null,
            staleFilter: null,
            quality: null,
            connectivity: null,
            tradingHourOpen: null,
            tradingHourClose: null,
            timeZone: null,
            ccy1Id: null,
            ccy2Id: null,
            arrivalRate: null,
            maxMove: null,
            mean: null,
            stdev: null,
            enable: null,
            status: "",
            varietyType: ""
        },
        initValue: undefined,
    }
    componentDidMount() {
        this.props.handleRef(this);
        // console.log(document.getElementsByClassName("market_price_config_content"));
    }
    componentWillReceiveProps(nextProps) {
        if (!nextProps.editView && (nextProps.editView!==this.props.editView)) {
            this.props.getDrageValue([],()=>{});
        }
        if (nextProps.configrationValue.id !== this.props.configrationValue.id) {
            this.setState({ configrationValue: nextProps.configrationValue, initValue:  {...nextProps.configrationValue}});
        }
    }
    onFullname = (e) => {
        // console.log(e.currentTarget.value);
        let configrationValue = this.state.configrationValue;
        configrationValue.symbol = e.currentTarget.value;
        this.setState({ configrationValue });
    }

    saveConfigData = () => {
        const {configrationValue} =this.state;
        let param = {
            // item: this.state.configrationValue,
            item:{
                symbol: configrationValue.symbol,
                id: configrationValue.id,
                channels:configrationValue.channels ,
                fullName: configrationValue.fullName,
                tenor: configrationValue.tenor,
                base: configrationValue.base,
                venue: configrationValue.venue,
                market: configrationValue.market,
                minTick: configrationValue.minTick,
                sanityCheck: configrationValue.sanityCheck,
                spikeFilter: configrationValue.spikeFilter,
                staleFilter: configrationValue.staleFilter,
                quality: configrationValue.quality,
                connectivity: configrationValue.connectivity,
                tradingHourOpen: configrationValue.tradingHourOpen,
                tradingHourClose: configrationValue.tradingHourClose,
                timeZone: configrationValue.timeZone,
                ccy1Id: configrationValue.ccy1Id,
                ccy2Id: configrationValue.ccy2Id,
                arrivalRate: configrationValue.arrivalRate,
                maxMove: configrationValue.maxMove,
                mean: configrationValue.mean,
                stdev: configrationValue.stdev,
                enable: configrationValue.enable,
                status: configrationValue.status,
                varietyType: configrationValue.varietyType
            },
            data: this.props.marketPriceList
        };
        // if (((param.item.staleFilter && param.item.arrivalRate != null) || ((param.item.spikeFilter && param.item.maxMove && param.item.mean && param.item.stdev)) || (!param.item.staleFilter) || !param.item.spikeFilter)) {
        this.props.saveConfigData(param);
        this.props.forbidDrage();
        // } else {
        //     message.error("Repeat add！");
        // }

        this.props.thiz.setState({editView: false});
    }
    onSanityFilter = () => {
        let configrationValue = this.state.configrationValue;
        configrationValue.sanityCheck = !configrationValue.sanityCheck;
        this.setState({ configrationValue });
    }
    onStaleFilter = () => {
        let configrationValue = this.state.configrationValue;
        configrationValue.staleFilter = !configrationValue.staleFilter;
        this.setState({ configrationValue });
    }
    onArrivalRate = (e) => {
        let configrationValue = this.state.configrationValue;
        configrationValue.arrivalRate = e.currentTarget.value;
        if (!e.currentTarget.value) {
            this.setState({ isSubmit: true });
        }
        this.setState({ configrationValue });
    }
    onSpikeFilter = () => {
        let configrationValue = this.state.configrationValue;
        configrationValue.spikeFilter = !configrationValue.spikeFilter;
        this.setState({ configrationValue });
    }
    onMaxMove = (e) => {
        let configrationValue = this.state.configrationValue;
        configrationValue.maxMove = e.currentTarget.value;
        this.setState({ configrationValue });
    }
    onMean = (e) => {
        let configrationValue = this.state.configrationValue;
        configrationValue.mean = e.currentTarget.value;
        this.setState({ configrationValue });
    }
    onStdev = (e) => {
        let configrationValue = this.state.configrationValue;
        configrationValue.stdev = e.currentTarget.value;
        this.setState({ configrationValue });
    }
    onEnabled = () => {
        let configrationValue = this.state.configrationValue;
        configrationValue.enable = !configrationValue.enable;
        this.setState({ configrationValue });
    }
    invertCCY = () => {
        let dragValue = this.props.dragValue;
        let CCY1 = dragValue[0];
        let CCY2 = dragValue[1];
        let newDragValue = [CCY2, CCY1];
        let _this = this;
        this.props.getDrageValue(newDragValue, (newDragValue) => {
            _this.props.exchangeDrageValue(newDragValue);
        });
    }
    onRabbitDropped = (newValue, oldValue) => {
        // console.log("dsf");
        // console.log(newValue, oldValue);
        this.props.crossConfig(newValue);
    }

    setDefaultValue = () => {
        const { configrationValue } = this.state;
        // console.log(configrationValue);
        // Sanity Filter,Stale Filter,Arrival Rate,Spike Filter,Max Move,Mean,Stdev
        configrationValue.sanityCheck = true;
        configrationValue.staleFilter = true;
        configrationValue.arrivalRate = 0.001;
        configrationValue.spikeFilter = true;
        configrationValue.maxMove = 100;
        configrationValue.mean = 2;
        configrationValue.stdev = 4;
        this.setState({
            configrationValue: configrationValue
        });
    }

    render() {
        const { configrationValue } = this.state;
        // console.log(configrationValue);
        const editView = this.props.editView;
        const defaultConfig = {
            position: "absolute",
            top: "8px",
            left: "80px",
            border: "1px solid #000",
            borderRadius: "3px",
            padding: "0 5px",
            cursor: "pointer",
            display: editView?"":"none"
        };
        return (
            <div style={{height:290,display:"flex",flexDirection:"column",width:"100%"}} className="market_price_config_content">
                <div style={{display: "flex", marginTop: 10, marginBottom: 10,color:"#000"}}>
                    <div style={{display: editView?"none":"flex", alignItems: "center", marginRight: 40}}><div style={{width: 75, fontWeight: "bold"}}>Symbol</div><Input style={{width: 210}} disabled={!editView} value={configrationValue.securityId} defaultValue={configrationValue.securityId} onChange={this.onFullname}/></div>
                    <div style={{display: !editView?"none":"flex", alignItems: "center", marginRight: 40}}><div style={{width: 75, fontWeight: "bold"}}>Symbol</div><Input style={{width: 210}} value={configrationValue.securityId} onChange={this.onFullname}/></div>
                    {/* <div style={{display: "flex", alignItems: "center", marginRight: 40}}><div style={{fontWeight: "bold", marginRight: 20}}>Symbol</div><div>{configrationValue.symbol}</div></div>
                    <div style={{display: "flex", alignItems: "center"}}><div style={{fontWeight: "bold", marginRight: 20}}>Tenor</div><div>{configrationValue.tenor}</div></div> */}
                    <div style={{display: "none"}}>Trading Hours  open {configrationValue.tradingHourOpen}   close {configrationValue.tradingHourClose}</div>
                    <div style={{display: "none"}}>Timezone  {configrationValue.timeZone}</div>
                </div>
                {/* <div className="market_proce_config_box"> */}
                <div style={{display:"flex"}}>
                    {/* <div style={{flex:1}}>
                        <div className="cross_configuration">
                            <Card size="small"
                                style={{height:162}}
                                title="Cross Configurations"
                                className={this.props.isEdit ? "" : "cross_config_card-default"}
                            >
                                <div className="market-card-content">
                                    <Target editView={editView} content={this.props.dragValue} onDrop={this.onRabbitDropped} />
                                    <Checkbox disabled={this.props.dragValue.length != 2 || !editView} onClick={this.invertCCY}>Invert</Checkbox>
                                </div>
                            </Card>
                        </div>
                    </div> */}
                    <div style={{flex:3,margin:"0 10px"}}>
                        <div className="cross_configuration">
                            {/* <div className="cross_configuration_title">Filters</div> */}
                            <Card size="small" style={{height:162}} title="Filters">
                                <span onClick={this.setDefaultValue} style={defaultConfig}>default</span>
                                <div style={{display:"flex"}} className="market-card-content">
                                    <div style={{flex:3}}>
                                        <div>
                                            <Checkbox disabled={!editView} checked={configrationValue.sanityCheck} onClick={this.onSanityFilter}>Sanity Filter</Checkbox>
                                        </div>
                                        <Checkbox disabled={!editView} checked={configrationValue.staleFilter} onClick={this.onStaleFilter}>Stale Filter</Checkbox>
                                        <span>Arrival Rate</span><Input size="small" disabled={!configrationValue.staleFilter || !editView} type="number" style={{ width: "10vh" }} value={configrationValue.arrivalRate} onChange={this.onArrivalRate} /><span> t/second</span> </div>
                                    <div style={{flex:1}}> <Checkbox disabled={!editView} checked={configrationValue.spikeFilter} onClick={this.onSpikeFilter}>Spike Filter</Checkbox></div>
                                    <div className="noBorder" style={{flex:2}}>
                                        <table style={{border:0}} className="tablecell" >
                                            <tbody style={{border:0}}>
                                                <tr key="1"><td style={{border:0}}>Max Move</td><td style={{padding:5}}><Input size="small" disabled={!configrationValue.spikeFilter || !editView} style={{ width: "10vh" }} value={configrationValue.maxMove} onChange={this.onMaxMove} /></td><td style={{border:0}}>pips</td></tr>
                                                <tr key="2"><td style={{border:0}}>Mean</td><td style={{padding:5}}><Input size="small" disabled={!configrationValue.spikeFilter || !editView} style={{ width: "10vh" }} value={configrationValue.mean} onChange={this.onMean} /></td><td style={{border:0}}>pips</td></tr>
                                                <tr key="3"><td style={{border:0}}>Stdev</td><td style={{padding:5}}><Input size="small" disabled={!configrationValue.spikeFilter || !editView} style={{ width: "10vh" }} value={configrationValue.stdev} onChange={this.onStdev} /></td><td style={{border:0}}>pips</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                    {/* <div style={{flex:1}}>
                        <div className="cross_configuration">
                            <Card size="small"
                                style={{height:162}}
                                title="Enabled">
                                <div className="market-card-content">
                                    <div>*Whether to participate in the cross</div>
                                    <Radio.Group disabled={!editView} onChange={this.onEnabled} value={configrationValue.enable}>
                                        <Radio value={true}>YES</Radio> <Radio value={false}> NO</Radio>
                                    </Radio.Group>
                                </div>
                            </Card>

                        </div>
                    </div> */}
                </div>
                {/* </div> */}
                <div className="edit-bottom-button-wrapper" style={{ margin: "15px 0", textAlign: "right", }}>
                    <Button style={{ marginRight: "20px",}} disabled={!this.props.editView} onClick={()=>{
                        // console.log(this.state.configrationValue);
                        // console.log(this.state.initValue);
                        this.setState({ configrationValue: {...this.state.initValue},content:[] });

                        this.props.thiz.setState({editView: false});
                    }} >CANCEL</Button>
                    <Button onClick={this.saveConfigData} disabled={!this.props.editView}>SAVE</Button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    marketPriceList: state.marketPrice.marketPriceList,
    dragValue: state.marketPrice.dragValue
});

const mapDispatchToProps = dispatch => ({
    saveConfigData: (data) => dispatch(saveConfigData(data)),
    getDrageValue: (record, cb) => dispatch(getDrageValue(record, cb)),
});
export default connect(mapStateToProps, mapDispatchToProps)(MarketPriceConfig);