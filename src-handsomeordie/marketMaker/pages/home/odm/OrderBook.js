import React from "react";
import { Select, InputNumber, Checkbox, Button, Icon } from "antd";
const Option = Select.Option;
// import "./OrderBook.scss";
import "./../../../../common/styles/home/ODM/orderBook.scss";
export default class OrderBook extends React.Component {

    render() {
        return (
            <div className={"book"}>
                <div className={"title"}>
                    <div className={"name"}>当前报价-19国开05</div>
                    <div className={"upload"}>
                        <span>上传策略</span>
                        <Icon className={"upload-icon"} type="upload" />
                        <Icon className={"delete-icon"} type="delete" />
                    </div>
                </div>
                <div className={"content"}>
                    <div className={"strategy-col"}>
                        <div>当前策略</div>
                        <div className={"strategy-select"}>
                            <Select defaultValue={"手动"}>
                                <Option value={"手动"}>手动</Option>
                            </Select>
                        </div>
                    </div>
                    <div className={"adjust-col"}>
                        <div className={"left-adjust"}>
                            <div>︿</div>
                            <div>﹀</div>
                        </div>
                        <div className={"left-bid"}>
                            <div className={"bid"}>bid%</div>
                            <div className={"value"}>
                                <span>3.</span>
                                <span>7350</span>
                            </div>
                        </div>
                        <div className={"mid"}>
                            <div className={"mid-left-adjust"}>〈</div>
                            <div className={"mid-adjust"}>
                                <div className={"top"}>︿</div>
                                <div className={"bottom"}>﹀</div>
                            </div>
                            <div className={"mid-right-adjust"}>〉</div>
                        </div>
                        <div className={"right-ask"}>
                            <div className={"ask"}>ask%</div>
                            <div className={"value"}>
                                <span>3.</span>
                                <span>7351</span>
                            </div>
                        </div>
                        <div className={"right-adjust"}>
                            <div>︿</div>
                            <div>﹀</div>
                        </div>
                    </div>
                    <div className={"fixed-col"}>
                        <div className={"spread-wrapper"}>
                            <div>Spread</div>
                            <div className={"spread-input"}>
                                <InputNumber/>
                            </div>
                        </div>
                        <div className={"fixed-wrapper"}>
                            <div>
                                <Checkbox/>
                            </div>
                            <div className={"fixed-label"}>
                                fixed
                            </div>
                        </div>
                        <div className={"skew-wrapper"}>
                            <div>Skew</div>
                            <div className={"skew-input"}>
                                <InputNumber type={"number"}/>
                            </div>
                        </div>
                    </div>
                    <div className={"layer-col"}>
                        <Button>层数</Button>
                    </div>
                    <div className={"manual-name-col"}>
                        <div>报买量(万)</div>
                        <div>报买价</div>
                        <div><Button>批量调节</Button></div>
                        <div>报卖价</div>
                        <div>报卖量(万)</div>
                    </div>
                    <div className={"manual-col"}>
                        {
                            (()=>{
                                let returnDom = [];
                                let bidQty = [];
                                let bidPrice = [];
                                let askPrice = [];
                                let askQty = [];
                                let bidAdjust = [];
                                let askAdjust = [];
                                for (let i=0;i<10;i++){
                                    bidQty.push(<div key={i}><InputNumber/></div>);
                                    bidPrice.push(<div key={i}><InputNumber/></div>);
                                    askPrice.push(<div key={i}><InputNumber/></div>);
                                    askQty.push(<div key={i}><InputNumber/></div>);
                                    bidAdjust.push(<div key={i}><InputNumber/></div>);
                                    askAdjust.push(<div key={i}><InputNumber/></div>);
                                }
                                bidAdjust.splice(0, 1, <div key={"blank-div1"} className={"blank-div"}/>);
                                askAdjust.splice(0, 1, <div key={"blank-div2"} className={"blank-div"}/>);
                                returnDom.push(<div key={"bid-qty"} className={"bid-qty"}>{bidQty}</div>);
                                returnDom.push(<div key={"bid-price"} className={"bid-price"}>{bidPrice}</div>);
                                returnDom.push(<div key={"bid-adjust"} className={"bid-adjust"}>{bidAdjust}</div>);
                                returnDom.push(<div key={"ask-adjust"} className={"ask-adjust"}>{askAdjust}</div>);
                                returnDom.push(<div key={"ask-price"} className={"ask-price"}>{askPrice}</div>);
                                returnDom.push(<div key={"ask-qty"} className={"ask-qty"}>{askQty}</div>);
                                {/* console.log(returnDom); */}
                                return returnDom;
                            })()
                        }
                        {/*<div className={"bid-qty"}>*/}
                        {/*    <div><InputNumber/></div>*/}
                        {/*    <div><InputNumber/></div>*/}
                        {/*    <div><InputNumber/></div>*/}
                        {/*    <div><InputNumber/></div>*/}
                        {/*    <div><InputNumber/></div>*/}
                        {/*    <div><InputNumber/></div>*/}
                        {/*</div>*/}
                        {/*<div className={"bid-price"}>*/}
                        {/*    <div><InputNumber/></div>*/}
                        {/*    <div><InputNumber/></div>*/}
                        {/*    <div><InputNumber/></div>*/}
                        {/*    <div><InputNumber/></div>*/}
                        {/*    <div><InputNumber/></div>*/}
                        {/*    <div><InputNumber/></div>*/}
                        {/*</div>*/}
                        {/*<div className={"ask-price"}>*/}
                        {/*    <div><InputNumber/></div>*/}
                        {/*    <div><InputNumber/></div>*/}
                        {/*    <div><InputNumber/></div>*/}
                        {/*    <div><InputNumber/></div>*/}
                        {/*    <div><InputNumber/></div>*/}
                        {/*    <div><InputNumber/></div>*/}
                        {/*</div>*/}
                        {/*<div className={"ask-qty"}>*/}
                        {/*    <div><InputNumber/></div>*/}
                        {/*    <div><InputNumber/></div>*/}
                        {/*    <div><InputNumber/></div>*/}
                        {/*    <div><InputNumber/></div>*/}
                        {/*    <div><InputNumber/></div>*/}
                        {/*    <div><InputNumber/></div>*/}
                        {/*</div>*/}
                    </div>
                    <div className={"btn-col"}>
                        <Button className={"apply"}>应用</Button>
                        <Button className={"start"}>启动</Button>
                    </div>
                </div>
            </div>
        );
    }

}
