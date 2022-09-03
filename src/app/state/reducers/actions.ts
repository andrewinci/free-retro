import moment from "moment";
import { randomId } from "../../helper/random";
import { changeState } from "../automerge-state";
import { Id } from "../model";

export const addAction = () =>
  changeState((state) => {
    if (!state.actions) state.actions = [];
    state.actions.unshift({
      id: randomId(),
      text: "",
      done: false,
      date: moment().format("MMM Do YY"),
    });
  });

export const setActionText = (actionId: Id, text: string) =>
  changeState((state) => {
    if (!state.actions) return;
    const actionIndex = state.actions.findIndex((s) => s.id == actionId);
    if (actionIndex < 0)
      throw new Error(`Unable to find the actionId ${actionId}`);
    state.actions[actionIndex].text = text;
  });

export const setActionDone = (actionId: Id, done: boolean) =>
  changeState((state) => {
    if (!state.actions) return;
    const actionIndex = state.actions.findIndex((s) => s.id == actionId);
    if (actionIndex < 0)
      throw new Error(`Unable to find the actionId ${actionId}`);
    state.actions[actionIndex].done = done;
  });

export const removeAction = (actionId: Id) =>
  changeState((state) => {
    if (!state.actions) return;
    const actionIndex = state.actions.findIndex((s) => s.id == actionId);
    if (actionIndex < 0)
      throw new Error(`Unable to find the actionId ${actionId}`);
    state.actions.splice(actionIndex, 1);
  });
