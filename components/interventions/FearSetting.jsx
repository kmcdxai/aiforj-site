"use client";

import { useState } from 'react';
import { InterventionShell, PrimaryButton, SecondaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#D4A843';

export default function FearSetting({ onComplete }) {
  const [step, setStep] = useState(1);
  const [define, setDefine] = useState('');
  const [prevent, setPrevent] = useState('');
  const [repair, setRepair] = useState('');
  const [benefits, setBenefits] = useState('');
  const [sixMonths, setSixMonths] = useState('');
  const [oneYear, setOneYear] = useState('');
  const [threeYears, setThreeYears] = useState('');

  return (
    <InterventionShell maxWidth={860}>
      <div style={shellStyles.card}>
        <StepDots currentStep={step} totalSteps={3} accent={ACCENT} label="Fear-Setting" />
        {step === 1 ? (
          <>
            <h2 style={shellStyles.heading}>Define the worst that could happen.</h2>
            <textarea value={define} onChange={(event) => setDefine(event.target.value)} placeholder="Worst-case scenario" style={{ ...shellStyles.textarea, marginTop: 24 }} />
            <textarea value={prevent} onChange={(event) => setPrevent(event.target.value)} placeholder="What could you do to prevent it?" style={{ ...shellStyles.textarea, marginTop: 14 }} />
            <textarea value={repair} onChange={(event) => setRepair(event.target.value)} placeholder="If it happened, how could you repair it?" style={{ ...shellStyles.textarea, marginTop: 14 }} />
            <div style={shellStyles.buttonRow}>
              <PrimaryButton accent={ACCENT} disabled={!define.trim() || !prevent.trim() || !repair.trim()} onClick={() => setStep(2)}>Benefits of action</PrimaryButton>
            </div>
          </>
        ) : null}
        {step === 2 ? (
          <>
            <h2 style={shellStyles.heading}>What might be the benefits of success, even partial?</h2>
            <textarea value={benefits} onChange={(event) => setBenefits(event.target.value)} style={{ ...shellStyles.textarea, marginTop: 24 }} />
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(1)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} disabled={!benefits.trim()} onClick={() => setStep(3)}>Cost of inaction</PrimaryButton>
            </div>
          </>
        ) : null}
        {step === 3 ? (
          <>
            <h2 style={shellStyles.heading}>What does life look like if you do nothing?</h2>
            <textarea value={sixMonths} onChange={(event) => setSixMonths(event.target.value)} placeholder="In 6 months..." style={{ ...shellStyles.textarea, marginTop: 24, minHeight: 110 }} />
            <textarea value={oneYear} onChange={(event) => setOneYear(event.target.value)} placeholder="In 1 year..." style={{ ...shellStyles.textarea, marginTop: 14, minHeight: 110 }} />
            <textarea value={threeYears} onChange={(event) => setThreeYears(event.target.value)} placeholder="In 3 years..." style={{ ...shellStyles.textarea, marginTop: 14, minHeight: 110 }} />
            <div style={{ ...shellStyles.card, marginTop: 18, background: 'rgba(212, 168, 67, 0.08)' }}>
              <p style={{ ...shellStyles.body, margin: 0 }}>Worst case is often mitigatable. The cost of inaction compounds quietly.</p>
            </div>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(2)}>Back</SecondaryButton>
              <PrimaryButton
                accent={ACCENT}
                disabled={!sixMonths.trim() || !oneYear.trim() || !threeYears.trim()}
                onClick={() => {
                  appendToStorage('aiforj_fear_setting', {
                    define,
                    prevent,
                    repair,
                    benefits,
                    sixMonths,
                    oneYear,
                    threeYears,
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
