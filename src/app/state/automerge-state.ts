import * as Automerge from "automerge";
import { toBase64, toBinaryDocument } from "../helper/binary-document";
import { randomId } from "../helper/random";
import { AppState, Stage } from "./model";

const LOCAL_STATE_KEY = "free-retro:state";

const observable = new Automerge.Observable();
let doc: AppState;

export const getAppState: () => AppState = () => {
  if (doc) return doc;
  // first attempt to get the appState
  const localState = localStorage.getItem(LOCAL_STATE_KEY);
  if (location.hash && localState) {
    // trying to join an already existing retro
    // load the data from cache
    doc = Automerge.load<AppState>(toBinaryDocument(localState), {
      observable,
    });
    return doc;
  } else {
    doc = Automerge.change(
      Automerge.init<AppState>({ observable }),
      (state) => {
        // set initial values
        state.sessionId = randomId();
        state.users = [];
        state.columns = [];
        state.retroName = "Let's retrospect";
        state.stage = Stage.Create;
      }
    );
    location.hash = doc.sessionId;
    return doc;
  }
};

export function onStateChange(f: (newState: AppState) => void) {
  console.log("State changed");
  observable.observe(doc, (a, b, newState) => f(newState));
}

export async function changeState(msg: string, f: (state: AppState) => void) {
  doc = Automerge.change(doc, msg, (s) => f(s));
  // todo: broadcast to all clients
  // await broadcast(doc);
  localStorage.setItem(LOCAL_STATE_KEY, toBase64(Automerge.save(doc)));
}

export function loadNewState(remoteRawState: string) {
  const remoteState = Automerge.load<AppState>(
    toBinaryDocument(remoteRawState)
  );
  console.log("Server state ", remoteState);
  doc = Automerge.merge(doc, remoteState);
  localStorage.setItem(LOCAL_STATE_KEY, remoteRawState);
}
