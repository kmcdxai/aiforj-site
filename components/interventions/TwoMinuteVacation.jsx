"use client";

import { useMemo, useState } from 'react';
import { ChoiceCard, InterventionShell, PrimaryButton, SecondaryButton, StepDots, shellStyles } from './shared';

const ACCENT = '#D4A843';
const SCENES = {
  beach: { emoji: '🏖️', title: 'Beach', prompts: ['See warm sand and gentle waves.', 'Hear the water rolling in and back out.', 'Feel sun on your skin and air moving softly.', 'Breathe in the salt air.'] },
  forest: { emoji: '🌲', title: 'Forest', prompts: ['See pine trees and dappled light.', 'Hear birds and leaves moving.', 'Feel cool air and steady ground.', 'Breathe in the scent of earth and pine.'] },
  mountain: { emoji: '🏔️', title: 'Mountain', prompts: ['See the wide view opening up.', 'Hear quiet, wind, and distance.', 'Feel cool air and open space.', 'Breathe in the crisp air.'] },
  rain: { emoji: '🌧️', title: 'Rainy Window', prompts: ['See rain tracing the glass.', 'Hear rain and the hush of indoors.', 'Feel warmth inside and stillness.', 'Breathe in tea, fabric, and shelter.'] },
};

export default function TwoMinuteVacation({ onComplete }) {
  const [sceneId, setSceneId] = useState('');
  const [index, setIndex] = useState(0);
  const scene = useMemo(() => (sceneId ? SCENES[sceneId] : null), [sceneId]);
  const finished = scene && index >= scene.prompts.length;

  return (
    <InterventionShell center maxWidth={760}>
      <div style={{ ...shellStyles.card, textAlign: 'center' }}>
        <StepDots currentStep={scene ? Math.min(index + 2, 5) : 1} totalSteps={5} accent={ACCENT} label="2-Minute Vacation" />
        {!scene ? (
          <>
            <h2 style={shellStyles.heading}>Pick your escape.</h2>
            <div style={{ display: 'grid', gap: 12, marginTop: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
              {Object.entries(SCENES).map(([key, item]) => (
                <ChoiceCard key={key} selected={sceneId === key} accent={ACCENT} onClick={() => setSceneId(key)}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{item.emoji}</div>
                  <strong>{item.title}</strong>
                </ChoiceCard>
              ))}
            </div>
          </>
        ) : finished ? (
          <>
            <div style={{ fontSize: 48 }}>{scene.emoji}</div>
            <h2 style={shellStyles.heading}>Welcome back.</h2>
            <p style={{ ...shellStyles.body, marginTop: 14 }}>Your nervous system just got a short break. These micro-vacations matter.</p>
            <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
              <PrimaryButton accent={ACCENT} onClick={onComplete}>Finish</PrimaryButton>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 48 }}>{scene.emoji}</div>
            <h2 style={shellStyles.heading}>{scene.title}</h2>
            <div style={{ marginTop: 20, minHeight: 120, display: 'grid', placeItems: 'center' }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(28px, 4vw, 40px)', lineHeight: 1.35 }}>
                {scene.prompts[index]}
              </div>
            </div>
            <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
              <SecondaryButton onClick={() => setIndex((value) => Math.max(0, value - 1))} disabled={index === 0}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} onClick={() => setIndex((value) => value + 1)}>
                {index === scene.prompts.length - 1 ? 'Return' : 'Next sense'}
              </PrimaryButton>
            </div>
          </>
        )}
      </div>
    </InterventionShell>
  );
}
