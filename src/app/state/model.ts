import * as Automerge from "automerge";

export type Id = string;

export type User = {
  id: string;
  username: string;
};

export type CardState = {
  originColumn: string;
  ownerId: string;
  text: string;
  color?: string;
};

export type CardGroupState = {
  title?: string;
  cards: Record<Id, CardState>;
  votes: Record<string, Automerge.Counter>;
};

export type ColumnState = {
  title: string;
  groups: Record<Id, CardGroupState>;
};

export enum Stage {
  Create,
  Join,
  AddTickets,
  Group,
  Vote,
  Discuss,
  End,
}

export type ActionState = {
  text: string;
  done: boolean;
  date: string;
};

export type AppState = {
  sessionId: string;
  retroName?: string;
  stage: Stage;
  discussCardIndex?: Automerge.Counter;
  columns?: Record<Id, ColumnState>;
  actions?: Record<Id, ActionState>;
};
