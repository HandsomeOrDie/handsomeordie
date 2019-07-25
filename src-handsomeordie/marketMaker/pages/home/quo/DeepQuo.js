import React from "react";
import {Icon, Button, Spin, Form, Select, Row, Col, message, Modal, Input, Upload, InputNumber, Table} from "antd/lib/index";
import "./../../../../common/styles/home/QUO/deepQuo.scss";
import "../../../../common/styles/home/ODM/orderBook.scss";
import {getQuotes, placeOrderPost, setPaintPrice, batchCancelOrder } from "../../../actions/spdb/odmAction";
// import { InfinityTable as Table } from "antd-table-infinity";
// import "./../../../../../node_modules/antd-table-infinity/index.css";
import {findBook} from "../../../actions/spdb/configAction";
import {connect} from "react-redux";
const Option = Select.Option;
import moment from "moment";
class BodyRow extends React.Component {
    render() {
        const {
            ...restProps
        } = this.props;
        const code = this.props.children[1].props.record.code;
        const mdPrice = this.props.children[1].props.record.mdPrice;
        return (
            <tr
                {...restProps}
                style={{borderTop: this.props.paintPrice && this.props.paintPrice[code] === mdPrice && "3px solid white"}}
            />);
    }
}
const mapStateToProps2 = state => ({
    paintPrice: state.odmReducer.paintPrice,
});

const mapDispatchToProps2 = dispatch => ({
});
const BodyRow2 = connect(mapStateToProps2, mapDispatchToProps2)(BodyRow);
class DeepQuo extends React.Component {
    state = {
        orderSureVisible: false,
        newOrdervisible: false,
        data: [],
        tableHeight: 200,
        maxNum: 0,
        loading: false,
        price: 0,
        confirmLoading: false,
        qty: "",

        minPrice: 0,
        maxPrice: 0,
        books: [],
        bookLoading: false,
        myOrderIdLst: [],
    }

    componentDidMount() {
        this.paint = true;
        this.running = false;
        this.messages = [];
        this.setState({loading: true});
        this.props.getQuotes({symbols: this.props.instance.code}, (result)=>{
            console.log(JSON.stringify(result));
            const data = result.result[this.props.instance.code];
            let maxNum = 0;
            data.map((item, index) => {
                item.key = index;
                if (item.tradeVolumeAccmltd > maxNum){
                    maxNum = item.tradeVolumeAccmltd;
                }
            });
            data.sort(this.sortnum);
            const minTick = 0.0001;
            this.maxPrice = data[0].mdPrice;
            this.minPrice = data[data.length-1].mdPrice;
            console.log("maxPrice:", this.maxPrice);
            console.log("minPrice:", this.minPrice);
            let minTemp = this.minPrice;
            let rule = [];
            while (minTemp <= this.maxPrice){
                rule.unshift({mdPrice: this.formatNum(minTemp)});
                minTemp = this.formatNum(minTemp + minTick);
            }
            //不知道为什么画的表格中没有maxPrice这一行，这里手动添加上去
            // rule.unshift({mdPrice: this.maxPrice });
            rule.map(r => {
                data.map(d => {
                    if (r.mdPrice === d.mdPrice){
                        r = d;
                    }
                });
                r.code = this.props.instance.code;
            });
            rule = rule.slice(0, 10);
            console.log(rule);
            this.setState({data: rule, maxNum, loading: false});
        });

        setTimeout(()=>{
            document.querySelector(".ant-table-body").scrollTop = 500;
            const tableHeight = document.getElementById("deep").clientHeight;
            this.setState({ tableHeight });
        }, 50);
    }

    formatNum = (num) => {
        num = num + 0.0000001;
        return Math.floor(num * 10000)/10000;
    }

    addItem = (rule, item) => {
        const minTick = 0.0001;
        const mdPrice = item.mdPrice;
        // let maxPrice = this.maxPrice;
        // let minPrice = this.minPrice;

        let maxTemp = this.formatNum(this.maxPrice + minTick);
        let minTemp = this.formatNum(this.minPrice - minTick);
        if (mdPrice > this.maxPrice){
            // console.log(mdPrice);
            // console.log(this.maxPrice);
            while (maxTemp <= mdPrice){
                // console.log("&", maxTemp);
                rule.unshift({mdPrice: this.formatNum(maxTemp)});
                maxTemp = this.formatNum(maxTemp + minTick);
            }
            rule[0] = item;
            this.maxPrice = mdPrice;
        }
        if (mdPrice < this.minPrice){
            // console.log(this.minPrice);
            // console.log(minTemp);
            while (minTemp >= mdPrice){
                // console.log("*", minTemp);
                rule.push({mdPrice: this.formatNum(minTemp)});
                minTemp = this.formatNum(minTemp - minTick);
            }
            rule[rule.length - 1] = item;
            this.minPrice = mdPrice;
        }
        return {data: rule};
    }

