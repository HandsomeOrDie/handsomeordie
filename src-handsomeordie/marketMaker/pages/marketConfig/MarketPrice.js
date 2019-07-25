import { connect } from "react-redux";

import React, { Component } from "react";
import {Table, Input, Divider, Icon, Row, Col, Modal} from "antd";
import MarketPriceConfig from "./marketPriceConfig";
// import { Button } from "antd/lib/radio";
import { getMarketPriceConfigList, getDrageValue, deleteMarketPriceItem } from "../../actions/marketPrice";
import { DragDropContext, DragSource, DropTarget } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import update from "immutability-helper";
import PropTypes from "prop-types";
// var drageV = {};
import BodyRowDom from "./MarketPriceDrag";
import Test from "./marketpriceSource";
import moment from "moment";
const confirm = Modal.confirm;
import Target from "./target";
class MarkerPrice1 extends Component {
    state = {
        data: [],
        dragvalue: {},
        configrationValue: {},
        crossValue: {},
        selectIndex: null,  //选中行 的index
        isCreate: false,
        rabbit: "test",
        selectId: null,
        editView: false,
        loading: false,
    }

    componentDidMount() {
        // let _this = this;
        this.props.handleRef(this);
        this.setState({loading: true});
        this.props.getMarketPriceConfigList((value) => {
            this.setState({
                data: value,
                selectId: value[0].id,
                configrationValue: value[0],
                loading: false,
            });
            // console.log(value);
        });
    }
    componentWillReceiveProps(nextProps) {
        // console.log(nextProps.marketPriceList);
        if (nextProps.marketPriceList !== this.props.marketPriceList) {
            // console.log(nextProps.marketPriceList);
            this.setState({
                data: nextProps.marketPriceList,
                // configrationValue:nextProps.m
            });
        }
    }
    // componentWillUpdate()
    getSearch = (value) => {
        // console.log(value);
        const data = this.state.data;
        let newData = [];
        if (value) {
            data.map((elem, i) => {
                let flag = false;
                for (let k in elem) {
                    let str = elem[k] + "";
                    if (str.toUpperCase().indexOf(value.toUpperCase()) != -1 && !flag) {
                        flag = true;
                        newData.push(elem);
                    }
                }
            });
            // if(value)
            this.setState({
                data: newData
            });
            // console.log(newData);
        } else {
            this.setState({
                data: this.props.marketPriceList
            });
        }

    }

