import { connect } from "react-redux";
import React, { Component } from "react";
import { Table, Input, Icon, Select, Radio, Button, Modal, Form, AutoComplete, message, Card, Spin, InputNumber } from "antd";
import { getCorePriceList, getMarketPriceConfigList, saveCorePrice, deleteCorePriceById } from "../../actions/corePrice";

const Option = Select.Option;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;
let loadingCount = 0;

class CorePrice extends Component {

    state = {
        isShowWindow: false,
        configTableSelectedRowId: 0,
        groupTableSelectedRowIndex: 0,
        sourceTableSelectedRowIndex: 0,
        currentEditingConfig: {},
        configListDataSource: [
            { id: -1 }, { id: -2 }, { id: -3 }, { id: -4 }, { id: -5 }, { id: -6 }, { id: -7 }, { id: -8 }, { id: -9 }, { id: -10 }
        ],
        originData: [],
        symbolList: [],
        typeList: [],
        autoCompleteDataSource: [],
        searchInput: "",
        editView: false,
        loading: false,

        swapTenorKey: "9",
    }


    getEmptyConfig = () => {
        return {
            tenorType: this.state.typeList.length > 0 ? this.state.typeList[0] : "",
            // symbol: this.state.symbolList.length > 0 ? this.state.symbolList[0] : "",
            symbol: "",
            algo: "VWAP",
            referencePriceSourceGroups: [],
            referencePriceSourceLists: []
        };
    };

    showDiscardChangePop = (callback) => {
        confirm({
            title: "Discard changes?",
            content: "You are editing another config, do you want to discard the changes you have made",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk: callback,
            onCancel: () => {
                console.log("Cancel");
            },
        });
    }

    showLoading = (count) => {
        if (count) {
            loadingCount += 2;
        } else {
            loadingCount++;
        }
        if (!this.state.loading) {
            this.setState({ loading: true });
        }
    }
    hideLoading = () => {
        loadingCount--;
        if (loadingCount <= 0) {
            this.setState({ loading: false },()=>{
                // setTimeout(()=>{
                //     this.onConfigTableRow(this.state.configListDataSource[0],0);
                // },500);
                // let record = this.state.configListDataSource[0];
                // this.state.currentEditingConfig = JSON.parse(JSON.stringify(this.state.originData && this.state.originData.length? this.state.originData[0]:{}));
                // this.setState({
                //     configTableSelectedRowId: record.id,
                //     groupTableSelectedRowIndex: 0,
                //     sourceTableSelectedRowIndex: 0,
                //     currentEditingConfig: this.state.currentEditingConfig,
                //     editView: false
                // });
                this.prepareAutoCompleteDataSource(this.props.marketConfigList);
            });
        }
    }

    onConfigTableRow = (record, index) => {
        return {
            onClick: () => {
                this.setState({
                    thisId: 0
                },()=>{
                    let currentEditingConfig = {};
                    // console.log(index,record,this.state.originData[index]);
                    if (record.id > 0 && record.id !== this.state.configTableSelectedRowId) {
                        for(let i in this.state.originData) {
                            if(record.id === this.state.originData[i].id){
                                currentEditingConfig = this.state.originData[i];
                            }
                        }
                        if (this.state.editView) {
                            confirm({
                                title: "Discard changes?",
                                content: "You are editing another config, do you want to discard the changes you have made",
                                okText: "Yes",
                                okType: "danger",
                                cancelText: "No",
                                onOk: () => {
                                    this.setState({
                                        configTableSelectedRowId: record.id,
                                        groupTableSelectedRowIndex: 0,
                                        sourceTableSelectedRowIndex: 0,
                                        currentEditingConfig: currentEditingConfig,
                                        editView: false
                                    },()=>{
                                        this.prepareAutoCompleteDataSource(this.props.marketConfigList);
                                    });
                                },
                                onCancel: () => {
                                    console.log("Cancel");
                                },
                            });
                        } else {
                        // console.log(111);
                            this.setState({
                                configTableSelectedRowId: record.id,
                                groupTableSelectedRowIndex: 0,
                                sourceTableSelectedRowIndex: 0,
                                currentEditingConfig: currentEditingConfig,
                                editView: false
                            },()=>{
                                this.prepareAutoCompleteDataSource(this.props.marketConfigList,currentEditingConfig);
                            });
                        }

                    }
                });
            }
        };
    }
    onSourceTableRow = (record, index) => {
        return {
            onClick: () => {
                this.setState({ sourceTableSelectedRowIndex: index });
            }
        };
    }
    onGroupTableRow = (record, index) => {
        return {
            onClick: () => {
                this.setState({ groupTableSelectedRowIndex: index });
            }
        };
    }

    setConfigTableRowClassName = (record, index) => {
        if(this.state.thisId){
            return record.id === this.state.thisId ? "selected-row" : "";
        } else {
            return record.id === this.state.configTableSelectedRowId ? "selected-row" : "";
        }
    }
    setGroupTableRowClassName = (record, index) => {
        return index === this.state.groupTableSelectedRowIndex ? "group-selected-row" : "";
    }
    setSourceTableRowClassName = (record, index) => {
        return index === this.state.sourceTableSelectedRowIndex ? "source-selected-row" : "";
    }

