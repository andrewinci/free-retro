import { mockClient } from "aws-sdk-client-mock";
import { sendToClient } from "./ws";
import { WSServerMessage } from "./model";
import { ApiGatewayManagementApiClient } from "@aws-sdk/client-apigatewaymanagementapi";

describe("Websocket sender", () => {
  jest.mock("@aws-sdk/client-apigatewaymanagementapi");
  const mockMessage = {} as unknown as WSServerMessage;
  it("returns true if the messages is successfully sent", async () => {
    const apiGwbMock = mockClient(ApiGatewayManagementApiClient);
    apiGwbMock.send.resolves();
    const res = await sendToClient(mockMessage, "ws://test", "test");
    expect(res).toBe(true);
  });
  it("return false if unable to send the message", async () => {
    const apiGwbMock = mockClient(ApiGatewayManagementApiClient);
    apiGwbMock.send.rejects();
    const res = await sendToClient(mockMessage, "ws://test", "test");
    expect(res).toBe(false);
  });
  it("throws if the client id is empty", async () => {
    await expect(sendToClient(mockMessage, "endpoint", "")).rejects.toThrow();
  });
  it("throws if the endpoint is empty", async () => {
    await expect(sendToClient(mockMessage, "", "clientId")).rejects.toThrow();
  });
});
