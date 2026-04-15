"use client";

import { useState } from 'react';
import { InterventionShell, PrimaryButton, SecondaryButton, StepDots, shellStyles } from './shared';

const ACCENT = '#9B8EC4';

export default function GriefWave({ onComplete }) {
  const [mode, setMode] = useState('');

  return (
    <InterventionShell center maxWidth={700}>
      <div style={{ ...shellStyles.card, textAlign: 'center' }}>
        <StepDots currentStep={mode ? 2 : 1} totalSteps={2} accent={ACCENT} label="Grief Wave" />
        <h2 style={shellStyles.heading}>Grief comes in waves, not stages.</h2>
        <div style={{ marginTop: 28, height: 160, borderRadius: 28, overflow: 'hidden', background: 'linear-gradient(180deg, rgba(155, 142, 196, 0.08), rgba(107, 152, 184, 0.12))', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: '46% -10% 0', borderTopLeftRadius: '50% 80%', borderTopRightRadius: '50% 80%', background: 'rgba(155, 142, 196, 0.42)' }} />
          <div style={{ position: 'absolute', inset: '54% -6% 0', borderTopLeftRadius: '50% 90%', borderTopRightRadius: '50% 90%', background: 'rgba(107, 152, 184, 0.38)' }} />
        </div>
        <p style={{ ...shellStyles.body, marginTop: 20 }}>You have survived every wave so far. This one will also pass.</p>
        {mode ? (
          <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(155, 142, 196, 0.08)' }}>
            <p style={{ ...shellStyles.body, margin: 0 }}>
              {mode === 'sit'
                ? 'Sit with it for a minute. You do not have to fix this wave to survive it.'
                : 'Let yourself hold onto one memory or bond rather than trying to outrun the grief.'}
            </p>
          </div>
        ) : null}
        <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
          <SecondaryButton onClick={() => setMode('sit')}>Just sit with it</SecondaryButton>
          <PrimaryButton accent={ACCENT} onClick={() => setMode('hold')}>Something to hold onto</PrimaryButton>
        </div>
        <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
          <PrimaryButton accent={ACCENT} disabled={!mode} onClick={onComplete}>Finish</PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
