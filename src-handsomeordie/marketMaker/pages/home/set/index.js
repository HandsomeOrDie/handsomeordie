import React from "react";
import { Icon, Tabs } from "antd";
// import "./index.scss";
import "./../../../../common/styles/home/SET/set.scss";
import MarketPrice from "./MarketPrice";
import Pricing from "./Pricing";
import MarketConfig from "./../../marketMarking/tabPage";
// const DeepQuo = React.lazy(() => import("./DeepQuo"));

export default class QUO extends React.Component {

    render() {
        const { TabPane } = Tabs;
        const tabBarStyle = {
            width: 150
        };
        return (
            <div className={"set"}>
                <MarketConfig/>
            </div>
        );
    }
}
