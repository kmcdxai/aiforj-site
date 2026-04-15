"use client";

import { useMemo, useState } from 'react';
import CrisisBanner from './CrisisBanner';
import { ChoiceCard, InterventionShell, PrimaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#C47A8A';
const FUNCTION_OPTIONS = [
  {
    id: 'numbing-pain',
    title: 'Numbing pain',
    alternatives: ['Intense exercise', 'Hot bath or shower', 'Immersive movie or show', 'Creative expression'],
  },
  {
    id: 'feeling-something',
    title: 'Feeling something',
    alternatives: ['Ice on skin', 'Intense flavors', 'Loud music', 'Cold shower'],
  },
  {
    id: 'punishing-yourself',
    title: 'Punishing yourself',
    alternatives: ['Do one kind thing for someone else', 'Write a compassionate truth', 'Clean a small area', 'Text someone safe'],
  },
  {
    id: 'escaping-reality',
    title: 'Escaping reality',
    alternatives: ['Immersive game or show', 'Change your environment', 'Cook something involved', 'Physical exertion'],
  },
  {
    id: 'feeling-control',
    title: 'Feeling in control',
    alternatives: ['Organize something small', 'Make one clear decision', 'Build or create something', 'Set one boundary'],
  },
];

export default function AlternativeBehavior({ onComplete }) {
  const [selectedFunction, setSelectedFunction] = useState('');
  const [selectedAlternative, setSelectedAlternative] = useState('');

  const functionDetails = useMemo(
    () => FUNCTION_OPTIONS.find((item) => item.id === selectedFunction) || null,
    [selectedFunction]
  );

  return (
    <InterventionShell maxWidth={860}>
      <div style={shellStyles.card}>
        <CrisisBanner />
        <StepDots currentStep={selectedAlternative ? 3 : selectedFunction ? 2 : 1} totalSteps={3} accent={ACCENT} label="Alternative Behavior Generator" />
        <h2 style={shellStyles.heading}>Match the alternative to the job the behavior is doing.</h2>
        <p style={{ ...shellStyles.body, marginTop: 12 }}>
          Generic advice often fails because it does not serve the same function. Pick the function first, then choose an alternative that fits.
        </p>

        <div style={{ display: 'grid', gap: 10, marginTop: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {FUNCTION_OPTIONS.map((item) => (
            <ChoiceCard key={item.id} selected={selectedFunction === item.id} accent={ACCENT} onClick={() => { setSelectedFunction(item.id); setSelectedAlternative(''); }}>
              <strong style={{ display: 'block', marginBottom: 8 }}>{item.title}</strong>
              <span style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Choose alternatives that scratch the same itch more safely.</span>
            </ChoiceCard>
          ))}
        </div>

        {functionDetails ? (
          <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(196, 122, 138, 0.08)' }}>
            <strong style={{ display: 'block', marginBottom: 12 }}>Try one of these instead right now:</strong>
            <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              {functionDetails.alternatives.map((alternative) => (
                <ChoiceCard key={alternative} selected={selectedAlternative === alternative} accent={ACCENT} onClick={() => setSelectedAlternative(alternative)}>
                  {alternative}
                </ChoiceCard>
              ))}
            </div>
          </div>
        ) : null}

        {selectedAlternative ? (
          <p style={{ ...shellStyles.body, marginTop: 16 }}>
            You are not just avoiding the urge. You are meeting the need behind it in a safer way.
          </p>
        ) : null}

        <div style={shellStyles.buttonRow}>
          <PrimaryButton
            accent={ACCENT}
            disabled={!selectedFunction || !selectedAlternative}
            onClick={() => {
              appendToStorage('aiforj_alternative_behavior', {
                selectedFunction,
                selectedAlternative,
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
