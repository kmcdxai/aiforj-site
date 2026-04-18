"use client";

import { useAdaptiveSound } from "./SoundProvider";

export default function SoundToggle() {
  const { enabled, supported, toggle, profile } = useAdaptiveSound();

  if (!supported) {
    return (
      <button
        type="button"
        disabled
        aria-label="Ambient audio unavailable in this browser"
        title="Ambient audio unavailable in this browser"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 14px",
          fontSize: "0.8125rem",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500,
          background: "transparent",
          color: "var(--text-muted)",
          border: "1px solid rgba(45,42,38,0.1)",
          borderRadius: 20,
          cursor: "not-allowed",
          opacity: 0.6,
        }}
      >
        <span style={{ fontSize: 14 }}>🔇</span>
        <span>Audio unavailable</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? `Disable ${profile.label.toLowerCase()}` : "Enable adaptive ambient audio"}
      title={
        enabled
          ? `${profile.label}. ${profile.reason}`
          : "Enable adaptive ambient audio. AIForj picks a low-volume soundscape based on your current route and emotional context."
      }
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 14px",
        fontSize: "0.8125rem",
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 500,
        background: enabled ? "var(--accent-sage-light)" : "transparent",
        color: enabled ? "var(--interactive)" : "var(--text-muted)",
        border: `1px solid ${enabled ? "var(--interactive)" : "rgba(45,42,38,0.1)"}`,
        borderRadius: 20,
        cursor: "pointer",
        transition: "all 300ms cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <span style={{ fontSize: 14 }}>{enabled ? profile.icon : "🔇"}</span>
      <span>{enabled ? profile.shortLabel : "Adaptive audio"}</span>
    </button>
  );
}
