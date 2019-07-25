import { connect } from "react-redux";
import { Switch } from "antd";
import React, { Component } from "react";
import { setTheme } from "../actions/setTheme";
require("../../common/styles/tools/darkTheme.scss");

class Themes extends Component {
    state = {
        theme: true
    }

    componentDidMount() {
        this.setTheme(false);
    }
    setTheme = (val) => {
        this
            .props
            .setTheme(val);
        if (val) {
            window
                .less
                .modifyVars({
                    "@disabled-color": "rgba(0, 0, 0, 0.25)",
                    "@layout-trigger-color": "#000",
                    "@layout-sider-background": "#fff",
                    "@layout-trigger-background": "#fff",
                    // "@layout-header-background": "#141416",
                })
                .then(() => {
                    // console.log(2);
                })
                .catch(error => {
                    console.log(error);
                    // message.error("Failed to update theme");
                });

        } else {
            window
                .less
                .modifyVars({
                    "@disabled-color": "#3B3F42",
                    "@layout-body-background": "#2B2B2B",
                    // "@layout-header-background": "blue",
                    "@layout-sider-background": "#2B2B2B",
                    "@layout-trigger-background": "#141416",
                    "@text-color": "#fff",
                    // "@table-header-bg": "#3B3F42",
                    "@table-header-color": "#fff",
                    "@border-radius-base": "0px",
                    // "@item-hover-bg": "#2B2B2B",
                    // "@border-color-base": "red",// input边框
                    "@border-color-split": "#25262A",// table边框
                    "@time-picker-selected-bg": "#2B2B2B",
                    "@btn-primary-bg": "#fff",
                    "@extra-bg": "#141416",
                    "@extra-bg-opacity": "rgba(0,0,0,0.65)",
                    "@extra-mask-color": "#fff",
                    "@table-expanded-row-bg": "#2B2B2B",
                    // "@modal-radio-dark":"#2B2B2B",
                    "@modal-inputnumber-dark":"#141616"
                    // "@checkbox-check-color": "red",
                    // "@card-head-background": "#2B2B2B",
                    // "@list-empty-text-padding": "#fff",

                    // "@component-background": "#141416",
                    // "@body-background": "#141416",

                    // "@layout-trigger-color" : "#141416",

                    // "@table-header-color": "#fff",
                    // "@table-header-bg": "2B2B2B",
                })
                .then(() => {
                    // console.log(2);
                })
                .catch(error => {
                    console.log(error);
                    // message.error("Failed to update theme");
                });
        }
    }

    // componentWillReceiveProps(nextProps) {
    //     nextProps.themeReducer !== this.props.themeReducer && this.setState({ theme: nextProps.themeReducer.theme }, () => {
    //         // console.log(this.state.theme);
    //         if (this.state.theme) {
    //             require("../../common/styles/tools/lightTheme.scss");
    //         } else {
    //             require("../../common/styles/tools/darkTheme.scss");
    //         }
    //     });
    // }

    render() {
        return (<Switch
            style={{ marginLeft: 10,display:"none" }}
            onChange={this.setTheme}
            checkedChildren="LIGHT"
            unCheckedChildren="DARK"
            defaultChecked={false} />);
    }
}

const mapStateToProps = state => ({ themeReducer: state.themeReducer });

const mapDispatchToProps = dispatch => ({
    setTheme: (theme) => dispatch(setTheme(theme))
});

export default connect(mapStateToProps, mapDispatchToProps)(Themes);