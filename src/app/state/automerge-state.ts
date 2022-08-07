import * as Automerge from "automerge";
import { toBase64, toBinaryDocument } from "../helper/binary-document";
import { randomId } from "../helper/random";
import { broadcast } from "../ws";
import { AppState, Stage } from "./model";

const LOCAL_STATE_KEY = "free-retro:state";

const observable = new Automerge.Observable();
let appState: AppState;

export const getAppState = () => {
  if (appState) return appState;
  throw new Error("AppState not initialized");
};

export const initAppState = (sessionId: string | null) => {
  if (appState) return appState;
  appState = Automerge.change(
    Automerge.init<AppState>({ observable }),
    (state) => {
      // set initial values
      state.sessionId = sessionId ?? randomId();
      state.stage = sessionId ? Stage.Join : Stage.Create;
    }
  );
  return appState;
};

export function onStateChange(f: (newState: AppState) => void) {
  observable.observe(appState, (a, b, newState) => f(newState));
}

export async function changeState(f: (state: AppState) => void) {
  appState = Automerge.change(appState, (s) => f(s));
  // broadcast to all clients
  await broadcast(appState.sessionId, appState);
  localStorage.setItem(LOCAL_STATE_KEY, toBase64(Automerge.save(appState)));
}

export function loadNewState(remoteRawState: string) {
  const remoteState = Automerge.load<AppState>(
    toBinaryDocument(remoteRawState)
  );
  appState = Automerge.merge(appState, remoteState);
  localStorage.setItem(LOCAL_STATE_KEY, remoteRawState);
}
