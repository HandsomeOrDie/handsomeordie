import Routes from "./Routes";
import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div className="container">
                    <Routes type={this.props.type} />
                </div>
            </BrowserRouter>
        );
    }
}
export default App;