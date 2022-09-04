// run this script with ts-node to set the ttl to all records
import {
  AttributeValue,
  DynamoDBClient,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoRecord } from "../../../lambda/dynamo";
import { AWS_REGION, TABLE_NAME } from "../common";
import { migrateState } from "./mapper";

const client = new DynamoDBClient({ region: AWS_REGION });
let total = 0;

export async function migrateDynamoAppState(
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
    (i) =>
      unmarshall(i) as DynamoRecord & {
        lastUpdate: number;
        stateVersion: number | undefined;
      }
  );

  const commands = items
    .filter((i) => i.stateVersion != 1)
    .map((item) => {
      const key = {
        sessionId: { S: item.sessionId },
        connectionId: { S: item.connectionId },
      };
      let migratedState: string;

      try {
        migratedState = migrateState(item.appState);
      } catch (e) {
        console.log(item.appState);
        console.log(key);
        console.error(e);
        throw e;
      }

      return new UpdateItemCommand({
        TableName: TABLE_NAME,
        Key: key,
        UpdateExpression: "set appState = :s, stateVersion = :v",
        ExpressionAttributeValues: {
          ":s": { S: migratedState },
          ":v": { N: "1" },
        },
      });
    })
    .map(async (updateCommand) => await client.send(updateCommand))
    .map(() => (total += 1));

  await Promise.all(commands);
  console.log(
    items.map((i) => ({ sessionId: i.sessionId, connectionId: i.connectionId }))
  );
  console.log("TOTAL", total);
  console.log("LastEvaluatedKey", scanResult.LastEvaluatedKey);
  if (scanResult.LastEvaluatedKey)
    await migrateDynamoAppState(scanResult.LastEvaluatedKey);
}

// set following props for re-run
total = 0;
const lastKey = undefined;

migrateDynamoAppState(lastKey)
  .then(() => console.log("Completed"))
  .catch((e) => console.error(e));
