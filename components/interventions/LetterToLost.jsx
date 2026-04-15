"use client";

import { useState } from 'react';
import { InterventionShell, PrimaryButton, SecondaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#9B8EC4';
const PROMPTS = [
  "Is there something you wish you'd said?",
  'What do you want them to know about your life now?',
  'What question would you ask them?',
];

export default function LetterToLost({ onComplete }) {
  const [name, setName] = useState('');
  const [letter, setLetter] = useState('');
  const [showPrompts, setShowPrompts] = useState(false);

  return (
    <InterventionShell maxWidth={760}>
      <div style={shellStyles.card}>
        <StepDots currentStep={letter.trim() ? 2 : 1} totalSteps={2} accent={ACCENT} label="Letter to the Lost" />
        <h2 style={shellStyles.heading}>Who have you lost?</h2>
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" style={{ ...shellStyles.textInput, marginTop: 24 }} />
        <textarea
          value={letter}
          onChange={(event) => setLetter(event.target.value)}
          placeholder={name ? `Write to ${name}...` : 'Write whatever you need to say.'}
          style={{ ...shellStyles.textarea, marginTop: 16, minHeight: 220 }}
        />
        {showPrompts ? (
          <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
            {PROMPTS.map((prompt) => (
              <div key={prompt} style={{ ...shellStyles.statCard, background: 'rgba(155, 142, 196, 0.06)' }}>{prompt}</div>
            ))}
          </div>
        ) : null}
        <div style={shellStyles.buttonRow}>
          <SecondaryButton onClick={() => setShowPrompts((value) => !value)}>
            {showPrompts ? 'Hide prompts' : 'Show gentle prompts'}
          </SecondaryButton>
          <PrimaryButton
            accent={ACCENT}
            disabled={!name.trim() || !letter.trim()}
            onClick={() => {
              appendToStorage('aiforj_letter_to_lost', {
                name,
                letter,
                createdAt: new Date().toISOString(),
              });
              onComplete();
            }}
          >
            Save letter
          </PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
