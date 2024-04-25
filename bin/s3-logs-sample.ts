#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { S3LogsSampleStack } from "../lib/s3-logs-sample-stack";

const app = new cdk.App();
new S3LogsSampleStack(app, "S3LogsSampleStack", {
  env: {
    region: "us-west-2",
  },
  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});
