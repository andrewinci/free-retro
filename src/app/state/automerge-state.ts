import * as Automerge from "automerge";
import { toBinaryDocument } from "../helper/binary-document";
import { randomId } from "../helper/random";
import { broadcast } from "../ws";
import { ActionState, AppState, Stage } from "./model";

const observable = new Automerge.Observable();
let appState: AppState;

export const getAppState = () => {
  if (appState) return appState;
  throw new Error("AppState not initialized");
};

export const initAppState = (
  sessionId: string | null,
  stage: Stage,
  actions: ActionState[] | undefined = undefined
) => {
  appState = Automerge.change(
    Automerge.init<AppState>({ observable }),
    (state) => {
      // set initial values
      state.sessionId = sessionId ?? randomId();
      state.stage = stage;
      if (actions) {
        state.actions = actions.map((a) => ({
          id: a.id,
          text: a.text,
          done: a.done,
          date: a.date,
        }));
      }
    }
  );
  return appState;
};

export function onStateChange(f: (newState: AppState) => void) {
  observable.observe(appState, (a, b, newState) => {
    f(newState);
  });
}

export async function changeState(
  f: (mutableState: AppState) => void,
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
  // check if a new state need to be created
  if (recreateState) {
    initAppState(remoteState.sessionId, remoteState.stage, remoteState.actions);
  }
  appState = Automerge.merge(appState, remoteState);
  // if the id of the first column is empty, set the id to all columns
  // with the current index to maintain retro-compatibility with
  // previous versions of the app
  if (
    appState.columns &&
    appState.columns.length > 0 &&
    !appState.columns[0].id
  ) {
    appState = Automerge.change(appState, (state) => {
      if (!state.columns) return;
      for (let i = 0; i < state.columns.length; i++) {
        state.columns[i].id = i.toString();
      }
    });
  }
}
