import express from "express";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const app = express();
const PORT = 3001;

app.use(express.json({ limit: "10mb" }));

/**
 * Normalize POST /render-carousel body:
 * - Carousel: either `{ carousel_title, slides }` or nested `{ linkedin_carousel_visual_json: { ... } }` (n8n).
 * - Caption: `linkedinPostText` | `linkedin_post` | `linkedinCaption` (plain text for LinkedIn publish).
 */
function normalizeRenderPayload(body) {
  const raw = body && typeof body === "object" ? body : {};
  const nested =
    raw.linkedin_carousel_visual_json &&
    typeof raw.linkedin_carousel_visual_json === "object"
      ? raw.linkedin_carousel_visual_json
      : null;

  const slides = Array.isArray(raw.slides)
    ? raw.slides
    : nested?.slides && Array.isArray(nested.slides)
      ? nested.slides
      : [];

  const carousel_title =
    typeof raw.carousel_title === "string"
      ? raw.carousel_title
      : typeof nested?.carousel_title === "string"
        ? nested.carousel_title
        : "";

  const captionCandidate = [
    raw.linkedinPostText,
    raw.linkedin_post,
    raw.linkedinCaption,
  ].find((x) => typeof x === "string");

  const linkedinPlainText =
    captionCandidate !== undefined ? captionCandidate.trim() : "";

  return {
    carouselJson: { carousel_title, slides },
    linkedinPlainText,
  };
}

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/render-carousel", async (req, res) => {
  try {
    const { carouselJson, linkedinPlainText } = normalizeRenderPayload(req.body);

    const sampleDataPath = path.join(
      process.cwd(),
      "src/sample-data/generatedCarousel.json",
    );

    const outputDir = path.join(process.cwd(), "src/output");
    const linkedinPostTxtPath = path.join(outputDir, "linkedin-post.txt");

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(sampleDataPath, JSON.stringify(carouselJson, null, 2));

    fs.writeFileSync(
      linkedinPostTxtPath,
      linkedinPlainText.length > 0
        ? linkedinPlainText
        : "New LinkedIn carousel generated automatically with Psykick Labs.",
      "utf-8",
    );

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
