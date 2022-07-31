import { randomColor, randomId } from "../helper/random";
import { changeState } from "./automerge-state";
import { getUser, setUserName } from "./user";
import * as Automerge from "automerge";
import { Stage } from "./model";
export const EMPTY_COLUMN_TITLE = "Empty column";

// app state reducers

export const createRetro = (username: string, retroName: string) =>
  changeState(`create retro`, (state) => {
    const currentUser = setUserName(username);
    state.retroName = retroName;
    state.stage = Stage.AddTickets;
    if (!state.users.find((u) => u.id == currentUser.id)) {
      state.users.push(currentUser);
    }
  });

export const joinRetro = (sessionId: string, username: string) =>
  changeState(`join retro`, (state) => {
    const currentUser = setUserName(username);
    state.sessionId = sessionId;
    state.stage = Stage.AddTickets;
    if (!state.users.find((u) => u.id == currentUser.id)) {
      state.users.push(currentUser);
    }
  });

export const nextStage = () =>
  changeState(`next stage`, (state) => {
    state.stage += 1;
  });

// column reducers

export const addColumn = () =>
  changeState(`add column`, (state) => {
    if (!state.columns) {
      state.columns = [];
    }
    state.columns.push({
      title: EMPTY_COLUMN_TITLE,
      cards: [],
    });
  });

export const deleteColumn = (columnIndex: number) =>
  changeState(`delete column ${columnIndex}`, (state) => {
    state.columns.splice(columnIndex, 1);
  });

export const setColumnTitle = (columnIndex: number, title: string) =>
  changeState(`set column ${columnIndex} title`, (state) => {
    state.columns[columnIndex].title = title;
  });

// card reducers

export const addEmptyCard = (columnIndex: number) =>
  changeState(`add empty card to ${columnIndex}`, (state) => {
    const column = state.columns[columnIndex];
    column.cards.push({
      ownerId: getUser()?.id ?? "", //todo
      text: "",
      color: randomColor(),
      votes: new Automerge.Counter(0),
    });
  });

export const deleteCard = (columnIndex: number, cardIndex: number) =>
  changeState(`delete card`, (state) => {
    state.columns[columnIndex].cards.splice(cardIndex, 1);
  });

export const updateCardText = (
  columnIndex: number,
  cardIndex: number,
  newText: string
) =>
  changeState(`update card text`, (state) => {
    state.columns[columnIndex].cards[cardIndex].text = newText;
  });

export const updateCardVotes = (
  columnIndex: number,
  cardIndex: number,
  changeType: "increment" | "decrement"
) =>
  changeState(`${changeType} card ${cardIndex} votes`, (state) => {
    const card = state.columns[columnIndex].cards[cardIndex];
    switch (changeType) {
      case "decrement":
        card.votes.decrement();
        break;
      case "increment":
        card.votes.increment();
        break;
    }
  });
