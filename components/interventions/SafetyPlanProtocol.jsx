"use client";

import { useState } from 'react';
import { InterventionShell, PrimaryButton, StepDots, setStorage, shellStyles } from './shared';

const ACCENT = '#C4856C';

export default function SafetyPlanProtocol({ onComplete }) {
  const [triggers, setTriggers] = useState('');
  const [warnings, setWarnings] = useState('');
  const [coping, setCoping] = useState('');
  const [people, setPeople] = useState([
    { name: '', phone: '' },
    { name: '', phone: '' },
    { name: '', phone: '' },
  ]);
  const [professionals, setProfessionals] = useState('988 Lifeline\nCrisis Text Line (HOME to 741741)\nTherapist / clinician');
  const [environment, setEnvironment] = useState('');

  return (
    <InterventionShell maxWidth={860}>
      <div style={shellStyles.card}>
        <StepDots currentStep={2} totalSteps={2} accent={ACCENT} label="Safety Plan Protocol" />
        <h2 style={shellStyles.heading}>Build a fear safety plan.</h2>
        <div style={{ display: 'grid', gap: 14, marginTop: 24 }}>
          <textarea value={triggers} onChange={(event) => setTriggers(event.target.value)} placeholder="What situations or triggers increase your fear?" style={shellStyles.textarea} />
          <textarea value={warnings} onChange={(event) => setWarnings(event.target.value)} placeholder="What warning signs show fear is escalating?" style={shellStyles.textarea} />
          <textarea value={coping} onChange={(event) => setCoping(event.target.value)} placeholder="Internal coping strategies you can do alone" style={shellStyles.textarea} />
          {people.map((person, index) => (
            <div key={index} style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr' }}>
              <input value={person.name} onChange={(event) => setPeople((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item))} placeholder={`Support person ${index + 1}`} style={shellStyles.textInput} />
              <input value={person.phone} onChange={(event) => setPeople((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, phone: event.target.value } : item))} placeholder="Phone" style={shellStyles.textInput} />
            </div>
          ))}
          <textarea value={professionals} onChange={(event) => setProfessionals(event.target.value)} placeholder="Professionals or helplines" style={shellStyles.textarea} />
          <textarea value={environment} onChange={(event) => setEnvironment(event.target.value)} placeholder="How can you make your environment feel safer?" style={shellStyles.textarea} />
        </div>
        <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(196, 133, 108, 0.08)' }}>
          <strong style={{ display: 'block', marginBottom: 10 }}>Safety Plan Card</strong>
          <p style={{ ...shellStyles.body, margin: 0 }}>Triggers, warning signs, coping tools, support people, and safer-environment steps all in one place.</p>
        </div>
        <div style={shellStyles.buttonRow}>
          <PrimaryButton
            accent={ACCENT}
            disabled={!triggers.trim() || !warnings.trim() || !coping.trim()}
            onClick={() => {
              setStorage('aiforj_fear_safety_plan', {
                triggers,
                warnings,
                coping,
                people,
                professionals,
                environment,
                createdAt: new Date().toISOString(),
              });
              onComplete();
            }}
          >
            Save safety plan
          </PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
