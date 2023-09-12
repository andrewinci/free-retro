import { Construct } from "constructs";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import { ICertificate } from "aws-cdk-lib/aws-certificatemanager";

export type CertificatesProps = {
  name: string;
  region: string;
  account: string;

  baseDomainName: string;
  appDomainName: string;
  apiDomainName: string;
};

export class Certificates extends Construct {
  apiCertificate: ICertificate;
  cfCertificate: ICertificate;

  constructor(scope: Construct, id: string, props: CertificatesProps) {
    super(scope, id);
    const {
      baseDomainName,
      appDomainName,
      apiDomainName: apiDomainName,
    } = props;
    // lookup the hosted zone
    const hostedZone = route53.HostedZone.fromLookup(
      this,
      `${id}-hosted-zone`,
      {
        domainName: baseDomainName,
      },
    );

    // create a certificate for the api
    this.apiCertificate = new acm.DnsValidatedCertificate(
      this,
      "api-certificate",
      {
        domainName: apiDomainName,
        hostedZone,
      },
    );

    // create a certificate for cloudfront
    this.cfCertificate = new acm.DnsValidatedCertificate(
      this,
      "cf-certificate",
      {
        domainName: appDomainName,
        hostedZone,
        region: "us-east-1",
      },
    );
  }
}
