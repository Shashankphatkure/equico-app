import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function uploadToS3(file, folder = "posts") {
  try {
    const fileExtension = file.name.split(".").pop();
    const fileName = `${folder}/${uuidv4()}.${fileExtension}`;
    const fileBuffer = await file.arrayBuffer();

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: Buffer.from(fileBuffer),
      ContentType: file.type,
      ACL: "public-read",
    });

    await s3Client.send(command);
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Error uploading file");
  }
}
