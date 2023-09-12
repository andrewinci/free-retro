import { Construct } from "constructs";
import { IDistribution } from "aws-cdk-lib/aws-cloudfront";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53targets from "aws-cdk-lib/aws-route53-targets";
import * as apiGw2 from "@aws-cdk/aws-apigatewayv2-alpha";

export type Route53RecordsProps = {
  name: string;
  region: string;
  account: string;

  apiDomainName: string;
  domain: apiGw2.DomainName;

  appDomainName: string;
  distribution: IDistribution;
  hostedZoneName: string;
};

export class Route53Records extends Construct {
  constructor(scope: Construct, id: string, props: Route53RecordsProps) {
    super(scope, id);

    const {
      name,
      apiDomainName,
      domain,
      appDomainName,
      distribution,
      hostedZoneName,
    } = props;

    // lookup the hosted zone
    const hostedZone = route53.HostedZone.fromLookup(
      this,
      `${id}-hosted-zone`,
      {
        domainName: hostedZoneName,
      },
    );

    new route53.ARecord(this, `${name}-app-record`, {
      recordName: appDomainName,
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(
        new route53targets.CloudFrontTarget(distribution),
      ),
    });

    // Add API record in route53
    new route53.ARecord(this, `${name}-custom-domain-record`, {
      recordName: apiDomainName,
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(
        new route53targets.ApiGatewayv2DomainProperties(
          domain.regionalDomainName,
          domain.regionalHostedZoneId,
        ),
      ),
    });
  }
}
