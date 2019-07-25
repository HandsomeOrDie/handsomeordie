import React from "react";
import SymbolList from "./SymbolList";
import OrderBook from "./orderbook/OrderBook";
import DealRecord from "./DealRecord";
import RiskControl from "./RiskControl";
import Notification from "./Notification";
import "./../../../../common/styles/home/ODM/odm.scss";
import ReportRecord from "./ReportRecord";
import OrderRecord from "./OrderRecord";
import OrderDeal from "./OrderDeal";
import QueueAnim from "rc-queue-anim";
import TweenOne from "rc-tween-one";
import {Button, Col, Form, Icon, Input, message, Modal, Row, Select, Upload} from "antd";
import {connect} from "react-redux";
import {checkLogin} from "../../../actions/marketDetail";
import {getDefinitionList, uploadScirpt} from "../../../actions/spdb/odmAction";
import {findBookSaveRedux} from "../../../actions/spdb/configAction";
const Option = Select.Option;

const TweenOneGroup = TweenOne.TweenOneGroup;
class ODM extends React.Component {
    state = {
        footer: "ReportRecord",
        show: true,
        symbolListContentHeight: 200,
        tradeRecordContentHeight: 200,
        riskCountHeight: 200,
        uploadVisible: false,
        fileList: [],
        params: [],
        template: [],
    };

    componentDidMount() {
        this.props.checkLogin((data) => {
            if (!data){
                this.props.history.push("/marketlogin");
                return;
            }
        });
        this.props.getDefinitionList({}, (result)=>{
            this.setState({ template: result.data});
        });
        setTimeout(()=>{
            this.updateSymbolTableHeight();
        }, 50);

        window.onresize = ()=> {
            this.updateSymbolTableHeight();
        };

        this.props.findBookSaveRedux();
    }

    updateSymbolTableHeight = () => {
        const symbolListContentHeight = document.getElementById("symbol-list-content") && document.getElementById("symbol-list-content").clientHeight;
        const tradeRecordContentHeight = document.getElementById("trade-record-content") && document.getElementById("trade-record-content").clientHeight;
        const riskCountHeight = document.getElementById("risk-content") && document.getElementById("risk-content").clientHeight;
        this.setState({symbolListContentHeight, tradeRecordContentHeight, riskCountHeight});
    }

