"use client";

import { useMemo, useState } from 'react';
import { ChoiceCard, InterventionShell, PrimaryButton, SecondaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#C47A8A';
const TYPES = [
  {
    id: 'perfectionist',
    statement: "If I can't do it perfectly, I'd rather not do it at all",
    declaration: "I am enough, even when my work isn't perfect.",
  },
  {
    id: 'soloist',
    statement: 'I should be able to figure everything out on my own',
    declaration: 'Asking for help is strength, not weakness.',
  },
  {
    id: 'expert',
    statement: "If I'm not an expert on every aspect, I'm a fraud",
    declaration: "I don't need to know everything to add value.",
  },
  {
    id: 'natural-genius',
    statement: "If it doesn't come naturally, I must not be meant for it",
    declaration: 'Struggling means I am learning, not failing.',
  },
  {
    id: 'superhuman',
    statement: 'I should be able to handle everything for everyone',
    declaration: "I can't do everything, and I do not have to.",
  },
];

export default function ImposterDeconstruction({ onComplete }) {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState([]);
  const [accomplishments, setAccomplishments] = useState(() => Array.from({ length: 5 }, () => ({ win: '', skill: '', reframe: '' })));

  const dominant = useMemo(() => TYPES.find((item) => selected.includes(item.id)) || null, [selected]);

  const toggleType = (id) => {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const updateRow = (index, patch) => {
    setAccomplishments((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  };

  return (
    <InterventionShell maxWidth={860}>
      <div style={shellStyles.card}>
        <StepDots currentStep={step} totalSteps={4} accent={ACCENT} label="Imposter Syndrome Deconstruction" />

        {step === 1 ? (
          <>
            <h2 style={shellStyles.heading}>Which statements fit?</h2>
            <div style={{ display: 'grid', gap: 10, marginTop: 24 }}>
              {TYPES.map((item) => (
                <ChoiceCard key={item.id} selected={selected.includes(item.id)} accent={ACCENT} onClick={() => toggleType(item.id)}>
                  {item.statement}
                </ChoiceCard>
              ))}
            </div>
            {dominant ? (
              <div style={{ ...shellStyles.card, marginTop: 18, background: 'rgba(196, 122, 138, 0.08)' }}>
                <strong style={{ display: 'block', marginBottom: 8 }}>Primary pattern today</strong>
                <p style={{ ...shellStyles.body, margin: 0 }}>{dominant.id.replace('-', ' ')}</p>
              </div>
            ) : null}
            <div style={shellStyles.buttonRow}>
              <PrimaryButton accent={ACCENT} disabled={!selected.length} onClick={() => setStep(2)}>Evidence log</PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <h2 style={shellStyles.heading}>List 5 real accomplishments.</h2>
            <div style={{ display: 'grid', gap: 14, marginTop: 24 }}>
              {accomplishments.map((item, index) => (
                <div key={index} style={{ ...shellStyles.card, padding: '18px 18px', background: 'var(--surface)' }}>
                  <input
                    value={item.win}
                    onChange={(event) => updateRow(index, { win: event.target.value })}
                    placeholder={`Accomplishment ${index + 1}`}
                    style={shellStyles.textInput}
                  />
                  <input
                    value={item.skill}
                    onChange={(event) => updateRow(index, { skill: event.target.value })}
                    placeholder="What skill did this require?"
                    style={{ ...shellStyles.textInput, marginTop: 12 }}
                  />
                </div>
              ))}
            </div>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(1)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} disabled={accomplishments.some((item) => !item.win.trim() || !item.skill.trim())} onClick={() => setStep(3)}>
                Reattribute
              </PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <h2 style={shellStyles.heading}>What is the more accurate attribution?</h2>
            <div style={{ display: 'grid', gap: 14, marginTop: 24 }}>
              {accomplishments.map((item, index) => (
                <div key={index} style={{ ...shellStyles.card, padding: '18px 18px', background: 'var(--surface)' }}>
                  <strong>{item.win}</strong>
                  <p style={{ ...shellStyles.body, marginTop: 8 }}>Required skill: {item.skill}</p>
                  <input
                    value={item.reframe}
                    onChange={(event) => updateRow(index, { reframe: event.target.value })}
                    placeholder="What is the more accurate explanation than luck?"
                    style={{ ...shellStyles.textInput, marginTop: 12 }}
                  />
                </div>
              ))}
            </div>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(2)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} disabled={accomplishments.some((item) => !item.reframe.trim())} onClick={() => setStep(4)}>
                Enough declaration
              </PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 4 ? (
          <>
            <h2 style={shellStyles.heading}>Your enough declaration</h2>
            <div style={{ ...shellStyles.card, marginTop: 24, background: 'rgba(196, 122, 138, 0.08)', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 34, lineHeight: 1.3 }}>
                {dominant?.declaration || 'I add value, even when shame says otherwise.'}
              </div>
            </div>
            <div style={{ ...shellStyles.card, marginTop: 18 }}>
              <strong style={{ display: 'block', marginBottom: 10 }}>Evidence bank</strong>
              <ul style={{ margin: '0 0 0 18px', lineHeight: 1.8 }}>
                {accomplishments.map((item, index) => (
                  <li key={index}>
                    <strong>{item.win}</strong>: {item.reframe}
                  </li>
                ))}
              </ul>
            </div>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(3)}>Back</SecondaryButton>
              <PrimaryButton
                accent={ACCENT}
                onClick={() => {
                  appendToStorage('aiforj_imposter_deconstruction', {
                    selected,
                    accomplishments,
                    dominant: dominant?.id || null,
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
