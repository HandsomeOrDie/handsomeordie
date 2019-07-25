import Routes from "./Routes";
import React, { Component } from "react";
import { HashRouter } from "react-router-dom";
import history from "./history";

class App extends Component {
    render() {
        return (
            <HashRouter history={history}>
                <div className="container">
                    <Routes type={this.props.type} />
                </div>
            </HashRouter>
        );
    }
}
export default App;