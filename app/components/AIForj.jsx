"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import EmailCapture from "./EmailCapture";
import SiteFooter from "./SiteFooter";

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
  stressed:      { bg: "#F0F3ED", accent: "#6B8C6B", text: "#1E321E", subtle: "rgba(107,140,107,0.08)", card: "rgba(238,248,235,0.6)", breathe: "107,140,107" },
  burnout:       { bg: "#F5F0EC", accent: "#8C6B4A", text: "#3A2A18", subtle: "rgba(140,107,74,0.08)",  card: "rgba(248,240,230,0.6)", breathe: "140,107,74"  },
  relationship:  { bg: "#F5ECF0", accent: "#9A4A6B", text: "#3A1A28", subtle: "rgba(154,74,107,0.08)",  card: "rgba(248,228,238,0.6)", breathe: "154,74,107"  },
  night:         { bg: "#12162A", accent: "#8B9FD4", text: "#D8E0F5", subtle: "rgba(139,159,212,0.08)", card: "rgba(28,34,56,0.85)",  breathe: "139,159,212"  },
  socialanxiety: { bg: "#F0EDF5", accent: "#6B5A9A", text: "#28203A", subtle: "rgba(107,90,154,0.08)",  card: "rgba(238,232,248,0.6)", breathe: "107,90,154"  },
  imposter:      { bg: "#F2EFF5", accent: "#6A5B8A", text: "#2A2040", subtle: "rgba(106,91,138,0.08)",  card: "rgba(240,235,248,0.6)", breathe: "106,91,138"  },
  grief:         { bg: "#ECEFF5", accent: "#4A5A7A", text: "#1A2038", subtle: "rgba(74,90,122,0.08)",   card: "rgba(230,234,248,0.6)", breathe: "74,90,122"   },
};

const EMOTIONS = [
  { id: "anxious",       label: "Anxious",           icon: "⚡",  desc: "Racing thoughts, worry, tension"    },
  { id: "overwhelmed",   label: "Overwhelmed",        icon: "🌊",  desc: "Too much, can't process"            },
  { id: "stressed",      label: "Stressed",           icon: "⏰",  desc: "Pressure, deadline, tense"          },
  { id: "burnout",       label: "Burned Out",         icon: "🪨",  desc: "Depleted, running on empty"         },
  { id: "angry",         label: "Angry",              icon: "🔥",  desc: "Frustrated, irritated, furious"     },
  { id: "sad",           label: "Sad",                icon: "🌧",  desc: "Heavy, low, tearful"                },
  { id: "grief",         label: "Grief / Loss",       icon: "🕊️",  desc: "Missing someone or something"       },
  { id: "relationship",  label: "Relationship Pain",  icon: "💔",  desc: "Conflict, hurt, disconnected"       },
  { id: "night",         label: "3AM Spiral",         icon: "🌙",  desc: "Can't sleep, mind racing"           },
  { id: "socialanxiety", label: "Social Anxiety",     icon: "😰",  desc: "Nervous about people or situations" },
  { id: "imposter",      label: "Imposter Syndrome",  icon: "🎭",  desc: "Don't belong, will be found out"    },
  { id: "lonely",        label: "Lonely",             icon: "🌑",  desc: "Isolated, disconnected"             },
  { id: "numb",          label: "Numb",               icon: "🧊",  desc: "Disconnected, empty, flat"          },
  { id: "unmotivated",   label: "Unmotivated",        icon: "🪫",  desc: "No energy, can't start"             },
  { id: "fine",          label: "I'm Good",           icon: "☀️",  desc: "Optimize & grow"                    },
];

