import React, { Component } from 'react';
import '../App.css';
import TableRow from './bodyrows';

class Table extends Component {
    constructor(props) {
      super(props);
      this.state = {
        rowList: [],
        headList: [],
        NOTdisplayed: [],
        APIList: [],
        displayed: this.props.displayed
      }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.rowList !== state.rowList) { return { rowList: props.rowList }; }
        if (props.headList !== state.headList) { return { headList: props.headList }; }
        if (props.NOTdisplayed !== state.NOTdisplayed) { return { NOTdisplayed: props.NOTdisplayed }; }
        if (props.APIList !== state.APIList) { return { APIList: props.APIList }; }
        if (props.NOTdisplayedAPIs !== state.NOTdisplayedAPIs) { return { NOTdisplayedAPIs: props.NOTdisplayedAPIs }; }

        // No state update necessary
        return null
    }
    
    render() {
        const { rowList, headList, NOTdisplayed, APIList, NOTdisplayedAPIs } = this.state;

        const theme = localStorage.getItem('theme');
        if (rowList === [] ) {
            return null;
        } else {
            return (
                rowList.map((item, i) => (
                    i % 2 === 0 ? (
                        <tr key={ `tr-${item}-${i}` } className='1' style={{ 
                            backgroundColor: JSON.parse(localStorage.getItem(`${item[0].split('--')[0]}--off`)) ? "red" : (theme === 'dark' ? '#363636' : ''),
                            color: JSON.parse(localStorage.getItem(`${item[0].split('--')[0]}--off`)) ? "#cccccc" : null
                        }}>
                            <TableRow headList={ headList } NOTdisplayed={ NOTdisplayed } rowList={ item } APIList={ APIList } NOTdisplayedAPIs={ NOTdisplayedAPIs } displayed={ this.props.displayed } />
                        </tr>
                    ) : (
                        <tr key={ `tr-${item}-${i}` } className='1' style={{ 
                            backgroundColor: JSON.parse(localStorage.getItem(`${item[0].split('--')[0]}--off`)) ? "red" : (theme === 'dark' ? '#2f2f2f' : ''),
                            color: JSON.parse(localStorage.getItem(`${item[0].split('--')[0]}--off`)) ? "#cccccc" : null
                        }}>
                            <TableRow headList={ headList } NOTdisplayed={ NOTdisplayed } rowList={ item } APIList={ APIList } NOTdisplayedAPIs={ NOTdisplayedAPIs } displayed={ this.props.displayed } />
                        </tr>
                    )
                ))
            )
        }
    }
}

export default Table