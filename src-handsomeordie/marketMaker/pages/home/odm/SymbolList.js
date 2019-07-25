import React from "react";
import { Table, Icon, message, Spin, Statistic } from "antd/lib/index";
import "./../../../../common/styles/home/ODM/symbolList.scss";
import { updateOrderBookList, getInstance, startInstance, stopInstance, setOrderBook,
    setOrderBook1, setOrderBook2, setOrderBook3, setMarketData, setSymbolClickId, } from "../../../actions/spdb/odmAction";
import { setSocketConnected, } from "../../../actions/spdb/globalAction";
import { connect } from "react-redux";
import square from "../../../images/square.png";
import sanjiao from "../../../images/sanjiao.png";
import WebSocketClient from "../../../socket/WebSocketClient";
import {marketPriceWebSocket,  } from "../../../../common/marketApi";
import { quoteOutput, makingInstanceOutput,} from "../../../../common/spdbApi";
import {checkLogin} from "../../../actions/marketDetail";
import {getOffset, getPixs} from "../../../utils/commonFun";

class SymbolList extends React.Component {
    state = {
        clickRowId: undefined,
        data: [],
        loading: false,
        running: false,
        clicking: false,
    }

    componentDidMount() {
        this.props.handleRef(this);
        this.props.checkLogin((data) => {
            if (data){
                this.refreshTable();
                this.subscrible();
            }
        });
    }

    subscrible = () => {
        this.props.checkLogin((data) => {
            if (data) {
                if (!window.conn) {
                    window.conn = true;
                    WebSocketClient.connect({onError: this.onError, onOpen: this.onOpen, onReconnect: this.onReconnect, onClose: this.onClose});
                }
                this.marketPriceId = WebSocketClient.subscribeMessage({
                    mtype: marketPriceWebSocket,
                    callback: (message)=>{
                        this.onMarketPriceMsg(message);
                    },
                    scope: this
                });
                this.quoteOutputId = WebSocketClient.subscribeMessage({
                    mtype: quoteOutput,
                    callback: (message)=>{
                        this.onQuoteOutputMsg(message);
                    },
                    scope: this
                });
                this.makingInstanceOutputId = WebSocketClient.subscribeMessage({
                    mtype: makingInstanceOutput,
                    callback: (message)=>{
                        this.onMakingInstance(message);
                    },
                    scope: this
                });
            }
        });
    }

    onMarketPriceMsg = (message) => {
        const data = this.state.data;
        const index = data.findIndex(item => item.code === message.symbol && item.settlType === message.settlType);
        if (index !== -1) {
            // console.log("#", JSON.parse(JSON.stringify(data)));
            const bidPxs = message.bidPxs[0];
            const askPxs = message.askPxs[0];
            data[index].marketBidOfferPrices = [bidPxs, askPxs];
            // console.log(index);
            // console.log(JSON.parse(JSON.stringify(data)));
            // console.log("@", JSON.parse(JSON.stringify(this.state.data)));
            // setTimeout(()=>{
            //     console.log("yyy");
            this.setState({ data });
            // }, 1000 * 300);

            let mkData = this.props.mkData;
            mkData[data[index].instanceId] = data[index];
            this.props.setMarketData(mkData);
        }
    }

    onQuoteOutputMsg = (message) => {
        const data = this.state.data;
        // const settlType = message.settlType === "1" ? "T0" : message.settlType === "2" ? "T1" : "";
        const index = data.findIndex(item => item.symbol + item.settlType === message.symbol + message.settlType);
        if (index !== -1) {
            data[index].quoteBidOfferPrice = [message.bidPxs[0], message.askPxs[0]];
            this.setState({ data });
        }

        // const data = this.state.data;
        // const settlType = message.settlType === 1 ? "T0" : message.settlType === 2 ? "T1" : "";
        // const index = data.findIndex(item => item.symbol === message.symbol);
        // if (index !== -1) {
        //     data[index].quoteBidOfferPrice = [message.bidPxs[0], message.askPxs[0]];
        //     this.setState({ data });
        //     let isEdit = false;
        //     const orderBookList = this.props.orderBookList;
        //     orderBookList.map(instance => {
        //         if (instance.symbol === message.symbol){
        //             isEdit = true;
        //             instance.quoteBidOfferPrice = data[index].quoteBidOfferPrice;
        //         }
        //     });
        //     isEdit && this.props.updateOrderBookList(orderBookList);
        // }

    }

    onMakingInstance = (message) => {
        const data = this.state.data;
        const index = data.findIndex(item => item.instanceId === message.instanceId);
        if (index !== -1) {
            data[index].quoteSpread = message.quoteSpread;
            data[index].quoteSkew = message.quoteSkew;
            data[index].duration = message.duration;
            data[index].position = message.position;
            data[index].pnl = message.pnl;
            // data[index].status = message.status;
            this.setState({ data });
        }
    }

    unsubscribleMsg = () => {
        WebSocketClient.unsubscribeMessage({ subscriptionId: this.marketPriceId, mtype: marketPriceWebSocket });
        WebSocketClient.unsubscribeMessage({ subscriptionId: this.quoteOutputId, mtype: quoteOutput });
        WebSocketClient.unsubscribeMessage({ subscriptionId: this.makingInstanceOutputId, mtype: makingInstanceOutput });
    };

    componentWillUnmount() {
        console.log("xxxxxx");
        this.unsubscribleMsg();
        this.setState = (state,callback)=>{
            return;
        };
    }

    onOpen = () => {
        this.props.setSocketConnected(1);
    };

    onReconnect = () => {
        this.props.setSocketConnected(2);
    };
    onClose = () => {
        this.props.setSocketConnected(3);
    };
    onError = () => {
        this.props.setSocketConnected(3);
    };

    start = (instanceId, cb) => {
        const data = this.state.data;
        const index = data.findIndex(item => item.instanceId === instanceId);
        data[index].running = true;
        this.setState({ data });
        this.props.startInstance({instanceId: instanceId}, (result)=>{
            data[index].running = false;
            if (result.success){
                data[index].status = "STARTED";
                const { orderBook1, orderBook2, orderBook3,} = this.props;
                if (orderBook1 && orderBook1.instanceId === instanceId){
                    orderBook1.status = "STARTED";
                    this.props.setOrderBook1(orderBook1);
                }
                if (orderBook2 && orderBook2.instanceId === instanceId){
                    orderBook2.status = "STARTED";
                    this.props.setOrderBook2(orderBook2);
                }
                if (orderBook3 && orderBook3.instanceId === instanceId){
                    orderBook3.status = "STARTED";
                    this.props.setOrderBook3(orderBook3);
                }
                message.success("启动成功！", 2);
            } else {
                message.error(result.message, 2);
            }
            this.setState({data});
            cb && cb();
        });
    }

    stop = (instanceId, cb) => {
        const data = this.state.data;
        const index = data.findIndex(item => item.instanceId === instanceId);
        data[index].running = true;
        this.setState({ data });
        this.props.stopInstance({instanceId: instanceId}, (result)=>{
            data[index].running = false;
            if (result.success){
                data[index].status = "STOPPED";
                const { orderBook1, orderBook2, orderBook3,} = this.props;
                if (orderBook1 && orderBook1.instanceId === instanceId){
                    orderBook1.status = "STOPPED";
                    this.props.setOrderBook1(orderBook1);
                }
                if (orderBook2 && orderBook2.instanceId === instanceId){
                    orderBook2.status = "STOPPED";
                    this.props.setOrderBook2(orderBook2);
                }
                if (orderBook3 && orderBook3.instanceId === instanceId){
                    orderBook3.status = "STOPPED";
                    this.props.setOrderBook3(orderBook3);
                }
                message.success("停止成功！", 2);
            } else {
                message.error("停止失败！", 2);
            }
            this.setState({data});
            cb && cb();
        });
    }

    refreshTable = (onlyRefresh) => {
        this.setState({loading: true});
        this.props.getInstance({}, ( result )=>{
            if (!result.success) {
                message.error("报价查询失败！", 2);
                this.setState({loading: false});
                return;
            }
            const data = result.data;
            let colors = this.randomHexColor(data.length);
            data.map((item, index) => {
                item.key = index;
                item.minTick = 0.0001;
                item.running = false;
                item.color = colors[index];
                // item.quoteBidOfferPrice = [0.7112, 0.7117];
                // item.quoteSpread = 3;
                // item.marketSpread = 2;
            });
            if (!onlyRefresh && typeof this.state.clickRowId !== "undefined"){
                const index = data.findIndex(item => item.key === this.state.clickRowId);
                this.clickTr(data[index]);
            }
            this.setState({ data, loading: false });
        });
    }

