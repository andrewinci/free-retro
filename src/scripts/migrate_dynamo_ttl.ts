// run this script with ts-node to set the ttl to all records
import {
  AttributeValue,
  DynamoDBClient,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import dayjs from "dayjs";

const TABLE_NAME = "free-retro-app-backend-sessions";

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
let total = 0;
export async function updateDynamoAppState(
  startKey?: Record<string, AttributeValue> | undefined
) {
  const scan = new ScanCommand({
    TableName: TABLE_NAME,
    ExclusiveStartKey: startKey,
    Limit: 10,
  });
  const scanResult = await client.send(scan);
  if (!scanResult || !scanResult.Items || scanResult.Items.length == 0)
    return null;
  const items = scanResult.Items.map(
    (i) => unmarshall(i) as DynamoRecord & { lastUpdate: number }
  );

  const ttl = (timestamp: number) => ({
    N: dayjs.unix(timestamp).add(3, "months").unix().toString(),
  });

  const commands = items
    .map(
      (item) =>
        new UpdateItemCommand({
          TableName: TABLE_NAME,
          Key: {
            sessionId: { S: item.sessionId },
            connectionId: { S: item.connectionId },
          },
          UpdateExpression: "set expires = :t",
          ExpressionAttributeValues: {
            ":t": ttl(Math.ceil(item.lastUpdate / 1000)),
          },
        })
    )
    .map(async (updateCommand) => await client.send(updateCommand))
    .map(() => (total += 1));

  await Promise.all(commands);
  console.log(
    items.map((i) => ({ sessionId: i.sessionId, connectionId: i.connectionId }))
  );
  console.log("TOTAL", total);
  console.log("LastEvaluatedKey", scanResult.LastEvaluatedKey);
  if (scanResult.LastEvaluatedKey)
    await updateDynamoAppState(scanResult.LastEvaluatedKey);
}

// set following props for re-run
total = 0;
const lastKey = undefined;

updateDynamoAppState(lastKey)
  .then(() => console.log("Completed"))
  .catch((e) => console.error(e));
