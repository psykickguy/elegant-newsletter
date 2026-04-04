import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";

const outputDir = path.join(process.cwd(), "src/output");

async function generatePDF() {
  const pdfDoc = await PDFDocument.create();

  const slideFiles = fs
    .readdirSync(outputDir)
    .filter((file) => /^slide-\d+\.png$/.test(file))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)[0]);
      const numB = parseInt(b.match(/\d+/)[0]);
      return numA - numB;
    });

  if (slideFiles.length === 0) {
    console.log("No slide PNGs found in src/output");
    return;
  }

  for (const slideFile of slideFiles) {
    const imagePath = path.join(outputDir, slideFile);
    const imageBytes = fs.readFileSync(imagePath);

    const pngImage = await pdfDoc.embedPng(imageBytes);

    const page = pdfDoc.addPage([1080, 1080]);

    page.drawImage(pngImage, {
      x: 0,
      y: 0,
      width: 1080,
      height: 1080,
    });
  }

  const pdfBytes = await pdfDoc.save();

  const pdfPath = path.join(outputDir, "carousel.pdf");

  fs.writeFileSync(pdfPath, pdfBytes);

  console.log(`PDF created successfully: ${pdfPath}`);
}

generatePDF();
