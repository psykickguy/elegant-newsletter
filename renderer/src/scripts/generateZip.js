import fs from "fs";
import path from "path";
import archiver from "archiver";

const outputDir = path.join(process.cwd(), "src/output");
const zipPath = path.join(outputDir, "carousel-assets.zip");

async function generateZip() {
  const output = fs.createWriteStream(zipPath);
  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  output.on("close", () => {
    console.log(`ZIP created successfully: ${zipPath}`);
    console.log(`Total size: ${archive.pointer()} bytes`);
  });

  archive.on("error", (err) => {
    throw err;
  });

  archive.pipe(output);

  const files = fs.readdirSync(outputDir);

  for (const file of files) {
    const filePath = path.join(outputDir, file);

    const isValid =
      file.endsWith(".png") ||
      file.endsWith(".pdf") ||
      file.endsWith(".txt") ||
      file.endsWith(".json");

    if (isValid) {
      archive.file(filePath, { name: file });
    }
  }

  await archive.finalize();
}

generateZip();
