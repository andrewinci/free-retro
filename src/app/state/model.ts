import * as Automerge from "automerge";

export type Id = string;

export type User = {
  id: string;
  username: string;
};

type Card = {
  id: Id;
  originColumn: string;
  ownerId: string;
  text: string;
  color?: string;
};

export type CardGroupState = {
  id: Id;
  title?: string;
  cards: Card[];
  votes: Record<string, Automerge.Counter>;
};

export type ColumnState = {
  title: string;
  groups: CardGroupState[];
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
  id: Id;
  text: string;
  done: boolean;
};

export type AppState = {
  sessionId: string;
  retroName?: string;
  stage: Stage;
  discussCardIndex?: Automerge.Counter;
  columns?: ColumnState[];
  actions?: ActionState[];
};
