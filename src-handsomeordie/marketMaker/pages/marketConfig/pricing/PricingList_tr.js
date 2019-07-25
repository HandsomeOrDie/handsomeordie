import { connect } from "react-redux";
import React, { Component } from "react";
import { Table } from "antd";
import { DragSource, } from "react-dnd";


function dragDirection(
    dragIndex,
    hoverIndex,
    initialClientOffset,
    clientOffset,
    sourceClientOffset,
) {
    const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
    const hoverClientY = clientOffset.y - sourceClientOffset.y;
    if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
        return "downward";
    }
    if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
        return "upward";
    }
}
class BodyRowDom extends React.Component {
    render() {
        // console.log(this.props);
        const {
            isOver,
            connectDragSource,
            connectDropTarget,
            moveRow,
            dragRow,
            clientOffset,
            sourceClientOffset,
            initialClientOffset,
            ...restProps
        } = this.props;
        const style = { ...restProps.style, cursor: "move" };
  
        let className = restProps.className;
        if (isOver && initialClientOffset) {
            const direction = dragDirection(
                dragRow.index,
                restProps.index,
                initialClientOffset,
                clientOffset,
                sourceClientOffset
            );
            if (direction === "downward") {
                className += " drop-over-downward";
            }
            if (direction === "upward") {
                className += " drop-over-upward";
            }
        }
  
        return connectDragSource(
            <tr
                {...restProps}
                className={className}
                style={style}
            />
        );
    }
}
export default BodyRowDom;
