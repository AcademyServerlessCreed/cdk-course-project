import * as cdk from "aws-cdk-lib";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import path from "path";
import * as iam from "aws-cdk-lib/aws-iam";
interface LambdaStackProps extends cdk.StackProps {
  usersTable: Table;
}

export class ComputeStack extends cdk.Stack {
  public readonly putEventLambda: NodejsFunction;
  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);
    this.putEventLambda = new NodejsFunction(this, "S3PutEventLambda", {
      entry: path.join(__dirname, "../functions/S3PutEvent/index.ts"),
      handler: "handler",
      memorySize: 128,
    });
    props.usersTable.grantReadData(this.putEventLambda);
    // Give PutEventLambda permission
    this.putEventLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["s3:*", "dynamodb:*"],
        resources: ["*"],
      })
    );
  }
}
