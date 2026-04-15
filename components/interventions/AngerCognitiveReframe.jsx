"use client";

import { useMemo, useState } from 'react';
import {
  ANGER_ACCENT,
  ChoiceCard,
  InterventionShell,
  PrimaryButton,
  SecondaryButton,
  StepDots,
  appendToStorage,
  shellStyles,
} from './shared';

const DISTORTIONS = [
  { id: 'mind-reading', name: 'Mind Reading', example: 'They did this on purpose to upset me.' },
  { id: 'should-statements', name: 'Should Statements', example: 'They should have known better.' },
  { id: 'labeling', name: 'Labeling', example: 'They are an idiot.' },
  { id: 'personalization', name: 'Personalization', example: 'This was aimed directly at me.' },
  { id: 'magnification', name: 'Magnification', example: 'This is the worst thing that could happen.' },
  { id: 'emotional-reasoning', name: 'Emotional Reasoning', example: 'I feel furious, so they must be wrong.' },
  { id: 'overgeneralization', name: 'Overgeneralization', example: 'They always do this. They never listen.' },
  { id: 'fortune-telling', name: 'Fortune Telling', example: 'They will never change.' },
];

export default function AngerCognitiveReframe({ onComplete }) {
  const [step, setStep] = useState(1);
  const [thought, setThought] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [reframe, setReframe] = useState('');
  const selectedDistortions = useMemo(
    () => DISTORTIONS.filter((item) => selectedIds.includes(item.id)),
    [selectedIds]
  );

  const toggle = (id) => {
    setSelectedIds((current) => (
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    ));
  };

  const saveReframe = () => {
    appendToStorage('aiforj_anger_reframes', {
      thought,
      distortions: selectedDistortions.map((item) => item.name),
      reframe,
      createdAt: new Date().toISOString(),
    });
    onComplete();
  };

  return (
    <InterventionShell maxWidth={680}>
      <div style={shellStyles.card}>
        <StepDots currentStep={step} totalSteps={3} accent={ANGER_ACCENT} label="CBT for Anger" />

        {step === 1 ? (
          <>
            <div style={shellStyles.eyebrow}>Fueling thought</div>
            <h2 style={shellStyles.heading}>What thought is feeding the anger?</h2>
            <p style={{ ...shellStyles.body, marginTop: 12 }}>
              Capture it exactly. The goal is not to make it prettier. The goal is to make it visible.
            </p>
            <textarea
              value={thought}
              onChange={(event) => setThought(event.target.value)}
              placeholder="Write the raw angry thought."
              style={{ ...shellStyles.textarea, marginTop: 22 }}
            />
            <div style={shellStyles.buttonRow}>
              <PrimaryButton onClick={() => setStep(2)} disabled={!thought.trim()}>Next</PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <div style={shellStyles.eyebrow}>Thinking traps</div>
            <h2 style={shellStyles.heading}>Which anger distortions are showing up?</h2>
            <p style={{ ...shellStyles.body, marginTop: 12 }}>
              Select every card that fits. Anger is often sharp, certain, and incomplete.
            </p>
            <div style={{ display: 'grid', gap: 12, marginTop: 22 }}>
              {DISTORTIONS.map((distortion) => {
                const selected = selectedIds.includes(distortion.id);
                return (
                  <ChoiceCard key={distortion.id} selected={selected} onClick={() => toggle(distortion.id)}>
                    <strong style={{ display: 'block', fontSize: 16, marginBottom: 6 }}>{distortion.name}</strong>
                    <p style={{ ...shellStyles.body, fontSize: 14 }}>{distortion.example}</p>
                  </ChoiceCard>
                );
              })}
            </div>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(1)}>Back</SecondaryButton>
              <PrimaryButton onClick={() => setStep(3)} disabled={!selectedIds.length}>Next</PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <div style={shellStyles.eyebrow}>Balanced view</div>
            <h2 style={shellStyles.heading}>What might be true that the anger is blocking you from seeing?</h2>
            <p style={{ ...shellStyles.body, marginTop: 12 }}>
              Try one of these prompts: Could there be another explanation? What would a neutral observer see? Am I confusing unfair with not what I wanted?
            </p>
            <textarea
              value={reframe}
              onChange={(event) => setReframe(event.target.value)}
              placeholder="Write the balanced reframe."
              style={{ ...shellStyles.textarea, marginTop: 22 }}
            />
            <div style={{ display: 'grid', gap: 14, marginTop: 22, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              <div style={shellStyles.statCard}>
                <strong style={{ display: 'block', marginBottom: 8 }}>Angry thought</strong>
                <p style={{ ...shellStyles.body, fontSize: 14 }}>{thought}</p>
              </div>
              <div style={shellStyles.statCard}>
                <strong style={{ display: 'block', marginBottom: 8 }}>Distortions</strong>
                <p style={{ ...shellStyles.body, fontSize: 14 }}>{selectedDistortions.map((item) => item.name).join(', ')}</p>
              </div>
            </div>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(2)}>Back</SecondaryButton>
              <PrimaryButton onClick={saveReframe} disabled={!reframe.trim()}>Finish reframe</PrimaryButton>
            </div>
          </>
        ) : null}
      </div>
    </InterventionShell>
  );
}
