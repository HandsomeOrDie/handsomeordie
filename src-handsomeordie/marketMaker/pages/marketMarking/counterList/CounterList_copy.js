import { connect } from "react-redux";
import React from "react";
import { DropTarget } from "react-dnd";
import {  Input, Select, Button , Table, Icon} from "antd";

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
            list: []
        };
    }
    
    reduceRow_list = (record) => {
        this.props.reduceRow_list(record);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({list: nextProps.list});
    }
    deleteTr = () => {
        this.props.deleteTr(()=>{
            this.setState({});
        });
    }
    render() {
        const columns = [{
            title: "counter party",
            dataIndex: "name",
        }, {
            title: "credit(CNY,million)",
            dataIndex: "credit",
        }, ];
        const { connectDropTarget } = this.props;
        return connectDropTarget(
            <div>
                <div className="tabTitle">
                    <span className="pricingtitle">Pricing List</span>
                    <div style={{float: "right",marginTop: "20px"}}>
                        <Icon type="minus-circle" theme="filled"  onClick={this.deleteTr}/>
                    </div>
                </div>
                <Table
                    className="pricingList"
                    columns={columns}
                    rowKey={record => record.name}
                    bordered
                    dataSource={this.state.list}
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
                        let code = record.code || record.name;
                        if (code === this.props.deleteCode || code === this.props.deleteName) {
                            return "qit-tr-active-dark newGroups";
                        } else {
                            return "newGroups";
                        }
                    }}
                    pagination={false} />
                <div style={{ marginTop: "20px", textAlign: "right" }}>
                    <Button style={{ marginRight: "20px" }} onClick={this.props.cancel}>CANCEL</Button>
                    <Button onClick={this.props.save}>SAVE</Button>
                </div>
            </div>
        );
    }
}


export default DropTarget("counterTr", dustbinTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
}))(Target);