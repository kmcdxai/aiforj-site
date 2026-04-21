"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import EmailCapture from "../../components/EmailCapture";
import EvidenceDrawer from "../../components/EvidenceDrawer";
import EditorialReviewCard from "../../components/EditorialReviewCard";
import ShareResultCard from "../../components/ShareResultCard";
import SiteFooter from "../../components/SiteFooter";
import AuthorByline from "../../../components/AuthorByline";
import { getArchetypeForTechnique } from "../archetypeMap";
import { getTechniqueEvidence } from "../../../data/evidence";
import {
  LAST_REVIEWED_DATE,
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildMedicalWebPageSchema,
} from "../../../lib/contentSchemas";
import { trackAnonymousMetric } from "../../../utils/anonymousMetrics";
import { track } from "../../../lib/analytics";

const ACCENT = "var(--accent-sage)";
const BG = "var(--bg-primary)";
const TEXT = "var(--text-primary)";
const SUBTLE = "rgba(125,155,130,0.15)";

// ─── Breathing Animator ───
function BreathingStep({ breathe, onComplete }) {
  const [phase, setPhase] = useState("ready");
  const [count, setCount] = useState(0);
  const [cycle, setCycle] = useState(0);
  const totalCycles = 4;
  const timer = useRef(null);

  const phases = [
    { label: "Breathe in", duration: breathe.inhale },
    { label: "Hold", duration: breathe.hold },
    { label: "Breathe out", duration: breathe.exhale },
    ...(breathe.holdAfter ? [{ label: "Hold", duration: breathe.holdAfter }] : []),
  ];

  const start = useCallback(() => {
    setPhase("running");
    setCount(phases[0].duration);
    setCycle(0);
  }, []);

  useEffect(() => {
    if (phase !== "running") return;
    let phaseIdx = 0;
    let remaining = phases[0].duration;
    let currentCycle = 0;

    const tick = () => {
      remaining--;
      if (remaining <= 0) {
        phaseIdx++;
        if (phaseIdx >= phases.length) {
          phaseIdx = 0;
          currentCycle++;
          setCycle(currentCycle);
          if (currentCycle >= totalCycles) {
            setPhase("done");
            clearInterval(timer.current);
            return;
          }
        }
        remaining = phases[phaseIdx].duration;
      }
      setCount(remaining);
    };

    setCount(phases[0].duration);
    timer.current = setInterval(tick, 1000);
    return () => clearInterval(timer.current);
  }, [phase]);

  const currentPhaseLabel =
    phase === "running"
      ? (() => {
          // Derive current phase from cycle state
          let elapsed = 0;
          const totalPerCycle = phases.reduce((s, p) => s + p.duration, 0);
          // We'll use a simpler approach - just show based on count
          return "Follow the rhythm";
        })()
      : "";

  if (phase === "ready") {
    return (
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: "50%",
            border: `3px solid ${ACCENT}`,
            margin: "0 auto 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.5,
          }}
        >
          <span style={{ fontSize: 14, color: ACCENT }}>Ready</span>
        </div>
        <button onClick={start} style={btnStyle}>
          Start Breathing
        </button>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: "50%",
            border: `3px solid ${ACCENT}`,
            margin: "0 auto 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `rgba(107,127,110,0.1)`,
          }}
        >
          <span style={{ fontSize: 18, color: ACCENT }}>✓</span>
        </div>
        <p style={{ color: TEXT, fontSize: 16, marginBottom: 20 }}>
          Well done. {totalCycles} cycles complete.
        </p>
        <button onClick={onComplete} style={btnStyle}>
          Continue
        </button>
      </div>
    );
  }

  // Running
  const totalPerCycle = phases.reduce((s, p) => s + p.duration, 0);
  // Determine which phase we're in by tracking
  return <BreathingVisual phases={phases} totalCycles={totalCycles} onDone={onComplete} />;
}

