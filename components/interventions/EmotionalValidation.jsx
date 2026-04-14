"use client";

import { useState } from 'react';

const NEEDS = [
  { name: 'Connection', emoji: '\u{1F91D}', description: 'To feel close to someone, to belong' },
  { name: 'Rest', emoji: '\u{1F6CC}', description: 'To slow down, recharge, recover' },
  { name: 'Recognition', emoji: '\u{2B50}', description: 'To be seen, acknowledged, valued' },
  { name: 'Safety', emoji: '\u{1F6E1}\uFE0F', description: 'To feel secure, protected, stable' },
  { name: 'Control', emoji: '\u{1F3AF}', description: 'To have agency over your own life' },
  { name: 'Meaning', emoji: '\u{1F4A1}', description: 'To feel your life matters, has purpose' },
  { name: 'Fun', emoji: '\u{1F389}', description: 'To experience joy, lightness, play' },
  { name: 'Autonomy', emoji: '\u{1F985}', description: 'To make your own choices freely' },
  { name: 'Fairness', emoji: '\u{2696}\uFE0F', description: 'To be treated justly, equitably' },
];

const LEVEL_LABELS = [
  'Pay Attention',
  'Reflect',
  'Read Between the Lines',
  'Understand in Context',
  'Normalize',
  'Radical Genuineness',
];

