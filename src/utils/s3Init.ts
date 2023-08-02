import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export async function uploadPdftoS3(key: string, buffer: Buffer) {
  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${key}.pdf`,
    Body: buffer,
    ContentType: "application/pdf",
  };

  return await s3Client.send(new PutObjectCommand(s3Params));
}

export async function uploadQRCodetoS3(key: string, base64: any, type: string) {
  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${key}.${type}`,
    Body: base64,
    ContentEncoding: "base64",
    ContentType: `image/${type}`,
  };

  return await s3Client.send(new PutObjectCommand(s3Params));
}
