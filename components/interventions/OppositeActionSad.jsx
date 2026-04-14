"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

const URGES = [
  {
    id: 'stay-in-bed',
    label: 'Stay in bed / lie down',
    icon: '\u{1F6CF}\uFE0F',
    description: 'The pull to collapse, go horizontal, stay under the covers',
  },
  {
    id: 'cancel-plans',
    label: 'Cancel plans / avoid people',
    icon: '\u{1F6AB}',
    description: 'The urge to back out, text "can\'t make it," disappear',
  },
  {
    id: 'stop-doing',
    label: 'Stop doing things / give up',
    icon: '\u{1F6D1}',
    description: 'Everything feels pointless, so why bother starting',
  },
  {
    id: 'cry-shutdown',
    label: 'Cry / shut down',
    icon: '\u{1F4A7}',
    description: 'The wave of tears or the numbness that follows them',
  },
  {
    id: 'scroll-zone',
    label: 'Scroll mindlessly / zone out',
    icon: '\u{1F4F1}',
    description: 'Disappearing into the screen to feel nothing at all',
  },
  {
    id: 'isolate',
    label: 'Isolate / hide',
    icon: '\u{1F3DA}\uFE0F',
    description: 'Closing the door, going silent, pulling away from everyone',
  },
];

const OPPOSITE_ACTIONS = {
  'stay-in-bed': {
    type: 'acknowledge',
    instruction: 'Sit upright. Put feet on the floor. Stand up for just 30 seconds. That\'s it.',
    micro: 'You don\'t have to do anything else. Just change your body\'s position. Gravity does the rest.',
  },
  'cancel-plans': {
    type: 'acknowledge',
    instruction: 'Keep the plans. Even if you go for 15 minutes and leave, go.',
    micro: 'You can set a secret timer. When it goes off, you have full permission to leave. But go.',
  },
  'stop-doing': {
    type: 'text-input',
    instruction: 'Do one thing. Just one. The smallest possible action.',
    prompt: 'What is it?',
    placeholder: 'e.g., "Put one dish in the sink" or "Open the document"',
    micro: 'It doesn\'t have to matter. It just has to be one thing.',
  },
  'cry-shutdown': {
    type: 'timer',
    instruction: 'Let yourself feel it for 2 full minutes.',
    after: 'Now: wash your face, change your shirt, or move to a different room.',
    micro: 'You\'re not blocking the sadness. You\'re giving it a container. When the timer ends, you shift.',
  },
  'scroll-zone': {
    type: 'timer',
    instruction: 'Put your phone face-down for 2 minutes.',
    after: 'Now pick ONE intentional thing to do.',
    micro: 'Scrolling isn\'t rest. It\'s avoidance wearing a comfort mask. Two minutes of nothing is more restorative.',
  },
  'isolate': {
    type: 'acknowledge',
    instruction: 'Send one message to one person. It can be one word. Just break the seal of isolation.',
    micro: 'It doesn\'t need to be deep. "Hey" counts. A reaction emoji counts. Connection is the opposite action.',
  },
};

const TIMER_DURATION = 120; // 2 minutes in seconds

