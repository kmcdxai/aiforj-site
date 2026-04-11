"use client";

import { useState, useRef, useEffect } from 'react';

const SENSES = [
  { count: 5, emoji: '\u{1F441}\uFE0F', sense: 'SEE', prompt: 'Look around. Name 5 things you can see right now.', placeholder: 'something you see...', color: '#6B98B8' },
  { count: 4, emoji: '\u{1F442}', sense: 'HEAR', prompt: 'Listen closely. Even silence has sounds.', placeholder: 'something you hear...', color: '#6B98B8' },
  { count: 3, emoji: '\u270B', sense: 'TOUCH', prompt: 'Feel the texture of something near you.', placeholder: 'something you can touch...', color: '#6B98B8' },
  { count: 2, emoji: '\u{1F443}', sense: 'SMELL', prompt: 'Breathe in. What\u2019s in the air?', placeholder: 'something you smell...', color: '#6B98B8' },
  { count: 1, emoji: '\u{1F445}', sense: 'TASTE', prompt: 'Notice what\u2019s in your mouth right now.', placeholder: 'something you taste...', color: '#6B98B8' },
];

export default function SensoryGrounding({ onComplete }) {
  const [phase, setPhase] = useState('intro'); // intro, sense-0..4, complete
  const [senseIndex, setSenseIndex] = useState(0);
  const [inputs, setInputs] = useState(SENSES.map(s => Array(s.count).fill('')));
  const [allEntries, setAllEntries] = useState([]);
  const inputRefs = useRef([]);

  const currentSense = SENSES[senseIndex];
  const currentInputs = inputs[senseIndex] || [];
  const filledCount = currentInputs.filter(v => v.trim().length > 0).length;
  const allFilled = filledCount === currentSense?.count;

  useEffect(() => {
    if (phase.startsWith('sense') && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [phase, senseIndex]);

  const handleInputChange = (idx, value) => {
    const updated = [...inputs];
    updated[senseIndex] = [...updated[senseIndex]];
    updated[senseIndex][idx] = value;
    setInputs(updated);
  };

  const handleNextSense = () => {
    if (senseIndex < SENSES.length - 1) {
      setSenseIndex(senseIndex + 1);
      setPhase(`sense-${senseIndex + 1}`);
    } else {
      // Collect all entries for completion screen
      const all = SENSES.map((s, i) => ({
        sense: s.sense,
        emoji: s.emoji,
        items: inputs[i].filter(v => v.trim()),
      }));
      setAllEntries(all);
      setPhase('complete');
    }
  };

  const handleStart = () => {
    setPhase('sense-0');
    setSenseIndex(0);
  };

  // --- INTRO ---
  if (phase === 'intro') {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.fadeIn, textAlign: 'center', padding: '60px 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 24 }}>{'\u{1F30A}'}</div>
          <h2 style={styles.heading}>
            Let's ground you in the present moment using your five senses.
          </h2>
          <p style={styles.subtext}>
            This takes about 90 seconds. You'll name things you can see, hear, touch, smell, and taste.
          </p>
          <button onClick={handleStart} style={styles.primaryBtn}>
            Begin grounding {'\u2192'}
          </button>
        </div>
      </div>
    );
  }

  // --- COMPLETION ---
  if (phase === 'complete') {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.fadeIn, padding: '40px 24px', maxWidth: 500, margin: '0 auto' }}>
          <h2 style={{ ...styles.heading, marginBottom: 8 }}>
            You're here. You're grounded. You're safe.
          </h2>
          <p style={{ ...styles.subtext, marginBottom: 32 }}>
            Everything you named is real and present. You are too.
          </p>

          <div style={{ display: 'grid', gap: 12, marginBottom: 40 }}>
            {allEntries.map((group, groupIndex) => (
              <section
                key={group.sense}
                style={{
                  padding: '16px 18px',
                  borderRadius: 20,
                  background: 'rgba(107,152,184,0.06)',
                  border: '1px solid rgba(107,152,184,0.12)',
                  animation: `groundedFadeIn 0.45s ease ${groupIndex * 0.08}s both`,
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 12,
                }}>
                  <span style={{ fontSize: 22 }}>{group.emoji}</span>
                  <div style={{
                    fontSize: 11,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#6B98B8',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 600,
                  }}>
                    {group.sense}
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {group.items.map((item, j) => (
                    <div key={`${group.sense}-${j}`} style={{
                      padding: '9px 14px',
                      background: 'rgba(255,255,255,0.78)',
                      borderRadius: 999,
                      fontSize: 14,
                      color: 'var(--text-primary)',
                      border: '1px solid rgba(107,152,184,0.14)',
                      animation: `groundedFadeIn 0.35s ease ${(groupIndex * 0.08) + (j * 0.04)}s both`,
                    }}>
                      {item}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <button onClick={onComplete} style={styles.primaryBtn}>
            Continue {'\u2192'}
          </button>
        </div>
        <style>{`
          @keyframes groundedFadeIn {
            from { opacity: 0; transform: translateY(8px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
      </div>
    );
  }

  // --- SENSE INPUT PHASE ---
  const remaining = currentSense.count - filledCount;

  return (
    <div style={styles.container}>
      <div style={{ ...styles.fadeIn, padding: '32px 24px', maxWidth: 480, margin: '0 auto' }}>
        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 32 }}>
          {SENSES.map((_, i) => (
            <div key={i} style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: i < senseIndex ? '#6B98B8' : i === senseIndex ? '#6B98B8' : 'rgba(107,152,184,0.2)',
              transition: 'all 0.3s ease',
              transform: i === senseIndex ? 'scale(1.3)' : 'scale(1)',
            }} />
          ))}
        </div>

        {/* Sense header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>{currentSense.emoji}</div>
          <div style={{
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: '#6B98B8',
            fontWeight: 600,
            marginBottom: 8,
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {remaining > 0 ? `${remaining} thing${remaining !== 1 ? 's' : ''} you can ${currentSense.sense}` : `All ${currentSense.count} found`}
          </div>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
            {currentSense.prompt}
          </p>
        </div>

        {/* Input fields */}
        {filledCount > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            justifyContent: 'center',
            marginBottom: 22,
          }}>
            {currentInputs.filter((value) => value.trim()).map((value, index) => (
              <div key={`${senseIndex}-${index}-${value}`} style={{
                padding: '8px 12px',
                borderRadius: 999,
                background: 'rgba(107,152,184,0.08)',
                color: '#4D7693',
                border: '1px solid rgba(107,152,184,0.14)',
                fontSize: 13,
                animation: 'groundedFloatIn 0.28s ease',
              }}>
                {value}
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
          {currentInputs.map((val, idx) => (
            <div key={idx} style={{
              opacity: idx <= filledCount ? 1 : 0.4,
              transition: 'opacity 0.3s ease',
            }}>
              <input
                ref={el => inputRefs.current[idx] = el}
                type="text"
                value={val}
                onChange={e => handleInputChange(idx, e.target.value)}
                placeholder={currentSense.placeholder}
                onKeyDown={e => {
                  if (e.key === 'Enter' && val.trim()) {
                    const nextEmpty = currentInputs.findIndex((v, i) => i > idx && !v.trim());
                    if (nextEmpty >= 0) inputRefs.current[nextEmpty]?.focus();
                    else if (allFilled) handleNextSense();
                  }
                }}
                style={{
                  width: '100%',
                  padding: '12px 4px',
                  border: 'none',
                  borderBottom: val.trim() ? '2px solid #6B98B8' : '1px solid rgba(45,42,38,0.12)',
                  background: 'transparent',
                  fontSize: 16,
                  color: 'var(--text-primary)',
                  fontFamily: "'DM Sans', sans-serif",
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box',
                }}
                onFocus={e => { e.target.style.borderBottom = '2px solid #6B98B8'; }}
                onBlur={e => { if (!val.trim()) e.target.style.borderBottom = '1px solid rgba(45,42,38,0.12)'; }}
              />
              {val.trim() && (
                <div style={{
                  fontSize: 11,
                  color: '#6B98B8',
                  marginTop: 4,
                  fontFamily: "'JetBrains Mono', monospace",
                  animation: 'groundedFadeIn 0.2s ease',
                }}>
                  {'\u2713'}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Next button */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleNextSense}
            disabled={!allFilled}
            style={{
              ...styles.primaryBtn,
              opacity: allFilled ? 1 : 0.4,
              cursor: allFilled ? 'pointer' : 'not-allowed',
            }}
          >
            {senseIndex < SENSES.length - 1 ? `Next sense ${'\u2192'}` : `See your grounding ${'\u2192'}`}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes groundedFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes groundedFloatIn {
          from { opacity: 0; transform: translateY(10px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '20px 0 100px',
  },
  fadeIn: {
    animation: 'groundedFadeIn 0.5s ease',
  },
  heading: {
    fontFamily: "'Fraunces', serif",
    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
    fontWeight: 500,
    color: 'var(--text-primary)',
    lineHeight: 1.3,
    margin: '0 0 16px',
  },
  subtext: {
    fontSize: 16,
    color: 'var(--text-secondary)',
    lineHeight: 1.7,
    margin: '0 0 28px',
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
};
