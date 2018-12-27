import React, { Component } from "react";
// import "../App.css";
import TableNamesHolder from "./tablenames-holder";
import BodyRowHolder from "./bodyrow-holder";
import Menu from "./menu";
import io from "socket.io-client";
import $ from "jquery";

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headList: [],
      displayed: this.props.displayed,
      displayedAPIs: ["heights", "network-info", "current-minute"],
      NOTdisplayedAPIs: ["configuration", "properties"],
      NOTdisplayed: [],
      rowList: [],
      showMenu: false,
      showMenu2: {},
      fullObj: {},
      menus: [],
      APIToggle: {},
      APIList: [],
      apiObjectforMenu: {},
      first: true,
      OLDData: {},
    };

    this.socket = io("localhost:5001");

    this.componentDidMount = this.componentDidMount.bind(this);

    let that = this;
    let newer_Obj = {};
    let APIList = {};

    this.socket.on("ListOfURLs", function (data) {
      for (let i = 0; i <= data.length - 1; i++) {
        newer_Obj[data[i]] = {};
      }
    });

    this.socket.on("ListOfAPIs", function (data) {
      that.setState({ APIList: data });

      APIList["APIList"] = data;
    });

    this.socket.on("APIObject", function (data) {
      for (let key in data.data) {
        that.state.apiObjectforMenu[data.api] = data.data[key][data.api];
        newer_Obj[key][data.api] = {};
        newer_Obj[key][data.api] = data.data[key][data.api];
      }
    });

    setInterval(function () {
      let ObjToUse = {};
      for (let url in newer_Obj) {
        ObjToUse[url] = {};
        if (Object.keys(that.state.OLDData).length !== 0) {
          // console.log(`NEW, ${url} `,newer_Obj[url]['current-minute'])
          // console.log(`OLD, ${url} `,that.state.OLDData[url]['current-minute'])
        }
        for (let i = 0; i <= APIList.APIList.length - 1; i++) {
          ObjToUse[url][APIList.APIList[i].split("/")[0]] =
            newer_Obj[url][APIList.APIList[i].split("/")[0]];
        }
      }
      if (that.state.first) {
        that.setState({
          first: false
        });
        setTimeout(() => {
          that.setState({
            OLDData: newer_Obj
          });
          that.getConfigApiInfo(ObjToUse, APIList);
        }, 1000);
      } else {
        if (Object.keys(ObjToUse).length !== 0) {
          that.setState({
            OLDData: newer_Obj
          });
          that.getConfigApiInfo(ObjToUse, APIList);
        }
      }
    }, 200);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      displayed: nextProps.displayed
    });
  }
  componentDidMount() {
    this.socket.emit("firstcall");
    setInterval(() => {
      this.socket.emit("firstcall");
    }, 20000);
  }

  getConfigApiInfo(obj, APIList) {
    let hugeArr = [];
    let hugeHeadList = [];
    let newObj = {};
    let url = "";

    for (let top in obj) {
      url = top;
      if (!hugeHeadList.includes(`IP`)) {
        hugeHeadList.push(`IP`);
      }
      let smallArr = [];
      smallArr.push(`${url}--URL`);
      for (let oneDeep in obj[top]) {
        newObj[oneDeep] = [];
        let apiHolderArrays = this.help(obj[top][oneDeep], oneDeep);

        for (let i = 0; i < apiHolderArrays.headListHolder.length; i++) {
          if (!hugeHeadList.includes(apiHolderArrays.headListHolder[i])) {
            hugeHeadList.push(apiHolderArrays.headListHolder[i])
          }
        }
        smallArr = smallArr.concat(apiHolderArrays.hugeValueHolder);
        newObj[oneDeep] = apiHolderArrays.headListHolder;
      }
      hugeArr.push(smallArr);
    }

    if (hugeHeadList.length > 0) {
      this.setState({
        rowList: hugeArr,
        headList: hugeHeadList,
        fullObj: newObj
      });
      this.getMenus();
    }
  }

  help = (obj, api) => {
    let headListHolder = [];
    let hugeValueHolder = [];
    for (let key in obj) {
      if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
        headListHolder.push(`${key}--${api}`);
        hugeValueHolder.push(`${JSON.stringify(obj[key])}--${api}`)
      } else {
        headListHolder.push(`${key}--${api}`);
        hugeValueHolder.push(`${obj[key]}--${api}`);
      }
    }
    return { "headListHolder": headListHolder, "hugeValueHolder": hugeValueHolder };
  }

  toggleDisplay(display) {
    this.setState({
      showMenu: display
    });
  }
  toggleDisplay2(display, menu) {
    this.state.showMenu2[menu] = display;
  }

  componentDidUpdate() {
    let that = this;
    for (let i = 0; i <= that.state.headList.length; i++) {
      if (!that.state.displayed.includes(that.state.headList[i])) {
        if (!that.state.NOTdisplayed.includes(that.state.headList[i])) {
          that.state.NOTdisplayed.push(that.state.headList[i]);
        }
        $(`.${that.state.headList[i]}`).hide();
      }
    }
  }

  getMenus() {
    for (let key in this.state.fullObj) {
      if (!this.state.menus.includes(key)) {
        this.state.menus.push(key);
        this.state.showMenu2[key] = false;
        if (this.state.displayedAPIs.includes(key)) {
          this.state.APIToggle[key] = true;
        } else {
          this.state.APIToggle[key] = false;
        }
      }
    }
  }

  handleClick(item) {
    this.state.fullObj[item].map((data, i) => {
      if (this.state.displayed.includes(data)) {
        let indexofdata = this.state.displayed.indexOf(data);
        if (indexofdata > -1) {
          this.state.displayed.splice(indexofdata, 1);
        }

        $(`.${data}`).hide("slow");

        this.state.NOTdisplayed.push(data);
      } else if (this.state.NOTdisplayed.includes(data)) {
        let indexofdata = this.state.NOTdisplayed.indexOf(data);
        if (indexofdata > -1) {
          this.state.NOTdisplayed.splice(indexofdata, 1);
        }

        $(`.${data}`).show("slow");

        this.state.displayed.push(data);
      }
    });
  }

  handleAllClick(item) {
    let arrayHolder = [];
    for (let key in this.state.apiObjectforMenu[item]) {
      arrayHolder.push(`${key}--${item}`);
    }

    if (this.state.displayedAPIs.includes(item)) {
      arrayHolder.map((data, i) => {
        let inputs = document.getElementById(item + data);

        inputs.checked = false;
        if (this.state.displayed.includes(data)) {
          let indexofdata = this.state.displayed.indexOf(data);
          if (indexofdata > -1) {
            this.state.displayed.splice(indexofdata, 1);
          }

          $(`.${data}`).hide("slow");

          this.state.NOTdisplayed.push(data);
        }
      });
      let indexofdataAPI = this.state.displayedAPIs.indexOf(item);
      this.state.displayedAPIs.splice(indexofdataAPI, 1);
      this.state.NOTdisplayedAPIs.push(item);
    } else {
      arrayHolder.map((data, i) => {
        let inputs = document.getElementById(item + data);
        inputs.checked = true;
        if (this.state.NOTdisplayed.includes(data)) {
          let indexofdata = this.state.NOTdisplayed.indexOf(data);
          if (indexofdata > -1) {
            this.state.NOTdisplayed.splice(indexofdata, 1);
          }

          $(`.${data}`).show("slow");

          this.state.displayed.push(data);
        }
      });

      let indexofdataAPInot = this.state.NOTdisplayedAPIs.indexOf(item);
      this.state.NOTdisplayedAPIs.splice(indexofdataAPInot, 1);
      this.state.displayedAPIs.push(item);
    }
  }

  render() {
    if (this.state.APIList[0] !== "") {
      return (
        <div className="column">
          <div
            className="nav"
          >
            <div className="nav-pills">
              <div
                className="btn-group dropright"
                onMouseEnter={() => this.toggleDisplay(true)}
                onMouseLeave={() => this.toggleDisplay(false)}
              >
                <a
                  role="button"
                  className="nav-link btn dropdown-toggle"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="true"
                >
                  APIs
                </a>
                <div
                  className={`dropdown-menu`}
                  style={{
                    display: this.state.showMenu ? "block" : "none",
                    position: "absolute",
                    marginLeft: "0px"
                  }}
                >
                  {this.state.menus.map((item, i) => {
                    return this.state.displayedAPIs.includes(item) ? (
                      <div
                        className=" dropdown-item"
                        href="#"
                        key={`Menu_item_${i}`}
                      >
                        {item}
                        <div
                          className="btn-group dropright downdeep"
                          onMouseEnter={() => this.toggleDisplay2(true, item)}
                          onMouseLeave={() => this.toggleDisplay2(false, item)}
                        >
                          <a
                            role="button"
                            className="nav-link btn dropdown-toggle"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="true"
                          />
                          <div
                            className={`dropdown-menu apikeys ${item}`}
                            style={{
                              display: this.state.showMenu2[item]
                                ? "block"
                                : "none",
                              position: "absolute",
                              marginLeft: "0px"
                            }}
                          >
                            <div className="dropdown-item">
                              <a className="switch tiny" key={`Menu_item_${i}`}>
                                Full API
                                <input
                                  className="switch-input"
                                  onClick={() => this.handleAllClick(item)}
                                  key={`Menu_item_${i}`}
                                  id={item}
                                  type="checkbox"
                                  name={`Switch for ${item}`}
                                  defaultChecked
                                />
                                <label
                                  className="switch-paddle"
                                  htmlFor={item}
                                />
                              </a>
                            </div>
                            <Menu
                              headList={this.state.headList}
                              item={item}
                              NOTdisplayed={this.state.NOTdisplayed}
                              displayed={this.state.displayed}
                              toggleDisplay={this.toggleDisplay.bind(this)}
                              showMenu={this.state.showMenu}
                              fullObj={this.state.fullObj[item]}
                              NOTdisplayedAPIs={this.state.NOTdisplayedAPIs}
                              displayedAPIs={this.state.displayedAPIs}
                              propbablyshouldUseThis={
                                this.state.apiObjectforMenu
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                        <div
                          className="dropdown-item"
                          href="#"
                          key={`Menu_item_${i}`}
                        >
                          {item}
                          <div
                            className="btn-group dropright downdeep"
                            onMouseEnter={() => this.toggleDisplay2(true, item)}
                            onMouseLeave={() => this.toggleDisplay2(false, item)}
                          >
                            <a
                              role="button"
                              className="nav-link btn dropdown-toggle"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="true"
                            />
                            <div
                              className={`dropdown-menu apikeys ${item}`}
                              style={{
                                display: this.state.showMenu2[item]
                                  ? "block"
                                  : "none",
                                position: "absolute"
                              }}
                            >
                              <div className="dropdown-item">
                                <a className="switch tiny" key={`Menu_item_${i}`}>
                                  Full API
                                <input
                                    className="switch-input"
                                    onClick={() => this.handleAllClick(item)}
                                    key={`Menu_item_${i}`}
                                    id={item}
                                    type="checkbox"
                                    name={`Switch for ${item}`}
                                  />
                                  <label
                                    className="switch-paddle"
                                    htmlFor={item}
                                  />
                                </a>
                              </div>
                              <Menu
                                headList={this.state.headList}
                                item={item}
                                NOTdisplayed={this.state.NOTdisplayed}
                                displayed={this.state.displayed}
                                toggleDisplay={this.toggleDisplay.bind(this)}
                                showMenu={this.state.showMenu}
                                fullObj={this.state.fullObj[item]}
                                NOTdisplayedAPIs={this.state.NOTdisplayedAPIs}
                                displayedAPIs={this.state.displayedAPIs}
                                propbablyshouldUseThis={
                                  this.state.apiObjectforMenu
                                }
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
          <div className="table-scroll" style={{marginLeft: "5em", width: "90vw"}}>
            <table>
              <thead>
                <TableNamesHolder
                  headList={this.state.headList}
                  NOTdisplayed={this.state.NOTdisplayed}
                  APIList={this.state.APIList}
                />
              </thead>

              <tbody>
                <BodyRowHolder
                  rowList={this.state.rowList}
                  headList={this.state.headList}
                  NOTdisplayed={this.state.NOTdisplayed}
                  handleClick={this.props.handleClick}
                  APIList={this.state.APIList}
                />
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  }
}

export default Table;
