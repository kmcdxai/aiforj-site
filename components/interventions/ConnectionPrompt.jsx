"use client";

import { useState } from 'react';

const RELATIONSHIPS = [
  { key: 'friend', label: 'Friend', emoji: '\u{1F46B}' },
  { key: 'family', label: 'Family', emoji: '\u{1F3E0}' },
  { key: 'partner', label: 'Partner', emoji: '\u{1F496}' },
  { key: 'colleague', label: 'Colleague', emoji: '\u{1F4BC}' },
  { key: 'acquaintance', label: 'Acquaintance', emoji: '\u{1F44B}' },
  { key: 'old_friend', label: 'Old friend I\'ve lost touch with', emoji: '\u{1F30C}' },
];

const ENERGY_LEVELS = [
  {
    key: 'low',
    label: 'Low',
    emoji: '\u{1F56F}\uFE0F',
    description: 'Barely have the energy to type',
  },
  {
    key: 'medium',
    label: 'Medium',
    emoji: '\u{2600}\uFE0F',
    description: 'Could manage a short conversation',
  },
  {
    key: 'high',
    label: 'High',
    emoji: '\u{26A1}',
    description: 'Ready to actually make plans',
  },
];

const MESSAGES = {
  friend: {
    low: (name) => `Hey ${name}, thinking about you. Hope you're doing okay. \u{1F499}`,
    medium: (name) => `Hey ${name}, it's been a minute. How are things? I'd love to catch up sometime.`,
    high: (name) => `Hey ${name}! I miss you. Want to grab coffee/a call this week?`,
  },
  family: {
    low: (name) => `Hi ${name}, just wanted to say I love you.`,
    medium: (name) => `Hi ${name}, thinking about you today. How are you doing?`,
    high: (name) => `Hi ${name}! I'd love to see you soon. Can we plan something this week?`,
  },
  partner: {
    low: (name) => `Hey ${name}, I'm having a rough day. Just wanted you to know I appreciate you. \u{1F499}`,
    medium: (name) => `Hey ${name}, can we do something together tonight? Even just sitting together would be nice.`,
    high: (name) => `Hey ${name}, let's do something special together this week. I want to connect with you.`,
  },
  colleague: {
    low: (name) => `Hey ${name}, hope work's going okay! Just checking in.`,
    medium: (name) => `Hey ${name}, want to grab lunch/coffee sometime this week?`,
    high: (name) => `Hey ${name}! We should hang out outside of work sometime. Interested?`,
  },
  acquaintance: {
    low: (name) => `Hey ${name}, hope you're doing well! \u{1F60A}`,
    medium: (name) => `Hey ${name}! Random text but I've been meaning to say hi. How are things?`,
    high: (name) => `Hey ${name}! We should actually hang out sometime. Are you free this week?`,
  },
  old_friend: {
    low: (name) => `Hey ${name}, you crossed my mind today. Hope you're doing well. \u{1F499}`,
    medium: (name) => `Hey ${name}! Random text but I was thinking about you and it made me smile. How are you?`,
    high: (name) => `Hey ${name}! I miss you. Let's catch up \u2014 call or coffee, whatever works. It's been too long.`,
  },
};

