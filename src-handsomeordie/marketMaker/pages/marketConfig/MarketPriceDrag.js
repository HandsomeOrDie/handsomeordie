import React, { Component } from "react";
import { connect } from "react-redux";
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

class BodyRowDom1 extends React.Component {
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
        // getDragSetting = () => {
        //     this.props.getDrageValue(drageV);
        // }
        // let _this =this;
        return connectDragSource(
            connectDropTarget(
                <tr 
                    {...restProps}
                    className={className}
                    style={style}
                />
            )
        );
    }
}
const mapStateToProps = state => ({
    // marketPriceList: state.marketPrice.marketPriceList
});

const mapDispatchToProps = dispatch => ({
    // setTheme: (theme) => dispatch(setTheme(theme))
    // getMarketPriceConfigList: (cb) => dispatch(getMarketPriceConfigList(cb)),
    // getDrageValue: (record) => dispatch(getDrageValue(record))
});
export default connect(mapStateToProps, mapDispatchToProps)(BodyRowDom1);