import { lambdaHandler } from "./handler";
import * as Dynamo from "./dynamo";
import * as ws from "./ws";
import { APIGatewayProxyEvent, Context } from "aws-lambda";

describe("lambda integration tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("handle join", () => {
    it("should store and return the latest available state from dynamo", async () => {
      // arrange
      const connections = ["1", "2", "3"];
      const getDynamoAppState = jest
        .spyOn(Dynamo, "getDynamoAppState")
        .mockResolvedValueOnce({
          ...validDyanmoState,
          connections,
        });

      //act
      const res = lambdaHandler(validJoinRequest, lambdaContext);

      // assert
      await expect(res).resolves.not.toThrow();
      expect(getDynamoAppState.mock.calls.length).toBe(1);
      expect(sendToClient.mock.calls.length).toBe(1);
      expect(sendToClient.mock.calls[0][0]).toEqual({
        action: "update",
        state: "last server state",
        recreateState: false,
      });
      expect(storeToDynamo.mock.calls.length).toBe(1);
      expect(storeToDynamo.mock.calls[0][0]).toEqual({
        appState: "last server state",
        connectionId: "connectionId",
        sessionId: "sessionId",
        devMode: false,
      });
    });
  });
  describe("handle client connection/disconnection", () => {
    it("should ignore a connection message with an invalid body", async () => {
      // arrange
      const request = {
        ...validBroadcastRequest,
        body: "just a random string",
        requestContext: {
          ...validBroadcastRequest.requestContext,
          routeKey: "$connect",
        },
      };
      const connections = ["1", "2", "3"];
      jest.spyOn(Dynamo, "getDynamoAppState").mockResolvedValueOnce({
        ...validDyanmoState,
        connections,
      });
      //act
      const res = lambdaHandler(request, lambdaContext);
      // assert
      await expect(res).resolves.not.toThrow();
    });
    it("should ignore a disconnection message", async () => {
      // arrange
      const request = {
        ...validBroadcastRequest,
        requestContext: {
          ...validBroadcastRequest.requestContext,
          routeKey: "$disconnect",
        },
      };
      const connections = ["1", "2", "3"];
      const getDynamoAppState = jest
        .spyOn(Dynamo, "getDynamoAppState")
        .mockResolvedValueOnce({
          ...validDyanmoState,
          connections,
        });
      //act
      const res = lambdaHandler(request, lambdaContext);
      // assert
      await expect(res).resolves.not.toThrow();
      expect(getDynamoAppState.mock.calls.length).toBe(0);
      expect(sendToClient.mock.calls.length).toBe(0);
      expect(storeToDynamo.mock.calls.length).toBe(0);
    });
    it("should ignore a connection message", async () => {
      // arrange
      const request = {
        ...validBroadcastRequest,
        requestContext: {
          ...validBroadcastRequest.requestContext,
          routeKey: "$connect",
        },
      };
      const connections = ["1", "2", "3"];
      const getDynamoAppState = jest
        .spyOn(Dynamo, "getDynamoAppState")
        .mockResolvedValueOnce({
          ...validDyanmoState,
          connections,
        });
      //act
      const res = lambdaHandler(request, lambdaContext);
      // assert
      await expect(res).resolves.not.toThrow();
      expect(getDynamoAppState.mock.calls.length).toBe(0);
      expect(sendToClient.mock.calls.length).toBe(0);
      expect(storeToDynamo.mock.calls.length).toBe(0);
    });
  });
  describe("handle broadcast", () => {
    it("should not broadcasts the client state of the last joined", async () => {
      // arrange
      const connections = ["1", "2", "3"];
      const getDynamoAppState = jest
        .spyOn(Dynamo, "getDynamoAppState")
        .mockResolvedValueOnce({
          ...validDyanmoState,
          connections,
        });
      //act
      const res = lambdaHandler(validBroadcastRequest, lambdaContext);
      // assert
      await expect(res).resolves.not.toThrow();
      expect(getDynamoAppState.mock.calls.length).toBe(1);
      expect(sendToClient.mock.calls.map((params) => params[2])).toEqual(
        connections,
      );
      expect(storeToDynamo.mock.calls.length).toBe(1);
    });
    it("should should delete the state of the offline clients", async () => {
      // arrange
      const connections = ["1", "2", "3"];
      sendToClient.mockResolvedValueOnce(true);
      // mock the connection 2 to be offline
      sendToClient.mockResolvedValueOnce(false);
      // mock the connection 3 to be ONLINE
      sendToClient.mockResolvedValueOnce(true);
      const getDynamoAppState = jest
        .spyOn(Dynamo, "getDynamoAppState")
        .mockResolvedValueOnce({
          ...validDyanmoState,
          connections,
        });
      //act
      const res = lambdaHandler(validBroadcastRequest, lambdaContext);
      // assert
      await expect(res).resolves.not.toThrow();
      expect(getDynamoAppState.mock.calls.length).toBe(1);
      expect(sendToClient.mock.calls.map((params) => params[2])).toEqual(
        connections,
      );
      expect(storeToDynamo.mock.calls.length).toBe(1);
      expect(deleteDynamoItems.mock.calls.length).toBe(1);
      expect(deleteDynamoItems.mock.calls[0][0]).toEqual([
        { connectionId: "2", sessionId: "sessionId" },
      ]);
    });
  });
  // helpers
  const lambdaContext = {} as unknown as Context;
  const validDyanmoState = {
    lastState: "last server state",
    sessionId: "sessionId",
    connections: ["connection1"],
  };
  const validBroadcastRequest = {
    requestContext: {
      routeKey: "$default",
      domainName: "domainName",
      stage: "dev",
      connectionId: "connectionId",
    },
    body: JSON.stringify({
      action: "broadcast",
      sessionId: "sessionId",
      state: "client state",
    }),
  } as unknown as APIGatewayProxyEvent;
  const validJoinRequest = {
    requestContext: {
      routeKey: "$default",
      domainName: "domainName",
      stage: "dev",
      connectionId: "connectionId",
    },
    body: JSON.stringify({
      action: "join",
      sessionId: "sessionId",
      state: "client state",
    }),
  } as unknown as APIGatewayProxyEvent;

  const storeToDynamo = jest
    .spyOn(Dynamo, "storeToDynamo")
    .mockImplementation(jest.fn());
  const deleteDynamoItems = jest
    .spyOn(Dynamo, "deleteDynamoItems")
    .mockImplementation(jest.fn());
  const sendToClient = jest
    .spyOn(ws, "sendToClient")
    .mockImplementation(jest.fn());
});
