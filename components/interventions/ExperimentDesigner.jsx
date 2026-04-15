"use client";

import { useState } from 'react';
import { ChoiceCard, InterventionShell, PrimaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#D4A843';
const DURATIONS = ['1 hour', '1 day', '1 week'];

export default function ExperimentDesigner({ onComplete }) {
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('');
  const [testing, setTesting] = useState('');
  const [hypothesis, setHypothesis] = useState('');
  const [success, setSuccess] = useState('');
  const [start, setStart] = useState('');

  return (
    <InterventionShell maxWidth={760}>
      <div style={shellStyles.card}>
        <StepDots currentStep={2} totalSteps={2} accent={ACCENT} label="Experiment Designer" />
        <h2 style={shellStyles.heading}>Design a tiny experiment instead of a permanent decision.</h2>
        <div style={{ display: 'grid', gap: 14, marginTop: 24 }}>
          <input value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="What are you considering?" style={shellStyles.textInput} />
          <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
            {DURATIONS.map((item) => (
              <ChoiceCard key={item} selected={duration === item} accent={ACCENT} onClick={() => setDuration(item)}>
                {item}
              </ChoiceCard>
            ))}
          </div>
          <textarea value={testing} onChange={(event) => setTesting(event.target.value)} placeholder="What are you testing?" style={{ ...shellStyles.textarea, minHeight: 110 }} />
          <textarea value={hypothesis} onChange={(event) => setHypothesis(event.target.value)} placeholder="What's your hypothesis?" style={{ ...shellStyles.textarea, minHeight: 110 }} />
          <textarea value={success} onChange={(event) => setSuccess(event.target.value)} placeholder="What would success look like?" style={{ ...shellStyles.textarea, minHeight: 110 }} />
          <input value={start} onChange={(event) => setStart(event.target.value)} placeholder="Start date or time" style={shellStyles.textInput} />
        </div>
        {topic && duration && testing && hypothesis && success && start ? (
          <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(212, 168, 67, 0.08)' }}>
            <p style={{ ...shellStyles.body, margin: 0 }}>
              Experiment: {topic}. Duration: {duration}. Testing: {hypothesis}. Start: {start}. Success looks like: {success}.
            </p>
          </div>
        ) : null}
        <div style={shellStyles.buttonRow}>
          <PrimaryButton
            accent={ACCENT}
            disabled={!topic.trim() || !duration || !testing.trim() || !hypothesis.trim() || !success.trim() || !start.trim()}
            onClick={() => {
              appendToStorage('aiforj_experiment_designer', {
                topic,
                duration,
                testing,
                hypothesis,
                success,
                start,
                createdAt: new Date().toISOString(),
              });
              onComplete();
            }}
          >
            Save experiment
          </PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
