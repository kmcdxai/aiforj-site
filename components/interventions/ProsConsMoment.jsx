"use client";

import CrisisBanner from './CrisisBanner';
import { InterventionShell, PrimaryButton, StepDots, appendToStorage, shellStyles } from './shared';
import { useState } from 'react';

const ACCENT = '#C47A8A';
const FIELDS = [
  ['prosAct', 'Pros of acting on the urge'],
  ['consAct', 'Cons of acting on the urge'],
  ['prosResist', 'Pros of resisting'],
  ['consResist', 'Cons of resisting'],
];

export default function ProsConsMoment({ onComplete }) {
  const [state, setState] = useState({ prosAct: '', consAct: '', prosResist: '', consResist: '' });

  return (
    <InterventionShell maxWidth={900}>
      <div style={shellStyles.card}>
        <CrisisBanner />
        <StepDots currentStep={2} totalSteps={2} accent={ACCENT} label="Pros / Cons in the Moment" />
        <h2 style={shellStyles.heading}>Be honest about the short-term payoff and the longer-term cost.</h2>
        <div style={{ display: 'grid', gap: 16, marginTop: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {FIELDS.map(([key, label]) => (
            <div key={key} style={{ ...shellStyles.card, padding: '18px 18px', background: 'var(--surface)' }}>
              <strong>{label}</strong>
              <textarea value={state[key]} onChange={(event) => setState((current) => ({ ...current, [key]: event.target.value }))} style={{ ...shellStyles.textarea, marginTop: 12, minHeight: 150 }} />
            </div>
          ))}
        </div>
        <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(196, 122, 138, 0.08)' }}>
          <p style={{ ...shellStyles.body, margin: 0 }}>The pros of acting are real, but short-term. The cons of acting are usually the ones you still feel tomorrow.</p>
        </div>
        <div style={shellStyles.buttonRow}>
          <PrimaryButton
            accent={ACCENT}
            disabled={Object.values(state).some((value) => !value.trim())}
            onClick={() => {
              appendToStorage('aiforj_pros_cons_moment', {
                ...state,
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
