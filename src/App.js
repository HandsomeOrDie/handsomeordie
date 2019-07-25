import Routes from "./Routes";
import React, { Component } from "react";
import { Router } from "react-router-dom";
import history from "./history";

class App extends Component {
    render() {
        return (
            <Router history={history}>
                <div className="container">
                    <Routes type={this.props.type} />
                </div>
            </Router>
        );
    }
}

export default App;