export default function ConnectionPrompt({ onComplete, emotion }) {
  const [step, setStep] = useState(0); // 0=intro, 1=name, 2=relationship, 3=energy, 4=message, 5=closing
  const [personName, setPersonName] = useState('');
  const [relationship, setRelationship] = useState(null);
  const [energy, setEnergy] = useState(null);
  const [copied, setCopied] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const transitionTo = (nextStep) => {
    setStep(nextStep);
  };

  const getMessage = () => {
    if (!relationship || !energy || !personName.trim()) return '';
    return MESSAGES[relationship][energy](personName.trim());
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getMessage());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = getMessage();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const getSmsHref = () => {
    const msg = encodeURIComponent(getMessage());
    return `sms:?body=${msg}`;
  };

  const getRelationshipLabel = () => {
    const rel = RELATIONSHIPS.find(r => r.key === relationship);
    return rel ? rel.label : '';
  };

  const getEnergyLabel = () => {
    const e = ENERGY_LEVELS.find(l => l.key === energy);
    return e ? e.label : '';
  };

  // --- INTRO ---
  if (step === 0) {
    return (
      <div style={styles.container}>
        <style>{cpKeyframes}</style>
        <div style={{
          ...styles.fadeIn,
          textAlign: 'center',
          padding: '48px 24px',
          maxWidth: 520,
          margin: '0 auto',
        }}>
          <div style={{
            fontSize: 48,
            marginBottom: 28,
            animation: 'cpFloat 3s ease-in-out infinite',
          }}>
            {'\u{1F91D}'}
          </div>

          <h2 style={{
            ...styles.heading,
            textAlign: 'center',
            marginBottom: 20,
          }}>
            One tiny connection
          </h2>

          <p style={{
            fontSize: 17,
            color: 'var(--text-primary)',
            lineHeight: 1.8,
            margin: '0 0 12px',
            fontWeight: 500,
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
          }}>
            Loneliness and sadness feed each other.
          </p>

          <p style={{
            fontSize: 16,
            color: 'var(--text-secondary)',
            lineHeight: 1.8,
            margin: '0 0 24px',
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
          }}>
            Let's break the cycle with one tiny connection.
          </p>

          <div style={{
            width: 48,
            height: 1,
            background: 'rgba(212,168,67,0.3)',
            margin: '0 auto 24px',
          }} />

          <p style={{
            fontSize: 15,
            color: 'var(--text-muted)',
            lineHeight: 1.7,
            margin: '0 0 36px',
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
            fontStyle: 'italic',
          }}>
            We'll help you craft the perfect message {'\u2014'} no overthinking required.
          </p>

          <button
            onClick={() => transitionTo(1)}
            style={styles.primaryBtn}
            onMouseEnter={e => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 24px rgba(212,168,67,0.4)';
            }}
            onMouseLeave={e => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 16px rgba(212,168,67,0.3)';
            }}
          >
            Let's do this {'\u2192'}
          </button>
        </div>
      </div>
    );
  }

  // --- STEP 1: WHO ---
  if (step === 1) {
    return (
      <div style={styles.container}>
        <style>{cpKeyframes}</style>
        <div style={{
          ...styles.fadeIn,
          padding: '40px 24px',
          maxWidth: 500,
          margin: '0 auto',
        }}>
          <div style={styles.progressContainer}>
            <div style={styles.progressTrack}>
              <div style={{
                ...styles.progressFill,
                width: '25%',
              }} />
            </div>
            <span style={styles.progressLabel}>Step 1 of 4</span>
          </div>

          <h2 style={{
            ...styles.heading,
            textAlign: 'left',
            marginBottom: 12,
          }}>
            Who could you reach out to?
          </h2>

          <p style={{
            fontSize: 14,
            color: 'var(--text-muted)',
            lineHeight: 1.7,
            margin: '0 0 24px',
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
          }}>
            Just a first name is fine. This is about the thought, not the formality.
          </p>

          <input
            type="text"
            value={personName}
            onChange={e => setPersonName(e.target.value)}
            placeholder="A friend, family member, or even an acquaintance"
            style={{
              width: '100%',
              padding: '18px 22px',
              border: '1.5px solid rgba(212,168,67,0.2)',
              borderRadius: 16,
              background: 'rgba(212,168,67,0.03)',
              fontSize: 16,
              color: 'var(--text-primary)',
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              lineHeight: 1.6,
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
            }}
            onFocus={e => {
              e.target.style.borderColor = '#D4A843';
              e.target.style.boxShadow = '0 0 0 4px rgba(212,168,67,0.1)';
            }}
            onBlur={e => {
              e.target.style.borderColor = 'rgba(212,168,67,0.2)';
              e.target.style.boxShadow = 'none';
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && personName.trim()) {
                transitionTo(2);
              }
            }}
          />

          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <button
              onClick={() => transitionTo(2)}
              disabled={!personName.trim()}
              style={{
                ...styles.primaryBtn,
                opacity: personName.trim() ? 1 : 0.4,
                cursor: personName.trim() ? 'pointer' : 'not-allowed',
              }}
              onMouseEnter={e => {
                if (personName.trim()) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 24px rgba(212,168,67,0.4)';
                }
              }}
              onMouseLeave={e => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 16px rgba(212,168,67,0.3)';
              }}
            >
              Next {'\u2192'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- STEP 2: RELATIONSHIP ---
  if (step === 2) {
    return (
      <div style={styles.container}>
        <style>{cpKeyframes}</style>
        <div style={{
          ...styles.fadeIn,
          padding: '40px 24px',
          maxWidth: 500,
          margin: '0 auto',
        }}>
          <div style={styles.progressContainer}>
            <div style={styles.progressTrack}>
              <div style={{
                ...styles.progressFill,
                width: '50%',
              }} />
            </div>
            <span style={styles.progressLabel}>Step 2 of 4</span>
          </div>

          {/* Echo back the name */}
          <div style={{
            padding: '12px 18px',
            background: 'rgba(212,168,67,0.06)',
            borderRadius: 12,
            borderLeft: '3px solid #D4A843',
            marginBottom: 20,
            animation: 'cpSlideIn 0.4s ease',
          }}>
            <p style={{
              fontSize: 14,
              color: 'var(--text-muted)',
              margin: '0 0 2px',
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
            }}>
              Reaching out to:
            </p>
            <p style={{
              fontSize: 16,
              color: 'var(--text-primary)',
              fontWeight: 600,
              margin: 0,
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
            }}>
              {personName}
            </p>
          </div>

          <h2 style={{
            ...styles.heading,
            textAlign: 'left',
            marginBottom: 12,
            fontSize: 'clamp(1.2rem, 3.5vw, 1.6rem)',
          }}>
            What's your relationship with {personName}?
          </h2>

          <p style={{
            fontSize: 14,
            color: 'var(--text-muted)',
            lineHeight: 1.7,
            margin: '0 0 20px',
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
          }}>
            This helps us tailor the right tone for your message.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 12,
          }}>
            {RELATIONSHIPS.map((rel) => {
              const isSelected = relationship === rel.key;
              return (
                <button
                  key={rel.key}
                  onClick={() => setRelationship(rel.key)}
                  style={{
                    padding: '16px 14px',
                    borderRadius: 14,
                    border: isSelected
                      ? '2px solid #D4A843'
                      : '1.5px solid rgba(212,168,67,0.15)',
                    background: isSelected
                      ? 'rgba(212,168,67,0.08)'
                      : '#FAF6F0',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: isSelected
                      ? '0 4px 16px rgba(212,168,67,0.15)'
                      : '0 1px 4px rgba(0,0,0,0.04)',
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'rgba(212,168,67,0.4)';
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'rgba(212,168,67,0.15)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 6 }}>
                    {rel.emoji}
                  </div>
                  <div style={{
                    fontSize: rel.key === 'old_friend' ? 12 : 14,
                    fontWeight: isSelected ? 600 : 500,
                    color: isSelected ? '#D4A843' : 'var(--text-primary)',
                    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                    lineHeight: 1.3,
                  }}>
                    {rel.label}
                  </div>
                </button>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button
              onClick={() => transitionTo(3)}
              disabled={!relationship}
              style={{
                ...styles.primaryBtn,
                opacity: relationship ? 1 : 0.4,
                cursor: relationship ? 'pointer' : 'not-allowed',
              }}
              onMouseEnter={e => {
                if (relationship) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 24px rgba(212,168,67,0.4)';
                }
              }}
              onMouseLeave={e => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 16px rgba(212,168,67,0.3)';
              }}
            >
              Next {'\u2192'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- STEP 3: ENERGY ---
  if (step === 3) {
    return (
      <div style={styles.container}>
        <style>{cpKeyframes}</style>
        <div style={{
          ...styles.fadeIn,
          padding: '40px 24px',
          maxWidth: 500,
          margin: '0 auto',
        }}>
          <div style={styles.progressContainer}>
            <div style={styles.progressTrack}>
              <div style={{
                ...styles.progressFill,
                width: '75%',
              }} />
            </div>
            <span style={styles.progressLabel}>Step 3 of 4</span>
          </div>

          <h2 style={{
            ...styles.heading,
            textAlign: 'center',
            marginBottom: 8,
          }}>
            How much energy do you have for this?
          </h2>

          <p style={{
            fontSize: 14,
            color: 'var(--text-muted)',
            textAlign: 'center',
            lineHeight: 1.7,
            margin: '0 0 28px',
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
          }}>
            Be honest {'\u2014'} there's no wrong answer. Even the smallest reach counts.
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}>
            {ENERGY_LEVELS.map((level) => {
              const isSelected = energy === level.key;
              return (
                <button
                  key={level.key}
                  onClick={() => setEnergy(level.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '20px 22px',
                    borderRadius: 16,
                    border: isSelected
                      ? '2px solid #D4A843'
                      : '1.5px solid rgba(212,168,67,0.15)',
                    background: isSelected
                      ? 'rgba(212,168,67,0.08)'
                      : '#FAF6F0',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: isSelected
                      ? '0 4px 16px rgba(212,168,67,0.15)'
                      : '0 1px 4px rgba(0,0,0,0.04)',
                    width: '100%',
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'rgba(212,168,67,0.4)';
                      e.currentTarget.style.transform = 'scale(1.01)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'rgba(212,168,67,0.15)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  <div style={{
                    fontSize: 28,
                    width: 44,
                    height: 44,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 12,
                    background: isSelected
                      ? 'rgba(212,168,67,0.12)'
                      : 'rgba(212,168,67,0.05)',
                    flexShrink: 0,
                    transition: 'background 0.25s ease',
                  }}>
                    {level.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 16,
                      fontWeight: isSelected ? 700 : 600,
                      color: isSelected ? '#D4A843' : 'var(--text-primary)',
                      fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                      marginBottom: 3,
                      transition: 'color 0.2s ease',
                    }}>
                      {level.label}
                    </div>
                    <div style={{
                      fontSize: 13,
                      color: 'var(--text-muted)',
                      fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                      lineHeight: 1.4,
                    }}>
                      {level.description}
                    </div>
                  </div>
                  {isSelected && (
                    <div style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: '#D4A843',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      animation: 'cpPop 0.3s cubic-bezier(0.16,1,0.3,1)',
                    }}>
                      <span style={{
                        color: '#fff',
                        fontSize: 13,
                        fontWeight: 700,
                      }}>
                        {'\u2713'}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <button
              onClick={() => transitionTo(4)}
              disabled={!energy}
              style={{
                ...styles.primaryBtn,
                opacity: energy ? 1 : 0.4,
                cursor: energy ? 'pointer' : 'not-allowed',
              }}
              onMouseEnter={e => {
                if (energy) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 24px rgba(212,168,67,0.4)';
                }
              }}
              onMouseLeave={e => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 16px rgba(212,168,67,0.3)';
              }}
            >
              Generate my message {'\u2192'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- STEP 4: MESSAGE ---
  if (step === 4) {
    const message = getMessage();

    return (
      <div style={styles.container}>
        <style>{cpKeyframes}</style>
        <div style={{
          ...styles.fadeIn,
          padding: '40px 24px',
          maxWidth: 520,
          margin: '0 auto',
        }}>
          <div style={styles.progressContainer}>
            <div style={styles.progressTrack}>
              <div style={{
                ...styles.progressFill,
                width: '100%',
              }} />
            </div>
            <span style={styles.progressLabel}>Step 4 of 4</span>
          </div>

          <h2 style={{
            ...styles.heading,
            textAlign: 'center',
            marginBottom: 8,
          }}>
            Your message is ready
          </h2>

          <p style={{
            fontSize: 14,
            color: 'var(--text-muted)',
            textAlign: 'center',
            lineHeight: 1.7,
            margin: '0 0 10px',
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
          }}>
            Tailored for your {getRelationshipLabel().toLowerCase()} {'\u00B7'}{' '}
            {getEnergyLabel().toLowerCase()} energy
          </p>

          {/* Context tag */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 24,
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 12px',
              borderRadius: 20,
              background: 'rgba(155,142,196,0.08)',
              fontSize: 12,
              color: '#9B8EC4',
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              fontWeight: 500,
            }}>
              {'\u{1F494}'} Feeling sad
            </span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 12px',
              borderRadius: 20,
              background: 'rgba(212,168,67,0.08)',
              fontSize: 12,
              color: '#D4A843',
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              fontWeight: 500,
            }}>
              {'\u{1F91D}'} Connection
            </span>
          </div>

          {/* Message bubble */}
          <div style={{
            position: 'relative',
            animation: 'cpBubbleIn 0.5s cubic-bezier(0.16,1,0.3,1)',
          }}>
            {/* The "phone screen" container */}
            <div style={{
              background: '#EAEAEA',
              borderRadius: 24,
              padding: '28px 18px 20px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Status bar mimic */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 16,
              }}>
                <div style={{
                  width: 36,
                  height: 5,
                  borderRadius: 3,
                  background: 'rgba(0,0,0,0.15)',
                }} />
              </div>

              {/* Recipient name */}
              <div style={{
                textAlign: 'center',
                marginBottom: 20,
              }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #D4A843, #9B8EC4)',
                  margin: '0 auto 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <span style={{
                    color: '#fff',
                    fontSize: 18,
                    fontWeight: 700,
                    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                  }}>
                    {personName.trim().charAt(0).toUpperCase()}
                  </span>
                </div>
                <div style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#333',
                  fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                }}>
                  {personName}
                </div>
              </div>

              {/* Message bubble (iMessage-style) */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: 8,
              }}>
                <div style={{
                  maxWidth: '85%',
                  padding: '12px 16px',
                  borderRadius: '18px 18px 4px 18px',
                  background: '#007AFF',
                  color: '#fff',
                  fontSize: 15,
                  lineHeight: 1.5,
                  fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                  boxShadow: '0 2px 8px rgba(0,122,255,0.2)',
                  wordBreak: 'break-word',
                }}>
                  {message}
                </div>
              </div>

              {/* Delivered indicator */}
              <div style={{
                textAlign: 'right',
                paddingRight: 4,
              }}>
                <span style={{
                  fontSize: 11,
                  color: 'rgba(0,0,0,0.35)',
                  fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                }}>
                  Delivered
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{
            display: 'flex',
            gap: 12,
            marginTop: 20,
            animation: 'cpFadeUp 0.5s ease 0.2s both',
          }}>
            <button
              onClick={handleCopy}
              style={{
                flex: 1,
                padding: '15px 20px',
                borderRadius: 14,
                border: copied
                  ? '1.5px solid #4CAF50'
                  : '1.5px solid rgba(212,168,67,0.25)',
                background: copied
                  ? 'rgba(76,175,80,0.06)'
                  : '#FAF6F0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                if (!copied) {
                  e.currentTarget.style.borderColor = '#D4A843';
                  e.currentTarget.style.background = 'rgba(212,168,67,0.06)';
                }
              }}
              onMouseLeave={e => {
                if (!copied) {
                  e.currentTarget.style.borderColor = 'rgba(212,168,67,0.25)';
                  e.currentTarget.style.background = '#FAF6F0';
                }
              }}
            >
              <span style={{ fontSize: 16 }}>
                {copied ? '\u2713' : '\u{1F4CB}'}
              </span>
              <span style={{
                fontSize: 14,
                fontWeight: 600,
                color: copied ? '#4CAF50' : 'var(--text-primary)',
                fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                transition: 'color 0.3s ease',
              }}>
                {copied ? 'Copied!' : 'Copy message'}
              </span>
            </button>

            <a
              href={getSmsHref()}
              onClick={() => setMessageSent(true)}
              style={{
                flex: 1,
                padding: '15px 20px',
                borderRadius: 14,
                border: '1.5px solid rgba(212,168,67,0.25)',
                background: '#FAF6F0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                textDecoration: 'none',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#D4A843';
                e.currentTarget.style.background = 'rgba(212,168,67,0.06)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(212,168,67,0.25)';
                e.currentTarget.style.background = '#FAF6F0';
              }}
            >
              <span style={{ fontSize: 16 }}>
                {'\u{1F4AC}'}
              </span>
              <span style={{
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--text-primary)',
                fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              }}>
                Send via text
              </span>
            </a>
          </div>

          {/* Edit hint */}
          <p style={{
            fontSize: 12,
            color: 'var(--text-muted)',
            textAlign: 'center',
            margin: '14px 0 0',
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
            fontStyle: 'italic',
            opacity: 0.7,
          }}>
            Feel free to tweak the message to make it more you
          </p>

          {/* Continue to closing */}
          <div style={{
            textAlign: 'center',
            marginTop: 32,
            animation: 'cpFadeUp 0.5s ease 0.4s both',
          }}>
            <button
              onClick={() => transitionTo(5)}
              style={{
                ...styles.secondaryBtn,
              }}
              onMouseEnter={e => {
                e.target.style.background = 'rgba(212,168,67,0.08)';
              }}
              onMouseLeave={e => {
                e.target.style.background = 'transparent';
              }}
            >
              {messageSent ? 'I sent it!' : 'Continue'} {'\u2192'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- STEP 5: CLOSING ---
  if (step === 5) {
    return (
      <div style={styles.container}>
        <style>{cpKeyframes}</style>
        <div style={{
          padding: '48px 24px',
          maxWidth: 500,
          margin: '0 auto',
          textAlign: 'center',
        }}>
          {/* Completion moment */}
          <div style={{
            animation: 'cpFadeIn 0.6s ease',
          }}>
            <div style={{
              fontSize: 48,
              marginBottom: 24,
              animation: 'cpPulse 2s ease-in-out infinite',
            }}>
              {messageSent ? '\u{1F49C}' : '\u{1F4AC}'}
            </div>

            {messageSent && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 18px',
                borderRadius: 20,
                background: 'rgba(76,175,80,0.08)',
                border: '1px solid rgba(76,175,80,0.15)',
                marginBottom: 24,
                animation: 'cpPop 0.4s cubic-bezier(0.16,1,0.3,1)',
              }}>
                <span style={{ color: '#4CAF50', fontSize: 14 }}>{'\u2713'}</span>
                <span style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#4CAF50',
                  fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                }}>
                  Message sent to {personName}
                </span>
              </div>
            )}

            <h2 style={{
              fontFamily: "var(--font-heading), 'Fraunces', serif",
              fontSize: 'clamp(1.3rem, 4vw, 1.7rem)',
              fontWeight: 500,
              color: 'var(--text-primary)',
              lineHeight: 1.35,
              margin: '0 0 16px',
            }}>
              {messageSent
                ? 'That took courage.'
                : 'Whenever you\'re ready, send that message.'}
            </h2>

            {messageSent && (
              <p style={{
                fontSize: 16,
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                margin: '0 0 8px',
                fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              }}>
                You just did something most people only think about.
              </p>
            )}
          </div>

          {/* Wisdom card */}
          <div style={{
            marginTop: 24,
            padding: '28px 24px',
            borderRadius: 20,
            background: 'rgba(155,142,196,0.04)',
            border: '1px solid rgba(155,142,196,0.12)',
            animation: 'cpFadeUp 0.6s ease 0.3s both',
          }}>
            <div style={{
              width: 40,
              height: 1.5,
              background: 'linear-gradient(90deg, transparent, #9B8EC4, transparent)',
              margin: '0 auto 20px',
            }} />

            <p style={{
              fontFamily: "var(--font-heading), 'Fraunces', serif",
              fontSize: 'clamp(1.05rem, 3vw, 1.25rem)',
              fontWeight: 500,
              color: '#9B8EC4',
              lineHeight: 1.55,
              margin: '0 0 12px',
              fontStyle: 'italic',
            }}>
              "You don't have to feel social to BE social."
            </p>

            <p style={{
              fontSize: 15,
              color: 'var(--text-primary)',
              lineHeight: 1.7,
              margin: 0,
              fontWeight: 500,
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
            }}>
              The feeling often follows the action.
            </p>

            <div style={{
              width: 40,
              height: 1.5,
              background: 'linear-gradient(90deg, transparent, #9B8EC4, transparent)',
              margin: '20px auto 0',
            }} />
          </div>

          {/* Research note */}
          <div style={{
            marginTop: 20,
            padding: '14px 18px',
            borderRadius: 12,
            background: 'rgba(212,168,67,0.04)',
            border: '1px solid rgba(212,168,67,0.1)',
            animation: 'cpFadeUp 0.5s ease 0.5s both',
          }}>
            <p style={{
              fontSize: 12,
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              margin: 0,
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
            }}>
              {'\u{1F4D6}'} Research shows that even small acts of social connection can reduce feelings of
              sadness and loneliness within minutes {'\u2014'} regardless of whether you felt like
              reaching out beforehand.
            </p>
          </div>

          {/* Continue button */}
          <div style={{
            marginTop: 32,
            animation: 'cpFadeUp 0.5s ease 0.6s both',
          }}>
            <button
              onClick={onComplete}
              style={styles.primaryBtn}
              onMouseEnter={e => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 24px rgba(212,168,67,0.4)';
              }}
              onMouseLeave={e => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 16px rgba(212,168,67,0.3)';
              }}
            >
              Continue {'\u2192'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// --- KEYFRAME ANIMATIONS ---
const cpKeyframes = `
  @keyframes cpFadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes cpSlideIn {
    from { opacity: 0; transform: translateX(-8px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes cpFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
  @keyframes cpPop {
    0% { transform: scale(0); }
    70% { transform: scale(1.15); }
    100% { transform: scale(1); }
  }
  @keyframes cpBubbleIn {
    0% { opacity: 0; transform: scale(0.92) translateY(16px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes cpFadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes cpPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.08); }
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
    animation: 'cpFadeIn 0.5s ease',
  },
  heading: {
    fontFamily: "var(--font-heading), 'Fraunces', serif",
    fontSize: 'clamp(1.4rem, 4vw, 1.9rem)',
    fontWeight: 500,
    color: 'var(--text-primary)',
    lineHeight: 1.3,
    margin: '0 0 16px',
  },
  progressContainer: {
    marginBottom: 24,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    background: 'rgba(212,168,67,0.12)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    background: 'linear-gradient(90deg, #D4A843, #E8C068)',
    transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)',
  },
  progressLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: '#D4A843',
    fontWeight: 600,
    fontFamily: "'JetBrains Mono', monospace",
    whiteSpace: 'nowrap',
  },
  primaryBtn: {
    padding: '16px 36px',
    borderRadius: 50,
    background: 'linear-gradient(135deg, #D4A843, #C49A38)',
    color: '#fff',
    border: 'none',
    fontSize: 16,
    fontWeight: 600,
    fontFamily: "var(--font-heading), 'Fraunces', serif",
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
    boxShadow: '0 4px 16px rgba(212,168,67,0.3)',
  },
  secondaryBtn: {
    padding: '14px 28px',
    borderRadius: 50,
    background: 'transparent',
    color: '#D4A843',
    border: '1.5px solid rgba(212,168,67,0.3)',
    fontSize: 15,
    fontWeight: 600,
    fontFamily: "var(--font-heading), 'Fraunces', serif",
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};
