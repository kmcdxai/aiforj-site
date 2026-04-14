"use client";

import { useState } from 'react';

const VALUES = [
  { name: 'Connection', emoji: '\u{1F91D}', description: 'Building meaningful relationships and being close to others' },
  { name: 'Growth', emoji: '\u{1F331}', description: 'Learning, evolving, and becoming more of who you want to be' },
  { name: 'Health', emoji: '\u{1F4AA}', description: 'Taking care of your body and mind with intention' },
  { name: 'Adventure', emoji: '\u{1F30D}', description: 'Exploring new places, ideas, and experiences' },
  { name: 'Creativity', emoji: '\u{1F3A8}', description: 'Expressing yourself and bringing new things into the world' },
  { name: 'Family', emoji: '\u{1F468}\u200D\u{1F469}\u200D\u{1F467}', description: 'Nurturing and being present for the people closest to you' },
  { name: 'Freedom', emoji: '\u{1F985}', description: 'Living on your own terms with autonomy and choice' },
  { name: 'Knowledge', emoji: '\u{1F4DA}', description: 'Understanding deeply and satisfying your curiosity' },
  { name: 'Service', emoji: '\u{1F932}', description: 'Contributing to others and making a difference' },
  { name: 'Authenticity', emoji: '\u{1F3AD}', description: 'Being genuine and true to who you really are' },
  { name: 'Security', emoji: '\u{1F3E0}', description: 'Creating stability, safety, and predictability in your life' },
  { name: 'Play', emoji: '\u{1F3AE}', description: 'Having fun, being spontaneous, and enjoying the moment' },
];

