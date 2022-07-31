import {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

//todo: load from env variables
const TABLE_NAME = "free-retro-sessions-table";
const AWS_REGION = "eu-west-1";

export type DynamoRecord = {
  //hash key
  sessionId: string;
  connectionId: string;
  appState: string;
};

export type DynamoAppState = {
  sessionId: string;
  connections: string[];
  lastState: string;
};

const client = new DynamoDBClient({ region: AWS_REGION });

export const storeToDynamo = async (record: DynamoRecord) => {
  const command = new PutItemCommand({
    TableName: TABLE_NAME,
    Item: {
      sessionId: { S: record.sessionId },
      connectionId: { S: record.connectionId },
      appState: { S: record.appState },
      lastUpdate: { N: Date.now().toString() },
    },
  });
  await client.send(command);
};

export async function getDynamoAppState(
  sessionId: string
): Promise<DynamoAppState | null> {
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: "sessionId = :sessionId",
    ExpressionAttributeValues: {
      ":sessionId": { S: sessionId },
    },
  });
  const response = await client.send(command);
  if (!response.Items || response.Items.length == 0) return null;
  const items = response.Items.map(
    (i) => unmarshall(i) as DynamoRecord & { lastUpdate: number }
  );
  return {
    sessionId: sessionId,
    connections: items.map((i) => i.connectionId),
    lastState: items.reduce((prev, current) =>
      current.lastUpdate > prev.lastUpdate ? current : prev
    ).appState,
  };
}
