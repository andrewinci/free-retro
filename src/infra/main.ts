import { Construct } from "constructs";
import { App, Stack, StackProps } from "aws-cdk-lib";
import { StaticWebsite } from "./static-website";
import { WSBackend } from "./ws-backend";
import { Route53Records } from "./route53-records";
import { Certificates } from "./certificates";

export class FreeRetroService extends Stack {
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
