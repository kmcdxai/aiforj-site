"use client";

import { useState } from 'react';
import { InterventionShell, PrimaryButton, SecondaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#9B8EC4';

export default function MeaningReconstruction({ onComplete }) {
  const [step, setStep] = useState(1);
  const [eventStory, setEventStory] = useState('');
  const [backStory, setBackStory] = useState('');
  const [forwardStory, setForwardStory] = useState('');

  return (
    <InterventionShell maxWidth={820}>
      <div style={shellStyles.card}>
        <StepDots currentStep={step} totalSteps={4} accent={ACCENT} label="Meaning Reconstruction" />
        {step === 1 ? (
          <>
            <h2 style={shellStyles.heading}>What happened?</h2>
            <textarea value={eventStory} onChange={(event) => setEventStory(event.target.value)} style={{ ...shellStyles.textarea, marginTop: 24 }} />
            <div style={shellStyles.buttonRow}>
              <PrimaryButton accent={ACCENT} disabled={!eventStory.trim()} onClick={() => setStep(2)}>Relationship story</PrimaryButton>
            </div>
          </>
        ) : null}
        {step === 2 ? (
          <>
            <h2 style={shellStyles.heading}>What did this person or relationship mean to you?</h2>
            <textarea value={backStory} onChange={(event) => setBackStory(event.target.value)} style={{ ...shellStyles.textarea, marginTop: 24 }} />
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(1)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} disabled={!backStory.trim()} onClick={() => setStep(3)}>Going forward</PrimaryButton>
            </div>
          </>
        ) : null}
        {step === 3 ? (
          <>
            <h2 style={shellStyles.heading}>How do you carry what this relationship taught you into the future?</h2>
            <textarea value={forwardStory} onChange={(event) => setForwardStory(event.target.value)} style={{ ...shellStyles.textarea, marginTop: 24 }} />
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(2)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} disabled={!forwardStory.trim()} onClick={() => setStep(4)}>See the whole story</PrimaryButton>
            </div>
          </>
        ) : null}
        {step === 4 ? (
          <>
            <h2 style={shellStyles.heading}>Your three-part narrative</h2>
            <div style={{ display: 'grid', gap: 14, marginTop: 24 }}>
              {[
                ['Event Story', eventStory],
                ['Back Story', backStory],
                ['Going Forward', forwardStory],
              ].map(([label, text]) => (
                <div key={label} style={{ ...shellStyles.card, padding: '18px 18px', background: 'var(--surface)' }}>
                  <strong>{label}</strong>
                  <p style={{ ...shellStyles.body, marginTop: 10 }}>{text}</p>
                </div>
              ))}
            </div>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(3)}>Back</SecondaryButton>
              <PrimaryButton
                accent={ACCENT}
                onClick={() => {
                  appendToStorage('aiforj_meaning_reconstruction', {
                    eventStory,
                    backStory,
                    forwardStory,
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
