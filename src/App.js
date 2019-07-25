import Routes from "./Routes";
import React, { Component } from "react";
import { HashRouter } from "react-router-dom";
import { createHashHistory } from "history";

class App extends Component {
    render() {
        return (
            <HashRouter history={createHashHistory()}>
                <div className="container">
                    <Routes type={this.props.type} />
                </div>
            </HashRouter>
        );
    }
}
export default App;