import React from "react";
import {Select, Spin, Checkbox, Button, Icon, Modal, Form, Input, Upload, Row, Col, message} from "antd/lib/index";
const Option = Select.Option;
import "../../../../../common/styles/home/ODM/orderBook.scss";
import {getAlgo, deleteStrategyById, uploadScirpt, batchUpdateStrategy} from "../../../../actions/spdb/odmAction";
import {findBook} from "../../../../actions/spdb/configAction";
import {connect} from "react-redux";
class StrategyAdd extends React.Component {
    state = {
        addVisible: false,
        params: [],
        algos: [],

        isDelete: false,
        isDelApply: false,

        spinning: false,
        strategyScriptParamsMap: {},
        bookIdMap: {},
        books: [],
    }

    componentDidMount() {
        console.log(this.props.allBook);
        this.props.handleRef(this);
        const instance = this.props.instance;
        if (instance) {
            this.setState({
                strategyScriptParamsMap: instance.strategyScriptParamsMap,
            });
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let strategyScriptParamsMap = nextProps.strategyScriptParamsMap;
        let bookIdMap = nextProps.bookIdMap;
        this.setState({strategyScriptParamsMap, bookIdMap});
    }

    changeParams = (name, params) => {
        if(name === "Manual"){
            params = JSON.stringify(params).replace(/\[|]|"|}|{/g, "");
            params = params.replace(/,a/g, ";a");
            params = params.replace(/,b/g, ";b");
            params = params.replace(/:/g, "=");

        }else{
            params = JSON.stringify(params).replace(/\[|]|"|}|{/g, "");
            params = params.replace(/,/g, ";");
            params= params.replace(/:/g, "=");
        }
        return params;
    }

    handleAddOk = () => {
        console.log(this.state.bookIdMap);
        console.log(this.state.strategyScriptParamsMap);
        const { strategyScriptParamsMap, bookIdMap } = this.state;
        const params = {};
        params.instanceId = this.props.instance.instanceId;
        const algos = this.props.algos;
        console.log(algos);
        const strategyParams = [];
        Object.keys(strategyScriptParamsMap).map(item => {
            let strategyScriptParams = {};
            if (!strategyScriptParamsMap[item]){
                algos.map(a => {
                    if (a.algo === item) {
                        a.config.map(c => {
                            strategyScriptParams[c.name] = c.value;
                        });
                    }
                });
            }
            strategyScriptParamsMap[item] = strategyScriptParamsMap[item] || strategyScriptParams;
            strategyParams.push({
                strategyScriptName: item,
                bookId: bookIdMap[item],
                strategyScriptParams: this.changeParams(item, strategyScriptParamsMap[item] || strategyScriptParams),
            });
        });
        params.params = strategyParams;
        console.log(params);
        this.props.batchUpdateStrategy(params, (result)=>{
            console.log("xxx",strategyScriptParamsMap);
            this.props.updateParamsMap(strategyScriptParamsMap);
            this.props.updateBookIdMap(bookIdMap);
            this.setState({addVisible: false});
        });
        // this.props.form.validateFieldsAndScroll((err, values) => {
        //     if (!err) {
        //         console.log(values);
        //         const name = values.name;
        //         let params = {};
        //         this.props.algos.map(item => {
        //             if (item.algo === name){
        //                 item.config.map(c => {
        //                     params[c.name] = c.value;
        //                 });
        //             }
        //         });
        //         this.props.addStrategy(name, params);
        //         this.setState({addVisible: false});
        //     }
        // });
    }

    handleAddCancel = () => {
        const { isDelete, isDelApply } = this.state;
        if (isDelete) {
            this.props.symbolList.refreshTable(true);
        }
        if (isDelApply){
            this.props.updateCurrentStrategy("Manual");
        }
        this.setState({addVisible: false});
    }
    onAlgoChange = (val) => {
        const { strategyScriptParamsMap, bookIdMap} = this.state;
        const hasProps = strategyScriptParamsMap.hasOwnProperty(val);
        if (hasProps){
            return;
        }
        strategyScriptParamsMap[val] = undefined;
        bookIdMap[val] = 0;
        this.setState({strategyScriptParamsMap, bookIdMap});
    }

    render() {
        const formItemLayout2 = {
            labelCol: {
                xs: { span: 8 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 14 },
                sm: { span: 14 },
            },
        };
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                className="darkTheme orderbook"
                title={"策略管理"}
                width={350}
                bodyStyle={{background: "#2a2a2a"}}
                visible={this.state.addVisible}
                onOk={this.handleAddOk}
                onCancel={this.handleAddCancel}
                closable={false}
                okButtonProps={{className: "ok-btn"}}
                cancelButtonProps={{className: "cancel-btn"}}
                destroyOnClose={true}
                forceRender={false}
                okText={"确定"}
                cancelText={"取消"}
            >
                {
                    <Spin spinning={this.state.spinning}>
                        {
                            this.state.addVisible &&
                            <Form className={"order-book-form"} colon={false}>
                                <Form.Item {...formItemLayout2} label="添加新策略">
                                    {getFieldDecorator("name", {
                                        // rules: [{ message: "Please input your strategy!", required: true  }],
                                    })(
                                        <Select onChange={this.onAlgoChange}>
                                            {
                                                this.props.algos.map((item, index)=>
                                                    (<Option key={index} value={item.algo}>{item.algo}</Option>))
                                            }
                                        </Select>
                                    )}
                                </Form.Item>
                                <Form.Item {...formItemLayout2} label="已有策略列表">
                                    {getFieldDecorator("template5", {
                                    })(
                                        <div/>
                                    )}
                                </Form.Item>
                            </Form>
                        }

                        <div style={{color: "white", textAlign: "left"}}>
                            {
                                Object.keys(this.state.strategyScriptParamsMap).map((item, index)=>(
                                    <Row key={index} style={{marginBottom: 5}}>
                                        <Col span={6} offset={4}>{item === "Manual" ? "手动" : item}</Col>
                                        <Col span={8}>
                                            <Select value={this.state.bookIdMap[item]} onChange={(val)=>{
                                                const { bookIdMap } = this.state;
                                                bookIdMap[item] = val;
                                                this.setState({bookIdMap});
                                            }} style={{width: 100}}>
                                                {
                                                    this.props.allBook.map((item, index)=>(
                                                        <Option key={index} value={item.id}>{item.name}</Option>
                                                    ))
                                                }

                                            </Select>
                                        </Col>
                                        <Col span={6}>
                                            {
                                                item !== "Manual" &&
                                                <Icon onClick={()=>{
                                                    this.setState({spinning: true});
                                                    this.props.deleteStrategyById({instanceId: this.props.instance.instanceId, algo: item}, (result)=>{
                                                        if (result.success) {
                                                            if (item === this.props.currentStrategy) {
                                                                this.props.updateCurrentStrategy("Manual");
                                                                this.setState({isDelete: true, isDelApply: true});
                                                            }else {
                                                                this.setState({isDelete: true,});
                                                            }
                                                            const { strategyScriptParamsMap, bookIdMap} = this.state;
                                                            delete strategyScriptParamsMap[item];
                                                            delete bookIdMap[item];
                                                            this.props.updateParamsMap(strategyScriptParamsMap);
                                                            this.setState({bookIdMap, spinning: false});
                                                            // message.success("删除成功！", 2);
                                                        }else {
                                                            this.setState({spinning: false});
                                                            message.error("删除失败！", 2);
                                                        }
                                                    });
                                                }} style={{fontSize: 20, marginLeft: 10}} type="minus-circle" />
                                            }
                                        </Col>
                                    </Row>
                                ))
                            }
                        </div>
                    </Spin>
                }
            </Modal>
        );
    }

}
const mapStateToProps = state => ({
    allBook: state.odmReducer.allBook,
});

const mapDispatchToProps = dispatch => ({
    getAlgo: (params, cb) => dispatch(getAlgo(params, cb)),
    deleteStrategyById: (params, cb) => dispatch(deleteStrategyById(params, cb)),
    findBook: (params, cb) => dispatch(findBook(params, cb)),
    batchUpdateStrategy: (params, cb) => dispatch(batchUpdateStrategy(params, cb)),
});
export default connect(mapStateToProps,mapDispatchToProps)(Form.create()(StrategyAdd));
