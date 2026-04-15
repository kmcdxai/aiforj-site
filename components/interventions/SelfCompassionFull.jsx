"use client";

import { useEffect, useState } from 'react';
import { InterventionShell, PrimaryButton, SecondaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#C47A8A';
const PHRASES = ['May I be safe.', 'May I be healthy.', 'May I live with ease.'];

export default function SelfCompassionFull({ onComplete }) {
  const [step, setStep] = useState(1);
  const [struggle, setStruggle] = useState('');
  const [whoElse, setWhoElse] = useState('');
  const [whatSay, setWhatSay] = useState('');
  const [sameThing, setSameThing] = useState('');
  const [customWish, setCustomWish] = useState('');
  const [touchSeconds, setTouchSeconds] = useState(30);

  useEffect(() => {
    if (step !== 3 || touchSeconds <= 0) return undefined;
    const timer = window.setTimeout(() => setTouchSeconds((seconds) => seconds - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [step, touchSeconds]);

  return (
    <InterventionShell maxWidth={760}>
      <div style={shellStyles.card}>
        <StepDots currentStep={step} totalSteps={4} accent={ACCENT} label="Full Self-Compassion Protocol" />

        {step === 1 ? (
          <>
            <h2 style={shellStyles.heading}>Describe what you are struggling with right now.</h2>
            <textarea value={struggle} onChange={(event) => setStruggle(event.target.value)} style={{ ...shellStyles.textarea, marginTop: 24 }} />
            <p style={{ ...shellStyles.body, marginTop: 16 }}>
              Read it back softly. You are not drowning in it and you are not pushing it away. You are acknowledging that this is hard.
            </p>
            <div style={shellStyles.buttonRow}>
              <PrimaryButton accent={ACCENT} disabled={!struggle.trim()} onClick={() => setStep(2)}>Common humanity</PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <h2 style={shellStyles.heading}>Who else in the world might be feeling something like this?</h2>
            <input value={whoElse} onChange={(event) => setWhoElse(event.target.value)} style={{ ...shellStyles.textInput, marginTop: 24 }} />
            <textarea
              value={whatSay}
              onChange={(event) => setWhatSay(event.target.value)}
              placeholder="What would you say to them?"
              style={{ ...shellStyles.textarea, marginTop: 16, minHeight: 120 }}
            />
            <textarea
              value={sameThing}
              onChange={(event) => setSameThing(event.target.value)}
              placeholder="Can you say the same thing to yourself?"
              style={{ ...shellStyles.textarea, marginTop: 16, minHeight: 120 }}
            />
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(1)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} disabled={!whoElse.trim() || !whatSay.trim() || !sameThing.trim()} onClick={() => setStep(3)}>
                Compassionate touch
              </PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <h2 style={shellStyles.heading}>Place your hand on your heart.</h2>
            <div
              style={{
                marginTop: 22,
                padding: '32px 20px',
                borderRadius: 28,
                textAlign: 'center',
                background: 'linear-gradient(180deg, rgba(196, 122, 138, 0.12), rgba(250, 246, 240, 0.96))',
              }}
            >
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 56, color: ACCENT }}>{touchSeconds}</div>
              <p style={{ ...shellStyles.body, marginTop: 8 }}>
                Feel the warmth. This simple gesture activates the caregiving system you use when comforting someone you love.
              </p>
            </div>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton
                onClick={() => {
                  setTouchSeconds(30);
                  setStep(2);
                }}
              >
                Back
              </SecondaryButton>
              <PrimaryButton accent={ACCENT} disabled={touchSeconds > 0} onClick={() => setStep(4)}>
                Loving-kindness
              </PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 4 ? (
          <>
            <h2 style={shellStyles.heading}>Offer yourself the phrases slowly.</h2>
            <div style={{ display: 'grid', gap: 12, marginTop: 24 }}>
              {PHRASES.map((phrase) => (
                <div key={phrase} style={{ ...shellStyles.card, padding: '18px 18px', background: 'rgba(196, 122, 138, 0.06)' }}>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 28, lineHeight: 1.35 }}>{phrase}</div>
                </div>
              ))}
            </div>
            <input
              value={customWish}
              onChange={(event) => setCustomWish(event.target.value)}
              placeholder="May I..."
              style={{ ...shellStyles.textInput, marginTop: 18 }}
            />
            <p style={{ ...shellStyles.body, marginTop: 16 }}>
              With practice, this becomes your default response to suffering instead of self-attack.
            </p>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(3)}>Back</SecondaryButton>
              <PrimaryButton
                accent={ACCENT}
                disabled={!customWish.trim()}
                onClick={() => {
                  appendToStorage('aiforj_self_compassion_full', {
                    struggle,
                    whoElse,
                    whatSay,
                    sameThing,
                    customWish,
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
