import React, { Component } from "react";
import "../App.css";
import $ from "jquery";

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      NOTdisplayed: [],
      displayed: this.props.displayed,
      displayedAPIs: this.props.displayedAPIs,
      headList: [],
      showMenu: false,
      showMenu2: {},
      fullObj: {},
      menus: [],
      propbablyshouldUseThis: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      NOTdisplayed: nextProps.NOTdisplayed,
      headList: nextProps.headList,
      showMenu: nextProps.showMenu,
      fullObj: nextProps.fullObj,
      propbablyshouldUseThis: nextProps.propbablyshouldUseThis
    });
  }

  toggleDisplay(display) {
    this.setState({
      showMenu: display
    });
  }
  toggleDisplay2(display, menu) {
    this.state.showMenu2[menu] = display;
  }

  getMenus() {
    for (let key in this.state.fullObj) {
      if (!this.state.menus.includes(key)) {
        this.state.menus.push(key);
        this.state.showMenu2[key] = false;
      }
    }
  }

  handleClick(data) {
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
  }

  render() {
    if (
      this.props.fullObj === undefined ||
      this.props.NOTdisplayedAPIs === undefined
    ) {
      return null;
    } else {
      return !this.props.displayedAPIs.includes(this.props.item)
        ? this.props.headList.map(
            (item, i) =>
              item.split("--")[1] === this.props.item ? (
                <div className="dropdown-item" href="#" key={`Menu_item_${i}`}>
                  {item.split("--")[0]}
                  <a className="switch tiny" key={`Menu_item_${i}`}>
                    <input
                      className="switch-input"
                      onClick={() => this.handleClick(item)}
                      key={`Menu_item_${i}`}
                      id={this.props.item + item}
                      type="checkbox"
                      name={`Switch for ${item}`}
                    />
                    <label
                      className="switch-paddle ish"
                      htmlFor={this.props.item + item}
                    />
                  </a>
                </div>
              ) : null
          )
        : this.props.headList.map(
            (item, i) =>
              item.split("--")[1] === this.props.item ? (
                <div className="dropdown-item" href="#" key={`Menu_item_${i}`}>
                  {item.split("--")[0]}
                  <a className="switch tiny" key={`Menu_item_${i}`}>
                    <input
                      className="switch-input"
                      onClick={() => this.handleClick(item)}
                      key={`Menu_item_${i}`}
                      id={this.props.item + item}
                      type="checkbox"
                      name={`Switch for ${item}`}
                      defaultChecked
                    />
                    <label
                      className="switch-paddle ish"
                      htmlFor={this.props.item + item}
                    />
                  </a>
                </div>
              ) : null
          );
    }
  }
}

export default Menu;
