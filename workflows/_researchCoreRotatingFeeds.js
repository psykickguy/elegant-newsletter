/**
 * n8n Code node body: "Merge DB sources + dynamic topic search feeds".
 * Run:
 *   node workflows/_researchCoreRotatingFeeds.js
 * It prints JSON-escaped jsCode to embed into workflow JSON.
 */
const TOPIC_QUERIES = [
  "frontend architecture",
  "web performance optimization",
  "react server components",
  "next.js release",
  "vite ecosystem",
  "typescript tooling",
  "javascript runtime bun deno node",
  "css rendering engine browser",
  "edge runtime web framework",
  "webassembly frontend",
  "ai coding assistant",
  "llm inference open source",
  "agentic workflow developer tools",
  "ai agents software engineering",
  "retrieval augmented generation production",
  "developer productivity tooling",
  "open source release engineering",
  "cloudflare vercel platform updates",
  "github copilot developer workflow",
  "frontend compiler bundler",
  "web security cve javascript",
  "ui framework release notes",
  "browser api shipping stable",
  "observability frontend performance",
  "database for developers postgres supabase",
  "vector database embeddings llm",
  "engineering blog frontend",
  "ai infrastructure startup funding",
  "model context protocol mcp",
  "multi agent orchestration",
  "prompt engineering workflows",
  "benchmark inference latency",
];

const NODE_SCRIPT = `const normalizeUrl = (u) =>
  String(u || "")
    .trim()
    .replace(/\\/+$/, "")
    .toLowerCase();

const TOPIC_QUERIES = ${JSON.stringify(TOPIC_QUERIES)};
const DYNAMIC_WINDOW_DAYS = 7;
const DISCOVERY_SCORE_THRESHOLD = 75;
const DYNAMIC_TOPIC_LIMIT = 36;
const ROTATING_WINDOW = 12;

const STOP_WORDS = new Set([
  "the","and","for","with","from","that","this","into","your","you","are","how","why","what","when",
  "take","takes","like","new","news","over","under","more","less","real","story","week","weeks",
  "about","after","before","than","then","they","them","their","our","out","all","can","not","but",
  "use","using","used","via","vs","its","it","on","in","of","to","a","an","is","be","as","at","by",
  "launch","launches","launching","announces","debuts","brings","plans","reacts","veteran","big","end",
  "openai","cursor","github","linux","ubuntu","gpt","agents","agent","ai","llm"
]);

const tick = Math.floor(Date.now() / (1000 * 60 * 15));
const now = Date.now();
const minCreatedAt = now - DYNAMIC_WINDOW_DAYS * 24 * 60 * 60 * 1000;

const tokenize = (text) => {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\\s-]/g, " ")
    .split(/\\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 3 && !STOP_WORDS.has(t));
};

const addWeight = (bucket, key, amount) => {
  if (!key) return;
  bucket.set(key, (bucket.get(key) || 0) + amount);
};

const getAllInputs = () => {
  const combined = [];
  for (let idx = 0; idx < 4; idx++) {
    try {
      const rows = $input.all(idx);
      if (Array.isArray(rows) && rows.length) combined.push(...rows);
    } catch {
      // Input index does not exist in this run.
    }
  }
  return combined;
};

const looksLikeDiscovery = (row) => {
  if (!row || typeof row !== "object") return false;
  return (
    row.score !== undefined ||
    row.base_score !== undefined ||
    row.tags !== undefined ||
    row.title !== undefined
  );
};

const scoreForDiscovery = (row) => {
  const score = Number(row.score ?? row.base_score ?? 0);
  if (!Number.isFinite(score)) return 0;
  return score;
};

const parseCreatedAt = (row) => {
  const stamp = Date.parse(row.created_at || row.createdAt || "");
  return Number.isFinite(stamp) ? stamp : 0;
};

const buildDynamicQueries = (discoveries) => {
  const unigram = new Map();
  const bigram = new Map();

  for (const d of discoveries) {
    const score = scoreForDiscovery(d);
    const createdAt = parseCreatedAt(d);
    if (score < DISCOVERY_SCORE_THRESHOLD) continue;
    if (createdAt && createdAt < minCreatedAt) continue;

    const recencyBoost = createdAt ? Math.max(1, 1 + (createdAt - minCreatedAt) / (DYNAMIC_WINDOW_DAYS * 24 * 60 * 60 * 1000)) : 1;
    const weight = score * recencyBoost;

    const titleTokens = tokenize(d.title);
    const tagTokens = Array.isArray(d.tags) ? d.tags.flatMap((t) => tokenize(t)) : [];
    const categoryTokens = tokenize(d.category);
    const tokens = [...new Set([...titleTokens, ...tagTokens, ...categoryTokens])];

    for (const token of tokens) addWeight(unigram, token, weight);
    for (let i = 0; i < tokens.length - 1; i++) {
      addWeight(bigram, \`\${tokens[i]} \${tokens[i + 1]}\`, weight + 8);
    }
  }

  const topBigrams = [...bigram.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 18)
    .map(([k]) => k);
  const topUnigrams = [...unigram.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 24)
    .map(([k]) => k);

  const generated = [];
  for (const phrase of topBigrams) {
    generated.push(phrase);
    generated.push(\`\${phrase} developer tools\`);
  }
  for (const token of topUnigrams) {
    generated.push(\`\${token} engineering\`);
    generated.push(\`\${token} production\`);
  }

  const deduped = [...new Set(generated.map((q) => q.trim()).filter(Boolean))];
  return deduped.slice(0, DYNAMIC_TOPIC_LIMIT);
};

const allInputItems = getAllInputs();
const db = allInputItems
  .filter((item) => item?.json && item.json.source_url)
  .map((item) => ({ json: { ...item.json } }));

const discoveries = allInputItems
  .map((item) => item?.json || {})
  .filter((json) => looksLikeDiscovery(json));

const dynamicQueries = buildDynamicQueries(discoveries);
const queryPool = dynamicQueries.length >= 8 ? dynamicQueries : TOPIC_QUERIES;

const start = tick % queryPool.length;
const slice = [];
for (let i = 0; i < ROTATING_WINDOW; i++) {
  slice.push(queryPool[(start + i) % queryPool.length]);
}

const ephemeral = slice.map((query, idx) => {
  const q = encodeURIComponent(query);
  // Google News RSS search gives latest multi-domain coverage per topic.
  const source_url = \`https://news.google.com/rss/search?q=\${q}+when:2d&hl=en-US&gl=US&ceid=US:en\`;
  const depthBonus = /release|benchmark|architecture|runtime|compiler|security|mcp|agent/i.test(query)
    ? 3
    : 0;
  return ({
  json: {
    id: \`rotating_\${tick}_\${idx}\`,
    active: true,
    source_type: "rss",
    source_url,
    quality_score: 82 + depthBonus,
    label: \`Topic search: \${query}\`,
    dynamic_topic_mode: dynamicQueries.length >= 8,
    learned_query_count: dynamicQueries.length,
    created_at: new Date().toISOString(),
  },
})});

const seen = new Set(db.map((i) => normalizeUrl(i.json.source_url)));
const out = [...db];

for (const e of ephemeral) {
  const u = normalizeUrl(e.json.source_url);
  if (u && !seen.has(u)) {
    seen.add(u);
    out.push(e);
  }
}

out.sort((a, b) => (b.json.quality_score || 0) - (a.json.quality_score || 0));
return out.slice(0, 55);
`;

// eslint-disable-next-line no-console
console.log(JSON.stringify(NODE_SCRIPT));
