import {connect} from "react-redux";
import React, {Component} from "react";
import {Card, Table} from "antd";
import {marketRiskStatusFind} from "../../../actions/riskMonitorMain";
import WebSocketClient from "../../../socket/WebSocketClient";
import {riskSorket} from "../../../../common/marketApi";
import {checkLogin} from "../../../actions/marketDetail";
import {setSocketConnected} from "../../../actions/globalAction";
class MarketRisk extends Component {
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
        WebSocketClient.unsubscribeMessage({ subscriptionId: this.riskSorketId, mtype: riskSorket });
    }

    render() {
        // console.log(this.props.marketRiskStatus);
        const cardHeight = document.documentElement.clientHeight - 50 - 52 - 95 - 18;
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
            }, {
                title: "PnL",
                dataIndex: "pnl",
                key: "pnl",
                align: "center",
                width: "16%",
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
            <div>
                <div>
                    <div className="setting-title">
                        <div>Market Risk Monitor</div>
                    </div>
                    <div>
                        <Table
                            id="setting-table"
                            bordered
                            pagination={false}
                            scroll={{x: "150%", y: cardHeight}}
                            rowKey="id"
                            dataSource={dataSource}
                            columns={columns} />
                    </div>
                </div>
                <div>

                </div>
            </div>
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
export default connect(mapStateToProps,mapDispatchToProps)(MarketRisk);