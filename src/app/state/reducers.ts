import { randomColor, randomId } from "../helper/random";
import { changeState, getAppState } from "./automerge-state";
import { getUser, setUserName } from "./user";
import * as Automerge from "automerge";
import { Id, ColumnState, Stage } from "./model";
import { findCardPosition, findGroupPosition } from "../helper/position-finder";

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

// card reducers
export const setGroupTitle = (groupId: Id, title: string) =>
  changeState((state) => {
    if (!state.columns) return;
    const groupPosition = findGroupPosition(groupId, state);
    if (!groupPosition) return;
    const { column, group } = groupPosition;
    state.columns[column].groups[group].title = title;
  });

export const moveCardToGroup = (srcCardId: Id, dstGroupId: Id) =>
  changeState((state) => {
    if (!state.columns) return;
    const srcCardPosition = findCardPosition(srcCardId, state);
    const dstGroupPosition = findGroupPosition(dstGroupId, state);

    if (!srcCardPosition || !dstGroupPosition) return;
    const srcGroup =
      state.columns[srcCardPosition.column].groups[srcCardPosition.group];
    const srcCard = srcGroup.cards[srcCardPosition.card];
    const dstGroup =
      state.columns[dstGroupPosition.column].groups[dstGroupPosition.group];
    dstGroup.cards.push({
      id: srcCardId,
      originColumn: srcCard.originColumn,
      ownerId: srcCard.ownerId,
      text: srcCard.text,
      color: srcCard.color,
    });
    // remove the card from the source group
    srcGroup.cards.splice(srcCardPosition.card, 1);
    // delete the group if there are no more cards
    if (srcGroup.cards.length == 0) {
      state.columns[srcCardPosition.column].groups.splice(
        srcCardPosition.group,
        1
      );
    }
  });

export const addEmptyCard = (columnIndex: number) =>
  changeState((state) => {
    if (!state.columns) return;
    const column = state.columns[columnIndex];
    column.groups.unshift({
      id: randomId(),
      votes: {},
      cards: [
        {
          id: randomId(),
          originColumn: column.title,
          ownerId: getUser()?.id ?? "",
          text: "",
          color: randomColor(),
        },
      ],
    });
  });

export const deleteCardGroup = (groupId: Id) =>
  changeState((state) => {
    if (!state.columns) return;
    const groupPosition = findGroupPosition(groupId, state);
    if (!groupPosition) return;
    state.columns[groupPosition.column].groups.splice(groupPosition.group, 1);
  });

export const updateFirstCardText = (groupId: Id, newText: string) =>
  changeState((state) => {
    if (!state.columns) return;
    const groupPosition = findGroupPosition(groupId, state);
    if (!groupPosition) return;
    const card =
      state.columns[groupPosition.column].groups[groupPosition.group];
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

export const updateGroupVotes = (
  groupId: Id,
  changeType: "increment" | "decrement"
) =>
  changeState((state) => {
    if (!state.columns) return;
    const groupPosition = findGroupPosition(groupId, state);
    if (!groupPosition) return;
    const userId = getUser()?.id ?? "";
    const card =
      state.columns[groupPosition.column].groups[groupPosition.group];
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

export const moveCardToColumn = (srcCardId: Id, column: number) =>
  changeState((state) => {
    if (!state.columns) return;
    const srcCardPosition = findCardPosition(srcCardId, state);
    if (!srcCardPosition) return;
    const srcGroup =
      state.columns[srcCardPosition.column].groups[srcCardPosition.group];
    const srcCard = srcGroup.cards[srcCardPosition.card];
    let dstColumn: ColumnState | undefined = state.columns[column];
    if (srcCard.originColumn != dstColumn.title) {
      dstColumn = state.columns.find((c) => c.title == srcCard.originColumn);
    }
    if (!dstColumn) return;
    dstColumn.groups.push({
      id: randomId(),
      votes: {},
      cards: [
        {
          id: srcCardId,
          originColumn: srcCard.originColumn,
          ownerId: srcCard.ownerId,
          text: srcCard.text,
          color: srcCard.color,
        },
      ],
    });
    srcGroup.cards.splice(srcCardPosition.card, 1);
    // delete the group if there are no more cards
    if (srcGroup.cards.length == 0) {
      state.columns[srcCardPosition.column].groups.splice(
        srcCardPosition.group,
        1
      );
    }
  });
