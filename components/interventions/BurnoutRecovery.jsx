"use client";

import { useMemo, useState } from 'react';
import { InterventionShell, PrimaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#9B8EC4';
const DIMENSIONS = {
  exhaustion: ['I feel emotionally drained.', 'I feel used up at the end of most days.', 'Rest does not feel restorative.', 'I dread starting work or obligations.', 'I feel like I am running on empty.', 'My body feels tired even after sleep.'],
  cynicism: ["I've become more negative.", "I feel detached from what I'm doing.", "I've lost enthusiasm.", 'I am going through the motions.', 'It is harder to care than it used to be.', 'My work or effort feels less meaningful.'],
  inefficacy: ['I question my competence.', 'I feel like I am falling behind.', 'I do not feel effective.', 'My confidence has dropped.', 'I have trouble noticing wins.', 'I feel like a fraud more often than I want to admit.'],
};

export default function BurnoutRecovery({ onComplete }) {
  const [scores, setScores] = useState({
    exhaustion: Array(6).fill(3),
    cynicism: Array(6).fill(3),
    inefficacy: Array(6).fill(3),
  });

  const totals = useMemo(() => Object.fromEntries(Object.entries(scores).map(([key, values]) => [key, values.reduce((sum, value) => sum + value, 0)])), [scores]);
  const dominant = useMemo(() => Object.entries(totals).sort((a, b) => b[1] - a[1])[0]?.[0], [totals]);

  const plans = {
    exhaustion: 'Recovery this week: protect sleep, schedule micro-recoveries, say no to one demand, and treat rest as medicine.',
    cynicism: 'Recovery this week: reconnect with one meaningful task per day, track moments of impact, and reduce exposure to draining inputs.',
    inefficacy: 'Recovery this week: collect one win per day, reduce perfectionism, and build a competence evidence log.',
  };

  const update = (dimension, index, value) => {
    setScores((current) => ({
      ...current,
      [dimension]: current[dimension].map((score, scoreIndex) => (scoreIndex === index ? value : score)),
    }));
  };

  return (
    <InterventionShell maxWidth={820}>
      <div style={shellStyles.card}>
        <StepDots currentStep={2} totalSteps={2} accent={ACCENT} label="Burnout Assessment" />
        <h2 style={shellStyles.heading}>Which kind of burnout is leading the picture?</h2>
        <div style={{ display: 'grid', gap: 18, marginTop: 22 }}>
          {Object.entries(DIMENSIONS).map(([dimension, prompts]) => (
            <div key={dimension} style={shellStyles.card}>
              <strong style={{ display: 'block', marginBottom: 12, textTransform: 'capitalize' }}>{dimension}</strong>
              <div style={{ display: 'grid', gap: 12 }}>
                {prompts.map((prompt, index) => (
                  <label key={prompt} style={{ display: 'grid', gap: 8 }}>
                    <span style={shellStyles.body}>{prompt}</span>
                    <input type="range" min="1" max="5" value={scores[dimension][index]} onChange={(event) => update(dimension, index, Number(event.target.value))} style={{ accentColor: ACCENT }} />
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(155, 142, 196, 0.08)' }}>
          <p style={{ ...shellStyles.body, margin: 0 }}>
            Dominant burnout type: <strong style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>{dominant}</strong>.
            {dominant ? ` ${plans[dominant]}` : ''}
          </p>
        </div>
        <div style={shellStyles.buttonRow}>
          <PrimaryButton
            accent={ACCENT}
            onClick={() => {
              appendToStorage('aiforj_burnout_assessment', { scores, totals, dominant, createdAt: new Date().toISOString() });
              onComplete();
            }}
          >
            Save recovery plan
          </PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
