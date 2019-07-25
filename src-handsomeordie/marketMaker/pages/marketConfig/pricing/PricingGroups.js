import { connect } from "react-redux";
import React from "react";
import {  Switch, Input, Icon , Table, message, Popconfirm, Card} from "antd";
import {
    getGroups, createGroups, updateGroups, deleteGroups,
} from "../../../actions/pricing";
class pricingGroups extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            groups: [],
            deleteId: "",
            loading: true,
            addMode: false
        };

    }
    componentDidMount() {
        this.props.getGroups(()=>{
            this.setState({
                loading: false
            });
        });
    }
    componentWillReceiveProps (nextProps) {
        if(nextProps.groupsReducer.list !== this.props.groupsReducer.list){
            let list = nextProps.groupsReducer.list;
            if(list){
                for(let i=0;i<list.length;i++){
                    list[i].isNew = false;
                    list[i].key = i;
                }
                // console.log("again");
                this.setState({groups: list});
            }
        }
        
    }
    changeChecked = (value, record) => {
        let {groups} = this.state;
        // console.log(value);
        groups[record.key].control = value;
       
        let obj = {
            name: record.name,
            id: record.id,
            control: record.control
        };

        if(!record.isNew){//新建不请求api
            this.props.updateGroups({"input":JSON.stringify(obj)});//返回的数据不要
            // console.log("api");
        }
        this.setState({groups});
    }
   
    addGroups = () => {
        if(this.state.addMode){
            return;
        } else {
            this.setState({
                addMode: true
            },()=>{
                let {groups} = this.state;
                groups.push(
                    {
                        key: groups.length,
                        name: "",
                        control: true,
                        isNew: true
                    }, 
                );
                this.setState({groups});
            });
        }
    }
    reduceRow = (record) => {
        this.setState({deleteId: record.id});
    }
    // reduceGroups = () => {
    //     this.props.deleteGroups({id:this.state.deleteId});
    // }
    create_Groups = (record) => {
        let input_val = document.getElementById("input_val").value;
       
        let obj = {
            name: input_val,
            control: record.control
        };
        this.setState({
            addMode: false
        });
        this.props.createGroups({"input":JSON.stringify(obj)});
    }
    confirm = (e) => {
        // console.log(e);
        if(this.state.deleteId === ""){
            message.warning("Please select！");
        } else {
            this.props.deleteGroups({id:this.state.deleteId},()=>{
                this.props.find_PricingList();
            });
        }
    }
      
    cancel = (e) => {
        // console.log(e);
        // message.error("Click on No");
    }
    render() {
        const groupColum = [{
            title: "Name",
            dataIndex: "name",
            render: (text, record) => {
                if (record.isNew) {
                    return (
                        <Input id="input_val" ref="input_val"
                            onPressEnter={() => this.create_Groups(record)}
                        />
                    );
                }
                else {
                    return (text);
                }

            }
        }, {
            title: "Group Control",
            dataIndex: "control",
            render: (text, record) => {
                return (
                    <Switch
                        checkedChildren="YES" unCheckedChildren="NO" checked={record.control}
                        onChange={(value) => {
                            this.changeChecked(value, record);
                        }} />
                );
            }
        },];
        const { groups, deleteId, loading } = this.state;
        // const loading = groups instanceof Array && !groups.length?true:false;
        return (
            <Card bodyStyle={{padding:10}} style={{flex:8,marginBottom:5}}>
                <div className="tabTitle">
                    <span className="pricingtitle" style={{marginTop: 0}}>Pricing Groups</span>

                    <div style={{float: "right"}}>
                        <Icon style={{color:"#bfbfbf"}} type="plus-circle" theme="filled" onClick={this.addGroups} />
                        <Popconfirm 
                            title="删除组，同时删除 Counter Party List 中的对于组数据！"
                            onConfirm={this.confirm} 
                            onCancel={this.cancel} 
                            okText="确定" cancelText="取消">
                            <Icon style={{color:"#bfbfbf"}} type="minus-circle" theme="filled" />
                        </Popconfirm>
                        {/* <Icon type="minus-circle" theme="filled" onClick={this.reduceGroups} /> */}
                    </div> 
                </div>
                <Table columns={groupColum}
                    loading={loading}
                    bordered
                    className="noShadow"
                    dataSource={groups}
                    pagination={false}
                    scroll={{y:130}}
                    rowClassName={(record) => {
                        if (record.id === deleteId) {
                            return "qit-tr-active-dark newGroups";
                        } else {
                            return "newGroups";
                        }
                    }}
                    rowKey={record => record.name}
                    onRow={(record) => {
                        return {
                            onClick: () => {
                                this.reduceRow(record);
                            }
                        };
                    }}
                />
            </Card>
        );
    }
}
const mapStateToProps = state => ({
    groupsReducer: state.groupsReducer,
    Save_trReducer: state.Save_trReducer,
    Save_PricingListRucer: state.Save_PricingList
});

const mapDispatchToProps = dispatch => ({
    getGroups: (cb) => dispatch(getGroups(cb)),
    createGroups: (elem) => dispatch(createGroups(elem)),
    updateGroups: (elem) => dispatch(updateGroups(elem)),
    deleteGroups: (elem,cb) => dispatch(deleteGroups(elem,cb)),

});
export default connect(mapStateToProps, mapDispatchToProps)(pricingGroups);