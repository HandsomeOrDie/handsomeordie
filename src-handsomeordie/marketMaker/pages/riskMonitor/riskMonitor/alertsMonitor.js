import {connect} from "react-redux";
import React, {Component} from "react";
import {Collapse, Tabs, Row, Col, Card, Table} from "antd";
import {riskAlertFind} from "../../../actions/riskMonitorMain";
import moment from "moment";
class AlertsMonitor extends Component {
    state = {
        dataSource: []
    }

    componentDidMount() {
        this.props.riskAlertFind((data)=>{
            this.setState({
                dataSource: data
            });
        });
    }

    componentWillReceiveProps(nextProps) {

    }

    render() {
        const {dataSource} = this.state;
        const columns = [{
            title: "Time",
            dataIndex: "alertTime",
            key: "alertTime",
            align: "center",
            render: val => (moment(val).format("HH:mm:ss MM/DD/YYYY")),
            width: "15%"
        }, {
            title: "User",
            dataIndex: "riskUser",
            key: "riskUser",
            align: "center",
            width: "12%"
        }, {
            title: "Strategy",
            dataIndex: "strategy",
            key: "strategy",
            align: "center",
            width: "12%"
        }, {
            title: "Level",
            dataIndex: "level",
            key: "level",
            align: "center",
            width: "12%"
        }, {
            title: "Type",
            dataIndex: "type",
            key: "type",
            align: "center",
            width: "12%"
        }, {
            title: "Rule",
            dataIndex: "rule",
            key: "rule",
            align: "center",
            width: "12%"
        }, {
            title: "Action",
            dataIndex: "action",
            key: "action",
            align: "center",
            width: "12%"
        }, {
            title: "Log",
            dataIndex: "log",
            key: "log",
            align: "center",
            width: "12%"
        }];
        const cardHeight = document.documentElement.clientHeight - 50 - 52 - 95 - 18+81;
        // console.log(this.props.riskAlert);
        return (
            <Card
                // id="credit-style"
                size="small"
                title={<div style={{color: "white"}}>Alerts Monitor</div>}
                style={{display: "flex", flex: "1",flexDirection:"column",marginLeft:2}}
                bodyStyle={{display: "flex",flex:1,padding:0}}>
                <Table bordered pagination={false} scroll={{y: cardHeight}} style={{width: "100%"}} rowKey="id" dataSource={dataSource} columns={columns} />
            </Card>
        );
    }
}

const mapStateToProps = state => ({
    riskAlert: state.riskMonitorMain.riskAlert,
});

const mapDispatchToProps = dispatch => ({
    riskAlertFind: (cb) => dispatch(riskAlertFind(cb)),
});
export default connect(mapStateToProps,mapDispatchToProps)(AlertsMonitor);