    randomHexColor = (num) => { //随机生成十六进制颜色
        let colors = ["#ab43d4", "#50e3c2", "#e19e4a", "#32ac48", "#4a8fe1", "#bfc655", "#e94128", "#f16095", "#584ae1", "#c70080"];

        for (let i=0;i<num;i++){
            let hex = Math.floor(Math.random() * 16777216).toString(16); //生成ffffff以内16进制数
            while (hex.length < 6) { //while循环判断hex位数，少于6位前面加0凑够6位
                hex = "0" + hex;
            }
            colors.push("#" + hex);//返回‘#'开头16进制颜色
        }
        return colors;
    }

    clickTr = (record) => {
        this.setState({
            clickRowId: record.key,
        });
        this.props.setSymbolClickId(record.key);
    }
    onDoubleClick = (record) => {
        const { orderBook1, orderBook2, orderBook3,} = this.props;
        let orderBook = {};
        // if (!orderBook1){
        //     orderBook = { orderBook1: record };
        // } else if (!orderBook2){
        //     orderBook = { orderBook1: record, orderBook2: orderBook1 };
        // } else if (!orderBook3){
        //     orderBook = { orderBook1: record, orderBook2: orderBook1, orderBook3: orderBook2 };
        // }
        if (orderBook1 && record.instanceId === orderBook1.instanceId){
            // orderBook = {orderBook1, orderBook2, orderBook3};
            // this.props.setOrderBook(orderBook);
            return;
        }
        if (!(orderBook1 && orderBook2 && orderBook3)){
            orderBook = { orderBook1: record, orderBook2: orderBook1, orderBook3: orderBook2 };
            if (orderBook2 && record.instanceId === orderBook2.instanceId){
                orderBook = { orderBook1: record, orderBook2: orderBook1,};
            }
        } else if (record.instanceId !== orderBook1.instanceId && record.instanceId !== orderBook2.instanceId && record.instanceId !== orderBook3.instanceId){
            orderBook = { orderBook1: record, orderBook2: orderBook1, orderBook3: orderBook2 };
        } else if (record.instanceId === orderBook2.instanceId){
            orderBook = {orderBook1: orderBook2, orderBook2: orderBook1, orderBook3: orderBook3};
        } else if (record.instanceId === orderBook3.instanceId){
            orderBook = {orderBook1: orderBook3, orderBook2: orderBook1, orderBook3: orderBook2};
        }
        this.props.setOrderBook(orderBook);
    }

    onRow = record => {
        return {
            onClick: event => {
                this.clickTr(record);
            }, // 点击行
            onDoubleClick: event => {
                this.onDoubleClick(record);
            },
            onContextMenu: event => {},
            onMouseEnter: event => {}, // 鼠标移入行
            onMouseLeave: event => {},
        };
    }

    setRowClassName = (record) => {
        return record.key === this.state.clickRowId ? "qit-tr-active" : "";
    };

    getFormatValue = (value, minTick) => {
        if (value === 0) {
            return value;
        }
        const offset = getOffset(minTick);
        let temp = Math.round((value * offset) + minTick / 10) / offset;
        return temp.toFixed(getPixs(minTick));
    }

