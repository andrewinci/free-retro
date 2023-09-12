import { getAppState } from "./automerge-state";
import { CardGroupState } from "./model";

export function getAllGroups(): CardGroupState[] {
  const state = getAppState();
  if (!state.columns) return [];
  return Object.values(state.columns).flatMap((c) =>
    Object.values(c.groups ?? {}),
  );
}
