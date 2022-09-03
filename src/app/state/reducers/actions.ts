import { randomId } from "../helper/random";
import { changeState } from "../automerge-state";
import { Id } from "../model";
import dayjs from "dayjs";

export const addAction = () =>
  changeState((state) => {
    if (!state.actions) state.actions = {};
    state.actions[randomId()] = {
      text: "",
      done: false,
      date: dayjs().format("MMM Do YY"),
    };
  });

export const setActionText = (actionId: Id, text: string) =>
  changeState((state) => {
    if (!state.actions || !(actionId in state.actions))
      throw new Error(`Unable to find the actionId ${actionId}`);
    state.actions[actionId].text = text;
  });

export const setActionDone = (actionId: Id, done: boolean) =>
  changeState((state) => {
    if (!state.actions || !(actionId in state.actions))
      throw new Error(`Unable to find the actionId ${actionId}`);
    state.actions[actionId].done = done;
  });

export const removeAction = (actionId: Id) =>
  changeState((state) => {
    if (!state.actions || !(actionId in state.actions))
      throw new Error(`Unable to find the actionId ${actionId}`);
    delete state.actions[actionId];
  });
