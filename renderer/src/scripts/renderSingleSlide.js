import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";

const outputDir = path.join(process.cwd(), "src/output");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function renderSlide() {
  const browser = await puppeteer.launch({
    headless: "new",
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 1080,
    height: 1080,
    deviceScaleFactor: 1,
  });

  await page.goto("http://localhost:5173", {
    waitUntil: "networkidle0",
  });

  await page.evaluate(() => document.fonts.ready);

  await new Promise((resolve) => setTimeout(resolve, 1500));

  await page.screenshot({
    path: path.join(outputDir, "slide-1.png"),
    fullPage: false,
  });

  await browser.close();

  console.log("Slide saved to src/output/slide-1.png");
}

renderSlide();
