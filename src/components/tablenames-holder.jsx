import React, { Component } from 'react';
import '../App.css';
import $ from "jquery";
import TableNames from './table-names'

class Table extends Component {
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

    // componentDidMount() {
    //     $(document).ready(function () {
    //         $('#example').DataTable({
    //             "paging": false,
    //             "ordering": false,
    //             "info": false
    //         });
    //     });
    // }

    render() {
        if (this.state.headList === undefined || this.state.headList.length < 2) {
            return null;
        } else {
            return (
                // <tr className="bar" >
                //     <TableNames headList={this.state.headList} NOTdisplayed={this.props.NOTdisplayed} APIList={this.props.APIList}/> 
                // </tr>
                <tr >
                    <TableNames headList={this.state.headList} NOTdisplayed={this.props.NOTdisplayed} APIList={this.props.APIList} />
                </tr>
            )
        }
    }
}


export default Table