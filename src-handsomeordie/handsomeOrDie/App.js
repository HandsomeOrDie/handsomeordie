import store from "../common/store";
import Routes from "../common/routes/Routes";
import history from "./utils/history";
import { Provider } from "react-redux";
import React, { Component } from "react";
import { Router } from "react-router-dom";

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router history={history}>
                    <div className="container">
                        <Routes type={this.props.type} />
                    </div>
                </Router>
            </Provider>
        );
    }
}
export default App;