    addConfigMenuClick = () => {
        if (this.state.editView) {
            this.showDiscardChangePop(() => {
                this.state.currentEditingConfig = this.getEmptyConfig();
                // this.state.configTableSelectedRowId = -1;
                this.setState({
                    currentEditingConfig: this.state.currentEditingConfig,
                    // configTableSelectedRowId: this.state.configTableSelectedRowId,
                    editView: true
                });
                this.prepareAutoCompleteDataSource(this.props.marketConfigList);
            });
        } else {
            this.state.currentEditingConfig = this.getEmptyConfig();
            // this.state.configTableSelectedRowId = -1;
            this.setState({
                currentEditingConfig: this.state.currentEditingConfig,
                // configTableSelectedRowId: this.state.configTableSelectedRowId,
                editView: true
            });
            this.prepareAutoCompleteDataSource(this.props.marketConfigList);
        }
    }
    deleteConfigMenuClick = () => {
        if (this.state.configTableSelectedRowId > 0) {
            this.showLoading();
            this.props.deleteCorePriceById(this.state.configTableSelectedRowId,()=>{

                this.props.getCorePriceList(()=>{
                    this.setState({ currentEditingConfig: this.getEmptyConfig() });
                });
            });
            
        } else {
            console.log("need toast message");
        }
    }
    addGroupClick = () => {
        if (!this.state.editView) {
            return;
        }
        let groupName = "Group1";
        if (this.state.currentEditingConfig.referencePriceSourceGroups.length != 0) {
            let lastGroup = this.state.currentEditingConfig.referencePriceSourceGroups[this.state.currentEditingConfig.referencePriceSourceGroups.length - 1];
            let lastGroupIndex = parseInt(lastGroup.groupName.replace("Group", ""));
            groupName = "Group" + (lastGroupIndex + 1);
        }
        let emptyGroup = {
            groupName: groupName,
            aggregation: "VWAP"
        };
        this.state.currentEditingConfig.referencePriceSourceGroups.push(emptyGroup);
        this.setState({
            currentEditingConfig: this.state.currentEditingConfig,
            groupTableSelectedRowIndex: this.state.currentEditingConfig.referencePriceSourceGroups.length - 1
        });
    }
    deleteGroupClick = () => {
        if (!this.state.editView) {
            return;
        }
        if (this.state.groupTableSelectedRowIndex !== -1) {
            let targetRowIndex = this.state.groupTableSelectedRowIndex;
            if (targetRowIndex === this.state.currentEditingConfig.referencePriceSourceGroups.length - 1) {
                targetRowIndex = targetRowIndex - 1;
            }
            this.state.currentEditingConfig.referencePriceSourceGroups.splice(this.state.groupTableSelectedRowIndex, 1);
            this.setState({
                currentEditingConfig: this.state.currentEditingConfig,
                groupTableSelectedRowIndex: targetRowIndex
            });
        } else {
            console.log("need toast message");
        }
    }
    addSourceClick = () => {
        if (!this.state.editView) {
            return;
        }
        let emptySource = {
            groupName: "",
            sourceName: "",
            init: true,
            mode: "",
            isAF: false,
            isPF: false,
            isTF: false,
            quality: null,
            connectivity: null,
            backupSetting: "PRIMARY",
            switch1: "",
            switch2: ""
        };
        this.state.currentEditingConfig.referencePriceSourceLists.push(emptySource);
        this.setState({
            currentEditingConfig: this.state.currentEditingConfig,
            sourceTableSelectedRowIndex: this.state.currentEditingConfig.referencePriceSourceLists.length - 1
        });
    }
    deleteSourceClick = () => {
        if (!this.state.editView) {
            return;
        }
        if (this.state.sourceTableSelectedRowIndex !== -1) {
            let targetRowIndex = this.state.sourceTableSelectedRowIndex;
            if (targetRowIndex === this.state.currentEditingConfig.referencePriceSourceLists.length - 1) {
                targetRowIndex = targetRowIndex - 1;
            }
            this.state.currentEditingConfig.referencePriceSourceLists.splice(this.state.sourceTableSelectedRowIndex, 1);
            this.setState({
                currentEditingConfig: this.state.currentEditingConfig,
                sourceTableSelectedRowIndex: targetRowIndex
            });
        } else {
            console.log("need toast message");
        }
    }
    onPresetChange = (e) => {
        this.state.currentEditingConfig.preset = e.target.value;
    }
    groupAggChange = (value, index) => {
        this.state.currentEditingConfig.referencePriceSourceGroups[index].aggregation = value;
        this.setState({ currentEditingConfig: this.state.currentEditingConfig });
    }
    sourceGroupNameChange = (value, index) => {
        this.state.currentEditingConfig.referencePriceSourceLists[index].groupName = value;
        this.setState({ currentEditingConfig: this.state.currentEditingConfig });
    }
    getCurrentSource = () => {
        let sources = this.state.currentEditingConfig.referencePriceSourceLists;
        if (sources && this.state.sourceTableSelectedRowIndex < sources.length && sources.length > 0) {
            return sources[this.state.sourceTableSelectedRowIndex];
        } else {
            return {};
        }
    }
    onAutoCompleteSelect = (value, option) => {
        let index = this.state.autoCompleteDataSource.indexOf(value);
        let matchedConfigs = this.props.marketConfigList.filter(item => (item.id == value));
        if (matchedConfigs && matchedConfigs.length > 0) {
            let selectedConfig = matchedConfigs[0];
            let matchedSource = this.state.currentEditingConfig.referencePriceSourceLists[this.state.sourceTableSelectedRowIndex];
            matchedSource.sourceName = selectedConfig.fullName;
            matchedSource.mode = selectedConfig.mode || "";
            matchedSource.isAF = selectedConfig.isAF;
            matchedSource.isPF = selectedConfig.isPF;
            matchedSource.isTF = selectedConfig.isTF;
            matchedSource.quality = selectedConfig.quality;
            matchedSource.connectivity = selectedConfig.connectivity;
            matchedSource.mktPxConfigId = selectedConfig.id;

            this.setState({
                currentEditingConfig: this.state.currentEditingConfig
            });
        }

    }
    autoCompletedValueFilter = (inputValue, option) => {
        if (option.props.children.toUpperCase().startsWith(inputValue.toUpperCase())) {
            return true;
        }
        return false;
    }
    filterListData = (configListData, filter) => {
        let originData = configListData;
        if (filter && filter !== "") {
            let matchedResult = [];
            configListData.forEach(item => {
                let itemInput = " " + item.symbol + " " + item.preset + " "
                    + item.tenor + " " + item.groups + " " + item.totalSources
                    + " " + item.minSources + " " + item.minTick + " ";
                if (itemInput.toUpperCase().indexOf(filter.toUpperCase()) != -1) {
                    matchedResult.push(item);
                }
            });
            return matchedResult;
        }
        return originData;
    }
    prepareListData(originData, searchInput) {
        let configListData = [];
        if (originData && originData.length > 0) {
            originData.forEach(item => {
                let configData = {
                    id: item.id,
                    symbol: item.symbol,
                    preset: item.preset,
                    tenor: item.tenorType,
                    groups: item.referencePriceSourceGroups ? item.referencePriceSourceGroups.length : 0,
                    totalSources: item.referencePriceSourceLists ? item.referencePriceSourceLists.length : 0,
                    minSources: item.minSources,
                    minTick: item.minTick
                };
                configListData.push(configData);
            });
        }
        configListData = this.filterListData(configListData, searchInput);
        if (configListData.length < 10) {
            for (let i = configListData.length; i < 10; i++) {
                configListData.push({ id: -(10 - i) });
            }
        }
        // this.state.configListDataSource = configListData;
        // setTimeout(()=>{
        this.setState({ configListDataSource: configListData });
        // },1000);
    }
    prepareSymbolListData(marketConfigData) {
        let symbolList = [];
        marketConfigData.forEach(item => {
            if (symbolList.indexOf(item.symbol) === -1) {
                symbolList.push(item.symbol);
            }
        });
        this.setState({ symbolList: symbolList });
    }
    prepareTypeListData() {
        let typeList = [];
        this.props.marketConfigList.forEach(marketConfig => {
            if (marketConfig.tenorType
                && marketConfig.tenorType !== ""
                && marketConfig.symbol === this.state.currentEditingConfig.symbol
                && typeList.indexOf(marketConfig.tenorType) === -1) {
                typeList.push(marketConfig.tenorType);
            }
        });
        this.setState({ typeList: typeList });
    }
    prepareAutoCompleteDataSource(marketConfigData) {
        // console.log("marketConfigData:", marketConfigData);
        let dataSource = [];
        marketConfigData.forEach(item => {
            if (item.symbol === this.state.currentEditingConfig.symbol
                && (item.tenorType || "") === (this.state.currentEditingConfig.tenorType || "")
                && (item.tenorDate1 || "") === (this.state.currentEditingConfig.tenorDate1 || "")
                && (item.tenorDate2 || "") === (this.state.currentEditingConfig.tenorDate2 || "")
                && item.status !== "DISABLED"
            ) {
                dataSource.push({
                    value: item.id,
                    text: item.fullName
                });
            }
        });
        this.setState({ autoCompleteDataSource: dataSource });
    }

