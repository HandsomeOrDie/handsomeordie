import {connect} from "react-redux";
import React, {Component} from "react";
import {Tabs, Table} from "antd";
import {findTodayQuoteRequestGet, findTodayOrderGet, setQuoteRequestId} from "../../../actions/manualTrading";
import moment from "moment";
import {Button} from "antd/lib/radio";

class RequestTabList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todayQuoteRequest: [],
            todayOrder: []
        };
    }

    componentDidMount() {
        this
            .props
            .findTodayQuoteRequestGet();
        this
            .props
            .findTodayOrderGet();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (JSON.stringify(nextProps.todayQuoteRequest) !== JSON.stringify(prevState.todayQuoteRequest)) {
            return {todayQuoteRequest: nextProps.todayQuoteRequest};
        }
        if (JSON.stringify(nextProps.todayOrder) !== JSON.stringify(prevState.todayOrder)) {
            return {todayOrder: nextProps.todayOrder};
        }
    }

    render() {
        console.log(this.state.todayOrder);
        const {todayQuoteRequest, todayOrder} = this.state;
        const todayQuoteRequestColumns = [
            {
                title: "RequestId",
                dataIndex: "requestId",
                key: "requestId",
                width: 100
            }, {
                title: "Time",
                dataIndex: "time",
                key: "time",
                render: (text, record) => moment(record.time).format("YY-MM-DD HH:mm:ss"),
                width: 150
            }, {
            //     title: "TraderID",
            //     dataIndex: "traderID",
            //     key: "traderID"
            // }, {
                title: "Symbol",
                dataIndex: "symbol",
                key: "symbol",
                width: 100
            }, {
                title: "Type",
                dataIndex: "type",
                key: "type",
                render: (text, record) => record.type || "Null",
                width: 80
            }, {
                title: "RequestType",
                dataIndex: "requestType",
                key: "requestType",
                render: (text, record) => record.requestType || "Null",
                width: 80
            }, {
            //     title: "SettlDate",
            //     dataIndex: "settlDate",
            //     key: "settlDate"
            // }, {
                title: "Side",
                dataIndex: "side",
                key: "side",
                width: 80
            }, {
                title: "OrderQty",
                dataIndex: "qty",
                key: "qty",
                width: 80
            }, {
                title: "CounterParty",
                dataIndex: "counterParty",
                key: "counterParty",
                width: 100
            }, {
                title: "Status",
                dataIndex: "status",
                key: "status",
                width: 80
            }, {
                title: "Operation",
                dataIndex: "operation",
                key: "operation",
                render: (text, record) => <Button size="small">Withdraw</Button>,
                width: 100
            }
        ];

        const {currentQuoteRequestId} = this.props;
        // console.log(currentQuoteRequestId);
        return (
            <Table
                style={{flex:1}}
                rowClassName={(record) => {
                    if (record.requestId === currentQuoteRequestId) 
                        return "qit-tr-active-dark";
                }}
                onRow={(record) => {
                    return {
                        onClick: (event) => {
                            {/* console.log(record.requestId , currentQuoteRequestId); */}
                            if(record.requestId !== currentQuoteRequestId){
                                this.props.setQuoteRequestId(record.requestId);
                            } else {
                                return;
                            }
                        }
                    };
                }}
                scroll={{y: this.props.tableHeight}}
                pagination={false}
                dataSource={todayQuoteRequest}
                columns={todayQuoteRequestColumns}/>
        );
    }
}

const mapStateToProps = state => ({
    todayQuoteRequest: state.manualTradingReducer.todayQuoteRequest,
    todayOrder: state.manualTradingReducer.findTodayOrderGet,
    currentQuoteRequestId: state.manualTradingReducer.currentQuoteRequestId
});

const mapDispatchToProps = dispatch => ({
    findTodayQuoteRequestGet: () => dispatch(findTodayQuoteRequestGet()),
    findTodayOrderGet: () => dispatch(findTodayOrderGet()),
    setQuoteRequestId: (id) => dispatch(setQuoteRequestId(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestTabList);