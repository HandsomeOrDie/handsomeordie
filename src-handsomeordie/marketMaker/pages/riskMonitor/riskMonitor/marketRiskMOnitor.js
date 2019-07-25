import {connect} from "react-redux";
import React, {Component} from "react";
import {Card, Table} from "antd";
import {marketRiskStatusFind} from "../../../actions/riskMonitorMain";
import WebSocketClient from "../../../socket/WebSocketClient";
import {riskSorket} from "../../../../common/marketApi";
import {checkLogin} from "../../../actions/marketDetail";
import {setSocketConnected} from "../../../actions/globalAction";
class MarketRiskMOnitor extends Component {
    state = {
        dataSource: []
    }

    componentDidMount() {
        this.props.marketRiskStatusFind((data)=>{
            this.setState({
                dataSource: data
            });
        });

        this.props.checkLogin((data) => {
            if (data) {
                let _this = this;
                WebSocketClient.connect({onError: this.onError, onOpen: this.onOpen, onReconnect: this.onReconnect, });
                this.riskSorketId = WebSocketClient.subscribeMessage({
                    mtype: riskSorket,
                    callback: function (message) {
                        // console.log(message);
                        _this.handleSubscribe(message);
                    }
                });
            }
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

    handleSubscribe = (message) => {
        let dataSource = this.state.dataSource;
        const index = dataSource.findIndex(item => item.id === message.id);
        if (index !== -1){
            dataSource.splice(index, 1, message);
        } else {
            dataSource.push(message);
        }
        this.setState({dataSource});
    }

    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return;
        };
        WebSocketClient.unsubscribeMessage({ subscriptionId: this.riskSorketId, mtype: riskSorket });
    }

    fmoney =(s, n) =>{
        n = n > 0 && n <= 20 ? n : 2;
        s = parseFloat((s + "").replace(/[^\d\\.-]/g, "")).toFixed(n) + "";
        var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
        let t = "";
        for (let i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? "," : "");
        }
        let result = t.split("").reverse().join("") + "." + r;
        result = result.replace("-,", "-");
        if (result.substring(result.length-3, result.length) === ".00"){
            return result.substring(0, result.length - 3);
        }
        return result;
    }

    render() {
        // console.log(this.props.marketRiskStatus);
        const cardHeight = document.documentElement.clientHeight - 50 - 52 - 95 - 18+80;
        const {dataSource} = this.state;
        const columns = [
            {
                title: "Group",
                dataIndex: "riskGroup",
                key: "riskGroup",
                align: "center",
                width: "10%",
            }, {
                title: "User",
                dataIndex: "riskUser",
                key: "riskUser",
                align: "center",
                width: "10%",
            }, {
                title: "CCY",
                dataIndex: "ccy",
                key: "ccy",
                align: "center",
                width: "7%",
            }, {
                title: "CCY Pair",
                dataIndex: "ccyPair",
                key: "ccyPair",
                align: "center",
                width: "10%",
            }, {
                title: "Book",
                dataIndex: "book",
                key: "book",
                align: "center",
                width: "10%",
            }, {
                title: "Strategy",
                dataIndex: "strategy",
                key: "strategy",
                align: "center",
                width: "10%",
            }, {
                title: "Position",
                dataIndex: "position",
                key: "position",
                align: "center",
                width: "10%",
                render: val=>(this.fmoney(Number(val)+"", 2))
            }, {
                title: "PnL",
                dataIndex: "pnl",
                key: "pnl",
                align: "center",
                width: "16%",
                render: val=>(this.fmoney(Number(val)+"", 2))
            }, {
                title: "Trade #",
                dataIndex: "trade",
                key: "trade",
                align: "center",
                width: "7%",
            }, {
                title: "Opn Trade#",
                dataIndex: "openTrade",
                key: "openTrade",
                align: "center",
                width: "7%",
            }
        ];
        // const cardHeight = document.documentElement.clientHeight - 50 - 52;
        return (
            <Card
                // id="credit-style"
                size="small"
                title={<div style={{color: "white"}}>Market Risk Monitor</div>}
                style={{ display: "flex", flex: "1",flexDirection:"column",marginRight:2, width: "100%" }}
                bodyStyle={{display: "flex",flex:1,padding:0}}>
                <Table className="maxHeightTable" bordered pagination={false} scroll={{x: "120%", y: cardHeight}} style={{width: "100%"}} rowKey="id" dataSource={dataSource} columns={columns} />
            </Card>
        );
    }
}

const mapStateToProps = state => ({
    marketRiskStatus: state.riskMonitorMain.marketRiskStatus,
});

const mapDispatchToProps = dispatch => ({
    marketRiskStatusFind: (cb) => dispatch(marketRiskStatusFind(cb)),
    checkLogin:(cb) =>dispatch(checkLogin(cb)),
    setSocketConnected: (params) => dispatch(setSocketConnected(params)),
});
export default connect(mapStateToProps,mapDispatchToProps)(MarketRiskMOnitor);