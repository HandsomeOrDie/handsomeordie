import {connect} from "react-redux";
import React, {Component} from "react";
import {Collapse, Tabs, Row, Col, Card, Icon, Input, InputNumber, Table, message} from "antd";
import {getCptyList, setCptyList, saveCpty, getGroupList, setCurrentGroup} from "../../../actions/creditCounterParty";
import "../../../../common/styles/marketPages/riskMonitor.scss";
import TragTd from "./TragTd";
import CptySymbol from "./CptySymbol";

class CounterParty extends Component {
    state = {
        clickTdId: undefined,
    }

    componentDidMount() {
        // console.log([][1].index);
        this.props.getCptyList();
    }

    componentWillReceiveProps(nextProps) {
        // console.log(1);
        this.setState({clickTdId: 33333});
    }

    onDoubleClick = (disbled, index, cptyList) => {
        // console.log(disbled, index);
        if (disbled){
            return;
        }
        cptyList[index].disable = true;
        this.props.setCptyList(cptyList);
    };

    saveCredit = (index, initValue, value, cptyList) => {
        value = value.replace(/\$\s?|(,*)/g, "");
        // console.log(index, initValue, value, cptyList);
        if (initValue === parseInt(value)){
            cptyList[index].disable = false;
            this.props.setCptyList(cptyList);
        } else {
            let params = cptyList[index];
            params.credit = parseInt(value);
            this.props.saveCpty(params, (result) =>{
                if (result.success){
                    message.success("Success！", 2);
                    this.props.getCptyList();
                    this.props.getGroupList({},(currentGroup, data) =>{
                        if (currentGroup){
                            const currentGroup = this.props.currentGroup;
                            this.props.setCurrentGroup(data[data.findIndex(item => item.id === currentGroup.id)]);
                        }
                    });
                }else {
                    message.error("Failed!", 2);
                    this.props.getCptyList();
                }
            });
        }
    };

    getTableContent = () => {
        let cptyList = this.props.cptyList;
        let selectedCpty = this.props.selectedCpty;
        let result = [];
        for(let i=0; i<cptyList.length;i=i+1){
            const dom = (
                <tr key={i} style={{textAlign: "center"}}>
                    <TragTd record={cptyList[i]} selected={selectedCpty.indexOf(cptyList[i].code)} clickTdId={this.state.clickTdId} selfIndex={i} handleClick={()=>{this.setState({clickTdId: i});}}/>
                    <td style={{height:30}} align="center" onDoubleClick={()=>{this.onDoubleClick(cptyList[i].disabled, i, cptyList);}}>
                        {
                            !cptyList[i].disable ? cptyList[i].credit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") :
                                <InputNumber
                                    style={{paddingRight:20,background:"#fff"}}
                                    size="small"
                                    autoFocus
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    parser={value => value.replace(/\$\s?|(,*)/g, "")}
                                    defaultValue={cptyList[i].credit}
                                    onPressEnter={(e)=>{this.saveCredit(i, cptyList[i].credit, e.target.value, cptyList);}}
                                    onBlur={(e)=>{this.saveCredit(i, cptyList[i].credit, e.target.value, cptyList);}}
                                />
                        }
                    </td>
                    {/* <TragTd selected={cptyList[i+1] && selectedCpty.indexOf(cptyList[i+1].code)} clickTdId={this.state.clickTdId} selfIndex={i+1} handleClick={()=>{this.setState({clickTdId: i+1});}} record={cptyList[i+1] ? cptyList[i+1] : {}}/>
                    <td style={{height:30}} align="center" onDoubleClick={()=>{cptyList[i+1] && this.onDoubleClick(cptyList[i+1].disabled, i+1, cptyList);}}>
                        {
                            cptyList[i+1] ? !cptyList[i+1].disable ? cptyList[i+1].credit :
                                <div style={{width: "60%",display: "flex",alignItems: "center"}}>
                                    <InputNumber
                                        size="small"
                                        autoFocus
                                        defaultValue={cptyList[i+1].credit}
                                        onPressEnter={(e)=>{this.saveCredit(i+1, cptyList[i+1].credit, e.target.value, cptyList);}}
                                        onBlur={(e)=>{this.saveCredit(i+1, cptyList[i+1].credit, e.target.value, cptyList);}}
                                    />
                                </div> : ""
                        }
                    </td> */}
                </tr>
            );
            result.push(dom);
        }
        return result;
    };

    render() {
        return (
            <Card id="credit-style" title={<div style={{color: "#3f918e",fontWeight:700}}>Counter Party Credit List</div>} style={{flex: 2, marginRight: 10,}} >
                <table border="1" bordercolor="#d3d3d3" width="100%">
                    <tbody>
                        <tr style={{background: "#ccc", textAlign: "center",color: "#fff"}}>
                            <th>Counter Party</th>
                            <th>Credit($)</th>
                        </tr>
                        {
                            this.getTableContent()
                        }
                    </tbody>
                </table>
                <CptySymbol/>
            </Card>
        );
    }
}

const mapStateToProps = state => ({
    cptyList: state.creditCptyReducer.cptyList,
    selectedCpty: state.creditCptyReducer.selectedCpty,
    currentGroup: state.creditCptyReducer.currentGroup,
});

const mapDispatchToProps = dispatch => ({
    getCptyList: (params) => dispatch(getCptyList(params)),
    setCptyList: (list) => dispatch(setCptyList(list)),
    saveCpty: (params, cb) => dispatch(saveCpty(params, cb)),
    getGroupList: (params, cb) => dispatch(getGroupList(params, cb)),
    setCurrentGroup: (currentGroup) => dispatch(setCurrentGroup(currentGroup)),
});

export default connect(mapStateToProps,mapDispatchToProps)(CounterParty);
// export default connect(mapStateToProps,mapDispatchToProps)(CounterParty);
