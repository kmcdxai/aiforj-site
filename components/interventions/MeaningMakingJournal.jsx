"use client";

import { useState } from 'react';

// --- PROMPTS ---
const PROMPTS = [
  {
    id: 'lesson',
    question: 'What has this difficult period taught you about yourself?',
    placeholder: 'e.g., "I learned that I can sit with discomfort longer than I thought" or "I discovered how much I value connection"',
    rows: 5,
    type: 'textarea',
  },
  {
    id: 'strength',
    question: 'What strength have you discovered that you didn\'t know you had?',
    placeholder: 'e.g., "A quiet patience" or "The ability to ask for help"',
    rows: 4,
    type: 'textarea',
  },
  {
    id: 'chapter-title',
    question: 'If you were writing a book about your life, what would you title this chapter?',
    placeholder: 'e.g., "The Quiet Before" or "Learning to Carry It"',
    type: 'title-input',
  },
  {
    id: 'next-chapter',
    question: 'What do you want the next chapter to say?',
    placeholder: 'e.g., "I found my footing again" or "I let myself be held by the people around me"',
    rows: 4,
    type: 'textarea',
  },
];

// --- ORNAMENTAL DIVIDER (CSS-only decorative element) ---
const OrnamentalDivider = ({ color = 'rgba(122,158,126,0.3)', width = 120 }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    margin: '0 auto',
    width,
  }}>
    <div style={{
      flex: 1,
      height: 1,
      background: `linear-gradient(90deg, transparent, ${color})`,
    }} />
    <div style={{
      width: 6,
      height: 6,
      borderRadius: '50%',
      border: `1.5px solid ${color}`,
      flexShrink: 0,
    }} />
    <div style={{
      flex: 1,
      height: 1,
      background: `linear-gradient(90deg, ${color}, transparent)`,
    }} />
  </div>
);

// --- PROGRESS DOTS ---
const ProgressIndicator = ({ current, total }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 28,
  }}>
    {Array.from({ length: total }, (_, i) => (
      <div
        key={i}
        style={{
          width: i === current ? 28 : 8,
          height: 8,
          borderRadius: 100,
          background: i === current
            ? 'linear-gradient(135deg, #7A9E7E, #9B8EC4)'
            : i < current
              ? 'rgba(122,158,126,0.35)'
              : 'rgba(122,158,126,0.12)',
          transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}
      />
    ))}
    <span style={{
      fontSize: 11,
      fontWeight: 600,
      color: 'rgba(122,158,126,0.6)',
      fontFamily: "'JetBrains Mono', monospace",
      letterSpacing: '0.05em',
      marginLeft: 4,
    }}>
      {current + 1}/{total}
    </span>
  </div>
);

