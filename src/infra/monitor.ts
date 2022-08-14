import { Construct } from "constructs";
import * as cw from "aws-cdk-lib/aws-cloudwatch";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { TreatMissingData } from "aws-cdk-lib/aws-cloudwatch";
import { SnsAction } from "aws-cdk-lib/aws-cloudwatch-actions";
import * as sns from "aws-cdk-lib/aws-sns";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { LambdaSubscription } from "aws-cdk-lib/aws-sns-subscriptions";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Duration } from "aws-cdk-lib";

type MonitorLambdaProps = {
  wsLambda: IFunction;
  lambdaTimeoutSeconds: number;
};

type MonitorDynamoProps = {
  table: ITable;
};

type MonitorApiProps = {
  apiId: string;
};

export type MonitoringProps = {
  name: string;
  region: string;
  account: string;
  apiProps: MonitorApiProps;
  lambdaProps: MonitorLambdaProps;
  tgForwarderProps: {
    tgBotToken: string;
    tgChatId: string;
  };
  dynamoProps: MonitorDynamoProps;
};

export const TELEGRAM_BOT_TOKEN_ENV_NAME = "TELEGRAM_BOT_TOKEN";
export const TELEGRAM_CHAT_ID_ENV_NAME = "TELEGRAM_CHAT_ID";

export class Monitoring extends Construct {
  constructor(scope: Construct, id: string, props: MonitoringProps) {
    super(scope, id);
    const { name, lambdaProps, tgForwarderProps, dynamoProps, apiProps } =
      props;
    const { tgBotToken, tgChatId } = tgForwarderProps;

    // lambda to forward alerts to telegram
    const monitorLambda = new lambda.Function(this, `${name}-lambda`, {
      functionName: `${name}-lambda`,
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("dist/tg-forwarder"),
      handler: "dist/tg-forwarder/handler.lambdaHandler",
      logRetention: 5,
      environment: {
        [TELEGRAM_BOT_TOKEN_ENV_NAME]: tgBotToken,
        [TELEGRAM_CHAT_ID_ENV_NAME]: tgChatId,
      },
      reservedConcurrentExecutions: 1,
    });

    // sns topic to use when a monitor is triggered
    const topic = new sns.Topic(this, `${name}-monitor-topic`, {
      topicName: `${name}-monitor-topic`,
    });
    topic.addSubscription(new LambdaSubscription(monitorLambda));

    // action triggered by alarms
    const action = new SnsAction(topic);

    // add SNS actions to the defined monitors
    this.buildLambdaMonitors(name, lambdaProps)
      .concat(this.buildDynamoDBMonitors(name, dynamoProps))
      .concat(this.buildApiMonitors(name, apiProps))
      .map((m) => {
        m.addAlarmAction(action);
        m.addOkAction(action);
      });
  }

  buildApiMonitors = (name: string, props: MonitorApiProps) => {
    const { apiId } = props;
    const [
      apiExecutionErrorMetric,
      apiMessageCountMetric,
      apiClientErrorMetric,
      apiConnectCountMetric,
      //apiIntegrationLatencyMetric,
    ] = [
      "ExecutionError",
      "MessageCount",
      "ClientError",
      "ConnectCount",
      "IntegrationLatency",
    ].map(
      (metricName) =>
        new cw.Metric({
          metricName,
          namespace: "AWS/ApiGateway",
          dimensionsMap: {
            ApiId: apiId,
          },
        })
    );

    return [
      new cw.Alarm(this, `api-exec-errors-alarm`, {
        alarmName: `${name} API execution errors`,
        metric: apiExecutionErrorMetric,
        threshold: 2,
        evaluationPeriods: 1,
        treatMissingData: TreatMissingData.NOT_BREACHING,
      }),
      new cw.Alarm(this, `api-client-errors-alarm`, {
        alarmName: `${name} API client errors`,
        metric: apiClientErrorMetric,
        threshold: 2,
        evaluationPeriods: 1,
        treatMissingData: TreatMissingData.NOT_BREACHING,
      }),
      new cw.Alarm(this, `api-connect-count-alarm`, {
        alarmName: `${name} API connection count`,
        metric: apiConnectCountMetric,
        threshold: 50,
        evaluationPeriods: 1,
        treatMissingData: TreatMissingData.NOT_BREACHING,
      }),
      new cw.Alarm(this, `api-message-count-alarm`, {
        alarmName: `${name} API message count`,
        metric: apiMessageCountMetric,
        threshold: 500,
        evaluationPeriods: 1,
        treatMissingData: TreatMissingData.NOT_BREACHING,
      }),
    ];
  };

  buildDynamoDBMonitors = (name: string, props: MonitorDynamoProps) => {
    const { table } = props;
    return [
      // monitor dynamodb throttled
      new cw.Alarm(this, `dynamo-throttled-alarm`, {
        alarmName: `${name} dynamo throttled`,
        metric: table.metricThrottledRequests(),
        threshold: 2,
        evaluationPeriods: 1,
        treatMissingData: TreatMissingData.NOT_BREACHING,
      }),

      // monitor dynamodb read capacity
      new cw.Alarm(this, `dynamo-read-capacity-alarm`, {
        alarmName: `${name} dynamo read capacity`,
        metric: new cw.MathExpression({
          period: Duration.minutes(1),
          expression: "m1/PERIOD(m1)",
          usingMetrics: {
            m1: table.metricConsumedReadCapacityUnits(),
          },
        }),
        threshold: 8,
        evaluationPeriods: 1,
        treatMissingData: TreatMissingData.NOT_BREACHING,
      }),

      // monitor dynamodb write capacity
      new cw.Alarm(this, `dynamo-write-capacity-alarm`, {
        alarmName: `${name} dynamo write capacity`,
        metric: new cw.MathExpression({
          period: Duration.minutes(1),
          expression: "m1/PERIOD(m1)",
          usingMetrics: {
            m1: table.metricConsumedWriteCapacityUnits(),
          },
        }),
        threshold: 8,
        evaluationPeriods: 1,
        treatMissingData: TreatMissingData.NOT_BREACHING,
      }),
    ];
  };

  buildLambdaMonitors = (name: string, props: MonitorLambdaProps) => {
    const { wsLambda, lambdaTimeoutSeconds } = props;
    return [
      // monitor lambda duration
      new cw.Alarm(this, `lambda-duration-alarm`, {
        alarmName: `${name} lambda duration`,
        metric: wsLambda.metricDuration(),
        threshold: lambdaTimeoutSeconds * 1000 * 0.8, //80% of the current duration
        evaluationPeriods: 1,
        treatMissingData: TreatMissingData.NOT_BREACHING,
      }),

      // monitor lambda errors
      new cw.Alarm(this, `lambda-errors-alarm`, {
        alarmName: `${name} lambda errors`,
        metric: wsLambda.metricErrors(),
        threshold: 2, //2 errors
        evaluationPeriods: 1,
        treatMissingData: TreatMissingData.NOT_BREACHING,
      }),

      // monitor lambda invocations
      new cw.Alarm(this, `lambda-invocations-alarm`, {
        alarmName: `${name} lambda invocations`,
        metric: wsLambda.metricInvocations(),
        threshold: 10000, //!k invocations in 5 minutes
        evaluationPeriods: 1,
        treatMissingData: TreatMissingData.NOT_BREACHING,
      }),
    ];
  };
}
