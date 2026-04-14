"use client";

import { useState, useEffect, useCallback } from 'react';

// ---------------------------------------------------------------------------
// Timing constants (milliseconds)
// ---------------------------------------------------------------------------
const STEP_1_FIRST_LINE_DELAY = 800;       // before first line fades in
const STEP_1_SECOND_LINE_DELAY = 4500;     // before second line fades in
const STEP_1_PAUSE = 10000;                // total dwell time on step 1
const STEP_2_PAUSE = 10000;                // total dwell time on step 2
const STEP_3_HAND_PAUSE = 4000;            // "place your hand" dwell
const STEP_3_INTRO_DELAY = 3000;           // before "now say to yourself..."
const STEP_3_PHRASE_GAP = 5000;            // gap between each self-kindness phrase
const COMPLETION_FADE_DELAY = 600;         // completion text fade-in delay

// ---------------------------------------------------------------------------
// The three self-kindness phrases
// ---------------------------------------------------------------------------
const KINDNESS_PHRASES = [
  "May I be kind to myself.",
  "May I give myself what I need.",
  "May I accept myself as I am in this moment.",
];

// ---------------------------------------------------------------------------
// CSS keyframe animations injected via <style> tag
// ---------------------------------------------------------------------------
const keyframeStyles = `
  @keyframes scbFadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes scbFadeInSlow {
    0%   { opacity: 0; transform: translateY(8px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  @keyframes scbFadeInGentle {
    0%   { opacity: 0; }
    100% { opacity: 1; }
  }

  @keyframes scbBreathePulse {
    0%   { transform: scale(1);    opacity: 0.18; }
    50%  { transform: scale(1.25); opacity: 0.30; }
    100% { transform: scale(1);    opacity: 0.18; }
  }

  @keyframes scbBreathePulseRing {
    0%   { transform: scale(1);    opacity: 0.10; }
    50%  { transform: scale(1.35); opacity: 0.18; }
    100% { transform: scale(1);    opacity: 0.10; }
  }

  @keyframes scbBreathePulseOuter {
    0%   { transform: scale(1);    opacity: 0.05; }
    50%  { transform: scale(1.45); opacity: 0.10; }
    100% { transform: scale(1);    opacity: 0.05; }
  }

  @keyframes scbTextReveal {
    0%   { opacity: 0; transform: translateY(6px); filter: blur(2px); }
    100% { opacity: 1; transform: translateY(0);   filter: blur(0); }
  }

  @keyframes scbPhraseReveal {
    0%   { opacity: 0; transform: translateY(10px); }
    60%  { opacity: 1; transform: translateY(-2px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  @keyframes scbProgressFill {
    from { width: 0%; }
    to   { width: 100%; }
  }

  @keyframes scbCompletionIn {
    0%   { opacity: 0; transform: scale(0.96) translateY(14px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }

  @keyframes scbHeartbeat {
    0%   { transform: scale(1); }
    14%  { transform: scale(1.08); }
    28%  { transform: scale(1); }
    42%  { transform: scale(1.05); }
    56%  { transform: scale(1); }
    100% { transform: scale(1); }
  }
`;

// ---------------------------------------------------------------------------
// LAVENDER PALETTE
// ---------------------------------------------------------------------------
const LAVENDER = '#9B8EC4';
const LAVENDER_LIGHT = 'rgba(155, 142, 196, 0.12)';
const LAVENDER_FAINT = 'rgba(155, 142, 196, 0.06)';
const LAVENDER_GLOW = 'rgba(155, 142, 196, 0.25)';
const LAVENDER_SHADOW = 'rgba(155, 142, 196, 0.30)';

// ---------------------------------------------------------------------------
// BREATHING CIRCLE  (shared across steps 1, 2, and 3)
// ---------------------------------------------------------------------------
function BreathingCircle() {
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      zIndex: 0,
    }}>
      {/* Outermost ring */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 260,
        height: 260,
        marginTop: -130,
        marginLeft: -130,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${LAVENDER_FAINT} 0%, transparent 70%)`,
        animation: 'scbBreathePulseOuter 7s ease-in-out infinite',
      }} />

      {/* Middle ring */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 180,
        height: 180,
        marginTop: -90,
        marginLeft: -90,
        borderRadius: '50%',
        border: `1.5px solid rgba(155, 142, 196, 0.10)`,
        animation: 'scbBreathePulseRing 7s ease-in-out infinite',
      }} />

      {/* Core circle */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 110,
        height: 110,
        marginTop: -55,
        marginLeft: -55,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(155, 142, 196, 0.22) 0%, rgba(155, 142, 196, 0.06) 60%, transparent 100%)`,
        animation: 'scbBreathePulse 7s ease-in-out infinite',
      }} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// PROGRESS INDICATOR  (soft dot-style: filled = completed, hollow = upcoming)
