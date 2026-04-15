"use client";

import { useMemo, useState } from 'react';
import {
  ANGER_ACCENT,
  InterventionShell,
  PrimaryButton,
  SecondaryButton,
  StepDots,
  appendToStorage,
  rangeStyle,
  shellStyles,
} from './shared';

export default function PerspectiveTaking({ onComplete }) {
  const [step, setStep] = useState(1);
  const [myPerspective, setMyPerspective] = useState('');
  const [theirPerspective, setTheirPerspective] = useState('');
  const [maliciousIntent, setMaliciousIntent] = useState(60);
  const [missingContext, setMissingContext] = useState(30);
  const [justified, setJustified] = useState(80);
  const [humanity, setHumanity] = useState(20);
  const [bestResponse, setBestResponse] = useState('');

  const summary = useMemo(() => ({
    maliciousIntent,
    missingContext,
    justified,
    humanity,
  }), [maliciousIntent, missingContext, justified, humanity]);

  const finish = () => {
    appendToStorage('aiforj_perspective_taking', {
      myPerspective,
      theirPerspective,
      summary,
      bestResponse,
      createdAt: new Date().toISOString(),
    });
    onComplete();
  };

  return (
    <InterventionShell maxWidth={720}>
      <div style={shellStyles.card}>
        <StepDots currentStep={step} totalSteps={4} accent={ANGER_ACCENT} label="CBT + EFT" />

        {step === 1 ? (
          <>
            <div style={shellStyles.eyebrow}>Your view</div>
            <h2 style={shellStyles.heading}>What happened from your perspective?</h2>
            <textarea
              value={myPerspective}
              onChange={(event) => setMyPerspective(event.target.value)}
              placeholder="Describe what happened from your side."
              style={{ ...shellStyles.textarea, marginTop: 22 }}
            />
            <div style={shellStyles.buttonRow}>
              <PrimaryButton onClick={() => setStep(2)} disabled={!myPerspective.trim()}>Next</PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <div style={shellStyles.eyebrow}>Their view</div>
            <h2 style={shellStyles.heading}>Now try writing it from their perspective.</h2>
            <p style={{ ...shellStyles.body, marginTop: 12 }}>
              This is not about excusing the behavior. It is about expanding the frame so you are not trapped inside pure fury.
            </p>
            <textarea
              value={theirPerspective}
              onChange={(event) => setTheirPerspective(event.target.value)}
              placeholder="What might they have been thinking, feeling, or dealing with?"
              style={{ ...shellStyles.textarea, marginTop: 22 }}
            />
            <div style={{ display: 'grid', gap: 10, marginTop: 18 }}>
              {['What pressures might they be under?', "What might be under THEIR iceberg?", "Is it possible they did not realize the impact?"].map((prompt) => (
                <div key={prompt} style={shellStyles.statCard}>
                  <p style={{ ...shellStyles.body, margin: 0, fontSize: 14 }}>{prompt}</p>
                </div>
              ))}
            </div>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(1)}>Back</SecondaryButton>
              <PrimaryButton onClick={() => setStep(3)} disabled={!theirPerspective.trim()}>Next</PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <div style={shellStyles.eyebrow}>Rate the bigger picture</div>
            <h2 style={shellStyles.heading}>Having written both perspectives, what feels true now?</h2>
            <div style={{ display: 'grid', gap: 18, marginTop: 22 }}>
              {[
                ['They acted with malicious intent', maliciousIntent, setMaliciousIntent],
                ["There's context I wasn't considering", missingContext, setMissingContext],
                ['My anger is still justified', justified, setJustified],
                ['I can see their humanity even while disagreeing', humanity, setHumanity],
              ].map(([label, value, setter]) => (
                <div key={label}>
                  <label style={shellStyles.label}>{label}</label>
                  <div style={{ display: 'grid', gap: 10, marginTop: 8 }}>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={value}
                      onChange={(event) => setter(Number(event.target.value))}
                      style={rangeStyle(ANGER_ACCENT)}
                    />
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", color: ANGER_ACCENT }}>{value}%</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(2)}>Back</SecondaryButton>
              <PrimaryButton onClick={() => setStep(4)}>Next</PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 4 ? (
          <>
            <div style={shellStyles.eyebrow}>Best response</div>
            <h2 style={shellStyles.heading}>Given both perspectives, what response serves you best?</h2>
            <textarea
              value={bestResponse}
              onChange={(event) => setBestResponse(event.target.value)}
              placeholder="The response that serves me best is..."
              style={{ ...shellStyles.textarea, marginTop: 22 }}
            />
            <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginTop: 22 }}>
              <div style={shellStyles.statCard}>
                <strong style={{ display: 'block', marginBottom: 8 }}>Your perspective</strong>
                <p style={{ ...shellStyles.body, fontSize: 14 }}>{myPerspective}</p>
              </div>
              <div style={shellStyles.statCard}>
                <strong style={{ display: 'block', marginBottom: 8 }}>Their perspective</strong>
                <p style={{ ...shellStyles.body, fontSize: 14 }}>{theirPerspective}</p>
              </div>
            </div>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(3)}>Back</SecondaryButton>
              <PrimaryButton onClick={finish} disabled={!bestResponse.trim()}>Finish perspective work</PrimaryButton>
            </div>
          </>
        ) : null}
      </div>
    </InterventionShell>
  );
}
