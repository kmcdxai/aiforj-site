"use client";

import { useMemo, useState } from 'react';
import { InterventionShell, PrimaryButton, SecondaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#D4A843';
const TEMPLATES = [
  (stressor) => `I can handle ${stressor} one step at a time.`,
  (stressor) => `I've survived harder things than ${stressor}.`,
  (stressor) => `This feeling is temporary. ${stressor} will pass.`,
  (stressor) => `I don't have to be perfect. I just have to keep going through ${stressor}.`,
];

export default function StressInoculation({ onComplete }) {
  const [stressor, setStressor] = useState('');
  const [index, setIndex] = useState(0);
  const statement = useMemo(() => (stressor.trim() ? TEMPLATES[index % TEMPLATES.length](stressor.trim()) : ''), [index, stressor]);

  return (
    <InterventionShell center maxWidth={760}>
      <div style={{ ...shellStyles.card, textAlign: 'center' }}>
        <StepDots currentStep={statement ? 2 : 1} totalSteps={2} accent={ACCENT} label="Stress Inoculation Statement" />
        <h2 style={shellStyles.heading}>What&apos;s stressing you?</h2>
        <input value={stressor} onChange={(event) => setStressor(event.target.value)} style={{ ...shellStyles.textInput, marginTop: 24, textAlign: 'center' }} />
        {statement ? (
          <div style={{ marginTop: 26, padding: '32px 24px', borderRadius: 28, background: 'rgba(212, 168, 67, 0.1)' }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(30px, 5vw, 46px)', lineHeight: 1.25 }}>{statement}</div>
          </div>
        ) : null}
        <p style={{ ...shellStyles.body, marginTop: 18 }}>Screenshot it or make it your wallpaper if it helps.</p>
        <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
          <SecondaryButton onClick={() => setIndex((value) => value + 1)} disabled={!statement}>Regenerate</SecondaryButton>
          <PrimaryButton
            accent={ACCENT}
            disabled={!statement}
            onClick={() => {
              appendToStorage('aiforj_stress_inoculation', {
                stressor,
                statement,
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
