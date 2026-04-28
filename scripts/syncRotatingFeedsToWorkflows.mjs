/**
 * Updates jsCode on "Merge DB + rotating feeds" in Research workflows
 * after editing workflows/_researchCoreRotatingFeeds.js (run generator, then this).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function getJsCode() {
  const out = execSync("node workflows/_researchCoreRotatingFeeds.js", {
    cwd: root,
    encoding: "utf8",
  }).trim();
  return JSON.parse(out);
}

function sync(relPath) {
  const full = path.join(root, relPath);
  const wf = JSON.parse(fs.readFileSync(full, "utf8"));
  const node = wf.nodes.find((n) => n.name === "Merge DB + rotating feeds");
  const readSources = wf.nodes.find((n) => n.name === "Read Active Sources");
  if (!node) {
    console.warn("No Merge DB + rotating feeds node in", relPath);
    return;
  }
  if (!readSources) {
    console.warn("No Read Active Sources node in", relPath);
    return;
  }

  const discoveriesNodeName = "Read High Discoveries (7d)";
  const discoveriesNodeId =
    relPath.includes("V2")
      ? "read-high-discoveries-v2"
      : "read-high-discoveries-v1";
  let discoveriesNode = wf.nodes.find((n) => n.name === discoveriesNodeName);
  if (!discoveriesNode) {
    const [x, y] = readSources.position || [0, 0];
    discoveriesNode = {
      parameters: {
        operation: "executeQuery",
        query:
          "SELECT id, title, category, tags, score, base_score, created_at\nFROM discoveries\nWHERE created_at >= NOW() - INTERVAL '7 days'\n  AND COALESCE(score, base_score, 0) >= 75\nORDER BY COALESCE(score, base_score, 0) DESC, created_at DESC\nLIMIT 180;",
        options: {},
      },
      type: "n8n-nodes-base.postgres",
      typeVersion: 2.6,
      position: [x, y + 192],
      id: discoveriesNodeId,
      name: discoveriesNodeName,
      credentials: readSources.credentials,
    };
    wf.nodes.push(discoveriesNode);
  } else {
    discoveriesNode.parameters = {
      operation: "executeQuery",
      query:
        "SELECT id, title, category, tags, score, base_score, created_at\nFROM discoveries\nWHERE created_at >= NOW() - INTERVAL '7 days'\n  AND COALESCE(score, base_score, 0) >= 75\nORDER BY COALESCE(score, base_score, 0) DESC, created_at DESC\nLIMIT 180;",
      options: {},
    };
    discoveriesNode.type = "n8n-nodes-base.postgres";
    discoveriesNode.typeVersion = 2.6;
    discoveriesNode.credentials = readSources.credentials;
  }

  node.parameters.jsCode = getJsCode();

  wf.connections = wf.connections || {};
  wf.connections["Read Active Sources"] = {
    main: [[{ node: "Merge DB + rotating feeds", type: "main", index: 0 }]],
  };
  wf.connections[discoveriesNodeName] = {
    main: [[{ node: "Merge DB + rotating feeds", type: "main", index: 1 }]],
  };
  wf.connections["Merge DB + rotating feeds"] = {
    main: [[{ node: "Loop Sources", type: "main", index: 0 }]],
  };

  fs.writeFileSync(full, JSON.stringify(wf, null, 2));
  console.log("Synced", relPath);
}

sync("workflows/Research Core.json");
sync("workflows/Research Core V2 - Dynamic Sources.json");
