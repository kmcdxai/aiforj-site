"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import BiophilicBackground from "../../components/BiophilicBackground";

// ─── Breathing Step ───
function BreathingStep({ breathe, onComplete }) {
  const [phase, setPhase] = useState("ready");
  const [count, setCount] = useState(0);
  const [cycle, setCycle] = useState(0);
  const totalCycles = 4;
  const timer = useRef(null);
  const countTimer = useRef(null);

  const phases = [
    { label: "Breathe in", duration: breathe.inhale },
    { label: "Hold", duration: breathe.hold },
    { label: "Breathe out", duration: breathe.exhale },
  ];

  const start = useCallback(() => {
    setPhase("running");
    setCycle(0);
    runPhase(0, 0);
  }, []);

  function runPhase(phaseIdx, cycleNum) {
    if (cycleNum >= totalCycles) {
      setPhase("done");
      onComplete?.();
      return;
    }
    const p = phases[phaseIdx % phases.length];
    setCount(p.duration);

    let c = p.duration;
    clearInterval(countTimer.current);
    countTimer.current = setInterval(() => {
      c--;
      setCount(c);
      if (c <= 0) {
        clearInterval(countTimer.current);
        const nextPhase = phaseIdx + 1;
        if (nextPhase >= phases.length) {
          setCycle(cycleNum + 1);
          runPhase(0, cycleNum + 1);
        } else {
          runPhase(nextPhase, cycleNum);
        }
      }
    }, 1000);
  }

  useEffect(() => {
    return () => {
      clearInterval(countTimer.current);
      clearTimeout(timer.current);
    };
  }, []);

  const currentPhase = phases.find((_, i) => {
    // Determine which phase we're in by the count
    return true;
  });

  if (phase === "ready") {
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <button onClick={start} style={btnStyle}>
          Start Breathing Exercise
        </button>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <p style={{ fontSize: 16, color: "var(--interactive)", fontWeight: 500, fontFamily: "'Fraunces', serif" }}>
          Well done.
        </p>
      </div>
    );
  }

  const sz = count > breathe.exhale ? 140 : 100;

  return (
    <div style={{ textAlign: "center", padding: "32px 0" }}>
      <div style={{
        width: sz + 40, height: sz + 40, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(125,155,130,0.2) 0%, rgba(125,155,130,0.02) 100%)",
        display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
        margin: "0 auto 20px", transition: "all 1.5s ease-in-out",
        boxShadow: `0 0 ${sz / 2}px rgba(125,155,130,0.12)`,
      }}>
        <span style={{ fontSize: 32, fontWeight: 300, color: "var(--text-primary)", fontFamily: "'DM Sans', sans-serif" }}>
          {count}
        </span>
      </div>
      <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
        Cycle {Math.min(cycle + 1, totalCycles)} of {totalCycles}
      </p>
    </div>
  );
}

// ─── Reflection Step ───
function ReflectionStep() {
  return null; // Just shows the instruction text
}

