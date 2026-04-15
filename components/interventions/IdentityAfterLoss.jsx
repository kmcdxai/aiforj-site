"use client";

import { useMemo, useState } from 'react';
import { ChoiceCard, InterventionShell, PrimaryButton, SecondaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#9B8EC4';
const ROLES = ['Partner / Spouse', 'Parent of a child', "A person's child", 'Employee / professional', 'The healthy one', 'The reliable one', 'Custom'];

export default function IdentityAfterLoss({ onComplete }) {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [inRole, setInRole] = useState('');
  const [independent, setIndependent] = useState('');
  const [becoming, setBecoming] = useState('');

  const resolvedRole = role === 'Custom' ? customRole.trim() : role;
  const panels = useMemo(() => ([
    ['Who I was', inRole],
    ['Who I am', independent],
    ["Who I'm becoming", becoming],
  ]), [becoming, inRole, independent]);

  return (
    <InterventionShell maxWidth={860}>
      <div style={shellStyles.card}>
        <StepDots currentStep={step} totalSteps={4} accent={ACCENT} label="Identity After Loss" />
        {step === 1 ? (
          <>
            <h2 style={shellStyles.heading}>What role or identity did you lose?</h2>
            <div style={{ display: 'grid', gap: 10, marginTop: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
              {ROLES.map((item) => (
                <ChoiceCard key={item} selected={role === item} accent={ACCENT} onClick={() => setRole(item)}>
                  {item}
                </ChoiceCard>
              ))}
            </div>
            {role === 'Custom' ? <input value={customRole} onChange={(event) => setCustomRole(event.target.value)} placeholder="Custom role" style={{ ...shellStyles.textInput, marginTop: 16 }} /> : null}
            <div style={shellStyles.buttonRow}>
              <PrimaryButton accent={ACCENT} disabled={!resolvedRole} onClick={() => setStep(2)}>Explore the role</PrimaryButton>
            </div>
          </>
        ) : null}
        {step === 2 ? (
          <>
            <h2 style={shellStyles.heading}>Who were you in that role? What did it give you?</h2>
            <textarea value={inRole} onChange={(event) => setInRole(event.target.value)} style={{ ...shellStyles.textarea, marginTop: 24 }} />
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(1)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} disabled={!inRole.trim()} onClick={() => setStep(3)}>Find what remains</PrimaryButton>
            </div>
          </>
        ) : null}
        {step === 3 ? (
          <>
            <h2 style={shellStyles.heading}>What parts of you exist independent of that role?</h2>
            <textarea
              value={independent}
              onChange={(event) => setIndependent(event.target.value)}
              placeholder="Your values, humor, relationships, interests, resilience..."
              style={{ ...shellStyles.textarea, marginTop: 24 }}
            />
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(2)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} disabled={!independent.trim()} onClick={() => setStep(4)}>Who are you becoming?</PrimaryButton>
            </div>
          </>
        ) : null}
        {step === 4 ? (
          <>
            <h2 style={shellStyles.heading}>Who are you becoming?</h2>
            <textarea value={becoming} onChange={(event) => setBecoming(event.target.value)} style={{ ...shellStyles.textarea, marginTop: 24 }} />
            {becoming.trim() ? (
              <div style={{ display: 'grid', gap: 12, marginTop: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                {panels.map(([label, text]) => (
                  <div key={label} style={{ ...shellStyles.card, padding: '18px 18px', background: 'var(--surface)' }}>
                    <strong>{label}</strong>
                    <p style={{ ...shellStyles.body, marginTop: 10 }}>{text}</p>
                  </div>
                ))}
              </div>
            ) : null}
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(3)}>Back</SecondaryButton>
              <PrimaryButton
                accent={ACCENT}
                disabled={!becoming.trim()}
                onClick={() => {
                  appendToStorage('aiforj_identity_after_loss', {
                    role: resolvedRole,
                    inRole,
                    independent,
                    becoming,
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
