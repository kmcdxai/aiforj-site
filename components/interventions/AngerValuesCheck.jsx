"use client";

import { useState } from 'react';
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

const VALUES = ['Fairness', 'Respect', 'Honesty', 'Safety', 'Autonomy', 'Trust', 'Loyalty', 'Competence', 'Boundaries', 'Love'];

export default function AngerValuesCheck({ onComplete }) {
  const [value, setValue] = useState('');
  const [impact, setImpact] = useState('');
  const [response, setResponse] = useState('');

  const finish = () => {
    appendToStorage('aiforj_anger_values_checks', {
      value,
      impact,
      response,
      createdAt: new Date().toISOString(),
    });
    onComplete();
  };

  return (
    <InterventionShell maxWidth={640}>
      <div style={shellStyles.card}>
        <StepDots currentStep={response ? 3 : impact ? 2 : 1} totalSteps={3} accent={ANGER_ACCENT} label="ACT Values Lens" />
        <div style={shellStyles.eyebrow}>What is the anger protecting?</div>
        <h2 style={shellStyles.heading}>Anger usually means something you care about feels threatened.</h2>
        <p style={{ ...shellStyles.body, marginTop: 12 }}>
          Name the value first. Then check whether your current reaction is protecting it or harming it.
        </p>

        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', marginTop: 24 }}>
          {VALUES.map((item) => (
            <ChoiceCard key={item} selected={value === item} onClick={() => setValue(item)}>
              <strong>{item}</strong>
            </ChoiceCard>
          ))}
        </div>

        {value ? (
          <div style={{ display: 'grid', gap: 14, marginTop: 24 }}>
            <div style={{ ...shellStyles.card, padding: '18px 20px', background: 'rgba(196, 91, 91, 0.06)' }}>
              <p style={{ ...shellStyles.body, margin: 0 }}>
                You are angry because <strong style={{ color: 'var(--text-primary)' }}>{value}</strong> matters to you. That makes sense.
              </p>
            </div>
            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              <ChoiceCard selected={impact === 'protecting'} onClick={() => setImpact('protecting')}>
                <strong>Protecting</strong>
                <p style={{ ...shellStyles.body, fontSize: 14, marginTop: 6 }}>My current reaction is trying to defend this value.</p>
              </ChoiceCard>
              <ChoiceCard selected={impact === 'harming'} onClick={() => setImpact('harming')}>
                <strong>Harming</strong>
                <p style={{ ...shellStyles.body, fontSize: 14, marginTop: 6 }}>The anger may be justified, but my response is costing this value.</p>
              </ChoiceCard>
            </div>
          </div>
        ) : null}

        {impact ? (
          <textarea
            value={response}
            onChange={(event) => setResponse(event.target.value)}
            placeholder={`What would protecting ${value} look like if anger was not driving?`}
            style={{ ...shellStyles.textarea, marginTop: 22 }}
          />
        ) : null}

        <div style={shellStyles.buttonRow}>
          {value || impact || response ? <SecondaryButton onClick={() => { setValue(''); setImpact(''); setResponse(''); }}>Reset</SecondaryButton> : null}
          <PrimaryButton onClick={finish} disabled={!value || !impact || !response.trim()}>
            Finish values check
          </PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
