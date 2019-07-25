import {connect} from "react-redux";
import React, {Component} from "react";
import {Collapse, Tabs, message, Col, Card, Icon, Form, Table, Select, Input} from "antd";
import {getGroupList, addGroup, saveGroup, updateGroup, deleteGroup, setCurrentGroup, setSelectedCpty} from "../../../actions/creditCounterParty";
import "../../../../common/styles/marketPages/riskMonitor.scss";
import PricingChild from "./PricingChild";
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} id="pricing-group-click"/>
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
    state = {
        editing: this.props.record.editing,
        values: {},
    };

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                this.input && this.input.focus();
            }
        });
    };

    save = (dataIndex, value) => {
        const { record, handleSave } = this.props;
        let values = this.state.values;
        if (dataIndex){
            values[dataIndex] = value;
        }
        this.toggleEdit();
        handleSave({ ...record, ...values });
    };

    saveInput = (dataIndex, value) => {
        if (!value || value === ""){
            return;
        }
        const { record, handleSave } = this.props;
        let values = this.state.values;
        if (dataIndex){
            values[dataIndex] = value;
        }
        this.toggleEdit();
        handleSave({ ...record, ...values });
    };

    render() {
        const { editing } = this.state;
        const Option = Select.Option;
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            type,
            options,
            selectWidth,
            ...restProps
        } = this.props;
        // console.log("this.state.values::", this.state.values);
        return (
            <td ref={node => (this.cell = node)} {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>
                        {(form) => {
                            this.form = form;
                            if (editing){
                                if (type === "select"){
                                    return (<FormItem help="" style={{ margin: 0 }}>
                                        <Select
                                            className="qit-select-bg"
                                            // placeholder="请选择"
                                            size="small"
                                            defaultValue={record[dataIndex]}
                                            dropdownStyle={{marginLeft: 0}}
                                            autoFocus={!record.editing} //新增一条时不能自动获取焦点，因为有很多select，不能同时获取焦点
                                            defaultOpen={!record.editing} //新增一条时不能默认展开，因为有很多select，同时展开影响布局
                                            onSelect={(value)=>{this.save(dataIndex, value);}}
                                            onBlur={()=>{
                                                //失去焦点时不显示select，如果是select是未选择，失去焦点也要显示select
                                                record[dataIndex] && this.toggleEdit();
                                            }}
                                            style={{width: selectWidth || 90}}
                                        >
                                            {
                                                options.map(item => (<Option key={item.value} value={item.value}>{item.text}</Option>))
                                            }
                                        </Select>
                                    </FormItem>);
                                }else if (type === "input"){
                                    return (<FormItem help="" style={{ margin: 0, display: "flex", justifyContent: "center" }}>
                                        <Input
                                            ref={node => (this.input = node)}
                                            size="small"
                                            style={{ width: "200px"}}
                                            defaultValue={record[dataIndex]}
                                            onPressEnter={(e)=>{this.saveInput(dataIndex, e.target.value);}}
                                            onBlur={(e)=>{this.saveInput(dataIndex, e.target.value);}}
                                        />
                                    </FormItem>);
                                }
                            } else {
                                return (
                                    <div
                                        className="editable-cell-value-wrap"
                                        // style={{ paddingRight: 24 }}
                                        onClick={this.toggleEdit}
                                    >
                                        {restProps.children}
                                    </div>
                                );
                            }
                        }}
                    </EditableContext.Consumer>
                ) : restProps.children}
            </td>
        );
    }
}

class PricingGroups extends Component {
    state = {
        clickRowId: undefined,
    };

    componentDidMount() {
        const _this = this;
        this.props.getGroupList({}, function (currentGroup) {
            if (currentGroup){
                _this.props.setCurrentGroup(currentGroup);
                _this.setState({clickRowId: currentGroup.key});
            }
        });
    }

    componentWillReceiveProps(nextProps) {
    }

    handleSave = (row) => {
        const groupList = this.props.groupList;
        const index = groupList.findIndex(item => row.key === item.key);
        const params = {...groupList[index], ...row};

        const _this = this;
        if (row.code === groupList[index].code){
            return;
        }
        if (params.id){
            this.props.updateGroup(params, function (result) {
                if (result.success){
                    _this.props.getGroupList({});
                    message.success("Success!", 2);
                } else {
                    message.error("Failed!", 2);
                }
            });
        } else {
            this.props.saveGroup(params, function (result) {
                if (result.success){
                    message.success("Success!", 2);
                    _this.props.getGroupList({});
                } else {
                    message.error("Failed!", 2);
                }
            });
        }
    };

