function hashString(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function pickKeywords(text) {
  const stopwords = new Set([
    "the",
    "and",
    "for",
    "with",
    "from",
    "that",
    "this",
    "showing",
    "modern",
    "futuristic",
    "minimal",
    "premium",
    "dark",
    "theme",
    "image",
    "person",
    "screen",
    "using",
    "into",
    "over",
    "under",
    "only",
    "weekly",
    "insights",
    "frontend",
    "elegant",
    "a",
    "an",
    "of",
  ]);

  return tokenize(text)
    .filter((token) => token.length > 3 && !stopwords.has(token))
    .filter((token, index, all) => all.indexOf(token) === index)
    .slice(0, 5);
}

function detectMotif(text) {
  const tokens = new Set(tokenize(text));
  if (
    tokens.has("security") ||
    tokens.has("privacy") ||
    tokens.has("secure") ||
    tokens.has("compliance")
  ) {
    return "security";
  }
  if (
    tokens.has("performance") ||
    tokens.has("latency") ||
    tokens.has("rendering") ||
    tokens.has("cache") ||
    tokens.has("speed")
  ) {
    return "performance";
  }
  if (
    tokens.has("database") ||
    tokens.has("postgres") ||
    tokens.has("supabase") ||
    tokens.has("query")
  ) {
    return "data";
  }
  if (
    tokens.has("agent") ||
    tokens.has("agents") ||
    tokens.has("automation") ||
    tokens.has("workflow") ||
    tokens.has("ai")
  ) {
    return "network";
  }
  return "dashboard";
}

function MotifElements({ motif, seed, accentColor }) {
  if (motif === "network") {
    return (
      <>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={`node-${i}`}
            className="absolute rounded-full border border-white/30 bg-white/15 backdrop-blur-lg"
            style={{
              width: `${56 + ((seed >> i) % 24)}px`,
              height: `${56 + ((seed >> i) % 24)}px`,
              left: `${22 + i * 18}%`,
              top: `${28 + ((seed >> (i + 3)) % 26)}%`,
            }}
          />
        ))}
        {[0, 1, 2].map((i) => (
          <div
            key={`link-${i}`}
            className="absolute h-[2px] opacity-60"
            style={{
              left: `${28 + i * 18}%`,
              top: `${40 + ((seed >> (i + 1)) % 16)}%`,
              width: `${120 + ((seed >> (i + 2)) % 50)}px`,
              backgroundColor: accentColor,
            }}
          />
        ))}
      </>
    );
  }

  if (motif === "performance") {
    return (
      <div className="absolute right-16 bottom-14 flex items-end gap-3 opacity-70">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={`bar-${i}`}
            className="w-4 rounded-full"
            style={{
              height: `${36 + ((seed >> i) % 140)}px`,
              backgroundColor: i % 2 === 0 ? accentColor : "rgba(255,255,255,0.45)",
            }}
          />
        ))}
      </div>
    );
  }

  if (motif === "data") {
    return (
      <>
        {[0, 1, 2].map((i) => (
          <div
            key={`db-${i}`}
            className="absolute rounded-full border border-white/25 bg-white/10 backdrop-blur-lg"
            style={{
              width: "220px",
              height: "48px",
              left: `${52 + i * 2}%`,
              top: `${34 + i * 7}%`,
            }}
          />
        ))}
      </>
    );
  }

  if (motif === "security") {
    return (
      <div className="absolute right-20 top-24 w-[200px] h-[240px] opacity-75">
        <div
          className="w-full h-full border border-white/25 bg-white/10 backdrop-blur-xl"
          style={{
            clipPath:
              "polygon(50% 0%, 92% 18%, 92% 58%, 50% 100%, 8% 58%, 8% 18%)",
          }}
        />
        <div
          className="absolute left-1/2 top-[48%] -translate-x-1/2 w-[56px] h-[56px] rounded-full border border-white/30"
          style={{ backgroundColor: accentColor }}
        />
      </div>
    );
  }

  return (
    <>
      <div className="absolute right-16 top-20 w-[300px] h-[190px] rounded-[24px] border border-white/20 bg-white/10 backdrop-blur-xl" />
      <div className="absolute right-28 top-36 w-[220px] h-[130px] rounded-[18px] border border-white/15 bg-white/5 backdrop-blur-xl" />
      <div
        className="absolute right-24 top-28 h-[3px] rounded-full opacity-70"
        style={{ width: "180px", backgroundColor: accentColor }}
      />
    </>
  );
}

export default function DynamicVisualScene({
  imagePrompt = "",
  title = "",
  body = "",
  accentColor = "#3B82F6",
}) {
  const sourceText = `${title} ${body} ${imagePrompt}`.trim();
  const seed = hashString(sourceText || "default-visual-seed");
  const keywords = pickKeywords(sourceText);
  const motif = detectMotif(sourceText);

  const orbA = {
    left: `${10 + (seed % 24)}%`,
    top: `${8 + ((seed >> 3) % 28)}%`,
    size: 200 + (seed % 140),
  };
  const orbB = {
    left: `${54 + ((seed >> 5) % 28)}%`,
    top: `${34 + ((seed >> 7) % 34)}%`,
    size: 180 + ((seed >> 2) % 150),
  };

  return (
    <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
      <div
        className="absolute rounded-full blur-3xl opacity-25"
        style={{
          left: orbA.left,
          top: orbA.top,
          width: `${orbA.size}px`,
          height: `${orbA.size}px`,
          backgroundColor: accentColor,
        }}
      />
      <div
        className="absolute rounded-full blur-3xl opacity-20"
        style={{
          left: orbB.left,
          top: orbB.top,
          width: `${orbB.size}px`,
          height: `${orbB.size}px`,
          backgroundColor: accentColor,
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.45) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <MotifElements motif={motif} seed={seed} accentColor={accentColor} />

      <div className="absolute bottom-14 right-14 flex flex-wrap gap-3 max-w-[460px] justify-end">
        {keywords.map((keyword) => (
          <span
            key={keyword}
            className="px-4 py-2 rounded-full text-white/80 text-[18px] border border-white/20 bg-white/10 backdrop-blur-md"
          >
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
}
