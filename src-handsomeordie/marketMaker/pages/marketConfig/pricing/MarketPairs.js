import { connect } from "react-redux";
import React, { Component } from "react";
import { Table, Input, message, Card } from "antd";
import { DragDropContext, DragSource, DropTarget } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import update from "immutability-helper";
import { Save_tr } from "../../../actions/pricing";
import { getCorePriceList } from "../../../actions/corePrice";
import moment from "moment";

const Search = Input.Search;


class PricingList extends Component {
    state = {
        originData: [],
        configListDataSource: [],
        searchInput: "",
    }

    componentDidMount () {
        this.props.getCorePriceList(()=>{
            this.setState({
                finish: true
            });
        });
    }
    componentWillReceiveProps(nextProps) {
        let originData = nextProps.corePriceList;
        this.setState({originData: originData,});
        this.prepareListData(originData, this.state.searchInput);
    }
    prepareListData(originData, searchInput) {
        let configListData = [];
        // console.log("originData:", originData);
        if (originData && originData.length > 0) {
            originData.forEach( item => {
                let backupSources = 0;
                let primarySources = 0;
                if(item.sources && item.sources.length > 0) {
                    item.sources.forEach(source => {
                        if(source.backupSetting === "Backup") {
                            backupSources += 1;
                        } else if (source.backupSetting === "Primay") {
                            primarySources += 1;
                        }
                    });
                }
                let configData = {
                    id: item.id,
                    marketIndicator: item.marketIndicator,
                    securityId: item.securityId,
                    symbol: item.symbol,
                    settlType: item.settlType,
                    securityDesc: item.securityDesc,
                    partyRole: item.partyRole,
                    pqrtySubId: item.pqrtySubId,
                    matchType: item.matchType,
                    faceValue: item.faceValue,
                    clearingMethod: item.clearingMethod,
                    securityTerm: item.securityTerm,
                    issueSize: item.issueSize,
                    issueDate: item.issueDate,
                    maturityDate: item.maturityDate,
                    minTick: item.minTick,
                    minTradeSize: item.minTradeSize,
                    couponRateType: item.couponRateType,
                    couponPaymentFrequency: item.couponPaymentFrequency,
                    interestAccrualMethod: item.interestAccrualMethod,
                    dayCount: item.dayCount,
                    settlDate: item.settlDate,
                    couponPaymentDate: item.couponPaymentDate,
                    basis: item.basis,
                    couponRate: item.couponRate,
                    securityName: item.securityName,
                };
                configListData.push(configData);
            });
        }
        // if(configListData.length < 10) {
        //     for (let i = configListData.length; i<10;i++) {
        //         configListData.push({});
        //     }
        // }
        //
        // let index = 0;
        // for(let j=0;j<configListData.length;j++){
        //     if(!configListData[j].symbol){
        //         index = j;
        //         break;
        //     }
        // }
        // let list = configListData.slice(0, index);

        this.setState({configListDataSourceAll: configListData,configListDataSource:configListData});
    }
    filterListData = (configListData, filter) => {
        let originData = configListData;
        if(filter && filter!=="") {
            let matchedResult = [];
            configListData.forEach(item => {
                let itemInput = item.symbol + " " + item.preset + " "
            + item.tensor + " " + item.groups + " " + item.totalSources
            + " " + item.backupSources + " " + item.minSources + " " + item.minTick;
                if (itemInput && itemInput.toUpperCase().indexOf(filter && filter.toUpperCase()) !== -1) {
                    matchedResult.push(item);
                }
            });
            return matchedResult;
        }
        return originData;
    }

    // onSearch = (value) => {
    //     console.log(value);
    //     this.prepareListData(this.props.corePriceList, value);
    //     this.setState({
    //         searchInput: value
    //     });
    // }

    getSearch = (value) => {
        if (value) {
            // console.log(1,value);
            const {configListDataSourceAll} = this.state;
            let newData = [];
            let flag = false;
            configListDataSourceAll.map((elem) => {
                flag = false;
                for (let k in elem) {
                    let str = elem[k];
                    if(typeof(str) === "number"){
                        str = JSON.stringify(str);
                    }
                    // console.log(str,value);
                    if (str && str.toUpperCase().indexOf(value && value.toUpperCase()) != -1) {
                        flag = true;
                        // console.log(elem);
                    }
                }
                if(flag){
                    newData.push(elem);
                }
            });
            this.setState({configListDataSource: newData});
        }else{
            // console.log(2,value);
            this.prepareListData(this.props.corePriceList);
        }
    }

