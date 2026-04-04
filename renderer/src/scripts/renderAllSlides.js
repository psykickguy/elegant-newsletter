import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";

const outputDir = path.join(process.cwd(), "src/output");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function renderSlides() {
  const browser = await puppeteer.launch({
    headless: "new",
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 1080,
    height: 1080,
    deviceScaleFactor: 1,
  });

  for (let i = 0; i < 6; i++) {
    const url = `http://localhost:5173?slide=${i}`;

    console.log(`Rendering slide ${i + 1}...`);

    await page.goto(url, {
      waitUntil: "networkidle0",
    });

    await page.evaluate(() => document.fonts.ready);

    await new Promise((resolve) => setTimeout(resolve, 1200));

    await page.screenshot({
      path: path.join(outputDir, `slide-${i + 1}.png`),
      fullPage: false,
    });
  }

  await browser.close();

  console.log("All slides rendered successfully.");
}
renderSlides();
