"use client";

import { useState } from 'react';

export default function NameTheStory({ onComplete }) {
  const [step, setStep] = useState(0); // 0=intro, 1=capture, 2=name, 3=poster, 4=defusion
  const [thought, setThought] = useState('');
  const [movieTitle, setMovieTitle] = useState('');
  const [defusionLevel, setDefusionLevel] = useState(0);

  // --- INTRO ---
  if (step === 0) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.fadeIn, textAlign: 'center', padding: '48px 24px', maxWidth: 520, margin: '0 auto' }}>
          <div style={{ fontSize: 48, marginBottom: 24 }}>{'\u{1F3AC}'}</div>
          <h2 style={styles.heading}>
            Your mind is telling you a story right now {'\u2014'} and it feels absolutely real.
          </h2>
          <p style={styles.subtext}>
            But thoughts are just thoughts. Let's create some distance.
          </p>
          <button onClick={() => setStep(1)} style={styles.primaryBtn}>
            Let's start {'\u2192'}
          </button>
        </div>
      </div>
    );
  }

  // --- STEP 1: CAPTURE THOUGHT ---
  if (step === 1) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.fadeIn, padding: '40px 24px', maxWidth: 500, margin: '0 auto' }}>
          <div style={styles.stepLabel}>Step 1 of 3</div>
          <h2 style={{ ...styles.heading, textAlign: 'left' }}>
            What's the anxious thought running through your mind?
          </h2>
          <textarea
            value={thought}
            onChange={e => setThought(e.target.value)}
            placeholder={'e.g., "Something terrible is going to happen" or "I can\'t handle this"'}
            rows={4}
            style={{
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
            }}
            onFocus={e => { e.target.style.borderColor = '#9B8EC4'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(155,142,196,0.2)'; }}
          />
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button
              onClick={() => setStep(2)}
              disabled={!thought.trim()}
              style={{
                ...styles.primaryBtn,
                opacity: thought.trim() ? 1 : 0.4,
                cursor: thought.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              Next {'\u2192'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- STEP 2: NAME THE MOVIE ---
  if (step === 2) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.fadeIn, padding: '40px 24px', maxWidth: 500, margin: '0 auto' }}>
          <div style={styles.stepLabel}>Step 2 of 3</div>

          {/* Display their thought */}
          <div style={{
            padding: '16px 20px',
            background: 'rgba(155,142,196,0.06)',
            borderRadius: 12,
            marginBottom: 24,
            borderLeft: '3px solid rgba(155,142,196,0.3)',
          }}>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: 0, fontStyle: 'italic', lineHeight: 1.6 }}>
              "{thought}"
            </p>
          </div>

          <h2 style={{ ...styles.heading, textAlign: 'left' }}>
            If this thought were a movie, what would you call it?
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 16px' }}>
            Be creative. Make it dramatic, funny, or absurd.
          </p>

          {/* Movie title input with poster frame */}
          <div style={{
            padding: movieTitle.trim() ? '24px' : '0',
            border: movieTitle.trim() ? '2px solid rgba(155,142,196,0.25)' : 'none',
            borderRadius: 16,
            background: movieTitle.trim() ? 'rgba(155,142,196,0.04)' : 'transparent',
            transition: 'all 0.3s ease',
            marginBottom: 24,
          }}>
            {movieTitle.trim() && (
              <div style={{
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: '#9B8EC4',
                textAlign: 'center',
                marginBottom: 8,
              }}>
                Now showing
              </div>
            )}
            <input
              type="text"
              value={movieTitle}
              onChange={e => setMovieTitle(e.target.value)}
              placeholder={'e.g., "The Catastrophe Show" or "Everything Falls Apart: Part 47"'}
              style={{
                width: '100%',
                padding: '14px 4px',
                border: 'none',
                borderBottom: '2px solid rgba(155,142,196,0.3)',
                background: 'transparent',
                fontSize: movieTitle.trim() ? 20 : 16,
                fontFamily: movieTitle.trim() ? "'Fraunces', serif" : "'DM Sans', sans-serif",
                fontWeight: movieTitle.trim() ? 600 : 400,
                color: 'var(--text-primary)',
                textAlign: movieTitle.trim() ? 'center' : 'left',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
              }}
              onFocus={e => { e.target.style.borderBottomColor = '#9B8EC4'; }}
              onBlur={e => { e.target.style.borderBottomColor = 'rgba(155,142,196,0.3)'; }}
            />
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => setStep(3)}
              disabled={!movieTitle.trim()}
              style={{
                ...styles.primaryBtn,
                opacity: movieTitle.trim() ? 1 : 0.4,
                cursor: movieTitle.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              See the poster {'\u2192'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- STEP 3: MOVIE POSTER ---
  if (step === 3) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.fadeIn, padding: '32px 24px', maxWidth: 500, margin: '0 auto' }}>
          {/* Movie poster */}
          <div style={{
            padding: '40px 32px',
            background: 'linear-gradient(180deg, #2C2520 0%, #3D3530 50%, #2C2520 100%)',
            borderRadius: 20,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: 28,
            boxShadow: '0 12px 48px rgba(0,0,0,0.2)',
            animation: 'posterReveal 0.6s cubic-bezier(0.16,1,0.3,1)',
          }}>
            {/* Film grain overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
              opacity: 0.04,
              mixBlendMode: 'overlay',
              pointerEvents: 'none',
            }} />

            {/* Decorative border */}
            <div style={{
              position: 'absolute',
              inset: 12,
              border: '1px solid rgba(155,142,196,0.2)',
              borderRadius: 12,
              pointerEvents: 'none',
            }} />

            {/* NOW SHOWING */}
            <div style={{
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.35em',
              color: '#9B8EC4',
              marginBottom: 24,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              Now showing
            </div>

            {/* Movie title */}
            <h2 style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 'clamp(1.5rem, 5vw, 2.2rem)',
              fontWeight: 600,
              color: '#FAF6F0',
              lineHeight: 1.2,
              margin: '0 0 28px',
              padding: '0 8px',
            }}>
              {movieTitle}
            </h2>

            {/* Divider */}
            <div style={{
              width: 48,
              height: 1,
              background: 'rgba(155,142,196,0.3)',
              margin: '0 auto 24px',
            }} />

            {/* Credits */}
            <div style={{
              fontSize: 12,
              color: 'rgba(250,246,240,0.5)',
              lineHeight: 2,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              <div>Directed by: <span style={{ color: '#9B8EC4' }}>Your Anxious Mind</span></div>
              <div>Starring: <span style={{ color: 'rgba(250,246,240,0.7)' }}>You (but you don't have to watch)</span></div>
            </div>
          </div>

          {/* Insight text */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <p style={{
              fontSize: 16,
              color: 'var(--text-primary)',
              lineHeight: 1.7,
              fontWeight: 500,
              margin: '0 0 12px',
            }}>
              Notice something?
            </p>
            <p style={{
              fontSize: 15,
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              margin: '0 0 12px',
            }}>
              You just stepped <strong style={{ color: 'var(--text-primary)' }}>outside</strong> the thought. You're no longer <em>in</em> the story {'\u2014'} you're looking <em>at</em> it.
            </p>
            <p style={{
              fontSize: 14,
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              margin: 0,
            }}>
              This is cognitive defusion {'\u2014'} an ACT technique. The thought hasn't changed, but your relationship to it just did.
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button onClick={() => { setStep(4); setDefusionLevel(0); }} style={styles.primaryBtn}>
              Practice the distance {'\u2192'}
            </button>
          </div>
        </div>
        <style>{`
          @keyframes posterReveal {
            from { opacity: 0; transform: scale(0.92) translateY(16px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // --- STEP 4: PROGRESSIVE DEFUSION ---
  const defusionSteps = [
    { text: thought, label: 'The raw thought:', style: { fontSize: 18, fontWeight: 500, color: 'var(--text-primary)', opacity: 1 } },
    { text: `I'm having the thought that ${thought.charAt(0).toLowerCase()}${thought.slice(1)}`, label: 'Add distance:', style: { fontSize: 16, color: 'var(--text-secondary)', opacity: 0.85 } },
    { text: `I notice my mind is playing "${movieTitle}" again`, label: 'Full distance:', style: { fontSize: 15, color: 'var(--text-muted)', opacity: 0.7 } },
  ];

  const currentDefusion = defusionSteps[defusionLevel];
  const isLastDefusion = defusionLevel >= defusionSteps.length - 1;

  return (
    <div style={styles.container}>
      <div style={{ padding: '40px 24px', maxWidth: 500, margin: '0 auto' }}>
        <div style={styles.stepLabel}>Creating distance</div>

        {/* Progress */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          {defusionSteps.map((_, i) => (
            <div key={i} style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background: i <= defusionLevel ? '#9B8EC4' : 'rgba(155,142,196,0.15)',
              transition: 'background 0.3s ease',
            }} />
          ))}
        </div>

        {/* Defusion card */}
        <div key={defusionLevel} style={{
          padding: '28px 24px',
          background: 'var(--surface-elevated)',
          borderRadius: 20,
          boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
          border: '1px solid rgba(155,142,196,0.1)',
          marginBottom: 28,
          animation: 'defusionFade 0.4s ease',
        }}>
          <div style={{
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: '#9B8EC4',
            fontWeight: 600,
            marginBottom: 12,
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {currentDefusion.label}
          </div>
          <p style={{
            ...currentDefusion.style,
            lineHeight: 1.6,
            margin: 0,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            "{currentDefusion.text}"
          </p>
        </div>

        {/* Insight for last level */}
        {isLastDefusion && (
          <p style={{
            fontSize: 15,
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            textAlign: 'center',
            marginBottom: 24,
            animation: 'defusionFade 0.5s ease 0.2s both',
          }}>
            Next time this thought shows up, you can say: "Oh, there's <em>{movieTitle}</em> again." It loses power every time.
          </p>
        )}

        <div style={{ textAlign: 'center' }}>
          {!isLastDefusion ? (
            <button
              onClick={() => setDefusionLevel(defusionLevel + 1)}
              style={styles.primaryBtn}
            >
              Add more distance {'\u2192'}
            </button>
          ) : (
            <button onClick={onComplete} style={styles.primaryBtn}>
              Continue {'\u2192'}
            </button>
          )}
        </div>
      </div>
      <style>{`
        @keyframes defusionFade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
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
    animation: 'defusionFade 0.5s ease',
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
