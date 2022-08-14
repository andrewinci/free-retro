import { Construct } from "constructs";
import * as apiGw2 from "@aws-cdk/aws-apigatewayv2-alpha";
import * as apigw from "aws-cdk-lib/aws-apigatewayv2";
import { WebSocketLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as sqs from "aws-cdk-lib/aws-sqs";
import { Duration, RemovalPolicy } from "aws-cdk-lib";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { SecurityPolicy } from "aws-cdk-lib/aws-apigateway";

export type WSBackendProps = {
  name: string;
  region: string;
  account: string;
  lambdaTimeout: number;
  certificate: acm.ICertificate;
  domainName: string;
};

export class WSBackend extends Construct {
  public domain: apiGw2.DomainName;
  public lambdaFunction: lambda.IFunction;
  public dynamoTable: dynamodb.ITable;
  public api: apiGw2.WebSocketApi;

  constructor(scope: Construct, id: string, props: WSBackendProps) {
    super(scope, id);
    const { name, region, account, certificate, domainName, lambdaTimeout } =
      props;

    // Create dynamo db table to track the sessions
    this.dynamoTable = new dynamodb.Table(this, `${name}-sessions`, {
      tableName: `${name}-sessions`,
      partitionKey: { name: "sessionId", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "connectionId", type: dynamodb.AttributeType.STRING },
      readCapacity: 10,
      writeCapacity: 10,
      removalPolicy: RemovalPolicy.SNAPSHOT,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
    });

    // dead letter queue for the lambda
    const dlq = new sqs.Queue(this, `${name}-dlq`, {
      queueName: `${name}-dlq`,
      encryption: sqs.QueueEncryption.KMS_MANAGED,
      removalPolicy: RemovalPolicy.DESTROY,
      retentionPeriod: Duration.days(4),
    });

    // lambda to deal with the requests
    this.lambdaFunction = new lambda.Function(this, `${name}-lambda`, {
      functionName: `${name}-lambda`,
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("dist/lambda"),
      handler: "dist/lambda/handler.lambdaHandler",
      timeout: Duration.seconds(lambdaTimeout),
      logRetention: 30,
      environment: {
        DYNAMO_TABLE_NAME: this.dynamoTable.tableName,
      },
      reservedConcurrentExecutions: 20,
      deadLetterQueue: dlq,
    });

    // allow the lambda to read/write/query the sessions dynamo table
    this.dynamoTable.grantReadWriteData(this.lambdaFunction);

    // Create websocket api gateway
    this.api = new apiGw2.WebSocketApi(this, `${name}-api`, {
      apiName: `${name}-api`,
      description: `WebSocket api for ${name}`,
      connectRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          "handle-connect",
          this.lambdaFunction
        ),
      },
      disconnectRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          "handle-disconnect",
          this.lambdaFunction
        ),
      },
      defaultRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          "handle-default",
          this.lambdaFunction
        ),
      },
    });

    // add a custom domain
    this.domain = new apiGw2.DomainName(this, `${name}-custom-domain`, {
      certificate,
      domainName,
      securityPolicy: SecurityPolicy.TLS_1_2,
    });

    // Create the stage and deploy the API
    const cfnStage = new apigw.CfnStage(this, `${name}-api-stage`, {
      stageName: "live",
      autoDeploy: true,
      apiId: this.api.apiId,
      defaultRouteSettings: {
        throttlingRateLimit: 100,
        throttlingBurstLimit: 100,
        detailedMetricsEnabled: true,
      },
    });

    const stage = apiGw2.WebSocketStage.fromWebSocketStageAttributes(
      this,
      `api-stage-ws`,
      {
        api: this.api,
        stageName: cfnStage.stageName,
      }
    );

    // link custom domain to the api gw
    new apiGw2.ApiMapping(this, `${name}-custom-domain-mapping`, {
      api: this.api,
      domainName: this.domain,
      stage,
    });

    this.api.grantManageConnections(this.lambdaFunction);
    // Create policy to allow Lambda function to use @connections API of API Gateway
    const allowConnectionManagementOnApiGatewayPolicy = new PolicyStatement({
      effect: Effect.ALLOW,
      resources: [
        `arn:aws:execute-api:${region}:${account}:${this.api.apiId}/*/*/*/@connections/*`,
      ],
      actions: ["execute-api:Invoke"],
    });

    // Attach custom policy to Lambda function
    this.lambdaFunction.addToRolePolicy(
      allowConnectionManagementOnApiGatewayPolicy
    );
  }
}
