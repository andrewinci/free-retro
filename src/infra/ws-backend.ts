import { Construct } from "constructs";
import * as apiGw2 from "@aws-cdk/aws-apigatewayv2-alpha";
import { WebSocketLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import { RemovalPolicy } from "aws-cdk-lib";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { SecurityPolicy } from "aws-cdk-lib/aws-apigateway";

export type WSBackendProps = {
  name: string;
  region: string;
  account: string;
  certificate: acm.ICertificate;
  domainName: string;
};

export class WSBackend extends Construct {
  public domain: apiGw2.DomainName;

  constructor(scope: Construct, id: string, props: WSBackendProps) {
    super(scope, id);
    const { name, region, account, certificate, domainName } = props;

    // Create dynamo db table to track the sessions
    const dynamoTable = new dynamodb.Table(this, `${name}-sessions`, {
      tableName: `${name}-sessions`,
      partitionKey: { name: "sessionId", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "connectionId", type: dynamodb.AttributeType.STRING },
      readCapacity: 10,
      writeCapacity: 10,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // lambda to deal with the requests
    const lambdaHandler = new lambda.Function(this, `${name}-lambda`, {
      functionName: `${name}-lambda`,
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("dist/lambda"),
      handler: "dist/lambda/handler.lambdaHandler",
      logRetention: 30,
      environment: {
        DYNAMO_TABLE_NAME: dynamoTable.tableName,
      },
    });

    // allow the lambda to read/write/query the sessions dynamo table
    dynamoTable.grantReadWriteData(lambdaHandler);

    // Create websocket api gateway
    const api = new apiGw2.WebSocketApi(this, `${name}-api`, {
      apiName: `${name}-api`,
      connectRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          "handle-connect",
          lambdaHandler
        ),
      },
      disconnectRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          "handle-disconnect",
          lambdaHandler
        ),
      },
      defaultRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          "handle-default",
          lambdaHandler
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
    const stage = new apiGw2.WebSocketStage(this, `${name}-api-stage`, {
      stageName: "live",
      autoDeploy: true,
      webSocketApi: api,
      throttle: {
        rateLimit: 100,
        burstLimit: 100,
      },
    });

    // link custom domain to the api gw
    new apiGw2.ApiMapping(this, `${name}-custom-domain-mapping`, {
      api: api,
      domainName: this.domain,
      stage,
    });

    api.grantManageConnections(lambdaHandler);
    // Create policy to allow Lambda function to use @connections API of API Gateway
    const allowConnectionManagementOnApiGatewayPolicy = new PolicyStatement({
      effect: Effect.ALLOW,
      resources: [
        `arn:aws:execute-api:${region}:${account}:${api.apiId}/*/*/*/@connections/*`,
      ],
      actions: ["execute-api:Invoke"],
    });

    // Attach custom policy to Lambda function
    lambdaHandler.addToRolePolicy(allowConnectionManagementOnApiGatewayPolicy);
  }
}
