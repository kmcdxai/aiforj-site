"use client";

import { useMemo, useState } from 'react';
import { ChoiceCard, InterventionShell, PrimaryButton, StepDots, shellStyles } from './shared';

const ACCENT = '#9B8EC4';
const ZONES = {
  hyper: {
    label: 'Hyperarousal',
    color: '#C45B5B',
    body: 'Racing thoughts, tension, irritability, heart pounding.',
    suggestion: 'Your system is revved up. You need down-regulation: TIPP skills, paced breathing, or container visualization.',
  },
  window: {
    label: 'Window of Tolerance',
    color: '#7A9E7E',
    body: 'Clear enough to think, present, emotions manageable.',
    suggestion: 'You are in your window. This is a good time for thinking and planning tools.',
  },
  hypo: {
    label: 'Hypoarousal',
    color: '#6B98B8',
    body: "Numb, foggy, exhausted, can't move, disconnected.",
    suggestion: 'You need up-regulation. Calming tools can make freeze worse. Use activation: cold water, sensory activation, micro-movement.',
  },
};

export default function WindowOfTolerance({ onComplete }) {
  const [selected, setSelected] = useState('');
  const zone = useMemo(() => (selected ? ZONES[selected] : null), [selected]);

  return (
    <InterventionShell maxWidth={680}>
      <div style={shellStyles.card}>
        <StepDots currentStep={selected ? 2 : 1} totalSteps={2} accent={ACCENT} label="Polyvagal Check-In" />
        <h2 style={shellStyles.heading}>Where are you in your nervous system right now?</h2>
        <div style={{ marginTop: 24, display: 'grid', gap: 14 }}>
          {Object.entries(ZONES).map(([key, item]) => (
            <ChoiceCard key={key} selected={selected === key} onClick={() => setSelected(key)}>
              <div style={{ display: 'grid', gap: 6 }}>
                <strong style={{ color: item.color }}>{item.label}</strong>
                <p style={{ ...shellStyles.body, fontSize: 14 }}>{item.body}</p>
              </div>
            </ChoiceCard>
          ))}
        </div>

        <div
          style={{
            marginTop: 26,
            borderRadius: 24,
            overflow: 'hidden',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ background: '#F8D9D9', padding: '18px 20px' }}>
            <strong style={{ color: '#A24444' }}>Hyperarousal</strong>
            <p style={{ ...shellStyles.body, fontSize: 14 }}>Fight/flight: racing, tense, keyed up.</p>
          </div>
          <div style={{ background: '#E8F0E8', padding: '18px 20px' }}>
            <strong style={{ color: '#4A7A50' }}>Window of Tolerance</strong>
            <p style={{ ...shellStyles.body, fontSize: 14 }}>Present, thinking clearly, manageable emotions.</p>
          </div>
          <div style={{ background: '#E6EEF7', padding: '18px 20px' }}>
            <strong style={{ color: '#3D6A8F' }}>Hypoarousal</strong>
            <p style={{ ...shellStyles.body, fontSize: 14 }}>Freeze/shutdown: foggy, numb, empty.</p>
          </div>
        </div>

        {zone ? (
          <div style={{ ...shellStyles.card, marginTop: 22, background: 'rgba(155, 142, 196, 0.08)' }}>
            <p style={{ ...shellStyles.body, margin: 0 }}>{zone.suggestion}</p>
          </div>
        ) : null}

        <div style={shellStyles.buttonRow}>
          <PrimaryButton accent={ACCENT} disabled={!selected} onClick={onComplete}>Finish check-in</PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
