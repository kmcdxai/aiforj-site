"use client";

import { useEffect, useState } from "react";
import {
  getAnonymousMetricsConsent,
  setAnonymousMetricsConsent,
  subscribeToAnonymousMetricsConsent,
} from "../../utils/anonymousMetrics";

export default function AnalyticsPreferenceCard({
  background = "rgba(255,255,255,0.55)",
  border = "1px solid rgba(45,42,38,0.08)",
}) {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setEnabled(getAnonymousMetricsConsent());
    setReady(true);

    return subscribeToAnonymousMetricsConsent((next) => {
      setEnabled(next);
    });
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    setAnonymousMetricsConsent(next);
  };

  return (
    <section
      style={{
        marginBottom: 28,
        padding: "20px 18px",
        borderRadius: 18,
        background,
        border,
      }}
    >
      <h2
        style={{
          margin: "0 0 10px",
          fontFamily: "'Fraunces', serif",
          fontSize: 24,
          color: "var(--text-primary)",
        }}
      >
        Anonymous metrics preference
      </h2>

      <p style={{ margin: "0 0 14px", color: "var(--text-secondary)", lineHeight: 1.8 }}>
        Default is off. If you turn this on, AIForj can send anonymous counters about tool starts, completions, and mood-shift buckets to help improve what actually works.
      </p>

      <button
        type="button"
        onClick={toggle}
        aria-pressed={enabled}
        disabled={!ready}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 18,
          width: "100%",
          padding: "14px 16px",
          borderRadius: 16,
          border: "1px solid rgba(45,42,38,0.10)",
          background: "rgba(255,255,255,0.72)",
          cursor: ready ? "pointer" : "default",
          textAlign: "left",
        }}
      >
        <div>
          <p style={{ margin: "0 0 4px", fontWeight: 700, color: "var(--text-primary)" }}>
            Share anonymous usage metrics to improve AIForj
          </p>
          <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.6, fontSize: 14 }}>
            {enabled
              ? "Enabled on this device. Your shared metrics stay limited to whitelisted counters."
              : "Disabled on this device. Session content stays local by default."}
          </p>
        </div>

        <span
          aria-hidden="true"
          style={{
            position: "relative",
            flexShrink: 0,
            width: 58,
            height: 32,
            borderRadius: 999,
            background: enabled ? "var(--interactive)" : "rgba(45,42,38,0.18)",
            transition: "background 180ms ease",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 3,
              left: enabled ? 29 : 3,
              width: 26,
              height: 26,
              borderRadius: 999,
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              transition: "left 180ms ease",
            }}
          />
        </span>
      </button>

      <p style={{ margin: "12px 0 0", fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7 }}>
        This preference is stored on this device. If you clear browser storage or switch devices, you will need to choose again.
      </p>
    </section>
  );
}
