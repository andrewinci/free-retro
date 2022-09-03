import * as Automerge from "automerge";
import {
  BroadcastMessage,
  JoinMessage,
  WSServerMessage,
} from "../lambda/model";
import { loadNewState } from "./state/automerge-state";
import { toBase64 } from "./state/helper";

const ENDPOINT = "wss:///ws.retroapp.amaker.xyz";
let socket = new WebSocket(ENDPOINT);
let lastSessionId = "";

const checkConnection = async () => {
  // if disconnected, try to connect before sending the message
  if (
    socket.readyState == socket.CLOSED ||
    socket.readyState == socket.CLOSING
  ) {
    console.log("Socket is closed. Try to reconnect...");
    await wsInit();
    if (lastSessionId) joinSession(lastSessionId);
  }
};

// check the connection is open every 1s
setInterval(() => checkConnection(), 1000);

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
        default:
          console.error(`Invalid server message received`, serverMessage);
      }
    });

    socket.addEventListener("error", (e) => {
      console.error("Socket encountered error: ", e, "Closing socket");
      socket.close();
    });
  });

export function joinSession(sessionId: string) {
  console.log("WS Join session");
  lastSessionId = sessionId;
  const joinMessage: JoinMessage = {
    action: "join",
    sessionId,
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
  lastSessionId = sessionId;
  console.log("Broadcast", state);
  const rawState = Automerge.save(state);
  const broadcastMessage: BroadcastMessage = {
    action: "broadcast",
    sessionId,
    state: toBase64(rawState),
    recreateState,
  };
  await checkConnection();
  socket.send(JSON.stringify(broadcastMessage));
}
