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

  const compatibilityPayload = {
    event: body?.event,
    toolKind: body?.toolKind,
    toolSlug: body?.toolSlug || body?.toolId,
    emotionCategory: body?.emotionCategory || body?.emotion,
    acquisitionSource: body?.acquisitionSource || body?.source,
    durationBucket: body?.durationBucket,
    moodShiftBucket: body?.moodShiftBucket || body?.shiftBucket,
    clientId: body?.clientId,
  };

  const validation = validateMetricPayload(compatibilityPayload, {
    allowSensitive: Boolean(compatibilityPayload.clientId),
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

  return new NextResponse(null, { status: 204 });
}
