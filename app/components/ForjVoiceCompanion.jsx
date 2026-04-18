"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import EmailCapture from "./EmailCapture";
import DataManagement from "./DataManagement";
import { FORJ_MODALITY_COUNT } from "../../lib/forjModalities";
import { getPremiumAccessStatus } from "../../utils/premiumAccess";

// ═══════════════════════════════════════════════════════════════════════════
//
//  AIForj VOICE COMPANION — "Talk to Forj"
//
//  The world's first voice-based, clinically informed, completely private
//  AI therapeutic companion.
//
//  16 therapeutic modalities with dynamic selection
//  Built by AIForj Team and clinically informed by a Licensed Healthcare Provider
//  100% browser-based — nothing leaves the device
//
//  ARCHITECTURE:
//  Web Speech API → captures user's voice
//  Clinical AI Engine → processes with dynamic technique selection
//  Speech Synthesis → responds in calm voice
//  Session Intelligence → tracks techniques used, emotional trajectory
//
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────
// TIER CONFIGURATION
// ─────────────────────────────────────────────────
const TIERS = {
  free: {
    name: "Free",
    sessionsPerDay: 3,
    maxMessagesPerSession: 8,
    features: {
      privateBrowserAI: true,
      voiceInput: true,
      textInput: true,
      basicTherapeuticResponse: true,
      breathingExercise: true,
      groundingExercise: true,
      crisisDetection: true,
      sessionTakeaway: true,
      sessionHistory: false,
      moodTracking: false,
      sessionInsights: false,
      continuityMemory: false,
      sessionNotes: false,
      deeperContext: false,
      deepWorkModes: false,
      advancedTechniques: false, // schema therapy, IFS parts work, narrative therapy
      unlimitedMessages: false,
      exportNotes: false,
      guidedMeditation: false,
      weeklyReport: false,
    }
  },
  trial: {
    name: "Free Trial",
    daysRemaining: 7,
    sessionsPerDay: Infinity,
    maxMessagesPerSession: Infinity,
    features: {
      privateBrowserAI: true, voiceInput: true, textInput: true, basicTherapeuticResponse: true,
      breathingExercise: true, groundingExercise: true, crisisDetection: true, sessionTakeaway: true,
      sessionHistory: true, moodTracking: true, sessionInsights: true, continuityMemory: true,
      sessionNotes: true, deeperContext: true, deepWorkModes: true,
      advancedTechniques: true, unlimitedMessages: true, exportNotes: true,
      guidedMeditation: true, weeklyReport: true,
    }
  },
  premium: {
    name: "Premium",
    price: "$9.99/month",
    sessionsPerDay: Infinity,
    maxMessagesPerSession: Infinity,
    features: {
      privateBrowserAI: true, voiceInput: true, textInput: true, basicTherapeuticResponse: true,
      breathingExercise: true, groundingExercise: true, crisisDetection: true, sessionTakeaway: true,
      sessionHistory: true, moodTracking: true, sessionInsights: true, continuityMemory: true,
      sessionNotes: true, deeperContext: true, deepWorkModes: true,
      advancedTechniques: true, unlimitedMessages: true, exportNotes: true,
      guidedMeditation: true, weeklyReport: true,
    }
  },
};

// ─────────────────────────────────────────────────
// THE CLINICAL INTELLIGENCE ENGINE
// This is the brain of the entire product.
// Dynamic technique selection across 16 modalities.
// ─────────────────────────────────────────────────
const CLINICAL_SYSTEM_PROMPT = `You are FORJ — the AI voice companion inside AIForj.com. You were designed by AIForj Team and clinically informed by a Licensed Healthcare Provider. You are a clinically-informed, evidence-based AI wellness companion.

═══════════════════════════════════════
IDENTITY & BOUNDARIES
═══════════════════════════════════════

You are a wellness companion — warm, wise, clinically informed, deeply empathetic.
You are NOT a licensed therapist. You do NOT diagnose. You do NOT prescribe medication. You do NOT replace professional treatment.
You are like the most brilliant, compassionate friend someone could have — one who happens to deeply understand therapeutic frameworks.

═══════════════════════════════════════
DYNAMIC TECHNIQUE SELECTION ENGINE
═══════════════════════════════════════

You have mastery across these therapeutic modalities. Based on what the person says, you DYNAMICALLY select the most appropriate technique(s). You do not ask which technique they want — you read their words, assess their state, and apply the right approach seamlessly.

TECHNIQUE LIBRARY:

1. COGNITIVE BEHAVIORAL THERAPY (CBT)
   Use when: Person describes negative automatic thoughts, cognitive distortions, anxious predictions, rumination
   Tools: Thought challenging, cognitive restructuring, Socratic questioning, behavioral experiments, evidence examination
   Key move: "What is the evidence for that thought? And what is the evidence against it?"
   Distortions to identify: catastrophizing, mind-reading, fortune-telling, all-or-nothing, mental filtering, should statements, emotional reasoning, labeling, personalization, discounting the positive

2. DIALECTICAL BEHAVIOR THERAPY (DBT)
   Use when: Person describes intense emotions, emotional dysregulation, relationship conflict, impulsive urges, self-destructive patterns, black-and-white thinking
   Tools: TIPP skills (Temperature, Intense exercise, Paced breathing, Progressive relaxation), opposite action, distress tolerance, radical acceptance, wise mind, interpersonal effectiveness (DEAR MAN)
   Key move: "Two things can be true at the same time — this is really hard AND you can get through it."

3. ACCEPTANCE & COMMITMENT THERAPY (ACT)
   Use when: Person is fighting against reality, trying to control thoughts/feelings, avoiding discomfort, disconnected from values, feeling stuck
   Tools: Cognitive defusion ("I notice I'm having the thought that..."), acceptance, present-moment awareness, values clarification, committed action, self-as-context
   Key move: "What if you didn't have to make that feeling go away — what would you do right now that matters to you?"

4. INTERPERSONAL THERAPY (IPT)
   Use when: Person describes loneliness, relationship problems, grief, role transitions (new job, breakup, parenthood, retirement), social isolation
   Tools: Communication analysis, role-playing difficult conversations, grief processing, identifying interpersonal patterns, social rhythm management
   Key move: "It sounds like this loneliness is connected to [specific interpersonal event]. Let's look at that connection."

5. BEHAVIORAL ACTIVATION (BA)
   Use when: Person describes depression, low motivation, withdrawal, avoidance, fatigue, "can't get started", feeling flat
   Tools: Activity scheduling, avoidance hierarchy, the 5-minute rule, mastery-pleasure tracking, commitment prompts, reward design
   Key move: "Motivation follows action — not the other way around. What's the absolute smallest step?"

6. MINDFULNESS-BASED STRESS REDUCTION (MBSR)
   Use when: Person describes chronic stress, racing mind, inability to be present, physical tension, overwhelm
   Tools: Body scan, mindful breathing, present-moment anchoring, non-judgmental awareness, noting practice
   Key move: "Let's pause right here. What do you notice in your body right now, in this exact moment?"

7. POLYVAGAL THEORY / NERVOUS SYSTEM REGULATION
   Use when: Person describes numbness, dissociation, freeze response, shutdown, hyperarousal, feeling "unsafe" in their body
   Tools: Ventral vagal activation, orienting response, co-regulation concepts, autonomic ladder awareness, safe-enough environment creation, vagal toning (extended exhale breathing, humming, cold exposure)
   Key move: "That numbness isn't apathy — it's your nervous system's freeze response. It's actually trying to protect you."

8. SOMATIC EXPERIENCING (SE)
   Use when: Person describes physical symptoms of distress, body-stored tension, trauma responses manifesting physically, chronic pain with emotional roots
   Tools: Body awareness, titration (small doses of activation), pendulation (moving between activation and calm), resourcing, tracking physical sensations
   Key move: "Where do you feel that in your body right now? Can you describe the sensation — is it tight, heavy, hot, cold?"

9. EMOTION-FOCUSED THERAPY (EFT)
   Use when: Person struggles to identify, express, or process emotions, suppresses feelings, intellectualizes
   Tools: Emotional awareness, naming emotions precisely (emotional granularity), chair technique concepts, accessing primary adaptive emotions underneath secondary reactive ones
   Key move: "If that sadness could speak one sentence, what would it say?"

10. MOTIVATIONAL INTERVIEWING (MI)
    Use when: Person is ambivalent about change, resistant, exploring whether to take action, knows what they "should" do but can't
    Tools: Open questions, affirmations, reflective listening, summarizing, developing discrepancy, supporting self-efficacy, rolling with resistance
    Key move: "On one hand you want X, and on the other hand Y is getting in the way. What matters most to you here?"

11. POSITIVE PSYCHOLOGY
    Use when: Person is doing well and wants to optimize, or needs strength-building, gratitude, flow, meaning
    Tools: Gratitude exercises, character strengths identification, future-self visualization, flow state cultivation, meaning-making, identity-based habits
    Key move: "You're doing well — let's build on that. What's one thing about today you want to carry forward?"

12. SOLUTION-FOCUSED BRIEF THERAPY (SFBT)
    Use when: Person is stuck in problem-saturated narratives, needs future orientation, quick wins
    Tools: Miracle question, scaling questions, exception-finding, coping questions, complimenting
    Key move: "If you woke up tomorrow and this problem was magically solved — what's the first thing you'd notice that was different?"

13. NARRATIVE THERAPY
    Use when: Person has internalized negative self-stories, identity-level distress, shame-based narratives
    Tools: Externalizing the problem ("The depression tells you..."), re-authoring, unique outcomes, thickening the counter-narrative
    Key move: "That voice that says you're not enough — is that YOUR voice, or one you inherited?"

14. SCHEMA THERAPY (for deeper patterns — PREMIUM)
    Use when: Person describes lifelong patterns, core beliefs about self/others/world, childhood-rooted issues
    Tools: Schema identification (abandonment, defectiveness, failure, subjugation, etc.), limited reparenting concepts, healthy adult mode activation
    Key move: "This pattern seems to go way back. What's the earliest version of this feeling you can remember?"

15. INTERNAL FAMILY SYSTEMS (IFS) / PARTS WORK (PREMIUM)
    Use when: Person describes internal conflict, self-sabotage, competing desires, inner critic
    Tools: Parts identification, Self-energy, unburdening, inner critic work, exile-protector dynamics
    Key move: "It sounds like one part of you wants to push forward, but another part is trying to protect you from something. Can we get curious about that protective part?"

16. TRAUMA-INFORMED STABILIZATION
    Use when: Person references trauma, PTSD symptoms, flashbacks, hypervigilance, avoidance of trauma-related stimuli
    Tools: Grounding, containment (imaginal safe place), window of tolerance awareness, psychoeducation about trauma responses, resourcing
    Key move: "What you're describing is a normal response to an abnormal situation. Your brain is doing exactly what it learned to do to keep you safe."
    IMPORTANT: Do NOT do trauma reprocessing. Focus on STABILIZATION, grounding, and safety. Refer to professional for deep trauma work.

═══════════════════════════════════════
GUIDED EXERCISES YOU CAN INITIATE
═══════════════════════════════════════

When appropriate, you can guide the person through these IN REAL-TIME during the conversation:

BREATHING EXERCISES:
- 4-4-6 Pattern: "Breathe in for 4... hold for 4... exhale slowly for 6. Let's do this together." (for anxiety, general calming)
- Physiological Sigh: "Take a quick double inhale through your nose — sniff sniff — then a long slow exhale through your mouth." (fastest stress relief — Stanford research)
- Box Breathing: "In for 4, hold for 4, out for 4, hold for 4." (for focus and grounding)

GROUNDING:
- 5-4-3-2-1: Guide them through naming 5 things they see, 4 they can touch, 3 they hear, 2 they smell, 1 they taste
- Orienting: "Look around the room slowly. Name 3 things you see. This tells your nervous system you're safe."

BODY SCAN:
- "Starting from your feet... notice any sensation... move up to your calves... what do you notice?"

CONTAINMENT:
- "Imagine a container — a box, a vault, a chest. Place that worry inside it. Close the lid. It's still there — you're not ignoring it — but you're choosing when to open it."

SELF-COMPASSION BREAK (Kristin Neff):
- Step 1: "This is a moment of suffering." (mindfulness)
- Step 2: "Suffering is a part of being human." (common humanity)
- Step 3: "May I be kind to myself in this moment." (self-kindness)

═══════════════════════════════════════
CONVERSATION RULES
═══════════════════════════════════════

1. KEEP RESPONSES TO 2-4 SENTENCES. This is voice. Long responses feel like lectures. Be concise but powerful.
2. USE THEIR OWN WORDS back to them. This is the single most powerful therapeutic technique.
3. ASK ONE QUESTION at a time. Never stack questions.
4. VALIDATE BEFORE GUIDING. Always acknowledge the feeling before offering a technique.
5. NAME THE TECHNIQUE occasionally: "In CBT, we'd call that catastrophizing..." This builds their mental health literacy.
6. NEVER SAY "That's a great question" or "I understand" as filler. Be direct and genuine.
7. NEVER DIAGNOSE. If they ask "do I have depression/anxiety/etc" say "I can't diagnose, but what you're describing sounds really heavy. A professional evaluation could give you clarity — and I'm here with you either way."
8. MATCH THEIR ENERGY. Low energy → be gentle and quiet. High anxiety → be grounding and steady. Anger → be calm and validating without dismissing.
9. When they first connect, greet them warmly and simply ask how they're feeling right now.

═══════════════════════════════════════
CRISIS PROTOCOL — HIGHEST PRIORITY
═══════════════════════════════════════

If the person expresses ANY of the following:
- Suicidal thoughts, plans, or intent
- Self-harm urges or actions
- Desire to hurt others
- Descriptions of abuse they're currently experiencing
- Severe dissociation or psychotic symptoms

IMMEDIATELY AND WARMLY respond with:
"I hear you, and I want you to know that what you're feeling is important. This is beyond what I can help with safely — I want to make sure you get the right support right now. Please reach out to:

988 Suicide & Crisis Lifeline — call or text 988
Crisis Text Line — text HOME to 741741

You deserve real human support right now. Will you reach out to one of these?"

Do NOT attempt to "therapy" a crisis. Provide resources and warmth. Then continue to be supportive if they keep talking, while gently reinforcing the importance of professional support.

═══════════════════════════════════════
SESSION AWARENESS
═══════════════════════════════════════

Track the emotional arc of the conversation. Notice if:
- They're escalating (increase grounding, use TIPP skills)
- They're shutting down (soften, slow down, use gentle curiosity)
- They're intellectualizing (gently redirect to feelings and body)
- They're making progress (reflect it back, reinforce)
- They're ready to end (summarize what you noticed, give one takeaway)

When a session naturally concludes, offer a brief reflection:
"Before you go — you came in feeling [X] and I noticed [Y shift]. The technique that seemed to land was [Z]. One thing to carry with you: [actionable insight]."`;

// ─────────────────────────────────────────────────
// STORAGE LAYER
// ─────────────────────────────────────────────────
const DB = {
  async get(key) {
    try {
      if (typeof window === "undefined") return null;
      const v = localStorage.getItem(`forj_${key}`);
      return v ? JSON.parse(v) : null;
    } catch { return null; }
  },
  async set(key, val) {
    try {
      if (typeof window === "undefined") return;
      localStorage.setItem(`forj_${key}`, JSON.stringify(val));
    } catch {}
  },
};

const LOCAL_WEBLLM_MODELS = {
  standard: {
    id: "Phi-3.5-mini-instruct-q4f16_1-MLC",
    label: "Forj Private AI",
    description: "full local reasoning",
  },
  lightweight: {
    id: "Llama-3.2-1B-Instruct-q4f16_1-MLC",
    label: "Forj Private AI Lite",
    description: "lighter local reasoning",
  },
};

