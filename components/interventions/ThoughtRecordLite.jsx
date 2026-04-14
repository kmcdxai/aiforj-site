"use client";

import { useState, useCallback } from 'react';

const DISTORTIONS = [
  { id: 'catastrophizing', name: 'Catastrophizing', definition: 'Assuming the worst will happen', example: '"If I fail this test, my life is over"' },
  { id: 'mind-reading', name: 'Mind Reading', definition: 'Assuming you know what others think', example: '"They think I\'m stupid"' },
  { id: 'fortune-telling', name: 'Fortune Telling', definition: 'Predicting negative outcomes', example: '"This will definitely go wrong"' },
  { id: 'all-or-nothing', name: 'All-or-Nothing Thinking', definition: 'Seeing things in black and white', example: '"If it\'s not perfect, it\'s a failure"' },
  { id: 'overgeneralization', name: 'Overgeneralization', definition: 'One event = always/never', example: '"I always mess things up"' },
  { id: 'mental-filtering', name: 'Mental Filtering', definition: 'Focusing only on the negative', example: '"The whole day was ruined because of one comment"' },
  { id: 'disqualifying-positive', name: 'Disqualifying the Positive', definition: 'Dismissing good things', example: '"That compliment didn\'t count"' },
  { id: 'should-statements', name: 'Should Statements', definition: 'Rigid rules for self/others', example: '"I should be able to handle this"' },
  { id: 'labeling', name: 'Labeling', definition: 'Attaching a global label', example: '"I\'m a failure" instead of "I made a mistake"' },
  { id: 'personalization', name: 'Personalization', definition: 'Taking blame for things outside your control', example: '"It\'s all my fault"' },
];

