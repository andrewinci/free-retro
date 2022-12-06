import * as Automerge from "@automerge/automerge";

export type Id = string;

export type User = {
  id: string;
  username: string;
};

export type CardStateV0 = {
  id: Id;
  originColumn: string;
  ownerId: string;
  text: string;
  color?: string;
};

export type CardGroupStateV0 = {
  id: Id;
  title?: string;
  cards: CardStateV0[];
  votes: Record<string, Automerge.Counter>;
};

export type ColumnStateV0 = {
  id: Id;
  title: string;
  groups: CardGroupStateV0[];
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
  date: string;
};

export type AppStateV0 = {
  sessionId: string;
  retroName?: string;
  stage: Stage;
  discussCardIndex?: Automerge.Counter;
  columns?: ColumnStateV0[];
  actions?: ActionState[];
};