const COMPANION_SIGNAL_LIBRARY = [
  {
    id: "anxiety",
    label: "Anxiety / spiraling",
    terms: ["anxious", "anxiety", "worry", "panic", "spiral", "overthinking", "what if", "racing", "can't stop thinking", "fear"],
    primaryMode: "Regulate",
    focus: "slow the nervous system first, then reality-check the fear",
    modalities: ["CBT", "ACT", "Grounding"],
    techniques: [
      { name: "Facts vs predictions", desc: "Separate what you know from what you fear." },
      { name: "Longer exhale", desc: "Bring arousal down before analyzing the thought." },
    ],
    nextStep: "Name the loudest fear, then write one fact for it and one fact against it.",
    microPlan: [
      "Now: lengthen your exhale for one minute.",
      "Later today: write facts versus predictions.",
      "Next time: catch the spiral at the first 'what if'.",
    ],
    headline: "Slow the spiral and get back to what is real.",
  },
  {
    id: "overwhelm",
    label: "Overwhelm / too much",
    terms: ["overwhelmed", "too much", "can't handle", "drowning", "swamped", "buried", "everything at once", "can't keep up"],
    primaryMode: "Simplify",
    focus: "reduce the open loops until the next right step is visible",
    modalities: ["DBT", "Behavioral Activation", "Stress Regulation"],
    techniques: [
      { name: "One thing only", desc: "Shrink the field of attention to the next concrete move." },
      { name: "Externalize the load", desc: "Get the mental pile out of your head and onto the page." },
    ],
    nextStep: "Choose the single most urgent pressure point and do only the first visible step.",
    microPlan: [
      "Now: pick one thing and ignore the rest for ten minutes.",
      "Later today: brain-dump every open loop onto paper.",
      "Next time: reduce the pile before it becomes a wave.",
    ],
    headline: "Reduce the pile until one next step is visible.",
  },
  {
    id: "sadness",
    label: "Sadness / heaviness",
    terms: ["sad", "down", "depressed", "hopeless", "empty", "crying", "grief", "heartbroken", "nothing matters"],
    primaryMode: "Hold",
    focus: "validate the pain before asking the system to move",
    modalities: ["Emotion-Focused", "Self-Compassion", "Behavioral Activation"],
    techniques: [
      { name: "Name the feeling", desc: "Put language around the pain instead of fighting it." },
      { name: "Gentle activation", desc: "Choose one kind action before waiting for motivation." },
    ],
    nextStep: "Ask what the sadness is trying to say, then pair it with one gentle action.",
    microPlan: [
      "Now: name the feeling without arguing with it.",
      "Later today: do one kind action that takes under five minutes.",
      "Next time: notice sadness sooner, before it turns into shutdown.",
    ],
    headline: "Make room for the feeling and pair it with one kind action.",
  },
  {
    id: "anger",
    label: "Anger / friction",
    terms: ["angry", "furious", "rage", "frustrated", "resent", "pissed", "mad", "unfair"],
    primaryMode: "Cool down",
    focus: "separate the valid feeling from the action you will regret",
    modalities: ["DBT", "CBT", "Boundary Work"],
    techniques: [
      { name: "Check the facts", desc: "Sort what happened from the meaning your mind added." },
      { name: "Boundary signal", desc: "Translate anger into the need it is protecting." },
    ],
    nextStep: "Name the need under the anger before deciding what to do with it.",
    microPlan: [
      "Now: pause before acting while the intensity comes down.",
      "Later today: write the boundary or need beneath the anger.",
      "Next time: catch the surge before it becomes the whole story.",
    ],
    headline: "Honor the anger without letting it drive the car.",
  },
  {
    id: "connection",
    label: "Loneliness / relationship pain",
    terms: ["lonely", "alone", "isolated", "abandoned", "relationship", "breakup", "partner", "friend", "family", "nobody", "left out"],
    primaryMode: "Reconnect",
    focus: "name the attachment need clearly and move toward one low-pressure bid for connection",
    modalities: ["IPT", "Attachment", "Self-Compassion"],
    techniques: [
      { name: "Attachment clarity", desc: "Name whether you need closeness, repair, or reassurance." },
      { name: "Low-pressure reach-out", desc: "Choose the smallest possible step toward connection." },
    ],
    nextStep: "Decide what kind of connection you need, then make one gentle bid for it.",
    microPlan: [
      "Now: name the connection need underneath the pain.",
      "Later today: send one low-pressure text or reply.",
      "Next time: notice the need earlier instead of only the ache.",
    ],
    headline: "Turn loneliness into a clear bid for connection.",
  },
  {
    id: "self-worth",
    label: "Self-worth / inner critic",
    terms: ["not good enough", "worthless", "failure", "failing", "imposter", "fraud", "hate myself", "ashamed", "embarrassed", "broken", "inner critic", "same pattern", "keep repeating", "self-sabotage"],
    primaryMode: "Reframe",
    focus: "separate your identity from the critic's story",
    modalities: ["Narrative", "Self-Compassion", "CBT"],
    techniques: [
      { name: "Critic externalization", desc: "Treat the harsh story as a voice, not the truth." },
      { name: "Counter-evidence", desc: "Look for lived evidence that you are more than the label." },
    ],
    nextStep: "Write down the critic sentence, then answer it with one honest counter-truth.",
    microPlan: [
      "Now: notice the critic voice without merging with it.",
      "Later today: write one piece of counter-evidence.",
      "Next time: catch the label before it becomes identity.",
    ],
    headline: "Loosen the grip of the inner critic.",
  },
  {
    id: "numb",
    label: "Numbness / shutdown",
    terms: ["numb", "can't feel", "flat", "shutdown", "dissociat", "detached", "checked out", "autopilot"],
    primaryMode: "Re-enter gently",
    focus: "use sensation and orientation, not force, to come back online",
    modalities: ["Polyvagal", "Somatic", "Mindfulness"],
    techniques: [
      { name: "Orienting", desc: "Use your senses to tell your body you are here now." },
      { name: "Gentle sensation", desc: "Use texture, temperature, and movement to thaw shutdown." },
    ],
    nextStep: "Use one sensory cue to re-enter the room before expecting emotion to return.",
    microPlan: [
      "Now: use temperature or texture to re-engage your senses.",
      "Later today: take one short movement break with full attention.",
      "Next time: treat numbness as a nervous-system state, not a character flaw.",
    ],
    headline: "Come back online gently instead of forcing yourself to feel.",
  },
  {
    id: "motivation",
    label: "Stuck / low motivation",
    terms: ["unmotivated", "can't start", "no energy", "procrast", "avoid", "stuck", "why bother", "drained", "burnt out"],
    primaryMode: "Activate",
    focus: "turn intention into the smallest possible movement",
    modalities: ["Behavioral Activation", "ACT", "Solution-Focused"],
    techniques: [
      { name: "Five-minute start", desc: "Make the barrier to action almost laughably small." },
      { name: "Values cue", desc: "Connect the task to what matters rather than mood." },
    ],
    nextStep: "Choose a five-minute version of the task and start before you feel ready.",
    microPlan: [
      "Now: do the smallest possible version for five minutes.",
      "Later today: connect the task to one value you care about.",
      "Next time: remember that action can create motivation, not just follow it.",
    ],
    headline: "Trade waiting-for-motivation for one tiny start.",
  },
  {
    id: "stress",
    label: "Stress / pressure",
    terms: ["stress", "stressed", "pressure", "deadline", "tense", "can't relax", "too many things", "work is killing me"],
    primaryMode: "Triage",
    focus: "sort what is controllable from what needs acceptance for now",
    modalities: ["ACT", "Stress Regulation", "Mindfulness"],
    techniques: [
      { name: "Control sort", desc: "Split the stress load into change, accept, and defer." },
      { name: "Body check-in", desc: "Name where the pressure lives in your body." },
    ],
    nextStep: "Make one control/accept/defer list and act only on the controllable piece.",
    microPlan: [
      "Now: name the most controllable part of the pressure.",
      "Later today: sort the rest into change, accept, or defer.",
      "Next time: catch pressure in the body before it floods the mind.",
    ],
    headline: "Sort the pressure so only the next controllable piece remains.",
  },
  {
    id: "trauma",
    label: "Trauma response / high threat",
    terms: ["trauma", "ptsd", "flashback", "triggered", "hypervigilant", "abuse", "nightmare"],
    primaryMode: "Stabilize",
    focus: "ground in the present and do not move into deep reprocessing",
    modalities: ["Trauma-Informed Stabilization", "Grounding", "Polyvagal"],
    techniques: [
      { name: "Orient to safety", desc: "Use the room around you to remind the nervous system of the present." },
      { name: "Window of tolerance", desc: "Stay inside stabilization, not deep processing." },
    ],
    nextStep: "Orient to the room, slow the body, and stay inside present-moment safety.",
    microPlan: [
      "Now: look around and name three things you can see.",
      "Later today: create a short grounding list you can reuse quickly.",
      "Next time: stabilize first and reach for human support sooner.",
    ],
    headline: "Stay with safety and stabilization, not deeper reprocessing.",
  },
];

function clipText(text, maxLength = 120) {
  if (!text) return "";
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 1).trim()}…`;
}

function getPrimarySignal(text, history = []) {
  const combined = [text, ...history.filter((message) => message.role === "user").slice(-3).map((message) => message.text)]
    .join(" ")
    .toLowerCase();

  const scored = COMPANION_SIGNAL_LIBRARY.map((signal) => ({
    ...signal,
    score: signal.terms.reduce((count, term) => count + (combined.includes(term) ? 1 : 0), 0),
  })).sort((a, b) => b.score - a.score);

  return scored[0]?.score ? scored[0] : {
    id: "general",
    label: "General distress / reflection",
    primaryMode: "Reflect",
    focus: "help the person feel understood, then find the next useful move",
    modalities: ["Reflective Listening", "Mindfulness"],
    techniques: [
      { name: "Reflect and clarify", desc: "Slow down and name what feels most present." },
      { name: "One next step", desc: "Leave the conversation with one useful action." },
    ],
    nextStep: "Name what feels most present, then choose one small next step.",
    microPlan: [
      "Now: name what feels most present without editing it.",
      "Later today: do one thing that supports your nervous system.",
      "Next time: come back to the most important part sooner.",
    ],
    headline: "Clarify what matters most right now.",
  };
}

function buildSessionPlanner(userText, history, tier, premiumModeId = "steady") {
  let signal = getPrimarySignal(userText, history);
  const combined = [userText, ...history.filter((message) => message.role === "user").slice(-5).map((message) => message.text)]
    .join(" ")
    .toLowerCase();
  const deeperPattern = /same pattern|always|every relationship|ever since|childhood|inner critic|part of me|goes back|keep repeating/.test(combined);
  const mode = getPremiumConversationMode(premiumModeId);

  if (tier !== "free" && deeperPattern && signal.id === "general") {
    signal = {
      ...signal,
      label: "Recurring pattern / inner conflict",
      primaryMode: "Map the loop",
      focus: "connect the present trigger to the recurring loop and interrupt it earlier",
      modalities: ["Reflective Listening", "Schema", "IFS / Parts Work"],
      techniques: [
        { name: "Pattern map", desc: "Name the trigger, the belief it wakes up, and the move you usually make next." },
        { name: "Protective part", desc: "Get curious about the part of you that thinks the old strategy is keeping you safe." },
      ],
      nextStep: "Name the loop, then choose the first place you want to interrupt it next time.",
      microPlan: [
        "Now: name the loop in one sentence.",
        "Later today: write the trigger, story, and usual reaction.",
        "Next time: interrupt the loop at the earliest recognizable moment.",
      ],
      headline: "Name the loop before it runs the show.",
    };
  }

  let modalities = [...signal.modalities];
  let techniques = [...signal.techniques];
  let primaryMode = signal.primaryMode;
  let focus = signal.focus;
  let nextStep = signal.nextStep;
  let microPlan = [...signal.microPlan];
  let headline = signal.headline;

  if (tier !== "free" && deeperPattern) {
    if (!modalities.includes("Schema")) modalities.push("Schema");
    if (!modalities.includes("IFS / Parts Work")) modalities.push("IFS / Parts Work");
    techniques.push({
      name: "Pattern lens",
      desc: "Link the immediate trigger to the older pattern without losing sight of the present.",
    });
  }

  if (tier !== "free") {
    if (mode.id === "steady") {
      primaryMode = "Steady Me";
      focus = "bring the nervous system down, simplify the emotional load, and leave with one stabilizing step";
      techniques = [
        { name: "Regulation first", desc: "Slow the body before trying to solve the whole story." },
        ...techniques,
      ];
      if (!modalities.includes("Mindfulness")) modalities.unshift("Mindfulness");
      headline = `Steady yourself before you solve it.`;
      nextStep = `Do one nervous-system calming step before revisiting the rest: ${signal.nextStep.toLowerCase()}`;
      microPlan = [
        "Now: calm the body first.",
        ...signal.microPlan.slice(1),
      ];
    }

    if (mode.id === "pattern") {
      primaryMode = "Pattern";
      focus = "name the recurring loop, the story it wakes up, and the protective move you usually make next";
      if (!modalities.includes("Schema")) modalities.unshift("Schema");
      if (!modalities.includes("IFS / Parts Work")) modalities.splice(1, 0, "IFS / Parts Work");
      techniques = [
        { name: "Loop mapping", desc: "Trace trigger, belief, emotion, and reaction in sequence." },
        { name: "Protective strategy", desc: "Notice how the old move is trying to protect you, even if it now costs you." },
        ...techniques,
      ];
      headline = "See the recurring loop clearly enough to interrupt it.";
      nextStep = "Name the trigger, the story it wakes up, and the move you want to interrupt next time.";
      microPlan = [
        "Now: name the loop in one sentence.",
        "Later today: write trigger -> story -> reaction -> cost.",
        "Next time: interrupt the loop at the earliest recognizable moment.",
      ];
    }

    if (mode.id === "plan") {
      primaryMode = "Plan";
      focus = "turn reflection into a concrete plan with one next step, one fallback step, and one thing to revisit later";
      if (!modalities.includes("Solution-Focused")) modalities.unshift("Solution-Focused");
      techniques = [
        { name: "Concrete next step", desc: "Translate insight into a visible action you can do soon." },
        { name: "Fallback plan", desc: "Decide what you will do if the first plan feels too hard in the moment." },
        ...techniques,
      ];
      headline = "Leave with a plan you can actually use today.";
      nextStep = "Choose one next step, one fallback step if you get stuck, and one thing to revisit tonight.";
      microPlan = [
        "Now: choose the next visible action.",
        "Later today: set a fallback move for the hard moment.",
        "Tonight: review what helped and what still needs attention.",
      ];
    }

    if (mode.id === "deep-work") {
      primaryMode = "Deep Work";
      focus = "use longer context, deeper pattern recognition, and richer therapeutic language without losing practical grounding";
      if (!modalities.includes("Narrative")) modalities.unshift("Narrative");
      if (!modalities.includes("Schema")) modalities.splice(1, 0, "Schema");
      if (!modalities.includes("IFS / Parts Work")) modalities.splice(2, 0, "IFS / Parts Work");
      techniques = [
        { name: "Deeper pattern lens", desc: "Look beneath the immediate feeling for the recurring story or role underneath it." },
        { name: "Meaning + action", desc: "Pair the deeper insight with one grounded action so the session still changes something real." },
        ...techniques,
      ];
      headline = "Go deeper without losing the ground beneath you.";
      nextStep = "Name the deeper pattern that is here, then pair that insight with one grounded action before the day ends.";
      microPlan = [
        "Now: name the deeper pattern or role that showed up.",
        "Later today: write what that pattern is trying to protect.",
        "Before bed: choose one grounded action that reflects the version of you you want to strengthen.",
      ];
    }
  }

  return {
    ...signal,
    primaryMode,
    focus,
    modalities,
    techniques,
    deeperPattern,
    conversationMode: mode,
    nextStep,
    microPlan,
    headline,
  };
}

function buildCompanionSystemPrompt({ tier, planner, memory }) {
  const recurringThemes = memory?.recurringThemes?.slice(0, 3).map((item) => item.label).join(", ");
  const helpfulApproaches = memory?.helpfulApproaches?.slice(0, 3).map((item) => item.label).join(", ");
  const focusTrail = memory?.currentFocus?.slice(0, 2).map((item) => item.label).join(" | ");

  return `${CLINICAL_SYSTEM_PROMPT}

CURRENT SESSION FOCUS
- Primary state: ${planner.label}
- Support mode: ${planner.primaryMode}
- Premium mode: ${planner.conversationMode?.label || "Auto"}
- Lead modalities: ${planner.modalities.join(", ")}
- Best next move: ${planner.focus}

${tier === "free"
    ? "FREE MODE: prioritize immediate relief, one clear reflection, and one practical next step. Stay depth-aware, but do not overcomplicate."
    : `PREMIUM MODE: ${planner.conversationMode?.description || "use continuity, deeper pattern recognition, and multi-step guidance when it fits."} You may use schema and parts language when clearly relevant.`}

