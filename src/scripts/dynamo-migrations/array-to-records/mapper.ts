import {
  ActionState,
  AppState,
  CardGroupState,
  CardState,
  ColumnState,
  Id,
} from "../../../app/state";
import {
  randomId,
  toBase64,
  toBinaryDocument,
} from "../../../app/state/helper";
import {
  ActionState as ActionStateV0,
  AppStateV0,
  CardGroupStateV0,
  CardStateV0,
  ColumnStateV0,
} from "./model-v0";
import * as Automerge from "@automerge/automerge";

export function arrToRecord<T>(
  arr: [Id, T][] | undefined
): Record<Id, T> | undefined {
  if (!arr) return undefined;
  return arr.reduce(
    (prev, [id, content]) => ({ ...prev, [id ?? randomId()]: content }),
    {}
  );
}

function mapCard(c: CardStateV0): [Id, CardState] {
  const res: CardState = {
    originColumn: c.originColumn,
    ownerId: c.ownerId,
    text: c.text,
  };
  if (c.color) res.color = c.color;
  return [c.id, res];
}

function mapGroup(g: CardGroupStateV0): [Id, CardGroupState] {
  const res: CardGroupState = {
    cards: arrToRecord(g.cards.map((c) => mapCard(c))) ?? {},
    // hack to duplicate an Automerge object
    votes: arrToRecord(Object.entries(g.votes)) ?? {},
  };
  // Automerge doesn't support undefined assignment
  if (g.title) res.title = g.title;
  return [g.id, res];
}

export function mapColumn(col: ColumnStateV0): [Id, ColumnState] {
  return [
    col.id,
    {
      title: col.title,
      groups: arrToRecord(col.groups.map((g) => mapGroup(g))) ?? {},
    },
  ];
}

export function mapAction(a: ActionStateV0): [Id, ActionState] {
  return [
    a.id,
    {
      date: a.date,
      text: a.text,
      done: a.done,
    },
  ];
}

export function migrateState(rawState: string): string {
  const oldState = Automerge.load<AppStateV0>(toBinaryDocument(rawState));
  let newState = Automerge.init<AppState>();

  newState = Automerge.change(newState, (s) => {
    if (oldState.sessionId) s.sessionId = oldState.sessionId;
    if (oldState.retroName) s.retroName = oldState.retroName;
    if (oldState.stage) s.stage = oldState.stage;
    if (oldState.discussCardIndex)
      s.discussCardIndex = oldState.discussCardIndex;
    const actions = arrToRecord(oldState.actions?.map((a) => mapAction(a)));
    if (actions) s.actions = actions;
    const columns = arrToRecord(oldState.columns?.map((c) => mapColumn(c)));
    if (columns) s.columns = columns;
  });

  return toBase64(Automerge.save(newState));
}