// ─── Rating Step ───
function RatingStep({ onRate }) {
  const [val, setVal] = useState(null);
  return (
    <div style={{ textAlign: "center", padding: "16px 0" }}>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <button
            key={n}
            onClick={() => { setVal(n); onRate?.(n); }}
            style={{
              width: 40, height: 40, borderRadius: 10, fontSize: 15, fontWeight: 500,
              background: val === n ? "var(--interactive)" : "var(--surface)",
              color: val === n ? "#fff" : "var(--text-secondary)",
              border: val === n ? "none" : "1px solid rgba(45,42,38,0.08)",
              cursor: "pointer", transition: "all 200ms",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

const btnStyle = {
  padding: "14px 32px",
  fontSize: 15,
  fontWeight: 600,
  fontFamily: "'Fraunces', serif",
  background: "linear-gradient(135deg, var(--interactive), var(--interactive-pressed))",
  color: "#fff",
  border: "none",
  borderRadius: 14,
  cursor: "pointer",
  boxShadow: "0 4px 16px rgba(125,155,130,0.2)",
  transition: "all 300ms cubic-bezier(0.16,1,0.3,1)",
};

// ─── Main Gift Client ───
export default function GiftClient({ technique }) {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg-primary)" }} />}>
      <GiftClientInner technique={technique} />
    </Suspense>
  );
}

function GiftClientInner({ technique }) {
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(-1); // -1 = welcome
  const [completed, setCompleted] = useState(false);
  const [feelingScore, setFeelingScore] = useState(null);

  const fromName = searchParams.get("from") || "";
  const message = searchParams.get("msg") || "";

  const shortName = technique.title.split(":")[0].replace(" Technique", "").replace("The ", "").trim();
  const steps = technique.steps || [];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleStart = () => setCurrentStep(0);

  // ─── Welcome Screen ───
  if (currentStep === -1) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-primary)", position: "relative" }}>
        <BiophilicBackground />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 560, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <h1 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
            fontWeight: 500,
            color: "var(--text-primary)",
            margin: "0 0 16px",
            lineHeight: 1.3,
          }}>
            Someone who cares about you sent you this
          </h1>

          {fromName && (
            <p style={{
              fontSize: 17,
              fontWeight: 500,
              color: "var(--interactive)",
              margin: "0 0 20px",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              From {fromName}
            </p>
          )}

          {message && (
            <div style={{
              padding: "20px 22px",
              background: "var(--accent-warm-light)",
              borderRadius: 16,
              borderLeft: "4px solid var(--accent-warm)",
              marginBottom: 32,
              maxWidth: 440,
              marginLeft: "auto",
              marginRight: "auto",
            }}>
              <p style={{
                fontSize: 16,
                color: "var(--text-primary)",
                margin: 0,
                fontStyle: "italic",
                lineHeight: 1.6,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                "{message}"
              </p>
            </div>
          )}

          {!message && <div style={{ height: 12 }} />}

          <div style={{
            background: "var(--surface-elevated)",
            borderRadius: 20,
            padding: "28px 24px",
            boxShadow: "var(--shadow-md)",
            marginBottom: 32,
            border: "1px solid rgba(45,42,38,0.06)",
          }}>
            <h2 style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 20,
              fontWeight: 500,
              color: "var(--text-primary)",
              margin: "0 0 8px",
            }}>
              {shortName}
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "0 0 4px" }}>
              {technique.subtitle}
            </p>
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
              {technique.time} · Guided · Free
            </p>
          </div>

          <button onClick={handleStart} style={btnStyle}>
            Begin
          </button>

          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 24, lineHeight: 1.5 }}>
            100% private — nothing is stored or tracked.
            <br />
            Built by a Board Certified PMHNP.
          </p>
        </div>
      </div>
    );
  }

  // ─── Completed Screen ───
  if (completed) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-primary)", position: "relative" }}>
        <BiophilicBackground />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 520, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>✦</div>
          <h1 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "clamp(1.5rem, 4vw, 2rem)",
            fontWeight: 500,
            color: "var(--text-primary)",
            margin: "0 0 32px",
          }}>
            How are you feeling now?
          </h1>

          {/* 1-5 feeling scale */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 40 }}>
            {[
              { score: 1, label: "Worse" },
              { score: 2, label: "Same" },
              { score: 3, label: "A little better" },
              { score: 4, label: "Better" },
              { score: 5, label: "Much better" },
            ].map((item) => (
              <button
                key={item.score}
                onClick={() => setFeelingScore(item.score)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  padding: "14px 10px",
                  background: feelingScore === item.score ? "var(--accent-sage-light)" : "var(--surface-elevated)",
                  border: feelingScore === item.score ? "2px solid var(--interactive)" : "1px solid rgba(45,42,38,0.06)",
                  borderRadius: 14,
                  cursor: "pointer",
                  transition: "all 250ms cubic-bezier(0.16,1,0.3,1)",
                  minWidth: 56,
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <span style={{ fontSize: 20 }}>{["😔", "😐", "🙂", "😊", "✨"][item.score - 1]}</span>
                <span style={{ fontSize: 10, color: feelingScore === item.score ? "var(--interactive)" : "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.2, textAlign: "center" }}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          {/* Next steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 360, margin: "0 auto" }}>
            <a href="/blueprint" style={{
              display: "block",
              padding: "16px 20px",
              background: "var(--surface-elevated)",
              borderRadius: 14,
              textDecoration: "none",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid rgba(45,42,38,0.06)",
              transition: "all 300ms cubic-bezier(0.16,1,0.3,1)",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}
            >
              <span style={{ fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 500, color: "var(--text-primary)", display: "block", marginBottom: 4 }}>
                Discover which techniques work best for you →
              </span>
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                Take the 2-minute Emotional Blueprint
              </span>
            </a>

            <a href="/tools" style={{
              display: "block",
              padding: "16px 20px",
              background: "var(--surface-elevated)",
              borderRadius: 14,
              textDecoration: "none",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid rgba(45,42,38,0.06)",
              transition: "all 300ms cubic-bezier(0.16,1,0.3,1)",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}
            >
              <span style={{ fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 500, color: "var(--text-primary)", display: "block", marginBottom: 4 }}>
                Explore more tools →
              </span>
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                15 guided techniques, all free
              </span>
            </a>

            <a href="/send" style={{
              display: "block",
              padding: "16px 20px",
              background: "var(--accent-sage-light)",
              borderRadius: 14,
              textDecoration: "none",
              border: "1px solid rgba(125,155,130,0.2)",
              transition: "all 300ms cubic-bezier(0.16,1,0.3,1)",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <span style={{ fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 500, color: "var(--interactive)", display: "block", marginBottom: 4 }}>
                Send calm to someone else →
              </span>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                Choose a technique and create a personal link
              </span>
            </a>
          </div>

          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 40, lineHeight: 1.6 }}>
            Built by a Board Certified PMHNP · aiforj.com
          </p>
        </div>
      </div>
    );
  }

  // ─── Step View ───
  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", flexDirection: "column" }}>
      {/* Progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, background: "rgba(45,42,38,0.06)", zIndex: 50 }}>
        <div style={{ height: "100%", background: "var(--interactive)", width: `${progress}%`, transition: "width 400ms cubic-bezier(0.16,1,0.3,1)", borderRadius: "0 2px 2px 0" }} />
      </div>

      {/* Header */}
      <div style={{ padding: "16px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 560, margin: "0 auto", width: "100%" }}>
        <span style={{ fontSize: 14, color: "var(--text-muted)" }}>{shortName}</span>
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
          {currentStep + 1} of {steps.length}
        </span>
      </div>

      {/* Step content */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 20px 60px" }}>
        <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>
          <h2 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
            fontWeight: 500,
            color: "var(--text-primary)",
            margin: "0 0 16px",
          }}>
            {step.title}
          </h2>
          <p style={{
            fontSize: 15,
            lineHeight: 1.75,
            color: "var(--text-secondary)",
            margin: "0 0 28px",
            maxWidth: 460,
            marginLeft: "auto",
            marginRight: "auto",
          }}>
            {step.instruction}
          </p>

          {/* Step-type specific content */}
          {step.type === "breathing" && step.breathe && (
            <BreathingStep breathe={step.breathe} onComplete={handleNext} />
          )}

          {step.type === "rating" && (
            <RatingStep onRate={() => setTimeout(handleNext, 800)} />
          )}

          {/* Next button (for non-auto-completing steps) */}
          {step.type !== "breathing" && step.type !== "rating" && (
            <button onClick={handleNext} style={btnStyle}>
              {currentStep === steps.length - 1 ? "Finish" : "Continue"}
            </button>
          )}

          {/* Manual next for breathing (in case it doesn't auto-complete) */}
          {step.type === "breathing" && (
            <button onClick={handleNext} style={{
              marginTop: 16,
              background: "none",
              border: "none",
              fontSize: 13,
              color: "var(--text-muted)",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              textDecoration: "underline",
            }}>
              Skip to next step
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
