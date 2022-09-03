import { AppState, CardGroupState, CardState, ColumnState, Id } from "..";

type GroupPosition = {
  column: ColumnState;
  columnId: Id;
  group: CardGroupState;
  groupId: Id;
};

type CardPosition = {
  card: CardState;
  cardId: Id;
} & GroupPosition;

export function findGroup(groupId: Id, state: AppState): GroupPosition {
  if (!state.columns) throw new Error(`Group ${groupId} not found`);
  for (const [columnId, column] of Object.entries(state.columns)) {
    if (groupId in column.groups) {
      return {
        columnId,
        column,
        groupId,
        group: column.groups[groupId],
      };
    }
  }
  throw new Error(`Group ${groupId} not found`);
}

export function findCard(cardId: Id, state: AppState): CardPosition {
  if (!state.columns) throw new Error(`Card ${cardId} not found`);
  for (const [columnId, column] of Object.entries(state.columns)) {
    for (const [groupId, group] of Object.entries(column.groups)) {
      if (cardId in group.cards) {
        return {
          columnId,
          column,
          groupId,
          group,
          cardId,
          card: group.cards[cardId],
        };
      }
    }
  }
  throw new Error(`Card ${cardId} not found`);
}
