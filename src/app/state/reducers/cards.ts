import { changeState } from "../automerge-state";
import { getUser } from "../user";
import * as Automerge from "automerge";
import { Id, ColumnState } from "../model";
import { randomId, findCardPosition, findGroupPosition } from "../helper";
import { getRemainingUserVotes } from "../votes";

export const EMPTY_COLUMN_TITLE = "Empty column";

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
        if (getRemainingUserVotes() > 0) card.votes[userId].increment();
        break;
    }
  });

export const moveCardToColumn = (srcCardId: Id, columnId: Id) =>
  changeState((state) => {
    if (!state.columns) return;
    const srcCardPosition = findCardPosition(srcCardId, state);
    if (!srcCardPosition) return;
    const srcGroup =
      state.columns[srcCardPosition.column].groups[srcCardPosition.group];
    const srcCard = srcGroup.cards[srcCardPosition.card];
    let dstColumn: ColumnState | undefined = state.columns.find(
      (c) => c.id == columnId
    );
    if (srcCard.originColumn != dstColumn?.title) {
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
