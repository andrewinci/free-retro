import {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
  BatchWriteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const TABLE_NAME = process.env.DYNAMO_TABLE_NAME!;
const AWS_REGION = "eu-west-1";

export type DynamoRecord = {
  //hash key
  sessionId: string;
  // range key
  connectionId: string;
  appState: string;
};

export type DynamoAppState = {
  sessionId: string;
  connections: string[];
  lastState: string;
};

const client = new DynamoDBClient({ region: AWS_REGION });

export function chunk<T>(seq: T[], chunkSize: number): T[][] {
  if (chunkSize <= 0) throw new Error("The chunk size should be > 0");
  const chunks = [];
  for (let i = 0; i < seq.length; i += chunkSize) {
    chunks.push(seq.slice(i, i + chunkSize));
  }
  return chunks;
}

export const deleteDynamoItems = async (
  connections: {
    sessionId: string;
    connectionId: string;
  }[]
) => {
  if (!connections || connections.length == 0) {
    // nothing to do
    return;
  }
  // split items into chunks. Dynamo supports a max of 25 records
  // in a batch.
  const chunks = chunk(connections, 25);

  const commandChunks = chunks.map(
    (chunk) =>
      new BatchWriteItemCommand({
        RequestItems: {
          [TABLE_NAME]: chunk.map((c) => ({
            DeleteRequest: {
              Key: {
                sessionId: { S: c.sessionId },
                connectionId: { S: c.connectionId },
              },
            },
          })),
        },
      })
  );

  await Promise.all(
    commandChunks.map(async (command) => await client.send(command))
  );
};

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
  if (!response || !response.Items || response.Items.length == 0) return null;
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
