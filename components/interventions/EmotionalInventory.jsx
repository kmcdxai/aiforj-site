"use client";

import { useState } from 'react';
import { ChoiceCard, InterventionShell, PrimaryButton, StepDots, shellStyles } from './shared';

const ACCENT = '#8A8078';
const EMOTIONS = ['Sad', 'Angry', 'Scared', 'Disgusted', 'Surprised', 'Happy', 'Ashamed', 'Numb'];

export default function EmotionalInventory({ onComplete }) {
  const [selected, setSelected] = useState([]);
  const [ratings, setRatings] = useState({});

  const toggle = (emotion) => {
    setSelected((current) => (current.includes(emotion) ? current.filter((item) => item !== emotion) : [...current, emotion]));
  };

  return (
    <InterventionShell maxWidth={760}>
      <div style={shellStyles.card}>
        <StepDots currentStep={selected.length ? 2 : 1} totalSteps={2} accent={ACCENT} label="Emotional Inventory" />
        <h2 style={shellStyles.heading}>Scan each emotion slowly. Does any of these register, even a flicker?</h2>
        <div style={{ display: 'grid', gap: 10, marginTop: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
          {EMOTIONS.map((emotion) => (
            <ChoiceCard key={emotion} selected={selected.includes(emotion)} accent={ACCENT} onClick={() => toggle(emotion)}>
              {emotion}
            </ChoiceCard>
          ))}
        </div>
        <div style={{ display: 'grid', gap: 14, marginTop: 20 }}>
          {selected.map((emotion) => (
            <div key={emotion}>
              <label style={shellStyles.label}>{emotion}: {ratings[emotion] || 1}/5</label>
              <input type="range" min="1" max="5" value={ratings[emotion] || 1} onChange={(event) => setRatings((current) => ({ ...current, [emotion]: Number(event.target.value) }))} style={{ width: '100%', accentColor: ACCENT, marginTop: 8 }} />
            </div>
          ))}
        </div>
        {selected.length ? (
          <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(138, 128, 120, 0.08)' }}>
            <p style={{ ...shellStyles.body, margin: 0 }}>
              There it is. Not nothing. Something. The numbness was hiding {selected.map((emotion) => `${emotion.toLowerCase()} (${ratings[emotion] || 1})`).join(', ')}.
            </p>
          </div>
        ) : null}
        <div style={shellStyles.buttonRow}>
          <PrimaryButton accent={ACCENT} onClick={onComplete}>Finish</PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
