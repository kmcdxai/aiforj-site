"use client";

import { useState, useEffect } from 'react';

const SCENARIOS = [
  {
    key: 'worst',
    emoji: '\u{1F32A}\uFE0F',
    label: 'Worst Case',
    color: '#C45B5B',
    colorLight: 'rgba(196,91,91,0.08)',
    colorBorder: 'rgba(196,91,91,0.2)',
    colorGlow: 'rgba(196,91,91,0.15)',
    questionMain: "What's the absolute worst that could happen?",
    questionCoping: 'If this DID happen, how would you cope?',
    placeholderMain: 'Describe the worst possible outcome...',
    placeholderCoping: 'How you would handle it...',
    hasCoping: true,
  },
  {
    key: 'best',
    emoji: '\u2600\uFE0F',
    label: 'Best Case',
    color: '#D4A843',
    colorLight: 'rgba(212,168,67,0.08)',
    colorBorder: 'rgba(212,168,67,0.2)',
    colorGlow: 'rgba(212,168,67,0.15)',
    questionMain: "What's the best realistic outcome?",
    questionCoping: null,
    placeholderMain: 'Describe the best realistic outcome...',
    placeholderCoping: null,
    hasCoping: false,
  },
  {
    key: 'mostLikely',
    emoji: '\u2696\uFE0F',
    label: 'Most Likely',
    color: '#7A9E7E',
    colorLight: 'rgba(122,158,126,0.08)',
    colorBorder: 'rgba(122,158,126,0.2)',
    colorGlow: 'rgba(122,158,126,0.15)',
    questionMain: 'What will PROBABLY actually happen?',
    questionCoping: null,
    placeholderMain: 'Describe what will most likely happen...',
    placeholderCoping: null,
    hasCoping: false,
  },
];

