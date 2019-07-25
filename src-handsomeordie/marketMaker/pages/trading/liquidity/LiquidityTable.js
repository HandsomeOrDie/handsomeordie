import {connect} from "react-redux";
import React, {Component} from "react";
import {Table, Radio, Button, Icon, Select, Modal, Input, message, Form, InputNumber, Spin} from "antd";
import {findRealtimeOrder, setTradeBlotter} from "../../../actions/tradeBlotter";
import {getLiquidityList, setLiquidityList, getSymbolList, setAddList,
    addQuidity, deleteQdy, getCptyList, updateList, sendQuoteReq, setMarketPrice, setReferencePrice} from "../../../actions/liquidity";
import moment from "moment";
import WebSocketClient from "../../../socket/WebSocketClient";
import {marketPriceWebSocket, riskMonitorWebSocket, ReferencePriceOutput} from "../../../../common/marketApi/index";
import {checkLogin} from "../../../actions/marketDetail";
import {updatePositionList} from "../../../actions/riskmonitor";
import "../../../../common/styles/marketPages/tradeOrder.scss";
import "../../../../common/styles/marketPages/liquidity.scss";
import ExpandLayerInfo from "./ExpandLayerInfo";
import ManualQuoteInfo from "../clientFlow/ManualTable";
import { DragDropContext, DragSource, DropTarget } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import update from "immutability-helper";
import PlaceOrder from "./PlaceOrder";
import {setSocketConnected, updateReferencePrice} from "../../../actions/globalAction";
const Option = Select.Option;
const Search = Input.Search;
const RadioGroup = Radio.Group;
let dragingIndex = -1;

const defaultPageSize = 50;

class BodyRow extends React.Component {
    render() {
        const {
            isOver,
            connectDragSource,
            connectDropTarget,
            moveRow,
            ...restProps
        } = this.props;
        const style = { ...restProps.style, cursor: "move" };

        let className = restProps.className;
        if (isOver) {
            if (restProps.index > dragingIndex) {
                className += " drop-over-downward";
            }
            if (restProps.index < dragingIndex) {
                className += " drop-over-upward";
            }
        }

        return connectDragSource(
            connectDropTarget(
                <tr
                    {...restProps}
                    className={className}
                    style={style}
                />
            )
        );
    }
}

const rowSource = {
    beginDrag(props) {
        dragingIndex = props.index;
        return {
            index: props.index,
        };
    },
};
const rowTarget = {
    drop(props, monitor) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }

        // Time to actually perform the action
        props.moveRow(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    },
};

const DragableBodyRow = DropTarget(
    "row",
    rowTarget,
    (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
    }),
)(
    DragSource(
        "row",
        rowSource,
        (connect) => ({
            connectDragSource: connect.dragSource(),
        }),
    )(BodyRow),
);

class LiquidityTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderList: [],
            queryParams: {
                startRecord: 0,
                maxRecords: defaultPageSize
            },
            pagination: {
                defaultCurrent: 1,
                defaultPageSize: defaultPageSize,
                hideOnSinglePage: false,
            },

            visible: false,
            addVisible: false,
            expandedRows: [],
            list: [],
            clickRowId: undefined,
            current: undefined,

            lqtyClickId: undefined,
            mode: undefined,
            symbols: [],
            cpty: undefined,
            cptyList: [],
            clickAsk: false,
            side: undefined,

            confirmLoading: false,
        };
    }
    componentDidMount(){
        // let params = this.state.queryParams;
        this.props.handleRef(this);
        this.props.getLiquidityList({}, (data)=>{
            if (data.length > 0) {
                this.subscribleMsg(data);
            }
        });
        this.props.getCptyList({}, (result)=>{
            this.setState({cptyList: result.data});
        });
    }

    subscribleMsg = (list) => {
        const params = list.map(item => ({symbol: item.symbol.replace("/", ""), dataSource: item.source, tradingType: item.type.indexOf("ESP") !== -1 ? "ESP" : item.type}));
        this.props.checkLogin((data) => {
            if (data) {
                if (!window.conn) {
                    window.conn = true;
                    WebSocketClient.connect({onError: this.onError, onOpen: this.onOpen, onReconnect: this.onReconnect, });
                }
                this.marketPriceId2 = WebSocketClient.subscribeMessage({
                    mtype: marketPriceWebSocket,
                    callback: (message)=>{
                        this.updateInfo({}, message, {});
                        // this.props.setMarketPrice({...message});
                    },
                    params: {key: "216516513", list: params},
                    scope: this
                });
                this.referencePriceId = WebSocketClient.subscribeMessage({
                    mtype: ReferencePriceOutput,
                    callback: (message)=>{
                        this.updateInfo({}, {}, message);
                        // this.props.setReferencePrice({...message});
                    },
                    // params: {key: "216516513", list: params},
                    scope: this
                });
            }
        });
    };
    unsubscribleMsg = () => {
        WebSocketClient.unsubscribeMessage({ subscriptionId: this.marketPriceId2, mtype: marketPriceWebSocket });
        WebSocketClient.unsubscribeMessage({ subscriptionId: this.referencePriceId, mtype: ReferencePriceOutput });
    };
    onError = () => {
        this.props.setSocketConnected(3);
    };

    onOpen = () => {
        this.props.setSocketConnected(1);
    };

    onReconnect = () => {
        this.props.setSocketConnected(2);
    };
    handleRef = (thiz) => {
        this.placeOrder = thiz;
    }
    componentWillReceiveProps (nextProps) {
        // console.log("333");

        let pagination = this.state.pagination;
        pagination.total = nextProps.totalRecords;

        if (JSON.stringify(this.state.list) !== JSON.stringify(nextProps.list)) {
            // console.log("444");
            this.setState({
                list: nextProps.list,
                pagination: pagination
            }, () => {
                // console.log(555);
                this.updateInfo(nextProps.quoteOutput || {}, {}, {});
            });
        }else {
            this.updateInfo(nextProps.quoteOutput || {}, {}, {});
        }

        if (nextProps.quoteOutput){
            // console.log("22", nextProps.quoteOutput);
        }

        // console.log("ReferencePrice:", nextProps.referencePrice);
        // console.log("MarketPrice:", nextProps.mktPriceMsg);
    }

    showSocketInfo = (val, index) => {
        const { list } = this.state;
        // const marketPrice = this.props.marketPrice;
        // const referencePrice = this.props.referencePrice;
        // const record = list[index];
        // if (record.source === "referencePrice"){
        //     if (record.symbol === referencePrice.symbol){
        //         const index = val === "TOP" ? 0 : parseInt(val) - 1;
        //         list[index].bid = referencePrice.bidPxs[index];
        //         list[index].ask = referencePrice.askPxs[index];
        //         let bidQtie = referencePrice.bidQties[index];
        //         let askQtie = referencePrice.askQties[index];
        //         list[index].bidQtie = this.getFormatQtie(bidQtie);
        //         list[index].askQtie = this.getFormatQtie(askQtie);
        //     }
        // } else {
        //     if (record.symbol === marketPrice.symbol && record.source === marketPrice.dataSource && record.type === marketPrice.tradingType){
        //         const index = val === "TOP" ? 0 : parseInt(val) - 1;
        //         list[index].bid = marketPrice.bidPxs[index];
        //         list[index].ask = marketPrice.askPxs[index];
        //         let bidQtie = marketPrice.bidQties[index];
        //         let askQtie = marketPrice.askQties[index];
        //         list[index].bidQtie = this.getFormatQtie(bidQtie);
        //         list[index].askQtie = this.getFormatQtie(askQtie);
        //     }
        // }
        list[index].qty = val;
        list[index].qtySelect = false;
        this.props.setLiquidityList([...list]);
    };

    updateInfo = (quoteOutput, marketPrice, referencePrice) => {
        let list = this.state.list;
        let flag = false;
        let current = this.state.current;
        list.map((item) => {
            let quoteCondi = false;
            let marketCondi = false;
            let referenceCondi = false;
            const symbol = item.symbol.replace(/\//, "");
            let type = item.type;
            if (item.type === "ESP SWEEP" || item.type === "ESP FULL"){
                type = "ESP";
            }

            if (item.type === "ODM" || type === "ESP"){
                if (item.type === "ODM" || item.type === "ESP SWEEP"){
                    marketCondi = symbol === marketPrice.symbol && type === marketPrice.tradingType && item.source === marketPrice.dataSource;
                }else if (item.type === "ESP FULL" && item.counterparty === "ALL") {

                    marketCondi = symbol === marketPrice.symbol && item.source === marketPrice.dataSource && type === marketPrice.tradingType && (marketPrice.counterParty === "" || !marketPrice.counterParty);
                }else {
                    marketCondi = symbol === marketPrice.symbol && item.source === marketPrice.dataSource && type === marketPrice.tradingType && item.counterparty === marketPrice.counterParty;
                }
            } else if (item.type === "RFQ"){
                // if (quoteOutput.requestId) {
                //     console.log("item.requestId", item.requestId);
                //     console.log("quoteOutput.requestId", quoteOutput.requestId);
                // }
                // quoteCondi = symbol === quoteOutput.symbol && type === quoteOutput.tradingType && item.source === quoteOutput.source && item.counterparty === quoteOutput.counterParty;
                quoteCondi = item.requestId && item.requestId === (quoteOutput.requestId + "");
                // console.log("quoteCondi:", quoteCondi);
            } else if (item.type === "RFS"){
                //quoteCondi = symbol === quoteOutput.symbol && item.source === quoteOutput.source && type === quoteOutput.tradingType && item.counterparty === quoteOutput.counterParty;
                marketCondi = symbol === marketPrice.symbol && item.source === marketPrice.dataSource && type === marketPrice.tradingType && item.counterparty === marketPrice.counterParty;
            } else if (item.type === "REF"){
                referenceCondi = symbol === referencePrice.symbol;
            }

            if (quoteCondi){
                const index = !item.qty || item.qty === "TOP" ? 0 : parseInt(item.qty) - 1;
                item.bid = quoteOutput.bidPxs[index];
                item.ask = quoteOutput.askPxs[index];
                let bidQtie = quoteOutput.bidQties[index];
                let askQtie = quoteOutput.askQties[index];
                item.bidQtie = this.getFormatQtie(bidQtie);
                item.askQtie = this.getFormatQtie(askQtie);
                item.highLow = quoteOutput.highPrice || 0 + "/" + (quoteOutput.lowPrice || 0);
                item.quoteOutput = {...quoteOutput};
                flag = true;
            }
            if (marketCondi){
                const index = !item.qty || item.qty === "TOP" ? 0 : parseInt(item.qty) - 1;
                item.bid = marketPrice.bidPxs[index];
                item.ask = marketPrice.askPxs[index];
                let bidQtie = marketPrice.bidQties[index];
                let askQtie = marketPrice.askQties[index];
                item.bidQtie = this.getFormatQtie(bidQtie);
                item.askQtie = this.getFormatQtie(askQtie);
                item.highLow = marketPrice.highPrice + "/" + marketPrice.lowPrice;
                item.marketPrice = {...marketPrice};
                flag = true;
            }
            if (referenceCondi){
                const index = !item.qty || item.qty === "TOP" ? 0 : parseInt(item.qty) - 1;
                item.bid = referencePrice.bidPxs[index];
                item.ask = referencePrice.askPxs[index];
                let bidQtie = referencePrice.bidQties[index];
                let askQtie = referencePrice.askQties[index];
                item.bidQtie = this.getFormatQtie(bidQtie);
                item.askQtie = this.getFormatQtie(askQtie);
                item.highLow = referencePrice.highPrice || 0  + "/" + (referencePrice.lowPrice || 0) ;
                item.referencePrice = {...referencePrice};
                flag = true;
            }
        });

        if (flag){
            if (current){
                this.setState({list, current: list[list.findIndex(item => item.index === current.index)]});
            }else {
                this.setState({list});
            }
        }
    };

    getFormatQtie = (num) => {
        if (typeof num !== "undefined"){
            if (num > 1000000) {
                return num/1000000 + "M";
            }
            if (num < 1000000 && num > 1000){
                return num/1000 + "K";
            }
            return num;
        }
    };
    componentWillUnmount() {
        this.props.setTradeBlotter();
        this.unsubscribleMsg();
        this.setState = (state,callback)=>{
            return;
        };
        // WebSocketClient.unsubscribeMessage({ subscriptionId: this.riskMonitorWsId, mtype: riskMonitorWebSocket });
    }
    // handleTableChange = (pagination, filters, sorter) => {
    //     let params = this.state.queryParams;
    //     params.startRecord = pagination.pageSize * (pagination.current - 1);
    //     this.setState({
    //         queryParams: params,
    //         pagination: pagination
    //     });
    //
    //     this.props.findRealtimeOrder(params);
    // };
    openAddTable = () =>{
        this.setState({addVisible: true});
        this.props.getSymbolList(this.state.list);
    };

    moveRow = (dragIndex, hoverIndex) => {
        const { list } = this.state;
        const dragRow = list[dragIndex];
        this.setState(
            update(this.state, {
                list: {
                    $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
                },
            }), ()=>{
                const tempList = this.state.list;
                const updateData = [];
                tempList.map((item, index)=>{
                    item.index = index;
                    updateData.push({id: item.id, seq: index});
                });
                // console.log(tempList);
                this.props.setLiquidityList(tempList);
                this.props.updateList(updateData);
            }
        );
    };

    onClickRow = (record) => {
        return {
            onClick: () => {
                this.setState({
                    clickRowId: record.key,
                });
            },
        };
    };

    setRowClassName = (record) => {
        return record.key === this.state.clickRowId ? "qit-tr-active" : "";
    };

    deleteLiquidity = () => {
        const index = this.state.lqtyClickId;
        let list = this.state.list;
        const indexAcl = list.findIndex(item => item.index === index);
        const record = list[indexAcl];
        if (typeof index !== "undefined") {
            this.props.deleteQdy({id: record.id}, (result) => {
                if (result.success){
                    list.splice(indexAcl, 1);
                    // this.setState({list: list});
                    this.props.setLiquidityList([...list]);
                    if (list.length > 0){
                        this.unsubscribleMsg();
                        this.subscribleMsg(list);
                    }else {
                        this.unsubscribleMsg();
                    }
                    message.success("Success!", 2);
                } else {
                    message.error("Failed!", 2);
                }
            });
        }
    };

    onRadioChange = (e) => {
        this.setState({
            mode: e.target.value,
            cpty: e.target.value==="ESP FULL"?"ALL":undefined
        });
    };

    onSymbolsChange = (value) => {
        this.setState({cpty: value});

    };

    sendRfqRequest = (params, index) => {
        this.props.sendQuoteReq(params, (result)=>{
            if (result.success){
                const requestId = JSON.parse(result.data).requestId;
                let list = this.state.list;
                list[index].requestId = requestId;
                // console.log("requestId:", requestId);
                // console.log("list:", list);
                this.props.setLiquidityList([...list]);
            }
        });
    };

    play = () => {
        document.getElementById("ddsound").play();
        setTimeout(function () {
            document.getElementById("ddsound") && document.getElementById("ddsound").pause();
        }, 8000);
    };

    render() {
        // console.log(this.state.current);
        let list = this.state.list;
        const components = {
            body: {
                row: DragableBodyRow,
            },
        };
        const columns = [
            { title: "", dataIndex: "symbol", align: "center", width: "80px" },
            { title: "Source", dataIndex: "source", key: "source" , align: "center",
                width: "8%", },
            { title: "Type", dataIndex: "type", align: "center", width: "10%" },
            { title: "CounterParty", dataIndex: "counterparty", align: "center", width: "12%" },
            { title: "Time", dataIndex: "time", align: "center", width: "10%" },
            { title: "Qty", dataIndex: "qty", align: "center", width: "10%", render: (text, record, index) => {
                return <div>
                    {
                        record.qtySelect ?
                            <Select key={index} defaultOpen onSelect={(val)=>{
                                this.showSocketInfo(val, index);
                            }} id="liquidity" size="small" className="qit-select-bg" defaultValue={"TOP"} style={{width: "50px"}}>
                                <Option key="TOP" value="TOP">TOP</Option>
                                <Option key="2" value="2">2</Option>
                                <Option key="3" value="3">3</Option>
                                <Option key="4" value="4">4</Option>
                                <Option key="5" value="5">5</Option>
                                <Option key="6" value="6">6</Option>
                            </Select> : <div onClick={(e)=>{
                                e.stopPropagation();
                                list[index].qtySelect = true;
                                // console.log(list);
                                this.props.setLiquidityList([...list]);
                            }
                            }>{text || "TOP"}<img src={require("../../../images/triangle.svg")}/></div>
                    }
                </div>;
            } },
            // { title: "BidQty", dataIndex: "bidQtie", align: "center", width: "8%"},
            { title: "Bid", dataIndex: "bid", align: "center", width: "15%", render: (text, record) => {
                return <div onClick={()=>{
                    this.setState({current: record, visible: true, clickAsk: false});
                }} style={{width: "70px", height: "100%", background: "#2BB48F"}}>
                    {text || "-"}
                </div>;
            } },
            { title: "Ask", dataIndex: "ask", align: "center", width: "16%",render: (text, record, index) => {
                return <div style={{display: "flex"}}>
                    <div onClick={(e)=>{
                        e.stopPropagation();
                        this.setState({current: record, visible: true, clickAsk: true});
                    }} style={{width: "70px", height: "100%", background: "#DD4B51"}}>
                        {text || "-"}
                    </div>
                    <Icon onClick={()=>{
                        let params = {
                            symbol: record.symbol.replace(/\//, ""),
                            tenor: record.tenor,
                            requestType: record.type,
                            source: record.source,
                            counterParty: record.counterparty,
                        };
                        const symbol = params.symbol;
                        const temp = symbol.split(".");
                        params.tenor = temp[1] || "SPOT";
                        if (record.side){
                            params.side = record.side;
                            params.qty = record.qty2;
                        }
                        this.sendRfqRequest(params, index);
                    }} style={{marginLeft: 5, fontSize: 16, display: record.type && (record.type.toLowerCase() === "rfq" ) ? "inline" : "none"}} type="sync" />
                </div>;
            } },
            // { title: "AskQty", dataIndex: "askQtie", align: "center", width: "8%"},
            { title: "High/Low", dataIndex: "highLow", align: "center", },

        ];


        const columnsAdd = [
            { title: "Symbol", dataIndex: "symbol", align: "center", width: "33%",
                // render: (text, record)=>{
                //     return text && text.replace(/\//g, "");
                // }
            },
            { title: "ProductType", dataIndex: "varietyType", align: "center", width: "33%"},
            { title: "Venue", dataIndex: "exchangeCode", align: "center", width: "33%"},
        ];
        const { getFieldDecorator } = this.props.form;

        const index = this.state.lqtyClickId;
        const indexAcl = list.findIndex(item => item.index === index);

        return (
            <div className="cardTableFullHeight" style={{minHeight: this.props.tableHeight}}>
                <Table
                    id="tradeOrder"
                    size="small"
                    components={components}
                    rowKey={(record,key)=>key}
                    scroll={{x: 800, y: this.props.tableHeight - 30}}
                    // bordered={true}
                    columns={columns}
                    loading={this.props.loading}
                    dataSource={this.state.list}
                    // pagination={this.state.pagination}
                    pagination={false}
                    // onChange={this.handleTableChange}
                    expandedRowKeys={this.state.expandedRows}
                    onExpandedRowsChange={(expandedRows)=>{console.log(expandedRows);this.setState({expandedRows});}}
                    expandedRowRender={record => <ExpandLayerInfo record={{...record}} /> }
                    // expandRowByClick={true}
                    rowClassName={(record) => {
                        return record.index === this.state.lqtyClickId ? "qit-tr-active" : "";
                    }}
                    onRow={(record, index) => {
                        return {
                            index,
                            moveRow: this.moveRow,
                            onClick: (event) => {
                                this.setState({
                                    lqtyClickId: record.index,
                                });
                            },       // 点击行
                            onDoubleClick: (event) => {
                                let expandedRows = this.state.expandedRows;
                                const index = expandedRows.indexOf(record.index);
                                console.log(index);
                                if (index === -1){
                                    expandedRows.push(record.index);
                                } else {
                                    expandedRows.splice(index, 1);
                                }
                                this.setState({expandedRows});
                            },
                            onContextMenu: (event) => {},
                            onMouseEnter: (event) => {},  // 鼠标移入行
                            onMouseLeave: (event) => {}
                        };
                    }}
                />
                <audio id='ddsound' src={require("../../../../marketMaker/images/placeOrder.wav")}/>
                <Modal
                    id="liquidity-modal"
                    visible={this.state.visible}
                    title="Order Entry"
                    bodyStyle={{background: "#151516"}}
                    confirmLoading={this.state.confirmLoading}
                    onOk={()=>{
                        this.setState({confirmLoading: true});
                        setTimeout(()=>{
                            console.log(this.state.confirmLoading);
                            if (this.state.confirmLoading){
                                this.setState({confirmLoading: false});
                            }
                        }, 10000);
                        this.placeOrder.onPlaceOrder((result)=>{
                            if (result.success) {
                                if (indexAcl !== -1 && list[indexAcl].type === "RFQ"){
                                    list[indexAcl].bid = undefined;
                                    list[indexAcl].ask = undefined;
                                    list[indexAcl].quoteOutput = undefined;
                                    this.props.setLiquidityList([...list]);
                                }
                                this.setState({visible: false, confirmLoading: false}, ()=>{
                                    this.play();
                                    message.success("Order Submitted!", 2);
                                });
                            } else {
                                this.setState({confirmLoading: false});
                                message.error("Failed!", 2);
                            }
                        });
                    }}
                    width={650}
                    onCancel={()=>{
                        this.setState({visible: false});
                    }}
                    className="darkTheme liquidity-modal"
                    closable={false}
                    destroyOnClose={true}
                    okButtonProps={{className: "place-order-btn", disabled: indexAcl !== -1 && list[indexAcl].type === "RFQ" && !list[indexAcl].quoteOutput, style: {background: "#2D81E5"}}}
                    okText={"Place Order"}
                >
                    <div style={{width:"100%",textAlign:"center"}}>
                        <PlaceOrder
                            handleRef={this.handleRef}
                            record={{...this.state.current}}
                            // marketPrice={this.props.mktPriceMsg}
                            // referencePrice={this.props.referencePrice}
                            clickAsk={this.state.clickAsk}
                        />
                    </div>
                </Modal>
                <Modal
                    visible={this.state.addVisible}
                    title="Symbol to Add"
                    destroyOnClose={true}
                    cancelText="CANCEL"
                    style={{position: "relative", top: 30, width: 600}}
                    onOk={()=>{
                        const clickRowId = this.state.clickRowId;
                        if (clickRowId){
                            this.props.form.validateFieldsAndScroll((err, values) => {
                                if (!err) {

                                    const addList = this.props.addList;
                                    const index = addList.findIndex(item => item.key === clickRowId);
                                    const record = addList[index];
                                    let flag = false;
                                    let list = this.state.list;
                                    //看看有没有重复添加
                                    list.map(item => {
                                        if (item.symbol === record.symbol && item.type === this.state.mode && item.source === record.exchangeCode && item.counterParty === this.state.cpty){
                                            flag = true;
                                        }
                                    });

                                    if (!flag) {
                                        this.props.addQuidity([{
                                            seq: this.state.list.length,
                                            symbol: record.symbol,
                                            venue: record.exchangeCode,
                                            market: record.fromREF ? "REF" : this.state.mode,
                                            counterparty: this.state.mode === "ODM" || this.state.mode === "ESP SWEEP" ? undefined : this.state.cpty
                                        }], (result) => {
                                            if (result.success) {
                                                // let list = this.state.list;
                                                let data = result.data[0];
                                                data.index = list.length;
                                                data.type = data.market;
                                                data.source = data.venue;
                                                data.counterparty = this.state.cpty;
                                                data.qty2 = this.state.qty;
                                                data.side = this.state.side;
                                                list.push(data);
                                                this.props.setLiquidityList([...list]);
                                                this.unsubscribleMsg();
                                                this.subscribleMsg(list);
                                                message.success("Success!", 2);
                                                if (this.state.mode === "RFQ"){
                                                    let params = {
                                                        symbol: record.symbol.replace(/\//, ""),
                                                        tenor: record.tenor,
                                                        source: data.venue,
                                                        counterParty: this.state.cpty,
                                                        // side: "TWOWAY",  //非必传
                                                        // qty: 1,  //非必传
                                                        requestType: this.state.mode,
                                                    };
                                                    const symbol = params.symbol;
                                                    const temp = symbol.split(".");
                                                    params.tenor = temp[1] || "SPOT";
                                                    if (this.state.side){
                                                        params.side = this.state.side;
                                                        params.qty = this.state.qty;
                                                    }
                                                    this.sendRfqRequest(params, data.index);
                                                }
                                                this.setState({
                                                    addVisible: false,
                                                    mode: undefined,
                                                    clickRowId: undefined,
                                                    cpty: undefined,
                                                    side: undefined,
                                                });
                                            } else {
                                                message.error("Failed!", 2);
                                            }
                                        });
                                    }else {
                                        message.error("Not repeatable!", 2);
                                    }
                                }
                            });
                        }
                    }}
                    onCancel={()=>{
                        this.setState({
                            addVisible: false,
                            mode: undefined,
                            cpty: undefined,
                            side: undefined,
                        });
                    }}
                    className="darkTheme"
                >
                    <Search
                        placeholder="input symbol"
                        onSearch={value => {
                            if (value.trim() !== "") {
                                // console.log("yes");
                                let addList = this.props.addListCopy;
                                addList = addList.filter(function (item) {
                                    return item.symbol.toLowerCase().indexOf(value.toLowerCase()) !== -1;
                                });
                                this.props.setAddList(addList);
                            }else {
                                this.props.setAddList(this.props.addListCopy);
                            }
                        }}
                        style={{ width: 200 }}
                    />
                    <Table
                        size="small"
                        className="ant-tr-hover"
                        rowKey={(record,key)=>key}
                        style={{marginTop: 10}}
                        scroll={{y: 350}}
                        columns={columnsAdd}
                        loading={this.props.addLoading}
                        dataSource={this.props.addList}
                        // pagination={this.state.pagination}
                        pagination={false}
                        // onChange={this.handleTableChange}
                        rowClassName={this.setRowClassName}
                        onRow={this.onClickRow}
                    />
                    <Form id="place-order-form">
                        <div style={{marginTop: 10}}>
                            {/*<div style={{fontWeight: "bold"}}>Mode</div>*/}
                            <div style={{marginTop: 5}}>
                                <Form.Item style={{margin:0}} colon={false} label={<span style={{fontWeight: "bold", marginRight: 10}}>Mode</span>}>
                                    {getFieldDecorator("mode", {
                                        rules: [{required: true,  message: "Please input your Mode!" }],
                                    })(
                                        <RadioGroup onChange={this.onRadioChange}>
                                            <Radio value={"ODM"}>ODM</Radio>
                                            <Radio value={"ESP SWEEP"}>ESP SWEEP</Radio>
                                            <Radio value={"ESP FULL"}>ESP FULL</Radio>
                                            <Radio value={"RFQ"}>RFQ</Radio>
                                            <Radio value={"RFS"}>RFS</Radio>
                                        </RadioGroup>
                                    )}
                                </Form.Item>
                            </div>
                        </div>
                        {
                            this.state.mode && this.state.mode !== "ODM" && this.state.mode !== "ESP SWEEP" && this.state.mode !== "ESP FULL" &&
                            <div style={{marginTop: 10,}} className={"add-symbol"} id={"add-symbol"}>
                                <Form.Item style={{margin:0}} colon={false} label={<span style={{fontWeight: "bold", marginRight: 10}}>Counterparty</span>}
                                    labelCol={{ span: 6 }}
                                    wrapperCol={{ span: 14 }}>
                                    {getFieldDecorator("cpty", {
                                        rules: [{required: true, message: "Please input your Counterparty!" }],
                                    })(
                                        <Select
                                            id={"liquidity-select-cpty"}
                                            className="qit-select-bg"
                                            style={{width: 100}}
                                            size={"small"}
                                            onChange={(value)=>{this.onSymbolsChange(value);}}
                                        >
                                            {
                                                this.state.mode === "ESP FULL" && <Option key="ALL" value="ALL">ALL</Option>
                                            }
                                            {
                                                this.state.cptyList.map(item => (<Option key={item.code} value={item.code}>{item.code}</Option>))
                                            }
                                        </Select>
                                    )}
                                </Form.Item>
                                {
                                    this.state.mode === "RFQ" &&
                                    <Form.Item style={{margin: 0}} colon={false}
                                        labelCol={{span: 6}}
                                        wrapperCol={{span: 14}}
                                        label={<span style={{fontWeight: "bold", marginRight: 10}}>Side</span>}>
                                        {getFieldDecorator("side", {
                                            // rules: [{required: true, message: "Please select your Side!"}],
                                        })(
                                            <Select
                                                id={"liquidity-select-cpty"}
                                                className="qit-select-bg"
                                                style={{width: 100}}
                                                size={"small"}
                                                onChange={(value) => {
                                                    this.setState({side: value});
                                                }}
                                            >
                                                <Option key={"BUY"} value={"BUY"}>BUY</Option>
                                                <Option key={"SELL"} value={"SELL"}>SELL</Option>
                                            </Select>
                                        )}
                                    </Form.Item>
                                }
                                {
                                    this.state.mode === "RFQ" &&
                                    <Form.Item style={{margin: 0}} colon={false}
                                        label={<span style={{fontWeight: "bold", marginRight: 10}}>Qty</span>}
                                        labelCol={{span: 6}}
                                        wrapperCol={{span: 14}}>
                                        {getFieldDecorator("qty", {
                                            rules: [{required: this.state.side, message: "Please input your Qty!"}],
                                        })(
                                            <InputNumber onChange={(val)=>{this.setState({qty: val});}} style={{width: 100}}/>
                                        )}
                                    </Form.Item>
                                }
                            </div>
                        }
                    </Form>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    loading: state.LiquidityReducer.loading,
    list: state.LiquidityReducer.list,
    totalRecords: state.LiquidityReducer.totalRecords,
    addLoading: state.LiquidityReducer.addLoading,
    addList: state.LiquidityReducer.addList,
    addListCopy: state.LiquidityReducer.addListCopy,
    referencePrice: state.LiquidityReducer.referencePrice,
    // mktPriceMsg: state.globalReducer.mktPriceMsg,
    mktPriceMsg: state.LiquidityReducer.mktPriceMsg,
    quoteOutput: state.manualQuoteReducer.quoteOutput,
});

const mapDispatchToProps = dispatch => ({
    getLiquidityList: (params, cb)=>dispatch(getLiquidityList(params, cb)),
    checkLogin:(cb) =>dispatch(checkLogin(cb)),
    updatePositionList: (positionList) => dispatch(updatePositionList(positionList)),
    setTradeBlotter: () => dispatch(setTradeBlotter()),
    setLiquidityList: (params, cb)=>dispatch(setLiquidityList(params, cb)),
    getSymbolList: (params, cb)=>dispatch(getSymbolList(params, cb)),
    setAddList: (params, cb)=>dispatch(setAddList(params, cb)),
    addQuidity: (params, cb)=>dispatch(addQuidity(params, cb)),
    deleteQdy: (params, cb)=>dispatch(deleteQdy(params, cb)),
    getCptyList: (params, cb)=>dispatch(getCptyList(params, cb)),
    updateList: (params, cb)=>dispatch(updateList(params, cb)),
    sendQuoteReq: (params, cb)=>dispatch(sendQuoteReq(params, cb)),
    setSocketConnected: (params) => dispatch(setSocketConnected(params)),
    setMarketPrice: (message) => dispatch(setMarketPrice(message)),
    setReferencePrice: (message) => dispatch(setReferencePrice(message)),
});

// const LiquidityTableTrag = DragDropContext(HTML5Backend)(LiquidityTable);
const LiquidityTableForm = Form.create()(LiquidityTable);
export default connect(mapStateToProps,mapDispatchToProps)(LiquidityTableForm);