export default function MeaningMakingJournal({ onComplete, emotion }) {
  // step: 0=intro, 1-4=prompts, 5=chapter-page, 6=closing
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    lesson: '',
    strength: '',
    'chapter-title': '',
    'next-chapter': '',
  });
  const [saved, setSaved] = useState(false);
  const [pageRevealed, setPageRevealed] = useState(false);

  const updateAnswer = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const goToChapterPage = () => {
    setStep(5);
    setTimeout(() => setPageRevealed(true), 150);
  };

  const saveToLocalStorage = () => {
    try {
      const existingRaw = localStorage.getItem('meaning_journal_entries');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const entry = {
        id: Date.now(),
        date: new Date().toISOString(),
        emotion: emotion || 'sad',
        chapterTitle: answers['chapter-title'],
        lesson: answers.lesson,
        strength: answers.strength,
        nextChapter: answers['next-chapter'],
      };
      existing.push(entry);
      localStorage.setItem('meaning_journal_entries', JSON.stringify(existing));
      setSaved(true);
    } catch (e) {
      // localStorage may not be available
      setSaved(true);
    }
  };

  // =============================================
  // INTRO
  // =============================================
  if (step === 0) {
    return (
      <div style={styles.container}>
        <div style={{
          ...styles.fadeIn,
          textAlign: 'center',
          padding: '48px 24px',
          maxWidth: 540,
          margin: '0 auto',
        }}>
          {/* Book icon */}
          <div style={{
            fontSize: 48,
            marginBottom: 28,
            animation: 'mmjFloat 3s ease-in-out infinite',
          }}>
            {'\uD83D\uDCD6'}
          </div>

          <h2 style={{
            ...styles.heading,
            textAlign: 'center',
            marginBottom: 24,
          }}>
            The Meaning-Making Journal
          </h2>

          <OrnamentalDivider color="rgba(122,158,126,0.35)" width={100} />

          <p style={{
            fontSize: 17,
            color: 'var(--text-primary)',
            lineHeight: 1.85,
            margin: '28px 0 16px',
            fontWeight: 500,
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
          }}>
            Hard times contain something we rarely look for in the middle: <strong style={{ color: '#7A9E7E' }}>meaning</strong>.
          </p>

          <p style={{
            fontSize: 15.5,
            color: 'var(--text-secondary)',
            lineHeight: 1.85,
            margin: '0 0 12px',
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
          }}>
            This isn{'\u2019'}t toxic positivity {'\u2014'} it{'\u2019'}s finding the thread that helps you carry forward.
          </p>

          <p style={{
            fontSize: 14,
            color: 'var(--text-muted)',
            lineHeight: 1.7,
            margin: '0 0 40px',
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
            fontStyle: 'italic',
          }}>
            Four questions. No right answers. Just you, writing your story.
          </p>

          <button
            onClick={() => setStep(1)}
            style={styles.primaryBtn}
          >
            Open the journal {'\u2192'}
          </button>
        </div>

        <style>{mmjKeyframes}</style>
      </div>
    );
  }

  // =============================================
  // PROMPTS (Steps 1-4)
  // =============================================
  if (step >= 1 && step <= 4) {
    const promptIndex = step - 1;
    const prompt = PROMPTS[promptIndex];
    const currentValue = answers[prompt.id];
    const canProceed = currentValue.trim().length > 0;

    const handleNext = () => {
      if (step < 4) {
        setStep(step + 1);
      } else {
        goToChapterPage();
      }
    };

    return (
      <div style={styles.container}>
        <div style={{
          ...styles.fadeIn,
          padding: '40px 24px',
          maxWidth: 520,
          margin: '0 auto',
        }}>
          <ProgressIndicator current={promptIndex} total={4} />

          {/* Prompt question */}
          <h2 style={{
            ...styles.heading,
            textAlign: prompt.type === 'title-input' ? 'center' : 'left',
            marginBottom: 12,
            fontSize: 'clamp(1.25rem, 3.5vw, 1.7rem)',
          }}>
            {prompt.question}
          </h2>

          {/* Contextual hint for specific prompts */}
          {promptIndex === 0 && (
            <p style={{
              fontSize: 14,
              color: 'var(--text-muted)',
              lineHeight: 1.7,
              margin: '0 0 24px',
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
            }}>
              Take your time. There{'\u2019'}s no word count, no grade. Just honesty.
            </p>
          )}

          {promptIndex === 1 && (
            <p style={{
              fontSize: 14,
              color: 'var(--text-muted)',
              lineHeight: 1.7,
              margin: '0 0 24px',
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
            }}>
              Strength doesn{'\u2019'}t always look strong. Sometimes it{'\u2019'}s just showing up.
            </p>
          )}

          {promptIndex === 2 && (
            <p style={{
              fontSize: 14,
              color: 'var(--text-muted)',
              lineHeight: 1.7,
              margin: '0 0 24px',
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              textAlign: 'center',
            }}>
              Give this season a name. Make it yours.
            </p>
          )}

          {promptIndex === 3 && (
            <p style={{
              fontSize: 14,
              color: 'var(--text-muted)',
              lineHeight: 1.7,
              margin: '0 0 24px',
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
            }}>
              You{'\u2019'}re the author. What happens next is still unwritten.
            </p>
          )}

          {/* Input field */}
          {prompt.type === 'textarea' ? (
            <textarea
              value={currentValue}
              onChange={e => updateAnswer(prompt.id, e.target.value)}
              placeholder={prompt.placeholder}
              rows={prompt.rows || 4}
              style={{
                width: '100%',
                padding: '18px 22px',
                border: '1.5px solid rgba(122,158,126,0.2)',
                borderRadius: 16,
                background: 'rgba(122,158,126,0.03)',
                fontSize: 16,
                color: 'var(--text-primary)',
                fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                lineHeight: 1.7,
                resize: 'vertical',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                minHeight: prompt.rows ? `${prompt.rows * 28 + 36}px` : '148px',
              }}
              onFocus={e => {
                e.target.style.borderColor = '#7A9E7E';
                e.target.style.boxShadow = '0 0 0 4px rgba(122,158,126,0.1)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'rgba(122,158,126,0.2)';
                e.target.style.boxShadow = 'none';
              }}
            />
          ) : (
            /* Chapter title input - special styling */
            <div style={{
              padding: currentValue.trim() ? '28px 24px' : '0',
              border: currentValue.trim()
                ? '2px solid rgba(122,158,126,0.2)'
                : 'none',
              borderRadius: 20,
              background: currentValue.trim()
                ? 'rgba(122,158,126,0.03)'
                : 'transparent',
              transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
              marginBottom: 8,
            }}>
              {currentValue.trim() && (
                <div style={{
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.35em',
                  color: '#7A9E7E',
                  textAlign: 'center',
                  marginBottom: 12,
                  fontFamily: "'JetBrains Mono', monospace",
                  animation: 'mmjFadeIn 0.3s ease',
                }}>
                  Chapter Title
                </div>
              )}
              <input
                type="text"
                value={currentValue}
                onChange={e => updateAnswer(prompt.id, e.target.value)}
                placeholder={prompt.placeholder}
                style={{
                  width: '100%',
                  padding: '16px 8px',
                  border: 'none',
                  borderBottom: currentValue.trim()
                    ? 'none'
                    : '2px solid rgba(122,158,126,0.25)',
                  background: 'transparent',
                  fontSize: currentValue.trim()
                    ? 'clamp(1.4rem, 4vw, 2rem)'
                    : '17px',
                  fontFamily: currentValue.trim()
                    ? "var(--font-heading), 'Fraunces', serif"
                    : "var(--font-body), 'DM Sans', sans-serif",
                  fontWeight: currentValue.trim() ? 500 : 400,
                  color: 'var(--text-primary)',
                  textAlign: 'center',
                  outline: 'none',
                  transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                  boxSizing: 'border-box',
                  lineHeight: 1.3,
                }}
                onFocus={e => {
                  if (!currentValue.trim()) {
                    e.target.style.borderBottomColor = '#7A9E7E';
                  }
                }}
                onBlur={e => {
                  if (!currentValue.trim()) {
                    e.target.style.borderBottomColor = 'rgba(122,158,126,0.25)';
                  }
                }}
              />
            </div>
          )}

          {/* Navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: step > 1 ? 'space-between' : 'center',
            marginTop: 28,
            gap: 12,
          }}>
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                style={styles.backBtn}
              >
                {'\u2190'} Back
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={!canProceed}
              style={{
                ...styles.primaryBtn,
                opacity: canProceed ? 1 : 0.4,
                cursor: canProceed ? 'pointer' : 'not-allowed',
              }}
            >
              {step < 4 ? 'Next \u2192' : 'See your chapter \u2192'}
            </button>
          </div>
        </div>

        <style>{mmjKeyframes}</style>
      </div>
    );
  }

  // =============================================
  // CHAPTER PAGE (Step 5) - Book-page aesthetic
  // =============================================
  if (step === 5) {
    const chapterTitle = answers['chapter-title'];
    const lesson = answers.lesson;
    const strength = answers.strength;
    const nextChapter = answers['next-chapter'];

    return (
      <div style={styles.container}>
        <div style={{
          padding: '32px 16px',
          maxWidth: 560,
          margin: '0 auto',
        }}>
          {/* ---- THE BOOK PAGE ---- */}
          <div style={{
            position: 'relative',
            background: '#FAF6F0',
            borderRadius: 4,
            padding: '56px 40px 48px',
            boxShadow: `
              0 1px 3px rgba(0,0,0,0.06),
              0 8px 32px rgba(0,0,0,0.08),
              inset 0 0 80px rgba(122,158,126,0.03),
              4px 0 12px -4px rgba(0,0,0,0.05)
            `,
            border: '1px solid rgba(0,0,0,0.06)',
            opacity: pageRevealed ? 1 : 0,
            transform: pageRevealed
              ? 'scale(1) translateY(0)'
              : 'scale(0.95) translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            overflow: 'hidden',
          }}>
            {/* Paper texture overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: `
                radial-gradient(ellipse at 20% 50%, rgba(122,158,126,0.02) 0%, transparent 70%),
                radial-gradient(ellipse at 80% 20%, rgba(155,142,196,0.02) 0%, transparent 60%)
              `,
              pointerEvents: 'none',
            }} />

            {/* Spine shadow on left edge */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: 20,
              background: 'linear-gradient(90deg, rgba(0,0,0,0.03), transparent)',
              pointerEvents: 'none',
            }} />

            {/* Page fold hint on top-right */}
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 28,
              height: 28,
              background: 'linear-gradient(225deg, rgba(0,0,0,0.04) 50%, transparent 50%)',
              pointerEvents: 'none',
            }} />

            {/* ---- TOP DECORATIVE BORDER ---- */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              marginBottom: 36,
              paddingBottom: 28,
              borderBottom: '1px solid rgba(122,158,126,0.12)',
              position: 'relative',
            }}>
              <div style={{
                width: 32,
                height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(122,158,126,0.3))',
              }} />
              <div style={{
                display: 'flex',
                gap: 6,
                alignItems: 'center',
              }}>
                <div style={{
                  width: 3,
                  height: 3,
                  borderRadius: '50%',
                  background: 'rgba(122,158,126,0.3)',
                }} />
                <div style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  border: '1px solid rgba(122,158,126,0.3)',
                }} />
                <div style={{
                  width: 3,
                  height: 3,
                  borderRadius: '50%',
                  background: 'rgba(122,158,126,0.3)',
                }} />
              </div>
              <div style={{
                width: 32,
                height: 1,
                background: 'linear-gradient(90deg, rgba(122,158,126,0.3), transparent)',
              }} />
            </div>

            {/* ---- CHAPTER HEADER ---- */}
            <div style={{
              textAlign: 'center',
              marginBottom: 36,
            }}>
              <div style={{
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.35em',
                color: 'rgba(122,158,126,0.6)',
                marginBottom: 16,
                fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                fontWeight: 600,
              }}>
                Chapter
              </div>

              <h1 style={{
                fontFamily: "var(--font-heading), 'Fraunces', serif",
                fontSize: 'clamp(1.6rem, 5vw, 2.4rem)',
                fontWeight: 500,
                color: '#2A2520',
                lineHeight: 1.25,
                margin: '0 0 20px',
                padding: '0 8px',
                fontStyle: 'italic',
              }}>
                {chapterTitle}
              </h1>

              <OrnamentalDivider
                color="rgba(122,158,126,0.3)"
                width={80}
              />
            </div>

            {/* ---- BODY SECTIONS ---- */}
            <div style={{
              textAlign: 'left',
              marginBottom: 36,
            }}>
              {/* Lesson section */}
              <div style={{
                marginBottom: 32,
                opacity: pageRevealed ? 1 : 0,
                transform: pageRevealed ? 'translateY(0)' : 'translateY(8px)',
                transition: 'all 0.6s ease 0.3s',
              }}>
                <div style={{
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.25em',
                  color: 'rgba(122,158,126,0.5)',
                  marginBottom: 10,
                  fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                  fontWeight: 600,
                }}>
                  What I Learned
                </div>
                <p style={{
                  fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                  fontSize: 15.5,
                  color: '#3D3530',
                  lineHeight: 1.85,
                  margin: 0,
                  textIndent: '1.5em',
                }}>
                  {lesson}
                </p>
              </div>

              {/* Strength section */}
              <div style={{
                marginBottom: 32,
                opacity: pageRevealed ? 1 : 0,
                transform: pageRevealed ? 'translateY(0)' : 'translateY(8px)',
                transition: 'all 0.6s ease 0.5s',
              }}>
                <div style={{
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.25em',
                  color: 'rgba(122,158,126,0.5)',
                  marginBottom: 10,
                  fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                  fontWeight: 600,
                }}>
                  A Strength Discovered
                </div>
                <p style={{
                  fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                  fontSize: 15.5,
                  color: '#3D3530',
                  lineHeight: 1.85,
                  margin: 0,
                  textIndent: '1.5em',
                }}>
                  {strength}
                </p>
              </div>
            </div>

            {/* ---- THIN DIVIDER ---- */}
            <div style={{
              width: '60%',
              height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(122,158,126,0.18), transparent)',
              margin: '0 auto 32px',
              opacity: pageRevealed ? 1 : 0,
              transition: 'opacity 0.6s ease 0.6s',
            }} />

            {/* ---- NEXT CHAPTER ---- */}
            <div style={{
              textAlign: 'center',
              opacity: pageRevealed ? 1 : 0,
              transform: pageRevealed ? 'translateY(0)' : 'translateY(8px)',
              transition: 'all 0.6s ease 0.7s',
            }}>
              <div style={{
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.25em',
                color: 'rgba(155,142,196,0.5)',
                marginBottom: 12,
                fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                fontWeight: 600,
              }}>
                Next Chapter
              </div>
              <p style={{
                fontFamily: "var(--font-heading), 'Fraunces', serif",
                fontSize: 'clamp(1rem, 3vw, 1.2rem)',
                color: '#9B8EC4',
                lineHeight: 1.7,
                margin: 0,
                fontStyle: 'italic',
                fontWeight: 400,
                padding: '0 12px',
              }}>
                {nextChapter}
              </p>
            </div>

            {/* ---- BOTTOM DECORATIVE BORDER ---- */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginTop: 36,
              paddingTop: 28,
              borderTop: '1px solid rgba(122,158,126,0.12)',
            }}>
              <div style={{
                width: 24,
                height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(122,158,126,0.25))',
              }} />
              <div style={{
                fontSize: 14,
                color: 'rgba(122,158,126,0.3)',
                lineHeight: 1,
              }}>
                {'\u2766'}
              </div>
              <div style={{
                width: 24,
                height: 1,
                background: 'linear-gradient(90deg, rgba(122,158,126,0.25), transparent)',
              }} />
            </div>
          </div>

          {/* ---- ACTIONS BELOW THE PAGE ---- */}
          <div style={{
            textAlign: 'center',
            marginTop: 32,
            opacity: pageRevealed ? 1 : 0,
            transform: pageRevealed ? 'translateY(0)' : 'translateY(12px)',
            transition: 'all 0.6s ease 0.9s',
          }}>
            {/* Save button */}
            <button
              onClick={saveToLocalStorage}
              disabled={saved}
              style={{
                padding: '14px 32px',
                borderRadius: 50,
                background: saved
                  ? 'rgba(122,158,126,0.12)'
                  : 'transparent',
                color: saved ? '#7A9E7E' : '#7A9E7E',
                border: saved
                  ? '1.5px solid rgba(122,158,126,0.2)'
                  : '1.5px solid rgba(122,158,126,0.35)',
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                cursor: saved ? 'default' : 'pointer',
                transition: 'all 0.3s ease',
                marginBottom: 20,
                letterSpacing: '0.02em',
              }}
            >
              {saved ? '\u2713 Page saved' : 'Save this page'}
            </button>

            <div style={{
              width: 40,
              height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent)',
              margin: '0 auto 20px',
            }} />

            <button
              onClick={() => setStep(6)}
              style={{
                ...styles.primaryBtn,
                background: 'linear-gradient(135deg, #7A9E7E, #6B8F6F)',
                boxShadow: '0 4px 16px rgba(122,158,126,0.3)',
              }}
            >
              Continue {'\u2192'}
            </button>
          </div>
        </div>

        <style>{mmjKeyframes}</style>
      </div>
    );
  }

  // =============================================
  // CLOSING (Step 6)
  // =============================================
  if (step === 6) {
    return (
      <div style={styles.container}>
        <div style={{
          ...styles.fadeIn,
          textAlign: 'center',
          padding: '56px 24px',
          maxWidth: 480,
          margin: '0 auto',
        }}>
          {/* Feather pen icon */}
          <div style={{
            fontSize: 40,
            marginBottom: 32,
            animation: 'mmjFloat 3s ease-in-out infinite',
          }}>
            {'\uD83E\uDEB6'}
          </div>

          <OrnamentalDivider color="rgba(122,158,126,0.3)" width={80} />

          <div style={{ marginTop: 28, marginBottom: 36 }}>
            <p style={{
              fontFamily: "var(--font-heading), 'Fraunces', serif",
              fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
              fontWeight: 500,
              color: 'var(--text-primary)',
              lineHeight: 1.45,
              margin: '0 0 20px',
            }}>
              Your story isn{'\u2019'}t over.
            </p>
            <p style={{
              fontFamily: "var(--font-heading), 'Fraunces', serif",
              fontSize: 'clamp(1.1rem, 3.5vw, 1.5rem)',
              fontWeight: 400,
              color: '#7A9E7E',
              lineHeight: 1.5,
              margin: '0 0 24px',
              fontStyle: 'italic',
            }}>
              It{'\u2019'}s not even close.
            </p>

            <p style={{
              fontSize: 15,
              color: 'var(--text-secondary)',
              lineHeight: 1.8,
              margin: '0 0 16px',
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
            }}>
              Narrative therapy teaches us that we are not our pain {'\u2014'} we are the ones who give it a name, find its lessons, and decide what comes next.
            </p>

            <p style={{
              fontSize: 14,
              color: 'var(--text-muted)',
              lineHeight: 1.7,
              margin: '0 0 40px',
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
            }}>
              You just wrote a page worth keeping. The next one is already yours.
            </p>
          </div>

          <OrnamentalDivider color="rgba(155,142,196,0.25)" width={60} />

          <div style={{ marginTop: 36 }}>
            <button
              onClick={onComplete}
              style={{
                ...styles.primaryBtn,
                background: 'linear-gradient(135deg, #9B8EC4, #8A7DB3)',
                boxShadow: '0 4px 16px rgba(155,142,196,0.3)',
              }}
            >
              Continue {'\u2192'}
            </button>
          </div>
        </div>

        <style>{mmjKeyframes}</style>
      </div>
    );
  }

  return null;
}

