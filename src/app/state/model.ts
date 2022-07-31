import * as Automerge from "automerge";

export type User = {
  id: string;
  username: string;
};

export type CardState = {
  ownerId: string;
  text: string;
  color?: string;
  votes: Automerge.Counter;
};

export type ColumnState = {
  title: string;
  cards: CardState[];
};

export enum Stage {
  Create,
  Join,
  AddTickets,
  // TODO: group will need drag and drop
  // see: https://codesandbox.io/s/github/react-dnd/react-dnd/tree/gh-pages/examples_ts/04-sortable/simple?from-embed=&file=/package.json:566-585
  // Group,
  Vote,
  Discuss,
  End,
}

export type AppState = {
  sessionId: string;
  retroName: string;
  users: User[];
  stage: Stage;
  columns: ColumnState[];
};
