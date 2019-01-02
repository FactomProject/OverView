import React, { Component } from 'react';
import '../App.css';
import TableRow from './table-row';


class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rowList: [],
            headList: [],
            NOTdisplayed: [],
            APIList: []
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            rowList: nextProps.rowList,
            headList: nextProps.headList,
            NOTdisplayed: nextProps.NOTdisplayed,
            APIList: nextProps.APIList
        })
    }

    render() {
        if (this.state.rowList.length != 0) {
            if (this.state.rowList === [] || this.state.rowList[0].length <= 1) {
                console.log(this.state.rowList)
                return null;
            } else {
                return (
                    this.state.rowList.map((item, i) => (
                        <tr key={i} className="1">
                            <TableRow key={i} headList={this.state.headList} NOTdisplayed={this.state.NOTdisplayed} rowList={item} APIList={this.state.APIList} />
                        </tr>
                    ))
                )
            }
        } else {
            return null;
        }
    }
}


export default Table