${recurringThemes ? `ON-DEVICE LONGITUDINAL MEMORY\n- Recurring themes: ${recurringThemes}\n- What tends to help: ${helpfulApproaches || "Not enough data yet"}\n- Current focus: ${focusTrail || "Not enough data yet"}` : ""}`.trim();
}

function mergeRankedEntries(existing = [], labels = [], maxItems = 5) {
  const scores = new Map(existing.map((item) => [item.label, item.score || 1]));

  labels.filter(Boolean).forEach((label) => {
    scores.set(label, (scores.get(label) || 0) + 1);
  });

  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxItems)
    .map(([label, score]) => ({ label, score }));
}

function buildSessionSummary(messages, planner) {
  const userMessages = messages.filter((message) => message.role === "user");
  const latestUser = userMessages[userMessages.length - 1];
  if (!latestUser) return null;

  const startedAt = messages[0]?.ts || Date.now();
  const endedAt = messages[messages.length - 1]?.ts || Date.now();
  const durationMinutes = Math.max(1, Math.round((endedAt - startedAt) / 60000));
  const focusText = clipText(latestUser.text, 96);

  return {
    createdAt: new Date(endedAt).toISOString(),
    headline: planner.headline,
    stateLabel: planner.label,
    primaryMode: planner.primaryMode,
    conversationModeLabel: planner.conversationMode?.label || null,
    focusText,
    techniques: planner.techniques,
    modalities: planner.modalities,
    nextStep: planner.nextStep,
    microPlan: planner.microPlan,
    messageCount: userMessages.length,
    durationMinutes,
    shareableLine: `Today I used AIForj to work through ${planner.label.toLowerCase()} and leave with one concrete next step.`,
  };
}

function mergeCompanionMemory(existingMemory, summary) {
  const base = existingMemory || {
    updatedAt: null,
    recurringThemes: [],
    helpfulApproaches: [],
    currentFocus: [],
    recentSessions: [],
  };

  if (!summary) return base;

  return {
    updatedAt: summary.createdAt,
    recurringThemes: mergeRankedEntries(base.recurringThemes, [summary.stateLabel]),
    helpfulApproaches: mergeRankedEntries(base.helpfulApproaches, summary.techniques.map((technique) => technique.name)),
    currentFocus: mergeRankedEntries(base.currentFocus, [summary.focusText], 4),
    recentSessions: [
      {
        createdAt: summary.createdAt,
        headline: summary.headline,
        nextStep: summary.nextStep,
        stateLabel: summary.stateLabel,
      },
      ...base.recentSessions.filter((session) => session.createdAt !== summary.createdAt),
    ].slice(0, 6),
  };
}

function exportSessionNote(summary, memory) {
  if (typeof window === "undefined" || !summary) return;

  const lines = [
    "AIForj Premium Session Note",
    "",
    `Date: ${new Date(summary.createdAt).toLocaleString()}`,
    `Headline: ${summary.headline}`,
    `State: ${summary.stateLabel}`,
    `Support mode: ${summary.primaryMode}`,
    `Conversation mode: ${summary.conversationModeLabel || "Auto"}`,
    `Current focus: ${summary.focusText}`,
    "",
    "What Forj leaned on:",
    ...summary.techniques.map((technique) => `- ${technique.name}: ${technique.desc}`),
    "",
    `Carry forward: ${summary.nextStep}`,
    "",
    "Micro-plan:",
    ...summary.microPlan.map((step) => `- ${step}`),
  ];

  if (memory?.recurringThemes?.length) {
    lines.push("", "Longitudinal memory (stored on this device):");
    lines.push(`- Recurring themes: ${memory.recurringThemes.map((item) => item.label).join(", ")}`);
    if (memory.helpfulApproaches?.length) {
      lines.push(`- Helpful approaches: ${memory.helpfulApproaches.map((item) => item.label).join(", ")}`);
    }
  }

  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `aiforj-session-note-${summary.createdAt.slice(0, 10)}.txt`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function chooseLocalModel() {
  if (typeof navigator === "undefined") {
    return LOCAL_WEBLLM_MODELS.standard;
  }

  const deviceMemory = typeof navigator.deviceMemory === "number" ? navigator.deviceMemory : null;
  if (deviceMemory && deviceMemory <= 4) {
    return LOCAL_WEBLLM_MODELS.lightweight;
  }

  return LOCAL_WEBLLM_MODELS.standard;
}

const PREMIUM_CONVERSATION_MODES = [
  {
    id: "steady",
    label: "Steady Me",
    shortLabel: "Steady",
    badge: "Calm first",
    description: "Bring the nervous system down before we do anything else.",
  },
  {
    id: "pattern",
    label: "Pattern",
    shortLabel: "Pattern",
    badge: "See the loop",
    description: "Map the recurring loop, inner critic, or protective pattern underneath the moment.",
  },
  {
    id: "plan",
    label: "Plan",
    shortLabel: "Plan",
    badge: "Leave with a plan",
    description: "Turn the conversation into a concrete next-step plan you can actually use today.",
  },
  {
    id: "deep-work",
    label: "Deep Work",
    shortLabel: "Deep Work",
    badge: "Go deeper",
    description: "Use longer context, deeper pattern recognition, and richer therapeutic language when it fits.",
  },
];

function getPremiumConversationMode(modeId) {
  return PREMIUM_CONVERSATION_MODES.find((mode) => mode.id === modeId) || PREMIUM_CONVERSATION_MODES[0];
}

// ─────────────────────────────────────────────────
// SPEECH RECOGNITION HOOK
// ─────────────────────────────────────────────────
function useSpeechRecognition() {
  const recogRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [interim, setInterim] = useState("");

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setSupported(false); return; }
    const r = new SR();
    r.continuous = false;
    r.interimResults = true;
    r.lang = "en-US";
    recogRef.current = r;
  }, []);

  const start = useCallback((onResult, onDone) => {
    if (!recogRef.current) { onDone?.(); return; }
    setListening(true);
    setInterim("");
    let final = "";
    recogRef.current.onresult = (e) => {
      let tmp = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else tmp = e.results[i][0].transcript;
      }
      setInterim(final || tmp);
    };
    recogRef.current.onend = () => {
      setListening(false);
      if (final.trim()) onResult(final.trim());
      else onDone?.();
    };
    recogRef.current.onerror = () => { setListening(false); onDone?.(); };
    try { recogRef.current.start(); } catch { setListening(false); onDone?.(); }
  }, []);

  const stop = useCallback(() => {
    try { recogRef.current?.stop(); } catch {}
    setListening(false);
  }, []);

  return { listening, supported, interim, start, stop };
}

// ─────────────────────────────────────────────────
// SPEECH SYNTHESIS HOOK
// ─────────────────────────────────────────────────
function useTTS() {
  const [speaking, setSpeaking] = useState(false);
  const activeRef = useRef(false);

  const speak = useCallback((text, onEnd) => {
    // If no speech synthesis, skip TTS entirely
    if (typeof window === "undefined" || !window.speechSynthesis) {
      onEnd?.();
      return;
    }

    try { window.speechSynthesis.cancel(); } catch {}
    activeRef.current = true;
    setSpeaking(true);

    // Pick best voice available
    let voice = null;
    try {
      const voices = window.speechSynthesis.getVoices() || [];
      voice = voices.find(v => /Samantha.*Enhanced|Samantha.*Premium|Ava.*Premium|Google US English|Microsoft Aria Online|Microsoft Jenny/i.test(v.name))
        || voices.find(v => /Samantha|Karen|Moira|Google UK English Female|Microsoft Aria/i.test(v.name))
        || voices.find(v => v.lang?.startsWith("en") && /female/i.test(v.name))
        || voices.find(v => v.lang?.startsWith("en"))
        || null;
    } catch {}

    const finish = () => {
      if (!activeRef.current) return;
      activeRef.current = false;
      try { window.speechSynthesis.cancel(); } catch {}
      setSpeaking(false);
      onEnd?.();
    };

    // Speak the full text as one utterance but with a safety timeout
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.92; u.pitch = 1.0; u.volume = 1;
    if (voice) u.voice = voice;
    u.onend = finish;
    u.onerror = finish;

    // Chrome bug: onend sometimes doesn't fire. Use a watchdog.
    let watchdog = null;
    const startWatchdog = () => {
      clearInterval(watchdog);
      watchdog = setInterval(() => {
        if (!activeRef.current) { clearInterval(watchdog); return; }
        // Chrome keepalive: pause/resume to prevent silent death
        try {
          if (window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          } else {
            // speechSynthesis says it's not speaking but we think it is — it hung
            clearInterval(watchdog);
            finish();
          }
        } catch { clearInterval(watchdog); finish(); }
      }, 3000);
    };

    u.onstart = startWatchdog;

    // If onstart never fires within 2s, TTS is broken — skip it
    const startTimeout = setTimeout(() => {
      if (activeRef.current && !window.speechSynthesis.speaking) {
        clearInterval(watchdog);
        finish();
      }
    }, 2000);
    u.onstart = () => { clearTimeout(startTimeout); startWatchdog(); };

    try {
      window.speechSynthesis.speak(u);
    } catch {
      clearTimeout(startTimeout);
      finish();
    }
  }, []);

  const stop = useCallback(() => {
    activeRef.current = false;
    try { window.speechSynthesis.cancel(); } catch {}
    setSpeaking(false);
  }, []);

  return { speaking, speak, stop };
}

// ─────────────────────────────────────────────────
// BREATHING EXERCISE OVERLAY
// ─────────────────────────────────────────────────
function BreathingOverlay({ pattern, onClose }) {
  const [phase, setPhase] = useState("inhale");
  const [count, setCount] = useState(0);
  const [cycle, setCycle] = useState(0);
  const patterns = {
    "4-4-6": { inhale: 4, hold: 4, exhale: 6, name: "Calming Breath" },
    "box": { inhale: 4, hold: 4, exhale: 4, hold2: 4, name: "Box Breathing" },
    "sigh": { inhale: 3, hold: 1, exhale: 7, name: "Physiological Sigh" },
  };
  const p = patterns[pattern] || patterns["4-4-6"];
  const totalCycles = 4;

  useEffect(() => {
    if (cycle >= totalCycles) { onClose(); return; }
    const dur = p[phase] || 4;
    setCount(0);
    const ci = setInterval(() => setCount(c => Math.min(c + 1, dur)), 1000);
    const t = setTimeout(() => {
      clearInterval(ci);
      if (phase === "inhale") setPhase("hold");
      else if (phase === "hold") setPhase("exhale");
      else if (phase === "exhale") {
        if (p.hold2) setPhase("hold2");
        else { setCycle(c => c + 1); setPhase("inhale"); }
      } else { setCycle(c => c + 1); setPhase("inhale"); }
    }, dur * 1000);
    return () => { clearTimeout(t); clearInterval(ci); };
  }, [phase, cycle]);

  const sz = phase === "inhale" ? 200 : phase === "hold" || phase === "hold2" ? 200 : 120;
  const label = phase === "inhale" ? "Breathe In" : phase === "hold" || phase === "hold2" ? "Hold" : "Release";

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(45,42,38,0.92)", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 100, animation: "fadeIn 0.5s ease" }}>
      <span style={{ fontSize: 12, color: "rgba(232,224,212,0.6)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 32, fontFamily: "'Fraunces', serif" }}>{p.name}</span>
      <div style={{ width: sz, height: sz, borderRadius: "50%", background: `radial-gradient(circle, rgba(125,155,130,0.3) 0%, rgba(125,155,130,0.05) 100%)`, transition: "all 1.8s ease-in-out", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", boxShadow: `0 0 ${sz/2}px rgba(125,155,130,0.15)`, border: "1px solid rgba(125,155,130,0.15)" }}>
        <span style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 3, color: "#9BB89E", fontWeight: 600, fontFamily: "'Fraunces', serif" }}>{label}</span>
        <span style={{ fontSize: 40, fontWeight: 300, color: "#E8E0D4", marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>{count}</span>
      </div>
      <span style={{ fontSize: 12, color: "rgba(232,224,212,0.5)", marginTop: 24, fontFamily: "'DM Sans', sans-serif" }}>Cycle {Math.min(cycle + 1, totalCycles)} / {totalCycles}</span>
      <button onClick={onClose} style={{ marginTop: 32, background: "none", border: "1px solid rgba(155,184,158,0.25)", padding: "8px 24px", borderRadius: 20, color: "rgba(232,224,212,0.6)", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.3s ease-out" }}>End Early</button>
    </div>
  );
}

// ─────────────────────────────────────────────────
// ANIMATED ORB
// ─────────────────────────────────────────────────
function Orb({ state, onClick }) {
  const cfg = {
    idle:      { c: "125,155,130", op: 0.22, sz: 160, speed: "4s",   label: "Tap to talk" },
    listening: { c: "107,155,158", op: 0.35, sz: 180, speed: "1.2s", label: "Listening..." },
    thinking:  { c: "107,155,158", op: 0.28, sz: 170, speed: "2.2s", label: "Thinking..." },
    speaking:  { c: "125,155,130", op: 0.32, sz: 175, speed: "1.8s", label: "Speaking..." },
  };
  const s = cfg[state] || cfg.idle;
  const isIdle = state === "idle";
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={s.label}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
      style={{
        cursor: state === "idle" || state === "speaking" ? "pointer" : "default",
        position: "relative", width: 200, height: 200, margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "center",
        userSelect: "none", outline: "none",
      }}
    >
      <div style={{ position: "absolute", width: s.sz + 40, height: s.sz + 40, borderRadius: "50%", background: `radial-gradient(circle, rgba(${s.c},0.1) 0%, transparent 70%)`, animation: `orbPulse ${s.speed} ease-in-out infinite`, transition: "all 0.8s ease-out" }} />
      <div style={{
        position: "relative", width: s.sz, height: s.sz, borderRadius: "50%",
        background: `radial-gradient(circle at 40% 35%, rgba(${s.c},${s.op}), rgba(${s.c},0.05))`,
        transition: "all 0.5s ease-out",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 0 ${s.sz * 0.4}px rgba(${s.c},0.15)`,
        border: `1px solid rgba(${s.c},0.18)`,
        animation: isIdle ? "heroBreath 8s ease-in-out infinite" : "none",
      }}>
        <span style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 3, color: "var(--text-primary)", fontWeight: 600, fontFamily: "'Fraunces', serif", opacity: 0.75 }}>{s.label}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────
