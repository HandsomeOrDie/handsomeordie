import { connect } from "react-redux";
import { Layout } from "antd";
import React, {Component} from "react";
class MarketMaker extends Component {
    state = {
    }

    render() {
        const {Content,Header} = Layout;
        return (
            <Layout>
                <Header><HeaderSetting /> </Header>
                <Content />
            </Layout>
        );
    }
}

const mapStateToProps = state => ({
    // allParams: state.setAllParamsReducer
});

const mapDispatchToProps = dispatch => ({
    // getLogin: () => dispatch(getLogin())
});
export default connect(mapStateToProps,mapDispatchToProps)(MarketMaker);