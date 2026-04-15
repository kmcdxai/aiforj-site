"use client";

import { useState } from 'react';
import { InterventionShell, PrimaryButton, SecondaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#C47A8A';

export default function InnerCriticCoach({ onComplete }) {
  const [step, setStep] = useState(1);
  const [critic, setCritic] = useState('');
  const [coach, setCoach] = useState('');
  const [chosen, setChosen] = useState('');

  return (
    <InterventionShell maxWidth={860}>
      <div style={shellStyles.card}>
        <StepDots currentStep={step} totalSteps={3} accent={ACCENT} label="Inner Critic vs Inner Coach" />

        {step === 1 ? (
          <>
            <h2 style={shellStyles.heading}>What is your inner critic saying right now?</h2>
            <textarea value={critic} onChange={(event) => setCritic(event.target.value)} style={{ ...shellStyles.textarea, marginTop: 24 }} />
            <div style={shellStyles.buttonRow}>
              <PrimaryButton accent={ACCENT} disabled={!critic.trim()} onClick={() => setStep(2)}>Build the coach</PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <h2 style={shellStyles.heading}>What would an inner coach say about the same situation?</h2>
            <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(196, 91, 91, 0.08)', borderColor: 'rgba(196, 91, 91, 0.18)' }}>
              <strong style={{ color: '#A64C4C' }}>Critic</strong>
              <p style={{ ...shellStyles.body, marginTop: 8 }}>{critic}</p>
            </div>
            <textarea
              value={coach}
              onChange={(event) => setCoach(event.target.value)}
              placeholder="A coach holds you accountable without demolishing you."
              style={{ ...shellStyles.textarea, marginTop: 20 }}
            />
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(1)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} disabled={!coach.trim()} onClick={() => setStep(3)}>Compare</PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <h2 style={shellStyles.heading}>Which voice will you listen to right now?</h2>
            <div style={{ display: 'grid', gap: 16, marginTop: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
              <button
                type="button"
                onClick={() => setChosen('critic')}
                style={{
                  ...shellStyles.card,
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderColor: chosen === 'critic' ? '#C45B5B' : 'rgba(196, 91, 91, 0.18)',
                  background: 'rgba(196, 91, 91, 0.08)',
                }}
              >
                <strong style={{ color: '#A64C4C' }}>Critic</strong>
                <p style={{ ...shellStyles.body, marginTop: 10 }}>{critic}</p>
              </button>
              <button
                type="button"
                onClick={() => setChosen('coach')}
                style={{
                  ...shellStyles.card,
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderColor: chosen === 'coach' ? '#7A9E7E' : 'rgba(122, 158, 126, 0.2)',
                  background: 'rgba(122, 158, 126, 0.1)',
                }}
              >
                <strong style={{ color: '#55795A' }}>Coach</strong>
                <p style={{ ...shellStyles.body, marginTop: 10 }}>{coach}</p>
              </button>
            </div>
            <p style={{ ...shellStyles.body, marginTop: 18 }}>
              The coach does not erase accountability. It makes growth possible.
            </p>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(2)}>Back</SecondaryButton>
              <PrimaryButton
                accent={ACCENT}
                disabled={!chosen}
                onClick={() => {
                  appendToStorage('aiforj_inner_critic_coach', {
                    critic,
                    coach,
                    chosen,
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
