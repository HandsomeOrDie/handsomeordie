import {connect} from "react-redux";
import React, {Component} from "react";
import { Table, Button, message } from "antd";
import RfqChildTable from "./rfqChildTable";
import {findPending,findQuoteSource, send_quoteRfq} from "../../../actions/rfqTable";
import moment from "moment";
class RfqTable extends Component {
    constructor(props){
        super(props);
        this.state={
            expandArr:[],
            spread: null,
            skew: null,
            quoteList: []
        };
    }
    componentDidMount(){
        this.props.findPending();
    }
    componentWillReceiveProps (nextProps) {
        if(nextProps.quoteList !== this.props.quoteList){
            this.setState({quoteList: nextProps.quoteList});
        }
    }
    expandedRowRender =(record, index, indent, expanded) =>{
        if(record.status=="RFQ"){
            return (<RfqChildTable  getSkew_Spread = {this.getSkew_Spread} />);
        }
       
    }
    getDoubleExpand =(e,record) =>{
        const {expandArr} =this.state;
        if(record.status=="RFQ"&&expandArr.indexOf(record.id)==-1){
            this.props.findQuoteSource(record.symbol); 
            expandArr.push(record.id);        
        }else{
            expandArr.splice(expandArr.indexOf(record.id),1);
        }
        this.setState({expandArr});
    }
    getSkew_Spread  = (val) => {
        this.setState(val, ()=>{
            console.log(this.state);
        }); 
    }
    send_quoted = (record) => {
        const {spread, skew, quoteList} = this.state;
  
        if(this.props.quoteMessage){
            let bid = this.props.quoteMessage.bidPxs;
            let ask = this.props.quoteMessage.askPxs;
            let askPxs = [], bidPxs = [];
            bid.map((elem, i)=>{
                let mid = (ask[i]+bid[i])/2;
                let bid_item = (mid-spread/2)+skew,
                    ask_item = (mid+spread/2)+skew;
                askPxs.push(ask_item);
                bidPxs.push(bid_item);
            });
            let obj = {
                askPxs:askPxs,
                bidPxs:bidPxs,
                generateBy: record.id
            };
            this.props.send_quoteRfq(obj, (list)=>{
                record.status = list.status;
                this.setState({quoteList});
            });
        }else{
            message.error("请先设置...");
        }
       
    }
    render() {
        const columns = [
            { title: "RequestID", dataIndex: "id", key: "id" ,width:100},
            { title: "CCy Pair", dataIndex: "symbol", key: "symbol" ,width:"10%"},
            { title: "TENOR", dataIndex: "tenor", key: "tenor" ,width:"5%"},
            { title: "Client", dataIndex: "counterParty", key: "counterParty",width:"10%" },
            { title: "Status", dataIndex: "status", key: "status",width:"10%" },
            { title: "Bid", dataIndex: "bid", key: "bid" ,width:"10%"},
            { title: "Offer", dataIndex: "ask", key: "ask" ,width:"10%"},
            { title: "Side", dataIndex: "side", key: "side" ,width:"5%"},
            { title: "Price", dataIndex: "price", key: "price" ,width:"5%"},
            { title: "Qty", dataIndex: "qty", key: "qty",width:"5%" },
            { title: "Time", dataIndex: "time", key: "time" ,width:"10%",render:(text,record)=><span>{moment(record.time).format("HH:mm:ss")}</span>},
            { title: "Action", key: "Action" ,render: (text,record) => <span>{record.status=="RFQ"?
                <Button onClick={()=>{
                    this.send_quoted(record);
                }}>Quoted</Button>:null}</span> },
        ];
        const data =[];
        for(let i =0;i<5;i++){
            data.push({
                key: i,
                id: "1",
                symbol: "USDCNY",
                tenor: "3M/6M",
                counterParty: "China Petrol",
                status: "RFQ",
                bid: "6.5032",
                ask:"6.5035",
                side:"5",
                price:"4.3333",
                qty:"3",
                time:"12:12:23",  
            });
        }
        const {expandArr} =this.state;
        return (
            <div>
                <Table
                    className="components-table-demo-nested"
                    columns={columns}
                    expandedRowKeys={expandArr}
                    expandedRowRender={this.expandedRowRender}
                    dataSource={this.state.quoteList}
                    pagination={false}
                    // scroll={{y:400}}
                    rowKey={record => record.id} 
                    onRow={(record) => {
                        return {
                            onClick: (event) => {},       // 点击行
                            onDoubleClick: (event) => {this.getDoubleExpand(event,record);},
                            onContextMenu: (event) => {},
                            onMouseEnter: (event) => {},  // 鼠标移入行
                            onMouseLeave: (event) => {}
                        };
                    }}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    quoteList:state.rfqTable.quoteList,
    quoteMessage:state.rfqTable.quoteMessage
});

const mapDispatchToProps = dispatch => ({
    findPending:()=>dispatch(findPending()),
    findQuoteSource:(param)=>dispatch(findQuoteSource(param)),
    send_quoteRfq:(param, cb)=>dispatch(send_quoteRfq(param, cb)),
});
export default connect(mapStateToProps,mapDispatchToProps)(RfqTable);