// ---------------------------------------------------------------------------
function StepIndicator({ currentStep, totalSteps }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
      marginBottom: 40,
    }}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} style={{
          width: i === currentStep ? 10 : 7,
          height: i === currentStep ? 10 : 7,
          borderRadius: '50%',
          background: i <= currentStep ? LAVENDER : 'transparent',
          border: `1.5px solid ${i <= currentStep ? LAVENDER : 'rgba(155, 142, 196, 0.25)'}`,
          transition: 'all 0.6s ease',
        }} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SKIP LINK (accessibility)
// ---------------------------------------------------------------------------
function SkipLink({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Skip to next step"
      style={{
        position: 'absolute',
        bottom: 28,
        right: 28,
        background: 'none',
        border: 'none',
        color: 'rgba(155, 142, 196, 0.40)',
        fontSize: 13,
        fontFamily: "var(--font-body), 'DM Sans', sans-serif",
        cursor: 'pointer',
        padding: '6px 12px',
        borderRadius: 8,
        transition: 'color 0.3s ease, background 0.3s ease',
        zIndex: 10,
        letterSpacing: '0.02em',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.color = LAVENDER;
        e.currentTarget.style.background = LAVENDER_FAINT;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = 'rgba(155, 142, 196, 0.40)';
        e.currentTarget.style.background = 'none';
      }}
    >
      skip
    </button>
  );
}

// ---------------------------------------------------------------------------
// TIMED PROGRESS BAR  (thin lavender bar that fills across the bottom)
// ---------------------------------------------------------------------------
function TimedProgressBar({ durationMs }) {
  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: 3,
      background: 'rgba(155, 142, 196, 0.08)',
      overflow: 'hidden',
      zIndex: 5,
    }}>
      <div style={{
        height: '100%',
        background: `linear-gradient(90deg, rgba(155, 142, 196, 0.15), ${LAVENDER_LIGHT})`,
        animation: `scbProgressFill ${durationMs}ms linear forwards`,
        borderRadius: 2,
      }} />
    </div>
  );
}


