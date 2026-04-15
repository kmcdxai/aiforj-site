"use client";

import { useState } from 'react';
import { ChoiceCard, InterventionShell, PrimaryButton, SecondaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#8A8078';
const LAST_DONE = ['This week', 'This month', 'Months ago', "Can't remember"];

export default function ReEngagementPlan({ onComplete }) {
  const [items, setItems] = useState(() =>
    Array.from({ length: 5 }, () => ({
      activity: '',
      lastDone: '',
      selected: false,
      miniVersion: '',
      when: '',
    }))
  );

  const updateItem = (index, patch) => {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  };

  const selectedCount = items.filter((item) => item.selected).length;

  return (
    <InterventionShell maxWidth={860}>
      <div style={shellStyles.card}>
        <StepDots currentStep={selectedCount ? 2 : 1} totalSteps={2} accent={ACCENT} label="Re-Engagement Plan" />
        <h2 style={shellStyles.heading}>List five things that used to bring pleasure or meaning.</h2>
        <div style={{ display: 'grid', gap: 16, marginTop: 24 }}>
          {items.map((item, index) => (
            <div key={index} style={{ ...shellStyles.card, padding: '18px 18px', background: 'var(--surface)' }}>
              <input value={item.activity} onChange={(event) => updateItem(index, { activity: event.target.value })} placeholder={`Activity ${index + 1}`} style={shellStyles.textInput} />
              <div style={{ display: 'grid', gap: 8, marginTop: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}>
                {LAST_DONE.map((label) => (
                  <ChoiceCard key={label} selected={item.lastDone === label} accent={ACCENT} onClick={() => updateItem(index, { lastDone: label })} style={{ padding: '12px 12px' }}>
                    {label}
                  </ChoiceCard>
                ))}
              </div>
              <label style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 14 }}>
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={(event) => updateItem(index, { selected: event.target.checked })}
                  disabled={!item.selected && selectedCount >= 2}
                />
                Pick this for a 5-minute re-engagement dose.
              </label>
              {item.selected ? (
                <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
                  <input value={item.miniVersion} onChange={(event) => updateItem(index, { miniVersion: event.target.value })} placeholder="What is the 5-minute version?" style={shellStyles.textInput} />
                  <input value={item.when} onChange={(event) => updateItem(index, { when: event.target.value })} placeholder="When will you try it?" style={shellStyles.textInput} />
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <p style={{ ...shellStyles.body, marginTop: 18 }}>
          Anhedonia means you may not enjoy it at first. Do it anyway. The signal usually returns with repeated exposure.
        </p>
        <div style={shellStyles.buttonRow}>
          <SecondaryButton onClick={() => setItems(Array.from({ length: 5 }, () => ({ activity: '', lastDone: '', selected: false, miniVersion: '', when: '' })))}>Reset</SecondaryButton>
          <PrimaryButton
            accent={ACCENT}
            disabled={items.some((item) => !item.activity.trim() || !item.lastDone) || selectedCount !== 2 || items.filter((item) => item.selected).some((item) => !item.miniVersion.trim() || !item.when.trim())}
            onClick={() => {
              appendToStorage('aiforj_re_engagement_plan', {
                items,
                createdAt: new Date().toISOString(),
              });
              onComplete();
            }}
          >
            Save plan
          </PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
