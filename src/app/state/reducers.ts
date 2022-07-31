import { randomColor, randomId } from "../helper/random";
import { changeState } from "./automerge-state";
import { getUser, setUserName } from "./user";
import * as Automerge from "automerge";
import { Stage } from "./model";
export const EMPTY_COLUMN_TITLE = "Empty column";

// app state reducers

export const changeDiscussesCard = (changeType: "increment" | "decrement") =>
  changeState(`change discussed card`, (state) => {
    if (!state.discussCardIndex) {
      state.discussCardIndex = new Automerge.Counter();
    }
    switch (changeType) {
      case "decrement":
        state.discussCardIndex.decrement();
        break;
      case "increment":
        state.discussCardIndex.increment();
        break;
    }
  });

export const createRetro = (username: string, retroName: string) =>
  changeState(`create retro`, (state) => {
    state.retroName = retroName;
    state.stage = Stage.AddTickets;
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
    if (!state.columns) state.columns = [];
    state.columns.splice(columnIndex, 1);
  });

export const setColumnTitle = (columnIndex: number, title: string) =>
  changeState(`set column ${columnIndex} title`, (state) => {
    if (!state.columns) state.columns = [];
    state.columns[columnIndex].title = title;
  });

// card reducers

export const addEmptyCard = (columnIndex: number) =>
  changeState(`add empty card to ${columnIndex}`, (state) => {
    if (!state.columns) return;
    const column = state.columns[columnIndex];
    column.cards.push({
      ownerId: getUser()?.id ?? "", //todo
      text: "",
      color: randomColor(),
      votes: {},
    });
  });

export const deleteCard = (columnIndex: number, cardIndex: number) =>
  changeState(`delete card`, (state) => {
    if (!state.columns) return;
    state.columns[columnIndex].cards.splice(cardIndex, 1);
  });

export const updateCardText = (
  columnIndex: number,
  cardIndex: number,
  newText: string
) =>
  changeState(`update card text`, (state) => {
    if (!state.columns) return;
    state.columns[columnIndex].cards[cardIndex].text = newText;
  });

export const updateCardVotes = (
  columnIndex: number,
  cardIndex: number,
  changeType: "increment" | "decrement"
) =>
  changeState(`${changeType} card ${cardIndex} votes`, (state) => {
    if (!state.columns) return;
    const userId = getUser()?.id!!;
    const card = state.columns[columnIndex].cards[cardIndex];
    if (!card.votes[userId!!]) {
      card.votes[userId] = new Automerge.Counter(0);
    }
    switch (changeType) {
      case "decrement":
        card.votes[userId].decrement();
        break;
      case "increment":
        card.votes[userId].increment();
        break;
    }
  });
