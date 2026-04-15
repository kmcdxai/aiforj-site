"use client";

import { useMemo, useState } from 'react';
import { InterventionShell, PrimaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#6B98B8';
const STYLES = {
  secure: {
    prompts: ['I find it easy to trust people.', "I'm comfortable with closeness.", 'I can ask for what I need in relationships.'],
    strategies: ['Keep practicing direct asks.', 'Notice and reinforce secure relationships.', 'Use repair instead of withdrawal after conflict.'],
  },
  anxious: {
    prompts: ['I worry people will leave me.', 'I need a lot of reassurance.', 'I over-analyze texts and tone.'],
    strategies: ['Name the fear before reacting.', 'Ask directly for reassurance instead of scanning for signs.', 'Pause before sending the second text.'],
  },
  avoidant: {
    prompts: ['I value independence above closeness.', 'I pull away when things get too intimate.', 'I feel suffocated easily.'],
    strategies: ['Practice staying in contact a little longer.', 'Share one honest need instead of shutting down.', 'Treat closeness as a skill, not a threat.'],
  },
  fearful: {
    prompts: ['I want closeness but fear it.', 'I push people away then regret it.', 'My relationships can feel unpredictable.'],
    strategies: ['Move at a pace that feels safe and honest.', 'Name ambivalence out loud.', 'Choose one consistent person to practice secure contact with.'],
  },
};

export default function AttachmentExplorer({ onComplete }) {
  const [scores, setScores] = useState({
    secure: [3, 3, 3],
    anxious: [3, 3, 3],
    avoidant: [3, 3, 3],
    fearful: [3, 3, 3],
  });

  const totals = useMemo(
    () => Object.fromEntries(Object.entries(scores).map(([key, values]) => [key, values.reduce((sum, value) => sum + value, 0)])),
    [scores]
  );
  const dominant = useMemo(() => Object.entries(totals).sort((a, b) => b[1] - a[1])[0]?.[0], [totals]);

  return (
    <InterventionShell maxWidth={820}>
      <div style={shellStyles.card}>
        <StepDots currentStep={2} totalSteps={2} accent={ACCENT} label="Attachment Style Explorer" />
        <h2 style={shellStyles.heading}>Rate how true each statement feels.</h2>
        <div style={{ display: 'grid', gap: 18, marginTop: 24 }}>
          {Object.entries(STYLES).map(([style, item]) => (
            <div key={style} style={{ ...shellStyles.card, padding: '18px 18px', background: 'var(--surface)' }}>
              <strong style={{ display: 'block', marginBottom: 12, textTransform: 'capitalize' }}>{style === 'fearful' ? 'Fearful-Avoidant' : style}</strong>
              {item.prompts.map((prompt, index) => (
                <label key={prompt} style={{ display: 'grid', gap: 8, marginTop: index ? 14 : 0 }}>
                  <span style={shellStyles.body}>{prompt}</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={scores[style][index]}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      setScores((current) => ({
                        ...current,
                        [style]: current[style].map((score, scoreIndex) => (scoreIndex === index ? value : score)),
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
          <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(107, 152, 184, 0.08)' }}>
            <strong style={{ display: 'block', marginBottom: 10 }}>
              Dominant style: {dominant === 'fearful' ? 'Fearful-Avoidant' : dominant}
            </strong>
            <ul style={{ margin: '0 0 0 18px', lineHeight: 1.8 }}>
              {STYLES[dominant].strategies.map((strategy) => <li key={strategy}>{strategy}</li>)}
            </ul>
          </div>
        ) : null}
        <div style={shellStyles.buttonRow}>
          <PrimaryButton
            accent={ACCENT}
            onClick={() => {
              appendToStorage('aiforj_attachment_explorer', {
                scores,
                totals,
                dominant,
                createdAt: new Date().toISOString(),
              });
              onComplete();
            }}
          >
            Finish
          </PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