// ═══════════════════════════════════════════════════════════════
// EMERGENCY QUICK TOOLS — instant, no-full-session interventions
// ═══════════════════════════════════════════════════════════════
const QUICK_TOOLS = [
  { id: "box",    icon: "▣",  label: "Box Breathing",        time: "2 min", desc: "4-4-4-4. Instant calm.",          type: "breathing", breathe: { inhale: 4, hold: 4, exhale: 4 }, free: true  },
  { id: "sigh",   icon: "🌬️", label: "Physiological Sigh",   time: "1 min", desc: "Stanford's fastest stress reset.", type: "breathing", breathe: { inhale: 3, hold: 1, exhale: 7 }, free: true  },
  { id: "ground", icon: "🌿", label: "5-4-3-2-1 Grounding",  time: "3 min", desc: "Stop panic with your senses.",     type: "grounding",                                              free: true  },
  { id: "defuse", icon: "🧠", label: "Thought Defusion",     time: "2 min", desc: "Detach from a looping thought.",   type: "defusion",                                               free: false },
  { id: "tipp",   icon: "❄️", label: "TIPP Crisis Skill",    time: "3 min", desc: "DBT's fastest emotion reducer.",   type: "tipp",                                                   free: false },
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
  burnout: {
    title: "Burnout Recovery",
    basis: "Maslach Burnout Framework + ACT + Self-Compassion",
    icon: "🪨",
    steps: [
      { type: "breathing", title: "Nervous System Reset", instruction: "Burnout means your system has been in overdrive for too long without recovery. This exhale-extended pattern activates your body's restoration mode.", breathe: { inhale: 4, hold: 4, exhale: 6 } },
      { type: "scale", title: "Depletion Level", instruction: "How empty do you feel right now — emotionally, physically, mentally? There's no wrong answer.", fieldKey: "depletion", min: 1, max: 10 },
      { type: "select", title: "Primary Drain Source", instruction: "Maslach's burnout research identifies 6 root causes. Which fits most?", options: [
        { id: "workload",    label: "Unsustainable workload",  desc: "Too much, for too long, with no recovery time" },
        { id: "control",     label: "Lack of control",         desc: "Little say over decisions that affect you" },
        { id: "recognition", label: "No recognition",          desc: "Your effort goes unseen or unrewarded" },
        { id: "values",      label: "Values mismatch",         desc: "What you do conflicts with who you are" },
        { id: "community",   label: "Isolation or conflict",   desc: "Unsupported, disconnected, or surrounded by tension" },
        { id: "unfair",      label: "Chronic unfairness",      desc: "Rules and expectations don't apply equally" },
      ], fieldKey: "drainSource" },
      { type: "input", title: "The Last Time You Felt Restored", instruction: "When did you last feel genuinely replenished — not just 'off' but actually restored? Describe the moment specifically.", placeholder: "e.g., 'That long weekend two summers ago when I turned my phone off...'", fieldKey: "lastRestored" },
      { type: "input", title: "One Energy Boundary This Week", instruction: "What is one concrete limit you could set in the next 7 days to start protecting your energy?", placeholder: "e.g., 'No work messages after 8pm' or 'I skip the optional Friday meeting'", fieldKey: "boundary" },
    ],
  },
  relationship: {
    title: "Relationship Reset",
    basis: "EFT (Emotionally Focused Therapy) + DBT Interpersonal Effectiveness",
    icon: "💔",
    steps: [
      { type: "breathing", title: "De-escalation First", instruction: "Relationship pain activates survival instincts. This pattern moves you from raw reaction to thoughtful response before anything else.", breathe: { inhale: 4, hold: 2, exhale: 8 } },
      { type: "select", title: "Type of Hurt", instruction: "Which kind of pain is most alive right now?", options: [
        { id: "conflict",       label: "Active conflict",       desc: "You're in or just had an argument or fight" },
        { id: "betrayal",       label: "Betrayal or breach",    desc: "Trust was broken in some way" },
        { id: "neglect",        label: "Feeling unseen",        desc: "Your needs or feelings are being ignored" },
        { id: "disappointment", label: "Deep disappointment",   desc: "Someone didn't show up the way you needed" },
        { id: "distance",       label: "Growing distance",      desc: "A slow drift — things feel less close" },
        { id: "longing",        label: "Missing closeness",     desc: "You want connection with someone who feels far" },
      ], fieldKey: "hurtType" },
      { type: "input", title: "The Facts Only", instruction: "Describe what happened using only observable facts. No interpretations. What would a camera have recorded?", placeholder: "e.g., 'They didn't respond for 3 days. When they did, it was one sentence.'", fieldKey: "facts" },
      { type: "input", title: "What I Actually Need", instruction: "Underneath the hurt — what do you genuinely need from this relationship right now?", placeholder: "e.g., 'To feel like I matter. Consistent communication.'", fieldKey: "need" },
      { type: "input", title: "One Caring Act for Yourself", instruction: "While this heals, what is one kind thing you can do for yourself today — something that doesn't depend on the other person?", placeholder: "e.g., 'Take a long walk' or 'Call a friend who shows up for me'", fieldKey: "selfCare" },
    ],
  },
  night: {
    title: "Midnight Reset",
    basis: "CBT-Insomnia (CBT-I) + ACT Defusion + Somatic Calming",
    icon: "🌙",
    steps: [
      { type: "breathing", title: "4-7-8 Sleep Breath", instruction: "Dr. Andrew Weil's 4-7-8 technique is the fastest method for quieting a racing nighttime mind. The 8-count exhale activates your vagus nerve directly.", breathe: { inhale: 4, hold: 7, exhale: 8 } },
      { type: "input", title: "Externalize the Spiral", instruction: "Write the exact thought or worry that's looping. Get it out of your head and onto the screen — externalization alone reduces its power significantly.", placeholder: "e.g., 'The presentation. Whether I said something wrong. The email I haven't sent...'", fieldKey: "worry", multiline: true },
      { type: "select", title: "What Kind of Spiral", instruction: "Knowing the pattern helps break it.", options: [
        { id: "ruminating", label: "Rehashing the past",       desc: "Replaying conversations or events on loop" },
        { id: "future",     label: "Dreading tomorrow",        desc: "Catastrophizing about what might go wrong" },
        { id: "solving",    label: "Problem-solving mode",     desc: "Brain won't stop trying to fix things right now" },
        { id: "shame",      label: "Shame spiral",             desc: "'Why did I say that...' 'I'm so stupid...'" },
        { id: "unknown",    label: "Ambient dread",            desc: "Unspecific — just heavy, restless, unsettled" },
      ], fieldKey: "spiralType" },
      { type: "input", title: "Permission Sentence", instruction: "Write: 'Tonight, I give myself permission to...' This is about releasing the grip, not solving anything.", placeholder: "e.g., '...not have the answer tonight. Morning will be clearer.'", fieldKey: "permission" },
      { type: "select", title: "Sleep Anchor Technique", instruction: "Choose one technique to carry into the next few minutes:", options: [
        { id: "pmr",    label: "Progressive muscle release", desc: "Tense then release each body part, toes to head" },
        { id: "count",  label: "Reverse counting",           desc: "Count backwards from 300 by 3s — occupies the thinking mind" },
        { id: "image",  label: "Safe place visualization",   desc: "A vivid, detailed place where you feel completely safe" },
        { id: "body",   label: "Body scan surrender",        desc: "Notice each part of your body sinking into the mattress" },
        { id: "senses", label: "Present-moment anchoring",   desc: "Name what you hear, feel, smell right now in the dark" },
      ], fieldKey: "sleepTechnique" },
    ],
  },
  socialanxiety: {
    title: "Social Courage Protocol",
    basis: "CBT-Social Anxiety + Exposure Therapy + Mindful Self-Compassion",
    icon: "😰",
    steps: [
      { type: "breathing", title: "Pre-Event Physiological Reset", instruction: "Social anxiety spikes cortisol and adrenaline. This pattern lowers physiological activation before you face the situation.", breathe: { inhale: 4, hold: 4, exhale: 6 } },
      { type: "input", title: "The Specific Situation", instruction: "What social situation is triggering this anxiety right now? Be concrete — vague anxiety needs a specific address.", placeholder: "e.g., 'Presenting to the whole team at 3pm today' or 'Partner's family dinner tonight'", fieldKey: "situation" },
      { type: "select", title: "The Core Fear", instruction: "Social anxiety always guards something deeper. What is it protecting you from?", options: [
        { id: "judgment",      label: "Being judged negatively",    desc: "They'll think I'm stupid, boring, or not enough" },
        { id: "rejection",     label: "Rejection",                  desc: "They won't like me, want me there, or include me" },
        { id: "embarrassment", label: "Embarrassment",              desc: "I'll stumble, go blank, or say something wrong" },
        { id: "exposure",      label: "Being truly seen",           desc: "If they see the real me, they won't accept it" },
        { id: "scrutiny",      label: "Being watched and analyzed", desc: "I'll act strange because I know they're observing me" },
        { id: "conflict",      label: "Conflict or awkwardness",    desc: "Something tense or uncomfortable will happen" },
      ], fieldKey: "coreFear" },
      { type: "input", title: "The Evidence Check", instruction: "What actual, concrete evidence do you have that your fear will definitely come true today?", placeholder: "e.g., 'Honestly... none. The last time I presented it went fine.'", fieldKey: "evidence" },
      { type: "input", title: "Your Courage Statement", instruction: "Complete: 'Even if I feel anxious, I can still ___'", placeholder: "e.g., '...show up, be present, and be myself. I don't have to be perfect.'", fieldKey: "courage" },
    ],
  },
  imposter: {
    title: "Inner Critic Reset",
    basis: "CBT + ACT Defusion + Self-Compassion Research (Kristin Neff)",
    icon: "🎭",
    steps: [
      { type: "scale", title: "Imposter Intensity", instruction: "How loudly is the inner critic speaking right now?", fieldKey: "intensity", min: 1, max: 10 },
      { type: "input", title: "What Triggered This", instruction: "Something activated this feeling. What happened — a comment, a comparison, a new responsibility, a success that felt undeserved?", placeholder: "e.g., 'My manager just gave me a bigger project and I immediately felt terrified I'd be exposed'", fieldKey: "trigger" },
      { type: "select", title: "The Inner Critic's Loudest Line", instruction: "Which thought is repeating the most?", options: [
        { id: "deserve",   label: "I don't deserve this",           desc: "This role, success, or recognition isn't rightfully mine" },
        { id: "fraud",     label: "They'll find out I'm a fraud",   desc: "It's only a matter of time before I'm exposed" },
        { id: "qualified", label: "Everyone else is more qualified", desc: "I'm the least capable person in this room" },
        { id: "lucky",     label: "I just got lucky",               desc: "My results aren't real skill — just circumstance" },
        { id: "belong",    label: "I don't belong here",            desc: "This world, room, or level isn't for someone like me" },
      ], fieldKey: "criticLine" },
      { type: "input", title: "One Concrete Piece of Evidence Against It", instruction: "Name one specific, undeniable piece of evidence that you DO belong here — a real skill, result, or moment that was entirely yours.", placeholder: "e.g., 'I built the entire reporting system from scratch with no guidance. That was real.'", fieldKey: "evidence" },
      { type: "input", title: "The Compassion Redirect", instruction: "If your closest friend said those exact words about themselves, what would you say back to them?", placeholder: "e.g., 'You worked incredibly hard for this. The results speak for themselves.'", fieldKey: "compassion" },
    ],
  },
  grief: {
    title: "Grief Protocol",
    basis: "Complicated Grief Treatment + Meaning-Making Therapy + Polyvagal",
    icon: "🕊️",
    steps: [
      { type: "breathing", title: "Space for What's Here", instruction: "Grief asks to be held, not fixed or rushed. This rhythm helps you stay present with what's real without being swept away by it.", breathe: { inhale: 4, hold: 3, exhale: 5 } },
      { type: "select", title: "The Nature of This Loss", instruction: "What kind of loss is most alive right now?", options: [
        { id: "person",       label: "A person — death",          desc: "Someone has died or is dying" },
        { id: "relationship", label: "A relationship",            desc: "A partnership, friendship, or connection that ended" },
        { id: "identity",     label: "A version of yourself",     desc: "Who you were before — a role, life chapter, or belief" },
        { id: "future",       label: "A future you imagined",     desc: "Plans, hopes, or possibilities that won't happen now" },
        { id: "health",       label: "Health or ability",         desc: "A body, capacity, or wellness that has changed" },
        { id: "place",        label: "A place or sense of home",  desc: "Somewhere you belonged that's gone or different now" },
      ], fieldKey: "lossType" },
      { type: "input", title: "What You Miss Most", instruction: "What is the ONE thing you miss most? Be specific and honest — grief honors specificity.", placeholder: "e.g., 'The way she laughed at her own jokes before the punchline even came'", fieldKey: "missing" },
      { type: "input", title: "What Still Lives in You", instruction: "What did this person, relationship, or chapter of life give you that still lives inside you today?", placeholder: "e.g., 'The belief that I'm capable of being deeply loved. She showed me that.'", fieldKey: "legacy" },
      { type: "input", title: "One Act of Honoring", instruction: "What is one small, meaningful thing you could do today to honor this loss — not to move past it, but to acknowledge it?", placeholder: "e.g., 'Write a letter I won't send' or 'Visit the place we used to go'", fieldKey: "honoring" },
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
const CLINICAL_SYSTEM_PROMPT = `You are the AI engine behind AIForj — a mental wellness platform built by a Licensed Healthcare Provider. You provide evidence-based, personalized micro-guidance.

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
    burnout: (r) => {
      let out = "Burnout isn't weakness — it's what happens when a capable, caring person gives more than they receive for too long. Maslach's research shows burnout has a root cause, and you just identified yours.";
      if (r.drainSource) out += `\n\nYour primary drain: ${r.drainSource.label?.toLowerCase()}. This is key. Burnout recovery isn't just rest — it's addressing the source. Rest without structural change leads to re-burnout.`;
      if (r.boundary) out += `\n\nYour chosen boundary — "${r.boundary}" — is where recovery actually begins. Boundaries aren't selfish. They're what make sustained contribution possible. Honor it this week. Your future energy depends on it.`;
      return out;
    },
    relationship: (r) => {
      let out = "Relationship pain is one of the most physiologically activating experiences humans have — your nervous system treats social threat the same as physical danger. You handled it well by separating facts from interpretation.";
      if (r.need) out += `\n\nWhat you actually need: "${r.need}" — that's the real conversation waiting to happen. DBT Interpersonal Effectiveness teaches that most relationship conflicts are fundamentally about unmet needs, not the surface argument.`;
      if (r.selfCare) out += `\n\nYour self-care plan: "${r.selfCare}". Do it before you try to resolve anything. You can't pour from empty, and you can't communicate clearly from activation.`;
      return out;
    },
    night: (r) => {
      let out = "3AM thoughts have a particular cruelty — they feel more real and more catastrophic than they actually are. This is because the prefrontal cortex (your rational mind) is less active at night, leaving your amygdala in charge.";
      if (r.worry) out += `\n\nYou wrote: "${r.worry?.slice(0,80)}${r.worry?.length > 80 ? "..." : ""}". That's now on the screen, not just in your head. CBT-Insomnia research shows that externalizing 3AM thoughts reduces their grip within minutes.`;
      if (r.permission) out += `\n\nYour permission: "${r.permission}". Say it out loud, once, and mean it. You don't have to solve tonight's problems tonight.`;
      out += "\n\nNow: do your chosen sleep technique. Give it 10 full minutes before evaluating whether it worked.";
      return out;
    },
    socialanxiety: (r) => {
      let out = "Social anxiety runs on prediction — your brain generates a worst-case social scenario and treats it as fact before anything has happened. CBT research shows this prediction is wrong the vast majority of the time.";
      if (r.evidence) out += `\n\nYour evidence check: "${r.evidence}". That's the most powerful tool in this entire protocol. When you search for evidence and find little or none, you're doing cognitive restructuring in real time.`;
      if (r.courage) out += `\n\n"${r.courage}" — hold onto that. Courage in social anxiety isn't the absence of fear. It's moving toward the situation while the fear is still present. Every time you do that, you're rewiring your threat response.`;
      return out;
    },
    imposter: (r) => {
      let out = `Your inner critic is running at ${r.intensity || "high"}/10. That's information, not truth. Imposter syndrome is extraordinarily common among high-achievers — Pauline Clance's research found it affects up to 70% of successful people.`;
      if (r.evidence) out += `\n\nYour concrete evidence: "${r.evidence}". Read that again slowly. That is real. That is yours. No one can take that away from the narrative. ACT defusion asks you to hold the imposter thought AND the evidence simultaneously — both can be true.`;
      if (r.compassion) out += `\n\nWhat you'd say to a friend: "${r.compassion}". Now say it to yourself — with the same warmth and certainty. Kristin Neff's self-compassion research shows this single shift is more effective than self-esteem work.`;
      return out;
    },
    grief: (r) => {
      let out = "Grief is not a problem to solve or a stage to pass through quickly. It's a testimony to how much something mattered. The intensity of grief is proportional to the depth of love or attachment — it's not weakness.";
      if (r.missing) out += `\n\n"${r.missing}" — that specificity matters. Grief therapists call this 'continuing bonds' — the relationship doesn't end with the loss. The love continues in the specific memories you carry.`;
      if (r.legacy) out += `\n\n"${r.legacy}" — this is meaning-making. Viktor Frankl showed that even in unimaginable loss, humans find meaning — and that meaning becomes the bridge between grief and living forward.`;
      if (r.honoring) out += `\n\nYour act of honoring: "${r.honoring}". Do it. Rituals of remembrance are one of the most powerful tools in grief processing. You don't have to rush forward.`;
      return out;
    },
  };


  const fn = emotionInsights[emotion];
  return fn ? fn(responses) : "Session complete. Reflect on what you wrote — your own words contain more wisdom than you might realize.";
}

