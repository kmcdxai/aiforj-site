"use client";

import { useState } from 'react';
import { ChoiceCard, InterventionShell, PrimaryButton, SecondaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#C47A8A';
const SOURCES = ['Parent', 'Sibling', 'Teacher', 'Peers / Bullies', 'Media / Culture', 'Religion', 'Romantic partner', 'Yourself', 'Custom'];

export default function ShameOriginMapping({ onComplete }) {
  const [step, setStep] = useState(1);
  const [belief, setBelief] = useState('');
  const [memory, setMemory] = useState('');
  const [source, setSource] = useState('');
  const [customSource, setCustomSource] = useState('');
  const [meaning, setMeaning] = useState('');
  const [grain, setGrain] = useState('');
  const [exaggeration, setExaggeration] = useState('');
  const [rewrite, setRewrite] = useState('');

  return (
    <InterventionShell maxWidth={780}>
      <div style={shellStyles.card}>
        <StepDots currentStep={step} totalSteps={6} accent={ACCENT} label="Narrative Shame Mapping" />

        {step === 1 ? (
          <>
            <h2 style={shellStyles.heading}>What is the core shame belief?</h2>
            <input value={belief} onChange={(event) => setBelief(event.target.value)} style={{ ...shellStyles.textInput, marginTop: 24 }} />
            <div style={shellStyles.buttonRow}>
              <PrimaryButton accent={ACCENT} disabled={!belief.trim()} onClick={() => setStep(2)}>Next</PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <h2 style={shellStyles.heading}>When do you first remember feeling this?</h2>
            <textarea value={memory} onChange={(event) => setMemory(event.target.value)} style={{ ...shellStyles.textarea, marginTop: 24 }} />
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(1)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} disabled={!memory.trim()} onClick={() => setStep(3)}>Keep tracing</PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <h2 style={shellStyles.heading}>Who or what gave you this message?</h2>
            <div style={{ display: 'grid', gap: 10, marginTop: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
              {SOURCES.map((item) => (
                <ChoiceCard key={item} selected={source === item} accent={ACCENT} onClick={() => setSource(item)}>
                  {item}
                </ChoiceCard>
              ))}
            </div>
            {source === 'Custom' ? (
              <input value={customSource} onChange={(event) => setCustomSource(event.target.value)} style={{ ...shellStyles.textInput, marginTop: 16 }} />
            ) : null}
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(2)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} disabled={!source || (source === 'Custom' && !customSource.trim())} onClick={() => setStep(4)}>Reflect</PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 4 ? (
          <>
            <h2 style={shellStyles.heading}>At the time, did you really have a choice about believing it?</h2>
            <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(196, 122, 138, 0.08)' }}>
              <p style={shellStyles.body}>
                No. You were younger, more vulnerable, or more dependent. You absorbed it because you had to make sense of your world with the tools you had then.
              </p>
            </div>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(3)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} onClick={() => setStep(5)}>Is it inherited?</PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 5 ? (
          <>
            <h2 style={shellStyles.heading}>How do you understand this belief now?</h2>
            <div style={{ display: 'grid', gap: 12, marginTop: 24 }}>
              <ChoiceCard selected={meaning === 'inherited'} accent={ACCENT} onClick={() => setMeaning('inherited')}>
                It is inherited. I took on someone else&apos;s voice.
              </ChoiceCard>
              <ChoiceCard selected={meaning === 'complicated'} accent={ACCENT} onClick={() => setMeaning('complicated')}>
                There may be a grain of truth, but it is wrapped in exaggeration.
              </ChoiceCard>
            </div>
            {meaning === 'complicated' ? (
              <div style={{ display: 'grid', gap: 14, marginTop: 18 }}>
                <input value={grain} onChange={(event) => setGrain(event.target.value)} placeholder="What is the grain of truth?" style={shellStyles.textInput} />
                <input value={exaggeration} onChange={(event) => setExaggeration(event.target.value)} placeholder="What is the exaggeration?" style={shellStyles.textInput} />
              </div>
            ) : null}
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(4)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} disabled={!meaning || (meaning === 'complicated' && (!grain.trim() || !exaggeration.trim()))} onClick={() => setStep(6)}>
                Rewrite it
              </PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 6 ? (
          <>
            <h2 style={shellStyles.heading}>If you rewrote the belief today, what would it say?</h2>
            <input value={rewrite} onChange={(event) => setRewrite(event.target.value)} style={{ ...shellStyles.textInput, marginTop: 24 }} />
            <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(196, 122, 138, 0.08)' }}>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Updated narrative</div>
              <p style={{ ...shellStyles.body, marginTop: 10 }}>
                From <strong style={{ color: 'var(--text-primary)' }}>{belief || 'your old belief'}</strong> to{' '}
                <strong style={{ color: 'var(--text-primary)' }}>{rewrite || 'a new story'}</strong>.
              </p>
            </div>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(5)}>Back</SecondaryButton>
              <PrimaryButton
                accent={ACCENT}
                disabled={!rewrite.trim()}
                onClick={() => {
                  appendToStorage('aiforj_shame_origin_mapping', {
                    belief,
                    memory,
                    source: source === 'Custom' ? customSource.trim() : source,
                    meaning,
                    grain,
                    exaggeration,
                    rewrite,
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