    isChinese = (str) => {
        if(/.*[\u4e00-\u9fa5]+.*$/.test(str)) // \u 表示unicode
        { 
            // alert("不能含有汉字！"); 
            return false; 
        } 
        return true; 
    }

    saveCorePrice = () => {
        this.setState({
            loading: false
        });
        let corePrice = this.state.currentEditingConfig;
        if (!corePrice.preset || corePrice.preset === "") {
            message.error("Preset is required");
            return;
        }
        if(this.isChinese(corePrice.preset) === false){
            message.error("Preset must be an English letter!");
            return;
        }
        if (!(corePrice.minSources > 0 && corePrice.minSources <= corePrice.referencePriceSourceLists.length)) {
            message.error("MinSource is incorrect");
            return;
        }

        if (corePrice.referencePriceSourceLists.filter(item => item.init).length < corePrice.minSources) {
            message.error("Actived sources count can not be less than the minSources value");
            return;
        }

        if (corePrice.referencePriceSourceLists.filter(item => (!item.sourceName || item.sourceName === "")).length > 0) {
            message.error("Please complete all the items of source list");
            return;
        }

        if (corePrice.referencePriceSourceLists.filter(item => (!item.switch1 || item.switch1 === "")).length > 0) {
            message.error("The first switch value is required");
            return;
        }

        if (corePrice.referencePriceSourceLists.filter(item => (!item.switch2 || item.switch2 === "")).length > 0) {
            message.error("The second switch value is required");
            return;
        }
        // console.log(corePrice);
        if(this.state.configTableSelectedRowId === -1){
            // 新增
            for(let i in this.state.configListDataSource){
                if(this.state.configListDataSource[i].preset === corePrice.preset){
                    message.warning("PresetName 不得重复 ！");
                    return;
                }
            }
        } else {
            // 修改
            for(let i in this.state.configListDataSource){
                if(this.state.configListDataSource[i].preset === corePrice.preset && this.state.configListDataSource[i].id !== corePrice.id){
                    message.warning("PresetName 不得重复 ！");
                    return;
                }
            }
        }

        this.showLoading();
        this.props.saveCorePrice(corePrice,(id)=>{
            this.setState({
                thisId: id
            });
            this.props.getCorePriceList(()=>{
                const {originData} = this.state;
                for(let i in originData){
                    if(originData[i].id===id){
                        this.setState({
                            configTableSelectedRowId: id,
                            groupTableSelectedRowIndex: 0,
                            sourceTableSelectedRowIndex: 0,
                            currentEditingConfig: originData[i],
                            editView: false
                        },()=>{
                            // console.log(this.state.currentEditingConfig,originData[i]);
                        });
                    }
                }
            });

        });

        // this.props.saveCorePrice(this.state.currentEditingConfig,(id)=>{
        //     this.setState({
        //         thisId: id
        //     },()=>{

        //     });
        // });
        this.setState({
            searchInput: "",
            editView: false,
            loading: false
        });
        this.refs.searchInput.input.value = "";
    }
    onCancelClick = () => {
        this.state.editView = false;
        this.setState({ editView: false });
        if (this.state.configTableSelectedRowId > 0) {
            let matchedResults = this.props.corePriceList.filter(item => (item.id === this.state.configTableSelectedRowId));
            if (matchedResults && matchedResults.length > 0) {
                this.state.currentEditingConfig = JSON.parse(JSON.stringify(matchedResults[0]));
                this.state.configTableSelectedRowId = this.state.currentEditingConfig.id;
                this.setState({
                    currentEditingConfig: this.state.currentEditingConfig,
                    configTableSelectedRowId: this.state.configTableSelectedRowId
                });
            }
        } else {
            // this.state.currentEditingConfig = JSON.parse(JSON.stringify(this.props.corePriceList[0]));
            this.state.configTableSelectedRowId = this.state.currentEditingConfig.id;
            this.setState({
                // currentEditingConfig: this.state.currentEditingConfig,
                configTableSelectedRowId: this.state.configTableSelectedRowId
            });
        }
    }

