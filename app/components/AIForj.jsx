"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

// ═══════════════════════════════════════════════════════════════
// PRODUCTION CONFIG
// ═══════════════════════════════════════════════════════════════
const CONFIG = {
  WEBLLM_MODEL: "Phi-3.5-mini-instruct-q4f16_1-MLC",
};

// ═══════════════════════════════════════════════════════════════
// PERSISTENT STORAGE — localStorage
// ═══════════════════════════════════════════════════════════════
const Storage = {
  async get(key) {
    try {
      if (typeof window === "undefined") return null;
      const v = localStorage.getItem(`aiforj_${key}`);
      return v ? JSON.parse(v) : null;
    } catch { return null; }
  },
  async set(key, value) {
    try {
      if (typeof window === "undefined") return;
      localStorage.setItem(`aiforj_${key}`, JSON.stringify(value));
    } catch {}
  },
};

// ═══════════════════════════════════════════════════════════════
// SCIENTIFICALLY-BACKED COLOR PALETTES PER EMOTIONAL STATE
// Based on: blue reduces HR/BP (Psychiatry Advisor 2024),
// green restores cognitive function (PMC 2021),
// lavender reduces cortisol (CogniFit 2025),
// warm amber/earth tones ground limbic system
// ═══════════════════════════════════════════════════════════════
const COLOR_THEMES = {
  default: { bg: "#F5F2ED", accent: "#6B7F6E", text: "#2D3732", subtle: "rgba(107,127,110,0.08)", card: "rgba(255,255,255,0.6)", breathe: "139,156,139" },
  anxious: { bg: "#EDF3F5", accent: "#4A7C8A", text: "#1E3A42", subtle: "rgba(74,124,138,0.08)", card: "rgba(230,242,248,0.6)", breathe: "74,124,138" },
  overwhelmed: { bg: "#F0EDF5", accent: "#7B6B9A", text: "#2E2340", subtle: "rgba(123,107,154,0.08)", card: "rgba(238,232,248,0.6)", breathe: "123,107,154" },
  sad: { bg: "#F5F0E8", accent: "#B8935A", text: "#3A2E1E", subtle: "rgba(184,147,90,0.08)", card: "rgba(250,243,230,0.6)", breathe: "184,147,90" },
  angry: { bg: "#EDF0F5", accent: "#3D5A80", text: "#1A2A3E", subtle: "rgba(61,90,128,0.08)", card: "rgba(230,238,248,0.6)", breathe: "61,90,128" },
  numb: { bg: "#F5EDE8", accent: "#A0725A", text: "#3A2A1E", subtle: "rgba(160,114,90,0.08)", card: "rgba(248,238,230,0.6)", breathe: "160,114,90" },
  unmotivated: { bg: "#EEF3EB", accent: "#5B8C5A", text: "#1E3220", subtle: "rgba(91,140,90,0.08)", card: "rgba(235,248,232,0.6)", breathe: "91,140,90" },
  lonely: { bg: "#F5EDF0", accent: "#9A6B7B", text: "#3A1E2A", subtle: "rgba(154,107,123,0.08)", card: "rgba(248,232,238,0.6)", breathe: "154,107,123" },
  fine: { bg: "#EDF2F5", accent: "#5A8CA0", text: "#1E2E3A", subtle: "rgba(90,140,160,0.08)", card: "rgba(232,242,248,0.6)", breathe: "90,140,160" },
  stressed: { bg: "#F0F3ED", accent: "#6B8C6B", text: "#1E321E", subtle: "rgba(107,140,107,0.08)", card: "rgba(238,248,235,0.6)", breathe: "107,140,107" },
};

const EMOTIONS = [
  { id: "anxious", label: "Anxious", icon: "⚡", desc: "Racing thoughts, worry, tension" },
  { id: "overwhelmed", label: "Overwhelmed", icon: "🌊", desc: "Too much, can't process" },
  { id: "sad", label: "Sad", icon: "🌧", desc: "Heavy, low, tearful" },
  { id: "angry", label: "Angry", icon: "🔥", desc: "Frustrated, irritated, furious" },
  { id: "numb", label: "Numb", icon: "🧊", desc: "Disconnected, empty, flat" },
  { id: "unmotivated", label: "Unmotivated", icon: "🪫", desc: "No energy, can't start" },
  { id: "lonely", label: "Lonely", icon: "🌑", desc: "Isolated, disconnected" },
  { id: "stressed", label: "Stressed", icon: "⏰", desc: "Pressure, deadline, tense" },
  { id: "fine", label: "I'm Good", icon: "☀️", desc: "Optimize & grow" },
];

