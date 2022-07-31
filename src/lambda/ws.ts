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
  var enc = new TextEncoder();
  const client = new ApiGatewayManagementApiClient({
    apiVersion: "2018-11-29",
    endpoint: endpoint,
  });
  const command = new PostToConnectionCommand({
    ConnectionId: connectionId,
    Data: enc.encode(JSON.stringify(message)),
  });
  try {
    const response = await client.send(command);
    console.log(response);
    return true;
  } catch {
    console.log("Client disconnected");
    return false;
  }
}
