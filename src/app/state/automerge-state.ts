import * as Automerge from "automerge";
import { toBinaryDocument } from "../helper/binary-document";
import { randomId } from "../helper/random";
import { broadcast } from "../ws";
import { AppState, Stage } from "./model";

const observable = new Automerge.Observable();
let appState: AppState;

export const getAppState = () => {
  if (appState) return appState;
  throw new Error("AppState not initialized");
};

export const initAppState = (sessionId: string | null, stage: Stage) => {
  appState = Automerge.change(
    Automerge.init<AppState>({ observable }),
    (state) => {
      // set initial values
      state.sessionId = sessionId ?? randomId();
      state.stage = stage;
    }
  );
  return appState;
};

export function onStateChange(f: (newState: AppState) => void) {
  observable.observe(appState, (a, b, newState) => f(newState));
}

export async function changeState(
  f: (state: AppState) => void,
  recreateState = false
) {
  appState = Automerge.change(appState, (s) => f(s));
  // broadcast to all clients
  await broadcast(appState.sessionId, appState, recreateState);
}

export function loadNewState(remoteRawState: string, recreateState: boolean) {
  const remoteState = Automerge.load<AppState>(
    toBinaryDocument(remoteRawState)
  );
  if (recreateState) {
    initAppState(remoteState.sessionId, remoteState.stage);
  }
  appState = Automerge.merge(appState, remoteState);
}
