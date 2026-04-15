"use client";

import { useState } from 'react';
import { ChoiceCard, InterventionShell, PrimaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#D4A843';
const SLOTS = ['Morning', 'Midday', 'Afternoon', 'Evening'];
const TYPES = ['Nature break', 'Music break', 'Movement break', 'Stillness break', 'Social break', 'Ritual break'];

export default function MicroRecovery({ onComplete }) {
  const [schedule, setSchedule] = useState({});

  return (
    <InterventionShell maxWidth={820}>
      <div style={shellStyles.card}>
        <StepDots currentStep={Object.keys(schedule).length ? 2 : 1} totalSteps={2} accent={ACCENT} label="Micro-Recovery Planner" />
        <h2 style={shellStyles.heading}>Where could you insert 5-10 minute recovery breaks?</h2>
        <div style={{ display: 'grid', gap: 18, marginTop: 24 }}>
          {SLOTS.map((slot) => (
            <div key={slot} style={{ ...shellStyles.card, padding: '18px 18px', background: 'var(--surface)' }}>
              <strong>{slot}</strong>
              <div style={{ display: 'grid', gap: 8, marginTop: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
                {TYPES.map((type) => (
                  <ChoiceCard key={type} selected={schedule[slot] === type} accent={ACCENT} onClick={() => setSchedule((current) => ({ ...current, [slot]: type }))}>
                    {type}
                  </ChoiceCard>
                ))}
              </div>
            </div>
          ))}
        </div>
        {Object.keys(schedule).length ? (
          <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(212, 168, 67, 0.08)' }}>
            <strong style={{ display: 'block', marginBottom: 10 }}>Your micro-recovery plan</strong>
            <ul style={{ margin: '0 0 0 18px', lineHeight: 1.8 }}>
              {Object.entries(schedule).map(([slot, type]) => <li key={slot}>{slot}: {type}</li>)}
            </ul>
          </div>
        ) : null}
        <div style={shellStyles.buttonRow}>
          <PrimaryButton
            accent={ACCENT}
            disabled={!Object.keys(schedule).length}
            onClick={() => {
              appendToStorage('aiforj_micro_recovery', {
                schedule,
                createdAt: new Date().toISOString(),
              });
              onComplete();
            }}
          >
            Save schedule
          </PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
