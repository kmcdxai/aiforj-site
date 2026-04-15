"use client";

import { useMemo, useState } from 'react';
import { InterventionShell, PrimaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#D4A843';

export default function FutureSelf({ onComplete }) {
  const [letter, setLetter] = useState('');
  const futureDate = useMemo(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 5);
    return date.toLocaleDateString();
  }, []);

  return (
    <InterventionShell maxWidth={820}>
      <div style={shellStyles.card}>
        <StepDots currentStep={2} totalSteps={2} accent={ACCENT} label="Future Self Conversation" />
        <h2 style={shellStyles.heading}>Write a letter from your future self to you.</h2>
        <div style={{ ...shellStyles.card, marginTop: 18, background: 'rgba(212, 168, 67, 0.08)' }}>
          <ul style={{ margin: '0 0 0 18px', lineHeight: 1.8 }}>
            <li>What does future-you want you to know about how things turned out?</li>
            <li>What does future-you wish you had started today?</li>
            <li>What does future-you want to say about the fear you feel now?</li>
            <li>What would future-you celebrate about who you already are?</li>
          </ul>
        </div>
        <textarea value={letter} onChange={(event) => setLetter(event.target.value)} style={{ ...shellStyles.textarea, marginTop: 18, minHeight: 260 }} />
        {letter.trim() ? (
          <div style={{ ...shellStyles.card, marginTop: 18, background: 'rgba(255,255,255,0.94)' }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Delivered from the future</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, marginTop: 8 }}>{futureDate}</div>
          </div>
        ) : null}
        <div style={shellStyles.buttonRow}>
          <PrimaryButton
            accent={ACCENT}
            disabled={!letter.trim()}
            onClick={() => {
              appendToStorage('aiforj_future_self', {
                letter,
                futureDate,
                createdAt: new Date().toISOString(),
              });
              onComplete();
            }}
          >
            Save letter
          </PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
