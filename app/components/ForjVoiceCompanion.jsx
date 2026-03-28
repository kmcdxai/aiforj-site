"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import EmailCapture from "./EmailCapture";

// ═══════════════════════════════════════════════════════════════════════════
//
//  AIForj VOICE COMPANION — "Talk to Forj"
//
//  The world's first voice-based, clinician-built, completely private
//  AI therapeutic companion.
//
//  15+ therapeutic modalities with dynamic selection
//  Built by a Board Certified PMHNP
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
      voiceInput: true,
      textInput: true,
      basicTherapeuticResponse: true,
      breathingExercise: true,
      groundingExercise: true,
      crisisDetection: true,
      // LOCKED
      sessionHistory: false,
      moodTracking: false,
      sessionInsights: false,
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
      voiceInput: true, textInput: true, basicTherapeuticResponse: true,
      breathingExercise: true, groundingExercise: true, crisisDetection: true,
      sessionHistory: true, moodTracking: true, sessionInsights: true,
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
      voiceInput: true, textInput: true, basicTherapeuticResponse: true,
      breathingExercise: true, groundingExercise: true, crisisDetection: true,
      sessionHistory: true, moodTracking: true, sessionInsights: true,
      advancedTechniques: true, unlimitedMessages: true, exportNotes: true,
      guidedMeditation: true, weeklyReport: true,
    }
  },
};

// ─────────────────────────────────────────────────
// THE CLINICAL INTELLIGENCE ENGINE
// This is the brain of the entire product.
// Dynamic technique selection across 15+ modalities.
// ─────────────────────────────────────────────────
const CLINICAL_SYSTEM_PROMPT = `You are FORJ — the AI voice companion inside AIForj.com. You were designed by a Board Certified Psychiatric Mental Health Nurse Practitioner (PMHNP-BC). You are the most clinically sophisticated, evidence-based AI wellness companion available.

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
// THERAPY MODALITIES — expandable plain-English guide
// ─────────────────────────────────────────────────
const MODALITIES = [
  {
    name: "CBT",
    full: "Cognitive Behavioral Therapy",
    plain: "Your thoughts drive your feelings. CBT helps you catch distorted thinking patterns (like catastrophizing or all-or-nothing thinking) and replace them with accurate, realistic ones.",
    best: "Anxiety, depression, OCD, phobias, negative self-talk",
  },
  {
    name: "DBT",
    full: "Dialectical Behavior Therapy",
    plain: "Built for intense emotions. DBT gives you concrete skills to survive emotional crises, regulate overwhelming feelings, and improve relationships — all without making things worse.",
    best: "Emotional dysregulation, self-harm urges, relationship conflict, borderline traits",
  },
  {
    name: "ACT",
    full: "Acceptance & Commitment Therapy",
    plain: "Stop fighting your thoughts — learn to notice them without being controlled by them. ACT helps you accept discomfort and take action based on what truly matters to you.",
    best: "Chronic anxiety, avoidance, feeling stuck, disconnection from purpose",
  },
  {
    name: "IPT",
    full: "Interpersonal Therapy",
    plain: "Emotions and relationships are deeply connected. IPT focuses on grief, role changes (new job, breakup, parenthood), and improving how you communicate with the people in your life.",
    best: "Depression, grief, loneliness, relationship difficulties, major life transitions",
  },
  {
    name: "MBSR",
    full: "Mindfulness-Based Stress Reduction",
    plain: "Train your brain to stay in the present moment instead of replaying the past or worrying about the future. Simple awareness practices that reduce chronic stress over time.",
    best: "Chronic stress, burnout, racing thoughts, physical tension, inability to relax",
  },
  {
    name: "Polyvagal",
    full: "Polyvagal Theory",
    plain: "Your nervous system runs on a safety/threat dial. This approach helps you understand why you feel numb, frozen, or in fight-or-flight — and gives you tools to shift back to calm.",
    best: "Freeze responses, numbness, shutdown, hypervigilance, trauma aftermath",
  },
  {
    name: "Somatic",
    full: "Somatic Experiencing",
    plain: "The body keeps score. This approach works with physical sensations — tightness, heaviness, racing heart — to process emotions that are stuck in the body rather than just the mind.",
    best: "Trauma, chronic tension, dissociation, emotions that feel stuck or unexplainable",
  },
  {
    name: "EFT",
    full: "Emotion-Focused Therapy",
    plain: "Many people struggle to name or feel their emotions clearly. EFT helps you identify, understand, and process your feelings instead of suppressing or intellectualizing them.",
    best: "Emotional numbness, difficulty expressing feelings, relationship distress, grief",
  },
  {
    name: "Narrative",
    full: "Narrative Therapy",
    plain: "The stories we tell about ourselves shape who we think we are. Narrative therapy helps you separate yourself from the problem and rewrite the story — especially when it's one you inherited, not chose.",
    best: "Shame, identity struggles, internalized criticism, 'I'm broken' beliefs",
  },
  {
    name: "Schema",
    full: "Schema Therapy",
    plain: "Some beliefs about yourself formed in childhood and never updated. Schema therapy identifies these deep patterns — like 'I'm unlovable' or 'I must be perfect' — and heals them at the root.",
    best: "Lifelong patterns, core beliefs about self-worth, childhood wounds, recurring relationship issues",
  },
  {
    name: "IFS",
    full: "Internal Family Systems",
    plain: "You're not one thing — you're made of different 'parts': an inner critic, a scared child, a protector. IFS helps these parts coexist peacefully instead of fighting each other.",
    best: "Self-sabotage, internal conflict, inner critic, trauma, feeling at war with yourself",
  },
  {
    name: "Positive Psychology",
    full: "Positive Psychology",
    plain: "Mental health isn't just the absence of suffering — it's the presence of strength. This approach builds resilience, meaning, gratitude, and the things that make life genuinely good.",
    best: "Optimization, resilience-building, purpose, recovering from difficult periods",
  },
];

function TherapyModalities() {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "#7DB0C8", fontWeight: 600, fontFamily: "'Sora', sans-serif" }}>Evidence-Based Approaches</span>
        <span style={{ fontSize: 11, color: "#7DB0C8", opacity: 0.4, fontFamily: "'IBM Plex Sans', sans-serif" }}>— tap any to learn more</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {MODALITIES.map((m) => (
          <div key={m.name}>
            <button
              onClick={() => setOpen(open === m.name ? null : m.name)}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: open === m.name ? "rgba(91,191,176,0.08)" : "rgba(91,191,176,0.04)", border: `1px solid ${open === m.name ? "rgba(91,191,176,0.2)" : "rgba(91,191,176,0.08)"}`, borderRadius: open === m.name ? "12px 12px 0 0" : 12, cursor: "pointer", transition: "all 0.2s", textAlign: "left" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: open === m.name ? "#5BBFB0" : "#6090A8", fontFamily: "'Sora', sans-serif", minWidth: 52 }}>{m.name}</span>
                <span style={{ fontSize: 12, color: "#7DB0C8", fontFamily: "'IBM Plex Sans', sans-serif", opacity: 0.7 }}>{m.full}</span>
              </div>
              <span style={{ fontSize: 14, color: open === m.name ? "#5BBFB0" : "#6090A8", opacity: 0.5, flexShrink: 0, transform: open === m.name ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
            </button>
            {open === m.name && (
              <div style={{ padding: "14px 16px 16px", background: "rgba(91,191,176,0.04)", border: "1px solid rgba(91,191,176,0.12)", borderTop: "none", borderRadius: "0 0 12px 12px", animation: "fadeIn 0.2s ease" }}>
                <p style={{ fontSize: 13, color: "#D8E8F0", lineHeight: 1.7, margin: "0 0 10px", fontFamily: "'IBM Plex Sans', sans-serif" }}>{m.plain}</p>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                  <span style={{ fontSize: 11, color: "#5BBFB0", fontWeight: 600, fontFamily: "'Sora', sans-serif", flexShrink: 0, marginTop: 1 }}>Best for:</span>
                  <span style={{ fontSize: 11, color: "#7DB0C8", fontFamily: "'IBM Plex Sans', sans-serif", lineHeight: 1.6 }}>{m.best}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
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
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 100, animation: "fadeIn 0.5s ease" }}>
      <span style={{ fontSize: 12, color: "#7DB0C8", letterSpacing: 3, textTransform: "uppercase", marginBottom: 32, fontFamily: "'Sora', sans-serif" }}>{p.name}</span>
      <div style={{ width: sz, height: sz, borderRadius: "50%", background: `radial-gradient(circle, rgba(91,191,176,0.3) 0%, rgba(91,191,176,0.05) 100%)`, transition: "all 1.8s ease-in-out", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", boxShadow: `0 0 ${sz/2}px rgba(91,191,176,0.15)`, border: "1px solid rgba(91,191,176,0.15)" }}>
        <span style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 3, color: "#5BBFB0", fontWeight: 600, fontFamily: "'Sora', sans-serif" }}>{label}</span>
        <span style={{ fontSize: 40, fontWeight: 300, color: "#D8E8F0", marginTop: 4, fontFamily: "'IBM Plex Sans', sans-serif" }}>{count}</span>
      </div>
      <span style={{ fontSize: 12, color: "#7DB0C8", marginTop: 24, fontFamily: "'IBM Plex Sans', sans-serif", opacity: 0.6 }}>Cycle {Math.min(cycle + 1, totalCycles)} / {totalCycles}</span>
      <button onClick={onClose} style={{ marginTop: 32, background: "none", border: "1px solid rgba(91,191,176,0.2)", padding: "8px 24px", borderRadius: 20, color: "#7DB0C8", fontSize: 12, cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif" }}>End Early</button>
    </div>
  );
}

// ─────────────────────────────────────────────────
// ANIMATED ORB
// ─────────────────────────────────────────────────
function Orb({ state, onClick }) {
  const cfg = {
    idle:      { c: "79,255,176",  op: 0.22, sz: 160, speed: "4s",   label: "Tap to talk" },
    listening: { c: "45,212,191",  op: 0.45, sz: 220, speed: "1.2s", label: "Listening..." },
    thinking:  { c: "123,107,200", op: 0.35, sz: 175, speed: "2.2s", label: "Thinking..." },
    speaking:  { c: "79,255,176",  op: 0.38, sz: 195, speed: "1.8s", label: "Speaking..." },
  };
  const s = cfg[state] || cfg.idle;
  return (
    <div onClick={onClick} style={{ cursor: state === "idle" || state === "speaking" ? "pointer" : "default", position: "relative", width: 300, height: 300, display: "flex", alignItems: "center", justifyContent: "center", userSelect: "none" }}>
      <div style={{ position: "absolute", width: s.sz + 100, height: s.sz + 100, borderRadius: "50%", background: `radial-gradient(circle, rgba(${s.c},0.12) 0%, transparent 70%)`, animation: `orbPulse ${s.speed} ease-in-out infinite`, transition: "all 0.8s" }} />
      <div style={{ position: "absolute", width: s.sz + 40, height: s.sz + 40, borderRadius: "50%", background: `rgba(${s.c},0.06)`, border: `1px solid rgba(${s.c},0.1)`, transition: "all 0.6s", animation: `orbPulse ${s.speed} ease-in-out infinite 0.3s` }} />
      <div style={{ position: "relative", width: s.sz, height: s.sz, borderRadius: "50%", background: `radial-gradient(circle at 40% 35%, rgba(${s.c},${s.op}), rgba(20,38,58,0.05))`, transition: "all 0.5s", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 ${s.sz * 0.6}px rgba(${s.c},0.18), 0 0 ${s.sz * 0.25}px rgba(${s.c},0.1)`, border: `1px solid rgba(${s.c},0.15)` }}>
        <span style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: 3, color: `rgba(${s.c},0.9)`, fontWeight: 600, fontFamily: "'Sora', sans-serif" }}>{s.label}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────
