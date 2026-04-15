"use client";

import { useState } from 'react';
import { InterventionShell, PrimaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#9B8EC4';

export default function TheOneThing({ onComplete }) {
  const [thing, setThing] = useState('');
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <InterventionShell center maxWidth={620}>
        <div style={{ ...shellStyles.card, textAlign: 'center' }}>
          <StepDots currentStep={2} totalSteps={2} accent={ACCENT} label="One thing chosen" />
          <h2 style={shellStyles.heading}>You cut through the noise.</h2>
          <p style={{ ...shellStyles.body, marginTop: 14 }}>
            In a world of a hundred demands, you chose <strong style={{ color: 'var(--text-primary)' }}>{thing}</strong>.
            That is not small.
          </p>
          <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
            <PrimaryButton accent={ACCENT} onClick={onComplete}>Finish</PrimaryButton>
          </div>
        </div>
      </InterventionShell>
    );
  }

  return (
    <InterventionShell center maxWidth={620}>
      <div style={{ ...shellStyles.card, textAlign: 'center' }}>
        <StepDots currentStep={1} totalSteps={2} accent={ACCENT} label="Solution-Focused Reset" />
        <h2 style={shellStyles.heading}>If you could only do one thing in the next hour, what would it be?</h2>
        <input
          value={thing}
          onChange={(event) => setThing(event.target.value)}
          placeholder="The one thing that matters right now"
          style={{ ...shellStyles.textInput, marginTop: 24, textAlign: 'center' }}
        />
        {thing.trim() ? (
          <div
            style={{
              marginTop: 28,
              padding: '36px 20px',
              borderRadius: 28,
              background: 'rgba(155, 142, 196, 0.1)',
              border: '1px solid rgba(155, 142, 196, 0.18)',
            }}
          >
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(32px, 6vw, 52px)', lineHeight: 1.1, color: 'var(--text-primary)' }}>
              {thing}
            </div>
          </div>
        ) : null}
        <p style={{ ...shellStyles.body, marginTop: 18 }}>Everything else waits. Now do that one thing.</p>
        <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
          <PrimaryButton
            accent={ACCENT}
            disabled={!thing.trim()}
            onClick={() => {
              appendToStorage('aiforj_one_thing', { thing, createdAt: new Date().toISOString() });
              setDone(true);
            }}
          >
            Done
          </PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
