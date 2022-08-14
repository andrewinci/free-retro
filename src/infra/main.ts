import { Construct } from "constructs";
import { App, Stack, StackProps } from "aws-cdk-lib";
import { StaticWebsite } from "./static-website";
import { WSBackend } from "./ws-backend";
import { Route53Records } from "./route53-records";
import { Certificates } from "./certificates";
import {
  Monitoring,
  TELEGRAM_BOT_TOKEN_ENV_NAME,
  TELEGRAM_CHAT_ID_ENV_NAME,
} from "./monitor";

export class FreeRetroService extends Stack {
  LAMBDA_TIMEOUT_SEC = 3;
  constructor(scope: Construct, id: string, props: StackProps | undefined) {
    super(scope, id, props);
    const baseProps = {
      account: this.account,
      region: this.region,
    };
    const baseDomainName = "amaker.xyz";
    const domainName = "retroapp.amaker.xyz";
    const apiDomainName = "ws.retroapp.amaker.xyz";

    const certificates = new Certificates(this, "certificates", {
      name: `${id}-certificates`,
      apiDomainName,
      appDomainName: domainName,
      baseDomainName,
      ...baseProps,
    });
    // deploy static website: s3 + cf
    const webApp = new StaticWebsite(this, `static-website`, {
      name: `${id}-webapp`,
      certificate: certificates.cfCertificate,
      domainName,
      ...baseProps,
    });

    // deploy api + lambda + dynamodb
    const backend = new WSBackend(this, `backend`, {
      name: `${id}-backend`,
      certificate: certificates.apiCertificate,
      domainName: `ws.${domainName}`,
      lambdaTimeout: this.LAMBDA_TIMEOUT_SEC,
      ...baseProps,
    });

    // monitors
    new Monitoring(this, `monitoring`, {
      name: `${id}-monitoring`,
      apiProps: {
        apiId: backend.api.apiId,
      },
      lambdaProps: {
        wsLambda: backend.lambdaFunction,
        lambdaTimeoutSeconds: this.LAMBDA_TIMEOUT_SEC,
      },
      tgForwarderProps: {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        tgBotToken: process.env[TELEGRAM_BOT_TOKEN_ENV_NAME]!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        tgChatId: process.env[TELEGRAM_CHAT_ID_ENV_NAME]!,
      },
      dynamoProps: {
        table: backend.dynamoTable,
      },
      ...baseProps,
    });

    new Route53Records(this, `records`, {
      name: `${id}-route53-records`,
      apiDomainName,
      appDomainName: domainName,
      distribution: webApp.distribution,
      domain: backend.domain,
      hostedZoneName: baseDomainName,
      ...baseProps,
    });
  }
}

const app = new App();
new FreeRetroService(app, "free-retro-app", {
  env: {
    region: "eu-west-1",
    account: process.env.AWS_ACCOUNT_ID,
  },
});
app.synth();
