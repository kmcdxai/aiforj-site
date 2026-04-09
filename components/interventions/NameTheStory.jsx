"use client";

import { useState } from "react";

const STEPS = [
  {
    title: "Notice the thought",
    instruction: "What is the thought or worry that keeps looping? Write it down exactly as your mind says it.",
    placeholder: "e.g., I'm going to fail at this...",
  },
  {
    title: "Name the story",
    instruction: 'Now add the prefix: "My mind is telling me the story that..." This creates distance between you and the thought.',
    prefix: "My mind is telling me the story that",
  },
  {
    title: "Thank the mind",
    instruction: 'Acknowledge your mind is trying to protect you. Say: "Thanks, mind, for trying to help." Thoughts are not commands. You can notice them and choose not to follow.',
  },
];

export default function NameTheStory({ onComplete }) {
  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [thought, setThought] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const step = STEPS[stepIndex];
  const progress = ((stepIndex + (submitted ? 1 : 0)) / STEPS.length) * 100;

  const handleSubmitThought = () => {
    if (!thought.trim()) return;
    setSubmitted(true);
    setStepIndex(1);
  };

  const handleNext = () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    }
  };

  if (!started) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
        <div style={{ width: 120, height: 120, borderRadius: "50%", background: "linear-gradient(135deg, var(--lavender-light), var(--ocean-light))", display: "grid", placeItems: "center", fontSize: 48, marginBottom: 32 }}>
          📖
        </div>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", margin: "0 0 12px", color: "var(--text-primary)" }}>
          Name the Story
        </h2>
        <p style={{ color: "var(--text-secondary)", maxWidth: 440, lineHeight: 1.7, margin: "0 0 8px" }}>
          An ACT defusion technique. Instead of fighting anxious thoughts, you learn to notice them as stories your mind tells — not facts you must obey. This reduces their power over your behavior.
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: 13, margin: "0 0 32px" }}>
          3 steps &middot; ~2 minutes
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
          Begin exercise
        </button>
      </div>
    );
  }

  // Completion
  if (stepIndex >= STEPS.length - 1 && submitted) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
        <div style={{ width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(135deg, var(--lavender-light), var(--lavender))", display: "grid", placeItems: "center", fontSize: 40, marginBottom: 24 }}>
          ✓
        </div>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)", margin: "0 0 12px", color: "var(--text-primary)" }}>
          The story has a name now
        </h2>
        <p style={{ color: "var(--text-secondary)", maxWidth: 420, lineHeight: 1.7, margin: "0 0 16px" }}>
          You noticed your thought, named it as a story, and thanked your mind for trying to help. The thought may still be there — but you are no longer fused with it.
        </p>
        <div style={{
          padding: "16px 24px",
          borderRadius: 16,
          background: "var(--lavender-light)",
          color: "var(--lavender-deep)",
          fontSize: 15,
          fontStyle: "italic",
          maxWidth: 400,
          lineHeight: 1.6,
          marginBottom: 32,
        }}>
          "My mind is telling me the story that {thought}"
        </div>
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
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Step {stepIndex + 1} of {STEPS.length}</span>
        </div>
        <div style={{ height: 6, borderRadius: 999, background: "var(--parchment-deep)", overflow: "hidden" }}>
          <div style={{ width: `${progress}%`, height: "100%", borderRadius: 999, background: "linear-gradient(90deg, var(--lavender), var(--ocean))", transition: "width 300ms ease" }} />
        </div>
      </div>

      {/* Step content */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.3rem, 2.5vw, 1.7rem)", margin: "0 0 12px", color: "var(--text-primary)" }}>
          {step.title}
        </h3>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, margin: 0, maxWidth: 440, marginInline: "auto" }}>
          {step.instruction}
        </p>
      </div>

      {/* Step 1: Write the thought */}
      {stepIndex === 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <textarea
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            placeholder={step.placeholder}
            autoFocus
            rows={3}
            style={{
              padding: "16px 18px",
              borderRadius: 16,
              border: "2px solid var(--lavender)40",
              background: "var(--surface)",
              color: "var(--text-primary)",
              fontSize: 16,
              fontFamily: "inherit",
              outline: "none",
              resize: "vertical",
              lineHeight: 1.6,
            }}
          />
          <button
            onClick={handleSubmitThought}
            disabled={!thought.trim()}
            style={{
              padding: "14px 28px",
              borderRadius: 20,
              background: thought.trim() ? "var(--interactive)" : "var(--parchment-deep)",
              color: thought.trim() ? "#fff" : "var(--text-muted)",
              border: "none",
              fontSize: 16,
              fontWeight: 600,
              cursor: thought.trim() ? "pointer" : "not-allowed",
              alignSelf: "center",
            }}
          >
            I wrote it down
          </button>
        </div>
      )}

      {/* Step 2: See it reframed */}
      {stepIndex === 1 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <div style={{
            padding: "20px 28px",
            borderRadius: 20,
            background: "var(--lavender-light)",
            border: "1px solid var(--lavender)30",
            maxWidth: 440,
            textAlign: "center",
          }}>
            <p style={{ fontSize: 14, color: "var(--lavender-deep)", fontWeight: 600, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Your mind says:
            </p>
            <p style={{ fontSize: 17, color: "var(--text-primary)", lineHeight: 1.6, margin: "0 0 16px", fontStyle: "italic" }}>
              "{thought}"
            </p>
            <div style={{ height: 1, background: "var(--lavender)30", margin: "16px 0" }} />
            <p style={{ fontSize: 14, color: "var(--lavender-deep)", fontWeight: 600, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Reframed:
            </p>
            <p style={{ fontSize: 17, color: "var(--text-primary)", lineHeight: 1.6, margin: 0 }}>
              "My mind is telling me the story that {thought.toLowerCase()}"
            </p>
          </div>
          <p style={{ fontSize: 14, color: "var(--text-muted)", textAlign: "center", maxWidth: 380, lineHeight: 1.6 }}>
            Notice the shift? The thought is still there, but now it is something your mind <em>produces</em>, not something you <em>are</em>.
          </p>
          <button
            onClick={handleNext}
            style={{
              padding: "14px 28px",
              borderRadius: 20,
              background: "var(--interactive)",
              color: "#fff",
              border: "none",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            I see the difference
          </button>
        </div>
      )}

      {/* Step 3: Thank the mind */}
      {stepIndex === 2 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <div style={{
            padding: "24px",
            borderRadius: 20,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            maxWidth: 440,
            textAlign: "center",
          }}>
            <p style={{ fontSize: 28, margin: "0 0 12px" }}>🙏</p>
            <p style={{ fontSize: 17, color: "var(--text-primary)", lineHeight: 1.7, margin: 0, fontFamily: "'Fraunces', serif" }}>
              "Thanks, mind, for trying to help. I see the story, and I'm choosing what to do next."
            </p>
          </div>
          <p style={{ fontSize: 14, color: "var(--text-muted)", textAlign: "center", maxWidth: 380, lineHeight: 1.6 }}>
            Your mind evolved to spot threats. Thanking it acknowledges that function without obeying every alarm it sounds.
          </p>
          <button
            onClick={() => setSubmitted(true)}
            style={{
              padding: "14px 28px",
              borderRadius: 20,
              background: "var(--interactive)",
              color: "#fff",
              border: "none",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Complete exercise
          </button>
        </div>
      )}
    </div>
  );
}
