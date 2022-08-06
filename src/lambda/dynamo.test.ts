import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBClient, QueryCommandOutput } from "@aws-sdk/client-dynamodb";
import { storeToDynamo, getDynamoAppState } from "./dynamo";

describe("dynamo helper", () => {
  describe("store dynamo db", () => {
    it("stores to dynamo - happy path", async () => {
      // arrange
      const ddbMock = mockClient(DynamoDBClient);
      // act
      const res = await storeToDynamo({
        appState: "",
        connectionId: "",
        sessionId: "",
      });
      // assert
      await expect(res).resolves;
      expect(ddbMock.send.callCount).toBe(1);
    });
  });
  describe("get app state", () => {
    it("returns only the last state", async () => {
      // arrange
      const ddbMock = await mockClient(DynamoDBClient);
      const exampleItem = (n: number) => ({
        sessionId: { S: `session_${n}` },
        connectionId: { S: `connection_${n}` },
        appState: { S: `state_${n}` },
        lastUpdate: { N: n },
      });
      const mockResponse = {
        Items: [exampleItem(0), exampleItem(2), exampleItem(1)],
      } as unknown as QueryCommandOutput;
      ddbMock.send.resolves(mockResponse);
      // act
      const res = await getDynamoAppState("session-id");
      // assert
      expect(res).toEqual({
        connections: ["connection_0", "connection_2", "connection_1"],
        lastState: "state_2",
        sessionId: "session-id",
      });
      expect(ddbMock.send.callCount).toBe(1);
    });
    it("returns null if the sessionId is not in the DB", async () => {
      // arrange
      const ddbMock = await mockClient(DynamoDBClient);
      const mockResponse = { Items: [] } as unknown as QueryCommandOutput;
      ddbMock.send.resolves(mockResponse);
      // act
      const res = await getDynamoAppState("session-id");
      // assert
      expect(res).toBeNull();
      expect(ddbMock.send.callCount).toBe(1);
    });
  });
});
