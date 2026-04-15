"use client";

import { useMemo, useState } from 'react';
import { InterventionShell, PrimaryButton, SecondaryButton, StepDots, shellStyles } from './shared';

const ACCENT = '#C47A8A';
const QUOTES = [
  {
    quote: 'There is no greater agony than bearing an untold story inside you.',
    author: 'Maya Angelou',
  },
  {
    quote: 'Shame derives its power from being unspeakable.',
    author: 'Brene Brown',
  },
  {
    quote: 'Failure is simply the opportunity to begin again.',
    author: 'Henry Ford',
  },
  {
    quote: 'We all have chapters we would rather leave unread.',
    author: 'Unknown reflection',
  },
];

function getAggregateCount() {
  if (typeof window === 'undefined') return 2400;

  const keys = [
    'aiforj_shame_guilt_clarifier',
    'aiforj_compassionate_letter',
    'aiforj_shame_resilience',
    'aiforj_shame_origin_mapping',
    'aiforj_self_compassion_full',
  ];

  let actual = 0;
  for (const key of keys) {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(key) || '[]');
      actual += Array.isArray(parsed) ? parsed.length : 0;
    } catch (_) {
      // Ignore malformed user storage.
    }
  }

  return Math.max(2400, actual);
}

export default function CommonHumanity({ onComplete }) {
  const [index, setIndex] = useState(0);
  const quote = QUOTES[index];
  const count = useMemo(() => getAggregateCount(), []);

  return (
    <InterventionShell center maxWidth={720}>
      <div style={{ ...shellStyles.card, textAlign: 'center' }}>
        <StepDots currentStep={2} totalSteps={2} accent={ACCENT} label="Common Humanity" />
        <h2 style={shellStyles.heading}>Shame tells you that you are the only one.</h2>
        <div
          style={{
            marginTop: 22,
            padding: '28px 24px',
            borderRadius: 28,
            background: 'linear-gradient(180deg, rgba(196, 122, 138, 0.12), rgba(250, 246, 240, 0.96))',
            border: '1px solid rgba(196, 122, 138, 0.16)',
          }}
        >
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(34px, 6vw, 58px)', color: ACCENT }}>
            {count.toLocaleString()}+
          </div>
          <p style={{ ...shellStyles.body, marginTop: 10 }}>
            people on AIForj have explored feelings of shame or guilt.
          </p>
          <p style={{ ...shellStyles.body, marginTop: 10, color: 'var(--text-primary)', fontWeight: 700 }}>
            You are not alone in this feeling.
          </p>
        </div>

        <div style={{ ...shellStyles.card, marginTop: 22, background: 'rgba(255,255,255,0.78)' }}>
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: 26, lineHeight: 1.4, margin: 0 }}>"{quote.quote}"</p>
          <p style={{ ...shellStyles.body, marginTop: 14 }}>{quote.author}</p>
        </div>

        <p style={{ ...shellStyles.body, marginTop: 20 }}>
          Every person you admire has felt some version of this. Shame is part of being human. It is not proof that you are broken.
        </p>

        <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
          <SecondaryButton onClick={() => setIndex((index + 1) % QUOTES.length)}>Another quote</SecondaryButton>
          <PrimaryButton accent={ACCENT} onClick={onComplete}>Finish</PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
