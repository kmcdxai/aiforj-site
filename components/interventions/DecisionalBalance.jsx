"use client";

import { useMemo, useState } from 'react';
import { InterventionShell, PrimaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#D4A843';
const QUADRANTS = [
  { key: 'stayBenefits', label: 'Benefits of staying the same' },
  { key: 'stayCosts', label: 'Costs of staying the same' },
  { key: 'changeBenefits', label: 'Benefits of changing' },
  { key: 'changeCosts', label: 'Costs of changing' },
];

function countItems(text) {
  return text.split('\n').map((item) => item.trim()).filter(Boolean).length;
}

export default function DecisionalBalance({ onComplete }) {
  const [entries, setEntries] = useState({
    stayBenefits: '',
    stayCosts: '',
    changeBenefits: '',
    changeCosts: '',
  });

  const scores = useMemo(() => Object.fromEntries(Object.entries(entries).map(([key, value]) => [key, countItems(value)])), [entries]);

  return (
    <InterventionShell maxWidth={900}>
      <div style={shellStyles.card}>
        <StepDots currentStep={2} totalSteps={2} accent={ACCENT} label="Decisional Balance Sheet" />
        <h2 style={shellStyles.heading}>Map the hidden cost of staying stuck.</h2>
        <div style={{ display: 'grid', gap: 16, marginTop: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {QUADRANTS.map((quadrant) => (
            <div key={quadrant.key} style={{ ...shellStyles.card, padding: '18px 18px', background: 'var(--surface)' }}>
              <strong>{quadrant.label}</strong>
              <textarea
                value={entries[quadrant.key]}
                onChange={(event) => setEntries((current) => ({ ...current, [quadrant.key]: event.target.value }))}
                placeholder="One item per line"
                style={{ ...shellStyles.textarea, marginTop: 12, minHeight: 160 }}
              />
              <p style={{ ...shellStyles.body, marginTop: 10 }}>Items: {scores[quadrant.key]}</p>
            </div>
          ))}
        </div>
        <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(212, 168, 67, 0.08)' }}>
          <p style={{ ...shellStyles.body, margin: 0 }}>
            Hidden cost of inaction: <strong style={{ color: 'var(--text-primary)' }}>{scores.stayCosts}</strong> items.
            Potential benefits of change: <strong style={{ color: 'var(--text-primary)' }}>{scores.changeBenefits}</strong> items.
          </p>
        </div>
        <div style={shellStyles.buttonRow}>
          <PrimaryButton
            accent={ACCENT}
            disabled={Object.values(entries).some((value) => !value.trim())}
            onClick={() => {
              appendToStorage('aiforj_decisional_balance', {
                entries,
                scores,
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
