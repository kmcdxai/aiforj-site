"use client";

import { useState } from 'react';
import { ChoiceCard, InterventionShell, PrimaryButton, SecondaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#6B98B8';
const DISTORTIONS = [
  'Overgeneralization: Nobody cares about me',
  "Mind Reading: They're just being polite",
  "Labeling: I'm too weird or boring for anyone",
  "Fortune Telling: It'll always be like this",
  "Disqualifying Positives: That text doesn't count",
];

export default function LonelinessThoughtCheck({ onComplete }) {
  const [step, setStep] = useState(1);
  const [thought, setThought] = useState('');
  const [distortion, setDistortion] = useState('');
  const [evidence, setEvidence] = useState('');
  const [reframe, setReframe] = useState('');

  return (
    <InterventionShell maxWidth={760}>
      <div style={shellStyles.card}>
        <StepDots currentStep={step} totalSteps={4} accent={ACCENT} label="Loneliness Thought Check" />
        {step === 1 ? (
          <>
            <h2 style={shellStyles.heading}>What thought is loneliness telling you?</h2>
            <textarea value={thought} onChange={(event) => setThought(event.target.value)} style={{ ...shellStyles.textarea, marginTop: 24 }} />
            <div style={shellStyles.buttonRow}>
              <PrimaryButton accent={ACCENT} disabled={!thought.trim()} onClick={() => setStep(2)}>Name the distortion</PrimaryButton>
            </div>
          </>
        ) : null}
        {step === 2 ? (
          <>
            <h2 style={shellStyles.heading}>Which distortion fits best?</h2>
            <div style={{ display: 'grid', gap: 10, marginTop: 24 }}>
              {DISTORTIONS.map((item) => (
                <ChoiceCard key={item} selected={distortion === item} accent={ACCENT} onClick={() => setDistortion(item)}>
                  {item}
                </ChoiceCard>
              ))}
            </div>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(1)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} disabled={!distortion} onClick={() => setStep(3)}>Check the evidence</PrimaryButton>
            </div>
          </>
        ) : null}
        {step === 3 ? (
          <>
            <h2 style={shellStyles.heading}>Is this thought 100% true? What contradicts it?</h2>
            <textarea value={evidence} onChange={(event) => setEvidence(event.target.value)} style={{ ...shellStyles.textarea, marginTop: 24 }} />
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(2)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} disabled={!evidence.trim()} onClick={() => setStep(4)}>Reframe</PrimaryButton>
            </div>
          </>
        ) : null}
        {step === 4 ? (
          <>
            <h2 style={shellStyles.heading}>What is a fairer, more accurate thought?</h2>
            <textarea value={reframe} onChange={(event) => setReframe(event.target.value)} style={{ ...shellStyles.textarea, marginTop: 24 }} />
            <div style={{ ...shellStyles.card, marginTop: 18, background: 'rgba(107, 152, 184, 0.08)' }}>
              <strong style={{ display: 'block', marginBottom: 10 }}>From thought to reframe</strong>
              <p style={{ ...shellStyles.body, margin: 0 }}><strong>{thought || 'Original thought'}</strong></p>
              <p style={{ ...shellStyles.body, marginTop: 10 }}>{reframe || 'Your reframe will appear here.'}</p>
            </div>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(3)}>Back</SecondaryButton>
              <PrimaryButton
                accent={ACCENT}
                disabled={!reframe.trim()}
                onClick={() => {
                  appendToStorage('aiforj_loneliness_thought_check', {
                    thought,
                    distortion,
                    evidence,
                    reframe,
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
