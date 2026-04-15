"use client";

import { useMemo, useState } from 'react';
import CrisisBanner from './CrisisBanner';
import { ChoiceCard, InterventionShell, PrimaryButton, SecondaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#C47A8A';
const PROTECTIONS = [
  'Fear of success and the expectations that come with it',
  'Fear of being seen or vulnerable',
  "Confirming the belief that I'm not good enough",
  'Fear of change or losing identity',
];

function truncate(value, max = 30) {
  if (!value) return '';
  return value.length > max ? `${value.slice(0, max - 3)}...` : value;
}

function CycleDiagram({ data }) {
  const nodes = [
    { label: 'Approaching Goal', value: data.trigger, x: 250, y: 40 },
    { label: 'Anxiety / Discomfort', value: data.discomfort, x: 430, y: 145 },
    { label: 'Sabotage Behavior', value: data.sabotage, x: 360, y: 320 },
    { label: 'Short-Term Relief', value: data.relief, x: 140, y: 320 },
    { label: 'Long-Term Cost', value: data.cost, x: 70, y: 145 },
  ];

  return (
    <svg viewBox="0 0 500 380" style={{ width: '100%', height: 'auto' }} aria-label="Self-sabotage cycle diagram">
      <defs>
        <marker id="self-sabotage-arrow" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
          <path d="M0 0 L10 4 L0 8 Z" fill={ACCENT} opacity="0.65" />
        </marker>
      </defs>

      {nodes.map((node, index) => {
        const next = nodes[(index + 1) % nodes.length];
        return (
          <path
            key={`${node.label}-arrow`}
            d={`M ${node.x} ${node.y + 28} Q 250 190 ${next.x} ${next.y - 28}`}
            fill="none"
            stroke="rgba(196, 122, 138, 0.32)"
            strokeWidth="2.5"
            markerEnd="url(#self-sabotage-arrow)"
          />
        );
      })}

      {nodes.map((node) => (
        <g key={node.label}>
          <rect
            x={node.x - 70}
            y={node.y - 28}
            width="140"
            height="56"
            rx="16"
            fill="var(--surface-elevated)"
            stroke="rgba(196, 122, 138, 0.45)"
            strokeWidth="1.5"
          />
          <text x={node.x} y={node.y - 6} textAnchor="middle" fontSize="10" fontWeight="700" fill={ACCENT} style={{ letterSpacing: '0.06em' }}>
            {node.label.toUpperCase()}
          </text>
          <text x={node.x} y={node.y + 12} textAnchor="middle" fontSize="12" fill="var(--text-primary)">
            {truncate(node.value || '...')}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function SelfSabotageMapper({ onComplete }) {
  const [step, setStep] = useState(1);
  const [episode, setEpisode] = useState('');
  const [pattern, setPattern] = useState('');
  const [trigger, setTrigger] = useState('');
  const [discomfort, setDiscomfort] = useState('');
  const [sabotage, setSabotage] = useState('');
  const [relief, setRelief] = useState('');
  const [cost, setCost] = useState('');
  const [selectedProtections, setSelectedProtections] = useState([]);
  const [customProtection, setCustomProtection] = useState('');

  const cycleData = useMemo(
    () => ({ trigger, discomfort, sabotage, relief, cost }),
    [cost, discomfort, relief, sabotage, trigger]
  );

  const toggleProtection = (value) => {
    setSelectedProtections((current) => (current.includes(value) ? current.filter((item) => item !== value) : [...current, value]));
  };

  return (
    <InterventionShell maxWidth={900}>
      <div style={shellStyles.card}>
        <CrisisBanner />
        <StepDots currentStep={step} totalSteps={4} accent={ACCENT} label="Self-Sabotage Pattern Mapper" />

        {step === 1 ? (
          <>
            <h2 style={shellStyles.heading}>Describe a recent self-sabotage episode.</h2>
            <textarea value={episode} onChange={(event) => setEpisode(event.target.value)} style={{ ...shellStyles.textarea, marginTop: 24, minHeight: 180 }} />
            <div style={shellStyles.buttonRow}>
              <PrimaryButton accent={ACCENT} disabled={!episode.trim()} onClick={() => setStep(2)}>
                Find the repeating pattern
              </PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <h2 style={shellStyles.heading}>Has this happened before? Describe the pattern.</h2>
            <textarea value={pattern} onChange={(event) => setPattern(event.target.value)} style={{ ...shellStyles.textarea, marginTop: 24, minHeight: 180 }} />
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(1)}>Back</SecondaryButton>
              <PrimaryButton accent={ACCENT} disabled={!pattern.trim()} onClick={() => setStep(3)}>
                Map the cycle
              </PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <h2 style={shellStyles.heading}>Map the cycle clearly enough to interrupt it.</h2>
            <div style={{ display: 'grid', gap: 12, marginTop: 24 }}>
              <input value={trigger} onChange={(event) => setTrigger(event.target.value)} placeholder="Approaching what goal, success, or connection?" style={shellStyles.textInput} />
              <input value={discomfort} onChange={(event) => setDiscomfort(event.target.value)} placeholder="What anxiety or discomfort shows up?" style={shellStyles.textInput} />
              <input value={sabotage} onChange={(event) => setSabotage(event.target.value)} placeholder="What sabotage behavior follows?" style={shellStyles.textInput} />
              <input value={relief} onChange={(event) => setRelief(event.target.value)} placeholder="What short-term relief does it give?" style={shellStyles.textInput} />
              <input value={cost} onChange={(event) => setCost(event.target.value)} placeholder="What long-term consequence does it cost you?" style={shellStyles.textInput} />
            </div>
            <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(196, 122, 138, 0.08)' }}>
              <CycleDiagram data={cycleData} />
            </div>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(2)}>Back</SecondaryButton>
              <PrimaryButton
                accent={ACCENT}
                disabled={!trigger.trim() || !discomfort.trim() || !sabotage.trim() || !relief.trim() || !cost.trim()}
                onClick={() => setStep(4)}
              >
                What is it protecting?
              </PrimaryButton>
            </div>
          </>
        ) : null}

        {step === 4 ? (
          <>
            <h2 style={shellStyles.heading}>What is the sabotage protecting you from?</h2>
            <div style={{ display: 'grid', gap: 10, marginTop: 24 }}>
              {PROTECTIONS.map((item) => (
                <ChoiceCard key={item} selected={selectedProtections.includes(item)} accent={ACCENT} onClick={() => toggleProtection(item)}>
                  {item}
                </ChoiceCard>
              ))}
            </div>
            <input
              value={customProtection}
              onChange={(event) => setCustomProtection(event.target.value)}
              placeholder="Something else it may be protecting you from"
              style={{ ...shellStyles.textInput, marginTop: 14 }}
            />
            <div style={{ ...shellStyles.card, marginTop: 18, background: 'rgba(196, 122, 138, 0.08)' }}>
              <p style={{ ...shellStyles.body, margin: 0 }}>
                Seeing the cycle is the first step. You cannot interrupt what you cannot see.
              </p>
            </div>
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => setStep(3)}>Back</SecondaryButton>
              <PrimaryButton
                accent={ACCENT}
                disabled={!selectedProtections.length && !customProtection.trim()}
                onClick={() => {
                  appendToStorage('aiforj_self_sabotage_mapper', {
                    episode,
                    pattern,
                    cycleData,
                    selectedProtections,
                    customProtection,
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
