import {connect} from "react-redux";
import React, {Component} from "react";
import { withRouter } from "react-router";

class Header extends Component {
    state = {

    }

    render() {
        return (
            <Header>
                head
            </Header>
        );
    }
}

const mapStateToProps = state => ({
    
});

const mapDispatchToProps = dispatch => ({
    
});
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Header));