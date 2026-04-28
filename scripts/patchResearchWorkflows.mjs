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

function patchWorkflow(relPath, position, nodeId) {
  const full = path.join(root, relPath);
  const wf = JSON.parse(fs.readFileSync(full, "utf8"));
  const nodeName = "Merge DB + rotating feeds";
  if (wf.nodes.some((n) => n.name === nodeName)) {
    console.log("Already contains", nodeName, "—", relPath);
    return;
  }
  const jsCode = getJsCode();
  const newNode = {
    parameters: { jsCode },
    type: "n8n-nodes-base.code",
    typeVersion: 2,
    position,
    id: nodeId,
    name: nodeName,
  };
  const readIdx = wf.nodes.findIndex((n) => n.name === "Read Active Sources");
  if (readIdx === -1) {
    throw new Error(`Read Active Sources not found in ${relPath}`);
  }
  wf.nodes.splice(readIdx + 1, 0, newNode);
  wf.connections["Read Active Sources"].main[0] = [
    { node: nodeName, type: "main", index: 0 },
  ];
  wf.connections[nodeName] = {
    main: [[{ node: "Loop Sources", type: "main", index: 0 }]],
  };
  fs.writeFileSync(full, JSON.stringify(wf, null, 2));
  console.log("Patched", relPath);
}

patchWorkflow("workflows/Research Core.json", [48, 1200], "a9f2c1e0-merge-rotating-feeds-rc");
patchWorkflow(
  "workflows/Research Core V2 - Dynamic Sources.json",
  [150, 300],
  "a9f2c1e0-merge-rotating-feeds-rcv2",
);