    parseSecond = (seconds) => {
        let parseTime = seconds;
        //second
        if(parseTime < 60)
            parseTime = "00:00:" + (parseTime < 10 ? "0" + parseTime : parseTime);
        //minute
        else if(parseTime >= 60 && parseTime<3600) {
            let minute = parseTime/60 + "";
            if(minute.indexOf(".") !== -1) {
                minute = minute.substr(0,minute.indexOf("."));
            }
            let second = parseTime - 60*parseInt(minute);
            parseTime = "00:" + (minute < 10 ? "0" + minute : minute) + ":";
            parseTime += (second < 10 ? "0" + second : second);

        }
        //hour
        else if(parseTime >= 3600) {
            let hour = parseTime/3600 + "";
            if(hour.indexOf(".") !== -1) {
                hour = hour.substr(0,hour.indexOf("."));
            }
            let minute = parseTime - 3600*parseInt(hour);
            minute = (parseTime - 3600*parseInt(hour))/60 + "";
            if(minute.indexOf(".") !== -1) {
                minute = minute.substr(0,minute.indexOf("."));
            }

            let second = ((parseTime - 3600*parseInt(hour))) - 60*parseInt(minute);

            parseTime = (hour < 10 ? "0" + hour : hour) + ":";
            parseTime += (minute < 10 ? "0" + minute : minute) + ":";
            parseTime += (second < 10 ? "0" + second : second);

        }
        return parseTime;
    };

    showCode = (text,record) => {
        const {tradingvarietymanage} = this.props;
        // console.log(tradingvarietymanage);
        for(let i in tradingvarietymanage){
            if(tradingvarietymanage[i].key === text){
                return tradingvarietymanage[i].displayName;
            }
        }
        return "";
    }

