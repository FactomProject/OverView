import React, { Component } from 'react';
import '../App.css';
import _ from 'underscore';

class TableNames extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headList: [],
      APIList: [],
      NOTdisplayedAPIs: [],
      displayed: []
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (state.headList.length === 0) {
      return { headList: props.headList, APIList: props.APIList, NOTdisplayedAPIs: props.NOTdisplayedAPIs, displayed: props.displayed }
    } else if (!_.isEqual(props.headList, state.headList) && props.headList.length >= 1 && props.APIList.length !== 0) {
      return { headList: props.headList, APIList: props.APIList, NOTdisplayedAPIs: props.NOTdisplayedAPIs, displayed: props.displayed };
    }
    if (props.NOTdisplayedAPIs !== state.NOTdisplayedAPIs) {
      return { NOTdisplayedAPIs: props.NOTdisplayedAPIs }
    }
    if (props.displayed !== state.displayed) { return { displayed: props.displayed }}
    // No state update necessary
    return null;
  }

  render() {
    const theme = localStorage.getItem('theme');
    const { APIList, headList, NOTdisplayedAPIs, displayed } = this.state;

    return APIList.map((item, i) => {
      return headList.map((className, j) =>
        j !== 0 && NOTdisplayedAPIs !== undefined ? (
          NOTdisplayedAPIs.includes(className.split('--')[1]) ? (
            displayed.includes(`${className.split('--')[0]}--${className.split('--')[1]}`) ? (
              <th key={ j.toString() } className={ className } style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 700 }}>{ className.split('--')[0] }</div>
                <div style={{ fontSize: '12px', color: theme === 'dark' ? '#8a8a8a' : '#696969' }}>
                  { className.split('--')[1] }
                </div>
              </th>
            ) : (
              null
            )
          ) : (
            <th key={ j.toString() } className={ className } style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 700 }}>{ className.split('--')[0] }</div>
              <div style={{ fontSize: '12px', color: theme === 'dark' ? '#8a8a8a' : '#696969' }}>
                { className.split('--')[1] }
              </div>
            </th>
          )
        ) : (
          <th key={ j.toString() } className={ className } style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: 700 }}>{ className }</div>
          </th>
        )
      );
    });
  }
}

export default TableNames;
