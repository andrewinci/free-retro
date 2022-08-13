import * as Automerge from "automerge";

export type User = {
  id: string;
  username: string;
};

export type GroupPosition = {
  column: number;
  group: number;
};

export type CardPosition = {
  card: number;
} & GroupPosition;

type Card = {
  position: CardPosition;
  originColumn: string;
  ownerId: string;
  text: string;
  color?: string;
};

export type CardGroupState = {
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
