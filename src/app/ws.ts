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
        loadNewState(serverMessage.state);
        break;
      case "error":
        console.error("Error from the server", serverMessage);
        break;
    }
  });
}

export async function joinSession(sessionId: string) {
  console.log("WS Join session");
  const joinMessage: JoinMessage = {
    action: "join",
    sessionId: sessionId,
  };
  socket.send(JSON.stringify(joinMessage));
}

export async function broadcast<T>(sessionId: string, state: T) {
  const rawState = Automerge.save(state);
  const broadcastMessage: BroadcastMessage = {
    action: "broadcast",
    sessionId: sessionId,
    state: toBase64(rawState),
  };
  socket.send(JSON.stringify(broadcastMessage));
}