    deleteCptyGroup = () => {
        if (!this.state.clickRowId && this.state.clickRowId !== 0){
            return;
        }
        const params = this.props.groupList[this.props.groupList.findIndex(item => item.key === this.state.clickRowId)];
        // console.log(params);
        const _this = this;
        this.props.deleteGroup(params, function (result) {
            if (result.success){
                message.success("Success!", 2);
                _this.props.getGroupList({});
            } else {
                message.error("Failed!", 2);
            }
        });
    };

    onClickRow = (record,index) => {
        return {
            onClick: () => {
                this.setState({
                    clickRowId: record.key,
                });
                const currentGroup = this.props.groupList[this.props.groupList.findIndex(item => item.key === record.key)];
                this.props.setCurrentGroup(currentGroup);
            },
            index,
        };
    };

    setRowClassName = (record) => {
        return record.key === this.state.clickRowId ? "qit-tr-active" : "";
    };

    dragUpdateGroup = (dragCpty) => {
        let currentGroup = this.props.currentGroup;
        let selectedCpty = this.props.selectedCpty;
        dragCpty.key = currentGroup.counterParties.length;
        currentGroup.counterParties.push(dragCpty);
        const _this = this;
        this.props.updateGroup(currentGroup, function (result) {
            if (result.success){
                _this.props.setCurrentGroup(currentGroup);
                selectedCpty.push(dragCpty.code);
                // _this.setState({clickRowId: undefined});
                console.log("selected：", selectedCpty);
                _this.props.setSelectedCpty([...selectedCpty]);
                message.success("Success!", 2);
            }else {
                message.error("Failed!", 2);
            }
        });
    };

    render() {
        const columns = [
            {
                title: "Name",
                dataIndex: "name",
                align: "center",
                editable: true,
                onCell: record => ({
                    record,
                    editable: true,
                    title: "Name",
                    dataIndex: "name",
                    type: "input",
                    handleSave: this.handleSave,
                }),
            },
        ];
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        // const cardHeight = document.documentElement.clientHeight - 50 - 52 - 58;
        const counterParties = this.props.currentGroup.counterParties || [];
        return (
            <Card id="credit-style" title={<div style={{display: "flex", alignItems: "center"}}>
                <div style={{color: "#3f918e"}}>
                    Counter Party Groups
                </div>
                <div style={{display: "flex", justifyContent: "flex-end", flex: 1, alignItems: "center"}}>
                    <a onClick={()=>{this.props.getGroupList({});}} style={{marginRight: 10}}><Icon type="sync" style={{fontSize: 20}}/></a>
                    <a onClick={()=>{this.props.addGroup(this.props.groupList);}} style={{marginRight: 10}}><Icon type="plus-circle" style={{fontSize: 20}}/></a>
                    <a onClick={()=>{this.deleteCptyGroup();}}><Icon type="minus-circle" style={{fontSize: 20}}/></a>
                </div>
            </div>} style={{flex: 1}} bodyStyle={{display: "flex", flexDirection: "column", height: "100%"}}>
                <div style={{flex: 1}}>
                    <Table
                        // rowKey={(record,key)=>key}
                        className="ant-tr-hover"
                        components={components}
                        bordered={true}
                        scroll={{y: (this.props.cardHeight - 70 - 30) * 0.33 }}
                        columns={columns}
                        dataSource={this.props.groupList}
                        onRow={this.onClickRow}
                        rowClassName={this.setRowClassName}
                        loading={this.props.groupLoading}
                        size="small"
                        pagination={false}
                    />
                </div>
                <div style={{flex: 2, marginTop: 5}}>
                    <PricingChild dragUpdateGroup={this.dragUpdateGroup} cardHeight={this.props.cardHeight} dataSource={[...counterParties]}/>
                </div>
            </Card>
        );
    }
}

const mapStateToProps = state => ({
    groupList: state.creditCptyReducer.groupList,
    groupLoading: state.creditCptyReducer.groupLoading,
    currentGroup: state.creditCptyReducer.currentGroup,
    selectedCpty: state.creditCptyReducer.selectedCpty,
});

const mapDispatchToProps = dispatch => ({
    getGroupList: (params, cb) => dispatch(getGroupList(params, cb)),
    addGroup: (list) => dispatch(addGroup(list)),
    saveGroup: (params, cb) => dispatch(saveGroup(params, cb)),
    updateGroup: (params, cb) => dispatch(updateGroup(params, cb)),
    deleteGroup: (params, cb) => dispatch(deleteGroup(params, cb)),
    setCurrentGroup: (currentGroup) => dispatch(setCurrentGroup(currentGroup)),
    setSelectedCpty: (selectedCpty) => dispatch(setSelectedCpty(selectedCpty)),
});
export default connect(mapStateToProps,mapDispatchToProps)(PricingGroups);