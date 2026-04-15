"use client";

import { useMemo, useState } from 'react';
import { InterventionShell, PrimaryButton, StepDots, appendToStorage, rangeStyle, shellStyles } from './shared';

const ACCENT = '#D4A843';
const TYPES = {
  Physical: ['Sleep more intentionally', 'Use gentle movement as active rest'],
  Mental: ['Take thinking breaks', 'Brain dump before bed'],
  Emotional: ['Reduce emotional labor', 'Set empathy boundaries'],
  Social: ['Spend time alone', 'Choose energizing people over draining ones'],
  Sensory: ['Reduce screens', 'Get silence, nature, or dimmer environments'],
  Creative: ["Take in someone else's creativity", 'Let beauty refill you'],
  Spiritual: ['Reconnect with meaning', 'Use meditation, service, or nature'],
};

export default function StrategicRest({ onComplete }) {
  const [scores, setScores] = useState(() => Object.fromEntries(Object.keys(TYPES).map((key) => [key, 5])));
  const topTwo = useMemo(() => Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([key]) => key), [scores]);

  return (
    <InterventionShell maxWidth={820}>
      <div style={shellStyles.card}>
        <StepDots currentStep={2} totalSteps={2} accent={ACCENT} label="Strategic Rest Design" />
        <h2 style={shellStyles.heading}>Which type of rest are you most depleted in?</h2>
        <div style={{ display: 'grid', gap: 16, marginTop: 24 }}>
          {Object.keys(TYPES).map((key) => (
            <div key={key}>
              <label style={shellStyles.label}>{key}: {scores[key]}/10</label>
              <input type="range" min="1" max="10" value={scores[key]} onChange={(event) => setScores((current) => ({ ...current, [key]: Number(event.target.value) }))} style={{ ...rangeStyle(ACCENT), marginTop: 8 }} />
            </div>
          ))}
        </div>
        <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(212, 168, 67, 0.08)' }}>
          <strong style={{ display: 'block', marginBottom: 10 }}>Most needed rest</strong>
          {topTwo.map((type) => (
            <div key={type} style={{ marginTop: 10 }}>
              <p style={{ ...shellStyles.body, margin: 0 }}><strong style={{ color: 'var(--text-primary)' }}>{type}</strong></p>
              <ul style={{ margin: '8px 0 0 18px', lineHeight: 1.8 }}>
                {TYPES[type].map((tip) => <li key={tip}>{tip}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div style={shellStyles.buttonRow}>
          <PrimaryButton
            accent={ACCENT}
            onClick={() => {
              appendToStorage('aiforj_strategic_rest', {
                scores,
                topTwo,
                createdAt: new Date().toISOString(),
              });
              onComplete();
            }}
          >
            Save rest design
          </PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
