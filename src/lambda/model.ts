// message sent by the client to the server
export type BroadcastMessage = {
  action: "broadcast";
  sessionId: string;
  state: string;
};

// message sent by the client to the server
export type JoinMessage = {
  action: "join";
  sessionId: string;
};

export type WSClientMessage = BroadcastMessage | JoinMessage;

export type UpdateMessage = {
  action: "update";
  state: string;
};

export type WSServerMessage = UpdateMessage;
