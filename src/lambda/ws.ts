import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import { WSServerMessage } from "./model";

export async function sendToClient(
  message: WSServerMessage,
  endpoint: string,
  connectionId: string
): Promise<boolean> {
  console.log("Send message to client", message, endpoint, connectionId);
  if (!endpoint || endpoint.length == 0) {
    console.error("Invalid WebSocket endpoint");
    throw new Error("Invalid endpoint. Unable to send a message to the client");
  }
  if (!connectionId || connectionId.length == 0) {
    console.error("Invalid WebSocket connectionId");
    throw new Error(
      "Invalid connectionId. Unable to send a message to the client"
    );
  }
  const enc = new TextEncoder();
  const client = new ApiGatewayManagementApiClient({
    apiVersion: "2018-11-29",
    endpoint: endpoint,
  });
  const command = new PostToConnectionCommand({
    ConnectionId: connectionId,
    Data: enc.encode(JSON.stringify(message)),
  });
  try {
    await client.send(command);
    return true;
  } catch (e) {
    console.log("Unable to send the command to the client", e);
    return false;
  }
}
