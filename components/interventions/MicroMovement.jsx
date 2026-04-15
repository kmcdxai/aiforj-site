"use client";

import { useState } from 'react';
import { InterventionShell, PrimaryButton, SecondaryButton, StepDots, shellStyles } from './shared';

const ACCENT = '#8A8078';
const STEPS = [
  'Wiggle your toes.',
  'Squeeze your fists tight, then release.',
  'Roll your shoulders forward, then back.',
  'Turn your head slowly to the left, then right.',
  'If you are sitting, stand up. If standing, shift your weight side to side.',
];

export default function MicroMovement({ onComplete }) {
  const [index, setIndex] = useState(0);

  return (
    <InterventionShell center maxWidth={680}>
      <div style={{ ...shellStyles.card, textAlign: 'center' }}>
        <StepDots currentStep={index + 1} totalSteps={STEPS.length} accent={ACCENT} label="Micro-Movement Sequence" />
        <h2 style={shellStyles.heading}>Do not try to feel emotions. Try to feel your body.</h2>
        <div style={{ ...shellStyles.card, marginTop: 24, background: 'rgba(138, 128, 120, 0.08)' }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 34, lineHeight: 1.3 }}>{STEPS[index]}</div>
        </div>
        <p style={{ ...shellStyles.body, marginTop: 18 }}>Move slowly. Ten seconds is enough.</p>
        <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
          <SecondaryButton disabled={index === 0} onClick={() => setIndex((value) => Math.max(0, value - 1))}>Back</SecondaryButton>
          <PrimaryButton accent={ACCENT} onClick={index === STEPS.length - 1 ? onComplete : () => setIndex((value) => value + 1)}>
            {index === STEPS.length - 1 ? 'Finish' : 'Next move'}
          </PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
