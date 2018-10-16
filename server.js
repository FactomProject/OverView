const bodyParser = require("body-parser");
const path = require("path");
const express = require("express");
const socket = require("socket.io");
const axios = require("axios");
const SocksClient = require('socks').SocksClient;
// const SocksProxyAgent = require('socks-proxy-agent');
// const url = require('url');
const Http = require('http');
var shttp = require('socks5-http-client');


require("dotenv").config();

var app = express();
app.use(express.static(path.join(__dirname, "dist")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

server = app.listen(5001, function() {
  console.log("server is running on port 5001");
});

var http = require("http");

var request = require('request');
var Agent = require('socks5-http-client/lib/Agent');

// let ipList = [];
// let apisList = [];

var regex = /\[(.*?)\]/;

let ipList = regex.exec(process.env.IPLIST)[1].replace(/'/g, '').split(",");
for (let i = 0; i < ipList.length; i++) {
    if (ipList[i].indexOf(':') === -1) {
        ipList[i] = `${ipList[i]}:8088`;
    }
  }
let apisList = regex.exec(process.env.APILIST)[1].replace(/'/g, '').split(",");

let connections = [];

io = socket(server);

io.on("connection", socket => {
  connections.push(socket);

  socket.on("firstcall", () => {
    io.to(socket.id).emit("ListOfURLs", ipList);
    io.to(socket.id).emit("ListOfAPIs", apisList);
    loopIPs(socket.id);
  });

  socket.on("allothercalls", () => {
    loopIPs(socket.id);
  });

  socket.on("disconnect", data => {
    connections.splice(connections.indexOf(socket), 1);
  });

  apis = (url, endpoint, method, socketid) => {
    // request.post({
    //     url: `http://${url}/${endpoint}`,
    //     agentClass: Agent,
    //     agentOptions: {
    //         // socksHost: 'my-tor-proxy-host', // Defaults to 'localhost'.
    //         socksPort: 8125 // Defaults to 1080.
    //     },
    //     headers: {
    //         'Content-Type': 'application/json' 
    //     },
    //     body: { jsonrpc: '2.0', id: 0, method: `${method}` },
    //     json: true
    //     }, function(err, res) {
    //         if (err) {
    //             let Obj = {};
    //             Obj[url] = {};
    //             Obj[url][method] = {};
    //             io.to(socketid).emit("APIObject", { data: Obj, api: method });
    //             console.log("Error ", err)
    //         } else {
    //             let Obj = {};
    //             Obj[url] = {};
    //             Obj[url][method] = res.body.result;

    //             io.to(socketid).emit("APIObject", { data: Obj, api: method });
    //         }
    //     }
    // )
    axios({
      method: "post",
      url: `http://${url}/${endpoint}`,
      data: {
        jsonrpc: "2.0",
        id: 0,
        method: `${method}`
      }
    })
      .then(response => {
        let Obj = {};
        Obj[url] = {};
        Obj[url][method] = response.data.result;

        io.to(socketid).emit("APIObject", { data: Obj, api: method });
      })
      .catch(response => {
        let Obj = {};
        Obj[url] = {};
        Obj[url][method] = {};
        io.to(socketid).emit("APIObject", { data: Obj, api: method });
      });
  };

  loopIPs = socketid => {
    for (let j = 0; j <= apisList.length - 1; j++) {
      for (let i = 0; i <= ipList.length - 1; i++) {
        let splitUp = apisList[j].split("/");
        apis(ipList[i], splitUp[1], splitUp[0], socketid);
      }
    }
  };
});