// Intelligent fallback for AI chat follow-ups
function generateChatFallback(emotion, responses, userMessage) {
  const msg = userMessage.toLowerCase();
  if (msg.includes("why") && (msg.includes("feel") || msg.includes("this") || msg.includes("happen")))
    return `What you're experiencing makes complete sense given what you shared. The ${emotion} you're feeling is a natural signal — your brain flagging something important. The work isn't to eliminate the feeling, but to listen to what it's trying to tell you without being controlled by it. What does it feel like it's pointing toward?`;
  if (msg.includes("what should i do") || msg.includes("what do i do") || msg.includes("what now") || msg.includes("next"))
    return `Based on your session, the most important next step is the concrete action you identified. The research is clear: doing something small — even imperfectly — rewires neural pathways faster than thinking about doing it. What would it take to start that in the next 10 minutes?`;
  if (msg.includes("doesn't work") || msg.includes("not working") || msg.includes("still feel") || msg.includes("not better"))
    return `That's honest and important. These tools work over time and with repetition — not always in a single session. What you're doing by showing up is itself therapeutic. If this persists or intensifies, please reach out to a professional. You can also text HOME to 741741 anytime. Are there any specific parts of the session that resonated, even a little?`;
  if (msg.includes("more about") || msg.includes("explain") || msg.includes("tell me"))
    return `The protocol you completed draws from clinically validated therapy — the same approaches used in professional settings. The breathing came first because emotional processing is almost impossible when you're physiologically activated. We worked with the cognitive layer next, then the behavioral. Which part would you like to go deeper on?`;
  if (msg.includes("thank") || msg.includes("feel better") || msg.includes("helped") || msg.includes("good"))
    return `That means a lot. The real work is yours — you showed up, engaged honestly, and sat with something difficult. That takes real courage. Come back whenever you need to reset. You've genuinely got this.`;
  return `That's worth exploring. What you're noticing — "${userMessage.slice(0, 60)}${userMessage.length > 60 ? "..." : ""}" — shows real self-awareness. The fact that you can observe this pattern in yourself is significant. What feels most true about it right now?`;
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
      const webllm = await import("@mlc-ai/web-llm");
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
// SHARE CARD — Viral sharing after session (free feature)
// ═══════════════════════════════════════════════════════════════
function ShareCard({ emotion, protocol, insight, theme }) {
  const [copied, setCopied] = useState(false);
  const e = EMOTIONS.find(x => x.id === emotion);
  const snippet = insight ? insight.split('\n')[0].slice(0, 180) : `Just completed a ${protocol?.title} session using ${protocol?.basis}.`;
  const cardText = `${e?.icon} I just processed "${e?.label?.toLowerCase()}" with AIForj\n\n"${snippet}"\n\n— Evidence-based wellness, free at aiforj.com`;
  const copy = () => {
    navigator.clipboard.writeText(cardText).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); }).catch(() => {});
  };
  return (
    <div style={{ background: theme.subtle, borderRadius: 20, padding: 20, marginBottom: 20, border: `1px solid rgba(${theme.breathe},0.12)` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: theme.accent, fontWeight: 600 }}>Share Your Session</span>
        <button onClick={copy} style={{ padding: "6px 16px", fontSize: 12, fontFamily: "'DM Sans', sans-serif", background: copied ? theme.accent : "transparent", color: copied ? theme.bg : theme.accent, border: `1px solid ${theme.accent}`, borderRadius: 20, cursor: "pointer", transition: "all 0.3s" }}>
          {copied ? "✓ Copied!" : "Copy to Share"}
        </button>
      </div>
      <div style={{ padding: "14px 18px", background: theme.card, borderRadius: 14, fontSize: 13, lineHeight: 1.7, color: theme.text, backdropFilter: "blur(10px)", fontStyle: "italic", opacity: 0.85 }}>
        "{snippet.slice(0, 120)}{snippet.length > 120 ? "..." : ""}"
        <span style={{ display: "block", marginTop: 6, fontSize: 11, color: theme.accent, opacity: 0.6, fontStyle: "normal" }}>— aiforj.com · free evidence-based wellness</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// QUICK TOOL MODAL — instant interventions
// ═══════════════════════════════════════════════════════════════
function QuickToolModal({ tool, theme, isPremium, onUpgrade, onClose }) {
  const [gtStep, setGtStep] = useState(0);
  const [gtInput, setGtInput] = useState("");
  const [defuseInput, setDefuseInput] = useState("");
  const [defuseReframe, setDefuseReframe] = useState("");
  const [defuseStep, setDefuseStep] = useState(0);
  const [breathDone, setBreathDone] = useState(false);
  const [done, setDone] = useState(false);
  const GROUNDING = [
    { count: 5, sense: "SEE",   icon: "👁️",  prompt: "Look around. Name 5 things you can see right now." },
    { count: 4, sense: "FEEL",  icon: "🤲", prompt: "Notice your body. Name 4 things you can physically feel." },
    { count: 3, sense: "HEAR",  icon: "👂", prompt: "Go still. Name 3 sounds you can hear right now." },
    { count: 2, sense: "SMELL", icon: "👃", prompt: "Take a breath. Name 2 things you can smell." },
    { count: 1, sense: "TASTE", icon: "👅", prompt: "Name 1 thing you can taste — or deeply want to." },
  ];
  const overlay = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24, animation: "fadeIn 0.3s ease" };
  const box = { background: theme.bg, borderRadius: 24, padding: "36px 28px", maxWidth: 460, width: "100%", boxShadow: "0 24px 80px rgba(0,0,0,0.18)", maxHeight: "90vh", overflowY: "auto" };
  const btn = (active) => ({ marginTop: 12, padding: "14px", width: "100%", background: active ? theme.text : `rgba(${theme.breathe},0.15)`, color: active ? theme.bg : `rgba(${theme.breathe},0.4)`, border: "none", borderRadius: 50, cursor: active ? "pointer" : "not-allowed", fontFamily: "'DM Sans', sans-serif", fontSize: 14 });

  if (!isPremium && !tool.free) {
    return (
      <div style={overlay} onClick={onClose}>
        <div onClick={e => e.stopPropagation()} style={{ ...box, textAlign: "center" }}>
          <span style={{ fontSize: 40, display: "block", marginBottom: 12 }}>{tool.icon}</span>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 400, color: theme.text, margin: "0 0 8px" }}>{tool.label}</h3>
          <p style={{ fontSize: 14, color: theme.accent, margin: "0 0 24px", lineHeight: 1.6 }}>{tool.desc}</p>
          <button onClick={onUpgrade} style={{ padding: "14px 36px", background: `linear-gradient(135deg, ${theme.accent}, ${theme.text})`, color: theme.bg, border: "none", borderRadius: 50, cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, width: "100%" }}>✦ Unlock with Premium</button>
          <button onClick={onClose} style={{ marginTop: 12, background: "none", border: "none", color: theme.accent, cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif", opacity: 0.6 }}>Maybe later</button>
        </div>
      </div>
    );
  }

  return (
    <div style={overlay}>
      <div style={box}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 400, color: theme.text }}>{tool.icon} {tool.label}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, color: theme.accent, cursor: "pointer", opacity: 0.5 }}>×</button>
        </div>

        {done ? (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <span style={{ fontSize: 52, display: "block", marginBottom: 16 }}>✓</span>
            <p style={{ fontSize: 16, color: theme.text, marginBottom: 8 }}>Done. Notice how you feel.</p>
            <p style={{ fontSize: 13, color: theme.accent, opacity: 0.7, lineHeight: 1.6 }}>{tool.id === "ground" ? "You just pulled your nervous system into the present moment. Anxiety can't survive there." : "Your nervous system just got a deliberate reset."}</p>
            <button onClick={onClose} style={{ ...btn(true), marginTop: 20 }}>Close</button>
          </div>
        ) : tool.type === "breathing" ? (
          <>
            <p style={{ fontSize: 14, color: theme.accent, lineHeight: 1.7, marginBottom: 24 }}>{tool.id === "box" ? "Box breathing (4-4-4-4) is used by Navy SEALs and surgeons before high-stakes moments. It creates a measurable physiological state change in under 2 minutes." : "The physiological sigh — discovered at Stanford — is the fastest known way to reduce real-time stress. The double inhale fully inflates the lungs; the long exhale triggers the vagus nerve."}</p>
            <BreathingExercise config={tool.breathe} onComplete={() => setDone(true)} theme={theme} />
          </>
        ) : tool.type === "grounding" ? (
          gtStep < GROUNDING.length ? (
            <>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <span style={{ fontSize: 42, display: "block", marginBottom: 10 }}>{GROUNDING[gtStep].icon}</span>
                <p style={{ fontSize: 16, color: theme.text, fontFamily: "'Fraunces', serif", fontStyle: "italic", margin: 0 }}>{GROUNDING[gtStep].prompt}</p>
                <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 12 }}>
                  {GROUNDING.map((_, i) => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: i <= gtStep ? theme.accent : `rgba(${theme.breathe},0.2)`, transition: "all 0.3s" }} />)}
                </div>
              </div>
              <textarea value={gtInput} onChange={e => setGtInput(e.target.value)} rows={3} placeholder={`List ${GROUNDING[gtStep].count} things...`} style={{ width: "100%", padding: 16, fontSize: 14, border: `1px solid rgba(${theme.breathe},0.15)`, borderRadius: 14, background: theme.card, color: theme.text, resize: "none", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }} />
              <button onClick={() => { setGtInput(""); setGtStep(s => s + 1); }} disabled={!gtInput.trim()} style={btn(!!gtInput.trim())}>{gtStep < GROUNDING.length - 1 ? "Next →" : "Complete"}</button>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <span style={{ fontSize: 52, display: "block", marginBottom: 16 }}>🌿</span>
              <p style={{ fontSize: 16, color: theme.text, marginBottom: 8 }}>Grounding complete.</p>
              <p style={{ fontSize: 13, color: theme.accent, lineHeight: 1.6 }}>You activated your prefrontal cortex through sensory presence. Panic and rumination can't coexist with this kind of awareness.</p>
              <button onClick={onClose} style={btn(true)}>Close</button>
            </div>
          )
        ) : tool.type === "defusion" ? (
          defuseStep === 0 ? (
            <>
              <p style={{ fontSize: 14, color: theme.accent, lineHeight: 1.7, marginBottom: 20 }}>ACT defusion separates you from your thoughts. You are not your thoughts — you are the observer of them. This simple reframe changes a thought from a command into just... a thought.</p>
              <p style={{ fontSize: 14, color: theme.text, marginBottom: 10, fontWeight: 500 }}>What thought is looping?</p>
              <input type="text" value={defuseInput} onChange={e => setDefuseInput(e.target.value)} placeholder="e.g., 'I'm going to fail'" style={{ width: "100%", padding: "14px 16px", fontSize: 14, border: `1px solid rgba(${theme.breathe},0.15)`, borderRadius: 14, background: theme.card, color: theme.text, fontFamily: "'DM Sans', sans-serif" }} />
              <button onClick={() => setDefuseStep(1)} disabled={!defuseInput.trim()} style={btn(!!defuseInput.trim())}>Continue</button>
            </>
          ) : (
            <>
              <div style={{ background: theme.card, borderRadius: 14, padding: 16, marginBottom: 20, backdropFilter: "blur(10px)" }}>
                <p style={{ fontSize: 11, color: theme.accent, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: 1 }}>Defused version</p>
                <p style={{ fontSize: 16, color: theme.text, margin: 0, fontStyle: "italic" }}>"I notice I'm having the thought that {defuseInput.toLowerCase().replace(/^(i'm|i am)\s/i, "")}"</p>
              </div>
              <p style={{ fontSize: 14, color: theme.accent, lineHeight: 1.7, marginBottom: 16 }}>Say it out loud. Notice how distance appears between you and the thought. The thought is still there — but now you're observing it, not drowning in it.</p>
              <p style={{ fontSize: 14, color: theme.text, marginBottom: 10, fontWeight: 500 }}>What will you do despite this thought?</p>
              <input type="text" value={defuseReframe} onChange={e => setDefuseReframe(e.target.value)} placeholder="e.g., 'Prepare my best and show up anyway'" style={{ width: "100%", padding: "14px 16px", fontSize: 14, border: `1px solid rgba(${theme.breathe},0.15)`, borderRadius: 14, background: theme.card, color: theme.text, fontFamily: "'DM Sans', sans-serif" }} />
              <button onClick={() => setDone(true)} disabled={!defuseReframe.trim()} style={btn(!!defuseReframe.trim())}>Complete</button>
            </>
          )
        ) : tool.type === "tipp" ? (
          <div>
            <p style={{ fontSize: 14, color: theme.accent, lineHeight: 1.7, marginBottom: 20 }}>TIPP is DBT's fastest skill for reducing intense emotional activation. It works by changing your body chemistry directly — no thinking required.</p>
            {[
              { letter: "T", title: "Temperature", icon: "❄️", desc: "Splash cold water on your face or hold ice for 30 seconds. This triggers the mammalian dive reflex — heart rate drops immediately." },
              { letter: "I", title: "Intense Exercise", icon: "⚡", desc: "60 seconds of jumping jacks or running in place right now. Intense physical action burns the adrenaline driving your emotion." },
              { letter: "P", title: "Paced Breathing", icon: "🌬️", desc: "Inhale 4, exhale 8. Repeat 5 times. The longer exhale activates your parasympathetic nervous system within minutes." },
              { letter: "P", title: "Paired Muscle Relaxation", icon: "🤲", desc: "On each exhale, consciously release one body part — jaw first, then shoulders, chest, hands. Tension + deliberate release retrains your nervous system." },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 16, padding: "14px 0", borderBottom: i < 3 ? `1px solid rgba(${theme.breathe},0.1)` : "none" }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: theme.accent, display: "flex", alignItems: "center", justifyContent: "center", color: theme.bg, fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{s.letter}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: theme.text, marginBottom: 4 }}>{s.icon} {s.title}</div>
                  <div style={{ fontSize: 13, color: theme.accent, lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              </div>
            ))}
            <button onClick={onClose} style={{ ...btn(true), marginTop: 20 }}>Got it — I'll do this now</button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// AI COMPANION CHAT — post-session conversation (premium)
