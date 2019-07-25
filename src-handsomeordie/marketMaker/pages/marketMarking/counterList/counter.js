import { connect } from "react-redux";
import React, { Component } from "react";
import { DragDropContext, DragSource, DropTarget } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import {message, Row, Col, Select, Input, Table, Button, Switch, Icon } from "antd";
import CounterList from "./counterList";
import CounterList_copy from "./CounterList_copy";
import CounterListList_tr from "./CounterListList_tr";

import { getCounterParty_drag, getCounterParty_save } from "../../../actions/distribution";
const rowSource = {
    beginDrag(props) {
        let index = props.index;
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
const DragableBodyRow = DropTarget("counterTr", rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    sourceClientOffset: monitor.getSourceClientOffset(),
}))(
    DragSource("counterTr", rowSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        dragRow: monitor.getItem(),
        clientOffset: monitor.getClientOffset(),
        initialClientOffset: monitor.getInitialClientOffset(),
    }))(CounterListList_tr)
);
  

class counter extends Component {
    state = {
        group_list_copy: [],
        group_item: {},
        deleteCode: "",
        deleteName: "",
    }
    components = {
        body: {
            row: DragableBodyRow,
        },
    }
  
    setList = (data) => {
      
     
    }
    
    componentDidMount() {
        console.log(this.props.currentCounterPartyInfo);
    }
    
    componentWillReceiveProps (nextProps) {
       
    }
   
    reduceRow_list = (record) => {
        let code = record.code;
        let name = record.name;
        this.setState({deleteCode: code,deleteName: name});
    }
   
    resetDrag = (flag, id) => {
        let list = this.props.CounterPartyReducer.list_drag;
        id = Number(id);
        list.map((elem)=>{
            let code = elem.code;
            let name = elem.name;
            if(code === flag || name ===flag || id === elem.groupId || id === elem.id){
                elem.isDrage = false;
            }
        });
        this.props.getCounterParty_drag([].concat(list));
    }

    resetGroupDrag = (groupId) => {
        let list = this.props.CounterPartyReducer.list_drag;
        // console.log(list);
        list.map((elem)=>{
            if(groupId === elem.id){
                elem.isDrage = false;
            }
        });
        this.props.getCounterParty_drag([].concat(list));
    }

