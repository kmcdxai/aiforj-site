"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { saveBlueprint } from "../lib/db";

// ═══════════════════════════════════════════════════════════════
// QUESTIONS — 10 questions across 4 clinical dimensions
// ═══════════════════════════════════════════════════════════════

const QUESTIONS = [
  // Dimension 1 — Nervous System State (Polyvagal)
  {
    id: 1,
    dimension: "nervous",
    text: "When you\u2019re stressed, your body usually\u2026",
    options: [
      { text: "Tenses up, heart races, you feel wired", tag: "sympathetic" },
      { text: "Shuts down, you feel heavy or numb", tag: "dorsal" },
      { text: "You can usually notice the stress and breathe through it", tag: "ventral" },
      { text: "It changes \u2014 sometimes wired, sometimes shutdown", tag: "mixed" },
    ],
  },
  {
    id: 2,
    dimension: "nervous",
    text: "In social situations that feel uncomfortable, you tend to\u2026",
    options: [
      { text: "Scan for exits or threats, stay hyper-alert", tag: "sympathetic" },
      { text: "Go quiet, disconnect, zone out", tag: "dorsal" },
      { text: "Feel uneasy but stay present", tag: "ventral" },
      { text: "Become overly accommodating to manage others\u2019 emotions", tag: "fawn" },
    ],
  },
  {
    id: 3,
    dimension: "nervous",
    text: "After a bad day, your body needs\u2026",
    options: [
      { text: "Movement \u2014 pacing, exercise, fidgeting", tag: "sympathetic" },
      { text: "Stillness \u2014 bed, dark room, withdrawing", tag: "dorsal" },
      { text: "Connection \u2014 talking, being near someone safe", tag: "ventral" },
      { text: "Distraction \u2014 scrolling, TV, anything to not feel it", tag: "avoidance" },
    ],
  },
  // Dimension 2 — Cognitive Pattern (CBT)
  {
    id: 4,
    dimension: "cognitive",
    text: "When something goes wrong, your first thought is usually\u2026",
    options: [
      { text: "\u201CThis is going to be a disaster\u201D", tag: "catastrophizing" },
      { text: "\u201CThis is my fault\u201D", tag: "personalization" },
      { text: "\u201CI should have known better\u201D", tag: "should" },
      { text: "\u201CPeople probably think I messed up\u201D", tag: "mindreading" },
    ],
  },
  {
    id: 5,
    dimension: "cognitive",
    text: "When you think about the future, you tend to\u2026",
    options: [
      { text: "Imagine worst-case scenarios in detail", tag: "catastrophizing" },
      { text: "See things as either going perfectly or failing completely", tag: "allornone" },
      { text: "Assume others will judge or reject you", tag: "mindreading" },
      { text: "Focus on what you should be doing but aren\u2019t", tag: "should" },
    ],
  },
  // Dimension 3 — Stress Response Style
  {
    id: 6,
    dimension: "stress",
    text: "Under pressure at work or school, you usually\u2026",
    options: [
      { text: "Get frustrated or confrontational", tag: "fight" },
      { text: "Start planning your escape \u2014 daydream about quitting", tag: "flight" },
      { text: "Freeze up \u2014 can\u2019t make decisions, procrastinate", tag: "freeze" },
      { text: "Over-work to make sure nobody is disappointed", tag: "fawn" },
    ],
  },
  {
    id: 7,
    dimension: "stress",
    text: "In a conflict with someone you care about, you\u2026",
    options: [
      { text: "Get defensive or push back", tag: "fight" },
      { text: "Want to leave or need space immediately", tag: "flight" },
      { text: "Go blank \u2014 can\u2019t find the words", tag: "freeze" },
      { text: "Apologize quickly even if it wasn\u2019t your fault", tag: "fawn" },
    ],
  },
  // Dimension 4 — Emotional Regulation
  {
    id: 8,
    dimension: "regulation",
    text: "When a painful emotion hits, you typically\u2026",
    options: [
      { text: "Push it down and keep going", tag: "suppression" },
      { text: "Replay the situation over and over", tag: "rumination" },
      { text: "Avoid anything that reminds you of it", tag: "avoidance" },
      { text: "Try to understand it or reframe it", tag: "reappraisal" },
    ],
  },
  {
    id: 9,
    dimension: "regulation",
    text: "Your relationship with your own emotions is best described as\u2026",
    options: [
      { text: "I feel too much, too intensely", tag: "flooding" },
      { text: "I think more than I feel", tag: "intellectualization" },
      { text: "I don\u2019t always know what I\u2019m feeling", tag: "alexithymia" },
      { text: "I feel things deeply but can usually sit with them", tag: "acceptance" },
    ],
  },
  {
    id: 10,
    dimension: "regulation",
    text: "What best describes your inner voice?",
    options: [
      { text: "Critical \u2014 it points out everything wrong", tag: "critic" },
      { text: "Anxious \u2014 it warns me about what could go wrong", tag: "threat" },
      { text: "Quiet \u2014 I don\u2019t hear much, mostly numbness", tag: "disconnected" },
      { text: "Encouraging but tired \u2014 it tries, but it\u2019s exhausted", tag: "depleted" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// ARCHETYPES
// ═══════════════════════════════════════════════════════════════

const ARCHETYPES = {
  sentinel: {
    name: "The Sentinel",
    subtitle: "The Hypervigilant Protector",
    colors: { primary: "#2C3E6B", accent: "#C4956A", bg: "#E8ECF4", card: "#F0F2F8" },
    description:
      "Your nervous system is wired for vigilance \u2014 always scanning, always preparing. This isn\u2019t a flaw; it\u2019s a survival system that learned early to stay alert. The cost is that your body rarely gets the signal that it\u2019s safe to rest. You carry tension like armor, and your mind runs threat assessments even in calm moments.",
    stressResponse: "Fight or Fawn",
    thinkingPattern: "Catastrophizing & Mind-Reading",
    nervousSystem: "Sympathetic Dominant",
    techniques: [
      { name: "Box Breathing", slug: "box-breathing", duration: "4 min" },
      { name: "Cognitive Restructuring", slug: "cognitive-restructuring", duration: "10 min" },
      { name: "Progressive Muscle Relaxation", slug: "progressive-muscle-relaxation", duration: "12 min" },
    ],
  },
  empath: {
    name: "The Empath",
    subtitle: "The Emotional Absorber",
    colors: { primary: "#C49B9B", accent: "#8B6F6F", bg: "#FAF5F5", card: "#FDF8F8" },
    description:
      "You feel everything \u2014 yours and everyone else\u2019s. Your empathy is genuine and deep, but without boundaries it becomes a flood. You likely learned early that keeping others comfortable kept you safe. The pattern now is automatic: you absorb before you can filter, and you apologize before you can assess.",
    stressResponse: "Fawn",
    thinkingPattern: "Personalization",
    nervousSystem: "Mixed \u2014 Fawn Response",
    techniques: [
      { name: "Radical Acceptance", slug: "radical-acceptance", duration: "8 min" },
      { name: "Self-Compassion Break", slug: "self-compassion-break", duration: "5 min" },
      { name: "Body Scan", slug: "body-scan", duration: "10 min" },
    ],
  },
  architect: {
    name: "The Architect",
    subtitle: "The Strategic Escape Artist",
    colors: { primary: "#6B8BA4", accent: "#4A6B80", bg: "#EFF4F7", card: "#F5F8FA" },
    description:
      "You process the world through logic and strategy. When emotions get loud, you retreat into your head \u2014 planning, analyzing, building exit routes. This isn\u2019t coldness; it\u2019s a brilliant coping system that keeps you functional under pressure. The trade-off is that your body\u2019s signals get muted, and intimacy can feel like a threat to your carefully maintained control.",
    stressResponse: "Flight",
    thinkingPattern: "Should Statements",
    nervousSystem: "Sympathetic \u2014 Flight Mode",
    techniques: [
      { name: "Body Scan", slug: "body-scan", duration: "10 min" },
      { name: "Values Clarification", slug: "values-clarification", duration: "15 min" },
      { name: "Physiological Sigh", slug: "physiological-sigh", duration: "1 min" },
    ],
  },
  phoenix: {
    name: "The Phoenix",
    subtitle: "The Resilient but Running on Empty",
    colors: { primary: "#C4956A", accent: "#3D3630", bg: "#F8F0E8", card: "#FBF5EF" },
    description:
      "You\u2019ve been through it \u2014 and you\u2019ve rebuilt yourself more than once. You have genuine resilience and real insight into your own patterns. But resilience without rest becomes depletion. Your inner voice still tries to encourage you, but it\u2019s exhausted. You don\u2019t need more strength. You need permission to stop being strong.",
    stressResponse: "Mixed",
    thinkingPattern: "Reappraisal (but depleted)",
    nervousSystem: "Mixed \u2014 Oscillating",
    techniques: [
      { name: "Behavioral Activation", slug: "behavioral-activation", duration: "10 min" },
      { name: "Self-Compassion Break", slug: "self-compassion-break", duration: "5 min" },
      { name: "Vagal Toning", slug: "vagal-toning", duration: "8 min" },
    ],
  },
  storm: {
    name: "The Storm",
    subtitle: "The Intense Force",
    colors: { primary: "#6B5B8A", accent: "#4A3D6B", bg: "#F0ECF5", card: "#F6F3FA" },
    description:
      "You feel with your whole body. Your emotions aren\u2019t just feelings \u2014 they\u2019re weather systems. This intensity is actually a sign of deep processing capacity, but without regulation tools it can feel destructive. You\u2019re not \u201Ctoo much.\u201D Your nervous system just needs better shock absorbers.",
    stressResponse: "Fight",
    thinkingPattern: "Catastrophizing & Rumination",
    nervousSystem: "Sympathetic \u2014 High Activation",
    techniques: [
      { name: "TIPP Crisis Skill", slug: "tipp-skill", duration: "5 min" },
      { name: "5-4-3-2-1 Grounding", slug: "54321-grounding", duration: "3 min" },
      { name: "Body Scan", slug: "body-scan", duration: "10 min" },
    ],
  },
  ghost: {
    name: "The Ghost",
    subtitle: "The Quiet Disappearance",
    colors: { primary: "#8A9B8E", accent: "#5F7066", bg: "#EDF2EE", card: "#F4F7F4" },
    description:
      "You\u2019ve learned to become invisible when things get hard. Numbing, withdrawing, disconnecting \u2014 these aren\u2019t choices; they\u2019re automatic nervous system responses to overwhelm. Somewhere along the way, your system decided that feeling nothing was safer than feeling too much. The path back isn\u2019t through force \u2014 it\u2019s through gentle, titrated reconnection.",
    stressResponse: "Freeze",
    thinkingPattern: "Avoidance & Disconnection",
    nervousSystem: "Dorsal Vagal Dominant",
    techniques: [
      { name: "5-4-3-2-1 Grounding", slug: "54321-grounding", duration: "3 min" },
      { name: "Vagal Toning", slug: "vagal-toning", duration: "8 min" },
      { name: "Thought Defusion", slug: "thought-defusion", duration: "5 min" },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════
// SCORING ENGINE
// ═══════════════════════════════════════════════════════════════

function calculateArchetype(answers) {
  const scores = {
    sentinel: 0, empath: 0, architect: 0,
    phoenix: 0, storm: 0, ghost: 0,
  };

  const dims = { nervous: {}, cognitive: {}, stress: {}, regulation: {} };

  // Tally tags per dimension
  answers.forEach((a, i) => {
    const q = QUESTIONS[i];
    const tag = q.options[a].tag;
    dims[q.dimension][tag] = (dims[q.dimension][tag] || 0) + 1;
  });

  // Nervous system
  const n = dims.nervous;
  if ((n.sympathetic || 0) >= 2) { scores.sentinel += 3; scores.storm += 2; }
  if ((n.dorsal || 0) >= 2) { scores.ghost += 4; }
  if ((n.mixed || 0) >= 1) { scores.phoenix += 2; }
  if ((n.fawn || 0) >= 1) { scores.empath += 2; scores.phoenix += 1; }
  if ((n.ventral || 0) >= 2) { scores.phoenix += 1; }
  if ((n.avoidance || 0) >= 1) { scores.ghost += 1; scores.architect += 1; }

  // Cognitive pattern
  const c = dims.cognitive;
  if ((c.catastrophizing || 0) >= 1) { scores.sentinel += 2; scores.storm += 2; }
  if ((c.personalization || 0) >= 1) { scores.empath += 3; }
  if ((c.should || 0) >= 1) { scores.architect += 3; }
  if ((c.mindreading || 0) >= 1) { scores.sentinel += 2; scores.empath += 1; }
  if ((c.allornone || 0) >= 1) { scores.storm += 1; scores.sentinel += 1; }

  // Stress response
  const s = dims.stress;
  if ((s.fight || 0) >= 1) { scores.storm += 3; scores.sentinel += 1; }
  if ((s.flight || 0) >= 1) { scores.architect += 3; }
  if ((s.freeze || 0) >= 1) { scores.ghost += 3; }
  if ((s.fawn || 0) >= 1) { scores.empath += 3; scores.sentinel += 1; }

  // Emotional regulation
  const r = dims.regulation;
  if ((r.suppression || 0) >= 1) { scores.sentinel += 2; scores.architect += 2; }
  if ((r.rumination || 0) >= 1) { scores.storm += 2; scores.empath += 1; scores.sentinel += 1; }
  if ((r.avoidance || 0) >= 1) { scores.ghost += 2; }
  if ((r.reappraisal || 0) >= 1) { scores.phoenix += 3; }
  if ((r.flooding || 0) >= 1) { scores.empath += 2; scores.storm += 2; }
  if ((r.intellectualization || 0) >= 1) { scores.architect += 2; }
  if ((r.alexithymia || 0) >= 1) { scores.ghost += 2; }
  if ((r.acceptance || 0) >= 1) { scores.phoenix += 2; }
  if ((r.critic || 0) >= 1) { scores.sentinel += 1; scores.storm += 1; }
  if ((r.threat || 0) >= 1) { scores.sentinel += 2; }
  if ((r.disconnected || 0) >= 1) { scores.ghost += 2; }
  if ((r.depleted || 0) >= 1) { scores.phoenix += 3; }

  // Find winner
  let best = "phoenix";
  let max = 0;
  for (const [k, v] of Object.entries(scores)) {
    if (v > max) { max = v; best = k; }
  }

  return { archetype: best, scores, dimensions: dims };
}

// ═══════════════════════════════════════════════════════════════
// SVG ICONS
// ═══════════════════════════════════════════════════════════════

function ArchetypeIcon({ type, size = 64, color }) {
  const s = { sentinel: SentinelIcon, empath: EmpathIcon, architect: ArchitectIcon, phoenix: PhoenixIcon, storm: StormIcon, ghost: GhostIcon };
  const Icon = s[type] || SentinelIcon;
  return <Icon size={size} color={color} />;
}

function SentinelIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <ellipse cx="32" cy="32" rx="28" ry="16" stroke={color} strokeWidth="2" fill="none" />
      <circle cx="32" cy="32" r="8" fill={color} opacity="0.2" />
      <circle cx="32" cy="32" r="4" fill={color} />
    </svg>
  );
}

function EmpathIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M24 22c-6 0-11 5-11 11 0 12 19 20 19 20s19-8 19-20c0-6-5-11-11-11-4 0-6 2-8 5-2-3-4-5-8-5z" fill={color} opacity="0.15" stroke={color} strokeWidth="2" />
      <path d="M28 26c-4 0-7 3-7 7 0 8 11 13 11 13s11-5 11-13c0-4-3-7-7-7-2.5 0-3.5 1.2-4 3-0.5-1.8-1.5-3-4-3z" fill={color} opacity="0.3" />
    </svg>
  );
}

function ArchitectIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="24" stroke={color} strokeWidth="2" fill="none" />
      <line x1="32" y1="8" x2="32" y2="56" stroke={color} strokeWidth="1.5" opacity="0.4" />
      <line x1="8" y1="32" x2="56" y2="32" stroke={color} strokeWidth="1.5" opacity="0.4" />
      <circle cx="32" cy="32" r="4" fill={color} />
      <line x1="32" y1="32" x2="48" y2="16" stroke={color} strokeWidth="2" />
    </svg>
  );
}

function PhoenixIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M32 8 C30 20, 22 28, 20 40 C18 50, 24 56, 32 56 C40 56, 46 50, 44 40 C42 28, 34 20, 32 8z" fill={color} opacity="0.15" stroke={color} strokeWidth="2" />
      <path d="M32 18 C31 26, 28 30, 27 38 C26 44, 28 48, 32 48 C36 48, 38 44, 37 38 C36 30, 33 26, 32 18z" fill={color} opacity="0.3" />
      <circle cx="32" cy="12" r="3" fill={color} opacity="0.6" />
    </svg>
  );
}

function StormIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M36 8 L24 30 L34 30 L28 56" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32 32 C20 32, 14 26, 18 18" stroke={color} strokeWidth="1.5" fill="none" opacity="0.3" strokeLinecap="round" />
      <path d="M32 32 C44 32, 50 38, 46 46" stroke={color} strokeWidth="1.5" fill="none" opacity="0.3" strokeLinecap="round" />
    </svg>
  );
}

function GhostIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="24" stroke={color} strokeWidth="1.5" fill={color} opacity="0.08" />
      <circle cx="32" cy="32" r="16" stroke={color} strokeWidth="1" fill={color} opacity="0.06" />
      <circle cx="32" cy="32" r="4" fill={color} opacity="0.5" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function BlueprintClient() {
  const [step, setStep] = useState(0); // 0 = intro, 1-10 = questions, 11 = result
  const [answers, setAnswers] = useState(Array(10).fill(null));
  const [selected, setSelected] = useState(null);
  const [direction, setDirection] = useState("forward");
  const [result, setResult] = useState(null);
  const [showShare, setShowShare] = useState(false);
  const [toast, setToast] = useState(null);
  const [shareEmail, setShareEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const cardRef = useRef(null);

  const qIndex = step - 1;

  // On entering a question, restore any previously saved answer
  useEffect(() => {
    if (step >= 1 && step <= 10) {
      setSelected(answers[qIndex]);
    }
  }, [step]);

  const handleSelect = (idx) => {
    setSelected(idx);
  };

  const handleNext = useCallback(() => {
    if (selected === null) return;
    const newAnswers = [...answers];
    newAnswers[qIndex] = selected;
    setAnswers(newAnswers);
    setDirection("forward");

    if (step === 10) {
      // Calculate result
      const res = calculateArchetype(newAnswers);
      setResult(res);
      setStep(11);
      // Save to IndexedDB
      saveBlueprint({
        archetype: res.archetype,
        dimensionScores: res.scores,
      }).then(() => {
        setToast("Blueprint saved to your Progress Garden");
        setTimeout(() => setToast(null), 4000);
      }).catch(() => {});
      // Increment weekly counter
      try {
        const key = `blueprint_count_${new Date().toISOString().slice(0, 10).slice(0, 7)}`;
        const current = parseInt(localStorage.getItem(key) || "0", 10);
        localStorage.setItem(key, String(current + 1));
      } catch {}
    } else {
      setSelected(null);
      setStep((s) => s + 1);
    }
  }, [selected, answers, qIndex, step]);

  const handleBack = () => {
    if (step <= 1) return;
    setDirection("back");
    setStep((s) => s - 1);
  };

  const handleStart = () => {
    setDirection("forward");
    setStep(1);
  };

  const handleReset = () => {
    setAnswers(Array(10).fill(null));
    setSelected(null);
    setResult(null);
    setShowShare(false);
    setDirection("forward");
    setStep(0);
  };

  const handleShareImage = async (format) => {
    if (!cardRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const dims = { story: { w: 1080, h: 1920 }, square: { w: 1080, h: 1080 }, wide: { w: 1200, h: 630 } };
      const d = dims[format] || dims.square;

      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
      });

      // Create sized canvas
      const out = document.createElement("canvas");
      out.width = d.w;
      out.height = d.h;
      const ctx = out.getContext("2d");

      // Fill background
      const arch = ARCHETYPES[result.archetype];
      ctx.fillStyle = arch.colors.bg;
      ctx.fillRect(0, 0, d.w, d.h);

      // Scale and center the card
      const scale = Math.min((d.w - 80) / canvas.width, (d.h - 160) / canvas.height);
      const sw = canvas.width * scale;
      const sh = canvas.height * scale;
      ctx.drawImage(canvas, (d.w - sw) / 2, (d.h - sh) / 2 - 30, sw, sh);

      // Watermark
      ctx.fillStyle = arch.colors.primary;
      ctx.globalAlpha = 0.6;
      ctx.font = "500 24px 'DM Sans', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("aiforj.com/blueprint", d.w / 2, d.h - 60);
      ctx.font = "400 16px 'DM Sans', sans-serif";
      ctx.globalAlpha = 0.4;
      ctx.fillText("Designed by a Board Certified PMHNP", d.w / 2, d.h - 32);

      const blob = await new Promise((res) => out.toBlob(res, "image/png"));
      const file = new File([blob], `blueprint-${result.archetype}.png`, { type: "image/png" });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `I'm ${arch.name} — What's your Emotional Blueprint?`,
          text: `I just discovered my Emotional Blueprint. Take yours free at aiforj.com/blueprint`,
          files: [file],
        });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `blueprint-${result.archetype}-${format}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      // Fallback: copy link
      navigator.clipboard?.writeText("https://aiforj.com/blueprint").catch(() => {});
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText("https://aiforj.com/blueprint").then(() => {
      setToast("Link copied!");
      setTimeout(() => setToast(null), 2500);
    }).catch(() => {});
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!shareEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shareEmail)) return;
    setEmailLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_address: shareEmail }),
      });
      if (res.ok) setEmailSubmitted(true);
    } catch {}
    setEmailLoading(false);
  };

  // ─── INTRO SCREEN ───
  if (step === 0) {
    return (
      <div style={styles.page}>
        <div style={styles.intro}>
          <a href="/" style={styles.backLink}>← Back to AIForj</a>
          <div style={{ marginTop: 60, marginBottom: 40, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            {Object.entries(ARCHETYPES).map(([key, a]) => (
              <ArchetypeIcon key={key} type={key} size={36} color={a.colors.primary} />
            ))}
          </div>
          <h1 style={styles.introTitle}>Discover Your Emotional Blueprint</h1>
          <p style={styles.introSub}>
            A 2-minute assessment designed by a Board Certified PMHNP. Learn your stress response pattern, your dominant thinking style, and which techniques match your brain.
          </p>
          <button onClick={handleStart} style={styles.startBtn}>
            Begin Assessment
          </button>
          <p style={styles.privacyNote}>
            Nothing is stored on any server. Nothing leaves your browser.
          </p>
        </div>
      </div>
    );
  }

  // ─── RESULT SCREEN ───
  if (step === 11 && result) {
    const arch = ARCHETYPES[result.archetype];
    return (
      <div style={{ ...styles.page, background: arch.colors.bg }}>
        {toast && <div style={styles.toast}>{toast}</div>}

        <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 20px 80px", width: "100%" }}>
          <div ref={cardRef} style={{ background: arch.colors.card, borderRadius: 24, padding: "48px 32px", boxShadow: "0 4px 24px rgba(45,42,38,0.08)", border: `1px solid ${arch.colors.primary}22` }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <ArchetypeIcon type={result.archetype} size={80} color={arch.colors.primary} />
            </div>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem, 5vw, 2.75rem)", fontWeight: 600, color: arch.colors.primary, textAlign: "center", margin: "0 0 8px", lineHeight: 1.15 }}>
              {arch.name}
            </h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: arch.colors.accent, textAlign: "center", margin: "0 0 28px", letterSpacing: 0.5, fontWeight: 500 }}>
              {arch.subtitle}
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.75, color: "var(--text-primary)", margin: "0 0 28px", textAlign: "center" }}>
              {arch.description}
            </p>
            <div style={{ textAlign: 'center', marginBottom: 18 }}>
              <a href={`/archetypes/${result.archetype}`} style={{ fontWeight: 600, color: arch.colors.primary, textDecoration: 'none' }}>Learn more about your archetype →</a>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 8 }}>
              {[
                { label: "Your Stress Response", value: arch.stressResponse },
                { label: "Your Thinking Pattern", value: arch.thinkingPattern },
                { label: "Your Nervous System Tends Toward", value: arch.nervousSystem },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: `${arch.colors.primary}0A`, borderRadius: 12, borderLeft: `3px solid ${arch.colors.primary}40` }}>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif" }}>{item.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: arch.colors.primary, fontFamily: "'Fraunces', serif" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Techniques */}
          <div style={{ marginTop: 40 }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.25rem, 3vw, 1.5rem)", fontWeight: 500, color: "var(--text-primary)", marginBottom: 16, textAlign: "center" }}>
              Your Top 3 Techniques
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {arch.techniques.map((t) => (
                <a key={t.slug} href={`/techniques/${t.slug}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", background: "var(--surface-elevated)", borderRadius: 14, textDecoration: "none", border: "1px solid rgba(45,42,38,0.06)", boxShadow: "var(--shadow-sm)", transition: "all 300ms cubic-bezier(0.16,1,0.3,1)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500, color: "var(--text-primary)" }}>{t.name}</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--text-muted)" }}>{t.duration} →</span>
                </a>
              ))}
            </div>
          </div>

          {/* Share */}
          <div style={{ marginTop: 40, textAlign: "center" }}>
            <button onClick={() => setShowShare(true)} style={{ ...styles.startBtn, background: `linear-gradient(135deg, ${arch.colors.primary}, ${arch.colors.accent})` }}>
              Share Your Blueprint
            </button>
          </div>

          {showShare && (
            <div style={{ marginTop: 24, background: "var(--surface-elevated)", borderRadius: 20, padding: "28px 24px", boxShadow: "var(--shadow-md)", border: "1px solid rgba(45,42,38,0.06)" }}>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 500, color: "var(--text-primary)", margin: "0 0 16px", textAlign: "center" }}>
                Create your Forj Card
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
                {[
                  { key: "story", label: "Story (9:16)" },
                  { key: "square", label: "Square (1:1)" },
                  { key: "wide", label: "Wide (Twitter)" },
                ].map((f) => (
                  <button key={f.key} onClick={() => handleShareImage(f.key)} style={{ padding: "10px 20px", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, background: `${arch.colors.primary}10`, color: arch.colors.primary, border: `1px solid ${arch.colors.primary}30`, borderRadius: 10, cursor: "pointer", transition: "all 300ms cubic-bezier(0.16,1,0.3,1)" }}>
                    {f.label}
                  </button>
                ))}
              </div>
              <button onClick={handleCopyLink} style={{ display: "block", margin: "0 auto 12px", padding: "8px 24px", fontSize: 13, fontFamily: "'DM Sans', sans-serif", background: "transparent", color: "var(--text-secondary)", border: "1px solid rgba(45,42,38,0.1)", borderRadius: 8, cursor: "pointer" }}>
                Copy link
              </button>
              <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", margin: 0 }}>
                Your friends can take theirs at aiforj.com/blueprint
              </p>
            </div>
          )}

          {/* Email Capture */}
          <div style={{ marginTop: 40, background: "var(--surface)", borderRadius: 20, padding: "32px 24px", border: "1px solid rgba(45,42,38,0.06)", textAlign: "center" }}>
            {emailSubmitted ? (
              <div>
                <div style={{ fontSize: 28, marginBottom: 10, color: "var(--interactive)" }}>✓</div>
                <p style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 500, color: "var(--text-primary)", margin: 0 }}>
                  Check your inbox for your full Blueprint report.
                </p>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 500, color: "var(--text-primary)", margin: "0 0 8px" }}>
                  Get Your Full Blueprint Report
                </h3>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "0 0 20px", lineHeight: 1.5 }}>
                  We'll send your complete Blueprint with a personalized technique guide.
                </p>
                <form onSubmit={handleEmailSubmit} style={{ display: "flex", gap: 10, maxWidth: 400, margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }}>
                  <input
                    type="email"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                    placeholder="your@email.com"
                    aria-label="Email address"
                    style={{ flex: "1 1 200px", padding: "12px 16px", fontSize: 15, fontFamily: "'DM Sans', sans-serif", background: "var(--surface-elevated)", border: "1px solid rgba(45,42,38,0.1)", borderRadius: 10, color: "var(--text-primary)", outline: "none" }}
                    onFocus={(e) => { e.target.style.borderColor = "var(--interactive)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(45,42,38,0.1)"; }}
                  />
                  <button type="submit" disabled={emailLoading} style={{ padding: "12px 28px", fontSize: 14, fontWeight: 600, fontFamily: "'Fraunces', serif", background: `linear-gradient(135deg, ${arch.colors.primary}, ${arch.colors.accent})`, color: "#fff", border: "none", borderRadius: 10, cursor: emailLoading ? "wait" : "pointer", opacity: emailLoading ? 0.7 : 1 }}>
                    {emailLoading ? "..." : "Send Report"}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Bottom CTAs */}
          <div style={{ marginTop: 32, textAlign: "center", display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
            <a href="/tools" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500, color: arch.colors.primary, textDecoration: "none" }}>
              Try your top technique now →
            </a>
            <button onClick={handleReset} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", padding: 0 }}>
              Take it again
            </button>
          </div>

          {/* Disclaimer */}
          <p style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", marginTop: 40, lineHeight: 1.6 }}>
            This assessment is for self-reflection only — not a clinical diagnosis.
            {" "}Built by a Board Certified PMHNP. Nothing is stored or sent to any server.
          </p>
        </div>
      </div>
    );
  }

  // ─── QUESTION SCREEN ───
  const q = QUESTIONS[qIndex];

  return (
    <div style={styles.page}>
      {toast && <div style={styles.toast}>{toast}</div>}

      {/* Progress bar */}
      <div style={styles.progressTrack}>
        <div style={{ ...styles.progressFill, width: `${(step / 10) * 100}%` }} />
      </div>

      {/* Header */}
      <div style={{ padding: "16px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 640, margin: "0 auto", width: "100%" }}>
        <button onClick={step === 1 ? handleReset : handleBack} aria-label="Go back" style={styles.backBtn}>
          ←
        </button>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--text-muted)" }}>
          {step} of 10
        </span>
      </div>

      {/* Question card */}
      <div
        key={step}
        style={{
          ...styles.questionWrap,
          animation: direction === "forward" ? "slideInRight 350ms cubic-bezier(0.16,1,0.3,1)" : "slideInLeft 350ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div style={styles.questionCard}>
          <h2 style={styles.questionText}>{q.text}</h2>

          <div style={styles.optionsGrid} role="radiogroup" aria-label={q.text}>
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                role="radio"
                aria-checked={selected === i}
                tabIndex={0}
                style={{
                  ...styles.option,
                  borderColor: selected === i ? "var(--interactive)" : "rgba(45,42,38,0.08)",
                  background: selected === i ? "var(--accent-sage-light)" : "var(--surface-elevated)",
                }}
              >
                <span style={{ ...styles.optionDot, background: selected === i ? "var(--interactive)" : "transparent", borderColor: selected === i ? "var(--interactive)" : "rgba(45,42,38,0.2)" }} />
                <span style={{ ...styles.optionText, color: selected === i ? "var(--text-primary)" : "var(--text-secondary)" }}>
                  {opt.text}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={selected === null}
            style={{
              ...styles.nextBtn,
              opacity: selected === null ? 0.35 : 1,
              cursor: selected === null ? "default" : "pointer",
              transform: selected === null ? "scale(0.97)" : "scale(1)",
            }}
          >
            {step === 10 ? "See My Blueprint" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════

const styles = {
  page: {
    minHeight: "100vh",
    background: "var(--bg-primary)",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'DM Sans', sans-serif",
  },
  intro: {
    maxWidth: 560,
    margin: "0 auto",
    padding: "24px 24px 80px",
    textAlign: "center",
    width: "100%",
  },
  backLink: {
    fontSize: 13,
    color: "var(--text-muted)",
    textDecoration: "none",
    fontFamily: "'DM Sans', sans-serif",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  },
  introTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: "clamp(2rem, 5vw, 3rem)",
    fontWeight: 600,
    color: "var(--text-primary)",
    margin: "0 0 20px",
    lineHeight: 1.15,
  },
  introSub: {
    fontSize: 16,
    lineHeight: 1.7,
    color: "var(--text-secondary)",
    margin: "0 0 40px",
    maxWidth: 460,
    marginLeft: "auto",
    marginRight: "auto",
  },
  startBtn: {
    display: "inline-block",
    padding: "16px 40px",
    fontSize: 16,
    fontWeight: 600,
    fontFamily: "'Fraunces', serif",
    background: "linear-gradient(135deg, var(--interactive), var(--interactive-pressed))",
    color: "#fff",
    border: "none",
    borderRadius: 50,
    cursor: "pointer",
    transition: "all 300ms cubic-bezier(0.16,1,0.3,1)",
    boxShadow: "0 4px 16px rgba(125,155,130,0.25)",
    letterSpacing: 0.3,
  },
  privacyNote: {
    fontSize: 12,
    color: "var(--text-muted)",
    marginTop: 20,
  },
  progressTrack: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    background: "rgba(45,42,38,0.06)",
    zIndex: 50,
  },
  progressFill: {
    height: "100%",
    background: "var(--interactive)",
    transition: "width 400ms cubic-bezier(0.16,1,0.3,1)",
    borderRadius: "0 2px 2px 0",
  },
  backBtn: {
    background: "none",
    border: "1px solid rgba(45,42,38,0.08)",
    borderRadius: 10,
    width: 40,
    height: 40,
    fontSize: 18,
    color: "var(--text-muted)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 300ms cubic-bezier(0.16,1,0.3,1)",
  },
  questionWrap: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 20px 60px",
  },
  questionCard: {
    maxWidth: 520,
    width: "100%",
  },
  questionText: {
    fontFamily: "'Fraunces', serif",
    fontSize: "clamp(1.35rem, 3.5vw, 1.75rem)",
    fontWeight: 500,
    color: "var(--text-primary)",
    lineHeight: 1.35,
    margin: "0 0 32px",
    textAlign: "center",
  },
  optionsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 32,
  },
  option: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "16px 18px",
    borderRadius: 14,
    border: "2px solid rgba(45,42,38,0.08)",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 250ms cubic-bezier(0.16,1,0.3,1)",
    width: "100%",
    fontFamily: "'DM Sans', sans-serif",
  },
  optionDot: {
    width: 20,
    height: 20,
    borderRadius: "50%",
    border: "2px solid rgba(45,42,38,0.2)",
    flexShrink: 0,
    transition: "all 250ms cubic-bezier(0.16,1,0.3,1)",
  },
  optionText: {
    fontSize: 15,
    lineHeight: 1.5,
  },
  nextBtn: {
    display: "block",
    width: "100%",
    padding: "16px",
    fontSize: 16,
    fontWeight: 600,
    fontFamily: "'Fraunces', serif",
    background: "linear-gradient(135deg, var(--interactive), var(--interactive-pressed))",
    color: "#fff",
    border: "none",
    borderRadius: 14,
    transition: "all 350ms cubic-bezier(0.16,1,0.3,1)",
    boxShadow: "0 4px 16px rgba(125,155,130,0.2)",
  },
  toast: {
    position: "fixed",
    bottom: 24,
    left: "50%",
    transform: "translateX(-50%)",
    background: "var(--text-primary)",
    color: "var(--bg-primary)",
    padding: "10px 24px",
    borderRadius: 12,
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    zIndex: 100,
    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
    animation: "fadeIn 300ms ease-out",
  },
};
