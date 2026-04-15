"use client";

import { useState } from 'react';
import { InterventionShell, PrimaryButton, SecondaryButton, StepDots, setStorage, shellStyles } from './shared';

const ACCENT = '#D4A843';

export default function NonNegotiables({ onComplete }) {
  const [name, setName] = useState('');
  const [signed, setSigned] = useState(false);
  const [items, setItems] = useState(() => Array.from({ length: 3 }, () => ({ label: '', minimum: '' })));

  const addRow = () => setItems((current) => [...current, { label: '', minimum: '' }]);

  return (
    <InterventionShell maxWidth={820}>
      <div style={shellStyles.card}>
        <StepDots currentStep={signed ? 2 : 1} totalSteps={2} accent={ACCENT} label="Non-Negotiables Contract" />
        <h2 style={shellStyles.heading}>What 3-5 things make everything better when you actually do them?</h2>
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name (optional)" style={{ ...shellStyles.textInput, marginTop: 24 }} />
        <div style={{ display: 'grid', gap: 16, marginTop: 20 }}>
          {items.map((item, index) => (
            <div key={index} style={{ ...shellStyles.card, padding: '18px 18px', background: 'var(--surface)' }}>
              <input
                value={item.label}
                onChange={(event) => setItems((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, label: event.target.value } : row))}
                placeholder="Non-negotiable"
                style={shellStyles.textInput}
              />
              <input
                value={item.minimum}
                onChange={(event) => setItems((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, minimum: event.target.value } : row))}
                placeholder="Minimum viable version for your worst day"
                style={{ ...shellStyles.textInput, marginTop: 12 }}
              />
            </div>
          ))}
        </div>
        {items.length < 5 ? (
          <div style={shellStyles.buttonRow}>
            <SecondaryButton onClick={addRow}>Add another</SecondaryButton>
          </div>
        ) : null}
        {signed ? (
          <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(212, 168, 67, 0.08)' }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 28 }}>Non-Negotiables Contract</div>
            <p style={{ ...shellStyles.body, marginTop: 10 }}>I, {name || 'myself'}, commit to these non-negotiables:</p>
            <ul style={{ margin: '10px 0 0 18px', lineHeight: 1.8 }}>
              {items.filter((item) => item.label.trim() && item.minimum.trim()).map((item) => (
                <li key={item.label}><strong>{item.label}</strong> | minimum: {item.minimum}</li>
              ))}
            </ul>
          </div>
        ) : null}
        <div style={shellStyles.buttonRow}>
          <PrimaryButton
            accent={ACCENT}
            disabled={items.filter((item) => item.label.trim() && item.minimum.trim()).length < 3}
            onClick={() => {
              const payload = {
                name,
                items: items.filter((item) => item.label.trim() && item.minimum.trim()),
                signedAt: new Date().toISOString(),
              };
              setStorage('aiforj_non_negotiables', payload);
              setSigned(true);
            }}
          >
            Sign
          </PrimaryButton>
          {signed ? <PrimaryButton accent={ACCENT} onClick={onComplete}>Finish</PrimaryButton> : null}
        </div>
      </div>
    </InterventionShell>
  );
}