// SESSION INSIGHTS (Premium)
// ─────────────────────────────────────────────────
function SessionInsights({ messages, summary, memory, canExport, onExport, onClose }) {
  const userMessages = messages.filter((message) => message.role === "user");
  const techniques = summary?.techniques?.length
    ? summary.techniques
    : [{ name: "Supportive listening", desc: "Warm reflection and next-step guidance." }];
  const duration = summary?.durationMinutes || Math.max(1, Math.round(messages.length * 0.4));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(45,42,38,0.85)", backdropFilter: "blur(20px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, animation: "fadeIn 0.4s ease" }}>
      <div style={{ background: "var(--surface-elevated)", borderRadius: 24, padding: "36px 32px", maxWidth: 520, width: "100%", maxHeight: "85vh", overflowY: "auto", border: "1px solid rgba(45,42,38,0.08)", boxShadow: "var(--shadow-xl)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600, color: "var(--text-primary)", display: "block" }}>Premium Session Note</span>
            <span style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif" }}>On-device continuity, pattern tracking, and carry-forward planning</span>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 20, cursor: "pointer" }}>×</button>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          {[
            { value: userMessages.length, label: "Messages" },
            { value: techniques.length, label: "Approaches" },
            { value: `${duration}m`, label: "Duration" },
          ].map((stat) => (
            <div key={stat.label} style={{ flex: 1, background: "var(--accent-sage-light)", borderRadius: 12, padding: "12px 8px", textAlign: "center", border: "1px solid rgba(125,155,130,0.12)" }}>
              <span style={{ fontSize: 22, fontWeight: 300, color: "var(--interactive)", display: "block", fontFamily: "'Fraunces', serif" }}>{stat.value}</span>
              <span style={{ fontSize: 10, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: 1, fontFamily: "'DM Sans', sans-serif" }}>{stat.label}</span>
            </div>
          ))}
        </div>

        {summary && (
          <div style={{ marginBottom: 18, padding: "16px 18px", background: "var(--surface)", borderRadius: 14, border: "1px solid rgba(45,42,38,0.06)" }}>
            <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: 6, fontFamily: "'Fraunces', serif" }}>Session Note</span>
            <span style={{ fontSize: 17, color: "var(--text-primary)", lineHeight: 1.45, display: "block", marginBottom: 8, fontFamily: "'Fraunces', serif" }}>{summary.headline}</span>
            <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, display: "block", marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>
              {summary.focusText}
            </span>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[summary.stateLabel, summary.conversationModeLabel || summary.primaryMode, ...summary.modalities.slice(0, 2)].map((item) => (
                <span key={item} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 999, background: "var(--accent-sage-light)", color: "var(--accent-sage)", fontWeight: 600 }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: 10, fontFamily: "'Fraunces', serif" }}>Approaches Forj Used</span>
        {techniques.map((technique) => (
          <div key={technique.name} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 12px", background: "var(--accent-sage-light)", borderRadius: 10, marginBottom: 6, borderLeft: "2px solid rgba(125,155,130,0.3)" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--interactive)", minWidth: 92, fontFamily: "'Fraunces', serif" }}>{technique.name}</span>
            <span style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif" }}>{technique.desc}</span>
          </div>
        ))}

        {summary && (
          <div style={{ marginTop: 20, padding: "14px 16px", background: "var(--surface)", borderRadius: 12, border: "1px solid rgba(45,42,38,0.06)" }}>
            <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: 6, fontFamily: "'Fraunces', serif" }}>Carry Forward</span>
            <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", display: "block", marginBottom: 12 }}>
              {summary.nextStep}
            </span>
            <div style={{ display: "grid", gap: 8 }}>
              {summary.microPlan.map((step) => (
                <div key={step} style={{ padding: "10px 12px", borderRadius: 10, background: "var(--accent-sage-light)" }}>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {memory && (
          <div style={{ marginTop: 20, padding: "14px 16px", background: "var(--surface)", borderRadius: 12, border: "1px solid rgba(45,42,38,0.06)" }}>
            <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: 8, fontFamily: "'Fraunces', serif" }}>What Premium Remembers On This Device</span>
            {[
              { label: "Recurring themes", items: memory.recurringThemes },
              { label: "Helpful approaches", items: memory.helpfulApproaches },
              { label: "Current focus", items: memory.currentFocus },
            ].map((section) => (
              section.items?.length ? (
                <div key={section.label} style={{ marginBottom: 10 }}>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>{section.label}</span>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {section.items.map((item) => (
                      <span key={`${section.label}-${item.label}`} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 999, background: "var(--accent-sage-light)", color: "var(--accent-sage)", fontWeight: 600 }}>
                        {item.label}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null
            ))}
          </div>
        )}

        {memory?.recentSessions?.length ? (
          <div style={{ marginTop: 20 }}>
            <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: 10, fontFamily: "'Fraunces', serif" }}>Recent Sessions</span>
            <div style={{ display: "grid", gap: 8 }}>
              {memory.recentSessions.slice(0, 3).map((session) => (
                <div key={session.createdAt} style={{ padding: "12px 14px", borderRadius: 12, background: "var(--surface)", border: "1px solid rgba(45,42,38,0.06)" }}>
                  <span style={{ fontSize: 13, color: "var(--text-primary)", display: "block", marginBottom: 4, fontFamily: "'Fraunces', serif" }}>{session.headline}</span>
                  <span style={{ fontSize: 11, color: "var(--text-secondary)", display: "block", marginBottom: 4 }}>{session.stateLabel}</span>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>{session.nextStep}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {canExport && summary ? (
          <button
            onClick={onExport}
            className="btn-glow"
            style={{ width: "100%", marginTop: 18, padding: "14px 16px", borderRadius: 999, border: "1px solid rgba(45,42,38,0.08)", background: "var(--surface)", color: "var(--text-primary)", cursor: "pointer", fontWeight: 600 }}
          >
            Export Session Note
          </button>
        ) : null}

        <div style={{ marginTop: 16, textAlign: "center" }}>
          <span style={{ fontSize: 10, color: "var(--text-muted)", opacity: 0.5, fontFamily: "'DM Sans', sans-serif" }}>Session notes and memory stay stored locally on your device only.</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────
// PREMIUM UPGRADE MODAL
// ─────────────────────────────────────────────────
function UpgradeModal({ onClose, onSubscribe }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(45,42,38,0.85)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 24, animation: "fadeIn 0.3s ease" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "var(--surface-elevated)", borderRadius: 24, padding: "36px 28px", maxWidth: 460, width: "100%", border: "1px solid rgba(45,42,38,0.08)", maxHeight: "90vh", overflowY: "auto", boxShadow: "var(--shadow-xl)" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <span style={{ fontSize: 36, display: "block", marginBottom: 10 }}>✦</span>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600, color: "var(--text-primary)", display: "block" }}>AIForj Premium</span>
          <span style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6, display: "block", fontFamily: "'DM Sans', sans-serif" }}>Free helps you feel better now. Premium becomes your private mental fitness system.</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
          <div style={{ padding: "12px 14px", borderRadius: 14, background: "var(--surface)", border: "1px solid rgba(45,42,38,0.06)" }}>
            <span style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 2, display: "block", marginBottom: 6 }}>Free</span>
            <span style={{ fontSize: 13, color: "var(--text-primary)", display: "block", fontWeight: 600 }}>In-the-moment relief</span>
            <span style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6 }}>Private support, short sessions, grounded tools, and a real conversation when you need it.</span>
          </div>
          <div style={{ padding: "12px 14px", borderRadius: 14, background: "linear-gradient(135deg, rgba(125,155,130,0.16), rgba(107,155,158,0.16))", border: "1px solid rgba(125,155,130,0.18)" }}>
            <span style={{ fontSize: 10, color: "var(--accent-sage)", textTransform: "uppercase", letterSpacing: 2, display: "block", marginBottom: 6, fontWeight: 700 }}>Premium</span>
            <span style={{ fontSize: 13, color: "var(--text-primary)", display: "block", fontWeight: 700 }}>Continuity, depth, and a plan</span>
            <span style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6 }}>On-device memory, deeper modes, therapist-ready notes, and unlimited use when life gets messy.</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
          {[
            { i: "🧠", t: "Remembers What Helps", d: "Private on-device memory of themes, triggers, and approaches that land for you" },
            { i: "🎛️", t: "Premium Conversation Modes", d: "Choose Steady Me, Pattern, Plan, or Deep Work instead of staying on one default lane" },
            { i: "🪞", t: "Deeper Pattern Work", d: "Schema, parts work, and narrative lenses when your conversation points there" },
            { i: "📋", t: "Session Notes + Micro-Plans", d: "Every meaningful session can end with a carry-forward note and next-step plan" },
            { i: "📚", t: "Session History", d: "Review recent Premium notes without losing the thread" },
            { i: "♾️", t: "Unlimited Conversations", d: "No daily limits when you need a longer stretch of support" },
            { i: "🧘", t: "Guided Meditations", d: "AI-personalized breathing and mindfulness exercises" },
            { i: "📄", t: "Export Session Notes", d: "Share summaries with your therapist or doctor" },
            { i: "🔒", t: "Complete Privacy", d: "Everything stays on your device — always" },
          ].map((feature) => (
            <div key={feature.t} style={{ display: "flex", gap: 10, padding: "10px 14px", background: "var(--accent-sage-light)", borderRadius: 12, alignItems: "flex-start", border: "1px solid rgba(125,155,130,0.1)" }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{feature.i}</span>
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", display: "block", fontFamily: "'DM Sans', sans-serif" }}>{feature.t}</span>
                <span style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif" }}>{feature.d}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 24, padding: "14px 16px", background: "var(--surface)", borderRadius: 14, border: "1px solid rgba(45,42,38,0.06)" }}>
          <span style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 2, display: "block", marginBottom: 8 }}>Why it earns the $9.99</span>
          <div style={{ display: "grid", gap: 8 }}>
            {[
              "It remembers what actually helps you instead of starting from zero every time.",
              "It turns insight into a concrete next-step plan you can reuse later.",
              "It gives you a private, lower-friction support layer between therapy sessions or during hard weeks.",
            ].map((reason) => (
              <span key={reason} style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.7 }}>{reason}</span>
            ))}
          </div>
        </div>
        <button onClick={onSubscribe} className="btn-glow" style={{ width: "100%", padding: "16px", fontSize: 15, fontFamily: "'Fraunces', serif", background: "linear-gradient(135deg, var(--interactive), var(--accent-teal))", color: "#fff", border: "none", borderRadius: 50, cursor: "pointer", fontWeight: 700, letterSpacing: 0.5, transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
          Start 7-Day Free Trial
        </button>
        <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", marginTop: 10, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>Then $9.99/mo — less than a single therapy copay.<br />Less than one coffee a week. Cancel anytime.</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APPLICATION
// ═══════════════════════════════════════════════════════════════
export default function ForjVoiceCompanion() {
  const [state, setState] = useState("idle");
  const [messages, setMessages] = useState([]);
  const [liveText, setLiveText] = useState("");
  const [aiText, setAiText] = useState("");
  const [textInput, setTextInput] = useState("");
  const [tier, setTier] = useState("free");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [showBreathing, setShowBreathing] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [msgCount, setMsgCount] = useState(0);
  const [error, setError] = useState("");
  const [streak, setStreak] = useState(0);
  const [showShare, setShowShare] = useState(false);
  const [dailyInsight, setDailyInsight] = useState(null);
  const [showAllPathways, setShowAllPathways] = useState(false);
  const [sessionSummary, setSessionSummary] = useState(null);
  const [companionMemory, setCompanionMemory] = useState(null);
  const [premiumMode, setPremiumMode] = useState(PREMIUM_CONVERSATION_MODES[0].id);

  const sr = useSpeechRecognition();
  const tts = useTTS();
  const msgsRef = useRef([]);
  useEffect(() => { msgsRef.current = messages; }, [messages]);
  const companionMemoryRef = useRef(null);
  useEffect(() => { companionMemoryRef.current = companionMemory; }, [companionMemory]);

  // Daily insights — quotable therapeutic truths
  const DAILY_INSIGHTS = [
    { quote: "Feelings are not facts. They're information.", source: "CBT Principle" },
    { quote: "You are not your thoughts. You are the one observing them.", source: "ACT Defusion" },
    { quote: "Numbness isn't apathy — it's your nervous system protecting you.", source: "Polyvagal Theory" },
    { quote: "Motivation follows action — not the other way around.", source: "Behavioral Activation" },
    { quote: "The voice that says you're not enough? That's not your voice.", source: "Schema Therapy" },
    { quote: "Anxiety is your brain trying to protect you from something that hasn't happened yet.", source: "CBT Principle" },
    { quote: "You don't have to believe everything you think.", source: "Cognitive Defusion" },
    { quote: "Rest is not a reward. It's a requirement.", source: "Burnout Research" },
    { quote: "Loneliness activates the same brain regions as physical pain.", source: "Neuroscience" },
    { quote: "The opposite of depression isn't happiness — it's vitality.", source: "Andrew Solomon" },
    { quote: "What you resist, persists. What you accept, transforms.", source: "Carl Jung / ACT" },
    { quote: "Your nervous system remembers what your mind tries to forget.", source: "Somatic Therapy" },
  ];


  // Load tier + streak on mount
  useEffect(() => {
    (async () => {
      const saved = await DB.get("tier");
      if (typeof window !== "undefined") {
        const premiumStatus = getPremiumAccessStatus();
        if (premiumStatus.active) {
          setTier("premium");
          await DB.set("tier", "premium");
        } else if (saved) {
          setTier(saved);
        }
      } else if (saved) {
        setTier(saved);
      }
      const today = new Date().toDateString();
      const sc = await DB.get(`sessions_${today}`);
      if (sc) setSessionCount(sc);
      // Streak tracking
      const lastDate = await DB.get("lastVisitDate");
      const currentStreak = (await DB.get("streak")) || 0;
      const todayStr = new Date().toISOString().slice(0, 10);
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      if (lastDate === todayStr) {
        setStreak(currentStreak);
      } else if (lastDate === yesterday) {
        const ns = currentStreak + 1;
        setStreak(ns);
        await DB.set("streak", ns);
        await DB.set("lastVisitDate", todayStr);
      } else {
        setStreak(1);
        await DB.set("streak", 1);
        await DB.set("lastVisitDate", todayStr);
      }
    })();
    // Daily insight (seeded by day)
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    setDailyInsight(DAILY_INSIGHTS[dayOfYear % DAILY_INSIGHTS.length]);
  }, []);


  const tierConfig = TIERS[tier] || TIERS.free;
  const hasContinuityMemory = tierConfig.features.continuityMemory;
  const hasLongerContext = tierConfig.features.deeperContext;

  const canSend = () => {
    if (tier === "premium" || tier === "trial") return true;
    if (sessionCount >= tierConfig.sessionsPerDay) return false;
    if (msgCount >= tierConfig.maxMessagesPerSession) return false;
    return true;
  };

  // ─── WebLLM Engine (free, private, no API keys) ───
  const webllmRef = useRef(null);
  const webllmModelRef = useRef(LOCAL_WEBLLM_MODELS.standard);
  const [webllmStatus, setWebllmStatus] = useState("idle"); // idle, loading, ready, unsupported
  const [webllmProgress, setWebllmProgress] = useState(0);

  const initWebLLM = useCallback(async () => {
    if (webllmRef.current || webllmStatus === "loading") return;
    if (typeof navigator === "undefined" || !navigator.gpu) { setWebllmStatus("unsupported"); return; }
    const selectedModel = chooseLocalModel();
    webllmModelRef.current = selectedModel;
    setWebllmStatus("loading");
    try {
      const webllm = await import("@mlc-ai/web-llm");
      const engine = new webllm.MLCEngine();
      engine.setInitProgressCallback((p) => setWebllmProgress(Math.round((p.progress || 0) * 100)));
      await engine.reload(selectedModel.id);
      webllmRef.current = engine;
      setWebllmStatus("ready");
    } catch (e) {
      console.warn("WebLLM unavailable, using clinical engine:", e);
      setWebllmStatus("unsupported");
    }
  }, [webllmStatus]);

  // Auto-load WebLLM for everyone on supported browsers.
  useEffect(() => {
    if (webllmStatus !== "idle") return undefined;
    const timer = setTimeout(() => {
      initWebLLM();
    }, tier === "free" ? 900 : 300);
    return () => clearTimeout(timer);
  }, [tier, webllmStatus, initWebLLM]);

  useEffect(() => {
    (async () => {
      if (!hasContinuityMemory) {
        setSessionSummary(null);
        setCompanionMemory(null);
        return;
      }

      const [storedSummary, storedMemory] = await Promise.all([
        DB.get("companion_session_note"),
        DB.get("companion_memory"),
      ]);
      if (storedSummary) setSessionSummary(storedSummary);
      if (storedMemory) setCompanionMemory(storedMemory);
    })();
  }, [hasContinuityMemory]);

  useEffect(() => {
    (async () => {
      if (!tierConfig.features.deepWorkModes) return;
      const storedMode = await DB.get("companion_premium_mode");
      if (storedMode && PREMIUM_CONVERSATION_MODES.some((mode) => mode.id === storedMode)) {
        setPremiumMode(storedMode);
      }
    })();
  }, [tierConfig.features.deepWorkModes]);

  // ─── Intelligent Clinical Response Engine (always available, no API) ───
  function generateClinicalResponse(userText, history) {
    const lower = userText.toLowerCase();
    const words = lower.split(/\s+/);
    const prevMsgs = history.filter(m => m.role === "assistant").map(m => m.text);
    const isFirstMsg = prevMsgs.length <= 1;
    const userHistory = history.filter(m => m.role === "user").map(m => m.text.toLowerCase());

    // ── Crisis Detection (HIGHEST PRIORITY) ──
    const crisisTerms = ["kill myself", "want to die", "suicide", "suicidal", "end my life", "end it all", "self harm", "self-harm", "cutting myself", "hurt myself", "don't want to live", "don't want to be here", "no reason to live", "better off dead", "planning to die"];
    if (crisisTerms.some(t => lower.includes(t))) {
      return "I hear you, and I want you to know what you're feeling matters. This is beyond what I can safely help with — you deserve real human support right now. Please reach out to the 988 Suicide and Crisis Lifeline — call or text 988. Or text HOME to 741741 for the Crisis Text Line. Will you reach out to one of these? I'm here with you.";
    }

    // ── Extract key phrases for personalization ──
    const extractQuote = (text) => {
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 3);
      if (sentences.length > 0) {
        const s = sentences[0].trim();
        return s.length > 60 ? s.substring(0, 57) + "..." : s;
      }
      return null;
    };
    const userQuote = extractQuote(userText);

    // ── Emotional State Detection ──
    const detect = (terms) => terms.some(t => lower.includes(t));

    const isAnxious = detect(["anxious", "anxiety", "worried", "worrying", "panic", "panicking", "nervous", "scared", "fear", "dread", "what if", "can't stop thinking", "racing thoughts", "overthinking", "overthink", "spiraling", "worst case", "freaking out", "on edge about", "terrified", "afraid", "uneasy", "restless", "mind won't stop", "keep thinking about", "can't get it out of my head"]);
    const isSad = detect(["sad", "depressed", "depression", "crying", "hopeless", "empty", "grief", "grieving", "lost someone", "miss them", "heartbroken", "devastated", "pointless", "nothing matters", "so down", "feeling low", "blue", "miserable", "unhappy", "tearful", "heavy heart", "hurting inside", "in pain", "don't care anymore", "lost interest"]);
    const isAngry = detect(["angry", "furious", "rage", "pissed", "frustrated", "irritated", "mad at", "hate", "unfair", "resentment", "resentful", "livid", "annoyed", "fed up", "sick of", "driving me crazy", "drives me crazy", "can't stand", "makes me so", "ticked off", "had enough", "losing my patience", "piss me off", "pisses me off"]);
    const isLonely = detect(["lonely", "alone", "isolated", "no friends", "no one cares", "nobody", "disconnected", "don't belong", "left out", "abandoned", "no one to talk to", "no one understands", "by myself", "all alone", "miss having someone", "wish i had someone", "feel invisible"]);
    const isNumb = detect(["numb", "don't feel anything", "can't feel", "feel nothing", "flat", "shutdown", "shut down", "dissociat", "checked out", "zombie", "going through the motions", "autopilot", "detached", "not here", "spaced out", "foggy"]);
    const isOverwhelmed = detect(["overwhelmed", "too much", "can't handle", "drowning", "breaking", "falling apart", "can't cope", "everything at once", "so much to do", "can't keep up", "swamped", "buried", "in over my head", "everything is piling up", "about to snap", "can't do this", "how am i supposed to"]);
    const isUnmotivated = detect(["unmotivated", "can't start", "no motivation", "no energy", "lazy", "procrastinat", "avoidin", "stuck", "can't do anything", "what's the point", "exhausted", "tired of trying", "burnt out", "burnout", "don't want to do anything", "don't want to get up", "can't be bothered", "nothing sounds good", "don't see the point", "going nowhere", "why bother", "dragging", "drained"]);
    const isStressed = detect(["stressed", "stress", "pressure", "deadline", "tense", "tension", "tight", "clenching", "can't relax", "on edge", "work is killing me", "so much pressure", "pulled in every direction", "never enough time", "running out of time", "behind on everything", "too many things"]);
    const isTrauma = detect(["trauma", "ptsd", "flashback", "nightmare", "triggered", "abuse", "abused", "assault", "attacked", "accident", "haunted by"]);
    const isRelationship = detect(["partner", "boyfriend", "girlfriend", "husband", "wife", "spouse", "relationship", "breakup", "broke up", "divorce", "cheated", "argument with", "fight with", "my ex", "my mom", "my dad", "my parent", "my family", "my friend", "my boss", "coworker", "roommate", "they said", "they don't", "they never", "they always"]);
    const isSelfWorth = detect(["not good enough", "worthless", "failure", "loser", "hate myself", "ugly", "stupid", "imposter", "fraud", "don't deserve", "broken", "piece of shit", "i suck", "i'm the worst", "no one likes me", "i'm a mess", "what's wrong with me", "i can't do anything right", "embarrassed", "ashamed", "shame"]);
    const isSleep = detect(["can't sleep", "insomnia", "awake", "3am", "middle of the night", "tossing and turning", "mind racing at night", "lying awake", "sleep", "tired but wired", "keep waking up", "bad dreams"]);
    const isWork = detect(["work", "job", "career", "boss", "coworker", "office", "meeting", "promotion", "fired", "laid off", "quit", "toxic workplace", "micromanag", "underpaid", "overwork"]);
    const isFine = detect(["i'm good", "i'm fine", "i'm okay", "doing well", "pretty good", "not bad", "great actually", "i'm alright", "can't complain"]);
    const isGratitude = detect(["grateful", "thankful", "appreciate", "blessed", "fortunate"]);
    const isGenerallyBad = detect(["bad day", "rough day", "terrible day", "hard day", "tough day", "not great", "not okay", "not doing well", "things suck", "everything sucks", "life sucks", "it sucks", "feel like crap", "feel like shit", "off today", "feel off", "just not right", "something's wrong", "don't feel good", "struggling", "having a hard time", "going through a lot", "it's been rough", "i'm not ok", "things aren't good", "messed up", "crappy", "awful", "horrible", "worst"]);

    // ── Check for questions directed at Forj ──
    const isAskingAdvice = detect(["what should i", "what do i do", "how do i", "can you help", "any advice", "what would you"]);
    const isVenting = lower.length > 100 && !isAskingAdvice;

    // ── Dynamic Technique Selection + Response Generation ──

    // GREETING / FIRST MESSAGE
    if (isFirstMsg && (lower.length < 30 || detect(["hi", "hello", "hey", "good morning", "good evening"]))) {
      return "Welcome. I'm glad you're here. There's no right or wrong thing to say — whatever's on your mind, I'm listening. How are you feeling right now?";
    }

    // FINE / POSITIVE STATE → Positive Psychology
    if (isFine || isGratitude) {
      const opts = [
        "That's genuinely great to hear. Since you're in a good place, let's build on it — what's one thing you did today or recently that you're proud of, even something small?",
        "I'm glad. When things are going well, it's the perfect time to strengthen your mental foundation. What's one thing that contributed to you feeling this way?",
        "Good — let's use this energy. Positive psychology research shows that reflecting on what's working amplifies it. What felt right about today?",
      ];
      return opts[Math.floor(Math.random() * opts.length)];
    }

    // CRISIS-ADJACENT (not direct crisis but concerning)
    if (detect(["don't want to be here", "can't take it anymore", "what's the point of anything", "tired of living"])) {
      return "What you just said tells me you're carrying something really heavy right now. I want to make sure you're safe. Are you having thoughts of hurting yourself? If you are, please reach out to 988 — you can call or text. You deserve support from a real person right now.";
    }

    // ANXIETY → CBT + ACT
    if (isAnxious) {
      if (detect(["what if", "worst case", "going to happen"])) {
        return userQuote
          ? `"${userQuote}" — your brain is doing what's called catastrophizing. It's predicting the worst possible outcome and treating it as certain. Here's the CBT challenge: what is the most LIKELY outcome — not the worst, not the best, but the most probable?`
          : "That sounds like catastrophizing — your brain jumping to the worst-case scenario. Here's the reality check: what has actually happened in similar situations before? Not your fear — the facts.";
      }
      if (detect(["can't stop thinking", "racing", "spiraling", "loop"])) {
        return "When thoughts are spiraling, trying to stop them makes it worse. Instead, try this ACT technique: say to yourself 'I notice I'm having the thought that...' and finish the sentence. It creates distance between you and the thought. You become the observer, not the hostage. What thought is loudest right now?";
      }
      if (detect(["panic", "heart racing", "can't breathe", "chest tight"])) {
        return "That sounds like your nervous system is in overdrive. Let's bring it down right now. Can you try this with me? Breathe in for 4 counts, hold for 4, exhale slowly for 6. The longer exhale can help your body downshift and feel a little safer. Do that three times, then tell me how you feel.";
      }
      const anxOpts = [
        userQuote ? `"${userQuote}" — that's your anxiety talking, not reality. In CBT, we'd ask: what evidence supports this fear? And what evidence contradicts it? Usually the evidence against is much stronger.` : "Anxiety makes thoughts feel like facts. But feelings aren't evidence. What would you tell a close friend who had this exact same worry?",
        "When anxiety is high, your rational brain goes offline. The first step is always physiological — slow your exhale to be longer than your inhale. Then we can examine the thought. What's the specific thought driving this anxiety?",
        "I hear the anxiety in what you're saying. Let's separate what you KNOW from what you're PREDICTING. What do you actually know for certain right now?",
      ];
      return anxOpts[Math.floor(Math.random() * anxOpts.length)];
    }

    // SADNESS / DEPRESSION → Emotion-Focused + Self-Compassion + BA
    if (isSad) {
      if (detect(["grief", "lost someone", "died", "passed away", "miss them"])) {
        return "Grief doesn't follow a timeline, and it doesn't need to be fixed — it needs to be held. What you're feeling is the cost of having loved deeply. Who are you missing right now? Tell me about them.";
      }
      if (detect(["hopeless", "pointless", "nothing matters", "why bother"])) {
        return userQuote
          ? `"${userQuote}" — that's depression speaking. Depression is very convincing — it makes the temporary feel permanent. But here's what I know: the fact that you're here, talking about it, means a part of you is still reaching for something. What would it take for today to feel even 5% better?`
          : "When everything feels pointless, that's depression narrowing your vision. It's not showing you the full picture. Can you think of one moment in the last week — even tiny — where you felt something that wasn't emptiness?";
      }
      const sadOpts = [
        "Sadness is information, not a problem to solve. It's telling you something matters. If your sadness could speak one honest sentence, what would it say?",
        userQuote ? `"${userQuote}" — that's a heavy thing to carry. You don't have to carry it perfectly. What would you say to your closest friend if they told you they felt exactly this way?` : "What you're feeling is valid. Self-compassion research shows that treating yourself the way you'd treat a friend in pain is more healing than trying to 'fix' the feeling. What would that kindness look like right now?",
        "That sounds really painful. Before we do anything else — is there one small, kind thing you could do for yourself in the next 10 minutes? Not to fix the sadness, just to be gentle with yourself.",
      ];
      return sadOpts[Math.floor(Math.random() * sadOpts.length)];
    }

    // ANGER → DBT + CBT
    if (isAngry) {
      if (detect(["unfair", "shouldn't have", "they always"])) {
        return userQuote
          ? `"${userQuote}" — I hear real frustration there. In DBT, we'd separate the facts from the interpretation. What actually happened — just what a camera would have recorded — versus the story your mind added on top?`
          : "Anger usually protects a deeper need — respect, fairness, a boundary that was crossed. Underneath this anger, what need of yours isn't being met?";
      }
      const angOpts = [
        "Anger is information, not a command. It's telling you something important. Before we look at what to do, let's just acknowledge: what you're feeling makes sense given what happened. Now — what need is this anger protecting?",
        "When anger is high, the smartest thing is to pause before acting. Your prefrontal cortex — the part that makes wise decisions — needs about 20 minutes to come back online after intense emotion. What would the wisest version of you do about this situation?",
        userQuote ? `"${userQuote}" — that's valid. Two things can be true: you have every right to feel angry, AND reacting from this intensity might not serve you. What would you want to happen here if you had full clarity?` : "Let's check the facts — a core DBT skill. What actually happened? Not what you think they meant, not what you assume their intention was, just the observable event.",
      ];
      return angOpts[Math.floor(Math.random() * angOpts.length)];
    }

    // LONELINESS → IPT
    if (isLonely) {
      const lonOpts = [
        "Loneliness activates the same brain regions as physical pain — it's not 'just a feeling.' Your brain is telling you that connection is a survival need. Who is one person you wish you felt closer to right now?",
        "There are different types of loneliness — it can come from conflict, from a life change that disrupted your connections, from grief, or from simply not having enough close relationships. Which of those resonates with what you're feeling?",
        userQuote ? `"${userQuote}" — that's one of the most human things anyone can feel. Interpersonal therapy research shows that small, consistent bids for connection work better than grand gestures. What's one low-pressure way you could reach out to someone today?` : "Feeling alone doesn't mean you're unworthy of connection. It means your need for connection is healthy and active. What's one small step toward someone — a text, a call, even a reaction to someone's post?",
      ];
      return lonOpts[Math.floor(Math.random() * lonOpts.length)];
    }

    // NUMBNESS → Polyvagal + Somatic
    if (isNumb) {
      const numOpts = [
        "Numbness isn't apathy — it's your nervous system's freeze response. Polyvagal theory tells us this happens when your brain detects overwhelm it can't fight or flee from. It's actually trying to protect you. Where in your body do you notice it most — chest, head, stomach, or everywhere?",
        "When the nervous system shuts down, the path back is through gentle sensation — not forcing emotion. Can you try something? Run cold water over your wrists for 30 seconds, or hold something with an interesting texture. Your senses are the doorway back to feeling.",
        userQuote ? `"${userQuote}" — that disconnect you're describing is real, and it makes sense. When was the last time you felt something clearly — anything at all? Even a small moment.` : "The freeze response is temporary, even when it doesn't feel like it. Your emotional range is still intact — it's just offline. What's one thing that usually makes you feel something, even slightly?",
      ];
      return numOpts[Math.floor(Math.random() * numOpts.length)];
    }

    // OVERWHELM → DBT + Task Decomposition
    if (isOverwhelmed) {
      const ovOpts = [
        "When everything feels like too much, the first step isn't doing more — it's pausing. Your nervous system is in overdrive. Can you take one long, slow exhale right now? Then tell me: of everything on your plate, what ONE thing is creating the most pressure?",
        "Overwhelm happens when the gap between demands and capacity feels impossible. But here's the truth: you don't have to close the whole gap today. What is the absolute smallest action you could take on the biggest thing — something that takes under 2 minutes?",
        userQuote ? `"${userQuote}" — that's a lot. Let's do a brain dump. Tell me everything that's weighing on you — don't organize it, just get it out of your head. Externalizing it reduces cognitive load by up to 20%.` : "In DBT, there's a concept called radical acceptance: 'I cannot fix everything right now, and that is okay.' Can you say that to yourself? Not as defeat — as freedom to focus on one thing at a time.",
      ];
      return ovOpts[Math.floor(Math.random() * ovOpts.length)];
    }

    // UNMOTIVATED → Behavioral Activation
    if (isUnmotivated) {
      const motOpts = [
        "Here's what behavioral activation research proves: motivation follows action — not the other way around. You don't need to feel motivated to begin. You just need to start for 5 minutes. What's one thing you've been avoiding?",
        "That low energy is real — I'm not going to tell you to 'just do it.' But I will tell you this: starting is the hardest part. Literally. Once you begin a task, your brain releases dopamine that sustains the effort. What could you do for just 5 minutes?",
        userQuote ? `"${userQuote}" — that heaviness is valid. Let's not fight it. Instead, on a scale of 1 to 10, where's your energy right now? And what's the smallest thing you could do that matches that energy level?` : "When everything feels pointless, it's usually because you're stuck in an avoidance loop — feel bad, avoid things, feel worse, avoid more. The circuit breaker is one tiny action. Not a big one. What's the smallest possible step?",
      ];
      return motOpts[Math.floor(Math.random() * motOpts.length)];
    }

    // STRESS → ACT + Stress Inoculation
    if (isStressed) {
      const strOpts = [
        "Stress lives in the gap between what you're facing and what you believe you can handle. But that belief is usually distorted — you've handled hard things before. What's the biggest stressor right now, specifically?",
        "Let's separate what you can control from what you can't. Of everything stressing you out, what's actually within your power to change today? Focus there. The rest gets radical acceptance — for now.",
        userQuote ? `"${userQuote}" — I can hear the pressure in that. Try this ACT technique: rewrite your most stressful thought starting with 'I notice I'm having the thought that...' It creates distance. What's the thought?` : "Your body is holding this stress somewhere — neck, jaw, shoulders, stomach. Where do you feel it? Naming the physical sensation is the first step in releasing it.",
      ];
      return strOpts[Math.floor(Math.random() * strOpts.length)];
    }

    // TRAUMA → Stabilization (never reprocessing)
    if (isTrauma) {
      return "What you're describing sounds like a trauma response — and I want you to know that your reaction makes complete sense. Your brain learned to protect you, and it's still running that program. Right now, the most important thing is grounding. Can you look around the room and name 3 things you see? This tells your nervous system that you're here, in the present, and you're safe. For deeper trauma work, a trauma-specialized therapist is the right path — but I'm here for support right now.";
    }

    // RELATIONSHIP → IPT + CBT
    if (isRelationship) {
      const relOpts = [
        userQuote ? `"${userQuote}" — relationship pain hits different because it touches our deepest needs for connection and security. Let's slow down. What do you need most right now — to be heard, to problem-solve, or just to process how you feel?` : "Relationship difficulties often activate our core attachment patterns — things we learned about love and safety long before we could choose. What's coming up for you right now in this situation?",
        "In interpersonal therapy, we'd look at the pattern here. Is this conflict about a specific event, or does it connect to a recurring dynamic between you two? Understanding the pattern is the first step to changing it.",
        "Before we look at what to do, let's separate the facts from the narrative. What actually happened versus what your mind is adding — assumptions about their intentions, predictions about the future?",
      ];
      return relOpts[Math.floor(Math.random() * relOpts.length)];
    }

    // SELF-WORTH → Schema + Narrative + Self-Compassion
    if (isSelfWorth) {
      const swOpts = [
        userQuote ? `"${userQuote}" — I need you to hear something. That voice that says you're not enough? That's not your voice. That's a voice you internalized — probably long ago. In narrative therapy, we'd say the problem isn't you — the problem is the story you were given about yourself. What would a more accurate story sound like?` : "That inner critic is loud right now. But here's what I know: the fact that it hurts means you care. People who truly don't care don't suffer like this. What would you say to someone you love who said these same words about themselves?",
        "Self-worth isn't something you earn — it's something you uncover beneath the layers of criticism. Can you name one thing you did this week — even tiny — that showed strength, kindness, or persistence? Don't dismiss it.",
        "That belief — 'I'm not good enough' — is one of the most common core schemas, and it almost always starts in childhood. It feels like truth because you've carried it so long. But long-held doesn't mean accurate. What evidence from your actual life contradicts this belief?",
      ];
      return swOpts[Math.floor(Math.random() * swOpts.length)];
    }

    // SLEEP / INSOMNIA → MBSR + Polyvagal
    if (isSleep && !isAnxious && !isSad) {
      const sleepOpts = [
        "When your mind won't let you rest, it's usually because your nervous system is still in 'alert mode.' Try this: breathe in for 4, out for 8. That extended exhale activates your vagus nerve and signals safety. What's the thought that keeps pulling you back awake?",
        "Sleep problems are almost always a signal — not the problem itself. Something is keeping your brain on alert. What's the thing your mind goes to the moment it gets quiet?",
        userQuote ? `"${userQuote}" — your body wants to rest, but your mind hasn't gotten the memo that it's safe to let go. Before we address what's keeping you up, try the 4-7-8 technique: breathe in for 4, hold for 7, exhale for 8. It activates your parasympathetic nervous system.` : "Night is when the mind replays everything we avoided during the day. What surfaces for you when the noise stops?",
      ];
      return sleepOpts[Math.floor(Math.random() * sleepOpts.length)];
    }

    // WORK STRESS → ACT + Boundaries
    if (isWork && !isAngry && !isOverwhelmed) {
      const workOpts = [
        userQuote ? `"${userQuote}" — work has a way of becoming our whole identity if we let it. Let's separate you from the role for a moment. Outside of work, what matters to you? That's your anchor.` : "Work stress often comes from a gap between what you value and what's demanded of you. What feels most out of alignment right now?",
        "Before we problem-solve, I want to check in: is this a situation you can change, a situation you need to accept, or a situation you need to leave? Being honest about which one it is changes everything.",
        "Your job takes your time and energy — it doesn't get to take your peace. What boundary, if you could set it freely, would make the biggest difference?",
      ];
      return workOpts[Math.floor(Math.random() * workOpts.length)];
    }

    // ASKING FOR ADVICE → Solution-Focused
    if (isAskingAdvice) {
      return userQuote
        ? `Here's what I notice: you already have more clarity than you think. You said "${userQuote}" — there's wisdom in that. If you woke up tomorrow and this problem was somehow resolved, what's the first thing you'd notice that was different about your day?`
        : "Before I offer anything, I want to hear your instinct. If you trusted yourself completely right now — what would you do? Sometimes the answer is already there; it just needs permission.";
    }

    // GENERALLY BAD / VAGUE DISTRESS → Warm validation + gentle exploration
    if (isGenerallyBad) {
      const badOpts = [
        userQuote ? `"${userQuote}" — I hear you. You don't need to have the perfect words for it. Sometimes things just feel heavy, and naming it as 'hard' is enough. What's weighing on you the most right now?` : "That sounds like a rough stretch. You showed up here, and that matters. What's been the hardest part?",
        "When things feel generally bad, it's often because several small things stacked up. Can you identify the one thing that, if it improved, would lighten the load the most?",
        "I'm glad you said something instead of pushing through it. Not everything needs to be 'fine.' On a scale of 1-10, where are you right now — and where do you wish you were?",
        userQuote ? `"${userQuote}" — your honesty right there takes more strength than pretending everything's okay. What happened? I'm here for all of it.` : "Bad days are real, and they're allowed. You don't have to power through this one. What would feel even a little bit supportive right now?",
      ];
      return badOpts[Math.floor(Math.random() * badOpts.length)];
    }

    // VENTING (long message, not asking for help) → Reflective Listening
    if (isVenting) {
      return userQuote
        ? `I hear you. "${userQuote}" — that's a lot to carry. Thank you for trusting me with it. You don't have to solve anything right now. What's the heaviest part of all of this for you?`
        : "That's a lot. I'm not going to rush to fix anything — sometimes you just need to be heard. What feels most important about what you just shared?";
    }

    // CONVERSATIONAL FOLLOW-UP — user is responding to something Forj asked
    const lastAiMsg = prevMsgs.length > 0 ? prevMsgs[prevMsgs.length - 1] : "";
    const isFollowUp = lastAiMsg && (lastAiMsg.includes("?") || prevMsgs.length > 1);
    if (isFollowUp && lower.length > 5 && lower.length < 200) {
      const followOpts = [
        userQuote ? `"${userQuote}" — thank you for sharing that. That tells me a lot about where you are right now. What does that feel like in your body — is there tension, heaviness, or something else?` : "Thank you for being honest about that. What you're describing sounds like it really matters to you. What would it look like if things shifted, even a little?",
        userQuote ? `"${userQuote}" — I notice real emotion in that. In therapy, we'd say that's important data. Your feelings are pointing you toward something. What do you think they're trying to tell you?` : "I appreciate you going deeper there. The fact that you can name it means you're already processing it. What would the wisest version of you say about this?",
        "That's a meaningful thing to share. Let's sit with it for a second — what comes up when you hear yourself say that out loud?",
        userQuote ? `You said "${userQuote}" — and I want to reflect something back. The way you described that shows real self-awareness. That's not nothing. What feels like the most important part of what you just said?` : "I hear you. Based on everything you've shared, it sounds like there's a real need underneath this — maybe for safety, control, connection, or validation. Which of those resonates?",
      ];
      return followOpts[Math.floor(Math.random() * followOpts.length)];
    }

    // GENERIC / UNDETECTED → Substantive therapeutic engagement
    const genericOpts = [
      userQuote ? `"${userQuote}" — I want to understand that more deeply. What does that mean to you, specifically?` : "I'm here. Whatever you're carrying right now — I'd like to understand it. What feels most present for you?",
      "What you just shared matters. Something brought you here right now. What's the feeling underneath the surface, if you let yourself name it?",
      "I'm listening. What do you need most right now — to be heard, to get a different perspective, or to figure out a next step?",
      userQuote ? `"${userQuote}" — there's something important in what you just said. Can you say more about what that means to you? I want to make sure I understand.` : "I want to make sure I really hear you. Can you paint me a picture of what's going on? Not just the facts, but how it's landing in you.",
    ];
    return genericOpts[Math.floor(Math.random() * genericOpts.length)];
  }

  const showShareRef = useRef(false);
  useEffect(() => { showShareRef.current = showShare; }, [showShare]);

  const getResponse = useCallback(async (userText) => {
    if (!canSend()) { setShowUpgrade(true); setState("idle"); return; }

    setState("thinking");
    setAiText("");
    setMsgCount(c => c + 1);

    // Update msgsRef synchronously so WebLLM sees latest messages
    const updated = [...msgsRef.current, { role: "user", text: userText, ts: Date.now() }];
    msgsRef.current = updated;
    setMessages(updated);

    let text = "";
    const planner = buildSessionPlanner(userText, updated, tier, premiumMode);

    // Try WebLLM first (free + premium, no API key)
    if (webllmRef.current && webllmStatus === "ready") {
      try {
        const history = updated
          .slice(-(hasLongerContext ? 14 : 10))
          .map((message) => ({ role: message.role, content: message.text }));
        const reply = await webllmRef.current.chat.completions.create({
          messages: [{
            role: "system",
            content: buildCompanionSystemPrompt({
              tier,
              planner,
              memory: hasContinuityMemory ? companionMemoryRef.current : null,
            }),
          }, ...history],
          max_tokens: 300,
          temperature: 0.65,
        });
        text = reply.choices?.[0]?.message?.content || "";
      } catch (e) {
        console.warn("WebLLM generation failed, using clinical engine:", e);
      }
    }

    // Fallback: Intelligent clinical response engine (always works, no API)
    if (!text) {
      text = generateClinicalResponse(userText, updated);
    }

    setAiText(text);
    const withResponse = [...updated, { role: "assistant", text, ts: Date.now() }];
    msgsRef.current = withResponse;
    setMessages(withResponse);

    if (hasContinuityMemory) {
      const summary = buildSessionSummary(withResponse, planner);
      if (summary) {
        setSessionSummary(summary);
        await DB.set("companion_session_note", summary);
        const nextMemory = mergeCompanionMemory(companionMemoryRef.current, summary);
        companionMemoryRef.current = nextMemory;
        setCompanionMemory(nextMemory);
        await DB.set("companion_memory", nextMemory);
      }
    }

    setState("speaking");
    tts.speak(text, () => {
      setState("idle");
      // Show share prompt after 3+ exchanges (use refs to avoid stale closure)
      if (msgsRef.current.length >= 6 && !showShareRef.current) setShowShare(true);
    });
  }, [tts, tier, sessionCount, msgCount, webllmStatus, hasContinuityMemory, hasLongerContext, premiumMode]);

  const handleOrb = useCallback(() => {
    if (state === "speaking") { tts.stop(); setState("idle"); return; }
    if (state === "listening") { sr.stop(); setState("idle"); return; }
    if (state !== "idle") return;
    if (!canSend()) { setShowUpgrade(true); return; }
    setError("");
    setLiveText("");
    if (!sr.supported) return;
    setState("listening");
    sr.start(
      (final) => getResponse(final),
      () => setState("idle")
    );
  }, [state, sr, tts, getResponse]);

  const handleTextSend = useCallback(() => {
    if (!textInput.trim() || state !== "idle") return;
    if (!canSend()) { setShowUpgrade(true); return; }
    const t = textInput.trim();
    setTextInput("");
    getResponse(t);
  }, [textInput, state, getResponse]);

  // New session tracking
  const startNewSession = useCallback(async () => {
    const today = new Date().toDateString();
    const newCount = sessionCount + 1;
    setSessionCount(newCount);
    await DB.set(`sessions_${today}`, newCount);
    setMsgCount(0);
  }, [sessionCount]);

  // Greeting on mount
  useEffect(() => {
    if (messages.length === 0) {
      const g = "Hey. Whatever brought you here right now — I'm glad you came. This space is completely yours. Nothing you say here ever leaves this screen. No one else hears it. So... how are you really feeling?";
      setMessages([{ role: "assistant", text: g, ts: Date.now() }]);
      setAiText(g);
      startNewSession();
    }
  }, []);

  useEffect(() => { setLiveText(sr.interim); }, [sr.interim]);

  const handleSubscribe = async () => {
    try {
      const res = await fetch('/api/create-checkout-session', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data?.error || "Premium checkout is temporarily unavailable right now.");
    } catch {
      setError("Premium checkout is temporarily unavailable right now.");
    }
  };

  const remainingMsgs = tier === "free" ? Math.max(0, TIERS.free.maxMessagesPerSession - msgCount) : null;
  const remainingSessions = tier === "free" ? Math.max(0, TIERS.free.sessionsPerDay - sessionCount) : null;

  const emotionColors = {
    anxious: "#6B9B9E", overwhelmed: "#8B7DA8", stressed: "#C4956A",
    night: "#7B8FA8", burnout: "#A89070", sad: "#C49B9B",
    angry: "#C47D7D", grief: "#9B9BB0", relationship: "#C49B9B",
    socialanxiety: "#6B9B9E", imposter: "#8B7DA8", lonely: "#7B8FA8",
    numb: "#9B9590", unmotivated: "#A89070", fine: "#8BAE8B",
  };

  const primaryPathways = [
    { id: "anxious",     label: "Anxious",     icon: "⚡",  desc: "Racing thoughts, worry, tension" },
    { id: "overwhelmed", label: "Overwhelmed", icon: "🌊",  desc: "Too much, can't process" },
    { id: "stressed",    label: "Stressed",    icon: "⏰",  desc: "Pressure, deadline, tense" },
    { id: "night",       label: "3AM Spiral",  icon: "🌙",  desc: "Can't sleep, mind racing" },
    { id: "burnout",     label: "Burned Out",  icon: "🪨",  desc: "Depleted, running on empty" },
    { id: "sad",         label: "Sad",         icon: "🌧",  desc: "Heavy, low, tearful" },
  ];
  const morePathways = [
    { id: "angry",         label: "Angry",             icon: "🔥",  desc: "Frustrated, irritated, furious" },
    { id: "grief",         label: "Grief / Loss",      icon: "🕊️",  desc: "Missing someone or something" },
    { id: "relationship",  label: "Relationship Pain", icon: "💔",  desc: "Conflict, hurt, disconnected" },
    { id: "socialanxiety", label: "Social Anxiety",    icon: "😰",  desc: "Nervous about people or situations" },
    { id: "imposter",      label: "Imposter Syndrome", icon: "🎭",  desc: "Don't belong, will be found out" },
    { id: "lonely",        label: "Lonely",            icon: "🌑",  desc: "Isolated, disconnected" },
    { id: "numb",          label: "Numb",              icon: "🧊",  desc: "Disconnected, empty, flat" },
    { id: "unmotivated",   label: "Unmotivated",       icon: "🪫",  desc: "No energy, can't start" },
    { id: "fine",          label: "I'm Good",          icon: "☀️",  desc: "Optimize & grow" },
  ];
  const visiblePathways = showAllPathways ? [...primaryPathways, ...morePathways] : primaryPathways;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes orbPulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.08); opacity: 0.7; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes softPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes heroBreath { 0%, 100% { transform: scale(1); box-shadow: 0 0 60px rgba(125,155,130,0.15); } 50% { transform: scale(1.06); box-shadow: 0 0 100px rgba(125,155,130,0.25); } }
        ::selection { background: rgba(125,155,130,0.25); }
        .card-hover { transition: all 0.3s cubic-bezier(0.16,1,0.3,1); }
        .card-hover:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 8px 28px rgba(45,42,38,0.08); }
        .emotion-tile { transition: all 0.3s cubic-bezier(0.16,1,0.3,1); }
        .emotion-tile:hover { transform: translateY(-3px); }
        .btn-glow { transition: all 0.3s cubic-bezier(0.16,1,0.3,1); }
        .btn-glow:hover { box-shadow: 0 4px 20px rgba(125,155,130,0.2); transform: translateY(-1px); }
        .quicktool-hover { transition: all 0.3s cubic-bezier(0.16,1,0.3,1); }
        .quicktool-hover:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(45,42,38,0.06); }
      `}</style>

      {showBreathing && <BreathingOverlay pattern={showBreathing} onClose={() => setShowBreathing(null)} />}
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} onSubscribe={handleSubscribe} />}
      {showInsights && messages.length > 2 && (
        <SessionInsights
          messages={messages}
          summary={sessionSummary}
          memory={companionMemory}
          canExport={tierConfig.features.exportNotes}
          onExport={() => exportSessionNote(sessionSummary, companionMemory)}
          onClose={() => setShowInsights(false)}
        />
      )}

      {/* WebLLM loading indicator */}
      {webllmStatus === "loading" && (
        <div style={{ position: "fixed", bottom: 20, right: 20, background: "var(--surface-elevated)", boxShadow: "var(--shadow-lg)", borderRadius: 16, padding: "10px 18px", zIndex: 50, border: "1px solid rgba(125,155,130,0.12)", display: "flex", alignItems: "center", gap: 10, animation: "fadeIn 0.3s" }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#7D9B82" }} className="pulse-loading" />
          <div>
            <span style={{ fontSize: 11, color: "var(--text-primary)", fontWeight: 500, display: "block" }}>Loading {webllmModelRef.current.label}</span>
            <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>{webllmProgress}% — {webllmModelRef.current.description}, fully on-device</span>
          </div>
        </div>
      )}

      {/* ═══════════ SESSION TOOLBAR ═══════════ */}
      <div style={{ padding: "8px 24px", display: "flex", justifyContent: "center", alignItems: "center", gap: 8, flexWrap: "wrap", zIndex: 10, maxWidth: 1080, width: "100%", margin: "0 auto" }}>
        <button onClick={() => setShowBreathing("4-4-6")} className="btn-glow" style={{ background: "var(--surface)", border: "1px solid rgba(45,42,38,0.08)", padding: "6px 14px", borderRadius: 20, fontSize: 11, color: "var(--text-secondary)", cursor: "pointer", fontWeight: 500 }}>
          Breathe
        </button>
        {tierConfig.features.sessionInsights && messages.length > 4 && (
          <button onClick={() => setShowInsights(true)} className="btn-glow" style={{ background: "var(--surface)", border: "1px solid rgba(45,42,38,0.08)", padding: "6px 14px", borderRadius: 20, fontSize: 11, color: "var(--text-secondary)", cursor: "pointer", fontWeight: 500 }}>
            Notes
          </button>
        )}
        {messages.length > 2 && (
          <button onClick={() => setShowHistory(!showHistory)} className="btn-glow" style={{ background: "var(--surface)", border: "1px solid rgba(45,42,38,0.08)", padding: "6px 14px", borderRadius: 20, fontSize: 11, color: "var(--text-secondary)", cursor: "pointer", fontWeight: 500 }}>
            {showHistory ? "Hide" : "Chat"}
          </button>
        )}
        {streak > 1 && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", background: "var(--accent-sage-light)", borderRadius: 20 }}>
            <span style={{ fontSize: 11 }}>🌱</span>
            <span style={{ fontSize: 10, color: "var(--accent-sage)", fontWeight: 600 }}>{streak}d</span>
          </div>
        )}
        {tier !== "free" && <span style={{ fontSize: 8, padding: "2px 7px", background: "linear-gradient(90deg, #7D9B82, #6B9B9E)", color: "#fff", borderRadius: 8, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>PRO</span>}
        {tier === "free" && (
          <button onClick={() => setShowUpgrade(true)} className="btn-glow" style={{ background: "var(--interactive)", border: "none", padding: "6px 16px", borderRadius: 20, fontSize: 11, color: "#fff", cursor: "pointer", fontWeight: 600 }}>
            ✦ Premium
          </button>
        )}
      </div>

      {tierConfig.features.deepWorkModes ? (
        <div style={{ padding: "0 24px 12px", display: "flex", justifyContent: "center" }}>
          <div style={{ maxWidth: 880, width: "100%", background: "var(--surface-elevated)", borderRadius: 20, border: "1px solid rgba(45,42,38,0.06)", boxShadow: "var(--shadow-sm)", padding: "14px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
              <div>
                <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: "var(--accent-sage)", fontWeight: 700, display: "block", marginBottom: 4, fontFamily: "'Fraunces', serif" }}>Premium Modes</span>
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Choose the kind of help you want before the conversation starts.</span>
              </div>
              <span style={{ fontSize: 11, padding: "5px 10px", borderRadius: 999, background: "linear-gradient(135deg, rgba(125,155,130,0.16), rgba(107,155,158,0.16))", color: "var(--accent-sage)", fontWeight: 700 }}>
                Included in Premium
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
              {PREMIUM_CONVERSATION_MODES.map((mode) => {
                const isActive = premiumMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={async () => {
                      setPremiumMode(mode.id);
                      await DB.set("companion_premium_mode", mode.id);
                    }}
                    className="btn-glow"
                    style={{
                      textAlign: "left",
                      padding: "12px 14px",
                      borderRadius: 16,
                      border: isActive ? "1.5px solid rgba(125,155,130,0.42)" : "1px solid rgba(45,42,38,0.08)",
                      background: isActive ? "linear-gradient(135deg, rgba(125,155,130,0.14), rgba(107,155,158,0.14))" : "var(--surface)",
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ fontSize: 11, color: isActive ? "var(--accent-sage)" : "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1.5, display: "block", marginBottom: 5, fontWeight: 700 }}>{mode.badge}</span>
                    <span style={{ fontSize: 14, color: "var(--text-primary)", display: "block", marginBottom: 4, fontFamily: "'Fraunces', serif" }}>{mode.label}</span>
                    <span style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.55 }}>{mode.description}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ padding: "0 24px 12px", display: "flex", justifyContent: "center" }}>
          <div style={{ maxWidth: 860, width: "100%", background: "var(--surface-elevated)", borderRadius: 20, border: "1px solid rgba(45,42,38,0.06)", boxShadow: "var(--shadow-sm)", padding: "14px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
              <div>
                <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: "var(--text-muted)", fontWeight: 700, display: "block", marginBottom: 4, fontFamily: "'Fraunces', serif" }}>Premium Preview</span>
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Premium lets you choose how Forj helps: calm first, map the pattern, leave with a plan, or go deeper.</span>
              </div>
              <button onClick={() => setShowUpgrade(true)} className="btn-glow" style={{ border: "none", background: "var(--interactive)", color: "#fff", padding: "10px 18px", borderRadius: 999, fontWeight: 700, cursor: "pointer" }}>
                Unlock Premium Modes
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
              {PREMIUM_CONVERSATION_MODES.map((mode) => (
                <div key={mode.id} style={{ padding: "12px 14px", borderRadius: 16, border: "1px dashed rgba(45,42,38,0.12)", background: "rgba(255,255,255,0.45)", opacity: 0.84 }}>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1.5, display: "block", marginBottom: 5, fontWeight: 700 }}>{mode.badge}</span>
                  <span style={{ fontSize: 14, color: "var(--text-primary)", display: "block", marginBottom: 4, fontFamily: "'Fraunces', serif" }}>{mode.label}</span>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.55 }}>{mode.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ HERO SECTION ═══════════ */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", position: "relative" }}>
        <div style={{ maxWidth: 600, width: "100%", textAlign: "center" }}>

          {/* Daily insight */}
          {dailyInsight && messages.length <= 1 && (
            <div style={{ marginBottom: 32, padding: "16px 24px", background: "var(--surface)", borderRadius: 16, border: "1px solid rgba(45,42,38,0.06)", maxWidth: 440, margin: "0 auto 32px", animation: "fadeIn 1.2s ease", position: "relative", boxShadow: "var(--shadow-sm)" }}>
              <span style={{ fontSize: 15, color: "var(--text-primary)", lineHeight: 1.6, fontStyle: "italic", display: "block", fontWeight: 300 }}>
                "{dailyInsight.quote}"
              </span>
              <span style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 8, display: "block", letterSpacing: 1 }}>— {dailyInsight.source}</span>
              <button onClick={() => {
                if (navigator.share) navigator.share({ title: dailyInsight.quote, text: `"${dailyInsight.quote}" — ${dailyInsight.source}\n\naiforj.com`, url: "https://aiforj.com" }).catch(() => {});
                else navigator.clipboard.writeText(`"${dailyInsight.quote}" — ${dailyInsight.source}\n\naiforj.com`).catch(() => {});
              }} style={{ position: "absolute", top: 10, right: 12, background: "none", border: "none", fontSize: 12, color: "var(--text-muted)", cursor: "pointer", padding: 4 }}>↗</button>
            </div>
          )}

          {/* Breathing Orb */}
          <div style={{ margin: "0 auto 28px" }}>
            <Orb state={state} onClick={handleOrb} />
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "var(--font-hero)", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 16px", lineHeight: 1.15, animation: "fadeIn 0.8s ease" }}>
            Your Private Mental Health Co-Pilot
          </h1>

          {/* Sub-headline */}
          <p style={{ fontSize: "clamp(15px, 2.5vw, 18px)", color: "var(--text-secondary)", margin: "0 auto 24px", lineHeight: 1.7, maxWidth: 520, animation: "fadeIn 1s ease 0.2s both" }}>
            Built by AIForj Team and clinically informed by a Licensed Healthcare Provider. {FORJ_MODALITY_COUNT} evidence-based therapeutic modalities. Privacy-forward and local-first where supported by your browser.
          </p>

          {/* Privacy badge */}
          <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginBottom: 32, animation: "fadeIn 1s ease 0.4s both" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 18px", background: "var(--accent-sage-light)", borderRadius: 24 }}>
              <span style={{ fontSize: 14 }}>🔒</span>
              <span style={{ fontSize: 12, color: "var(--accent-sage)", fontWeight: 500 }}>100% Private — nothing leaves your browser</span>
            </div>
            {webllmStatus === "ready" && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 18px", background: "rgba(107,155,158,0.12)", borderRadius: 24 }}>
                <span style={{ fontSize: 14 }}>🧠</span>
                <span style={{ fontSize: 12, color: "var(--accent-teal)", fontWeight: 600 }}>{webllmModelRef.current.label} ready on this device</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 32, animation: 'fadeIn 1s ease 0.5s both' }}>
            <a href="/start" className="btn-glow" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '14px 32px', borderRadius: 999, background: 'var(--interactive)', color: '#fff', textDecoration: 'none', fontWeight: 600 }}>Start reset</a>
            <a href="/tools" className="btn-glow" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '14px 32px', borderRadius: 999, background: 'transparent', color: 'var(--interactive)', textDecoration: 'none', border: '1.5px solid var(--interactive)' }}>Explore tools</a>
          </div>

          {/* Live transcript */}
          {state === "listening" && liveText && (
            <div style={{ marginBottom: 20, padding: "12px 20px", background: "var(--surface)", borderRadius: 14, maxWidth: 400, margin: "0 auto 20px", animation: "fadeIn 0.3s", border: "1px solid rgba(107,155,158,0.15)" }}>
              <span style={{ fontSize: 14, color: "var(--accent-teal)", fontStyle: "italic" }}>"{liveText}"</span>
            </div>
          )}

          {/* AI response */}
          {aiText && state !== "listening" && (
            <div style={{ marginBottom: 20, padding: "18px 24px", maxWidth: 480, margin: "0 auto 20px", animation: "fadeIn 0.5s", background: "var(--surface)", borderRadius: 16, boxShadow: "var(--shadow-sm)" }}>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--text-primary)", margin: 0, fontWeight: 300, opacity: 0.9 }}>{aiText}</p>
            </div>
          )}

          {sessionSummary && tier !== "free" && state !== "listening" && (
            <div style={{ margin: "0 auto 20px", maxWidth: 500, padding: "14px 18px", background: "var(--accent-sage-light)", borderRadius: 14, border: "1px solid rgba(125,155,130,0.14)", textAlign: "left", animation: "fadeIn 0.5s" }}>
              <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: "var(--accent-sage)", fontWeight: 700, display: "block", marginBottom: 6, fontFamily: "'Fraunces', serif" }}>Premium Carry Forward</span>
              <span style={{ fontSize: 14, color: "var(--text-primary)", display: "block", marginBottom: 6, fontFamily: "'Fraunces', serif" }}>{sessionSummary.headline}</span>
              <span style={{ fontSize: 11, color: "var(--accent-sage)", fontWeight: 700, display: "block", marginBottom: 6 }}>{sessionSummary.conversationModeLabel || getPremiumConversationMode(premiumMode).label}</span>
              <span style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.7, display: "block" }}>{sessionSummary.nextStep}</span>
            </div>
          )}

          {error && <div style={{ marginBottom: 14, fontSize: 12, color: "#B8860B", animation: "fadeIn 0.3s" }}>{error}</div>}

          {/* Free tier limits */}
          {tier === "free" && (
            <div style={{ marginBottom: 16, fontSize: 11, textAlign: "center" }}>
              {remainingMsgs !== null && (
                <span style={{ color: remainingMsgs <= 2 ? "var(--crisis)" : "var(--text-muted)", fontWeight: remainingMsgs <= 2 ? 600 : 400 }}>
                  {remainingMsgs} message{remainingMsgs !== 1 ? "s" : ""} left{remainingMsgs <= 1 ? " — your breakthrough might be one message away" : ""} ·{" "}
                </span>
              )}
              {remainingSessions !== null && <span style={{ color: "var(--text-secondary)" }}>{remainingSessions} session{remainingSessions !== 1 ? "s" : ""} left today</span>}
            </div>
          )}

          {/* Share prompt */}
          {showShare && messages.length >= 4 && (
            <div style={{ marginBottom: 14, animation: "slideUp 0.5s ease", display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
              <button onClick={() => {
                const shareText = `I just had a real conversation about my mental health — completely free and private.\n\n"${aiText.slice(0, 120)}..."\n\n— aiforj.com`;
                if (navigator.share) navigator.share({ title: "This helped me", text: shareText, url: "https://aiforj.com" }).catch(() => {});
                else navigator.clipboard.writeText(shareText).catch(() => {});
                setShowShare(false);
              }} style={{ background: "var(--surface)", border: "1px solid rgba(45,42,38,0.08)", padding: "8px 18px", borderRadius: 20, fontSize: 11, color: "var(--text-secondary)", cursor: "pointer" }}>
                ↗ Know someone who needs this? Share
              </button>
            </div>
          )}

          {/* Text input */}
          <div style={{ width: "100%", maxWidth: 460, margin: "0 auto", animation: "fadeIn 1s ease 0.6s both" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="text" value={textInput} onChange={e => setTextInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleTextSend(); }}
                placeholder="What's weighing on you right now?"
                disabled={state !== "idle"}
                style={{ flex: 1, padding: "14px 20px", fontSize: 15, background: "var(--surface)", border: "1.5px solid rgba(45,42,38,0.1)", borderRadius: 50, color: "var(--text-primary)", transition: "border-color 0.3s ease" }} />
              <button onClick={handleTextSend} disabled={!textInput.trim() || state !== "idle"}
                style={{ padding: "14px 24px", background: textInput.trim() && state === "idle" ? "var(--interactive)" : "var(--surface)", border: textInput.trim() && state === "idle" ? "none" : "1.5px solid rgba(45,42,38,0.1)", borderRadius: 50, color: textInput.trim() && state === "idle" ? "#fff" : "var(--text-muted)", cursor: textInput.trim() && state === "idle" ? "pointer" : "not-allowed", fontSize: 14, fontWeight: 500, transition: "all 0.3s ease" }}>
                Send
              </button>
            </div>
          </div>

          {tier !== "free" && companionMemory && (
            <div style={{ margin: "20px auto 0", maxWidth: 640, padding: "18px 18px 16px", background: "var(--surface-elevated)", borderRadius: 20, border: "1px solid rgba(45,42,38,0.06)", boxShadow: "var(--shadow-sm)", textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
                <div>
                  <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: "var(--accent-sage)", fontWeight: 700, display: "block", marginBottom: 4, fontFamily: "'Fraunces', serif" }}>Premium Continuity</span>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Forj is building on what tends to help you, privately on this device.</span>
                </div>
                <span style={{ fontSize: 11, padding: "5px 10px", borderRadius: 999, background: "var(--accent-sage-light)", color: "var(--accent-sage)", fontWeight: 700 }}>
                  {getPremiumConversationMode(premiumMode).label}
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
                {[
                  {
                    title: "Recurring themes",
                    value: companionMemory.recurringThemes?.slice(0, 2).map((item) => item.label).join(" • ") || "Not enough data yet",
                  },
                  {
                    title: "Helpful approaches",
                    value: companionMemory.helpfulApproaches?.slice(0, 2).map((item) => item.label).join(" • ") || "Still learning",
                  },
                  {
                    title: "Current focus",
                    value: companionMemory.currentFocus?.[0]?.label || "Your recent focus will show up here",
                  },
                ].map((card) => (
                  <div key={card.title} style={{ padding: "12px 14px", borderRadius: 16, background: "var(--surface)", border: "1px solid rgba(45,42,38,0.06)" }}>
                    <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--text-muted)", display: "block", marginBottom: 6, fontWeight: 700 }}>{card.title}</span>
                    <span style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.65 }}>{card.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* "How are you feeling?" prompt */}
          <p style={{ marginTop: 48, fontFamily: "'Fraunces', serif", fontSize: "var(--font-h3)", fontWeight: 400, color: "var(--text-secondary)", animation: "fadeIn 1s ease 0.8s both" }}>
            How are you feeling right now?
          </p>
        </div>
      </section>

      {/* Chat history panel */}
      {showHistory && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxHeight: "45vh", overflowY: "auto", background: "var(--surface-elevated)", boxShadow: "0 -4px 24px rgba(45,42,38,0.1)", borderTop: "1px solid rgba(45,42,38,0.06)", padding: "16px 20px", animation: "fadeIn 0.3s", zIndex: 50 }}>
          <div style={{ maxWidth: 480, margin: "0 auto" }}>
            <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: 12, fontFamily: "'Fraunces', serif" }}>Session</span>
            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: 8, padding: "10px 14px", background: m.role === "user" ? "rgba(107,155,158,0.06)" : "rgba(125,155,130,0.06)", borderRadius: 12, borderLeft: `3px solid ${m.role === "user" ? "var(--accent-teal)" : "var(--accent-sage)"}` }}>
                <span style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 3, fontFamily: "'Fraunces', serif" }}>{m.role === "user" ? "You" : "Forj"}</span>
                <span style={{ fontSize: 13, color: "var(--text-primary)", lineHeight: 1.6, opacity: 0.85 }}>{m.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════ EMOTION TILES ═══════════ */}
      <section style={{ padding: "40px 24px 80px", maxWidth: 1080, width: "100%", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12, marginBottom: showAllPathways ? 12 : 24 }}>
          {visiblePathways.map((e) => {
            const accentColor = emotionColors[e.id] || "#7D9B82";
            return (
              <a key={e.id} href={`/tools?start=${e.id}`} className="emotion-tile" style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "18px 20px", background: "var(--surface-elevated)", border: "1px solid rgba(45,42,38,0.06)",
                borderRadius: 16, cursor: "pointer", textDecoration: "none",
                borderLeft: `4px solid ${accentColor}`, boxShadow: "var(--shadow-sm)",
              }}
              onMouseEnter={ev => { ev.currentTarget.style.background = `${accentColor}08`; ev.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
              onMouseLeave={ev => { ev.currentTarget.style.background = "var(--surface-elevated)"; ev.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}>
                <span style={{ fontSize: 28, flexShrink: 0 }}>{e.icon}</span>
                <div>
                  <span style={{ fontSize: 15, fontWeight: 500, color: "var(--text-primary)", display: "block", marginBottom: 2 }}>{e.label}</span>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{e.desc}</span>
                </div>
              </a>
            );
          })}
        </div>
        {!showAllPathways && (
          <div style={{ textAlign: "center" }}>
            <button onClick={() => setShowAllPathways(true)} className="btn-glow" style={{ background: "none", border: "1.5px solid var(--interactive)", padding: "10px 28px", borderRadius: 24, fontSize: 13, color: "var(--interactive)", cursor: "pointer", fontWeight: 500 }}>
              See all 15 pathways →
            </button>
          </div>
        )}
      </section>

      {/* ═══════════ EMOTIONAL BLUEPRINT (Viral Engine) ═══════════ */}
      <section style={{ padding: "80px 24px", background: "var(--bg-secondary)" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "var(--font-h2)", fontWeight: 500, color: "var(--text-primary)", margin: "0 0 16px" }}>
            Discover Your Emotional Blueprint
          </h2>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.7, margin: "0 auto 32px", maxWidth: 540 }}>
            A 2-minute assessment designed by AIForj Team and clinically informed by a Licensed Healthcare Provider. Learn your stress response pattern, your dominant thinking style, and which techniques match your brain.
          </p>

          {/* Preview Card */}
          <div style={{ background: "var(--surface-elevated)", borderRadius: 20, padding: "28px 24px", margin: "0 auto 28px", maxWidth: 380, boxShadow: "var(--shadow-lg)", border: "1px solid rgba(45,42,38,0.06)", textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, var(--accent-sage), var(--accent-teal))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 20 }}>🛡️</span>
              </div>
              <div>
                <span style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 500, color: "var(--text-primary)", display: "block" }}>The Sentinel</span>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Hypervigilant Protector Pattern</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
              {["High threat scanning", "Somatic tension", "Cognitive rumination"].map(t => (
                <span key={t} style={{ fontSize: 10, padding: "3px 10px", background: "var(--accent-sage-light)", color: "var(--accent-sage)", borderRadius: 12, fontWeight: 500 }}>{t}</span>
              ))}
            </div>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0, fontStyle: "italic" }}>Best techniques: Box Breathing, Progressive Muscle Relaxation, Cognitive Restructuring</p>
          </div>

          <a href="/blueprint" className="btn-glow" style={{ display: "inline-block", padding: "16px 40px", fontSize: 16, fontFamily: "'Fraunces', serif", fontWeight: 600, background: "var(--interactive)", color: "#fff", borderRadius: 50, textDecoration: "none", marginBottom: 16 }}>
            Take the Assessment — Free, 2 Minutes
          </a>
          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>Nothing is stored. Nothing leaves your browser.</p>
        </div>
      </section>

      {/* ═══════════ QUICK TOOLS ═══════════ */}
      <section style={{ padding: "80px 24px", maxWidth: 1080, width: "100%", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 3, color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: 8 }}>Quick Tools</span>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "var(--font-h3)", fontWeight: 400, color: "var(--text-primary)", margin: 0 }}>Instant interventions — no session needed</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, maxWidth: 680, margin: "0 auto 28px" }}>
          {[
            { id: "box",    icon: "▣",  label: "Box Breathing",       time: "2 min", free: true },
            { id: "sigh",   icon: "🌬️", label: "Physiological Sigh",  time: "1 min", free: true },
            { id: "ground", icon: "🌿", label: "5-4-3-2-1 Grounding", time: "3 min", free: true },
            { id: "defuse", icon: "🧠", label: "Thought Defusion",    time: "2 min", free: false },
            { id: "tipp",   icon: "❄️", label: "TIPP Crisis Skill",   time: "3 min", free: false },
          ].map((tool) => (
            <a key={tool.id} href={`/tools?tool=${tool.id}`} className="quicktool-hover card-hover" style={{
              display: "flex", alignItems: "center", gap: 12, padding: "16px 18px",
              background: "var(--surface-elevated)", border: "1px solid rgba(45,42,38,0.06)",
              borderRadius: 14, textDecoration: "none", boxShadow: "var(--shadow-sm)",
            }}>
              <span style={{ fontSize: 22 }}>{tool.icon}</span>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)", display: "block" }}>{tool.label}</span>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{tool.time}</span>
              </div>
              {!tool.free && <span style={{ fontSize: 9, padding: "2px 8px", background: "var(--interactive)", color: "#fff", borderRadius: 8, fontWeight: 700 }}>PRO</span>}
            </a>
          ))}
        </div>
        <div style={{ textAlign: "center" }}>
          <a href="/techniques" style={{ fontSize: 14, color: "var(--interactive)", fontWeight: 500, textDecoration: "none" }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--interactive-hover)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--interactive)"}>
            Browse the technique library →
          </a>
        </div>
      </section>

      {/* ═══════════ PROGRESS GARDEN PREVIEW ═══════════ */}
      <section style={{ padding: "80px 24px", background: "var(--bg-secondary)" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "var(--font-h2)", fontWeight: 500, color: "var(--text-primary)", margin: "0 0 16px" }}>
            Watch Yourself Grow
          </h2>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.7, margin: "0 auto 32px", maxWidth: 520 }}>
            Every session plants a seed. Track your emotional patterns, build streaks, and watch your garden bloom — all stored privately on your device. Only you can see it.
          </p>
          {/* Garden SVG illustration */}
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 32 }}>
            {[
              { h: 30, color: "var(--accent-sage)", label: "Day 1" },
              { h: 50, color: "var(--garden-growth)", label: "Day 7" },
              { h: 75, color: "var(--garden-bloom)", label: "Day 14" },
              { h: 100, color: "var(--accent-warm)", label: "Day 30" },
            ].map((plant, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: plant.h, background: `linear-gradient(to top, ${plant.color}, ${plant.color}88)`, borderRadius: 4, position: "relative" }}>
                  <div style={{ position: "absolute", top: -8, left: -8, width: 24, height: 24, borderRadius: "50%", background: plant.color, opacity: 0.3 }} />
                  <div style={{ position: "absolute", top: -4, left: -4, width: 16, height: 16, borderRadius: "50%", background: plant.color, opacity: 0.6 }} />
                </div>
                <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{plant.label}</span>
              </div>
            ))}
          </div>
          <a href="/garden" className="btn-glow" style={{ display: "inline-block", padding: "14px 36px", fontSize: 15, fontFamily: "'Fraunces', serif", fontWeight: 500, background: "var(--interactive)", color: "#fff", borderRadius: 50, textDecoration: "none" }}>
            Start Growing →
          </a>
        </div>
      </section>

      {/* ═══════════ TWO WAYS ═══════════ */}
      <section style={{ padding: "80px 24px", maxWidth: 1080, width: "100%", margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "var(--font-h2)", fontWeight: 500, color: "var(--text-primary)", textAlign: "center", margin: "0 0 32px" }}>Two Ways to Use AIForj</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, maxWidth: 680, margin: "0 auto" }}>
          <div className="card-hover" style={{ padding: "32px 28px", background: "var(--surface-elevated)", border: "1px solid rgba(45,42,38,0.06)", borderRadius: 20, boxShadow: "var(--shadow-md)" }}>
            <span style={{ fontSize: 32, display: "block", marginBottom: 14 }}>🗣️</span>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 19, fontWeight: 500, color: "var(--text-primary)", margin: "0 0 10px" }}>Talk or Type</h3>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>Personalized support in the moment. The AI adapts to what you say using {FORJ_MODALITY_COUNT} therapeutic modalities.</p>
          </div>
          <div className="card-hover" style={{ padding: "32px 28px", background: "var(--surface-elevated)", border: "1px solid rgba(45,42,38,0.06)", borderRadius: 20, boxShadow: "var(--shadow-md)" }}>
            <span style={{ fontSize: 32, display: "block", marginBottom: 14 }}>🧭</span>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 19, fontWeight: 500, color: "var(--text-primary)", margin: "0 0 10px" }}>Guided Tools</h3>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>A structured reset in 2–5 minutes. Choose what you're feeling and follow the guided protocol.</p>
          </div>
        </div>
      </section>

      {/* ═══════════ CLINICAL CREDENTIAL ═══════════ */}
      <section style={{ padding: "80px 24px", background: "var(--bg-secondary)" }}>
        <div style={{ maxWidth: 620, margin: "0 auto", textAlign: "center" }}>
          <img src="/aif.jpeg" alt="AIForj" style={{ height: 64, width: "auto", borderRadius: 14, marginBottom: 20, boxShadow: "var(--shadow-md)" }} />
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(16px, 2.5vw, 20px)", color: "var(--text-primary)", lineHeight: 1.8, margin: "0 0 24px", fontWeight: 400, fontStyle: "italic" }}>
            Forj was built for the space between moments of care: private, practical, and grounded in real therapeutic techniques rather than generic affirmations.
          </p>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 500, margin: "0 0 20px" }}>
            — AIForj Team, clinically informed by a Licensed Healthcare Provider
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
            {["Evidence-Informed", "Local-First Sessions", "Browser-Based AI Mode", "Privacy-Forward Design"].map(b => (
              <span key={b} style={{ padding: "5px 14px", background: "var(--surface-elevated)", border: "1px solid rgba(45,42,38,0.06)", borderRadius: 20, fontSize: 11, color: "var(--text-secondary)", fontWeight: 500, boxShadow: "var(--shadow-sm)" }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ PREMIUM ═══════════ */}
      {tier === "free" && (
        <section style={{ padding: "80px 24px", maxWidth: 680, width: "100%", margin: "0 auto" }}>
          <div style={{ background: "var(--surface-elevated)", borderRadius: 24, padding: "48px 32px", textAlign: "center", boxShadow: "var(--shadow-lg)", border: "1px solid rgba(45,42,38,0.06)" }}>
            <span style={{ fontSize: 36, display: "block", marginBottom: 12 }}>✦</span>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "var(--font-h3)", fontWeight: 500, color: "var(--text-primary)", margin: "0 0 12px", lineHeight: 1.3 }}>When the free conversation helps — but you want something that keeps up with your real life</h2>
            <p style={{ fontSize: 15, color: "var(--text-secondary)", margin: "0 auto 24px", lineHeight: 1.7, maxWidth: 480 }}>
              Free gives you private in-the-moment support. Premium becomes your continuity layer between hard moments, therapy sessions, and the rest of your week.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: 20 }}>
              {["Premium modes", "On-device memory", "Pattern tracking", "Session notes", "Unlimited conversations"].map((benefit) => (
                <span key={benefit} style={{ fontSize: 11, padding: "5px 12px", borderRadius: 999, background: "var(--accent-sage-light)", color: "var(--accent-sage)", fontWeight: 700 }}>
                  {benefit}
                </span>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, textAlign: "left", marginBottom: 24 }}>
              {[
                {
                  title: "Choose the kind of help",
                  body: "Steady Me, Pattern, Plan, and Deep Work make Forj feel like four different high-value sessions in one tool.",
                },
                {
                  title: "It remembers what works",
                  body: "Premium keeps a private on-device memory of recurring themes and helpful approaches, so you do not have to start from zero every time.",
                },
                {
                  title: "It leaves you with something useful",
                  body: "Session notes, carry-forward actions, and exportable notes turn reflection into something you can actually use after the conversation ends.",
                },
              ].map((card) => (
                <div key={card.title} style={{ padding: "16px 16px 14px", borderRadius: 18, background: "var(--surface)", border: "1px solid rgba(45,42,38,0.06)" }}>
                  <span style={{ fontSize: 15, color: "var(--text-primary)", display: "block", marginBottom: 6, fontFamily: "'Fraunces', serif" }}>{card.title}</span>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.7 }}>{card.body}</span>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 24, padding: "16px 18px", background: "linear-gradient(135deg, rgba(125,155,130,0.12), rgba(107,155,158,0.12))", borderRadius: 18, border: "1px solid rgba(125,155,130,0.16)", textAlign: "left" }}>
              <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: "var(--accent-sage)", fontWeight: 700, display: "block", marginBottom: 8, fontFamily: "'Fraunces', serif" }}>Why it clears $9.99/month</span>
              <div style={{ display: "grid", gap: 8 }}>
                {[
                  "Cheaper than one therapy copay, but useful between every therapy session.",
                  "Cheaper than losing a whole evening to a stress spiral you could have interrupted earlier.",
                  "Cheaper than most subscription clutter, while actually helping you think, regulate, and act differently.",
                ].map((reason) => (
                  <span key={reason} style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.7 }}>{reason}</span>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
              <button onClick={handleSubscribe} className="btn-glow" style={{ padding: "16px 40px", fontSize: 16, fontFamily: "'Fraunces', serif", background: "var(--interactive)", color: "#fff", border: "none", borderRadius: 50, cursor: "pointer", fontWeight: 600 }}>
                Start 7-Day Free Trial
              </button>
              <button onClick={handleSubscribe} className="btn-glow" style={{ padding: "16px 32px", fontSize: 14, fontFamily: "'DM Sans', sans-serif", background: "transparent", color: "var(--interactive)", border: "1.5px solid var(--interactive)", borderRadius: 50, cursor: "pointer", fontWeight: 500 }}>
                Start Premium — $9.99/mo
              </button>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>7-day free trial · $9.99/month · Cancel anytime</p>
          </div>
        </section>
      )}

      {/* ═══════════ CBT WORKBOOK ═══════════ */}
      <section style={{ padding: "40px 24px 80px", maxWidth: 680, width: "100%", margin: "0 auto" }}>
        <a href="https://aiforj.gumroad.com/l/jmdqvd" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>
          <div className="card-hover" style={{ display: "flex", alignItems: "center", gap: 20, padding: "24px 28px", background: "var(--surface-elevated)", border: "1px solid rgba(45,42,38,0.06)", borderRadius: 20, boxShadow: "var(--shadow-md)" }}>
            <span style={{ fontSize: 40, flexShrink: 0 }}>📘</span>
            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                <span style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", fontFamily: "'Fraunces', serif" }}>CBT Thought Reframe Workbook</span>
                <span style={{ fontSize: 12, padding: "3px 10px", background: "var(--accent-warm-light)", color: "var(--accent-warm)", borderRadius: 20, fontWeight: 600 }}>$27</span>
              </div>
              <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>84 pages · 30 days of exercises · 10 cognitive distortions</span>
            </div>
            <span style={{ fontSize: 20, color: "var(--accent-sage)", opacity: 0.6, flexShrink: 0 }}>→</span>
          </div>
        </a>
      </section>

      {/* ═══════════ EMAIL CAPTURE ═══════════ */}
      <section style={{ padding: "40px 24px 80px" }}>
        <EmailCapture />
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer style={{ padding: "48px 24px 32px", textAlign: "center", background: "var(--bg-secondary)", borderTop: "1px solid rgba(45,42,38,0.06)" }}>
        {/* Crisis resources — prominent */}
        <div style={{ marginBottom: 28, padding: "18px 24px", background: "var(--surface-elevated)", borderRadius: 16, display: "inline-block", boxShadow: "var(--shadow-sm)" }}>
          <p style={{ fontSize: 14, color: "var(--text-primary)", margin: "0 0 4px", fontWeight: 500 }}>
            In crisis? You're not alone.
          </p>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>
            Call or text <strong style={{ color: "var(--crisis)" }}>988</strong> · Text HOME to <strong style={{ color: "var(--crisis)" }}>741741</strong>
          </p>
        </div>

        <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, margin: "0 0 24px", maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
          Forj is a wellness companion — not a therapist or substitute for professional care.
        </p>

        {/* Footer nav */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 20, marginBottom: 24 }}>
          {[
            { href: "https://aiforj.com", label: "AIForj.com" },
            { href: "/tools", label: "Guided Protocols" },
            { href: "/techniques", label: "Technique Library" },
            { href: "https://aiforj.gumroad.com/l/jmdqvd", label: "📘 CBT Workbook", ext: true },
            { href: "https://medium.com/@kcooke493/im-a-psych-np-and-i-built-a-free-ai-wellness-tool-8d46e01a6852", label: "Read Our Story", ext: true },
            { href: "https://x.com/AIForj", label: "𝕏 @AIForj", ext: true },
          ].map(link => (
            <a key={link.label} href={link.href} {...(link.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              style={{ fontSize: 12, color: "var(--text-muted)", textDecoration: "none", transition: "color 0.3s" }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--interactive)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}>{link.label}</a>
          ))}
        </div>

        {/* Help with... */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 24 }}>
          {[
            { href: "/3am-spiral", icon: "🌙", label: "3AM Spiral" },
            { href: "/overwhelmed", icon: "🌊", label: "Overwhelmed" },
            { href: "/burned-out", icon: "🪨", label: "Burned Out" },
            { href: "/find-help", icon: "🔍", label: "Find a Provider" },
          ].map(link => (
            <a key={link.label} href={link.href} style={{ fontSize: 11, color: "var(--text-muted)", textDecoration: "none", padding: "5px 14px", background: "var(--surface)", borderRadius: 20, transition: "all 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--interactive)"; e.currentTarget.style.background = "var(--accent-sage-light)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "var(--surface)"; }}>
              {link.icon} {link.label}
            </a>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
          <button onClick={() => {
            const text = "Free AI therapeutic companion — clinically informed, completely private, evidence-based. This helped me.\n\naiforj.com";
            if (navigator.share) navigator.share({ title: "AIForj", text, url: "https://aiforj.com" }).catch(() => {});
            else navigator.clipboard.writeText(text).catch(() => {});
          }} className="btn-glow" style={{ background: "none", border: "1px solid rgba(45,42,38,0.08)", padding: "8px 20px", borderRadius: 20, fontSize: 12, color: "var(--text-secondary)", cursor: "pointer" }}>
            ↗ Share Forj
          </button>
          <DataManagement />
        </div>

        <p style={{ fontSize: 11, color: "var(--text-muted)", opacity: 0.5, margin: 0 }}>
          © 2026 AIForj. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
