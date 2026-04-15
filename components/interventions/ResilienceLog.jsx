"use client";

import { useState } from 'react';
import { InterventionShell, PrimaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#C4856C';
const PROMPTS = [
  "What's the hardest thing you've survived?",
  'Name a time you were afraid and did it anyway.',
  'What challenge did you handle better than expected?',
  'What would 5-years-ago-you think about what you have accomplished?',
  'What strengths do people say you have?',
];

export default function ResilienceLog({ onComplete }) {
  const [answers, setAnswers] = useState(Array(PROMPTS.length).fill(''));

  return (
    <InterventionShell maxWidth={820}>
      <div style={shellStyles.card}>
        <StepDots currentStep={2} totalSteps={2} accent={ACCENT} label="Resilience Evidence Log" />
        <h2 style={shellStyles.heading}>Build the evidence that you can handle more than fear says.</h2>
        <div style={{ display: 'grid', gap: 14, marginTop: 24 }}>
          {PROMPTS.map((prompt, index) => (
            <textarea
              key={prompt}
              value={answers[index]}
              onChange={(event) => setAnswers((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))}
              placeholder={prompt}
              style={{ ...shellStyles.textarea, minHeight: 120 }}
            />
          ))}
        </div>
        <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(196, 133, 108, 0.08)' }}>
          <strong style={{ display: 'block', marginBottom: 10 }}>Resilience Resume</strong>
          <ul style={{ margin: '0 0 0 18px', lineHeight: 1.8 }}>
            {answers.filter(Boolean).map((answer, index) => <li key={index}>{answer}</li>)}
          </ul>
        </div>
        <div style={shellStyles.buttonRow}>
          <PrimaryButton
            accent={ACCENT}
            disabled={answers.some((answer) => !answer.trim())}
            onClick={() => {
              appendToStorage('aiforj_resilience_log', {
                answers,
                createdAt: new Date().toISOString(),
              });
              onComplete();
            }}
          >
            Save resilience log
          </PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
