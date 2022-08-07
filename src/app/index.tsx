import ReactDOM from "react-dom";
import { App } from "./app";
import { initUserId } from "./state";
import { initAppState } from "./state/automerge-state";
import { wsInit } from "./ws";

// check if the sessionId is available in the url hash
const sessionId = location.hash.length > 1 ? location.hash.substring(1) : null;

// init the application state
const state = initAppState(sessionId);
location.hash = state.sessionId;

// init the websocket
wsInit();

// init the userId
initUserId();

// render App
ReactDOM.render(<App />, document.getElementById("root"));
