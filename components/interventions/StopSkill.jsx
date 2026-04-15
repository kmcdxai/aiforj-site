"use client";

import { useEffect, useMemo, useState } from 'react';
import {
  ANGER_ACCENT,
  InterventionShell,
  PrimaryButton,
  StepDots,
  shellStyles,
} from './shared';

const STEPS = [
  {
    letter: 'S',
    title: 'STOP',
    message: "Don't move. Don't react. Just stop.",
  },
  {
    letter: 'T',
    title: 'Take a step back',
    message: 'Create space between you and the trigger, physically or mentally.',
  },
  {
    letter: 'O',
    title: 'Observe',
    message: 'Notice what is happening in your body, thoughts, and urges.',
  },
  {
    letter: 'P',
    title: 'Proceed mindfully',
    message: 'Choose the next action that matches your values, not your adrenaline.',
  },
];

export default function StopSkill({ onComplete }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [countdown, setCountdown] = useState(5);
  const [feeling, setFeeling] = useState('');
  const [body, setBody] = useState('');
  const [urge, setUrge] = useState('');
  const [mindfulAction, setMindfulAction] = useState('');

  const step = useMemo(() => STEPS[stepIndex], [stepIndex]);

  useEffect(() => {
    if (stepIndex >= STEPS.length || countdown <= 0) return undefined;
    const timer = window.setTimeout(() => setCountdown((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown, stepIndex]);

  useEffect(() => {
    setCountdown(5);
  }, [stepIndex]);

  if (stepIndex >= STEPS.length) {
    return (
      <InterventionShell center>
        <div style={{ ...shellStyles.card, textAlign: 'center', maxWidth: 520, margin: '0 auto' }}>
          <StepDots currentStep={4} totalSteps={4} accent={ANGER_ACCENT} label="Impulse slowed down" />
          <div style={{ fontSize: 52, fontWeight: 700, color: ANGER_ACCENT, marginBottom: 18 }}>STOP</div>
          <h2 style={shellStyles.heading}>You just put space between impulse and action.</h2>
          <p style={{ ...shellStyles.body, marginTop: 14 }}>
            Feeling: <strong style={{ color: 'var(--text-primary)' }}>{feeling || 'Noticed internally'}</strong>
            <br />
            Body: <strong style={{ color: 'var(--text-primary)' }}>{body || 'Tracked internally'}</strong>
            <br />
            Urge: <strong style={{ color: 'var(--text-primary)' }}>{urge || 'Paused before acting'}</strong>
            <br />
            Mindful move: <strong style={{ color: 'var(--text-primary)' }}>{mindfulAction || 'Chosen with intention'}</strong>
          </p>
          <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
            <PrimaryButton onClick={onComplete}>Finish STOP skill</PrimaryButton>
          </div>
        </div>
      </InterventionShell>
    );
  }

  return (
    <InterventionShell center maxWidth={600}>
      <div style={{ ...shellStyles.card, textAlign: 'center', padding: '34px 26px' }}>
        <StepDots currentStep={stepIndex + 1} totalSteps={4} accent={ANGER_ACCENT} label="DBT pause practice" />
        <div
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(72px, 18vw, 144px)',
            lineHeight: 0.9,
            color: ANGER_ACCENT,
            marginBottom: 18,
          }}
        >
          {step.letter}
        </div>
        <h2 style={shellStyles.heading}>{step.title}</h2>
        <p style={{ ...shellStyles.body, marginTop: 14 }}>{step.message}</p>

        {step.letter === 'O' ? (
          <div style={{ display: 'grid', gap: 12, marginTop: 22, textAlign: 'left' }}>
            <input
              value={feeling}
              onChange={(event) => setFeeling(event.target.value)}
              placeholder="I'm feeling..."
              style={shellStyles.textInput}
            />
            <input
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="My body is..."
              style={shellStyles.textInput}
            />
            <input
              value={urge}
              onChange={(event) => setUrge(event.target.value)}
              placeholder="I want to..."
              style={shellStyles.textInput}
            />
          </div>
        ) : null}

        {step.letter === 'P' ? (
          <textarea
            value={mindfulAction}
            onChange={(event) => setMindfulAction(event.target.value)}
            placeholder="What action aligns with your values, not your anger?"
            style={{ ...shellStyles.textarea, marginTop: 22 }}
          />
        ) : null}

        <div
          style={{
            marginTop: 22,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 80,
            padding: '10px 18px',
            borderRadius: 999,
            background: 'rgba(196, 91, 91, 0.1)',
            color: ANGER_ACCENT,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
          }}
        >
          {countdown > 0 ? `${countdown}s` : 'Ready'}
        </div>

        <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
          <PrimaryButton
            onClick={() => setStepIndex((current) => current + 1)}
            disabled={countdown > 0 || (step.letter === 'P' && !mindfulAction.trim())}
          >
            {stepIndex === STEPS.length - 1 ? 'Finish STOP' : 'Next letter'}
          </PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
