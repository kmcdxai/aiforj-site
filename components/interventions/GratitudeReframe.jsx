"use client";

import { useState } from 'react';

export default function GratitudeReframe({ onComplete, emotion }) {
  const [step, setStep] = useState(0); // 0=intro, 1=oneThing, 2=reflection, 3=keepsake, 4=closing
  const [oneThing, setOneThing] = useState('');
  const [reflection, setReflection] = useState('');
  const [cardRevealed, setCardRevealed] = useState(false);

  const transitionTo = (nextStep) => {
    setStep(nextStep);
    if (nextStep === 3) {
      setTimeout(() => setCardRevealed(true), 100);
    }
  };

  // --- INTRO ---
  if (step === 0) {
    return (
      <div style={styles.container}>
        <div style={{
          ...styles.fadeIn,
          textAlign: 'center',
          padding: '48px 24px',
          maxWidth: 520,
          margin: '0 auto',
        }}>
          <div style={{
            fontSize: 44,
            marginBottom: 28,
            animation: 'grFloat 3s ease-in-out infinite',
          }}>
            {'\u{1F331}'}
          </div>

          <h2 style={{
            ...styles.heading,
            textAlign: 'center',
            marginBottom: 20,
          }}>
            A different kind of gratitude exercise
          </h2>

          <p style={{
            fontSize: 17,
            color: 'var(--text-primary)',
            lineHeight: 1.8,
            margin: '0 0 12px',
            fontWeight: 500,
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
          }}>
            We're <strong>not</strong> going to ask you to list 3 things you're grateful for.
          </p>

          <p style={{
            fontSize: 16,
            color: 'var(--text-secondary)',
            lineHeight: 1.8,
            margin: '0 0 24px',
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
          }}>
            When you're sad, that can feel dismissive.
          </p>

          <div style={{
            width: 48,
            height: 1,
            background: 'rgba(155,142,196,0.25)',
            margin: '0 auto 24px',
          }} />

          <p style={{
            fontSize: 16,
            color: 'var(--text-secondary)',
            lineHeight: 1.8,
            margin: '0 0 36px',
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
            fontStyle: 'italic',
          }}>
            Instead, we're going to try something gentler.
          </p>

          <button
            onClick={() => transitionTo(1)}
            style={styles.primaryBtn}
          >
            I'm ready {'\u2192'}
          </button>
        </div>

        <style>{grKeyframes}</style>
      </div>
    );
  }

  // --- STEP 1: ONE THING ---
  if (step === 1) {
    return (
      <div style={styles.container}>
        <div style={{
          ...styles.fadeIn,
          padding: '40px 24px',
          maxWidth: 500,
          margin: '0 auto',
        }}>
          <div style={styles.stepLabel}>Step 1 of 2</div>

          <h2 style={{
            ...styles.heading,
            textAlign: 'left',
            marginBottom: 12,
          }}>
            Name one thing {'\u2014'} however small {'\u2014'} that still works in your life right now.
          </h2>

          <p style={{
            fontSize: 14,
            color: 'var(--text-muted)',
            lineHeight: 1.7,
            margin: '0 0 24px',
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
          }}>
            It doesn't have to be big. It doesn't have to "make up for" the sadness. Just one small true thing.
          </p>

          <input
            type="text"
            value={oneThing}
            onChange={e => setOneThing(e.target.value)}
            placeholder={'e.g., "My dog is here" or "The coffee was warm"'}
            style={{
              width: '100%',
              padding: '18px 22px',
              border: '1.5px solid rgba(155,142,196,0.2)',
              borderRadius: 16,
              background: 'rgba(155,142,196,0.03)',
              fontSize: 16,
              color: 'var(--text-primary)',
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              lineHeight: 1.6,
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
            }}
            onFocus={e => {
              e.target.style.borderColor = '#9B8EC4';
              e.target.style.boxShadow = '0 0 0 4px rgba(155,142,196,0.1)';
            }}
            onBlur={e => {
              e.target.style.borderColor = 'rgba(155,142,196,0.2)';
              e.target.style.boxShadow = 'none';
            }}
          />

          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <button
              onClick={() => transitionTo(2)}
              disabled={!oneThing.trim()}
              style={{
                ...styles.primaryBtn,
                opacity: oneThing.trim() ? 1 : 0.4,
                cursor: oneThing.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              Next {'\u2192'}
            </button>
          </div>
        </div>

        <style>{grKeyframes}</style>
      </div>
    );
  }

  // --- STEP 2: REFLECTION ---
  if (step === 2) {
    return (
      <div style={styles.container}>
        <div style={{
          ...styles.fadeIn,
          padding: '40px 24px',
          maxWidth: 500,
          margin: '0 auto',
        }}>
          <div style={styles.stepLabel}>Step 2 of 2</div>

          {/* Echo back their answer gently */}
          <div style={{
            padding: '16px 20px',
            background: 'rgba(155,142,196,0.06)',
            borderRadius: 14,
            borderLeft: '3px solid #9B8EC4',
            marginBottom: 24,
            animation: 'grSlideIn 0.4s ease',
          }}>
            <p style={{
              fontSize: 14,
              color: 'var(--text-muted)',
              margin: '0 0 4px',
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
            }}>
              You noticed:
            </p>
            <p style={{
              fontSize: 16,
              color: 'var(--text-primary)',
              fontWeight: 500,
              margin: 0,
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              fontStyle: 'italic',
            }}>
              "{oneThing}"
            </p>
          </div>

          <h2 style={{
            ...styles.heading,
            textAlign: 'left',
            marginBottom: 12,
          }}>
            What does it say about you that you noticed this, even while in pain?
          </h2>

          <p style={{
            fontSize: 14,
            color: 'var(--text-muted)',
            lineHeight: 1.7,
            margin: '0 0 24px',
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
          }}>
            There's no wrong answer. Just let yourself reflect.
          </p>

          <input
            type="text"
            value={reflection}
            onChange={e => setReflection(e.target.value)}
            placeholder={'e.g., "I still pay attention to small things" or "I care about comfort"'}
            style={{
              width: '100%',
              padding: '18px 22px',
              border: '1.5px solid rgba(155,142,196,0.2)',
              borderRadius: 16,
              background: 'rgba(155,142,196,0.03)',
              fontSize: 16,
              color: 'var(--text-primary)',
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              lineHeight: 1.6,
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
            }}
            onFocus={e => {
              e.target.style.borderColor = '#9B8EC4';
              e.target.style.boxShadow = '0 0 0 4px rgba(155,142,196,0.1)';
            }}
            onBlur={e => {
              e.target.style.borderColor = 'rgba(155,142,196,0.2)';
              e.target.style.boxShadow = 'none';
            }}
          />

          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <button
              onClick={() => transitionTo(3)}
              disabled={!reflection.trim()}
              style={{
                ...styles.primaryBtn,
                opacity: reflection.trim() ? 1 : 0.4,
                cursor: reflection.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              See my reflection {'\u2192'}
            </button>
          </div>
        </div>

        <style>{grKeyframes}</style>
      </div>
    );
  }

  // --- STEP 3: KEEPSAKE CARD ---
  if (step === 3) {
    return (
      <div style={styles.container}>
        <div style={{
          padding: '40px 24px',
          maxWidth: 500,
          margin: '0 auto',
        }}>
          {/* Keepsake card */}
          <div style={{
            position: 'relative',
            background: '#FAF6F0',
            borderRadius: 24,
            border: '2px solid rgba(155,142,196,0.35)',
            padding: '44px 32px 40px',
            textAlign: 'center',
            boxShadow: '0 8px 40px rgba(155,142,196,0.12), 0 2px 8px rgba(0,0,0,0.04)',
            opacity: cardRevealed ? 1 : 0,
            transform: cardRevealed ? 'scale(1) translateY(0)' : 'scale(0.93) translateY(16px)',
            transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
          }}>
            {/* Decorative corner accents */}
            <div style={{
              position: 'absolute',
              top: 12,
              left: 12,
              width: 24,
              height: 24,
              borderTop: '2px solid rgba(155,142,196,0.3)',
              borderLeft: '2px solid rgba(155,142,196,0.3)',
              borderRadius: '4px 0 0 0',
            }} />
            <div style={{
              position: 'absolute',
              top: 12,
              right: 12,
              width: 24,
              height: 24,
              borderTop: '2px solid rgba(155,142,196,0.3)',
              borderRight: '2px solid rgba(155,142,196,0.3)',
              borderRadius: '0 4px 0 0',
            }} />
            <div style={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              width: 24,
              height: 24,
              borderBottom: '2px solid rgba(155,142,196,0.3)',
              borderLeft: '2px solid rgba(155,142,196,0.3)',
              borderRadius: '0 0 0 4px',
            }} />
            <div style={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              width: 24,
              height: 24,
              borderBottom: '2px solid rgba(155,142,196,0.3)',
              borderRight: '2px solid rgba(155,142,196,0.3)',
              borderRadius: '0 0 4px 0',
            }} />

            {/* Small label at top */}
            <div style={{
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.35em',
              color: '#9B8EC4',
              marginBottom: 28,
              fontFamily: "'JetBrains Mono', monospace",
              opacity: 0.8,
            }}>
              A moment of resilience
            </div>

            {/* Opening quotation mark */}
            <div style={{
              fontFamily: "var(--font-heading), 'Fraunces', serif",
              fontSize: 56,
              color: 'rgba(155,142,196,0.25)',
              lineHeight: 0.6,
              marginBottom: 8,
              userSelect: 'none',
            }}>
              {'\u201C'}
            </div>

            {/* Their thing - prominent */}
            <p style={{
              fontFamily: "var(--font-heading), 'Fraunces', serif",
              fontSize: 'clamp(1.3rem, 4vw, 1.7rem)',
              fontWeight: 500,
              color: '#2A2A2A',
              lineHeight: 1.4,
              margin: '0 0 6px',
              padding: '0 8px',
            }}>
              {oneThing}
            </p>

            {/* Closing quotation mark */}
            <div style={{
              fontFamily: "var(--font-heading), 'Fraunces', serif",
              fontSize: 56,
              color: 'rgba(155,142,196,0.25)',
              lineHeight: 0.6,
              marginBottom: 24,
              userSelect: 'none',
            }}>
              {'\u201D'}
            </div>

            {/* Divider */}
            <div style={{
              width: 40,
              height: 1.5,
              background: 'linear-gradient(90deg, transparent, #9B8EC4, transparent)',
              margin: '0 auto 24px',
            }} />

            {/* Their reflection */}
            <p style={{
              fontSize: 14,
              color: 'rgba(42,42,42,0.5)',
              margin: '0 0 8px',
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              letterSpacing: '0.02em',
            }}>
              I noticed this because:
            </p>
            <p style={{
              fontSize: 16,
              color: '#2A2A2A',
              fontWeight: 500,
              fontStyle: 'italic',
              margin: 0,
              lineHeight: 1.6,
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              padding: '0 12px',
            }}>
              {reflection}
            </p>
          </div>

          {/* Closing message */}
          <div style={{
            textAlign: 'center',
            marginTop: 32,
            opacity: cardRevealed ? 1 : 0,
            transform: cardRevealed ? 'translateY(0)' : 'translateY(12px)',
            transition: 'all 0.6s ease 0.4s',
          }}>
            <p style={{
              fontSize: 16,
              color: 'var(--text-primary)',
              lineHeight: 1.8,
              margin: '0 0 8px',
              fontWeight: 500,
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
            }}>
              Noticing good while feeling bad isn't toxic positivity {'\u2014'}
            </p>
            <p style={{
              fontFamily: "var(--font-heading), 'Fraunces', serif",
              fontSize: 'clamp(1.1rem, 3vw, 1.35rem)',
              fontWeight: 500,
              color: '#9B8EC4',
              lineHeight: 1.5,
              margin: '0 0 36px',
            }}>
              it's resilience. You held two truths at once.
            </p>

            <button
              onClick={onComplete}
              style={styles.primaryBtn}
            >
              Continue {'\u2192'}
            </button>
          </div>
        </div>

        <style>{grKeyframes}</style>
      </div>
    );
  }

  return null;
}

// --- KEYFRAME ANIMATIONS ---
const grKeyframes = `
  @keyframes grFadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes grSlideIn {
    from { opacity: 0; transform: translateX(-8px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes grFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
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
    animation: 'grFadeIn 0.5s ease',
  },
  heading: {
    fontFamily: "var(--font-heading), 'Fraunces', serif",
    fontSize: 'clamp(1.4rem, 4vw, 1.9rem)',
    fontWeight: 500,
    color: 'var(--text-primary)',
    lineHeight: 1.3,
    margin: '0 0 16px',
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
    fontFamily: "var(--font-heading), 'Fraunces', serif",
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
    boxShadow: '0 4px 16px rgba(155,142,196,0.3)',
  },
};
