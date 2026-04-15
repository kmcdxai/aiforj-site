"use client";

import { useState } from 'react';
import {
  ANGER_ACCENT,
  InterventionShell,
  PrimaryButton,
  SecondaryButton,
  StepDots,
  appendToStorage,
  copyText,
  shellStyles,
} from './shared';

const MAN_GUIDES = [
  { label: 'Mindful', text: 'Stay focused on your goal. If they deflect, come back to your ask.' },
  { label: 'Appear confident', text: 'Steady voice. Upright posture. Fewer extra words.' },
  { label: 'Negotiate', text: 'Flex on the path, not on the boundary.' },
];

export default function DearManScript({ onComplete }) {
  const [step, setStep] = useState(1);
  const [describe, setDescribe] = useState('');
  const [express, setExpress] = useState('');
  const [assertion, setAssertion] = useState('');
  const [reinforce, setReinforce] = useState('');
  const [negotiate, setNegotiate] = useState('');
  const [copied, setCopied] = useState(false);

  const script = `When ${describe || '[describe]'}, I felt ${express || '[express]'}.\nI need ${assertion || '[assert]'}.\nThis matters because ${reinforce || '[reinforce]'}.\nI'm open to ${negotiate || '[negotiate]'}.`;

  const saveScript = async () => {
    appendToStorage('aiforj_dear_man_scripts', {
      describe,
      express,
      assertion,
      reinforce,
      negotiate,
      script,
      createdAt: new Date().toISOString(),
    });
    const didCopy = await copyText(script);
    setCopied(didCopy);
  };

  return (
    <InterventionShell maxWidth={620}>
      <div style={shellStyles.card}>
        <StepDots currentStep={step} totalSteps={5} accent={ANGER_ACCENT} label="DEAR MAN Builder" />

        {step === 1 ? (
          <>
            <div style={shellStyles.eyebrow}>Describe</div>
            <h2 style={shellStyles.heading}>What happened, just the facts?</h2>
            <p style={{ ...shellStyles.body, marginTop: 12 }}>
              Strip out the judgment. A clear description lowers defensiveness and gives your anger structure.
            </p>
            <textarea
              value={describe}
              onChange={(event) => setDescribe(event.target.value)}
              placeholder="When [X] happened..."
              style={{ ...shellStyles.textarea, marginTop: 22 }}
            />
            <div style={shellStyles.buttonRow}>
              <PrimaryButton onClick={() => setStep(2)} disabled={!describe.trim()}>Next</PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <div style={shellStyles.eyebrow}>Express</div>
            <h2 style={shellStyles.heading}>How did it affect you?</h2>
            <p style={{ ...shellStyles.body, marginTop: 12 }}>
              Use I-statements. Name the impact without turning it into an attack.
            </p>
            <textarea
              value={express}
              onChange={(event) => setExpress(event.target.value)}
              placeholder="I felt..."
              style={{ ...shellStyles.textarea, marginTop: 22 }}
            />
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(1)}>Back</SecondaryButton>
              <PrimaryButton onClick={() => setStep(3)} disabled={!express.trim()}>Next</PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <div style={shellStyles.eyebrow}>Assert</div>
            <h2 style={shellStyles.heading}>What do you need?</h2>
            <p style={{ ...shellStyles.body, marginTop: 12 }}>
              Be specific. Your nervous system wants justice. This step turns it into a request.
            </p>
            <textarea
              value={assertion}
              onChange={(event) => setAssertion(event.target.value)}
              placeholder="I need / would like..."
              style={{ ...shellStyles.textarea, marginTop: 22 }}
            />
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(2)}>Back</SecondaryButton>
              <PrimaryButton onClick={() => setStep(4)} disabled={!assertion.trim()}>Next</PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 4 ? (
          <>
            <div style={shellStyles.eyebrow}>Reinforce + MAN</div>
            <h2 style={shellStyles.heading}>Why does meeting this need help both of you?</h2>
            <p style={{ ...shellStyles.body, marginTop: 12 }}>
              Reinforcing gives your request relational context. The MAN reminders help you deliver it cleanly.
            </p>
            <textarea
              value={reinforce}
              onChange={(event) => setReinforce(event.target.value)}
              placeholder="This would help because..."
              style={{ ...shellStyles.textarea, marginTop: 22 }}
            />
            <div style={{ display: 'grid', gap: 12, marginTop: 22 }}>
              {MAN_GUIDES.map((guide) => (
                <div key={guide.label} style={{ ...shellStyles.statCard, background: 'rgba(196, 91, 91, 0.06)' }}>
                  <strong style={{ display: 'block', marginBottom: 6 }}>{guide.label}</strong>
                  <p style={{ ...shellStyles.body, fontSize: 14 }}>{guide.text}</p>
                </div>
              ))}
            </div>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(3)}>Back</SecondaryButton>
              <PrimaryButton onClick={() => setStep(5)} disabled={!reinforce.trim()}>Next</PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 5 ? (
          <>
            <div style={shellStyles.eyebrow}>Negotiate</div>
            <h2 style={shellStyles.heading}>What would you accept as a compromise?</h2>
            <p style={{ ...shellStyles.body, marginTop: 12 }}>
              You do not have to abandon the boundary. This step helps you stay flexible without collapsing.
            </p>
            <textarea
              value={negotiate}
              onChange={(event) => setNegotiate(event.target.value)}
              placeholder="I'm open to..."
              style={{ ...shellStyles.textarea, marginTop: 22 }}
            />
            <div style={{ ...shellStyles.card, marginTop: 22, padding: '20px 18px', background: 'var(--surface)' }}>
              <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.8, color: 'var(--text-primary)' }}>{script}</p>
            </div>
            {copied ? (
              <p style={{ ...shellStyles.hint, marginTop: 12 }}>Script copied and saved. Practice it out loud three times.</p>
            ) : null}
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(4)}>Back</SecondaryButton>
              <SecondaryButton onClick={saveScript}>Copy script</SecondaryButton>
              <PrimaryButton onClick={onComplete} disabled={!negotiate.trim()}>Finish script</PrimaryButton>
            </div>
          </>
        ) : null}
      </div>
    </InterventionShell>
  );
}
