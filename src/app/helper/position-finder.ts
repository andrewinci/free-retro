import { AppState, Id } from "../state";

type GroupPosition = {
  column: number;
  group: number;
};

type CardPosition = {
  card: number;
} & GroupPosition;

export function findCardPosition(
  cardId: Id,
  state: AppState
): CardPosition | undefined {
  if (!state.columns) return undefined;
  for (let c = 0; c < state.columns.length; c++) {
    const column = state.columns[c];
    for (let g = 0; g < column.groups.length; g++) {
      const group = column.groups[g];
      for (let i = 0; i < group.cards.length; i++) {
        if (group.cards[i].id == cardId)
          return {
            column: c,
            group: g,
            card: i,
          };
      }
    }
  }
  return undefined;
}

export function findGroupPosition(
  groupId: Id,
  state: AppState
): GroupPosition | undefined {
  if (!state.columns) return undefined;
  for (let c = 0; c < state.columns.length; c++) {
    const column = state.columns[c];
    for (let g = 0; g < column.groups.length; g++) {
      if (column.groups[g].id == groupId)
        return {
          column: c,
          group: g,
        };
    }
  }
  return undefined;
}
