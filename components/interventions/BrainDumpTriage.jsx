"use client";

import { useMemo, useState } from 'react';
import { ChoiceCard, InterventionShell, PrimaryButton, SecondaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#9B8EC4';
const QUADRANTS = {
  doNow: { label: 'Do Now', color: '#C45B5B' },
  schedule: { label: 'Schedule', color: '#D4A843' },
  minimize: { label: 'Delegate / Minimize', color: '#6B98B8' },
  drop: { label: 'Drop', color: '#8A8078' },
};

export default function BrainDumpTriage({ onComplete }) {
  const [step, setStep] = useState(1);
  const [entry, setEntry] = useState('');
  const [items, setItems] = useState([]);

  const addItem = () => {
    if (!entry.trim()) return;
    setItems((current) => [...current, { text: entry.trim(), bucket: '' }]);
    setEntry('');
  };

  const assign = (index, bucket) => {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, bucket } : item)));
  };

  const grouped = useMemo(() => {
    return Object.keys(QUADRANTS).reduce((acc, key) => ({ ...acc, [key]: items.filter((item) => item.bucket === key) }), {});
  }, [items]);

  return (
    <InterventionShell maxWidth={760}>
      <div style={shellStyles.card}>
        <StepDots currentStep={step} totalSteps={3} accent={ACCENT} label="Behavioral + CBT Triage" />
        {step === 1 ? (
          <>
            <h2 style={shellStyles.heading}>Dump everything out of your head.</h2>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <input value={entry} onChange={(event) => setEntry(event.target.value)} placeholder="Add one task, demand, or worry" style={{ ...shellStyles.textInput, flex: 1 }} />
              <PrimaryButton accent={ACCENT} onClick={addItem}>Add</PrimaryButton>
            </div>
            <div style={{ display: 'grid', gap: 10, marginTop: 20 }}>
              {items.map((item, index) => (
                <div key={`${item.text}-${index}`} style={shellStyles.statCard}>{item.text}</div>
              ))}
            </div>
            <div style={shellStyles.buttonRow}>
              <PrimaryButton accent={ACCENT} disabled={!items.length} onClick={() => setStep(2)}>Triage these</PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <h2 style={shellStyles.heading}>Sort each item into the matrix.</h2>
            <div style={{ display: 'grid', gap: 16, marginTop: 22 }}>
              {items.map((item, index) => (
                <div key={`${item.text}-${index}`} style={{ ...shellStyles.card, padding: '18px 18px', background: 'var(--surface)' }}>
                  <strong style={{ display: 'block', marginBottom: 12 }}>{item.text}</strong>
                  <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
                    {Object.entries(QUADRANTS).map(([key, value]) => (
                      <ChoiceCard key={key} selected={item.bucket === key} onClick={() => assign(index, key)} style={{ padding: '12px 12px' }}>
                        <span style={{ color: value.color, fontWeight: 700 }}>{value.label}</span>
                      </ChoiceCard>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(1)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} disabled={items.some((item) => !item.bucket)} onClick={() => setStep(3)}>See results</PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <h2 style={shellStyles.heading}>Your brain was holding {items.length} items. Now they are organized.</h2>
            <div style={{ display: 'grid', gap: 16, marginTop: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
              {Object.entries(QUADRANTS).map(([key, value]) => (
                <div key={key} style={{ ...shellStyles.card, padding: '18px 18px', borderColor: `${value.color}55` }}>
                  <strong style={{ color: value.color }}>{value.label}</strong>
                  <ul style={{ margin: '12px 0 0 18px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {grouped[key].map((item) => <li key={item.text}>{item.text}</li>)}
                  </ul>
                </div>
              ))}
            </div>
            <p style={{ ...shellStyles.body, marginTop: 18 }}>
              Start with one thing in <strong style={{ color: 'var(--text-primary)' }}>Do Now</strong>. The rest has a lane.
            </p>
            <div style={shellStyles.buttonRow}>
              <PrimaryButton
                accent={ACCENT}
                onClick={() => {
                  appendToStorage('aiforj_brain_dump_triage', { items, createdAt: new Date().toISOString() });
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
