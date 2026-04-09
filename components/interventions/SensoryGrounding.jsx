"use client";

import { useState } from "react";

const SENSES = [
  { count: 5, sense: "See", prompt: "Name 5 things you can see right now", emoji: "👁️", color: "var(--sage)" },
  { count: 4, sense: "Touch", prompt: "Name 4 things you can physically feel", emoji: "✋", color: "var(--clay)" },
  { count: 3, sense: "Hear", prompt: "Name 3 things you can hear", emoji: "👂", color: "var(--ocean)" },
  { count: 2, sense: "Smell", prompt: "Name 2 things you can smell", emoji: "👃", color: "var(--lavender)" },
  { count: 1, sense: "Taste", prompt: "Name 1 thing you can taste", emoji: "👅", color: "var(--rose)" },
];

export default function SensoryGrounding({ onComplete }) {
  const [started, setStarted] = useState(false);
  const [senseIndex, setSenseIndex] = useState(0);
  const [items, setItems] = useState([]);
  const [currentInput, setCurrentInput] = useState("");

  const currentSense = SENSES[senseIndex];
  const isLastSense = senseIndex >= SENSES.length - 1;
  const itemsNeeded = currentSense?.count || 0;
  const progress = ((senseIndex / SENSES.length) + (items.length / itemsNeeded / SENSES.length)) * 100;

  const handleAdd = () => {
    const trimmed = currentInput.trim();
    if (!trimmed) return;
    const newItems = [...items, trimmed];
    setItems(newItems);
    setCurrentInput("");

    if (newItems.length >= itemsNeeded) {
      // Move to next sense or complete
      if (isLastSense) {
        setSenseIndex(senseIndex + 1); // triggers completion view
      } else {
        setSenseIndex(senseIndex + 1);
        setItems([]);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  if (!started) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
        <div style={{ width: 120, height: 120, borderRadius: "50%", background: "linear-gradient(135deg, var(--sage-light), var(--lavender-light))", display: "grid", placeItems: "center", fontSize: 48, marginBottom: 32 }}>
          🌿
        </div>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", margin: "0 0 12px", color: "var(--text-primary)" }}>
          5-4-3-2-1 Grounding
        </h2>
        <p style={{ color: "var(--text-secondary)", maxWidth: 440, lineHeight: 1.7, margin: "0 0 8px" }}>
          This evidence-based grounding technique anchors you to the present moment through your five senses. It interrupts anxious spirals by redirecting attention to what is real and immediate.
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: 13, margin: "0 0 32px" }}>
          5 steps &middot; ~2 minutes
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
          }}
        >
          Begin grounding
        </button>
      </div>
    );
  }

  // Completed all senses
  if (senseIndex >= SENSES.length) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
        <div style={{ width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(135deg, var(--sage-light), var(--sage))", display: "grid", placeItems: "center", fontSize: 40, marginBottom: 24 }}>
          ✓
        </div>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)", margin: "0 0 12px", color: "var(--text-primary)" }}>
          You are here
        </h2>
        <p style={{ color: "var(--text-secondary)", maxWidth: 400, lineHeight: 1.7, margin: "0 0 32px" }}>
          You just engaged all five senses and brought yourself fully into the present moment. Notice how your body feels right now compared to when you started.
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
    <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", padding: 24, maxWidth: 560, margin: "0 auto" }}>
      {/* Progress */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Step {senseIndex + 1} of {SENSES.length}
          </span>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
            {items.length} / {itemsNeeded}
          </span>
        </div>
        <div style={{ height: 6, borderRadius: 999, background: "var(--parchment-deep)", overflow: "hidden" }}>
          <div style={{ width: `${progress}%`, height: "100%", borderRadius: 999, background: `linear-gradient(90deg, ${currentSense.color}, var(--sage))`, transition: "width 300ms ease" }} />
        </div>
      </div>

      {/* Sense indicator */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, justifyContent: "center" }}>
        {SENSES.map((s, i) => (
          <div
            key={s.sense}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: i < senseIndex ? s.color : i === senseIndex ? s.color : "var(--surface)",
              opacity: i < senseIndex ? 0.5 : i === senseIndex ? 1 : 0.3,
              display: "grid",
              placeItems: "center",
              fontSize: 18,
              transition: "all 300ms ease",
              color: i <= senseIndex ? "#fff" : "var(--text-muted)",
            }}
          >
            {i < senseIndex ? "✓" : s.emoji}
          </div>
        ))}
      </div>

      {/* Prompt */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>{currentSense.emoji}</div>
        <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.3rem, 2.5vw, 1.7rem)", margin: "0 0 8px", color: "var(--text-primary)" }}>
          {currentSense.prompt}
        </h3>
        <p style={{ color: "var(--text-muted)", fontSize: 14, margin: 0 }}>
          Type each one and press Enter
        </p>
      </div>

      {/* Items entered */}
      {items.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16, justifyContent: "center" }}>
          {items.map((item, i) => (
            <span
              key={i}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                background: currentSense.color,
                color: "#fff",
                fontSize: 14,
                fontWeight: 500,
                animation: "fadeInUp 300ms ease-out",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ display: "flex", gap: 10 }}>
        <input
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`${currentSense.sense} #${items.length + 1}...`}
          autoFocus
          style={{
            flex: 1,
            padding: "14px 18px",
            borderRadius: 16,
            border: `2px solid ${currentSense.color}40`,
            background: "var(--surface)",
            color: "var(--text-primary)",
            fontSize: 16,
            outline: "none",
            fontFamily: "inherit",
            transition: "border-color 200ms",
          }}
        />
        <button
          onClick={handleAdd}
          disabled={!currentInput.trim()}
          style={{
            padding: "14px 20px",
            borderRadius: 16,
            background: currentInput.trim() ? currentSense.color : "var(--parchment-deep)",
            color: currentInput.trim() ? "#fff" : "var(--text-muted)",
            border: "none",
            fontSize: 16,
            fontWeight: 600,
            cursor: currentInput.trim() ? "pointer" : "not-allowed",
            transition: "all 200ms",
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}
