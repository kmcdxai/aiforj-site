"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

const TOTAL_CYCLES = 3;
const PHASES = [
  { label: 'Inhale', duration: 2000, scale: 0.7 },
  { label: 'Inhale again', duration: 1000, scale: 1.0 },
  { label: 'Exhale slowly', duration: 4000, scale: 0.35 },
];
const PAUSE_DURATION = 2000;

export default function PhysiologicalSigh({ onComplete }) {
  const [stage, setStage] = useState('intro'); // intro, breathing, done
  const [cycle, setCycle] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  const currentPhase = PHASES[phaseIndex];

  const advancePhase = useCallback(() => {
    if (isPaused) return;

    const nextPhase = phaseIndex + 1;
    if (nextPhase < PHASES.length) {
      setPhaseIndex(nextPhase);
      setProgress(0);
    } else {
      // End of cycle
      const nextCycle = cycle + 1;
      if (nextCycle < TOTAL_CYCLES) {
        setIsPaused(true);
        setProgress(0);
        setTimeout(() => {
          setCycle(nextCycle);
          setPhaseIndex(0);
          setIsPaused(false);
          setProgress(0);
        }, PAUSE_DURATION);
      } else {
        setStage('done');
      }
    }
  }, [phaseIndex, cycle, isPaused]);

  // Timer for phase progression
  useEffect(() => {
    if (stage !== 'breathing' || isPaused) return;

    startRef.current = Date.now();
    const duration = currentPhase.duration;

    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const p = Math.min(1, elapsed / duration);
      setProgress(p);
      if (p >= 1) {
        advancePhase();
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [stage, phaseIndex, cycle, isPaused, currentPhase, advancePhase]);

  // Haptic feedback on phase change
  useEffect(() => {
    if (stage === 'breathing' && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(30);
    }
  }, [phaseIndex, stage]);

  const handleStart = () => {
    setStage('breathing');
    setCycle(0);
    setPhaseIndex(0);
    setProgress(0);
    setIsPaused(false);
  };

  // --- INTRO ---
  if (stage === 'intro') {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.fadeIn, textAlign: 'center', padding: '48px 24px', maxWidth: 500, margin: '0 auto' }}>
          <div style={{ fontSize: 48, marginBottom: 24 }}>{'\u{1F343}'}</div>
          <h2 style={styles.heading}>
            The physiological sigh is a fast evidence-framed way to calm your nervous system.
          </h2>
          <p style={styles.subtext}>
            Studied by Stanford researchers as a promising real-time stress-reduction technique. We'll do 3 cycles together.
          </p>
          <button onClick={handleStart} style={styles.primaryBtn}>
            Begin breathing {'\u2192'}
          </button>
        </div>
      </div>
    );
  }

  // --- DONE ---
  if (stage === 'done') {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.fadeIn, textAlign: 'center', padding: '40px 24px', maxWidth: 520, margin: '0 auto' }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>{'\u2728'}</div>
          <h2 style={{ ...styles.heading, marginBottom: 16 }}>
            That's it. Three physiological sighs.
          </h2>
          <p style={{ ...styles.subtext, marginBottom: 24 }}>
            The double inhale reinflates the tiny sacs in your lungs, and the extended exhale activates your parasympathetic nervous system {'\u2014'} your body's built-in calm-down system.
          </p>

          {/* Evidence card */}
          <div style={{
            padding: '20px 24px',
            background: 'rgba(122,158,126,0.06)',
            borderRadius: 16,
            border: '1px solid rgba(122,158,126,0.12)',
            textAlign: 'left',
            marginBottom: 32,
          }}>
            <div style={{
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--sage-deep)',
              fontWeight: 600,
              marginBottom: 8,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              The evidence
            </div>
            <p style={{
              fontSize: 14,
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              margin: 0,
            }}>
              Huberman Lab / Stanford, 2023: Cyclic physiological sighing for 5 minutes reduced anxiety and improved mood more effectively than mindfulness meditation.
            </p>
          </div>

          <button onClick={onComplete} style={styles.primaryBtn}>
            Continue {'\u2192'}
          </button>
        </div>
      </div>
    );
  }

  // --- BREATHING ---
  const targetScale = isPaused ? 0.4 : currentPhase.scale;
  const label = isPaused ? 'Good. Again.' : currentPhase.label;

  // Ring progress: proportion of current phase complete
  const circumference = 2 * Math.PI * 120;
  const ringOffset = circumference * (1 - (isPaused ? 0 : progress));

  return (
    <div style={styles.container}>
      <div style={{ textAlign: 'center', padding: '24px', maxWidth: 480, margin: '0 auto' }}>
        {/* Cycle counter */}
        <div style={{
          fontSize: 13,
          fontFamily: "'JetBrains Mono', monospace",
          color: 'var(--text-muted)',
          marginBottom: 40,
          letterSpacing: '0.08em',
        }}>
          Cycle {cycle + 1} of {TOTAL_CYCLES}
        </div>

        {/* Breathing animation container */}
        <div style={{
          position: 'relative',
          width: 280,
          height: 280,
          margin: '0 auto 40px',
        }}>
          {/* Timer ring */}
          <svg width="280" height="280" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: 'rotate(-90deg)',
          }}>
            <circle
              cx="140" cy="140" r="120"
              fill="none"
              stroke="rgba(122,158,126,0.1)"
              strokeWidth="3"
            />
            <circle
              cx="140" cy="140" r="120"
              fill="none"
              stroke="var(--accent-sage)"
              strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={ringOffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.1s linear' }}
            />
          </svg>

          {/* Organic breathing shape */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${targetScale})`,
            width: 180,
            height: 180,
            borderRadius: '42% 58% 63% 37% / 55% 42% 58% 45%',
            background: 'radial-gradient(circle at 40% 40%, var(--accent-sage-light, rgba(122,158,126,0.3)), var(--accent-sage, #7A9E7E))',
            boxShadow: '0 8px 40px rgba(122,158,126,0.25)',
            transition: `transform ${isPaused ? '0.5s' : currentPhase.duration + 'ms'} cubic-bezier(0.4, 0, 0.2, 1)`,
          }} />

          {/* Inner glow */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${targetScale * 0.6})`,
            width: 180,
            height: 180,
            borderRadius: '55% 45% 50% 50% / 45% 55% 45% 55%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.3), transparent)',
            transition: `transform ${isPaused ? '0.5s' : currentPhase.duration + 'ms'} cubic-bezier(0.4, 0, 0.2, 1)`,
            pointerEvents: 'none',
          }} />
        </div>

        {/* Phase label */}
        <div style={{
          fontSize: 'clamp(1.3rem, 3.5vw, 1.75rem)',
          fontFamily: "'Fraunces', serif",
          fontWeight: 500,
          color: isPaused ? 'var(--text-muted)' : 'var(--text-primary)',
          marginBottom: 8,
          transition: 'color 0.3s ease',
          minHeight: 40,
        }}>
          {label}
        </div>

        {/* Phase indicator dots */}
        {!isPaused && (
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
            {PHASES.map((_, i) => (
              <div key={i} style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: i <= phaseIndex ? 'var(--accent-sage)' : 'rgba(122,158,126,0.2)',
                transition: 'background 0.3s ease',
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Ambient background breathing */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: `radial-gradient(circle at 50% 50%, rgba(122,158,126,${0.03 + targetScale * 0.04}), transparent 70%)`,
        transition: `background ${currentPhase?.duration || 500}ms ease`,
        pointerEvents: 'none',
        zIndex: -1,
      }} />

      <style>{`
        @keyframes sighFadeIn {
          from { opacity: 0; transform: translateY(12px); }
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
    animation: 'sighFadeIn 0.5s ease',
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
  primaryBtn: {
    padding: '16px 36px',
    borderRadius: 50,
    background: 'var(--interactive)',
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
