"use client";

import { useState } from 'react';
import CrisisBanner from './CrisisBanner';
import { ChoiceCard, InterventionShell, PrimaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#C47A8A';
const VULNERABILITIES = ['Tired', 'Hungry', 'Lonely', 'Stressed', 'Emotionally raw', 'Triggered by something', 'Substances', 'Custom'];
const LINKS = ['Vulnerability factors', 'Triggering event', 'Thoughts', 'Emotions', 'Urge', 'Outcome'];

export default function TriggerChainAnalysis({ onComplete }) {
  const [selected, setSelected] = useState([]);
  const [custom, setCustom] = useState('');
  const [trigger, setTrigger] = useState('');
  const [thoughts, setThoughts] = useState('');
  const [emotions, setEmotions] = useState('');
  const [urge, setUrge] = useState('');
  const [outcome, setOutcome] = useState('');
  const [breakPoint, setBreakPoint] = useState('');

  const toggle = (item) => setSelected((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item]);

  return (
    <InterventionShell maxWidth={860}>
      <div style={shellStyles.card}>
        <CrisisBanner />
        <StepDots currentStep={2} totalSteps={2} accent={ACCENT} label="Trigger Chain Analysis" />
        <h2 style={shellStyles.heading}>Map the chain so you can interrupt it earlier next time.</h2>
        <div style={{ display: 'grid', gap: 10, marginTop: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
          {VULNERABILITIES.map((item) => (
            <ChoiceCard key={item} selected={selected.includes(item)} accent={ACCENT} onClick={() => toggle(item)}>
              {item}
            </ChoiceCard>
          ))}
        </div>
        {selected.includes('Custom') ? <input value={custom} onChange={(event) => setCustom(event.target.value)} placeholder="Custom vulnerability factor" style={{ ...shellStyles.textInput, marginTop: 14 }} /> : null}
        <textarea value={trigger} onChange={(event) => setTrigger(event.target.value)} placeholder="Triggering event" style={{ ...shellStyles.textarea, marginTop: 14, minHeight: 100 }} />
        <textarea value={thoughts} onChange={(event) => setThoughts(event.target.value)} placeholder="Thoughts after the trigger" style={{ ...shellStyles.textarea, marginTop: 14, minHeight: 100 }} />
        <textarea value={emotions} onChange={(event) => setEmotions(event.target.value)} placeholder="Emotions after" style={{ ...shellStyles.textarea, marginTop: 14, minHeight: 100 }} />
        <textarea value={urge} onChange={(event) => setUrge(event.target.value)} placeholder="What did you want to do?" style={{ ...shellStyles.textarea, marginTop: 14, minHeight: 100 }} />
        <textarea value={outcome} onChange={(event) => setOutcome(event.target.value)} placeholder="What actually happened, or what you want to prevent" style={{ ...shellStyles.textarea, marginTop: 14, minHeight: 100 }} />
        <div style={{ display: 'grid', gap: 10, marginTop: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
          {LINKS.map((item) => (
            <ChoiceCard key={item} selected={breakPoint === item} accent={ACCENT} onClick={() => setBreakPoint(item)}>
              Break at: {item}
            </ChoiceCard>
          ))}
        </div>
        <div style={{ ...shellStyles.card, marginTop: 18, background: 'rgba(196, 122, 138, 0.08)' }}>
          <p style={{ ...shellStyles.body, margin: 0 }}>Next time, the chain can be broken at {breakPoint || 'the point you choose'}.</p>
        </div>
        <div style={shellStyles.buttonRow}>
          <PrimaryButton
            accent={ACCENT}
            disabled={!trigger.trim() || !thoughts.trim() || !emotions.trim() || !urge.trim() || !outcome.trim() || !breakPoint}
            onClick={() => {
              appendToStorage('aiforj_trigger_chain_analysis', {
                selected,
                custom,
                trigger,
                thoughts,
                emotions,
                urge,
                outcome,
                breakPoint,
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
