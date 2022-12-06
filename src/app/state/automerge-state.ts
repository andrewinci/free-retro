import * as Automerge from "@automerge/automerge";
import { toBinaryDocument } from "./helper";
import { randomId } from "./helper/random";
import { broadcast } from "../ws";
import { ActionState, AppState, Id, Stage } from "./model";

const patchCallbackHandlers: Automerge.PatchCallback<AppState>[] = [];
const patchCallback: Automerge.PatchCallback<AppState> = (
  patch,
  before,
  after
) => {
  patchCallbackHandlers.forEach((h) => h(patch, before, after));
};
let appState: AppState;

export const getAppState = () => {
  if (appState) return appState;
  throw new Error("AppState not initialized");
};

export const initAppState = (
  sessionId: string | null,
  stage: Stage,
  actions: Record<Id, ActionState> | undefined = undefined
) => {
  appState = Automerge.change(
    Automerge.init<AppState>({ patchCallback }),
    (state) => {
      // set initial values
      state.sessionId = sessionId ?? randomId();
      state.stage = stage;
      if (actions) {
        state.actions = Object.entries(actions)
          .map(([id, { text, done, date }]) => ({ id, text, done, date }))
          .reduce((prev, current) => ({ ...prev, [current.id]: current }), {});
      }
    }
  );
  return appState;
};

export function onStateChange(f: (newState: AppState) => void) {
  patchCallbackHandlers.push((_patch, _before, after: AppState) => {
    f(after);
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
}
