"use client";

import { useState } from 'react';
import { InterventionShell, PrimaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#9B8EC4';

export default function AnniversaryPlanning({ onComplete }) {
  const [entry, setEntry] = useState({ label: '', date: '', significance: '', difficulty: 5, ritual: '', person: '', selfCare: '', permission: '', unexpected: '' });
  const [plans, setPlans] = useState([]);

  const addPlan = () => {
    if (!entry.label.trim() || !entry.date || !entry.significance.trim()) return;
    setPlans((current) => [...current, entry]);
    setEntry({ label: '', date: '', significance: '', difficulty: 5, ritual: '', person: '', selfCare: '', permission: '', unexpected: '' });
  };

  return (
    <InterventionShell maxWidth={860}>
      <div style={shellStyles.card}>
        <StepDots currentStep={plans.length ? 2 : 1} totalSteps={2} accent={ACCENT} label="Anniversary Planning" />
        <h2 style={shellStyles.heading}>Add the dates or triggers that hit hardest.</h2>
        <div style={{ display: 'grid', gap: 12, marginTop: 22 }}>
          <input value={entry.label} onChange={(event) => setEntry((current) => ({ ...current, label: event.target.value }))} placeholder="Birthday, holiday, song, place..." style={shellStyles.textInput} />
          <input type="date" value={entry.date} onChange={(event) => setEntry((current) => ({ ...current, date: event.target.value }))} style={shellStyles.textInput} />
          <textarea value={entry.significance} onChange={(event) => setEntry((current) => ({ ...current, significance: event.target.value }))} placeholder="Why this matters" style={{ ...shellStyles.textarea, minHeight: 100 }} />
          <label style={shellStyles.label}>Expected difficulty: {entry.difficulty}/10</label>
          <input type="range" min="1" max="10" value={entry.difficulty} onChange={(event) => setEntry((current) => ({ ...current, difficulty: Number(event.target.value) }))} style={{ width: '100%', accentColor: ACCENT }} />
          <input value={entry.ritual} onChange={(event) => setEntry((current) => ({ ...current, ritual: event.target.value }))} placeholder="Ritual or intentional activity" style={shellStyles.textInput} />
          <input value={entry.person} onChange={(event) => setEntry((current) => ({ ...current, person: event.target.value }))} placeholder="Person to be with or alone plan" style={shellStyles.textInput} />
          <input value={entry.selfCare} onChange={(event) => setEntry((current) => ({ ...current, selfCare: event.target.value }))} placeholder="Self-care before and after" style={shellStyles.textInput} />
          <input value={entry.permission} onChange={(event) => setEntry((current) => ({ ...current, permission: event.target.value }))} placeholder="I give myself permission to..." style={shellStyles.textInput} />
          <textarea value={entry.unexpected} onChange={(event) => setEntry((current) => ({ ...current, unexpected: event.target.value }))} placeholder="Plan for an unexpected grief surge" style={{ ...shellStyles.textarea, minHeight: 100 }} />
        </div>
        <div style={shellStyles.buttonRow}>
          <PrimaryButton accent={ACCENT} onClick={addPlan}>Add trigger plan</PrimaryButton>
        </div>
        {plans.length ? (
          <div style={{ display: 'grid', gap: 12, marginTop: 22 }}>
            {plans.map((plan, index) => (
              <div key={`${plan.label}-${index}`} style={{ ...shellStyles.card, padding: '18px 18px', background: 'var(--surface)' }}>
                <strong>{plan.label}</strong>
                <p style={{ ...shellStyles.body, marginTop: 8 }}>{plan.date} | difficulty {plan.difficulty}/10</p>
                <p style={{ ...shellStyles.body, marginTop: 8 }}>{plan.ritual || 'No ritual added yet.'}</p>
              </div>
            ))}
          </div>
        ) : null}
        <div style={shellStyles.buttonRow}>
          <PrimaryButton
            accent={ACCENT}
            disabled={!plans.length}
            onClick={() => {
              appendToStorage('aiforj_anniversary_planning', {
                plans,
                createdAt: new Date().toISOString(),
              });
              onComplete();
            }}
          >
            Save plans
          </PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
