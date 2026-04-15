"use client";

import { useMemo, useState } from 'react';
import { InterventionShell, PrimaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#9B8EC4';
const DOMAINS = {
  time: ['I say yes when I mean no.', 'My calendar fills before I check my capacity.', 'I rarely protect time for recovery.'],
  emotional: ['I absorb other people’s emotions.', 'I feel responsible for keeping others okay.', 'I over-explain instead of setting limits.'],
  work: ['I work outside work hours.', 'I struggle to log off mentally.', 'I feel guilty when I do less than maximum.'],
  digital: ['I am always reachable.', 'Notifications run my attention.', 'My devices rarely get quiet time.'],
  relationship: ['I overfunction for people I care about.', 'I rescue instead of relating.', 'I ignore resentment until it explodes.'],
  physical: ['I override my body’s signals.', 'I skip food, water, sleep, or rest when stressed.', 'I notice exhaustion late.'],
};

const SCRIPTS = {
  time: 'I want to help, and I do not have capacity for that right now.',
  emotional: 'I care about you, and I cannot carry this for you.',
  work: 'I am offline after this time and will return to it tomorrow.',
  digital: 'I am not available in real time. I will respond when I can.',
  relationship: 'I am willing to support you, but I am not available to overfunction for both of us.',
  physical: 'My body is not negotiable. Rest is part of the plan, not a reward after the plan.',
};

export default function BoundaryInventoryOverwhelm({ onComplete }) {
  const [scores, setScores] = useState(Object.fromEntries(Object.keys(DOMAINS).map((key) => [key, [3, 3, 3]])));

  const totals = useMemo(
    () => Object.fromEntries(Object.entries(scores).map(([key, values]) => [key, values.reduce((sum, value) => sum + value, 0)])),
    [scores]
  );
  const weakest = useMemo(() => Object.entries(totals).sort((a, b) => a[1] - b[1]).slice(0, 2), [totals]);

  const update = (domain, index, value) => {
    setScores((current) => ({
      ...current,
      [domain]: current[domain].map((score, scoreIndex) => (scoreIndex === index ? value : score)),
    }));
  };

  return (
    <InterventionShell maxWidth={820}>
      <div style={shellStyles.card}>
        <StepDots currentStep={2} totalSteps={2} accent={ACCENT} label="Boundary Inventory" />
        <h2 style={shellStyles.heading}>Overwhelm is often the symptom. Boundary gaps are often the cause.</h2>
        <div style={{ display: 'grid', gap: 16, marginTop: 24 }}>
          {Object.entries(DOMAINS).map(([domain, prompts]) => (
            <div key={domain} style={shellStyles.card}>
              <strong style={{ display: 'block', marginBottom: 12, textTransform: 'capitalize' }}>{domain} boundaries</strong>
              {prompts.map((prompt, index) => (
                <label key={prompt} style={{ display: 'grid', gap: 8, marginTop: index ? 14 : 0 }}>
                  <span style={shellStyles.body}>{prompt}</span>
                  <input type="range" min="1" max="5" value={scores[domain][index]} onChange={(event) => update(domain, index, Number(event.target.value))} style={{ accentColor: ACCENT }} />
                </label>
              ))}
            </div>
          ))}
        </div>
        <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(155, 142, 196, 0.08)' }}>
          <strong style={{ display: 'block', marginBottom: 10 }}>Weakest domains</strong>
          <ul style={{ margin: '0 0 0 18px', lineHeight: 1.7 }}>
            {weakest.map(([domain]) => (
              <li key={domain}>
                <strong style={{ textTransform: 'capitalize' }}>{domain}</strong>: {SCRIPTS[domain]}
              </li>
            ))}
          </ul>
        </div>
        <div style={shellStyles.buttonRow}>
          <PrimaryButton
            accent={ACCENT}
            onClick={() => {
              appendToStorage('aiforj_boundary_inventory_overwhelm', { scores, totals, weakest, createdAt: new Date().toISOString() });
              onComplete();
            }}
          >
            Save inventory
          </PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
