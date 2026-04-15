"use client";

import { useMemo, useState } from 'react';
import { InterventionShell, PrimaryButton, SecondaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#6B98B8';
const CHALLENGES = [
  "Text someone: 'thinking of you'",
  "Leave a genuine compliment on someone's post",
  'Make eye contact and smile at the next person you see',
  "Send a meme to someone who'd find it funny",
  "Reply to someone's story with something real",
  "Voice-memo a friend: 'Hey, just wanted to say hi'",
];

export default function MicroConnection({ onComplete }) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [fallback, setFallback] = useState(['', '', '']);
  const challenge = useMemo(() => CHALLENGES[index % CHALLENGES.length], [index]);

  if (done) {
    return (
      <InterventionShell center maxWidth={720}>
        <div style={{ ...shellStyles.card, textAlign: 'center' }}>
          <StepDots currentStep={2} totalSteps={2} accent={ACCENT} label="Micro-Connection Challenge" />
          <h2 style={shellStyles.heading}>You just broke isolation.</h2>
          <p style={{ ...shellStyles.body, marginTop: 14 }}>That took courage. One tiny thread of connection counts.</p>
          {fallback.some(Boolean) ? (
            <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(107, 152, 184, 0.08)' }}>
              <strong style={{ display: 'block', marginBottom: 10 }}>People who would answer</strong>
              <ul style={{ margin: '0 0 0 18px', lineHeight: 1.8 }}>
                {fallback.filter(Boolean).map((person) => <li key={person}>{person}</li>)}
              </ul>
            </div>
          ) : null}
          <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
            <PrimaryButton accent={ACCENT} onClick={onComplete}>Finish</PrimaryButton>
          </div>
        </div>
      </InterventionShell>
    );
  }

  return (
    <InterventionShell center maxWidth={720}>
      <div style={{ ...shellStyles.card, textAlign: 'center' }}>
        <StepDots currentStep={1} totalSteps={2} accent={ACCENT} label="Behavioral Social Tool" />
        <h2 style={shellStyles.heading}>One tiny thread of connection. That&apos;s all.</h2>
        <div
          style={{
            marginTop: 24,
            padding: '36px 24px',
            borderRadius: 28,
            background: 'linear-gradient(180deg, rgba(107, 152, 184, 0.12), rgba(250, 246, 240, 0.96))',
          }}
        >
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(28px, 4vw, 38px)', lineHeight: 1.3 }}>
            {challenge}
          </div>
        </div>
        <p style={{ ...shellStyles.body, marginTop: 18 }}>
          Not ready for people? Write down three people who would answer if you called.
        </p>
        <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          {fallback.map((value, index) => (
            <input
              key={index}
              value={value}
              onChange={(event) => {
                const next = [...fallback];
                next[index] = event.target.value;
                setFallback(next);
              }}
              placeholder={`Person ${index + 1}`}
              style={shellStyles.textInput}
            />
          ))}
        </div>
        <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
          <SecondaryButton onClick={() => setIndex((value) => value + 1)}>Another challenge</SecondaryButton>
          <PrimaryButton
            accent={ACCENT}
            onClick={() => {
              appendToStorage('aiforj_micro_connection', {
                challenge,
                fallback: fallback.filter(Boolean),
                createdAt: new Date().toISOString(),
              });
              setDone(true);
            }}
          >
            Tap when done
          </PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
