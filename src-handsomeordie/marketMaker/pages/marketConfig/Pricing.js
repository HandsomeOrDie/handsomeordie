import { connect } from "react-redux";
import React, { Component } from "react";
import { DragDropContext, DragSource, DropTarget } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import {message, Row, Col, Select, Input, Table, Button, Switch, Icon, Card, Spin } from "antd";
import MarketPairs from "./pricing/MarketPairs";
import PricingList from "./pricing/PricingList";
import PricingGroups from "./pricing/PricingGroups";
import {
    Save_PricingList, Find_PricingList, Delete_PricingList,Save_tr
} from "../../actions/pricing";
import moment from "moment";
import BodyRowDom from "./pricing/PricingList_tr";
const rowSource = {
    beginDrag(props) {
        // let index = props.index;
        let siginData = props["children"][0];
        let record = siginData.props.record;
        return {
            obj: record,
        };
    },
};
const rowTarget = {
    drop(props, monitor) {
        const dragIndex = monitor.getItem().obj;
        const hoverIndex = props.obj;
        if (dragIndex === hoverIndex) {
            return;
        }
        props.moveRow(dragIndex, hoverIndex);
        monitor.getItem().obj = hoverIndex;
    },
};
const DragableBodyRow = DropTarget("pricingTr", rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    sourceClientOffset: monitor.getSourceClientOffset(),
}))(
    DragSource("pricingTr", rowSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        dragRow: monitor.getItem(),
        clientOffset: monitor.getClientOffset(),
        initialClientOffset: monitor.getInitialClientOffset(),
    }))(BodyRowDom)
);
  

class Pricing extends Component {
    state = {
        groups: [],
        deleteId_list: "",
        groups_lists: [],
        currentInput: 0,
        save_tr: [],//保存拖的n条
        finish: false,
    }
    components = {
        body: {
            row: DragableBodyRow,
        },
    }
  
    setList = (data) => {
        // console.log(data);
        let list = data.list;
        let {groups_lists, currentInput} = this.state;
        currentInput = currentInput+1;
        if(list){
            let isOver = false;
            groups_lists.map((elem)=>{
                // console.log(elem,list);
                if(elem.id === list.id){
                    isOver = true;
                }
            });
            if(isOver){
                message.error("Repeat add！");
            }else{
                // console.log(list);
                groups_lists.push({
                    id: list.id,
                    key: groups_lists.length,
                    isNew: true,
                    key_input: currentInput,
                    displayName: list.symbol,
                    groupId: "",
                    groupName: "",
                    isDeleted: list.isDeleted,
                    keyName: list.keyName,
                    securityId: list.securityId,
                    settlType: list.settlType,
                    updatedBy: list.updatedBy,
                    updatedTime: list.updatedTime,
                    symbol: list.symbol,
                });
                setTimeout(()=>{
                    this.setState({groups_lists,currentInput});
                });
            }
  
           
        }
        
    }
    initPrincingList = (data) => {
        let list = data.pricingList;
     
        if(list){
            let {groups_lists} = this.state;
            groups_lists = [];
            list.map((elem)=>{
                groups_lists.push({
                    key: groups_lists.length,
                    isNew: false,

                    displayName: elem.displayName,
                    groupId: elem.groupId,
                    groupName: elem.groupName,
                    id: elem.id,
                    isDeleted: elem.isDeleted,
                    keyName: elem.keyName,
                    marPxCfgId: elem.marPxCfgId,
                    presetName: elem.presetName,
                    securityId: elem.securityId,
                    settlType: elem.settlType,
                    updatedBy: elem.updatedBy,
                    updatedTime: elem.updatedTime,
                    symbol: elem.symbol,
                });
            });
  
            this.setState({groups_lists});
        }
        
    }
    componentDidMount() {
        // this.props.getGroups();
        this.props.Find_PricingList((data)=>{
            // if(data){
            this.setState({
                finish: true
            });
            // }
        });
    }
    
