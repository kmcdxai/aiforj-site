"use client";

import { useState } from 'react';
import { InterventionShell, PrimaryButton, SecondaryButton, StepDots, shellStyles } from './shared';

const ACCENT = '#C4856C';
const STEPS = [
  'Amygdala detected something threatening.',
  'Fight-or-flight activated and stress chemistry rose.',
  'Heart rate, breathing, and muscle tension increased.',
  'This is normal. Your body is doing exactly what it was designed to do.',
];

export default function NervousSystemEducation({ onComplete }) {
  const [index, setIndex] = useState(0);
  const finished = index >= STEPS.length;

  return (
    <InterventionShell center maxWidth={760}>
      <div style={{ ...shellStyles.card, textAlign: 'center' }}>
        <StepDots currentStep={Math.min(index + 1, 5)} totalSteps={5} accent={ACCENT} label="Nervous System Education" />
        {!finished ? (
          <>
            <h2 style={shellStyles.heading}>Why fear feels bigger than reason right now.</h2>
            <div style={{ marginTop: 24, display: 'grid', placeItems: 'center' }}>
              <svg viewBox="0 0 300 180" style={{ width: '100%', maxWidth: 320 }}>
                <circle cx="110" cy="90" r="42" fill="rgba(196, 133, 108, 0.26)" />
                <circle cx="190" cy="90" r="42" fill="rgba(107, 152, 184, 0.16)" />
                <text x="110" y="96" textAnchor="middle" fontSize="14" fontWeight="700" fill="#9A5E4A">Amygdala</text>
                <text x="190" y="96" textAnchor="middle" fontSize="14" fontWeight="700" fill="#4E7390">Thinking Brain</text>
              </svg>
            </div>
            <div style={{ ...shellStyles.card, marginTop: 18, background: 'rgba(196, 133, 108, 0.08)' }}>
              <p style={{ ...shellStyles.body, margin: 0 }}>{STEPS[index]}</p>
            </div>
            <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
              <SecondaryButton onClick={() => setIndex((value) => Math.max(0, value - 1))} disabled={index === 0}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} onClick={() => setIndex((value) => value + 1)}>
                {index === STEPS.length - 1 ? 'How to bring thinking back' : 'Next'}
              </PrimaryButton>
            </div>
          </>
        ) : (
          <>
            <h2 style={shellStyles.heading}>How to bring the thinking brain back online.</h2>
            <ul style={{ margin: '18px 0 0 18px', lineHeight: 1.9, textAlign: 'left' }}>
              <li>Grounding helps reactivate the prefrontal cortex.</li>
              <li>Slow exhales activate the vagus nerve.</li>
              <li>Naming the emotion reduces amygdala activation.</li>
            </ul>
            <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
              <PrimaryButton accent={ACCENT} onClick={onComplete}>Finish</PrimaryButton>
            </div>
          </>
        )}
      </div>
    </InterventionShell>
  );
}
