import { connect } from "react-redux";
import React, { Component } from "react";
import { Row, Col, Icon, message, Select, Input, Skeleton, Table, Form } from "antd";

class AddDistributionContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentItem: {}
        };
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {

    }

    render() {
        const Option = Select.Option;
        const {
            getFieldDecorator
        } = this.props.form;

        return (
            <div className="add-distribution-content-wrapper">
                <Row>
                    <Col span={24}>
                        <div className="basic-info-wrapper">
                            <Form>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className="info-label">Transaction Mode</div>
                                            </td>
                                            <td>
                                                <div className="info-value-wrapper">
                                                    <Form.Item>
                                                        {getFieldDecorator("tradingType",
                                                            { rules: [{ require: true }], initialValue: "ESP" })(
                                                            <Select size="small" className="transaction-mode-select">
                                                                <Option value="ESP">CEFTS ESP</Option>
                                                                <Option value="ODM">CEFTS ODM</Option>
                                                            </Select>)}
                                                    </Form.Item>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="info-label">Display Name</div>
                                            </td>
                                            <td>
                                                <div className="info-value-wrapper">
                                                    <Form.Item>
                                                        {getFieldDecorator("displayName")(
                                                            <Input className="display-name-input" />)}
                                                    </Form.Item>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="info-label">+Spread</div>
                                            </td>
                                            <td>
                                                <div className="spread-skew-value-wrapper">
                                                    <div className="info-value-wrapper">
                                                        <Form.Item>
                                                            {getFieldDecorator("spread")(
                                                                <Input className="spread-input" />)}
                                                        </Form.Item>
                                                    </div>
                                                    <div className="skew-wrapper">
                                                        <div className="info-label">+Skew</div>
                                                        <div className="info-value-wrapper">
                                                            <Form.Item>
                                                                {getFieldDecorator("skew")(
                                                                    <Input className="skew-input" />)}
                                                            </Form.Item>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="info-label">No Liquidity</div>
                                            </td>
                                            <td>
                                                <div className="info-value-wrapper">
                                                    <Form.Item>
                                                        {getFieldDecorator("noLiquidity",
                                                            { initialValue: "HALT" })(
                                                            <Select size="small" className="no-liquidity-select">
                                                                <Option value="HALT">HALT</Option>
                                                                <Option value="STOP">STOP</Option>
                                                            </Select>)}
                                                    </Form.Item>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="info-label">Freq</div>

                                            </td>
                                            <td>
                                                <div className="info-value-wrapper">
                                                    <Form.Item>
                                                        {getFieldDecorator("freq")(
                                                            <Input className="freq-input" />)}
                                                    </Form.Item>
                                                    <label>s</label>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="info-label">Threshold</div>
                                            </td>
                                            <td>
                                                <div className="threshold-info-wrapper">
                                                    <div className="spread-wrapper">
                                                        <label>spread</label>
                                                        <Form.Item>
                                                            {getFieldDecorator("thresholdSpread")(
                                                                <Input className="threshold-spread-input" />)}
                                                        </Form.Item>
                                                        <label>bps</label>
                                                    </div>
                                                    <div className="move-wrapper">
                                                        <label>move</label>
                                                        <Form.Item>
                                                            {getFieldDecorator("thresholdMove")(
                                                                <Input className="threshold-move-input" />)}
                                                        </Form.Item>
                                                        <label>bps</label>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Form>
                        </div>
                    </Col>
                    {/* <Col span={12}>
                        <div className="counter-party-setting-wrapper">
                            <div className="counter-setting-title">
                                Counter Party Setting
                            </div>
                            <div className="sub-counter-title-wrapper">
                                <div className="sub-counter-title">Counter Party Groups</div>
                            </div>
                            <div className="counter-group-table-wrapper">
                                <Table />
                            </div>
                            <div className="sub-counter-title-wrapper">
                                <div className="sub-counter-title">Counter Party List</div>
                            </div>
                        </div>
                    </Col> */}
                </Row>
            </div>

        );
    }
}


const WrappedAddDistributionContent = Form.create()(AddDistributionContent);

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
    // getCorePriceById: (id) => dispatch(getCorePriceById(id)),
    // changeSourceInitStatus: (sourceItemId, targetStatus) => dispatch(changeSourceInitStatus(sourceItemId, targetStatus))
});
export default connect(mapStateToProps, mapDispatchToProps, null)(WrappedAddDistributionContent);