// --- Level Progress Indicator ---
function LevelProgress({ currentLevel }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginBottom: 32,
      padding: '0 4px',
    }}>
      {LEVEL_LABELS.map((label, i) => {
        const isActive = i === currentLevel;
        const isCompleted = i < currentLevel;

        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            {/* Dot / number */}
            <div style={{
              width: isActive ? 28 : 20,
              height: isActive ? 28 : 20,
              borderRadius: '50%',
              background: isCompleted
                ? '#9B8EC4'
                : isActive
                  ? 'rgba(155,142,196,0.15)'
                  : 'rgba(155,142,196,0.08)',
              border: isActive
                ? '2px solid #9B8EC4'
                : isCompleted
                  ? '2px solid #9B8EC4'
                  : '1.5px solid rgba(155,142,196,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isActive ? 12 : 10,
              fontWeight: 700,
              color: isCompleted
                ? '#fff'
                : isActive
                  ? '#9B8EC4'
                  : 'rgba(155,142,196,0.35)',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
              flexShrink: 0,
            }}>
              {isCompleted ? '\u2713' : i + 1}
            </div>

            {/* Connecting line */}
            {i < LEVEL_LABELS.length - 1 && (
              <div style={{
                flex: 1,
                height: 2,
                background: isCompleted
                  ? '#9B8EC4'
                  : 'rgba(155,142,196,0.12)',
                borderRadius: 1,
                marginLeft: 4,
                marginRight: 2,
                transition: 'background 0.35s ease',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// --- Level Label Badge ---
function LevelBadge({ level }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '6px 14px',
      borderRadius: 20,
      background: 'rgba(155,142,196,0.08)',
      border: '1px solid rgba(155,142,196,0.15)',
      marginBottom: 20,
    }}>
      <span style={{
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
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {level + 1}
      </span>
      <span style={{
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: '#9B8EC4',
        fontWeight: 600,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {LEVEL_LABELS[level]}
      </span>
    </div>
  );
}

export default function EmotionalValidation({ onComplete, emotion }) {
  // step: 0=intro, 1=level1, 2=level2, 3=level3, 4=level4, 5=level4b, 6=level5, 7=level6, 8=completion
  const [step, setStep] = useState(0);

  // Level 1: user's feelings
  const [feelings, setFeelings] = useState('');

  // Level 2: confirmation
  const [confirmed, setConfirmed] = useState(false);

  // Level 3: unmet need
  const [selectedNeed, setSelectedNeed] = useState(null);
  const [customNeed, setCustomNeed] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Level 4: context understanding
  const [makesSense, setMakesSense] = useState(null); // true, false, or null
  const [tooBigInsight, setTooBigInsight] = useState('');

  // Derive the final need text
  const needText = showCustomInput && customNeed.trim()
    ? customNeed.trim()
    : selectedNeed
      ? selectedNeed.name.toLowerCase()
      : 'something important';

  // Build the final validation statement
  const validationStatement = `Your sadness makes complete sense. You're feeling ${feelings.trim() || 'deeply'} because ${needText} matters to you. That's not a flaw. That's being human.`;

  // Smooth step transition handler
  const goToStep = (nextStep) => {
    setStep(nextStep);
  };

  // --- INTRO ---
  if (step === 0) {
    return (
      <div style={styles.container}>
        <style>{animationStyles}</style>
        <div style={{
          ...styles.fadeIn,
          textAlign: 'center',
          padding: '48px 24px',
          maxWidth: 540,
          margin: '0 auto',
        }}>
          <div style={{
            fontSize: 48,
            marginBottom: 24,
            animation: 'gentlePulse 3s ease-in-out infinite',
          }}>
            {'\u{1F49C}'}
          </div>

          <h2 style={styles.heading}>
            Many people have never had their emotions truly validated.
          </h2>

          <p style={styles.subtext}>
            This exercise teaches you to validate yourself {'\u2014'} the way a skilled therapist would.
          </p>

          <div style={{
            padding: '16px 20px',
            background: 'rgba(155,142,196,0.06)',
            borderRadius: 14,
            border: '1px solid rgba(155,142,196,0.12)',
            marginBottom: 32,
            maxWidth: 400,
            margin: '0 auto 32px',
          }}>
            <p style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              margin: '0 0 6px',
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              letterSpacing: '0.03em',
            }}>
              Based on
            </p>
            <p style={{
              fontSize: 15,
              color: 'var(--text-secondary)',
              margin: 0,
              fontWeight: 500,
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              lineHeight: 1.5,
            }}>
              Marsha Linehan's 6 Levels of Validation {'\u2014'}{' '}
              <span style={{ color: '#9B8EC4' }}>Dialectical Behavior Therapy</span>
            </p>
          </div>

          <button
            onClick={() => goToStep(1)}
            style={styles.primaryBtn}
          >
            Begin the exercise {'\u2192'}
          </button>
        </div>
      </div>
    );
  }

  // --- LEVEL 1: PAY ATTENTION ---
  if (step === 1) {
    return (
      <div style={styles.container}>
        <style>{animationStyles}</style>
        <div style={{
          ...styles.fadeIn,
          padding: '36px 24px',
          maxWidth: 540,
          margin: '0 auto',
        }}>
          <LevelProgress currentLevel={0} />
          <LevelBadge level={0} />

          <h2 style={{ ...styles.heading, textAlign: 'left' }}>
            What exactly are you feeling right now?
          </h2>

          <p style={{
            fontSize: 15,
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            margin: '0 0 8px',
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
          }}>
            Be as specific as you can. There are no wrong answers.
          </p>

          <p style={{
            fontSize: 13,
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            margin: '0 0 20px',
            fontStyle: 'italic',
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
          }}>
            For example: "heavy and tired, like I can't see the point of anything" or "a dull ache, like something is missing"
          </p>

          <textarea
            value={feelings}
            onChange={(e) => setFeelings(e.target.value)}
            placeholder="Describe what you're feeling..."
            rows={4}
            style={{
              width: '100%',
              padding: '18px 20px',
              border: '1.5px solid rgba(155,142,196,0.2)',
              borderRadius: 16,
              background: 'rgba(155,142,196,0.04)',
              fontSize: 16,
              color: 'var(--text-primary)',
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              lineHeight: 1.6,
              resize: 'none',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#9B8EC4';
              e.target.style.boxShadow = '0 0 0 3px rgba(155,142,196,0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(155,142,196,0.2)';
              e.target.style.boxShadow = 'none';
            }}
          />

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 8,
            marginBottom: 20,
          }}>
            <span style={{
              fontSize: 12,
              color: feelings.trim().length > 0
                ? 'rgba(155,142,196,0.5)'
                : 'rgba(155,142,196,0.3)',
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
            }}>
              {feelings.trim().split(/\s+/).filter(Boolean).length} words
            </span>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => goToStep(2)}
              disabled={!feelings.trim()}
              style={{
                ...styles.primaryBtn,
                opacity: feelings.trim() ? 1 : 0.4,
                cursor: feelings.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              Next {'\u2192'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- LEVEL 2: REFLECT ---
  if (step === 2) {
    return (
      <div style={styles.container}>
        <style>{animationStyles}</style>
        <div style={{
          ...styles.fadeIn,
          padding: '36px 24px',
          maxWidth: 540,
          margin: '0 auto',
        }}>
          <LevelProgress currentLevel={1} />
          <LevelBadge level={1} />

          <h2 style={{ ...styles.heading, textAlign: 'left', marginBottom: 24 }}>
            Let me reflect that back to you.
          </h2>

          {/* Reflection card */}
          <div style={{
            padding: '28px 24px',
            background: 'var(--surface-elevated, #FFFFFF)',
            borderRadius: 20,
            boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
            border: '1px solid rgba(155,142,196,0.12)',
            marginBottom: 12,
            animation: 'reflectionAppear 0.6s cubic-bezier(0.16,1,0.3,1)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Decorative accent bar */}
            <div style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 4,
              background: 'linear-gradient(180deg, #9B8EC4 0%, rgba(155,142,196,0.3) 100%)',
              borderRadius: '20px 0 0 20px',
            }} />

            <div style={{
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#9B8EC4',
              fontWeight: 600,
              marginBottom: 16,
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              paddingLeft: 8,
            }}>
              What I hear you saying
            </div>

            <p style={{
              fontSize: 18,
              color: 'var(--text-primary)',
              lineHeight: 1.65,
              margin: '0 0 16px',
              fontFamily: "var(--font-heading), 'Fraunces', serif",
              fontWeight: 400,
              fontStyle: 'italic',
              paddingLeft: 8,
            }}>
              So you're feeling {feelings.trim().toLowerCase()}.
            </p>

            <p style={{
              fontSize: 16,
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              margin: 0,
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              paddingLeft: 8,
            }}>
              That's real, and it's happening right now.
            </p>
          </div>

          {/* Subtle note */}
          <p style={{
            fontSize: 13,
            color: 'var(--text-muted)',
            lineHeight: 1.5,
            margin: '0 0 28px',
            textAlign: 'center',
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
          }}>
            Validation Level 2: Accurately reflecting what you expressed, without judgment.
          </p>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => {
                setConfirmed(true);
                goToStep(3);
              }}
              style={{
                ...styles.primaryBtn,
                padding: '16px 40px',
              }}
            >
              Yes, that's right {'\u2192'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- LEVEL 3: READ BETWEEN THE LINES ---
  if (step === 3) {
    return (
      <div style={styles.container}>
        <style>{animationStyles}</style>
        <div style={{
          ...styles.fadeIn,
          padding: '36px 24px',
          maxWidth: 580,
          margin: '0 auto',
        }}>
          <LevelProgress currentLevel={2} />
          <LevelBadge level={2} />

          <h2 style={{ ...styles.heading, textAlign: 'left' }}>
            What unmet need might be underneath this feeling?
          </h2>

          <p style={{
            fontSize: 15,
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            margin: '0 0 24px',
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
          }}>
            Emotions are messengers. They often point to something we need but aren't getting. Which of these resonates most?
          </p>

          {/* Needs grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))',
            gap: 10,
            marginBottom: 16,
          }}>
            {NEEDS.map((need) => {
              const isSelected = selectedNeed?.name === need.name && !showCustomInput;
              return (
                <button
                  key={need.name}
                  onClick={() => {
                    setSelectedNeed(need);
                    setShowCustomInput(false);
                    setCustomNeed('');
                  }}
                  style={{
                    padding: '14px 12px',
                    borderRadius: 14,
                    border: isSelected
                      ? '2px solid #9B8EC4'
                      : '1.5px solid rgba(155,142,196,0.15)',
                    background: isSelected
                      ? 'rgba(155,142,196,0.1)'
                      : 'var(--surface-elevated, #FFFFFF)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                    boxShadow: isSelected
                      ? '0 2px 12px rgba(155,142,196,0.15)'
                      : '0 1px 4px rgba(0,0,0,0.03)',
                    transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                  }}
                >
                  <span style={{ fontSize: 22 }}>{need.emoji}</span>
                  <span style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: isSelected ? '#9B8EC4' : 'var(--text-primary)',
                    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                  }}>
                    {need.name}
                  </span>
                  <span style={{
                    fontSize: 11,
                    color: 'var(--text-muted)',
                    lineHeight: 1.35,
                    textAlign: 'center',
                    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                  }}>
                    {need.description}
                  </span>
                </button>
              );
            })}

            {/* Something else card */}
            <button
              onClick={() => {
                setShowCustomInput(true);
                setSelectedNeed(null);
              }}
              style={{
                padding: '14px 12px',
                borderRadius: 14,
                border: showCustomInput
                  ? '2px solid #9B8EC4'
                  : '1.5px solid rgba(155,142,196,0.15)',
                background: showCustomInput
                  ? 'rgba(155,142,196,0.1)'
                  : 'var(--surface-elevated, #FFFFFF)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                boxShadow: showCustomInput
                  ? '0 2px 12px rgba(155,142,196,0.15)'
                  : '0 1px 4px rgba(0,0,0,0.03)',
                transform: showCustomInput ? 'scale(1.03)' : 'scale(1)',
              }}
            >
              <span style={{ fontSize: 22 }}>{'\u2728'}</span>
              <span style={{
                fontSize: 14,
                fontWeight: 600,
                color: showCustomInput ? '#9B8EC4' : 'var(--text-primary)',
                fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              }}>
                Something else
              </span>
              <span style={{
                fontSize: 11,
                color: 'var(--text-muted)',
                lineHeight: 1.35,
                textAlign: 'center',
                fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              }}>
                A need not listed here
              </span>
            </button>
          </div>

          {/* Custom need input */}
          {showCustomInput && (
            <div style={{
              animation: 'slideUp 0.35s cubic-bezier(0.16,1,0.3,1)',
              marginBottom: 16,
            }}>
              <input
                type="text"
                value={customNeed}
                onChange={(e) => setCustomNeed(e.target.value)}
                placeholder="What do you need most right now?"
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  border: '1.5px solid rgba(155,142,196,0.25)',
                  borderRadius: 12,
                  background: 'rgba(155,142,196,0.04)',
                  fontSize: 15,
                  color: 'var(--text-primary)',
                  fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.25s ease',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#9B8EC4'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(155,142,196,0.25)'; }}
              />
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <button
              onClick={() => goToStep(4)}
              disabled={!selectedNeed && !(showCustomInput && customNeed.trim())}
              style={{
                ...styles.primaryBtn,
                opacity: (selectedNeed || (showCustomInput && customNeed.trim())) ? 1 : 0.4,
                cursor: (selectedNeed || (showCustomInput && customNeed.trim())) ? 'pointer' : 'not-allowed',
              }}
            >
              Next {'\u2192'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- LEVEL 4: UNDERSTAND IN CONTEXT ---
  if (step === 4) {
    return (
      <div style={styles.container}>
        <style>{animationStyles}</style>
        <div style={{
          ...styles.fadeIn,
          padding: '36px 24px',
          maxWidth: 540,
          margin: '0 auto',
        }}>
          <LevelProgress currentLevel={3} />
          <LevelBadge level={3} />

          <h2 style={{ ...styles.heading, textAlign: 'left' }}>
            Given what's happening in your life, does this emotion make sense?
          </h2>

          <p style={{
            fontSize: 15,
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            margin: '0 0 12px',
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
          }}>
            Think about your current circumstances, the pressures you're under, what you've been through recently.
          </p>

          {/* Context reminder */}
          <div style={{
            padding: '14px 18px',
            background: 'rgba(155,142,196,0.05)',
            borderRadius: 12,
            border: '1px solid rgba(155,142,196,0.1)',
            marginBottom: 28,
          }}>
            <p style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              margin: 0,
              lineHeight: 1.55,
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              fontStyle: 'italic',
            }}>
              You said you're feeling: "{feelings.trim()}" {'\u2014'} and needing {needText}.
            </p>
          </div>

          {/* Yes / No buttons */}
          <div style={{
            display: 'flex',
            gap: 14,
            marginBottom: 16,
          }}>
            <button
              onClick={() => {
                setMakesSense(true);
                goToStep(6);
              }}
              style={{
                flex: 1,
                padding: '18px 20px',
                borderRadius: 16,
                border: '1.5px solid rgba(155,142,196,0.2)',
                background: 'var(--surface-elevated, #FFFFFF)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
            >
              <span style={{ fontSize: 28 }}>{'\u2714\uFE0F'}</span>
              <span style={{
                fontSize: 16,
                fontWeight: 600,
                color: 'var(--text-primary)',
                fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              }}>
                Yes, it does
              </span>
              <span style={{
                fontSize: 12,
                color: 'var(--text-muted)',
                lineHeight: 1.4,
                textAlign: 'center',
                fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              }}>
                This feeling fits my situation
              </span>
            </button>

            <button
              onClick={() => {
                setMakesSense(false);
                goToStep(5);
              }}
              style={{
                flex: 1,
                padding: '18px 20px',
                borderRadius: 16,
                border: '1.5px solid rgba(155,142,196,0.2)',
                background: 'var(--surface-elevated, #FFFFFF)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
            >
              <span style={{ fontSize: 28 }}>{'\u{1F914}'}</span>
              <span style={{
                fontSize: 16,
                fontWeight: 600,
                color: 'var(--text-primary)',
                fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              }}>
                Not really
              </span>
              <span style={{
                fontSize: 12,
                color: 'var(--text-muted)',
                lineHeight: 1.4,
                textAlign: 'center',
                fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              }}>
                It feels too big for the situation
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- LEVEL 4B: "TOO BIG" FOLLOW-UP ---
  if (step === 5) {
    return (
      <div style={styles.container}>
        <style>{animationStyles}</style>
        <div style={{
          ...styles.fadeIn,
          padding: '36px 24px',
          maxWidth: 540,
          margin: '0 auto',
        }}>
          <LevelProgress currentLevel={3} />
          <LevelBadge level={3} />

          <div style={{
            padding: '20px 24px',
            background: 'var(--surface-elevated, #FFFFFF)',
            borderRadius: 16,
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            border: '1px solid rgba(155,142,196,0.12)',
            marginBottom: 24,
            animation: 'reflectionAppear 0.5s cubic-bezier(0.16,1,0.3,1)',
          }}>
            <p style={{
              fontSize: 16,
              color: 'var(--text-primary)',
              lineHeight: 1.65,
              margin: 0,
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
            }}>
              Even when emotions feel "too big," they're still giving you information. They might be echoing an older wound, or signaling something you haven't fully processed yet.
            </p>
          </div>

          <h2 style={{
            ...styles.heading,
            textAlign: 'left',
            fontSize: 'clamp(1.2rem, 3.5vw, 1.6rem)',
          }}>
            What might this emotion be telling you?
          </h2>

          <textarea
            value={tooBigInsight}
            onChange={(e) => setTooBigInsight(e.target.value)}
            placeholder="What older experience or deeper need might this connect to?"
            rows={3}
            style={{
              width: '100%',
              padding: '16px 20px',
              border: '1.5px solid rgba(155,142,196,0.2)',
              borderRadius: 14,
              background: 'rgba(155,142,196,0.04)',
              fontSize: 15,
              color: 'var(--text-primary)',
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              lineHeight: 1.6,
              resize: 'none',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#9B8EC4';
              e.target.style.boxShadow = '0 0 0 3px rgba(155,142,196,0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(155,142,196,0.2)';
              e.target.style.boxShadow = 'none';
            }}
          />

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button
              onClick={() => goToStep(6)}
              disabled={!tooBigInsight.trim()}
              style={{
                ...styles.primaryBtn,
                opacity: tooBigInsight.trim() ? 1 : 0.4,
                cursor: tooBigInsight.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              Next {'\u2192'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- LEVEL 5: NORMALIZE ---
  if (step === 6) {
    return (
      <div style={styles.container}>
        <style>{animationStyles}</style>
        <div style={{
          ...styles.fadeIn,
          padding: '36px 24px',
          maxWidth: 540,
          margin: '0 auto',
        }}>
          <LevelProgress currentLevel={4} />
          <LevelBadge level={4} />

          <h2 style={{ ...styles.heading, textAlign: 'left', marginBottom: 20 }}>
            Would most people feel this way in your situation?
          </h2>

          {/* Context validation card */}
          {makesSense && (
            <div style={{
              padding: '16px 20px',
              background: 'rgba(155,142,196,0.06)',
              borderRadius: 12,
              border: '1px solid rgba(155,142,196,0.1)',
              marginBottom: 20,
              animation: 'slideUp 0.4s ease',
            }}>
              <p style={{
                fontSize: 14,
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: 1.55,
                fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              }}>
                You recognized that your emotional response fits your circumstances. That's an important insight.
              </p>
            </div>
          )}

          {/* Normalization display */}
          <div style={{
            padding: '32px 28px',
            background: 'var(--surface-elevated, #FFFFFF)',
            borderRadius: 20,
            boxShadow: '0 6px 32px rgba(155,142,196,0.1)',
            border: '1px solid rgba(155,142,196,0.12)',
            marginBottom: 28,
            textAlign: 'center',
            animation: 'normalizeAppear 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s both',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Top accent */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 60,
              height: 3,
              background: '#9B8EC4',
              borderRadius: '0 0 3px 3px',
            }} />

            <div style={{
              fontSize: 36,
              marginBottom: 20,
            }}>
              {'\u{1F331}'}
            </div>

            <p style={{
              fontSize: 22,
              color: 'var(--text-primary)',
              lineHeight: 1.5,
              margin: '0 0 16px',
              fontFamily: "var(--font-heading), 'Fraunces', serif",
              fontWeight: 500,
            }}>
              Yes {'\u2014'} this is a normal human response.
            </p>

            <div style={{
              width: 40,
              height: 1,
              background: 'rgba(155,142,196,0.25)',
              margin: '0 auto 16px',
            }} />

            <p style={{
              fontSize: 17,
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              margin: 0,
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
            }}>
              You're not broken, weak, or too much.
            </p>
          </div>

          <p style={{
            fontSize: 13,
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            margin: '0 0 24px',
            textAlign: 'center',
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
          }}>
            Validation Level 5: Recognizing that your reaction is understandable and shared by others in similar situations.
          </p>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => goToStep(7)}
              style={styles.primaryBtn}
            >
              One final step {'\u2192'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- LEVEL 6: RADICAL GENUINENESS ---
  if (step === 7) {
    return (
      <div style={styles.container}>
        <style>{animationStyles}</style>
        <div style={{
          ...styles.fadeIn,
          padding: '36px 24px',
          maxWidth: 540,
          margin: '0 auto',
        }}>
          <LevelProgress currentLevel={5} />
          <LevelBadge level={5} />

          <h2 style={{
            ...styles.heading,
            textAlign: 'center',
            marginBottom: 8,
          }}>
            Your complete validation
          </h2>

          <p style={{
            fontSize: 14,
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            margin: '0 0 28px',
            textAlign: 'center',
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
          }}>
            Radical genuineness means treating you as an equal {'\u2014'} not as someone to be fixed, but as a whole person having a real experience.
          </p>

          {/* The validation statement card */}
          <div style={{
            padding: '36px 32px',
            background: 'linear-gradient(135deg, rgba(155,142,196,0.08) 0%, rgba(155,142,196,0.02) 100%)',
            borderRadius: 24,
            boxShadow: '0 8px 40px rgba(155,142,196,0.12), 0 1px 3px rgba(0,0,0,0.04)',
            border: '1.5px solid rgba(155,142,196,0.15)',
            marginBottom: 28,
            animation: 'validationReveal 1s cubic-bezier(0.16,1,0.3,1) 0.2s both',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Decorative corner accents */}
            <div style={{
              position: 'absolute',
              top: 12,
              left: 12,
              width: 24,
              height: 24,
              borderTop: '2px solid rgba(155,142,196,0.2)',
              borderLeft: '2px solid rgba(155,142,196,0.2)',
              borderRadius: '4px 0 0 0',
            }} />
            <div style={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              width: 24,
              height: 24,
              borderBottom: '2px solid rgba(155,142,196,0.2)',
              borderRight: '2px solid rgba(155,142,196,0.2)',
              borderRadius: '0 0 4px 0',
            }} />

            <p style={{
              fontSize: 20,
              color: 'var(--text-primary)',
              lineHeight: 1.7,
              margin: 0,
              fontFamily: "var(--font-heading), 'Fraunces', serif",
              fontWeight: 400,
              textAlign: 'center',
            }}>
              {validationStatement}
            </p>
          </div>

          <p style={{
            fontSize: 13,
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            margin: '0 0 28px',
            textAlign: 'center',
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
            fontStyle: 'italic',
          }}>
            This is what unconditional validation sounds like. You deserve to hear it {'\u2014'} especially from yourself.
          </p>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => goToStep(8)}
              style={styles.primaryBtn}
            >
              See the full picture {'\u2192'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- STEP 8: COMPLETION ---
  return (
    <div style={styles.container}>
      <style>{animationStyles}</style>
      <div style={{
        ...styles.fadeIn,
        padding: '36px 24px',
        maxWidth: 560,
        margin: '0 auto',
      }}>
        {/* All six levels completed */}
        <LevelProgress currentLevel={6} />

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            fontSize: 44,
            marginBottom: 16,
            animation: 'gentlePulse 3s ease-in-out infinite',
          }}>
            {'\u{1F49C}'}
          </div>

          <h2 style={{
            ...styles.heading,
            textAlign: 'center',
            marginBottom: 8,
          }}>
            Your Self-Validation
          </h2>

          <p style={{
            fontSize: 14,
            color: 'var(--text-muted)',
            lineHeight: 1.5,
            margin: '0 0 4px',
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
          }}>
            All 6 levels of validation, completed.
          </p>
        </div>

        {/* Final validation card - screenshot-worthy */}
        <div style={{
          padding: '40px 32px 36px',
          background: '#FAF6F0',
          borderRadius: 24,
          boxShadow: '0 12px 48px rgba(155,142,196,0.15), 0 2px 6px rgba(0,0,0,0.04)',
          border: '1.5px solid rgba(155,142,196,0.18)',
          marginBottom: 24,
          animation: 'validationReveal 0.8s cubic-bezier(0.16,1,0.3,1)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Top decorative gradient */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, rgba(155,142,196,0.15) 0%, #9B8EC4 50%, rgba(155,142,196,0.15) 100%)',
          }} />

          {/* Corner accents */}
          <div style={{
            position: 'absolute',
            top: 16,
            left: 16,
            width: 28,
            height: 28,
            borderTop: '2px solid rgba(155,142,196,0.2)',
            borderLeft: '2px solid rgba(155,142,196,0.2)',
            borderRadius: '6px 0 0 0',
          }} />
          <div style={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 28,
            height: 28,
            borderTop: '2px solid rgba(155,142,196,0.2)',
            borderRight: '2px solid rgba(155,142,196,0.2)',
            borderRadius: '0 6px 0 0',
          }} />
          <div style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            width: 28,
            height: 28,
            borderBottom: '2px solid rgba(155,142,196,0.2)',
            borderLeft: '2px solid rgba(155,142,196,0.2)',
            borderRadius: '0 0 0 6px',
          }} />
          <div style={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            width: 28,
            height: 28,
            borderBottom: '2px solid rgba(155,142,196,0.2)',
            borderRight: '2px solid rgba(155,142,196,0.2)',
            borderRadius: '0 0 6px 0',
          }} />

          {/* DBT badge at top */}
          <div style={{
            textAlign: 'center',
            marginBottom: 24,
          }}>
            <span style={{
              display: 'inline-block',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: '#9B8EC4',
              fontWeight: 600,
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              padding: '4px 12px',
              borderRadius: 12,
              background: 'rgba(155,142,196,0.08)',
              border: '1px solid rgba(155,142,196,0.12)',
            }}>
              Self-Validation
            </span>
          </div>

          {/* The statement */}
          <p style={{
            fontSize: 21,
            color: '#2D2A24',
            lineHeight: 1.75,
            margin: '0 0 24px',
            fontFamily: "var(--font-heading), 'Fraunces', serif",
            fontWeight: 400,
            textAlign: 'center',
          }}>
            {validationStatement}
          </p>

          {/* Divider */}
          <div style={{
            width: 48,
            height: 1,
            background: 'rgba(155,142,196,0.3)',
            margin: '0 auto 20px',
          }} />

          {/* Journey summary */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 8,
          }}>
            {LEVEL_LABELS.map((label, i) => (
              <span key={label} style={{
                fontSize: 10,
                color: 'rgba(155,142,196,0.6)',
                fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}>
                <span style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: '#9B8EC4',
                  color: '#fff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 8,
                  fontWeight: 700,
                }}>
                  {'\u2713'}
                </span>
                {label}
                {i < LEVEL_LABELS.length - 1 && (
                  <span style={{
                    color: 'rgba(155,142,196,0.25)',
                    marginLeft: 4,
                  }}>
                    {'\u00B7'}
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Takeaway */}
        <div style={{
          padding: '18px 22px',
          background: 'rgba(155,142,196,0.05)',
          borderRadius: 14,
          border: '1px solid rgba(155,142,196,0.1)',
          marginBottom: 28,
          animation: 'slideUp 0.5s ease 0.3s both',
        }}>
          <p style={{
            fontSize: 14,
            color: 'var(--text-secondary)',
            lineHeight: 1.65,
            margin: 0,
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
            textAlign: 'center',
          }}>
            You just walked through all six levels of validation that therapists train years to master. You can return to this practice whenever you need to hear what's true: your feelings are valid, and they make sense.
          </p>
        </div>

        {/* Continue button */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={onComplete}
            style={styles.primaryBtn}
          >
            Continue {'\u2192'}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- ANIMATION STYLES ---
const animationStyles = `
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(14px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes reflectionAppear {
    from { opacity: 0; transform: translateY(12px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes normalizeAppear {
    from { opacity: 0; transform: scale(0.92) translateY(16px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes validationReveal {
    from { opacity: 0; transform: scale(0.94) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes gentlePulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.08); }
  }
  @keyframes defusionFade {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
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
  fadeIn: {
    animation: 'slideUp 0.5s cubic-bezier(0.16,1,0.3,1)',
  },
  heading: {
    fontFamily: "var(--font-heading), 'Fraunces', serif",
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
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
  },
  stepLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: '#9B8EC4',
    fontWeight: 600,
    marginBottom: 12,
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
  },
  primaryBtn: {
    padding: '16px 36px',
    borderRadius: 50,
    background: '#9B8EC4',
    color: '#fff',
    border: 'none',
    fontSize: 16,
    fontWeight: 600,
    fontFamily: "var(--font-heading), 'Fraunces', serif",
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
    boxShadow: '0 4px 16px rgba(155,142,196,0.3)',
  },
};
