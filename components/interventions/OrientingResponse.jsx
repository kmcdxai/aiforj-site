"use client";

import { useState } from 'react';
import { InterventionShell, PrimaryButton, StepDots, shellStyles } from './shared';

const ACCENT = '#C4856C';

export default function OrientingResponse({ onComplete }) {
  const [items, setItems] = useState(['', '', '']);
  const [feet, setFeet] = useState(false);

  return (
    <InterventionShell center maxWidth={720}>
      <div style={{ ...shellStyles.card, textAlign: 'center' }}>
        <StepDots currentStep={2} totalSteps={2} accent={ACCENT} label="Orienting Response" />
        <h2 style={shellStyles.heading}>Your nervous system thinks you&apos;re in danger. Let&apos;s show it you&apos;re safe.</h2>
        <p style={{ ...shellStyles.body, marginTop: 14 }}>Slowly turn your head and look around the room. Take your time. Name three things you can see.</p>
        <div style={{ display: 'grid', gap: 10, marginTop: 20 }}>
          {items.map((value, index) => (
            <input
              key={index}
              value={value}
              onChange={(event) => {
                const next = [...items];
                next[index] = event.target.value;
                setItems(next);
              }}
              placeholder={`Thing ${index + 1}`}
              style={shellStyles.textInput}
            />
          ))}
        </div>
        <label style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center', marginTop: 18 }}>
          <input type="checkbox" checked={feet} onChange={(event) => setFeet(event.target.checked)} />
          Press your feet firmly into the floor.
        </label>
        <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
          <PrimaryButton accent={ACCENT} disabled={items.some((item) => !item.trim())} onClick={onComplete}>Finish</PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