// ═══════════════════════════════════════════════════════════════
// COMPREHENSIVE EVIDENCE-BASED PROTOCOLS
// CBT, DBT, ACT, IPT, Behavioral Activation, MBSR,
// Motivational Interviewing, Positive Psychology
// ═══════════════════════════════════════════════════════════════
const PROTOCOLS = {
  anxious: {
    title: "Anxiety Reset",
    basis: "CBT + Somatic Grounding + ACT",
    icon: "⚡",
    steps: [
      { type: "breathing", title: "Vagal Nerve Reset", instruction: "Activating your parasympathetic nervous system. This 4-4-6 pattern is clinically shown to reduce cortisol and lower heart rate within 90 seconds.", breathe: { inhale: 4, hold: 4, exhale: 6 } },
      { type: "scale", title: "Anxiety Intensity", instruction: "How intense is this anxiety right now? This helps us calibrate the right intervention.", fieldKey: "intensity", min: 1, max: 10 },
      { type: "input", title: "Thought Capture", instruction: "What thought is looping in your mind right now? Write it exactly as your brain is saying it — don't filter.", placeholder: "e.g., 'I'm going to fail and everyone will see...'", fieldKey: "thought" },
      { type: "select", title: "Cognitive Distortion Scan", instruction: "Your thought may contain a thinking trap. These are patterns your brain defaults to under stress. Which one fits?", options: [
        { id: "catastrophizing", label: "Catastrophizing", desc: "Jumping to worst-case scenarios" },
        { id: "mindreading", label: "Mind-Reading", desc: "Assuming what others think of you" },
        { id: "fortunetelling", label: "Fortune-Telling", desc: "Predicting a negative outcome" },
        { id: "allnothing", label: "All-or-Nothing", desc: "Black and white, no middle ground" },
        { id: "filtering", label: "Mental Filtering", desc: "Ignoring the positive, amplifying the negative" },
        { id: "shoulding", label: "Should Statements", desc: "'I should be better, I should have known'" },
      ], fieldKey: "distortion" },
      { type: "input", title: "Balanced Reframe", instruction: "Now write a more balanced version. Not toxic positivity — realistic, grounded truth.", placeholder: "e.g., 'This is hard, but I've handled hard things before...'", fieldKey: "reframe" },
      { type: "input", title: "ACT Values Check", instruction: "If this anxiety wasn't controlling you — what would you do right now that aligns with who you want to be?", placeholder: "e.g., 'I'd prepare calmly and trust my preparation'", fieldKey: "valuesAction" },
    ],
  },
  overwhelmed: {
    title: "Overwhelm Triage",
    basis: "Stress Inoculation + Task Decomposition + DBT",
    icon: "🌊",
    steps: [
      { type: "breathing", title: "System Pause", instruction: "Your nervous system is in overdrive. This extended exhale activates your rest-and-digest response.", breathe: { inhale: 4, hold: 2, exhale: 8 } },
      { type: "input", title: "Brain Dump", instruction: "Write EVERYTHING weighing on you. Don't organize. Don't prioritize. Just dump it out of your head and onto the screen.", placeholder: "Work, relationships, health, money, that email, the thing I forgot...", fieldKey: "brainDump", multiline: true },
      { type: "select", title: "Core Pressure Source", instruction: "From everything you listed — what ONE thing is creating the most pressure?", options: [
        { id: "deadline", label: "A deadline or task", desc: "Something time-bound pressing on you" },
        { id: "conflict", label: "Relationship tension", desc: "Unresolved conflict or difficult conversation" },
        { id: "uncertainty", label: "Uncertainty", desc: "Not knowing what's going to happen" },
        { id: "selfpressure", label: "Self-imposed pressure", desc: "Standards you're holding yourself to" },
        { id: "accumulation", label: "Accumulated load", desc: "Nothing huge — just too many small things" },
      ], fieldKey: "coreWeight" },
      { type: "input", title: "The 2-Minute First Step", instruction: "What is the absolute smallest action you could take on that one thing — something that takes under 2 minutes?", placeholder: "e.g., 'Open the document' or 'Send a one-sentence reply'", fieldKey: "microStep" },
      { type: "input", title: "DBT Radical Acceptance", instruction: "Write one thing you need to accept right now that you cannot change today.", placeholder: "e.g., 'I can't do everything perfectly right now, and that's okay'", fieldKey: "acceptance" },
    ],
  },
  sad: {
    title: "Sadness Processing",
    basis: "Emotion-Focused Therapy + Self-Compassion + MBSR",
    icon: "🌧",
    steps: [
      { type: "breathing", title: "Gentle Landing", instruction: "Sadness deserves space — not suppression. This gentle rhythm helps you stay present without being swept away.", breathe: { inhale: 4, hold: 3, exhale: 5 } },
      { type: "select", title: "Sadness Landscape", instruction: "What shape does this sadness take?", options: [
        { id: "loss", label: "Loss or grief", desc: "Missing someone or something important" },
        { id: "disappointment", label: "Disappointment", desc: "Life didn't meet your expectations" },
        { id: "disconnection", label: "Disconnection", desc: "Feeling cut off from others" },
        { id: "selfworth", label: "Self-doubt", desc: "Questioning your value or worth" },
        { id: "existential", label: "Existential weight", desc: "Life feels heavy or meaningless" },
        { id: "unknown", label: "I don't know", desc: "It's just there — can't name it" },
      ], fieldKey: "sadType" },
      { type: "input", title: "Give It a Voice", instruction: "If your sadness could speak one honest sentence, what would it say?", placeholder: "e.g., 'I just want to feel like I belong somewhere'", fieldKey: "sadVoice" },
      { type: "input", title: "Compassion Response", instruction: "Imagine your closest friend said those exact words to you. What would you say back to them?", placeholder: "e.g., 'You matter more than you realize right now'", fieldKey: "compassion" },
      { type: "select", title: "Mindful Self-Care", instruction: "Choose one gentle action for yourself in the next 30 minutes:", options: [
        { id: "nature", label: "Step outside briefly", desc: "Even 2 minutes of natural light helps" },
        { id: "music", label: "Listen to meaningful music", desc: "Something that lets you feel, not escape" },
        { id: "connect", label: "Reach out to someone", desc: "A text, call, or voice memo" },
        { id: "body", label: "Gentle movement", desc: "Stretching, walking, slow yoga" },
        { id: "rest", label: "Intentional rest", desc: "Not scrolling — actual rest" },
      ], fieldKey: "selfCare" },
    ],
  },
  angry: {
    title: "Anger Processing",
    basis: "DBT + CBT + Motivational Interviewing",
    icon: "🔥",
    steps: [
      { type: "breathing", title: "Cool the Nervous System", instruction: "Anger accelerates everything. This extended exhale pattern will bring your heart rate down without suppressing what you feel.", breathe: { inhale: 4, hold: 4, exhale: 8 } },
      { type: "scale", title: "Anger Intensity", instruction: "How hot is this anger right now?", fieldKey: "intensity", min: 1, max: 10 },
      { type: "input", title: "The Trigger — Just Facts", instruction: "Describe what happened using ONLY observable facts. No interpretations, no assumptions — just what a camera would have recorded.", placeholder: "e.g., 'My coworker presented my idea without mentioning my name'", fieldKey: "trigger" },
      { type: "select", title: "The Need Underneath", instruction: "Anger guards deeper needs. Which one is this anger protecting?", options: [
        { id: "respect", label: "Respect", desc: "You feel dismissed or disrespected" },
        { id: "fairness", label: "Justice", desc: "Something feels profoundly unfair" },
        { id: "autonomy", label: "Autonomy", desc: "Your choices or freedom feel threatened" },
        { id: "boundary", label: "Boundary", desc: "A personal limit was crossed" },
        { id: "safety", label: "Safety", desc: "You feel threatened or vulnerable" },
        { id: "value", label: "Being valued", desc: "Your contributions aren't recognized" },
      ], fieldKey: "need" },
      { type: "input", title: "The Wise Response", instruction: "If you had 48 hours of distance and complete clarity — what would you do about this situation?", placeholder: "e.g., 'Have a calm, direct conversation' or 'Set a clear boundary'", fieldKey: "wiseAction" },
    ],
  },
  numb: {
    title: "Reconnection Protocol",
    basis: "Somatic Experiencing + Polyvagal Theory + MBSR",
    icon: "🧊",
    steps: [
      { type: "breathing", title: "Gentle Activation", instruction: "Numbness is your nervous system's freeze response — it's protecting you. Let's slowly and safely reactivate sensation.", breathe: { inhale: 5, hold: 2, exhale: 5 } },
      { type: "select", title: "Body Scan", instruction: "Where do you notice the most stillness, heaviness, or absence?", options: [
        { id: "chest", label: "Chest / Heart area", desc: "Hollow, heavy, or compressed" },
        { id: "head", label: "Head / Mind", desc: "Foggy, cloudy, or blank" },
        { id: "gut", label: "Stomach / Gut", desc: "Empty, flat, or tight" },
        { id: "limbs", label: "Arms / Legs", desc: "Heavy, distant, or absent" },
        { id: "all", label: "Everywhere", desc: "Full-body disconnection" },
      ], fieldKey: "bodyArea" },
      { type: "input", title: "Last Felt Moment", instruction: "When was the last time you felt something clearly — anything at all? Describe the moment.", placeholder: "e.g., 'I laughed at my dog yesterday morning'", fieldKey: "lastFeeling" },
      { type: "select", title: "Sensory Activation", instruction: "Choose one activity to gently wake up your senses:", options: [
        { id: "cold", label: "Cold water on wrists", desc: "Gentle temperature activation" },
        { id: "music", label: "Emotionally weighted music", desc: "A song with real meaning to you" },
        { id: "move", label: "Slow, intentional movement", desc: "Stretch every muscle deliberately" },
        { id: "scent", label: "Strong scent", desc: "Coffee, citrus, mint — something vivid" },
        { id: "texture", label: "Touch something textured", desc: "Fabric, bark, rough surface" },
      ], fieldKey: "activation" },
      { type: "input", title: "Micro-Anchor", instruction: "Name one person, place, memory, or sensation that usually makes you feel something — anything.", placeholder: "e.g., 'My grandmother's kitchen' or 'Ocean waves'", fieldKey: "anchor" },
    ],
  },
  unmotivated: {
    title: "Behavioral Activation",
    basis: "Behavioral Activation Therapy + Motivational Interviewing",
    icon: "🪫",
    steps: [
      { type: "scale", title: "Energy Level", instruction: "How much energy do you have right now? Be honest — there's no wrong answer.", fieldKey: "energy", min: 1, max: 10 },
      { type: "select", title: "Avoidance Loop", instruction: "What have you been putting off or avoiding?", options: [
        { id: "work", label: "Work / Responsibilities", desc: "Tasks that feel too large or pointless" },
        { id: "health", label: "Health / Self-care", desc: "Exercise, eating well, hygiene" },
        { id: "social", label: "Social connection", desc: "Reaching out, responding, showing up" },
        { id: "creative", label: "Creative projects", desc: "Things that used to spark something" },
        { id: "admin", label: "Life admin", desc: "Bills, appointments, paperwork" },
      ], fieldKey: "avoidance" },
      { type: "input", title: "The 5-Minute Rule", instruction: "Pick ONE thing you're avoiding. What could you do for ONLY 5 minutes? Motivation follows action — not the other way around.", placeholder: "e.g., 'Open the project file' or 'Put on running shoes'", fieldKey: "fiveMin" },
      { type: "input", title: "Commitment Statement", instruction: "Complete this: 'In the next 30 minutes, I will ___'", placeholder: "e.g., '...go for a 10-minute walk'", fieldKey: "commit" },
      { type: "select", title: "Earned Reward", instruction: "After completing your micro-action, what small reward will you give yourself?", options: [
        { id: "rest", label: "Guilt-free rest", desc: "10 minutes of genuine nothing" },
        { id: "treat", label: "A small treat", desc: "Coffee, snack, something nice" },
        { id: "play", label: "Entertainment", desc: "An episode, a game, music" },
        { id: "social", label: "Social connection", desc: "Text someone, call a friend" },
      ], fieldKey: "reward" },
    ],
  },
  lonely: {
    title: "Connection Protocol",
    basis: "Interpersonal Therapy (IPT) + Attachment Theory",
    icon: "🌑",
    steps: [
      { type: "breathing", title: "Centering", instruction: "Loneliness is a biological signal — as real as hunger. It means your brain is telling you connection matters. Let's honor that.", breathe: { inhale: 4, hold: 3, exhale: 5 } },
      { type: "select", title: "Loneliness Pattern", instruction: "What kind of loneliness is this? Each type has a different path forward.", options: [
        { id: "conflict", label: "Conflict-driven", desc: "Tension with someone important has created distance" },
        { id: "transition", label: "Life transition", desc: "A change (move, job, breakup) disrupted your connections" },
        { id: "grief", label: "Grief-based", desc: "Missing someone who is gone" },
        { id: "chronic", label: "Chronic deficit", desc: "You don't feel you have enough close connections" },
        { id: "hidden", label: "Hidden loneliness", desc: "Surrounded by people but still feel alone" },
      ], fieldKey: "type" },
      { type: "input", title: "Who Feels Distant?", instruction: "Name one person you wish you felt closer to right now.", placeholder: "A name or relationship — 'my sister', 'my old friend Marcus'", fieldKey: "person" },
      { type: "input", title: "Micro-Outreach", instruction: "What is one small, low-pressure way you could reach out today? Not a big gesture — just a signal.", placeholder: "e.g., 'Send a meme' or 'Reply to their story' or 'Text: thinking of you'", fieldKey: "outreach" },
      { type: "input", title: "Self-Validation", instruction: "Complete this: 'Even when I feel alone, I know that I ___'", placeholder: "e.g., '...am worthy of deep connection'", fieldKey: "validation" },
    ],
  },
  stressed: {
    title: "Stress Inoculation",
    basis: "CBT-Stress + Progressive Muscle Relaxation + ACT",
    icon: "⏰",
    steps: [
      { type: "breathing", title: "Physiological Sigh", instruction: "The physiological sigh (double inhale + long exhale) is the fastest known way to reduce stress in real-time. Discovered by Stanford neuroscientist Andrew Huberman.", breathe: { inhale: 3, hold: 1, exhale: 7 } },
      { type: "scale", title: "Stress Level", instruction: "How stressed do you feel right now?", fieldKey: "stressLevel", min: 1, max: 10 },
      { type: "input", title: "Stress Inventory", instruction: "List the top 3 things causing stress right now. Be specific.", placeholder: "1. Project deadline Friday\n2. Haven't exercised in a week\n3. Difficult conversation I'm avoiding", fieldKey: "stressors", multiline: true },
      { type: "select", title: "Control Assessment", instruction: "Of the things you listed — how much is within your control?", options: [
        { id: "mostly", label: "Mostly in my control", desc: "I can act on most of these" },
        { id: "partially", label: "Partially in my control", desc: "Some I can influence, some I can't" },
        { id: "little", label: "Little control", desc: "Most are external pressures" },
        { id: "none", label: "Almost no control", desc: "I'm reacting to forces outside me" },
      ], fieldKey: "control" },
      { type: "input", title: "One Controllable Action", instruction: "Focus on ONE thing you CAN control. What action would reduce your stress the most?", placeholder: "e.g., 'Block 2 hours to finish the draft'", fieldKey: "action" },
      { type: "input", title: "ACT Defusion", instruction: "Rewrite your most stressful thought starting with: 'I notice I'm having the thought that...'", placeholder: "e.g., 'I notice I'm having the thought that I won't finish in time'", fieldKey: "defusion" },
    ],
  },
  fine: {
    title: "Mental Gym — Daily Optimization",
    basis: "Positive Psychology + Identity-Based Habits + ACT Values",
    icon: "☀️",
    steps: [
      { type: "input", title: "Gratitude Anchor", instruction: "Name one specific moment from today or yesterday you're grateful for. Specificity is key — not 'family' but the exact moment.", placeholder: "e.g., 'My daughter laughing at breakfast this morning'", fieldKey: "gratitude" },
      { type: "input", title: "Identity Statement", instruction: "Complete: 'I am the kind of person who ___'", placeholder: "e.g., '...keeps going even when it's uncomfortable'", fieldKey: "identity" },
      { type: "input", title: "Future-Self Letter", instruction: "Your best self, one year from today, is looking back. What do they want you to do TODAY?", placeholder: "e.g., 'Stay disciplined. The compound effect is real.'", fieldKey: "futureSelf" },
      { type: "input", title: "Micro-Habit", instruction: "What's one 2-minute habit you'll practice today?", placeholder: "e.g., 'Read one page' or 'Do 10 pushups' or '2 min meditation'", fieldKey: "habit" },
      { type: "select", title: "Today's Compass Word", instruction: "If one word guided every decision today, what would it be?", options: [
        { id: "discipline", label: "Discipline", desc: "Structured, focused execution" },
        { id: "presence", label: "Presence", desc: "Being fully here, right now" },
        { id: "courage", label: "Courage", desc: "Doing the thing that scares you" },
        { id: "kindness", label: "Kindness", desc: "Gentleness with yourself and others" },
        { id: "growth", label: "Growth", desc: "Learning and stretching" },
      ], fieldKey: "compass" },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════
// WEB AUDIO — BREATHING GUIDE TONES (174Hz Solfeggio)
// ═══════════════════════════════════════════════════════════════
function useBreathingAudio() {
  const ctxRef = useRef(null);
  const gainRef = useRef(null);
  const init = useCallback(() => {
    if (ctxRef.current) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 174;
      gain.gain.value = 0;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      ctxRef.current = ctx;
      gainRef.current = gain;
    } catch {}
  }, []);
  const fadeIn = useCallback((dur) => {
    if (!gainRef.current || !ctxRef.current) return;
    const now = ctxRef.current.currentTime;
    gainRef.current.gain.cancelScheduledValues(now);
    gainRef.current.gain.setValueAtTime(gainRef.current.gain.value, now);
    gainRef.current.gain.linearRampToValueAtTime(0.12, now + dur);
  }, []);
  const fadeOut = useCallback((dur) => {
    if (!gainRef.current || !ctxRef.current) return;
    const now = ctxRef.current.currentTime;
    gainRef.current.gain.cancelScheduledValues(now);
    gainRef.current.gain.setValueAtTime(gainRef.current.gain.value, now);
    gainRef.current.gain.linearRampToValueAtTime(0, now + dur);
  }, []);
  const stop = useCallback(() => {
    if (gainRef.current && ctxRef.current) gainRef.current.gain.setValueAtTime(0, ctxRef.current.currentTime);
  }, []);
  return { init, fadeIn, fadeOut, stop };
}

// ═══════════════════════════════════════════════════════════════
// BREATHING EXERCISE COMPONENT
// ═══════════════════════════════════════════════════════════════
function BreathingExercise({ config, onComplete, theme }) {
  const [phase, setPhase] = useState("ready");
  const [count, setCount] = useState(0);
  const [cycle, setCycle] = useState(0);
  const audio = useBreathingAudio();
  const totalCycles = 3;
  useEffect(() => {
    if (phase === "ready") return;
    if (cycle >= totalCycles) { audio.stop(); onComplete(); return; }
    if (phase === "inhale") audio.fadeIn(config.inhale * 0.8);
    else if (phase === "exhale") audio.fadeOut(config.exhale * 0.8);
    const totalSec = config[phase];
    setCount(0);
    const ci = setInterval(() => setCount((c) => Math.min(c + 1, totalSec)), 1000);
    const t = setTimeout(() => {
      clearInterval(ci);
      if (phase === "inhale") setPhase("hold");
      else if (phase === "hold") setPhase("exhale");
      else { setCycle((c) => c + 1); setPhase("inhale"); }
    }, totalSec * 1000);
    return () => { clearTimeout(t); clearInterval(ci); };
  }, [phase, cycle]);
  const sz = phase === "inhale" ? 200 : phase === "hold" ? 200 : 120;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
      {phase === "ready" ? (
        <button onClick={() => { audio.init(); setPhase("inhale"); }} style={{
          padding: "16px 48px", fontSize: 17, fontFamily: "'DM Sans', sans-serif",
          background: theme.text, color: theme.bg, border: "none", borderRadius: 50,
          cursor: "pointer", letterSpacing: 1, transition: "all 0.3s",
        }}>Begin Breathing</button>
      ) : (
        <>
          <div style={{ position: "relative", width: 220, height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{
              width: sz, height: sz, borderRadius: "50%",
              background: `radial-gradient(circle, rgba(${theme.breathe},0.35) 0%, rgba(${theme.breathe},0.05) 100%)`,
              transition: "all 1.8s ease-in-out",
              display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
              boxShadow: `0 0 ${sz/3}px rgba(${theme.breathe},0.15)`,
            }}>
              <span style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 3, color: theme.accent, fontWeight: 600 }}>
                {phase === "inhale" ? "Breathe In" : phase === "hold" ? "Hold" : "Release"}
              </span>
              <span style={{ fontSize: 36, fontWeight: 300, color: theme.text, marginTop: 4 }}>{count}</span>
            </div>
          </div>
          <span style={{ fontSize: 12, color: theme.accent, opacity: 0.7, letterSpacing: 1 }}>
            Cycle {Math.min(cycle + 1, totalCycles)} / {totalCycles}
          </span>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// WEBLLM AI ENGINE — FREE, PRIVATE, NO API KEYS
// Runs entirely in user's browser via WebGPU
// Falls back to intelligent rule-based system when unavailable
// ═══════════════════════════════════════════════════════════════
const CLINICAL_SYSTEM_PROMPT = `You are the AI engine behind AIForj — a mental wellness platform built by a Board Certified Psychiatric Mental Health Nurse Practitioner. You provide evidence-based, personalized micro-guidance.

CRITICAL RULES:
- You are NOT a therapist. You are a wellness companion providing psychoeducation and self-help techniques.
- NEVER diagnose conditions or suggest medication.
- Draw from CBT, DBT, ACT, Interpersonal Therapy, Behavioral Activation, MBSR, and Positive Psychology.
- Be warm, direct, knowledgeable — like a brilliant friend who happens to have clinical training.
- Keep responses under 200 words. Use 2-3 short paragraphs.
- End with ONE specific, actionable takeaway the person can do in the next 10 minutes.
- If anything suggests crisis or self-harm, immediately provide 988 Suicide & Crisis Lifeline (call or text 988).
- Use the person's actual words from their session to personalize the response.
- Reference the specific therapeutic technique you're drawing from.
- Never use clinical jargon without explaining it simply.`;

// Intelligent rule-based fallback when WebLLM isn't available
function generateFallbackInsight(emotion, responses, protocol) {
  const distortionAdvice = {
    catastrophizing: "Your mind jumped to the worst case — a pattern called catastrophizing. Research shows that less than 10% of our worst fears actually materialize. Try asking yourself: 'What's the MOST LIKELY outcome?' rather than the worst one.",
    mindreading: "You're assuming you know what others think — that's mind-reading, one of the most common cognitive distortions. The truth is, we're usually wrong about others' thoughts. Consider: 'What evidence do I actually have for this belief?'",
    fortunetelling: "You're predicting a negative future — fortune-telling. But your brain isn't a crystal ball. Studies show our negative predictions are wrong far more often than they're right. Focus on what you can control right now.",
    allnothing: "You're seeing this in all-or-nothing terms. Life rarely operates in absolutes. Where's the middle ground here? Most situations have a spectrum of outcomes.",
    filtering: "You're filtering out the positive and zooming in on the negative. This is called mental filtering. Try this: name three things that went well today, even small ones.",
    shoulding: "Those 'should' statements are creating unnecessary pressure. Replace 'I should' with 'I choose to' or 'I'd prefer to' — it shifts the energy from obligation to intention.",
  };

  const emotionInsights = {
    anxious: (r) => {
      const distortion = r.distortion?.id;
      const base = distortionAdvice[distortion] || "You identified a thought pattern driving your anxiety — that awareness alone is a powerful first step.";
      const reframe = r.reframe ? `\n\nYour reframe — "${r.reframe}" — shows real cognitive flexibility. That's exactly how CBT works: you're not denying the difficulty, you're finding a more balanced truth.` : "";
      const action = r.valuesAction ? `\n\nYour next step: ${r.valuesAction}. Do it within the next 10 minutes while this clarity is fresh.` : "\n\nYour next step: take one small action that aligns with who you want to be, not what your anxiety dictates.";
      return base + reframe + action;
    },
    overwhelmed: (r) => {
      let out = "You just externalized everything weighing on you — that alone reduces cognitive load. Research shows that writing down worries decreases their emotional impact by up to 20%.";
      if (r.microStep) out += `\n\nYour chosen first step — "${r.microStep}" — is perfect. The key insight from behavioral science: starting is always harder than continuing. Once you begin, momentum builds naturally.`;
      if (r.acceptance) out += `\n\nYour radical acceptance statement shows emotional maturity. DBT teaches us that fighting reality creates suffering — accepting it creates space to act wisely.`;
      out += "\n\nDo your micro-step right now. Set a 2-minute timer if it helps.";
      return out;
    },
    sad: (r) => {
      let out = "Sadness is not a problem to fix — it's information to listen to.";
      if (r.sadVoice) out += ` Your sadness said: "${r.sadVoice}" — that's deeply honest. Naming the feeling precisely is what emotion-focused therapy calls 'emotional granularity,' and it naturally reduces its intensity.`;
      if (r.compassion) out += `\n\n"${r.compassion}" — you already know the compassionate response. The challenge is applying it to yourself with the same warmth you'd give a friend. Self-compassion isn't weakness; Kristin Neff's research shows it builds resilience.`;
      out += "\n\nYour next step: do the kind act you chose for yourself. You've earned it.";
      return out;
    },
    angry: (r) => {
      let out = "You separated the facts from your interpretation — that's a core DBT skill called 'checking the facts.' Most anger escalation happens when we merge what happened with what we think it means.";
      if (r.need) out += `\n\nYou identified that this anger is protecting your need for ${r.need.label?.toLowerCase()}. That's not irrational — it's deeply human. The question isn't whether the need is valid (it is), but whether your response serves that need effectively.`;
      if (r.wiseAction) out += `\n\nYour wise response: "${r.wiseAction}". This is your clarity speaking. Act on it when the emotional intensity drops below a 5/10 — that's when your prefrontal cortex can lead instead of your amygdala.`;
      return out;
    },
    numb: (r) => {
      let out = "Numbness is your nervous system's freeze response — it's not apathy, it's protection. Polyvagal theory tells us this happens when the system perceives overwhelm it can't fight or flee from. It's actually adaptive.";
      if (r.lastFeeling) out += `\n\nYou remembered feeling something: "${r.lastFeeling}". That memory is proof your emotional range is intact — it's just temporarily offline. The pathway back is through gentle, controlled sensory input.`;
      if (r.anchor) out += `\n\nYour anchor — "${r.anchor}" — is your reconnection point. Spend 60 seconds visualizing it in detail: the sounds, the light, the feeling. Sensory imagination activates the same neural pathways as real experience.`;
      return out;
    },
    unmotivated: (r) => {
      let out = `Your energy is at ${r.energy || "low"}/10. That's your starting point — not your ceiling. Behavioral activation research shows that action precedes motivation, not the other way around. You don't need to feel motivated to begin.`;
      if (r.fiveMin) out += `\n\n"${r.fiveMin}" — that's your 5-minute contract with yourself. The science is clear: once you start a task, your brain releases dopamine that sustains effort. The hardest part is literally just the first 30 seconds.`;
      if (r.commit) out += `\n\nYour commitment: "${r.commit}". Say it out loud. Research on implementation intentions shows that stating when and what you'll do doubles your follow-through rate.`;
      return out;
    },
    lonely: (r) => {
      let out = "Loneliness activates the same brain regions as physical pain — it's not 'just a feeling.' Your brain is telling you that connection is a survival need, and it's right.";
      if (r.type) out += ` You identified this as ${r.type.label?.toLowerCase()} loneliness — knowing the type shapes the solution.`;
      if (r.outreach) out += `\n\nYour outreach plan — "${r.outreach}" — is exactly the right scale. IPT research shows that small, consistent bids for connection rebuild attachment far more effectively than grand gestures.`;
      if (r.validation) out += `\n\nYour self-validation: "${r.validation}". Hold onto that. Send your outreach message within the next 10 minutes — before the inner critic talks you out of it.`;
      return out;
    },
    stressed: (r) => {
      let out = "You inventoried your stressors and assessed your control — that's stress inoculation in action. Separating controllables from uncontrollables is the single most effective cognitive strategy for stress reduction.";
      if (r.defusion) out += `\n\n"${r.defusion}" — that ACT defusion technique creates psychological distance between you and the thought. You're not eliminating the stress; you're changing your relationship to it. That shift is where freedom lives.`;
      if (r.action) out += `\n\nYour one controllable action: "${r.action}". Do it now. When you act on what you can control, your brain's threat-detection system (the amygdala) calms down because you've demonstrated agency.`;
      return out;
    },
    fine: (r) => {
      let out = "Showing up when you feel fine is what separates people who manage their mental health from people who build mental fitness. This is your competitive edge.";
      if (r.identity) out += `\n\n"I am the kind of person who ${r.identity?.replace(/^\.\.\./, '')}" — identity-based habit research by James Clear shows this is the most powerful driver of sustained behavior change. Every action you take today either reinforces or contradicts this statement.`;
      if (r.futureSelf) out += `\n\nYour future self wants you to: "${r.futureSelf}". Research on 'future-self continuity' shows that people who feel connected to their future selves make dramatically better decisions in the present.`;
      out += "\n\nDo your micro-habit right now. Two minutes. Go.";
      return out;
    },
  };

  const fn = emotionInsights[emotion];
  return fn ? fn(responses) : "Session complete. Reflect on what you wrote — your own words contain more wisdom than you might realize.";
}

// WebLLM Engine Manager
function useWebLLM() {
  const engineRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle, loading, ready, error, unsupported
  const [loadProgress, setLoadProgress] = useState(0);

  const initialize = useCallback(async () => {
    if (engineRef.current || status === "loading") return;

    // Check WebGPU support
    if (!navigator.gpu) {
      setStatus("unsupported");
      return;
    }

    setStatus("loading");
    try {
      const webllm = await import("https://esm.run/@mlc-ai/web-llm");
      const engine = new webllm.MLCEngine();
      engine.setInitProgressCallback((progress) => {
        setLoadProgress(Math.round((progress.progress || 0) * 100));
      });
      await engine.reload(CONFIG.WEBLLM_MODEL);
      engineRef.current = engine;
      setStatus("ready");
    } catch (e) {
      console.warn("WebLLM initialization failed, using fallback:", e);
      setStatus("error");
    }
  }, [status]);

  const generate = useCallback(async (systemPrompt, userMessage) => {
    if (!engineRef.current) return null;
    try {
      const reply = await engineRef.current.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });
      return reply.choices?.[0]?.message?.content || null;
    } catch (e) {
      console.warn("WebLLM generation failed:", e);
      return null;
    }
  }, []);

  return { status, loadProgress, initialize, generate };
}

// ═══════════════════════════════════════════════════════════════
// AI INSIGHT COMPONENT — WebLLM with intelligent fallback
// ═══════════════════════════════════════════════════════════════
function AIInsight({ emotion, responses, protocol, theme, isPremium, onUpgrade, webllm }) {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState(""); // "ai" or "clinical"
  const ran = useRef(false);

  useEffect(() => {
    if (!isPremium || ran.current) { setLoading(false); return; }
    ran.current = true;

    const responsesSummary = Object.entries(responses).map(([key, val]) => {
      const step = protocol.steps.find((s) => s.fieldKey === key);
      const display = typeof val === "object" ? `${val.label} (${val.desc})` : val;
      return step ? `${step.title}: ${display}` : "";
    }).filter(Boolean).join("\n");

    const userMsg = `The user completed a "${protocol.title}" session (based on ${protocol.basis}).
Emotion: ${emotion}. Their responses:
${responsesSummary}
Provide a personalized, evidence-based reflection and one actionable insight using their own words.`;

    (async () => {
      // Try WebLLM first
      if (webllm.status === "ready") {
        const aiResult = await webllm.generate(CLINICAL_SYSTEM_PROMPT, userMsg);
        if (aiResult) {
          setInsight(aiResult);
          setSource("ai");
          setLoading(false);
          return;
        }
      }
      // Fallback to rule-based clinical engine
      const fallback = generateFallbackInsight(emotion, responses, protocol);
      setInsight(fallback);
      setSource("clinical");
      setLoading(false);
    })();
  }, []);

  // Free user — show locked teaser
  if (!isPremium) {
    return (
      <div style={{
        background: theme.subtle, borderRadius: 20, padding: 28, marginBottom: 28,
        border: `1px dashed rgba(${theme.breathe},0.2)`, cursor: "pointer", position: "relative", overflow: "hidden",
      }} onClick={onUpgrade}>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 0%, ${theme.bg} 85%)`, zIndex: 1 }} />
        <div style={{ position: "relative", zIndex: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 18 }}>🧠</span>
            <span style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 2, color: theme.accent, fontWeight: 600 }}>AI Personalized Insight</span>
          </div>
          <div style={{ fontSize: 14, color: theme.text, opacity: 0.3, lineHeight: 1.7 }}>
            Based on your session responses, a personalized analysis drawing from {protocol.basis} would appear here — tailored specifically to your words, patterns, and emotional state...
          </div>
        </div>
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", marginTop: -8 }}>
          <button style={{
            padding: "12px 32px", fontSize: 14, fontFamily: "'DM Sans', sans-serif",
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.text})`, color: theme.bg,
            border: "none", borderRadius: 50, cursor: "pointer", letterSpacing: 0.5, fontWeight: 500,
          }}>
            ✦ Unlock AI Insights — $9.99/mo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: theme.subtle, borderRadius: 20, padding: 28, marginBottom: 28,
      border: `1px solid rgba(${theme.breathe},0.1)`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: theme.accent, animation: loading ? "pulse 1.5s infinite" : "none" }} />
        <span style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 2, color: theme.accent, fontWeight: 600 }}>
          {loading ? "Analyzing your session..." : source === "ai" ? "AI Personalized Insight ✦" : "Clinical Insight ✦"}
        </span>
      </div>
      {loading ? (
        <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
          {[80, 100, 60].map((w, i) => (
            <div key={i} style={{ height: 14, width: `${w}%`, background: `rgba(${theme.breathe},0.1)`, borderRadius: 7, animation: `pulse 1.5s infinite ${i * 0.2}s` }} />
          ))}
        </div>
      ) : (
        <div style={{ fontSize: 15, lineHeight: 1.8, color: theme.text, whiteSpace: "pre-wrap" }}>{insight}</div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PREMIUM JOURNAL — Daily reflective writing (premium feature)
// ═══════════════════════════════════════════════════════════════
function JournalEntry({ theme, onClose }) {
  const [entry, setEntry] = useState("");
  const [saved, setSaved] = useState(false);
  const [prompt] = useState(() => {
    const prompts = [
      "What's one thing you're carrying today that you haven't said out loud?",
      "Write to your future self — what do they need to hear from you today?",
      "What emotion keeps showing up this week? What might it be trying to tell you?",
      "Describe a moment recently when you felt fully like yourself.",
      "What boundary do you need to set but haven't yet? What's stopping you?",
      "If you could release one thought pattern, which would it be?",
      "What are you avoiding? What would happen if you faced it gently?",
      "Write about someone who shaped you without knowing it.",
      "What does 'enough' look like for you today?",
      "If your body could talk right now, what would it say?",
    ];
    return prompts[Math.floor(Math.random() * prompts.length)];
  });

  const save = async () => {
    if (!entry.trim()) return;
    const journals = (await Storage.get("journals")) || [];
    journals.push({ entry, prompt, timestamp: Date.now() });
    await Storage.set("journals", journals);
    setSaved(true);
  };

  return (
    <div style={{ animation: "fadeIn 0.6s ease", maxWidth: 560, margin: "0 auto", padding: "0 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 400, color: theme.text, margin: 0 }}>Daily Journal</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 14, color: theme.accent, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
      </div>

      <div style={{ background: theme.subtle, borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: theme.accent, fontWeight: 600, display: "block", marginBottom: 8 }}>Today's Prompt</span>
        <p style={{ fontSize: 17, color: theme.text, lineHeight: 1.6, margin: 0, fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>{prompt}</p>
      </div>

      {saved ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <span style={{ fontSize: 40, display: "block", marginBottom: 12 }}>✓</span>
          <p style={{ fontSize: 16, color: theme.text }}>Journal entry saved.</p>
          <p style={{ fontSize: 13, color: theme.accent, opacity: 0.6 }}>Consistent reflection builds self-awareness over time.</p>
        </div>
      ) : (
        <>
          <textarea value={entry} onChange={(e) => setEntry(e.target.value)} rows={8}
            placeholder="Write freely. No one sees this but you..."
            style={{
              width: "100%", padding: 24, fontSize: 15, fontFamily: "'DM Sans', sans-serif",
              border: `1px solid rgba(${theme.breathe},0.15)`, borderRadius: 16,
              background: theme.card, color: theme.text, resize: "vertical", lineHeight: 1.7,
              backdropFilter: "blur(10px)", boxSizing: "border-box",
            }} />
          <button onClick={save} disabled={!entry.trim()} style={{
            marginTop: 16, padding: "14px 40px", fontSize: 15, fontFamily: "'DM Sans', sans-serif",
            background: entry.trim() ? theme.text : `rgba(${theme.breathe},0.15)`,
            color: entry.trim() ? theme.bg : `rgba(${theme.breathe},0.4)`,
            border: "none", borderRadius: 50, cursor: entry.trim() ? "pointer" : "not-allowed",
            letterSpacing: 1, width: "100%",
          }}>Save Entry</button>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MOOD DASHBOARD — Analytics, streaks, patterns (premium)
// ═══════════════════════════════════════════════════════════════
function MoodDashboard({ sessions, theme, onClose }) {
  const moodMap = { anxious: 3, overwhelmed: 3, sad: 2, angry: 4, numb: 1, unmotivated: 2, lonely: 2, stressed: 4, fine: 8 };
  const chartData = sessions.map((s, i) => ({
    session: i + 1,
    mood: moodMap[s.emotion] || 5,
    label: s.emotion,
    time: new Date(s.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));
  const emotionCounts = {};
  sessions.forEach((s) => { emotionCounts[s.emotion] = (emotionCounts[s.emotion] || 0) + 1; });

  // Streak calculation
  const uniqueDays = [...new Set(sessions.map((s) => new Date(s.timestamp).toDateString()))];
  const streak = uniqueDays.length;

  // Most common emotion
  const topEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div style={{ animation: "fadeIn 0.6s ease", maxWidth: 600, margin: "0 auto", padding: "0 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 400, color: theme.text, margin: 0 }}>Your Journey</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 14, color: theme.accent, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
        {[
          { val: sessions.length, label: "Sessions" },
          { val: `${streak}d`, label: "Streak" },
          { val: Object.keys(emotionCounts).length, label: "Explored" },
        ].map((s) => (
          <div key={s.label} style={{ background: theme.card, borderRadius: 16, padding: 18, textAlign: "center", backdropFilter: "blur(10px)" }}>
            <span style={{ fontSize: 28, fontWeight: 300, color: theme.text, display: "block" }}>{s.val}</span>
            <span style={{ fontSize: 11, color: theme.accent, letterSpacing: 1, textTransform: "uppercase" }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Mood chart */}
      {chartData.length > 1 && (
        <div style={{ background: theme.card, borderRadius: 20, padding: 24, marginBottom: 20, backdropFilter: "blur(10px)", border: `1px solid rgba(${theme.breathe},0.1)` }}>
          <span style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 2, color: theme.accent, fontWeight: 600 }}>Mood Trend</span>
          <div style={{ height: 180, marginTop: 16 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.accent} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={theme.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: theme.accent }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: theme.accent }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: theme.bg, border: `1px solid ${theme.accent}`, borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="mood" stroke={theme.accent} fill="url(#mg)" strokeWidth={2} dot={{ r: 3, fill: theme.accent }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Pattern map */}
      <div style={{ background: theme.card, borderRadius: 16, padding: 20, marginBottom: 20, backdropFilter: "blur(10px)" }}>
        <span style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 2, color: theme.accent, fontWeight: 600, display: "block", marginBottom: 12 }}>Pattern Map</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {Object.entries(emotionCounts).sort((a, b) => b[1] - a[1]).map(([emo, count]) => {
            const e = EMOTIONS.find((x) => x.id === emo);
            return (
              <span key={emo} style={{ padding: "6px 14px", background: theme.subtle, borderRadius: 20, fontSize: 13, color: theme.text }}>
                {e?.icon} {e?.label} × {count}
              </span>
            );
          })}
        </div>
      </div>

      {/* Weekly insight */}
      {topEmotion && (
        <div style={{ background: theme.subtle, borderRadius: 16, padding: 20, border: `1px solid rgba(${theme.breathe},0.1)` }}>
          <span style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 2, color: theme.accent, fontWeight: 600, display: "block", marginBottom: 8 }}>Insight</span>
          <p style={{ fontSize: 14, color: theme.text, lineHeight: 1.7, margin: 0 }}>
            Your most visited emotion is <strong>{EMOTIONS.find((e) => e.id === topEmotion[0])?.label}</strong> ({topEmotion[1]} sessions).
            {topEmotion[0] === "fine" ? " You're consistently investing in mental fitness — that's exceptional." :
             ` Tracking this pattern helps you understand your triggers and build targeted resilience.`}
          </p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STRIPE PAYMENT INTEGRATION
// ═══════════════════════════════════════════════════════════════
async function initiateStripeCheckout() {
  try {
    const res = await fetch('/api/create-checkout-session', { method: 'POST' });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
    return false; // Don't activate premium locally — Stripe redirect handles it
  } catch (e) {
    console.error('Checkout error:', e);
    alert('Unable to start checkout. Please try again.');
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════
// MAIN APPLICATION
// ═══════════════════════════════════════════════════════════════
export default function AIForj() {
  const [screen, setScreen] = useState("home");
  const [emotion, setEmotion] = useState(null);
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [inputVal, setInputVal] = useState("");
  const [scaleVal, setScaleVal] = useState(5);
  const [selected, setSelected] = useState(null);
  const [breathDone, setBreathDone] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [fadeKey, setFadeKey] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const webllm = useWebLLM();
  const theme = COLOR_THEMES[emotion] || COLOR_THEMES.default;
  const protocol = emotion ? PROTOCOLS[emotion] : null;
  const currentStep = protocol?.steps[step];

  // Load persisted data on mount
  useEffect(() => {
    (async () => {
      const saved = await Storage.get("sessions");
      if (saved?.length) setSessions(saved);
      const prem = await Storage.get("premium");
      if (prem) setIsPremium(true);
      setDataLoaded(true);
    })();
  }, []);

  // Persist sessions
  useEffect(() => {
    if (dataLoaded && sessions.length > 0) Storage.set("sessions", sessions);
  }, [sessions, dataLoaded]);

  // Initialize WebLLM for premium users (background load)
  useEffect(() => {
    if (isPremium && webllm.status === "idle") webllm.initialize();
  }, [isPremium, webllm.status]);

  const selectEmotion = (id) => {
    setEmotion(id); setScreen("session"); setStep(0); setResponses({});
    setInputVal(""); setSelected(null); setScaleVal(5); setBreathDone(false);
    setFadeKey((k) => k + 1);
  };

  const next = () => {
    if (currentStep) {
      const nr = { ...responses };
      if (currentStep.type === "input") nr[currentStep.fieldKey] = inputVal;
      else if (currentStep.type === "select") nr[currentStep.fieldKey] = selected;
      else if (currentStep.type === "scale") nr[currentStep.fieldKey] = scaleVal;
      setResponses(nr);
    }
    if (step < protocol.steps.length - 1) {
      setStep((s) => s + 1);
      setInputVal(""); setSelected(null); setScaleVal(5); setBreathDone(false);
      setFadeKey((k) => k + 1);
    } else {
      const fr = { ...responses };
      if (currentStep?.type === "input") fr[currentStep.fieldKey] = inputVal;
      else if (currentStep?.type === "select") fr[currentStep.fieldKey] = selected;
      else if (currentStep?.type === "scale") fr[currentStep.fieldKey] = scaleVal;
      setResponses(fr);
      setSessions((s) => [...s, { emotion, responses: fr, timestamp: Date.now() }]);
      setScreen("summary"); setFadeKey((k) => k + 1);
    }
  };

  const canProceed = () => {
    if (!currentStep) return false;
    if (currentStep.type === "breathing") return breathDone;
    if (currentStep.type === "input") return inputVal.trim().length > 0;
    if (currentStep.type === "select") return selected !== null;
    if (currentStep.type === "scale") return true;
    return false;
  };

  const reset = () => {
    setScreen("home"); setEmotion(null); setStep(0); setResponses({});
    setInputVal(""); setSelected(null); setScaleVal(5); setBreathDone(false);
    setFadeKey((k) => k + 1);
  };

  const handleSubscribe = async () => {
    await initiateStripeCheckout();
    // User gets redirected to Stripe Checkout
    // Premium is activated on /success page after payment
  };

  // ─── Premium Upgrade Modal ───
  const PremiumModal = () => (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
      animation: "fadeIn 0.3s ease", padding: 24,
    }} onClick={() => setShowUpgrade(false)}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: theme.bg, borderRadius: 24, padding: "40px 32px", maxWidth: 440, width: "100%",
        boxShadow: "0 24px 80px rgba(0,0,0,0.15)", position: "relative",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <button onClick={() => setShowUpgrade(false)} style={{
          position: "absolute", top: 16, right: 20, background: "none", border: "none",
          fontSize: 20, color: theme.accent, cursor: "pointer", opacity: 0.5,
        }}>×</button>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <span style={{ fontSize: 36, display: "block", marginBottom: 8 }}>✦</span>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 400, color: theme.text, margin: "0 0 8px" }}>
            AIForj Premium
          </h3>
          <p style={{ fontSize: 14, color: theme.accent, opacity: 0.7, margin: 0, lineHeight: 1.5 }}>
            Your personal mental wellness system.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {[
            { icon: "🧠", title: "AI Personalized Insights", desc: "Deep analysis of your patterns using your own words — powered by private, on-device AI" },
            { icon: "📊", title: "Mood Analytics Dashboard", desc: "Track emotional patterns, streaks, and progress over time" },
            { icon: "📓", title: "Daily Guided Journal", desc: "Clinician-crafted prompts for deeper self-reflection" },
            { icon: "📋", title: "Full Session History", desc: "Review and reflect on all past sessions with persistent storage" },
            { icon: "🔓", title: "Advanced Protocols", desc: "Extended therapeutic flows with deeper interventions" },
            { icon: "🔒", title: "Complete Privacy", desc: "AI runs entirely on your device — your thoughts never leave your browser" },
          ].map((f) => (
            <div key={f.title} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 14px", background: theme.subtle, borderRadius: 14 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{f.icon}</span>
              <div>
                <span style={{ fontSize: 13, fontWeight: 500, color: theme.text, display: "block" }}>{f.title}</span>
                <span style={{ fontSize: 11, color: theme.accent, opacity: 0.7 }}>{f.desc}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <button onClick={handleSubscribe} style={{
            padding: "16px 48px", fontSize: 16, fontFamily: "'DM Sans', sans-serif",
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.text})`,
            color: theme.bg, border: "none", borderRadius: 50,
            cursor: "pointer", letterSpacing: 0.5, width: "100%", marginBottom: 8, fontWeight: 500,
          }}>
            Start Premium — $9.99/month
          </button>
          <p style={{ fontSize: 11, color: theme.accent, opacity: 0.4, margin: "8px 0 0" }}>Cancel anytime. 7-day free trial. Your wellness, your terms.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: theme.text,
      background: theme.bg, transition: "background 0.8s ease, color 0.8s ease",
      position: "relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        textarea:focus, input[type="text"]:focus { outline: none; border-color: ${theme.accent} !important; }
        input[type="range"] { accent-color: ${theme.accent}; }
        ::selection { background: rgba(${theme.breathe},0.2); }
        * { box-sizing: border-box; }
      `}</style>

      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", transition: "all 1s ease",
        background: `radial-gradient(ellipse at 20% 50%, rgba(${theme.breathe},0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(${theme.breathe},0.04) 0%, transparent 50%)`,
      }} />

      {showUpgrade && <PremiumModal />}

      {/* WebLLM loading indicator for premium users */}
      {isPremium && webllm.status === "loading" && (
        <div style={{
          position: "fixed", bottom: 20, right: 20, background: theme.card, backdropFilter: "blur(12px)",
          borderRadius: 16, padding: "12px 20px", zIndex: 50, border: `1px solid rgba(${theme.breathe},0.15)`,
          display: "flex", alignItems: "center", gap: 12, animation: "fadeIn 0.3s ease",
        }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: theme.accent, animation: "pulse 1s infinite" }} />
          <div>
            <span style={{ fontSize: 12, color: theme.text, fontWeight: 500, display: "block" }}>Loading AI Engine</span>
            <span style={{ fontSize: 11, color: theme.accent, opacity: 0.7 }}>{webllm.loadProgress}% — runs privately on your device</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header style={{ padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 10 }}>
        <div onClick={reset} style={{ cursor: "pointer", display: "flex", alignItems: "baseline", gap: 1 }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 500, color: theme.text }}>AI</span>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 500, color: theme.accent }}>Forj</span>
          {isPremium && <span style={{ fontSize: 9, marginLeft: 6, padding: "2px 8px", background: theme.accent, color: theme.bg, borderRadius: 10, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>PRO</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {isPremium && (
            <button onClick={() => { setScreen("journal"); setFadeKey((k) => k + 1); }} style={{
              background: "none", border: `1px solid rgba(${theme.breathe},0.2)`, padding: "6px 14px",
              borderRadius: 20, fontSize: 11, color: theme.accent, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", letterSpacing: 1,
            }}>📓 Journal</button>
          )}
          {!isPremium && (
            <button onClick={() => setShowUpgrade(true)} style={{
              background: `linear-gradient(135deg, ${theme.accent}, ${theme.text})`, border: "none", padding: "6px 16px",
              borderRadius: 20, fontSize: 11, color: theme.bg, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", letterSpacing: 1, fontWeight: 600,
            }}>✦ Premium</button>
          )}
          {sessions.length > 0 && screen !== "dashboard" && (
            <button onClick={() => {
              if (isPremium) { setScreen("dashboard"); setFadeKey((k) => k + 1); }
              else setShowUpgrade(true);
            }} style={{
              background: "none", border: `1px solid rgba(${theme.breathe},0.2)`, padding: "6px 14px",
              borderRadius: 20, fontSize: 11, color: theme.accent, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", letterSpacing: 1,
            }}>
              {sessions.length} session{sessions.length > 1 ? "s" : ""} {!isPremium && "🔒"}
            </button>
          )}
          <span style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: theme.accent, opacity: 0.6, fontWeight: 500 }}>
            Forj your mind
          </span>
        </div>
      </header>

      {/* ─── HOME ─── */}
      {screen === "home" && (
        <div key={fadeKey} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 80px)", padding: "0 24px 80px", animation: "fadeIn 0.8s ease" }}>
          <div style={{ textAlign: "center", maxWidth: 560, marginBottom: 48 }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(30px, 5vw, 44px)", fontWeight: 400, color: theme.text, margin: "0 0 14px", lineHeight: 1.2, letterSpacing: -0.5 }}>
              How do you feel<br />right now?
            </h1>
            <p style={{ fontSize: 15, color: theme.accent, fontWeight: 300, margin: 0, lineHeight: 1.6, opacity: 0.8 }}>
              Evidence-based micro-interventions. 3–5 minutes.<br />No login. No data stored on servers. Completely private.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: 10, maxWidth: 700, width: "100%" }}>
            {EMOTIONS.map((e, i) => (
              <button key={e.id} onClick={() => selectEmotion(e.id)} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                padding: "20px 12px", background: theme.card, border: `1px solid rgba(${theme.breathe},0.06)`,
                borderRadius: 16, cursor: "pointer", transition: "all 0.3s ease",
                animation: `slideUp 0.5s ease ${i * 0.05}s both`, backdropFilter: "blur(10px)",
              }}
              onMouseEnter={(el) => { el.currentTarget.style.background = `rgba(${theme.breathe},0.08)`; el.currentTarget.style.transform = "translateY(-2px)"; el.currentTarget.style.boxShadow = `0 8px 24px rgba(${theme.breathe},0.08)`; }}
              onMouseLeave={(el) => { el.currentTarget.style.background = theme.card; el.currentTarget.style.transform = "translateY(0)"; el.currentTarget.style.boxShadow = "none"; }}
              >
                <span style={{ fontSize: 26 }}>{e.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: theme.text }}>{e.label}</span>
                <span style={{ fontSize: 11, color: theme.accent, opacity: 0.6 }}>{e.desc}</span>
              </button>
            ))}
          </div>

          <div style={{ marginTop: 56, textAlign: "center", maxWidth: 480 }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: 16 }}>
              {["CBT", "DBT", "ACT", "IPT", "MBSR", "Behavioral Activation", "Positive Psychology"].map((t) => (
                <span key={t} style={{ padding: "4px 12px", background: theme.subtle, borderRadius: 12, fontSize: 11, color: theme.accent, letterSpacing: 0.5 }}>{t}</span>
              ))}
            </div>
            <p style={{ fontSize: 12, color: theme.accent, opacity: 0.5, lineHeight: 1.6 }}>
              Built by a Board Certified Psychiatric Mental Health Nurse Practitioner — Caring for the Whole Human.
              <br />Science-backed. AI-powered.
            </p>
          </div>
        </div>
      )}

      {/* ─── SESSION ─── */}
      {screen === "session" && protocol && currentStep && (
        <div key={fadeKey} style={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "calc(100vh - 80px)", padding: "32px 24px 80px", animation: "fadeIn 0.5s ease" }}>
          <div style={{ width: "100%", maxWidth: 500, marginBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: theme.accent, opacity: 0.7 }}>{protocol.title}</span>
              <span style={{ fontSize: 11, color: theme.accent, opacity: 0.5 }}>{step + 1} / {protocol.steps.length}</span>
            </div>
            <div style={{ height: 2, background: `rgba(${theme.breathe},0.1)`, borderRadius: 2 }}>
              <div style={{ height: 2, background: theme.accent, borderRadius: 2, width: `${((step + 1) / protocol.steps.length) * 100}%`, transition: "width 0.5s ease" }} />
            </div>
          </div>

          <div style={{ maxWidth: 500, width: "100%", textAlign: "center" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 400, color: theme.text, margin: "0 0 12px" }}>{currentStep.title}</h2>
            <p style={{ fontSize: 15, color: theme.accent, lineHeight: 1.7, marginBottom: 32, fontWeight: 300, opacity: 0.85 }}>{currentStep.instruction}</p>

            {currentStep.type === "breathing" && <BreathingExercise config={currentStep.breathe} onComplete={() => setBreathDone(true)} theme={theme} />}

            {currentStep.type === "input" && (
              currentStep.multiline ? (
                <textarea value={inputVal} onChange={(e) => setInputVal(e.target.value)} placeholder={currentStep.placeholder} rows={4}
                  style={{ width: "100%", padding: 20, fontSize: 15, fontFamily: "'DM Sans', sans-serif", border: `1px solid rgba(${theme.breathe},0.15)`, borderRadius: 16, background: theme.card, color: theme.text, resize: "vertical", lineHeight: 1.6, backdropFilter: "blur(10px)" }} />
              ) : (
                <input type="text" value={inputVal} onChange={(e) => setInputVal(e.target.value)} placeholder={currentStep.placeholder}
                  onKeyDown={(e) => { if (e.key === "Enter" && canProceed()) next(); }}
                  style={{ width: "100%", padding: 20, fontSize: 15, fontFamily: "'DM Sans', sans-serif", border: `1px solid rgba(${theme.breathe},0.15)`, borderRadius: 16, background: theme.card, color: theme.text, backdropFilter: "blur(10px)" }} />
              )
            )}

            {currentStep.type === "select" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {currentStep.options.map((opt) => (
                  <button key={opt.id} onClick={() => setSelected(opt)} style={{
                    display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "16px 22px",
                    background: selected?.id === opt.id ? `rgba(${theme.breathe},0.12)` : theme.card,
                    border: selected?.id === opt.id ? `1px solid ${theme.accent}` : `1px solid rgba(${theme.breathe},0.08)`,
                    borderRadius: 14, cursor: "pointer", transition: "all 0.2s", textAlign: "left",
                  }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: theme.text }}>{opt.label}</span>
                    <span style={{ fontSize: 12, color: theme.accent, opacity: 0.7, marginTop: 2 }}>{opt.desc}</span>
                  </button>
                ))}
              </div>
            )}

            {currentStep.type === "scale" && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", maxWidth: 400 }}>
                  <span style={{ fontSize: 12, color: theme.accent, opacity: 0.6 }}>Low</span>
                  <span style={{ fontSize: 32, fontWeight: 300, color: theme.text }}>{scaleVal}</span>
                  <span style={{ fontSize: 12, color: theme.accent, opacity: 0.6 }}>High</span>
                </div>
                <input type="range" min={currentStep.min} max={currentStep.max} value={scaleVal}
                  onChange={(e) => setScaleVal(parseInt(e.target.value))} style={{ width: "100%", maxWidth: 400 }} />
              </div>
            )}

            <button onClick={next} disabled={!canProceed()} style={{
              marginTop: 36, padding: "16px 56px", fontSize: 15, fontFamily: "'DM Sans', sans-serif",
              background: canProceed() ? theme.text : `rgba(${theme.breathe},0.15)`,
              color: canProceed() ? theme.bg : `rgba(${theme.breathe},0.4)`,
              border: "none", borderRadius: 50, cursor: canProceed() ? "pointer" : "not-allowed",
              letterSpacing: 1, transition: "all 0.3s",
            }}>
              {step === protocol.steps.length - 1 ? "Complete Session" : "Continue"}
            </button>
          </div>
        </div>
      )}

      {/* ─── SUMMARY ─── */}
      {screen === "summary" && protocol && (
        <div key={fadeKey} style={{ minHeight: "calc(100vh - 80px)", padding: "48px 24px 80px", animation: "fadeIn 0.8s ease" }}>
          <div style={{ maxWidth: 560, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <span style={{ fontSize: 44, display: "block", marginBottom: 8, animation: "float 3s ease-in-out infinite" }}>{protocol.icon}</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, color: theme.text, margin: "0 0 6px" }}>Session Complete</h2>
              <p style={{ fontSize: 13, color: theme.accent, opacity: 0.7, letterSpacing: 1 }}>{protocol.title} · {protocol.basis}</p>
            </div>

            <AIInsight emotion={emotion} responses={responses} protocol={protocol} theme={theme} isPremium={isPremium} onUpgrade={() => setShowUpgrade(true)} webllm={webllm} />

            <div style={{ background: theme.subtle, borderRadius: 20, padding: 28, marginBottom: 28 }}>
              <h3 style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 2, color: theme.accent, margin: "0 0 18px", fontWeight: 600 }}>Session Notes</h3>
              {Object.entries(responses).map(([key, val]) => {
                if (!val) return null;
                const s = protocol.steps.find((x) => x.fieldKey === key);
                if (!s) return null;
                const display = typeof val === "object" ? val.label : val;
                return (
                  <div key={key} style={{ marginBottom: 14 }}>
                    <span style={{ fontSize: 11, color: theme.accent, opacity: 0.6, textTransform: "uppercase", letterSpacing: 1 }}>{s.title}</span>
                    <p style={{ margin: "3px 0 0", fontSize: 15, color: theme.text, lineHeight: 1.5 }}>{display}</p>
                  </div>
                );
              })}
            </div>

            <div style={{ textAlign: "center" }}>
              <button onClick={reset} style={{
                padding: "16px 48px", fontSize: 15, fontFamily: "'DM Sans', sans-serif",
                background: theme.text, color: theme.bg, border: "none", borderRadius: 50,
                cursor: "pointer", letterSpacing: 1,
              }}>New Session</button>
            </div>

            <div style={{ marginTop: 40, padding: 20, background: theme.subtle, borderRadius: 16, textAlign: "center" }}>
              <p style={{ fontSize: 11, color: theme.accent, opacity: 0.5, lineHeight: 1.7, margin: 0 }}>
                AIForj provides evidence-based self-help tools and is not a substitute for professional care.
                <br />If you are in crisis, contact the <strong>988 Suicide & Crisis Lifeline</strong> — call or text 988.
                <br />Crisis Text Line: Text HOME to 741741.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── DASHBOARD ─── */}
      {screen === "dashboard" && (
        <div key={fadeKey} style={{ minHeight: "calc(100vh - 80px)", padding: "32px 24px 80px", animation: "fadeIn 0.6s ease" }}>
          <MoodDashboard sessions={sessions} theme={theme} onClose={reset} />
        </div>
      )}

      {/* ─── JOURNAL ─── */}
      {screen === "journal" && (
        <div key={fadeKey} style={{ minHeight: "calc(100vh - 80px)", padding: "32px 24px 80px", animation: "fadeIn 0.6s ease" }}>
          <JournalEntry theme={theme} onClose={reset} />
        </div>
      )}
    </div>
  );
}
