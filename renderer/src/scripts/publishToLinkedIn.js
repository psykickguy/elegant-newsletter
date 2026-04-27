import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
const author = process.env.LINKEDIN_AUTHOR_URN;

/** YYYYMM — LinkedIn rejects inactive versions with 426 NONEXISTENT_VERSION */
const DEFAULT_VERSION_CANDIDATES = [
  "202509",
  "202510",
  "202511",
  "202512",
  "202601",
  "202602",
  "202603",
  "202604",
];

function normalizeLinkedInVersion(version) {
  if (!version) return null;
  const digitsOnly = String(version).replace(/\D/g, "");
  if (digitsOnly.length >= 6) {
    return digitsOnly.slice(0, 6);
  }
  return null;
}

const envVersion = normalizeLinkedInVersion(process.env.LINKEDIN_API_VERSION);
const versionCandidates = envVersion
  ? [envVersion, ...DEFAULT_VERSION_CANDIDATES.filter((v) => v !== envVersion)]
  : [...DEFAULT_VERSION_CANDIDATES];

const outputDir = path.join(process.cwd(), "src/output");

const pdfPath = path.join(outputDir, "carousel.pdf");
const postTextPath = path.join(outputDir, "linkedin-post.txt");
const outputJsonPath = path.join(outputDir, "linkedin-post.json");

const DOCUMENT_POLL_MS = 120_000;
const DOCUMENT_POLL_INTERVAL_MS = 2_000;

function getLinkedInHeaders(version) {
  return {
    Authorization: `Bearer ${accessToken}`,
    "LinkedIn-Version": version,
    "X-Restli-Protocol-Version": "2.0.0",
    "Content-Type": "application/json",
  };
}

function isNonexistentVersionError(error) {
  return (
    error?.response?.status === 426 &&
    error?.response?.data?.code === "NONEXISTENT_VERSION"
  );
}

/**
 * Tries `versionCandidates` until a call succeeds or a non-version error is thrown.
 * @param {(v: string) => Promise<import("axios").AxiosResponse>} fn
 */
async function withVersionCandidates(fn) {
  let lastError;
  for (const v of versionCandidates) {
    try {
      return { version: v, response: await fn(v) };
    } catch (error) {
      lastError = error;
      if (isNonexistentVersionError(error)) {
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

function buildErrorResponse(error, stage, extras = {}) {
  return {
    success: false,
    rendererStatus: "rendered",
    linkedinPublishStatus: "failed",
    linkedinDocumentUrn: extras.documentUrn || null,
    linkedinPostUrn: null,
    linkedinPostUrl: null,
    linkedinError: error.message,
    linkedinFailedStage: stage,
    details: error.response?.data || null,
    responseStatus: error.response?.status || null,
    responseHeaders: error.response?.headers || null,
    publishedAt: new Date().toISOString(),
  };
}

/**
 * @see https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/documents-api
 * Document must be AVAILABLE before POST /rest/posts or LinkedIn may return 5xx.
 */
async function waitForDocumentAvailable(documentUrn, linkedinVersion) {
  const deadline = Date.now() + DOCUMENT_POLL_MS;

  while (Date.now() < deadline) {
    const { data } = await axios.get(
      `https://api.linkedin.com/rest/documents/${encodeURIComponent(documentUrn)}`,
      { headers: getLinkedInHeaders(linkedinVersion) },
    );

    const status = data?.status;

    if (status === "AVAILABLE") {
      return data;
    }

    if (status === "PROCESSING_FAILED") {
      throw new Error(
        `LinkedIn document processing failed: ${JSON.stringify(data)}`,
      );
    }

    await new Promise((r) => setTimeout(r, DOCUMENT_POLL_INTERVAL_MS));
  }

  throw new Error(
    `LinkedIn document did not become AVAILABLE within ${DOCUMENT_POLL_MS / 1000}s; last URN: ${documentUrn}`,
  );
}

/**
 * @see same doc — 201 + post id in `x-restli-id`
 */
function extractPostUrnFromResponse(postResponse) {
  const raw =
    postResponse.headers["x-restli-id"] ||
    postResponse.data?.id ||
    postResponse.headers["x-linkedin-id"] ||
    null;

  if (!raw) return null;

  if (String(raw).startsWith("urn:li:share:")) {
    return String(raw);
  }
  if (String(raw).startsWith("urn:li:ugcPost:")) {
    return String(raw);
  }
  return `urn:li:share:${raw}`;
}

function postUrlFromUrn(urn) {
  if (!urn) return null;
  return `https://www.linkedin.com/feed/update/${encodeURIComponent(urn)}/`;
}

async function publishToLinkedIn() {
  let documentUrn = null;

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

    const docTitle = path.basename(pdfPath);

    console.log("Initializing LinkedIn document upload...");

    const { version: activeVersion, response: initializeResponse } =
      await withVersionCandidates((v) =>
        axios.post(
          "https://api.linkedin.com/rest/documents?action=initializeUpload",
          {
            initializeUploadRequest: {
              owner: author,
            },
          },
          { headers: getLinkedInHeaders(v) },
        ),
      );

    const uploadUrl =
      initializeResponse.data.value.uploadUrl ||
      initializeResponse.data.value.uploadInstructions?.[0]?.uploadUrl;

    documentUrn =
      initializeResponse.data.value.document ||
      initializeResponse.data.value.documentUrn ||
      null;

    if (!uploadUrl || !documentUrn) {
      throw new Error("Failed to get uploadUrl or document URN from LinkedIn");
    }

    console.log("LinkedIn document initialized successfully.");
    console.log("Document URN:", documentUrn);
    console.log("Using LinkedIn-Version:", activeVersion);

    console.log("Uploading PDF to LinkedIn...");

    await axios.put(uploadUrl, pdfBuffer, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/pdf",
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    console.log("PDF upload finished. Waiting for document to be AVAILABLE...");

    await waitForDocumentAvailable(documentUrn, activeVersion);

    console.log("Document is AVAILABLE. Creating LinkedIn post...");

    // Official example from Microsoft Learn (Documents API → Create Document content)
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
          title: docTitle,
          id: documentUrn,
        },
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    };

    const postResponse = await axios.post(
      "https://api.linkedin.com/rest/posts",
      postPayload,
      { headers: getLinkedInHeaders(activeVersion) },
    );

    console.log("Post response status:", postResponse.status);
    console.log("Post response data:", postResponse.data);

    const cleanedPostUrn = extractPostUrnFromResponse(postResponse);
    const linkedinPostUrl = postUrlFromUrn(cleanedPostUrn);

    const outputData = {
      success: true,

      rendererStatus: "published",
      linkedinPublishStatus: "published",
      linkedinApiVersion: activeVersion,

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
    console.log("Post URN:", cleanedPostUrn);
    console.log("Post URL:", linkedinPostUrl);
    console.log("Saved response to:", outputJsonPath);

    console.log(JSON.stringify(outputData, null, 2));
  } catch (error) {
    console.error("Failed to publish LinkedIn post");
    const errorData = buildErrorResponse(error, "publish_to_linkedin", {
      documentUrn,
    });

    fs.writeFileSync(outputJsonPath, JSON.stringify(errorData, null, 2));

    console.error(JSON.stringify(errorData, null, 2));
  }
}

publishToLinkedIn();
