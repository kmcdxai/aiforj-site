"use client";

import { useEffect, useMemo, useState } from 'react';
import CrisisBanner from './CrisisBanner';
import { ChoiceCard, InterventionShell, PrimaryButton, SecondaryButton, StepDots, shellStyles } from './shared';

const ACCENT = '#C47A8A';
const OPTIONS = [
  'Count backwards from 100 by 7s',
  'Hold ice or use cold water',
  'Play the loudest song you know',
  'Write everything you are feeling',
  'Reach out for support',
];

export default function DelayDistract({ onComplete }) {
  const [seconds, setSeconds] = useState(600);
  const [started, setStarted] = useState(false);
  const [choice, setChoice] = useState('');
  const [startUrge, setStartUrge] = useState(8);
  const [endUrge, setEndUrge] = useState(8);
  const finished = started && seconds <= 0;

  useEffect(() => {
    if (!started || seconds <= 0) return undefined;
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds, started]);

  const formatted = useMemo(() => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`, [seconds]);

  return (
    <InterventionShell maxWidth={760}>
      <div style={shellStyles.card}>
        <CrisisBanner />
        <StepDots currentStep={finished ? 3 : started ? 2 : 1} totalSteps={3} accent={ACCENT} label="Delay & Distract" />
        {!started ? (
          <>
            <h2 style={shellStyles.heading}>Can you wait 10 minutes before acting on this?</h2>
            <label style={shellStyles.label}>Urge now: {startUrge}/10</label>
            <input type="range" min="1" max="10" value={startUrge} onChange={(event) => setStartUrge(Number(event.target.value))} style={{ marginTop: 10, width: '100%', accentColor: ACCENT }} />
            <div style={{ display: 'grid', gap: 10, marginTop: 20 }}>
              {OPTIONS.map((item) => (
                <ChoiceCard key={item} selected={choice === item} accent={ACCENT} onClick={() => setChoice(item)}>
                  {item}
                </ChoiceCard>
              ))}
            </div>
            {choice === 'Reach out for support' ? (
              <div style={{ ...shellStyles.card, marginTop: 18, background: 'rgba(196, 122, 138, 0.08)' }}>
                <p style={{ ...shellStyles.body, margin: 0 }}>Call or text 988, text HOME to 741741, or contact someone you trust right now.</p>
              </div>
            ) : null}
            <div style={shellStyles.buttonRow}>
              <PrimaryButton accent={ACCENT} disabled={!choice} onClick={() => setStarted(true)}>Start 10-minute wait</PrimaryButton>
            </div>
          </>
        ) : null}
        {started && !finished ? (
          <>
            <h2 style={shellStyles.heading}>Stay with the wait.</h2>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 64, color: ACCENT, marginTop: 12 }}>{formatted}</div>
            <p style={{ ...shellStyles.body, marginTop: 12 }}>Chosen distraction: {choice}</p>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setSeconds(0)}>Skip ahead</SecondaryButton>
            </div>
          </>
        ) : null}
        {finished ? (
          <>
            <h2 style={shellStyles.heading}>You made it 10 minutes.</h2>
            <label style={shellStyles.label}>Urge now: {endUrge}/10</label>
            <input type="range" min="1" max="10" value={endUrge} onChange={(event) => setEndUrge(Number(event.target.value))} style={{ marginTop: 10, width: '100%', accentColor: ACCENT }} />
            <div style={{ ...shellStyles.card, marginTop: 18, background: 'rgba(196, 122, 138, 0.08)' }}>
              <p style={{ ...shellStyles.body, margin: 0 }}>You started at {startUrge} and now you are at {endUrge}. Time is an intervention.</p>
            </div>
            <div style={shellStyles.buttonRow}>
              <PrimaryButton accent={ACCENT} onClick={onComplete}>Finish</PrimaryButton>
            </div>
          </>
        ) : null}
      </div>
    </InterventionShell>
  );
}
