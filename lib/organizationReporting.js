import fs from "fs";
import path from "path";
import { createHash, randomUUID } from "crypto";
import { get, list, put } from "@vercel/blob";
import { TECHNIQUES } from "../app/techniques/data";
import { getAllInterventions } from "../data/interventions";

const DEFAULT_BLOB_PREFIX = "organization-reporting";
const BLOB_REBUILD_BATCH_SIZE = 20;

function createEmptySnapshot(source = "empty") {
  return {
    source,
    hasData: false,
    monthlyActiveUsers: 0,
    completionRate: 0,
    positiveShiftRate: 0,
    medianTimeToStartSeconds: null,
    weeklyTrend: [],
    topNeeds: [],
    topTools: [],
    rolloutSurfaces: [],
    eventCount: 0,
    updatedAt: null,
  };
}

const DEFAULT_SNAPSHOT = createEmptySnapshot("empty");

function getInMemoryStore() {
  if (!globalThis.__aiforjAggregateMetrics) {
    globalThis.__aiforjAggregateMetrics = [];
  }
  return globalThis.__aiforjAggregateMetrics;
}

const TOOL_FAMILY_OVERRIDES = {
  "54321-grounding": "Breath and grounding",
  "grounding-54321": "Breath and grounding",
  "physiological-sigh": "Breath and grounding",
  "box-breathing": "Breath and grounding",
  "body-scan": "Breath and grounding",
  "tipp-skills": "Breath and grounding",
  "worry-decision-tree": "Decision and triage tools",
  "decision-matrix": "Decision and triage tools",
  "brain-dump-triage": "Decision and triage tools",
  "decatastrophizing": "Thought reframing",
  "thought-record-lite": "Thought reframing",
  "full-cognitive-restructuring": "Thought reframing",
  "name-the-story": "Thought reframing",
  "companion-follow-up": "Companion follow-up",
};

const NEED_LABELS = {
  anxious: "Anxiety spikes",
  "sad-low": "Low mood / depression",
  angry: "Conflict / anger",
  overwhelmed: "Overwhelmed / burnout",
  "shame-guilt": "Shame / guilt",
  "grief-loss": "Grief / loss",
  "numb-disconnected": "Numb / disconnected",
  lonely: "Loneliness / disconnection",
  "stressed-burned-out": "Overwhelmed / burnout",
  "scared-fearful": "Fear / panic",
  "stuck-lost": "Decision paralysis / feeling stuck",
  "self-destructive": "High-risk coping",
};

const SOURCE_LABELS = {
  org_direct: "Direct org link",
  direct_org_link: "Direct org link",
  peer_share: "Shared by peer",
  shared_by_peer: "Shared by peer",
  clinician_referral: "Clinician / care referral",
  care_referral: "Clinician / care referral",
  help_guide: "Help guide discovery",
  help: "Help guide discovery",
  start: "Direct org link",
  tools: "Direct org link",
  share_link: "Shared by peer",
};

const toolMeta = new Map();

for (const technique of TECHNIQUES) {
  toolMeta.set(technique.slug, {
    kind: "technique",
    modality: technique.modality || "",
    family: TOOL_FAMILY_OVERRIDES[technique.slug] || null,
  });
}

for (const intervention of getAllInterventions()) {
  toolMeta.set(intervention.id, {
    kind: "intervention",
    modality: intervention.modality || "",
    family:
      TOOL_FAMILY_OVERRIDES[intervention.id] ||
      TOOL_FAMILY_OVERRIDES[intervention.canonicalTechniqueSlug] ||
      null,
  });
}

function hasBlobReportingStore() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function resolveBlobReportingPrefix() {
  const configured = String(
    process.env.AIFORJ_ORG_REPORTING_PREFIX || DEFAULT_BLOB_PREFIX
  ).trim();

  return configured.replace(/^\/+|\/+$/g, "") || DEFAULT_BLOB_PREFIX;
}

function resolveBlobEventPrefix() {
  return `${resolveBlobReportingPrefix()}/events/`;
}

function resolveBlobSnapshotPath() {
  return `${resolveBlobReportingPrefix()}/snapshots/latest.json`;
}

function resolveMetricsPath() {
  const configured = process.env.AIFORJ_AGGREGATE_METRICS_FILE;
  if (!configured) {
    if (process.env.VERCEL) {
      return "/tmp/aiforj-aggregate-metrics.ndjson";
    }
    return path.join(process.cwd(), ".data", "aggregate-metrics.ndjson");
  }
  return path.isAbsolute(configured)
    ? configured
    : path.join(process.cwd(), configured);
}