    showDiscardChangePop = (callback) => {
        confirm({
            title: "Discard changes?",
            content: "You are editing another config, do you want to discard the changes you have made",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk: callback,
            onCancel: () => {
                console.log("Cancel");
            },
        });
    }
    ChangeSearch = (e) => {
        // console.log(e.currentTarget.value);
        if (!e.currentTarget.value) {
            this.setState({ data: this.props.marketPriceList });
        }
    }
    components = {
        body: {
            row: DragableBodyRow,
        },
    }
    onExchangeDrageValue = (changeDrageValue) => {
        let dragValue = changeDrageValue;
        let ccy1A = dragValue[0].symbol.substr(0, 3);
        let ccy1B = dragValue[0].symbol.substr(3, 6);
        let ccy2A = dragValue[1].symbol.substr(0, 3);
        let ccy2B = dragValue[1].symbol.substr(3, 6);
        let data = {};
        if (ccy1B == ccy2A) {
            data = {
                symbol: ccy1A + ccy2B,
                id: "",
                channels: "",
                fullName: `CROSS.${ccy1A + ccy2B}`,
                tenor: "",
                base: "CROSS",
                venue: "",
                market: "",
                minTick: null,
                sanityCheck: false,
                spikeFilter: false,
                staleFilter: false,
                quality: null,
                connectivity: null,
                tradingHourOpen: dragValue[0].tradingHourOpen,
                tradingHourClose: dragValue[1].tradingHourClose,
                timeZone: null,
                ccy1Id: dragValue[0].id,
                ccy2Id: dragValue[1].id,
                arrivalRate: null,
                maxMove: null,
                mean: null,
                stdev: null,
                enable: false,
            };

        } else {
            data = {
                symbol: "",
                id: "",
                channels: "",
                fullName: "",
                tenor: "",
                base: "",
                venue: "",
                market: "",
                minTick: null,
                sanityCheck: false,
                spikeFilter: false,
                staleFilter: false,
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
                enable: false,
                status: "",
                varietyType: ""
            };
        }
        this.setState({
            configrationValue: data
        });
    }
    getCrossValue = (record) => {
        this.setState({ rabbit: record.symbol });
        let dragValue = this.props.dragValue;
        let isCreate = this.state.isCreate;
        if (dragValue.length == 0 && isCreate) {
            dragValue.push(record);
        } else if (dragValue.length == 1 && dragValue[0] !== record && isCreate) {
            dragValue.push(record);
            this.onExchangeDrageValue(dragValue);

        } else {
            if (dragValue[0] != record && dragValue[1] !== record && isCreate) {
                dragValue[1] = record;
                this.onExchangeDrageValue(dragValue);
            }
        }
        isCreate && this.props.getDrageValue(dragValue, () => { });
    }
    getConfigrationValue = (record, index) => {
        if (record.id > 0 && record.id !== this.state.selectId && this.state.editView) {
            confirm({
                title: "Discard changes?",
                content: "You are editing another config, do you want to discard the changes you have made",
                okText: "Yes",
                okType: "danger",
                cancelText: "No",
                onOk: () => {
                    this.setState({configrationValue: record, selectIndex: index, selectId: record.id, editView: false});
                },
                onCancel: () => {
                    console.log("Cancel");
                },
            });
        }else {
            this.setState({configrationValue: record, selectIndex: index, selectId: record.id,});
        }

        // this.props.getConfigrationValue(record);
    }
    delelteItem = () => {
        let marketPriceList = this.props.marketPriceList;
        let index = this.state.selectIndex;
        // let _this = this;
        // if (marketPriceList[index].base == "CROSS") {
        this.props.deleteMarketPriceItem({ id: marketPriceList[index].id }, () => {
            marketPriceList.splice(index, 1);
            this.setState({ data: marketPriceList });
        });

        // }
    }
    addItem = () => {
        let data = {
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
            maxMove: 250,
            mean: 2,
            stdev: 4,
            enable: null,
        };
        this.setState({
            configrationValue: data,
            isCreate: true
        });
    }
    forbidDrage = () => {
        this.setState({
            isCreate: false
        });
    }
    onChangeMarketList=(data) =>{
        this.setState({data:data});
    };
    handleRef = (thiz) => {
        this.child = thiz;
    }
    showCode = (text,record) => {
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
                title: "市场债券",
                dataIndex: "marketIndicator",
                key: "marketIndicator",
                width: 100,
                align: "center",
                render: (text,record) => text === "4" ? "现券" : ""
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
                align: "center",
                width: 60,
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
                width: 80,
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
                width: 100,
                align: "center",
                render: (text) => text === "6" ? "净额清算" : text === "13" ? "全额清算" : text
            }, {
                title: "期限",
                dataIndex: "securityTerm",
                key: "securityTerm",
                align: "center",
                width: 60
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
                key: "minTick",
                align: "center",
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
                width: 100,
                align: "center",
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
                align: "center",
                width: 100,
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
                width: 100,
                align: "center",
                render: (text) => (moment(text).format("YYYY-MM-DD"))
            }, {
                title: "首次起息日",
                dataIndex: "couponPaymentDate",
                align: "center",
                key: "couponPaymentDate",
                render: (text) => (moment(text).format("YYYY-MM-DD"))
            }
        ];
        // console.log(document.documentElement.clientHeight);

        return (

            <div style={{display:"flex",flexDirection:"column",width: "100%"}} className="market_price_box">

                <div className="market_price_title">
                    <div>
                        <span>
                            <label className="title">Market Instruments</label>
                            <Input.Search
                                placeholder=""
                                onChange={value => this.ChangeSearch(value)}
                                onSearch={this.getSearch}
                                style={{ width: 200 }}
                                className="header_search"
                                size="small"
                            />
                        </span>
                        <span style={{float: "right", fontSize: 20}} >
                            <Icon type="plus-circle" theme="filled" className="add-menu-icon add-icon-hover" style={{ marginRight: "10px",color:"#bfbfbf" }} onClick={this.addItem} />
                            <Icon type="minus-circle" theme="filled" className="delete-menu-icon add-icon-hover" style={{ color:"#bfbfbf" }} onClick={this.delelteItem} />
                        </span>
                    </div>
                </div>
                <Table
                    scroll={{y:document.documentElement.clientHeight-555,x:2000}}
                    style={{width:document.documentElement.clientWidth-290}}
                    dataSource={this.state.data}
                    bodyStyle={{width:"100%"}}
                    columns={columns}
                    pagination={false}
                    bordered={true}
                    className="market_price_table"
                    components={this.components}
                    loading={this.state.loading}
                    onRow={(record, index) => ({
                        index,
                        moveRow: this.moveRow,
                        // onDragStart: () => this.getCrossValue(record, index),
                        onClick: () => this.getConfigrationValue(record, index),

                    })}
                    rowClassName={(record) => {
                        if (record.id === this.state.selectId) {
                            return "qit-tr-active-dark ";
                        } else {
                            return " ";
                        }
                    }}
                    rowKey={(record) => record.id}
                />
                <Divider />
                <div>
                    <div>
                        <div className="market_price_config_title">Instruments Configurations </div>
                        <Icon onClick={() => {
                            this.setState({ editView: true });
                        }} style={{float: "right", fontSize: 20,color:"#bfbfbf"}} type="form"/>
                    </div>
                    <MarketPriceConfig thiz={this} handleRef={this.handleRef} editView={this.state.editView} configrationValue={{...this.state.configrationValue}} forbidDrage={this.forbidDrage} crossConfig={this.getCrossValue} exchangeDrageValue={this.onExchangeDrageValue} isEdit={this.state.isCreate} changeMarketList={this.onChangeMarketList} />
                </div>
            </div>


        );
    }
}


const rowSource = {
    beginDrag(props) {
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
        // console.log(props, monitor);
        // Time to actually perform the action
        props.moveRow(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    },
};

const DragableBodyRow = DropTarget("row", rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    sourceClientOffset: monitor.getSourceClientOffset(),
}))(
    DragSource("row", rowSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        dragRow: monitor.getItem(),
        clientOffset: monitor.getClientOffset(),
        initialClientOffset: monitor.getInitialClientOffset(),
    }))(BodyRowDom)
);

MarkerPrice1.propTypes = {
    ha: PropTypes.any,
};
const MarkerPrice = DragDropContext(HTML5Backend)(MarkerPrice1);
const mapStateToProps = state => ({
    marketPriceList: state.marketPrice.marketPriceList,
    dragValue: state.marketPrice.dragValue,
});

const mapDispatchToProps = dispatch => ({
    // setTheme: (theme) => dispatch(setTheme(theme))
    getMarketPriceConfigList: (cb) => dispatch(getMarketPriceConfigList(cb)),
    getDrageValue: (record, cb) => dispatch(getDrageValue(record, cb)),
    deleteMarketPriceItem: (record, cb) => dispatch(deleteMarketPriceItem(record, cb))
});
export default connect(mapStateToProps, mapDispatchToProps, null)(MarkerPrice);
