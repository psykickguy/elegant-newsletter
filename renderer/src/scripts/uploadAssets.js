import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const outputDir = path.join(process.cwd(), "src/output");

async function uploadAssets() {
  const files = fs.readdirSync(outputDir);

  const uploadedAssets = {
    slides: [],
    pdf: null,
    zip: null,
    textFiles: [],
    metadataFiles: [],
  };

  for (const file of files) {
    const filePath = path.join(outputDir, file);

    try {
      let resourceType = "image";

      if (
        file.endsWith(".pdf") ||
        file.endsWith(".zip") ||
        file.endsWith(".txt") ||
        file.endsWith(".json")
      ) {
        resourceType = "raw";
      }

      const result = await cloudinary.uploader.upload(filePath, {
        folder: "elegant-newsletter",
        resource_type: resourceType,
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      });

      if (file.endsWith(".png")) {
        uploadedAssets.slides.push({
          file,
          url: result.secure_url,
        });
      }

      if (file.endsWith(".pdf")) {
        uploadedAssets.pdf = result.secure_url;
      }

      if (file.endsWith(".zip")) {
        uploadedAssets.zip = result.secure_url;
      }

      if (file.endsWith(".txt")) {
        uploadedAssets.textFiles.push({
          file,
          url: result.secure_url,
        });
      }

      if (file.endsWith(".json")) {
        uploadedAssets.metadataFiles.push({
          file,
          url: result.secure_url,
        });
      }

      console.log(`Uploaded: ${file}`);
      console.log(result.secure_url);
    } catch (error) {
      console.error(`Failed to upload ${file}`);
      console.error(error);
    }
  }

  const uploadSummaryPath = path.join(outputDir, "uploaded-assets.json");

  fs.writeFileSync(uploadSummaryPath, JSON.stringify(uploadedAssets, null, 2));

  console.log("Upload summary saved to src/output/uploaded-assets.json");
}

uploadAssets();
