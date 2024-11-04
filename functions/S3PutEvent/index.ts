import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const ddbClient = new DynamoDBClient({ region: "ap-south-1" });
const tableName = "ImagesTable";

export const handler = async (event: any) => {
  try {
    const fileName = event.Records[0].s3.object.key as string;
    console.log(`Processing file: ${fileName}`);

    const userData = parseFileName(fileName);

    await storeUserData(userData);

    console.log(`Successfully processed file: ${fileName}`);
  } catch (error) {
    console.error("Error processing file:", error);
    throw error;
  }
};

function parseFileName(fileName: string) {
  try {
    // Remove file extension
    const nameWithoutExtension = fileName.split(".")[0];

    // Split the remaining string by underscore
    const [id, name, age] = nameWithoutExtension.split("_");
    console.log({
      id,
      name,
      age,
    });

    if (!id || !name || !age) {
      throw new Error("Invalid filename format");
    }

    return {
      id,
      name,
      age: parseInt(age, 10),
    };
  } catch (error: any) {
    throw new Error(`Error parsing filename ${fileName}: ${error.message}`);
  }
}

async function storeUserData(userData: any) {
  try {
    // Prepare the item for DynamoDB
    const putItemParams = {
      TableName: tableName,
      Item: marshall({
        id: userData.id,
        name: userData.name,
        age: userData.age,
        uploadedAt: new Date().toISOString(),
      }),
    };

    // Store the item in DynamoDB
    await ddbClient.send(new PutItemCommand(putItemParams));
  } catch (error: any) {
    throw new Error(`Error storing user data in DynamoDB: ${error.message}`);
  }
}