    deleteTr = (cb) => {
        let arr = [];
        let {deleteCode,deleteName, group_list_copy} = this.state;
        if(deleteCode){//删子项
            let groupId;
            for(let i=0;i<group_list_copy.length;i++){
                let code = group_list_copy[i].code;
                if(code === deleteCode){//删子项
                    groupId = group_list_copy[i].groupId;
                    group_list_copy.splice(i,1);
                    break;
                }
            }
            this.setState({group_list_copy});
            // console.log(group_list_copy);
            this.resetDrag(deleteCode);
            groupId && this.resetGroupDrag(groupId);
        }else  if(deleteName){//删组
            let nameObj= this.props.CounterPartyReducer.nameObj;
            let id_delete = null;
            for(var k in nameObj){
                if(nameObj[k] === deleteName){
                    id_delete = k;
                }
            }

            for(let n=0;n<group_list_copy.length;n++){
                let Id = (group_list_copy[n].id || group_list_copy[n].groupId) + "";
               
                if(Id !== id_delete){
                    arr.push(group_list_copy[n]);
                }
            }
            this.setState({group_list_copy: arr});
            this.resetDrag(deleteName, id_delete);
        }
        cb();
    }
    cancel = () => {
        let list = this.props.CounterPartyReducer.list_drag;
        this.setState({group_list_copy: []});
        list.map((elem)=>{
            if(elem.isDrage){
                elem.isDrage = false;
            }
        });
        this.props.getCounterParty_drag([].concat(list));
    }
    save = () => {
        const {group_list_copy} = this.state;
        let nameObj= this.props.CounterPartyReducer.nameObj;
        let counterParties = [];
        let counterPartyGroups = [];
        for(let i=0;i<group_list_copy.length;i++){
            let elem = group_list_copy[i];
            let id = elem.groupId || elem.id;
            let group = {
                name: nameObj[id],
                id: id,
                counterParties: []
            };
            if(elem.id){//组
                let isOver = true;
                for(let n=0;n<counterPartyGroups.length;n++){
                    if(counterPartyGroups[n].name === group.name){
                        isOver = false;
                        break;
                    }
                }
                if(isOver){//不存在
                    counterPartyGroups.push(group);
                }
            }else if(elem.groupId){//被分组，组下成员
                let isOver = true;
                for(let m=0;m<counterPartyGroups.length;m++){
                    if(counterPartyGroups[m].name === group.name){
                        counterPartyGroups[m].counterParties.push(elem);
                        isOver = false;
                        break;
                    }
                }
                if(isOver){//还不存在
                    group.counterParties.push(elem);
                    counterPartyGroups.push(group);
                }
            }else{//不被分组
                counterParties.push(elem);
            }
        }
     
        let result = {
            counterParties: counterParties,
            counterPartyGroups: counterPartyGroups,
        };
        this.cancel();
        this.props.onSave(result);
    }
    Dropped = (newValue, oldValue) => {
        this.setSignTr(newValue.obj);
    }

    
    setSignTr = (record) => {
        const {group_list_copy} = this.state;
        let origin_data = this.props.CounterPartyReducer.list_drag;
        let code = record.code, name = record.name;

        if (record.id){
            if (record.isDrage){
                message.error("Already exists!");
                return;
            }
            origin_data.map((item)=>{
                if (item.groupId === record.id){
                    if (group_list_copy.findIndex(copy => copy.code === item.code) === -1){
                        group_list_copy.push(item);
                        item.isDrage = true;
                        this.props.getCounterParty_drag([].concat(origin_data));
                    }
                }
                if (item.id === record.id){
                    item.isDrage = true;
                    this.props.getCounterParty_drag([].concat(origin_data));
                }
            });
        } else {
            if (group_list_copy.findIndex(copy => copy.code === record.code) === -1){
                group_list_copy.push(record);
                origin_data.map(item => {
                    if (item.code === record.code){
                        item.isDrage = true;
                    }
                });
                this.props.getCounterParty_drag([].concat(origin_data));
            }else {
                message.error("Already exists!");
            }
        }
        this.setState({group_list_copy});

        // if(group_list_copy.length){//非第一次
        //     for(let i=0;i<origin_data.length;i++){
        //         let elem = origin_data[i];
        //         let code_ = elem.code || elem.name;
        //
        //         if(code === code_ && !elem.isDrage){//拖单项
        //             group_list_copy.push(record);
        //             elem.isDrage = true;
        //             this.props.getCounterParty_drag([].concat(origin_data));
        //             break;
        //         }
        //
        //         if(name === code_ && !elem.isDrage){//拖一组
        //
        //             origin_data.map((data)=>{
        //                 // //删除组里已有的
        //                 group_list_copy.map((elem, index)=>{
        //                     if(record.id === elem.groupId){
        //                         group_list_copy.splice(index, 1);
        //                     }
        //                 });
        //
        //                 if(name === data.name){//拖组-项
        //                     group_list_copy.push(record);
        //                     data.isDrage = true;
        //                 }
        //
        //                 if(record.id === data.groupId){//拖组下面所有项
        //                     group_list_copy.push(data);
        //                     data.isDrage = true;
        //                 }
        //             });
        //             this.props.getCounterParty_drag([].concat(origin_data));
        //             break;
        //         }
        //
        //         if((code === code_  || name === code_) && elem.isDrage){//以存在
        //             message.error("已存在");
        //             break;
        //         }
        //     }
        // }else{
        //     for(let i=0;i<origin_data.length;i++){
        //         let elem = origin_data[i];
        //         let code_ = elem.code || elem.name;
        //
        //         if(name === code_ ){//拖一组
        //             origin_data.map((data)=>{
        //                 if(name === data.name){//拖组-项
        //                     group_list_copy.push(record);
        //                     data.isDrage = true;
        //                 }
        //
        //                 if(record.id === data.groupId){//拖组下面所有项
        //                     group_list_copy.push(data);
        //                     data.isDrage = true;
        //                 }
        //             });
        //             this.props.getCounterParty_drag([].concat(origin_data));
        //             break;
        //         }
        //         if(code === code_ ){//可拖//拖单项
        //             group_list_copy.push(record);
        //             elem.isDrage = true;
        //             this.props.getCounterParty_drag([].concat(origin_data));
        //             break;
        //         }
        //     }
        //
        // }
        // this.setState({group_list_copy});
    };

    render() {
        const { group_list_copy ,deleteId_list} = this.state;
        return (
            <div className="pricing">
                <Row>
                    <Col span={12} style={{ paddingRight: "30px" }}>
                        <CounterList   components={this.components}/>
                    </Col>
                    <Col span={12}>
                        <CounterList_copy 
                            
                            cancel = {this.cancel}
                            save = {this.save}
                            reduceRow_list = {this.reduceRow_list}
                            deleteTr = {this.deleteTr}
                            deleteCode = {this.state.deleteCode}
                            deleteName = {this.state.deleteName}
                            list = {group_list_copy}
                            onDrop={this.Dropped}
                        />
                        
                    </Col>
                </Row>
            </div>
        );
    }
}




const mapStateToProps = state => ({
    CounterPartyReducer: state.CounterPartyReducer,
});

const mapDispatchToProps = dispatch => ({
    getCounterParty_drag: (data) => dispatch(getCounterParty_drag(data)),
    getCounterParty_save: (data) => dispatch(getCounterParty_save(data)),
});
const Demo = DragDropContext(HTML5Backend)(counter);
export default connect(mapStateToProps, mapDispatchToProps)(Demo);