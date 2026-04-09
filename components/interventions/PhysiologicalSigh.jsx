"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const PHASES = [
  { label: "Inhale", duration: 3000, instruction: "Breathe in through your nose", scale: 1.3 },
  { label: "Inhale", duration: 1500, instruction: "Quick second inhale through nose", scale: 1.5 },
  { label: "Exhale", duration: 6000, instruction: "Long, slow exhale through mouth", scale: 1.0 },
];

const TOTAL_CYCLES = 6;
const CYCLE_DURATION = PHASES.reduce((sum, p) => sum + p.duration, 0);

export default function PhysiologicalSigh({ onComplete }) {
  const [started, setStarted] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const animRef = useRef(null);
  const startTimeRef = useRef(null);

  const currentPhase = PHASES[phaseIndex];
  const totalProgress = ((cycle * CYCLE_DURATION + PHASES.slice(0, phaseIndex).reduce((s, p) => s + p.duration, 0) + phaseProgress * currentPhase.duration) / (TOTAL_CYCLES * CYCLE_DURATION)) * 100;

  const tick = useCallback(() => {
    if (!startTimeRef.current) return;
    const elapsed = Date.now() - startTimeRef.current;
    const phaseDur = PHASES[phaseIndex].duration;

    if (elapsed >= phaseDur) {
      // Move to next phase or cycle
      const nextPhase = phaseIndex + 1;
      if (nextPhase >= PHASES.length) {
        const nextCycle = cycle + 1;
        if (nextCycle >= TOTAL_CYCLES) {
          setPhaseProgress(1);
          return; // Done
        }
        setCycle(nextCycle);
        setPhaseIndex(0);
      } else {
        setPhaseIndex(nextPhase);
      }
      startTimeRef.current = Date.now();
      setPhaseProgress(0);
    } else {
      setPhaseProgress(elapsed / phaseDur);
    }

    animRef.current = requestAnimationFrame(tick);
  }, [phaseIndex, cycle]);

  useEffect(() => {
    if (!started) return;
    startTimeRef.current = Date.now();
    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [started, tick]);

  const isComplete = cycle >= TOTAL_CYCLES - 1 && phaseIndex >= PHASES.length - 1 && phaseProgress >= 1;

  // Compute the visual scale of the breathing circle
  const breathScale = currentPhase.scale === 1.0
    ? 1.5 - (0.5 * phaseProgress)
    : currentPhase.scale === 1.3
      ? 1.0 + (0.3 * phaseProgress)
      : 1.3 + (0.2 * phaseProgress);

  if (!started) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
        <div style={{ width: 120, height: 120, borderRadius: "50%", background: "linear-gradient(135deg, var(--sage-light), var(--ocean-light))", display: "grid", placeItems: "center", fontSize: 48, marginBottom: 32 }}>
          🌬️
        </div>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", margin: "0 0 12px", color: "var(--text-primary)" }}>
          Physiological Sigh
        </h2>
        <p style={{ color: "var(--text-secondary)", maxWidth: 440, lineHeight: 1.7, margin: "0 0 8px" }}>
          A double-inhale followed by a long exhale. This breathing pattern was shown by Stanford researchers to be the fastest way to calm your nervous system in real time.
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: 13, margin: "0 0 32px" }}>
          {TOTAL_CYCLES} cycles &middot; ~{Math.round((TOTAL_CYCLES * CYCLE_DURATION) / 1000 / 60)} minutes
        </p>
        <button
          onClick={() => setStarted(true)}
          style={{
            padding: "14px 36px",
            borderRadius: 24,
            background: "var(--interactive)",
            color: "#fff",
            border: "none",
            fontSize: 16,
            fontWeight: 600,
            fontFamily: "'Fraunces', serif",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(122,158,126,0.3)",
            transition: "all 200ms",
          }}
        >
          Begin breathing
        </button>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
        <div style={{ width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(135deg, var(--sage-light), var(--sage))", display: "grid", placeItems: "center", fontSize: 40, marginBottom: 24 }}>
          ✓
        </div>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)", margin: "0 0 12px", color: "var(--text-primary)" }}>
          Well done
        </h2>
        <p style={{ color: "var(--text-secondary)", maxWidth: 400, lineHeight: 1.7, margin: "0 0 32px" }}>
          You completed {TOTAL_CYCLES} cycles of the physiological sigh. Your nervous system is calmer now than when you started.
        </p>
        {onComplete && (
          <button
            onClick={onComplete}
            style={{
              padding: "14px 36px",
              borderRadius: 24,
              background: "var(--interactive)",
              color: "#fff",
              border: "none",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Continue
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center", gap: 32 }}>
      {/* Breathing circle */}
      <div style={{ position: "relative", width: 200, height: 200, display: "grid", placeItems: "center" }}>
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: currentPhase.label === "Exhale"
              ? "linear-gradient(135deg, var(--ocean-light), var(--sage-light))"
              : "linear-gradient(135deg, var(--sage-light), var(--sage))",
            transform: `scale(${breathScale})`,
            transition: "transform 300ms ease-out, background 500ms ease",
            display: "grid",
            placeItems: "center",
            boxShadow: `0 0 ${40 * breathScale}px rgba(122,158,126,${0.15 * breathScale})`,
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 600, color: "var(--sage-deep)", fontFamily: "'Fraunces', serif" }}>
            {currentPhase.label}
          </span>
        </div>
      </div>

      {/* Instruction */}
      <div>
        <p style={{ fontSize: 18, fontWeight: 500, color: "var(--text-primary)", margin: "0 0 6px" }}>
          {currentPhase.instruction}
        </p>
        <p style={{ fontSize: 14, color: "var(--text-muted)", margin: 0 }}>
          Cycle {cycle + 1} of {TOTAL_CYCLES}
        </p>
      </div>

      {/* Progress bar */}
      <div style={{ width: "100%", maxWidth: 320 }}>
        <div style={{ height: 6, borderRadius: 999, background: "var(--parchment-deep)", overflow: "hidden" }}>
          <div style={{ width: `${totalProgress}%`, height: "100%", borderRadius: 999, background: "linear-gradient(90deg, var(--sage), var(--ocean))", transition: "width 200ms ease" }} />
        </div>
      </div>
    </div>
  );
}