    componentWillMount() {
        this.props.getCorePriceList(()=>{
            this.setState({
                loading:false
            },()=>{
                let record = this.state.configListDataSource[0];
                this.state.currentEditingConfig = JSON.parse(JSON.stringify(this.state.originData && this.state.originData.length? this.state.originData[0]:{}));
                this.setState({
                    configTableSelectedRowId: record.id,
                    groupTableSelectedRowIndex: 0,
                    sourceTableSelectedRowIndex: 0,
                    currentEditingConfig: this.state.currentEditingConfig,
                    editView: false
                });
            });
        });
        this.props.getMarketPriceConfigList();
        this.showLoading(2);
    }
    componentWillReceiveProps(nextProps) {
        this.hideLoading();
        if (JSON.stringify(this.state.originData) !== JSON.stringify(nextProps.corePriceList)
            || JSON.stringify(this.props.marketConfigList) !== JSON.stringify(nextProps.marketConfigList)) {
            let originData = nextProps.corePriceList;
            if (originData && originData.length > 0) {
                if (this.state.configTableSelectedRowId < 0) {
                    this.state.currentEditingConfig = JSON.parse(JSON.stringify(originData[0]));
                    this.state.configTableSelectedRowId = this.state.currentEditingConfig.id;
                }
                this.setState({
                    currentEditingConfig: this.state.currentEditingConfig,
                    configTableSelectedRowId: this.state.currentEditingConfig.id,
                    editView: false
                });
            }
            this.setState({ originData: originData, marketConfigList: nextProps.marketConfigList });
            this.prepareListData(originData, this.state.searchInput);
            this.prepareSymbolListData(nextProps.marketConfigList);
            this.prepareTypeListData();
            this.prepareAutoCompleteDataSource(nextProps.marketConfigList);
        }
    }

    onSearch = () => {
        let searchInput = this.refs.searchInput.input.value;
        this.prepareListData(this.props.corePriceList, searchInput);
        this.setState({
            searchInput: searchInput
        });
    }

