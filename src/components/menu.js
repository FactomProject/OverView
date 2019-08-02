import React, { Component } from 'react';
import '../App.css';
import _ from 'underscore';


class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      NOTdisplayed: [],
      displayed: [],
      displayedAPIs: [],
      headList: [],
      showMenu: false,
      NOTdisplayedAPIs: [],
      receivedHeadList: false,
    };
  }
  
  static getDerivedStateFromProps(props, state) {
    if (!state.receivedHeadList) {
      return { headList: props.headList, receivedHeadList: true}
    }

    if (!_.isEqual(props.NOTdisplayed, state.NOTdisplayed)) {
      return { NOTdisplayed: props.NOTdisplayed }; 
    }

    if (!_.isEqual(props.displayed, state.displayed)) {
      return { displayed: props.displayed }; 
    }

    if (!_.isEqual(props.displayedAPIs, state.displayedAPIs)) {
      return { displayedAPIs: props.displayedAPIs }; 
    }

    if (!_.isEqual(props.NOTdisplayedAPIs, state.NOTdisplayedAPIs)) {
      return { NOTdisplayedAPIs: props.NOTdisplayedAPIs }; 
    }

    if (props.showMenu !== state.showMenu) { return { showMenu: props.showMenu }; }
    // No state update necessary
    return null;
  }

  toggleDisplay(display) {
    this.setState({
      showMenu: display
    });
  }

  render() {
    const { NOTdisplayedAPIs, headList, displayedAPIs, displayed } = this.state;
    const { item } = this.props;

    let displaysLocal = JSON.parse(localStorage.getItem('displays'))
    let chooseDisplayAPIsVar = (displaysLocal !== null && displaysLocal.displayedAPIs !== null && displaysLocal.displayedAPIs !== undefined) ? displaysLocal.displayedAPIs : displayedAPIs;
    let chooseDisplayedVar = (displaysLocal !== null && displaysLocal.displayed !== null && displaysLocal.displayed !== undefined) ? displaysLocal.displayed : displayed;
    
    if (NOTdisplayedAPIs === undefined) {
      return null;
    } else {
      return !chooseDisplayAPIsVar.includes(item)
        ? headList.map((key, i) => (
            key.split('--')[1] === item ? (
              chooseDisplayedVar.includes(key) ? (
              <div className='dropdown-item' href='#' key={ `Menu_key_${i}` }>
                  { key.split('--')[0] }
                  <a className='switch tiny' key={ `Menu_key_${i}` }>
                    <input
                      className='switch-input'
                      onClick={ () => this.props.handleClick(key) }
                      key={ `Menu_key_${i}-${key}` }
                      id={ key }
                      type='checkbox'
                      name={ `Switch for ${key}` }
                      defaultChecked
                    />
                    <label className='switch-paddle ish' htmlFor={ key } />
                  </a>
                </div>
                ) : (
                <div className='dropdown-item' href='#' key={ `Menu_key_${i}` }>
                  {key.split('--')[0]}
                  <a className='switch tiny' key={ `Menu_key_${i}` }>
                    <input
                      className='switch-input'
                      onClick={ () => this.props.handleClick(key) }
                      key={ `Menu_key_${i}-${key}` }
                      id={ key }
                      type='checkbox'
                      name={ `Switch for ${key}` }
                    />
                    <label className='switch-paddle ish' htmlFor={ key } />
                  </a>
                </div>
                )
            ) : null
          ))
        : headList.map((key, i) => (
          key.split('--')[1] === item ? (
            chooseDisplayedVar.includes(key) ? (
              <div className='dropdown-item' href='#' key={ `Menu_key_${i}` }>
                { key.split('--')[0] }
                <a className='switch tiny' key={ `Menu_key_${i}` }>
                  <input
                    className='switch-input'
                    onClick={ () => this.props.handleClick(key) }
                    key={ `Menu_key_${i}-${key}` }
                    id={ key }
                    type='checkbox'
                    name={ `Switch for ${key}` }
                    defaultChecked
                  />
                  <label className='switch-paddle ish' htmlFor={ key } />
                </a>
              </div>
            ) : (
              <div className='dropdown-item' href='#' key={ `Menu_key_${i}` }>
                { key.split('--')[0] }
                <a className='switch tiny' key={ `Menu_key_${i}` }>
                  <input
                    className='switch-input'
                    onClick={ () => this.props.handleClick(key) }
                    key={ `Menu_key_${i}-${key}` }
                    id={ key }
                    type='checkbox'
                    name={ `Switch for ${key}` }
                  />
                  <label className='switch-paddle ish' htmlFor={ key } />
                </a>
              </div>
            )
          ) : null
        ));
    }
  }
}

export default Menu;
