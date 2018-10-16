import React, { Component } from 'react';
import '../App.css';
import TableNames from './table-names'
import PropTypes from 'prop-types';

class TableNamesHolder extends Component {
    constructor(props) {
      super(props);
      this.state = {
        headList: [],
        NOTdisplayed: [],
        APIList: []
      }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            headList: nextProps.headList,
            NOTdisplayed: nextProps.NOTdisplayed,
            APIList: nextProps.APIList
        })
    }
    
    render() {
        if (this.state.headList === undefined || this.state.headList.length < 2) {
            return null;
        } else {
            return (
                <tr className="bar" >
                    <TableNames headList={this.state.headList} NOTdisplayed={this.props.NOTdisplayed} APIList={this.props.APIList}/> 
                </tr>
            )
        }
    }
}


export default TableNamesHolder;

TableNamesHolder.propTypes = {
    headList: PropTypes.array,
    NOTdisplayed: PropTypes.array,
    APIList: PropTypes.array
}