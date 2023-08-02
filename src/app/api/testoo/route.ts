import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { chromium, devices } from "playwright";

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export async function GET(request: Request) {
  try {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(
      "https://gadjah-fest-ticket-1a6f7gyzo-rafly-ananda.vercel.app",
    );

    const buffer = await page.pdf({ format: "a4" });
    const s3Params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `playwright-pdf`,
      Body: buffer,
      ContentType: "application/pdf",
    };

    await s3Client.send(new PutObjectCommand(s3Params));
    await browser.close();

    return NextResponse.json({ message: "success pdfs" }, { status: 200 });
  } catch (e) {
    console.log(e);
  }
}
