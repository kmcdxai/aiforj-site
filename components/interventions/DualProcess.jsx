"use client";

import { useMemo, useState } from 'react';
import { ChoiceCard, InterventionShell, PrimaryButton, StepDots, shellStyles } from './shared';

const ACCENT = '#9B8EC4';
const OPTIONS = {
  loss: {
    title: 'Loss-Oriented',
    body: 'Crying, remembering, yearning, processing the pain.',
    response: 'This is healthy. Your grief needs space to be felt. Do not rush this part.',
  },
  restoration: {
    title: 'Restoration-Oriented',
    body: 'Rebuilding, practical tasks, new identity, new routines.',
    response: "This is also healthy. Building a life around the loss is not betraying what mattered.",
  },
};

export default function DualProcess({ onComplete }) {
  const [selected, setSelected] = useState('');
  const option = useMemo(() => (selected ? OPTIONS[selected] : null), [selected]);

  return (
    <InterventionShell maxWidth={720}>
      <div style={shellStyles.card}>
        <StepDots currentStep={option ? 2 : 1} totalSteps={2} accent={ACCENT} label="Dual Process Model" />
        <h2 style={shellStyles.heading}>Which mode are you in right now?</h2>
        <div style={{ display: 'grid', gap: 14, marginTop: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {Object.entries(OPTIONS).map(([key, item]) => (
            <ChoiceCard key={key} selected={selected === key} accent={ACCENT} onClick={() => setSelected(key)}>
              <strong>{item.title}</strong>
              <p style={{ ...shellStyles.body, marginTop: 10, fontSize: 14 }}>{item.body}</p>
            </ChoiceCard>
          ))}
        </div>
        {option ? (
          <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(155, 142, 196, 0.08)' }}>
            <p style={{ ...shellStyles.body, margin: 0 }}>{option.response}</p>
            <p style={{ ...shellStyles.body, marginTop: 10 }}>Healthy grieving oscillates between both. If you have been stuck in one, gently try the other.</p>
          </div>
        ) : null}
        <div style={shellStyles.buttonRow}>
          <PrimaryButton accent={ACCENT} disabled={!selected} onClick={onComplete}>Finish</PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
