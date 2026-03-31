"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export default function SoundToggle() {
  const [enabled, setEnabled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const audioRef = useRef(null);
  const gainRef = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("aiforj-sound");
    if (saved === "true") setEnabled(true);
  }, []);

  const initAudio = useCallback(async () => {
    if (ctxRef.current) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    ctxRef.current = ctx;

    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(ctx.destination);
    gainRef.current = gain;

    try {
      const audio = new Audio("/sounds/ambient.mp3");
      audio.loop = true;
      audio.crossOrigin = "anonymous";
      const source = ctx.createMediaElementSource(audio);
      source.connect(gain);
      audioRef.current = audio;
      setLoaded(true);
    } catch {
      // Audio not available — fail silently
    }
  }, []);

  const fadeIn = useCallback(() => {
    if (!gainRef.current) return;
    const gain = gainRef.current.gain;
    const now = ctxRef.current.currentTime;
    gain.cancelScheduledValues(now);
    gain.setValueAtTime(gain.value, now);
    gain.linearRampToValueAtTime(0.08, now + 2);
  }, []);

  const fadeOut = useCallback(() => {
    if (!gainRef.current) return;
    const gain = gainRef.current.gain;
    const now = ctxRef.current.currentTime;
    gain.cancelScheduledValues(now);
    gain.setValueAtTime(gain.value, now);
    gain.linearRampToValueAtTime(0, now + 2);
  }, []);

  const toggle = useCallback(async () => {
    if (!ctxRef.current) await initAudio();

    const next = !enabled;
    setEnabled(next);
    localStorage.setItem("aiforj-sound", String(next));

    if (next) {
      if (ctxRef.current?.state === "suspended") await ctxRef.current.resume();
      audioRef.current?.play().catch(() => {});
      fadeIn();
    } else {
      fadeOut();
      setTimeout(() => audioRef.current?.pause(), 2100);
    }
  }, [enabled, initAudio, fadeIn, fadeOut]);

  return (
    <button
      onClick={toggle}
      aria-label={enabled ? "Disable ambient sounds" : "Enable ambient sounds"}
      title={enabled ? "Sound on" : "Sound off"}
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
      <span style={{ fontSize: 14 }}>{enabled ? "🔊" : "🔇"}</span>
      <span>{enabled ? "Nature sounds on" : "Nature sounds"}</span>
    </button>
  );
}
