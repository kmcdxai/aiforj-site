"use client";

import { useMemo, useState } from 'react';
import CrisisBanner from './CrisisBanner';
import { ChoiceCard, InterventionShell, PrimaryButton, SecondaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#C47A8A';
const VALUES = ['Connection', 'Health', 'Freedom', 'Growth', 'Service', 'Authenticity', 'Safety', 'Recovery'];

export default function ValuesVsUrges({ onComplete }) {
  const [urgePush, setUrgePush] = useState('');
  const [selectedValues, setSelectedValues] = useState([]);
  const [customValue, setCustomValue] = useState('');
  const [choice, setChoice] = useState('');

  const valuesSummary = useMemo(() => {
    const allValues = [...selectedValues, customValue.trim()].filter(Boolean);
    return allValues.join(', ');
  }, [customValue, selectedValues]);

  const toggleValue = (value) => {
    setSelectedValues((current) => (current.includes(value) ? current.filter((item) => item !== value) : [...current, value]));
  };

  const saveAndFinish = () => {
    appendToStorage('aiforj_values_vs_urges', {
      urgePush,
      selectedValues,
      customValue,
      choice,
      createdAt: new Date().toISOString(),
    });
    onComplete();
  };

  return (
    <InterventionShell maxWidth={860}>
      <div style={shellStyles.card}>
        <CrisisBanner />
        <StepDots currentStep={choice ? 3 : valuesSummary && urgePush.trim() ? 2 : 1} totalSteps={3} accent={ACCENT} label="Values vs. Urges Showdown" />
        <h2 style={shellStyles.heading}>The urge can be loud without getting the final vote.</h2>
        <p style={{ ...shellStyles.body, marginTop: 12 }}>
          Put the urge and your values side by side. You do not have to feel different to act differently.
        </p>

        <div style={{ display: 'grid', gap: 18, marginTop: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <div style={{ ...shellStyles.card, padding: '20px 18px', background: 'rgba(196, 122, 138, 0.07)' }}>
            <strong style={{ display: 'block', marginBottom: 12 }}>The urge wants you to...</strong>
            <textarea
              value={urgePush}
              onChange={(event) => setUrgePush(event.target.value)}
              placeholder="What is the urge pushing you toward right now?"
              style={{ ...shellStyles.textarea, minHeight: 150 }}
            />
          </div>

          <div style={{ ...shellStyles.card, padding: '20px 18px', background: 'rgba(122, 158, 126, 0.1)' }}>
            <strong style={{ display: 'block', marginBottom: 12 }}>Your values want you to...</strong>
            <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
              {VALUES.map((value) => (
                <ChoiceCard key={value} selected={selectedValues.includes(value)} accent={ACCENT} onClick={() => toggleValue(value)}>
                  {value}
                </ChoiceCard>
              ))}
            </div>
            <input
              value={customValue}
              onChange={(event) => setCustomValue(event.target.value)}
              placeholder="Add your own value"
              style={{ ...shellStyles.textInput, marginTop: 12 }}
            />
            {valuesSummary ? (
              <p style={{ ...shellStyles.body, marginTop: 12 }}>
                Right now your values are pulling toward: <strong style={{ color: 'var(--text-primary)' }}>{valuesSummary}</strong>
              </p>
            ) : null}
          </div>
        </div>

        {urgePush.trim() && valuesSummary ? (
          <>
            <div style={{ display: 'grid', gap: 12, marginTop: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              <ChoiceCard selected={choice === 'urge'} accent={ACCENT} onClick={() => setChoice('urge')} style={{ textAlign: 'left' }}>
                <strong style={{ display: 'block', marginBottom: 8 }}>Choose the urge</strong>
                <span style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>No judgment. Just honesty about where you are right now.</span>
              </ChoiceCard>
              <ChoiceCard selected={choice === 'values'} accent={ACCENT} onClick={() => setChoice('values')} style={{ textAlign: 'left' }}>
                <strong style={{ display: 'block', marginBottom: 8 }}>Choose the values</strong>
                <span style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Let the urge be present and move one inch toward who you want to be.</span>
              </ChoiceCard>
            </div>

            {choice === 'values' ? (
              <div style={{ ...shellStyles.card, marginTop: 18, background: 'rgba(122, 158, 126, 0.1)' }}>
                <p style={{ ...shellStyles.body, margin: 0 }}>
                  You do not need the urge to disappear before you act. Willingness means the urge can be here and you can still choose {valuesSummary}.
                </p>
              </div>
            ) : null}

            {choice === 'urge' ? (
              <div style={{ ...shellStyles.card, marginTop: 18, background: 'rgba(196, 122, 138, 0.08)' }}>
                <p style={{ ...shellStyles.body, margin: 0 }}>
                  That is where you are right now. Before acting, try one more thing first. Even a 10-minute delay can change what happens next.
                </p>
                <div style={{ display: 'grid', gap: 10, marginTop: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                  <SecondaryButton onClick={() => { window.location.href = '/intervention/tipp-skills?emotion=self-destructive&intensity=8&time=quick'; }}>
                    Try TIPP Skills
                  </SecondaryButton>
                  <SecondaryButton onClick={() => { window.location.href = '/intervention/delay-distract?emotion=self-destructive&intensity=8&time=quick'; }}>
                    Try Delay &amp; Distract
                  </SecondaryButton>
                </div>
              </div>
            ) : null}
          </>
        ) : null}

        <div style={shellStyles.buttonRow}>
          <PrimaryButton accent={ACCENT} disabled={!urgePush.trim() || !valuesSummary || !choice} onClick={saveAndFinish}>
            Finish
          </PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