// =============================================
// KEYFRAME ANIMATIONS
// =============================================
const mmjKeyframes = `
  @keyframes mmjFadeIn {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes mmjFloat {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-6px);
    }
  }
`;

// =============================================
// STYLES
// =============================================
const styles = {
  container: {
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '20px 0 100px',
  },
  fadeIn: {
    animation: 'mmjFadeIn 0.5s ease',
  },
  heading: {
    fontFamily: "var(--font-heading), 'Fraunces', serif",
    fontSize: 'clamp(1.4rem, 4vw, 1.9rem)',
    fontWeight: 500,
    color: 'var(--text-primary)',
    lineHeight: 1.3,
    margin: '0 0 16px',
  },
  primaryBtn: {
    padding: '16px 36px',
    borderRadius: 50,
    background: 'linear-gradient(135deg, #7A9E7E, #6B8F6F)',
    color: '#fff',
    border: 'none',
    fontSize: 16,
    fontWeight: 600,
    fontFamily: "var(--font-heading), 'Fraunces', serif",
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
    boxShadow: '0 4px 16px rgba(122,158,126,0.3)',
  },
  backBtn: {
    padding: '14px 24px',
    borderRadius: 50,
    background: 'transparent',
    color: 'var(--text-muted)',
    border: '1.5px solid rgba(122,158,126,0.15)',
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};