function BreathingVisual({ phases, totalCycles, onDone }) {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [remaining, setRemaining] = useState(phases[0].duration);
  const [cycleNum, setCycleNum] = useState(1);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let pIdx = 0;
    let rem = phases[0].duration;
    let cyc = 1;

    const interval = setInterval(() => {
      rem--;
      if (rem <= 0) {
        pIdx++;
        if (pIdx >= phases.length) {
          pIdx = 0;
          cyc++;
          if (cyc > totalCycles) {
            setDone(true);
            clearInterval(interval);
            return;
          }
          setCycleNum(cyc);
        }
        rem = phases[pIdx].duration;
        setPhaseIdx(pIdx);
      }
      setRemaining(rem);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (done) {
    return (
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: "50%",
            border: `3px solid ${ACCENT}`,
            margin: "0 auto 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `rgba(107,127,110,0.15)`,
          }}
        >
          <span style={{ fontSize: 22, color: ACCENT }}>✓</span>
        </div>
        <p style={{ color: TEXT, fontSize: 16, marginBottom: 20 }}>
          {totalCycles} cycles complete. Notice how you feel.
        </p>
        <button onClick={onDone} style={btnStyle}>
          Continue
        </button>
      </div>
    );
  }

  const isInhale = phases[phaseIdx].label.toLowerCase().includes("in");
  const isExhale = phases[phaseIdx].label.toLowerCase().includes("out");
  const scale = isInhale ? 1.3 : isExhale ? 0.8 : 1.1;

  return (
    <div style={{ textAlign: "center" }}>
      <p
        style={{
          fontSize: 12,
          color: `rgba(45,42,38,0.55)`,
          marginBottom: 16,
        }}
      >
        Cycle {cycleNum} of {totalCycles}
      </p>
      <div
        style={{
          width: 160,
          height: 160,
          borderRadius: "50%",
          border: `3px solid ${ACCENT}`,
          margin: "0 auto 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          transition: "transform 1s ease-in-out",
          transform: `scale(${scale})`,
          background: `rgba(107,127,110,0.08)`,
        }}
      >
        <span
          style={{
            fontSize: 28,
            fontWeight: 300,
            color: TEXT,
            fontFamily: "'Fraunces', serif",
          }}
        >
          {remaining}
        </span>
      </div>
      <p
        style={{
          fontSize: 20,
          color: ACCENT,
          fontFamily: "'Fraunces', serif",
          fontWeight: 500,
        }}
      >
        {phases[phaseIdx].label}
      </p>
    </div>
  );
}

// ─── Text Input Step ───
function TextInputStep({ step, onComplete }) {
  const [value, setValue] = useState("");
  return (
    <div>
      <p style={{ color: `rgba(45,42,38,0.85)`, fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
        {step.instruction}
      </p>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={step.placeholder || "Type here..."}
        rows={4}
        style={textareaStyle}
      />
      <button onClick={() => onComplete(value)} style={btnStyle} disabled={!value.trim()}>
        Continue
      </button>
    </div>
  );
}

// ─── Multi Input Step ───
function MultiInputStep({ step, onComplete }) {
  const [values, setValues] = useState(step.fields.map(() => ""));
  const allFilled = values.every((v) => v.trim());
  return (
    <div>
      <p style={{ color: `rgba(45,42,38,0.85)`, fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
        {step.instruction}
      </p>
      {step.fields.map((field, i) => (
        <div key={i} style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 13, color: ACCENT, display: "block", marginBottom: 4 }}>
            {field}
          </label>
          <input
            value={values[i]}
            onChange={(e) => {
              const nv = [...values];
              nv[i] = e.target.value;
              setValues(nv);
            }}
            style={inputStyle}
            placeholder={`Enter ${field.toLowerCase()}...`}
          />
        </div>
      ))}
      <button onClick={() => onComplete(values)} style={btnStyle} disabled={!allFilled}>
        Continue
      </button>
    </div>
  );
}

// ─── Timer Step ───
function TimerStep({ step, onComplete }) {
  const [started, setStarted] = useState(false);
  const [remaining, setRemaining] = useState(step.duration);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!started || done) return;
    const interval = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setDone(true);
          clearInterval(interval);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [started, done]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ color: `rgba(45,42,38,0.85)`, fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
        {step.instruction}
      </p>
      <div
        style={{
          fontSize: 48,
          fontWeight: 300,
          color: TEXT,
          fontFamily: "'Fraunces', serif",
          marginBottom: 24,
        }}
      >
        {mins}:{secs.toString().padStart(2, "0")}
      </div>
      {!started && !done && (
        <button onClick={() => setStarted(true)} style={btnStyle}>
          Start
        </button>
      )}
      {done && (
        <button onClick={onComplete} style={btnStyle}>
          Continue
        </button>
      )}
    </div>
  );
}