    onSymbolChange = (value) => {
        if (!this.state.currentEditingConfig.referencePriceSourceLists
            || this.state.currentEditingConfig.referencePriceSourceLists.length === 0) {
            this.state.currentEditingConfig.symbol = value;
            this.state.currentEditingConfig.tenorType = undefined;
            this.state.currentEditingConfig.tenorDate1 = undefined;
            this.state.currentEditingConfig.tenorDate2 = undefined;
            this.setState({ currentEditingConfig: this.state.currentEditingConfig });
            this.prepareTypeListData();
            this.prepareAutoCompleteDataSource(this.props.marketConfigList);
        } else {
            confirm({
                title: "Clear sources?",
                content: "This option will clear all the sources you have added, are you sure to do this?",
                okText: "Yes",
                okType: "danger",
                cancelText: "No",
                onOk: () => {
                    this.state.currentEditingConfig.referencePriceSourceLists = [];
                    this.state.currentEditingConfig.symbol = value;
                    this.state.currentEditingConfig.tenorType = undefined;
                    this.state.currentEditingConfig.tenorDate1 = undefined;
                    this.state.currentEditingConfig.tenorDate2 = undefined;
                    this.setState({ currentEditingConfig: this.state.currentEditingConfig });
                    this.prepareTypeListData();
                    this.prepareAutoCompleteDataSource(this.props.marketConfigList);
                },
                onCancel: () => {
                    console.log("Cancel");
                },
            });
        }
    }

    onTypeChange = (value) => {
        if (!this.state.currentEditingConfig.referencePriceSourceLists
            || this.state.currentEditingConfig.referencePriceSourceLists.length === 0) {
            this.state.currentEditingConfig.tenorType = value;
            if (value === "SPOT") {
                this.state.currentEditingConfig.tenorDate1 = undefined;
                this.state.currentEditingConfig.tenorDate2 = undefined;
            } else if (value === "FORWARD") {
                this.state.currentEditingConfig.tenorDate2 = undefined;
            }
            this.setState({ currentEditingConfig: this.state.currentEditingConfig });
            this.prepareAutoCompleteDataSource(this.props.marketConfigList);
        } else {
            confirm({
                title: "Clear sources?",
                content: "This option will clear all the sources you have added, are you sure to do this?",
                okText: "Yes",
                okType: "danger",
                cancelText: "No",
                onOk: () => {
                    this.state.currentEditingConfig.referencePriceSourceLists = [];
                    this.state.currentEditingConfig.tenorType = value;
                    if (value === "SPOT") {
                        this.state.currentEditingConfig.tenorDate1 = undefined;
                        this.state.currentEditingConfig.tenorDate2 = undefined;
                    } else if (value === "FORWARD") {
                        this.state.currentEditingConfig.tenorDate2 = undefined;
                    }
                    this.setState({ currentEditingConfig: this.state.currentEditingConfig });
                    this.prepareAutoCompleteDataSource(this.props.marketConfigList);
                },
                onCancel: () => {
                    console.log("Cancel");
                },
            });
        }

    }
    onTenorDate1Change = (value, options) => {
        this.setState({swapTenorKey: options.key});
        if (!this.state.currentEditingConfig.referencePriceSourceLists
            || this.state.currentEditingConfig.referencePriceSourceLists.length === 0) {
            this.state.currentEditingConfig.tenorDate1 = value;
            this.state.currentEditingConfig.tenorDate2 = undefined;
            this.setState({ currentEditingConfig: this.state.currentEditingConfig });
            this.prepareAutoCompleteDataSource(this.props.marketConfigList);
        } else {
            confirm({
                title: "Clear sources?",
                content: "This option will clear all the sources you have added, are you sure to do this?",
                okText: "Yes",
                okType: "danger",
                cancelText: "No",
                onOk: () => {
                    this.state.currentEditingConfig.referencePriceSourceLists = [];
                    this.state.currentEditingConfig.tenorDate1 = value;
                    this.state.currentEditingConfig.tenorDate2 = undefined;
                    this.setState({ currentEditingConfig: this.state.currentEditingConfig });
                    this.prepareAutoCompleteDataSource(this.props.marketConfigList);
                },
                onCancel: () => {
                    console.log("Cancel");
                },
            });
        }
    }
    onTenorDate2Change = (value) => {
        if (!this.state.currentEditingConfig.referencePriceSourceLists
            || this.state.currentEditingConfig.referencePriceSourceLists.length === 0) {
            this.state.currentEditingConfig.tenorDate2 = value;
            this.setState({ currentEditingConfig: this.state.currentEditingConfig });
            this.prepareAutoCompleteDataSource(this.props.marketConfigList);
        } else {
            confirm({
                title: "Clear sources?",
                content: "This option will clear all the sources you have added, are you sure to do this?",
                okText: "Yes",
                okType: "danger",
                cancelText: "No",
                onOk: () => {
                    this.state.currentEditingConfig.referencePriceSourceLists = [];
                    this.state.currentEditingConfig.tenorDate2 = value;
                    this.setState({ currentEditingConfig: this.state.currentEditingConfig });
                    this.prepareAutoCompleteDataSource(this.props.marketConfigList);
                },
                onCancel: () => {
                    console.log("Cancel");
                },
            });
        }
    }
    changeInitStatus = (index) => {
        this.state.currentEditingConfig.referencePriceSourceLists[index].init = !this.state.currentEditingConfig.referencePriceSourceLists[index].init;
        this.setState({
            currentEditingConfig: this.state.currentEditingConfig
        });
    }
    onSwitch1Change = (value, index) => {
        this.state.currentEditingConfig.referencePriceSourceLists[index].switch1 = value;
        this.setState({
            currentEditingConfig: this.state.currentEditingConfig
        });
    }
    onSwitch2Change = (value, index) => {
        this.state.currentEditingConfig.referencePriceSourceLists[index].switch2 = value;
        this.setState({
            currentEditingConfig: this.state.currentEditingConfig
        });
    }

