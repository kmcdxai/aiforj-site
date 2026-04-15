"use client";

import { useMemo, useState } from 'react';
import { ChoiceCard, InterventionShell, PrimaryButton, SecondaryButton, StepDots, setStorage, shellStyles } from './shared';

const ACCENT = '#C4856C';
const OPTIONS = ['A person', 'A place', 'A memory', 'An object', 'A pet'];

export default function SafetyAnchor({ onComplete }) {
  const [step, setStep] = useState(1);
  const [type, setType] = useState('');
  const [details, setDetails] = useState('');
  const [breath, setBreath] = useState(0);

  const summary = useMemo(() => `${type}: ${details}`, [details, type]);

  return (
    <InterventionShell center maxWidth={720}>
      <div style={{ ...shellStyles.card, textAlign: 'center' }}>
        <StepDots currentStep={step} totalSteps={3} accent={ACCENT} label="Safety Anchor" />
        {step === 1 ? (
          <>
            <h2 style={shellStyles.heading}>Identify one thing that represents safety right now.</h2>
            <div style={{ display: 'grid', gap: 10, marginTop: 24 }}>
              {OPTIONS.map((item) => (
                <ChoiceCard key={item} selected={type === item} accent={ACCENT} onClick={() => setType(item)}>
                  {item}
                </ChoiceCard>
              ))}
            </div>
            <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
              <PrimaryButton accent={ACCENT} disabled={!type} onClick={() => setStep(2)}>Describe it</PrimaryButton>
            </div>
          </>
        ) : null}
        {step === 2 ? (
          <>
            <h2 style={shellStyles.heading}>What makes it safe?</h2>
            <textarea value={details} onChange={(event) => setDetails(event.target.value)} style={{ ...shellStyles.textarea, marginTop: 24 }} />
            <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
              <SecondaryButton onClick={() => setStep(1)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} disabled={!details.trim()} onClick={() => setStep(3)}>Take 3 breaths</PrimaryButton>
            </div>
          </>
        ) : null}
        {step === 3 ? (
          <>
            <h2 style={shellStyles.heading}>Hold your safety anchor in mind.</h2>
            <div style={{ ...shellStyles.card, marginTop: 24, background: 'rgba(196, 133, 108, 0.08)' }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 30 }}>{summary}</div>
              <p style={{ ...shellStyles.body, marginTop: 12 }}>Take three slow breaths while you keep this anchor in mind.</p>
            </div>
            <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
              <SecondaryButton onClick={() => setBreath((value) => Math.min(3, value + 1))}>Count a breath</SecondaryButton>
              <PrimaryButton
                accent={ACCENT}
                disabled={breath < 3}
                onClick={() => {
                  setStorage('aiforj_safety_anchor', { type, details, createdAt: new Date().toISOString() });
                  onComplete();
                }}
              >
                Save anchor
              </PrimaryButton>
            </div>
          </>
        ) : null}
      </div>
    </InterventionShell>
  );
}