// ─── Reflection Step ───
function ReflectionStep({ step, onComplete }) {
  return (
    <div>
      <p style={{ color: `rgba(45,42,38,0.85)`, fontSize: 15, lineHeight: 1.8, marginBottom: 24, whiteSpace: "pre-line" }}>
        {step.instruction}
      </p>
      <button onClick={onComplete} style={btnStyle}>
        Continue
      </button>
    </div>
  );
}

// ─── Choice Step ───
function ChoiceStep({ step, onComplete }) {
  return (
    <div>
      <p style={{ color: `rgba(45,42,38,0.85)`, fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
        {step.instruction}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {step.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onComplete(opt)}
            style={{
              padding: "14px 20px",
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${SUBTLE}`,
              borderRadius: 12,
              color: TEXT,
              fontSize: 14,
              cursor: "pointer",
              textAlign: "left",
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.2s",
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Body Scan Step ───
function BodyScanStep({ step, onComplete }) {
  const [regionIdx, setRegionIdx] = useState(0);
  const regions = step.regions;
  const [remaining, setRemaining] = useState(15);

  useEffect(() => {
    setRemaining(15);
    const interval = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(interval);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [regionIdx]);

  const next = () => {
    if (regionIdx < regions.length - 1) {
      setRegionIdx(regionIdx + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: 12, color: `rgba(45,42,38,0.55)`, marginBottom: 8 }}>
        Region {regionIdx + 1} of {regions.length}
      </p>
      <p style={{ fontSize: 22, color: TEXT, fontFamily: "'Fraunces', serif", fontWeight: 400, marginBottom: 8 }}>
        {regions[regionIdx]}
      </p>
      <p style={{ color: `rgba(45,42,38,0.75)`, fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
        Bring your attention here. Notice any sensations — warmth, tension, tingling, or nothing at all. No judgment.
      </p>
      <div style={{ fontSize: 32, color: ACCENT, fontWeight: 300, marginBottom: 20, fontFamily: "'Fraunces', serif" }}>
        {remaining}s
      </div>
      <button onClick={next} style={btnStyle}>
        {regionIdx < regions.length - 1 ? "Next Region" : "Complete"}
      </button>
    </div>
  );
}

// ─── Rating Step ───
function RatingStep({ step, onComplete }) {
  const [value, setValue] = useState(null);
  const min = step.min || 1;
  const max = step.max || 10;
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ color: `rgba(45,42,38,0.85)`, fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
        {step.instruction}
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((n) => (
          <button
            key={n}
            onClick={() => setValue(n)}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              border: value === n ? `2px solid ${ACCENT}` : `1px solid ${SUBTLE}`,
              background: value === n ? `rgba(107,127,110,0.2)` : "rgba(255,255,255,0.03)",
              color: value === n ? ACCENT : TEXT,
              fontSize: 16,
              fontWeight: value === n ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.2s",
              fontFamily: "'Fraunces', serif",
            }}
          >
            {n}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", maxWidth: 300, margin: "0 auto 20px", fontSize: 12, color: `rgba(45,42,38,0.55)` }}>
        <span>{step.minLabel || "Low"}</span>
        <span>{step.maxLabel || "High"}</span>
      </div>
      {value !== null && (
        <button onClick={() => onComplete(value)} style={btnStyle}>
          Continue
        </button>
      )}
    </div>
  );
}

// ─── Step Router ───
function ExerciseStep({ step, onComplete }) {
  switch (step.type) {
    case "breathing":
      return <BreathingStep breathe={step.breathe} onComplete={onComplete} />;
    case "text-input":
      return <TextInputStep step={step} onComplete={onComplete} />;
    case "multi-input":
      return <MultiInputStep step={step} onComplete={onComplete} />;
    case "timer":
      return <TimerStep step={step} onComplete={onComplete} />;
    case "reflection":
      return <ReflectionStep step={step} onComplete={onComplete} />;
    case "choice":
      return <ChoiceStep step={step} onComplete={onComplete} />;
    case "body-scan":
      return <BodyScanStep step={step} onComplete={onComplete} />;
    case "rating":
      return <RatingStep step={step} onComplete={onComplete} />;
    default:
      return <ReflectionStep step={step} onComplete={onComplete} />;
  }
}

// ─── Share Button ───
function ShareButton({ technique }) {
  const [copied, setCopied] = useState(false);
  const shareText = `I just tried "${technique.title.split(":")[0]}" on AIForj — it actually helped. Try it:`;
  const shareUrl = `https://aiforj.com/techniques/${technique.slug}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: technique.title, text: shareText, url: shareUrl });
      } catch {}
    } else {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button onClick={handleShare} style={{ ...btnSecondaryStyle, marginTop: 8 }}>
      {copied ? "Link copied!" : "Share this technique"}
    </button>
  );
}

// ─── Structured Data ───
function StructuredData({ technique }) {
  const faqSchema = buildFaqSchema(technique.faqs);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: technique.title,
    description: technique.metaDescription,
    totalTime: `PT${parseInt(technique.time)}M`,
    step: technique.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.instruction,
    })),
  };

  const articleSchema = buildArticleSchema({
    title: technique.metaTitle,
    description: technique.metaDescription,
    url: `https://aiforj.com/techniques/${technique.slug}`,
    section: "Technique",
    about: technique.subtitle,
    dateModified: LAST_REVIEWED_DATE,
  });
  const medicalWebPageSchema = buildMedicalWebPageSchema({
    title: technique.metaTitle,
    description: technique.metaDescription,
    url: `https://aiforj.com/techniques/${technique.slug}`,
    about: technique.title,
    lastReviewed: LAST_REVIEWED_DATE,
  });
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", item: "https://aiforj.com" },
    { name: "Techniques", item: "https://aiforj.com/techniques" },
    { name: technique.title, item: `https://aiforj.com/techniques/${technique.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalWebPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}

// ─── Main Page Component ───
export default function TechniqueClient({
  technique,
  related,
  disableAnonymousMetrics = false,
  metricsSource = "technique-page",
}) {
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [exerciseDone, setExerciseDone] = useState(false);
  const [exerciseStartTime, setExerciseStartTime] = useState(null);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const exerciseRef = useRef(null);
  const techniqueEvidence = getTechniqueEvidence(technique.slug);

  const handleStepComplete = () => {
    if (currentStep < technique.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const mins = exerciseStartTime ? Math.max(1, Math.round((Date.now() - exerciseStartTime) / 60000)) : 0;
      setElapsedMinutes(mins);
      setExerciseDone(true);
      // Log completion to localStorage for tracking
      try {
        const key = "techniques_completed";
        const data = JSON.parse(localStorage.getItem(key) || "[]");
        data.push({ slug: technique.slug, date: new Date().toISOString(), minutes: mins });
        localStorage.setItem(key, JSON.stringify(data.slice(-100)));
      } catch {}

      if (!disableAnonymousMetrics) {
        trackAnonymousMetric({
          event: "tool_completed",
          toolKind: "technique",
          toolId: technique.slug,
          source: metricsSource,
          durationSeconds: mins * 60,
        });
      }
    }
  };

  const startExercise = () => {
    setExerciseStarted(true);
    setExerciseStartTime(Date.now());
    setCurrentStep(0);
    setExerciseDone(false);

    if (!disableAnonymousMetrics) {
      trackAnonymousMetric({
        event: "tool_started",
        toolKind: "technique",
        toolId: technique.slug,
        source: metricsSource,
      });
    }

    setTimeout(() => exerciseRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <main style={{ minHeight: "100vh", background: BG, color: TEXT, fontFamily: "'DM Sans', sans-serif" }}>
      <StructuredData technique={technique} />

      <article style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px 80px" }}>
        {/* ─── Hero ─── */}
        <header style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 12, padding: "4px 12px", background: `rgba(107,127,110,0.15)`, borderRadius: 8, color: ACCENT, fontWeight: 600 }}>
              {technique.modality}
            </span>
            <span style={{ fontSize: 12, padding: "4px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 8, color: `rgba(45,42,38,0.65)` }}>
              {technique.time}
            </span>
          </div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(26px, 5vw, 38px)", fontWeight: 500, color: TEXT, margin: "0 0 12px", lineHeight: 1.2 }}>
            {technique.title}
          </h1>
          <AuthorByline />
          <p style={{ fontSize: 16, color: `rgba(45,42,38,0.75)`, margin: "0 0 16px", lineHeight: 1.6, fontWeight: 300 }}>
            {technique.subtitle}
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "rgba(107,127,110,0.08)", borderRadius: 20, border: `1px solid ${SUBTLE}` }}>
            <span style={{ fontSize: 12, color: ACCENT, fontWeight: 500 }}>Built and clinically informed by Kevin · Psychiatric NP candidate</span>
          </div>
        </header>

        {/* ─── What This Is ─── */}
        <section style={{ marginBottom: 36 }}>
          <h2 style={h2Style}>What This Is</h2>
          <p style={proseStyle}>{technique.whatThisIs}</p>
          <p style={{ fontSize: 13, color: `rgba(45,42,38,0.55)`, marginTop: 8 }}>
            Origin: {technique.origin}
          </p>
        </section>

        {/* ─── Neuroscience ─── */}
        <section style={{ marginBottom: 36, padding: "24px 20px", background: "rgba(107,127,110,0.06)", borderRadius: 16, border: `1px solid ${SUBTLE}` }}>
          <h2 style={{ ...h2Style, marginTop: 0 }}>Why It Can Help</h2>
          <p style={{ ...proseStyle, marginBottom: 0 }}>{technique.neuroscience}</p>
        </section>

        <EvidenceDrawer
          evidence={techniqueEvidence}
          accentColor={ACCENT}
          borderColor={SUBTLE}
          background="rgba(107,127,110,0.05)"
          panelBackground="rgba(255,255,255,0.04)"
          textColor={TEXT}
          mutedColor="rgba(45,42,38,0.72)"
        />

        <EditorialReviewCard
          kind="Technique"
          background="rgba(255,255,255,0.45)"
          border={`1px solid ${SUBTLE}`}
        />

        {/* ─── Interactive Exercise ─── */}
        <section ref={exerciseRef} style={{ marginBottom: 40 }}>
          <h2 style={h2Style}>Guided Exercise</h2>
          {!exerciseStarted ? (
            <div style={{ textAlign: "center", padding: "32px 20px", background: "rgba(255,255,255,0.03)", borderRadius: 16, border: `1px solid ${SUBTLE}` }}>
              <p style={{ fontSize: 15, color: `rgba(45,42,38,0.75)`, marginBottom: 20, lineHeight: 1.6 }}>
                This interactive exercise takes about {technique.time}. Everything stays on your device — nothing is stored or sent anywhere.
              </p>
              <button onClick={startExercise} style={btnStyle}>
                Start Exercise
              </button>
            </div>
          ) : exerciseDone ? (
            <div style={{ padding: "32px 20px", background: "rgba(107,127,110,0.06)", borderRadius: 16, border: `1px solid ${SUBTLE}` }}>
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
                <p style={{ fontSize: 18, color: TEXT, fontFamily: "'Fraunces', serif", marginBottom: 8 }}>
                  Exercise complete
                </p>
                <p style={{ fontSize: 14, color: `rgba(45,42,38,0.65)`, marginBottom: 16, lineHeight: 1.6 }}>
                  Take a moment to notice how you feel now compared to when you started.
                </p>
                <button onClick={startExercise} style={btnSecondaryStyle}>
                  Do It Again
                </button>
              </div>
              <ShareResultCard technique={technique} elapsedMinutes={elapsedMinutes} />
            </div>
          ) : (
            <div style={{ padding: "28px 20px", background: "rgba(255,255,255,0.03)", borderRadius: 16, border: `1px solid ${SUBTLE}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <span style={{ fontSize: 12, color: ACCENT, fontWeight: 600 }}>
                  {technique.steps[currentStep].title}
                </span>
                <span style={{ fontSize: 12, color: `rgba(45,42,38,0.55)` }}>
                  Step {currentStep + 1} / {technique.steps.length}
                </span>
              </div>
              <div style={{ height: 2, background: `rgba(107,127,110,0.1)`, borderRadius: 2, marginBottom: 24 }}>
                <div style={{ height: 2, background: ACCENT, borderRadius: 2, width: `${((currentStep + 1) / technique.steps.length) * 100}%`, transition: "width 0.4s ease" }} />
              </div>
              <ExerciseStep
                key={currentStep}
                step={technique.steps[currentStep]}
                onComplete={handleStepComplete}
              />
            </div>
          )}
        </section>

        {/* ─── When to Use ─── */}
        <section style={{ marginBottom: 36 }}>
          <h2 style={h2Style}>When to Use This</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {technique.whenToUse.map((w, i) => (
              <li key={i} style={{ padding: "10px 0", borderBottom: i < technique.whenToUse.length - 1 ? `1px solid rgba(107,127,110,0.08)` : "none", fontSize: 15, color: `rgba(45,42,38,0.85)`, lineHeight: 1.5 }}>
                <span style={{ color: ACCENT, marginRight: 10 }}>→</span>
                {w}
              </li>
            ))}
          </ul>
        </section>

        {/* ─── FAQs ─── */}
        <section style={{ marginBottom: 36 }}>
          <h2 style={h2Style}>Frequently Asked Questions</h2>
          {technique.faqs.map((faq, i) => (
            <details key={i} style={{ marginBottom: 12, background: "rgba(255,255,255,0.02)", borderRadius: 12, border: `1px solid rgba(107,127,110,0.08)`, overflow: "hidden" }}>
              <summary style={{ padding: "14px 18px", fontSize: 15, color: TEXT, cursor: "pointer", fontWeight: 500 }}>
                {faq.q}
              </summary>
              <p style={{ padding: "0 18px 14px", fontSize: 14, color: `rgba(45,42,38,0.75)`, lineHeight: 1.7, margin: 0 }}>
                {faq.a}
              </p>
            </details>
          ))}
        </section>

        {/* ─── Related Techniques ─── */}
        {related.length > 0 && (
          <section style={{ marginBottom: 36 }}>
            <h2 style={h2Style}>Related Techniques</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
              {related.map((r) => (
                <Link key={r.slug} href={`/techniques/${r.slug}`} style={{ padding: "18px 16px", background: "rgba(255,255,255,0.03)", border: `1px solid ${SUBTLE}`, borderRadius: 14, textDecoration: "none", transition: "all 0.2s" }}>
                  <span style={{ fontSize: 11, color: ACCENT, fontWeight: 600 }}>{r.modality}</span>
                  <p style={{ fontSize: 15, color: TEXT, margin: "6px 0 4px", fontWeight: 500 }}>
                    {r.title.split(":")[0]}
                  </p>
                  <span style={{ fontSize: 12, color: `rgba(45,42,38,0.55)` }}>{r.time}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ─── Share ─── */}
        <section style={{ marginBottom: 36 }}>
          <ShareResultCard technique={technique} elapsedMinutes={elapsedMinutes} />
        </section>

        {/* ─── Send Calm ─── */}
        <section style={{ marginBottom: 36, padding: "24px 20px", background: "var(--accent-warm-light)", borderRadius: 16, border: "1px solid rgba(196,149,106,0.15)", textAlign: "center" }}>
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 500, color: "var(--text-primary)", margin: "0 0 8px" }}>
            Know someone who needs this?
          </p>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 16px", lineHeight: 1.6 }}>
            Send this technique as a personal gift — with your name and a short message.
          </p>
          <Link href={`/send`} style={{ display: "inline-block", padding: "12px 28px", fontSize: 14, fontWeight: 600, fontFamily: "'Fraunces', serif", background: "var(--accent-warm)", color: "#fff", borderRadius: 24, textDecoration: "none" }}>
            Send Calm to Someone
          </Link>
        </section>

        {/* ─── Blueprint CTA ─── */}
        <section style={{ marginBottom: 36, padding: "28px 24px", background: "var(--bg-secondary)", borderRadius: 16, border: "1px solid rgba(45,42,38,0.06)", textAlign: "center" }}>
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 500, color: "var(--text-primary)", margin: "0 0 8px" }}>
            Discover Your Emotional Blueprint
          </p>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 16px", lineHeight: 1.6 }}>
            A 2-minute assessment that reveals your stress response pattern and best-match techniques.
          </p>
          <Link href="/blueprint" style={{ display: "inline-block", padding: "14px 32px", fontSize: 15, fontWeight: 600, fontFamily: "'Fraunces', serif", background: "var(--interactive)", color: "#fff", borderRadius: 24, textDecoration: "none" }}>
            Take the Assessment — Free
          </Link>
        </section>

        {/* ─── Archetype CTA (links technique -> archetype) ─── */}
        {(() => {
          const archetype = getArchetypeForTechnique(technique.slug);
          const displayName = archetype.charAt(0).toUpperCase() + archetype.slice(1);
          return (
            <section style={{ marginBottom: 36, padding: "24px 20px", background: "rgba(255,255,255,0.02)", borderRadius: 16, border: `1px solid ${SUBTLE}`, textAlign: "center" }}>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 500, color: "var(--text-primary)", margin: "0 0 8px" }}>
                Recommended Archetype: {displayName}
              </p>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 16px", lineHeight: 1.6 }}>
                This technique maps to the {displayName} archetype — explore tailored guidance, example routines, and tips that fit this pattern.
              </p>
              <Link href={`/archetypes/${archetype}`} style={{ display: "inline-block", padding: "12px 28px", fontSize: 14, fontWeight: 600, fontFamily: "'Fraunces', serif", background: "var(--interactive)", color: "#fff", borderRadius: 24, textDecoration: "none" }}>
                View the {displayName} Archetype
              </Link>
            </section>
          );
        })()}

        {/* ─── CTAs ─── */}
        <section style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36, textAlign: "center" }}>
          <Link href="/tools" style={{ padding: "14px 24px", background: "var(--surface)", border: `1px solid ${SUBTLE}`, borderRadius: 14, textDecoration: "none", color: TEXT, fontSize: 14 }}>
            Track which techniques work best for you → <span style={{ color: ACCENT, fontWeight: 600 }}>Try the Full Toolkit</span>
          </Link>
          <Link href="/companion" style={{ padding: "14px 24px", background: "var(--surface)", border: `1px solid ${SUBTLE}`, borderRadius: 14, textDecoration: "none", color: TEXT, fontSize: 14 }}>
            Go deeper with personalized guidance → <span style={{ color: ACCENT, fontWeight: 600 }}>Talk to Forj</span>
          </Link>
        </section>

        {/* ─── Email Capture ─── */}
        <EmailCapture />

      </article>

      <SiteFooter />
    </main>
  );
}

