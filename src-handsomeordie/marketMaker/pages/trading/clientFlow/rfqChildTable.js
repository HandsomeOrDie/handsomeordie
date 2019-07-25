import { connect } from "react-redux";
import React, { Component } from "react";
import { Row, Col, InputNumber, Select } from "antd";
import {selectQuotesID} from "../../../actions/rfqTable";
class RfqChildTable extends Component {
    constructor(props){
        super(props);
        this.state={
            spread:null,
            skew:null,
            bid_ask:[],
        };
    }
    componentWillReceiveProps (nextProps) {
        if(nextProps.quoteMessage !== this.props.quoteMessage){
            let askPxs = nextProps.quoteMessage.askPxs,
                bidPxs = nextProps.quoteMessage.bidPxs,
                askQties = nextProps.quoteMessage.askQties,
                bidQties = nextProps.quoteMessage.bidQties;
            let arr = [];
            let isBid_ask = false;//判断bid ask个数是否一样
            if(askQties.join("") === bidQties.join("") ){
                isBid_ask = true;
            }
            askPxs.map((elem, index)=>{
                arr[index] = [];
                arr[index].push(bidPxs[index]);
                arr[index].push(bidQties[index]);
                if(!isBid_ask){
                    arr[index].push(askQties[index]);
                }
                arr[index].push(elem);
            });
            this.setState({bid_ask: arr});//arr: [[bid,2,3,ask], [1,2,3]]
        }
    }
    changeSpread =(e) =>{
        let obj = {spread: e};
        this.props.getSkew_Spread(obj);
    }
    changeSkew =(e) =>{
        let obj = {skew: e};
        this.props.getSkew_Spread(obj);
    }
    selectQuoteSource =(e)=>{
        console.log(e);
        this.props.selectQuotesID(e);   
    }
    render() {
        const Option = Select.Option;
        const{bid_ask} = this.state;
        return (
            <div className="rfq-child-table">
                <div  style={{margin:"0 30px"}}>
                   
                </div>
                <div ><span style={{display:"inline-block",marginRight:"6px"}}>+Spread</span><InputNumber size="small" onChange={this.changeSpread} /></div>
                <div style={{margin:"0 30px"}}><span style={{display:"inline-block",marginRight:"6px"}}>+Skew</span><InputNumber size="small"  onChange={this.changeSkew}/></div>
                <div >
                    <table className="strategy-table">
                        <tbody>
                            <tr >
                                <td>Pricing</td>
                                <td> <Select size="small" style={{ width: 150 }} className="qit-select-bg" >
                                    <Option value="jack">Jack</Option>
                                    <Option value="lucy">Lucy</Option>
                                    <Option value="disabled" disabled>Disabled</Option>
                                    <Option value="Yiminghe">yiminghe</Option>
                                </Select></td>
                            </tr>
                            <tr >
                                <td>Quotes</td>
                                <td>   <Select size="small" style={{ width: 150 }} className="qit-select-bg" onChange={this.selectQuoteSource}>
                                    {this.props.quoteSource&&this.props.quoteSource.map((item,index)=>(
                                        <Option key={index} value={item.id}>{`${item.displayName}.${item.source}.${item.tradingType}`}</Option>
                                    ))}
                                </Select></td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    quoteSource :state.rfqTable.quoteSource,
    quoteMessage:state.rfqTable.quoteMessage
});

const mapDispatchToProps = dispatch => ({
    selectQuotesID:(param) =>dispatch(selectQuotesID(param))
});
export default connect(mapStateToProps, mapDispatchToProps)(RfqChildTable);