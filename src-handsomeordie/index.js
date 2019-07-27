
import React from "react";
import ReactDOM from "react-dom";
import App from "./handsomeOrDie/App";
import * as serviceWorker from "./handsomeOrDie/utils/serviceWorker";
import "antd-mobile/dist/antd-mobile.css";
import "./handsomeOrDie/index.scss";
ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