// ─── Shared Styles ───
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
  transition: "all 0.2s ease",
};

const btnSecondaryStyle = {
  padding: "12px 24px",
  fontSize: 14,
  fontWeight: 500,
  fontFamily: "'Fraunces', serif",
  background: "transparent",
  color: ACCENT,
  border: `1px solid ${SUBTLE}`,
  borderRadius: 14,
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const h2Style = {
  fontFamily: "'Fraunces', serif",
  fontSize: 22,
  fontWeight: 500,
  color: TEXT,
  marginBottom: 16,
};

const proseStyle = {
  fontSize: 16,
  color: "rgba(45,42,38,0.88)",
  lineHeight: 1.8,
  margin: 0,
};

const textareaStyle = {
  width: "100%",
  padding: "14px 16px",
  fontSize: 15,
  fontFamily: "'DM Sans', sans-serif",
  background: "var(--surface)",
  border: `1px solid ${SUBTLE}`,
  borderRadius: 12,
  color: TEXT,
  outline: "none",
  resize: "vertical",
  marginBottom: 16,
  boxSizing: "border-box",
};

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  fontSize: 15,
  fontFamily: "'DM Sans', sans-serif",
  background: "var(--surface)",
  border: `1px solid ${SUBTLE}`,
  borderRadius: 12,
  color: TEXT,
  outline: "none",
  boxSizing: "border-box",
};
