import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SCAN_DIRS = ["app", "components", "data", "lib"];
const EXTENSIONS = new Set([".js", ".jsx", ".mjs", ".ts", ".tsx"]);

const DISALLOWED_COPY = [
  { pattern: /\bclinician-designed\b/i, reason: "Use clinician-informed or evidence-framed unless the credential context is exact." },
  { pattern: /\bdesigned by a clinician\b/i, reason: "Avoid implying a licensed clinician authored the tool." },
  { pattern: /\bhealthcare professional-designed\b/i, reason: "Avoid over-specific credential claims." },
  { pattern: /\blicensed clinician\b/i, reason: "Only use licensed status in a fact-specific context outside product marketing." },
  { pattern: /\bboard-certified\b/i, reason: "Do not claim board certification unless explicitly verified." },
  { pattern: /\bverified provider data\b/i, reason: "Provider search returns registry-listed data; AIForj does not verify providers." },
  { pattern: /\b100% private\b/i, reason: "Use exact, feature-specific privacy language." },
  { pattern: /\bnothing leaves your browser\b/i, reason: "Use local-first/free-text-stays-local only where technically true." },
  { pattern: /\bfastest stress relief\b/i, reason: "Avoid superlative clinical claims." },
  { pattern: /\bbiological cheat code\b/i, reason: "Avoid overclaiming mechanisms." },
  { pattern: /\bsingle most effective\b/i, reason: "Avoid guaranteed or universal outcome framing." },
  { pattern: /"@type"\s*:\s*"MedicalCondition"/i, reason: "AIForj pages should not use medical schema for wellness self-guided tools." },
];

function collectFiles(dir) {
  const absolute = path.join(ROOT, dir);
  if (!fs.existsSync(absolute)) return [];

  const entries = fs.readdirSync(absolute, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const child = path.join(absolute, entry.name);
    if (entry.isDirectory()) return collectFiles(path.relative(ROOT, child));
    if (!EXTENSIONS.has(path.extname(entry.name))) return [];
    return [child];
  });
}

test("public source avoids overstrong credential, privacy, provider, and clinical claims", () => {
  const failures = [];

  for (const file of SCAN_DIRS.flatMap(collectFiles)) {
    const source = fs.readFileSync(file, "utf8");
    for (const rule of DISALLOWED_COPY) {
      if (rule.pattern.test(source)) {
        failures.push(`${path.relative(ROOT, file)}: ${rule.reason}`);
      }
    }
  }

  assert.deepEqual(failures, []);
});
