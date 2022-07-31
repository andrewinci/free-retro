import * as Automerge from "automerge";
import { toBase64, toBinaryDocument } from "../helper/binary-document";
import { AppState, Stage } from "./model";

const LOCAL_STATE_KEY = "free-retro:state";

const observable = new Automerge.Observable();
const localState = localStorage.getItem(LOCAL_STATE_KEY);
let doc = localState
  ? Automerge.load<AppState>(toBinaryDocument(localState), { observable })
  : Automerge.change(Automerge.init<AppState>({ observable }), (state) => {
      // set initial values
      state.columns = [];
      state.retroName = "Let's retrospect";
      state.stage = Stage.AddTickets;
    });

export const getAppState = () => doc;

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
