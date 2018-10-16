import React, { Component } from 'react';
import '../App.css';
import _ from "underscore";
import PropTypes from 'prop-types';

class TableRow extends Component {
    constructor(props) {
      super(props);
      this.state = {
        headList: [],
        rowList: [],
        NOTdisplayed: [],
        APIList: [],
        changed: false
      }
      
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            changed: false
        })
        // console.log(nextProps.rowList, this.state.rowList)
        if (!_.isEqual(nextProps.rowList, this.state.rowList) && nextProps.rowList.length >= 1) {
        
            this.setState({
                headList: nextProps.headList,
                rowList: nextProps.rowList,
                NOTdisplayed: nextProps.NOTdisplayed,
                APIList: nextProps.APIList,
                changed: true
            })
        }
    }

    render() {
        return this.state.APIList.map((api, i) => {
                return this.state.rowList.map((item,j) => (
                    item.split('--')[1] === "URL" && i === 0? (
                        <th key={`${item}_${j}`} className={this.state.headList[j]} style={{textAlign: 'center'}}>{item.split('--')[0].split(':')[0]}</th>
                    ) : (
                    item.split('--')[1] === api.split('/')[0] ? (
                        <th key={`${item}_${j}`} className={this.state.headList[j]} style={{textAlign: 'center', animation: this.state.changed ? 'highlight 1s' : null}}>{item.split('--')[0]}</th>
                    ) : (null)
                        // if(item === false || item === 'false') {
                        //     return <th key={i.toString()} className={this.state.headList[i]} style={{textAlign: 'center'}}>{'false'}</th>
                        // } else if(item === true || item === 'true') {
                        //     return <th key={i.toString()} className={this.state.headList[i]} style={{textAlign: 'center'}}>{'true'}</th>
                        // }  else if(item === "") {
                        //     return <th key={i.toString()} className={this.state.headList[i]} style={{textAlign: 'center'}}>{`" "`}</th>
                        // } else {
                        //     return <th key={i.toString()} className={this.state.headList[i]} style={{textAlign: 'center'}}>{item}</th>
                        // }
                    )
                ))
            })
        }
        
}


export default TableRow

TableRow.propTypes = {
    headList: PropTypes.array,
    rowList: PropTypes.array,
    NOTdisplayed: PropTypes.array,
    APIList: PropTypes.array,
    changed: PropTypes.bool
}