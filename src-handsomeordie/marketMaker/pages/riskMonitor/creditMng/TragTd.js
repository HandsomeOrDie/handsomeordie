import {connect} from "react-redux";
import React, {Component} from "react";
import {DragSource} from "react-dnd";

class TragTd extends Component {
    state = {
    }


    render() {
        const { record, connectDragSource } = this.props;
        let tdDom;
        if (this.props.selected === -1){
            tdDom = connectDragSource(
                <td style={{cursor: "move", background: this.props.clickTdId === this.props.selfIndex && "#349999"}} onClick={()=>{this.props.handleClick();}}>{record.code}</td>
            );
        } else {
            tdDom = <td style={{color: "grey"}}>{record.code}</td>;
        }
        return tdDom;
    }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default DragSource("cpty", {
    beginDrag(props,monitor,component){ //拖拽开始时触发的事件，必须，返回props相关对象
        return {
            record: props.record
        };
    },
}, function (connect, monitor) {
    return{
        connectDragSource:connect.dragSource(),
        isDragging:monitor.isDragging()
    };
})(connect(mapStateToProps,mapDispatchToProps)(TragTd));