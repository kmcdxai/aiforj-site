"use client";

import { useEffect, useState } from "react";
import {
  getAnonymousMetricsConsent,
  setAnonymousMetricsConsent,
  subscribeToAnonymousMetricsConsent,
} from "../../lib/metrics";

export default function ConsentToggle({
  title = "Anonymous metrics preference",
  compact = false,
}) {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setEnabled(getAnonymousMetricsConsent());
    setReady(true);
    return subscribeToAnonymousMetricsConsent(setEnabled);
  }, []);

  const toggle = () => {
    const next = setAnonymousMetricsConsent(!enabled);
    setEnabled(next);
  };

  return (
    <section
      style={{
        padding: compact ? "16px" : "20px 18px",
        borderRadius: 18,
        background: "rgba(255,255,255,0.58)",
        border: "1px solid rgba(45,42,38,0.08)",
      }}
    >
      <h2
        style={{
          margin: "0 0 10px",
          fontFamily: "'Fraunces', serif",
          fontSize: compact ? 20 : 24,
          color: "var(--text-primary)",
        }}
      >
        {title}
      </h2>
      <p style={{ margin: "0 0 14px", color: "var(--text-secondary)", lineHeight: 1.75 }}>
        Default is off for sensitive tool usage. When enabled, AIForj sends only whitelisted anonymous counters and buckets to AIForj’s first-party metrics endpoint.
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
          background: "rgba(255,255,255,0.76)",
          cursor: ready ? "pointer" : "default",
          textAlign: "left",
        }}
      >
        <span>
          <span style={{ display: "block", marginBottom: 4, fontWeight: 700, color: "var(--text-primary)" }}>
            Share anonymous usage metrics
          </span>
          <span style={{ display: "block", color: "var(--text-secondary)", lineHeight: 1.6, fontSize: 14 }}>
            {enabled
              ? "Enabled on this device. No free text, provider searches, transcripts, or raw mood scores are sent."
              : "Disabled on this device. Sensitive tool usage is not sent."}
          </span>
        </span>
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
        Public marketing page views may be counted without cookies or identity. Sensitive tool events require this opt-in.
      </p>
    </section>
  );
}
