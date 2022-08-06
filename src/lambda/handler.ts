import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { getDynamoAppState, storeToDynamo } from "./dynamo";
import { BroadcastMessage, WSRequest, WSServerMessage } from "./model";
import { sendToClient } from "./ws";

export const lambdaHandler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);
  console.log(
    `New connection established: ${event.requestContext.connectionId}`
  );
  const { routeKey, domainName, stage, connectionId } = event.requestContext;
  const body = parseBody(event.body);

  if (routeKey == "$default" && body && connectionId) {
    await handle({
      routeKey,
      endpoint: "https://" + domainName + "/" + stage,
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
  const dynamoState = await getDynamoAppState(request.body.sessionId);
  const { sessionId, state } = request.body as BroadcastMessage;
  const storeToDynamoPromise = storeToDynamo({
    appState: state,
    connectionId: request.connectionId,
    sessionId,
  });

  const broadcastMessage: WSServerMessage = {
    action: "update",
    state: state,
  };

  const sendPromises = (dynamoState?.connections ?? [])
    .filter((c) => c != request.connectionId)
    .map((c) => sendToClient(broadcastMessage, request.endpoint, c));

  await Promise.all(sendPromises);
  await storeToDynamoPromise;
}

export async function handleJoin(request: WSRequest) {
  const state = await getDynamoAppState(request.body.sessionId);
  if (!state) {
    const message = `Session id ${request.body.sessionId} not found`;
    console.error(message);
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
  };

  await storeToDynamo({
    appState: state.lastState,
    connectionId: request.connectionId,
    sessionId: request.body.sessionId,
  });

  await sendToClient(updateMessage, request.endpoint, request.connectionId);
}
