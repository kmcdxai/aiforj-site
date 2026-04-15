"use client";

import { useState } from 'react';
import { ChoiceCard, InterventionShell, PrimaryButton, StepDots, shellStyles } from './shared';

const ACCENT = '#D4A843';
const VALUES = ['Adventure', 'Creativity', 'Connection', 'Freedom', 'Growth', 'Impact', 'Beauty', 'Knowledge', 'Service', 'Health', 'Play', 'Authenticity'];

export default function ValuesSparkCheck({ onComplete }) {
  const [sparks, setSparks] = useState([]);

  const toggle = (value) => {
    setSparks((current) => (current.includes(value) ? current.filter((item) => item !== value) : [...current, value]));
  };

  return (
    <InterventionShell center maxWidth={760}>
      <div style={{ ...shellStyles.card, textAlign: 'center' }}>
        <StepDots currentStep={2} totalSteps={2} accent={ACCENT} label="Values Spark Check" />
        <h2 style={shellStyles.heading}>Tap anything that gives you even a tiny spark.</h2>
        <div style={{ display: 'grid', gap: 10, marginTop: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
          {VALUES.map((value) => (
            <ChoiceCard key={value} selected={sparks.includes(value)} accent={ACCENT} onClick={() => toggle(value)}>
              {value}
            </ChoiceCard>
          ))}
        </div>
        <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(212, 168, 67, 0.08)' }}>
          <p style={{ ...shellStyles.body, margin: 0 }}>
            {sparks.length
              ? `Your sparks: ${sparks.join(', ')}. Even in stuckness, something still resonates. Pull that thread.`
              : "If nothing sparks, that's important data too. Numbness may need attention first."}
          </p>
        </div>
        <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
          <PrimaryButton accent={ACCENT} onClick={onComplete}>Finish</PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
