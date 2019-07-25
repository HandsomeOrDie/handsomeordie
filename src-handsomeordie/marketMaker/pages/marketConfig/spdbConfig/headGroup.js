import {connect} from "react-redux";
import React, {Component} from "react";
// import { InfinityTable as Table } from "antd-table-infinity";
import {Input, Button, Icon, Spin, Transfer ,Modal,message,Table,Form } from "antd";
import { findBook,createBook,getUserList,deleteBook } from "../../../actions/spdb/configAction";
import {checkLogin} from "../../../actions/marketDetail";
class HeadGroup extends Component {
    state = {
        data: [],
        loading:false,
        addItemVisible:false,
        editItemVisible:false,
        editItem:"",
        targetKeys: [],
        newBookName: "",
        activeBookId: ""
    }
    findBook = () => {
        this.props.findBook({
            userId: JSON.parse(localStorage.getItem("userInfo")).id,
        },(data)=>{
            this.setState({data:data.data});
            console.log("data",this.state.data);
        });

    }
    componentDidMount() {
        this.props.checkLogin((data) => {
            if (!data) {
                this.props.history.push("/marketlogin");
                return;
            }
        });
        this.props.getUserList({
            filters:null,orders:null,startRecord:0,maxRecords:100,
        },(data)=>{
            this.setState({
                userlist: data.data
            });
            // console.log("userlist",data);
        });
        this.findBook();
    }

    componentWillReceiveProps(nextProps) {

    }

    addItem = () => {
        this.setState({
            addItemVisible: true,
        });
        //打开穿梭框
    }


    handleDeleteItem = () => {
        if(this.state.activeBookId === ""){
            message.warning("请选择要删除的头组！");
        } else {
            if(this.state.activeBookId === 0){
                message.warning("该头组不能删除！");
            } else {
                this.showConfirm();
            }
        }
    }
    showEdit = (id,data) =>{
        if(!data.userIds){
            data.userIds = [];
        }else{
            data.userIds = data.userIds.map((item)=>(item*1));
        }
        console.log("showedit",data);

        this.setState({editItem:data});
        let ids = this.state.editItem.userIds;

        console.log("ids2222",ids);

        // console.log(this.state.editItem);
        this.setState({editItemVisible:true});
    }

    handleEditChange = (userIds) =>{
        this.setState({
            editItem:{
                ...this.state.editItem,
                userIds

            }
        });
        console.log(
            this.state.editItem
        );
    }
    handleEditCancel = ()=>{
        this.setState({editItemVisible:false});
    }
    showConfirm = () => {
        const { confirm } = Modal;
        confirm({
            title: "确定删除该头组？",
            okText: "确定",
            cancelText: "取消",
            // content: "Some descriptions",
            onOk:()=> {
                this.props.deleteBook({id:this.state.activeBookId},(data)=>{
                    // console.log(data);
                    message.success("删除成功！");
                    this.findBook();
                });
            },
            onCancel:()=> {
                console.log("Cancel");
            },
        });
    }

    //modal相关方法
    showModal = () => {
        this.setState({
            addItemVisible: true,
        });
    };
    
    handleOk = e => {
        // console.log(e);
        if(this.state.targetKeys && this.state.targetKeys.length && this.state.newBookName !== "") {
            this.props.createBook({
                name: this.state.newBookName,
                description: "",
                type: "T",
                status: "A",
                "parentId": null,
                acctIds: this.state.targetKeys
            },(data)=>{
            // console.log(data);
                this.setState({
                    addItemVisible: false,
                },()=>{
                    message.success("添加成功！");
                    this.findBook();
                });
            });
        } else {
            message.warning("请检查头组信息！");
        }
    };
    
    handleCancel = e => {
        // console.log(e);
        this.setState({
            addItemVisible: false,
        });
    };
    
    filterOption = (inputValue, option) => option.username.indexOf(inputValue) > -1;

    handleChange = targetKeys => {
        // console.log(targetKeys);
        this.setState({ targetKeys });
    };

    loadMoreContent = () => (
        <div
            style={{
                textAlign: "center",
                paddingTop: 10,
                paddingBottom: 10,
                // border: "1px solid #e8e8e8",
            }}
        >
            <Spin tip="Loading..." />
        </div>
    )

    // changeSearch = (value) => {
    //     console.log(value);
    // }

    setBookName = (e) => {
        this.setState({
            newBookName: e.target.value
        });
        // console.log(e.target.value);
    }

    getSearch = (value) => {
        if (value) {
            const {data} = this.state;
            let newData = [];
            let flag = false;
            data.map((elem) => {
                flag = false;
                for (let k in elem) {
                    let str = elem[k];
                    if(typeof(str) === "number" || str instanceof Array){
                        str = JSON.stringify(str);
                    }
                    // console.log(str,value);
                    if (str && str.toUpperCase().indexOf(value && value.toUpperCase()) != -1) {
                        flag = true;
                        // console.log(elem);
                    }
                }
                if(flag){
                    newData.push(elem);
                }
            });
            this.setState({data: newData});
        }else{
            this.searchOnChange();
        }
    }
    searchOnChange = (val) => {
        if(val.target.value === ""){
            this.findBook();
        }
    }

