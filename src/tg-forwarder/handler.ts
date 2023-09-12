import { APIGatewayProxyResult, Context, SNSEvent } from "aws-lambda";
import axios from "axios";
import {
  TELEGRAM_BOT_TOKEN_ENV_NAME,
  TELEGRAM_CHAT_ID_ENV_NAME,
} from "../infra/monitor";

const TELEGRAM_BOT_TOKEN = process.env[TELEGRAM_BOT_TOKEN_ENV_NAME];
const TELEGRAM_CHAT_ID = process.env[TELEGRAM_CHAT_ID_ENV_NAME];

type Alarm = {
  AlarmName: string;
  NewStateValue: "ALARM" | "OK";
  NewStateReason: string;
  StateChangeTime: string;
};

export const lambdaHandler = async (
  event: SNSEvent,
  _: Context,
): Promise<APIGatewayProxyResult> => {
  if (!TELEGRAM_BOT_TOKEN)
    throw new Error("Missing TELEGRAM_BOT_TOKEN env variable");
  if (!TELEGRAM_CHAT_ID)
    throw new Error("Missing TELEGRAM_CHAT_ID env variable");

  const tgUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  const forwardMessagePromises = event.Records.map((r) => r.Sns.Message)
    .map((m) => JSON.parse(m) as Alarm)
    .map((m) => parseMessage(m))
    .map((m) =>
      axios.post(
        tgUrl,
        {
          chat_id: TELEGRAM_CHAT_ID,
          text: m,
          parse_mode: "html",
        },
        {
          headers: { "Content-Type": "application/json" },
        },
      ),
    );

  await Promise.all(forwardMessagePromises);

  return {
    statusCode: 200,
    body: "",
  };
};

function parseMessage(alarm: Alarm): string {
  return `<b>${alarm.NewStateValue == "OK" ? "✅" : "❌"} ${alarm.AlarmName}</b>
<i>Reason</i>: ${alarm.NewStateReason}
<i>Time</i>: ${alarm.StateChangeTime}
<a href="https://eu-west-1.console.aws.amazon.com/cloudwatch/home?region=eu-west-1#alarmsV2:alarm/">AWS Alarms</a>`;
}
