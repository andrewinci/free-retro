import { randomColor, randomId } from "../helper/random";
import { changeState, getAppState } from "./automerge-state";
import { getUser, setUserName } from "./user";
import * as Automerge from "automerge";
import { Stage } from "./model";
export const EMPTY_COLUMN_TITLE = "Empty column";

// app state reducers

export const changeDiscussCard = (changeType: "increment" | "decrement") => {
  // avoid to trigger changes if the index is out of bound
  const { columns, discussCardIndex } = getAppState();
  const currentIndex = discussCardIndex?.value ?? 0;
  const totalCards =
    columns?.flatMap((c) => c.cards.length).reduce((a, b) => a + b, 0) ?? 0;
  if (currentIndex >= totalCards - 1 && changeType == "increment") return;
  if (currentIndex <= 0 && changeType == "decrement") return;

  changeState(`change discussed card`, (state) => {
    if (!state.discussCardIndex) {
      state.discussCardIndex = new Automerge.Counter(0);
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
};

export const createRetro = (username: string, retroName: string) =>
  changeState(`create retro`, (state) => {
    state.retroName = retroName;
    state.stage = Stage.AddTickets;
  });

export const changeStage = (change: "next" | "back") => {
  const currentStage = getAppState().stage ?? 0;
  if (currentStage <= 0 && change == "back") return;
  if (currentStage >= Stage.End && change == "next") return;
  changeState(`next stage`, (state) => {
    if (change == "back") {
      state.stage -= 1;
    } else if (change == "next") {
      state.stage += 1;
    }
  });
};

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
    for (let c of state.columns[columnIndex].cards) {
      c.originColumn = title;
    }
  });

// card reducers

export const addEmptyCard = (columnIndex: number) =>
  changeState(`add empty card to ${columnIndex}`, (state) => {
    if (!state.columns) return;
    const column = state.columns[columnIndex];
    column.cards.push({
      originColumn: column.title,
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

const canUserAddVotes = () => {
  const { id } = getUser()!!;
  const { columns } = getAppState();
  const total =
    columns
      ?.flatMap((c) => c.cards)
      .map((c) => c.votes[id]?.value ?? 0)
      .reduce((a, b) => a + b, 0) ?? 0;
  // each user has 5 votes max
  //todo: adapt depending on the number of users
  // and cards
  return total < 5;
};

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
        if (canUserAddVotes()) card.votes[userId].increment();
        break;
    }
  });
