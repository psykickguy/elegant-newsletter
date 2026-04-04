import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import generatedCarousel from "../sample-data/generatedCarousel.json" assert { type: "json" };

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

  const totalSlides = generatedCarousel.slides.length;

  if (totalSlides === 0) {
    console.log("No slides found in generatedCarousel.json");
    await browser.close();
    return;
  }

  for (let i = 0; i < totalSlides; i++) {
    const url = `http://localhost:5173?slide=${i}`;

    console.log(`Rendering slide ${i + 1} of ${totalSlides}...`);

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

  console.log(`Successfully rendered ${totalSlides} slides.`);
}

renderSlides();
