import { changeState } from "../automerge-state";
import { getUser } from "../user";
import * as Automerge from "@automerge/automerge";
import { Id, ColumnState } from "../model";
import { findCard, findGroup, randomId } from "../helper";
import { getRemainingUserVotes } from "../votes";

export const EMPTY_COLUMN_TITLE = "Empty column";

// card reducers
export const setGroupTitle = (groupId: Id, title: string) =>
  changeState((state) => {
    if (!state.columns) return;
    const { group } = findGroup(groupId, state);
    group.title = title;
  });

export const deleteCardGroup = (groupId: Id) =>
  changeState((state) => {
    if (!state.columns) return;
    const { column } = findGroup(groupId, state);
    delete column.groups[groupId];
  });

export const updateFirstCardText = (groupId: Id, newText: string) =>
  changeState((state) => {
    if (!state.columns) return;
    const { group } = findGroup(groupId, state);
    const cardIds = Object.keys(group.cards);
    if (cardIds.length == 0) throw new Error("Unexpected group without cards");
    group.cards[cardIds[0]].text = newText;
  });

export const updateGroupVotes = (
  groupId: Id,
  changeType: "increment" | "decrement"
) =>
  changeState((state) => {
    if (!state.columns) return;
    const { group } = findGroup(groupId, state);
    const userId = getUser()?.id;
    if (!userId) throw new Error("Missing userId");

    if (!group.votes[userId]) {
      group.votes[userId] = new Automerge.Counter(0);
    }
    switch (changeType) {
      case "decrement":
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        group.votes[userId].decrement();
        break;
      case "increment":
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (getRemainingUserVotes() > 0) group.votes[userId].increment();
        break;
    }
  });

export const moveCardToGroup = (srcCardId: Id, dstGroupId: Id) =>
  changeState((state) => {
    if (!state.columns) return;

    const {
      column: srcColumn,
      group: srcGroup,
      groupId: srcGroupId,
      card: srcCard,
    } = findCard(srcCardId, state);
    const { group: dstGroup } = findGroup(dstGroupId, state);

    // nothing to do if the card is already
    // in the right group id
    if (dstGroupId == srcGroupId) return;

    dstGroup.cards[srcCardId] = {
      originColumn: srcCard.originColumn,
      ownerId: srcCard.ownerId,
      text: srcCard.text,
      color: srcCard.color,
    };

    // remove the card from the source group
    delete srcGroup.cards[srcCardId];

    // delete the group if there are no more cards
    if (Object.keys(srcGroup.cards).length == 0) {
      delete srcColumn.groups[srcGroupId];
    }
  });

export const moveCardToColumn = (srcCardId: Id, columnId: Id) =>
  changeState((state) => {
    if (!state.columns || !(columnId in state.columns))
      throw new Error("Invalid columns");

    const {
      column: srcColumn,
      group: srcGroup,
      groupId: srcGroupId,
      card: srcCard,
    } = findCard(srcCardId, state);

    let dstColumn: ColumnState | undefined = state.columns[columnId];
    if (srcCard.originColumn != dstColumn?.title) {
      dstColumn = Object.values(state.columns).find(
        (c) => c.title == srcCard.originColumn
      );
    }

    if (!dstColumn) return;

    dstColumn.groups[randomId()] = {
      votes: {},
      cards: {
        [randomId()]: {
          originColumn: srcCard.originColumn,
          ownerId: srcCard.ownerId,
          text: srcCard.text,
          color: srcCard.color,
        },
      },
    };

    // remove the card from the source group
    delete srcGroup.cards[srcCardId];

    // delete the group if there are no more cards
    if (Object.keys(srcGroup.cards).length == 0) {
      delete srcColumn.groups[srcGroupId];
    }
  });
