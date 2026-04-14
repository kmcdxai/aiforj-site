"use client";

import { useState, useEffect } from 'react';

// Steps: 'intro' | 1-7 | 'complete'
const EMOTIONS_LIST = [
  'Anxious', 'Sad', 'Angry', 'Ashamed', 'Scared',
  'Frustrated', 'Hopeless', 'Guilty', 'Overwhelmed', 'Hurt',
];

const DISTORTIONS = [
  { name: 'Catastrophizing', def: 'Assuming the worst will happen' },
  { name: 'Mind Reading', def: 'Assuming you know what others think' },
  { name: 'Fortune Telling', def: 'Predicting negative outcomes' },
  { name: 'All-or-Nothing', def: 'Seeing things in black and white' },
  { name: 'Overgeneralization', def: 'One event = always/never' },
  { name: 'Mental Filtering', def: 'Focusing only on the negative' },
  { name: 'Disqualifying Positives', def: 'Dismissing good things' },
  { name: 'Should Statements', def: 'Rigid rules for self/others' },
  { name: 'Labeling', def: 'Attaching a global label to self' },
  { name: 'Personalization', def: 'Taking blame for external events' },
];

const HELPER_PROMPTS = [
  'What would I tell a friend?',
  'Have I handled similar situations before?',
  'Am I confusing a thought with a fact?',
];

const COLUMN_LABELS = [
  'Situation',
  'Emotions',
  'Automatic Thoughts',
  'Evidence For',
  'Evidence Against',
  'Distortions',
  'Balanced Thought',
];