    handle = () => {
        if (this.messages.length) {
            // console.log(this.messages.length);
            this.handleReceive(this.messages[0], () => {
                this.running = false;
                this.messages.splice(0, 1);
                // console.log(this.messages.length);
                if (this.messages.length) {
                    this.handle();
                }
            });
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        // console.log(moment(Date.now()).format("YYYY/MM/DD HH:mm:ss sss"));
        const instance = nextProps.instance;
        let quotes = instance.quotes;
        if (quotes && JSON.stringify(this.props.instance.quotes) !== JSON.stringify(quotes)) {
            this.messages.push(nextProps);
            // console.log(this.messages.length);
            if (this.messages.length === 1 && !this.running){
                this.handle();
            }
        }
    }

    handleReceive = (nextProps, cb) => {
        this.running = true;
        const instance = nextProps.instance;
        let paintPrice = nextProps.paintPrice;
        let quotes = instance.quotes;
        let data = this.state.data;
        let maxNum = 0;
        let addData = [];
        let delData = [];
        if (quotes && JSON.stringify(this.props.instance.quotes) !== JSON.stringify(quotes)) {
            quotes.map(quote => {
                if (quote.action === 1) {
                    addData.push(quote);
                }
                if (quote.action === 2) {
                    addData.push(quote);
                }
                if (quote.action === 3) {
                    delData.push(quote.mdPrice);
                }
            });

            delData.map(item => {
                const index = data.findIndex(i => i.mdPrice === item);
                if (index !== -1) {
                    data[index] = {mdPrice: item, code: this.props.instance.code};
                }
            });

            addData.map(item => {
                if (item.mdPrice) {
                    const index = data.findIndex(i => i.mdPrice === item.mdPrice);
                    if (index !== -1) {
                        if (!instance.userName) {
                            item.mySize = data[index].mySize;
                        }
                        data[index] = item;
                    } else {
                        const result = this.addItem(data, item,);
                        data = result.data;
                    }
                }
            });
            // updateData.map(item => {
            //     if (item.mdPrice) {
            //         const index = data.findIndex(i => i.mdPrice === item.mdPrice);
            //         if (index !== -1) {
            //             if (!instance.userName) {
            //                 item.mySize = data[index].mySize;
            //             }
            //             data[index] = item;
            //         } else {
            //             console.log(item.mdPrice);
            //             console.log(index);
            //             console.log(data);
            //             console.log("进入添加。。。");
            //             const result = this.addItem(data, item, minPrice, maxPrice);
            //             data = result.data;
            //             minPrice = result.minPrice;
            //             maxPrice = result.maxPrice;
            //             // data.push(item);
            //         }
            //     }
            // });
            data = data.sort(this.sortnum);
            let bidPrice = 0;
            let askPrice = 0;
            let i = 0;
            data.map((item,index) => {
                item.key = index;
                if (item.tradeVolumeAccmltd > maxNum) {
                    maxNum = item.tradeVolumeAccmltd;
                }
                if (item.isBidBest){
                    i = index;
                    bidPrice = item.mdPrice;
                }
                if (item.isAskBest){
                    askPrice = item.mdPrice;
                }
                item.code = this.props.instance.code;

            });
            if (this.paint){
                if (bidPrice && askPrice){
                    const paint = parseFloat(((bidPrice + askPrice)/2).toFixed(4));
                    paintPrice[this.props.instance.code] = paint;
                    this.paint = false;
                    // document.querySelector(".ant-table-body").scrollTop = i * 20;
                    document.querySelector("#a" + instance.symbol + " .ant-table-body").scrollTop = (i-20) * 20;
                    this.props.setPaintPrice(paintPrice);

                }
            }
            // setTimeout(()=>{
            this.setState({data, maxNum}, cb);
            // }, 1000*30);

        }
    }

    sortnum=(a,b)=>{
        return b.mdPrice-a.mdPrice;
    }
    handleSureOk = () => {
        const myOrderIdLst = this.state.myOrderIdLst;
        const params = myOrderIdLst.map(item => ({id: item}));
        this.props.batchCancelOrder(params);
        this.setState({orderSureVisible: false});
    }

    handleSureCancel = () => {
        this.setState({orderSureVisible: false});
    }

    handleNewOk = (e) => {
        e.preventDefault();
        const { instance } = this.props;
        this.props.form.validateFields((err, values) => {
            // console.log(values);
            if (!err) {
                let param = {
                    code: values.code,
                    symbol: instance.symbol,
                    side: values.side,
                    type: "LIMIT",
                    tradeType: "SPECULATION",
                    tradingType: "ODM",
                    price: values.price,
                    tradingAccount: "tradingAccount",
                    settlType: instance.settlType,
                    extraParams: {marketIndicator: instance.marketIndicator},
                    generateSource: "PM",
                    quantity: values.qty+"0000",
                    bookId: values.bookId,
                    owner: JSON.parse(localStorage.getItem("userInfo")).name || ""
                };
                this.setState({
                    confirmLoading: true
                },()=>{
                    this.props.placeOrderPost(param,(success)=>{
                        if(success){
                            message.success("下单成功！");
                            this.setState({
                                newOrdervisible: false,
                                confirmLoading: false
                            });
                        } else {
                            message.error("下单失败！");
                            this.setState({
                                confirmLoading: false
                            });
                        }
                    });

                });
            }
        });
    }

    handleNewCancel = (value) => {
        // this.props.form.setFieldsValue({
        //     note: `Hi, ${value === "male" ? "man" : "lady"}!`,
        // });
        this.setState({
            newOrdervisible: false,
            orderSureVisible: false
        });
    }

    newOrder = (text, record) => {
        this.setState({
            newOrdervisible: true,
            orderSureVisible: false,
            price: text
        },()=>{
            this.selectBook();
        });
    }

    loadMoreContent = () => (
        <div
            style={{
                textAlign: "center",
                paddingTop: 40,
                paddingBottom: 40,
                border: "1px solid #e8e8e8",
            }}
        >
            <Spin tip="Loading..." />
        </div>
    );

    selectBook = (open) => {
        // if(open){
        this.props.findBook({
            userId: JSON.parse(localStorage.getItem("userInfo")).id || ""
        },(data)=>{
            // console.log(data.data);
            this.setState({
                books: data.data
            });
        });
        // }
    }

    render() {
        const maxNum = this.state.maxNum;
        const instance = this.props.instance;
        const columns = [
            {
                title: <Icon type="hourglass" />,
                dataIndex: "tradeVolumeAccmltd",
                align: "center",
                width: 100,
                render: (text)=>(<div style={{display: "flex"}}><div style={{position: "absolute", right: 0, bottom: 0, background: "rgba(130, 216, 66, 0.7)", height: 19, width: !text ? 0 : (text / (maxNum * 10 / 9))*100}}/><div style={{zIndex: 100, width: "100%", textAlign: "right", alginItems: "center", }}>{text/10000 || ""}</div></div>)
            },
            {
                title: <Icon type="environment" onClick={()=>{
                    let bidPrice = 0;
                    let askPrice = 0;
                    let i = 0;
                    this.state.data.map((item,index) => {
                        if (item.isBidBest){
                            i = index;
                            bidPrice = item.mdPrice;
                        }
                        if (item.isAskBest){
                            askPrice = item.mdPrice;
                        }
                    });
                    if (bidPrice && askPrice){
                        let paintPrice = this.props.paintPrice;
                        const paint = parseFloat(((bidPrice + askPrice)/2).toFixed(4));
                        paintPrice[instance.code] = paint;
                        document.querySelector("#a" + instance.symbol + " .ant-table-body").scrollTop = (i-20) * 20;
                        this.props.setPaintPrice(paintPrice);
                    }
                }}/>,
                dataIndex: "mdPrice",
                align: "center",
                width: "15%",
                render: (text, record)=>(<div onClick={()=>this.newOrder(text, record)} style={{cursor: "pointer", color: record.isCurrentMdPrice ? "red" : "white", background: record.isCurrentMdPrice ? "black" : "#3b5676", height: 19}}>{text.toFixed(4)}</div>)
            },
            // {
            //     title: <Icon type="environment" />,
            //     dataIndex: "mdPrice",
            //     align: "center",
            //     width: "15%",
            //     render: (text, record)=>(<div style={{background: "#3b5676", height: 19}}>{text.toFixed(4)}</div>)
            // },
            {
                title: "（万）",
                dataIndex: "bidSize",
                align: "center",
                render: (text)=>(<div style={{background: "#207b6e", height: 19}}>{text/1000 || ""}</div>),
                width: "13%"
            },
            {
                title: <Icon type="funnel-plot" />,
                dataIndex: "bidContiValidPeriodTradeVolumeAccmltd",
                align: "center",
                width: "13%",
                // render: (text)=>text || ""
                // render: (text, record)=>(record.isBidBest ? <div style={{background: "rgb(207, 183, 10)", height: 19}}>{text ? text/10000 : ""}</div> : text ? text/10000 : ""),
                render: (text, record)=>(
                    <div style={{background: record.isBidBest ? "rgb(207, 183, 10)" : record.isBidPassiveTrading ? "#C6E0B4" : "", height: 19}}>
                        {text ? text/10000 : ""}</div>),
            },
            {

                dataIndex: "askContiValidPeriodTradeVolumeAccmltd",
                align: "center",
                width: "13%",
                // render: (text)=>text || ""
                render: (text, record)=>(
                    <div style={{background: record.isAskBest ? "rgb(207, 183, 10)" : record.isAskPassiveTrading ? "#FF6699" : "", height: 19}}>
                        {text ? text/10000 : ""}</div>),
            },
            {
                title: "（万）",
                dataIndex: "askSize",
                align: "center",
                render: (text)=>(<div style={{background: "#bc4649", height: 19}}>{text/1000 || ""}</div>),
                width: "13%",
            },
            {
                dataIndex: "mySize",
                align: "center",
                render: (text, record)=>(<div style={{background: "#45372a", height: 19}} onClick={()=>{
                    text && this.setState({myOrderIdLst: record.myOrderIdLst, orderSureVisible: true});
                }}>{text ? text/10000 : ""}</div>),
            },
        ];

        const formItemLayout = {
            labelCol: {
                xs: { span: 5},
                sm: { span: 5},
            },
            wrapperCol: {
                xs: { span: 17 },
                sm: { span: 17 },
            },
        };
        const formItemLayout2 = {
            labelCol: {
                xs: { span: 10},
                sm: { span: 10},
            },
            wrapperCol: {
                xs: { span: 12 },
                sm: { span: 12 },
            },
        };
        const { getFieldDecorator } = this.props.form;
        const components = {
            body: {
                row: BodyRow2,
            },
        };
        return (
            <div id={"deep"} className={"deep-wrapper"}>
                <div className={"title"}>
                    <div className={"name"}>{instance.symbol}</div>
                    <div className={"btn"}>
                        {/*<Button onClick={()=>{this.setState({newOrdervisible: true});}}>合并空白区</Button>*/}
                    </div>
                </div>
                <Table
                    id={instance && "a" + instance.symbol}
                    rowKey={(record) => record.key}
                    components={components}
                    // key="key"
                    loading={this.state.loading}
                    // onFetch={this.handleFetch}
                    // pageSize={100}
                    // loadingIndicator={this.loadMoreContent()}
                    // className={"ant-tr-hover"}
                    columns={columns}
                    dataSource={this.state.data}
                    pagination={false}
                    bordered={false}
                    debug={false}
                    scroll={{y: this.state.tableHeight - 65}}
                />
                <Modal
                    className="darkTheme orderbook"
                    title={"撤单确认"}
                    width={350}
                    bodyStyle={{background: "#2a2a2a"}}
                    visible={this.state.orderSureVisible}
                    onOk={this.handleSureOk}
                    onCancel={this.handleSureCancel}
                    closable={false}
                    okButtonProps={{className: "ok-btn"}}
                    cancelButtonProps={{className: "cancel-btn"}}
                    destroyOnClose={true}
                    okText={"确定"}
                    cancelText={"取消"}
                    maskClosable={false}
                >
                    <div style={{textAlign: "center"}}>
                        {
                            this.state.myOrderIdLst && this.state.myOrderIdLst.map(item => item)
                        }<br/>
                        取消订单？
                    </div>
                </Modal>

                <Modal
                    className="darkTheme orderbook"
                    title={"新订单-ODM"}
                    width={420}
                    bodyStyle={{background: "#2a2a2a"}}
                    visible={this.state.newOrdervisible}
                    onOk={this.handleNewOk}
                    onCancel={this.handleNewCancel}
                    closable={false}
                    okButtonProps={{className: "ok-btn"}}
                    cancelButtonProps={{className: "cancel-btn"}}
                    destroyOnClose={true}
                    confirmLoading={this.state.confirmLoading}
                    okText={"确定"}
                    cancelText={"取消"}
                    maskClosable={false}
                >
                    {
                        this.state.newOrdervisible &&
                        <Form {...formItemLayout} className={"order-book-form"} colon={false}>
                            <Form.Item label="代码">
                                {getFieldDecorator("code", {
                                    rules: [{ message: "代码必填！", required: true}],
                                    initialValue: instance.code
                                })(
                                    <Input disabled={true} style={{width: 200}} size="small"/>
                                )}
                            </Form.Item>
                            <Row>
                                <Col span={12}>
                                    <Form.Item {...formItemLayout2} label={"清算速度"}>
                                        <div>{instance.settlType === "1"?"T+0":instance.settlType === "2"?"T+1":""}</div>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item {...formItemLayout2} label={"清算类型"}>
                                        <div>全部清算</div>
                                    </Form.Item>
                                </Col>
                            </Row>


                            <Row>
                                <Col span={12}>
                                    <Form.Item {...formItemLayout2} label="方向">
                                        {getFieldDecorator("side", {
                                            rules: [{ message: "方向必填！", required: true  }],
                                            initialValue: "BUY"
                                        })(
                                            <Select style={{width: 100}} size="small">
                                                <Option key={"买入"} value="BUY">买入</Option>
                                                <Option key={"卖出"} value="SELL">卖出</Option>
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item {...formItemLayout2} label="头组">
                                        {getFieldDecorator("bookId", {
                                            rules: [{ message: "头组必填！", required: true  }]
                                        })(
                                            <Select style={{width: 100}} size="small">
                                                {
                                                    this.state.books.map((item,index)=>{
                                                        return <Option key={index} value={item.id}>{item.name}</Option>;
                                                    })
                                                }
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={12}>
                                    <Form.Item {...formItemLayout2} label="净价">
                                        {getFieldDecorator("price", {
                                            rules: [
                                                { message: "净价必填！", required: true  },
                                                { message: "输入不合法！", pattern: /^\d+(\.\d+)?$/  },
                                                { message: "小数点后必须保留4位！", pattern: /\d+\.\d{4}/  },
                                                {/* { message: "数量必填！", required: true  }, */}
                                            ],
                                            initialValue: String(this.state.price.toFixed(4))
                                        })(
                                            <Input type="number" size="small" style={{width: 100}} />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item {...formItemLayout2} label="收益率%">
                                        {getFieldDecorator("money", {
                                            rules: [{ message: "收益率必填！"  }],
                                        })(
                                            <InputNumber disabled={true} min={0} style={{width: 100}} size="small" />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item label="数量">
                                {getFieldDecorator("qty", {
                                    rules: [
                                        { message: "数量必填！", required: true  },
                                        { message: "必须为正整数！", pattern: /^[1-9]\d*$/  },
                                        { message: "必须是1000的正整数倍！", pattern: /^[1-9][0-9]*0{3}$/ },
                                        {/* { message: "数量必填！", required: true  }, */}
                                    ],
                                    initialValue: "1000"
                                })(
                                    <Input type="number" size="small" style={{width: 100,marginRight: 10}} />
                                )}万
                            </Form.Item>
                        </Form>
                    }
                </Modal>
            </div>
        );
    }
}
const mapStateToProps = state => ({
    paintPrice: state.odmReducer.paintPrice,
});

const mapDispatchToProps = dispatch => ({
    getQuotes: (params, cb)=>dispatch(getQuotes(params, cb)),
    placeOrderPost: (params, cb)=>dispatch(placeOrderPost(params, cb)),
    findBook: (params, cb)=>dispatch(findBook(params, cb)),
    setPaintPrice: (params)=>dispatch(setPaintPrice(params)),
    batchCancelOrder: (params, cb)=>dispatch(batchCancelOrder(params, cb)),
});
export default connect(mapStateToProps,mapDispatchToProps)(Form.create({ name: "newOrderForm"+ Math.random()*Math.random()})(DeepQuo));