    clickFooter = (footer) => {
        this.setState({footer});
    }
    getActiveFooterClass = (type) => {
        const { footer } = this.state;
        return footer === type ? " active-btn" : "";
    }
    // getOrderBook = () => {
    //     const orderBookList = this.props.orderBookList;
    //     let orderBookDom = [];
    //     for (let i=0;i<3;i++){
    //         if (orderBookList[i]){
    //             orderBookDom.unshift(<OrderBook
    //                 symbolList={this.symbolList}
    //                 key={orderBookList[i].instanceId} index={i} instance={{...orderBookList[i]}}
    //             />);
    //         } else {
    //             orderBookDom.push(<OrderBook key={i + 1000} index={-1}/>);
    //         }
    //     }
    //     return orderBookDom;
    // };
    getContent = () => {
        let content = [];
        content.push(
            <OrderBook
                symbolList={this.symbolList}
                key={this.props.orderBook1 ? this.props.orderBook1.instanceId : 1} index={this.props.orderBook1 ? 0 : -1} instance={this.props.orderBook1 && {...this.props.orderBook1}}
            />
        );
        content.push(
            <OrderBook
                symbolList={this.symbolList}
                key={this.props.orderBook2 ? this.props.orderBook2.instanceId : 2} index={this.props.orderBook2 ? 1 : -1} instance={this.props.orderBook2 && {...this.props.orderBook2}}
            />
        );
        content.push(
            <OrderBook
                symbolList={this.symbolList}
                key={this.props.orderBook3 ? this.props.orderBook3.instanceId : 3} index={this.props.orderBook3 ? 2 : -1} instance={this.props.orderBook3 && {...this.props.orderBook3}}
            />
        );
        return content;
    }
    handleRef = (thiz) => {
        this.symbolList = thiz;
    }
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return;
        };
    }
    handleUploadOk = () => {
        this.handleUpload();
    }
    handleUploadCancel = () => {
        this.setState({fileList: [], uploadVisible: false, params: []});
    }
    handleUpload = () => {
        console.log(this.state.fileList);
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log(values);
                const { fileList } = this.state;
                const formData = new FormData();
                fileList.forEach((file) => {
                    formData.append("code", file);
                });
                formData.append("name", values.name);
                formData.append("template", values.template);
                const params = this.state.params;
                let uploadParam = {};
                params.map(item => {
                    uploadParam[item.name] = item.value;
                });
                uploadParam = JSON.stringify(uploadParam).replace(/\[|]|"|}|{/g, "");
                uploadParam = uploadParam.replace(/,/g, ";");
                uploadParam = uploadParam.replace(/:/g, "=");
                formData.append("params", uploadParam);
                console.log(values, uploadParam);
                console.log(formData);
                this.props.uploadScirpt(formData, (result)=>{
                    if (result.success){
                        this.setState({fileList: [], uploadVisible: false, params: []});
                        this.props.form.resetFields();
                        message.success("Success!", 2);
                    } else {
                        message.error("Failed!", 2);
                    }
                });
            }
        });
    }
    render() {
        const { footer } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 6, offset: 2},
                sm: { span: 6, offset: 2},
            },
            wrapperCol: {
                xs: { span: 14 },
                sm: { span: 14 },
            },
        };
        const { fileList,} = this.state;
        const { getFieldDecorator } = this.props.form;
        const props = {
            onRemove: (file) => {
                this.setState((state) => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    this.props.form.setFieldsValue({code: undefined});
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                this.setState(state => ({
                    fileList: [file],
                }));
                return false;
            },
            fileList,
        };
        return (
            <div className={"odm"}>
                <div className={"content-wrapper"}>
                    <div className={"content-left"}>
                        <div className={"symbol-list"}>
                            <div className={"title"}>
                                <div className={"name"}>报价列表</div>
                            </div>
                            <div id={"symbol-list-content"} className={"content"}>
                                <SymbolList symbolListContentHeight={this.state.symbolListContentHeight} handleRef={this.handleRef}/>
                            </div>
                        </div>
                        <div className={"order-book"}>
                            <div style={{display: "flex", height: 30, lineHeight: "30px", background: "#525252", borderBottom: "1px solid #1f1b1b", borderRadius: "3px"}}>
                                {/*<QueueAnim*/}
                                {/*    key="demo"*/}
                                {/*    type={"scaleX"}*/}
                                {/*    appear={false}*/}
                                {/*    component={"div"}*/}
                                {/*    componentProps={{style: {display: "flex", flex: 1}}}*/}
                                {/*>*/}
                                <div style={{marginLeft: 15}}>当前报价</div>
                                <div style={{marginLeft: 5}}>
                                    <Icon onClick={()=>{
                                        this.setState({uploadVisible: true});
                                    }} className={"upload-icon"} type="upload" />
                                </div>
                            </div>
                            <div style={{display: "flex", flex: 1}}>
                                {
                                    this.getContent()
                                }
                                {/*</QueueAnim>*/}
                            </div>
                        </div>
                        <div className={"trade-record"}>
                            <div className={"title"}>
                                <div className={"name"}>交易记录</div>
                            </div>
                            <div id={"trade-record-content"} className={"content"}>
                                <QueueAnim
                                    key="demo"
                                    type={"scaleX"}
                                    appear={false}
                                    // interval={300}
                                    // duration={600}
                                >
                                    {/*<DealRecord/>*/}
                                    <ReportRecord footer={footer} key={"a"} tradeRecordContentHeight={this.state.tradeRecordContentHeight}/>

                                    <DealRecord footer={footer} key={"b"} tradeRecordContentHeight={this.state.tradeRecordContentHeight}/>

                                    <OrderRecord footer={footer} key={"c"} tradeRecordContentHeight={this.state.tradeRecordContentHeight}/>

                                    <OrderDeal footer={footer} key={"d"} tradeRecordContentHeight={this.state.tradeRecordContentHeight}/>

                                </QueueAnim>
                            </div>
                        </div>
                    </div>
                    <div className={"content-right"}>
                        <div id={"risk-content"} className={"risk-control"}>
                            <div className={"title"}>
                                <div className={"name"}>风险控制</div>
                            </div>
                            {/*<div className={"tool-bar"}></div>*/}
                            <div className={"content"}>
                                <RiskControl riskCountHeight={this.state.riskCountHeight}/>
                            </div>
                        </div>
                        <div className={"notification"}>
                            <div className={"title"}>
                                <div className={"name"}>通知</div>
                            </div>
                            <div className={"content"}>
                                <Notification/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"footer-wrapper"}>
                    <div className={"footer-content"}>
                        <div onClick={()=>{this.clickFooter("ReportRecord");}} className={"footer-btn " + this.getActiveFooterClass("ReportRecord")}>报单记录</div>
                        <div onClick={()=>{this.clickFooter("DealRecord");}} className={"footer-btn"  + this.getActiveFooterClass("DealRecord")}>成交记录</div>
                        <div onClick={()=>{this.clickFooter("OrderRecord");}} className={"footer-btn" + this.getActiveFooterClass("OrderRecord")}>订单记录</div>
                        <div onClick={()=>{this.clickFooter("OrderDeal");}} className={"footer-btn" + this.getActiveFooterClass("OrderDeal")}>订单成交</div>
                        {/*<div><Button onClick={()=>{this.setState({show: !this.state.show});}}>show?</Button></div>*/}
                    </div>
                </div>
                <Modal
                    className="darkTheme orderbook"
                    title={"上传策略"}
                    width={350}
                    bodyStyle={{background: "#2a2a2a"}}
                    visible={this.state.uploadVisible}
                    onOk={this.handleUploadOk}
                    onCancel={this.handleUploadCancel}
                    closable={false}
                    okButtonProps={{className: "ok-btn"}}
                    cancelButtonProps={{className: "cancel-btn"}}
                    destroyOnClose={true}
                    forceRender={false}
                    okText={"确定"}
                    cancelText={"取消"}
                >
                    {
                        this.state.uploadVisible &&
                        <Form className={"order-book-form"} colon={false}>
                            <Form.Item {...formItemLayout} label="策略名称">
                                {getFieldDecorator("name", {
                                    rules: [{ message: "Please input your Name!", required: true  }],
                                })(
                                    <Input/>
                                )}
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="模版选择">
                                {getFieldDecorator("template", {
                                    rules: [{ message: "Please input your template!", required: true  }],
                                })(
                                    <Select>
                                        {
                                            this.state.template.map((item, index)=>{
                                                return (<Option key={index} value={item}>{item}</Option>);
                                            })
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="上传策略">
                                {getFieldDecorator("code", {
                                    rules: [{ message: "Please upload your Code!", required: true  }],
                                })(
                                    <div>
                                        <Icon style={{fontSize: 18, marginRight: 5, color: "white"}} type="upload" />
                                        <Upload {...props}>
                                            <Button size="small" style={{background: "#525252", color: "white"}}>
                                                浏览
                                            </Button>
                                        </Upload>
                                    </div>
                                )}
                            </Form.Item>
                            <Form.Item {...formItemLayout} label="策略参数">
                                {getFieldDecorator("params", {
                                })(
                                    <Button size="small" style={{background: "#525252", color: "white"}} onClick={()=>{
                                        this.setState({params: [...this.state.params, {}]});
                                    }}>
                                        <Icon type="plus" />
                                    </Button>
                                )}
                            </Form.Item>
                        </Form>
                    }

                    {this.state.params.length > 0 &&
                    <Row>
                        <Col offset={6}>
                            <div style={{color: "white"}}>
                                <table style={{textAlign: "center"}}>
                                    <tbody>
                                        <tr>
                                            <td>参数名</td>
                                            <td>默认值</td>
                                            <td></td>
                                        </tr>
                                        {
                                            this.state.params.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td><Input size="small" style={{width: 100}} onChange={(e)=>{
                                                            let params = this.state.params;
                                                            params[index].name = e.target.value;
                                                            this.setState({params});
                                                        }} value={item.name}/></td>
                                                        <td><Input size="small" onChange={(e)=>{
                                                            let params = this.state.params;
                                                            params[index].value = e.target.value;
                                                            this.setState({params});
                                                        }} style={{width: 100}} value={item.value}/></td>
                                                        <td><Icon onClick={()=>{
                                                            let params = this.state.params;
                                                            console.log(index);
                                                            params.splice(index, 1);
                                                            this.setState({params});
                                                        }} style={{fontSize: 20, marginLeft: 10}} type="minus-circle" /></td>
                                                    </tr>
                                                );
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </Col>
                    </Row>}
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    orderBookList: state.odmReducer.orderBookList,
    orderBook1: state.odmReducer.orderBook1,
    orderBook2: state.odmReducer.orderBook2,
    orderBook3: state.odmReducer.orderBook3,
});

const mapDispatchToProps = dispatch => ({
    checkLogin:(cb) =>dispatch(checkLogin(cb)),
    getDefinitionList: (params, cb) => dispatch(getDefinitionList(params, cb)),
    uploadScirpt: (params, cb) => dispatch(uploadScirpt(params, cb)),
    findBookSaveRedux: (params) => dispatch(findBookSaveRedux(params)),
});

export default connect(mapStateToProps,mapDispatchToProps)(Form.create()(ODM));
