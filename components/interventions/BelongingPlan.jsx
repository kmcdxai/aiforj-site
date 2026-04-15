"use client";

import { useMemo, useState } from 'react';
import { ChoiceCard, InterventionShell, PrimaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#6B98B8';
const VALUES = ['Fitness', 'Creativity', 'Service', 'Learning', 'Spirituality', 'Connection', 'Nature', 'Custom'];
const SUGGESTIONS = {
  Fitness: ['Gym classes', 'Running club', 'Hiking group'],
  Creativity: ['Art class', 'Writing group', 'Maker space'],
  Service: ['Volunteer organization', 'Mutual aid group', 'Mentoring'],
  Learning: ['Book club', 'Course cohort', 'Meetup'],
  Spirituality: ['Meditation group', 'Faith community', 'Philosophy circle'],
  Connection: ['Neighborhood event', 'Friend dinner', 'Community class'],
  Nature: ['Bird walk', 'Trail cleanup', 'Garden group'],
};
const BARRIERS = {
  "I won't know anyone": "That is true for everyone their first time. Introduce yourself to one person.",
  "What if I don't fit in": "You are not interviewing. You are exploring. Give it three tries before deciding.",
  "I don't have the energy": 'Go for just 20 minutes. Leave if it is not working.',
};

export default function BelongingPlan({ onComplete }) {
  const [selected, setSelected] = useState([]);
  const [customValue, setCustomValue] = useState('');
  const [action, setAction] = useState('');
  const [barrier, setBarrier] = useState('');
  const [date, setDate] = useState('');
  const resolved = selected.map((item) => (item === 'Custom' ? customValue.trim() : item)).filter(Boolean);
  const suggestions = useMemo(
    () => resolved.flatMap((value) => SUGGESTIONS[value] || []),
    [resolved]
  );

  const toggleValue = (value) => {
    setSelected((current) => (current.includes(value) ? current.filter((item) => item !== value) : current.length < 3 ? [...current, value] : current));
  };

  return (
    <InterventionShell maxWidth={820}>
      <div style={shellStyles.card}>
        <StepDots currentStep={resolved.length ? 2 : 1} totalSteps={2} accent={ACCENT} label="Belonging Action Plan" />
        <h2 style={shellStyles.heading}>What three values or interests matter to you?</h2>
        <div style={{ display: 'grid', gap: 10, marginTop: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
          {VALUES.map((value) => (
            <ChoiceCard key={value} selected={selected.includes(value)} accent={ACCENT} onClick={() => toggleValue(value)}>
              {value}
            </ChoiceCard>
          ))}
        </div>
        {selected.includes('Custom') ? <input value={customValue} onChange={(event) => setCustomValue(event.target.value)} placeholder="Custom value or interest" style={{ ...shellStyles.textInput, marginTop: 14 }} /> : null}
        {resolved.length ? (
          <>
            <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(107, 152, 184, 0.08)' }}>
              <strong style={{ display: 'block', marginBottom: 10 }}>Community ideas</strong>
              <ul style={{ margin: '0 0 0 18px', lineHeight: 1.8 }}>
                {suggestions.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <input value={action} onChange={(event) => setAction(event.target.value)} placeholder="Pick one to explore this week" style={{ ...shellStyles.textInput, marginTop: 16 }} />
            <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
              {Object.keys(BARRIERS).map((item) => (
                <ChoiceCard key={item} selected={barrier === item} accent={ACCENT} onClick={() => setBarrier(item)}>
                  {item}
                </ChoiceCard>
              ))}
            </div>
            <input value={date} onChange={(event) => setDate(event.target.value)} placeholder="When?" style={{ ...shellStyles.textInput, marginTop: 14 }} />
            {action && barrier && date ? (
              <div style={{ ...shellStyles.card, marginTop: 18, background: 'rgba(107, 152, 184, 0.08)' }}>
                <p style={{ ...shellStyles.body, margin: 0 }}>
                  This week I will <strong style={{ color: 'var(--text-primary)' }}>{action}</strong> by <strong style={{ color: 'var(--text-primary)' }}>{date}</strong>.
                </p>
                <p style={{ ...shellStyles.body, marginTop: 10 }}>{BARRIERS[barrier]}</p>
              </div>
            ) : null}
          </>
        ) : null}
        <div style={shellStyles.buttonRow}>
          <PrimaryButton
            accent={ACCENT}
            disabled={!resolved.length || !action.trim() || !barrier || !date.trim()}
            onClick={() => {
              appendToStorage('aiforj_belonging_plan', {
                values: resolved,
                action,
                barrier,
                date,
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
