import { handleBroadcast, handleJoin } from "./handler";
import { WSRequest } from "./model";
import * as Dynamo from "./dynamo";
import * as ws from "./ws";

describe("integration test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("handle join", () => {
    it("should not broadcasts the client state of the last joined", async () => {
      // arrange
      const getDynamoAppState = jest
        .spyOn(Dynamo, "getDynamoAppState")
        .mockResolvedValueOnce({
          ...validDyanmoState,
          connections: ["1", "2", "3"],
        });
      //act
      const res = handleJoin(validWsRequest);
      // assert
      await expect(res).resolves.not.toThrow();
      expect(getDynamoAppState.mock.calls.length).toBe(1);
      expect(sendToClient.mock.calls.map((params) => params[2])).toEqual([
        validWsRequest.connectionId,
      ]);
      expect(storeToDynamo.mock.calls.length).toBe(1);
    });
    it("should send an error when try to join a session that doesn't exist", async () => {
      const getDynamoAppState = jest
        .spyOn(Dynamo, "getDynamoAppState")
        .mockResolvedValueOnce(null);
      //act
      const res = handleJoin(validWsRequest);
      //assert
      await expect(res).resolves.not.toThrow();
      expect(getDynamoAppState.mock.calls.length).toBe(1);
      expect(storeToDynamo.mock.calls.length).toBe(0);
      expect(sendToClient.mock.calls[0][0]).toEqual({
        action: "error",
        errorType: "session-not-found",
        message: "Session id sessionId not found",
      });
    });
  });
  describe("handle broadcast", () => {
    it("broadcasts the client state to all connections", async () => {
      // arrange
      const getDynamoAppState = jest
        .spyOn(Dynamo, "getDynamoAppState")
        .mockResolvedValueOnce({
          ...validDyanmoState,
          connections: ["1", "2", "3"],
        });
      //act
      const res = handleBroadcast(validWsRequest);
      // assert
      await expect(res).resolves.not.toThrow();
      expect(getDynamoAppState.mock.calls.length).toBe(1);
      expect(sendToClient.mock.calls.map((params) => params[2])).toEqual([
        "1",
        "2",
        "3",
      ]);
      expect(storeToDynamo.mock.calls.length).toBe(1);
    });
    it("create a new session if one is not already running", async () => {
      // arrange
      const getDynamoAppState = jest
        .spyOn(Dynamo, "getDynamoAppState")
        .mockResolvedValueOnce(null);
      //act
      const res = handleBroadcast(validWsRequest);
      // assert
      await expect(res).resolves.not.toThrow();
      expect(getDynamoAppState.mock.calls.length).toBe(1);
      // there is no-one to broadcast the message to
      expect(sendToClient.mock.calls.length).toBe(0);
      expect(storeToDynamo.mock.calls.length).toBe(1);
    });
    it("updated the list of connections", async () => {
      // arrange
      jest
        .spyOn(Dynamo, "getDynamoAppState")
        .mockResolvedValueOnce(validDyanmoState);
      //act
      const res = handleBroadcast(validWsRequest);
      // assert
      await expect(res).resolves.not.toThrow();
      expect(storeToDynamo.mock.calls[0][0]).toEqual({
        appState: "client state",
        connectionId: validWsRequest.connectionId,
        sessionId: validWsRequest.body.sessionId,
        devMode: false,
      });
    });
  });
  // helpers
  const validDyanmoState = {
    lastState: "last server state",
    sessionId: "sessionId",
    connections: ["connection1"],
  };
  const validWsRequest: WSRequest = {
    body: {
      action: "broadcast",
      sessionId: "sessionId",
      state: "client state",
      recreateState: false,
    },
    connectionId: "connectionId",
    endpoint: "endpoint",
    routeKey: "anything",
  };

  const storeToDynamo = jest
    .spyOn(Dynamo, "storeToDynamo")
    .mockImplementation(jest.fn());
  const sendToClient = jest
    .spyOn(ws, "sendToClient")
    .mockImplementation(jest.fn());
  jest.spyOn(Dynamo, "deleteDynamoItems").mockImplementation(jest.fn());
});
