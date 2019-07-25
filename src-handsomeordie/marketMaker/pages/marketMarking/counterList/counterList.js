import { connect } from "react-redux";
import React, { Component } from "react";
import { Table, Input,message } from "antd";
import { DragDropContext, DragSource, DropTarget } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import update from "immutability-helper";

import { getCounterParty, getCounterParty_drag } from "../../../actions/distribution";

const Search = Input.Search;


class counterList extends Component {
    state = {
        group_name: [],
        group_list: [],
        table_data: [],
        searchInput: "",
    }
    
    componentDidMount () {
        this.props.getCounterParty();
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.CounterPartyReducer !== this.props.CounterPartyReducer){
            this.initCounter(nextProps.CounterPartyReducer);
        }
        if(nextProps.CounterParty_drag !== this.props.CounterParty_drag){
            this.setState({table_data: nextProps.CounterParty_drag});
        }
    }
    

    // onSearch = (value) => {
    //     console.log(value);
    //     this.prepareListData(this.props.corePriceList, value);
    //     this.setState({
    //         searchInput: value
    //     });
    // }
   
    minMax = (list) => {
        var len = list.length;
        if(!len){
            result = "-";
        } else if(len === 1){
            result = list[0].credit;
        } else {
            var min = list[0].credit || 0, max = list[0].credit || 0, result;

            for (var i = 1; i < len; i++){ 
                if (list[i].credit < min){ 
                    min = list[i].credit; 
                } 
                if (list[i].credit > max) { 
                    max = list[i].credit; 
                } 
            } 
            result = min + "-" + max;
        }
        return result;
    }
    initCounter = (data) => {
        let name = [], list = [], table = [];
        let no_group = data.counterParties;
        let group = data.counterPartyGroups;
        table = [].concat(no_group);
        let arr = [];
        group.map((elem)=>{
            let group_item = elem.counterParties;
            name.push(elem.name);
            list.push(elem.counterParties);
            let credit = this.minMax(group_item);
            arr.push({
                name: elem.name,
                credit: credit,
                id: elem.id
            });
            group_item.map((elem_item)=>{
                arr.push(elem_item);
            });
           
           
        });
        table.push(...arr);
        this.setState({
            group_name: name,
            group_list: list,
            table_data: table,
        }, () => {
            this.props.getCounterParty_drag(table);
        });
    }
    getSearch = (value) => {
        if (value) {
            const {table_data} = this.state;
            let newData = [];
            table_data.map((elem) => {
                for (let k in elem) {
                    let str = elem[k] + "";
                    if(typeof(str) === "number"){
                        str = JSON.stringify(str);
                    }
                    if (str.indexOf(value) != -1) {
                        newData.push(elem);
                    }
                }
            });
            this.setState({table_data: newData});
        }else{
            this.setState({table_data: this.props.CounterParty_drag});
        }

    }

    render() {
        
        const columns = [{
            title: "counter party",
            dataIndex: "name",
            render: (text, record) => {
                let str = text;
                if(record.code){
                    str = text + " ( "+record.code+" ) ";
                }
                return str;
            }

        }, {
            title: "credit(CNY,million)",
            dataIndex: "credit",
        }, ];
      
        return (
            <div>
                <div className="tabTitle">
                    <label className="tabTitle_marginRight">Market CCY Pairs</label>
                         
                    <Search
                        placeholder="input search text"
                        onSearch={this.getSearch}
                        style={{ width: 200 }}
                    />
                </div> 
                <Table
                    bordered
                    pagination={false}
                    columns={columns}
                    dataSource={this.state.table_data}
                    components={this.props.components}
                    rowKey={record => {
                        if(record.code){
                            return record.code;
                        }else{
                            return record.name;
                        }
                    }}
                    onRow={(record, index) => ({
                        index,
                    })}
                    rowClassName={(record) => {
                        if (record.isDrage) {
                            return "qit-tr-disabled";
                        }
                    }}
                />
           
            </div>
          
        );
    }
}

const mapStateToProps = state => ({
    CounterPartyReducer: state.CounterPartyReducer.list,
    CounterParty_drag: state.CounterPartyReducer.list_drag,
});

const mapDispatchToProps = dispatch => ({
    getCounterParty: () => dispatch(getCounterParty()),
    getCounterParty_drag: (data) => dispatch(getCounterParty_drag(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(counterList);