"use client";

import { useMemo, useState } from 'react';
import { ChoiceCard, InterventionShell, PrimaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#9B8EC4';
const PROMPTS = [
  'A memory that makes you smile',
  'Something they used to say',
  'Something they loved',
  'Something they taught you',
  'What you miss most today',
];

function getMemoryCount() {
  if (typeof window === 'undefined') return 0;
  try {
    return JSON.parse(window.localStorage.getItem('aiforj_memory_collection') || '[]').length;
  } catch (_) {
    return 0;
  }
}

export default function ContinuingBonds({ onComplete }) {
  const [prompt, setPrompt] = useState(PROMPTS[0]);
  const [text, setText] = useState('');
  const previousCount = useMemo(() => getMemoryCount(), []);

  return (
    <InterventionShell maxWidth={760}>
      <div style={shellStyles.card}>
        <StepDots currentStep={text.trim() ? 2 : 1} totalSteps={2} accent={ACCENT} label="Continuing Bonds" />
        <h2 style={shellStyles.heading}>Share one thing about them right now.</h2>
        <div style={{ display: 'grid', gap: 10, marginTop: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          {PROMPTS.map((item) => (
            <ChoiceCard key={item} selected={prompt === item} accent={ACCENT} onClick={() => setPrompt(item)}>
              {item}
            </ChoiceCard>
          ))}
        </div>
        <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder={prompt} style={{ ...shellStyles.textarea, marginTop: 20 }} />
        <p style={{ ...shellStyles.body, marginTop: 16 }}>
          The relationship does not end. It transforms. This memory becomes part of your collection.
        </p>
        {previousCount ? <p style={{ ...shellStyles.body, marginTop: 10 }}>You have saved {previousCount} memories so far.</p> : null}
        <div style={shellStyles.buttonRow}>
          <PrimaryButton
            accent={ACCENT}
            disabled={!text.trim()}
            onClick={() => {
              appendToStorage('aiforj_memory_collection', {
                text,
                prompt,
                date: new Date().toISOString(),
              });
              onComplete();
            }}
          >
            Save memory
          </PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