    render() {
        const columns = [
            {
                title: "市场债券",
                dataIndex: "marketIndicator",
                key: "marketIndicator",
                width: 100,
                render: (text,record) => text === "4" ? "现券" : "",
                align: "center",
            }, {
                title: "代码",
                dataIndex: "securityId",
                key: "securityId",
                align: "center",
                width: 100
            }, {
                title: "名称",
                dataIndex: "securityName",
                key: "securityName",
                align: "center",
                width: 100
            }, {
                title: "清算速度",
                dataIndex: "settlType",
                key: "settlType",
                width: 60,
                align: "center",
                render: (text,record) => text === "1" ? "T+0" : text === "2" ? "T+1" : ""
            }, {
                title: "债券类型名称",
                dataIndex: "securityDesc",
                key: "securityDesc",
                align: "center",
                width: 100
            }, {
                title: "发行人机构名称",
                dataIndex: "partyRole",
                key: "partyRole",
                align: "center",
                width: 110
            // }, {
            //     title: "发行人机构代码",
            //     dataIndex: "pqrtySubId",
            //     key: "pqrtySubId",
            //     align: "center",
            //     width: 100
            }, {
                title: "报价方式",
                dataIndex: "matchType",
                key: "matchType",
                align: "center",
                width: 100,
                render: (text) => text === "9" ? "连续匹配" : text === "10" ? "集中匹配" : text
            // }, {
            //     title: "面值",
            //     dataIndex: "faceValue",
            //     key: "faceValue",
            //     width: 100
            }, {
                title: "清算类型",
                dataIndex: "clearingMethod",
                key: "clearingMethod",
                align: "center",
                width: 100,
                render: (text) => text === "6" ? "净额清算" : text === "13" ? "全额清算" : text
            }, {
                title: "期限",
                dataIndex: "securityTerm",
                key: "securityTerm",
                align: "center",
                width: 100
            }, {
                title: "债券规模",
                dataIndex: "issueSize",
                key: "issueSize",
                align: "center",
                width: 100
            }, {
                title: "发行日",
                dataIndex: "issueDate",
                key: "issueDate",
                align: "center",
                width: 100,
                render: (text) => (moment(text).format("YYYY-MM-DD"))
            }, {
                title: "到期日",
                dataIndex: "maturityDate",
                key: "maturityDate",
                align: "center",
                width: 100,
                render: (text) => (moment(text).format("YYYY-MM-DD"))
            }, {
                title: "最小变动单位",
                dataIndex: "minTick",
                align: "center",
                key: "minTick",
                width: 100
            }, {
                title: "最小交易单位",
                dataIndex: "minTradeSize",
                key: "minTradeSize",
                align: "center",
                width: 100
            }, {
                title: "利率类型",
                dataIndex: "couponRateType",
                key: "couponRateType",
                align: "center",
                width: 100,
                render: (text) => text === "FIXED" ? "固定利率" : text === "FLOATING" ? "浮动利率" : text
            }, {
                title: "票面利率",
                dataIndex: "couponRate",
                key: "couponRate",
                align: "center",
                width: 100
            }, {
                title: "付息频率",
                dataIndex: "couponPaymentFrequency",
                key: "couponPaymentFrequency",
                width: 100,
                align: "center",
                render: (text) => text === "1" ? "按年付息" : text === "2" ? "半年付息" : text
            }, {
                title: "计算方式",
                dataIndex: "interestAccrualMethod",
                key: "interestAccrualMethod",
                align: "center",
                width: 100
            }, {
                title: "计息基准",
                dataIndex: "basis",
                key: "basis",
                align: "center",
                width: 100
            }, {
                title: "起息日",
                dataIndex: "settlDate",
                key: "settlDate",
                align: "center",
                width: 100,
                render: (text) => (moment(text).format("YYYY-MM-DD"))
            }, {
                title: "首次起息日",
                dataIndex: "couponPaymentDate",
                key: "couponPaymentDate",
                align: "center",
                render: (text) => (moment(text).format("YYYY-MM-DD"))
            }
        ];
        const {finish} = this.state;
        // console.log(loading,this.state.configListDataSource);
        return (
            <Card bodyStyle={{padding:10}} style={{flex:5}}>
                <div className="tabTitle">
                    <label className="tabTitle_marginRight">Market Price</label>
                    <Search
                        placeholder="input search text"
                        onSearch={this.getSearch}
                        style={{ width: 200 }}
                    />
                </div>

                <Table
                    //style={{minWidth:2200}}
                    className="noShadow"
                    style={{width:910}}
                    scroll={{y:document.documentElement.clientHeight-240,x:2200}}
                    loading={!finish}
                    bodyStyle={{minHeight:680}}
                    pagination={false}
                    columns={columns}
                    dataSource={this.state.configListDataSource}
                    components={this.props.components}
                    rowKey={record => record.id}
                    onRow={(record, index) => ({
                        index,
                        // moveRow: this.moveRow,
                        // onMouseDown: () => {
                        //     this.setSignTr(record);
                        // }
                    })}
                />

            </Card>

        );
    }
}

// const Demo = DragDropContext(HTML5Backend)(PricingList);
const mapStateToProps = state => ({
    PriceConfigReducer: state.PriceConfigReducer,
    corePriceList: state.corePrice.corePriceList,
});

const mapDispatchToProps = dispatch => ({
    getCorePriceList:(cb)=>dispatch(getCorePriceList(cb)),
    Save_tr:(elem)=>dispatch(Save_tr(elem)),
});
export default connect(mapStateToProps, mapDispatchToProps)(PricingList);
