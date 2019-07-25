import React from "react";
import { connect } from "react-redux";
class HomePage extends React.Component{
    state = {
        tradeType: "ODM",
    }

    render() {
        return (
            <div>
                <h1 style={{textAlign: "center",marginTop: 200}}>Hello Frank!</h1>
            </div>
        );
    }
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
    
});
export default connect(mapStateToProps,mapDispatchToProps)(HomePage);
