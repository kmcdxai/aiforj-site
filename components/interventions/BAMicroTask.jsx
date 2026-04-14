"use client";

import { useState, useEffect, useCallback } from 'react';

// --- Task lists by energy level ---
const TASKS_VERY_LOW = [
  "Stand up and stretch for 10 seconds",
  "Splash water on your face",
  "Open a window and take 3 breaths of outside air",
  "Change your body position \u2014 if lying down, sit up",
  "Hold something cold or warm for 30 seconds",
];

const TASKS_LOW = [
  "Text one person a \u2764\uFE0F emoji",
  "Walk to the nearest window and look outside for 1 minute",
  "Put on one song you used to love",
  "Step outside for 60 seconds \u2014 just stand there",
  "Write one sentence about how you feel",
];

const TASKS_SOME_ENERGY = [
  "Take a 5-minute walk \u2014 set a timer",
  "Do 10 jumping jacks",
  "Make yourself a drink (tea, coffee, water with lemon)",
  "Tidy one small surface (desk, nightstand)",
  "Call or voice-memo someone you care about",
];

const ENERGY_LEVELS = [
  {
    key: 'very-low',
    emoji: '\u{1F6CB}\uFE0F',
    label: 'Very low',
    sublabel: 'I can barely move',
    tasks: TASKS_VERY_LOW,
  },
  {
    key: 'low',
    emoji: '\u{1F6B6}',
    label: 'Low',
    sublabel: 'I could do something small',
    tasks: TASKS_LOW,
  },
  {
    key: 'some',
    emoji: '\u{1F3C3}',
    label: 'Some energy',
    sublabel: 'I just need direction',
    tasks: TASKS_SOME_ENERGY,
  },
];

// --- Accent colors ---
const AMBER = '#D4A843';
const AMBER_LIGHT = 'rgba(212, 168, 67, 0.10)';
const AMBER_BORDER = 'rgba(212, 168, 67, 0.25)';
const AMBER_GLOW = 'rgba(212, 168, 67, 0.30)';
const LAVENDER = '#9B8EC4';
const LAVENDER_LIGHT = 'rgba(155, 142, 196, 0.10)';
const LAVENDER_BORDER = 'rgba(155, 142, 196, 0.25)';

// --- Helper: pick a random item from an array ---
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// --- Progress indicator ---
function StepIndicator({ currentStep, totalSteps }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: 8,
      marginBottom: 32,
    }}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          style={{
            width: i === currentStep ? 28 : 10,
            height: 10,
            borderRadius: 5,
            background: i <= currentStep ? AMBER : 'rgba(212, 168, 67, 0.18)',
            transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
            boxShadow: i === currentStep ? `0 0 8px ${AMBER_GLOW}` : 'none',
          }}
        />
      ))}
    </div>
  );
}

