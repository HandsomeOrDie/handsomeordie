import Routes from "./Routes";
import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import history from "./history";

class App extends Component {
    render() {
        return (
            <BrowserRouter history={history}>
                <div className="container">
                    <Routes type={this.props.type} />
                </div>
            </BrowserRouter>
        );
    }
}

export default App;