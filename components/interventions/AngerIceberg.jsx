"use client";

import { useState } from 'react';
import {
  ANGER_ACCENT,
  ChoiceCard,
  InterventionShell,
  PrimaryButton,
  StepDots,
  shellStyles,
} from './shared';

const FEELINGS = [
  { label: 'Hurt', left: '20%', top: '42%' },
  { label: 'Fear', left: '63%', top: '45%' },
  { label: 'Embarrassment', left: '18%', top: '58%' },
  { label: 'Powerlessness', left: '58%', top: '58%' },
  { label: 'Grief', left: '30%', top: '70%' },
  { label: 'Rejection', left: '68%', top: '70%' },
  { label: 'Exhaustion', left: '23%', top: '82%' },
  { label: 'Loneliness', left: '46%', top: '84%' },
  { label: 'Disrespect', left: '69%', top: '82%' },
  { label: 'Betrayal', left: '48%', top: '50%' },
];

const SUGGESTIONS = {
  Hurt: { label: 'Try Self-Compassion Break', href: '/intervention/self-compassion-break?emotion=sad-low&intensity=5&time=quick' },
  Fear: { label: 'Try Physiological Sigh', href: '/intervention/physiological-sigh?emotion=anxious&intensity=5&time=quick' },
  Embarrassment: { label: 'Try Self-Compassion Break', href: '/intervention/self-compassion-break?emotion=sad-low&intensity=5&time=quick' },
  Powerlessness: { label: 'Try Worry Decision Tree', href: '/intervention/worry-decision-tree?emotion=anxious&intensity=6&time=medium' },
  Grief: { label: 'Try Meaning-Making Journal', href: '/intervention/meaning-making-journal?emotion=sad-low&intensity=6&time=deep' },
  Rejection: { label: 'Try Connection Prompt', href: '/intervention/connection-prompt?emotion=sad-low&intensity=5&time=medium' },
  Exhaustion: { label: 'Try Behavioral Activation Micro-Task', href: '/intervention/ba-micro-task?emotion=sad-low&intensity=4&time=quick' },
  Loneliness: { label: 'Try Connection Prompt', href: '/intervention/connection-prompt?emotion=sad-low&intensity=5&time=medium' },
  Disrespect: { label: 'Try Values-Based Action Plan', href: '/intervention/values-based-action?emotion=anxious&intensity=6&time=deep' },
  Betrayal: { label: 'Try Emotional Validation', href: '/intervention/emotional-validation?emotion=sad-low&intensity=6&time=medium' },
};

export default function AngerIceberg({ onComplete }) {
  const [activeLabels, setActiveLabels] = useState([]);

  const toggleFeeling = (label) => {
    setActiveLabels((current) => (
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label]
    ));
  };

  const suggestion = activeLabels.length ? SUGGESTIONS[activeLabels[0]] : null;

  return (
    <InterventionShell maxWidth={700}>
      <div style={{ ...shellStyles.card, ...shellStyles.heroCard }}>
        <StepDots currentStep={1} totalSteps={1} accent={ANGER_ACCENT} label="What is anger protecting?" />
        <div style={shellStyles.eyebrow}>Anger Iceberg</div>
        <h2 style={shellStyles.heading}>Anger is usually the tip of the story.</h2>
        <p style={{ ...shellStyles.body, marginTop: 12 }}>
          Tap what might be underneath your anger right now. Anger is the bodyguard. These are the feelings it is trying to protect.
        </p>

        <div
          style={{
            position: 'relative',
            marginTop: 26,
            borderRadius: 28,
            overflow: 'hidden',
            minHeight: 430,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(107,152,184,0.08) 30%, rgba(107,152,184,0.18) 100%)',
            border: '1px solid var(--border)',
          }}
        >
          <svg viewBox="0 0 640 430" style={{ width: '100%', height: '100%' }} aria-hidden="true">
            <rect x="0" y="0" width="640" height="430" fill="transparent" />
            <line x1="0" y1="120" x2="640" y2="120" stroke="rgba(107,152,184,0.36)" strokeWidth="4" />
            <polygon
              points="300,30 365,120 418,230 338,380 238,352 186,230 230,120"
              fill="rgba(196, 91, 91, 0.12)"
              stroke="rgba(196, 91, 91, 0.28)"
              strokeWidth="4"
            />
            <text
              x="300"
              y="98"
              fill={ANGER_ACCENT}
              fontSize="28"
              fontWeight="700"
              textAnchor="middle"
              fontFamily="Fraunces"
            >
              ANGER
            </text>
          </svg>

          {FEELINGS.map((feeling) => {
            const selectedFeeling = activeLabels.includes(feeling.label);
            return (
              <button
                key={feeling.label}
                type="button"
                onClick={() => toggleFeeling(feeling.label)}
                style={{
                  position: 'absolute',
                  left: feeling.left,
                  top: feeling.top,
                  transform: 'translate(-50%, -50%)',
                  padding: '10px 14px',
                  borderRadius: 999,
                  border: selectedFeeling ? `1.5px solid ${ANGER_ACCENT}` : '1px solid rgba(44, 37, 32, 0.1)',
                  background: selectedFeeling ? 'rgba(196, 91, 91, 0.16)' : 'rgba(255,255,255,0.92)',
                  color: 'var(--text-primary)',
                  fontSize: 13,
                  fontWeight: 700,
                  boxShadow: selectedFeeling ? '0 12px 28px rgba(196, 91, 91, 0.18)' : '0 4px 12px rgba(44, 37, 32, 0.06)',
                  cursor: 'pointer',
                }}
              >
                {feeling.label}
              </button>
            );
          })}
        </div>

        {activeLabels.length ? (
          <div style={{ display: 'grid', gap: 14, marginTop: 24 }}>
            <div style={{ ...shellStyles.card, padding: '18px 20px', background: 'var(--surface)' }}>
              <p style={{ ...shellStyles.body, margin: 0 }}>
                Underneath your anger is <strong style={{ color: 'var(--text-primary)' }}>{activeLabels.join(', ')}</strong>. These are the real feelings asking for care. Anger is just the bodyguard.
              </p>
            </div>
            {suggestion ? (
              <ChoiceCard onClick={() => { window.location.href = suggestion.href; }} selected accent={ANGER_ACCENT}>
                <div style={{ display: 'grid', gap: 6 }}>
                  <strong style={{ fontSize: 16 }}>{suggestion.label}</strong>
                  <p style={{ ...shellStyles.body, fontSize: 14 }}>
                    Knowing what is underneath changes what you need. {activeLabels[0]} may need something gentler than a fight response.
                  </p>
                </div>
              </ChoiceCard>
            ) : null}
            <div style={shellStyles.buttonRow}>
              <PrimaryButton onClick={onComplete}>I see what is underneath</PrimaryButton>
            </div>
          </div>
        ) : null}
      </div>
    </InterventionShell>
  );
}
