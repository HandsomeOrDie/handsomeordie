import React from "react";
import { DragSource } from "react-dnd";

const boxSource = {
    beginDrag(props) {
        return {
            name: props.name
        };
    }
};

class Test extends React.Component {
    render() {
        const { connectDragSource } = this.props ;
        return connectDragSource(
            <div style={{ wordWrap: "break-word", wordBreak: "break-all" }} className='fruit'>
                {this.props.name.symbol}
            </div>
        );
    }
}

export default DragSource("field", boxSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))(Test);