export default function ThoughtRecordLite({ onComplete }) {
  const [step, setStep] = useState(1);
  const [fadeKey, setFadeKey] = useState(0);

  // Step 1
  const [situation, setSituation] = useState('');
  // Step 2
  const [automaticThought, setAutomaticThought] = useState('');
  const [beliefBefore, setBeliefBefore] = useState(70);
  // Step 3
  const [emotion, setEmotion] = useState('');
  const [intensity, setIntensity] = useState(5);
  // Step 4
  const [selectedDistortions, setSelectedDistortions] = useState([]);
  // Step 5
  const [reframe, setReframe] = useState('');
  const [beliefAfter, setBeliefAfter] = useState(50);

  const goToStep = useCallback((nextStep) => {
    setFadeKey(k => k + 1);
    setStep(nextStep);
  }, []);

  const toggleDistortion = useCallback((id) => {
    setSelectedDistortions(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  }, []);

  const handleSave = useCallback(() => {
    try {
      const existing = JSON.parse(localStorage.getItem('aiforj_reframe_library') || '[]');
      existing.push({
        originalThought: automaticThought,
        reframe,
        distortions: selectedDistortions.map(id => DISTORTIONS.find(d => d.id === id)?.name).filter(Boolean),
        beliefBefore,
        beliefAfter,
        date: new Date().toISOString(),
      });
      localStorage.setItem('aiforj_reframe_library', JSON.stringify(existing));
    } catch (_) {
      // localStorage unavailable
    }
    onComplete();
  }, [automaticThought, reframe, selectedDistortions, beliefBefore, beliefAfter, onComplete]);

  const beliefShift = beliefBefore - beliefAfter;

  // --- PROGRESS BAR ---
  const ProgressBar = () => (
    <div style={styles.progressContainer}>
      <div style={styles.progressTrack}>
        {[1, 2, 3, 4, 5].map(s => (
          <div key={s} style={{
            flex: 1,
            height: '100%',
            borderRadius: 4,
            background: s <= step ? 'var(--ocean, #6B98B8)' : 'rgba(107,152,184,0.15)',
            transition: 'background 0.4s ease',
          }} />
        ))}
      </div>
      <div style={styles.progressLabel}>Step {step} of 5</div>
    </div>
  );

  // --- STEP 1: SITUATION ---
  if (step === 1) {
    return (
      <div style={styles.container}>
        <ProgressBar />
        <div key={fadeKey} style={{ ...styles.fadeIn, ...styles.content }}>
          <div style={styles.stepTag}>Situation</div>
          <h2 style={styles.heading}>
            What happened?
          </h2>
          <p style={styles.subtext}>
            Describe it in 1{'\u2013'}2 sentences, just the facts.
          </p>
          <textarea
            value={situation}
            onChange={e => setSituation(e.target.value)}
            placeholder="e.g., My manager didn't respond to my message for three hours during a busy day."
            rows={4}
            style={styles.textarea}
            onFocus={e => { e.target.style.borderColor = 'var(--ocean, #6B98B8)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(107,152,184,0.2)'; }}
          />
          <div style={styles.btnWrap}>
            <button
              onClick={() => goToStep(2)}
              disabled={!situation.trim()}
              style={{
                ...styles.primaryBtn,
                opacity: situation.trim() ? 1 : 0.4,
                cursor: situation.trim() ? 'pointer' : 'not-allowed',
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

  // --- STEP 2: AUTOMATIC THOUGHT ---
  if (step === 2) {
    return (
      <div style={styles.container}>
        <ProgressBar />
        <div key={fadeKey} style={{ ...styles.fadeIn, ...styles.content }}>
          <div style={styles.stepTag}>Automatic Thought</div>
          <h2 style={styles.heading}>
            What went through your mind?
          </h2>
          <p style={styles.subtext}>
            Write the thought exactly as it appeared {'\u2014'} no editing.
          </p>
          <textarea
            value={automaticThought}
            onChange={e => setAutomaticThought(e.target.value)}
            placeholder={'e.g., "They\'re ignoring me on purpose. I must have done something wrong."'}
            rows={4}
            style={styles.textarea}
            onFocus={e => { e.target.style.borderColor = 'var(--ocean, #6B98B8)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(107,152,184,0.2)'; }}
          />

          <div style={styles.sliderSection}>
            <label style={styles.sliderLabel}>
              How much do you believe this thought?
            </label>
            <div style={styles.sliderRow}>
              <input
                type="range"
                min={0}
                max={100}
                value={beliefBefore}
                onChange={e => setBeliefBefore(Number(e.target.value))}
                style={styles.rangeInput}
              />
              <span style={styles.sliderValue}>{beliefBefore}%</span>
            </div>
            <div style={styles.sliderHints}>
              <span>Not at all</span>
              <span>Completely</span>
            </div>
          </div>

          <div style={styles.btnRow}>
            <button onClick={() => goToStep(1)} style={styles.backBtn}>
              {'\u2190'} Back
            </button>
            <button
              onClick={() => goToStep(3)}
              disabled={!automaticThought.trim()}
              style={{
                ...styles.primaryBtn,
                opacity: automaticThought.trim() ? 1 : 0.4,
                cursor: automaticThought.trim() ? 'pointer' : 'not-allowed',
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

  // --- STEP 3: EMOTION + INTENSITY ---
  if (step === 3) {
    return (
      <div style={styles.container}>
        <ProgressBar />
        <div key={fadeKey} style={{ ...styles.fadeIn, ...styles.content }}>
          <div style={styles.stepTag}>Emotion</div>
          <h2 style={styles.heading}>
            What emotion did this trigger?
          </h2>
          <p style={styles.subtext}>
            Name the feeling in one or two words.
          </p>
          <input
            type="text"
            value={emotion}
            onChange={e => setEmotion(e.target.value)}
            placeholder="e.g., Anxiety, Shame, Frustration"
            style={styles.textInput}
            onFocus={e => { e.target.style.borderColor = 'var(--ocean, #6B98B8)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(107,152,184,0.2)'; }}
          />

          <div style={styles.sliderSection}>
            <label style={styles.sliderLabel}>
              How intense is this feeling?
            </label>
            <div style={styles.sliderRow}>
              <input
                type="range"
                min={1}
                max={10}
                value={intensity}
                onChange={e => setIntensity(Number(e.target.value))}
                style={styles.rangeInput}
              />
              <span style={styles.sliderValue}>{intensity}/10</span>
            </div>
            <div style={styles.sliderHints}>
              <span>Mild</span>
              <span>Overwhelming</span>
            </div>
          </div>

          <div style={styles.btnRow}>
            <button onClick={() => goToStep(2)} style={styles.backBtn}>
              {'\u2190'} Back
            </button>
            <button
              onClick={() => goToStep(4)}
              disabled={!emotion.trim()}
              style={{
                ...styles.primaryBtn,
                opacity: emotion.trim() ? 1 : 0.4,
                cursor: emotion.trim() ? 'pointer' : 'not-allowed',
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

  // --- STEP 4: COGNITIVE DISTORTION SPOTTER ---
  if (step === 4) {
    const unselected = DISTORTIONS.filter(d => !selectedDistortions.includes(d.id));
    const selected = DISTORTIONS.filter(d => selectedDistortions.includes(d.id));

    return (
      <div style={styles.container}>
        <ProgressBar />
        <div key={fadeKey} style={{ ...styles.fadeIn, ...styles.content }}>
          <div style={styles.stepTag}>Distortion Spotter</div>
          <h2 style={styles.heading}>
            Which thinking traps apply?
          </h2>
          <p style={styles.subtext}>
            Tap every distortion you recognize in your thought. Most thoughts contain more than one.
          </p>

          {/* Thought reminder */}
          <div style={styles.thoughtReminder}>
            <div style={styles.reminderLabel}>Your thought</div>
            <p style={styles.reminderText}>
              {'\u201C'}{automaticThought}{'\u201D'}
            </p>
          </div>

          {/* Distortion grid */}
          <div style={styles.distortionGrid}>
            {unselected.map(d => (
              <button
                key={d.id}
                onClick={() => toggleDistortion(d.id)}
                style={styles.distortionCard}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(107,152,184,0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm, 0 1px 4px rgba(0,0,0,0.06))';
                }}
              >
                <div style={styles.cardName}>{d.name}</div>
                <div style={styles.cardDef}>{d.definition}</div>
                <div style={styles.cardExample}>{d.example}</div>
              </button>
            ))}
          </div>

          {/* Selected distortions stacked at bottom */}
          {selected.length > 0 && (
            <div style={styles.selectedSection}>
              <div style={styles.selectedHeader}>
                Selected ({selected.length})
              </div>
              <div style={styles.selectedStack}>
                {selected.map(d => (
                  <button
                    key={d.id}
                    onClick={() => toggleDistortion(d.id)}
                    style={styles.selectedCard}
                  >
                    <div style={styles.selectedCardInner}>
                      <div style={{ flex: 1 }}>
                        <div style={styles.selectedCardName}>
                          <span style={styles.checkmark}>{'\u2713'}</span>
                          {d.name}
                        </div>
                        <div style={styles.selectedCardDef}>{d.definition}</div>
                      </div>
                      <div style={styles.removeHint}>tap to remove</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={styles.btnRow}>
            <button onClick={() => goToStep(3)} style={styles.backBtn}>
              {'\u2190'} Back
            </button>
            <button
              onClick={() => goToStep(5)}
              disabled={selectedDistortions.length === 0}
              style={{
                ...styles.primaryBtn,
                opacity: selectedDistortions.length > 0 ? 1 : 0.4,
                cursor: selectedDistortions.length > 0 ? 'pointer' : 'not-allowed',
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

  // --- STEP 5: BALANCED REFRAME ---
  if (step === 5) {
    return (
      <div style={styles.container}>
        <ProgressBar />
        <div key={fadeKey} style={{ ...styles.fadeIn, ...styles.content }}>
          <div style={styles.stepTag}>Balanced Reframe</div>
          <h2 style={styles.heading}>
            What{'\u2019'}s a more balanced way to see this?
          </h2>
          <p style={styles.subtext}>
            Knowing you spotted{' '}
            {selectedDistortions.map(id => DISTORTIONS.find(d => d.id === id)?.name).filter(Boolean).join(', ')}
            {' '}{'\u2014'} how might you rewrite this thought?
          </p>

          {/* Original thought */}
          <div style={styles.thoughtReminder}>
            <div style={styles.reminderLabel}>Original thought</div>
            <p style={styles.reminderText}>
              {'\u201C'}{automaticThought}{'\u201D'}
            </p>
          </div>

          <textarea
            value={reframe}
            onChange={e => setReframe(e.target.value)}
            placeholder="e.g., They're probably busy. One slow reply doesn't mean they're upset with me."
            rows={4}
            style={styles.textarea}
            onFocus={e => { e.target.style.borderColor = 'var(--ocean, #6B98B8)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(107,152,184,0.2)'; }}
          />

          <div style={styles.sliderSection}>
            <label style={styles.sliderLabel}>
              How much do you believe the ORIGINAL thought now?
            </label>
            <div style={styles.sliderRow}>
              <input
                type="range"
                min={0}
                max={100}
                value={beliefAfter}
                onChange={e => setBeliefAfter(Number(e.target.value))}
                style={styles.rangeInput}
              />
              <span style={styles.sliderValue}>{beliefAfter}%</span>
            </div>
            <div style={styles.sliderHints}>
              <span>Not at all</span>
              <span>Completely</span>
            </div>
          </div>

          <div style={styles.btnRow}>
            <button onClick={() => goToStep(4)} style={styles.backBtn}>
              {'\u2190'} Back
            </button>
            <button
              onClick={() => goToStep(6)}
              disabled={!reframe.trim()}
              style={{
                ...styles.primaryBtn,
                opacity: reframe.trim() ? 1 : 0.4,
                cursor: reframe.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              See results {'\u2192'}
            </button>
          </div>
        </div>
        <style>{keyframes}</style>
      </div>
    );
  }

  // --- COMPLETION ---
  const distortionNames = selectedDistortions
    .map(id => DISTORTIONS.find(d => d.id === id)?.name)
    .filter(Boolean);

  return (
    <div style={styles.container}>
      <div key={fadeKey} style={{ ...styles.fadeIn, ...styles.content }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 16, animation: 'completePop 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
            {'\u2728'}
          </div>
          <h2 style={{ ...styles.heading, textAlign: 'center' }}>
            Your Thought Record
          </h2>
        </div>

        {/* Side-by-side comparison */}
        <div style={styles.comparisonRow}>
          {/* Original */}
          <div style={styles.comparisonCard}>
            <div style={styles.comparisonLabel}>Original thought</div>
            <p style={styles.comparisonThought}>
              {'\u201C'}{automaticThought}{'\u201D'}
            </p>
            <div style={styles.beliefBadge}>
              <span style={styles.beliefNumber}>{beliefBefore}%</span>
              <span style={styles.beliefLabel}>belief</span>
            </div>
          </div>

          {/* Arrow */}
          <div style={styles.comparisonArrow}>{'\u2192'}</div>

          {/* Reframe */}
          <div style={{ ...styles.comparisonCard, ...styles.comparisonCardReframe }}>
            <div style={{ ...styles.comparisonLabel, color: 'var(--ocean, #6B98B8)' }}>Reframe</div>
            <p style={styles.comparisonThought}>
              {'\u201C'}{reframe}{'\u201D'}
            </p>
            <div style={{ ...styles.beliefBadge, ...styles.beliefBadgeAfter }}>
              <span style={styles.beliefNumber}>{beliefAfter}%</span>
              <span style={styles.beliefLabel}>belief</span>
            </div>
          </div>
        </div>

        {/* Belief shift */}
        <div style={styles.shiftBanner}>
          <span style={styles.shiftIcon}>{beliefShift > 0 ? '\u2193' : beliefShift < 0 ? '\u2191' : '\u2194'}</span>
          <span style={styles.shiftText}>
            Your belief in the original thought shifted by{' '}
            <strong style={{ color: 'var(--ocean, #6B98B8)', fontFamily: "'JetBrains Mono', monospace" }}>
              {beliefShift > 0 ? '-' : '+'}{Math.abs(beliefShift)}%
            </strong>
          </span>
        </div>

        {/* Distortion tags */}
        <div style={styles.tagSection}>
          <div style={styles.tagSectionLabel}>Distortions identified</div>
          <div style={styles.tagRow}>
            {distortionNames.map(name => (
              <span key={name} style={styles.distortionTag}>
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Context row */}
        <div style={styles.contextRow}>
          <div style={styles.contextItem}>
            <span style={styles.contextLabel}>Situation</span>
            <span style={styles.contextValue}>{situation}</span>
          </div>
          <div style={styles.contextItem}>
            <span style={styles.contextLabel}>Emotion</span>
            <span style={styles.contextValue}>{emotion} ({intensity}/10)</span>
          </div>
        </div>

        {/* Save button */}
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button onClick={handleSave} style={styles.primaryBtn}>
            Save this reframe {'\u2192'}
          </button>
        </div>
      </div>
      <style>{keyframes}</style>
    </div>
  );
}

// --- KEYFRAMES ---
const keyframes = `
  @keyframes trlFadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes completePop {
    0% { opacity: 0; transform: scale(0.5); }
    60% { transform: scale(1.15); }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes cardSelect {
    0% { transform: scale(1); }
    40% { transform: scale(0.96); }
    100% { transform: scale(1); }
  }

  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    border-radius: 3px;
    background: rgba(107,152,184,0.15);
    outline: none;
  }
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--ocean, #6B98B8);
    cursor: pointer;
    border: 3px solid #fff;
    box-shadow: 0 2px 8px rgba(107,152,184,0.35);
    transition: transform 0.15s ease;
  }
  input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.15);
  }
  input[type="range"]::-moz-range-thumb {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--ocean, #6B98B8);
    cursor: pointer;
    border: 3px solid #fff;
    box-shadow: 0 2px 8px rgba(107,152,184,0.35);
  }
`;

// --- STYLES ---
const styles = {
  container: {
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '20px 0 100px',
  },
  content: {
    padding: '24px 24px 0',
    maxWidth: 560,
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
  },
  fadeIn: {
    animation: 'trlFadeIn 0.45s cubic-bezier(0.16,1,0.3,1)',
  },

  // Progress
  progressContainer: {
    padding: '16px 24px 0',
    maxWidth: 560,
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
  },
  progressTrack: {
    display: 'flex',
    gap: 6,
    height: 5,
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: "'JetBrains Mono', monospace",
    color: 'var(--text-muted, #999)',
    letterSpacing: '0.06em',
    textAlign: 'right',
  },

  // Typography
  stepTag: {
    display: 'inline-block',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.14em',
    color: 'var(--ocean, #6B98B8)',
    fontWeight: 700,
    fontFamily: "'JetBrains Mono', monospace",
    marginBottom: 12,
    padding: '4px 10px',
    background: 'rgba(107,152,184,0.08)',
    borderRadius: 6,
  },
  heading: {
    fontFamily: "'Fraunces', serif",
    fontSize: 'clamp(1.4rem, 4vw, 1.85rem)',
    fontWeight: 500,
    color: 'var(--text-primary, #1a1a1a)',
    lineHeight: 1.3,
    margin: '0 0 12px',
  },
  subtext: {
    fontSize: 15,
    color: 'var(--text-secondary, #666)',
    lineHeight: 1.65,
    margin: '0 0 24px',
    fontFamily: "'DM Sans', sans-serif",
  },

  // Inputs
  textarea: {
    width: '100%',
    padding: '16px 20px',
    border: '1.5px solid rgba(107,152,184,0.2)',
    borderRadius: 14,
    background: 'rgba(107,152,184,0.03)',
    fontSize: 15,
    color: 'var(--text-primary, #1a1a1a)',
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: 1.6,
    resize: 'none',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  },
  textInput: {
    width: '100%',
    padding: '14px 20px',
    border: '1.5px solid rgba(107,152,184,0.2)',
    borderRadius: 14,
    background: 'rgba(107,152,184,0.03)',
    fontSize: 15,
    color: 'var(--text-primary, #1a1a1a)',
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  },

  // Slider
  sliderSection: {
    marginTop: 28,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--text-primary, #1a1a1a)',
    fontFamily: "'DM Sans', sans-serif",
    marginBottom: 12,
    display: 'block',
  },
  sliderRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  rangeInput: {
    flex: 1,
    cursor: 'pointer',
  },
  sliderValue: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 18,
    fontWeight: 700,
    color: 'var(--ocean, #6B98B8)',
    minWidth: 52,
    textAlign: 'right',
  },
  sliderHints: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 11,
    color: 'var(--text-muted, #999)',
    fontFamily: "'DM Sans', sans-serif",
    marginTop: 6,
  },

  // Buttons
  btnWrap: {
    textAlign: 'center',
    marginTop: 28,
  },
  btnRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 28,
    gap: 12,
  },
  primaryBtn: {
    padding: '14px 32px',
    borderRadius: 50,
    background: 'var(--ocean, #6B98B8)',
    color: '#fff',
    border: 'none',
    fontSize: 15,
    fontWeight: 600,
    fontFamily: "'Fraunces', serif",
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
    boxShadow: '0 4px 16px rgba(107,152,184,0.3)',
  },
  backBtn: {
    padding: '14px 20px',
    borderRadius: 50,
    background: 'transparent',
    color: 'var(--text-muted, #999)',
    border: '1.5px solid rgba(107,152,184,0.15)',
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  // Thought reminder
  thoughtReminder: {
    padding: '14px 18px',
    background: 'rgba(107,152,184,0.05)',
    borderRadius: 12,
    borderLeft: '3px solid rgba(107,152,184,0.3)',
    marginBottom: 20,
  },
  reminderLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.14em',
    color: 'var(--text-muted, #999)',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 600,
    marginBottom: 4,
  },
  reminderText: {
    fontSize: 14,
    color: 'var(--text-secondary, #666)',
    lineHeight: 1.6,
    margin: 0,
    fontStyle: 'italic',
    fontFamily: "'DM Sans', sans-serif",
  },

  // Distortion grid
  distortionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 12,
    marginBottom: 16,
  },
  distortionCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    textAlign: 'left',
    padding: '16px',
    background: 'var(--surface-elevated, #fff)',
    border: '1.5px solid var(--border, rgba(107,152,184,0.12))',
    borderRadius: 14,
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
    boxShadow: 'var(--shadow-sm, 0 1px 4px rgba(0,0,0,0.06))',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  cardName: {
    fontSize: 13,
    fontWeight: 700,
    color: 'var(--text-primary, #1a1a1a)',
    fontFamily: "'DM Sans', sans-serif",
    marginBottom: 4,
    lineHeight: 1.3,
  },
  cardDef: {
    fontSize: 12,
    color: 'var(--text-secondary, #666)',
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: 1.45,
    marginBottom: 6,
  },
  cardExample: {
    fontSize: 11,
    color: 'var(--text-muted, #999)',
    fontFamily: "'DM Sans', sans-serif",
    fontStyle: 'italic',
    lineHeight: 1.4,
  },

  // Selected distortions
  selectedSection: {
    marginTop: 8,
    marginBottom: 8,
  },
  selectedHeader: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: 'var(--ocean, #6B98B8)',
    fontWeight: 700,
    fontFamily: "'JetBrains Mono', monospace",
    marginBottom: 10,
  },
  selectedStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  selectedCard: {
    display: 'block',
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(107,152,184,0.06)',
    border: '1.5px solid var(--ocean, #6B98B8)',
    borderRadius: 12,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
    textAlign: 'left',
    boxSizing: 'border-box',
    animation: 'cardSelect 0.25s ease',
  },
  selectedCardInner: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  selectedCardName: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--ocean, #6B98B8)',
    fontFamily: "'DM Sans', sans-serif",
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  selectedCardDef: {
    fontSize: 12,
    color: 'var(--text-muted, #999)',
    fontFamily: "'DM Sans', sans-serif",
    marginTop: 2,
  },
  checkmark: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: 'var(--ocean, #6B98B8)',
    color: '#fff',
    fontSize: 12,
    fontWeight: 700,
    flexShrink: 0,
  },
  removeHint: {
    fontSize: 10,
    color: 'var(--text-muted, #999)',
    fontFamily: "'DM Sans', sans-serif",
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },

  // Completion: comparison
  comparisonRow: {
    display: 'flex',
    alignItems: 'stretch',
    gap: 12,
    marginBottom: 20,
  },
  comparisonCard: {
    flex: 1,
    padding: '18px 16px',
    background: 'var(--surface-elevated, #fff)',
    border: '1.5px solid var(--border, rgba(107,152,184,0.12))',
    borderRadius: 14,
    boxShadow: 'var(--shadow-sm, 0 1px 4px rgba(0,0,0,0.06))',
    display: 'flex',
    flexDirection: 'column',
  },
  comparisonCardReframe: {
    borderColor: 'rgba(107,152,184,0.3)',
    background: 'rgba(107,152,184,0.04)',
  },
  comparisonLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: 'var(--text-muted, #999)',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 700,
    marginBottom: 8,
  },
  comparisonThought: {
    fontSize: 13,
    color: 'var(--text-primary, #1a1a1a)',
    lineHeight: 1.55,
    margin: '0 0 12px',
    fontFamily: "'DM Sans', sans-serif",
    flex: 1,
  },
  comparisonArrow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    color: 'var(--ocean, #6B98B8)',
    fontWeight: 700,
    flexShrink: 0,
    padding: '0 2px',
  },
  beliefBadge: {
    display: 'inline-flex',
    alignItems: 'baseline',
    gap: 4,
    padding: '6px 10px',
    background: 'rgba(107,152,184,0.08)',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  beliefBadgeAfter: {
    background: 'rgba(107,152,184,0.12)',
  },
  beliefNumber: {
    fontSize: 18,
    fontWeight: 700,
    fontFamily: "'JetBrains Mono', monospace",
    color: 'var(--ocean, #6B98B8)',
  },
  beliefLabel: {
    fontSize: 11,
    color: 'var(--text-muted, #999)',
    fontFamily: "'DM Sans', sans-serif",
  },

  // Shift banner
  shiftBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: '14px 20px',
    background: 'rgba(107,152,184,0.06)',
    borderRadius: 12,
    marginBottom: 20,
  },
  shiftIcon: {
    fontSize: 18,
    color: 'var(--ocean, #6B98B8)',
  },
  shiftText: {
    fontSize: 14,
    color: 'var(--text-secondary, #666)',
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: 1.5,
  },

  // Tags
  tagSection: {
    marginBottom: 16,
  },
  tagSectionLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: 'var(--text-muted, #999)',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 600,
    marginBottom: 10,
  },
  tagRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  distortionTag: {
    display: 'inline-block',
    padding: '5px 12px',
    fontSize: 12,
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    color: 'var(--ocean, #6B98B8)',
    background: 'rgba(107,152,184,0.1)',
    borderRadius: 20,
    border: '1px solid rgba(107,152,184,0.2)',
  },

  // Context row
  contextRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    padding: '16px 18px',
    background: 'var(--surface-elevated, #fff)',
    borderRadius: 12,
    border: '1px solid var(--border, rgba(107,152,184,0.12))',
  },
  contextItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  contextLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: 'var(--text-muted, #999)',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 600,
  },
  contextValue: {
    fontSize: 13,
    color: 'var(--text-secondary, #666)',
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: 1.5,
  },
};