    render() {
        // console.log(this.state.currentEditingConfig);
        const Option = Select.Option;
        const columns = [{
            title: "Symbol",
            dataIndex: "symbol",
            key: "symbol",
        }, {
            title: "PresetName",
            dataIndex: "preset",
            key: "preset",
        }, {
            title: "Tenor",
            dataIndex: "tenor",
            key: "tenor",
        }, {
            title: "Groups",
            dataIndex: "groups",
            key: "groups",
        }, {
            title: "Total Sources",
            dataIndex: "totalSources",
            key: "totalSources",
        },
        {
            title: "Min Sources",
            dataIndex: "minSources",
            key: "minSources",
        }, {
            title: "Min Tick",
            dataIndex: "minTick",
            key: "minTick",
        }];

        const groupColumns = [
            {
                title: "Group Name",
                dataIndex: "groupName",
                key: "groupName",
            },
            {
                title: "AGG",
                dataIndex: "aggregation",
                key: "aggregation",
                render: (agg, record, index) => (
                    <Select disabled={!this.state.editView} onChange={value => {
                        this.groupAggChange(value, index);
                    }} size="small" value={agg} style={{width:"100%"}} className="agg-select">
                        <Option value="VWAP">VWAP</Option>
                        <Option value="SINGLE">SINGLE</Option>
                        <Option value="WATCHING">WATCHING</Option>
                        <Option value="PEGGING">PEGGING</Option>
                    </Select>
                )
            }
        ];
        const sourceListColumns = [
            {
                title: "Group",
                dataIndex: "groupName",
                key: "groupName",
                render: (groupName, record, index) => (
                    <Select disabled={!this.state.editView} onChange={
                        value => {
                            this.sourceGroupNameChange(value, index);
                        }
                    } size="small" value={groupName} className="agg-select">
                        <Option value="">-</Option>
                        {
                            this.state.currentEditingConfig.referencePriceSourceGroups.map(group => (
                                <Option key={group.groupName} value={group.groupName}>{group.groupName}</Option>
                            ))
                        }
                    </Select>
                )
            },
            {
                title: "Init",
                dataIndex: "init",
                key: "init",
                render: (init, record, index) => (
                    <div className="init-status-wrapper">
                        <div onClick={() => { this.state.editView && this.changeInitStatus(index); }} className="init-status-background">
                            {init ?
                                (<div className="init-status-on">ON</div>) :
                                (<div className="init-status-off">OFF</div>)
                            }
                        </div>
                    </div>
                )
            },
            {
                title: "Source Full Name",
                dataIndex: "sourceName",
                key: "sourceName",
                render: (sourceName, record, index) => (
                    <div className="source-fullname-wrapper">
                        <label className={sourceName ? "" : "hide"}>{sourceName}</label>
                        <AutoComplete
                            dataSource={this.state.autoCompleteDataSource}
                            className={sourceName ? "hide" : ""}
                            style={{ width: 200 }}
                            onSelect={this.onAutoCompleteSelect}
                            filterOption={this.autoCompletedValueFilter}
                        />
                    </div>
                )
            },
            // {
            //     title: "Mode",
            //     dataIndex: "mode",
            //     key: "mode"
            // },
            {
                title: "Filters",
                dataIndex: "filters",
                key: "filters",
                render: (filters, record, index) => (
                    <div className="status-icon-wrapper">
                        <div className={["status-icon", record.isAF ? "status-icon-enabled" : ""].join(" ")}>A</div>
                        <div className={["status-icon", record.isPF ? "status-icon-enabled" : ""].join(" ")}>P</div>
                        <div className={["status-icon", record.isTF ? "status-icon-enabled" : ""].join(" ")}>T</div>
                    </div>
                )
            },
            {
                title: "Switch",
                dataIndex: "switch1",
                key: "switch1",
                render: (switch1, record, index) => (
                    <div className="switch-wrapper noBtnNumberInput">
                        <InputNumber min={0} disabled={!this.state.editView} onChange={e => {
                            this.onSwitch1Change(e, index);
                        }} className="switch1-input" value={record.switch1} />
                        <InputNumber min={0} disabled={!this.state.editView} onChange={e => {
                            this.onSwitch2Change(e, index);
                        }} className="switch2-input" value={record.switch2} />
                    </div>
                )
            }
        ];

        const { swapTenorKey } = this.state;
        const loading = this.state.configListDataSource instanceof Array && this.state.configListDataSource.length>0?false:true;
        return (
            <div className="core-price" style={{display:"flex",flex:1,flexDirection:"column"}}>
                <div className="title-wrapper">
                    <div className="title-search-wrapper">
                        <label className="title">Market CCY Pairs</label>
                        <Input ref="searchInput" onPressEnter={this.onSearch} className="search-input" />
                        <Icon onClick={this.onSearch} type="search" className="search-icon" />
                    </div>
                    <div style={{padding:"10px 0"}} className="menu-wrapper">
                        <Icon style={{marginLeft:5,color:"#bfbfbf"}} onClick={this.addConfigMenuClick} type="plus-circle" theme="filled" className="add-menu-icon" />
                        <Icon style={{marginLeft:5,color:"#bfbfbf"}} onClick={this.deleteConfigMenuClick} type="minus-circle" theme="filled" className="delete-menu-icon" />
                    </div>
                </div>
                <div className="table-wrapper corePriceTable">
                    <Table style={{display:"block"}} onRow={this.onConfigTableRow}
                        dataSource={this.state.configListDataSource}
                        rowClassName={this.setConfigTableRowClassName}
                        columns={columns}
                        scroll={{y:document.documentElement.clientHeight-648}}
                        pagination={false}
                        loading={loading}
                        rowKey="id" />
                </div>
                <div className="separator"></div>
                <div style={{height:430}} className="edit-wrapper corePrice">
                    <div className="title">Aggregation Setting</div>
                    <div className="content-wrapper-1">
                        <div className="input-wrapper">
                            <label className="input-label">Preset</label>
                            <Input disabled={!this.state.editView} onChange={e => {
                                this.state.currentEditingConfig.preset = e.target.value;
                                this.setState({ currentEditingConfig: this.state.currentEditingConfig });
                            }} size="small" className="preset-input" value={this.state.currentEditingConfig.preset} />
                        </div>
                        <div className="input-wrapper">
                            <label style={{width:50}} className="input-label">Symbol</label>
                            <Select style={{width:150}} disabled={!this.state.editView} size="small" onChange={this.onSymbolChange}
                                value={this.state.currentEditingConfig.symbol}
                                className="symbol-select">
                                {
                                    this.state.symbolList.map(symbol => (
                                        <Option key={symbol} value={symbol}>{symbol}</Option>
                                    ))
                                }
                            </Select>
                        </div>
                        <div className="input-wrapper">
                            <label style={{width:50}} className="input-label">Type</label>
                            <Select style={{width:100}} disabled={!this.state.editView} size="small" onChange={this.onTypeChange} value={this.state.currentEditingConfig.tenorType} className="type-select">
                                {
                                    this.state.typeList.map(type => (
                                        <Option key={type} value={type}>{type}</Option>
                                    ))
                                }
                            </Select>
                        </div>
                        <div className="input-wrapper">
                            <label style={{width:50}} className="input-label">Tenor</label>
                            <Select disabled={!this.state.editView || (this.state.currentEditingConfig.tenorType !== "FORWARD" && this.state.currentEditingConfig.tenorType !== "SWAP")}
                                onChange={this.onTenorDate1Change} value={this.state.currentEditingConfig.tenorDate1}
                                size="small"
                                className="tenor-input">
                                <Option key={1} value="O/N">O/N</Option>
                                <Option key={2} value="T/N">T/N</Option>
                                <Option key={3} value="S/N">S/N</Option>
                                <Option key={4} value="1D">1D</Option>
                                <Option key={5} value="1W">1W</Option>
                                <Option key={6} value="2W">2W</Option>
                                <Option key={7} value="3W">3W</Option>
                                <Option key={8} value="1M">1M</Option>
                                <Option key={9} value="2M">2M</Option>
                                <Option key={10} value="3M">3M</Option>
                                <Option key={11} value="4M">4M</Option>
                                <Option key={12} value="5M">5M</Option>
                                <Option key={13} value="6M">6M</Option>
                                <Option key={14} value="9M">9M</Option>
                                <Option key={15} value="1Y">1Y</Option>
                                <Option key={16} value="18M">18M</Option>
                                <Option key={17} value="2Y">2Y</Option>
                                <Option key={18} value="3Y">3Y</Option>
                            </Select>
                            <Select disabled={!this.state.editView || (this.state.currentEditingConfig.tenorType !== "SWAP")}
                                onChange={this.onTenorDate2Change} value={this.state.currentEditingConfig.tenorDate2}
                                size="small"
                                className="tenor-input-2">
                                <Option disabled={!(swapTenorKey < "1")} value="O/N">O/N</Option>
                                <Option disabled={!(swapTenorKey < "2")} value="T/N">T/N</Option>
                                <Option disabled={!(swapTenorKey < "3")} value="S/N">S/N</Option>
                                <Option disabled={!(swapTenorKey < "4")} value="1D">1D</Option>
                                <Option disabled={!(swapTenorKey < "5")} value="1W">1W</Option>
                                <Option disabled={!(swapTenorKey < "6")} value="2W">2W</Option>
                                <Option disabled={!(swapTenorKey < "7")} value="3W">3W</Option>
                                <Option disabled={!(swapTenorKey < "8")} value="1M">1M</Option>
                                <Option disabled={!(swapTenorKey < "9")} value="2M">2M</Option>
                                <Option disabled={!(swapTenorKey < "10")} value="3M">3M</Option>
                                <Option disabled={!(swapTenorKey < "11")} value="4M">4M</Option>
                                <Option disabled={!(swapTenorKey < "12")} value="5M">5M</Option>
                                <Option disabled={!(swapTenorKey < "13")} value="6M">6M</Option>
                                <Option disabled={!(swapTenorKey < "14")} value="9M">9M</Option>
                                <Option disabled={!(swapTenorKey < "15")} value="1Y">1Y</Option>
                                <Option disabled={!(swapTenorKey < "16")} value="18M">18M</Option>
                                <Option disabled={!(swapTenorKey < "17")} value="2Y">2Y</Option>
                                <Option disabled={!(swapTenorKey < "18")} value="3Y">3Y</Option>
                            </Select>
                        </div>
                        <div className="input-wrapper">
                            <label className="input-label">Min Sources</label>
                            <Input disabled={!this.state.editView} onChange={e => {
                                this.state.currentEditingConfig.minSources = e.target.value;
                                this.setState({ currentEditingConfig: this.state.currentEditingConfig });
                            }} value={this.state.currentEditingConfig.minSources} size="small" className="min-sources-input" />
                        </div>
                    </div>
                    <div className="content-wrapper-2">
                        <div className="input-wrapper">
                            <label className="input-label">Aggregation Algo</label>
                            <Select style={{width:140}} disabled={!this.state.editView} onChange={value => {
                                this.state.currentEditingConfig.algo = value;
                                this.setState({ currentEditingConfig: this.state.currentEditingConfig });
                            }} value={this.state.currentEditingConfig.algo} size="small" defaultValue="VWAP" className="agg-select">
                                {/* <Option value="VOLUME SUM">VOLUME SUM</Option> */}
                                <Option value="VWAP">VWAP</Option>
                                <Option value="PASSTHROUGH">PASSTHROUGH</Option>
                                <Option value="WATCHING">WATCHING</Option>
                                <Option value="PEGGING">PEGGING</Option>
                            </Select>
                        </div>
                    </div>
                    <div style={{display:"flex"}} className="content-wrapper-3">
                        <div style={{flex:1}} className="group-list-wrapper">
                            <Card title="Groups"
                                extra={
                                    <div style={{padding:"10px 0"}} className="list-title-wrapper">
                                        <div className="menu-wrapper">
                                            <Icon style={{marginLeft:5,color:"#bfbfbf"}} onClick={this.addGroupClick} type="plus-circle" theme="filled" className="add-menu-icon" />
                                            <Icon style={{marginLeft:5,color:"#bfbfbf"}} onClick={this.deleteGroupClick} type="minus-circle" theme="filled" className="delete-menu-icon" />
                                        </div>
                                    </div>}>
                                <div className="group-content-wrapper">
                                    <Table onRow={this.onGroupTableRow}
                                        dataSource={this.state.currentEditingConfig.referencePriceSourceGroups}
                                        rowClassName={this.setGroupTableRowClassName}
                                        columns={groupColumns}
                                        pagination={false}
                                        rowKey="id" />
                                </div>
                            </Card>
                        </div>
                        <div style={{flex:3,margin:"0 10px"}} className="source-list-wrapper">
                            <Card title="Source List"
                                extra={
                                    <div className="menu-wrapper">
                                        <Icon style={{marginLeft:5,color:"#bfbfbf"}} onClick={this.addSourceClick} type="plus-circle" theme="filled" className="add-menu-icon" />
                                        <Icon style={{marginLeft:5,color:"#bfbfbf"}} onClick={this.deleteSourceClick} type="minus-circle" theme="filled" className="delete-menu-icon" />
                                    </div>
                                }>
                                <div style={{padding:10}} className="source-content-wrapper">
                                    <Table onRow={this.onSourceTableRow}
                                        dataSource={this.state.currentEditingConfig.referencePriceSourceLists}
                                        rowClassName={this.setSourceTableRowClassName}
                                        columns={sourceListColumns}
                                        rowKey="id"
                                        pagination={false} />
                                </div>
                            </Card>
                        </div>
                        <div style={{flex:1}} className="detail-info-wrapper">
                            <Card title="Pricing Source Configuration">
                                <div className="detail-content-wrapper">
                                    <div className="info-line">
                                        <div className="info-label">FullName</div>
                                        <div className="info-value">{this.getCurrentSource().sourceName}</div>
                                    </div>
                                    <div className="info-line">
                                        <div className="info-label">Symbol</div>
                                        <div className="info-value">{this.state.currentEditingConfig.symbol}</div>
                                    </div>
                                    <div className="info-line">
                                        <div className="info-label">Quality</div>
                                        <div className="info-value">{(this.getCurrentSource().quality || "-") + "%"}</div>
                                    </div>
                                    <div className="info-line">
                                        <div className="info-label">Connectivity</div>
                                        <div className="info-value">{(this.getCurrentSource().connectivity || "-") + "%"}</div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                    <div className="edit-icon-wrapper">
                        {
                            this.state.editView ? (null) : (
                                <Icon style={{color:"#bfbfbf"}} onClick={() => {
                                    this.setState({ editView: true });
                                }} type="form" />
                            )
                        }
                    </div>
                    <div className="edit-bottom-button-wrapper">
                        <Button disabled={!this.state.editView}
                            onClick={this.onCancelClick}
                            className="cancel-btn">CANCEL</Button>
                        <Button disabled={!this.state.editView} onClick={this.saveCorePrice} className="save-btn">SAVE</Button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        corePriceList: state.corePrice.corePriceList,
        marketConfigList: state.corePrice.marketConfigList
    };
};

const mapDispatchToProps = dispatch => ({
    getCorePriceList: (cb) => dispatch(getCorePriceList(cb)),
    getMarketPriceConfigList: () => dispatch(getMarketPriceConfigList()),
    saveCorePrice: (corePrice,cb) => dispatch(saveCorePrice(corePrice,cb)),
    deleteCorePriceById: (id,cb) => dispatch(deleteCorePriceById(id,cb))
});
export default connect(mapStateToProps, mapDispatchToProps, null)(CorePrice);