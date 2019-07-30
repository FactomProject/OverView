import React, { Component } from 'react';
import '../App.css';
import TableNamesHolder from './tablenames-holder';
import BodyRowHolder from './bodyrow-holder';
import Menu from './menu';
import io from 'socket.io-client';

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headList: [],
      displayed: [],
      displayedAPIs: [],
      NOTdisplayedAPIs: [],
      NOTdisplayed: [],
      rowList: [],
      showMenu: false,
      showMenu2: {},
      fullObj: {},
      menus: [],
      APIToggle: {},
      APIList: [],
      first: true,
      count: 0
    };

    this.socket = io('localhost:5001');

    this.componentDidMount = this.componentDidMount.bind(this);

    let newer_Obj = {};
    let APIList = {};

    this.socket.on('ListOfURLs', function (data) {
      for (let i = 0; i <= data.length - 1; i++) {
        newer_Obj[data[i]] = {};
      }
    });

    this.socket.on('ListOfAPIs', function (data) {
      this.setState({ APIList: data });
      APIList['APIList'] = data;
    }.bind(this));

    this.socket.on('DisplayedAPIs', function (data) {
      const displayedHolder = localStorage.getItem('displayedAPIs');
      if (displayedHolder !== undefined && Array.isArray(displayedHolder)) {
        this.setState({ displayedAPIs: displayedHolder })
      } else {
        this.setState({ displayedAPIs: data });
      }
    }.bind(this));

    this.socket.on('NOTDisplayedAPIs', function (data) {
      let NOTdisplayedHolder = localStorage.getItem('NOTdisplayedAPIs');
      if (NOTdisplayedHolder !== undefined && Array.isArray(NOTdisplayedHolder)) {
        this.setState({ NOTdisplayedAPIs: NOTdisplayedHolder })
      } else {
        this.setState({ NOTdisplayedAPIs: data });
      }
    }.bind(this));

    this.socket.on('APIObject', function (data) {
      for (let key in data.data) {
        if (newer_Obj.hasOwnProperty(data.api)) {
          newer_Obj[key][data.api] = data.data[key][data.api];
        } else {
          newer_Obj[key][data.api] = data.data[key][data.api];
        }
      }
    });

    setInterval(function () {
      let ObjToUse = {};
      for (let url in newer_Obj) {
        ObjToUse[url] = {};
        for (let i = 0; i <= APIList.APIList.length - 1; i++) {
          ObjToUse[url][APIList.APIList[i].split('/')[0]] = newer_Obj[url][APIList.APIList[i].split('/')[0]];
        }
      }
      if (this.state.first) {
        this.setState({
          first: false
        });
        setTimeout(function () {
          this.getConfigApiInfo(ObjToUse, APIList);
        }.bind(this), 1000);
      } else {
        if (Object.keys(ObjToUse).length !== 0) {
          this.getConfigApiInfo(ObjToUse, APIList);
        }
      }
    }.bind(this), 1000)
  }

  componentDidMount() {
    this.socket.emit('firstcall');
    setInterval(() => {
      this.socket.emit('firstcall');
    }, 6000);
  }

  getConfigApiInfo(obj, APIList) {
    let hugeArr = [];
    let hugeHeadList = [];
    let displayed = [];
    let NOTdisplayed = [];
    let newObj = {};
    let url = '';

    for (let top in obj) {
      url = top;
      if (!hugeHeadList.includes(`IP`)) {
        hugeHeadList.push(`IP`);
        displayed.push(`IP`);
      }
      let smallArr = [];
      smallArr.push(`${url}--URL`);
      for (let oneDeep in obj[top]) {
        newObj[oneDeep] = [];
        let apiHolderArrays = this.helper(obj[top][oneDeep], oneDeep);

        for (let i = 0; i < apiHolderArrays.headListHolder.length; i++) {
          if (!hugeHeadList.includes(apiHolderArrays.headListHolder[i])) {
            hugeHeadList.push(apiHolderArrays.headListHolder[i])
          }
          if (this.state.NOTdisplayedAPIs.includes(apiHolderArrays.headListHolder[i].split('--')[1])) {
            NOTdisplayed.push(apiHolderArrays.headListHolder[i])
          } else if (!displayed.includes(apiHolderArrays.headListHolder[i])) {
            displayed.push(apiHolderArrays.headListHolder[i])
          }
        }
        smallArr = smallArr.concat(apiHolderArrays.hugeValueHolder);
        newObj[oneDeep] = apiHolderArrays.headListHolder;
      }
      hugeArr.push(smallArr);
    }

    if (this.state.displayed !== undefined && this.state.displayed.length === 0) {
      this.setState({
        displayed: displayed,
      });
    }
    if (this.state.NOTdisplayed !== undefined && this.state.NOTdisplayed.length === 0) {
      this.setState({
        NOTdisplayed: NOTdisplayed,
      });
    }
    if (hugeHeadList.length > 0) {
      this.setState({
        rowList: hugeArr,
        headList: hugeHeadList,
        fullObj: newObj
      });
      this.getMenus();
      let NOTdisplayedHolder = [];
      for (let i = 0; i < this.state.headList.length; i++) {
        for (let j = 0; j < this.state.NOTdisplayedAPIs.length; j++) {
          if (this.state.headList[i].includes(this.state.NOTdisplayedAPIs[j])) {
            NOTdisplayedHolder.push(this.state.headList[i])
          }
        }
      }
      this.setState({
        NOTdisplayed: NOTdisplayedHolder
      })
    }
  }

  helper = (obj, api) => {
    let headListHolder = [];
    let hugeValueHolder = [];
    for (let key in obj) {
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        headListHolder.push(`${key}--${api}`);
        hugeValueHolder.push(`${JSON.stringify(obj[key])}--${key}--${api}`)
      } else {
        headListHolder.push(`${key}--${api}`);
        hugeValueHolder.push(`${obj[key]}--${key}--${api}`);
      }
    }
    return { 'headListHolder': headListHolder, 'hugeValueHolder': hugeValueHolder };
  }

  toggleDisplay(display) {
    this.setState({
      showMenu: display
    });
  }
  toggleAPIMenuDisplay(display, menu) {
    let holder = {}
    holder[menu] = display;
    this.setState({
      showMenu2: holder
    });
  }

  getMenus() {
    for (let key in this.state.fullObj) {
      if (!this.state.menus.includes(key)) {
        this.state.menus.push(key);
        let holder = {};
        holder[key] = false;
        this.setState({
          showMenu2: holder
        });
        if (this.state.displayedAPIs.includes(key)) {
          let APIToggleHolder = {}
          APIToggleHolder[key] = true;
          this.setState({
            APIToggle: APIToggleHolder
          });
        } else {
          let APIToggleHolder = {};
          APIToggleHolder[key] = false;
          this.setState({
            APIToggle: APIToggleHolder
          });
        }
      }
    }
  }

  handleClick(itemName) {
    const { headList, displayed, NOTdisplayed, displayedAPIs, NOTdisplayedAPIs } = this.state;
    let displaysLocal = JSON.parse(localStorage.getItem('displays'));

    let chooseDisplayAPIsVar = (displaysLocal !== null && displaysLocal.displayedAPIs.slice !== null && displaysLocal.displayedAPIs !== undefined)
      ? displaysLocal.displayedAPIs.slice(0)
      : displayedAPIs.slice(0);
    let chooseNOTdisplayedAPIsVar = (displaysLocal !== null && displaysLocal.NOTdisplayedAPIs !== null && displaysLocal.NOTdisplayedAPIs !== undefined) 
      ? displaysLocal.NOTdisplayedAPIs.slice(0) 
      : NOTdisplayedAPIs.slice(0);
    let choosedisplayedVar = (displaysLocal !== null && displaysLocal.displayed !== null && displaysLocal.displayed !== undefined) 
      ? displaysLocal.displayed.slice(0)
      : displayed.slice(0);
    let chooseNOTdisplayedVar = (displaysLocal !== null && displaysLocal.NOTdisplayed !== null && displaysLocal.NOTdisplayed !== undefined )
      ? displaysLocal.NOTdisplayed.slice(0)
      : NOTdisplayed.slice(0);

    if (choosedisplayedVar.includes(itemName)) {
      let NOTdisplayedCLONE = chooseNOTdisplayedVar;
      let displayedCLONE = choosedisplayedVar;
      let NOTdisplayedAPIsCLONE = chooseNOTdisplayedAPIsVar;
      let displayedAPIsCLONE = chooseDisplayAPIsVar;

      let input = document.getElementById(itemName);
      input.checked = false;

      let removeFromDisplayed = displayedCLONE.indexOf(itemName);
      displayedCLONE.splice(removeFromDisplayed, 1);
      NOTdisplayedCLONE.push(itemName)

      let apiInDisplayed = 0;
      for (let i = 1; i < headList.length; i++) {
        if (displayedCLONE[i] !== undefined) {
          if (displayedCLONE[i].split('--')[1] === itemName.split('--')[1]) {
            apiInDisplayed += 1;
          }
        }
        if (i === headList.length-1 && apiInDisplayed === 0) { apiInDisplayed = "ALL OFF" }
      }

      if (apiInDisplayed === "ALL OFF") {
        let inputs = document.getElementById(itemName.split('--')[1])
        inputs.checked = false;
        let removeFromDisplayed = displayedAPIsCLONE.indexOf(itemName.split('--')[1]);
        displayedAPIsCLONE.splice(removeFromDisplayed, 1);
        NOTdisplayedAPIsCLONE.push(itemName.split('--')[1])
      }

      this.setState({
        displayed: displayedCLONE,
        NOTdisplayed: NOTdisplayedCLONE,
        displayedAPIs: displayedAPIsCLONE,
        NOTdisplayedAPIs: NOTdisplayedAPIsCLONE
      });

      let displays = {}
      displays.displayed = displayedCLONE;
      displays.NOTdisplayed = NOTdisplayedCLONE;
      displays.displayedAPIs = displayedAPIsCLONE;
      displays.NOTdisplayedAPIs = NOTdisplayedAPIsCLONE;
      localStorage.setItem('displays', JSON.stringify(displays))

    } else if (chooseNOTdisplayedVar.includes(itemName)) {
      let NOTdisplayedCLONE = chooseNOTdisplayedVar;
      let displayedCLONE = choosedisplayedVar;
      let NOTdisplayedAPIsCLONE = chooseNOTdisplayedAPIsVar;
      let displayedAPIsCLONE = chooseDisplayAPIsVar;

      let input = document.getElementById(itemName);
      input.checked = true;

      let removeFromDisplayed = NOTdisplayedCLONE.indexOf(itemName);
      NOTdisplayedCLONE.splice(removeFromDisplayed, 1);
      displayedCLONE.push(itemName)

      let apiInHeadList = 0;
      let apiInDisplayed = 0;
      for (let i = 1; i < headList.length; i++) {
        if (headList[i].split('--')[1] === itemName.split('--')[1]) {
          apiInHeadList += 1;
        }
        if (displayedCLONE[i] !== undefined) {
          if (displayedCLONE[i].split('--')[1] === itemName.split('--')[1]) {
            apiInDisplayed += 1;
          }
        }
        if (i === headList.length-1 && apiInDisplayed === apiInHeadList) { apiInDisplayed = "ALL ON" }
      }

      if (apiInDisplayed === "ALL ON") {
        let inputs = document.getElementById(itemName.split('--')[1])
        inputs.checked = true;
        let removeFromNOTDisplayed = NOTdisplayedAPIsCLONE.indexOf(itemName.split('--')[1]);
        NOTdisplayedAPIsCLONE.splice(removeFromNOTDisplayed, 1);
        displayedAPIsCLONE.push(itemName.split('--')[1])
      }

      this.setState({
        displayed: displayedCLONE,
        NOTdisplayed: NOTdisplayedCLONE,
        displayedAPIs: displayedAPIsCLONE,
        NOTdisplayedAPIs: NOTdisplayedAPIsCLONE
      });

      let displays = {}
      displays.displayed = displayedCLONE;
      displays.NOTdisplayed = NOTdisplayedCLONE;
      displays.displayedAPIs = displayedAPIsCLONE;
      displays.NOTdisplayedAPIs = NOTdisplayedAPIsCLONE;
      localStorage.setItem('displays', JSON.stringify(displays));
    }
  }

  handleFullAPIClick(APIName) {
    let { headList, displayed, NOTdisplayed, displayedAPIs, NOTdisplayedAPIs } = this.state;
    let displaysLocal = JSON.parse(localStorage.getItem('displays'));

    let chooseDisplayAPIsVar = (displaysLocal !== null && displaysLocal.displayedAPIs.slice !== null) ? displaysLocal.displayedAPIs.slice(0) : displayedAPIs.slice(0);
    let chooseNOTdisplayedAPIsVar = (displaysLocal !== null && displaysLocal.NOTdisplayedAPIs !== null) ? displaysLocal.NOTdisplayedAPIs.slice(0) : NOTdisplayedAPIs.slice(0);
    let choosedisplayedVar = (displaysLocal !== null && displaysLocal.displayed !== null) ? displaysLocal.displayed.slice(0) : displayed.slice(0);
    let chooseNOTdisplayedVar = (displaysLocal !== null && displaysLocal.NOTdisplayed !== null) ? displaysLocal.NOTdisplayed.slice(0) : NOTdisplayed.slice(0);

    if (chooseDisplayAPIsVar.includes(APIName)) {
      let NOTdisplayedCLONE = chooseNOTdisplayedVar;
      let displayedCLONE = choosedisplayedVar;
      let NOTdisplayedAPIsCLONE = chooseNOTdisplayedAPIsVar;
      let displayedAPIsCLONE = chooseDisplayAPIsVar;
      headList.forEach((name, i) => {
        if (i !== 0 && choosedisplayedVar.includes(name) && !chooseNOTdisplayedVar.includes(name) && name.split('--')[1] === APIName) {
          let inputs = document.getElementById(name);
          inputs.checked = false;

          let removeFromDisplayed = displayedCLONE.indexOf(name);
          displayedCLONE.splice(removeFromDisplayed, 1);
          NOTdisplayedCLONE.push(name);
        }
      })
      let indexToRemoveAPI = displayedAPIsCLONE.indexOf(APIName);
      displayedAPIsCLONE.splice(indexToRemoveAPI, 1);
      NOTdisplayedAPIsCLONE.push(APIName);

      this.setState({
        displayed: displayedCLONE,
        NOTdisplayed: NOTdisplayedCLONE,
        displayedAPIs: displayedAPIsCLONE,
        NOTdisplayedAPIs: NOTdisplayedAPIsCLONE
      })

      let displays = {}
      displays.displayed = displayedCLONE;
      displays.NOTdisplayed = NOTdisplayedCLONE;
      displays.displayedAPIs = displayedAPIsCLONE;
      displays.NOTdisplayedAPIs = NOTdisplayedAPIsCLONE;
      localStorage.setItem('displays', JSON.stringify(displays))

    } else if (chooseNOTdisplayedAPIsVar.includes(APIName)) {
      let NOTdisplayedCLONE = chooseNOTdisplayedVar;
      let displayedCLONE = choosedisplayedVar;
      let NOTdisplayedAPIsCLONE = chooseNOTdisplayedAPIsVar;
      let displayedAPIsCLONE = chooseDisplayAPIsVar;
      headList.forEach((name, i) => {
        if (i !== 0 && chooseNOTdisplayedVar.includes(name) && !choosedisplayedVar.includes(name) && name.split('--')[1] === APIName) {
          let inputs = document.getElementById(name);
          inputs.checked = true;

          let removeFromNOTdisplayed  = NOTdisplayedCLONE.indexOf(name);
          NOTdisplayedCLONE.splice(removeFromNOTdisplayed, 1);
          displayedCLONE.push(name)
        }
      })
      let indexToRemoveAPI = NOTdisplayedAPIsCLONE.indexOf(APIName);
      NOTdisplayedAPIsCLONE.splice(indexToRemoveAPI, 1);
      displayedAPIsCLONE.push(APIName);

      this.setState({
        displayed: displayedCLONE,
        NOTdisplayed: NOTdisplayedCLONE,
        displayedAPIs: displayedAPIsCLONE,
        NOTdisplayedAPIs: NOTdisplayedAPIsCLONE
      })

      let displays = {}
      displays.displayed = displayedCLONE;
      displays.NOTdisplayed = NOTdisplayedCLONE;
      displays.displayedAPIs = displayedAPIsCLONE;
      displays.NOTdisplayedAPIs = NOTdisplayedAPIsCLONE;
      localStorage.setItem('displays', JSON.stringify(displays))
    }
  }

  // For rendering the table with a theme 
  Table = () => {
    const theme = localStorage.getItem('theme');
    const {headList, APIList, rowList, NOTdisplayed, count, NOTdisplayedAPIs, displayed} = this.state;
    
    if (headList.length === 0  || APIList.length === 0 || rowList.length === 0) {
      return ( null )     
    } else {
      return (
        <table >
          <thead style={{
            backgroundColor: theme === 'dark' ? '#28495f' : '#ececec',
            color: theme === 'dark' ? '#e6e6e6' : '#303030',
            border: theme === 'dark' ? '1px solid #28495f' : '',
          }}>
            <TableNamesHolder
              headList={headList}
              NOTdisplayed={NOTdisplayed}
              APIList={APIList}
              count={count}
              NOTdisplayedAPIs={NOTdisplayedAPIs}
              displayed={displayed}
            />
          </thead>
          <tbody style={{ border: '0px' }}>
            <BodyRowHolder
              rowList={rowList}
              headList={headList}
              NOTdisplayed={NOTdisplayed}
              APIList={APIList}
              NOTdisplayedAPIs={NOTdisplayedAPIs}
              displayed={displayed}
            />
          </tbody>
        </table>
      )
    }
  }

  render() {
    const { rowList, headList, showMenu, menus, displayedAPIs, APIList, showMenu2, NOTdisplayed, displayed, fullObj, NOTdisplayedAPIs } = this.state;
    const displaysLocal = JSON.parse(localStorage.getItem('displays'))
    const chooseDisplayAPIsVar = (displaysLocal !== null && displaysLocal.displayedAPIs !== null && displaysLocal.displayedAPIs !== undefined) ? displaysLocal.displayedAPIs : displayedAPIs;

    if (rowList.length === 0 || headList.length === 0) {
      return ( null )
    } else if (APIList.length !== '') {
      return (
        <div className='column'>
          <div className='nav'>
            <div className='nav-pills'>
              <div className='btn-group dropright' onMouseEnter={() => this.toggleDisplay(true)} onMouseLeave={() => this.toggleDisplay(false)} >
                <a role='button' className='nav-link btn dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='true'>APIs </a>
                <div className={`dropdown-menu`} style={{ display: showMenu ? 'block' : 'none', position: 'absolute', marginLeft: '0px' }}>
                  {menus.map((item, i) => {
                    return chooseDisplayAPIsVar.includes(item) ? (
                      <div className=' dropdown-item' href='#' key={`Menu_item_${i}-${item}`} >
                        {item}
                        <div className='btn-group dropright downdeep' onMouseEnter={() => this.toggleAPIMenuDisplay(true, item)} onMouseLeave={() => this.toggleAPIMenuDisplay(false, item)} >
                          <div role='button' className='nav-link btn dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='true' name='menudisplay'></div>
                          <div className={`dropdown-menu apikeys ${item}`} style={{display: showMenu2[item] ? 'block' : 'none', position: 'absolute', marginLeft: '0px', left: "95%"}}>
                            <div className='dropdown-item'>
                              <a className='switch tiny' key={`Menu_item_${i}-${item}`}>
                                Full API
                                <input
                                  className='switch-input'
                                  onClick={() => this.handleFullAPIClick(item)}
                                  key={`Menu_item_${i}-${item}`}
                                  id={item}
                                  type='checkbox'
                                  name={`Switch for ${item}`}
                                  defaultChecked
                                />
                                <label className='switch-paddle' htmlFor={item} />
                              </a>
                            </div>
                            <Menu
                              headList={headList}
                              item={item}
                              NOTdisplayed={NOTdisplayed}
                              displayed={displayed}
                              toggleDisplay={this.toggleDisplay.bind(this)}
                              showMenu={showMenu}
                              fullObj={fullObj[item]}
                              NOTdisplayedAPIs={NOTdisplayedAPIs}
                              displayedAPIs={displayedAPIs}
                              handleClick={this.handleClick.bind(this)}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                        <div className='dropdown-item' href='#' key={`Menu_item_${i}-${item}`}>
                          {item}
                          <div className='btn-group dropright downdeep' onMouseEnter={() => this.toggleAPIMenuDisplay(true, item)} onMouseLeave={() => this.toggleAPIMenuDisplay(false, item)} >
                            <div role='button' className='nav-link btn dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='true'></div>
                            <div className={`dropdown-menu apikeys ${item}`} style={{display: showMenu2[item] ? 'block' : 'none',  position: 'absolute', left: "95%"}}>
                              <div className='dropdown-item'>
                                <a className='switch tiny' key={`Menu_item_${i}-${item}`}>
                                  Full API
                                  <input
                                    className='switch-input'
                                    onClick={() => this.handleFullAPIClick(item)}
                                    key={`Menu_item_${i}-${item}`}
                                    id={item}
                                    type='checkbox'
                                    name={`Switch for ${item}`}
                                  />
                                  <label className='switch-paddle' htmlFor={item} />
                                </a>
                              </div>
                              <Menu
                                headList={headList}
                                item={item}
                                NOTdisplayed={NOTdisplayed}
                                displayed={displayed}
                                toggleDisplay={this.toggleDisplay.bind(this)}
                                showMenu={showMenu}
                                fullObj={fullObj[item]}
                                NOTdisplayedAPIs={NOTdisplayedAPIs}
                                displayedAPIs={displayedAPIs}
                                handleClick={this.handleClick.bind(this)}
                              />
                            </div>
                          </div>
                        </div>
                      );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className='table-scroll' id='style-7' style={{ marginLeft: '2em', width: '98vw' }}>
            <this.Table />
          </div>
        </div>
      );
    }
  }
}

export default Table;
