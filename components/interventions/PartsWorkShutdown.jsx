"use client";

import { useState } from 'react';
import { ChoiceCard, InterventionShell, PrimaryButton, SecondaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#8A8078';
const PROTECTORS = ['Pain', 'Rejection', 'Overwhelm', 'Loss of control', 'Being seen', 'Being hurt again', 'Disappointment', 'Custom'];

export default function PartsWorkShutdown({ onComplete }) {
  const [step, setStep] = useState(1);
  const [when, setWhen] = useState('');
  const [protecting, setProtecting] = useState('');
  const [customProtecting, setCustomProtecting] = useState('');
  const [need, setNeed] = useState('');

  const resolvedProtection = protecting === 'Custom' ? customProtecting.trim() : protecting;

  return (
    <InterventionShell maxWidth={760}>
      <div style={shellStyles.card}>
        <StepDots currentStep={step} totalSteps={4} accent={ACCENT} label="Parts Work: Shutdown" />
        {step === 1 ? (
          <>
            <h2 style={shellStyles.heading}>Numbness is often a protector.</h2>
            <p style={{ ...shellStyles.body, marginTop: 14 }}>
              If this starts to feel too intense, it is okay to stop. Ongoing parts work is often best done with a therapist.
            </p>
            <textarea value={when} onChange={(event) => setWhen(event.target.value)} placeholder="When did you first start shutting down?" style={{ ...shellStyles.textarea, marginTop: 18 }} />
            <div style={shellStyles.buttonRow}>
              <PrimaryButton accent={ACCENT} disabled={!when.trim()} onClick={() => setStep(2)}>What was it protecting?</PrimaryButton>
            </div>
          </>
        ) : null}
        {step === 2 ? (
          <>
            <h2 style={shellStyles.heading}>What was that part protecting you from?</h2>
            <div style={{ display: 'grid', gap: 10, marginTop: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
              {PROTECTORS.map((item) => (
                <ChoiceCard key={item} selected={protecting === item} accent={ACCENT} onClick={() => setProtecting(item)}>
                  {item}
                </ChoiceCard>
              ))}
            </div>
            {protecting === 'Custom' ? <input value={customProtecting} onChange={(event) => setCustomProtecting(event.target.value)} placeholder="Custom protector" style={{ ...shellStyles.textInput, marginTop: 14 }} /> : null}
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(1)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} disabled={!resolvedProtection} onClick={() => setStep(3)}>Appreciate the intention</PrimaryButton>
            </div>
          </>
        ) : null}
        {step === 3 ? (
          <>
            <h2 style={shellStyles.heading}>Can you appreciate that this part was trying to help?</h2>
            <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(138, 128, 120, 0.08)' }}>
              <p style={{ ...shellStyles.body, margin: 0 }}>
                Even if shutdown is no longer what you need, the intention was protective. Thank this part for trying to keep you safe.
              </p>
            </div>
            <textarea value={need} onChange={(event) => setNeed(event.target.value)} placeholder="What would you need in order to feel safe enough to feel again?" style={{ ...shellStyles.textarea, marginTop: 18 }} />
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(2)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} disabled={!need.trim()} onClick={() => setStep(4)}>Complete</PrimaryButton>
            </div>
          </>
        ) : null}
        {step === 4 ? (
          <>
            <h2 style={shellStyles.heading}>Try saying this to the protective part.</h2>
            <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(138, 128, 120, 0.08)' }}>
              <p style={{ ...shellStyles.body, margin: 0 }}>
                I am safer now. You do not have to work so hard. I can handle some feeling.
              </p>
            </div>
            <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
              <PrimaryButton
                accent={ACCENT}
                onClick={() => {
                  appendToStorage('aiforj_parts_work_shutdown', {
                    when,
                    protecting: resolvedProtection,
                    need,
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
