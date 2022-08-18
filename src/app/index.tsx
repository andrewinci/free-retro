import { createRoot } from "react-dom/client";
import { App } from "./app";
import { initUserId, Stage } from "./state";
import { initAppState } from "./state/automerge-state";
import { wsInit } from "./ws";

// check if the sessionId is available in the url hash
const sessionId = location.hash.length > 1 ? location.hash.substring(1) : null;
// if no session Id is specified, the stage is Create
const stage = sessionId == null ? Stage.Create : Stage.Join;
// init the application state
const state = initAppState(sessionId, stage);
location.hash = state.sessionId;

// init the websocket
//todo: make sure
wsInit();

// init the userId
initUserId();

// render App
const container = document.getElementById("root");
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(<App />);
