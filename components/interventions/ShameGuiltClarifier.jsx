"use client";

import { useMemo, useState } from 'react';
import { ChoiceCard, InterventionShell, PrimaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#C47A8A';
const OPTIONS = {
  shame: {
    title: 'Shame',
    statement: 'I am bad.',
    body: 'Toxic. Leads to hiding, self-loathing, and isolation.',
    recommendation: 'Shame says you are defective. That is a lie. What you need is compassion, not punishment.',
    next: 'Try the Self-Compassion Break next.',
  },
  guilt: {
    title: 'Guilt',
    statement: 'I did something bad.',
    body: 'Useful signal. Leads to repair, growth, and change.',
    recommendation: 'Guilt says you can do better. That can be useful information.',
    next: 'Turn it into action with the Guilt -> Repair Action Plan.',
  },
  both: {
    title: 'Both',
    statement: 'I feel both shame and guilt.',
    body: 'You can feel both. Shame needs defusing before guilt becomes productive.',
    recommendation: 'Address the shame first so the guilt can become a repair signal instead of a global attack on who you are.',
    next: 'Start with compassion, then move into a repair plan.',
  },
};

export default function ShameGuiltClarifier({ onComplete }) {
  const [selected, setSelected] = useState('');
  const option = useMemo(() => (selected ? OPTIONS[selected] : null), [selected]);

  return (
    <InterventionShell maxWidth={720}>
      <div style={shellStyles.card}>
        <StepDots currentStep={option ? 2 : 1} totalSteps={2} accent={ACCENT} label="Shame / Guilt Clarifier" />
        <h2 style={shellStyles.heading}>Which are you feeling right now?</h2>
        <div style={{ display: 'grid', gap: 14, marginTop: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          {Object.entries(OPTIONS).map(([key, item]) => (
            <ChoiceCard key={key} selected={selected === key} accent={ACCENT} onClick={() => setSelected(key)}>
              <div style={{ display: 'grid', gap: 10 }}>
                <strong style={{ fontSize: 18 }}>{item.title}</strong>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, color: 'var(--text-primary)' }}>{item.statement}</div>
                <p style={{ ...shellStyles.body, fontSize: 14 }}>{item.body}</p>
              </div>
            </ChoiceCard>
          ))}
        </div>

        {option ? (
          <div style={{ ...shellStyles.card, marginTop: 22, background: 'rgba(196, 122, 138, 0.08)', borderColor: 'rgba(196, 122, 138, 0.18)' }}>
            <p style={shellStyles.body}>{option.recommendation}</p>
            <p style={{ ...shellStyles.body, marginTop: 12, color: 'var(--text-primary)', fontWeight: 700 }}>{option.next}</p>
          </div>
        ) : null}

        <div style={shellStyles.buttonRow}>
          <PrimaryButton
            accent={ACCENT}
            disabled={!selected}
            onClick={() => {
              appendToStorage('aiforj_shame_guilt_clarifier', {
                selected,
                createdAt: new Date().toISOString(),
              });
              onComplete();
            }}
          >
            Finish
          </PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