    render() {
        const { orderBook1, orderBook2, orderBook3,} = this.props;
        const columns = [
            {
                title: "合约类型",
                dataIndex: "marketIndicator",
                align: "center",
                render: (text, record) => {
                    let index = orderBook1 && orderBook1.instanceId === record.instanceId ? 0 :
                        orderBook2 && orderBook2.instanceId === record.instanceId ? 1 :
                            orderBook3 && orderBook3.instanceId === record.instanceId ? 2 : -1;
                    return (
                        <div style={{height: "100%", lineHeight: "20px"}}>
                            <div style={{
                                position: "absolute",
                                display: "inline-block",
                                width: index !== -1 ? 5 : 0,
                                height: "100%",
                                // background: index === 0 ? "#2DC9AC" : index === 1 ? "#A365D3" : "#F3E439",
                                background: record.color,
                                top: 0,
                                left: 0,
                            }}/>
                            <div style={{display: "inline-block"}}>{text === "4" ? "现券" : text === "5" ? "债券远期" : text}</div>
                        </div>
                    );
                },
                width: "7%",
            },
            {
                title: "代码",
                dataIndex: "code",
                align: "center",
                width: "9%",
                render: (text,record) => {
                    return this.showCode(text,record);
                }
            },
            {
                title: "清算速度",
                dataIndex: "settlType",
                align: "center",
                width: "7%",
                render: (text)=>(text === "1" ? "T+0" : text === "2" ? "T+1" : text)
            },
            {
                title: "市场最优",
                dataIndex: "c",
                align: "center",
                render: (text, record)=>(record.marketBidOfferPrices ?
                    <div className={"price-style"}>
                        <span>{record.marketBidOfferPrices[0] ? <Statistic valueStyle={{color: record.marketBidOfferPrices[0] === 0 ? "white" : "#00cc99"}} value={record.marketBidOfferPrices[0]} precision={record.marketBidOfferPrices[0] ? 4 : 0}/> : "--"}</span>&nbsp;/&nbsp;
                        <span>{record.marketBidOfferPrices[1] ? <Statistic valueStyle={{color: record.marketBidOfferPrices[1] === 0 ? "white" : "#EA4F53"}} value={record.marketBidOfferPrices[1]} precision={record.marketBidOfferPrices[1] ? 4 : 0}/> : "--"}</span>
                    </div> : null),
                width: "13%",
            },
            {
                title: "我的报价",
                dataIndex: "d",
                align: "center",
                render: (text, record)=>(record.quoteBidOfferPrice ?
                    <div className={"price-style"}>
                        <span>{record.status === "STARTED" && record.quoteBidOfferPrice[0] ? <Statistic valueStyle={{color: !record.quoteBidOfferPrice[0] || record.status !== "STARTED"? "white" : "#00cc99"}} value={record.quoteBidOfferPrice[0]} precision={record.quoteBidOfferPrice[0] ? 4 : 0}/> : "--"}</span>&nbsp;/&nbsp;
                        <span>{record.status === "STARTED" && record.quoteBidOfferPrice[1] ? <Statistic valueStyle={{color: !record.quoteBidOfferPrice[1] || record.status !== "STARTED"? "white" : "#EA4F53"}} value={record.quoteBidOfferPrice[1]} precision={record.quoteBidOfferPrice[1] ? 4 : 0}/> : "--"}</span>
                    </div> : null),
                width: "13%",
            },
            {
                title: "Spread",
                dataIndex: "quoteSpread",
                align: "center",
                width: "6%",
            },
            {
                title: "Skew",
                dataIndex: "quoteSkew",
                align: "center",
                width: "6%",
            },
            {
                title: "时间",
                dataIndex: "duration",
                align: "center",
                width: "7%",
                render: (text)=>(text && this.parseSecond(text))
            },
            {
                title: "算法",
                dataIndex: "algo",
                align: "center",
                render: (text)=>(
                    <div style={{height: 15, background: "#3e9896", lineHeight: "15px", margin: "0 5px"}}>
                        {text === "Manual" ? "手动" : text}
                    </div>),
                width: "7%",
            },
            {
                title: "运行状态",
                dataIndex: "status",
                align: "center",
                render: (text, record, index)=>(<Spin spinning={record.running} indicator={<Icon type="loading" style={{ fontSize: 20, cursor: "default" }} spin />}>
                    {
                        text === "STARTED" ?
                            <img onClick={()=>{
                                this.stop(record.instanceId);
                            }} style={{cursor: "pointer"}} width={16} src={square}/> :
                            <img onClick={()=>{
                                this.start(record.instanceId);
                            }} style={{cursor: "pointer"}} width={16} src={sanjiao}/>
                    }
                </Spin>),
                width: "7%",
            },
            {
                title: "头寸(万)",
                dataIndex: "position",
                align: "center",
                width: "9%",
                render: (text) => (<Statistic value={Math.abs(text/10000) < 1 ? 0 : text/10000} precision={0} />)
            },
            {
                title: "损益(万)",
                dataIndex: "pnl",
                align: "center",
                render: (text) => (<Statistic value={Math.floor(text*10000 )/10000/10000 < 0.0001 ? 0 : Math.floor(text*10000 )/10000/10000} precision={4}/>)
            },
        ];
        return (
            <div className={"symbol-wrapper"}>
                <Table
                    rowKey={(record)=>record.key}
                    className={"ant-tr-hover"}
                    loading={this.state.loading}
                    columns={columns}
                    dataSource={this.state.data}
                    rowClassName={this.setRowClassName}
                    pagination={false}
                    bordered={false}
                    onRow={this.onRow}
                    scroll={{y: this.props.symbolListContentHeight - 35}}
                />
            </div>
        );
    }
}
const mapStateToProps = state => ({
    orderBookList: state.odmReducer.orderBookList,
    tradingvarietymanage: state.odmReducer.tradingvarietymanage,
    orderBook1: state.odmReducer.orderBook1,
    orderBook2: state.odmReducer.orderBook2,
    orderBook3: state.odmReducer.orderBook3,
    mkData: state.odmReducer.mkData,
});

const mapDispatchToProps = dispatch => ({
    updateOrderBookList: (orderBookList, cb) => dispatch(updateOrderBookList(orderBookList, cb)),
    getInstance: (params, cb) => dispatch(getInstance(params, cb)),
    startInstance: (params, cb) => dispatch(startInstance(params, cb)),
    stopInstance: (params, cb) => dispatch(stopInstance(params, cb)),
    checkLogin:(cb) =>dispatch(checkLogin(cb)),
    setOrderBook: (params, cb) => dispatch(setOrderBook(params, cb)),
    setOrderBook1: (params, cb) => dispatch(setOrderBook1(params, cb)),
    setOrderBook2: (params, cb) => dispatch(setOrderBook2(params, cb)),
    setOrderBook3: (params, cb) => dispatch(setOrderBook3(params, cb)),
    setMarketData: (params, cb) => dispatch(setMarketData(params, cb)),
    setSymbolClickId: (params) => dispatch(setSymbolClickId(params)),
    setSocketConnected: (params) => dispatch(setSocketConnected(params)),
});
export default connect(mapStateToProps,mapDispatchToProps)(SymbolList);
