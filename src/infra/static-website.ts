import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Duration, RemovalPolicy } from "aws-cdk-lib";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import { BlockPublicAccess } from "aws-cdk-lib/aws-s3";
import { OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";

export type StaticWebsiteProps = {
  name: string;
  region: string;
  account: string;
  certificate: acm.ICertificate;
  domainName: string;
};

export class StaticWebsite extends Construct {
  public distribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string, props: StaticWebsiteProps) {
    super(scope, id);
    const { name, certificate, domainName } = props;

    // static content bucket
    const bucket = new s3.Bucket(this, `${name}-static-webapp`, {
      bucketName: `${name}-static-webapp`,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Create Origin Access Identity to be use Canonical User Id in S3 bucket policy
    const originAccessIdentity = new OriginAccessIdentity(this, "OAI");
    bucket.grantRead(originAccessIdentity);

    // cloudfront
    this.distribution = new cloudfront.Distribution(
      this,
      `${name}-distribution`,
      {
        certificate,
        domainNames: [domainName],
        defaultBehavior: {
          origin: new origins.S3Origin(bucket, {
            originAccessIdentity,
          }),
          compress: true,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
          cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        },
        errorResponses: [
          {
            httpStatus: 403,
            responsePagePath: "/index.html",
            responseHttpStatus: 200,
            ttl: Duration.minutes(0),
          },
          {
            httpStatus: 404,
            responsePagePath: "/index.html",
            responseHttpStatus: 200,
            ttl: Duration.minutes(0),
          },
        ],
        priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
        enabled: true,
        minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
        httpVersion: cloudfront.HttpVersion.HTTP2,
        defaultRootObject: "index.html",
        enableIpv6: true,
      }
    );

    // upload static content
    new s3deploy.BucketDeployment(this, `${name}-deploy`, {
      sources: [s3deploy.Source.asset("./dist/app")],
      destinationBucket: bucket,
      distribution: this.distribution,
      distributionPaths: ["/*"], // invalidate all the files
      retainOnDelete: false,
    });
  }
}