// --- Main component ---
export default function BAMicroTask({ onComplete, emotion }) {
  // Steps: intro -> energy -> task -> response -> complete
  const [step, setStep] = useState('intro');
  const [selectedEnergy, setSelectedEnergy] = useState(null);
  const [assignedTask, setAssignedTask] = useState('');
  const [showDidIt, setShowDidIt] = useState(false);
  const [didItResponse, setDidItResponse] = useState(null); // 'yes' | 'not-yet'
  const [fadeState, setFadeState] = useState('in'); // 'in' | 'out'
  const [hoveredCard, setHoveredCard] = useState(null);

  // Transition helper
  const transitionTo = useCallback((nextStep) => {
    setFadeState('out');
    setTimeout(() => {
      setStep(nextStep);
      setFadeState('in');
    }, 350);
  }, []);

  // Handle energy selection
  const handleEnergySelect = useCallback((level) => {
    setSelectedEnergy(level);
    const task = pickRandom(level.tasks);
    setAssignedTask(task);
    setShowDidIt(false);
    setDidItResponse(null);
    transitionTo('task');
  }, [transitionTo]);

  // 30-second timer for "Did you do it?" button
  useEffect(() => {
    if (step === 'task' && !showDidIt) {
      const timer = setTimeout(() => {
        setShowDidIt(true);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [step, showDidIt]);

  // Handle response
  const handleResponse = useCallback((response) => {
    setDidItResponse(response);
    setFadeState('out');
    setTimeout(() => {
      setStep('response');
      setFadeState('in');
    }, 300);
  }, []);

  // Step index for progress dots
  const stepIndex =
    step === 'intro' ? 0 :
    step === 'energy' ? 1 :
    step === 'task' ? 2 :
    step === 'response' || step === 'complete' ? 3 : 0;

  // Container fade style
  const containerFade = {
    opacity: fadeState === 'in' ? 1 : 0,
    transform: fadeState === 'in' ? 'translateY(0)' : 'translateY(12px)',
    transition: 'opacity 0.4s ease, transform 0.4s ease',
  };

  // ==================== INTRO ====================
  if (step === 'intro') {
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
          {/* Behavioral activation icon */}
          <div style={{
            fontSize: 56,
            marginBottom: 24,
            animation: 'gentlePulse 3s ease-in-out infinite',
          }}>
            {'\u{1F31F}'}
          </div>

          {/* Modality badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 16px',
            borderRadius: 20,
            background: AMBER_LIGHT,
            border: `1px solid ${AMBER_BORDER}`,
            fontSize: 12,
            fontWeight: 600,
            color: AMBER,
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            marginBottom: 24,
          }}>
            Behavioral Activation
          </div>

          <h2 style={{
            ...styles.heading,
            marginBottom: 20,
          }}>
            When you're low, your brain says "don't move."
          </h2>

          <p style={{
            ...styles.bodyText,
            fontSize: 17,
            lineHeight: 1.8,
            marginBottom: 12,
            maxWidth: 460,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            But activity — not reflection — is the #1 evidence-based intervention for low mood.
          </p>

          <p style={{
            ...styles.bodyText,
            fontSize: 15,
            color: LAVENDER,
            fontStyle: 'italic',
            marginBottom: 40,
            lineHeight: 1.7,
          }}>
            We're not asking for a lot. Just one tiny thing.
          </p>

          {/* Decorative divider */}
          <div style={{
            width: 48,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${AMBER}, transparent)`,
            margin: '0 auto 40px',
            borderRadius: 1,
          }} />

          <button
            onClick={() => transitionTo('energy')}
            style={styles.primaryBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = `0 8px 28px ${AMBER_GLOW}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = `0 4px 16px ${AMBER_GLOW}`;
            }}
          >
            Let's find your one thing {'\u2192'}
          </button>
        </div>
      </div>
    );
  }

  // ==================== ENERGY LEVEL SELECTION ====================
  if (step === 'energy') {
    return (
      <div style={styles.container}>
        <style>{animationStyles}</style>
        <div style={{
          ...containerFade,
          padding: '40px 24px',
          maxWidth: 540,
          margin: '0 auto',
        }}>
          <StepIndicator currentStep={1} totalSteps={4} />

          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{
              ...styles.heading,
              marginBottom: 12,
            }}>
              How much energy do you have right now?
            </h2>
            <p style={{
              ...styles.bodyText,
              fontSize: 15,
              color: 'var(--text-secondary, #8A8578)',
              maxWidth: 380,
              margin: '0 auto',
            }}>
              Be honest. There's no wrong answer — we'll match your task to your capacity.
            </p>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            marginBottom: 16,
          }}>
            {ENERGY_LEVELS.map((level, i) => {
              const isHovered = hoveredCard === level.key;

              return (
                <button
                  key={level.key}
                  onClick={() => handleEnergySelect(level)}
                  onMouseEnter={() => setHoveredCard(level.key)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 20,
                    padding: '24px 28px',
                    borderRadius: 20,
                    background: isHovered
                      ? AMBER_LIGHT
                      : 'var(--surface-elevated, #FFFFFF)',
                    border: `2px solid ${isHovered ? AMBER : 'var(--border, #E8E2D8)'}`,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                    animation: `cardSlideIn 0.45s ease ${0.1 * i}s both`,
                    boxShadow: isHovered
                      ? `0 8px 32px ${AMBER_GLOW}`
                      : '0 2px 8px rgba(0,0,0,0.04)',
                    transform: isHovered ? 'translateY(-2px) scale(1.01)' : 'scale(1)',
                  }}
                >
                  {/* Emoji circle */}
                  <div style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    background: isHovered
                      ? 'rgba(212, 168, 67, 0.08)'
                      : 'rgba(212, 168, 67, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 32,
                    flexShrink: 0,
                    transition: 'all 0.3s ease',
                  }}>
                    {level.emoji}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 18,
                      fontWeight: 600,
                      color: isHovered ? AMBER : 'var(--text-primary, #2C2A25)',
                      fontFamily: "var(--font-heading), 'Fraunces', serif",
                      marginBottom: 4,
                      transition: 'color 0.3s ease',
                    }}>
                      {level.label}
                    </div>
                    <div style={{
                      fontSize: 14,
                      color: 'var(--text-secondary, #8A8578)',
                      lineHeight: 1.5,
                      fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                    }}>
                      {level.sublabel}
                    </div>
                  </div>

                  {/* Arrow indicator */}
                  <div style={{
                    fontSize: 18,
                    color: isHovered ? AMBER : 'var(--border, #E8E2D8)',
                    transition: 'all 0.3s ease',
                    transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                    flexShrink: 0,
                  }}>
                    {'\u2192'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ==================== TASK DISPLAY ====================
  if (step === 'task') {
    return (
      <div style={styles.container}>
        <style>{animationStyles}</style>
        <div style={{
          ...containerFade,
          padding: '40px 24px',
          maxWidth: 540,
          margin: '0 auto',
        }}>
          <StepIndicator currentStep={2} totalSteps={4} />

          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <p style={{
              fontSize: 14,
              fontWeight: 500,
              color: LAVENDER,
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              letterSpacing: '0.3px',
              textTransform: 'uppercase',
              marginBottom: 8,
              animation: 'fadeIn 0.5s ease 0.1s both',
            }}>
              Your one thing right now
            </p>
          </div>

          {/* Task card */}
          <div style={{
            background: 'var(--surface-elevated, #FFFFFF)',
            borderRadius: 28,
            padding: '48px 36px',
            textAlign: 'center',
            border: `2px solid ${AMBER_BORDER}`,
            boxShadow: `0 12px 48px rgba(212, 168, 67, 0.12), 0 2px 8px rgba(0,0,0,0.04)`,
            animation: 'perspectiveReveal 0.6s ease 0.15s both',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Decorative top accent */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: `linear-gradient(90deg, ${LAVENDER}, ${AMBER}, ${LAVENDER})`,
              borderRadius: '28px 28px 0 0',
            }} />

            {/* Energy level indicator */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 12,
              background: AMBER_LIGHT,
              fontSize: 13,
              color: AMBER,
              fontWeight: 500,
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              marginBottom: 28,
            }}>
              {selectedEnergy?.emoji} {selectedEnergy?.label} energy
            </div>

            {/* The task itself */}
            <h2 style={{
              fontFamily: "var(--font-heading), 'Fraunces', serif",
              fontSize: 'clamp(1.5rem, 5vw, 2rem)',
              fontWeight: 500,
              color: 'var(--text-primary, #2C2A25)',
              lineHeight: 1.4,
              margin: '0 0 16px',
              letterSpacing: '-0.01em',
            }}>
              {assignedTask}
            </h2>

            {/* Gentle encouragement */}
            <p style={{
              fontSize: 14,
              color: 'var(--text-secondary, #8A8578)',
              lineHeight: 1.6,
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              margin: 0,
              fontStyle: 'italic',
            }}>
              That's it. Just this one thing.
            </p>
          </div>

          {/* Timer / "Did you do it?" area */}
          <div style={{
            marginTop: 36,
            textAlign: 'center',
            minHeight: 80,
          }}>
            {!showDidIt ? (
              <div style={{
                animation: 'fadeIn 0.5s ease',
              }}>
                {/* Waiting indicator */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  marginBottom: 12,
                }}>
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: LAVENDER,
                    animation: 'gentlePulse 2s ease-in-out infinite',
                  }} />
                  <p style={{
                    fontSize: 14,
                    color: LAVENDER,
                    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                    margin: 0,
                  }}>
                    Take your time. No rush.
                  </p>
                </div>

                {/* Skip ahead link */}
                <button
                  onClick={() => setShowDidIt(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: 13,
                    color: 'var(--text-muted, #B0A898)',
                    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    textDecorationColor: 'rgba(176,168,152,0.3)',
                    textUnderlineOffset: 3,
                    padding: '4px 8px',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-secondary, #8A8578)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted, #B0A898)'; }}
                >
                  I'm ready to check in
                </button>
              </div>
            ) : (
              <div style={{
                animation: 'fadeIn 0.5s ease',
              }}>
                <p style={{
                  fontSize: 16,
                  fontWeight: 500,
                  color: 'var(--text-primary, #2C2A25)',
                  fontFamily: "var(--font-heading), 'Fraunces', serif",
                  marginBottom: 20,
                }}>
                  Did you do it?
                </p>

                <div style={{
                  display: 'flex',
                  gap: 14,
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}>
                  {/* Yes button */}
                  <button
                    onClick={() => handleResponse('yes')}
                    style={{
                      padding: '14px 32px',
                      borderRadius: 50,
                      background: AMBER,
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: 16,
                      fontWeight: 600,
                      fontFamily: "var(--font-heading), 'Fraunces', serif",
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                      boxShadow: `0 4px 16px ${AMBER_GLOW}`,
                      animation: 'cardSlideIn 0.4s ease 0s both',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px) scale(1.04)';
                      e.currentTarget.style.boxShadow = `0 8px 28px ${AMBER_GLOW}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = `0 4px 16px ${AMBER_GLOW}`;
                    }}
                  >
                    {'\u2713'} Yes, I did
                  </button>

                  {/* Not yet button */}
                  <button
                    onClick={() => handleResponse('not-yet')}
                    style={{
                      padding: '14px 32px',
                      borderRadius: 50,
                      background: 'transparent',
                      color: LAVENDER,
                      border: `2px solid ${LAVENDER_BORDER}`,
                      fontSize: 16,
                      fontWeight: 600,
                      fontFamily: "var(--font-heading), 'Fraunces', serif",
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                      animation: 'cardSlideIn 0.4s ease 0.08s both',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = LAVENDER_LIGHT;
                      e.currentTarget.style.borderColor = LAVENDER;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = LAVENDER_BORDER;
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Not yet
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==================== RESPONSE / COMPLETION ====================
  if (step === 'response') {
    const isYes = didItResponse === 'yes';

    return (
      <div style={styles.container}>
        <style>{animationStyles}</style>
        <div style={{
          ...containerFade,
          padding: '48px 24px',
          maxWidth: 540,
          margin: '0 auto',
          textAlign: 'center',
        }}>
          <StepIndicator currentStep={3} totalSteps={4} />

          {/* Response icon */}
          <div style={{
            fontSize: 64,
            marginBottom: 28,
            animation: 'perspectiveReveal 0.6s ease',
          }}>
            {isYes ? '\u{1F31F}' : '\u{1F49C}'}
          </div>

          {/* Response message card */}
          <div style={{
            background: isYes ? AMBER_LIGHT : LAVENDER_LIGHT,
            borderRadius: 24,
            padding: '36px 32px',
            border: `1.5px solid ${isYes ? AMBER_BORDER : LAVENDER_BORDER}`,
            marginBottom: 16,
            animation: 'cardSlideIn 0.5s ease 0.15s both',
          }}>
            <h2 style={{
              fontFamily: "var(--font-heading), 'Fraunces', serif",
              fontSize: 'clamp(1.3rem, 4vw, 1.7rem)',
              fontWeight: 500,
              color: 'var(--text-primary, #2C2A25)',
              lineHeight: 1.4,
              margin: '0 0 16px',
            }}>
              {isYes
                ? "You did something when everything in you said don\u2019t."
                : "That\u2019s okay."
              }
            </h2>

            <p style={{
              fontSize: 16,
              color: isYes ? AMBER : LAVENDER,
              lineHeight: 1.7,
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              margin: 0,
              fontWeight: 500,
            }}>
              {isYes
                ? "That\u2019s not small \u2014 that\u2019s brave."
                : "It\u2019s here when you\u2019re ready. Even reading this was a step."
              }
            </p>
          </div>

          {/* What you did / task recap */}
          <div style={{
            animation: 'fadeIn 0.5s ease 0.4s both',
            marginBottom: 40,
          }}>
            <p style={{
              fontSize: 13,
              color: 'var(--text-muted, #B0A898)',
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              margin: '20px 0 8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: 500,
            }}>
              {isYes ? 'What you did' : 'Your task'}
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: 14,
              background: 'var(--surface-elevated, #FFFFFF)',
              border: '1px solid var(--border, #E8E2D8)',
              fontSize: 15,
              color: 'var(--text-primary, #2C2A25)',
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}>
              {selectedEnergy?.emoji} {assignedTask}
            </div>
          </div>

          {/* Reminder about behavioral activation */}
          <div style={{
            animation: 'fadeIn 0.5s ease 0.55s both',
            marginBottom: 40,
          }}>
            <div style={{
              padding: '16px 24px',
              borderRadius: 16,
              background: 'rgba(212, 168, 67, 0.04)',
              border: `1px dashed ${AMBER_BORDER}`,
            }}>
              <p style={{
                fontSize: 13,
                color: 'var(--text-secondary, #8A8578)',
                lineHeight: 1.7,
                fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                margin: 0,
                fontStyle: 'italic',
              }}>
                Research shows that action creates motivation — not the other way around.
                You don't have to feel ready to begin.
              </p>
            </div>
          </div>

          {/* Continue button */}
          <div style={{
            animation: 'fadeIn 0.5s ease 0.7s both',
          }}>
            <button
              onClick={onComplete}
              style={styles.primaryBtn}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = `0 8px 28px ${AMBER_GLOW}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = `0 4px 16px ${AMBER_GLOW}`;
              }}
            >
              Continue {'\u2192'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback
  return null;
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
  @keyframes gentlePulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.08); opacity: 0.85; }
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
    fontFamily: "var(--font-heading), 'Fraunces', serif",
    fontSize: 'clamp(1.4rem, 4vw, 1.9rem)',
    fontWeight: 500,
    color: 'var(--text-primary, #2C2A25)',
    lineHeight: 1.3,
    margin: '0 0 16px',
  },
  bodyText: {
    fontSize: 16,
    color: 'var(--text-secondary, #8A8578)',
    lineHeight: 1.7,
    margin: '0 0 20px',
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
  },
  primaryBtn: {
    padding: '16px 36px',
    borderRadius: 50,
    background: AMBER,
    color: '#FFFFFF',
    border: 'none',
    fontSize: 16,
    fontWeight: 600,
    fontFamily: "var(--font-heading), 'Fraunces', serif",
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
    boxShadow: `0 4px 16px ${AMBER_GLOW}`,
  },
};
