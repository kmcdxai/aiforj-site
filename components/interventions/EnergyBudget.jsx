"use client";

import { useMemo, useState } from 'react';
import { InterventionShell, PrimaryButton, StepDots, appendToStorage, rangeStyle, shellStyles } from './shared';

const ACCENT = '#9B8EC4';

export default function EnergyBudget({ onComplete }) {
  const [goodDay, setGoodDay] = useState(8);
  const [badDay, setBadDay] = useState(4);
  const [today, setToday] = useState(5);
  const [entry, setEntry] = useState('');
  const [cost, setCost] = useState(2);
  const [items, setItems] = useState([]);

  const addItem = () => {
    if (!entry.trim()) return;
    setItems((current) => [...current, { name: entry.trim(), cost }]);
    setEntry('');
    setCost(2);
  };

  const totalCost = useMemo(() => items.reduce((sum, item) => sum + item.cost, 0), [items]);
  const balance = today - totalCost;

  return (
    <InterventionShell maxWidth={760}>
      <div style={shellStyles.card}>
        <StepDots currentStep={2} totalSteps={2} accent={ACCENT} label="Energy Budget Planner" />
        <h2 style={shellStyles.heading}>Make your energy visible.</h2>
        <div style={{ display: 'grid', gap: 16, marginTop: 22 }}>
          {[
            ['Good day energy', goodDay, setGoodDay],
            ['Bad day energy', badDay, setBadDay],
            ['Today’s energy', today, setToday],
          ].map(([label, value, setter]) => (
            <div key={label}>
              <label style={shellStyles.label}>{label}: {value}/10</label>
              <input type="range" min="1" max="10" value={value} onChange={(event) => setter(Number(event.target.value))} style={{ ...rangeStyle(ACCENT), marginTop: 8 }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <input value={entry} onChange={(event) => setEntry(event.target.value)} placeholder="Add an obligation" style={{ ...shellStyles.textInput, flex: 1 }} />
          <input type="number" min="1" max="5" value={cost} onChange={(event) => setCost(Number(event.target.value))} style={{ ...shellStyles.textInput, width: 90 }} />
          <PrimaryButton accent={ACCENT} onClick={addItem}>Add</PrimaryButton>
        </div>
        <div style={{ display: 'grid', gap: 10, marginTop: 20 }}>
          {items.map((item) => (
            <div key={item.name} style={shellStyles.statCard}>
              {item.name} <strong style={{ float: 'right' }}>{item.cost} pts</strong>
            </div>
          ))}
        </div>
        <div style={{ ...shellStyles.card, marginTop: 20, background: balance >= 0 ? 'rgba(122, 158, 126, 0.08)' : 'rgba(196, 91, 91, 0.08)' }}>
          <p style={{ ...shellStyles.body, margin: 0 }}>
            Available: <strong style={{ color: 'var(--text-primary)' }}>{today}</strong> points. Obligations: <strong style={{ color: 'var(--text-primary)' }}>{totalCost}</strong> points.
            {balance >= 0 ? ` You have ${balance} points left.` : ` You are overdrawn by ${Math.abs(balance)} points. Something has to give.`}
          </p>
        </div>
        <div style={shellStyles.buttonRow}>
          <PrimaryButton
            accent={ACCENT}
            onClick={() => {
              appendToStorage('aiforj_energy_budget', { goodDay, badDay, today, items, totalCost, balance, createdAt: new Date().toISOString() });
              onComplete();
            }}
          >
            Finish budget
          </PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
