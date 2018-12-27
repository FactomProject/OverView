import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Table from "./components/full-table";
import NavBar from "./components/nav-bar";
import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colVals: [],
      displayed: [
        "IP",
        "directoryblockheight--heights",
        "leaderheight--heights",
        "entryblockheight--heights",
        "entryheight--heights",
        "NetworkNumber--network-info",
        "NetworkName--network-info",
        "NetworkID--network-info",
        "leaderheight--current-minute",
        "directoryblockheight--current-minute",
        "minute--current-minute",
        "currentblockstarttime--current-minute",
        "currentminutestarttime--current-minute",
        "currenttime--current-minute",
        "directoryblockinseconds--current-minute",
        "stalldetected--current-minute"
      ]
    };
  }

  isSignedIn = googleIsh => {
    this.setState({
      Google: googleIsh
    });
  };

  Main = () => {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Information Display</h1>
        </header>
        <div className="row" style={{marginLeft: "0px", marginRight: "10px"}}>
          <Table
            rowList={this.state.colVals}
            displayed={this.state.displayed}
          />
        </div>
      </div>
    );
  };

  render() {
    return (
      <div>
        <Router>
          <div>
            <NavBar isSignedIn={this.isSignedIn.bind(this)} />
            <hr />
            <Route exact={true} path="/" component={this.Main} />
          </div>
        </Router>
      </div>
    );
  }
}
export default App;
