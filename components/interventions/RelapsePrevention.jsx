"use client";

import { useState } from 'react';
import CrisisBanner from './CrisisBanner';
import { InterventionShell, PrimaryButton, StepDots, setStorage, shellStyles } from './shared';

const ACCENT = '#C47A8A';

export default function RelapsePrevention({ onComplete }) {
  const [highRisk, setHighRisk] = useState('');
  const [warningSigns, setWarningSigns] = useState('');
  const [toolkit, setToolkit] = useState('');
  const [people, setPeople] = useState([
    { name: '', phone: '', script: "I'm struggling and I need support right now." },
    { name: '', phone: '', script: "I'm struggling and I need support right now." },
    { name: '', phone: '', script: "I'm struggling and I need support right now." },
  ]);
  const [environment, setEnvironment] = useState('');
  const [commitment, setCommitment] = useState('');

  const updatePerson = (index, field, value) => {
    setPeople((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)));
  };

  return (
    <InterventionShell maxWidth={920}>
      <div style={shellStyles.card}>
        <CrisisBanner />
        <StepDots currentStep={2} totalSteps={2} accent={ACCENT} label="Relapse Prevention Plan" />
        <h2 style={shellStyles.heading}>Build a plan for the moments when the pattern tries to come back.</h2>

        <div style={{ display: 'grid', gap: 14, marginTop: 24 }}>
          <textarea
            value={highRisk}
            onChange={(event) => setHighRisk(event.target.value)}
            placeholder="High-risk situations for me..."
            style={{ ...shellStyles.textarea, minHeight: 110 }}
          />
          <textarea
            value={warningSigns}
            onChange={(event) => setWarningSigns(event.target.value)}
            placeholder="My early warning signs..."
            style={{ ...shellStyles.textarea, minHeight: 110 }}
          />
          <textarea
            value={toolkit}
            onChange={(event) => setToolkit(event.target.value)}
            placeholder="My coping toolkit..."
            style={{ ...shellStyles.textarea, minHeight: 110 }}
          />

          <div style={{ display: 'grid', gap: 12 }}>
            {people.map((person, index) => (
              <div key={index} style={{ ...shellStyles.card, padding: '18px 18px', background: 'var(--surface)' }}>
                <strong style={{ display: 'block', marginBottom: 12 }}>Support person {index + 1}</strong>
                <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                  <input
                    value={person.name}
                    onChange={(event) => updatePerson(index, 'name', event.target.value)}
                    placeholder="Name"
                    style={shellStyles.textInput}
                  />
                  <input
                    value={person.phone}
                    onChange={(event) => updatePerson(index, 'phone', event.target.value)}
                    placeholder="Phone"
                    style={shellStyles.textInput}
                  />
                </div>
                <textarea
                  value={person.script}
                  onChange={(event) => updatePerson(index, 'script', event.target.value)}
                  placeholder="What to say"
                  style={{ ...shellStyles.textarea, marginTop: 10, minHeight: 90 }}
                />
              </div>
            ))}
          </div>

          <textarea
            value={environment}
            onChange={(event) => setEnvironment(event.target.value)}
            placeholder="Environmental changes I can make..."
            style={{ ...shellStyles.textarea, minHeight: 110 }}
          />
          <textarea
            value={commitment}
            onChange={(event) => setCommitment(event.target.value)}
            placeholder="I choose [value] over [destructive pattern] because [reason]."
            style={{ ...shellStyles.textarea, minHeight: 110 }}
          />
        </div>

        <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(196, 122, 138, 0.08)' }}>
          <strong style={{ display: 'block', marginBottom: 10 }}>If you slip, return to the plan.</strong>
          <p style={{ ...shellStyles.body, margin: 0 }}>
            One slip is not failure. The most important moment is what you do after a slip: reconnect, reduce harm, and come back to the plan instead of abandoning it.
          </p>
        </div>

        <div style={shellStyles.buttonRow}>
          <PrimaryButton
            accent={ACCENT}
            disabled={!highRisk.trim() || !warningSigns.trim() || !toolkit.trim() || !environment.trim() || !commitment.trim()}
            onClick={() => {
              setStorage('aiforj_relapse_prevention', {
                highRisk,
                warningSigns,
                toolkit,
                people,
                environment,
                commitment,
                createdAt: new Date().toISOString(),
              });
              onComplete();
            }}
          >
            Save relapse plan
          </PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
