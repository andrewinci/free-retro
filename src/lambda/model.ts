// message sent by the client to the server
export type BroadcastMessage = {
  action: "broadcast";
  sessionId: string;
  state: string;
  recreateState: boolean;
};

// message sent by the client to the server
export type JoinMessage = {
  action: "join";
  sessionId: string;
};

export type WSClientMessage = BroadcastMessage | JoinMessage;

export type ErrorMessage = {
  action: "error";
  errorType: "session-not-found";
  message: string;
};

export type UpdateMessage = {
  action: "update";
  state: string;
  recreateState: boolean;
};

export type WSServerMessage = UpdateMessage | ErrorMessage;

export type WSRequest = {
  routeKey: string;
  endpoint: string;
  connectionId: string;
  body: WSClientMessage;
};
