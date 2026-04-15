"use client";

import { useMemo, useState } from 'react';
import { ChoiceCard, InterventionShell, PrimaryButton, SecondaryButton, StepDots, appendToStorage, copyText, shellStyles } from './shared';

const ACCENT = '#C47A8A';
const BODY_SIGNS = [
  'Hot face',
  'Tight chest',
  'Nausea',
  'Wanting to disappear',
  'Racing thoughts',
  "Can't make eye contact",
  'Hollow feeling',
];
const SOURCES = ['Parent', 'Teacher', 'Peers', 'Society', 'Romantic partner', 'My own voice', 'Custom'];

export default function ShameResilience({ onComplete }) {
  const [step, setStep] = useState(1);
  const [signals, setSignals] = useState([]);
  const [message, setMessage] = useState('');
  const [source, setSource] = useState('');
  const [customSource, setCustomSource] = useState('');
  const [person, setPerson] = useState('');
  const [feeling, setFeeling] = useState('');
  const [copied, setCopied] = useState(false);

  const generatedMessage = useMemo(
    () => (person.trim() ? `Hey ${person.trim()}, I'm going through something and could use a non-judgmental ear. Can we talk?` : ''),
    [person]
  );
  const spokenSentence = useMemo(
    () => (message.trim() && feeling.trim() ? `I feel shame about ${message.trim()} and it makes me feel ${feeling.trim()}.` : ''),
    [message, feeling]
  );

  const toggleSignal = (value) => {
    setSignals((current) => (current.includes(value) ? current.filter((item) => item !== value) : [...current, value]));
  };

  return (
    <InterventionShell maxWidth={760}>
      <div style={shellStyles.card}>
        <StepDots currentStep={step} totalSteps={4} accent={ACCENT} label="Shame Resilience" />

        {step === 1 ? (
          <>
            <h2 style={shellStyles.heading}>Recognize shame in the body.</h2>
            <div style={{ display: 'grid', gap: 10, marginTop: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
              {BODY_SIGNS.map((item) => (
                <ChoiceCard key={item} selected={signals.includes(item)} accent={ACCENT} onClick={() => toggleSignal(item)}>
                  {item}
                </ChoiceCard>
              ))}
            </div>
            <div style={shellStyles.buttonRow}>
              <PrimaryButton accent={ACCENT} disabled={!signals.length} onClick={() => setStep(2)}>
                Next
              </PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <h2 style={shellStyles.heading}>What shame message are you hearing?</h2>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="What is the message shame is pushing?"
              style={{ ...shellStyles.textarea, marginTop: 24, minHeight: 140 }}
            />
            <p style={{ ...shellStyles.body, marginTop: 18 }}>Whose voice does this sound like?</p>
            <div style={{ display: 'grid', gap: 10, marginTop: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
              {SOURCES.map((item) => (
                <ChoiceCard key={item} selected={source === item} accent={ACCENT} onClick={() => setSource(item)}>
                  {item}
                </ChoiceCard>
              ))}
            </div>
            {source === 'Custom' ? (
              <input
                value={customSource}
                onChange={(event) => setCustomSource(event.target.value)}
                placeholder="Name the source"
                style={{ ...shellStyles.textInput, marginTop: 16 }}
              />
            ) : null}
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(1)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} disabled={!message.trim() || !source || (source === 'Custom' && !customSource.trim())} onClick={() => setStep(3)}>
                Keep going
              </PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <h2 style={shellStyles.heading}>Reach out instead of isolating.</h2>
            <input
              value={person}
              onChange={(event) => setPerson(event.target.value)}
              placeholder="Who is one person you could tell?"
              style={{ ...shellStyles.textInput, marginTop: 24 }}
            />
            <div style={{ ...shellStyles.card, marginTop: 18, background: 'rgba(196, 122, 138, 0.06)' }}>
              <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>Message you could send</div>
              <p style={{ ...shellStyles.body, marginTop: 10 }}>{generatedMessage || 'Add a name to generate a message.'}</p>
            </div>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(2)}>Back</SecondaryButton>
              <SecondaryButton
                onClick={async () => {
                  const ok = await copyText(generatedMessage);
                  setCopied(ok);
                }}
                disabled={!generatedMessage}
              >
                {copied ? 'Copied' : 'Copy message'}
              </SecondaryButton>
              <PrimaryButton accent={ACCENT} disabled={!person.trim()} onClick={() => setStep(4)}>
                Final step
              </PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 4 ? (
          <>
            <h2 style={shellStyles.heading}>Speak shame.</h2>
            <input
              value={feeling}
              onChange={(event) => setFeeling(event.target.value)}
              placeholder="How does it make you feel?"
              style={{ ...shellStyles.textInput, marginTop: 24 }}
            />
            <div style={{ ...shellStyles.card, marginTop: 18, background: 'rgba(196, 122, 138, 0.08)' }}>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: 28, lineHeight: 1.4, margin: 0 }}>
                {spokenSentence || 'I feel shame about ... and it makes me feel ...'}
              </p>
            </div>
            <p style={{ ...shellStyles.body, marginTop: 16 }}>
              Naming shame takes it out of hiding, which is exactly where it loses power.
            </p>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(3)}>Back</SecondaryButton>
              <PrimaryButton
                accent={ACCENT}
                disabled={!spokenSentence}
                onClick={() => {
                  appendToStorage('aiforj_shame_resilience', {
                    signals,
                    message,
                    source: source === 'Custom' ? customSource.trim() : source,
                    person,
                    spokenSentence,
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
