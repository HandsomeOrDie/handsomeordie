import { connect } from "react-redux";
import { Icon, Button, Modal ,Select, message, Upload, Row, Col, Form, Input} from "antd";
import React, { Component } from "react";
import {getStrategyList,getClickBtnName,getParamList,getBtnNameList, setInputInfo, uploadScirptFile} from "../../actions/bookHeader";
const Option = Select.Option;

class BookHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            strategyBtnList:[],
            seleceName:"",
            visible: false,
            uploadVisible: false,
            data:{
                instanceId: "MarketMaking.20181226120937862",
                marketBidPrice: "6.501",
                marketOfferPrice: "6.5011",
                marketSpread: "0",
                pnl: "20.000000000042206",
                position: "-200000.0",
                positionMax: "100000000",
                quota: "0.002",
                quoteBidPrice: "6.501",
                quoteOfferPrice: "6.5012",
                quoteSkew: "0.0",
                quoteSpread: "2",
                status: "STOPPED",
                strategyName: "Manual",
                strategyUserParams: {bidPricesStep: ["0", "1", "1", "1","1","1","1"],bidPrice:["6.5010","6.5009","6.5008","6.5007","6.5006","6.5005","6.5004"], bidQuantities: ["1", "2", "3", "4", "5","1","1"],askPricesStep: ["0", "2", "2", "2","2","2","2"],askQuantities: ["3", "4", "5", "6", "7","1","1"],askPrice:["6.5012","6.5014","6.5016","6.5018","6.5020","6.5022","6.5024"]},
                symbols: "USDCNY@CFETS",
                time: "2018-12-27 12:50:13.000",
            },
            currentBtn: undefined,
            uploading: false,
            fileList: [],

            params: [],
            // ,{
            //     instanceId: "MarketMaking.20181226135838777",
            //     marketBidPrice: "6.5021",
            //     marketOfferPrice: "6.5022",
            //     marketSpread: "0",
            //     pnl: "0.0",
            //     position: "0.0",
            //     positionMax: "100000000",
            //     pyUrl: "C:/wspace/python",
            //     quota: "0.0",
            //     quoteBidPrice: "6.502",
            //     quoteOfferPrice: "6.5023",
            //     quoteSkew: "0",
            //     quoteSpread: "3",
            //     status: "STOPPED",
            //     strategyName: "Top",
            //     strategyUserParams: {bid_qty: ["1"], ask_qty: ["3"]},
            //     symbols: "USDCNY@CFETS",
            //     time: "2019-01-03 09:00:57.400",
            // }
            
        };
    }
    componentWillReceiveProps(nextProps){

        if(nextProps.strategyParam !== this.props.strategyParam){
            let {strategyBtnList} =this.state;
            // strategyBtnList=[];
            // if(nextProps.strategyParam.algo=="Manual"){
            //     strategyBtnList.push("Manual");
            // }else{
            //     strategyBtnList.push("Manual");
            //     strategyBtnList.push(nextProps.strategyParam.algo);
            // }

            let paramsMap = nextProps.strategyParam.strategyScriptParamsMap;
            if (paramsMap){
                // strategyBtnList = Object.keys(paramsMap);
                strategyBtnList = nextProps.strategyParam.strategyScriptNames;
                this.props.setInputInfo(paramsMap);
            }else {
                strategyBtnList = [nextProps.strategyParam.algo];
                // paramsMap = {Manual: []};
                // this.props.setInputInfo(paramsMap);
            }
            this.setState({data:nextProps.strategyName,strategyBtnList, currentBtn: nextProps.strategyParam.algo});
        }
        // if(nextProps.strategyList!=this.props.strategyList){
        
        // }
    }
    showPage = () => {
        this.props.showPage(false);
    }

    showModal = () => {
        this.props.getStrategyList();
        this.setState({
            visible: true,
            // strategyList:data
        });
    }
    
      handleOk = (e) => {
          //   console.log(e);
          const {strategyBtnList,seleceName} =this.state;
          for(var i=0;i<strategyBtnList.length;i++){
              if(strategyBtnList[i] ==seleceName){
                  message.error("Repeat add！");
                  return ;
              }
          }
          strategyBtnList.push(seleceName);
          this.setState({
              visible: false,
              strategyBtnList
          });

          this.props.getBtnNameList(strategyBtnList);
          //   console.log(this.props.paramList);
          let _this =this;
          //   if(this.props.btnName.indexOf(seleceName)){ console.log("sjflksjfklsdjklsdjflks");}
     
          this.props.strategyList.map(val=>{
              if(val.algo ==seleceName){
                  let obj =this.props.paramList;
                  val["status"] ="STOPED";
                  obj.push(val);
                  _this.props.getParamList(obj);

                  let inputInfo = this.props.inputInfo;
                  // console.log("seleceName:", seleceName);
                  // console.log("paramList:", obj);
                  obj.map(item => {
                      // console.log(item.algo);
                      if (item.algo === seleceName) {
                          const input = {};
                          item.config.map(item_c => {
                              input[item_c.name] = item_c.value;
                          });
                          // console.log("input:", input);
                          inputInfo[seleceName] = input;
                      }
                  });
                  // console.log("inputInfo:", inputInfo);
                  this.props.setInputInfo(inputInfo);
              }
          });
  
      }
    
      handleCancel = (e) => {
          //   console.log(e);
          this.setState({
              visible: false,
          });
      }
      handleChange =(e) =>{
          this.setState({seleceName:e});
      }
      switchBtn= (e) =>{
          //   console.log(e.currentTarget.innerText);
          //   this.props.getClickBtnName(e.currentTarget.innerText);
          //   this.props.getClickBtnName({name:e.currentTarget.innerText,index:idx});
          this.setState({currentBtn: e.currentTarget.innerText});
          const paramList =this.props.paramList;
          let flag = true;
          paramList.map((item,idx)=>{
              if(item.algo==e.currentTarget.innerText){
                  flag = false;
                  this.props.getClickBtnName({name:e.currentTarget.innerText,index:idx,status:item.status});
              }
          });
          if (flag){
              this.props.getClickBtnName({name:e.currentTarget.innerText,index: 0,status: 0});
          }
      }
      renderbtnListBg =(item) =>{
          const {strategyParam,paramList,btnIndex} =this.props;
          //   const {strategyBtnList} =this.state;
          //   for(var i =0 ;i<strategyBtnList.length;i++){
          //       if(strategyBtnList[i]==strategyParam.algo &&btnIndex.name == strategyBtnList[i]){
          //           return "btn-large-bg";
          //       }
          //   }
          if(item ==strategyParam.algo){
              return "btn-large-bg";
          }
          return "btn-bottom-border";
      }

        handleUpload = () => {
            // this.setState({uploadVisible: false});
            console.log(this.state.fileList);
            this.props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    console.log(values);
                    //

                    // return;
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
                    // values.code = fileList[0];
                    this.props.uploadScirptFile(formData, (result)=>{
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
            const {strategyBtnList}=this.state;
            //   console.log(strategyBtnList);
            const { getFieldDecorator } = this.props.form;

            const { uploading, fileList } = this.state;
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

            const formItemLayout = {
                labelCol: {
                    xs: { span: 6 },
                    sm: { span: 6 },
                },
                wrapperCol: {
                    xs: { span: 14 },
                    sm: { span: 14 },
                },
            };
            return (

                <div className="market-detail-setting market-detail-setting-book strategy-book" style={{marginTop: 5,marginLeft: 5}}>

                    <div style={{marginLeft: 15}}>
                        <div className="strategy-book-symbol">{this.props.strategyParam?this.props.strategyParam.symbol:null}</div>
                        {strategyBtnList&&strategyBtnList.map((item,index)=>(
                            <Button style={{margin:"0 4px", backgroundColor: this.state.currentBtn === item ? "#14698C" : undefined}} size="small" key={index} onClick={(e)=>{this.switchBtn(e);}}>{item}</Button>
                        ))}
                        {/* <Button style={{margin:"0 4px"}} size="small" >{this.props.strategyParam?this.props.strategyParam.algo:null}</Button> */}
                    </div>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Button size="small" onClick={()=>{
                            this.setState({uploadVisible: true});
                        }} style={{marginRight: 10, marginLeft: 10}}>UPLOAD</Button>
                        <Icon type="plus-square" onClick={this.showModal} />
                        <Icon type="minus-square"/>
                    </div>
                    <Modal
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        className="darkTheme"
                    >
                        {/* <FillModal /> */}
                        <div style={{width:"100%",textAlign:"center"}}>
                            <Select id={"strategy-select"} className="qit-select-bg" style={{ width: 200 }} onChange={this.handleChange} >
                                {this.props.strategyList&&this.props.strategyList.map((item,idx)=>(
                                    <Option key={idx} value={item.algo}>{item.algo}</Option>
                                ))}
                                {/* <Select.Option value="jack">Jack</Select.Option>
                              <Select.Option value="lucy">Lucy</Select.Option>
                              <Select.Option value="disabled" >Disabled</Select.Option>
                              <Select.Option value="Yiminghe">yiminghe</Select.Option> */}

                            </Select>
                        </div>

                    </Modal>

                    <Modal
                        visible={this.state.uploadVisible}
                        destroyOnClose={true}
                        onOk={()=>{
                            this.handleUpload();
                        }}
                        onCancel={()=>{
                            this.setState({uploadVisible: false});
                        }}
                        title="Upload Script"
                        className="darkTheme"
                    >
                        <Form>
                            <Form.Item style={{margin:0}} {...formItemLayout} label="Name">
                                {getFieldDecorator("name", {
                                    rules: [{ message: "Please input your Name!", required: true  }],
                                })(
                                    <Input/>
                                )}
                            </Form.Item>
                            <Form.Item style={{margin:0}} {...formItemLayout} label="Template">
                                {getFieldDecorator("template", {
                                    rules: [{ message: "Please input your Template!", required: true  }],
                                })(
                                    <Select
                                        className="qit-select-bg"
                                        // placeholder="请选择"
                                        // onChange={(value)=>{this.onSymbolsChange(value);}}
                                    >
                                        <Option key="MarketMaking" value="MarketMaking">MarketMaking</Option>
                                        <Option key="QuantTrading" value="QuantTrading">QuantTrading</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item style={{margin:0}} {...formItemLayout} label="Code">
                                {getFieldDecorator("code", {
                                    rules: [{ message: "Please upload your Code!", required: true  }],
                                })(
                                    <Upload {...props}>
                                        <Button size="small">
                                            <Icon type="upload" /> Select File
                                        </Button>
                                    </Upload>
                                )}
                            </Form.Item>
                            <Form.Item style={{margin:0}} {...formItemLayout} label="Params">
                                {getFieldDecorator("params", {
                                })(
                                    <Button size="small" onClick={()=>{
                                        this.setState({params: [...this.state.params, {}]});
                                    }}>
                                        <Icon type="plus" />
                                    </Button>
                                )}
                            </Form.Item>
                            {this.state.params.length > 0 && <Row>
                                <Col offset={6}>
                                    <div>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td>name</td>
                                                    <td>defaultValue</td>
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

                        </Form>
                    </Modal>
                </div>


            );
        }
}

const mapStateToProps = state => ({
    strategyParam: state.paramReducer.strategyParam,
    strategyList:state.bookHeader.strategyList,
    strategyBtnList:state.bookHeader.strategyBtnList,
    paramList:state.bookHeader.paramList,
    btnName:state.bookHeader.btnName,
    btnIndex:state.bookHeader.btnIndex,
    inputInfo:state.bookHeader.inputInfo,
});

const mapDispatchToProps = dispatch => ({
    getStrategyList: () => dispatch(getStrategyList()),
    getClickBtnName: (param) => dispatch(getClickBtnName(param)),
    getParamList:(param, cb)=>dispatch(getParamList(param, cb)),
    getBtnNameList:(param)=>dispatch(getBtnNameList(param)),
    setInputInfo:(inputInfo)=>dispatch(setInputInfo(inputInfo)),
    uploadScirptFile:(param, cb)=>dispatch(uploadScirptFile(param, cb)),
});
const BookHeaderForm = Form.create()(BookHeader);
export default connect(mapStateToProps, mapDispatchToProps)(BookHeaderForm);