    componentWillReceiveProps (nextProps) {
        if(nextProps.Save_PricingListRucer !== this.props.Save_PricingListRucer){
            this.initPrincingList(nextProps.Save_PricingListRucer);//第一次加载pricingList
        }
        if(nextProps.Save_trReducer !== this.props.Save_trReducer){
            this.setList(nextProps.Save_trReducer);
        }
    }
    groupsChecked = (val, record) => {
        if(parseInt(val)){
            let line = this.props.groupsReducer.list[val-1];//groups添加了一项null
            record.groupName = line.name;
            record.groupId = line.id;
        }else{
            record.groupName = null;
            record.groupId = null;
        }
    }
    reduceRow_list = (record) => {
        this.setState({deleteId_list: record.id});
        
    }
    setDisplayName = (record) => {//input失去焦点
        let inputs = document.getElementsByClassName("price_display_name");
        let index = record.key_input - 1;
        record.displayName = inputs[index] && inputs[index].value?inputs[index].value:"";
    }
    deleteTr = () => {
        if(this.state.deleteId_list){
            this.props.Delete_PricingList({ id: this.state.deleteId_list });
        }
    }
    cancel = () => {
        let {groups_lists} = this.state;
        let list = this.props.Save_PricingListRucer;
        let len = 0;
        if(list.pricingList && (groups_lists.length!==list.pricingList.length)){
            len = list.pricingList.length;
            groups_lists.splice(len);
            this.setState({groups_lists, currentInput: 0});
        }
    }
    save = () => {
        const { groups_lists } = this.state;
        let arr = [];
        // console.log(groups_lists);
        groups_lists.map((elem) => {
            if( elem.isNew){
                elem.isNew = false;
                let obj = {};
                // obj["securityId"] = elem.securityId;
                obj["settlType"] = elem.settlType;
                obj["marPxCfgId"] = elem.id;
                obj["groupId"] = elem.groupId;
                obj["displayName"] = elem.displayName;
                obj["presetName"] = elem.presetName;
                obj["groupName"] = elem.groupName;
                obj["symbol"] = elem.symbol;

                arr.push(obj);
            }
        });
        console.log(arr);
        if(arr.length){
            let isFull = false;
            arr.map((elem)=>{
                if(!elem.displayName){
                    isFull = true;
                }
            });
            if(isFull){
                message.error("Please input displayName！");
            }else{
                this.setState({ currentInput: 0});//清空当前输入框
                this.props.Save_PricingList({ "input": JSON.stringify(arr) });
            }
        }

    }
    Dropped = (newValue, oldValue) => {
        this.setSignTr(newValue.obj);
    }

    
    setSignTr = (record) => {
        console.log(record);
        let obj = record;
    
        let {save_tr} =  this.state;
        if(save_tr.length){
            save_tr.map((elem)=>{
                if(elem.id === obj.id){//相同累加
                    elem.presetName = obj.presetName;
                    elem.id = obj.id;
                    elem.symbol = obj.symbol;
                }
            });

            save_tr.push(obj);
            this.setState({save_tr}, ()=>{
                this.props.Save_tr(obj);
            });
        }else{
            save_tr.push(obj);
            this.setState({save_tr}, ()=>{
                this.props.Save_tr(obj);
            });
        }
   
    };

    findPricingList = () => {
        this.setState({
            finish: false
        },()=>{
            this.props.Find_PricingList((data)=>{
                this.setState({
                    finish: true
                });
            });
        });
    }

    render() {
        const { groups_lists ,deleteId_list, finish} = this.state;
        let list = [{name: "-", id: "-"}];
        const get_groups = () => {
            let list_ = this.props.groupsReducer.list;
            list = list.concat(list_);
            return list;
        };
        const list_groups = get_groups();
        
        return (
            
            <div className="pricing" style={{flex:1,display:"flex"}}>
                <MarketPairs components={this.components}/>
                <div style={{flex:3,display:"flex",flexDirection:"column"}}>
                    <PricingGroups find_PricingList={this.findPricingList} />
                    <PricingList 
                        groupsChecked = {this.groupsChecked}
                        save = {this.save}
                        cancel = {this.cancel}
                        setDisplayName = {this.setDisplayName}
                        reduceRow_list = {this.reduceRow_list}
                        deleteTr = {this.deleteTr}
                        groups_lists = {groups_lists}
                        deleteId_list = {deleteId_list}
                        groups = {list_groups}
                        finish={finish}
                        onDrop={this.Dropped}
                    />
                </div>
            </div>

        );
    }
}

const mapStateToProps = state => ({
    groupsReducer: state.groupsReducer,
    Save_trReducer: state.Save_trReducer,
    Save_PricingListRucer: state.Save_PricingList
});

const mapDispatchToProps = dispatch => ({
    Save_PricingList: (elem) => dispatch(Save_PricingList(elem)),
    Find_PricingList: (cb) => dispatch(Find_PricingList(cb)),
    Delete_PricingList: (elem) => dispatch(Delete_PricingList(elem)),
    Save_tr:(elem)=>dispatch(Save_tr(elem)),
});
const Demo = DragDropContext(HTML5Backend)(Pricing);
export default connect(mapStateToProps, mapDispatchToProps)(Demo);