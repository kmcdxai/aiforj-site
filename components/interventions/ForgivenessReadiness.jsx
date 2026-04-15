"use client";

import { useMemo, useState } from 'react';
import {
  ANGER_ACCENT,
  ChoiceCard,
  InterventionShell,
  PrimaryButton,
  SecondaryButton,
  StepDots,
  appendToStorage,
  shellStyles,
} from './shared';

const STATEMENTS = [
  "I'm tired of carrying this resentment.",
  'I understand that forgiveness is for me, not for them.',
  "I've fully felt and expressed my anger about this.",
  'I can see that holding onto this is hurting me.',
  "I'm open to seeing this person as a flawed human.",
  'I want to be free from this more than I want to be right.',
];

export default function ForgivenessReadiness({ onComplete }) {
  const [scores, setScores] = useState(Array(STATEMENTS.length).fill(3));
  const [uncovering, setUncovering] = useState('');
  const [decision, setDecision] = useState('');
  const [work, setWork] = useState('');
  const [deepening, setDeepening] = useState('');

  const total = useMemo(() => scores.reduce((sum, score) => sum + score, 0), [scores]);
  const ready = total >= 24;
  const maybeReady = total >= 12 && total < 24;

  const setScore = (index, value) => {
    setScores((current) => current.map((score, scoreIndex) => (scoreIndex === index ? value : score)));
  };

  const finish = () => {
    appendToStorage('aiforj_forgiveness_readiness', {
      scores,
      total,
      uncovering,
      decision,
      work,
      deepening,
      createdAt: new Date().toISOString(),
    });
    onComplete();
  };

  return (
    <InterventionShell maxWidth={760}>
      <div style={shellStyles.card}>
        <StepDots currentStep={ready ? 2 : 1} totalSteps={2} accent={ANGER_ACCENT} label="Forgiveness Readiness" />
        <div style={shellStyles.eyebrow}>This is for your freedom, not their absolution</div>
        <h2 style={shellStyles.heading}>How ready are you to stop carrying this resentment?</h2>
        <p style={{ ...shellStyles.body, marginTop: 12 }}>
          Forgiveness is not condoning, forgetting, reconciling, or making the harm okay. It is deciding whether resentment still gets to occupy your body full time.
        </p>

        <div style={{ display: 'grid', gap: 16, marginTop: 24 }}>
          {STATEMENTS.map((statement, index) => (
            <div key={statement} style={shellStyles.statCard}>
              <strong style={{ display: 'block', marginBottom: 12 }}>{statement}</strong>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 8 }}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <ChoiceCard
                    key={value}
                    selected={scores[index] === value}
                    onClick={() => setScore(index, value)}
                    style={{ padding: '12px 8px', textAlign: 'center' }}
                  >
                    {value}
                  </ChoiceCard>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ ...shellStyles.card, marginTop: 22, background: 'rgba(196, 91, 91, 0.06)' }}>
          <strong style={{ display: 'block', marginBottom: 8 }}>Total score: {total}</strong>
          <p style={{ ...shellStyles.body, margin: 0 }}>
            {ready
              ? 'You may be ready to begin the forgiveness process.'
              : maybeReady
                ? 'You may not be ready yet, and that is completely okay.'
                : 'You are not ready, and that may be the healthiest thing to notice right now.'}
          </p>
        </div>

        {ready ? (
          <div style={{ display: 'grid', gap: 14, marginTop: 22 }}>
            <textarea
              value={uncovering}
              onChange={(event) => setUncovering(event.target.value)}
              placeholder="Uncovering: How has this injury affected you?"
              style={shellStyles.textarea}
            />
            <textarea
              value={decision}
              onChange={(event) => setDecision(event.target.value)}
              placeholder="Decision: Why are you choosing to begin this process for yourself?"
              style={shellStyles.textarea}
            />
            <textarea
              value={work}
              onChange={(event) => setWork(event.target.value)}
              placeholder="Work: Can you see this person as a whole human, separate from the one action?"
              style={shellStyles.textarea}
            />
            <textarea
              value={deepening}
              onChange={(event) => setDeepening(event.target.value)}
              placeholder="Deepening: What have you gained from working through this?"
              style={shellStyles.textarea}
            />
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12, marginTop: 22 }}>
            <ChoiceCard selected={false} onClick={() => { window.location.href = '/intervention/unsent-letter?emotion=angry&intensity=7&time=deep'; }}>
              <strong>Process the anger first</strong>
              <p style={{ ...shellStyles.body, fontSize: 14, marginTop: 6 }}>Try Unsent Letter if you still need expression.</p>
            </ChoiceCard>
            <ChoiceCard selected={false} onClick={() => { window.location.href = '/intervention/boundary-planning?emotion=angry&intensity=7&time=deep'; }}>
              <strong>Protect yourself next</strong>
              <p style={{ ...shellStyles.body, fontSize: 14, marginTop: 6 }}>Try Boundary Planning if the harm is ongoing.</p>
            </ChoiceCard>
          </div>
        )}

        <div style={shellStyles.buttonRow}>
          {!ready ? <SecondaryButton onClick={onComplete}>Finish for now</SecondaryButton> : null}
          <PrimaryButton onClick={finish} disabled={ready && (!decision.trim() || !uncovering.trim())}>
            {ready ? 'Save readiness work' : 'Save score'}
          </PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
