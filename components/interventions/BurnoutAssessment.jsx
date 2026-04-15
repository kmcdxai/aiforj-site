"use client";

import { useMemo, useState } from 'react';
import { InterventionShell, PrimaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#D4A843';
const DIMENSIONS = {
  exhaustion: ['I feel emotionally drained.', 'I feel used up at the end of the day.', 'I dread starting work.', 'I feel like I am running on empty.', "Rest doesn't feel restorative.", "I'm physically tired even after sleeping."],
  cynicism: ['I doubt my work matters.', "I've become more negative.", 'I feel detached from people or tasks.', 'I am going through the motions.', "I've lost enthusiasm.", 'I find it hard to care.'],
  inefficacy: ["I don't feel competent.", 'I question whether I am making a difference.', 'I feel like I am falling behind.', "I can't seem to accomplish anything.", 'I feel like a fraud at work.', 'My confidence has dropped.'],
};

const PLANS = {
  exhaustion: 'Week one: protect sleep, lower load where possible, schedule micro-recoveries, and treat rest like medicine.',
  cynicism: 'Week one: reconnect with one meaningful task per day, notice impact, and reduce exposure to draining inputs.',
  inefficacy: 'Week one: collect small wins, reduce perfectionism, and make completion count.',
};

export default function BurnoutAssessment({ onComplete }) {
  const [scores, setScores] = useState({
    exhaustion: Array(6).fill(3),
    cynicism: Array(6).fill(3),
    inefficacy: Array(6).fill(3),
  });

  const totals = useMemo(() => Object.fromEntries(Object.entries(scores).map(([key, values]) => [key, values.reduce((sum, value) => sum + value, 0)])), [scores]);
  const dominant = useMemo(() => Object.entries(totals).sort((a, b) => b[1] - a[1])[0]?.[0], [totals]);

  return (
    <InterventionShell maxWidth={820}>
      <div style={shellStyles.card}>
        <StepDots currentStep={2} totalSteps={2} accent={ACCENT} label="Burnout Type Assessment" />
        <h2 style={shellStyles.heading}>Which dimension of burnout is leading?</h2>
        <div style={{ display: 'grid', gap: 18, marginTop: 24 }}>
          {Object.entries(DIMENSIONS).map(([dimension, prompts]) => (
            <div key={dimension} style={{ ...shellStyles.card, padding: '18px 18px', background: 'var(--surface)' }}>
              <strong style={{ textTransform: 'capitalize' }}>{dimension}</strong>
              {prompts.map((prompt, index) => (
                <label key={prompt} style={{ display: 'grid', gap: 8, marginTop: 12 }}>
                  <span style={shellStyles.body}>{prompt}</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={scores[dimension][index]}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      setScores((current) => ({
                        ...current,
                        [dimension]: current[dimension].map((score, scoreIndex) => (scoreIndex === index ? value : score)),
                      }));
                    }}
                    style={{ accentColor: ACCENT }}
                  />
                </label>
              ))}
            </div>
          ))}
        </div>
        {dominant ? (
          <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(212, 168, 67, 0.08)' }}>
            <p style={{ ...shellStyles.body, margin: 0 }}>
              Dominant type: <strong style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>{dominant}</strong>. {PLANS[dominant]}
            </p>
          </div>
        ) : null}
        <div style={shellStyles.buttonRow}>
          <PrimaryButton
            accent={ACCENT}
            onClick={() => {
              appendToStorage('aiforj_burnout_type_assessment', {
                scores,
                totals,
                dominant,
                createdAt: new Date().toISOString(),
              });
              onComplete();
            }}
          >
            Save recovery starter
          </PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
