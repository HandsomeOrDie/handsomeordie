import { connect } from "react-redux";
import React from "react";
import { DropTarget } from "react-dnd";
import {  Input, Select, Button , Table, Icon, Card, message} from "antd";

const Option = Select.Option;

const dustbinTarget = {
    drop(props, monitor) {
        props.onDrop(monitor.getItem());
    }
};
class Target extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayName: ""
        };
    }
    
    // setDisplayName = (record,e)=>{
    //     console.log(record,e.target.value);
    //     this.setState({
    //         displayName: e.target.value
    //     },()=>{
    //         this.props.setDisplayName(record);
    //     });
    // }
    groupsChecked = (val, record)=> {
        this.props.groupsChecked(val, record);
    }
    save = () => {
        // console.log(this.props.groups_lists,this.state.displayName);
        // let arr = this.props.groups_lists;
        // arr.splice(arr.length-1,1);
        // console.log(arr);
        // for(let i in this.props.groups_lists){
        //     // console.log(parseInt(i)+1,this.props.groups_lists.length);
        //     if(this.props.groups_lists[i].displayName === this.state.displayName && parseInt(i)+1 < this.props.groups_lists.length){
        //         message.warning("Display name 不得重复！");
        //         return false;
        //     }
        // }
        this.props.save();
    }
    cancel = () => {
        this.props.cancel();
    }
    reduceRow_list = (record) => {
        this.props.reduceRow_list(record);
    }
    
    render() {
        // console.log(this.props.deleteId_list);
        const Option = Select.Option;
        const listColum = [{
            title: "Display Name",
            dataIndex: "displayName",
            render: (text, record) => {
                // console.log(text,record);
                if (record.isNew) {
                    // this.setState({
                    //     displayName: record.symbol
                    // },()=>{
                    // this.props.setDisplayName(record);
                    // });
                    return (
                        <div>{record.symbol}{text}</div>
                    // <Input defaultValue={record.symbol} className="price_display_name" onChange={(e) => this.setDisplayName(record,e)} />
                    );
                }
                else {
                    return (text);
                }

            },
            width: 100
        }, {
            title: "Symbol",
            dataIndex: "symbol",
            width: 100,
            render: (text, record) => {

                if (record.isNew) {
                    // this.setState({
                    //     displayName: record.symbol
                    // },()=>{
                    // this.props.setDisplayName(record);
                    // });
                    return (
                        <div>{record.symbol}</div>
                    );
                }
                else {
                    return record.symbol;
                }
            }
        // },
        // {
        //     title: "Preset Name",
        //     dataIndex: "presetName",
        }, {
            title: "Settl Type",
            dataIndex: "settlType",
            width: 100,
            render: (text, record) => {

                if (record.isNew) {
                    // this.setState({
                    //     displayName: record.symbol
                    // },()=>{
                    // this.props.setDisplayName(record);
                    // });
                    return (
                        <div>{record.settlType}</div>
                    );
                }
                else {
                    return (text);
                }
            }
        // },
        // {
        //     title: "Preset Name",
        //     dataIndex: "presetName",
        }, {
            title: "Group",
            dataIndex: "group",
            render: (text, record) => {
                if(record.isNew){
                    return (
                        <Select
                            size="small"
                            className="qit-select-bg"
                            style={{ width: 100 }}
                            onChange={(val) => {
                                this.groupsChecked(val, record);
                            }}>
                            {this.props.groups.map((d, i) => {
                                return (<Option key={i}>{d.name}</Option>);
                            }
                            )}
                        </Select>
                    );
                }else{
                    return (record.groupName);
                }
                
            }
        }];
        const { connectDropTarget } = this.props;
        const loading = this.props.groups_lists instanceof Array && !this.props.groups_lists.length?true:false;
        return connectDropTarget(
            <div style={{flex:16,display:"flex"}}>
                <Card bodyStyle={{padding:10}} style={{flex:1,marginTop:5}}>
                    <div className="tabTitle">
                        <span className="pricingtitle" style={{margin:0}}>Pricing List</span>
                        <div style={{float: "right"}}>
                            <Icon style={{color:"#bfbfbf"}} type="minus-circle" theme="filled"  onClick={this.props.deleteTr}/>
                        </div>
                    </div>
                    <Table
                        loading={!this.props.finish}
                        className="pricingList noShadow"
                        columns={listColum}
                        rowKey={record => record.key}
                        bordered
                        scroll={{y:document.documentElement.clientHeight-518}}
                        dataSource={this.props.groups_lists}
                        onRow={
                            (record) => {
                                return {
                                    onClick: () => {
                                        this.reduceRow_list(record);
                                    }
                                };
                            }
                        }
                        rowClassName={(record) => {
                            if (record.id === this.props.deleteId_list && (record.id) && (record.id !== 0)) {
                                return "qit-tr-active-dark newGroups";
                            } else {
                                return "newGroups";
                            }
                        }}
                        pagination={false} />
                    <div className="focusNormalStyle" style={{ position:"absolute",right:20,bottom:20 }}>
                        <Button style={{ marginRight: "20px" }} onClick={this.cancel}>CANCEL</Button>
                        <Button onClick={this.save}>SAVE</Button>
                    </div>
                </Card>

            </div>
        );
    }
}


export default DropTarget("pricingTr", dustbinTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
}))(Target);