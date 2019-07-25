import React from "react";
import {Table, Icon, message} from "antd/lib/index";
import "./../../../../common/styles/home/ODM/riskControl.scss";
import {getInstance, startInstance, stopInstance, updateOrderBookList} from "../../../actions/spdb/odmAction";
import {checkLogin} from "../../../actions/marketDetail";
import {connect} from "react-redux";
class RiskControl extends React.Component {
    state = {
        loading: false,
        data: [],
        tableHeight: 100,
    }

    componentDidMount() {
        this.setState({loading: true});
        this.props.getInstance({}, ( result )=>{
            if (!result.success) {
                this.setState({loading: false});
                return;
            }
            const data = result.data;
            data.map((item, index) => {
                item.key = index;
                item.b = 30000;
                item.c = 500;
            });
            this.setState({ data, loading: false });
        });
    }
    showCode = (text) => {
        const {tradingvarietymanage} = this.props;
        for(let i in tradingvarietymanage){
            if(tradingvarietymanage[i].key === text){
                return tradingvarietymanage[i].displayName;
            }
        }
        return "";
    }

    render() {
        const columns = [
            {
                // title: <Icon type="hourglass" />,
                dataIndex: "code",
                align: "center",
                width: "33%",
                render: (text) => {
                    return this.showCode(text);
                }
            },
            {
                title: "头寸上限(万)",
                dataIndex: "b",
                align: "center",
                width: "33%",
                render: (text)=>(<div style={{color: "orange"}}>{text}</div>)
            },
            {
                title: "损益上限(万)",
                dataIndex: "c",
                align: "center",
                render: (text)=>(<div style={{color: "#207b6e"}}>{text}</div>),
                width: "33%"
            },
        ];
        const dataSource = [
            {a: "19国开05", b: 30000, c: 500,},
            {a: "19国开05", b: 30000, c: 500,},
            {a: "19国开05", b: 30000, c: 500,},
            {a: "19国开05", b: 30000, c: 500,},
            {a: "19国开05", b: 30000, c: 500,},
        ];
        return (
            <div id={"riskControl"} className={"risk-wrapper"}>
                <Table
                    loading={this.state.loading}
                    className={"ant-tr-hover"}
                    columns={columns}
                    dataSource={this.state.data}
                    pagination={false}
                    bordered={false}
                    scroll={{y: this.props.riskCountHeight - 70}}
                />
            </div>
        );
    }
}
const mapStateToProps = state => ({
    tradingvarietymanage: state.odmReducer.tradingvarietymanage
});

const mapDispatchToProps = dispatch => ({
    getInstance: (params, cb) => dispatch(getInstance(params, cb)),
});
export default connect(mapStateToProps,mapDispatchToProps)(RiskControl);
