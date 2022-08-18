import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { deleteDynamoItems, getDynamoAppState, storeToDynamo } from "./dynamo";
import { BroadcastMessage, WSRequest, WSServerMessage } from "./model";
import { sendToClient } from "./ws";

export const lambdaHandler = async (
  event: APIGatewayProxyEvent,
  _: Context
): Promise<APIGatewayProxyResult> => {
  const { routeKey, domainName, connectionId } = event.requestContext;
  const body = parseBody(event.body);
  if (routeKey == "$default" && body && connectionId) {
    await handle({
      routeKey,
      endpoint: "https://" + domainName + "/",
      connectionId,
      body,
    });
  }

  return {
    statusCode: 200,
    body: "",
  };
};

function parseBody(body: string | null) {
  if (!body) return null;
  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
}

async function handle(request: WSRequest) {
  const { action } = request.body;
  switch (action) {
    case "broadcast":
      await handleBroadcast(request);
      break;
    case "join":
      await handleJoin(request);
      break;
  }
}

export async function handleBroadcast(request: WSRequest) {
  console.log("Handle broadcast");
  const dynamoState = await getDynamoAppState(request.body.sessionId);
  const { sessionId, state, recreateState } = request.body as BroadcastMessage;
  const storeToDynamoPromise = storeToDynamo({
    appState: state,
    connectionId: request.connectionId,
    sessionId,
  });

  const broadcastMessage: WSServerMessage = {
    action: "update",
    state,
    recreateState,
  };

  const sendPromises = (dynamoState?.connections ?? [])
    .filter((c) => c != request.connectionId)
    .map(async (c) => ({
      connectionId: c,
      sendResult: await sendToClient(broadcastMessage, request.endpoint, c),
    }));

  const sendResult = await Promise.all(sendPromises);
  // delete disconnected clients states
  const clientConnectionsToDelete = sendResult
    .filter((c) => !c.sendResult)
    .map((c) => ({ connectionId: c.connectionId, sessionId }));
  console.log(clientConnectionsToDelete);
  await deleteDynamoItems(clientConnectionsToDelete);
  // wait for the last state to be stored
  await storeToDynamoPromise;
}

export async function handleJoin(request: WSRequest) {
  console.log("Handle join");
  const state = await getDynamoAppState(request.body.sessionId);
  if (!state) {
    const message = `Session id ${request.body.sessionId} not found`;
    // send an error to the client
    await sendToClient(
      { action: "error", message, errorType: "session-not-found" },
      request.endpoint,
      request.connectionId
    );
    return;
  }
  const updateMessage: WSServerMessage = {
    action: "update",
    state: state.lastState,
    recreateState: false,
  };

  await storeToDynamo({
    appState: state.lastState,
    connectionId: request.connectionId,
    sessionId: request.body.sessionId,
  });

  await sendToClient(updateMessage, request.endpoint, request.connectionId);
}
