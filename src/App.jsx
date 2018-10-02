import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Table from "./components/full-table";
import io from "socket.io-client";
import FileInput from "./components/file-input";
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

  componentDidMount() {
    this.socket = io("localhost:5001");
    this.socket.emit("firstcall");
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Information Display</h1>
        </header>
        <div className="row">
          <Table
            rowList={this.state.colVals}
            displayed={this.state.displayed}
          />
        </div>
        <FileInput />
      </div>
    );
  }
}
export default App;
