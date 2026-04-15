"use client";

import { useMemo, useState } from 'react';
import { ChoiceCard, InterventionShell, PrimaryButton, SecondaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#9B8EC4';
const CONTAINERS = [
  { id: 'box', label: 'Sturdy Box', emoji: '📦', metaphor: 'filed away safely' },
  { id: 'jar', label: 'Glass Jar', emoji: '🫙', metaphor: 'resting visibly but contained' },
  { id: 'lake', label: 'Deep Lake', emoji: '🌊', metaphor: 'sinking below the surface' },
  { id: 'vault', label: 'Safe Vault', emoji: '🔒', metaphor: 'locked away for later' },
];

export default function ContainerVisualization({ onComplete }) {
  const [step, setStep] = useState(1);
  const [containerId, setContainerId] = useState('');
  const [entry, setEntry] = useState('');
  const [items, setItems] = useState([]);

  const container = useMemo(() => CONTAINERS.find((item) => item.id === containerId), [containerId]);

  const addItem = () => {
    if (!entry.trim()) return;
    setItems((current) => [...current, entry.trim()]);
    setEntry('');
  };

  return (
    <InterventionShell maxWidth={700}>
      <div style={shellStyles.card}>
        <StepDots currentStep={step} totalSteps={3} accent={ACCENT} label="EMDR / Somatic Containment" />

        {step === 1 ? (
          <>
            <h2 style={shellStyles.heading}>Choose a container for what is weighing on you.</h2>
            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', marginTop: 24 }}>
              {CONTAINERS.map((option) => (
                <ChoiceCard key={option.id} selected={containerId === option.id} onClick={() => setContainerId(option.id)}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{option.emoji}</div>
                  <strong>{option.label}</strong>
                </ChoiceCard>
              ))}
            </div>
            <div style={shellStyles.buttonRow}>
              <PrimaryButton accent={ACCENT} disabled={!containerId} onClick={() => setStep(2)}>Next</PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <h2 style={shellStyles.heading}>Name the things filling your head, one at a time.</h2>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <input
                value={entry}
                onChange={(event) => setEntry(event.target.value)}
                placeholder="Add one thought, task, or stressor"
                style={{ ...shellStyles.textInput, flex: 1 }}
              />
              <PrimaryButton accent={ACCENT} onClick={addItem}>Add</PrimaryButton>
            </div>
            <div style={{ display: 'grid', gap: 12, marginTop: 22 }}>
              {items.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  style={{
                    ...shellStyles.statCard,
                    background: 'rgba(155, 142, 196, 0.08)',
                    transform: `translateY(${Math.min(index * 2, 10)}px)`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                    <span>{item}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{container?.metaphor}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(1)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} disabled={!items.length} onClick={() => setStep(3)}>That's everything for now</PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 56 }}>{container?.emoji}</div>
              <h2 style={shellStyles.heading}>{container?.label} closed.</h2>
            </div>
            <div style={{ ...shellStyles.card, marginTop: 24, background: 'rgba(155, 142, 196, 0.08)', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 34, color: ACCENT }}>{items.length}</div>
              <p style={{ ...shellStyles.body, marginTop: 8 }}>
                Everything you named is contained. It is not gone. You can come back to it later. Right now, it has a place, and that place is not your head.
              </p>
            </div>
            <div style={shellStyles.buttonRow}>
              <PrimaryButton
                accent={ACCENT}
                onClick={() => {
                  appendToStorage('aiforj_overwhelm_container', {
                    containerId,
                    items,
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
