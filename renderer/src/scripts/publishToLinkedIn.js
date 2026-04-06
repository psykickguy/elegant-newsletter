import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
const author = process.env.LINKEDIN_AUTHOR_URN;

const outputDir = path.join(process.cwd(), "src/output");

const pdfPath = path.join(outputDir, "carousel.pdf");
const postTextPath = path.join(outputDir, "linkedin-post.txt");
const outputJsonPath = path.join(outputDir, "linkedin-post.json");

async function publishToLinkedIn() {
  try {
    if (!accessToken) {
      throw new Error("Missing LINKEDIN_ACCESS_TOKEN in .env");
    }

    if (!author) {
      throw new Error("Missing LINKEDIN_AUTHOR_URN in .env");
    }

    if (!fs.existsSync(pdfPath)) {
      throw new Error("carousel.pdf not found in src/output");
    }

    const pdfBuffer = fs.readFileSync(pdfPath);

    let postText =
      "New LinkedIn carousel generated automatically with Psykick Labs.";

    if (fs.existsSync(postTextPath)) {
      postText = fs.readFileSync(postTextPath, "utf-8");
    }

    console.log("Initializing LinkedIn document upload...");

    const initializeResponse = await axios.post(
      "https://api.linkedin.com/rest/documents?action=initializeUpload",
      {
        initializeUploadRequest: {
          owner: author,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "LinkedIn-Version": "202504",
          "X-Restli-Protocol-Version": "2.0.0",
          "Content-Type": "application/json",
        },
      },
    );

    const uploadUrl =
      initializeResponse.data.value.uploadUrl ||
      initializeResponse.data.value.uploadInstructions?.[0]?.uploadUrl;

    const documentUrn =
      initializeResponse.data.value.document ||
      initializeResponse.data.value.documentUrn;

    if (!uploadUrl || !documentUrn) {
      throw new Error("Failed to get uploadUrl or document URN from LinkedIn");
    }

    console.log("LinkedIn document initialized successfully.");
    console.log("Document URN:", documentUrn);

    console.log("Uploading PDF to LinkedIn...");

    await axios.put(uploadUrl, pdfBuffer, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/pdf",
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    console.log("PDF uploaded successfully.");

    console.log("Creating LinkedIn post...");

    const postPayload = {
      author,
      commentary: postText,
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      content: {
        media: {
          title: "Weekly Carousel",
          id: documentUrn,
        },
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    };

    const postResponse = await axios.post(
      "https://api.linkedin.com/rest/posts",
      postPayload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "LinkedIn-Version": "202504",
          "X-Restli-Protocol-Version": "2.0.0",
          "Content-Type": "application/json",
        },
      },
    );

    console.log("Post response headers:", postResponse.headers);
    console.log("Post response data:", postResponse.data);

    const rawLinkedinPostUrn =
      postResponse.data?.id ||
      postResponse.headers["x-linkedin-id"] ||
      postResponse.headers["linkedin-id"] ||
      postResponse.headers["x-restli-id"] ||
      null;

    const cleanedPostUrn =
      typeof rawLinkedinPostUrn === "string" &&
      !rawLinkedinPostUrn.startsWith("urn:")
        ? `urn:li:share:${rawLinkedinPostUrn}`
        : rawLinkedinPostUrn;

    const linkedinPostUrl = cleanedPostUrn
      ? `https://www.linkedin.com/feed/update/${encodeURIComponent(
          cleanedPostUrn,
        )}/`
      : null;

    const outputData = {
      success: true,

      rendererStatus: "published",
      linkedinPublishStatus: "published",

      linkedinDocumentUrn: documentUrn,
      linkedinPostUrn: cleanedPostUrn,
      linkedinPostUrl,

      linkedinError: null,

      rawInitializeResponse: initializeResponse.data,
      rawPostResponse: postResponse.data,
      rawPostHeaders: postResponse.headers,

      publishedAt: new Date().toISOString(),
    };

    fs.writeFileSync(outputJsonPath, JSON.stringify(outputData, null, 2));

    console.log("LinkedIn post published successfully.");
    console.log("Raw Post URN:", rawLinkedinPostUrn);
    console.log("Cleaned Post URN:", cleanedPostUrn);
    console.log("Post URL:", linkedinPostUrl);
    console.log("Saved response to:", outputJsonPath);

    console.log(JSON.stringify(outputData, null, 2));
  } catch (error) {
    console.error("Failed to publish LinkedIn post");

    const errorData = {
      success: false,

      rendererStatus: "rendered",
      linkedinPublishStatus: "failed",

      linkedinDocumentUrn: null,
      linkedinPostUrn: null,
      linkedinPostUrl: null,

      linkedinError: error.message,
      details: error.response?.data || null,
      responseHeaders: error.response?.headers || null,

      publishedAt: new Date().toISOString(),
    };

    fs.writeFileSync(outputJsonPath, JSON.stringify(errorData, null, 2));

    console.error(JSON.stringify(errorData, null, 2));
  }
}

publishToLinkedIn();