export default function FullCognitiveRestructuring({ onComplete }) {
  const [step, setStep] = useState('intro');

  // Column 1
  const [situation, setSituation] = useState('');

  // Column 2
  const [selectedEmotions, setSelectedEmotions] = useState({});
  // { emotionName: intensity(1-10) }

  // Column 3
  const [thoughts, setThoughts] = useState([]);
  // [{ text, belief }]
  const [thoughtDraft, setThoughtDraft] = useState('');

  // Column 4
  const [evidenceFor, setEvidenceFor] = useState([]);
  const [evidenceForDraft, setEvidenceForDraft] = useState('');

  // Column 5
  const [evidenceAgainst, setEvidenceAgainst] = useState([]);
  const [evidenceAgainstDraft, setEvidenceAgainstDraft] = useState('');
  const [showHelpers, setShowHelpers] = useState(false);

  // Column 6
  const [selectedDistortions, setSelectedDistortions] = useState([]);

  // Column 7
  const [balancedThought, setBalancedThought] = useState('');
  const [emotionsAfter, setEmotionsAfter] = useState({});
  const [beliefsAfter, setBeliefsAfter] = useState({});

  // Fade in helper prompts for column 5
  useEffect(() => {
    if (step === 5) {
      const timer = setTimeout(() => setShowHelpers(true), 1500);
      return () => clearTimeout(timer);
    } else {
      setShowHelpers(false);
    }
  }, [step]);

  // Initialize column 7 re-ratings
  useEffect(() => {
    if (step === 7) {
      const ea = {};
      Object.keys(selectedEmotions).forEach(e => { ea[e] = selectedEmotions[e]; });
      setEmotionsAfter(ea);
      const ba = {};
      thoughts.forEach((t, i) => { ba[i] = t.belief; });
      setBeliefsAfter(ba);
    }
  }, [step]);

  const stepNum = step === 'intro' ? -1 : step === 'complete' ? 8 : step;

  const canProceed = () => {
    switch (step) {
      case 1: return situation.trim().length > 0;
      case 2: return Object.keys(selectedEmotions).length > 0;
      case 3: return thoughts.length > 0;
      case 4: return evidenceFor.length > 0;
      case 5: return evidenceAgainst.length > 0;
      case 6: return selectedDistortions.length > 0;
      case 7: return balancedThought.trim().length > 0;
      default: return true;
    }
  };

  const goNext = () => {
    if (step === 'intro') setStep(1);
    else if (step === 7) handleComplete();
    else setStep(step + 1);
  };

  const goBack = () => {
    if (step === 1) setStep('intro');
    else if (step === 'complete') setStep(7);
    else if (typeof step === 'number') setStep(step - 1);
  };

  const handleComplete = () => {
    // Save to localStorage
    const record = {
      situation,
      emotions: { ...selectedEmotions },
      emotionsAfter: { ...emotionsAfter },
      thoughts: thoughts.map((t, i) => ({
        text: t.text,
        beliefBefore: t.belief,
        beliefAfter: beliefsAfter[i] ?? t.belief,
      })),
      evidenceFor: [...evidenceFor],
      evidenceAgainst: [...evidenceAgainst],
      distortions: [...selectedDistortions],
      balancedThought,
      date: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem('aiforj_restructuring_records') || '[]');
      existing.push(record);
      localStorage.setItem('aiforj_restructuring_records', JSON.stringify(existing));
    } catch (e) {
      // Silent fail on storage errors
    }

    setStep('complete');
  };

  const toggleEmotion = (name) => {
    setSelectedEmotions(prev => {
      const next = { ...prev };
      if (next[name] !== undefined) {
        delete next[name];
      } else {
        next[name] = 5;
      }
      return next;
    });
  };

  const setEmotionIntensity = (name, val) => {
    setSelectedEmotions(prev => ({ ...prev, [name]: val }));
  };

  const addThought = () => {
    if (!thoughtDraft.trim()) return;
    setThoughts(prev => [...prev, { text: thoughtDraft.trim(), belief: 50 }]);
    setThoughtDraft('');
  };

  const setThoughtBelief = (idx, val) => {
    setThoughts(prev => prev.map((t, i) => i === idx ? { ...t, belief: val } : t));
  };

  const addEvidenceFor = () => {
    if (!evidenceForDraft.trim()) return;
    setEvidenceFor(prev => [...prev, evidenceForDraft.trim()]);
    setEvidenceForDraft('');
  };

  const addEvidenceAgainst = () => {
    if (!evidenceAgainstDraft.trim()) return;
    setEvidenceAgainst(prev => [...prev, evidenceAgainstDraft.trim()]);
    setEvidenceAgainstDraft('');
  };

  const toggleDistortion = (name) => {
    setSelectedDistortions(prev =>
      prev.includes(name) ? prev.filter(d => d !== name) : [...prev, name]
    );
  };

  // --- PROGRESS BAR ---
  const renderProgress = () => {
    if (step === 'intro' || step === 'complete') return null;
    return (
      <div style={{ padding: '0 24px', maxWidth: 560, margin: '0 auto 8px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {COLUMN_LABELS.map((label, i) => {
            const colNum = i + 1;
            const isComplete = stepNum > colNum;
            const isCurrent = stepNum === colNum;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "'JetBrains Mono', monospace",
                  flexShrink: 0,
                  transition: 'all 0.3s ease',
                  background: isComplete
                    ? '#9B8EC4'
                    : isCurrent
                      ? 'rgba(155,142,196,0.15)'
                      : 'rgba(155,142,196,0.06)',
                  color: isComplete
                    ? '#fff'
                    : isCurrent
                      ? '#9B8EC4'
                      : 'var(--text-muted)',
                  border: isCurrent
                    ? '2px solid #9B8EC4'
                    : '2px solid transparent',
                }}>
                  {isComplete ? '\u2713' : colNum}
                </div>
                {i < 6 && (
                  <div style={{
                    flex: 1,
                    height: 2,
                    background: isComplete ? '#9B8EC4' : 'rgba(155,142,196,0.12)',
                    transition: 'background 0.3s ease',
                    minWidth: 8,
                  }} />
                )}
              </div>
            );
          })}
        </div>
        <div style={{
          textAlign: 'center',
          marginTop: 10,
          fontSize: 11,
          fontFamily: "'JetBrains Mono', monospace",
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#9B8EC4',
          fontWeight: 600,
        }}>
          {COLUMN_LABELS[stepNum - 1]}
        </div>
      </div>
    );
  };

  // --- INTRO ---
  if (step === 'intro') {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.fadeIn, textAlign: 'center', padding: '48px 24px', maxWidth: 540, margin: '0 auto' }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'rgba(155,142,196,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 28px',
            fontSize: 32,
          }}>
            {'\uD83E\uDDE0'}
          </div>
          <h2 style={styles.heading}>
            Complete Thought Record
          </h2>
          <p style={styles.subtext}>
            The 7-column thought record is one of the most powerful tools in cognitive behavioral therapy.
            You'll examine a difficult thought from every angle{'\u2014'}then reshape it.
          </p>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            justifyContent: 'center',
            marginBottom: 32,
          }}>
            {COLUMN_LABELS.map((label, i) => (
              <div key={i} style={{
                padding: '6px 14px',
                borderRadius: 20,
                background: 'rgba(155,142,196,0.08)',
                fontSize: 13,
                color: 'var(--text-secondary)',
                fontFamily: "'DM Sans', sans-serif",
                whiteSpace: 'nowrap',
              }}>
                <span style={{ color: '#9B8EC4', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, marginRight: 6 }}>{i + 1}</span>
                {label}
              </div>
            ))}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 32,
            fontSize: 14,
            color: 'var(--text-muted)',
          }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{'\u23F1'}</span>
            <span>About 18 minutes</span>
            <span style={{ margin: '0 4px', opacity: 0.3 }}>{'\u00B7'}</span>
            <span>7 steps</span>
          </div>
          <button onClick={goNext} style={styles.primaryBtn}>
            Begin thought record {'\u2192'}
          </button>
        </div>
        <style>{`
          @keyframes crFadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes crSlideUp {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // --- COLUMN 1: SITUATION ---
  if (step === 1) {
    return (
      <div style={styles.container}>
        {renderProgress()}
        <div style={{ ...styles.fadeIn, padding: '28px 24px', maxWidth: 540, margin: '0 auto' }}>
          <button onClick={goBack} style={styles.backBtn}>{'\u2190'} Back</button>
          <div style={styles.stepLabel}>Column 1 of 7</div>
          <h2 style={{ ...styles.heading, textAlign: 'left' }}>
            Describe the triggering event in factual terms.
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 20px', lineHeight: 1.6 }}>
            What happened? Where were you? Who was involved? Stick to observable facts.
          </p>
          <textarea
            value={situation}
            onChange={e => setSituation(e.target.value)}
            placeholder={'e.g., "My manager gave critical feedback on my report during the team meeting in front of six colleagues."'}
            rows={5}
            style={styles.textarea}
            onFocus={e => { e.target.style.borderColor = '#9B8EC4'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(155,142,196,0.2)'; }}
          />
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <button
              onClick={goNext}
              disabled={!canProceed()}
              style={{
                ...styles.primaryBtn,
                opacity: canProceed() ? 1 : 0.4,
                cursor: canProceed() ? 'pointer' : 'not-allowed',
              }}
            >
              Next: Emotions {'\u2192'}
            </button>
          </div>
        </div>
        <style>{`
          @keyframes crFadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // --- COLUMN 2: EMOTIONS ---
  if (step === 2) {
    const selectedKeys = Object.keys(selectedEmotions);
    return (
      <div style={styles.container}>
        {renderProgress()}
        <div style={{ ...styles.fadeIn, padding: '28px 24px', maxWidth: 540, margin: '0 auto' }}>
          <button onClick={goBack} style={styles.backBtn}>{'\u2190'} Back</button>
          <div style={styles.stepLabel}>Column 2 of 7</div>
          <h2 style={{ ...styles.heading, textAlign: 'left' }}>
            What emotions came up?
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 20px', lineHeight: 1.6 }}>
            Select all that apply, then rate each from 1{'\u2013'}10.
          </p>

          {/* Emotion chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
            {EMOTIONS_LIST.map(name => {
              const isSelected = selectedEmotions[name] !== undefined;
              return (
                <button
                  key={name}
                  onClick={() => toggleEmotion(name)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 24,
                    border: isSelected ? '2px solid #9B8EC4' : '2px solid rgba(155,142,196,0.15)',
                    background: isSelected ? 'rgba(155,142,196,0.12)' : 'rgba(155,142,196,0.03)',
                    color: isSelected ? '#9B8EC4' : 'var(--text-secondary)',
                    fontSize: 14,
                    fontWeight: isSelected ? 600 : 400,
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {isSelected && <span style={{ marginRight: 6 }}>{'\u2713'}</span>}
                  {name}
                </button>
              );
            })}
          </div>

          {/* Intensity sliders for selected */}
          {selectedKeys.length > 0 && (
            <div style={{
              padding: '20px',
              background: 'var(--surface-elevated)',
              borderRadius: 16,
              border: '1px solid rgba(155,142,196,0.1)',
              marginBottom: 24,
            }}>
              <div style={{
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--text-muted)',
                fontFamily: "'JetBrains Mono', monospace",
                marginBottom: 16,
              }}>
                Rate intensity
              </div>
              {selectedKeys.map(name => (
                <div key={name} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 14,
                }}>
                  <span style={{
                    width: 110,
                    fontSize: 14,
                    color: 'var(--text-primary)',
                    fontWeight: 500,
                    flexShrink: 0,
                  }}>
                    {name}
                  </span>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={selectedEmotions[name]}
                    onChange={e => setEmotionIntensity(name, parseInt(e.target.value))}
                    style={{ flex: 1, accentColor: '#9B8EC4' }}
                  />
                  <span style={{
                    width: 32,
                    textAlign: 'center',
                    fontSize: 16,
                    fontWeight: 700,
                    fontFamily: "'JetBrains Mono', monospace",
                    color: selectedEmotions[name] >= 7 ? '#9B8EC4' : 'var(--text-secondary)',
                  }}>
                    {selectedEmotions[name]}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Selected emotion pills */}
          {selectedKeys.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {selectedKeys.map(name => (
                <div key={name} style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  background: 'rgba(155,142,196,0.12)',
                  fontSize: 13,
                  color: '#9B8EC4',
                  fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {name} <span style={{ fontFamily: "'JetBrains Mono', monospace", marginLeft: 4 }}>{selectedEmotions[name]}/10</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={goNext}
              disabled={!canProceed()}
              style={{
                ...styles.primaryBtn,
                opacity: canProceed() ? 1 : 0.4,
                cursor: canProceed() ? 'pointer' : 'not-allowed',
              }}
            >
              Next: Automatic Thoughts {'\u2192'}
            </button>
          </div>
        </div>
        <style>{`
          @keyframes crFadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // --- COLUMN 3: AUTOMATIC THOUGHTS ---
  if (step === 3) {
    return (
      <div style={styles.container}>
        {renderProgress()}
        <div style={{ ...styles.fadeIn, padding: '28px 24px', maxWidth: 540, margin: '0 auto' }}>
          <button onClick={goBack} style={styles.backBtn}>{'\u2190'} Back</button>
          <div style={styles.stepLabel}>Column 3 of 7</div>
          <h2 style={{ ...styles.heading, textAlign: 'left' }}>
            What thoughts went through your mind?
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 20px', lineHeight: 1.6 }}>
            Capture the automatic thoughts{'\u2014'}the ones that popped up in the moment. Rate how strongly you believe each one.
          </p>

          {/* Add thought input */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <input
              type="text"
              value={thoughtDraft}
              onChange={e => setThoughtDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addThought(); }}
              placeholder={'"I\'m going to get fired" or "Everyone thinks I\'m incompetent"'}
              style={{
                flex: 1,
                padding: '14px 18px',
                border: '1.5px solid rgba(155,142,196,0.2)',
                borderRadius: 14,
                background: 'rgba(155,142,196,0.04)',
                fontSize: 15,
                color: 'var(--text-primary)',
                fontFamily: "'DM Sans', sans-serif",
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <button
              onClick={addThought}
              disabled={!thoughtDraft.trim()}
              style={{
                padding: '14px 22px',
                borderRadius: 14,
                border: 'none',
                background: thoughtDraft.trim() ? '#9B8EC4' : 'rgba(155,142,196,0.15)',
                color: thoughtDraft.trim() ? '#fff' : 'var(--text-muted)',
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                cursor: thoughtDraft.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
                flexShrink: 0,
              }}
            >
              Add
            </button>
          </div>

          {/* Thought cards */}
          {thoughts.map((thought, idx) => (
            <div key={idx} style={{
              padding: '18px 20px',
              background: 'var(--surface-elevated)',
              borderRadius: 16,
              border: '1px solid rgba(155,142,196,0.1)',
              marginBottom: 12,
              animation: 'crSlideUp 0.3s ease',
            }}>
              <p style={{
                fontSize: 15,
                color: 'var(--text-primary)',
                margin: '0 0 14px',
                lineHeight: 1.5,
                fontStyle: 'italic',
              }}>
                "{thought.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  fontFamily: "'JetBrains Mono', monospace",
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  flexShrink: 0,
                }}>
                  Belief
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={thought.belief}
                  onChange={e => setThoughtBelief(idx, parseInt(e.target.value))}
                  style={{ flex: 1, accentColor: '#9B8EC4' }}
                />
                <span style={{
                  fontSize: 15,
                  fontWeight: 700,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: thought.belief >= 70 ? '#9B8EC4' : 'var(--text-secondary)',
                  width: 44,
                  textAlign: 'right',
                }}>
                  {thought.belief}%
                </span>
              </div>
            </div>
          ))}

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button
              onClick={goNext}
              disabled={!canProceed()}
              style={{
                ...styles.primaryBtn,
                opacity: canProceed() ? 1 : 0.4,
                cursor: canProceed() ? 'pointer' : 'not-allowed',
              }}
            >
              Next: Evidence For {'\u2192'}
            </button>
          </div>
        </div>
        <style>{`
          @keyframes crFadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes crSlideUp {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // --- COLUMN 4: EVIDENCE FOR ---
  if (step === 4) {
    return (
      <div style={styles.container}>
        {renderProgress()}
        <div style={{ ...styles.fadeIn, padding: '28px 24px', maxWidth: 540, margin: '0 auto' }}>
          <button onClick={goBack} style={styles.backBtn}>{'\u2190'} Back</button>
          <div style={styles.stepLabel}>Column 4 of 7</div>
          <h2 style={{ ...styles.heading, textAlign: 'left' }}>
            What facts support this thought being true?
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 6px', lineHeight: 1.6 }}>
            List concrete, observable evidence{'\u2014'}not feelings or interpretations.
          </p>
          {/* Show the thoughts being examined */}
          <div style={{
            padding: '12px 16px',
            background: 'rgba(155,142,196,0.05)',
            borderRadius: 12,
            borderLeft: '3px solid rgba(155,142,196,0.25)',
            marginBottom: 20,
          }}>
            {thoughts.map((t, i) => (
              <p key={i} style={{
                fontSize: 13,
                color: 'var(--text-muted)',
                margin: i < thoughts.length - 1 ? '0 0 6px' : 0,
                fontStyle: 'italic',
                lineHeight: 1.5,
              }}>
                "{t.text}"
              </p>
            ))}
          </div>

          {/* Add evidence input */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <textarea
              value={evidenceForDraft}
              onChange={e => setEvidenceForDraft(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addEvidenceFor(); }
              }}
              placeholder="Enter a piece of supporting evidence..."
              rows={2}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '1.5px solid rgba(155,142,196,0.2)',
                borderRadius: 14,
                background: 'rgba(155,142,196,0.04)',
                fontSize: 14,
                color: 'var(--text-primary)',
                fontFamily: "'DM Sans', sans-serif",
                outline: 'none',
                resize: 'none',
                boxSizing: 'border-box',
                lineHeight: 1.5,
              }}
            />
            <button
              onClick={addEvidenceFor}
              disabled={!evidenceForDraft.trim()}
              style={{
                padding: '12px 20px',
                borderRadius: 14,
                border: 'none',
                background: evidenceForDraft.trim() ? '#9B8EC4' : 'rgba(155,142,196,0.15)',
                color: evidenceForDraft.trim() ? '#fff' : 'var(--text-muted)',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                cursor: evidenceForDraft.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
                flexShrink: 0,
                alignSelf: 'flex-start',
              }}
            >
              Add
            </button>
          </div>

          {/* Evidence list */}
          {evidenceFor.length > 0 && (
            <div style={{
              padding: '16px 20px',
              background: 'var(--surface-elevated)',
              borderRadius: 14,
              border: '1px solid rgba(155,142,196,0.1)',
              marginBottom: 20,
            }}>
              {evidenceFor.map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  marginBottom: i < evidenceFor.length - 1 ? 10 : 0,
                  animation: 'crSlideUp 0.3s ease',
                }}>
                  <span style={{ color: '#9B8EC4', fontSize: 18, lineHeight: 1.3, flexShrink: 0 }}>{'\u2022'}</span>
                  <span style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button
              onClick={goNext}
              disabled={!canProceed()}
              style={{
                ...styles.primaryBtn,
                opacity: canProceed() ? 1 : 0.4,
                cursor: canProceed() ? 'pointer' : 'not-allowed',
              }}
            >
              Next: Evidence Against {'\u2192'}
            </button>
          </div>
        </div>
        <style>{`
          @keyframes crFadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes crSlideUp {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // --- COLUMN 5: EVIDENCE AGAINST (with balance visualization) ---
  if (step === 5) {
    // Calculate tilt for balance scale
    const forCount = evidenceFor.length;
    const againstCount = evidenceAgainst.length;
    const maxTilt = 12;
    const tilt = forCount === 0 && againstCount === 0
      ? 0
      : ((forCount - againstCount) / Math.max(forCount + againstCount, 1)) * maxTilt;

    return (
      <div style={styles.container}>
        {renderProgress()}
        <div style={{ ...styles.fadeIn, padding: '28px 24px', maxWidth: 540, margin: '0 auto' }}>
          <button onClick={goBack} style={styles.backBtn}>{'\u2190'} Back</button>
          <div style={styles.stepLabel}>Column 5 of 7</div>
          <h2 style={{ ...styles.heading, textAlign: 'left' }}>
            What facts suggest this thought might not be completely true?
          </h2>

          {/* BALANCE SCALE VISUALIZATION */}
          <div style={{
            padding: '24px 16px 20px',
            marginBottom: 24,
            position: 'relative',
          }}>
            {/* Fulcrum / center post */}
            <div style={{
              position: 'absolute',
              left: '50%',
              bottom: 16,
              transform: 'translateX(-50%)',
              width: 4,
              height: 40,
              background: 'rgba(155,142,196,0.25)',
              borderRadius: 2,
            }} />
            {/* Triangle base */}
            <div style={{
              position: 'absolute',
              left: '50%',
              bottom: 10,
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '14px solid transparent',
              borderRight: '14px solid transparent',
              borderBottom: '12px solid rgba(155,142,196,0.2)',
            }} />

            {/* Beam */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 0,
              transform: `rotate(${tilt}deg)`,
              transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
              transformOrigin: 'center 8px',
              position: 'relative',
            }}>
              {/* Left pan: Evidence FOR */}
              <div style={{
                flex: 1,
                minHeight: 80,
              }}>
                <div style={{
                  textAlign: 'center',
                  fontSize: 11,
                  fontFamily: "'JetBrains Mono', monospace",
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--text-muted)',
                  marginBottom: 8,
                  fontWeight: 600,
                }}>
                  Evidence For
                </div>
                <div style={{
                  background: 'rgba(155,142,196,0.06)',
                  borderRadius: 12,
                  padding: '10px 12px',
                  minHeight: 48,
                  border: '1px solid rgba(155,142,196,0.1)',
                }}>
                  {evidenceFor.map((item, i) => (
                    <div key={i} style={{
                      fontSize: 12,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.4,
                      marginBottom: i < evidenceFor.length - 1 ? 6 : 0,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 6,
                    }}>
                      <span style={{ color: 'rgba(155,142,196,0.5)', flexShrink: 0 }}>{'\u2022'}</span>
                      <span>{item.length > 40 ? item.slice(0, 40) + '\u2026' : item}</span>
                    </div>
                  ))}
                  {evidenceFor.length === 0 && (
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: 8, opacity: 0.5 }}>
                      {forCount} items
                    </div>
                  )}
                </div>
                <div style={{
                  textAlign: 'center',
                  marginTop: 6,
                  fontSize: 13,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  color: forCount > againstCount ? '#9B8EC4' : 'var(--text-muted)',
                }}>
                  {forCount}
                </div>
              </div>

              {/* Center divider */}
              <div style={{
                width: 2,
                alignSelf: 'stretch',
                background: 'rgba(155,142,196,0.15)',
                margin: '20px 8px 0',
                borderRadius: 1,
                flexShrink: 0,
              }} />

              {/* Right pan: Evidence AGAINST */}
              <div style={{
                flex: 1,
                minHeight: 80,
              }}>
                <div style={{
                  textAlign: 'center',
                  fontSize: 11,
                  fontFamily: "'JetBrains Mono', monospace",
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--text-muted)',
                  marginBottom: 8,
                  fontWeight: 600,
                }}>
                  Evidence Against
                </div>
                <div style={{
                  background: 'rgba(91,154,101,0.06)',
                  borderRadius: 12,
                  padding: '10px 12px',
                  minHeight: 48,
                  border: '1px solid rgba(91,154,101,0.12)',
                }}>
                  {evidenceAgainst.map((item, i) => (
                    <div key={i} style={{
                      fontSize: 12,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.4,
                      marginBottom: i < evidenceAgainst.length - 1 ? 6 : 0,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 6,
                    }}>
                      <span style={{ color: 'rgba(91,154,101,0.6)', flexShrink: 0 }}>{'\u2022'}</span>
                      <span>{item.length > 40 ? item.slice(0, 40) + '\u2026' : item}</span>
                    </div>
                  ))}
                  {evidenceAgainst.length === 0 && (
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: 8, opacity: 0.5 }}>
                      0 items
                    </div>
                  )}
                </div>
                <div style={{
                  textAlign: 'center',
                  marginTop: 6,
                  fontSize: 13,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  color: againstCount > forCount ? '#5B9A65' : 'var(--text-muted)',
                }}>
                  {againstCount}
                </div>
              </div>
            </div>
          </div>

          {/* Add evidence against input */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
            <textarea
              value={evidenceAgainstDraft}
              onChange={e => setEvidenceAgainstDraft(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addEvidenceAgainst(); }
              }}
              placeholder="Enter evidence that challenges the thought..."
              rows={2}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '1.5px solid rgba(91,154,101,0.25)',
                borderRadius: 14,
                background: 'rgba(91,154,101,0.04)',
                fontSize: 14,
                color: 'var(--text-primary)',
                fontFamily: "'DM Sans', sans-serif",
                outline: 'none',
                resize: 'none',
                boxSizing: 'border-box',
                lineHeight: 1.5,
              }}
            />
            <button
              onClick={addEvidenceAgainst}
              disabled={!evidenceAgainstDraft.trim()}
              style={{
                padding: '12px 20px',
                borderRadius: 14,
                border: 'none',
                background: evidenceAgainstDraft.trim() ? '#5B9A65' : 'rgba(91,154,101,0.15)',
                color: evidenceAgainstDraft.trim() ? '#fff' : 'var(--text-muted)',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                cursor: evidenceAgainstDraft.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
                flexShrink: 0,
                alignSelf: 'flex-start',
              }}
            >
              Add
            </button>
          </div>

          {/* Helper prompts */}
          <div style={{
            marginBottom: 20,
            overflow: 'hidden',
          }}>
            {HELPER_PROMPTS.map((prompt, i) => (
              <div key={i} style={{
                fontSize: 13,
                color: 'var(--text-muted)',
                padding: '6px 0',
                fontStyle: 'italic',
                opacity: showHelpers ? 0.7 : 0,
                transform: showHelpers ? 'translateY(0)' : 'translateY(6px)',
                transition: `opacity 0.4s ease ${i * 0.15}s, transform 0.4s ease ${i * 0.15}s`,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <span style={{ color: '#5B9A65', fontSize: 14 }}>{'\u2192'}</span>
                {prompt}
              </div>
            ))}
          </div>

          {/* Listed evidence against items */}
          {evidenceAgainst.length > 0 && (
            <div style={{
              padding: '16px 20px',
              background: 'var(--surface-elevated)',
              borderRadius: 14,
              border: '1px solid rgba(91,154,101,0.12)',
              marginBottom: 20,
            }}>
              {evidenceAgainst.map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  marginBottom: i < evidenceAgainst.length - 1 ? 10 : 0,
                  animation: 'crSlideUp 0.3s ease',
                }}>
                  <span style={{ color: '#5B9A65', fontSize: 18, lineHeight: 1.3, flexShrink: 0 }}>{'\u2022'}</span>
                  <span style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <button
              onClick={goNext}
              disabled={!canProceed()}
              style={{
                ...styles.primaryBtn,
                opacity: canProceed() ? 1 : 0.4,
                cursor: canProceed() ? 'pointer' : 'not-allowed',
              }}
            >
              Next: Distortions {'\u2192'}
            </button>
          </div>
        </div>
        <style>{`
          @keyframes crFadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes crSlideUp {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // --- COLUMN 6: COGNITIVE DISTORTIONS ---
  if (step === 6) {
    return (
      <div style={styles.container}>
        {renderProgress()}
        <div style={{ ...styles.fadeIn, padding: '28px 24px', maxWidth: 580, margin: '0 auto' }}>
          <button onClick={goBack} style={styles.backBtn}>{'\u2190'} Back</button>
          <div style={styles.stepLabel}>Column 6 of 7</div>
          <h2 style={{ ...styles.heading, textAlign: 'left' }}>
            Which thinking patterns do you recognize?
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 20px', lineHeight: 1.6 }}>
            Select all cognitive distortions that may apply to your automatic thoughts.
          </p>

          {/* Distortion card grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 10,
            marginBottom: 24,
          }}>
            {DISTORTIONS.map((d, i) => {
              const isSelected = selectedDistortions.includes(d.name);
              return (
                <button
                  key={i}
                  onClick={() => toggleDistortion(d.name)}
                  style={{
                    padding: '16px 14px',
                    borderRadius: 14,
                    border: isSelected
                      ? '2px solid #9B8EC4'
                      : '2px solid rgba(155,142,196,0.1)',
                    background: isSelected
                      ? 'rgba(155,142,196,0.1)'
                      : 'var(--surface-elevated)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      top: 8,
                      right: 10,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: '#9B8EC4',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 700,
                    }}>
                      {'\u2713'}
                    </div>
                  )}
                  <span style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: isSelected ? '#9B8EC4' : 'var(--text-primary)',
                    fontFamily: "'DM Sans', sans-serif",
                    paddingRight: isSelected ? 24 : 0,
                  }}>
                    {d.name}
                  </span>
                  <span style={{
                    fontSize: 12,
                    color: 'var(--text-muted)',
                    lineHeight: 1.4,
                  }}>
                    {d.def}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected distortions summary */}
          {selectedDistortions.length > 0 && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              marginBottom: 24,
              padding: '14px 16px',
              background: 'rgba(155,142,196,0.05)',
              borderRadius: 12,
            }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", width: '100%', marginBottom: 4 }}>
                {selectedDistortions.length} identified:
              </span>
              {selectedDistortions.map(name => (
                <span key={name} style={{
                  padding: '4px 12px',
                  borderRadius: 16,
                  background: 'rgba(155,142,196,0.12)',
                  fontSize: 12,
                  color: '#9B8EC4',
                  fontWeight: 600,
                }}>
                  {name}
                </span>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={goNext}
              disabled={!canProceed()}
              style={{
                ...styles.primaryBtn,
                opacity: canProceed() ? 1 : 0.4,
                cursor: canProceed() ? 'pointer' : 'not-allowed',
              }}
            >
              Next: Balanced Thought {'\u2192'}
            </button>
          </div>
        </div>
        <style>{`
          @keyframes crFadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // --- COLUMN 7: BALANCED THOUGHT + RE-RATING ---
  if (step === 7) {
    return (
      <div style={styles.container}>
        {renderProgress()}
        <div style={{ ...styles.fadeIn, padding: '28px 24px', maxWidth: 540, margin: '0 auto' }}>
          <button onClick={goBack} style={styles.backBtn}>{'\u2190'} Back</button>
          <div style={styles.stepLabel}>Column 7 of 7</div>
          <h2 style={{ ...styles.heading, textAlign: 'left' }}>
            Taking all evidence into account, what's a more balanced perspective?
          </h2>

          <textarea
            value={balancedThought}
            onChange={e => setBalancedThought(e.target.value)}
            placeholder={'Write a thought that accounts for both the evidence for AND against. It doesn\'t have to be positive\u2014just more balanced and accurate.'}
            rows={5}
            style={{
              ...styles.textarea,
              borderColor: 'rgba(91,154,101,0.25)',
              background: 'rgba(91,154,101,0.04)',
            }}
            onFocus={e => { e.target.style.borderColor = '#5B9A65'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(91,154,101,0.25)'; }}
          />

          {/* Re-rate emotions */}
          <div style={{
            padding: '20px',
            background: 'var(--surface-elevated)',
            borderRadius: 16,
            border: '1px solid rgba(155,142,196,0.1)',
            marginTop: 24,
            marginBottom: 16,
          }}>
            <div style={{
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#9B8EC4',
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              marginBottom: 16,
            }}>
              Re-rate your emotions now
            </div>
            {Object.keys(selectedEmotions).map(name => (
              <div key={name} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 14,
              }}>
                <span style={{
                  width: 110,
                  fontSize: 14,
                  color: 'var(--text-primary)',
                  fontWeight: 500,
                  flexShrink: 0,
                }}>
                  {name}
                </span>
                <span style={{
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  fontFamily: "'JetBrains Mono', monospace",
                  flexShrink: 0,
                  width: 20,
                  textAlign: 'center',
                }}>
                  {selectedEmotions[name]}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>{'\u2192'}</span>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={emotionsAfter[name] ?? selectedEmotions[name]}
                  onChange={e => setEmotionsAfter(prev => ({ ...prev, [name]: parseInt(e.target.value) }))}
                  style={{ flex: 1, accentColor: '#5B9A65' }}
                />
                <span style={{
                  width: 32,
                  textAlign: 'center',
                  fontSize: 16,
                  fontWeight: 700,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: (emotionsAfter[name] ?? selectedEmotions[name]) < selectedEmotions[name]
                    ? '#5B9A65'
                    : 'var(--text-secondary)',
                }}>
                  {emotionsAfter[name] ?? selectedEmotions[name]}
                </span>
              </div>
            ))}
          </div>

          {/* Re-rate belief in original thoughts */}
          <div style={{
            padding: '20px',
            background: 'var(--surface-elevated)',
            borderRadius: 16,
            border: '1px solid rgba(155,142,196,0.1)',
            marginBottom: 24,
          }}>
            <div style={{
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#9B8EC4',
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              marginBottom: 16,
            }}>
              Re-rate belief in original thoughts
            </div>
            {thoughts.map((t, i) => (
              <div key={i} style={{ marginBottom: i < thoughts.length - 1 ? 18 : 0 }}>
                <p style={{
                  fontSize: 13,
                  color: 'var(--text-muted)',
                  fontStyle: 'italic',
                  margin: '0 0 8px',
                  lineHeight: 1.4,
                }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    fontSize: 12,
                    color: 'var(--text-muted)',
                    fontFamily: "'JetBrains Mono', monospace",
                    flexShrink: 0,
                    width: 36,
                    textAlign: 'center',
                  }}>
                    {t.belief}%
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>{'\u2192'}</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={beliefsAfter[i] ?? t.belief}
                    onChange={e => setBeliefsAfter(prev => ({ ...prev, [i]: parseInt(e.target.value) }))}
                    style={{ flex: 1, accentColor: '#5B9A65' }}
                  />
                  <span style={{
                    width: 44,
                    textAlign: 'right',
                    fontSize: 15,
                    fontWeight: 700,
                    fontFamily: "'JetBrains Mono', monospace",
                    color: (beliefsAfter[i] ?? t.belief) < t.belief ? '#5B9A65' : 'var(--text-secondary)',
                  }}>
                    {beliefsAfter[i] ?? t.belief}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={goNext}
              disabled={!canProceed()}
              style={{
                ...styles.primaryBtn,
                opacity: canProceed() ? 1 : 0.4,
                cursor: canProceed() ? 'pointer' : 'not-allowed',
                background: canProceed() ? '#5B9A65' : 'rgba(91,154,101,0.3)',
                boxShadow: canProceed() ? '0 4px 16px rgba(91,154,101,0.3)' : 'none',
              }}
            >
              Complete thought record {'\u2713'}
            </button>
          </div>
        </div>
        <style>{`
          @keyframes crFadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // --- COMPLETION SUMMARY ---
  if (step === 'complete') {
    // Calculate metrics
    const emotionKeys = Object.keys(selectedEmotions);
    const avgEmotionBefore = emotionKeys.length > 0
      ? Math.round(emotionKeys.reduce((s, k) => s + selectedEmotions[k], 0) / emotionKeys.length)
      : 0;
    const avgEmotionAfter = emotionKeys.length > 0
      ? Math.round(emotionKeys.reduce((s, k) => s + (emotionsAfter[k] ?? selectedEmotions[k]), 0) / emotionKeys.length)
      : 0;
    const emotionChange = avgEmotionAfter - avgEmotionBefore;

    const avgBeliefBefore = thoughts.length > 0
      ? Math.round(thoughts.reduce((s, t) => s + t.belief, 0) / thoughts.length)
      : 0;
    const avgBeliefAfter = thoughts.length > 0
      ? Math.round(thoughts.reduce((s, t, i) => s + (beliefsAfter[i] ?? t.belief), 0) / thoughts.length)
      : 0;
    const beliefShift = avgBeliefAfter - avgBeliefBefore;

    return (
      <div style={styles.container}>
        <div style={{ ...styles.fadeIn, padding: '28px 24px', maxWidth: 560, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(91,154,101,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: 28,
              animation: 'crScaleIn 0.5s cubic-bezier(0.16,1,0.3,1)',
            }}>
              {'\u2713'}
            </div>
            <h2 style={{ ...styles.heading, marginBottom: 8 }}>
              Thought Record Complete
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
              Here's a summary of your cognitive restructuring session.
            </p>
          </div>

          {/* Metrics row */}
          <div style={{
            display: 'flex',
            gap: 12,
            marginBottom: 24,
          }}>
            <div style={{
              flex: 1,
              padding: '16px',
              background: emotionChange <= 0 ? 'rgba(91,154,101,0.08)' : 'rgba(155,142,196,0.08)',
              borderRadius: 14,
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: 24,
                fontWeight: 700,
                fontFamily: "'JetBrains Mono', monospace",
                color: emotionChange <= 0 ? '#5B9A65' : 'var(--text-secondary)',
              }}>
                {emotionChange <= 0 ? '' : '+'}{emotionChange}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Emotion intensity
              </div>
            </div>
            <div style={{
              flex: 1,
              padding: '16px',
              background: beliefShift <= 0 ? 'rgba(91,154,101,0.08)' : 'rgba(155,142,196,0.08)',
              borderRadius: 14,
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: 24,
                fontWeight: 700,
                fontFamily: "'JetBrains Mono', monospace",
                color: beliefShift <= 0 ? '#5B9A65' : 'var(--text-secondary)',
              }}>
                {beliefShift <= 0 ? '' : '+'}{beliefShift}%
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Belief shift
              </div>
            </div>
          </div>

          {/* Card 1: Situation */}
          <div style={styles.summaryCard}>
            <div style={styles.summaryCardLabel}>Situation</div>
            <p style={{ fontSize: 14, color: 'var(--text-primary)', margin: 0, lineHeight: 1.6 }}>
              {situation}
            </p>
          </div>

          {/* Card 2: Emotions before -> after */}
          <div style={styles.summaryCard}>
            <div style={styles.summaryCardLabel}>Emotions</div>
            {emotionKeys.map(name => {
              const before = selectedEmotions[name];
              const after = emotionsAfter[name] ?? before;
              const decreased = after < before;
              return (
                <div key={name} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 8,
                  fontSize: 14,
                }}>
                  <span style={{ fontWeight: 500, color: 'var(--text-primary)', width: 100 }}>{name}</span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: 'var(--text-muted)',
                    fontSize: 13,
                  }}>
                    {before}/10
                  </span>
                  <span style={{ color: decreased ? '#5B9A65' : 'var(--text-muted)', fontSize: 12 }}>{'\u2192'}</span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: decreased ? '#5B9A65' : 'var(--text-secondary)',
                    fontSize: 13,
                    fontWeight: decreased ? 700 : 400,
                  }}>
                    {after}/10
                  </span>
                  {decreased && (
                    <span style={{ fontSize: 11, color: '#5B9A65', fontFamily: "'JetBrains Mono', monospace" }}>
                      ({after - before})
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Card 3: Thoughts before -> after */}
          <div style={styles.summaryCard}>
            <div style={styles.summaryCardLabel}>Automatic Thoughts</div>
            {thoughts.map((t, i) => {
              const before = t.belief;
              const after = beliefsAfter[i] ?? before;
              const decreased = after < before;
              return (
                <div key={i} style={{ marginBottom: i < thoughts.length - 1 ? 14 : 0 }}>
                  <p style={{
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                    fontStyle: 'italic',
                    margin: '0 0 4px',
                    lineHeight: 1.4,
                  }}>
                    "{t.text}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)' }}>
                      {before}%
                    </span>
                    <span style={{ color: decreased ? '#5B9A65' : 'var(--text-muted)', fontSize: 11 }}>{'\u2192'}</span>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      color: decreased ? '#5B9A65' : 'var(--text-secondary)',
                      fontWeight: decreased ? 700 : 400,
                    }}>
                      {after}%
                    </span>
                    {decreased && (
                      <span style={{ fontSize: 11, color: '#5B9A65', fontFamily: "'JetBrains Mono', monospace" }}>
                        ({after - before}%)
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Card 4: Evidence comparison */}
          <div style={styles.summaryCard}>
            <div style={styles.summaryCardLabel}>Evidence Weighed</div>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--text-muted)',
                  fontFamily: "'JetBrains Mono', monospace",
                  marginBottom: 6,
                }}>
                  For ({evidenceFor.length})
                </div>
                {evidenceFor.map((item, i) => (
                  <div key={i} style={{
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.4,
                    marginBottom: 4,
                    display: 'flex',
                    gap: 6,
                  }}>
                    <span style={{ color: 'rgba(155,142,196,0.4)' }}>{'\u2022'}</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ width: 1, background: 'rgba(155,142,196,0.1)', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--text-muted)',
                  fontFamily: "'JetBrains Mono', monospace",
                  marginBottom: 6,
                }}>
                  Against ({evidenceAgainst.length})
                </div>
                {evidenceAgainst.map((item, i) => (
                  <div key={i} style={{
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.4,
                    marginBottom: 4,
                    display: 'flex',
                    gap: 6,
                  }}>
                    <span style={{ color: 'rgba(91,154,101,0.5)' }}>{'\u2022'}</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 5: Distortions */}
          <div style={styles.summaryCard}>
            <div style={styles.summaryCardLabel}>Distortions Identified</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {selectedDistortions.map(name => (
                <span key={name} style={{
                  padding: '5px 14px',
                  borderRadius: 20,
                  background: 'rgba(155,142,196,0.1)',
                  fontSize: 13,
                  color: '#9B8EC4',
                  fontWeight: 600,
                }}>
                  {name}
                </span>
              ))}
            </div>
          </div>

          {/* Card 6: Balanced Thought (highlighted) */}
          <div style={{
            ...styles.summaryCard,
            background: 'rgba(91,154,101,0.06)',
            borderColor: 'rgba(91,154,101,0.15)',
            borderWidth: 2,
          }}>
            <div style={{ ...styles.summaryCardLabel, color: '#5B9A65' }}>Balanced Thought</div>
            <p style={{
              fontSize: 16,
              color: 'var(--text-primary)',
              margin: 0,
              lineHeight: 1.7,
              fontWeight: 500,
            }}>
              "{balancedThought}"
            </p>
          </div>

          {/* Finish button */}
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
              This record has been saved. You can revisit it anytime.
            </p>
            <button
              onClick={onComplete}
              style={{
                ...styles.primaryBtn,
                background: '#5B9A65',
                boxShadow: '0 4px 16px rgba(91,154,101,0.3)',
              }}
            >
              Done {'\u2192'}
            </button>
          </div>
        </div>
        <style>{`
          @keyframes crFadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes crScaleIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  return null;
}

const styles = {
  container: {
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: '20px 0 100px',
  },
  fadeIn: {
    animation: 'crFadeIn 0.5s ease',
  },
  heading: {
    fontFamily: "'Fraunces', serif",
    fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
    fontWeight: 500,
    color: 'var(--text-primary)',
    lineHeight: 1.3,
    margin: '0 0 12px',
  },
  subtext: {
    fontSize: 16,
    color: 'var(--text-secondary)',
    lineHeight: 1.7,
    margin: '0 0 28px',
  },
  stepLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: '#9B8EC4',
    fontWeight: 600,
    marginBottom: 12,
    fontFamily: "'JetBrains Mono', monospace",
  },
  primaryBtn: {
    padding: '16px 36px',
    borderRadius: 50,
    background: '#9B8EC4',
    color: '#fff',
    border: 'none',
    fontSize: 16,
    fontWeight: 600,
    fontFamily: "'Fraunces', serif",
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
    boxShadow: '0 4px 16px rgba(155,142,196,0.3)',
  },
  backBtn: {
    padding: '8px 0',
    background: 'none',
    border: 'none',
    fontSize: 14,
    color: 'var(--text-muted)',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    marginBottom: 16,
    display: 'inline-block',
    transition: 'color 0.2s ease',
  },
  textarea: {
    width: '100%',
    padding: '16px 20px',
    border: '1.5px solid rgba(155,142,196,0.2)',
    borderRadius: 16,
    background: 'rgba(155,142,196,0.04)',
    fontSize: 15,
    color: 'var(--text-primary)',
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: 1.6,
    resize: 'none',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  },
  summaryCard: {
    padding: '18px 20px',
    background: 'var(--surface-elevated)',
    borderRadius: 16,
    border: '1px solid rgba(155,142,196,0.08)',
    marginBottom: 12,
  },
  summaryCardLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#9B8EC4',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 600,
    marginBottom: 10,
  },
};
