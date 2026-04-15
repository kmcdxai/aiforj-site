"use client";

import { useMemo, useState } from 'react';
import { ChoiceCard, InterventionShell, PrimaryButton, StepDots, appendToStorage, rangeStyle, shellStyles } from './shared';

const ACCENT = '#6B98B8';

export default function DigitalAudit({ onComplete }) {
  const [hours, setHours] = useState(2);
  const [ratio, setRatio] = useState(3);
  const [feeling, setFeeling] = useState('');
  const [conversations, setConversations] = useState(0);

  const insight = useMemo(() => {
    if (ratio <= 2 && feeling === 'Worse') {
      return "Passive scrolling increases loneliness. It shows you everyone else's highlight reel while you sit alone watching.";
    }
    if (ratio >= 4 && feeling === 'Better') {
      return 'Active engagement is serving you better than passive comparison.';
    }
    return 'Screen time is not the same thing as connection time. Shifting toward active contact matters.';
  }, [feeling, ratio]);

  return (
    <InterventionShell maxWidth={760}>
      <div style={shellStyles.card}>
        <StepDots currentStep={2} totalSteps={2} accent={ACCENT} label="Digital Connection Audit" />
        <h2 style={shellStyles.heading}>Is your digital life increasing or decreasing loneliness?</h2>
        <div style={{ display: 'grid', gap: 18, marginTop: 24 }}>
          <div>
            <label style={shellStyles.label}>Hours per day on social media: {hours}</label>
            <input type="range" min="0" max="10" value={hours} onChange={(event) => setHours(Number(event.target.value))} style={{ ...rangeStyle(ACCENT), marginTop: 8 }} />
          </div>
          <div>
            <label style={shellStyles.label}>Passive scrolling vs active engaging: {ratio}/5</label>
            <input type="range" min="1" max="5" value={ratio} onChange={(event) => setRatio(Number(event.target.value))} style={{ ...rangeStyle(ACCENT), marginTop: 8 }} />
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {['Better', 'Same', 'Worse'].map((item) => (
              <ChoiceCard key={item} selected={feeling === item} accent={ACCENT} onClick={() => setFeeling(item)}>
                After social media I usually feel {item.toLowerCase()}.
              </ChoiceCard>
            ))}
          </div>
          <input type="number" value={conversations} onChange={(event) => setConversations(Number(event.target.value))} placeholder="Genuine conversations this week" style={shellStyles.textInput} />
        </div>
        <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(107, 152, 184, 0.08)' }}>
          <p style={{ ...shellStyles.body, margin: 0 }}>{insight}</p>
          <ul style={{ margin: '12px 0 0 18px', lineHeight: 1.8 }}>
            <li>Unfollow 5 accounts that trigger comparison.</li>
            <li>Follow 3 that foster real community.</li>
            <li>Set one active engagement goal each day.</li>
          </ul>
        </div>
        <div style={shellStyles.buttonRow}>
          <PrimaryButton
            accent={ACCENT}
            disabled={!feeling}
            onClick={() => {
              appendToStorage('aiforj_digital_audit', {
                hours,
                ratio,
                feeling,
                conversations,
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
