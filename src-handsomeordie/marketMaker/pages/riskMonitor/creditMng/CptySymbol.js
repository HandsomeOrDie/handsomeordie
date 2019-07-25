import {connect} from "react-redux";
import React, {Component} from "react";
import {Collapse, Tabs, Row, Col, Card, Icon, Input, InputNumber, Table, message} from "antd";
import {getAllCreditCpty} from "../../../actions/creditCounterParty";
import "../../../../common/styles/marketPages/riskMonitor.scss";
import {checkLogin} from "../../../actions/marketDetail";
import WebSocketClient from "../../../socket/WebSocketClient";
import {marketPriceWebSocket, riskMonitorWebSocket} from "../../../../common/marketApi";
import {setSocketConnected, updateMarketPrice} from "../../../actions/globalAction";

class CptySymbol extends Component {
    state = {
        clickTdId: undefined,
        data: [],
        columns: [],
        loading: false,
    }

    componentDidMount() {
        this.props.checkLogin((data) => {
            if (data) {
                let _this = this;
                if (!window.conn) {
                    window.conn = true;
                    WebSocketClient.connect({onError: this.onError, onOpen: this.onOpen, onReconnect: this.onReconnect, });
                }
                this.marketPriceId = WebSocketClient.subscribeMessage({
                    mtype: marketPriceWebSocket,
                    callback: (message)=>{
                        // console.log(this.props.marketPrice);
                        this.props.updateMarketPrice(message, this.props.marketPrice);
                    },
                    params:{key: "15235168"},
                    scope: this
                });
            }
        });
        this.setState({loading: true});
        this.props.getAllCreditCpty({}, (result)=>{
            const data = result.data;
            let currencys = new Set();
            let counterPartys = new Set();
            data.map(item => {
                currencys.add(item.currency);
                counterPartys.add(item.code);
            });
            let handleData = [];
            Array.from(counterPartys).map(cpty => {
                const record = {};
                record.code = cpty;
                Array.from(currencys).map(ccy => {
                    const index = data.findIndex(item => item.code === cpty && item.currency === ccy);
                    if (index !== -1){
                        record[ccy] = data[index].upCredit;
                    } else {
                        record[ccy] = 0;
                    }
                });
                handleData.push(record);
            });
            const columns = Array.from(currencys).map(item => {
                return {title: item, dataIndex: item, align: "center", render: val => <div style={{color: val < 0 ? "#DD4B51": "#52c41a"}}>{this.fmoney(val, 3)}</div>};
            });

            columns.splice(0, 0, {title: "", dataIndex: "code", align: "center"});
            columns.push({title: "Total", dataIndex: "total", align: "center", render: val => <div style={{color: val < 0 ? "#DD4B51": "#52c41a"}}>{this.fmoney(val, 3)}</div>});
            this.setState({columns, data: handleData, loading: false});
        });
    }

    onError = () => {
        this.props.setSocketConnected(3);
    };

    onOpen = () => {
        this.props.setSocketConnected(1);
    };

    onReconnect = () => {
        this.props.setSocketConnected(2);
    };

    calcuteTotal = (data, marketPrice)=>{
        // console.log(data);
        data.map(item => {
            let total = 0;
            Object.keys(item).map(field => {
                if (field !== "code" && field !== "total"){
                    total = total + this.getExchangeUsd(field, item[field], marketPrice);
                }
            });
            item.total = total;
            // console.log(total);
        });
        return data;
    }

    getExchangeUsd = (symbol, credit, marketPrice) => {
        if (marketPrice[symbol + "USD"]){
            const rate = credit > 0 ? marketPrice[symbol + "USD"].bid : marketPrice[symbol + "USD"].ask;
            return credit * rate;
        }else if (marketPrice["USD" + symbol]) {
            const rate = credit > 0 ? marketPrice["USD" + symbol].bid : marketPrice["USD" + symbol].ask;
            return credit / rate;
        }else if (symbol === "USD") {
            return credit;
        }else {
            return 0;
        }
    }

    fmoney =(s, n) =>{
        // console.log(s);
        n = n > 0 && n <= 20 ? n : 2;
        s = parseFloat((s + "").replace(/[^\d\\.-]/g, "")).toFixed(n) + "";
        var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
        let t = "";
        for (let i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? "," : "");
        }
        let result = t.split("").reverse().join("") + "." + r;
        result = result.replace("-,", "-");
        if (result.substring(result.length-4, result.length) === ".000"){
            return result.substring(0, result.length - 4);
        }
        return result;
    }

    componentWillReceiveProps(nextProps) {
        const data = this.calcuteTotal(this.state.data, nextProps.marketPrice);
        this.setState({data});
    }

    render() {
        return (
            <div id={"cptySymbol"}>
                <Table
                    rowKey={(record)=>record.code}
                    className="ant-tr-hover"
                    loading={this.props.loading}
                    scroll={{y: this.props.tableHeight + 21}}
                    columns={this.state.columns}
                    dataSource={this.state.data}
                    size="small"
                    pagination={false}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    marketPrice: state.globalReducer.marketPrice,
});

const mapDispatchToProps = dispatch => ({
    getAllCreditCpty: (params, cb) => dispatch(getAllCreditCpty(params, cb)),
    checkLogin:(cb) =>dispatch(checkLogin(cb)),
    updateMarketPrice: (message, marketPrice) => dispatch(updateMarketPrice(message, marketPrice)),
    setSocketConnected: (params) => dispatch(setSocketConnected(params)),
});

export default connect(mapStateToProps,mapDispatchToProps)(CptySymbol);
// export default connect(mapStateToProps,mapDispatchToProps)(CounterParty);
