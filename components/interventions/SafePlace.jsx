"use client";

import { useEffect, useState } from 'react';
import { InterventionShell, PrimaryButton, SecondaryButton, StepDots, setStorage, shellStyles } from './shared';

const ACCENT = '#8A8078';
const EMPTY = { place: '', see: '', hear: '', feel: '', smell: '', who: '', word: '' };

export default function SafePlace({ onComplete }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY);
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem('aiforj_safe_place') || 'null');
      if (saved) setForm((current) => ({ ...current, ...saved }));
    } catch (_) {
      // Ignore malformed local data.
    }
  }, []);

  useEffect(() => {
    if (step !== 3 || seconds <= 0) return undefined;
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds, step]);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <InterventionShell maxWidth={780}>
      <div style={shellStyles.card}>
        <StepDots currentStep={step} totalSteps={3} accent={ACCENT} label="Safe Place Visualization" />
        {step === 1 ? (
          <>
            <h2 style={shellStyles.heading}>Picture a place where you feel completely safe.</h2>
            <input value={form.place} onChange={(event) => update('place', event.target.value)} placeholder="Real or imaginary place" style={{ ...shellStyles.textInput, marginTop: 24 }} />
            <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
              <textarea value={form.see} onChange={(event) => update('see', event.target.value)} placeholder="What do you see there?" style={{ ...shellStyles.textarea, minHeight: 100 }} />
              <textarea value={form.hear} onChange={(event) => update('hear', event.target.value)} placeholder="What do you hear?" style={{ ...shellStyles.textarea, minHeight: 100 }} />
              <textarea value={form.feel} onChange={(event) => update('feel', event.target.value)} placeholder="What do you feel physically?" style={{ ...shellStyles.textarea, minHeight: 100 }} />
            </div>
            <div style={shellStyles.buttonRow}>
              <PrimaryButton accent={ACCENT} disabled={!form.place.trim() || !form.see.trim() || !form.hear.trim() || !form.feel.trim()} onClick={() => setStep(2)}>
                Keep building
              </PrimaryButton>
            </div>
          </>
        ) : null}
        {step === 2 ? (
          <>
            <h2 style={shellStyles.heading}>Add the final sensory details.</h2>
            <div style={{ display: 'grid', gap: 12, marginTop: 24 }}>
              <textarea value={form.smell} onChange={(event) => update('smell', event.target.value)} placeholder="What do you smell?" style={{ ...shellStyles.textarea, minHeight: 100 }} />
              <textarea value={form.who} onChange={(event) => update('who', event.target.value)} placeholder="Who, if anyone, is with you?" style={{ ...shellStyles.textarea, minHeight: 100 }} />
              <input value={form.word} onChange={(event) => update('word', event.target.value)} placeholder="One word for how you feel there" style={shellStyles.textInput} />
            </div>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(1)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} disabled={!form.smell.trim() || !form.word.trim()} onClick={() => setStep(3)}>
                Spend 60 seconds there
              </PrimaryButton>
            </div>
          </>
        ) : null}
        {step === 3 ? (
          <>
            <h2 style={shellStyles.heading}>{form.place || 'Your safe place'}</h2>
            <div style={{ ...shellStyles.card, marginTop: 24, background: 'rgba(138, 128, 120, 0.08)', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 56, color: ACCENT }}>{seconds}</div>
              <p style={{ ...shellStyles.body, marginTop: 8 }}>
                Let your mind return to {form.place}. The word for this place is <strong style={{ color: 'var(--text-primary)' }}>{form.word}</strong>.
              </p>
            </div>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => { setStep(2); setSeconds(60); }}>Back</SecondaryButton>
              <PrimaryButton
                accent={ACCENT}
                disabled={seconds > 0}
                onClick={() => {
                  setStorage('aiforj_safe_place', form);
                  onComplete();
                }}
              >
                Save safe place
              </PrimaryButton>
            </div>
          </>
        ) : null}
      </div>
    </InterventionShell>
  );
}
