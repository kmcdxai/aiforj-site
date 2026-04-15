"use client";

import { useState } from 'react';
import { InterventionShell, PrimaryButton, SecondaryButton, StepDots, shellStyles } from './shared';

const ACCENT = '#D4A843';
const GROUPS = [
  { name: 'Face', tense: 'Scrunch your entire face tight for 5 seconds, then release.' },
  { name: 'Shoulders', tense: 'Shrug shoulders to your ears for 5 seconds, then drop them.' },
  { name: 'Hands', tense: 'Make the tightest fists you can, then spread your fingers wide.' },
];

export default function PmrExpress({ onComplete }) {
  const [index, setIndex] = useState(0);
  return (
    <InterventionShell center maxWidth={720}>
      <div style={{ ...shellStyles.card, textAlign: 'center' }}>
        <StepDots currentStep={index + 1} totalSteps={GROUPS.length} accent={ACCENT} label="PMR Express" />
        <h2 style={shellStyles.heading}>{GROUPS[index].name}</h2>
        <div style={{ ...shellStyles.card, marginTop: 24, background: 'rgba(212, 168, 67, 0.08)' }}>
          <p style={{ ...shellStyles.body, margin: 0 }}>{GROUPS[index].tense}</p>
        </div>
        <p style={{ ...shellStyles.body, marginTop: 16 }}>The contrast teaches your body what relaxed actually feels like.</p>
        <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
          <SecondaryButton onClick={() => setIndex((value) => Math.max(0, value - 1))} disabled={index === 0}>Back</SecondaryButton>
          <PrimaryButton accent={ACCENT} onClick={index === GROUPS.length - 1 ? onComplete : () => setIndex((value) => value + 1)}>
            {index === GROUPS.length - 1 ? 'Finish' : 'Next group'}
          </PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
