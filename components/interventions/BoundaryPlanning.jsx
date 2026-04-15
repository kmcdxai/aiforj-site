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
  copyText,
  shellStyles,
} from './shared';

const REACTIONS = {
  respect: {
    label: 'Understand and respect it',
    response: 'Thank you for hearing me. This matters to me.',
  },
  pushback: {
    label: 'Push back',
    response: 'I understand this is a change. And this boundary is important to me.',
  },
  angry: {
    label: 'Get angry',
    response: 'I hear your frustration. I am still going to hold this boundary.',
  },
  guilt: {
    label: 'Guilt-trip me',
    response: 'I can see this is hard. I am not trying to hurt you. And this boundary stays.',
  },
  ignore: {
    label: 'Ignore it',
    response: 'I notice the behavior is still happening. I meant what I said about this boundary.',
  },
};

export default function BoundaryPlanning({ onComplete }) {
  const [step, setStep] = useState(1);
  const [crossedBoundary, setCrossedBoundary] = useState('');
  const [neededBoundary, setNeededBoundary] = useState('');
  const [script, setScript] = useState('I feel/need ___ when ___. Going forward, I need ___. If that does not happen, I will ___.');
  const [reaction, setReaction] = useState('');
  const [copied, setCopied] = useState(false);

  const preparedResponse = useMemo(() => (reaction ? REACTIONS[reaction].response : ''), [reaction]);

  const planText = `Boundary crossed: ${crossedBoundary}\nBoundary needed: ${neededBoundary}\nScript: ${script}\nPrepared response: ${preparedResponse}`;

  const finish = async () => {
    appendToStorage('aiforj_boundary_plans', {
      crossedBoundary,
      neededBoundary,
      script,
      reaction,
      preparedResponse,
      createdAt: new Date().toISOString(),
    });
    const didCopy = await copyText(planText);
    setCopied(didCopy);
    onComplete();
  };

  return (
    <InterventionShell maxWidth={720}>
      <div style={shellStyles.card}>
        <StepDots currentStep={step} totalSteps={4} accent={ANGER_ACCENT} label="Boundary Planning Worksheet" />

        {step === 1 ? (
          <>
            <div style={shellStyles.eyebrow}>Boundary crossed</div>
            <h2 style={shellStyles.heading}>What boundary was crossed?</h2>
            <textarea
              value={crossedBoundary}
              onChange={(event) => setCrossedBoundary(event.target.value)}
              placeholder="My time was not respected / I was spoken to disrespectfully / ..."
              style={{ ...shellStyles.textarea, marginTop: 22 }}
            />
            <div style={shellStyles.buttonRow}>
              <PrimaryButton onClick={() => setStep(2)} disabled={!crossedBoundary.trim()}>Next</PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <div style={shellStyles.eyebrow}>Boundary needed</div>
            <h2 style={shellStyles.heading}>What boundary needs to be set?</h2>
            <textarea
              value={neededBoundary}
              onChange={(event) => setNeededBoundary(event.target.value)}
              placeholder="I need this person to..."
              style={{ ...shellStyles.textarea, marginTop: 22 }}
            />
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(1)}>Back</SecondaryButton>
              <PrimaryButton onClick={() => setStep(3)} disabled={!neededBoundary.trim()}>Next</PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <div style={shellStyles.eyebrow}>Exact words</div>
            <h2 style={shellStyles.heading}>Write the script you want to say out loud.</h2>
            <textarea
              value={script}
              onChange={(event) => setScript(event.target.value)}
              style={{ ...shellStyles.textarea, marginTop: 22 }}
            />
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(2)}>Back</SecondaryButton>
              <PrimaryButton onClick={() => setStep(4)} disabled={!script.trim()}>Next</PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 4 ? (
          <>
            <div style={shellStyles.eyebrow}>Prepare for their reaction</div>
            <h2 style={shellStyles.heading}>How might they respond?</h2>
            <div style={{ display: 'grid', gap: 12, marginTop: 22 }}>
              {Object.entries(REACTIONS).map(([key, value]) => (
                <ChoiceCard key={key} selected={reaction === key} onClick={() => setReaction(key)}>
                  <strong>{value.label}</strong>
                  <p style={{ ...shellStyles.body, fontSize: 14, marginTop: 6 }}>{value.response}</p>
                </ChoiceCard>
              ))}
            </div>

            {reaction ? (
              <div style={{ ...shellStyles.card, marginTop: 22, background: 'rgba(196, 91, 91, 0.06)' }}>
                <strong style={{ display: 'block', marginBottom: 8 }}>Practice this response out loud three times</strong>
                <p style={{ ...shellStyles.body, marginBottom: 12 }}>{preparedResponse}</p>
                <p style={{ ...shellStyles.hint, margin: 0 }}>
                  The goal is not to sound perfect. The goal is to make the boundary easier to hold when your body gets activated.
                </p>
              </div>
            ) : null}

            {copied ? <p style={{ ...shellStyles.hint, marginTop: 12 }}>Boundary plan copied to your clipboard.</p> : null}
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(3)}>Back</SecondaryButton>
              <PrimaryButton onClick={finish} disabled={!reaction}>Finish plan</PrimaryButton>
            </div>
          </>
        ) : null}
      </div>
    </InterventionShell>
  );
}
