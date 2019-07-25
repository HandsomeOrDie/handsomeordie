import {connect} from "react-redux";
import React, {Component} from "react";
// import { InfinityTable as Table } from "antd-table-infinity";
import {Input, Button, Icon, Spin,Modal,message,Table, Form,DatePicker, Radio } from "antd";
import { findBook, } from "../../../actions/spdb/configAction";
import {checkLogin} from "../../../actions/marketDetail";
import locale from "antd/lib/date-picker/locale/zh_CN";




class UserManage extends Component {
    state = {
        data: [],
        mockdata:[
            {
                id:1,
                key:1,
                username:"abc",
                roleCode:"角色1",
                name:"名称1",
            },
            {
                id:2,
                key:2,
                username:"abc",
                roleCode:"角色2",
                name:"名称2",
            }
        ],  
        loading:false,
        activeUserId:"",
        addModalVisible:false,

    }
    getUserList = () => {
        this.props.findBook({
            userId: JSON.parse(localStorage.getItem("userInfo")).id,
        },(data)=>{
            this.setState({data:data.data});
        });

    }
    componentDidMount() {
        this.props.checkLogin((data) => {
            if (!data) {
                this.props.history.push("/marketlogin");
                return;
            }
        });
        this.getUserList();

    }

    componentWillReceiveProps(nextProps) {

    }


    handleDeleteItem = () => {
        if(this.state.activeUserId === ""){
            message.warning("请选择要删除的项！");
        } else {
            this.showConfirm();
        }
    }

    showConfirm = () => {
        const { confirm } = Modal;
        confirm({
            title: "确定删除该头组？",
            okText: "确定",
            cancelText: "取消",
            // content: "Some descriptions",
            onOk:()=> {
                this.props.deleteBook({id:this.state.activeUserId},(data)=>{
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


    showAddModal = () => {
        this.setState({
            addModalVisible: true,
        });
    };

    // handleAddOk = e => {
    //     console.log(e);
    //     this.setState({
    //         addModalVisible: false,
    //     });
    // };

    handleAddCancel = e => {
        this.setState({
            addModalVisible: false,
        });
    };

    
    filterOption = (inputValue, option) => option.username.indexOf(inputValue) > -1;



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



    render() {
        const columns = [
            {
                title: "编号",
                align: "center",
                width: 200,
                dataIndex: "id",
                key:"id"
            },{
                title: "用户名",
                align: "center",
                width:200,
                dataIndex: "username",
                key:"username"
            },{
                title: "角色",
                align: "center",
                width: 200,
                dataIndex: "roleCode",
                key: "key"
            },{
                title: "名称",
                align: "center",
                width: 200,
                dataIndex: "name",
                key: "name"
            }
        ];
        // const cardHeight = document.documentElement.clientHeight - 50 - 57;
        return (
            <div style={{display:"flex",flexDirection:"column",width: "100%"}} className="userManage_box">
                <div className="market_price_title">
                    <div>
                        <span>
                            <label className="title">账号管理</label>
                        </span>
                    </div>
                </div>
                <Table
                    onRow={record => {
                        return {
                            onClick: event => this.setState({activeUserId: record.id}), // 点击行
                        };
                    }}
                    rowClassName={(record) => {
                        if (record.id === this.state.activeUserId) {
                            return "qit-tr-active-dark newGroups";
                        } else {
                            return "";
                        }
                    }}
                    rowKey={record => record.id}
                    loading={this.state.loading}
                    className={"ant-tr-hover"}
                    columns={columns}
                    dataSource={this.state.mockdata}
                    pagination={false}
                    scroll={{y: document.documentElement.clientHeight - 150}}
                />

                <div className="pagination">
                    分页
                    <Button type="primary" icon="plus-circle" onClick={this.showAddModal}>添加</Button>
                    <Button type="primary" icon="minus-circle" onClick={this.handleDeleteItem}>删除</Button>
                    <p> 被选中的是 {this.state.activeUserId}</p>
                </div>

                <Modal
                    title="添加用户"
                    visible={this.state.addModalVisible}
                    // onOk={this.handleAddOk}
                    onCancel={this.handleAddCancel}
                    footer={null}
                    className="whitestyle"
                >
                    <RegFormWrap hideModal={this.handleAddCancel} />
                </Modal>
            </div>
        );
    }
}


class RegForm extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log("Received values of form: ", values);
            }
        });
    };

    handleConfirmBlur = e => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue("password")) {
            callback("两次密码输入不一致");
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
            form.validateFields(["confirm"], { force: true });
        }
        callback();
    };



    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 10,
                },
            },
        };


        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Form.Item label={<span>用户名</span>}>
                    {getFieldDecorator("username", {
                        rules: [{ required: true, message: "请输入用户名", whitespace: true }],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="密码" hasFeedback>
                    {getFieldDecorator("password", {
                        rules: [
                            {
                                required: true,
                                message: "请输入密码",
                            },
                            {
                                validator: this.validateToNextPassword,
                            },
                        ],
                    })(<Input.Password />)}
                </Form.Item>
                <Form.Item label="确认密码" hasFeedback>
                    {getFieldDecorator("confirm", {
                        rules: [
                            {
                                required: true,
                                message: "请确认密码",
                            },
                            {
                                validator: this.compareToFirstPassword,
                            },
                        ],
                        validateTrigger:"onBlur"
                    })(<Input.Password onBlur={this.handleConfirmBlur} />)}
                </Form.Item>


                <Form.Item label={<span>名称</span>} >
                    {getFieldDecorator("name", {
                        rules: [{ required: true, message: "请输入名称", whitespace: true }],
                    })(<Input />)}
                </Form.Item>

                <Form.Item label="性别">
                    {getFieldDecorator("gender",{rules: [{ required: true, message: "请选择性别",}],})(
                        <Radio.Group>
                            <Radio value="man">男</Radio>
                            <Radio value="woman">女</Radio>
                        </Radio.Group>,
                    )}
                </Form.Item>

                <Form.Item label="出生日期">
                    {getFieldDecorator("date-picker", { rules: [{ type: "object", required: true, message: "请选择出生日期" }]})(<DatePicker locale={locale}/>)}
                </Form.Item>


                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        保存
                    </Button>
                    {/* <Button type="" onClick={this.props.hideModal} style={{marginLeft:20}}>取消</Button> */}

                </Form.Item>
            </Form>
        );
    }
}

const RegFormWrap = Form.create({ name: "register" })(RegForm);

const mapStateToProps = state => ({
    
});

const mapDispatchToProps = dispatch => ({
    findBook: (params, cb) => dispatch(findBook(params, cb)),
    checkLogin:(cb) =>dispatch(checkLogin(cb)),
});

export default connect(mapStateToProps,mapDispatchToProps)(UserManage);