export default function Decatastrophizing({ onComplete }) {
  const [step, setStep] = useState(0); // 0=intro, 1=worry, 2=scenarios, 3=summary, 4=completion
  const [worry, setWorry] = useState('');
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [scenarioTexts, setScenarioTexts] = useState({ worst: '', best: '', mostLikely: '' });
  const [copingText, setCopingText] = useState('');
  const [probabilities, setProbabilities] = useState({ worst: 20, best: 20, mostLikely: 60 });
  const [cardVisible, setCardVisible] = useState(true);
  const [saved, setSaved] = useState(false);

  const currentScenario = SCENARIOS[scenarioIndex];

  const transitionToNextCard = (nextIndex) => {
    setCardVisible(false);
    setTimeout(() => {
      setScenarioIndex(nextIndex);
      setCardVisible(true);
    }, 300);
  };

  const canProceedScenario = () => {
    const key = currentScenario.key;
    const hasText = scenarioTexts[key].trim().length > 0;
    const hasCoping = currentScenario.hasCoping ? copingText.trim().length > 0 : true;
    return hasText && hasCoping;
  };

  const handleScenarioNext = () => {
    if (scenarioIndex < SCENARIOS.length - 1) {
      transitionToNextCard(scenarioIndex + 1);
    } else {
      setStep(3);
    }
  };

  const getHighestFocus = () => {
    const entries = [
      { key: 'worst', label: 'worst case', prob: probabilities.worst },
      { key: 'best', label: 'best case', prob: probabilities.best },
    ];
    return entries.reduce((a, b) => (a.prob > b.prob ? a : b));
  };

  const handleSave = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('aiforj_perspectives') || '[]');
      existing.push({
        worry,
        worstCase: scenarioTexts.worst,
        bestCase: scenarioTexts.best,
        mostLikely: scenarioTexts.mostLikely,
        probabilities,
        copingStrategy: copingText,
        date: new Date().toISOString(),
      });
      localStorage.setItem('aiforj_perspectives', JSON.stringify(existing));
      setSaved(true);
    } catch (e) {
      // localStorage might be full or unavailable
      setSaved(true);
    }
  };

  // --- INTRO ---
  if (step === 0) {
    return (
      <div style={styles.container}>
        <style>{animationStyles}</style>
        <div style={{ ...styles.fadeIn, textAlign: 'center', padding: '48px 24px', maxWidth: 520, margin: '0 auto' }}>
          <div style={{ fontSize: 48, marginBottom: 24 }}>
            {'\u2696\uFE0F'}
          </div>
          <h2 style={styles.heading}>
            Right now, your mind is probably fixated on the worst-case scenario.
          </h2>
          <p style={styles.subtext}>
            That's normal {'\u2014'} but it's not the full picture. Let's map out what's actually likely to happen.
          </p>
          <button onClick={() => setStep(1)} style={styles.primaryBtn}>
            Let's start {'\u2192'}
          </button>
        </div>
      </div>
    );
  }

  // --- STEP 1: WORRY ---
  if (step === 1) {
    return (
      <div style={styles.container}>
        <style>{animationStyles}</style>
        <div style={{ ...styles.fadeIn, padding: '40px 24px', maxWidth: 520, margin: '0 auto' }}>
          <ProgressBar currentStep={1} totalSteps={3} />
          <h2 style={{ ...styles.heading, textAlign: 'left' }}>
            What are you worried will happen?
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 16px', lineHeight: 1.6 }}>
            Write out the situation or thought that's causing you anxiety.
          </p>
          <textarea
            value={worry}
            onChange={e => setWorry(e.target.value)}
            placeholder="Describe what you're worried about..."
            rows={4}
            style={styles.textarea}
            onFocus={e => { e.target.style.borderColor = 'var(--ocean)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(107,152,184,0.2)'; }}
          />
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button
              onClick={() => { setStep(2); setScenarioIndex(0); setCardVisible(true); }}
              disabled={!worry.trim()}
              style={{
                ...styles.primaryBtn,
                opacity: worry.trim() ? 1 : 0.4,
                cursor: worry.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              Explore scenarios {'\u2192'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- STEP 2: SCENARIO CARDS ---
  if (step === 2) {
    const scenario = currentScenario;
    const key = scenario.key;

    return (
      <div style={styles.container}>
        <style>{animationStyles}</style>
        <style>{sliderStyles(scenario.color)}</style>
        <div style={{ padding: '40px 24px', maxWidth: 520, margin: '0 auto' }}>
          <ProgressBar currentStep={2} totalSteps={3} />

          {/* Worry reference */}
          <div style={{
            padding: '12px 16px',
            background: 'rgba(107,152,184,0.06)',
            borderRadius: 10,
            marginBottom: 24,
            borderLeft: '3px solid rgba(107,152,184,0.3)',
          }}>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, fontStyle: 'italic', lineHeight: 1.5 }}>
              {'\u201C'}{worry}{'\u201D'}
            </p>
          </div>

          {/* Scenario navigation dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
            {SCENARIOS.map((s, i) => (
              <div key={s.key} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 20,
                background: i === scenarioIndex ? `${s.color}15` : 'transparent',
                border: `1.5px solid ${i === scenarioIndex ? s.color : 'rgba(107,152,184,0.12)'}`,
                transition: 'all 0.3s ease',
              }}>
                <span style={{ fontSize: 14 }}>{s.emoji}</span>
                <span style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: i === scenarioIndex ? s.color : 'var(--text-muted)',
                  fontFamily: "'JetBrains Mono', monospace",
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Scenario card */}
          <div style={{
            padding: '28px 24px',
            background: scenario.colorLight,
            borderRadius: 20,
            border: `1.5px solid ${scenario.colorBorder}`,
            boxShadow: `0 8px 32px ${scenario.colorGlow}`,
            marginBottom: 24,
            opacity: cardVisible ? 1 : 0,
            transform: cardVisible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
          }}>
            {/* Card header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <span style={{ fontSize: 28 }}>{scenario.emoji}</span>
              <h3 style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 20,
                fontWeight: 600,
                color: scenario.color,
                margin: 0,
              }}>
                {scenario.label}
              </h3>
            </div>

            {/* Main question */}
            <label style={{
              display: 'block',
              fontSize: 15,
              fontWeight: 500,
              color: 'var(--text-primary)',
              marginBottom: 10,
              lineHeight: 1.5,
            }}>
              {scenario.questionMain}
            </label>
            <textarea
              value={scenarioTexts[key]}
              onChange={e => setScenarioTexts(prev => ({ ...prev, [key]: e.target.value }))}
              placeholder={scenario.placeholderMain}
              rows={3}
              style={{
                ...styles.textarea,
                borderColor: scenario.colorBorder,
                background: 'rgba(255,255,255,0.5)',
              }}
              onFocus={e => { e.target.style.borderColor = scenario.color; }}
              onBlur={e => { e.target.style.borderColor = scenario.colorBorder; }}
            />

            {/* Probability slider */}
            <div style={{ marginTop: 20 }}>
              <label style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--text-primary)',
                marginBottom: 10,
              }}>
                <span>How likely is this? </span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 18,
                  fontWeight: 700,
                  color: scenario.color,
                }}>
                  {probabilities[key]}%
                </span>
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={probabilities[key]}
                onChange={e => setProbabilities(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
                className="scenario-slider"
                style={{
                  width: '100%',
                  height: 6,
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  borderRadius: 3,
                  outline: 'none',
                  cursor: 'pointer',
                }}
              />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 11,
                color: 'var(--text-muted)',
                marginTop: 4,
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Coping question (worst case only) */}
            {scenario.hasCoping && (
              <div style={{ marginTop: 20 }}>
                <label style={{
                  display: 'block',
                  fontSize: 15,
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  marginBottom: 10,
                  lineHeight: 1.5,
                }}>
                  {scenario.questionCoping}
                </label>
                <textarea
                  value={copingText}
                  onChange={e => setCopingText(e.target.value)}
                  placeholder={scenario.placeholderCoping}
                  rows={2}
                  style={{
                    ...styles.textarea,
                    borderColor: scenario.colorBorder,
                    background: 'rgba(255,255,255,0.5)',
                  }}
                  onFocus={e => { e.target.style.borderColor = scenario.color; }}
                  onBlur={e => { e.target.style.borderColor = scenario.colorBorder; }}
                />
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleScenarioNext}
              disabled={!canProceedScenario()}
              style={{
                ...styles.primaryBtn,
                opacity: canProceedScenario() ? 1 : 0.4,
                cursor: canProceedScenario() ? 'pointer' : 'not-allowed',
              }}
            >
              {scenarioIndex < SCENARIOS.length - 1 ? `Next: ${SCENARIOS[scenarioIndex + 1].label} ${'\u2192'}` : `See your results ${'\u2192'}`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- STEP 3: VISUAL SUMMARY ---
  if (step === 3) {
    const total = probabilities.worst + probabilities.best + probabilities.mostLikely;
    const pctWorst = total > 0 ? (probabilities.worst / total) * 100 : 33.3;
    const pctBest = total > 0 ? (probabilities.best / total) * 100 : 33.3;
    const pctMostLikely = total > 0 ? (probabilities.mostLikely / total) * 100 : 33.3;

    const dominantNonLikely = probabilities.worst >= probabilities.best ? 'worst case' : 'best case';
    const dominantProb = probabilities.worst >= probabilities.best ? probabilities.worst : probabilities.best;

    return (
      <div style={styles.container}>
        <style>{animationStyles}</style>
        <div style={{ ...styles.fadeIn, padding: '40px 24px', maxWidth: 560, margin: '0 auto' }}>
          <ProgressBar currentStep={3} totalSteps={3} />
          <h2 style={{ ...styles.heading, textAlign: 'center', marginBottom: 8 }}>
            Your Probability Map
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center', margin: '0 0 32px', lineHeight: 1.6 }}>
            Here's how your scenarios actually stack up.
          </p>

          {/* Probability Bar */}
          <div style={{
            borderRadius: 16,
            overflow: 'hidden',
            height: 56,
            display: 'flex',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            marginBottom: 12,
            animation: 'barGrow 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s both',
          }}>
            {/* Worst */}
            <div style={{
              width: `${pctWorst}%`,
              background: 'linear-gradient(135deg, #C45B5B 0%, #d47272 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              padding: '0 4px',
              minWidth: pctWorst > 5 ? 0 : 0,
              transition: 'width 0.6s ease',
              position: 'relative',
            }}>
              {pctWorst > 12 && (
                <>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', fontWeight: 500, lineHeight: 1 }}>
                    {'\u{1F32A}\uFE0F'}
                  </span>
                  <span style={{
                    fontSize: 12,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    color: '#fff',
                    lineHeight: 1,
                    marginTop: 2,
                  }}>
                    {probabilities.worst}%
                  </span>
                </>
              )}
            </div>
            {/* Best */}
            <div style={{
              width: `${pctBest}%`,
              background: 'linear-gradient(135deg, #D4A843 0%, #e0be6a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              padding: '0 4px',
              transition: 'width 0.6s ease',
            }}>
              {pctBest > 12 && (
                <>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', fontWeight: 500, lineHeight: 1 }}>
                    {'\u2600\uFE0F'}
                  </span>
                  <span style={{
                    fontSize: 12,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    color: '#fff',
                    lineHeight: 1,
                    marginTop: 2,
                  }}>
                    {probabilities.best}%
                  </span>
                </>
              )}
            </div>
            {/* Most Likely */}
            <div style={{
              width: `${pctMostLikely}%`,
              background: 'linear-gradient(135deg, #7A9E7E 0%, #95b599 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              padding: '0 4px',
              transition: 'width 0.6s ease',
            }}>
              {pctMostLikely > 12 && (
                <>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', fontWeight: 500, lineHeight: 1 }}>
                    {'\u2696\uFE0F'}
                  </span>
                  <span style={{
                    fontSize: 12,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    color: '#fff',
                    lineHeight: 1,
                    marginTop: 2,
                  }}>
                    {probabilities.mostLikely}%
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Bar legend */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 36 }}>
            {[
              { emoji: '\u{1F32A}\uFE0F', label: 'Worst', pct: probabilities.worst, color: '#C45B5B' },
              { emoji: '\u2600\uFE0F', label: 'Best', pct: probabilities.best, color: '#D4A843' },
              { emoji: '\u2696\uFE0F', label: 'Most Likely', pct: probabilities.mostLikely, color: '#7A9E7E' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: item.color,
                  flexShrink: 0,
                }} />
                <span style={{
                  fontSize: 12,
                  color: 'var(--text-secondary)',
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {item.emoji} {item.label}
                </span>
                <span style={{
                  fontSize: 12,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 600,
                  color: item.color,
                }}>
                  {item.pct}%
                </span>
              </div>
            ))}
          </div>

          {/* Scenario summaries */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
            {SCENARIOS.map((s, i) => (
              <div key={s.key} style={{
                padding: '16px 20px',
                borderRadius: 14,
                background: s.colorLight,
                border: `1px solid ${s.colorBorder}`,
                animation: `cardSlideIn 0.4s ease ${0.3 + i * 0.15}s both`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 16 }}>{s.emoji}</span>
                  <span style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: s.color,
                    fontFamily: "'JetBrains Mono', monospace",
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    {s.label} {'\u2014'} {probabilities[s.key]}%
                  </span>
                </div>
                <p style={{
                  fontSize: 14,
                  color: 'var(--text-secondary)',
                  margin: 0,
                  lineHeight: 1.6,
                  fontStyle: 'italic',
                }}>
                  {'\u201C'}{scenarioTexts[s.key]}{'\u201D'}
                </p>
              </div>
            ))}
          </div>

          {/* Insight message */}
          <div style={{
            padding: '20px 24px',
            borderRadius: 16,
            background: 'rgba(107,152,184,0.06)',
            border: '1px solid rgba(107,152,184,0.15)',
            marginBottom: 32,
            animation: 'cardSlideIn 0.5s ease 0.75s both',
          }}>
            <p style={{
              fontSize: 15,
              color: 'var(--text-primary)',
              lineHeight: 1.7,
              margin: 0,
            }}>
              Your mind was focused on the <strong style={{ color: '#C45B5B' }}>{dominantNonLikely}</strong>, which you estimated at only{' '}
              <strong style={{ fontFamily: "'JetBrains Mono', monospace" }}>{dominantProb}%</strong>.
              The most likely outcome is:
            </p>
            <p style={{
              fontSize: 16,
              color: '#7A9E7E',
              fontWeight: 600,
              lineHeight: 1.6,
              margin: '12px 0 0',
              fontFamily: "'Fraunces', serif",
            }}>
              {'\u201C'}{scenarioTexts.mostLikely}{'\u201D'}
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button onClick={() => setStep(4)} style={styles.primaryBtn}>
              See your perspective {'\u2192'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- STEP 4: COMPLETION ---
  return (
    <div style={styles.container}>
      <style>{animationStyles}</style>
      <div style={{ padding: '40px 24px', maxWidth: 520, margin: '0 auto' }}>
        {/* Perspective card */}
        <div style={{
          padding: '36px 28px',
          background: 'linear-gradient(135deg, rgba(122,158,126,0.08) 0%, rgba(122,158,126,0.02) 100%)',
          borderRadius: 24,
          border: '1.5px solid rgba(122,158,126,0.2)',
          boxShadow: '0 12px 48px rgba(122,158,126,0.1)',
          textAlign: 'center',
          marginBottom: 28,
          animation: 'perspectiveReveal 0.7s cubic-bezier(0.16,1,0.3,1)',
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>
            {'\u2696\uFE0F'}
          </div>
          <div style={{
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            color: '#7A9E7E',
            marginBottom: 16,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 600,
          }}>
            The Most Likely Scenario
          </div>
          <p style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(1.2rem, 4vw, 1.6rem)',
            fontWeight: 500,
            color: 'var(--text-primary)',
            lineHeight: 1.4,
            margin: '0 0 20px',
          }}>
            {'\u201C'}{scenarioTexts.mostLikely}{'\u201D'}
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 20px',
            borderRadius: 50,
            background: 'rgba(122,158,126,0.12)',
            border: '1px solid rgba(122,158,126,0.2)',
          }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 18,
              fontWeight: 700,
              color: '#7A9E7E',
            }}>
              {probabilities.mostLikely}%
            </span>
            <span style={{
              fontSize: 13,
              color: 'var(--text-muted)',
            }}>
              likely
            </span>
          </div>
        </div>

        {/* About the worry */}
        <div style={{
          padding: '14px 18px',
          background: 'rgba(107,152,184,0.04)',
          borderRadius: 12,
          marginBottom: 28,
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: 13,
            color: 'var(--text-muted)',
            margin: 0,
            lineHeight: 1.5,
          }}>
            About: {'\u201C'}{worry}{'\u201D'}
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <button
            onClick={() => { handleSave(); onComplete(); }}
            disabled={saved}
            style={{
              ...styles.primaryBtn,
              opacity: saved ? 0.6 : 1,
              cursor: saved ? 'default' : 'pointer',
              width: '100%',
              maxWidth: 320,
            }}
          >
            {saved ? 'Saved \u2713' : 'Save this perspective'}
          </button>
          {!saved && (
            <button
              onClick={onComplete}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: 14,
                cursor: 'pointer',
                padding: '8px 16px',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Skip saving
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Progress bar sub-component ---
function ProgressBar({ currentStep, totalSteps }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
      }}>
        <span style={{
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'var(--ocean)',
          fontWeight: 600,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} style={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            background: i < currentStep ? 'var(--ocean)' : 'rgba(107,152,184,0.15)',
            transition: 'background 0.3s ease',
          }} />
        ))}
      </div>
    </div>
  );
}

// --- Slider styles (dynamic per scenario color) ---
function sliderStyles(color) {
  return `
    .scenario-slider {
      background: linear-gradient(to right, ${color}33, ${color}66) !important;
    }
    .scenario-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: ${color};
      cursor: pointer;
      box-shadow: 0 2px 8px ${color}55;
      border: 3px solid #fff;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .scenario-slider::-webkit-slider-thumb:hover {
      transform: scale(1.15);
      box-shadow: 0 3px 12px ${color}66;
    }
    .scenario-slider::-webkit-slider-thumb:active {
      transform: scale(1.05);
    }
    .scenario-slider::-moz-range-thumb {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: ${color};
      cursor: pointer;
      box-shadow: 0 2px 8px ${color}55;
      border: 3px solid #fff;
    }
    .scenario-slider::-webkit-slider-runnable-track {
      height: 6px;
      border-radius: 3px;
    }
    .scenario-slider::-moz-range-track {
      height: 6px;
      border-radius: 3px;
      background: ${color}33;
    }
  `;
}

// --- Keyframe animations ---
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes barGrow {
    from { opacity: 0; transform: scaleX(0.3); }
    to { opacity: 1; transform: scaleX(1); }
  }
  @keyframes cardSlideIn {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes perspectiveReveal {
    from { opacity: 0; transform: scale(0.92) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
`;

// --- Static styles ---
const styles = {
  container: {
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '20px 0 100px',
  },
  fadeIn: {
    animation: 'fadeIn 0.5s ease',
  },
  heading: {
    fontFamily: "'Fraunces', serif",
    fontSize: 'clamp(1.4rem, 4vw, 1.9rem)',
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
  textarea: {
    width: '100%',
    padding: '16px 20px',
    border: '1.5px solid rgba(107,152,184,0.2)',
    borderRadius: 16,
    background: 'rgba(107,152,184,0.04)',
    fontSize: 16,
    color: 'var(--text-primary)',
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: 1.6,
    resize: 'none',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  },
  primaryBtn: {
    padding: '16px 36px',
    borderRadius: 50,
    background: 'var(--ocean)',
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
