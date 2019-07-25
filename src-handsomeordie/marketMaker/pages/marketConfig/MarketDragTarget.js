import React from "react";
import { Card, Tree, Icon } from "antd";
import { DropTarget } from "react-dnd";
import PropTypes from "prop-types";
const TreeNode = Tree.TreeNode;
class DragT extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedKey: "",
            treeContent: [],
        };
    }
    onDragEnter = (info) => {
        console.log(info);
    }
    // 遍历数组,找出key值与之相同的对象(节点)，执行callback函数
    // 若key值不匹配且含有children，则循环遍历
    // 否则不执行任何操作
    // loop = (data, key, callback) => {
    //     data.forEach((item, index, arr) => {
    //         if (item.key === key) {
    //             return callback(item, index, arr)
    //         }
    //         if (item.children) {
    //             return this.loop(item.children, key, callback)
    //         }
    //     })
    // }
    onDrop = (info) => {
        console.log(info);
  
    }

    render() {
        const { treeContent } = this.state;
        // const treeNodes = this.getTreeNode(treeContent);
        const { connectDropTarget } = this.props;
        return connectDropTarget(
            <div>

                <div>Cross Configurations</div>
                <div>
                    <div onMouseOver={this.getmy}>
                        <span>CCY1</span> <span></span>
                        <span>CCY2</span><span></span>
                    </div>
                </div>


            </div>
        );
    }
}
const spec = {
    // monitor.getItem()可获取之前dragsource在beginDrag中return的Object
    //component可直接调用组件内部方法
    drop(props, monitor, component) {
        component.addItem(monitor.getItem());
    }
};
function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
    };
}
export default DropTarget("hahaha", spec, collect)(DragT);
