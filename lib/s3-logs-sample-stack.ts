import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as appsync from "aws-cdk-lib/aws-appsync";
import * as logs from "aws-cdk-lib/aws-logs";
import * as path from "path";
import * as s3 from "aws-cdk-lib/aws-s3";

export class S3LogsSampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this, "appsyncapi", {
      name: "myapiwiths3logs",
      definition: appsync.Definition.fromFile(
        path.join(__dirname, "schema.graphql")
      ),
      logConfig: {
        retention: logs.RetentionDays.ONE_DAY,
        fieldLogLevel: appsync.FieldLogLevel.ALL,
      },
    });

    const myBucket = new s3.Bucket(this, "s3AppSyncDatasource", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const httpDatasource = api.addHttpDataSource(
      "json-dummy-data",
      "https://jsonplaceholder.typicode.com"
    );

    const s3Datasource = new appsync.HttpDataSource(this, "s3Datasource", {
      api,
      endpoint: "https://" + myBucket.bucketRegionalDomainName,
      authorizationConfig: {
        signingRegion: "us-west-2",
        signingServiceName: "s3",
      },
    });

    myBucket.grantPut(s3Datasource.grantPrincipal);

    const listPostFn = new appsync.AppsyncFunction(this, "listPostFn", {
      dataSource: httpDatasource,
      api,
      name: "listPostfunction",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      code: appsync.Code.fromAsset(
        path.join(__dirname, "resolvers", "listPost.js")
      ),
    });

    const s3Fn = new appsync.AppsyncFunction(this, "s3function", {
      dataSource: s3Datasource,
      api,
      name: "s3Function",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      code: appsync.Code.fromAsset(
        path.join(__dirname, "resolvers", "s3resolver.js")
      ),
    });

    new appsync.Resolver(this, "listpostresolver", {
      api,
      fieldName: "listPost",
      typeName: "Query",
      pipelineConfig: [listPostFn, s3Fn],
      code: appsync.Code.fromAsset(
        path.join(__dirname, "resolvers", "pipeline.js")
      ),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

    new cdk.CfnOutput(this, "s3bucketEndpoint", {
      value: myBucket.bucketDomainName,
    });

    new cdk.CfnOutput(this, "s3bucketRegionalEndpoint", {
      value: myBucket.bucketRegionalDomainName,
    });
  }
}