// ═══════════════════════════════════════════════════════════════
function AIChat({ emotion, responses, protocol, theme, webllm }) {
  const [messages, setMessages] = useState([{ role: "assistant", content: `I've reviewed your ${protocol?.title} session. What's coming up for you — any questions, or something you'd like to go deeper on?` }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const MAX = 10;

  const sessionContext = Object.entries(responses).map(([key, val]) => {
    const step = protocol?.steps.find(s => s.fieldKey === key);
    const display = typeof val === "object" ? val.label : val;
    return step ? `${step.title}: ${display}` : "";
  }).filter(Boolean).join("\n");

  const send = async () => {
    if (!input.trim() || loading || messages.length >= MAX) return;
    const userMsg = { role: "user", content: input.trim() };
    const next = [...messages, userMsg];
    setMessages(next); setInput(""); setLoading(true);
    let reply = null;
    if (webllm?.status === "ready") {
      const sysPrompt = `${CLINICAL_SYSTEM_PROMPT}\n\nContext: User completed ${protocol?.title} (${protocol?.basis}) for ${emotion}.\nSession:\n${sessionContext}\n\nYou are in a follow-up chat. Be warm, focused, under 120 words.`;
      reply = await webllm.generate(sysPrompt, next.map(m => `${m.role}: ${m.content}`).join("\n\n"));
    }
    if (!reply) reply = generateChatFallback(emotion, responses, userMsg.content);
    setMessages([...next, { role: "assistant", content: reply }]);
    setLoading(false);
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  const remaining = Math.floor((MAX - messages.length) / 2);

  return (
    <div style={{ background: theme.subtle, borderRadius: 20, padding: 24, marginTop: 20, border: `1px solid rgba(${theme.breathe},0.12)` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>💬</span>
          <span style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 2, color: theme.accent, fontWeight: 600 }}>Continue the Conversation ✦</span>
        </div>
        {remaining > 0 && <span style={{ fontSize: 11, color: theme.accent, opacity: 0.5 }}>{remaining} exchange{remaining !== 1 ? "s" : ""} left</span>}
      </div>
      <div style={{ maxHeight: 300, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "85%", padding: "11px 16px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: m.role === "user" ? theme.text : theme.card, color: m.role === "user" ? theme.bg : theme.text, fontSize: 14, lineHeight: 1.6, backdropFilter: "blur(10px)" }}>{m.content}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 4, padding: "11px 16px", background: theme.card, borderRadius: "16px 16px 16px 4px", width: 60 }}>
            {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: theme.accent, animation: `pulse 1s infinite ${i * 0.2}s` }} />)}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      {messages.length < MAX ? (
        <div style={{ display: "flex", gap: 8 }}>
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !loading) send(); }} placeholder="Ask a follow-up question..." style={{ flex: 1, padding: "11px 16px", fontSize: 14, border: `1px solid rgba(${theme.breathe},0.15)`, borderRadius: 50, background: theme.card, color: theme.text, fontFamily: "'DM Sans', sans-serif" }} />
          <button onClick={send} disabled={!input.trim() || loading} style={{ padding: "11px 20px", background: input.trim() && !loading ? theme.text : `rgba(${theme.breathe},0.15)`, color: input.trim() && !loading ? theme.bg : `rgba(${theme.breathe},0.4)`, border: "none", borderRadius: 50, cursor: input.trim() && !loading ? "pointer" : "not-allowed", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>Send</button>
        </div>
      ) : (
        <p style={{ fontSize: 13, color: theme.accent, opacity: 0.6, textAlign: "center", margin: 0 }}>Session complete. Consider journaling these insights for deeper reflection.</p>
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
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 400, color: theme.text, margin: 0 }}>Daily Journal</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 14, color: theme.accent, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
      </div>

      <div style={{ background: theme.subtle, borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: theme.accent, fontWeight: 600, display: "block", marginBottom: 8 }}>Today's Prompt</span>
        <p style={{ fontSize: 17, color: theme.text, lineHeight: 1.6, margin: 0, fontFamily: "'Fraunces', serif", fontStyle: "italic" }}>{prompt}</p>
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
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 400, color: theme.text, margin: 0 }}>Your Journey</h2>
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
  const [selectedQuickTool, setSelectedQuickTool] = useState(null);
  const [showQuickTool, setShowQuickTool] = useState(false);

  const webllm = useWebLLM();
  const theme = COLOR_THEMES[emotion] || COLOR_THEMES.default;
  const protocol = emotion ? PROTOCOLS[emotion] : null;
  const currentStep = protocol?.steps[step];

  // Load persisted data on mount + handle URL params for deep-linking
  useEffect(() => {
    (async () => {
      const saved = await Storage.get("sessions");
      if (saved?.length) setSessions(saved);
      const prem = await Storage.get("premium");
      if (prem) setIsPremium(true);
      setDataLoaded(true);
    })();

    // Read ?tool= and ?start= URL params to auto-launch quick tools or emotions
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const toolId = params.get("tool");
      const startId = params.get("start");
      if (toolId) {
        const found = QUICK_TOOLS.find((t) => t.id === toolId);
        if (found) {
          setSelectedQuickTool(found);
          setShowQuickTool(true);
        }
      } else if (startId) {
        const validEmotion = EMOTIONS.find((e) => e.id === startId);
        if (validEmotion) {
          setEmotion(startId);
          setScreen("session");
          setStep(0);
          setResponses({});
          setInputVal("");
          setSelected(null);
          setScaleVal(5);
          setBreathDone(false);
          setFadeKey((k) => k + 1);
        }
      }
    }
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

        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 36, display: "block", marginBottom: 8 }}>✦</span>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 400, color: theme.text, margin: "0 0 6px" }}>
            AIForj Premium
          </h3>
          <p style={{ fontSize: 13, color: theme.accent, opacity: 0.7, margin: "0 0 10px", lineHeight: 1.5 }}>
            Your personal mental wellness co-pilot.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {[
            { icon: "🧠", title: "AI Personalized Insights", desc: "Deep analysis of your session using your own words — private, on-device AI" },
            { icon: "💬", title: "AI Chat Co-Pilot", desc: "Continue the conversation after any session — ask questions, go deeper, get answers" },
            { icon: "📊", title: "Mood Analytics Dashboard", desc: "Track emotional patterns, streaks, and progress over time" },
            { icon: "📓", title: "Daily Guided Journal", desc: "20 clinician-crafted prompts for deeper self-reflection" },
            { icon: "🛡️", title: "Advanced DBT Crisis Tools", desc: "Thought Defusion + TIPP skill — DBT's most powerful emotion regulators" },
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
            Start My 7-Day Free Trial
          </button>
          <p style={{ fontSize: 11, color: theme.accent, opacity: 0.4, margin: "8px 0 0" }}>Then $9.99/month. Cancel anytime. No commitment.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)",
      background: "var(--bg-primary)", transition: "background 0.8s ease, color 0.8s ease",
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
      {showQuickTool && selectedQuickTool && (
        <QuickToolModal
          tool={selectedQuickTool}
          theme={theme}
          isPremium={isPremium}
          onUpgrade={() => { setShowQuickTool(false); setShowUpgrade(true); }}
          onClose={() => setShowQuickTool(false)}
        />
      )}

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

      {/* Session toolbar */}
      <div style={{ padding: "8px 24px", display: "flex", justifyContent: "center", alignItems: "center", gap: 8, flexWrap: "wrap", position: "relative", zIndex: 10 }}>
        {isPremium && (
          <button onClick={() => { setScreen("journal"); setFadeKey((k) => k + 1); }} style={{
            background: "var(--surface)", border: "1px solid rgba(45,42,38,0.08)", padding: "6px 14px",
            borderRadius: 20, fontSize: 11, color: "var(--text-secondary)", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          }}>📓 Journal</button>
        )}
        {isPremium && <span style={{ fontSize: 8, padding: "2px 7px", background: "linear-gradient(90deg, var(--accent-sage), var(--accent-teal))", color: "#fff", borderRadius: 8, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>PRO</span>}
        {!isPremium && (
          <button onClick={() => setShowUpgrade(true)} style={{
            background: "var(--interactive)", border: "none", padding: "6px 16px",
            borderRadius: 20, fontSize: 11, color: "#fff", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
          }}>✦ Premium</button>
        )}
        {sessions.length > 0 && screen !== "dashboard" && (
          <button onClick={() => {
            if (isPremium) { setScreen("dashboard"); setFadeKey((k) => k + 1); }
            else setShowUpgrade(true);
          }} style={{
            background: "var(--surface)", border: "1px solid rgba(45,42,38,0.08)", padding: "6px 14px",
            borderRadius: 20, fontSize: 11, color: "var(--text-secondary)", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          }}>
            {sessions.length} session{sessions.length > 1 ? "s" : ""} {!isPremium && "🔒"}
          </button>
        )}
      </div>

      {/* ─── HOME ─── */}
      {screen === "home" && (
        <div key={fadeKey} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 80px)", padding: "0 24px 80px", animation: "fadeIn 0.8s ease" }}>
          <div style={{ textAlign: "center", maxWidth: 560, marginBottom: 40 }}>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(30px, 5vw, 44px)", fontWeight: 400, color: theme.text, margin: "0 0 14px", lineHeight: 1.2, letterSpacing: -0.5 }}>
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

          {/* Quick Tools Row */}
          <div style={{ width: "100%", maxWidth: 700, marginTop: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: theme.accent, fontWeight: 600, opacity: 0.7 }}>Quick Tools</span>
              <span style={{ fontSize: 11, color: theme.accent, opacity: 0.4 }}>— instant interventions, no session needed</span>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {QUICK_TOOLS.map((tool) => (
                <button key={tool.id} onClick={() => { setSelectedQuickTool(tool); setShowQuickTool(true); }} style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "10px 16px",
                  background: theme.card, border: `1px solid rgba(${theme.breathe},0.08)`,
                  borderRadius: 30, cursor: "pointer", transition: "all 0.2s", backdropFilter: "blur(10px)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onMouseEnter={el => { el.currentTarget.style.background = `rgba(${theme.breathe},0.1)`; el.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={el => { el.currentTarget.style.background = theme.card; el.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <span style={{ fontSize: 16 }}>{tool.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: theme.text }}>{tool.label}</span>
                  <span style={{ fontSize: 11, color: theme.accent, opacity: 0.5 }}>{tool.time}</span>
                  {!tool.free && <span style={{ fontSize: 10, padding: "2px 6px", background: theme.accent, color: theme.bg, borderRadius: 8, fontWeight: 600 }}>PRO</span>}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 48, textAlign: "center", maxWidth: 480 }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: 16 }}>
              {["CBT", "DBT", "ACT", "IPT", "MBSR", "Behavioral Activation", "Positive Psychology"].map((t) => (
                <span key={t} style={{ padding: "4px 12px", background: theme.subtle, borderRadius: 12, fontSize: 11, color: theme.accent, letterSpacing: 0.5 }}>{t}</span>
              ))}
            </div>
            <p style={{ fontSize: 12, color: theme.accent, opacity: 0.5, lineHeight: 1.6 }}>
              Built by AIForj Team and clinically informed by a Licensed Healthcare Provider.
              <br />Science-backed. AI-powered.
            </p>
          </div>

          <EmailCapture />
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
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 400, color: theme.text, margin: "0 0 12px" }}>{currentStep.title}</h2>
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
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 400, color: theme.text, margin: "0 0 6px" }}>Session Complete</h2>
              <p style={{ fontSize: 13, color: theme.accent, opacity: 0.7, letterSpacing: 1 }}>{protocol.title} · {protocol.basis}</p>
            </div>

            <AIInsight emotion={emotion} responses={responses} protocol={protocol} theme={theme} isPremium={isPremium} onUpgrade={() => setShowUpgrade(true)} webllm={webllm} />

            <ShareCard emotion={emotion} protocol={protocol} insight={isPremium ? undefined : undefined} theme={theme} />

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

            {isPremium ? (
              <AIChat emotion={emotion} responses={responses} protocol={protocol} theme={theme} webllm={webllm} />
            ) : (
              <div onClick={() => setShowUpgrade(true)} style={{ marginTop: 20, padding: "20px 24px", background: theme.subtle, borderRadius: 20, border: `1px dashed rgba(${theme.breathe},0.2)`, cursor: "pointer", textAlign: "center" }}>
                <span style={{ fontSize: 16 }}>💬</span>
                <span style={{ fontSize: 13, color: theme.accent, marginLeft: 8, fontWeight: 500 }}>Continue the conversation with your AI co-pilot</span>
                <span style={{ display: "block", fontSize: 11, color: theme.accent, opacity: 0.5, marginTop: 4 }}>Premium — tap to unlock</span>
              </div>
            )}

            <div style={{ marginTop: 28, padding: 20, background: theme.subtle, borderRadius: 16, textAlign: "center" }}>
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

      {screen === "home" && <SiteFooter />}
    </div>
  );
}
