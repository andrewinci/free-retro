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

const client = new DynamoDBClient({ region: AWS_REGION });
let total = 0;
export async function updateDynamoAppState(
  startKey?: Record<string, AttributeValue> | undefined,
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
    (i) => unmarshall(i) as DynamoRecord & { lastUpdate: number },
  );

  const commands = items
    .map(
      (item) =>
        new UpdateItemCommand({
          TableName: TABLE_NAME,
          Key: {
            sessionId: { S: item.sessionId },
            connectionId: { S: item.connectionId },
          },
          UpdateExpression: "set stateVersion = :v",
          ExpressionAttributeValues: {
            ":v": { N: "1" },
          },
        }),
    )
    .map(async (updateCommand) => await client.send(updateCommand))
    .map(() => (total += 1));

  await Promise.all(commands);
  console.log(
    items.map((i) => ({
      sessionId: i.sessionId,
      connectionId: i.connectionId,
    })),
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
