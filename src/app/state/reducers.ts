import { randomColor } from "../helper/random";
import { changeState, getAppState } from "./automerge-state";
import { getUser, setUserName } from "./user";
import * as Automerge from "automerge";
import {
  AppState,
  CardPosition,
  ColumnState,
  GroupPosition,
  Stage,
} from "./model";
export const EMPTY_COLUMN_TITLE = "Empty column";

// app state reducers

export const changeDiscussCard = (changeType: "increment" | "decrement") => {
  // avoid to trigger changes if the index is out of bound
  const { columns, discussCardIndex } = getAppState();
  const currentIndex = discussCardIndex?.value ?? 0;
  const totalCards =
    columns?.flatMap((c) => c.groups.length).reduce((a, b) => a + b, 0) ?? 0;

  return changeState((state) => {
    if (!state.discussCardIndex) {
      state.discussCardIndex = new Automerge.Counter(0);
    }

    if (currentIndex >= totalCards - 1 && changeType == "increment") return;
    if (currentIndex <= 0 && changeType == "decrement") return;

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

export const createRetro = (retroName: string) =>
  changeState((state) => {
    state.retroName = retroName;
    state.stage = Stage.AddTickets;
  }, true);

export const changeStage = (change: "next" | "back") => {
  const currentStage = getAppState().stage ?? 0;
  if (currentStage <= 0 && change == "back") return;
  if (currentStage >= Stage.End && change == "next") return;
  return changeState((state) => {
    if (!state.stage) state.stage = 0;
    if (change == "back") {
      state.stage -= 1;
    } else if (change == "next") {
      state.stage += 1;
    }
  });
};

// column reducers

export const addColumn = () =>
  changeState((state) => {
    if (!state.columns) {
      state.columns = [];
    }
    state.columns.push({
      title: "",
      groups: [],
    });
  });

export const deleteColumn = (columnIndex: number) =>
  changeState((state) => {
    if (!state.columns) state.columns = [];
    state.columns.splice(columnIndex, 1);
  });

export const setColumnTitle = (columnIndex: number, title: string) =>
  changeState((state) => {
    if (!state.columns) state.columns = [];
    state.columns[columnIndex].title = title;
    for (const c of state.columns[columnIndex].groups) {
      for (const c1 of c.cards) {
        c1.originColumn = title;
      }
    }
  });

export const moveCardToColumn = (src: CardPosition, column: number) =>
  changeState((state) => moveCardToColumnInPlace(state, src, column));

// card reducers
export const setGroupTitle = (position: GroupPosition, title: string) =>
  changeState((state) => {
    if (!state.columns) return;
    const { column, group } = position;
    state.columns[column].groups[group].title = title;
  });

export const moveCard = (src: CardPosition, dst: GroupPosition) =>
  changeState((state) => {
    if (!state.columns) return;
    const srcGroup = state.columns[src.column].groups[src.group];
    const srcCard = srcGroup.cards[src.card];
    const dstGroup = state.columns[dst.column].groups[dst.group];
    dstGroup.cards.push({
      position: { ...dst, card: dstGroup.cards.length },
      originColumn: srcCard.originColumn,
      ownerId: srcCard.ownerId,
      text: srcCard.text,
      color: srcCard.color,
    });
    srcGroup.cards.splice(src.card, 1);
    // delete the group if there are no more cards
    if (srcGroup.cards.length == 0) {
      state.columns[src.column].groups.splice(src.group, 1);
    }
    // re-calculate all the positions
    recalculatePositions(state);
  });

export const addEmptyCard = (columnIndex: number) =>
  changeState((state) => {
    if (!state.columns) return;
    const column = state.columns[columnIndex];
    column.groups.push({
      votes: {},
      cards: [
        {
          position: {
            column: columnIndex,
            group: column.groups.length,
            card: 0,
          },
          originColumn: column.title,
          ownerId: getUser()?.id ?? "", //todo
          text: "",
          color: randomColor(),
        },
      ],
    });
  });

export const deleteCard = (columnIndex: number, cardIndex: number) =>
  changeState((state) => {
    if (!state.columns) return;
    state.columns[columnIndex].groups.splice(cardIndex, 1);
  });

export const updateCardText = (
  columnIndex: number,
  cardIndex: number,
  newText: string
) =>
  changeState((state) => {
    if (!state.columns) return;
    const card = state.columns[columnIndex].groups[cardIndex];
    // strong assumption: only one card in the group
    card.cards[0].text = newText;
  });

const canUserAddVotes = () => {
  const { id } = getUser() ?? setUserName();
  const { columns } = getAppState();
  const total =
    columns
      ?.flatMap((c) => c.groups)
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
  changeState((state) => {
    if (!state.columns) return;
    const userId = (getUser() ?? setUserName()).id;
    const card = state.columns[columnIndex].groups[cardIndex];
    if (!card.votes[userId]) {
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

const moveCardToColumnInPlace = (
  state: AppState,
  src: CardPosition,
  column: number
) => {
  if (!state.columns) return;
  const srcGroup = state.columns[src.column].groups[src.group];
  const srcCard = srcGroup.cards[src.card];
  let dstColumn: ColumnState | undefined = state.columns[column];
  if (srcCard.originColumn != dstColumn.title) {
    dstColumn = state.columns.find((c) => c.title == srcCard.originColumn);
  }
  if (!dstColumn) return;
  dstColumn.groups.push({
    votes: {},
    cards: [
      {
        position: { column, group: dstColumn.groups.length, card: 0 },
        originColumn: srcCard.originColumn,
        ownerId: srcCard.ownerId,
        text: srcCard.text,
        color: srcCard.color,
      },
    ],
  });
  srcGroup.cards.splice(src.card, 1);
  // delete the group if there are no more cards
  if (srcGroup.cards.length == 0) {
    state.columns[src.column].groups.splice(src.group, 1);
  }
  // re-calculate all the positions
  recalculatePositions(state);
};

// in place mutations
function recalculatePositions(state: AppState): void {
  if (!state.columns) return;
  for (let column = 0; column < state.columns.length; column++) {
    const columnState = state.columns[column];
    const groups = columnState.groups;
    for (let group = 0; group < groups.length; group++) {
      const cards = state.columns[column].groups[group].cards;
      // single cards should be in the right column
      if (cards.length == 1 && cards[0].originColumn != columnState.title) {
        const rightColumnIndex = state.columns.findIndex(
          (c) => c.title == cards[0].originColumn
        );
        moveCardToColumnInPlace(
          state,
          { column, group, card: 0 },
          rightColumnIndex
        );
      } else {
        for (let card = 0; card < cards.length; card++) {
          cards[card].position = { column, group, card };
        }
      }
    }
  }
}
