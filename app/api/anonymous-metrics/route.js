import { NextResponse } from "next/server";
import { TECHNIQUES } from "../../techniques/data";
import { getAllInterventions } from "../../../data/interventions";
import {
  ANONYMOUS_METRIC_EVENTS,
  DURATION_BUCKETS,
  SHIFT_BUCKETS,
  sanitizeMetricToken,
} from "../../../lib/anonymousMetricsShared";
import { appendOrganizationMetricEntry } from "../../../lib/organizationReporting";

export const runtime = "nodejs";

const TECHNIQUE_IDS = new Set(TECHNIQUES.map((technique) => technique.slug));
const INTERVENTION_IDS = new Set(
  getAllInterventions().map((intervention) => intervention.id)
);

function validateToolId(toolKind, toolId) {
  if (toolKind === "technique") {
    return TECHNIQUE_IDS.has(toolId);
  }

  if (toolKind === "intervention") {
    return INTERVENTION_IDS.has(toolId);
  }

  return false;
}

function normalizeOptionalBucket(value, validBuckets) {
  if (value == null) return null;
  return validBuckets.has(value) ? value : null;
}

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = sanitizeMetricToken(body?.event, 32);
  const toolKind = sanitizeMetricToken(body?.toolKind, 24);
  const toolId = sanitizeMetricToken(body?.toolId, 80);
  const clientId = sanitizeMetricToken(body?.clientId, 64);
  const emotion = sanitizeMetricToken(body?.emotion, 40);
  const source = sanitizeMetricToken(body?.source, 40);
  const durationBucket = normalizeOptionalBucket(body?.durationBucket, DURATION_BUCKETS);
  const shiftBucket = normalizeOptionalBucket(body?.shiftBucket, SHIFT_BUCKETS);

  if (
    !event ||
    !toolKind ||
    !toolId ||
    !clientId ||
    !ANONYMOUS_METRIC_EVENTS.has(event) ||
    !validateToolId(toolKind, toolId)
  ) {
    return NextResponse.json({ error: "Invalid metric payload" }, { status: 400 });
  }

  const safeMetric = {
    type: "anonymous_metric",
    event,
    toolKind,
    toolId,
    clientId,
    emotion,
    source,
    durationBucket,
    shiftBucket,
    receivedAt: new Date().toISOString(),
  };

  await appendOrganizationMetricEntry(safeMetric);

  const { clientId: _clientId, ...loggableMetric } = safeMetric;
  console.info("[aiforj-anonymous-metric]", JSON.stringify(loggableMetric));

  return new NextResponse(null, { status: 204 });
}
