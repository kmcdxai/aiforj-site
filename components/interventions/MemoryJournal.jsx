"use client";

import { useState } from 'react';
import { ChoiceCard, InterventionShell, PrimaryButton, SecondaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#9B8EC4';
const PROMPTS = [
  'What did their voice sound like? Their laugh?',
  'Describe a regular, ordinary day with them.',
  'What is an inside joke only you two would understand?',
  'What did they smell like?',
  'What is the last time you laughed together?',
  'What did they believe in?',
];

export default function MemoryJournal({ onComplete }) {
  const [selected, setSelected] = useState([]);
  const [entries, setEntries] = useState({});

  const togglePrompt = (prompt) => {
    setSelected((current) =>
      current.includes(prompt)
        ? current.filter((item) => item !== prompt)
        : current.length < 3
          ? [...current, prompt]
          : current
    );
  };

  return (
    <InterventionShell maxWidth={820}>
      <div style={shellStyles.card}>
        <StepDots currentStep={selected.length ? 2 : 1} totalSteps={2} accent={ACCENT} label="Memory Preservation" />
        <h2 style={shellStyles.heading}>Pick two or three details to preserve.</h2>
        <div style={{ display: 'grid', gap: 10, marginTop: 24 }}>
          {PROMPTS.map((prompt) => (
            <ChoiceCard key={prompt} selected={selected.includes(prompt)} accent={ACCENT} onClick={() => togglePrompt(prompt)}>
              {prompt}
            </ChoiceCard>
          ))}
        </div>
        <div style={{ display: 'grid', gap: 16, marginTop: 22 }}>
          {selected.map((prompt) => (
            <textarea
              key={prompt}
              value={entries[prompt] || ''}
              onChange={(event) => setEntries((current) => ({ ...current, [prompt]: event.target.value }))}
              placeholder={prompt}
              style={{ ...shellStyles.textarea, minHeight: 120 }}
            />
          ))}
        </div>
        <div style={shellStyles.buttonRow}>
          <SecondaryButton onClick={() => { setSelected([]); setEntries({}); }}>Reset</SecondaryButton>
          <PrimaryButton
            accent={ACCENT}
            disabled={!selected.length || selected.some((prompt) => !entries[prompt]?.trim())}
            onClick={() => {
              selected.forEach((prompt) => {
                appendToStorage('aiforj_memory_collection', {
                  text: entries[prompt],
                  prompt,
                  date: new Date().toISOString(),
                });
              });
              onComplete();
            }}
          >
            Save these memories
          </PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
