import {connect} from "react-redux";
import React, {Component} from "react";
import {Menu, Card, Icon, Collapse} from "antd";
import Risk from "./risk";
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const Panel = Collapse.Panel;

class MarketConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedKey: 1,
        };
    }

    componentDidMount() {
    }

    onCollapseChange = () => {
    };

    componentWillUnmount() {
    }

    componentWillReceiveProps(nextProps) {
    }

    handleClick = ( key ) => {
        this.setState({selectedKey: key});
    };

    getContent = () => {
        let content = "";
        switch (this.state.selectedKey) {
        case 1:
            content = "111";
            break;
        case 2:
            content = "222";
            break;
        case 3:
            content = "333";
            break;
        case 6:
            content = <Risk/>;
            break;
        default:
            content = "xxx";
        }
        return content;
    };

    getClassName = (key) => {
        if (this.state.selectedKey === key) {
            return "tow-rank menu-active";
        } else {
            return "tow-rank";
        }
    };

    render() {
        return (
            <div style={{display: "flex", flexDirection: "column", flex: 1, background: "#D7D7D7"}}>
                <div style={{height: 40, background: "#313131", alignItems: "center", fontSize:  19,width:"100%"}}>
                    <div style={{marginLeft: 20}}>Configurations</div>
                </div>
                <div style={{flex: "1", display: "flex",overflow:"auto"}}>
                    <div style={{width: 250, background: "#F2F2F2"}}>
                        <div className="one-rank">Pricing</div>
                        <div className={this.getClassName(1)} onClick={()=>{this.handleClick(1);}}>
                            <div className="left-bar" style={{display: this.state.selectedKey === 1 ? "block" : "none"}}/>
                            <div className="menu-name">Symbol List</div>
                        </div>
                        <div className={this.getClassName(2)} onClick={()=>{this.handleClick(2);}}>
                            <div className="left-bar" style={{display: this.state.selectedKey === 2 ? "block" : "none"}}/>
                            <div className="menu-name">Reference Price</div>
                        </div>
                        <div className={this.getClassName(3)} onClick={()=>{this.handleClick(3);}}>
                            <div className="left-bar" style={{display: this.state.selectedKey === 3 ? "block" : "none"}}/>
                            <div className="menu-name">Market Price</div>
                        </div>

                        <div className="one-rank">Trading</div>
                        <div className={this.getClassName(4)} onClick={()=>{this.handleClick(4);}}>
                            <div className="left-bar" style={{display: this.state.selectedKey === 4 ? "block" : "none"}}/>
                            <div className="menu-name">Auto RFQ</div>
                        </div>
                        <div className={this.getClassName(5)} onClick={()=>{this.handleClick(5);}}>
                            <div className="left-bar" style={{display: this.state.selectedKey === 5 ? "block" : "none"}}/>
                            <div className="menu-name">Auto Hedge</div>
                        </div>

                        <div className="one-rank">Risk</div>
                        <div className={this.getClassName(6)} onClick={()=>{this.handleClick(6);}}>
                            <div className="left-bar" style={{display: this.state.selectedKey === 6 ? "block" : "none"}}/>
                            <div className="menu-name">Market Risk</div>
                        </div>
                        <div className={this.getClassName(7)} onClick={()=>{this.handleClick(7);}}>
                            <div className="left-bar" style={{display: this.state.selectedKey === 7 ? "block" : "none"}}/>
                            <div className="menu-name">Operation Risk</div>
                        </div>
                        <div className={this.getClassName(8)} onClick={()=>{this.handleClick(8);}}>
                            <div className="left-bar" style={{display: this.state.selectedKey === 8 ? "block" : "none"}}/>
                            <div className="menu-name">Credit Risk/Counter Party</div>
                        </div>
                    </div>
                    <div style={{flex: 1, padding: 10}}>
                        {
                            this.getContent()
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    showManualTrading: state.clientFlowReducer.showManualTrading,
    showRradeBlotter: state.clientFlowReducer.showRradeBlotter,
});

const mapDispatchToProps = dispatch => ({
});
export default connect(mapStateToProps,mapDispatchToProps)(MarketConfig);