// SESSION INSIGHTS (Premium)
// ─────────────────────────────────────────────────
function SessionInsights({ messages, onClose, theme }) {
  const userMsgs = messages.filter(m => m.role === "user");
  const aiMsgs = messages.filter(m => m.role === "assistant");
  
  // Simple technique detection from AI responses
  const techniques = [];
  const allAiText = aiMsgs.map(m => m.text).join(" ").toLowerCase();
  if (allAiText.includes("cbt") || allAiText.includes("cognitive") || allAiText.includes("distortion") || allAiText.includes("evidence for") || allAiText.includes("reframe")) techniques.push({ name: "CBT", desc: "Cognitive restructuring & thought challenging" });
  if (allAiText.includes("dbt") || allAiText.includes("radical acceptance") || allAiText.includes("distress tolerance") || allAiText.includes("wise mind")) techniques.push({ name: "DBT", desc: "Emotional regulation & distress tolerance" });
  if (allAiText.includes("act") || allAiText.includes("defusion") || allAiText.includes("values") || allAiText.includes("notice i'm having")) techniques.push({ name: "ACT", desc: "Acceptance, defusion & values alignment" });
  if (allAiText.includes("interpersonal") || allAiText.includes("loneliness") || allAiText.includes("relationship pattern")) techniques.push({ name: "IPT", desc: "Interpersonal patterns & connection" });
  if (allAiText.includes("behavioral activation") || allAiText.includes("5-minute") || allAiText.includes("motivation follows")) techniques.push({ name: "BA", desc: "Behavioral activation & motivation" });
  if (allAiText.includes("body") || allAiText.includes("nervous system") || allAiText.includes("somatic") || allAiText.includes("polyvagal")) techniques.push({ name: "Somatic", desc: "Body-based awareness & nervous system regulation" });
  if (allAiText.includes("mindful") || allAiText.includes("present moment") || allAiText.includes("notice")) techniques.push({ name: "MBSR", desc: "Mindfulness & present-moment anchoring" });
  if (allAiText.includes("self-compassion") || allAiText.includes("kind to yourself") || allAiText.includes("friend")) techniques.push({ name: "Self-Compassion", desc: "Self-kindness & common humanity" });
  if (allAiText.includes("parts") || allAiText.includes("inner critic") || allAiText.includes("protective")) techniques.push({ name: "IFS", desc: "Parts work & internal system awareness" });
  if (allAiText.includes("schema") || allAiText.includes("pattern") || allAiText.includes("way back")) techniques.push({ name: "Schema", desc: "Deep pattern identification" });
  if (allAiText.includes("narrative") || allAiText.includes("story") || allAiText.includes("inherited")) techniques.push({ name: "Narrative", desc: "Story re-authoring & externalization" });
  if (techniques.length === 0) techniques.push({ name: "Supportive", desc: "Active listening & validation" });

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(20px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, animation: "fadeIn 0.4s ease" }}>
      <div style={{ background: "#1C3248", borderRadius: 24, padding: "36px 32px", maxWidth: 460, width: "100%", maxHeight: "85vh", overflowY: "auto", border: "1px solid rgba(91,191,176,0.1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 600, color: "#D8E8F0" }}>Session Insights</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#7DB0C8", fontSize: 20, cursor: "pointer" }}>×</button>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          {[{ val: userMsgs.length, label: "Messages" }, { val: techniques.length, label: "Techniques" }, { val: `${Math.round(messages.length * 0.4)}m`, label: "Duration" }].map(s => (
            <div key={s.label} style={{ flex: 1, background: "rgba(91,191,176,0.05)", borderRadius: 12, padding: "12px 8px", textAlign: "center", border: "1px solid rgba(91,191,176,0.08)" }}>
              <span style={{ fontSize: 22, fontWeight: 300, color: "#5BBFB0", display: "block", fontFamily: "'Sora', sans-serif" }}>{s.val}</span>
              <span style={{ fontSize: 10, color: "#7DB0C8", textTransform: "uppercase", letterSpacing: 1, fontFamily: "'IBM Plex Sans', sans-serif" }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Techniques used */}
        <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: "#7DB0C8", fontWeight: 600, display: "block", marginBottom: 10, fontFamily: "'Sora', sans-serif" }}>Techniques Applied</span>
        {techniques.map(t => (
          <div key={t.name} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 12px", background: "rgba(91,191,176,0.03)", borderRadius: 10, marginBottom: 6, borderLeft: "2px solid rgba(91,191,176,0.2)" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#5BBFB0", minWidth: 60, fontFamily: "'Sora', sans-serif" }}>{t.name}</span>
            <span style={{ fontSize: 11, color: "#7DB0C8", fontFamily: "'IBM Plex Sans', sans-serif" }}>{t.desc}</span>
          </div>
        ))}

        <div style={{ marginTop: 20, padding: "14px 16px", background: "rgba(91,191,176,0.03)", borderRadius: 12, border: "1px solid rgba(91,191,176,0.08)" }}>
          <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: "#7DB0C8", fontWeight: 600, display: "block", marginBottom: 6, fontFamily: "'Sora', sans-serif" }}>Clinical Note</span>
          <span style={{ fontSize: 13, color: "#7DB0C8", lineHeight: 1.7, fontFamily: "'IBM Plex Sans', sans-serif" }}>
            This session used {techniques.map(t => t.name).join(", ")} techniques dynamically selected based on your needs.
            Forj adapted its approach {techniques.length > 1 ? "multiple times" : ""} during your conversation to provide the most relevant support.
            For deeper work on the patterns explored today, consider connecting with a licensed therapist.
          </span>
        </div>

        <div style={{ marginTop: 16, textAlign: "center" }}>
          <span style={{ fontSize: 10, color: "#7DB0C8", opacity: 0.4, fontFamily: "'IBM Plex Sans', sans-serif" }}>Session data stored locally on your device only.</span>
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
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 24, animation: "fadeIn 0.3s ease" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#1C3248", borderRadius: 24, padding: "36px 28px", maxWidth: 420, width: "100%", border: "1px solid rgba(91,191,176,0.12)", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <span style={{ fontSize: 36, display: "block", marginBottom: 10 }}>✦</span>
          <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 600, color: "#D8E8F0", display: "block" }}>AIForj Premium</span>
          <span style={{ fontSize: 13, color: "#7DB0C8", marginTop: 6, display: "block", fontFamily: "'IBM Plex Sans', sans-serif" }}>Unlock the full therapeutic experience</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
          {[
            { i: "🧠", t: "Unlimited Conversations", d: "No daily limits — talk whenever you need to" },
            { i: "🎯", t: "Advanced Techniques", d: "Schema Therapy, IFS Parts Work, Narrative Therapy" },
            { i: "📊", t: "Session Insights", d: "See which techniques were used and your emotional trajectory" },
            { i: "📈", t: "Mood Tracking", d: "Track patterns over days, weeks, and months" },
            { i: "📋", t: "Session History", d: "Review past conversations and insights anytime" },
            { i: "🧘", t: "Guided Meditations", d: "AI-personalized breathing and mindfulness exercises" },
            { i: "📄", t: "Export Session Notes", d: "Share summaries with your therapist or doctor" },
            { i: "🔒", t: "Complete Privacy", d: "Everything stays on your device — always" },
          ].map(f => (
            <div key={f.t} style={{ display: "flex", gap: 10, padding: "10px 14px", background: "rgba(91,191,176,0.04)", borderRadius: 12, alignItems: "flex-start", border: "1px solid rgba(91,191,176,0.06)" }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{f.i}</span>
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#D8E8F0", display: "block", fontFamily: "'IBM Plex Sans', sans-serif" }}>{f.t}</span>
                <span style={{ fontSize: 11, color: "#7DB0C8", fontFamily: "'IBM Plex Sans', sans-serif" }}>{f.d}</span>
              </div>
            </div>
          ))}
        </div>
        <button onClick={onSubscribe} className="btn-glow" style={{ width: "100%", padding: "16px", fontSize: 15, fontFamily: "'Sora', sans-serif", background: "linear-gradient(90deg, #5BBFB0, #4AAAC8, #5BBFB0)", backgroundSize: "200% 100%", animation: "shimmer 3s ease infinite", color: "#14263A", border: "none", borderRadius: 50, cursor: "pointer", fontWeight: 700, letterSpacing: 0.5, transition: "all 0.2s" }}>
          Start 7-Day Free Trial
        </button>
        <p style={{ textAlign: "center", fontSize: 12, color: "#7DB0C8", marginTop: 10, lineHeight: 1.6, fontFamily: "'IBM Plex Sans', sans-serif" }}>Then $9.99/mo — less than a single therapy copay.<br />Less than one coffee a week. Cancel anytime.</p>
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

  const sr = useSpeechRecognition();
  const tts = useTTS();
  const msgsRef = useRef([]);
  useEffect(() => { msgsRef.current = messages; }, [messages]);

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
      if (saved) {
        setTier(saved);
      } else if (typeof window !== "undefined") {
        // Also check aiforj_premium key (set by /success page after Stripe checkout)
        const rawPremium = localStorage.getItem("aiforj_premium");
        if (rawPremium === "true") {
          setTier("premium");
          await DB.set("tier", "premium");
        }
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

  const canSend = () => {
    if (tier === "premium" || tier === "trial") return true;
    if (sessionCount >= tierConfig.sessionsPerDay) return false;
    if (msgCount >= tierConfig.maxMessagesPerSession) return false;
    return true;
  };

  // ─── WebLLM Engine (free, private, no API keys) ───
  const webllmRef = useRef(null);
  const [webllmStatus, setWebllmStatus] = useState("idle"); // idle, loading, ready, unsupported
  const [webllmProgress, setWebllmProgress] = useState(0);

  const initWebLLM = useCallback(async () => {
    if (webllmRef.current || webllmStatus === "loading") return;
    if (!navigator.gpu) { setWebllmStatus("unsupported"); return; }
    setWebllmStatus("loading");
    try {
      const webllm = await import("@mlc-ai/web-llm");
      const engine = new webllm.MLCEngine();
      engine.setInitProgressCallback((p) => setWebllmProgress(Math.round((p.progress || 0) * 100)));
      await engine.reload("Phi-3.5-mini-instruct-q4f16_1-MLC");
      webllmRef.current = engine;
      setWebllmStatus("ready");
    } catch (e) {
      console.warn("WebLLM unavailable, using clinical engine:", e);
      setWebllmStatus("unsupported");
    }
  }, [webllmStatus]);

  // Auto-load WebLLM for premium users
  useEffect(() => {
    if ((tier === "premium" || tier === "trial") && webllmStatus === "idle") initWebLLM();
  }, [tier, webllmStatus, initWebLLM]);

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

    const isAnxious = detect(["anxious", "anxiety", "worried", "worrying", "panic", "panicking", "nervous", "scared", "fear", "dread", "what if", "can't stop thinking", "racing thoughts", "overthinking", "overthink", "spiraling", "worst case"]);
    const isSad = detect(["sad", "depressed", "depression", "crying", "hopeless", "empty", "grief", "grieving", "lost someone", "miss them", "heartbroken", "devastated", "pointless", "nothing matters"]);
    const isAngry = detect(["angry", "furious", "rage", "pissed", "frustrated", "irritated", "mad at", "hate", "unfair", "resentment", "resentful", "livid"]);
    const isLonely = detect(["lonely", "alone", "isolated", "no friends", "no one cares", "nobody", "disconnected", "don't belong", "left out", "abandoned"]);
    const isNumb = detect(["numb", "nothing", "don't feel", "can't feel", "empty", "flat", "disconnected", "shutdown", "shut down", "dissociat", "checked out", "zombie"]);
    const isOverwhelmed = detect(["overwhelmed", "too much", "can't handle", "drowning", "breaking", "falling apart", "can't cope", "everything at once", "so much to do", "can't keep up"]);
    const isUnmotivated = detect(["unmotivated", "can't start", "no motivation", "no energy", "lazy", "procrastinat", "avoidin", "stuck", "can't do anything", "what's the point", "exhausted", "tired of trying", "burnt out", "burnout"]);
    const isStressed = detect(["stressed", "stress", "pressure", "deadline", "tense", "tension", "tight", "clenching", "can't relax", "on edge"]);
    const isTrauma = detect(["trauma", "ptsd", "flashback", "nightmare", "triggered", "abuse", "abused", "assault", "attacked", "accident", "haunted by"]);
    const isRelationship = detect(["partner", "boyfriend", "girlfriend", "husband", "wife", "spouse", "relationship", "breakup", "broke up", "divorce", "cheated", "argument with", "fight with", "my ex"]);
    const isSelfWorth = detect(["not good enough", "worthless", "failure", "loser", "hate myself", "ugly", "stupid", "imposter", "fraud", "don't deserve", "broken"]);
    const isFine = detect(["i'm good", "i'm fine", "i'm okay", "doing well", "pretty good", "not bad", "great actually"]);
    const isGratitude = detect(["grateful", "thankful", "appreciate", "blessed", "fortunate"]);

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
        return "That sounds like your nervous system is in overdrive — your amygdala has hit the alarm. Let's bring it down right now. Can you try this with me? Breathe in for 4 counts, hold for 4, exhale slowly for 6. The extended exhale activates your vagus nerve and tells your body you're safe. Do that three times, then tell me how you feel.";
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

    // ASKING FOR ADVICE → Solution-Focused
    if (isAskingAdvice) {
      return userQuote
        ? `Here's what I notice: you already have more clarity than you think. You said "${userQuote}" — there's wisdom in that. If you woke up tomorrow and this problem was somehow resolved, what's the first thing you'd notice that was different about your day?`
        : "Before I offer anything, I want to hear your instinct. If you trusted yourself completely right now — what would you do? Sometimes the answer is already there; it just needs permission.";
    }

    // VENTING (long message, not asking for help) → Reflective Listening
    if (isVenting) {
      return userQuote
        ? `I hear you. "${userQuote}" — that's a lot to carry. Thank you for trusting me with it. You don't have to solve anything right now. What's the heaviest part of all of this for you?`
        : "That's a lot. I'm not going to rush to fix anything — sometimes you just need to be heard. What feels most important about what you just shared?";
    }

    // GENERIC / UNDETECTED → Warm engagement + Socratic questioning
    const genericOpts = [
      "Tell me more about that. What's the feeling underneath the words?",
      userQuote ? `"${userQuote}" — I want to understand that more deeply. What does that mean to you, specifically?` : "I'm here. Can you help me understand what's going on a little more? There's no wrong way to say it.",
      "What you just shared matters. What comes up for you when you sit with that?",
      "I'm listening. What do you need most right now — to be heard, to get a different perspective, or to figure out a next step?",
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

    // Try WebLLM first (premium, free, no API key)
    if (webllmRef.current && webllmStatus === "ready") {
      try {
        const history = updated.slice(-10).map(m => ({ role: m.role, content: m.text }));
        const reply = await webllmRef.current.chat.completions.create({
          messages: [{ role: "system", content: CLINICAL_SYSTEM_PROMPT }, ...history],
          max_tokens: 300,
          temperature: 0.7,
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
    setState("speaking");
    tts.speak(text, () => {
      setState("idle");
      // Show share prompt after 3+ exchanges (use refs to avoid stale closure)
      if (msgsRef.current.length >= 6 && !showShareRef.current) setShowShare(true);
    });
  }, [tts, tier, sessionCount, msgCount, webllmStatus]);

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
    // In production: redirect to Stripe checkout
    // For now: activate trial
    try {
      const res = await fetch('/api/create-checkout-session', { method: 'POST' });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; return; }
    } catch {}
    // Fallback for demo
    setTier("trial");
    await DB.set("tier", "trial");
    setShowUpgrade(false);
  };

  const remainingMsgs = tier === "free" ? Math.max(0, TIERS.free.maxMessagesPerSession - msgCount) : null;
  const remainingSessions = tier === "free" ? Math.max(0, TIERS.free.sessionsPerDay - sessionCount) : null;

  return (
    <div style={{ minHeight: "100vh", background: "#14263A", fontFamily: "'IBM Plex Sans', sans-serif", color: "#D8E8F0", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');
        :root {
          --bg: #14263A;
          --accent: #5BBFB0;
          --accent2: #4AAAC8;
          --text: #D8E8F0;
          --text2: #6090A8;
          --card-bg: rgba(91,191,176,0.04);
          --card-border: rgba(91,191,176,0.08);
          --card-border-hover: rgba(91,191,176,0.18);
        }
        @keyframes orbPulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.08); opacity: 0.7; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes softPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes dotFloat { 0%, 100% { opacity: 0.02; } 50% { opacity: 0.04; } }
        ::selection { background: rgba(91,191,176,0.25); }
        * { box-sizing: border-box; }
        input:focus { outline: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(91,191,176,0.15); border-radius: 4px; }
        .card-hover { transition: all 0.25s ease; }
        .card-hover:hover { background: rgba(91,191,176,0.07) !important; border-color: rgba(91,191,176,0.18) !important; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(91,191,176,0.06) !important; }
        .btn-glow:hover { box-shadow: 0 0 18px rgba(91,191,176,0.25); }
        .tag-item { transition: all 0.2s; }
        .tag-item:hover { background: rgba(91,191,176,0.12) !important; border-color: rgba(91,191,176,0.3) !important; color: #5BBFB0 !important; }
        .quicktool-hover { transition: all 0.2s; }
        .quicktool-hover:hover { background: rgba(91,191,176,0.08) !important; border-color: rgba(91,191,176,0.2) !important; transform: translateY(-1px); }
      `}</style>

      {/* Background dot grid texture */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(rgba(91,191,176,0.18) 1px, transparent 1px)", backgroundSize: "32px 32px", opacity: 0.025, animation: "dotFloat 8s ease-in-out infinite" }} />
      {/* Radial glow */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse at 50% 35%, rgba(91,191,176,0.06) 0%, transparent 65%)" }} />

      {showBreathing && <BreathingOverlay pattern={showBreathing} onClose={() => setShowBreathing(null)} />}
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} onSubscribe={handleSubscribe} />}
      {showInsights && messages.length > 2 && <SessionInsights messages={messages} onClose={() => setShowInsights(false)} />}

      {/* WebLLM loading indicator */}
      {(tier === "premium" || tier === "trial") && webllmStatus === "loading" && (
        <div style={{ position: "fixed", bottom: 20, right: 20, background: "rgba(20,38,58,0.95)", backdropFilter: "blur(12px)", borderRadius: 16, padding: "10px 18px", zIndex: 50, border: "1px solid rgba(91,191,176,0.12)", display: "flex", alignItems: "center", gap: 10, animation: "fadeIn 0.3s" }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#5BBFB0", animation: "orbPulse 1s infinite" }} />
          <div>
            <span style={{ fontSize: 11, color: "#D8E8F0", fontWeight: 500, display: "block", fontFamily: "'IBM Plex Sans', sans-serif" }}>Loading AI Engine</span>
            <span style={{ fontSize: 10, color: "#7DB0C8", fontFamily: "'IBM Plex Sans', sans-serif" }}>{webllmProgress}% — runs privately on your device</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src="/aif.jpeg" alt="AIForj" style={{ height: 36, width: "auto", borderRadius: 8, boxShadow: "0 2px 12px rgba(91,191,176,0.12)" }} />
          <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 600, color: "#D8E8F0" }}>AI</span>
          <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 600, color: "#5BBFB0", marginLeft: -4 }}>Forj</span>
          {tier !== "free" && <span style={{ fontSize: 8, marginLeft: 6, padding: "2px 7px", background: "linear-gradient(90deg, #5BBFB0, #4AAAC8)", color: "#14263A", borderRadius: 8, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'Sora', sans-serif" }}>PRO</span>}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => setShowBreathing("4-4-6")} className="btn-glow" style={{ background: "rgba(91,191,176,0.06)", border: "1px solid rgba(91,191,176,0.12)", padding: "5px 12px", borderRadius: 16, fontSize: 10, color: "#7DB0C8", cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif", letterSpacing: 1, transition: "all 0.2s" }}>
            Breathe
          </button>
          {tierConfig.features.sessionInsights && messages.length > 4 && (
            <button onClick={() => setShowInsights(true)} className="btn-glow" style={{ background: "rgba(91,191,176,0.06)", border: "1px solid rgba(91,191,176,0.12)", padding: "5px 12px", borderRadius: 16, fontSize: 10, color: "#7DB0C8", cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif", letterSpacing: 1, transition: "all 0.2s" }}>
              Insights
            </button>
          )}
          {messages.length > 2 && (
            <button onClick={() => setShowHistory(!showHistory)} className="btn-glow" style={{ background: "rgba(91,191,176,0.06)", border: "1px solid rgba(91,191,176,0.12)", padding: "5px 12px", borderRadius: 16, fontSize: 10, color: "#7DB0C8", cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif", letterSpacing: 1, transition: "all 0.2s" }}>
              {showHistory ? "Hide" : "Chat"}
            </button>
          )}
          {streak > 1 && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", background: "rgba(91,191,176,0.06)", borderRadius: 12, border: "1px solid rgba(91,191,176,0.1)" }}>
              <span style={{ fontSize: 10 }}>🔥</span>
              <span style={{ fontSize: 9, color: "#7DB0C8", fontWeight: 600, letterSpacing: 1, fontFamily: "'IBM Plex Sans', sans-serif" }}>{streak}d</span>
            </div>
          )}
          {tier === "free" && (
            <button onClick={() => setShowUpgrade(true)} className="btn-glow" style={{ background: "linear-gradient(90deg, #5BBFB0, #4AAAC8, #5BBFB0)", backgroundSize: "200% 100%", animation: "shimmer 3s ease infinite", border: "none", padding: "5px 14px", borderRadius: 16, fontSize: 10, color: "#14263A", cursor: "pointer", fontFamily: "'Sora', sans-serif", letterSpacing: 1, fontWeight: 700, transition: "all 0.2s" }}>
              ✦ Premium
            </button>
          )}
        </div>
      </header>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", maxWidth: 560, width: "100%", margin: "0 auto", marginTop: -20 }}>

        {/* Daily therapeutic insight */}
        {dailyInsight && messages.length <= 1 && (
          <div style={{ marginBottom: 28, padding: "18px 24px", background: "rgba(91,191,176,0.04)", borderRadius: 16, border: "1px solid rgba(91,191,176,0.08)", maxWidth: 420, textAlign: "center", animation: "fadeIn 1.2s ease", position: "relative", backdropFilter: "blur(8px)" }}>
            <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, color: "#D8E8F0", lineHeight: 1.6, fontStyle: "italic", display: "block", fontWeight: 300 }}>
              "{dailyInsight.quote}"
            </span>
            <span style={{ fontSize: 10, color: "#7DB0C8", marginTop: 8, display: "block", letterSpacing: 1 }}>— {dailyInsight.source}</span>
            <button onClick={() => {
              if (navigator.share) navigator.share({ title: dailyInsight.quote, text: `"${dailyInsight.quote}" — ${dailyInsight.source}\n\naiforj.com — free AI wellness companion`, url: "https://aiforj.com" }).catch(() => {});
              else { navigator.clipboard.writeText(`"${dailyInsight.quote}" — ${dailyInsight.source}\n\naiforj.com`).catch(() => {}); }
            }} style={{ position: "absolute", top: 10, right: 12, background: "none", border: "none", fontSize: 12, color: "#7DB0C8", cursor: "pointer", padding: 4 }}>↗</button>
          </div>
        )}

        {/* Value proposition */}
        {messages.length <= 1 && (
          <p style={{ textAlign: "center", fontFamily: "'Sora', sans-serif", fontSize: 17, color: "#7DB0C8", marginBottom: 20, animation: "fadeIn 1s ease", lineHeight: 1.6, fontWeight: 400 }}>
            Talk or type how you're feeling. Get grounded in minutes. 100% private.
          </p>
        )}

        {/* Privacy badge — prominent */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28, animation: "fadeIn 1s ease", flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 16px", background: "rgba(91,191,176,0.06)", borderRadius: 20, border: "1px solid rgba(91,191,176,0.12)" }}>
            <span style={{ fontSize: 13 }}>🔒</span>
            <span style={{ fontSize: 11, color: "#7DB0C8", letterSpacing: 0.5, fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 500 }}>100% Private — nothing leaves your browser</span>
          </div>
        </div>

        <Orb state={state} onClick={handleOrb} />

        {/* Live transcript */}
        {state === "listening" && liveText && (
          <div style={{ marginTop: 20, padding: "10px 20px", background: "rgba(45,212,191,0.06)", borderRadius: 14, maxWidth: 400, textAlign: "center", animation: "fadeIn 0.3s", border: "1px solid rgba(45,212,191,0.1)" }}>
            <span style={{ fontSize: 13, color: "#4AAAC8", fontStyle: "italic", fontFamily: "'IBM Plex Sans', sans-serif" }}>"{liveText}"</span>
          </div>
        )}

        {/* AI response */}
        {aiText && state !== "listening" && (
          <div style={{ marginTop: 24, padding: "14px 20px", maxWidth: 440, textAlign: "center", animation: "fadeIn 0.5s" }}>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: "#D8E8F0", margin: 0, fontWeight: 300, fontFamily: "'IBM Plex Sans', sans-serif", opacity: 0.9 }}>{aiText}</p>
          </div>
        )}

        {error && <div style={{ marginTop: 14, fontSize: 12, color: "#FF6B6B", animation: "fadeIn 0.3s", fontFamily: "'IBM Plex Sans', sans-serif" }}>{error}</div>}

        {/* Free tier limits indicator */}
        {tier === "free" && (
          <div style={{ marginTop: 16, fontSize: 11, textAlign: "center", fontFamily: "'IBM Plex Sans', sans-serif" }}>
            {remainingMsgs !== null && (
              <span style={{ color: remainingMsgs <= 2 ? "#FF6B6B" : "#6090A8", animation: remainingMsgs <= 2 ? "softPulse 1.5s infinite" : "none", fontWeight: remainingMsgs <= 2 ? 600 : 400 }}>
                {remainingMsgs} message{remainingMsgs !== 1 ? "s" : ""} left{remainingMsgs <= 1 ? " — your breakthrough might be one message away" : ""} ·{" "}
              </span>
            )}
            {remainingSessions !== null && <span style={{ color: "#7DB0C8" }}>{remainingSessions} session{remainingSessions !== 1 ? "s" : ""} left today</span>}
          </div>
        )}

        {/* Share prompt + workbook recommendation after meaningful conversation */}
        {showShare && messages.length >= 4 && (
          <div style={{ marginTop: 14, animation: "slideUp 0.5s ease", textAlign: "center", display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
            <button onClick={() => {
              const shareText = `I just had a real conversation about my mental health — completely free and private.\n\n"${aiText.slice(0, 120)}..."\n\n— aiforj.com`;
              if (navigator.share) navigator.share({ title: "This helped me", text: shareText, url: "https://aiforj.com" }).catch(() => {});
              else { navigator.clipboard.writeText(shareText).catch(() => {}); }
              setShowShare(false);
            }} style={{ background: "rgba(91,191,176,0.05)", border: "1px solid rgba(91,191,176,0.1)", padding: "8px 18px", borderRadius: 20, fontSize: 11, color: "#7DB0C8", cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif" }}>
              ↗ Know someone who needs this? Share
            </button>
            <a href="https://aiforj.gumroad.com/l/jmdqvd" target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#5BBFB0", textDecoration: "none", opacity: 0.85, fontFamily: "'IBM Plex Sans', sans-serif" }}>
              📘 Want to practice these techniques daily? The CBT Workbook has 30 days of guided exercises →
            </a>
          </div>
        )}

        {/* Text input */}
        <div style={{ marginTop: 24, width: "100%", maxWidth: 420, animation: "fadeIn 1s ease 0.5s both" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input type="text" value={textInput} onChange={e => setTextInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleTextSend(); }}
              placeholder="What's weighing on you right now?"
              disabled={state !== "idle"}
              style={{ flex: 1, padding: "13px 18px", fontSize: 14, fontFamily: "'IBM Plex Sans', sans-serif", background: "rgba(91,191,176,0.03)", border: "1px solid rgba(91,191,176,0.1)", borderRadius: 50, color: "#D8E8F0" }} />
            <button onClick={handleTextSend} disabled={!textInput.trim() || state !== "idle"}
              style={{ padding: "13px 20px", background: textInput.trim() && state === "idle" ? "rgba(91,191,176,0.15)" : "rgba(91,191,176,0.04)", border: "1px solid rgba(91,191,176,0.12)", borderRadius: 50, color: textInput.trim() && state === "idle" ? "#5BBFB0" : "#6090A8", cursor: textInput.trim() && state === "idle" ? "pointer" : "not-allowed", fontSize: 13, fontFamily: "'IBM Plex Sans', sans-serif", transition: "all 0.2s" }}>
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Chat history panel */}
      {showHistory && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxHeight: "45vh", overflowY: "auto", background: "rgba(20,38,58,0.97)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(91,191,176,0.08)", padding: "16px 20px", animation: "fadeIn 0.3s", zIndex: 50 }}>
          <div style={{ maxWidth: 480, margin: "0 auto" }}>
            <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: "#7DB0C8", fontWeight: 600, display: "block", marginBottom: 12, fontFamily: "'Sora', sans-serif" }}>Session</span>
            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: 8, padding: "8px 14px", background: m.role === "user" ? "rgba(45,212,191,0.04)" : "rgba(91,191,176,0.04)", borderRadius: 10, borderLeft: `2px solid ${m.role === "user" ? "rgba(45,212,191,0.2)" : "rgba(91,191,176,0.15)"}` }}>
                <span style={{ fontSize: 9, color: "#7DB0C8", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 3, fontFamily: "'Sora', sans-serif" }}>{m.role === "user" ? "You" : "Forj"}</span>
                <span style={{ fontSize: 13, color: "#D8E8F0", lineHeight: 1.6, fontFamily: "'IBM Plex Sans', sans-serif", opacity: 0.8 }}>{m.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scroll indicator */}
      <div style={{ textAlign: "center", padding: "24px 0 12px", animation: "float 3s ease-in-out infinite" }}>
        <span style={{ fontSize: 11, color: "#7DB0C8", letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 6, fontFamily: "'Sora', sans-serif", opacity: 0.5 }}>Explore guided tools</span>
        <span style={{ fontSize: 18, color: "#5BBFB0", opacity: 0.4 }}>↓</span>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  GUIDED TOOLS SECTION — Structured emotion sessions       */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div id="guided-tools" style={{ background: "#14263A", borderTop: "1px solid rgba(91,191,176,0.06)", padding: "80px 24px 60px", position: "relative" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>

          {/* Section header */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", background: "rgba(91,191,176,0.06)", borderRadius: 30, marginBottom: 18, border: "1px solid rgba(91,191,176,0.1)" }}>
              <span style={{ fontSize: 12 }}>🩺</span>
              <span style={{ fontSize: 12, color: "#5BBFB0", fontWeight: 500, fontFamily: "'IBM Plex Sans', sans-serif" }}>The first AI wellness companion built by a Board Certified PMHNP</span>
            </div>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 600, color: "#D8E8F0", margin: "0 0 14px", lineHeight: 1.2 }}>
              How do you feel<br />right now?
            </h2>
            <p style={{ fontSize: 15, color: "#7DB0C8", fontWeight: 300, margin: "0 0 20px", lineHeight: 1.7, fontFamily: "'IBM Plex Sans', sans-serif" }}>
              Evidence-based guided sessions. 3–5 minutes.<br />No login. No data stored. Completely private.
            </p>

            {/* Send to a friend CTA */}
            <div style={{ marginTop: 20 }}>
              <button onClick={() => {
                const text = "Someone I care about might need this — free, private AI wellness companion.\n\naiforj.com";
                if (navigator.share) navigator.share({ title: "AIForj — Free AI Wellness Companion", text, url: "https://aiforj.com" }).catch(() => {});
                else { navigator.clipboard.writeText(text).catch(() => {}); }
              }} className="btn-glow" style={{ background: "none", border: "1px solid rgba(91,191,176,0.15)", padding: "8px 20px", borderRadius: 20, fontSize: 12, color: "#7DB0C8", cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif", transition: "all 0.2s" }}>
                ↗ Know someone who's struggling? Send them this page
              </button>
            </div>
          </div>

          {/* Emotion grid — 6 default, expandable */}
          {(() => {
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
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: 10, marginBottom: showAllPathways ? 10 : 16 }}>
                  {visiblePathways.map((e) => (
                    <a key={e.id} href={`/tools?start=${e.id}`} className="card-hover" style={{
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                      padding: "20px 12px", background: "rgba(91,191,176,0.04)", border: "1px solid rgba(91,191,176,0.08)",
                      borderRadius: 16, cursor: "pointer",
                      backdropFilter: "blur(12px)", textDecoration: "none",
                    }}>
                      <span style={{ fontSize: 26 }}>{e.icon}</span>
                      <span style={{ fontSize: 14, fontWeight: 500, color: "#D8E8F0", fontFamily: "'IBM Plex Sans', sans-serif" }}>{e.label}</span>
                      <span style={{ fontSize: 11, color: "#7DB0C8", opacity: 0.7, fontFamily: "'IBM Plex Sans', sans-serif" }}>{e.desc}</span>
                    </a>
                  ))}
                </div>
                {!showAllPathways && (
                  <div style={{ textAlign: "center", marginBottom: 36 }}>
                    <button onClick={() => setShowAllPathways(true)} className="btn-glow" style={{ background: "none", border: "1px solid rgba(91,191,176,0.12)", padding: "8px 22px", borderRadius: 20, fontSize: 12, color: "#7DB0C8", cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif", transition: "all 0.2s" }}>
                      See all pathways →
                    </button>
                  </div>
                )}
                {showAllPathways && <div style={{ marginBottom: 36 }} />}
              </>
            );
          })()}

          {/* Quick Tools */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "#7DB0C8", fontWeight: 600, fontFamily: "'Sora', sans-serif" }}>Quick Tools</span>
              <span style={{ fontSize: 11, color: "#7DB0C8", opacity: 0.4, fontFamily: "'IBM Plex Sans', sans-serif" }}>— instant interventions, no session needed</span>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { id: "box",    icon: "▣",  label: "Box Breathing",       time: "2 min", free: true },
                { id: "sigh",   icon: "🌬️", label: "Physiological Sigh",  time: "1 min", free: true },
                { id: "ground", icon: "🌿", label: "5-4-3-2-1 Grounding", time: "3 min", free: true },
                { id: "defuse", icon: "🧠", label: "Thought Defusion",    time: "2 min", free: false },
                { id: "tipp",   icon: "❄️", label: "TIPP Crisis Skill",   time: "3 min", free: false },
              ].map((tool) => (
                <a key={tool.id} href={`/tools?tool=${tool.id}`} className="quicktool-hover" style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "10px 16px",
                  background: "rgba(91,191,176,0.04)", border: "1px solid rgba(91,191,176,0.08)",
                  borderRadius: 30, cursor: "pointer",
                  fontFamily: "'IBM Plex Sans', sans-serif", textDecoration: "none",
                }}>
                  <span style={{ fontSize: 16 }}>{tool.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#D8E8F0" }}>{tool.label}</span>
                  <span style={{ fontSize: 11, color: "#7DB0C8", opacity: 0.6 }}>{tool.time}</span>
                  {!tool.free && <span style={{ fontSize: 10, padding: "2px 6px", background: "linear-gradient(90deg, #5BBFB0, #4AAAC8)", color: "#14263A", borderRadius: 8, fontWeight: 700 }}>PRO</span>}
                </a>
              ))}
            </div>
          </div>

          {/* Technique Library CTA */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <a href="/techniques" style={{ display: "inline-block", padding: "14px 28px", background: "rgba(91,191,176,0.06)", border: "1px solid rgba(91,191,176,0.15)", borderRadius: 16, textDecoration: "none", transition: "all 0.2s", backdropFilter: "blur(12px)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(91,191,176,0.35)"; e.currentTarget.style.background = "rgba(91,191,176,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(91,191,176,0.15)"; e.currentTarget.style.background = "rgba(91,191,176,0.06)"; }}>
              <span style={{ fontSize: 15, color: "#D8E8F0", fontFamily: "'Sora', sans-serif", fontWeight: 500 }}>Browse 15 evidence-based techniques →</span>
            </a>
          </div>

          {/* Two Ways to Use AIForj */}
          <div style={{ marginBottom: 48 }}>
            <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 600, color: "#D8E8F0", textAlign: "center", marginBottom: 20 }}>Two Ways to Use AIForj</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
              <div style={{ padding: "24px 22px", background: "rgba(91,191,176,0.04)", border: "1px solid rgba(91,191,176,0.1)", borderRadius: 20, backdropFilter: "blur(12px)" }}>
                <span style={{ fontSize: 24, display: "block", marginBottom: 10 }}>🗣️</span>
                <h4 style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 600, color: "#D8E8F0", margin: "0 0 8px" }}>Talk or Type</h4>
                <p style={{ fontSize: 13, color: "#7DB0C8", lineHeight: 1.7, margin: 0, fontFamily: "'IBM Plex Sans', sans-serif" }}>Personalized support in the moment. The AI adapts to what you say using 16 therapeutic techniques.</p>
              </div>
              <div style={{ padding: "24px 22px", background: "rgba(91,191,176,0.04)", border: "1px solid rgba(91,191,176,0.1)", borderRadius: 20, backdropFilter: "blur(12px)" }}>
                <span style={{ fontSize: 24, display: "block", marginBottom: 10 }}>🧭</span>
                <h4 style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 600, color: "#D8E8F0", margin: "0 0 8px" }}>Guided Tools</h4>
                <p style={{ fontSize: 13, color: "#7DB0C8", lineHeight: 1.7, margin: 0, fontFamily: "'IBM Plex Sans', sans-serif" }}>A structured reset in 2–5 minutes. Choose what you're feeling and follow the guided protocol.</p>
              </div>
            </div>
          </div>

          {/* Premium CTA — reframed */}
          {tier === "free" && (
            <div style={{ background: "linear-gradient(135deg, rgba(91,191,176,0.06), rgba(45,212,191,0.03))", borderRadius: 24, padding: "36px 28px", textAlign: "center", marginBottom: 32, border: "1px solid rgba(91,191,176,0.1)", backdropFilter: "blur(12px)" }}>
              <span style={{ fontSize: 32, display: "block", marginBottom: 8 }}>✦</span>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 600, color: "#D8E8F0", margin: "0 0 10px", lineHeight: 1.3 }}>When the free reset helps — but you need more depth</h3>
              <p style={{ fontSize: 14, color: "#7DB0C8", margin: "0 0 14px", lineHeight: 1.7, fontFamily: "'IBM Plex Sans', sans-serif" }}>Track patterns over time. Access advanced techniques. Understand why the same feelings keep returning.</p>
              <p style={{ fontSize: 13, color: "#7DB0C8", margin: "0 0 6px", lineHeight: 1.7, fontFamily: "'IBM Plex Sans', sans-serif", opacity: 0.7 }}>AI insights, mood analytics, guided journal, advanced crisis tools, unlimited sessions</p>
              <p style={{ fontSize: 12, color: "#7DB0C8", opacity: 0.5, margin: "0 0 20px", fontFamily: "'IBM Plex Sans', sans-serif" }}>7-day free trial · $9.99/month · Cancel anytime</p>
              <button onClick={handleSubscribe} className="btn-glow" style={{
                padding: "14px 44px", fontSize: 15, fontFamily: "'Sora', sans-serif",
                background: "linear-gradient(135deg, #5BBFB0, #4AAAC8)", color: "#14263A",
                border: "none", borderRadius: 50, cursor: "pointer", letterSpacing: 0.5, fontWeight: 700, transition: "all 0.2s",
              }}>
                Start Free Trial
              </button>
            </div>
          )}

          {/* CBT Workbook — reframed with context */}
          <div style={{ marginBottom: 40, textAlign: "center" }}>
            <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "#7DB0C8", fontWeight: 600, fontFamily: "'Sora', sans-serif", display: "block", marginBottom: 6 }}>Practice between sessions</span>
            <p style={{ fontSize: 14, color: "#7DB0C8", margin: "0 0 16px", lineHeight: 1.6, fontFamily: "'IBM Plex Sans', sans-serif" }}>The thoughts that keep coming back? This workbook teaches you how to rewire them.</p>
            <a href="https://aiforj.gumroad.com/l/jmdqvd" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>
              <div className="card-hover" style={{ display: "flex", alignItems: "center", gap: 20, padding: "22px 24px", background: "rgba(91,191,176,0.05)", border: "1px solid rgba(91,191,176,0.15)", borderRadius: 20, backdropFilter: "blur(12px)", boxShadow: "0 4px 24px rgba(91,191,176,0.04)" }}>
                <span style={{ fontSize: 36, flexShrink: 0 }}>📘</span>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: "#D8E8F0", fontFamily: "'Sora', sans-serif" }}>CBT Thought Reframe Workbook</span>
                    <span style={{ fontSize: 11, padding: "2px 9px", background: "linear-gradient(90deg, rgba(91,191,176,0.2), rgba(45,212,191,0.2))", border: "1px solid rgba(91,191,176,0.3)", color: "#5BBFB0", borderRadius: 20, fontWeight: 600, fontFamily: "'Sora', sans-serif", letterSpacing: 0.5 }}>$27</span>
                  </div>
                  <span style={{ fontSize: 13, color: "#7DB0C8", fontFamily: "'IBM Plex Sans', sans-serif" }}>84 pages · 30 days of exercises · 10 cognitive distortions</span>
                </div>
                <span style={{ fontSize: 18, color: "#5BBFB0", opacity: 0.6, flexShrink: 0 }}>→</span>
              </div>
            </a>
          </div>

          {/* Therapy modalities — moved to bottom for SEO/trust, before footer */}
          <TherapyModalities />

        </div>
      </div>

      {/* Footer */}
      <footer style={{ padding: "48px 24px 32px", textAlign: "center", background: "#0D1E30", borderTop: "1px solid rgba(91,191,176,0.06)", zIndex: 5 }}>
        <img src="/aif.jpeg" alt="AIForj" style={{ height: 52, width: "auto", borderRadius: 12, marginBottom: 16, boxShadow: "0 4px 16px rgba(91,191,176,0.1)" }} />

        {/* Trust badges */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: 20 }}>
          {["PMHNP-BC Designed", "Evidence-Based", "Zero Data Collection", "100% On-Device AI", "HIPAA-Grade Privacy"].map(b => (
            <span key={b} style={{ padding: "4px 12px", background: "rgba(91,191,176,0.05)", border: "1px solid rgba(91,191,176,0.1)", borderRadius: 20, fontSize: 10, color: "#7DB0C8", letterSpacing: 0.5, fontWeight: 500, fontFamily: "'IBM Plex Sans', sans-serif" }}>{b}</span>
          ))}
        </div>

        <p style={{ fontSize: 14, color: "#D8E8F0", lineHeight: 1.6, margin: "0 0 4px", fontWeight: 500, fontFamily: "'IBM Plex Sans', sans-serif" }}>
          Built by a Board Certified Psychiatric Mental Health Nurse Practitioner
        </p>
        <p style={{ fontSize: 12, color: "#7DB0C8", margin: "0 0 24px", fontFamily: "'IBM Plex Sans', sans-serif" }}>Caring for the Whole Human</p>

        {/* Footer nav links */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 20, marginBottom: 24 }}>
          <a href="https://aiforj.com" style={{ fontSize: 12, color: "#7DB0C8", textDecoration: "none", fontFamily: "'IBM Plex Sans', sans-serif", transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "#5BBFB0"} onMouseLeave={e => e.currentTarget.style.color = "#6090A8"}>AIForj.com</a>
          <a href="/tools" style={{ fontSize: 12, color: "#7DB0C8", textDecoration: "none", fontFamily: "'IBM Plex Sans', sans-serif", transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "#5BBFB0"} onMouseLeave={e => e.currentTarget.style.color = "#6090A8"}>Guided Protocols</a>
          <a href="https://aiforj.gumroad.com/l/jmdqvd" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#7DB0C8", textDecoration: "none", fontFamily: "'IBM Plex Sans', sans-serif", transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "#5BBFB0"} onMouseLeave={e => e.currentTarget.style.color = "#6090A8"}>📘 CBT Workbook</a>
          <a href="https://medium.com/@kcooke493/im-a-psych-np-and-i-built-a-free-ai-wellness-tool-8d46e01a6852" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#7DB0C8", textDecoration: "none", fontFamily: "'IBM Plex Sans', sans-serif", transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "#5BBFB0"} onMouseLeave={e => e.currentTarget.style.color = "#6090A8"}>Read Our Story</a>
          <a href="/techniques" style={{ fontSize: 12, color: "#7DB0C8", textDecoration: "none", fontFamily: "'IBM Plex Sans', sans-serif", transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "#5BBFB0"} onMouseLeave={e => e.currentTarget.style.color = "#6090A8"}>Technique Library</a>
          <a href="https://x.com/AIForj" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#7DB0C8", textDecoration: "none", fontFamily: "'IBM Plex Sans', sans-serif", transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "#5BBFB0"} onMouseLeave={e => e.currentTarget.style.color = "#6090A8"}>𝕏 @AIForj</a>
        </div>

        {/* Landing page guides */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, marginBottom: 24 }}>
          <span style={{ fontSize: 11, color: "#7DB0C8", opacity: 0.5, fontFamily: "'IBM Plex Sans', sans-serif", width: "100%", textAlign: "center", marginBottom: 4 }}>Help with...</span>
          <a href="/3am-spiral" style={{ fontSize: 11, color: "#7DB0C8", textDecoration: "none", fontFamily: "'IBM Plex Sans', sans-serif", padding: "4px 14px", background: "rgba(91,191,176,0.04)", border: "1px solid rgba(91,191,176,0.08)", borderRadius: 16, transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#5BBFB0"; e.currentTarget.style.borderColor = "rgba(91,191,176,0.2)"; }} onMouseLeave={e => { e.currentTarget.style.color = "#6090A8"; e.currentTarget.style.borderColor = "rgba(91,191,176,0.08)"; }}>🌙 3AM Spiral</a>
          <a href="/overwhelmed" style={{ fontSize: 11, color: "#7DB0C8", textDecoration: "none", fontFamily: "'IBM Plex Sans', sans-serif", padding: "4px 14px", background: "rgba(91,191,176,0.04)", border: "1px solid rgba(91,191,176,0.08)", borderRadius: 16, transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#5BBFB0"; e.currentTarget.style.borderColor = "rgba(91,191,176,0.2)"; }} onMouseLeave={e => { e.currentTarget.style.color = "#6090A8"; e.currentTarget.style.borderColor = "rgba(91,191,176,0.08)"; }}>🌊 Overwhelmed</a>
          <a href="/burned-out" style={{ fontSize: 11, color: "#7DB0C8", textDecoration: "none", fontFamily: "'IBM Plex Sans', sans-serif", padding: "4px 14px", background: "rgba(91,191,176,0.04)", border: "1px solid rgba(91,191,176,0.08)", borderRadius: 16, transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#5BBFB0"; e.currentTarget.style.borderColor = "rgba(91,191,176,0.2)"; }} onMouseLeave={e => { e.currentTarget.style.color = "#6090A8"; e.currentTarget.style.borderColor = "rgba(91,191,176,0.08)"; }}>🪨 Burned Out</a>
          <a href="/find-help" style={{ fontSize: 11, color: "#7DB0C8", textDecoration: "none", fontFamily: "'IBM Plex Sans', sans-serif", padding: "4px 14px", background: "rgba(91,191,176,0.04)", border: "1px solid rgba(91,191,176,0.08)", borderRadius: 16, transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#5BBFB0"; e.currentTarget.style.borderColor = "rgba(91,191,176,0.2)"; }} onMouseLeave={e => { e.currentTarget.style.color = "#6090A8"; e.currentTarget.style.borderColor = "rgba(91,191,176,0.08)"; }}>🔍 Find a Provider</a>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 20 }}>
          <button onClick={() => {
            const text = "Free AI therapeutic companion — clinician-built, completely private, evidence-based. This helped me.\n\naiforj.com";
            if (navigator.share) navigator.share({ title: "AIForj", text, url: "https://aiforj.com" }).catch(() => {});
            else navigator.clipboard.writeText(text).catch(() => {});
          }} className="btn-glow" style={{ background: "none", border: "1px solid rgba(91,191,176,0.15)", padding: "8px 20px", borderRadius: 20, fontSize: 12, color: "#7DB0C8", cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif", transition: "all 0.2s" }}>
            ↗ Share AIForj
          </button>
        </div>

        <EmailCapture />

        <p style={{ fontSize: 11, color: "#7DB0C8", opacity: 0.5, lineHeight: 1.7, margin: "0 0 8px", fontFamily: "'IBM Plex Sans', sans-serif" }}>
          AIForj is a wellness companion — not a therapist or substitute for professional care.
        </p>
        <p style={{ fontSize: 11, color: "#7DB0C8", opacity: 0.5, lineHeight: 1.7, margin: "0 0 16px", fontFamily: "'IBM Plex Sans', sans-serif" }}>
          In crisis? Call or text <strong style={{ color: "#5BBFB0", opacity: 0.8 }}>988</strong> · Text HOME to <strong style={{ color: "#5BBFB0", opacity: 0.8 }}>741741</strong>
        </p>
        <p style={{ fontSize: 11, color: "#7DB0C8", opacity: 0.3, margin: 0, fontFamily: "'IBM Plex Sans', sans-serif" }}>
          © 2026 AIForj. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
