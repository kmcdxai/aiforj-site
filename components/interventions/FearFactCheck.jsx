"use client";

import { useState } from 'react';
import { InterventionShell, PrimaryButton, SecondaryButton, StepDots, appendToStorage, rangeStyle, shellStyles } from './shared';

const ACCENT = '#C4856C';

export default function FearFactCheck({ onComplete }) {
  const [step, setStep] = useState(1);
  const [prediction, setPrediction] = useState('');
  const [probability, setProbability] = useState(70);
  const [past, setPast] = useState('');
  const [friend, setFriend] = useState('');
  const [realistic, setRealistic] = useState('');

  return (
    <InterventionShell maxWidth={760}>
      <div style={shellStyles.card}>
        <StepDots currentStep={step} totalSteps={5} accent={ACCENT} label="Fear Fact-Check" />
        {step === 1 ? (
          <>
            <h2 style={shellStyles.heading}>What are you predicting will happen?</h2>
            <textarea value={prediction} onChange={(event) => setPrediction(event.target.value)} style={{ ...shellStyles.textarea, marginTop: 24 }} />
            <div style={shellStyles.buttonRow}>
              <PrimaryButton accent={ACCENT} disabled={!prediction.trim()} onClick={() => setStep(2)}>Estimate probability</PrimaryButton>
            </div>
          </>
        ) : null}
        {step === 2 ? (
          <>
            <h2 style={shellStyles.heading}>What&apos;s the actual probability?</h2>
            <input type="range" min="0" max="100" value={probability} onChange={(event) => setProbability(Number(event.target.value))} style={{ ...rangeStyle(ACCENT), marginTop: 24 }} />
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 52, color: ACCENT, marginTop: 10 }}>{probability}%</div>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(1)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} onClick={() => setStep(3)}>Look at the evidence</PrimaryButton>
            </div>
          </>
        ) : null}
        {step === 3 ? (
          <>
            <h2 style={shellStyles.heading}>What&apos;s happened in similar situations before?</h2>
            <textarea value={past} onChange={(event) => setPast(event.target.value)} style={{ ...shellStyles.textarea, marginTop: 24 }} />
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(2)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} disabled={!past.trim()} onClick={() => setStep(4)}>Talk to yourself like a friend</PrimaryButton>
            </div>
          </>
        ) : null}
        {step === 4 ? (
          <>
            <h2 style={shellStyles.heading}>What would you tell a friend with this fear?</h2>
            <textarea value={friend} onChange={(event) => setFriend(event.target.value)} style={{ ...shellStyles.textarea, marginTop: 24 }} />
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(3)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} disabled={!friend.trim()} onClick={() => setStep(5)}>Make a realistic prediction</PrimaryButton>
            </div>
          </>
        ) : null}
        {step === 5 ? (
          <>
            <h2 style={shellStyles.heading}>What is a more realistic prediction?</h2>
            <textarea value={realistic} onChange={(event) => setRealistic(event.target.value)} style={{ ...shellStyles.textarea, marginTop: 24 }} />
            <div style={{ ...shellStyles.card, marginTop: 18, background: 'rgba(196, 133, 108, 0.08)' }}>
              <p style={{ ...shellStyles.body, margin: 0 }}>Fear brain: {probability}% | Evidence-based view: {realistic || 'your realistic prediction'}</p>
            </div>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(4)}>Back</SecondaryButton>
              <PrimaryButton
                accent={ACCENT}
                disabled={!realistic.trim()}
                onClick={() => {
                  appendToStorage('aiforj_fear_fact_check', {
                    prediction,
                    probability,
                    past,
                    friend,
                    realistic,
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
