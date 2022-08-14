import * as Automerge from "automerge";
import {
  BroadcastMessage,
  JoinMessage,
  WSServerMessage,
} from "../lambda/model";
import { toBase64 } from "./helper/binary-document";
import { loadNewState } from "./state/automerge-state";

const ENDPOINT = "wss:///ws.retroapp.amaker.xyz";

const socket = new WebSocket(ENDPOINT);

export function wsInit() {
  socket.addEventListener("open", (_) => {
    console.log("WSocket open");
  });

  socket.addEventListener("message", (event) => {
    const serverMessage = JSON.parse(event.data) as WSServerMessage;
    switch (serverMessage.action) {
      case "update":
        loadNewState(serverMessage.state, serverMessage.recreateState);
        break;
      case "error":
        console.error("Error from the server", serverMessage);
        alert("Retro not found, try to create a new one.");
        location.href = "/";
        break;
    }
  });
}

export function joinSession(sessionId: string) {
  console.log("WS Join session");
  const joinMessage: JoinMessage = {
    action: "join",
    sessionId: sessionId,
  };
  socket.send(JSON.stringify(joinMessage));
}

// broadcast the state to other clients in the same session
// if recreateState is true, force the other client to drop the
// current state and set the broadcasted one
export function broadcast<T>(
  sessionId: string,
  state: T,
  recreateState: boolean
) {
  const rawState = Automerge.save(state);
  const broadcastMessage: BroadcastMessage = {
    action: "broadcast",
    sessionId: sessionId,
    state: toBase64(rawState),
    recreateState,
  };
  socket.send(JSON.stringify(broadcastMessage));
}
