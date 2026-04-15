"use client";

import { useMemo, useState } from 'react';
import { ChoiceCard, InterventionShell, PrimaryButton, SecondaryButton, StepDots, shellStyles } from './shared';

const ACCENT = '#8A8078';
const MUSIC = [
  'Something that made you cry once',
  'A song from a meaningful time in your life',
  'Something with raw emotional vocals',
  'An instrumental piece that builds to a crescendo',
  'A song that reminds you of someone you love',
];
const ART = [
  'A painting of solitude',
  'A photograph of connection',
  'Abstract art representing chaos',
  'A landscape that feels expansive',
  'An image that feels tender or longing',
];

export default function EmotionalPriming({ onComplete }) {
  const [tab, setTab] = useState('music');
  const [selected, setSelected] = useState('');
  const [result, setResult] = useState('');
  const options = useMemo(() => (tab === 'music' ? MUSIC : ART), [tab]);

  return (
    <InterventionShell maxWidth={760}>
      <div style={shellStyles.card}>
        <StepDots currentStep={selected ? 2 : 1} totalSteps={2} accent={ACCENT} label="Emotional Priming" />
        <h2 style={shellStyles.heading}>When thinking cannot reach feeling, art and music sometimes can.</h2>
        <div style={{ ...shellStyles.buttonRow, marginTop: 20 }}>
          <SecondaryButton onClick={() => { setTab('music'); setSelected(''); }}>Music</SecondaryButton>
          <SecondaryButton onClick={() => { setTab('art'); setSelected(''); }}>Art</SecondaryButton>
        </div>
        <div style={{ display: 'grid', gap: 10, marginTop: 18 }}>
          {options.map((item) => (
            <ChoiceCard key={item} selected={selected === item} accent={ACCENT} onClick={() => setSelected(item)}>
              {item}
            </ChoiceCard>
          ))}
        </div>
        {selected ? (
          <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(138, 128, 120, 0.08)' }}>
            <p style={{ ...shellStyles.body, margin: 0 }}>
              {tab === 'music'
                ? 'Open your preferred music app and spend two minutes with this doorway.'
                : 'Search for a piece like this and stay with it for two minutes.'}
            </p>
          </div>
        ) : null}
        <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
          <SecondaryButton onClick={() => setResult('no')}>Nothing stirred</SecondaryButton>
          <PrimaryButton accent={ACCENT} onClick={() => setResult('yes')}>Something stirred</PrimaryButton>
        </div>
        {result ? (
          <div style={{ ...shellStyles.card, marginTop: 18, background: 'rgba(138, 128, 120, 0.08)' }}>
            <p style={{ ...shellStyles.body, margin: 0 }}>
              {result === 'yes'
                ? 'Even a lump in your throat or a heaviness counts. That is feeling returning.'
                : 'That is okay. Keep trying different sensory doorways. Numbness usually softens gradually.'}
            </p>
          </div>
        ) : null}
        <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
          <PrimaryButton accent={ACCENT} onClick={onComplete}>Finish</PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
