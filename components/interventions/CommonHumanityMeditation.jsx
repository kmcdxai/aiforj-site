"use client";

import { useEffect, useState } from 'react';
import { InterventionShell, PrimaryButton, StepDots, shellStyles } from './shared';

const ACCENT = '#6B98B8';
const LINES = [
  { text: 'Close your eyes if comfortable.', duration: 5 },
  { text: 'Right now, someone in your city is also feeling lonely.', duration: 8 },
  { text: 'Thousands of people are lying awake right now, wishing for connection.', duration: 8 },
  { text: 'Loneliness is not a flaw. It is a signal that connection matters to you.', duration: 8 },
  { text: "Silently wish: 'May all of us who feel alone tonight find connection.'", duration: 10 },
  { text: "Now include yourself: 'May I find the connection I need.'", duration: 10 },
];

export default function CommonHumanityMeditation({ onComplete }) {
  const [index, setIndex] = useState(0);
  const [seconds, setSeconds] = useState(LINES[0].duration);

  useEffect(() => {
    if (index >= LINES.length) return undefined;
    if (seconds <= 0) {
      if (index === LINES.length - 1) return undefined;
      setIndex((value) => value + 1);
      setSeconds(LINES[index + 1].duration);
      return undefined;
    }
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [index, seconds]);

  const completed = index === LINES.length - 1 && seconds <= 0;

  return (
    <InterventionShell center maxWidth={720}>
      <div style={{ ...shellStyles.card, textAlign: 'center' }}>
        <StepDots currentStep={completed ? 2 : 1} totalSteps={2} accent={ACCENT} label="Common Humanity Meditation" />
        {!completed ? (
          <>
            <h2 style={shellStyles.heading}>You are not the only one.</h2>
            <div style={{ marginTop: 24, minHeight: 140, display: 'grid', placeItems: 'center' }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(28px, 4vw, 40px)', lineHeight: 1.35 }}>
                {LINES[index].text}
              </div>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, color: ACCENT }}>{seconds}s</div>
          </>
        ) : (
          <>
            <h2 style={shellStyles.heading}>Open your eyes.</h2>
            <p style={{ ...shellStyles.body, marginTop: 16 }}>Loneliness is one of the most universal human experiences. You are not the only one.</p>
            <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
              <PrimaryButton accent={ACCENT} onClick={onComplete}>Finish</PrimaryButton>
            </div>
          </>
        )}
      </div>
    </InterventionShell>
  );
}
