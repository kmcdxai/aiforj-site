"use client";

import { useState } from 'react';

const SAFETY_BEHAVIORS = [
  "Checking my phone",
  "Avoiding social situations",
  "Seeking reassurance",
  "Over-preparing",
  "Staying near exits",
  "Rehearsing what to say",
  "Avoiding eye contact",
];

const TIME_PERIODS = [
  { label: "1 hour", value: "1 hour" },
  { label: "1 day", value: "1 day" },
  { label: "1 specific situation", value: "situation" },
];

const TOTAL_STEPS = 5;

export default function SafetyBehaviorsExperiment({ onComplete }) {
  const [step, setStep] = useState(1);

  // Step 2 state
  const [selectedBehavior, setSelectedBehavior] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customBehavior, setCustomBehavior] = useState('');

  // Step 3 state
  const [prediction, setPrediction] = useState('');
  const [severity, setSeverity] = useState(5);
  const [confidence, setConfidence] = useState(50);

  // Step 4 state
  const [timePeriod, setTimePeriod] = useState('');
  const [situation, setSituation] = useState('');
  const [observation, setObservation] = useState('');

  // Step 5 state
  const [saved, setSaved] = useState(false);

  const activeBehavior = showCustomInput ? customBehavior : selectedBehavior;

  const getSeverityLabel = (val) => {
    if (val <= 1) return 'Not bad';
    if (val <= 3) return 'Mild';
    if (val <= 5) return 'Uncomfortable';
    if (val <= 7) return 'Distressing';
    if (val <= 9) return 'Severe';
    return 'Catastrophic';
  };

  const handleSaveExperiment = () => {
    const experiment = {
      behavior: activeBehavior,
      prediction,
      confidence,
      severity,
      timePeriod: timePeriod === 'situation' ? 'Specific situation' : timePeriod,
      situation: timePeriod === 'situation' ? situation : null,
      observation,
      date: new Date().toISOString(),
      results: null,
    };
    try {
      const existing = JSON.parse(localStorage.getItem('aiforj_experiments') || '[]');
      existing.push(experiment);
      localStorage.setItem('aiforj_experiments', JSON.stringify(existing));
    } catch {
      localStorage.setItem('aiforj_experiments', JSON.stringify([experiment]));
    }
    setSaved(true);
    onComplete();
  };

  // ──────────── STEP 1: PSYCHOEDUCATION ────────────
  if (step === 1) {
    return (
      <div style={styles.container}>
        <ProgressBar current={1} total={TOTAL_STEPS} />
        <div style={{ ...styles.fadeIn, padding: '40px 24px', maxWidth: 540, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={styles.labIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6B98B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 3h6v6l3 8H6l3-8V3z" />
                <path d="M9 3h6" />
                <circle cx="12" cy="15" r="1" fill="#6B98B8" />
              </svg>
            </div>
            <h2 style={styles.heading}>
              Safety behaviors feel protective{'\u2014'}but they keep anxiety alive.
            </h2>
          </div>

          <div style={styles.infoCard}>
            <p style={{ ...styles.bodyText, marginBottom: 16 }}>
              <strong style={{ color: 'var(--text-primary)' }}>Safety behaviors</strong> are things you do to <em>prevent</em> the feared outcome. The problem? They actually <strong style={{ color: 'var(--text-primary)' }}>maintain anxiety</strong> because you never learn the feared thing won't happen.
            </p>
            <div style={styles.dividerLine} />
            <p style={{ ...styles.monoLabel, marginBottom: 12 }}>Common examples:</p>
            <ul style={styles.exampleList}>
              <li style={styles.exampleItem}>Checking your phone constantly</li>
              <li style={styles.exampleItem}>Avoiding eye contact</li>
              <li style={styles.exampleItem}>Rehearsing conversations in advance</li>
              <li style={styles.exampleItem}>Always sitting near exits</li>
              <li style={styles.exampleItem}>Seeking reassurance from others</li>
            </ul>
          </div>

          <p style={{ ...styles.bodyText, textAlign: 'center', marginTop: 24, marginBottom: 28, color: 'var(--text-muted)', fontSize: 14 }}>
            In this experiment, you'll design a small test to see what actually happens when you drop one of these behaviors.
          </p>

          <div style={{ textAlign: 'center' }}>
            <button onClick={() => setStep(2)} style={styles.primaryBtn}>
              Next {'\u2192'}
            </button>
          </div>
        </div>
        <style>{keyframes}</style>
      </div>
    );
  }

  // ──────────── STEP 2: IDENTIFY ────────────
  if (step === 2) {
    const canProceed = activeBehavior.trim().length > 0;

    return (
      <div style={styles.container}>
        <ProgressBar current={2} total={TOTAL_STEPS} />
        <div style={{ ...styles.fadeIn, padding: '40px 24px', maxWidth: 540, margin: '0 auto' }}>
          <div style={styles.monoLabel}>Step 2 of {TOTAL_STEPS}</div>
          <h2 style={{ ...styles.heading, textAlign: 'left' }}>
            What's a safety behavior <em>you</em> use when anxious?
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 20px', lineHeight: 1.6 }}>
            Pick the one that feels most automatic.
          </p>

          <div style={styles.chipGrid}>
            {SAFETY_BEHAVIORS.map((behavior) => {
              const isSelected = selectedBehavior === behavior && !showCustomInput;
              return (
                <button
                  key={behavior}
                  onClick={() => {
                    setSelectedBehavior(behavior);
                    setShowCustomInput(false);
                    setCustomBehavior('');
                  }}
                  style={{
                    ...styles.chip,
                    background: isSelected ? 'rgba(107,152,184,0.12)' : 'var(--surface-elevated, rgba(255,255,255,0.8))',
                    borderColor: isSelected ? '#6B98B8' : 'var(--border, rgba(107,152,184,0.15))',
                    color: isSelected ? '#4D7693' : 'var(--text-secondary)',
                    fontWeight: isSelected ? 600 : 400,
                    transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                    boxShadow: isSelected ? '0 2px 12px rgba(107,152,184,0.2)' : 'none',
                  }}
                >
                  {isSelected && <span style={styles.chipCheck}>{'\u2713'}</span>}
                  {behavior}
                </button>
              );
            })}

            <button
              onClick={() => {
                setShowCustomInput(true);
                setSelectedBehavior('');
              }}
              style={{
                ...styles.chip,
                background: showCustomInput ? 'rgba(107,152,184,0.12)' : 'var(--surface-elevated, rgba(255,255,255,0.8))',
                borderColor: showCustomInput ? '#6B98B8' : 'var(--border, rgba(107,152,184,0.15))',
                color: showCustomInput ? '#4D7693' : 'var(--text-secondary)',
                fontWeight: showCustomInput ? 600 : 400,
                borderStyle: showCustomInput ? 'solid' : 'dashed',
              }}
            >
              Custom...
            </button>
          </div>

          {showCustomInput && (
            <div style={{ marginTop: 16, animation: 'sbeSlideUp 0.3s ease' }}>
              <input
                type="text"
                value={customBehavior}
                onChange={(e) => setCustomBehavior(e.target.value)}
                placeholder="Describe your safety behavior..."
                autoFocus
                style={styles.textInput}
                onFocus={(e) => { e.target.style.borderColor = '#6B98B8'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(107,152,184,0.2)'; }}
              />
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <button
              onClick={() => setStep(3)}
              disabled={!canProceed}
              style={{
                ...styles.primaryBtn,
                opacity: canProceed ? 1 : 0.4,
                cursor: canProceed ? 'pointer' : 'not-allowed',
              }}
            >
              Next {'\u2192'}
            </button>
          </div>
        </div>
        <style>{keyframes}</style>
      </div>
    );
  }

  // ──────────── STEP 3: PREDICT ────────────
  if (step === 3) {
    const canProceed = prediction.trim().length > 0;

    return (
      <div style={styles.container}>
        <ProgressBar current={3} total={TOTAL_STEPS} />
        <div style={{ ...styles.fadeIn, padding: '40px 24px', maxWidth: 540, margin: '0 auto' }}>
          <div style={styles.monoLabel}>Step 3 of {TOTAL_STEPS}</div>
          <h2 style={{ ...styles.heading, textAlign: 'left' }}>
            What do you <em>predict</em> would happen if you stopped?
          </h2>

          <div style={styles.behaviorCallout}>
            <span style={styles.calloutLabel}>Your behavior:</span>
            <span style={styles.calloutValue}>{activeBehavior}</span>
          </div>

          <label style={styles.fieldLabel}>If I stopped, I think...</label>
          <textarea
            value={prediction}
            onChange={(e) => setPrediction(e.target.value)}
            placeholder="What's the worst-case scenario your mind predicts?"
            rows={3}
            style={styles.textarea}
            onFocus={(e) => { e.target.style.borderColor = '#6B98B8'; }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(107,152,184,0.2)'; }}
          />

          <div style={{ marginTop: 28 }}>
            <label style={styles.fieldLabel}>
              How bad would that be?
              <span style={styles.sliderValue}>{severity}/10 {'\u2014'} {getSeverityLabel(severity)}</span>
            </label>
            <div style={styles.sliderContainer}>
              <span style={styles.sliderBound}>0</span>
              <input
                type="range"
                min={0}
                max={10}
                value={severity}
                onChange={(e) => setSeverity(Number(e.target.value))}
                style={styles.slider}
              />
              <span style={styles.sliderBound}>10</span>
            </div>
            <div style={styles.sliderLabels}>
              <span>Not bad</span>
              <span>Uncomfortable</span>
              <span>Catastrophic</span>
            </div>
          </div>

          <div style={{ marginTop: 28 }}>
            <label style={styles.fieldLabel}>
              How confident are you this would happen?
              <span style={styles.sliderValue}>{confidence}%</span>
            </label>
            <div style={styles.sliderContainer}>
              <span style={styles.sliderBound}>0%</span>
              <input
                type="range"
                min={0}
                max={100}
                value={confidence}
                onChange={(e) => setConfidence(Number(e.target.value))}
                style={styles.slider}
              />
              <span style={styles.sliderBound}>100%</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <div style={styles.navRow}>
              <button onClick={() => setStep(2)} style={styles.backBtn}>
                {'\u2190'} Back
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!canProceed}
                style={{
                  ...styles.primaryBtn,
                  opacity: canProceed ? 1 : 0.4,
                  cursor: canProceed ? 'pointer' : 'not-allowed',
                }}
              >
                Next {'\u2192'}
              </button>
            </div>
          </div>
        </div>
        <style>{keyframes}</style>
      </div>
    );
  }

  // ──────────── STEP 4: DESIGN EXPERIMENT ────────────
  if (step === 4) {
    const canProceed = timePeriod && observation.trim().length > 0 && (timePeriod !== 'situation' || situation.trim().length > 0);

    return (
      <div style={styles.container}>
        <ProgressBar current={4} total={TOTAL_STEPS} />
        <div style={{ ...styles.fadeIn, padding: '40px 24px', maxWidth: 540, margin: '0 auto' }}>
          <div style={styles.monoLabel}>Step 4 of {TOTAL_STEPS}</div>
          <h2 style={{ ...styles.heading, textAlign: 'left' }}>
            Design a tiny experiment.
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', margin: '0 0 8px', lineHeight: 1.6 }}>
            Can you drop <strong style={{ color: '#4D7693' }}>"{activeBehavior.toLowerCase()}"</strong> for:
          </p>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16, marginBottom: 20 }}>
            {TIME_PERIODS.map((tp) => {
              const isSelected = timePeriod === tp.value;
              return (
                <button
                  key={tp.value}
                  onClick={() => setTimePeriod(tp.value)}
                  style={{
                    ...styles.timeChip,
                    background: isSelected ? '#6B98B8' : 'var(--surface-elevated, rgba(255,255,255,0.8))',
                    color: isSelected ? '#fff' : 'var(--text-secondary)',
                    borderColor: isSelected ? '#6B98B8' : 'var(--border, rgba(107,152,184,0.2))',
                    fontWeight: isSelected ? 600 : 400,
                    boxShadow: isSelected ? '0 2px 12px rgba(107,152,184,0.3)' : 'none',
                  }}
                >
                  {tp.label}
                </button>
              );
            })}
          </div>

          {timePeriod === 'situation' && (
            <div style={{ marginBottom: 20, animation: 'sbeSlideUp 0.3s ease' }}>
              <label style={styles.fieldLabel}>What specific situation?</label>
              <input
                type="text"
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder="e.g., Tomorrow's team meeting"
                autoFocus
                style={styles.textInput}
                onFocus={(e) => { e.target.style.borderColor = '#6B98B8'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(107,152,184,0.2)'; }}
              />
            </div>
          )}

          <div style={{ marginTop: 8 }}>
            <label style={styles.fieldLabel}>What will you watch for during the experiment?</label>
            <textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="e.g., Did the feared thing actually happen? How did I feel?"
              rows={3}
              style={styles.textarea}
              onFocus={(e) => { e.target.style.borderColor = '#6B98B8'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(107,152,184,0.2)'; }}
            />
          </div>

          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <div style={styles.navRow}>
              <button onClick={() => setStep(3)} style={styles.backBtn}>
                {'\u2190'} Back
              </button>
              <button
                onClick={() => setStep(5)}
                disabled={!canProceed}
                style={{
                  ...styles.primaryBtn,
                  opacity: canProceed ? 1 : 0.4,
                  cursor: canProceed ? 'pointer' : 'not-allowed',
                }}
              >
                See my experiment {'\u2192'}
              </button>
            </div>
          </div>
        </div>
        <style>{keyframes}</style>
      </div>
    );
  }

  // ──────────── STEP 5: EXPERIMENT CARD ────────────
  const displayTimePeriod = timePeriod === 'situation' ? situation : timePeriod;

  return (
    <div style={styles.container}>
      <ProgressBar current={5} total={TOTAL_STEPS} />
      <div style={{ ...styles.fadeIn, padding: '40px 24px', maxWidth: 540, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={styles.monoLabel}>Your experiment</div>
          <h2 style={{ ...styles.heading, marginBottom: 8 }}>
            Here's your commitment.
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
            Read it over. This is your personal behavioral experiment.
          </p>
        </div>

        {/* Experiment card */}
        <div style={styles.experimentCard}>
          <div style={styles.cardHeader}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B98B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M9 3h6v6l3 8H6l3-8V3z" />
              <path d="M9 3h6" />
            </svg>
            <span style={styles.cardTitle}>MY EXPERIMENT</span>
          </div>
          <div style={styles.cardDivider} />

          <div style={styles.cardBody}>
            <div style={styles.cardRow}>
              <span style={styles.cardLabel}>I will stop:</span>
              <span style={styles.cardValue}>{activeBehavior}</span>
            </div>
            <div style={styles.cardRow}>
              <span style={styles.cardLabel}>During:</span>
              <span style={styles.cardValue}>{displayTimePeriod}</span>
            </div>
            <div style={styles.cardRow}>
              <span style={styles.cardLabel}>I predict:</span>
              <span style={styles.cardValue}>{prediction}</span>
            </div>
            <div style={styles.cardRow}>
              <span style={styles.cardLabel}>Confidence:</span>
              <span style={{ ...styles.cardValue, fontFamily: "'JetBrains Mono', monospace" }}>{confidence}%</span>
            </div>
            <div style={styles.cardRow}>
              <span style={styles.cardLabel}>Expected severity:</span>
              <span style={{ ...styles.cardValue, fontFamily: "'JetBrains Mono', monospace" }}>{severity}/10</span>
            </div>
            <div style={styles.cardRow}>
              <span style={styles.cardLabel}>I'll watch for:</span>
              <span style={styles.cardValue}>{observation}</span>
            </div>
          </div>

          <div style={styles.cardDivider} />
          <div style={styles.cardFooter}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Reminder suggestion */}
        <div style={styles.reminderBox}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B98B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Set a phone alarm to check in after your experiment. Ask yourself: <em>Did the prediction come true?</em>
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <div style={styles.navRow}>
            <button onClick={() => setStep(4)} style={styles.backBtn}>
              {'\u2190'} Back
            </button>
            <button
              onClick={handleSaveExperiment}
              disabled={saved}
              style={{
                ...styles.primaryBtn,
                opacity: saved ? 0.5 : 1,
                cursor: saved ? 'not-allowed' : 'pointer',
              }}
            >
              {saved ? 'Saved' : 'Save experiment'}
            </button>
          </div>
        </div>
      </div>
      <style>{keyframes}</style>
    </div>
  );
}

// ──────────── PROGRESS BAR COMPONENT ────────────
function ProgressBar({ current, total }) {
  const pct = (current / total) * 100;
  return (
    <div style={{ padding: '0 24px', maxWidth: 540, margin: '0 auto 8px', width: '100%', boxSizing: 'border-box' }}>
      <div style={{
        width: '100%',
        height: 3,
        background: 'rgba(107,152,184,0.12)',
        borderRadius: 2,
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #6B98B8, #89B4CF)',
          borderRadius: 2,
          transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1)',
        }} />
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 6,
        fontSize: 11,
        fontFamily: "'JetBrains Mono', monospace",
        color: 'var(--text-muted, rgba(107,152,184,0.5))',
      }}>
        <span>Step {current}/{total}</span>
        <span>{Math.round(pct)}%</span>
      </div>
    </div>
  );
}

// ──────────── KEYFRAME ANIMATIONS ────────────
const keyframes = `
  @keyframes sbeFadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes sbeSlideUp {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes sbeCardReveal {
    from { opacity: 0; transform: scale(0.96) translateY(12px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #6B98B8;
    cursor: pointer;
    border: 3px solid #fff;
    box-shadow: 0 1px 6px rgba(107,152,184,0.35);
    transition: transform 0.15s ease;
  }
  input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.15);
  }
  input[type="range"]::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #6B98B8;
    cursor: pointer;
    border: 3px solid #fff;
    box-shadow: 0 1px 6px rgba(107,152,184,0.35);
  }
  input[type="range"]::-webkit-slider-runnable-track {
    height: 4px;
    border-radius: 2px;
    background: rgba(107,152,184,0.15);
  }
  input[type="range"]::-moz-range-track {
    height: 4px;
    border-radius: 2px;
    background: rgba(107,152,184,0.15);
    border: none;
  }
`;

// ──────────── STYLES ────────────
const styles = {
  container: {
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '20px 0 100px',
  },
  fadeIn: {
    animation: 'sbeFadeIn 0.5s ease',
  },
  heading: {
    fontFamily: "'Fraunces', serif",
    fontSize: 'clamp(1.4rem, 4vw, 1.9rem)',
    fontWeight: 500,
    color: 'var(--text-primary)',
    lineHeight: 1.3,
    margin: '0 0 16px',
  },
  bodyText: {
    fontSize: 15,
    color: 'var(--text-secondary)',
    lineHeight: 1.7,
    margin: 0,
    fontFamily: "'DM Sans', sans-serif",
  },
  monoLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: '#6B98B8',
    fontWeight: 600,
    marginBottom: 12,
    fontFamily: "'JetBrains Mono', monospace",
  },
  labIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    background: 'rgba(107,152,184,0.08)',
    border: '1px solid rgba(107,152,184,0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  },
  infoCard: {
    padding: '24px',
    background: 'var(--surface-elevated, rgba(255,255,255,0.9))',
    borderRadius: 16,
    border: '1px solid var(--border, rgba(107,152,184,0.12))',
    boxShadow: 'var(--shadow-sm, 0 2px 8px rgba(0,0,0,0.04))',
  },
  dividerLine: {
    height: 1,
    background: 'var(--border, rgba(107,152,184,0.1))',
    margin: '16px 0',
  },
  exampleList: {
    margin: 0,
    padding: '0 0 0 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  exampleItem: {
    fontSize: 14,
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
  },
  chipGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    padding: '10px 18px',
    borderRadius: 999,
    border: '1.5px solid',
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    lineHeight: 1.3,
  },
  chipCheck: {
    fontSize: 12,
    fontWeight: 700,
    color: '#6B98B8',
  },
  timeChip: {
    padding: '12px 22px',
    borderRadius: 12,
    border: '1.5px solid',
    fontSize: 15,
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
    flex: '1 1 auto',
    textAlign: 'center',
    minWidth: 100,
  },
  textInput: {
    width: '100%',
    padding: '14px 16px',
    border: '1.5px solid rgba(107,152,184,0.2)',
    borderRadius: 12,
    background: 'rgba(107,152,184,0.03)',
    fontSize: 15,
    color: 'var(--text-primary)',
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '14px 16px',
    border: '1.5px solid rgba(107,152,184,0.2)',
    borderRadius: 12,
    background: 'rgba(107,152,184,0.03)',
    fontSize: 15,
    color: 'var(--text-primary)',
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: 1.6,
    resize: 'none',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box',
  },
  fieldLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--text-primary)',
    marginBottom: 8,
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: 1.4,
  },
  sliderValue: {
    fontSize: 13,
    fontWeight: 600,
    color: '#6B98B8',
    fontFamily: "'JetBrains Mono', monospace",
  },
  sliderContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  sliderBound: {
    fontSize: 11,
    color: 'var(--text-muted)',
    fontFamily: "'JetBrains Mono', monospace",
    flexShrink: 0,
    minWidth: 28,
    textAlign: 'center',
  },
  slider: {
    flex: 1,
    height: 4,
    WebkitAppearance: 'none',
    appearance: 'none',
    background: 'rgba(107,152,184,0.15)',
    borderRadius: 2,
    outline: 'none',
    cursor: 'pointer',
  },
  sliderLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 11,
    color: 'var(--text-muted)',
    marginTop: 6,
    paddingLeft: 40,
    paddingRight: 40,
  },
  behaviorCallout: {
    padding: '12px 16px',
    background: 'rgba(107,152,184,0.06)',
    borderRadius: 10,
    borderLeft: '3px solid #6B98B8',
    marginBottom: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  calloutLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#6B98B8',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 600,
  },
  calloutValue: {
    fontSize: 15,
    color: 'var(--text-primary)',
    fontWeight: 500,
  },
  // Experiment card styles
  experimentCard: {
    background: 'var(--surface-elevated, #fff)',
    borderRadius: 16,
    border: '1.5px solid rgba(107,152,184,0.2)',
    boxShadow: 'var(--shadow-md, 0 4px 24px rgba(0,0,0,0.06))',
    overflow: 'hidden',
    animation: 'sbeCardReveal 0.6s cubic-bezier(0.16,1,0.3,1)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '16px 20px',
    background: 'rgba(107,152,184,0.04)',
  },
  cardTitle: {
    fontSize: 12,
    letterSpacing: '0.2em',
    fontWeight: 700,
    color: '#6B98B8',
    fontFamily: "'JetBrains Mono', monospace",
  },
  cardDivider: {
    height: 1,
    background: 'linear-gradient(90deg, rgba(107,152,184,0.25) 0%, rgba(107,152,184,0.08) 100%)',
  },
  cardBody: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  cardRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  cardLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--text-muted, #9CA3AF)',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 500,
  },
  cardValue: {
    fontSize: 14,
    color: 'var(--text-primary)',
    lineHeight: 1.5,
    fontFamily: "'DM Sans', sans-serif",
  },
  cardFooter: {
    padding: '12px 20px',
    fontSize: 11,
    color: 'var(--text-muted)',
    fontFamily: "'JetBrains Mono', monospace",
    textAlign: 'right',
  },
  reminderBox: {
    marginTop: 20,
    padding: '14px 16px',
    borderRadius: 12,
    background: 'rgba(107,152,184,0.05)',
    border: '1px solid rgba(107,152,184,0.1)',
  },
  primaryBtn: {
    padding: '16px 36px',
    borderRadius: 50,
    background: '#6B98B8',
    color: '#fff',
    border: 'none',
    fontSize: 16,
    fontWeight: 600,
    fontFamily: "'Fraunces', serif",
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
    boxShadow: '0 4px 16px rgba(107,152,184,0.3)',
  },
  backBtn: {
    padding: '12px 20px',
    borderRadius: 50,
    background: 'transparent',
    color: 'var(--text-muted)',
    border: '1px solid var(--border, rgba(107,152,184,0.15))',
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  navRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
};
