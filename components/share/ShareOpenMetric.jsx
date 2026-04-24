"use client";

import { useEffect } from "react";
import { trackSafeMetric } from "../../lib/metrics";

export default function ShareOpenMetric({ payload }) {
  useEffect(() => {
    trackSafeMetric({
      event: "share_link_opened",
      cardType: payload?.type,
      toolSlug: payload?.toolSlug,
      archetype: payload?.archetype,
      acquisitionSource: "shared_card",
    });
  }, [payload]);

  return null;
}
