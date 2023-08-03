import { chromium } from "playwright";
import { Browser, BrowserContext, Page } from "playwright";
import { uploadPdftoS3 } from "./s3Init";

let browser: Browser;
let context: BrowserContext;
let page: Page;
let isInit: boolean = false;

async function init() {
  browser = await chromium.launch();
  context = await browser.newContext();
  page = await context.newPage();
  isInit = true;
}

export async function generatePdf(bookingId: string, url: string) {
  if (!isInit) {
    await init();
  }

  await page.goto(
    url,
    {
      waitUntil: "networkidle",
    },
  );
  const buffer = await page.pdf({ format: "a4" });
  await uploadPdftoS3(bookingId, buffer);
  return bookingId;
}
