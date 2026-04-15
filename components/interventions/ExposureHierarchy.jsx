"use client";

import { useState } from 'react';
import { InterventionShell, PrimaryButton, SecondaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#C4856C';

export default function ExposureHierarchy({ onComplete }) {
  const [fear, setFear] = useState('');
  const [rungs, setRungs] = useState(() => Array.from({ length: 8 }, (_, index) => ({ level: index + 2, scenario: '' })));

  return (
    <InterventionShell maxWidth={820}>
      <div style={shellStyles.card}>
        <StepDots currentStep={fear ? 2 : 1} totalSteps={2} accent={ACCENT} label="Exposure Hierarchy Builder" />
        <h2 style={shellStyles.heading}>What are you afraid of?</h2>
        <input value={fear} onChange={(event) => setFear(event.target.value)} placeholder="Name the fear" style={{ ...shellStyles.textInput, marginTop: 24 }} />
        <div style={{ display: 'grid', gap: 12, marginTop: 20 }}>
          {rungs.map((rung, index) => (
            <input
              key={index}
              value={rung.scenario}
              onChange={(event) => setRungs((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, scenario: event.target.value } : item))}
              placeholder={`Rung ${index + 1} (${rung.level}/10 scary)`}
              style={shellStyles.textInput}
            />
          ))}
        </div>
        <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(196, 133, 108, 0.08)' }}>
          <p style={{ ...shellStyles.body, margin: 0 }}>Start with rung 1. Stay with it until the fear drops by half, then move to rung 2.</p>
          <p style={{ ...shellStyles.body, marginTop: 10 }}>For phobias or fears that significantly affect your life, a therapist can guide exposure more safely and effectively.</p>
        </div>
        <div style={shellStyles.buttonRow}>
          <SecondaryButton onClick={() => setRungs(Array.from({ length: 8 }, (_, index) => ({ level: index + 2, scenario: '' })))}>Reset</SecondaryButton>
          <PrimaryButton
            accent={ACCENT}
            disabled={!fear.trim() || rungs.some((rung) => !rung.scenario.trim())}
            onClick={() => {
              appendToStorage('aiforj_exposure_hierarchy', {
                fear,
                rungs,
                createdAt: new Date().toISOString(),
              });
              onComplete();
            }}
          >
            Save hierarchy
          </PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
