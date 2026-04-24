import { NextResponse } from "next/server";
import {
  normalizeDateBucket,
  normalizeHourBucket,
  validateMetricPayload,
} from "../../../lib/metricsSchema.mjs";
import { appendOrganizationMetricEntry } from "../../../lib/organizationReporting";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const validation = validateMetricPayload(body, {
    allowSensitive: Boolean(body?.clientId),
  });

  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const now = new Date();
  const safeMetric = {
    type: "privacy_metric",
    ...validation.sanitized,
    dateBucket: normalizeDateBucket(now),
    hourBucket: normalizeHourBucket(now),
    receivedAt: now.toISOString(),
  };

  await appendOrganizationMetricEntry(safeMetric);

  const { clientId: _clientId, ...loggableMetric } = safeMetric;
  console.info("[aiforj-privacy-metric]", JSON.stringify(loggableMetric));

  return new NextResponse(null, { status: 204 });
}
