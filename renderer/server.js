import express from "express";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const app = express();
const PORT = 3001;

app.use(express.json({ limit: "10mb" }));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/render-carousel", async (req, res) => {
  try {
    const carouselData = req.body;

    const outputPath = path.join(
      process.cwd(),
      "src/sample-data/generatedCarousel.json",
    );

    fs.writeFileSync(outputPath, JSON.stringify(carouselData, null, 2));

    console.log("Carousel JSON received");
    console.log("Starting render pipeline...");

    execSync("npm run render:all", { stdio: "inherit" });
    execSync("npm run generate:pdf", { stdio: "inherit" });
    execSync("npm run generate:zip", { stdio: "inherit" });
    execSync("npm run publish:linkedin", { stdio: "inherit" });
    execSync("npm run upload:assets", { stdio: "inherit" });

    const uploadedAssetsPath = path.join(
      process.cwd(),
      "src/output/uploaded-assets.json",
    );

    const linkedinPostPath = path.join(
      process.cwd(),
      "src/output/linkedin-post.json",
    );

    const uploadedAssets = JSON.parse(
      fs.readFileSync(uploadedAssetsPath, "utf-8"),
    );

    let linkedinData = {};

    if (fs.existsSync(linkedinPostPath)) {
      linkedinData = JSON.parse(fs.readFileSync(linkedinPostPath, "utf-8"));
    }

    return res.json({
      success: true,

      slideUrls: uploadedAssets.slides || [],
      pdfUrl: uploadedAssets.pdf || null,
      zipUrl: uploadedAssets.zip || null,

      textFiles: uploadedAssets.textFiles || [],
      metadataFiles: uploadedAssets.metadataFiles || [],

      linkedinPostUrl: linkedinData.linkedinPostUrl ?? null,

      linkedinPostUrn: linkedinData.linkedinPostUrn || null,
      linkedinDocumentUrn: linkedinData.linkedinDocumentUrn || null,

      linkedinPublishStatus:
        linkedinData.linkedinPublishStatus || "not_attempted",

      linkedinError: linkedinData.linkedinError || null, // ADD THIS

      linkedinPublishedAt: linkedinData.publishedAt || new Date().toISOString(),

      rendererStatus:
        linkedinData.rendererStatus ||
        (linkedinData.success ? "published" : "rendered"),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Renderer API running on http://localhost:${PORT}`);
});
