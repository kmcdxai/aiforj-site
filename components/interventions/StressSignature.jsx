"use client";

import { useMemo, useState } from 'react';
import { ChoiceCard, InterventionShell, PrimaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#D4A843';
const DOMAINS = {
  Physical: ['Headaches', 'Jaw clenching', 'Shoulder tension', 'Stomach issues', 'Fatigue', 'Insomnia', 'Appetite changes', 'Racing heart'],
  Cognitive: ['Racing thoughts', 'Difficulty concentrating', 'Forgetfulness', 'Indecisiveness', 'Catastrophizing', 'Mental fog'],
  Emotional: ['Irritability', 'Anxiety', 'Tearfulness', 'Numbness', 'Overwhelm', 'Guilt'],
  Behavioral: ['Snapping at people', 'Avoiding tasks', 'Overeating or undereating', 'Social withdrawal', 'Working more', 'Procrastinating'],
};

export default function StressSignature({ onComplete }) {
  const [selected, setSelected] = useState({});
  const allSelected = useMemo(() => Object.entries(selected).flatMap(([domain, items]) => items.map((item) => `${domain}: ${item}`)), [selected]);

  const toggle = (domain, item) => {
    setSelected((current) => {
      const items = current[domain] || [];
      return {
        ...current,
        [domain]: items.includes(item) ? items.filter((value) => value !== item) : [...items, item],
      };
    });
  };

  const earlySignals = allSelected.slice(0, 3);

  return (
    <InterventionShell maxWidth={880}>
      <div style={shellStyles.card}>
        <StepDots currentStep={allSelected.length ? 2 : 1} totalSteps={2} accent={ACCENT} label="Stress Signature Analysis" />
        <h2 style={shellStyles.heading}>Find your stress signature.</h2>
        <div style={{ display: 'grid', gap: 18, marginTop: 24 }}>
          {Object.entries(DOMAINS).map(([domain, items]) => (
            <div key={domain} style={{ ...shellStyles.card, padding: '18px 18px', background: 'var(--surface)' }}>
              <strong>{domain}</strong>
              <div style={{ display: 'grid', gap: 8, marginTop: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                {items.map((item) => (
                  <ChoiceCard key={item} selected={(selected[domain] || []).includes(item)} accent={ACCENT} onClick={() => toggle(domain, item)} style={{ padding: '12px 12px' }}>
                    {item}
                  </ChoiceCard>
                ))}
              </div>
            </div>
          ))}
        </div>
        {allSelected.length ? (
          <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(212, 168, 67, 0.08)' }}>
            <strong style={{ display: 'block', marginBottom: 10 }}>Your early warning system</strong>
            <p style={{ ...shellStyles.body, margin: 0 }}>
              When you notice {earlySignals.join(', ')}, you are already getting close to a 6/10. Intervene before burnout.
            </p>
          </div>
        ) : null}
        <div style={shellStyles.buttonRow}>
          <PrimaryButton
            accent={ACCENT}
            disabled={!allSelected.length}
            onClick={() => {
              appendToStorage('aiforj_stress_signature', {
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