    onEditChange = (e,key)=>{
        console.log(e,key);
        
    }
    render() {
        // console.log("当前编辑项的ids",this.state.editItem.userIds);
        // console.log("穿梭框的数据源",this.state.userlist);
        const columns = [
            {
                title: "头组名称",
                align: "center",
                width: 200,
                dataIndex: "name",
                key:"name"
            },{
                title: "描述",
                align: "center",
                dataIndex: "description",
                key:"description"
            },{
                title: "账号",
                align: "center",
                width: 200,
                dataIndex: "userIds",
                key: "userIds"
            },{
                title: "修改",
                align: "center",
                width: 80,
                dataIndex:"id",
                key:"id",
                render: (text,record)=> <Button onClick={()=>this.showEdit(text,record)} >修改</Button>,
            }
        ];
        // const cardHeight = document.documentElement.clientHeight - 50 - 57;
        return (
            <div style={{display:"flex",flexDirection:"column",width: "100%"}} className="market_price_box">
                <div className="market_price_title">
                    <div>
                        <span>
                            <label className="title">头组查看</label>
                            <Input.Search
                                onChange={this.searchOnChange}
                                onSearch={this.getSearch}
                                style={{ width: 200 }}
                                className="header_search"
                                size="small"
                            />
                        </span>
                        <span style={{float: "right", fontSize: 20}} >
                            <Icon type="plus-circle" theme="filled" className="add-menu-icon add-icon-hover" style={{ marginRight: "10px",color:"#bfbfbf" }} onClick={this.addItem} />
                            <Icon type="minus-circle" theme="filled" className="delete-menu-icon add-icon-hover" style={{ color:"#bfbfbf" }} onClick={this.handleDeleteItem} />
                        </span>
                    </div>
                </div>
                <Table
                    onRow={record => {
                        return {
                            onClick: event => this.setState({activeBookId: record.id}), // 点击行
                        };
                    }}
                    rowClassName={(record) => {
                        if (record.id === this.state.activeBookId) {
                            return "qit-tr-active-dark newGroups";
                        } else {
                            return "";
                        }
                    }}
                    rowKey={record => record.id}
                    loading={this.state.loading}
                    className={"ant-tr-hover"}
                    columns={columns}
                    dataSource={this.state.data}
                    pagination={false}
                    scroll={{y: document.documentElement.clientHeight - 150}}
                />

                <Modal
                    title="添加项目"
                    visible={this.state.addItemVisible}
                    okText={"确定"}
                    cancelText={"取消"}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    className="whitestyle"
                >   
                    <div style={{display:"flex",justifyContent: "center"}}>
                        <label style={{marginBottom: 20, marginRight: 10,lineHeight:"32px"}}>头组名称</label>
                        <Input style={{marginBottom: 20,width: 200}} onChange={this.setBookName} placeholder="请输入头组名称" />
                    </div>
                    <Transfer
                        className={"bookTransfer"}
                        style={{}}
                        showSelectAll={false}
                        rowKey={record => record.id}
                        dataSource={this.state.userlist}
                        filterOption={this.filterOption}
                        targetKeys={this.state.targetKeys}
                        onChange={this.handleChange}
                        render={item => item.username}
                    />
                </Modal>


                <Modal
                    title="修改项目"
                    visible={this.state.editItemVisible}
                    okText={"确定"}
                    cancelText={"取消"}
                    onCancel={this.handleEditCancel}
                    className="whitestyle"
                    footer={null}
                >   
                    <div style={{display:"flex",justifyContent: "center"}}>
                        <label style={{marginBottom: 20, marginRight: 10,lineHeight:"32px"}}>头组名称</label>
                        <Input style={{marginBottom: 20,width: 200}} onBlur={(e)=>this.onEditChange(e.target.value,"name")} defaultValue={this.state.editItem.name} />
                    </div>
                    <div style={{display:"flex",justifyContent: "center"}}>
                        <label style={{marginBottom: 20, marginRight: 10,lineHeight:"32px"}}>头组描述</label>
                        <Input style={{marginBottom: 20,width: 200}} onBlur={(e)=>this.onEditChange(e.target.value,"description")} defaultValue={this.state.editItem.description} />
                    </div>
                    <div style={{display:"flex",justifyContent: "center"}}>
                        <label style={{marginBottom: 20, marginRight: 10,lineHeight:"32px"}}>选择子账户</label>
                        <Transfer
                            className={"bookTransfer"}
                            style={{}}
                            showSelectAll={false}
                            rowKey={record => record.id}
                            dataSource={this.state.userlist}
                            filterOption={this.filterOption}
                            targetKeys={this.state.editItem.userIds}
                            onChange={this.handleEditChange}
                            render={item => item.username}
                        />
                    </div>
                    
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    
});

const mapDispatchToProps = dispatch => ({
    findBook: (params, cb) => dispatch(findBook(params, cb)),
    createBook: (params, cb) => dispatch(createBook(params, cb)),
    deleteBook: (params, cb) => dispatch(deleteBook(params, cb)),
    getUserList: (params, cb) => dispatch(getUserList(params, cb)),
    checkLogin:(cb) =>dispatch(checkLogin(cb)),
});

export default connect(mapStateToProps,mapDispatchToProps)(HeadGroup);