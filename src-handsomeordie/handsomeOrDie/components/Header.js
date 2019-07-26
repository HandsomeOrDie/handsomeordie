import { Input } from "antd";
import React, { Component } from "react";
import monitor from "../images/monitor.png";

class Header extends Component {
    render() {
        return (
            <div className="header">
                <div className="icon">
                    <img src={monitor} alt="monitor" />
                </div>
            </div>
        );
    }
}

export default Header;
