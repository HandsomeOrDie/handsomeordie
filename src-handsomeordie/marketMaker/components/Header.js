import { Input } from "antd";
import React, { Component } from "react";
import monitor from "../images/monitor.png";
import charts from "../images/charts.png";
import setting from "../images/setting.png";
import increment from "../images/increment.png";

import SearchAsset from "./SearchAsset";

class Header extends Component {
    render() {
        return (
            <div className="header">
                <div className="icon">
                    <img src={monitor} alt="monitor" />
                </div>
                <div className="assets-select">
                    <SearchAsset />
                </div>
                <div className="minute">
                    <Input size="small" defaultValue="1s" />
                </div>
                <div className="month">
                    <Input size="small" defaultValue="1week" />
                </div>
                <div className="icon">
                    <img src={charts} alt="charts" />
                </div>
                <div className="icon">
                    <img src={setting} alt="setting" />
                </div>
                <div className="icon">
                    <img src={increment} alt="increment" />
                </div>
                {/* <div className="assets-search">assets-search</div>
        <button className="confirm">确定</button> */}
            </div>
        );
    }
}

export default Header;
