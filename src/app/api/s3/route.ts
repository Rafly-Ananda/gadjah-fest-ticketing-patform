import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import QRCode from "qrcode";
const prisma = new PrismaClient();
const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export async function GET(request: Request): Promise<NextResponse> {
  const masterTicekts = await prisma.ticket.findMany();

  const generateQR = async (text: any) => {
    try {
      return QRCode.toDataURL(text);
    } catch (err) {
      console.error(err);
    }
  };
  const qrCode = await generateQR("ayoo");

  const base64Img = new (Buffer as any).from(
    qrCode?.replace(/^data:image\/\w+;base64,/, ""),
    "base64",
  );
  const type = qrCode?.split(";")[0].split("/")[1];

  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `qrcode.${type}`,
    Body: base64Img,
    ContentEncoding: "base64",
    ContentType: `image/${type}`,
  };

  console.log(s3Params);

  await s3Client.send(new PutObjectCommand(s3Params));

  return NextResponse.json({ message: "success" }, { status: 200 });
}

export async function POST(request: Request) {
  console.log("post route");
  return NextResponse.json({ mesasge: "Posting" });
}
