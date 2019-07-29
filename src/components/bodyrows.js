import React, { Component } from 'react';
import _ from 'underscore';

class TableRow extends Component {
    constructor(props) {
      super(props);
      this.state = {
        headList: [],
        rowList: [],
        APIList: [],
        changed: false,
        count: 0,
        NOTdisplayedAPIs: [],
        displayed: [],
      }
    }

    static getDerivedStateFromProps(props, state) {
        if (state.headList.length === 0 || props.headList.length > state.headList.length) {
            return { headList: props.headList,NOTdisplayedAPIs: props.NOTdisplayedAPIs, displayed: props.displayed }
        }
        
        if (props.rowList.length === 1 && state.rowList.length === 0) {
            let oldRowList = JSON.parse(localStorage.getItem(`${props.rowList[0].split('--')[0]}`));
            localStorage.setItem(`${props.rowList[0].split('--')[0]}--off`, true)
            return { rowList: oldRowList, APIList: props.APIList }
        } else if (props.rowList.length < state.headList.length) {
            if (props.rowList.length === 1) {
                let oldRowList = JSON.parse(localStorage.getItem(`${props.rowList[0].split('--')[0]}`));
                if (oldRowList[0].split('--')[1] === "URL") {
                    localStorage.setItem(`${props.rowList[0].split('--')[0]}--off`, true)

                    return { rowList: oldRowList, APIList: props.APIList };
                }
            } else {
                let newRowList = [];
                if (props.rowList.length > 1) {
                    for (let h = 0; h < state.headList.length; h++) {
                        if (h === 0) {
                            newRowList.push(props.rowList[h]);
                        } else {
                            let headListSplit = state.headList[h].split('--');
                            for (let r = 1; r < props.rowList.length; r++) {
                                let rowListSplit = props.rowList[r].split('--');
                                if (`${rowListSplit[1]}--${rowListSplit[2]}` === `${headListSplit[0]}--${headListSplit[1]}`) {
                                    newRowList.push(props.rowList[r])
                                }
                            }
                            if (newRowList[h] === undefined || !newRowList[h].includes(`${headListSplit[0]}--${headListSplit[1]}`)){
                                newRowList.push(`""--${headListSplit[0]}--${headListSplit[1]}`)
                            }
                        }
                    }
                }
            
                if (newRowList.length > 1) {
                    localStorage.setItem(`${props.rowList[0].split('--')[0]}--off`, false)
                    return { rowList: newRowList, APIList: props.APIList, NOTdisplayedAPIs: props.NOTdisplayedAPIs }
                }
            }
        } 
        else if (!_.isEqual(props.rowList, state.rowList)) {
            if (props.rowList.length > 1) {
                localStorage.setItem(`${props.rowList[0].split('--')[0]}--off`, false)
                return { rowList: props.rowList, APIList: props.APIList, NOTdisplayedAPIs: props.NOTdisplayedAPIs }
            }
        } 
        if (props.displayed !== state.displayed) { return { displayed: props.displayed }}

        return { count: state.count + 1, changed: false };
    }

    render() {
        const { APIList, rowList, headList, NOTdisplayedAPIs, changed, displayed } = this.state;
        rowList.length > 1 ? localStorage.setItem(`${rowList[0].split('--')[0]}`, JSON.stringify(rowList)) : null;

        let displaysLocal = JSON.parse(localStorage.getItem('displays'))
        let chooseDisplayVar = (displaysLocal !== null && displaysLocal.displayed !== null) ? displaysLocal.displayed : displayed;
        let chooseNOTdisplayedAPIVar = (displaysLocal !== null && displaysLocal.NOTdisplayedAPIs !== null) ? displaysLocal.NOTdisplayedAPIs : NOTdisplayedAPIs;

        if (APIList.length) {
            if (rowList.length === 1) {
                return ( <th key={ `th-${rowList[0]}-${0}` } className={ headList[0] } style={{ textAlign: 'center' }}>{ rowList[0].split('--')[0].split(':')[0] }</th>)
            }
            else {
                return rowList.map((item,j) => ( 
                    j !== 0 && chooseNOTdisplayedAPIVar !== undefined ? (
                        chooseNOTdisplayedAPIVar.includes(item.split('--')[2]) ? (
                            chooseDisplayVar.includes(`${item.split('--')[1]}--${item.split('--')[2]}`) ? (
                                <th key={ `th-${item}-j` } className={ headList[j] } style={{ textAlign: 'center', animation: changed ? 'highlight 1s' : null }}>{ item.split('--')[0] }</th>
                            ) : (
                                null
                            )
                        ) : (
                            chooseDisplayVar.includes(`${item.split('--')[1]}--${item.split('--')[2]}`) ? (
                                <th key={ `th-${item}-${j}` } className={ headList[j] } style={{ textAlign: 'center', animation: changed ? 'highlight 1s' : null }}>{ item.split('--')[0] }</th>
                            ) : (
                                <th key={ `th-${item}-${j}` } className={ headList[j] } style={{ textAlign: 'center', animation: changed ? 'highlight 1s' : null, display: "none" }}>{ item.split('--')[0] }</th>                            
                            )
                        )
                    ) : (
                        <th key={ `th-${item}-${j}` } className={ headList[j] } style={{ textAlign: 'center' }}>{ item.split('--')[0].split(':')[0] }</th>
                    )
                ))
            }
        } else {
            return null;
        }
    }   
}


export default TableRow