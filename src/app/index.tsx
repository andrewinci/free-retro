import React from "react";
import ReactDOM from "react-dom";
import { App } from "./app";
import { wsInit } from "./ws";

//initialize the websocket
wsInit();
ReactDOM.render(<App />, document.getElementById("root"));
