"use client";

import { useState } from 'react';
import { ChoiceCard, InterventionShell, PrimaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#9B8EC4';
const RIGHTS = [
  'I have the right to grieve in my own way.',
  'I have the right to feel angry about my loss.',
  "I have the right to not be over it on anyone's timeline.",
  'I have the right to feel joy without guilt.',
  'I have the right to talk about my loss whenever I need to.',
  'I have the right to cry, or not cry.',
  "I have the right to say no to things I can't handle.",
  'I have the right to ask for help.',
  'I have the right to grieve secondary losses.',
];

export default function GriefRights({ onComplete }) {
  const [selected, setSelected] = useState([]);

  const toggle = (value) => {
    setSelected((current) => (current.includes(value) ? current.filter((item) => item !== value) : [...current, value]));
  };

  return (
    <InterventionShell maxWidth={800}>
      <div style={shellStyles.card}>
        <StepDots currentStep={selected.length ? 2 : 1} totalSteps={2} accent={ACCENT} label="Grief Rights" />
        <h2 style={shellStyles.heading}>Select the rights you need to hear right now.</h2>
        <div style={{ display: 'grid', gap: 10, marginTop: 24 }}>
          {RIGHTS.map((item) => (
            <ChoiceCard key={item} selected={selected.includes(item)} accent={ACCENT} onClick={() => toggle(item)}>
              {item}
            </ChoiceCard>
          ))}
        </div>
        {selected.length ? (
          <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(155, 142, 196, 0.08)' }}>
            <strong style={{ display: 'block', marginBottom: 10 }}>My Grief Rights</strong>
            <ul style={{ margin: '0 0 0 18px', lineHeight: 1.8 }}>
              {selected.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        ) : null}
        <div style={shellStyles.buttonRow}>
          <PrimaryButton
            accent={ACCENT}
            disabled={!selected.length}
            onClick={() => {
              appendToStorage('aiforj_grief_rights', {
                selected,
                createdAt: new Date().toISOString(),
              });
              onComplete();
            }}
          >
            Finish
          </PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
