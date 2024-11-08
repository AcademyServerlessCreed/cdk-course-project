#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { DatabaseStack } from "../stacks/database-stack";
import { S3Stack } from "../stacks/s3-stack";
import { ComputeStack } from "../stacks/compute-stack";


const app = new cdk.App();
const databaseStack = new DatabaseStack(app, "DatabaseStack");
const lambdaStack = new ComputeStack(app, "LambdaStack", {
  imagesTable: databaseStack.imageTable,
});
const s3Stack = new S3Stack(app, "S3Stack", {
  putEventLambda: lambdaStack.putEventLambda,
});