export default function OppositeActionSad({ onComplete, emotion }) {
  const [step, setStep] = useState(0); // 0=intro, 1=urge-select, 2=opposite-action, 3=completion
  const [selectedUrge, setSelectedUrge] = useState(null);
  const [actionText, setActionText] = useState('');
  const [actionAcknowledged, setActionAcknowledged] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerComplete, setTimerComplete] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TIMER_DURATION);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
      }
    };
  }, []);

  const startTimer = useCallback(() => {
    setTimerRunning(true);
    setTimerComplete(false);
    setSecondsLeft(TIMER_DURATION);
    startTimeRef.current = Date.now();

    const tick = () => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remaining = Math.max(0, TIMER_DURATION - elapsed);
      setSecondsLeft(remaining);

      if (remaining <= 0) {
        setTimerRunning(false);
        setTimerComplete(true);
        return;
      }
      timerRef.current = requestAnimationFrame(tick);
    };

    timerRef.current = requestAnimationFrame(tick);
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
    }
    setTimerRunning(false);
    setTimerComplete(false);
    setSecondsLeft(TIMER_DURATION);
    startTimeRef.current = null;
  }, []);

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = (TIMER_DURATION - secondsLeft) / TIMER_DURATION;

  const handleUrgeSelect = (urge) => {
    setSelectedUrge(urge);
    resetTimer();
    setActionText('');
    setActionAcknowledged(false);
  };

  const canProceedToCompletion = () => {
    if (!selectedUrge) return false;
    const action = OPPOSITE_ACTIONS[selectedUrge.id];
    if (action.type === 'timer') return timerComplete;
    if (action.type === 'text-input') return actionText.trim().length > 0 && actionAcknowledged;
    if (action.type === 'acknowledge') return actionAcknowledged;
    return false;
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
          maxWidth: 520,
          margin: '0 auto',
        }}>
          {/* Decorative element */}
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(155,142,196,0.15) 0%, rgba(155,142,196,0.06) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 28px',
            border: '1px solid rgba(155,142,196,0.12)',
          }}>
            <span style={{ fontSize: 36, lineHeight: 1 }}>{'\u21C6'}</span>
          </div>

          <div style={{
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            color: '#9B8EC4',
            marginBottom: 16,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 600,
          }}>
            Opposite Action {'\u2022'} DBT
          </div>

          <h2 style={styles.heading}>
            When you're sad, every urge pulls you toward withdrawal.
          </h2>

          <p style={styles.subtext}>
            Opposite Action means doing the exact opposite of what the emotion is telling you to do.
          </p>

          <div style={{
            padding: '20px 24px',
            borderRadius: 16,
            background: 'rgba(155,142,196,0.06)',
            border: '1px solid rgba(155,142,196,0.12)',
            marginBottom: 32,
          }}>
            <p style={{
              fontSize: 14,
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              margin: 0,
              fontFamily: "'DM Sans', sans-serif",
              fontStyle: 'italic',
            }}>
              This isn't about forcing happiness. It's about not letting sadness make every decision for you.
            </p>
          </div>

          <button
            onClick={() => setStep(1)}
            style={styles.primaryBtn}
          >
            Let's start {'\u2192'}
          </button>
        </div>
      </div>
    );
  }

  // --- STEP 1: URGE SELECTION ---
  if (step === 1) {
    return (
      <div style={styles.container}>
        <style>{animationStyles}</style>
        <div style={{
          ...styles.fadeIn,
          padding: '40px 24px',
          maxWidth: 540,
          margin: '0 auto',
        }}>
          <div style={styles.stepLabel}>Step 1 of 2</div>

          <h2 style={{ ...styles.heading, textAlign: 'center', marginBottom: 8 }}>
            What's your strongest urge right now?
          </h2>
          <p style={{
            fontSize: 15,
            color: 'var(--text-secondary)',
            textAlign: 'center',
            margin: '0 0 28px',
            lineHeight: 1.6,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Sadness tells you to do specific things. Pick the one that's loudest.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 12,
            marginBottom: 32,
          }}>
            {URGES.map((urge, i) => {
              const isSelected = selectedUrge && selectedUrge.id === urge.id;

              return (
                <button
                  key={urge.id}
                  onClick={() => handleUrgeSelect(urge)}
                  style={{
                    padding: '20px 16px',
                    borderRadius: 20,
                    background: isSelected
                      ? 'rgba(155,142,196,0.1)'
                      : 'var(--surface-elevated)',
                    border: `2px solid ${isSelected ? '#9B8EC4' : 'var(--border)'}`,
                    cursor: 'pointer',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 10,
                    transition: 'all 0.25s ease',
                    animation: `cardSlideIn 0.4s ease ${0.06 * i}s both`,
                    boxShadow: isSelected
                      ? '0 8px 32px rgba(155,142,196,0.18)'
                      : 'var(--shadow-sm)',
                    transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                    position: 'relative',
                  }}
                >
                  {/* Selection indicator */}
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: '#9B8EC4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      animation: 'pillPop 0.3s cubic-bezier(0.16,1,0.3,1)',
                    }}>
                      <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>{'\u2713'}</span>
                    </div>
                  )}

                  <div style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>
                    {urge.icon}
                  </div>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: isSelected ? '#9B8EC4' : 'var(--text-primary)',
                    fontFamily: "'Fraunces', serif",
                    lineHeight: 1.3,
                  }}>
                    {urge.label}
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: 'var(--text-muted)',
                    lineHeight: 1.4,
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    {urge.description}
                  </div>
                </button>
              );
            })}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => setStep(2)}
              disabled={!selectedUrge}
              style={{
                ...styles.primaryBtn,
                opacity: selectedUrge ? 1 : 0.4,
                cursor: selectedUrge ? 'pointer' : 'not-allowed',
              }}
            >
              Show me the opposite {'\u2192'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- STEP 2: OPPOSITE ACTION ---
  if (step === 2 && selectedUrge) {
    const action = OPPOSITE_ACTIONS[selectedUrge.id];

    return (
      <div style={styles.container}>
        <style>{animationStyles}</style>
        <div style={{
          ...styles.fadeIn,
          padding: '40px 24px',
          maxWidth: 520,
          margin: '0 auto',
        }}>
          <div style={styles.stepLabel}>Step 2 of 2</div>

          {/* What sadness says vs. what you'll do */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            marginBottom: 28,
          }}>
            {/* Sadness says */}
            <div style={{
              padding: '16px 20px',
              borderRadius: 16,
              background: 'rgba(0,0,0,0.03)',
              border: '1px solid rgba(0,0,0,0.06)',
              animation: 'cardSlideIn 0.4s ease 0s both',
            }}>
              <div style={{
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'var(--text-muted)',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600,
                marginBottom: 8,
              }}>
                Sadness says
              </div>
              <p style={{
                fontSize: 15,
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: 1.5,
                fontFamily: "'DM Sans', sans-serif",
                fontStyle: 'italic',
                textDecoration: 'line-through',
                textDecorationColor: 'rgba(155,142,196,0.4)',
              }}>
                "{selectedUrge.label}"
              </p>
            </div>

            {/* Arrow */}
            <div style={{
              textAlign: 'center',
              fontSize: 20,
              color: '#9B8EC4',
              animation: 'cardSlideIn 0.4s ease 0.1s both',
            }}>
              {'\u2193'}
            </div>

            {/* Opposite action */}
            <div style={{
              padding: '24px',
              borderRadius: 20,
              background: 'rgba(155,142,196,0.06)',
              border: '2px solid rgba(155,142,196,0.2)',
              animation: 'cardSlideIn 0.5s ease 0.2s both',
            }}>
              <div style={{
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: '#9B8EC4',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600,
                marginBottom: 12,
              }}>
                The opposite action
              </div>
              <p style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 'clamp(1.1rem, 3.5vw, 1.35rem)',
                fontWeight: 500,
                color: 'var(--text-primary)',
                lineHeight: 1.5,
                margin: 0,
              }}>
                {action.instruction}
              </p>
            </div>
          </div>

          {/* Micro insight */}
          <div style={{
            padding: '16px 20px',
            borderRadius: 14,
            background: 'rgba(155,142,196,0.04)',
            borderLeft: '3px solid rgba(155,142,196,0.3)',
            marginBottom: 28,
            animation: 'cardSlideIn 0.5s ease 0.35s both',
          }}>
            <p style={{
              fontSize: 14,
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              margin: 0,
              fontFamily: "'DM Sans', sans-serif",
              fontStyle: 'italic',
            }}>
              {action.micro}
            </p>
          </div>

          {/* --- ACTION-SPECIFIC UI --- */}

          {/* TIMER TYPE */}
          {action.type === 'timer' && (
            <div style={{
              animation: 'cardSlideIn 0.5s ease 0.45s both',
            }}>
              <CircularTimer
                secondsLeft={secondsLeft}
                totalSeconds={TIMER_DURATION}
                isRunning={timerRunning}
                isComplete={timerComplete}
                onStart={startTimer}
                onReset={resetTimer}
                formatTime={formatTime}
                progress={progress}
              />

              {/* Post-timer instruction */}
              {timerComplete && (
                <div style={{
                  padding: '20px 24px',
                  borderRadius: 16,
                  background: 'rgba(155,142,196,0.08)',
                  border: '1.5px solid rgba(155,142,196,0.2)',
                  marginTop: 24,
                  animation: 'completionReveal 0.6s cubic-bezier(0.16,1,0.3,1)',
                }}>
                  <div style={{
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    color: '#9B8EC4',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 600,
                    marginBottom: 10,
                  }}>
                    Now
                  </div>
                  <p style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: 17,
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    lineHeight: 1.5,
                    margin: 0,
                  }}>
                    {action.after}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TEXT INPUT TYPE */}
          {action.type === 'text-input' && (
            <div style={{
              animation: 'cardSlideIn 0.5s ease 0.45s both',
            }}>
              <label style={{
                display: 'block',
                fontSize: 15,
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 12,
                fontFamily: "'Fraunces', serif",
              }}>
                {action.prompt}
              </label>
              <textarea
                value={actionText}
                onChange={e => setActionText(e.target.value)}
                placeholder={action.placeholder}
                rows={3}
                style={styles.textarea}
                onFocus={e => { e.target.style.borderColor = '#9B8EC4'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(155,142,196,0.2)'; }}
              />

              {actionText.trim() && !actionAcknowledged && (
                <div style={{
                  textAlign: 'center',
                  marginTop: 20,
                  animation: 'fadeIn 0.4s ease',
                }}>
                  <p style={{
                    fontSize: 15,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    margin: '0 0 16px',
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    That's your one thing. Can you commit to doing it?
                  </p>
                  <button
                    onClick={() => setActionAcknowledged(true)}
                    style={{
                      padding: '12px 28px',
                      borderRadius: 50,
                      background: 'rgba(155,142,196,0.1)',
                      color: '#9B8EC4',
                      border: '1.5px solid rgba(155,142,196,0.3)',
                      fontSize: 15,
                      fontWeight: 600,
                      fontFamily: "'Fraunces', serif",
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    I commit to this one thing
                  </button>
                </div>
              )}

              {actionAcknowledged && (
                <div style={{
                  textAlign: 'center',
                  marginTop: 20,
                  animation: 'pillPop 0.4s cubic-bezier(0.16,1,0.3,1)',
                }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 20px',
                    borderRadius: 50,
                    background: 'rgba(155,142,196,0.1)',
                    border: '1px solid rgba(155,142,196,0.2)',
                  }}>
                    <span style={{ color: '#9B8EC4', fontSize: 16 }}>{'\u2713'}</span>
                    <span style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#9B8EC4',
                      fontFamily: "'DM Sans', sans-serif",
                    }}>
                      Committed
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ACKNOWLEDGE TYPE */}
          {action.type === 'acknowledge' && !actionAcknowledged && (
            <div style={{
              textAlign: 'center',
              animation: 'cardSlideIn 0.5s ease 0.45s both',
            }}>
              <p style={{
                fontSize: 15,
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                margin: '0 0 16px',
                fontFamily: "'DM Sans', sans-serif",
              }}>
                Can you try this? Even just the smallest version of it?
              </p>
              <button
                onClick={() => setActionAcknowledged(true)}
                style={{
                  padding: '14px 32px',
                  borderRadius: 50,
                  background: 'rgba(155,142,196,0.1)',
                  color: '#9B8EC4',
                  border: '1.5px solid rgba(155,142,196,0.3)',
                  fontSize: 15,
                  fontWeight: 600,
                  fontFamily: "'Fraunces', serif",
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
              >
                I'll try it
              </button>
            </div>
          )}

          {action.type === 'acknowledge' && actionAcknowledged && (
            <div style={{
              textAlign: 'center',
              animation: 'pillPop 0.4s cubic-bezier(0.16,1,0.3,1)',
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                borderRadius: 50,
                background: 'rgba(155,142,196,0.1)',
                border: '1px solid rgba(155,142,196,0.2)',
                marginBottom: 4,
              }}>
                <span style={{ color: '#9B8EC4', fontSize: 16 }}>{'\u2713'}</span>
                <span style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#9B8EC4',
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  That takes courage
                </span>
              </div>
            </div>
          )}

          {/* Continue to completion */}
          {canProceedToCompletion() && (
            <div style={{
              textAlign: 'center',
              marginTop: 32,
              animation: 'fadeIn 0.5s ease 0.3s both',
            }}>
              <button
                onClick={() => setStep(3)}
                style={styles.primaryBtn}
              >
                Continue {'\u2192'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- STEP 3: COMPLETION ---
  return (
    <div style={styles.container}>
      <style>{animationStyles}</style>
      <div style={{
        padding: '40px 24px',
        maxWidth: 520,
        margin: '0 auto',
      }}>
        {/* Completion card */}
        <div style={{
          padding: '44px 32px',
          borderRadius: 28,
          background: 'var(--surface-elevated)',
          border: '2px solid transparent',
          backgroundClip: 'padding-box',
          position: 'relative',
          marginBottom: 32,
          animation: 'completionReveal 0.7s cubic-bezier(0.16,1,0.3,1)',
          boxShadow: '0 12px 48px rgba(155,142,196,0.12)',
          textAlign: 'center',
        }}>
          {/* Gradient border */}
          <div style={{
            position: 'absolute',
            inset: -2,
            borderRadius: 30,
            padding: 2,
            background: 'linear-gradient(135deg, #9B8EC4 0%, rgba(155,142,196,0.3) 50%, #9B8EC4 100%)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            pointerEvents: 'none',
          }} />

          {/* Icon */}
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(155,142,196,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            animation: 'pillPop 0.5s cubic-bezier(0.16,1,0.3,1) 0.3s both',
          }}>
            <span style={{ fontSize: 28, lineHeight: 1 }}>{'\u21C6'}</span>
          </div>

          <div style={{
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            color: '#9B8EC4',
            marginBottom: 20,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 600,
            animation: 'fadeIn 0.5s ease 0.4s both',
          }}>
            Opposite Action Complete
          </div>

          {/* What they faced */}
          {selectedUrge && (
            <div style={{
              padding: '14px 20px',
              borderRadius: 14,
              background: 'rgba(155,142,196,0.06)',
              border: '1px solid rgba(155,142,196,0.12)',
              marginBottom: 24,
              animation: 'fadeIn 0.5s ease 0.5s both',
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
                You felt the urge to
              </div>
              <p style={{
                fontSize: 15,
                color: 'var(--text-primary)',
                margin: 0,
                lineHeight: 1.5,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
              }}>
                {selectedUrge.label}
              </p>
              <div style={{
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: '#9B8EC4',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600,
                marginTop: 12,
                marginBottom: 6,
              }}>
                And you did the opposite
              </div>
              <p style={{
                fontSize: 14,
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: 1.5,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                {OPPOSITE_ACTIONS[selectedUrge.id].instruction}
              </p>
            </div>
          )}

          {/* Divider */}
          <div style={{
            width: 48,
            height: 1,
            background: 'rgba(155,142,196,0.2)',
            margin: '0 auto 24px',
            animation: 'fadeIn 0.5s ease 0.6s both',
          }} />

          {/* Closing quote */}
          <div style={{
            animation: 'fadeIn 0.6s ease 0.7s both',
          }}>
            <p style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 'clamp(1rem, 3.5vw, 1.2rem)',
              fontWeight: 500,
              color: 'var(--text-primary)',
              lineHeight: 1.6,
              margin: '0 0 16px',
            }}>
              You don't need to feel different to ACT different. The feeling often follows the action, not the other way around.
            </p>
            <p style={{
              fontSize: 13,
              color: '#9B8EC4',
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              margin: 0,
              letterSpacing: '0.02em',
            }}>
              {'\u2014'} Marsha Linehan
            </p>
          </div>
        </div>

        {/* Continue button */}
        <div style={{
          textAlign: 'center',
          animation: 'fadeIn 0.5s ease 0.9s both',
        }}>
          <button
            onClick={onComplete}
            style={{
              ...styles.primaryBtn,
              width: '100%',
              maxWidth: 320,
            }}
          >
            Continue {'\u2192'}
          </button>
        </div>
      </div>
    </div>
  );
}


// --- Circular Timer Sub-component ---
function CircularTimer({
  secondsLeft,
  totalSeconds,
  isRunning,
  isComplete,
  onStart,
  onReset,
  formatTime,
  progress,
}) {
  const size = 220;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 20,
    }}>
      {/* SVG circular timer */}
      <div style={{
        position: 'relative',
        width: size,
        height: size,
      }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{
            transform: 'rotate(-90deg)',
            filter: isComplete
              ? 'drop-shadow(0 0 16px rgba(155,142,196,0.3))'
              : 'none',
            transition: 'filter 0.5s ease',
          }}
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(155,142,196,0.1)"
            strokeWidth={strokeWidth}
          />

          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={isComplete ? '#9B8EC4' : 'rgba(155,142,196,0.6)'}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: isRunning
                ? 'stroke-dashoffset 0.3s linear, stroke 0.5s ease'
                : 'stroke 0.5s ease',
            }}
          />

          {/* Completion glow ring */}
          {isComplete && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#9B8EC4"
              strokeWidth={2}
              strokeDasharray={circumference}
              strokeDashoffset={0}
              opacity={0.3}
              style={{
                animation: 'timerGlow 2s ease-in-out infinite',
              }}
            />
          )}
        </svg>

        {/* Center content */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {isComplete ? (
            <div style={{
              animation: 'pillPop 0.5s cubic-bezier(0.16,1,0.3,1)',
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: 32,
                marginBottom: 4,
                lineHeight: 1,
              }}>
                {'\u2713'}
              </div>
              <div style={{
                fontSize: 13,
                color: '#9B8EC4',
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: '0.05em',
              }}>
                Done
              </div>
            </div>
          ) : (
            <>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 40,
                fontWeight: 700,
                color: isRunning ? 'var(--text-primary)' : 'var(--text-secondary)',
                lineHeight: 1,
                letterSpacing: '-0.02em',
                transition: 'color 0.3s ease',
              }}>
                {formatTime(secondsLeft)}
              </div>
              <div style={{
                fontSize: 11,
                color: 'var(--text-muted)',
                fontFamily: "'DM Sans', sans-serif",
                marginTop: 6,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                fontWeight: 500,
              }}>
                {isRunning ? 'remaining' : 'minutes'}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Timer controls */}
      {!isComplete && (
        <div style={{ display: 'flex', gap: 12 }}>
          {!isRunning ? (
            <button
              onClick={onStart}
              style={{
                padding: '12px 32px',
                borderRadius: 50,
                background: '#9B8EC4',
                color: '#fff',
                border: 'none',
                fontSize: 15,
                fontWeight: 600,
                fontFamily: "'Fraunces', serif",
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: '0 4px 16px rgba(155,142,196,0.3)',
              }}
            >
              {secondsLeft < totalSeconds ? 'Resume' : 'Start timer'}
            </button>
          ) : (
            <button
              onClick={onReset}
              style={{
                padding: '12px 28px',
                borderRadius: 50,
                background: 'rgba(155,142,196,0.08)',
                color: 'var(--text-secondary)',
                border: '1.5px solid rgba(155,142,196,0.2)',
                fontSize: 14,
                fontWeight: 500,
                fontFamily: "'DM Sans', sans-serif",
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
            >
              Reset
            </button>
          )}
        </div>
      )}

      {/* Running state hint */}
      {isRunning && (
        <p style={{
          fontSize: 13,
          color: 'var(--text-muted)',
          textAlign: 'center',
          margin: 0,
          fontFamily: "'DM Sans', sans-serif",
          fontStyle: 'italic',
          animation: 'fadeIn 0.4s ease',
        }}>
          Let it be. You don't have to do anything right now.
        </p>
      )}
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
  @keyframes pillPop {
    from { opacity: 0; transform: scale(0.7); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes completionReveal {
    from { opacity: 0; transform: scale(0.92) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes timerGlow {
    0%, 100% { opacity: 0.15; }
    50% { opacity: 0.4; }
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
  stepLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: '#9B8EC4',
    fontWeight: 600,
    marginBottom: 12,
    fontFamily: "'JetBrains Mono', monospace",
  },
  textarea: {
    width: '100%',
    padding: '16px 20px',
    border: '1.5px solid rgba(155,142,196,0.2)',
    borderRadius: 16,
    background: 'rgba(155,142,196,0.04)',
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
};