// ===========================================================================
//  MAIN COMPONENT
// ===========================================================================
export default function SelfCompassionBreak({ onComplete, emotion }) {
  // step: 0 = mindfulness, 1 = common humanity, 2 = self-kindness, 3 = completion
  const [step, setStep] = useState(0);

  // Step 1 text reveal states
  const [showFirstLine, setShowFirstLine] = useState(false);
  const [showSecondLine, setShowSecondLine] = useState(false);

  // Step 2 text reveal
  const [showHumanityText, setShowHumanityText] = useState(false);

  // Step 3 sub-states
  const [showHandPrompt, setShowHandPrompt] = useState(false);
  const [showSayIntro, setShowSayIntro] = useState(false);
  const [visiblePhrases, setVisiblePhrases] = useState(0);

  // Completion
  const [showCompletion, setShowCompletion] = useState(false);
  const [showCompletionBody, setShowCompletionBody] = useState(false);
  const [showContinueBtn, setShowContinueBtn] = useState(false);

  // -------------------------------------------------------------------------
  // Advance to next step (with cleanup handled by effect dependencies)
  // -------------------------------------------------------------------------
  const advanceStep = useCallback(() => {
    setStep(prev => prev + 1);
  }, []);

  // -------------------------------------------------------------------------
  // STEP 0 — MINDFULNESS
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (step !== 0) return;

    // Reset reveals
    setShowFirstLine(false);
    setShowSecondLine(false);

    const t1 = setTimeout(() => setShowFirstLine(true), STEP_1_FIRST_LINE_DELAY);
    const t2 = setTimeout(() => setShowSecondLine(true), STEP_1_SECOND_LINE_DELAY);
    const t3 = setTimeout(() => advanceStep(), STEP_1_PAUSE);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [step, advanceStep]);

  // -------------------------------------------------------------------------
  // STEP 1 — COMMON HUMANITY
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (step !== 1) return;

    setShowHumanityText(false);

    const t1 = setTimeout(() => setShowHumanityText(true), 800);
    const t2 = setTimeout(() => advanceStep(), STEP_2_PAUSE);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [step, advanceStep]);

  // -------------------------------------------------------------------------
  // STEP 2 — SELF-KINDNESS
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (step !== 2) return;

    setShowHandPrompt(false);
    setShowSayIntro(false);
    setVisiblePhrases(0);

    const timers = [];

    // Show "Place your hand on your heart..."
    timers.push(setTimeout(() => setShowHandPrompt(true), 800));

    // Show "Now say to yourself..."
    const sayIntroTime = 800 + STEP_3_HAND_PAUSE;
    timers.push(setTimeout(() => setShowSayIntro(true), sayIntroTime));

    // Reveal each phrase one by one
    const firstPhraseTime = sayIntroTime + STEP_3_INTRO_DELAY;
    KINDNESS_PHRASES.forEach((_, i) => {
      timers.push(setTimeout(() => {
        setVisiblePhrases(i + 1);
      }, firstPhraseTime + i * STEP_3_PHRASE_GAP));
    });

    // Auto-advance after last phrase has had time to settle
    const totalTime = firstPhraseTime + KINDNESS_PHRASES.length * STEP_3_PHRASE_GAP + 3000;
    timers.push(setTimeout(() => advanceStep(), totalTime));

    return () => timers.forEach(clearTimeout);
  }, [step, advanceStep]);

  // -------------------------------------------------------------------------
  // STEP 3 — COMPLETION
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (step !== 3) return;

    setShowCompletion(false);
    setShowCompletionBody(false);
    setShowContinueBtn(false);

    const t1 = setTimeout(() => setShowCompletion(true), COMPLETION_FADE_DELAY);
    const t2 = setTimeout(() => setShowCompletionBody(true), COMPLETION_FADE_DELAY + 1200);
    const t3 = setTimeout(() => setShowContinueBtn(true), COMPLETION_FADE_DELAY + 2800);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [step]);

  // =========================================================================
  //  STEP 0 — MINDFULNESS
  // =========================================================================
  if (step === 0) {
    return (
      <div style={styles.container}>
        <style>{keyframeStyles}</style>

        {/* Breathing circle backdrop */}
        <BreathingCircle />

        {/* Step dots */}
        <StepIndicator currentStep={0} totalSteps={3} />

        {/* Label */}
        <div style={styles.stepLabel}>Mindfulness</div>

        {/* Content area */}
        <div style={styles.contentArea}>
          {/* First line */}
          <p style={{
            ...styles.meditationText,
            opacity: showFirstLine ? 1 : 0,
            transform: showFirstLine ? 'translateY(0)' : 'translateY(8px)',
            filter: showFirstLine ? 'blur(0)' : 'blur(2px)',
            transition: 'opacity 2.5s ease, transform 2.5s ease, filter 2s ease',
            marginBottom: 32,
          }}>
            This is a moment of suffering.
          </p>

          {/* Second line */}
          <p style={{
            ...styles.meditationText,
            fontSize: 'clamp(1rem, 3vw, 1.25rem)',
            fontWeight: 400,
            opacity: showSecondLine ? 1 : 0,
            transform: showSecondLine ? 'translateY(0)' : 'translateY(8px)',
            filter: showSecondLine ? 'blur(0)' : 'blur(2px)',
            transition: 'opacity 2.8s ease, transform 2.8s ease, filter 2.2s ease',
            color: 'var(--text-secondary)',
          }}>
            You don't have to fix it, solve it, or push through it.
            <br />
            <span style={{ display: 'inline-block', marginTop: 8 }}>
              Just notice: this hurts.
            </span>
          </p>
        </div>

        {/* Progress bar */}
        <TimedProgressBar durationMs={STEP_1_PAUSE} />

        {/* Skip */}
        <SkipLink onClick={advanceStep} />
      </div>
    );
  }

  // =========================================================================
  //  STEP 1 — COMMON HUMANITY
  // =========================================================================
  if (step === 1) {
    return (
      <div style={styles.container}>
        <style>{keyframeStyles}</style>

        <BreathingCircle />

        <StepIndicator currentStep={1} totalSteps={3} />

        <div style={styles.stepLabel}>Common Humanity</div>

        <div style={styles.contentArea}>
          <p style={{
            ...styles.meditationText,
            opacity: showHumanityText ? 1 : 0,
            transform: showHumanityText ? 'translateY(0)' : 'translateY(8px)',
            filter: showHumanityText ? 'blur(0)' : 'blur(2px)',
            transition: 'opacity 2.8s ease, transform 2.8s ease, filter 2.2s ease',
          }}>
            Suffering is part of being human.
          </p>

          <p style={{
            ...styles.meditationText,
            fontSize: 'clamp(1rem, 3vw, 1.25rem)',
            fontWeight: 400,
            color: 'var(--text-secondary)',
            marginTop: 28,
            opacity: showHumanityText ? 1 : 0,
            transform: showHumanityText ? 'translateY(0)' : 'translateY(8px)',
            filter: showHumanityText ? 'blur(0)' : 'blur(2px)',
            transition: 'opacity 3s ease 0.8s, transform 3s ease 0.8s, filter 2.5s ease 0.8s',
          }}>
            Right now, thousands of other people are feeling something very similar to what you feel.
          </p>
        </div>

        <TimedProgressBar durationMs={STEP_2_PAUSE} />

        <SkipLink onClick={advanceStep} />
      </div>
    );
  }

  // =========================================================================
  //  STEP 2 — SELF-KINDNESS
  // =========================================================================
  if (step === 2) {
    // Total duration for the progress bar
    const step3Total = 800 + STEP_3_HAND_PAUSE + STEP_3_INTRO_DELAY
      + KINDNESS_PHRASES.length * STEP_3_PHRASE_GAP + 3000;

    return (
      <div style={styles.container}>
        <style>{keyframeStyles}</style>

        <BreathingCircle />

        <StepIndicator currentStep={2} totalSteps={3} />

        <div style={styles.stepLabel}>Self-Kindness</div>

        <div style={styles.contentArea}>
          {/* "Place your hand on your heart..." */}
          <p style={{
            ...styles.meditationText,
            fontSize: 'clamp(1rem, 3vw, 1.25rem)',
            fontWeight: 400,
            color: 'var(--text-secondary)',
            opacity: showHandPrompt ? 1 : 0,
            transform: showHandPrompt ? 'translateY(0)' : 'translateY(8px)',
            filter: showHandPrompt ? 'blur(0)' : 'blur(2px)',
            transition: 'opacity 2.5s ease, transform 2.5s ease, filter 2s ease',
            marginBottom: 0,
          }}>
            Place your hand on your heart if it feels okay.
          </p>

          {/* "Now say to yourself..." */}
          <p style={{
            ...styles.meditationText,
            fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)',
            fontWeight: 400,
            color: 'var(--text-muted)',
            marginTop: 28,
            marginBottom: 36,
            opacity: showSayIntro ? 1 : 0,
            transform: showSayIntro ? 'translateY(0)' : 'translateY(6px)',
            transition: 'opacity 2s ease, transform 2s ease',
          }}>
            Now say to yourself, silently or out loud:
          </p>

          {/* Three self-kindness phrases */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
          }}>
            {KINDNESS_PHRASES.map((phrase, i) => (
              <p key={i} style={{
                fontFamily: "var(--font-heading), 'Fraunces', serif",
                fontSize: 'clamp(1.1rem, 3.5vw, 1.45rem)',
                fontWeight: 500,
                fontStyle: 'italic',
                color: LAVENDER,
                lineHeight: 1.5,
                textAlign: 'center',
                margin: 0,
                maxWidth: 400,
                opacity: i < visiblePhrases ? 1 : 0,
                transform: i < visiblePhrases ? 'translateY(0)' : 'translateY(10px)',
                filter: i < visiblePhrases ? 'blur(0)' : 'blur(3px)',
                transition: 'opacity 2.2s ease, transform 2.2s ease, filter 1.8s ease',
              }}>
                {phrase}
              </p>
            ))}
          </div>
        </div>

        <TimedProgressBar durationMs={step3Total} />

        <SkipLink onClick={advanceStep} />
      </div>
    );
  }

  // =========================================================================
  //  STEP 3 — COMPLETION
  // =========================================================================
  if (step === 3) {
    return (
      <div style={styles.container}>
        <style>{keyframeStyles}</style>

        {/* Soft glow behind the completion content */}
        <div style={{
          position: 'absolute',
          top: '38%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(155, 142, 196, 0.10) 0%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        <div style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          padding: '0 24px',
          maxWidth: 540,
          margin: '0 auto',
        }}>
          {/* Heart icon */}
          <div style={{
            fontSize: 40,
            marginBottom: 28,
            opacity: showCompletion ? 1 : 0,
            transition: 'opacity 1.5s ease',
            animation: showCompletion ? 'scbHeartbeat 2.5s ease-in-out infinite' : 'none',
          }}>
            {'\u{1F49C}'}
          </div>

          {/* Heading */}
          <h2 style={{
            ...styles.heading,
            opacity: showCompletion ? 1 : 0,
            transform: showCompletion ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 2s ease, transform 2s ease',
            marginBottom: 20,
            textAlign: 'center',
          }}>
            That was Kristin Neff's Self-Compassion Break
          </h2>

          {/* Body text */}
          <p style={{
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
            fontSize: 15,
            lineHeight: 1.75,
            color: 'var(--text-secondary)',
            margin: '0 0 12px',
            opacity: showCompletionBody ? 1 : 0,
            transform: showCompletionBody ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 2s ease, transform 2s ease',
          }}>
            Backed by over 200 studies.
          </p>

          <p style={{
            fontFamily: "var(--font-heading), 'Fraunces', serif",
            fontSize: 'clamp(1rem, 3vw, 1.15rem)',
            fontWeight: 500,
            fontStyle: 'italic',
            lineHeight: 1.6,
            color: LAVENDER,
            margin: '0 0 44px',
            opacity: showCompletionBody ? 1 : 0,
            transform: showCompletionBody ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 2s ease 0.5s, transform 2s ease 0.5s',
          }}>
            Compassion isn't weakness. It's the foundation of resilience.
          </p>

          {/* Separator */}
          <div style={{
            width: 48,
            height: 2,
            borderRadius: 1,
            background: LAVENDER_LIGHT,
            margin: '0 auto 44px',
            opacity: showCompletionBody ? 1 : 0,
            transition: 'opacity 1.5s ease 0.8s',
          }} />

          {/* Continue button */}
          <div style={{
            opacity: showContinueBtn ? 1 : 0,
            transform: showContinueBtn ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 1.2s ease, transform 1.2s ease',
          }}>
            <button
              onClick={onComplete}
              style={styles.primaryBtn}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 6px 24px ${LAVENDER_SHADOW}`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 4px 16px ${LAVENDER_SHADOW}`;
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback (should never reach here)
  return null;
}


// ===========================================================================
//  STYLES
// ===========================================================================
const styles = {
  container: {
    position: 'relative',
    minHeight: '70vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 0 100px',
    overflow: 'hidden',
  },

  stepLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.16em',
    color: LAVENDER,
    fontWeight: 600,
    marginBottom: 12,
    fontFamily: "'JetBrains Mono', monospace",
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
  },

  contentArea: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    padding: '32px 28px',
    maxWidth: 520,
    width: '100%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  meditationText: {
    fontFamily: "var(--font-heading), 'Fraunces', serif",
    fontSize: 'clamp(1.25rem, 4vw, 1.7rem)',
    fontWeight: 500,
    color: 'var(--text-primary)',
    lineHeight: 1.45,
    textAlign: 'center',
    margin: 0,
    maxWidth: 460,
  },

  heading: {
    fontFamily: "var(--font-heading), 'Fraunces', serif",
    fontSize: 'clamp(1.3rem, 4vw, 1.75rem)',
    fontWeight: 500,
    color: 'var(--text-primary)',
    lineHeight: 1.35,
    margin: '0 0 16px',
  },

  primaryBtn: {
    padding: '16px 40px',
    borderRadius: 50,
    background: LAVENDER,
    color: '#fff',
    border: 'none',
    fontSize: 16,
    fontWeight: 600,
    fontFamily: "var(--font-heading), 'Fraunces', serif",
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    boxShadow: `0 4px 16px ${LAVENDER_SHADOW}`,
    letterSpacing: '0.01em',
  },
};
