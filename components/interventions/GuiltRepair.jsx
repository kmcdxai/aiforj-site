"use client";

import { useMemo, useState } from 'react';
import { ChoiceCard, InterventionShell, PrimaryButton, SecondaryButton, StepDots, appendToStorage, rangeStyle, shellStyles } from './shared';

const ACCENT = '#C47A8A';
const CHECKS = [
  "I'm taking too much responsibility",
  'The other person also played a role',
  "I'm holding myself to an impossible standard",
  'This feels more like who I am than what I did',
];
const WILLINGNESS = ['Yes', 'Not yet', 'I need to think about it'];
const TIMELINES = ['Today', 'This week', 'Later'];

export default function GuiltRepair({ onComplete }) {
  const [step, setStep] = useState(1);
  const [action, setAction] = useState('');
  const [affected, setAffected] = useState('');
  const [proportion, setProportion] = useState(5);
  const [checks, setChecks] = useState([]);
  const [repair, setRepair] = useState('');
  const [willingness, setWillingness] = useState('');
  const [timeline, setTimeline] = useState('');

  const commitment = useMemo(() => {
    if (!repair.trim()) return '';
    if (willingness === 'Yes' && timeline) return `${repair.trim()} (${timeline.toLowerCase()})`;
    if (willingness === 'Not yet') return 'Doing better going forward can still be a form of repair.';
    if (willingness === 'I need to think about it') return 'Pause, reflect, and return when you know what repair would feel genuine.';
    return '';
  }, [repair, timeline, willingness]);

  const toggleCheck = (value) => {
    setChecks((current) => (current.includes(value) ? current.filter((item) => item !== value) : [...current, value]));
  };

  return (
    <InterventionShell maxWidth={760}>
      <div style={shellStyles.card}>
        <StepDots currentStep={step} totalSteps={5} accent={ACCENT} label="Guilt to Repair" />

        {step === 1 ? (
          <>
            <h2 style={shellStyles.heading}>What specifically did you do, or not do?</h2>
            <textarea value={action} onChange={(event) => setAction(event.target.value)} style={{ ...shellStyles.textarea, marginTop: 24 }} />
            <div style={shellStyles.buttonRow}>
              <PrimaryButton accent={ACCENT} disabled={!action.trim()} onClick={() => setStep(2)}>Next</PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <h2 style={shellStyles.heading}>Who was affected?</h2>
            <input value={affected} onChange={(event) => setAffected(event.target.value)} style={{ ...shellStyles.textInput, marginTop: 24 }} />
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(1)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} disabled={!affected.trim()} onClick={() => setStep(3)}>Assess guilt</PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <h2 style={shellStyles.heading}>How proportionate is your guilt?</h2>
            <div style={{ marginTop: 24 }}>
              <label style={shellStyles.label}>{proportion} / 10</label>
              <input type="range" min="1" max="10" value={proportion} onChange={(event) => setProportion(Number(event.target.value))} style={{ ...rangeStyle(ACCENT), marginTop: 10 }} />
            </div>
            {proportion > 7 ? (
              <div style={{ display: 'grid', gap: 10, marginTop: 18 }}>
                {CHECKS.map((item) => (
                  <ChoiceCard key={item} selected={checks.includes(item)} accent={ACCENT} onClick={() => toggleCheck(item)}>
                    {item}
                  </ChoiceCard>
                ))}
              </div>
            ) : null}
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(2)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} onClick={() => setStep(4)}>Plan repair</PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 4 ? (
          <>
            <h2 style={shellStyles.heading}>What would a genuine repair look like?</h2>
            <textarea
              value={repair}
              onChange={(event) => setRepair(event.target.value)}
              placeholder="Apology, changed behavior, making amends, a conversation..."
              style={{ ...shellStyles.textarea, marginTop: 24 }}
            />
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(3)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} disabled={!repair.trim()} onClick={() => setStep(5)}>Commit</PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 5 ? (
          <>
            <h2 style={shellStyles.heading}>Are you willing to do this?</h2>
            <div style={{ display: 'grid', gap: 10, marginTop: 24 }}>
              {WILLINGNESS.map((item) => (
                <ChoiceCard key={item} selected={willingness === item} accent={ACCENT} onClick={() => setWillingness(item)}>
                  {item}
                </ChoiceCard>
              ))}
            </div>
            {willingness === 'Yes' ? (
              <div style={{ display: 'grid', gap: 10, marginTop: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}>
                {TIMELINES.map((item) => (
                  <ChoiceCard key={item} selected={timeline === item} accent={ACCENT} onClick={() => setTimeline(item)}>
                    {item}
                  </ChoiceCard>
                ))}
              </div>
            ) : null}
            {commitment ? (
              <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(196, 122, 138, 0.08)' }}>
                <strong style={{ display: 'block', marginBottom: 8 }}>Repair plan</strong>
                <p style={{ ...shellStyles.body, margin: 0 }}>{commitment}</p>
              </div>
            ) : null}
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(4)}>Back</SecondaryButton>
              <PrimaryButton
                accent={ACCENT}
                disabled={!willingness || (willingness === 'Yes' && !timeline)}
                onClick={() => {
                  appendToStorage('aiforj_guilt_repair', {
                    action,
                    affected,
                    proportion,
                    checks,
                    repair,
                    willingness,
                    timeline,
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
