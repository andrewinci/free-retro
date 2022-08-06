import { sendToClient } from "./ws";
import { WSServerMessage } from "./model";

describe("Websocket sender", () => {
  jest.mock("@aws-sdk/client-apigatewaymanagementapi");
  const mockMessage = {} as unknown as WSServerMessage;
  it("returns true if the messages is successfully sent", async () => {
    //todo: mock the constructor of ApiGatewayManagementApiClient
  });
  it("return false if unable to send the message", async () => {
    //todo: mock the constructor of ApiGatewayManagementApiClient
  });
  it("throw if the endpoint or the client id are empty", async () => {
    await expect(sendToClient(mockMessage, "", "")).rejects.toThrow();
  });
});
