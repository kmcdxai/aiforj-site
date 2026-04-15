"use client";

import { useEffect, useState } from 'react';
import { InterventionShell, PrimaryButton, StepDots, formatSeconds, shellStyles } from './shared';

const ACCENT = '#9B8EC4';
const STEPS = [
  { text: "Close any browser tabs or apps you don't need right now.", seconds: 30 },
  { text: 'Dim your screen brightness by half.', seconds: 30 },
  { text: 'Remove one source of noise if you can: close a door, mute notifications, shift rooms.', seconds: 30 },
  { text: 'For 60 seconds, just listen. Do not hunt for meaning. Just hear.', seconds: 60 },
  { text: 'For 60 seconds, just feel: feet on floor, chair beneath you, temperature of the air.', seconds: 60 },
];

export default function SensoryReset({ onComplete }) {
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(STEPS[0].seconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return undefined;
    const timer = window.setTimeout(() => {
      setRemaining((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [running, remaining]);

  useEffect(() => {
    if (running && remaining === 0) {
      setRunning(false);
    }
  }, [running, remaining]);

  const step = STEPS[index];

  const next = () => {
    if (index === STEPS.length - 1) {
      onComplete();
      return;
    }
    setIndex((current) => current + 1);
    setRemaining(STEPS[index + 1].seconds);
    setRunning(false);
  };

  return (
    <InterventionShell center maxWidth={620}>
      <div style={{ ...shellStyles.card, textAlign: 'center' }}>
        <StepDots currentStep={index + 1} totalSteps={STEPS.length} accent={ACCENT} label="Sensory Reset" />
        <h2 style={shellStyles.heading}>Strip away the noise, layer by layer.</h2>
        <p style={{ ...shellStyles.body, marginTop: 14 }}>{step.text}</p>
        <div style={{ marginTop: 24, fontFamily: "'JetBrains Mono', monospace", fontSize: 36, color: ACCENT }}>
          {formatSeconds(remaining)}
        </div>
        <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
          <PrimaryButton accent={ACCENT} onClick={() => setRunning((current) => !current)}>
            {running ? 'Pause' : 'Start timer'}
          </PrimaryButton>
          <PrimaryButton accent={ACCENT} onClick={next} disabled={remaining > 0}>
            {index === STEPS.length - 1 ? 'Finish' : 'Next step'}
          </PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
