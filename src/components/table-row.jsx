import React, { Component } from 'react';
import '../App.css';
import _ from "underscore";

class TableRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            headList: [],
            rowList: [],
            NOTdisplayed: [],
            APIList: [],
            changed: false,
            count: 0
        }

    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            changed: false
        })
        
        if (this.state.rowList.length === nextProps.rowList.length) {
            if (!_.isEqual(nextProps.rowList, this.state.rowList) && nextProps.rowList.length >= 1) {
                this.setState({
                    headList: nextProps.headList,
                    rowList: nextProps.rowList,
                    NOTdisplayed: nextProps.NOTdisplayed,
                    APIList: nextProps.APIList,
                    changed: true
                })
            }
        } else if(this.state.count === 0) {
            this.setState({
                headList: nextProps.headList,
                rowList: nextProps.rowList,
                NOTdisplayed: nextProps.NOTdisplayed,
                APIList: nextProps.APIList,
                changed: true
            })
        } else {
            this.setState({
                headList: nextProps.headList,
                NOTdisplayed: nextProps.NOTdisplayed,
                APIList: nextProps.APIList,
                changed: true
            })
        }
        this.setState({
            count: this.state.count+1
        })
    }

    render() {
        if (this.state.rowList.length > 0) {
            return this.state.APIList.map((api, i) => {
                return this.state.rowList.map((item, j) => (
                    item.split('--')[1] === "URL" && i === 0 ? (
                        <th key={j.toString()} className={this.state.headList[j]} style={{ textAlign: 'center' }}>{item.split('--')[0].split(':')[0]}</th>
                    ) : (
                            item.split('--')[1] === api.split('/')[0] ? (
                                <th key={j.toString()} className={this.state.headList[j]} style={{ textAlign: 'center', animation: this.state.changed ? 'highlight 1s' : null }}>{item.split('--')[0]}</th>
                            ) : (null)
                        )
                ))
            })
        } else {
            return null;
        }
    }

}


export default TableRow