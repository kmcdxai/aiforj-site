"use client";

import { useMemo, useState } from 'react';
import { InterventionShell, PrimaryButton, StepDots, appendToStorage, rangeStyle, shellStyles } from './shared';

const ACCENT = '#D4A843';
const DOMAINS = ['Career', 'Relationships', 'Health', 'Finances', 'Fun', 'Growth', 'Environment', 'Community'];

export default function LifeSatisfactionWheel({ onComplete }) {
  const [scores, setScores] = useState(() => Object.fromEntries(DOMAINS.map((domain) => [domain, 5])));
  const [step, setStep] = useState('');
  const lowest = useMemo(() => Object.entries(scores).sort((a, b) => a[1] - b[1])[0], [scores]);

  return (
    <InterventionShell maxWidth={820}>
      <div style={shellStyles.card}>
        <StepDots currentStep={2} totalSteps={2} accent={ACCENT} label="Life Satisfaction Wheel" />
        <h2 style={shellStyles.heading}>Rate each area of your life.</h2>
        <div style={{ display: 'grid', gap: 16, marginTop: 24 }}>
          {DOMAINS.map((domain) => (
            <div key={domain}>
              <label style={shellStyles.label}>{domain}: {scores[domain]}/10</label>
              <input type="range" min="1" max="10" value={scores[domain]} onChange={(event) => setScores((current) => ({ ...current, [domain]: Number(event.target.value) }))} style={{ ...rangeStyle(ACCENT), marginTop: 8 }} />
            </div>
          ))}
        </div>
        <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(212, 168, 67, 0.08)' }}>
          <p style={{ ...shellStyles.body, margin: 0 }}>
            Biggest gap: <strong style={{ color: 'var(--text-primary)' }}>{lowest[0]}</strong> at <strong style={{ color: 'var(--text-primary)' }}>{lowest[1]}/10</strong>.
            Stuckness often lives in the area you are most avoiding.
          </p>
        </div>
        <input value={step} onChange={(event) => setStep(event.target.value)} placeholder={`What's one step in ${lowest[0]}?`} style={{ ...shellStyles.textInput, marginTop: 16 }} />
        <div style={shellStyles.buttonRow}>
          <PrimaryButton
            accent={ACCENT}
            disabled={!step.trim()}
            onClick={() => {
              appendToStorage('aiforj_life_satisfaction_wheel', {
                scores,
                step,
                createdAt: new Date().toISOString(),
              });
              onComplete();
            }}
          >
            Finish
          </PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
