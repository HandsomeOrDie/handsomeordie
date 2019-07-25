import React, { Component } from "react";
import { message } from "antd";
let errorCount = 0;
class ErrorCatch extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: undefined };
    }

    // static getDerivedStateFromError(error) {
    //     // Update state so the next render will show the fallback UI.
    //     return { hasError: true, error };
    // }

    componentDidCatch(error, info) {
        // You can also log the error to an error reporting service
        // logErrorToMyService(error, info);
        // message.error(error);
        console.log(error, info);
        errorCount = 0;
        this.setState({ hasError: true, error });
    }

    render() {
        // console.log(this.state.hasError);
        if (this.state.hasError && errorCount === 0) {
            // You can render any custom fallback UI
            message.error("Internal program error：" + this.state.error, 3);
            errorCount = 1;
            // return <h1>Something went wrong.</h1>;
        }

        return this.props.children;
    }
}
export default ErrorCatch;