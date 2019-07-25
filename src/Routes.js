import React, { Component } from "react";
import { Route } from "react-router";
import Home from "./home";
class Routes extends Component {

    render() {
        return (
            <Route exact path="/" component={Home} />
        );
    }
}

export default Routes;
