import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import puppeteer from "puppeteer";

import QRCode from "qrcode";
const prisma = new PrismaClient();
const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

let browser = null;
let page: any = null;

const minimal_args = [
  "--autoplay-policy=user-gesture-required",
  "--disable-background-networking",
  "--disable-background-timer-throttling",
  "--disable-backgrounding-occluded-windows",
  "--disable-breakpad",
  "--disable-client-side-phishing-detection",
  "--disable-component-update",
  "--disable-default-apps",
  "--disable-dev-shm-usage",
  "--disable-domain-reliability",
  "--disable-extensions",
  "--disable-features=AudioServiceOutOfProcess",
  "--disable-hang-monitor",
  "--disable-ipc-flooding-protection",
  "--disable-notifications",
  "--disable-offer-store-unmasked-wallet-cards",
  "--disable-popup-blocking",
  "--disable-print-preview",
  "--disable-prompt-on-repost",
  "--disable-renderer-backgrounding",
  "--disable-setuid-sandbox",
  "--disable-speech-api",
  "--disable-sync",
  "--hide-scrollbars",
  "--ignore-gpu-blacklist",
  "--metrics-recording-only",
  "--mute-audio",
  "--no-default-browser-check",
  "--no-first-run",
  "--no-pings",
  "--no-sandbox",
  "--no-zygote",
  "--password-store=basic",
  "--use-gl=swiftshader",
  "--use-mock-keychain",
];
const blocked_domains = ["googlesyndication.com", "adservice.google.com"];

async function initPupetter() {
  browser = await puppeteer.launch({
    headless: "new",
    executablePath: process.env.CHROME_BIN,
    args: minimal_args,
  });
  page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", (request: any) => {
    const url = request.url();
    if (blocked_domains.some((domain) => url.includes(domain))) {
      request.abort();
    } else {
      request.continue();
    }
  });
}

export async function GET(request: Request) {
  await initPupetter();

  console.time("pdf-runtime");
  await page.goto(
    "http://localhost:3000",
    {
      waitUntil: "networkidle0",
    },
  );
  const buffer = await page.pdf({ format: "a4" });
  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `pdfss`,
    Body: buffer,
    ContentType: "application/pdf",
  };

  await s3Client.send(new PutObjectCommand(s3Params));

  console.timeEnd("pdf-runtime");
  return NextResponse.json({ message: "success pdfs" }, { status: 200 });
}

export async function POST(request: Request) {
  console.log("post route");
  return NextResponse.json({ mesasge: "Posting" });
}
