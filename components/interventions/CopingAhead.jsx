"use client";

import { useState } from 'react';
import { ChoiceCard, InterventionShell, PrimaryButton, SecondaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#9B8EC4';
const EMOTIONS = ['Anxious', 'Overwhelmed', 'Scared', 'Sad', 'Angry', 'Numb', 'Shame', 'Lonely'];
const STRATEGIES = ['Take a bathroom break', 'Use a breathing technique', 'Text my support person', 'Use a mantra', 'Ground with 5-4-3-2-1', 'Set a time limit and leave after'];

export default function CopingAhead({ onComplete }) {
  const [step, setStep] = useState(1);
  const [situation, setSituation] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [worstMoment, setWorstMoment] = useState('');
  const [strategy, setStrategy] = useState('');
  const [customStrategy, setCustomStrategy] = useState('');

  const toggleEmotion = (emotion) => {
    setSelectedEmotions((current) => current.includes(emotion) ? current.filter((item) => item !== emotion) : [...current, emotion]);
  };

  const finalStrategy = strategy === 'custom' ? customStrategy : strategy;

  return (
    <InterventionShell maxWidth={700}>
      <div style={shellStyles.card}>
        <StepDots currentStep={step} totalSteps={5} accent={ACCENT} label="DBT Coping Ahead" />
        {step === 1 ? (
          <>
            <h2 style={shellStyles.heading}>What upcoming situation are you dreading?</h2>
            <textarea value={situation} onChange={(event) => setSituation(event.target.value)} style={{ ...shellStyles.textarea, marginTop: 22 }} />
            <div style={shellStyles.buttonRow}>
              <PrimaryButton accent={ACCENT} disabled={!situation.trim()} onClick={() => setStep(2)}>Next</PrimaryButton>
            </div>
          </>
        ) : null}
        {step === 2 ? (
          <>
            <h2 style={shellStyles.heading}>What emotions will probably come up?</h2>
            <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', marginTop: 22 }}>
              {EMOTIONS.map((emotion) => (
                <ChoiceCard key={emotion} selected={selectedEmotions.includes(emotion)} onClick={() => toggleEmotion(emotion)}>
                  {emotion}
                </ChoiceCard>
              ))}
            </div>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(1)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} disabled={!selectedEmotions.length} onClick={() => setStep(3)}>Next</PrimaryButton>
            </div>
          </>
        ) : null}
        {step === 3 ? (
          <>
            <h2 style={shellStyles.heading}>What is the worst moment likely to be?</h2>
            <textarea value={worstMoment} onChange={(event) => setWorstMoment(event.target.value)} style={{ ...shellStyles.textarea, marginTop: 22 }} />
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(2)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} disabled={!worstMoment.trim()} onClick={() => setStep(4)}>Next</PrimaryButton>
            </div>
          </>
        ) : null}
        {step === 4 ? (
          <>
            <h2 style={shellStyles.heading}>What coping strategy would help in that worst moment?</h2>
            <div style={{ display: 'grid', gap: 10, marginTop: 22 }}>
              {STRATEGIES.map((item) => (
                <ChoiceCard key={item} selected={strategy === item} onClick={() => setStrategy(item)}>{item}</ChoiceCard>
              ))}
              <ChoiceCard selected={strategy === 'custom'} onClick={() => setStrategy('custom')}>Custom strategy</ChoiceCard>
            </div>
            {strategy === 'custom' ? (
              <input value={customStrategy} onChange={(event) => setCustomStrategy(event.target.value)} placeholder="Write your custom strategy" style={{ ...shellStyles.textInput, marginTop: 16 }} />
            ) : null}
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(3)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} disabled={!finalStrategy.trim()} onClick={() => setStep(5)}>Build coping card</PrimaryButton>
            </div>
          </>
        ) : null}
        {step === 5 ? (
          <>
            <h2 style={shellStyles.heading}>Your coping card is ready.</h2>
            <div style={{ ...shellStyles.card, marginTop: 22, background: 'rgba(155, 142, 196, 0.08)' }}>
              <p style={{ ...shellStyles.body, marginBottom: 10 }}><strong>Situation:</strong> {situation}</p>
              <p style={{ ...shellStyles.body, marginBottom: 10 }}><strong>Expected emotions:</strong> {selectedEmotions.join(', ')}</p>
              <p style={{ ...shellStyles.body, marginBottom: 10 }}><strong>Worst moment:</strong> {worstMoment}</p>
              <p style={{ ...shellStyles.body, margin: 0 }}><strong>Plan:</strong> {finalStrategy}</p>
            </div>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(4)}>Back</SecondaryButton>
              <PrimaryButton
                accent={ACCENT}
                onClick={() => {
                  appendToStorage('aiforj_coping_ahead', {
                    situation,
                    selectedEmotions,
                    worstMoment,
                    strategy: finalStrategy,
                    createdAt: new Date().toISOString(),
                  });
                  onComplete();
                }}
              >
                Finish
              </PrimaryButton>
            </div>
          </>
        ) : null}
      </div>
    </InterventionShell>
  );
}
