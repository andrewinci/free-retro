import * as Automerge from "automerge";
import {
  BroadcastMessage,
  JoinMessage,
  WSServerMessage,
} from "../lambda/model";
import { toBase64 } from "./helper/binary-document";
import { loadNewState } from "./state/automerge-state";

const ENDPOINT = "wss:///ws.retroapp.amaker.xyz";

let socket = new WebSocket(ENDPOINT);

export const wsInit = () =>
  new Promise<void>((resolve) => {
    socket = new WebSocket(ENDPOINT);

    socket.addEventListener("open", (_) => {
      console.log("WSocket open");
      resolve();
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

    socket.addEventListener("error", (e) => {
      console.error("Socket encountered error: ", e, "Closing socket");
      socket.close();
    });
  });

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
export async function broadcast<T>(
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
  // if disconnected, try to connect before sending the message
  if (
    socket.readyState == socket.CLOSED ||
    socket.readyState == socket.CLOSING
  ) {
    console.log("Socket is closed. Try to reconnect...");
    await wsInit();
    joinSession(sessionId);
  }
  socket.send(JSON.stringify(broadcastMessage));
}
