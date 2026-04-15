"use client";

import { useMemo, useState } from 'react';
import {
  ANGER_ACCENT,
  ChoiceCard,
  InterventionShell,
  PrimaryButton,
  SecondaryButton,
  StepDots,
  appendToStorage,
  setStorage,
  splitSentences,
  shellStyles,
} from './shared';

export default function UnsentLetter({ onComplete }) {
  const [step, setStep] = useState(1);
  const [target, setTarget] = useState('');
  const [letter, setLetter] = useState('');
  const [selectedSentences, setSelectedSentences] = useState([]);
  const [needReflection, setNeedReflection] = useState('');
  const [choice, setChoice] = useState('');
  const [secondDraft, setSecondDraft] = useState('');
  const [released, setReleased] = useState(false);

  const sentences = useMemo(() => {
    const split = splitSentences(letter);
    return split.length ? split : letter.split('\n').map((line) => line.trim()).filter(Boolean);
  }, [letter]);

  const toggleSentence = (sentence) => {
    setSelectedSentences((current) => (
      current.includes(sentence)
        ? current.filter((item) => item !== sentence)
        : [...current, sentence]
    ));
  };

  const finish = () => {
    if (choice === 'save') {
      appendToStorage('aiforj_unsent_letters', {
        target,
        letter,
        highlighted: selectedSentences,
        needReflection,
        createdAt: new Date().toISOString(),
      });
    }

    if (choice === 'draft') {
      appendToStorage('aiforj_unsent_letter_drafts', {
        target,
        originalLetter: letter,
        secondDraft,
        highlighted: selectedSentences,
        needReflection,
        createdAt: new Date().toISOString(),
      });
    }

    if (choice === 'delete') {
      setStorage('aiforj_last_letter_release', {
        target,
        releasedAt: new Date().toISOString(),
        highlighted: selectedSentences,
      });
    }

    onComplete();
  };

  return (
    <InterventionShell maxWidth={720}>
      <div style={shellStyles.card}>
        <StepDots currentStep={step} totalSteps={5} accent={ANGER_ACCENT} label="Narrative Release" />

        {step === 1 ? (
          <>
            <div style={shellStyles.eyebrow}>Who is this for?</div>
            <h2 style={shellStyles.heading}>Who are you angry at?</h2>
            <input
              value={target}
              onChange={(event) => setTarget(event.target.value)}
              placeholder="A name, role, or part of yourself"
              style={{ ...shellStyles.textInput, marginTop: 22 }}
            />
            <div style={shellStyles.buttonRow}>
              <PrimaryButton onClick={() => setStep(2)} disabled={!target.trim()}>Start writing</PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <div style={shellStyles.eyebrow}>Raw letter</div>
            <h2 style={shellStyles.heading}>Write everything you wish you could say to {target}.</h2>
            <p style={{ ...shellStyles.body, marginTop: 12 }}>
              No filter. No consequences. The point is volume and honesty, not fairness.
            </p>
            <textarea
              value={letter}
              onChange={(event) => setLetter(event.target.value)}
              placeholder="Write for at least a few minutes. Let the anger speak."
              style={{ ...shellStyles.textarea, marginTop: 22, minHeight: 260 }}
            />
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(1)}>Back</SecondaryButton>
              <PrimaryButton onClick={() => setStep(3)} disabled={letter.trim().length < 40}>Review letter</PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <div style={shellStyles.eyebrow}>Highlight the need</div>
            <h2 style={shellStyles.heading}>Tap every sentence that reveals a need or value underneath the anger.</h2>
            <div style={{ display: 'grid', gap: 12, marginTop: 22 }}>
              {sentences.map((sentence) => (
                <ChoiceCard
                  key={sentence}
                  selected={selectedSentences.includes(sentence)}
                  onClick={() => toggleSentence(sentence)}
                >
                  {sentence}
                </ChoiceCard>
              ))}
            </div>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(2)}>Back</SecondaryButton>
              <PrimaryButton onClick={() => setStep(4)} disabled={!selectedSentences.length}>Next</PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 4 ? (
          <>
            <div style={shellStyles.eyebrow}>What really matters?</div>
            <h2 style={shellStyles.heading}>What do those highlighted lines tell you that you actually need?</h2>
            <div style={{ ...shellStyles.card, marginTop: 22, padding: '18px 18px', background: 'rgba(196, 91, 91, 0.06)' }}>
              {selectedSentences.map((sentence) => (
                <p key={sentence} style={{ ...shellStyles.body, color: 'var(--text-primary)', marginBottom: 10 }}>
                  “{sentence}”
                </p>
              ))}
            </div>
            <textarea
              value={needReflection}
              onChange={(event) => setNeedReflection(event.target.value)}
              placeholder="These lines tell me I need..."
              style={{ ...shellStyles.textarea, marginTop: 22 }}
            />
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(3)}>Back</SecondaryButton>
              <PrimaryButton onClick={() => setStep(5)} disabled={!needReflection.trim()}>Choose what to do</PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 5 ? (
          <>
            <div style={shellStyles.eyebrow}>Release choice</div>
            <h2 style={shellStyles.heading}>What do you want to do with this?</h2>
            <div style={{ display: 'grid', gap: 12, marginTop: 22 }}>
              <ChoiceCard selected={choice === 'save'} onClick={() => setChoice('save')}>
                <strong>Save it privately</strong>
                <p style={{ ...shellStyles.body, fontSize: 14, marginTop: 6 }}>The writing itself was the release. Keep it for later reflection.</p>
              </ChoiceCard>
              <ChoiceCard selected={choice === 'draft'} onClick={() => setChoice('draft')}>
                <strong>Write a second draft</strong>
                <p style={{ ...shellStyles.body, fontSize: 14, marginTop: 6 }}>Turn the raw letter into something you might actually send.</p>
              </ChoiceCard>
              <ChoiceCard selected={choice === 'delete'} onClick={() => setChoice('delete')}>
                <strong>Let it go</strong>
                <p style={{ ...shellStyles.body, fontSize: 14, marginTop: 6 }}>You do not need to carry the whole thing anymore.</p>
              </ChoiceCard>
            </div>

            {choice === 'draft' ? (
              <textarea
                value={secondDraft}
                onChange={(event) => setSecondDraft(event.target.value)}
                placeholder="Write the calmer, clearer version here."
                style={{ ...shellStyles.textarea, marginTop: 22 }}
              />
            ) : null}

            {choice === 'delete' ? (
              <div style={{ ...shellStyles.card, marginTop: 22, textAlign: 'center', opacity: released ? 0.28 : 1, transition: 'opacity 500ms ease' }}>
                <p style={{ ...shellStyles.body, margin: 0 }}>
                  You held the anger, expressed it, and now you get to decide whether it keeps living in your body.
                </p>
                <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
                  <SecondaryButton onClick={() => setReleased(true)}>
                    {released ? 'Released' : 'Release it'}
                  </SecondaryButton>
                </div>
              </div>
            ) : null}

            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(4)}>Back</SecondaryButton>
              <PrimaryButton onClick={finish} disabled={!choice || (choice === 'draft' && !secondDraft.trim()) || (choice === 'delete' && !released)}>
                Finish letter
              </PrimaryButton>
            </div>
          </>
        ) : null}
      </div>
    </InterventionShell>
  );
}
