import React from "react";
import { DropTarget } from "react-dnd";
import { Radio, Row, Col } from "antd";
const dustbinTarget = {
    drop(props, monitor) {
        props.onDrop(monitor.getItem().name);
    }
};

class Target extends React.Component {
    constructor(props) {
        super(props);

        // this.onClick = this.onClick.bind(this);
    }
    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.content!==this.props.content) {

    //     }
    // }
    // onClick(evt) {
    //     this.props.onCancel(evt.target.previousSibling.innerHTML, "doge");
    // }
    render() {
        const { connectDropTarget, content } = this.props;
        // console.log(this.props.isOver);
        // console.log(this.props);
        return connectDropTarget(
            <div>
                <Row>
                    <Col>
                        <span>CCY1</span> <span>{content && content[0] ? content[0].fullName : null}</span>
                    </Col>
                    <Col>
                        <span>CCY2</span><span>{content && content[1] ? content[1].fullName : null}</span>
                    </Col>
                    {/* <Col>
                            <Radio onClick={this.invertCCY}>Invert</Radio>
                        </Col> */}
                </Row>
            </div>

        );
    }
}

export default DropTarget("field", dustbinTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
}))(Target);