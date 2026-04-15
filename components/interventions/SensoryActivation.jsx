"use client";

import { useEffect, useState } from 'react';
import { ChoiceCard, InterventionShell, PrimaryButton, SecondaryButton, StepDots, shellStyles } from './shared';

const ACCENT = '#8A8078';
const OPTIONS = [
  'Hold ice cubes or splash cold water on your face',
  'Eat something with a strong flavor',
  'Smell something strong',
  'Press your palms together hard for 10 seconds',
  'Play a song you love loudly',
];

export default function SensoryActivation({ onComplete }) {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState('');
  const [seconds, setSeconds] = useState(60);
  const [response, setResponse] = useState('');

  useEffect(() => {
    if (step !== 2 || seconds <= 0) return undefined;
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds, step]);

  return (
    <InterventionShell center maxWidth={720}>
      <div style={{ ...shellStyles.card, textAlign: 'center' }}>
        <StepDots currentStep={step} totalSteps={3} accent={ACCENT} label="Sensory Activation" />
        {step === 1 ? (
          <>
            <h2 style={shellStyles.heading}>Pick one activating sensation.</h2>
            <div style={{ display: 'grid', gap: 10, marginTop: 24 }}>
              {OPTIONS.map((item) => (
                <ChoiceCard key={item} selected={selected === item} accent={ACCENT} onClick={() => setSelected(item)}>
                  {item}
                </ChoiceCard>
              ))}
            </div>
            <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
              <PrimaryButton accent={ACCENT} disabled={!selected} onClick={() => setStep(2)}>Start 60 seconds</PrimaryButton>
            </div>
          </>
        ) : null}
        {step === 2 ? (
          <>
            <h2 style={shellStyles.heading}>Do it now. Focus on the sensation.</h2>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 72, color: ACCENT, marginTop: 18 }}>{seconds}</div>
            <p style={{ ...shellStyles.body, marginTop: 10 }}>{selected}</p>
            <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
              <SecondaryButton onClick={() => setStep(1)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} disabled={seconds > 0} onClick={() => setStep(3)}>Check in</PrimaryButton>
            </div>
          </>
        ) : null}
        {step === 3 ? (
          <>
            <h2 style={shellStyles.heading}>Did you feel something, even a flicker?</h2>
            <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
              <SecondaryButton onClick={() => setResponse('not-yet')}>Not yet</SecondaryButton>
              <PrimaryButton accent={ACCENT} onClick={() => setResponse('yes')}>Yes</PrimaryButton>
            </div>
            {response ? (
              <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(138, 128, 120, 0.08)' }}>
                <p style={{ ...shellStyles.body, margin: 0 }}>
                  {response === 'yes'
                    ? 'That flicker matters. It means your nervous system can still wake up.'
                    : 'That is okay. Sometimes numbness needs a few attempts through different senses.'}
                </p>
              </div>
            ) : null}
            <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
              <PrimaryButton accent={ACCENT} disabled={!response} onClick={onComplete}>Finish</PrimaryButton>
            </div>
          </>
        ) : null}
      </div>
    </InterventionShell>
  );
}
