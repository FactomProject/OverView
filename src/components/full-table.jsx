import React, { Component } from "react";
// import "../App.css";
import TableNamesHolder from "./tablenames-holder";
import BodyRowHolder from "./bodyrow-holder";
import Menu from "./menu";
import io from "socket.io-client";
import $ from "jquery";
import DataTable from "datatables";

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

    // this.socket = io("ec2-18-221-211-55.us-east-2.compute.amazonaws.com:5001");
    // this.socketAWS = io("ec2-18-221-211-55.us-east-2.compute.amazonaws.com:5001");
    this.socket = io("localhost:5001");

    // this.socketAWS.emit("hello", "Hello, World");
    // this.socketAWS.on("back", data => {
    //   console.log("FROM SERVER: ", data)
    // })

    this.componentDidMount = this.componentDidMount.bind(this.socket);
    this.loadFileAsText = this.loadFileAsText.bind(this.socket);

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
      // console.log(newer_Obj)
    });

    setInterval(function () {
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

        // function objHasUndefined() {
        //   let count = false;
        //   for (let key in ObjToUse) {
        //     for (let key2 in ObjToUse[key]) {
        //       if (ObjToUse[key][key2] === undefined) {
        //         count = true;
        //       }
        //     }
        //   }
        //   return count;
        // }
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
    }, 20000);
    $(document).ready(function () {
      $('#example').DataTable({
        "paging": false,
        "ordering": false,
        "info": false
      });
    });
  }

  getConfigApiInfo(obj, APIList) {
    // let hugearr = [];
    // let hugeHeadList = [];
    // let count = 9;
    // let newObj = {};
    // for (var key in obj) {
    //   let smallarr = [];
    //   smallarr.push(`${key}--URL`);
    //   count = 9;
    //   if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
    //     hugearr.push(smallarr);
    //     for (var goingDeeper in obj[key]) {
    //       newObj[goingDeeper] = [];
    //       for (var finallygettingvalues in obj[key][goingDeeper]) {
    //         if (typeof obj[key][goingDeeper][finallygettingvalues] === "object" && !Array.isArray(obj[key])) {
    //           for (let thisconfigreturnisHUGE in obj[key][goingDeeper][finallygettingvalues]) {
    //             if (count !== 68) {
    //               smallarr.push(`${obj[key][goingDeeper][finallygettingvalues][thisconfigreturnisHUGE]}--${goingDeeper}`);
    //               newObj[goingDeeper].push(`${thisconfigreturnisHUGE}--${goingDeeper}`);
    //             }
    //             if (!hugeHeadList.includes(`${thisconfigreturnisHUGE}--${goingDeeper}`)) {
    //               hugeHeadList.push(`${thisconfigreturnisHUGE}--${goingDeeper}`);
    //             }
    //             count++;
    //           }
    //         } else {
    //           newObj[goingDeeper].push(`${finallygettingvalues}--${goingDeeper}`);
    //           smallarr.push(`${obj[key][goingDeeper][finallygettingvalues]}--${goingDeeper}`);
    //           if (!hugeHeadList.includes(`${finallygettingvalues}--${goingDeeper}`)) {
    //             hugeHeadList.push(`${finallygettingvalues}--${goingDeeper}`);
    //           }
    //         }
    //       }
    //     }
    //   }
    //   // console.log(hugearr, hugeHeadList)
    //   // console.log(APIList.APIList.length, objcheckFunc())
    // }

    // function objcheckFunc() {
    //   count = 0;
    //   for (let key in newObj) {
    //     if (newObj[key].length > 0) {
    //       count++;
    //     }
    //   }
    //   return count;
    // }

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
      // hugeHeadList.unshift("IP");

      // console.log("hugearr: ", hugearr);
      // console.log("hugeHeadList: ", hugeHeadList);
      // console.log("newObj: ", newObj)
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
        console.log("arrayHolder data: ", item, data)
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

  loadFileAsText = () => {
    var fileToLoad = document.getElementById("fileToLoad").files[0];

    var fileReader = new FileReader();
    let that = this;
    fileReader.onload = function (fileLoadedEvent) {
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
        if (IPLIST[i].indexOf(":") === -1) {
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
          {/* <table className="hover scroll">
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
          </table> */}
          <table id="example" className="display" style={{ width: "100%", display: "block", width: "95%", marginLeft: "auto", marginRight: "auto" }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Office</th>
                <th>Age</th>
                <th>Start date</th>
                <th>Salary</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tiger Nixon</td>
                <td>System Architect</td>
                <td>Edinburgh</td>
                <td>61</td>
                <td>2011/04/25</td>
                <td>$320,800</td>
              </tr>
              <tr>
                <td>Garrett Winters</td>
                <td>Accountant</td>
                <td>Tokyo</td>
                <td>63</td>
                <td>2011/07/25</td>
                <td>$170,750</td>
              </tr>
              <tr>
                <td>Ashton Cox</td>
                <td>Junior Technical Author</td>
                <td>San Francisco</td>
                <td>66</td>
                <td>2009/01/12</td>
                <td>$86,000</td>
              </tr>
              <tr>
                <td>Cedric Kelly</td>
                <td>Senior Javascript Developer</td>
                <td>Edinburgh</td>
                <td>22</td>
                <td>2012/03/29</td>
                <td>$433,060</td>
              </tr>
              <tr>
                <td>Airi Satou</td>
                <td>Accountant</td>
                <td>Tokyo</td>
                <td>33</td>
                <td>2008/11/28</td>
                <td>$162,700</td>
              </tr>
              <tr>
                <td>Brielle Williamson</td>
                <td>Integration Specialist</td>
                <td>New York</td>
                <td>61</td>
                <td>2012/12/02</td>
                <td>$372,000</td>
              </tr>
              <tr>
                <td>Herrod Chandler</td>
                <td>Sales Assistant</td>
                <td>San Francisco</td>
                <td>59</td>
                <td>2012/08/06</td>
                <td>$137,500</td>
              </tr>
              <tr>
                <td>Rhona Davidson</td>
                <td>Integration Specialist</td>
                <td>Tokyo</td>
                <td>55</td>
                <td>2010/10/14</td>
                <td>$327,900</td>
              </tr>
              <tr>
                <td>Colleen Hurst</td>
                <td>Javascript Developer</td>
                <td>San Francisco</td>
                <td>39</td>
                <td>2009/09/15</td>
                <td>$205,500</td>
              </tr>
              <tr>
                <td>Sonya Frost</td>
                <td>Software Engineer</td>
                <td>Edinburgh</td>
                <td>23</td>
                <td>2008/12/13</td>
                <td>$103,600</td>
              </tr>
              <tr>
                <td>Jena Gaines</td>
                <td>Office Manager</td>
                <td>London</td>
                <td>30</td>
                <td>2008/12/19</td>
                <td>$90,560</td>
              </tr>
              <tr>
                <td>Quinn Flynn</td>
                <td>Support Lead</td>
                <td>Edinburgh</td>
                <td>22</td>
                <td>2013/03/03</td>
                <td>$342,000</td>
              </tr>
              <tr>
                <td>Charde Marshall</td>
                <td>Regional Director</td>
                <td>San Francisco</td>
                <td>36</td>
                <td>2008/10/16</td>
                <td>$470,600</td>
              </tr>
              <tr>
                <td>Haley Kennedy</td>
                <td>Senior Marketing Designer</td>
                <td>London</td>
                <td>43</td>
                <td>2012/12/18</td>
                <td>$313,500</td>
              </tr>
              <tr>
                <td>Tatyana Fitzpatrick</td>
                <td>Regional Director</td>
                <td>London</td>
                <td>19</td>
                <td>2010/03/17</td>
                <td>$385,750</td>
              </tr>
              <tr>
                <td>Michael Silva</td>
                <td>Marketing Designer</td>
                <td>London</td>
                <td>66</td>
                <td>2012/11/27</td>
                <td>$198,500</td>
              </tr>
              <tr>
                <td>Paul Byrd</td>
                <td>Chief Financial Officer (CFO)</td>
                <td>New York</td>
                <td>64</td>
                <td>2010/06/09</td>
                <td>$725,000</td>
              </tr>
              <tr>
                <td>Gloria Little</td>
                <td>Systems Administrator</td>
                <td>New York</td>
                <td>59</td>
                <td>2009/04/10</td>
                <td>$237,500</td>
              </tr>
              <tr>
                <td>Bradley Greer</td>
                <td>Software Engineer</td>
                <td>London</td>
                <td>41</td>
                <td>2012/10/13</td>
                <td>$132,000</td>
              </tr>
              <tr>
                <td>Dai Rios</td>
                <td>Personnel Lead</td>
                <td>Edinburgh</td>
                <td>35</td>
                <td>2012/09/26</td>
                <td>$217,500</td>
              </tr>
              <tr>
                <td>Jenette Caldwell</td>
                <td>Development Lead</td>
                <td>New York</td>
                <td>30</td>
                <td>2011/09/03</td>
                <td>$345,000</td>
              </tr>
              <tr>
                <td>Yuri Berry</td>
                <td>Chief Marketing Officer (CMO)</td>
                <td>New York</td>
                <td>40</td>
                <td>2009/06/25</td>
                <td>$675,000</td>
              </tr>
              <tr>
                <td>Caesar Vance</td>
                <td>Pre-Sales Support</td>
                <td>New York</td>
                <td>21</td>
                <td>2011/12/12</td>
                <td>$106,450</td>
              </tr>
              <tr>
                <td>Doris Wilder</td>
                <td>Sales Assistant</td>
                <td>Sidney</td>
                <td>23</td>
                <td>2010/09/20</td>
                <td>$85,600</td>
              </tr>
              <tr>
                <td>Angelica Ramos</td>
                <td>Chief Executive Officer (CEO)</td>
                <td>London</td>
                <td>47</td>
                <td>2009/10/09</td>
                <td>$1,200,000</td>
              </tr>
              <tr>
                <td>Gavin Joyce</td>
                <td>Developer</td>
                <td>Edinburgh</td>
                <td>42</td>
                <td>2010/12/22</td>
                <td>$92,575</td>
              </tr>
              <tr>
                <td>Jennifer Chang</td>
                <td>Regional Director</td>
                <td>Singapore</td>
                <td>28</td>
                <td>2010/11/14</td>
                <td>$357,650</td>
              </tr>
              <tr>
                <td>Brenden Wagner</td>
                <td>Software Engineer</td>
                <td>San Francisco</td>
                <td>28</td>
                <td>2011/06/07</td>
                <td>$206,850</td>
              </tr>
              <tr>
                <td>Fiona Green</td>
                <td>Chief Operating Officer (COO)</td>
                <td>San Francisco</td>
                <td>48</td>
                <td>2010/03/11</td>
                <td>$850,000</td>
              </tr>
              <tr>
                <td>Shou Itou</td>
                <td>Regional Marketing</td>
                <td>Tokyo</td>
                <td>20</td>
                <td>2011/08/14</td>
                <td>$163,000</td>
              </tr>
              <tr>
                <td>Michelle House</td>
                <td>Integration Specialist</td>
                <td>Sidney</td>
                <td>37</td>
                <td>2011/06/02</td>
                <td>$95,400</td>
              </tr>
              <tr>
                <td>Suki Burks</td>
                <td>Developer</td>
                <td>London</td>
                <td>53</td>
                <td>2009/10/22</td>
                <td>$114,500</td>
              </tr>
              <tr>
                <td>Prescott Bartlett</td>
                <td>Technical Author</td>
                <td>London</td>
                <td>27</td>
                <td>2011/05/07</td>
                <td>$145,000</td>
              </tr>
              <tr>
                <td>Gavin Cortez</td>
                <td>Team Leader</td>
                <td>San Francisco</td>
                <td>22</td>
                <td>2008/10/26</td>
                <td>$235,500</td>
              </tr>
              <tr>
                <td>Martena Mccray</td>
                <td>Post-Sales support</td>
                <td>Edinburgh</td>
                <td>46</td>
                <td>2011/03/09</td>
                <td>$324,050</td>
              </tr>
              <tr>
                <td>Unity Butler</td>
                <td>Marketing Designer</td>
                <td>San Francisco</td>
                <td>47</td>
                <td>2009/12/09</td>
                <td>$85,675</td>
              </tr>
              <tr>
                <td>Howard Hatfield</td>
                <td>Office Manager</td>
                <td>San Francisco</td>
                <td>51</td>
                <td>2008/12/16</td>
                <td>$164,500</td>
              </tr>
              <tr>
                <td>Hope Fuentes</td>
                <td>Secretary</td>
                <td>San Francisco</td>
                <td>41</td>
                <td>2010/02/12</td>
                <td>$109,850</td>
              </tr>
              <tr>
                <td>Vivian Harrell</td>
                <td>Financial Controller</td>
                <td>San Francisco</td>
                <td>62</td>
                <td>2009/02/14</td>
                <td>$452,500</td>
              </tr>
              <tr>
                <td>Timothy Mooney</td>
                <td>Office Manager</td>
                <td>London</td>
                <td>37</td>
                <td>2008/12/11</td>
                <td>$136,200</td>
              </tr>
              <tr>
                <td>Jackson Bradshaw</td>
                <td>Director</td>
                <td>New York</td>
                <td>65</td>
                <td>2008/09/26</td>
                <td>$645,750</td>
              </tr>
              <tr>
                <td>Olivia Liang</td>
                <td>Support Engineer</td>
                <td>Singapore</td>
                <td>64</td>
                <td>2011/02/03</td>
                <td>$234,500</td>
              </tr>
              <tr>
                <td>Bruno Nash</td>
                <td>Software Engineer</td>
                <td>London</td>
                <td>38</td>
                <td>2011/05/03</td>
                <td>$163,500</td>
              </tr>
              <tr>
                <td>Sakura Yamamoto</td>
                <td>Support Engineer</td>
                <td>Tokyo</td>
                <td>37</td>
                <td>2009/08/19</td>
                <td>$139,575</td>
              </tr>
              <tr>
                <td>Thor Walton</td>
                <td>Developer</td>
                <td>New York</td>
                <td>61</td>
                <td>2013/08/11</td>
                <td>$98,540</td>
              </tr>
              <tr>
                <td>Finn Camacho</td>
                <td>Support Engineer</td>
                <td>San Francisco</td>
                <td>47</td>
                <td>2009/07/07</td>
                <td>$87,500</td>
              </tr>
              <tr>
                <td>Serge Baldwin</td>
                <td>Data Coordinator</td>
                <td>Singapore</td>
                <td>64</td>
                <td>2012/04/09</td>
                <td>$138,575</td>
              </tr>
              <tr>
                <td>Zenaida Frank</td>
                <td>Software Engineer</td>
                <td>New York</td>
                <td>63</td>
                <td>2010/01/04</td>
                <td>$125,250</td>
              </tr>
              <tr>
                <td>Zorita Serrano</td>
                <td>Software Engineer</td>
                <td>San Francisco</td>
                <td>56</td>
                <td>2012/06/01</td>
                <td>$115,000</td>
              </tr>
              <tr>
                <td>Jennifer Acosta</td>
                <td>Junior Javascript Developer</td>
                <td>Edinburgh</td>
                <td>43</td>
                <td>2013/02/01</td>
                <td>$75,650</td>
              </tr>
              <tr>
                <td>Cara Stevens</td>
                <td>Sales Assistant</td>
                <td>New York</td>
                <td>46</td>
                <td>2011/12/06</td>
                <td>$145,600</td>
              </tr>
              <tr>
                <td>Hermione Butler</td>
                <td>Regional Director</td>
                <td>London</td>
                <td>47</td>
                <td>2011/03/21</td>
                <td>$356,250</td>
              </tr>
              <tr>
                <td>Lael Greer</td>
                <td>Systems Administrator</td>
                <td>London</td>
                <td>21</td>
                <td>2009/02/27</td>
                <td>$103,500</td>
              </tr>
              <tr>
                <td>Jonas Alexander</td>
                <td>Developer</td>
                <td>San Francisco</td>
                <td>30</td>
                <td>2010/07/14</td>
                <td>$86,500</td>
              </tr>
              <tr>
                <td>Shad Decker</td>
                <td>Regional Director</td>
                <td>Edinburgh</td>
                <td>51</td>
                <td>2008/11/13</td>
                <td>$183,000</td>
              </tr>
              <tr>
                <td>Michael Bruce</td>
                <td>Javascript Developer</td>
                <td>Singapore</td>
                <td>29</td>
                <td>2011/06/27</td>
                <td>$183,000</td>
              </tr>
              <tr>
                <td>Donna Snider</td>
                <td>Customer Support</td>
                <td>New York</td>
                <td>27</td>
                <td>2011/01/25</td>
                <td>$112,000</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Office</th>
                <th>Age</th>
                <th>Start date</th>
                <th>Salary</th>
              </tr>
            </tfoot>
          </table>
        </div>
      );
    }
  }
}

export default Table;
