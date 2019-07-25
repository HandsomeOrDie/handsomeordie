import {connect} from "react-redux";
import React, {Component} from "react";
import {Collapse, Tabs, Row, Col, Card, Icon, message, Table} from "antd";
import {updateGroup, setCurrentGroup, getGroupList, setSelectedCpty} from "../../../actions/creditCounterParty";
import "../../../../common/styles/marketPages/riskMonitor.scss";
import {DropTarget} from "react-dnd";
const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;
class PricingChild extends Component {
    state = {
        clickRowId: undefined,
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
    }

    onClickRow = (record,index) => {
        return {
            onClick: () => {
                this.setState({
                    clickRowId: record.key,
                });
            },
        };
    };

    setRowClassName = (record) => {
        return record.key === this.state.clickRowId ? "qit-tr-active" : "";
    };

    deletePricingChild = () => {
        if (typeof this.state.clickRowId !== "undefined"){
            let currentGroup = this.props.currentGroup;
            let selectedCpty = this.props.selectedCpty;
            // console.log(currentGroup);
            const index = currentGroup.counterParties.findIndex(item => item.key === this.state.clickRowId);
            if (index !== -1){
                selectedCpty.splice(selectedCpty.findIndex(item => item === currentGroup.counterParties[index].code), 1);
                // console.log(selectedCpty);
                this.props.setSelectedCpty([...selectedCpty]);
                currentGroup.counterParties.splice(index, 1);
                this.props.updateGroup(currentGroup, (result) =>{
                    if (result.success){
                        message.success("Success!", 2);
                        currentGroup.counterParties.map((item, index)=>{
                            item.key = index;
                        });
                        this.props.setCurrentGroup({...currentGroup});
                    } else {
                        message.error("Failed!", 2);
                    }
                });
            }

        }

    };

    render() {
        const columns = [
            {
                dataIndex: "code",
                title: "Counter Party",
                align: "center",
                width: "60%",
                // render: (text, record) => (
                //     <div>
                //         {record.name}({record.code})
                //     </div>
                // )
            },
            {
                dataIndex: "credit",
                title: "Credit($)",
                align: "center",
                width: "40%",
            },
        ];
        const { connectDropTarget} = this.props;
        return connectDropTarget(
            <div>
                <Table
                    className="ant-tr-hover"
                    title={()=>(
                        <div style={{display: "flex", justifyContent: "flex-end"}}>
                            <a onClick={this.deletePricingChild} style={{marginRight: 10}}><Icon style={{fontSize: 20}} type="delete"/></a>
                        </div>
                    )}
                    // components={components}
                    bordered={true}
                    scroll={{y: (this.props.cardHeight - 70 - 30) * 2/3 - 40 }}
                    columns={columns}
                    dataSource={this.props.dataSource}
                    onRow={this.onClickRow}
                    rowClassName={this.setRowClassName}
                    // rowClassName={"pricing-child"}
                    loading={this.props.loading}
                    size="small"
                    pagination={false}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    currentGroup: state.creditCptyReducer.currentGroup,
    selectedCpty: state.creditCptyReducer.selectedCpty,
});

const mapDispatchToProps = dispatch => ({
    updateGroup: (params, cb) => dispatch(updateGroup(params, cb)),
    setCurrentGroup: (currentGroup) => dispatch(setCurrentGroup(currentGroup)),
    getGroupList: (params, cb) => dispatch(getGroupList(params, cb)),
    setSelectedCpty: (selectedCpty) => dispatch(setSelectedCpty(selectedCpty)),
});
export default DropTarget("cpty", {
    drop(props, monitor, component){ //组件放下时触发的事件
        props.dragUpdateGroup(monitor.getItem().record);
        //...
    },
}, function (connect, monitor) {
    return{
        connectDropTarget:connect.dropTarget(),
        isOver:monitor.isOver(), //source是否在Target上方
        isOverCurrent: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),//能否被放置
        itemType: monitor.getItemType(),//获取拖拽组件type
    };
})(connect(mapStateToProps,mapDispatchToProps)(PricingChild));