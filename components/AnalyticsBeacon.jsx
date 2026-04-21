"use client";

import { useEffect } from "react";
import { track } from "../lib/analytics";

export default function AnalyticsBeacon({ event, props }) {
  useEffect(() => {
    track(event, props);
  }, [event, props]);

  return null;
}
