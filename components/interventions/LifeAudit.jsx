"use client";

import { useMemo, useState } from 'react';
import { InterventionShell, PrimaryButton, SecondaryButton, StepDots, appendToStorage, rangeStyle, shellStyles } from './shared';

const ACCENT = '#9B8EC4';

export default function LifeAudit({ onComplete }) {
  const [entry, setEntry] = useState('');
  const [items, setItems] = useState([]);

  const addItem = () => {
    if (!entry.trim()) return;
    setItems((current) => [...current, { name: entry.trim(), energy: 5, alignment: 5, necessity: 5, fulfillment: 5, exitPlan: '' }]);
    setEntry('');
  };

  const updateItem = (index, patch) => {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  };

  const stopList = useMemo(() => items.filter((item) => item.energy >= 7 && item.alignment <= 4), [items]);

  return (
    <InterventionShell maxWidth={820}>
      <div style={shellStyles.card}>
        <StepDots currentStep={items.length ? 2 : 1} totalSteps={3} accent={ACCENT} label="ACT + Behavioral Audit" />
        <h2 style={shellStyles.heading}>List every current commitment, role, and obligation.</h2>
        <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
          <input value={entry} onChange={(event) => setEntry(event.target.value)} placeholder="Add one commitment" style={{ ...shellStyles.textInput, flex: 1 }} />
          <PrimaryButton accent={ACCENT} onClick={addItem}>Add</PrimaryButton>
        </div>

        <div style={{ display: 'grid', gap: 16, marginTop: 24 }}>
          {items.map((item, index) => (
            <div key={`${item.name}-${index}`} style={{ ...shellStyles.card, padding: '18px 18px', background: 'var(--surface)' }}>
              <strong>{item.name}</strong>
              {[
                ['Energy Cost', 'energy'],
                ['Values Alignment', 'alignment'],
                ['Necessity', 'necessity'],
                ['Fulfillment', 'fulfillment'],
              ].map(([label, key]) => (
                <div key={key} style={{ marginTop: 14 }}>
                  <label style={shellStyles.label}>{label}: {item[key]}/10</label>
                  <input type="range" min="1" max="10" value={item[key]} onChange={(event) => updateItem(index, { [key]: Number(event.target.value) })} style={{ ...rangeStyle(ACCENT), marginTop: 8 }} />
                </div>
              ))}
              {item.energy >= 7 && item.alignment <= 4 ? (
                <textarea
                  value={item.exitPlan}
                  onChange={(event) => updateItem(index, { exitPlan: event.target.value })}
                  placeholder="What would it look like to exit, reduce, or delegate this?"
                  style={{ ...shellStyles.textarea, marginTop: 16, minHeight: 100 }}
                />
              ) : null}
            </div>
          ))}
        </div>

        {stopList.length ? (
          <div style={{ ...shellStyles.card, marginTop: 22, background: 'rgba(196, 91, 91, 0.06)' }}>
            <strong style={{ display: 'block', marginBottom: 8 }}>Stop List</strong>
            <ul style={{ margin: '0 0 0 18px', lineHeight: 1.7 }}>
              {stopList.map((item) => <li key={item.name}>{item.name}</li>)}
            </ul>
          </div>
        ) : null}

        <div style={shellStyles.buttonRow}>
          <SecondaryButton onClick={() => setItems([])}>Reset</SecondaryButton>
          <PrimaryButton
            accent={ACCENT}
            disabled={!items.length}
            onClick={() => {
              appendToStorage('aiforj_life_audit', { items, stopList, createdAt: new Date().toISOString() });
              onComplete();
            }}
          >
            Finish audit
          </PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
