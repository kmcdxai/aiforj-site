"use client";

import { useState } from 'react';
import { InterventionShell, PrimaryButton, SecondaryButton, StepDots, appendToStorage, copyText, shellStyles } from './shared';

const ACCENT = '#C47A8A';
const PROMPTS = [
  'What would they say about what happened?',
  'How would they remind you that one mistake does not define you?',
  'What context would they point out that shame is ignoring?',
  'How would they end the letter?',
];

export default function CompassionateLetter({ onComplete }) {
  const [step, setStep] = useState(1);
  const [topic, setTopic] = useState('');
  const [letter, setLetter] = useState('');
  const [copied, setCopied] = useState(false);

  return (
    <InterventionShell maxWidth={780}>
      <div style={shellStyles.card}>
        <StepDots currentStep={step} totalSteps={3} accent={ACCENT} label="Compassion-Focused Letter" />

        {step === 1 ? (
          <>
            <h2 style={shellStyles.heading}>Briefly, what are you ashamed of?</h2>
            <textarea
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="Keep it honest. This stays private."
              style={{ ...shellStyles.textarea, marginTop: 24 }}
            />
            <div style={shellStyles.buttonRow}>
              <PrimaryButton accent={ACCENT} disabled={!topic.trim()} onClick={() => setStep(2)}>
                Write from compassion
              </PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <h2 style={shellStyles.heading}>Now imagine someone who loves you unconditionally writing to you.</h2>
            <div style={{ display: 'grid', gap: 10, marginTop: 20 }}>
              {PROMPTS.map((prompt) => (
                <div key={prompt} style={{ ...shellStyles.statCard, background: 'rgba(196, 122, 138, 0.06)' }}>
                  {prompt}
                </div>
              ))}
            </div>
            <textarea
              value={letter}
              onChange={(event) => setLetter(event.target.value)}
              placeholder="Dear me..."
              style={{ ...shellStyles.textarea, marginTop: 20, minHeight: 240 }}
            />
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(1)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} disabled={!letter.trim()} onClick={() => setStep(3)}>
                Read the letter
              </PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <h2 style={shellStyles.heading}>Read this back in a softer voice.</h2>
            <div
              style={{
                marginTop: 24,
                padding: '28px 24px',
                borderRadius: 28,
                border: '1px solid rgba(196, 122, 138, 0.18)',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.94), rgba(250, 246, 240, 1))',
                boxShadow: '0 18px 40px rgba(196, 122, 138, 0.10)',
              }}
            >
              <div style={{ fontSize: 13, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Compassionate perspective</div>
              <div
                style={{
                  marginTop: 14,
                  fontFamily: "'Caveat', 'Brush Script MT', cursive",
                  fontSize: 28,
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                  color: '#5E4652',
                }}
              >
                {letter}
              </div>
            </div>
            <p style={{ ...shellStyles.body, marginTop: 18 }}>
              This voice is not fake. It is the part of you that can see clearly when shame is not running the show.
            </p>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton
                onClick={async () => {
                  const ok = await copyText(letter);
                  setCopied(ok);
                }}
              >
                {copied ? 'Copied' : 'Copy'}
              </SecondaryButton>
              <PrimaryButton
                accent={ACCENT}
                onClick={() => {
                  appendToStorage('aiforj_compassionate_letter', {
                    topic,
                    letter,
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
