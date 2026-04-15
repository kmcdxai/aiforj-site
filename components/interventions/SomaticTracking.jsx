"use client";

import { useState } from 'react';
import { ChoiceCard, InterventionShell, PrimaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#8A8078';
const REGIONS = ['Head', 'Throat', 'Chest', 'Stomach', 'Pelvis', 'Legs', 'Feet'];
const SENSATIONS = ['Heavy', 'Light', 'Warm', 'Cold', 'Tingling', 'Tight', 'Empty', 'Pressure', 'Nothing', 'Pulsing'];

export default function SomaticTracking({ onComplete }) {
  const [map, setMap] = useState({});

  return (
    <InterventionShell maxWidth={900}>
      <div style={shellStyles.card}>
        <StepDots currentStep={Object.keys(map).length ? 2 : 1} totalSteps={2} accent={ACCENT} label="Somatic Tracking" />
        <h2 style={shellStyles.heading}>Scan each region for sensations, not emotions.</h2>
        <div style={{ display: 'grid', gap: 18, marginTop: 24 }}>
          {REGIONS.map((region) => (
            <div key={region} style={{ ...shellStyles.card, padding: '18px 18px', background: 'var(--surface)' }}>
              <strong>{region}</strong>
              <div style={{ display: 'grid', gap: 8, marginTop: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}>
                {SENSATIONS.map((sensation) => (
                  <ChoiceCard
                    key={sensation}
                    selected={map[region] === sensation}
                    accent={ACCENT}
                    onClick={() => setMap((current) => ({ ...current, [region]: sensation }))}
                    style={{ padding: '12px 12px' }}
                  >
                    {sensation}
                  </ChoiceCard>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={shellStyles.buttonRow}>
          <PrimaryButton
            accent={ACCENT}
            disabled={REGIONS.some((region) => !map[region])}
            onClick={() => {
              appendToStorage('aiforj_somatic_tracking', {
                map,
                createdAt: new Date().toISOString(),
              });
              onComplete();
            }}
          >
            Finish map
          </PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
