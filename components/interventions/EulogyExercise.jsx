"use client";

import { useState } from 'react';
import { InterventionShell, PrimaryButton, SecondaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#D4A843';

export default function EulogyExercise({ onComplete }) {
  const [step, setStep] = useState(1);
  const [eulogy, setEulogy] = useState('');
  const [alreadyTrue, setAlreadyTrue] = useState('');
  const [notYetTrue, setNotYetTrue] = useState('');
  const [firstStep, setFirstStep] = useState('');

  return (
    <InterventionShell maxWidth={820}>
      <div style={shellStyles.card}>
        <StepDots currentStep={step} totalSteps={4} accent={ACCENT} label="Eulogy Exercise" />
        {step === 1 ? (
          <>
            <h2 style={shellStyles.heading}>Write your ideal eulogy.</h2>
            <textarea value={eulogy} onChange={(event) => setEulogy(event.target.value)} style={{ ...shellStyles.textarea, marginTop: 24, minHeight: 260 }} />
            <div style={shellStyles.buttonRow}>
              <PrimaryButton accent={ACCENT} disabled={!eulogy.trim()} onClick={() => setStep(2)}>What is already true?</PrimaryButton>
            </div>
          </>
        ) : null}
        {step === 2 ? (
          <>
            <h2 style={shellStyles.heading}>What parts are already true?</h2>
            <textarea value={alreadyTrue} onChange={(event) => setAlreadyTrue(event.target.value)} style={{ ...shellStyles.textarea, marginTop: 24 }} />
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(1)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} disabled={!alreadyTrue.trim()} onClick={() => setStep(3)}>What is not yet true?</PrimaryButton>
            </div>
          </>
        ) : null}
        {step === 3 ? (
          <>
            <h2 style={shellStyles.heading}>What is not yet true?</h2>
            <textarea value={notYetTrue} onChange={(event) => setNotYetTrue(event.target.value)} style={{ ...shellStyles.textarea, marginTop: 24 }} />
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(2)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} disabled={!notYetTrue.trim()} onClick={() => setStep(4)}>Pick the first step</PrimaryButton>
            </div>
          </>
        ) : null}
        {step === 4 ? (
          <>
            <h2 style={shellStyles.heading}>Pick one not-yet-true item. What is the first step?</h2>
            <input value={firstStep} onChange={(event) => setFirstStep(event.target.value)} style={{ ...shellStyles.textInput, marginTop: 24 }} />
            <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(212, 168, 67, 0.08)' }}>
              <p style={{ ...shellStyles.body, margin: 0 }}>The gap between your eulogy and your life is not a verdict. It is a roadmap.</p>
            </div>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(3)}>Back</SecondaryButton>
              <PrimaryButton
                accent={ACCENT}
                disabled={!firstStep.trim()}
                onClick={() => {
                  appendToStorage('aiforj_eulogy_exercise', {
                    eulogy,
                    alreadyTrue,
                    notYetTrue,
                    firstStep,
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
