import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { getDynamoAppState, storeToDynamo } from "./dynamo";
import { BroadcastMessage, WSClientMessage, WSServerMessage } from "./model";
import { sendToClient } from "./ws";

type WSRequest = {
  routeKey: string;
  endpoint: string;
  connectionId: string;
  body: WSClientMessage;
};

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
  const body = event.body ? JSON.parse(event.body) : null;

  if (routeKey && body && connectionId) {
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

async function handleBroadcast(request: WSRequest) {
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

async function handleJoin(request: WSRequest) {
  const state = await getDynamoAppState(request.body.sessionId);
  if (!state) {
    console.log("Invalid session id. Session id not found in dynamo");
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
