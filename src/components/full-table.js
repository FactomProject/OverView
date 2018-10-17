import React, { Component } from "react";
import "../App.css";
import TableNamesHolder from "./tablenames-holder";
import BodyRowHolder from "./bodyrow-holder";
import Menu from "./menu";
import io from "socket.io-client";
import $ from "jquery";
import PropTypes from 'prop-types';

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
      OLDData: {}
    };

    this.socket = io("localhost:5001");
    this.componentDidMount = this.componentDidMount.bind(this.socket);
    this.loadFileAsText = this.loadFileAsText.bind(this.socket);

    let that = this;
    let newer_Obj = {};
    let APIList = {};

    this.socket.on("ListOfURLs", function(data) {
      for (let i = 0; i <= data.length - 1; i++) {
        newer_Obj[data[i]] = {};
      }
    });

    this.socket.on("ListOfAPIs", function(data) {
      that.setState({ APIList: data });

      APIList["APIList"] = data;
    });

    this.socket.on("APIObject", function(data) {
      for (let key in data.data) {
        that.state.apiObjectforMenu[data.api] = data.data[key][data.api];
        newer_Obj[key][data.api] = {};
        newer_Obj[key][data.api] = data.data[key][data.api];
      }
      // console.log(newer_Obj)
    });

    setInterval(function() {
      // console.log("OLDData ",that.state.OLDData);
      // console.log("NEW ", newer_Obj)
      let ObjToUse = {};
      // let isEqual = _.isEqual(that.state.OLDData, newer_Obj);
      // if (!isEqual) {
      //   console.log("OLD ",that.state.OLDData)
      //   console.log("NEW ", newer_Obj)
      // }

      for (let url in newer_Obj) {
        ObjToUse[url] = {};
        if (Object.keys(that.state.OLDData).length !== 0) {
          // console.log(`NEW, ${url} `,newer_Obj[url]['current-minute'])
          // console.log(`OLD, ${url} `,that.state.OLDData[url]['current-minute'])
        }
        // console.log(Object.keys(that.state.OLDData))
        for (let i = 0; i <= APIList.APIList.length - 1; i++) {
          ObjToUse[url][APIList.APIList[i].split("/")[0]] =
            newer_Obj[url][APIList.APIList[i].split("/")[0]];
        }
      }
      if (that.state.first) {
        that.setState({
          first: false
        })
        setTimeout(() => {
          that.setState({
            OLDData: newer_Obj
          })
          that.getConfigApiInfo(ObjToUse, APIList);
        }, 1000)
      } else {
        if (Object.keys(ObjToUse).length !== 0 ) {
          that.setState({
            OLDData: newer_Obj
          })
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
    this.emit("firstcall");
    setInterval(() => {
      this.emit("firstcall");
    }, 10000)
  }

  getConfigApiInfo(obj, APIList) {
    let hugearr = [];
    let hugeHeadList = [];
    let count = 9;
    let newObj = {};
    for (var key in obj) {
      let smallarr = [];
      smallarr.push(`${key}--URL`);
      count = 9;
      if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
        hugearr.push(smallarr);
        for (var goingDeeper in obj[key]) {
          newObj[goingDeeper] = [];
          for (var finallygettingvalues in obj[key][goingDeeper]) {
            if (
              typeof obj[key][goingDeeper][finallygettingvalues] === "object" &&
              !Array.isArray(obj[key])
            ) {
              for (let thisconfigreturnisHUGE in obj[key][goingDeeper][
                finallygettingvalues
              ]) {
                if (count !== 68) {
                  smallarr.push(
                    `${
                      obj[key][goingDeeper][finallygettingvalues][
                        thisconfigreturnisHUGE
                      ]
                    }--${goingDeeper}`
                  );
                  newObj[goingDeeper].push(
                    `${thisconfigreturnisHUGE}--${goingDeeper}`
                  );
                }
                if (
                  !hugeHeadList.includes(
                    `${thisconfigreturnisHUGE}--${goingDeeper}`
                  )
                ) {
                  hugeHeadList.push(
                    `${thisconfigreturnisHUGE}--${goingDeeper}`
                  );
                }
                count++;
              }
            } else {
              newObj[goingDeeper].push(
                `${finallygettingvalues}--${goingDeeper}`
              );
              smallarr.push(
                `${obj[key][goingDeeper][finallygettingvalues]}--${goingDeeper}`
              );
              if (
                !hugeHeadList.includes(
                  `${finallygettingvalues}--${goingDeeper}`
                )
              ) {
                hugeHeadList.push(`${finallygettingvalues}--${goingDeeper}`);
              }
            }
          }
        }
      }
    }
    
    if (hugeHeadList.length > 0 ) {
      hugeHeadList.unshift("IP");
  
      this.setState({
        rowList: hugearr,
        headList: hugeHeadList,
        fullObj: newObj
      });
      this.getMenus();
    }
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
        // document.querySelector(`.${that.state.headList[i]}`).style.visibility = "hidden";
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
        // document.querySelector(`.${data}`).style.visibility = "hidden";


        this.state.NOTdisplayed.push(data);
      } else if (this.state.NOTdisplayed.includes(data)) {
        let indexofdata = this.state.NOTdisplayed.indexOf(data);
        if (indexofdata > -1) {
          this.state.NOTdisplayed.splice(indexofdata, 1);
        }

        $(`.${data}`).show("slow");
        // document.querySelector(`.${data}`).style.visibility = "visible";

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
          // document.querySelector(`.${data}`).style.visibility = "hidden";


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
          // document.querySelector(`.${data}`).style.visibility = "visible";

          this.state.displayed.push(data);
        }
      });

      let indexofdataAPInot = this.state.NOTdisplayedAPIs.indexOf(item);
      this.state.NOTdisplayedAPIs.splice(indexofdataAPInot, 1);
      this.state.displayedAPIs.push(item);
    }
  }

  loadFileAsText = () => {
    var fileToLoad = document.getElementById("fileToLoad").files[0];

    var fileReader = new FileReader();
    let that = this;
    fileReader.onload = function(fileLoadedEvent) {
      var textFromFileLoaded = fileLoadedEvent.target.result;
      let split = textFromFileLoaded.split("\n");

      var regex = /\[(.*?)\]/;
      let IPLIST = regex
        .exec(split[0])[1]
        .replace(/'/g, "")
        .split(",");
      let APILIST = regex
        .exec(split[2])[1]
        .replace(/'/g, "")
        .split(",");

      console.log(textFromFileLoaded);
      console.log("IPLIST ", IPLIST);
      console.log("APILIST ", APILIST);

      for (let i = 0; i < IPLIST.length; i++) {
        if (IPLIST[i].indexOf(':') === -1) {
          IPLIST[i] = `${IPLIST[i]}:8088`;
        }
      }

      that.setState({ APIList: APILIST });
      that.socket.emit("firstcall", {
        ListOfURLs: IPLIST,
        ListOfAPIs: APILIST
      });

      setInterval(() => {
        that.socket.emit("firstcall", {
          ListOfURLs: IPLIST,
          ListOfAPIs: APILIST
        });
      }, 25000);
    };

    fileReader.readAsText(fileToLoad, "UTF-8");
  };

  render() {
    if (this.state.APIList[0] !== "") {
      return (
        <div className="column">
          <div
            className="nav"
            style={{ marginBottom: this.state.showMenu ? "11vh" : "5vh" }}
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
          <table className="hover scroll">
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
      );
    }
  }
}

export default Table;

Table.propTypes = {
  headList: PropTypes.array,
  displayed: PropTypes.array,
  displayedAPIs: PropTypes.array,
  NOTdisplayedAPIs: PropTypes.array,
  NOTdisplayed: PropTypes.array,
  rowList: PropTypes.array,
  showMenu: PropTypes.bool,
  showMenu2: PropTypes.object,
  fullObj: PropTypes.object,
  menus: PropTypes.array,
  APIToggle: PropTypes.object,
  APIList: PropTypes.array,
  apiObjectforMenu: PropTypes.object,
  first: PropTypes.bool,
  OLDData: PropTypes.object
}