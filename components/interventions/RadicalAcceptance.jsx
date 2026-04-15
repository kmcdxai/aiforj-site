"use client";

import { useState } from 'react';
import { InterventionShell, PrimaryButton, SecondaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#9B8EC4';

export default function RadicalAcceptance({ onComplete }) {
  const [step, setStep] = useState(1);
  const [reality, setReality] = useState('');
  const [canDo, setCanDo] = useState('');
  const statement = `I accept that ${reality || '[reality]'} is true right now, even though I wish it weren't.`;

  return (
    <InterventionShell maxWidth={680}>
      <div style={shellStyles.card}>
        <StepDots currentStep={step} totalSteps={4} accent={ACCENT} label="DBT Radical Acceptance" />
        {step === 1 ? (
          <>
            <h2 style={shellStyles.heading}>What reality are you resisting right now?</h2>
            <textarea value={reality} onChange={(event) => setReality(event.target.value)} style={{ ...shellStyles.textarea, marginTop: 22 }} />
            <div style={shellStyles.buttonRow}>
              <PrimaryButton accent={ACCENT} disabled={!reality.trim()} onClick={() => setStep(2)}>Next</PrimaryButton>
            </div>
          </>
        ) : null}
        {step === 2 ? (
          <>
            <h2 style={shellStyles.heading}>Turn toward it.</h2>
            <div style={{ ...shellStyles.card, marginTop: 22, background: 'rgba(155, 142, 196, 0.08)' }}>
              <p style={{ ...shellStyles.body, margin: 0 }}>{statement}</p>
            </div>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(1)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} onClick={() => setStep(3)}>I can say that</PrimaryButton>
            </div>
          </>
        ) : null}
        {step === 3 ? (
          <>
            <h2 style={shellStyles.heading}>Acceptance is not approval.</h2>
            <div style={{ display: 'grid', gap: 12, marginTop: 20 }}>
              {[
                'I acknowledge this is real.',
                "I stop spending energy fighting what can't be unfought.",
                'I redirect that energy toward what I can do.',
              ].map((item) => <div key={item} style={shellStyles.statCard}>{item}</div>)}
            </div>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(2)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} onClick={() => setStep(4)}>Next</PrimaryButton>
            </div>
          </>
        ) : null}
        {step === 4 ? (
          <>
            <h2 style={shellStyles.heading}>Given this reality, what can you do?</h2>
            <textarea value={canDo} onChange={(event) => setCanDo(event.target.value)} style={{ ...shellStyles.textarea, marginTop: 22 }} />
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(3)}>Back</SecondaryButton>
              <PrimaryButton
                accent={ACCENT}
                disabled={!canDo.trim()}
                onClick={() => {
                  appendToStorage('aiforj_radical_acceptance', { reality, statement, canDo, createdAt: new Date().toISOString() });
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