export default function ValuesBasedAction({ onComplete }) {
  const [step, setStep] = useState(0); // 0=intro, 1=sorting, 2=topThree, 3=anxietyBlock, 4=willingness, 5=committedAction, 6=completion
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedValues, setSelectedValues] = useState([]);
  const [topThree, setTopThree] = useState([]);
  const [blockedValue, setBlockedValue] = useState(null);
  const [blockResponse, setBlockResponse] = useState('');
  const [willingness, setWillingness] = useState(null);
  const [committedAction, setCommittedAction] = useState('');
  const [when, setWhen] = useState('');
  const [cardVisible, setCardVisible] = useState(true);
  const [cardDirection, setCardDirection] = useState('in'); // 'in' or 'out'
  const [saved, setSaved] = useState(false);

  const handleSelectValue = (selected) => {
    if (selected) {
      setSelectedValues(prev => [...prev, VALUES[currentCardIndex]]);
    }
    setCardDirection('out');
    setCardVisible(false);
    setTimeout(() => {
      if (currentCardIndex < VALUES.length - 1) {
        setCurrentCardIndex(prev => prev + 1);
        setCardDirection('in');
        setCardVisible(true);
      } else {
        // Done sorting
        const finalSelected = selected
          ? [...selectedValues, VALUES[currentCardIndex]]
          : selectedValues;
        if (finalSelected.length <= 3) {
          setTopThree(finalSelected);
          setStep(3);
        } else {
          setSelectedValues(finalSelected);
          setStep(2);
        }
      }
    }, 350);
  };

  const handleTopThreeToggle = (value) => {
    if (topThree.find(v => v.name === value.name)) {
      setTopThree(prev => prev.filter(v => v.name !== value.name));
    } else if (topThree.length < 3) {
      setTopThree(prev => [...prev, value]);
    }
  };

  const handleSave = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('aiforj_value_commitments') || '[]');
      existing.push({
        value: blockedValue.name,
        valueEmoji: blockedValue.emoji,
        action: committedAction,
        when,
        willingness,
        date: new Date().toISOString(),
      });
      localStorage.setItem('aiforj_value_commitments', JSON.stringify(existing));
      setSaved(true);
    } catch (e) {
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
            {'\u{1F9ED}'}
          </div>
          <h2 style={styles.heading}>
            Anxiety is telling you to avoid, retreat, or freeze.
          </h2>
          <p style={styles.subtext}>
            Let's find out what matters enough to move toward, even WITH the anxiety.
          </p>
          <button onClick={() => { setStep(1); setCardVisible(true); setCardDirection('in'); }} style={styles.primaryBtn}>
            Let's start {'\u2192'}
          </button>
        </div>
      </div>
    );
  }

  // --- STEP 1: VALUE CARD SORTING ---
  if (step === 1) {
    const currentValue = VALUES[currentCardIndex];

    return (
      <div style={styles.container}>
        <style>{animationStyles}</style>
        <div style={{ padding: '40px 24px', maxWidth: 520, margin: '0 auto' }}>
          <ProgressBar currentStep={1} totalSteps={4} />

          <h2 style={{ ...styles.heading, textAlign: 'center', marginBottom: 8 }}>
            What matters to you?
          </h2>
          <p style={{
            fontSize: 14,
            color: 'var(--text-muted)',
            textAlign: 'center',
            margin: '0 0 20px',
            lineHeight: 1.6,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Sort through these values. No right answers.
          </p>

          {/* Selected value pills */}
          {selectedValues.length > 0 && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              marginBottom: 20,
              justifyContent: 'center',
            }}>
              {selectedValues.map(v => (
                <div key={v.name} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '5px 12px',
                  borderRadius: 20,
                  background: 'rgba(122,158,126,0.1)',
                  border: '1px solid rgba(122,158,126,0.2)',
                  fontSize: 12,
                  fontWeight: 500,
                  color: 'var(--sage)',
                  fontFamily: "'DM Sans', sans-serif",
                  animation: 'pillPop 0.3s cubic-bezier(0.16,1,0.3,1)',
                }}>
                  <span>{v.emoji}</span>
                  <span>{v.name}</span>
                </div>
              ))}
            </div>
          )}

          {/* Progress indicator */}
          <div style={{
            textAlign: 'center',
            marginBottom: 16,
            fontSize: 12,
            fontFamily: "'JetBrains Mono', monospace",
            color: 'var(--text-muted)',
            fontWeight: 600,
            letterSpacing: '0.05em',
          }}>
            {currentCardIndex + 1} / {VALUES.length}
          </div>

          {/* Card deck */}
          <div style={{ position: 'relative', minHeight: 260, marginBottom: 24 }}>
            {/* Background cards for deck effect */}
            {currentCardIndex < VALUES.length - 2 && (
              <div style={{
                position: 'absolute',
                top: 8,
                left: 8,
                right: -8,
                bottom: -8,
                borderRadius: 24,
                background: 'rgba(122,158,126,0.04)',
                border: '1.5px solid rgba(122,158,126,0.08)',
              }} />
            )}
            {currentCardIndex < VALUES.length - 1 && (
              <div style={{
                position: 'absolute',
                top: 4,
                left: 4,
                right: -4,
                bottom: -4,
                borderRadius: 24,
                background: 'rgba(122,158,126,0.06)',
                border: '1.5px solid rgba(122,158,126,0.1)',
              }} />
            )}

            {/* Active card */}
            <div style={{
              position: 'relative',
              padding: '36px 28px',
              background: 'rgba(122,158,126,0.06)',
              borderRadius: 24,
              border: '1.5px solid rgba(122,158,126,0.2)',
              boxShadow: '0 8px 32px rgba(122,158,126,0.12)',
              textAlign: 'center',
              opacity: cardVisible ? 1 : 0,
              transform: cardVisible
                ? 'translateX(0) rotate(0deg)'
                : cardDirection === 'out'
                  ? 'translateX(120px) rotate(8deg)'
                  : 'translateX(-80px) rotate(-4deg)',
              transition: 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1)',
            }}>
              <div style={{ fontSize: 56, marginBottom: 16, lineHeight: 1 }}>
                {currentValue.emoji}
              </div>
              <h3 style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 24,
                fontWeight: 600,
                color: 'var(--text-primary)',
                margin: '0 0 12px',
              }}>
                {currentValue.name}
              </h3>
              <p style={{
                fontSize: 15,
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                margin: 0,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                {currentValue.description}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
          }}>
            <button
              onClick={() => handleSelectValue(false)}
              style={{
                flex: 1,
                maxWidth: 180,
                padding: '14px 20px',
                borderRadius: 50,
                background: 'transparent',
                color: 'var(--text-muted)',
                border: '1.5px solid var(--border)',
                fontSize: 15,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.target.style.background = 'rgba(0,0,0,0.03)';
                e.target.style.borderColor = 'var(--text-muted)';
              }}
              onMouseLeave={e => {
                e.target.style.background = 'transparent';
                e.target.style.borderColor = 'var(--border)';
              }}
            >
              Not now {'\u2717'}
            </button>
            <button
              onClick={() => handleSelectValue(true)}
              style={{
                flex: 1,
                maxWidth: 180,
                padding: '14px 20px',
                borderRadius: 50,
                background: 'var(--sage)',
                color: '#fff',
                border: 'none',
                fontSize: 15,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                boxShadow: '0 4px 16px rgba(122,158,126,0.3)',
              }}
              onMouseEnter={e => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 6px 20px rgba(122,158,126,0.4)';
              }}
              onMouseLeave={e => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 16px rgba(122,158,126,0.3)';
              }}
            >
              This matters {'\u2713'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- STEP 2: PICK TOP 3 ---
  if (step === 2) {
    return (
      <div style={styles.container}>
        <style>{animationStyles}</style>
        <div style={{ ...styles.fadeIn, padding: '40px 24px', maxWidth: 520, margin: '0 auto' }}>
          <ProgressBar currentStep={1} totalSteps={4} />

          <h2 style={{ ...styles.heading, textAlign: 'center', marginBottom: 8 }}>
            Pick your top 3
          </h2>
          <p style={{
            fontSize: 14,
            color: 'var(--text-muted)',
            textAlign: 'center',
            margin: '0 0 8px',
            lineHeight: 1.6,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            You selected {selectedValues.length} values. Which 3 feel most alive right now?
          </p>
          <p style={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', monospace",
            color: topThree.length === 3 ? 'var(--sage)' : 'var(--text-muted)',
            textAlign: 'center',
            margin: '0 0 28px',
            fontWeight: 600,
            letterSpacing: '0.05em',
            transition: 'color 0.3s ease',
          }}>
            {topThree.length} / 3 selected
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 12,
            marginBottom: 32,
          }}>
            {selectedValues.map((v, i) => {
              const isSelected = topThree.find(t => t.name === v.name);
              const isDisabled = !isSelected && topThree.length >= 3;

              return (
                <button
                  key={v.name}
                  onClick={() => !isDisabled && handleTopThreeToggle(v)}
                  style={{
                    padding: '20px 12px',
                    borderRadius: 16,
                    background: isSelected
                      ? 'rgba(122,158,126,0.12)'
                      : isDisabled
                        ? 'rgba(0,0,0,0.02)'
                        : 'var(--surface-elevated)',
                    border: `1.5px solid ${isSelected ? 'var(--sage)' : isDisabled ? 'var(--border)' : 'var(--border)'}`,
                    cursor: isDisabled ? 'default' : 'pointer',
                    opacity: isDisabled ? 0.4 : 1,
                    textAlign: 'center',
                    transition: 'all 0.25s ease',
                    animation: `cardSlideIn 0.4s ease ${0.05 * i}s both`,
                    boxShadow: isSelected ? '0 4px 16px rgba(122,158,126,0.15)' : 'none',
                    transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{v.emoji}</div>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: isSelected ? 'var(--sage)' : isDisabled ? 'var(--text-muted)' : 'var(--text-primary)',
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    {v.name}
                  </div>
                  {isSelected && (
                    <div style={{
                      marginTop: 6,
                      fontSize: 10,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700,
                      color: 'var(--sage)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                    }}>
                      {'\u2713'} Selected
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => setStep(3)}
              disabled={topThree.length === 0}
              style={{
                ...styles.primaryBtn,
                opacity: topThree.length > 0 ? 1 : 0.4,
                cursor: topThree.length > 0 ? 'pointer' : 'not-allowed',
              }}
            >
              Continue {'\u2192'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- STEP 3: ANXIETY BLOCK ---
  if (step === 3) {
    return (
      <div style={styles.container}>
        <style>{animationStyles}</style>
        <div style={{ ...styles.fadeIn, padding: '40px 24px', maxWidth: 520, margin: '0 auto' }}>
          <ProgressBar currentStep={2} totalSteps={4} />

          <h2 style={{ ...styles.heading, textAlign: 'center', marginBottom: 8 }}>
            Pick the value anxiety is MOST blocking right now.
          </h2>
          <p style={{
            fontSize: 14,
            color: 'var(--text-muted)',
            textAlign: 'center',
            margin: '0 0 28px',
            lineHeight: 1.6,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Which of these does fear keep you from living out?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
            {topThree.map((v, i) => {
              const isChosen = blockedValue && blockedValue.name === v.name;

              return (
                <button
                  key={v.name}
                  onClick={() => setBlockedValue(v)}
                  style={{
                    padding: '24px 24px',
                    borderRadius: 20,
                    background: isChosen
                      ? 'rgba(122,158,126,0.1)'
                      : 'var(--surface-elevated)',
                    border: `2px solid ${isChosen ? 'var(--sage)' : 'var(--border)'}`,
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    transition: 'all 0.25s ease',
                    animation: `cardSlideIn 0.4s ease ${0.1 * i}s both`,
                    boxShadow: isChosen
                      ? '0 8px 32px rgba(122,158,126,0.15)'
                      : 'var(--shadow-sm)',
                    transform: isChosen ? 'scale(1.02)' : 'scale(1)',
                  }}
                >
                  <div style={{ fontSize: 40, lineHeight: 1, flexShrink: 0 }}>{v.emoji}</div>
                  <div>
                    <div style={{
                      fontSize: 18,
                      fontWeight: 600,
                      color: isChosen ? 'var(--sage)' : 'var(--text-primary)',
                      fontFamily: "'Fraunces', serif",
                      marginBottom: 4,
                    }}>
                      {v.name}
                    </div>
                    <div style={{
                      fontSize: 13,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      fontFamily: "'DM Sans', sans-serif",
                    }}>
                      {v.description}
                    </div>
                  </div>
                  {isChosen && (
                    <div style={{
                      marginLeft: 'auto',
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: 'var(--sage)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>{'\u2713'}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {blockedValue && (
            <div style={{
              animation: 'fadeIn 0.4s ease',
              marginBottom: 24,
            }}>
              <label style={{
                display: 'block',
                fontSize: 15,
                fontWeight: 500,
                color: 'var(--text-primary)',
                marginBottom: 12,
                lineHeight: 1.6,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                If anxiety weren't driving, what would you do <strong>RIGHT NOW</strong> in service of{' '}
                <span style={{ color: 'var(--sage)', fontWeight: 700 }}>{blockedValue.name}</span>?
              </label>
              <textarea
                value={blockResponse}
                onChange={e => setBlockResponse(e.target.value)}
                placeholder={`What would you do for ${blockedValue.name} if fear wasn't in the way...`}
                rows={4}
                style={styles.textarea}
                onFocus={e => { e.target.style.borderColor = 'var(--sage)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(122,158,126,0.2)'; }}
              />
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => setStep(4)}
              disabled={!blockedValue || !blockResponse.trim()}
              style={{
                ...styles.primaryBtn,
                opacity: blockedValue && blockResponse.trim() ? 1 : 0.4,
                cursor: blockedValue && blockResponse.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              Continue {'\u2192'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- STEP 4: WILLINGNESS ---
  if (step === 4) {
    return (
      <div style={styles.container}>
        <style>{animationStyles}</style>
        <div style={{ ...styles.fadeIn, padding: '40px 24px', maxWidth: 520, margin: '0 auto' }}>
          <ProgressBar currentStep={3} totalSteps={4} />

          <h2 style={{ ...styles.heading, textAlign: 'center', marginBottom: 8 }}>
            How much discomfort are you willing to have for{' '}
            <span style={{ color: 'var(--sage)' }}>{blockedValue.name}</span>?
          </h2>

          {/* Selected number display */}
          <div style={{
            textAlign: 'center',
            marginBottom: 28,
            minHeight: 72,
          }}>
            {willingness !== null ? (
              <div style={{ animation: 'numberPop 0.3s cubic-bezier(0.16,1,0.3,1)' }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 56,
                  fontWeight: 800,
                  color: 'var(--sage)',
                  lineHeight: 1,
                }}>
                  {willingness}
                </span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 20,
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                }}>
                  /10
                </span>
              </div>
            ) : (
              <p style={{
                fontSize: 14,
                color: 'var(--text-muted)',
                margin: 0,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                Tap a number below
              </p>
            )}
          </div>

          {/* Willingness circles */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 6,
            marginBottom: 32,
            flexWrap: 'wrap',
          }}>
            {Array.from({ length: 11 }, (_, i) => {
              const isFilled = willingness !== null && i <= willingness;
              return (
                <button
                  key={i}
                  onClick={() => setWillingness(i)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    border: `2px solid ${isFilled ? 'var(--sage)' : 'var(--border)'}`,
                    background: isFilled
                      ? `linear-gradient(135deg, var(--sage) 0%, rgba(122,158,126,0.7) 100%)`
                      : 'transparent',
                    color: isFilled ? '#fff' : 'var(--text-muted)',
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: "'JetBrains Mono', monospace",
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isFilled ? '0 2px 8px rgba(122,158,126,0.3)' : 'none',
                  }}
                  onMouseEnter={e => {
                    if (!isFilled) {
                      e.target.style.borderColor = 'var(--sage)';
                      e.target.style.background = 'rgba(122,158,126,0.08)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isFilled) {
                      e.target.style.borderColor = 'var(--border)';
                      e.target.style.background = 'transparent';
                    }
                  }}
                >
                  {i}
                </button>
              );
            })}
          </div>

          {/* Wisdom text */}
          <div style={{
            padding: '20px 24px',
            borderRadius: 16,
            background: 'rgba(122,158,126,0.06)',
            border: '1px solid rgba(122,158,126,0.15)',
            marginBottom: 32,
          }}>
            <p style={{
              fontSize: 15,
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              margin: 0,
              textAlign: 'center',
              fontFamily: "'DM Sans', sans-serif",
              fontStyle: 'italic',
            }}>
              Willingness isn't wanting the discomfort. It's choosing to have it because something matters more.
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => setStep(5)}
              disabled={willingness === null}
              style={{
                ...styles.primaryBtn,
                opacity: willingness !== null ? 1 : 0.4,
                cursor: willingness !== null ? 'pointer' : 'not-allowed',
              }}
            >
              Continue {'\u2192'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- STEP 5: COMMITTED ACTION ---
  if (step === 5) {
    return (
      <div style={styles.container}>
        <style>{animationStyles}</style>
        <div style={{ ...styles.fadeIn, padding: '40px 24px', maxWidth: 520, margin: '0 auto' }}>
          <ProgressBar currentStep={4} totalSteps={4} />

          <h2 style={{ ...styles.heading, textAlign: 'center', marginBottom: 8 }}>
            What's the smallest possible action?
          </h2>
          <p style={{
            fontSize: 15,
            color: 'var(--text-secondary)',
            textAlign: 'center',
            margin: '0 0 28px',
            lineHeight: 1.7,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Something you could take in the next 24 hours toward{' '}
            <strong style={{ color: 'var(--sage)' }}>{blockedValue.name}</strong>,
            even if anxiety comes along.
          </p>

          <textarea
            value={committedAction}
            onChange={e => setCommittedAction(e.target.value)}
            placeholder="One small, specific step..."
            rows={3}
            style={styles.textarea}
            onFocus={e => { e.target.style.borderColor = 'var(--sage)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(122,158,126,0.2)'; }}
          />

          {/* When buttons */}
          <div style={{ marginTop: 20, marginBottom: 28 }}>
            <label style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 500,
              color: 'var(--text-primary)',
              marginBottom: 12,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              When?
            </label>
            <div style={{ display: 'flex', gap: 12 }}>
              {['Today', 'Tomorrow'].map(option => {
                const isSelected = when === option;
                return (
                  <button
                    key={option}
                    onClick={() => setWhen(option)}
                    style={{
                      flex: 1,
                      padding: '14px 20px',
                      borderRadius: 14,
                      background: isSelected
                        ? 'rgba(122,158,126,0.1)'
                        : 'var(--surface-elevated)',
                      border: `2px solid ${isSelected ? 'var(--sage)' : 'var(--border)'}`,
                      color: isSelected ? 'var(--sage)' : 'var(--text-secondary)',
                      fontSize: 15,
                      fontWeight: 600,
                      fontFamily: "'DM Sans', sans-serif",
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 4px 12px rgba(122,158,126,0.15)' : 'none',
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Encouragement */}
          <div style={{
            padding: '16px 20px',
            borderRadius: 14,
            background: 'rgba(212,168,67,0.06)',
            border: '1px solid rgba(212,168,67,0.15)',
            marginBottom: 32,
          }}>
            <p style={{
              fontSize: 14,
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              margin: 0,
              textAlign: 'center',
              fontFamily: "'DM Sans', sans-serif",
            }}>
              Anxiety can come. But it's not driving.
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => setStep(6)}
              disabled={!committedAction.trim() || !when}
              style={{
                ...styles.primaryBtn,
                opacity: committedAction.trim() && when ? 1 : 0.4,
                cursor: committedAction.trim() && when ? 'pointer' : 'not-allowed',
              }}
            >
              See my commitment {'\u2192'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- STEP 6: COMPLETION ---
  return (
    <div style={styles.container}>
      <style>{animationStyles}</style>
      <div style={{ padding: '40px 24px', maxWidth: 520, margin: '0 auto' }}>
        {/* Commitment card */}
        <div style={{
          padding: '40px 28px',
          borderRadius: 28,
          background: 'var(--surface-elevated)',
          border: '2px solid transparent',
          backgroundClip: 'padding-box',
          position: 'relative',
          marginBottom: 28,
          animation: 'perspectiveReveal 0.7s cubic-bezier(0.16,1,0.3,1)',
          boxShadow: '0 12px 48px rgba(122,158,126,0.12)',
        }}>
          {/* Gradient border overlay */}
          <div style={{
            position: 'absolute',
            inset: -2,
            borderRadius: 30,
            padding: 2,
            background: 'linear-gradient(135deg, var(--sage) 0%, var(--amber) 50%, var(--sage) 100%)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            pointerEvents: 'none',
          }} />

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 52, marginBottom: 20, lineHeight: 1 }}>
              {blockedValue.emoji}
            </div>

            <div style={{
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              color: 'var(--sage)',
              marginBottom: 20,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
            }}>
              My Commitment
            </div>

            <p style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 'clamp(1.1rem, 3.5vw, 1.4rem)',
              fontWeight: 500,
              color: 'var(--text-primary)',
              lineHeight: 1.5,
              margin: '0 0 24px',
            }}>
              I choose{' '}
              <strong style={{ color: 'var(--sage)' }}>{blockedValue.name}</strong>{' '}
              {blockedValue.emoji}
            </p>

            {/* Commitment details */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              textAlign: 'left',
              marginBottom: 24,
            }}>
              <div style={{
                padding: '14px 18px',
                borderRadius: 14,
                background: 'rgba(122,158,126,0.06)',
                border: '1px solid rgba(122,158,126,0.12)',
              }}>
                <div style={{
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  color: 'var(--text-muted)',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 600,
                  marginBottom: 6,
                }}>
                  My action
                </div>
                <p style={{
                  fontSize: 15,
                  color: 'var(--text-primary)',
                  margin: 0,
                  lineHeight: 1.5,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {committedAction}
                </p>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{
                  flex: 1,
                  padding: '14px 18px',
                  borderRadius: 14,
                  background: 'rgba(212,168,67,0.06)',
                  border: '1px solid rgba(212,168,67,0.12)',
                }}>
                  <div style={{
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: 'var(--text-muted)',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 600,
                    marginBottom: 6,
                  }}>
                    When
                  </div>
                  <p style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: 'var(--amber)',
                    margin: 0,
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    {when}
                  </p>
                </div>

                <div style={{
                  flex: 1,
                  padding: '14px 18px',
                  borderRadius: 14,
                  background: 'rgba(122,158,126,0.06)',
                  border: '1px solid rgba(122,158,126,0.12)',
                }}>
                  <div style={{
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: 'var(--text-muted)',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 600,
                    marginBottom: 6,
                  }}>
                    Willingness
                  </div>
                  <p style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: 'var(--sage)',
                    margin: 0,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    {willingness}/10
                  </p>
                </div>
              </div>
            </div>

            {/* Closing line */}
            <p style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 16,
              fontWeight: 500,
              fontStyle: 'italic',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              margin: 0,
            }}>
              Anxiety can come, but it's not driving.
            </p>
          </div>
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
            {saved ? 'Saved \u2713' : 'Save & complete'}
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
          color: 'var(--sage)',
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
            background: i < currentStep ? 'var(--sage)' : 'rgba(122,158,126,0.15)',
            transition: 'background 0.3s ease',
          }} />
        ))}
      </div>
    </div>
  );
}

// --- Keyframe animations ---
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes cardSlideIn {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes perspectiveReveal {
    from { opacity: 0; transform: scale(0.92) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes pillPop {
    from { opacity: 0; transform: scale(0.7); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes numberPop {
    from { transform: scale(0.8); opacity: 0; }
    50% { transform: scale(1.1); }
    to { transform: scale(1); opacity: 1; }
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
    border: '1.5px solid rgba(122,158,126,0.2)',
    borderRadius: 16,
    background: 'rgba(122,158,126,0.04)',
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
    background: 'var(--sage)',
    color: '#fff',
    border: 'none',
    fontSize: 16,
    fontWeight: 600,
    fontFamily: "'Fraunces', serif",
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
    boxShadow: '0 4px 16px rgba(122,158,126,0.3)',
  },
};
