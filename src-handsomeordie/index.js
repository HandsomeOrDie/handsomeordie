
import React from "react";
import ReactDOM from "react-dom";
import App from "./marketMaker/App";
import * as serviceWorker from "./marketMaker/utils/serviceWorker";
import "antd/dist/antd.css";
require("./marketMaker/index.scss");


ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
