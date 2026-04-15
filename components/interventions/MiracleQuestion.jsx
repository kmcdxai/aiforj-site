"use client";

import { useState } from 'react';
import { InterventionShell, PrimaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#D4A843';

export default function MiracleQuestion({ onComplete }) {
  const [miracle, setMiracle] = useState('');
  const [tinyStep, setTinyStep] = useState('');

  return (
    <InterventionShell center maxWidth={760}>
      <div style={{ ...shellStyles.card, textAlign: 'center' }}>
        <StepDots currentStep={tinyStep.trim() ? 2 : 1} totalSteps={2} accent={ACCENT} label="Miracle Question" />
        <h2 style={shellStyles.heading}>If you woke up tomorrow and everything was how you wanted, what is the first thing you would notice?</h2>
        <textarea value={miracle} onChange={(event) => setMiracle(event.target.value)} style={{ ...shellStyles.textarea, marginTop: 24 }} />
        <input value={tinyStep} onChange={(event) => setTinyStep(event.target.value)} placeholder="What is the tiniest version of that you could create today?" style={{ ...shellStyles.textInput, marginTop: 16 }} />
        {tinyStep.trim() ? (
          <div style={{ marginTop: 22, padding: '28px 20px', borderRadius: 28, background: 'rgba(212, 168, 67, 0.1)' }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(28px, 4vw, 40px)', lineHeight: 1.3 }}>
              Your next move: {tinyStep}
            </div>
          </div>
        ) : null}
        <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
          <PrimaryButton
            accent={ACCENT}
            disabled={!miracle.trim() || !tinyStep.trim()}
            onClick={() => {
              appendToStorage('aiforj_miracle_question', {
                miracle,
                tinyStep,
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
