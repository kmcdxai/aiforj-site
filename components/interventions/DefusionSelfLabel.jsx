"use client";

import { useMemo, useState } from 'react';
import { InterventionShell, PrimaryButton, SecondaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#C47A8A';

export default function DefusionSelfLabel({ onComplete }) {
  const [statement, setStatement] = useState('');
  const [step, setStep] = useState(1);

  const transformed = useMemo(() => ([
    statement.trim(),
    `I'm having the thought that ${statement.trim()}`,
    `I notice my mind is telling me the story that ${statement.trim()}`,
  ]), [statement]);

  const sizes = [46, 34, 24];
  const opacities = [1, 0.78, 0.56];
  const currentIndex = step - 2;

  return (
    <InterventionShell center maxWidth={760}>
      <div style={{ ...shellStyles.card, textAlign: 'center' }}>
        <StepDots currentStep={step} totalSteps={5} accent={ACCENT} label="ACT Defusion" />

        {step === 1 ? (
          <>
            <h2 style={shellStyles.heading}>What shame statement is your mind saying?</h2>
            <input
              value={statement}
              onChange={(event) => setStatement(event.target.value)}
              placeholder="I'm worthless. I'm a failure. I'm broken."
              style={{ ...shellStyles.textInput, marginTop: 24, textAlign: 'center' }}
            />
            <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
              <PrimaryButton accent={ACCENT} disabled={!statement.trim()} onClick={() => setStep(2)}>
                Start defusing
              </PrimaryButton>
            </div>
          </>
        ) : null}

        {step >= 2 && step <= 4 ? (
          <>
            <h2 style={shellStyles.heading}>Notice the distance changing.</h2>
            <div
              style={{
                minHeight: 210,
                marginTop: 24,
                display: 'grid',
                placeItems: 'center',
                padding: '32px 20px',
                borderRadius: 28,
                background: 'linear-gradient(180deg, rgba(196, 122, 138, 0.12), rgba(250, 246, 240, 0.9))',
              }}
            >
              <div
                style={{
                  maxWidth: 520,
                  fontFamily: "'Fraunces', serif",
                  fontSize: `clamp(24px, 5vw, ${sizes[currentIndex]}px)`,
                  lineHeight: 1.2,
                  color: 'var(--text-primary)',
                  opacity: opacities[currentIndex],
                  transform: `translateY(${currentIndex * -8}px) scale(${1 - currentIndex * 0.08})`,
                  transition: 'all 220ms ease',
                }}
              >
                {transformed[currentIndex]}
              </div>
            </div>
            <p style={{ ...shellStyles.body, marginTop: 18 }}>
              The thought did not disappear. But it moved from being <strong style={{ color: 'var(--text-primary)' }}>you</strong> to being
              something your mind said.
            </p>
            <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
              <SecondaryButton onClick={() => setStep(Math.max(1, step - 1))}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} onClick={() => setStep(step === 4 ? 5 : step + 1)}>
                {step === 4 ? 'See the shift' : 'Next layer'}
              </PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 5 ? (
          <>
            <h2 style={shellStyles.heading}>You created psychological distance.</h2>
            <p style={{ ...shellStyles.body, marginTop: 18 }}>
              Shame wants the thought to feel like an identity. Defusion turns it back into language your mind produced.
            </p>
            <div style={{ ...shellStyles.card, marginTop: 22, background: 'rgba(196, 122, 138, 0.08)' }}>
              <div style={{ fontSize: 14, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Rewritten distance</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 28, lineHeight: 1.25, marginTop: 10 }}>
                {transformed[2]}
              </div>
            </div>
            <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
              <PrimaryButton
                accent={ACCENT}
                onClick={() => {
                  appendToStorage('aiforj_defusion_self_label', {
                    statement: statement.trim(),
                    createdAt: new Date().toISOString(),
                  });
                  onComplete();
                }}
              >
                Finish
              </PrimaryButton>
            </div>
          </>
        ) : null}
      </div>
    </InterventionShell>
  );
}