function parseMetricsFile(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return [];

  if (trimmed.startsWith("[")) {
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? parsed : [];
  }

  return trimmed
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function hashClientId(clientId) {
  if (!clientId) return null;

  return createHash("sha256")
    .update(`aiforj-org-reporting:${clientId}`)
    .digest("hex")
    .slice(0, 24);
}

function normalizeMetricEntry(entry) {
  return {
    ...entry,
    clientId: hashClientId(entry.clientId),
  };
}

function buildBlobEventPath(entry) {
  const date = new Date(entry.receivedAt || Date.now());
  const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;
  const year = String(safeDate.getUTCFullYear());
  const month = String(safeDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(safeDate.getUTCDate()).padStart(2, "0");
  const stamp = safeDate.toISOString().replace(/[:.]/g, "-");

  return `${resolveBlobEventPrefix()}${year}/${month}/${day}/${stamp}-${randomUUID()}.json`;
}

async function readPrivateBlobText(pathname) {
  const blob = await get(pathname, { access: "private" });
  if (!blob?.stream) return null;
  return new Response(blob.stream).text();
}

function parseBlobJson(raw, label) {
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error(`Unable to parse ${label}:`, error);
    return null;
  }
}

async function listAllBlobEntries(prefix) {
  const blobs = [];
  let cursor;

  do {
    const page = await list({ prefix, cursor, limit: 1000 });
    blobs.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  return blobs;
}

function getLastUploadedAt(blobs) {
  if (!blobs.length) return null;

  return blobs
    .reduce((latest, blob) => {
      if (!latest || blob.uploadedAt > latest) return blob.uploadedAt;
      return latest;
    }, null)
    ?.toISOString();
}

function getToolFamily(toolId) {
  const meta = toolMeta.get(toolId);
  if (meta?.family) return meta.family;

  const modality = String(meta?.modality || "").toLowerCase();
  if (modality.includes("somatic") || modality.includes("polyvagal") || modality.includes("breath")) {
    return "Breath and grounding";
  }
  if (modality.includes("decision") || modality.includes("planning") || modality.includes("problem")) {
    return "Decision and triage tools";
  }
  if (modality.includes("cbt") || modality.includes("act") || modality.includes("thinking")) {
    return "Thought reframing";
  }
  if (toolId === "companion") {
    return "Companion follow-up";
  }
  return "Guided emotional tools";
}

function getNeedLabel(emotion) {
  return NEED_LABELS[String(emotion || "").toLowerCase()] || "General emotional support";
}

function getSourceLabel(source) {
  return SOURCE_LABELS[String(source || "").toLowerCase()] || "Direct org link";
}

function percent(numerator, denominator) {
  if (!denominator) return 0;
  return Math.round((numerator / denominator) * 100);
}

function topPercentages(counts, limit) {
  const entries = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
  const total = entries.reduce((sum, [, value]) => sum + value, 0);

  if (!total) return [];

  return entries.map(([label, value]) => ({
    label,
    value: Math.max(1, Math.round((value / total) * 100)),
  }));
}

function groupByWeek(events) {
  const buckets = new Map();

  for (const event of events) {
    const date = new Date(event.receivedAt || event.ts || Date.now());
    if (Number.isNaN(date.getTime())) continue;

    const weekKey = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
    if (!buckets.has(weekKey)) {
      buckets.set(weekKey, {
        weekKey,
        starts: 0,
        completions: 0,
        positive: 0,
        measured: 0,
      });
    }
    const bucket = buckets.get(weekKey);
    if (event.event === "tool_started") bucket.starts += 1;
    if (event.event === "tool_completed") {
      bucket.completions += 1;
      if (event.shiftBucket) {
        bucket.measured += 1;
        if (String(event.shiftBucket).startsWith("up_")) bucket.positive += 1;
      }
    }
  }

  return [...buckets.values()]
    .sort((a, b) => a.weekKey.localeCompare(b.weekKey))
    .slice(-4)
    .map((bucket, index) => ({
      week: `Week ${index + 1}`,
      starts: bucket.starts,
      completions: bucket.completions,
      positiveShiftRate: percent(bucket.positive, bucket.measured || bucket.completions || 1),
    }));
}

function aggregateEvents(events, source = "live_configured") {
  const relevant = events.filter(
    (event) =>
      event &&
      typeof event === "object" &&
      ["tool_started", "tool_completed"].includes(event.event)
  );

  if (!relevant.length) {
    return createEmptySnapshot(source);
  }

  const uniqueClients = new Set();
  let starts = 0;
  let completions = 0;
  let measured = 0;
  let positive = 0;
  const needCounts = {};
  const toolCounts = {};
  const sourceCounts = {};

  for (const event of relevant) {
    if (event.clientId) uniqueClients.add(event.clientId);
    if (event.event === "tool_started") starts += 1;
    if (event.event === "tool_completed") completions += 1;
    if (event.shiftBucket) {
      measured += 1;
      if (String(event.shiftBucket).startsWith("up_")) positive += 1;
    }

    const needLabel = getNeedLabel(event.emotion);
    needCounts[needLabel] = (needCounts[needLabel] || 0) + 1;

    const toolFamily = getToolFamily(event.toolId);
    toolCounts[toolFamily] = (toolCounts[toolFamily] || 0) + 1;

    const sourceLabel = getSourceLabel(event.source);
    sourceCounts[sourceLabel] = (sourceCounts[sourceLabel] || 0) + 1;
  }

  const weeklyTrend = groupByWeek(relevant);

  return {
    source,
    hasData: true,
    monthlyActiveUsers: uniqueClients.size || 0,
    completionRate: percent(completions, starts || completions || 1),
    positiveShiftRate: percent(positive, measured || completions || 1),
    medianTimeToStartSeconds: null,
    weeklyTrend,
    topNeeds: topPercentages(needCounts, 4),
    topTools: topPercentages(toolCounts, 4),
    rolloutSurfaces: topPercentages(sourceCounts, 4),
    eventCount: relevant.length,
    updatedAt: new Date().toISOString(),
  };
}

async function readCachedBlobSnapshot(eventCount, lastEventUploadedAt) {
  let raw;

  try {
    raw = await readPrivateBlobText(resolveBlobSnapshotPath());
  } catch (error) {
    console.warn("Unable to read cached blob snapshot; rebuilding from events.", error);
    return null;
  }

  const parsed = parseBlobJson(raw, "blob reporting snapshot");

  if (!parsed) return null;
  if (parsed.eventCount !== eventCount) return null;
  if (parsed.lastEventUploadedAt !== lastEventUploadedAt) return null;

  return parsed;
}

async function readBlobEvents(blobs) {
  const events = [];

  for (let index = 0; index < blobs.length; index += BLOB_REBUILD_BATCH_SIZE) {
    const batch = blobs.slice(index, index + BLOB_REBUILD_BATCH_SIZE);
    const batchEvents = await Promise.all(
      batch.map(async (blob) => {
        try {
          const raw = await readPrivateBlobText(blob.pathname);
          return parseBlobJson(raw, `blob metric ${blob.pathname}`);
        } catch (error) {
          console.error(`Unable to read blob metric ${blob.pathname}:`, error);
          return null;
        }
      })
    );

    events.push(...batchEvents.filter(Boolean));
  }

  return events;
}

async function writeCachedBlobSnapshot(snapshot) {
  try {
    await put(resolveBlobSnapshotPath(), JSON.stringify(snapshot), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return true;
  } catch (error) {
    console.error("Unable to write aggregate blob snapshot:", error);
    return false;
  }
}

async function getBlobBackedSnapshot() {
  if (!hasBlobReportingStore()) return null;

  try {
    const blobs = await listAllBlobEntries(resolveBlobEventPrefix());
    if (!blobs.length) {
      return createEmptySnapshot("live_blob");
    }

    const lastEventUploadedAt = getLastUploadedAt(blobs);
    const cached = await readCachedBlobSnapshot(blobs.length, lastEventUploadedAt);
    if (cached) return cached;

    const events = await readBlobEvents(blobs);
    if (!events.length) {
      return {
        ...createEmptySnapshot("live_blob"),
        eventCount: blobs.length,
        lastEventUploadedAt,
      };
    }

    const rebuilt = {
      ...aggregateEvents(events, "live_blob"),
      eventCount: blobs.length,
      lastEventUploadedAt,
      updatedAt: new Date().toISOString(),
    };

    await writeCachedBlobSnapshot(rebuilt);
    return rebuilt;
  } catch (error) {
    console.error("Unable to read aggregate blob metrics:", error);
    return null;
  }
}

async function appendBlobMetricEntry(entry) {
  if (!hasBlobReportingStore()) return false;

  try {
    await put(buildBlobEventPath(entry), JSON.stringify(entry), {
      access: "private",
      addRandomSuffix: false,
      contentType: "application/json",
    });
    return true;
  } catch (error) {
    console.error("Unable to append aggregate blob metric entry:", error);
    return false;
  }
}

export async function getOrganizationReportingSnapshot() {
  const blobSnapshot = await getBlobBackedSnapshot();
  if (blobSnapshot) return blobSnapshot;

  const metricsPath = resolveMetricsPath();
  const hasConfiguredSource = Boolean(process.env.AIFORJ_AGGREGATE_METRICS_FILE);
  if (!metricsPath || !fs.existsSync(metricsPath)) {
    const inMemoryEvents = getInMemoryStore();
    if (inMemoryEvents.length) {
      return aggregateEvents(inMemoryEvents, "live_memory");
    }
    return createEmptySnapshot(hasConfiguredSource ? "live_configured" : "empty");
  }

  try {
    const raw = fs.readFileSync(metricsPath, "utf8");
    const parsed = parseMetricsFile(raw);
    return aggregateEvents(
      parsed,
      hasConfiguredSource ? "live_configured" : "live_local"
    );
  } catch (error) {
    console.error("Unable to read aggregate metrics file:", error);
    return createEmptySnapshot(hasConfiguredSource ? "live_configured" : "empty");
  }
}

export async function appendOrganizationMetricEntry(entry) {
  const safeEntry = normalizeMetricEntry(entry);
  getInMemoryStore().push(safeEntry);

  const wroteBlob = await appendBlobMetricEntry(safeEntry);
  if (wroteBlob) return true;

  const metricsPath = resolveMetricsPath();
  if (!metricsPath) return true;

  try {
    fs.mkdirSync(path.dirname(metricsPath), { recursive: true });
    fs.appendFileSync(metricsPath, `${JSON.stringify(safeEntry)}\n`, "utf8");
    return true;
  } catch (error) {
    console.error("Unable to append aggregate metric entry:", error);
    return false;
  }
}
