"use client";

import { useMemo, useState } from 'react';
import { ChoiceCard, InterventionShell, PrimaryButton, SecondaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#9B8EC4';
const VALUES = ['Kindness', 'Courage', 'Curiosity', 'Joy', 'Generosity', 'Creativity', 'Perseverance', 'Love', 'Humor', 'Integrity', 'Custom'];
const ACTIONS = ['Plant something', 'Donate to a cause they cared about', 'Teach someone what they taught you', 'Create a tradition in their honor', 'Write their story', 'Custom'];

export default function LivingLegacy({ onComplete }) {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [customValue, setCustomValue] = useState('');
  const [action, setAction] = useState('');
  const [customAction, setCustomAction] = useState('');
  const [timeline, setTimeline] = useState('');

  const resolvedValue = value === 'Custom' ? customValue.trim() : value;
  const resolvedAction = action === 'Custom' ? customAction.trim() : action;
  const card = useMemo(
    () => (name && resolvedValue && resolvedAction && timeline
      ? `In honor of ${name}, who embodied ${resolvedValue}, I will ${resolvedAction} by ${timeline}.`
      : ''),
    [name, resolvedAction, resolvedValue, timeline]
  );

  return (
    <InterventionShell maxWidth={820}>
      <div style={shellStyles.card}>
        <StepDots currentStep={card ? 3 : action ? 2 : 1} totalSteps={3} accent={ACCENT} label="Living Legacy" />
        <h2 style={shellStyles.heading}>What value did the person or thing you lost embody?</h2>
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name or what was lost" style={{ ...shellStyles.textInput, marginTop: 20 }} />
        <div style={{ display: 'grid', gap: 10, marginTop: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
          {VALUES.map((item) => (
            <ChoiceCard key={item} selected={value === item} accent={ACCENT} onClick={() => setValue(item)}>
              {item}
            </ChoiceCard>
          ))}
        </div>
        {value === 'Custom' ? <input value={customValue} onChange={(event) => setCustomValue(event.target.value)} placeholder="Custom value" style={{ ...shellStyles.textInput, marginTop: 14 }} /> : null}
        <h3 style={{ ...shellStyles.subheading, marginTop: 24 }}>How could you carry that value forward?</h3>
        <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
          {ACTIONS.map((item) => (
            <ChoiceCard key={item} selected={action === item} accent={ACCENT} onClick={() => setAction(item)}>
              {item}
            </ChoiceCard>
          ))}
        </div>
        {action === 'Custom' ? <input value={customAction} onChange={(event) => setCustomAction(event.target.value)} placeholder="Custom action" style={{ ...shellStyles.textInput, marginTop: 14 }} /> : null}
        <input value={timeline} onChange={(event) => setTimeline(event.target.value)} placeholder="When will you do this?" style={{ ...shellStyles.textInput, marginTop: 14 }} />
        {card ? (
          <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(155, 142, 196, 0.08)' }}>
            <p style={{ ...shellStyles.body, margin: 0 }}>{card}</p>
          </div>
        ) : null}
        <div style={shellStyles.buttonRow}>
          <SecondaryButton onClick={() => { setValue(''); setAction(''); setTimeline(''); }}>Reset</SecondaryButton>
          <PrimaryButton
            accent={ACCENT}
            disabled={!card}
            onClick={() => {
              appendToStorage('aiforj_living_legacy', {
                name,
                value: resolvedValue,
                action: resolvedAction,
                timeline,
                createdAt: new Date().toISOString(),
              });
              onComplete();
            }}
          >
            Save legacy plan
          </PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
