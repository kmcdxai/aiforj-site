"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

// --- Zone definitions ---
const ZONES = [
  {
    id: 'head',
    label: 'Head / Forehead',
    cx: 90, cy: 32, rx: 28, ry: 22,
    duration: 45,
    instruction: 'Place your fingertips on your forehead. Apply gentle pressure and slowly sweep outward toward your temples. Repeat 3 times.',
    type: 'simple',
  },
  {
    id: 'jaw',
    label: 'Jaw / Face',
    cx: 90, cy: 58, rx: 22, ry: 14,
    duration: 30,
    instruction: 'Unclench your jaw. Let your mouth fall slightly open. Now slowly move your jaw side to side 5 times. Let it hang loose.',
    type: 'simple',
  },
  {
    id: 'throat',
    label: 'Throat',
    cx: 90, cy: 82, rx: 16, ry: 12,
    duration: 30,
    instruction: 'Place one hand gently on your throat. Hum at a low pitch for 10 seconds \u2014 the vibration activates the vagus nerve.',
    type: 'hum',
  },
  {
    id: 'chest',
    label: 'Chest',
    cx: 90, cy: 124, rx: 36, ry: 28,
    duration: 36,
    instruction: 'Place both hands on your chest. Breathe IN through your nose, expanding your chest into your hands (4s). Hold (2s). Exhale through pursed lips (6s). Feel your chest soften.',
    type: 'breathe-chest',
    cycles: 3,
    phases: [
      { label: 'Inhale', seconds: 4 },
      { label: 'Hold', seconds: 2 },
      { label: 'Exhale', seconds: 6 },
    ],
  },
  {
    id: 'stomach',
    label: 'Stomach / Gut',
    cx: 90, cy: 170, rx: 30, ry: 24,
    duration: 30,
    instruction: 'Place your hands on your belly. Breathe into your hands \u2014 belly rises on inhale, falls on exhale.',
    type: 'breathe-belly',
    cycles: 3,
    phases: [
      { label: 'Inhale', seconds: 5 },
      { label: 'Exhale', seconds: 5 },
    ],
  },
  {
    id: 'shoulders',
    label: 'Shoulders',
    cx: 90, cy: 100, rx: 52, ry: 14,
    duration: 30,
    instruction: 'Inhale and squeeze your shoulders up toward your ears as HIGH as you can (5s). Now DROP them. Feel the contrast.',
    type: 'tense-release',
    cycles: 3,
    phases: [
      { label: 'Squeeze UP', seconds: 5 },
      { label: 'Release & feel', seconds: 5 },
    ],
  },
  {
    id: 'hands',
    label: 'Hands',
    cx: 90, cy: 230, rx: 48, ry: 14,
    duration: 20,
    instruction: 'Make the tightest fists you can (5s). Now release and spread your fingers wide. Shake your hands loosely for 10 seconds.',
    type: 'simple',
  },
  {
    id: 'legs',
    label: 'Legs / Feet',
    cx: 90, cy: 320, rx: 32, ry: 50,
    duration: 20,
    instruction: 'Press your feet firmly into the floor. Feel the ground holding you. Now curl your toes tight (5s), then release. Wiggle your toes.',
    type: 'simple',
  },
];

// --- SVG body silhouette path (gender-neutral, minimal outline) ---
const BODY_PATH = `
  M 90 12
  C 72 12, 62 24, 62 36
  C 62 50, 72 62, 82 66
  L 78 72
  C 74 74, 72 78, 72 82
  L 72 86
  C 72 90, 78 94, 82 94
  L 82 96
  C 64 100, 44 106, 38 114
  C 32 122, 30 132, 28 144
  L 22 196
  C 20 206, 22 210, 28 212
  L 36 214
  C 42 214, 44 210, 44 206
  L 52 170
  C 54 164, 56 160, 58 158
  L 58 182
  L 56 240
  C 54 260, 56 280, 56 300
  L 54 340
  C 54 350, 56 358, 62 362
  L 72 366
  C 78 368, 80 364, 80 358
  L 80 344
  L 82 300
  C 84 288, 86 276, 88 270
  L 90 264
  L 92 270
  C 94 276, 96 288, 98 300
  L 100 344
  L 100 358
  C 100 364, 102 368, 108 366
  L 118 362
  C 124 358, 126 350, 126 340
  L 124 300
  C 124 280, 126 260, 124 240
  L 122 182
  L 122 158
  C 124 160, 126 164, 128 170
  L 136 206
  C 136 210, 138 214, 144 214
  L 152 212
  C 158 210, 160 206, 158 196
  L 152 144
  C 150 132, 148 122, 142 114
  C 136 106, 116 100, 98 96
  L 98 94
  C 102 94, 108 90, 108 86
  L 108 82
  C 108 78, 106 74, 102 72
  L 98 66
  C 108 62, 118 50, 118 36
  C 118 24, 108 12, 90 12
  Z
`;

export default function AnxietyBodyMap({ onComplete }) {
  const [phase, setPhase] = useState('select'); // select | transition | exercise | interstitial | complete
  const [selectedZones, setSelectedZones] = useState(new Set());
  const [exerciseQueue, setExerciseQueue] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [completedZones, setCompletedZones] = useState([]);
  const [skippedZones, setSkippedZones] = useState([]);
  const [breathPhaseLabel, setBreathPhaseLabel] = useState('');
  const [fadeKey, setFadeKey] = useState(0);

  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const exerciseActiveRef = useRef(false);
  const breathIntervalRef = useRef(null);

  // Toggle zone selection
  const toggleZone = (zoneId) => {
    setSelectedZones(prev => {
      const next = new Set(prev);
      if (next.has(zoneId)) {
        next.delete(zoneId);
      } else {
        next.add(zoneId);
      }
      return next;
    });
  };

  // Start exercise sequence
  const startExercises = () => {
    const queue = ZONES.filter(z => selectedZones.has(z.id));
    setExerciseQueue(queue);
    setCurrentExerciseIndex(0);
    setCompletedZones([]);
    setSkippedZones([]);
    setPhase('transition');
    setFadeKey(k => k + 1);
  };

  // Transition phase -> first exercise after 2.5s
  useEffect(() => {
    if (phase !== 'transition') return;
    const t = setTimeout(() => {
      beginExercise(0);
    }, 2500);
    return () => clearTimeout(t);
  }, [phase]);

  // Begin an exercise at given index
  const beginExercise = useCallback((index) => {
    if (index >= exerciseQueue.length) {
      setPhase('complete');
      setFadeKey(k => k + 1);
      return;
    }
    const zone = exerciseQueue[index];
    setCurrentExerciseIndex(index);
    setTotalDuration(zone.duration);
    setTimeRemaining(zone.duration);
    setBreathPhaseLabel('');
    setFadeKey(k => k + 1);
    exerciseActiveRef.current = true;
    startTimeRef.current = Date.now();

    // Start breathing phase labels if applicable
    if (zone.type === 'breathe-chest' || zone.type === 'breathe-belly' || zone.type === 'tense-release') {
      startBreathPhases(zone);
    } else if (zone.type === 'hum') {
      setBreathPhaseLabel('Hum...');
    }

    setPhase('exercise');
  }, [exerciseQueue]);

  // Breathing phase label cycling
  const startBreathPhases = useCallback((zone) => {
    if (!zone.phases || !zone.cycles) return;
    const phaseSequence = [];
    for (let c = 0; c < zone.cycles; c++) {
      for (const p of zone.phases) {
        phaseSequence.push(p);
      }
    }
    let idx = 0;
    setBreathPhaseLabel(phaseSequence[0].label);
    let elapsed = 0;

    if (breathIntervalRef.current) clearInterval(breathIntervalRef.current);

    const tick = () => {
      elapsed++;
      let cumulative = 0;
      for (let i = 0; i < phaseSequence.length; i++) {
        cumulative += phaseSequence[i].seconds;
        if (elapsed < cumulative) {
          if (i !== idx) {
            idx = i;
            setBreathPhaseLabel(phaseSequence[i].label);
          }
          return;
        }
      }
    };
    breathIntervalRef.current = setInterval(tick, 1000);
  }, []);

  // Countdown timer via requestAnimationFrame
  useEffect(() => {
    if (phase !== 'exercise') return;

    const tick = () => {
      if (!exerciseActiveRef.current) return;
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, totalDuration - elapsed);
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        exerciseActiveRef.current = false;
        if (breathIntervalRef.current) {
          clearInterval(breathIntervalRef.current);
          breathIntervalRef.current = null;
        }
        // Mark completed and transition
        const zone = exerciseQueue[currentExerciseIndex];
        setCompletedZones(prev => [...prev, zone.id]);
        goToNextExercise(currentExerciseIndex);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase, currentExerciseIndex, totalDuration, exerciseQueue]);

  // Navigate to next exercise with interstitial
  const goToNextExercise = useCallback((fromIndex) => {
    const nextIndex = fromIndex + 1;
    if (nextIndex >= exerciseQueue.length) {
      setPhase('complete');
      setFadeKey(k => k + 1);
      return;
    }
    setCurrentExerciseIndex(nextIndex);
    setPhase('interstitial');
    setFadeKey(k => k + 1);
  }, [exerciseQueue]);

  // Interstitial -> next exercise after 2s
  useEffect(() => {
    if (phase !== 'interstitial') return;
    const t = setTimeout(() => {
      beginExercise(currentExerciseIndex);
    }, 2000);
    return () => clearTimeout(t);
  }, [phase, currentExerciseIndex, beginExercise]);

  // Skip current exercise
  const skipExercise = () => {
    exerciseActiveRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (breathIntervalRef.current) {
      clearInterval(breathIntervalRef.current);
      breathIntervalRef.current = null;
    }
    const zone = exerciseQueue[currentExerciseIndex];
    setSkippedZones(prev => [...prev, zone.id]);
    goToNextExercise(currentExerciseIndex);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (breathIntervalRef.current) clearInterval(breathIntervalRef.current);
    };
  }, []);

  // Call onComplete when we reach completion
  useEffect(() => {
    if (phase === 'complete') {
      const t = setTimeout(() => {
        onComplete();
      }, 300);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  // --- Timer ring calculations ---
  const ringRadius = 72;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringProgress = totalDuration > 0 ? timeRemaining / totalDuration : 1;
  const ringOffset = ringCircumference * (1 - ringProgress);

  // ============================
  // PHASE: SELECT
  // ============================
  if (phase === 'select') {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.fadeIn, padding: '32px 20px', maxWidth: 440, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={styles.heading}>
            Tap where you feel anxiety in your body right now.
          </h2>
          <p style={styles.subtext}>
            You can select multiple areas.
          </p>

          {/* Body map */}
          <div style={{ position: 'relative', width: 180, height: 380, margin: '0 auto 32px' }}>
            <svg
              viewBox="0 0 180 380"
              width="180"
              height="380"
              style={{ position: 'absolute', top: 0, left: 0 }}
            >
              {/* Body outline */}
              <path
                d={BODY_PATH}
                fill="none"
                stroke="var(--clay, #C4856C)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.5"
              />

              {/* Tappable zones */}
              {ZONES.map(zone => {
                const isSelected = selectedZones.has(zone.id);
                return (
                  <g key={zone.id}>
                    {/* Pulsing glow when selected */}
                    {isSelected && (
                      <ellipse
                        cx={zone.cx}
                        cy={zone.cy}
                        rx={zone.rx + 4}
                        ry={zone.ry + 4}
                        fill="rgba(196,133,108,0.15)"
                        style={{ animation: 'bodyMapPulse 2s ease-in-out infinite' }}
                      />
                    )}
                    {/* Zone ellipse */}
                    <ellipse
                      cx={zone.cx}
                      cy={zone.cy}
                      rx={zone.rx}
                      ry={zone.ry}
                      fill={isSelected ? 'rgba(196,133,108,0.25)' : 'rgba(196,133,108,0.06)'}
                      stroke={isSelected ? 'var(--clay, #C4856C)' : 'rgba(196,133,108,0.25)'}
                      strokeWidth={isSelected ? 2 : 1}
                      style={{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                      onClick={() => toggleZone(zone.id)}
                    />
                    {/* Hit target (invisible, ensures 44x44 minimum) */}
                    <ellipse
                      cx={zone.cx}
                      cy={zone.cy}
                      rx={Math.max(zone.rx, 22)}
                      ry={Math.max(zone.ry, 22)}
                      fill="transparent"
                      style={{ cursor: 'pointer' }}
                      onClick={() => toggleZone(zone.id)}
                    />
                    {/* Label */}
                    <text
                      x={zone.cx}
                      y={zone.cy + 1}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={isSelected ? 'var(--clay-deep, #A0674F)' : 'var(--text-muted, #999)'}
                      fontSize="8"
                      fontFamily="'DM Sans', sans-serif"
                      fontWeight={isSelected ? 600 : 400}
                      style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >
                      {zone.label.split(' / ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Selected tags */}
          {selectedZones.size > 0 && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              justifyContent: 'center',
              marginBottom: 24,
            }}>
              {ZONES.filter(z => selectedZones.has(z.id)).map(z => (
                <span key={z.id} style={{
                  padding: '6px 14px',
                  borderRadius: 999,
                  background: 'rgba(196,133,108,0.1)',
                  color: 'var(--clay-deep, #A0674F)',
                  fontSize: 13,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  border: '1px solid rgba(196,133,108,0.2)',
                  animation: 'bodyMapTagIn 0.25s ease',
                }}>
                  {z.label}
                </span>
              ))}
            </div>
          )}

          {/* Continue button */}
          {selectedZones.size > 0 && (
            <button
              onClick={startExercises}
              style={{
                ...styles.primaryBtn,
                animation: 'bodyMapFadeUp 0.35s ease',
              }}
            >
              Release tension in {selectedZones.size} area{selectedZones.size !== 1 ? 's' : ''} {'\u2192'}
            </button>
          )}
        </div>

        <style>{`
          @keyframes bodyMapFadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes bodyMapFadeUp {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes bodyMapPulse {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.08); }
          }
          @keyframes bodyMapTagIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  // ============================
  // PHASE: TRANSITION
  // ============================
  if (phase === 'transition') {
    return (
      <div style={styles.container}>
        <div key={fadeKey} style={{ ...styles.fadeIn, textAlign: 'center', padding: '60px 24px', maxWidth: 460, margin: '0 auto' }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'rgba(196,133,108,0.1)',
            border: '2px solid rgba(196,133,108,0.25)',
            margin: '0 auto 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--clay, #C4856C)',
              animation: 'bodyMapPulse 1.5s ease-in-out infinite',
            }} />
          </div>
          <h2 style={{ ...styles.heading, fontSize: 'clamp(1.3rem, 3.5vw, 1.7rem)' }}>
            Let's release the tension in each area, one at a time.
          </h2>
          <p style={{
            ...styles.subtext,
            fontSize: 14,
            color: 'var(--text-muted, #999)',
          }}>
            {exerciseQueue.length} exercise{exerciseQueue.length !== 1 ? 's' : ''} ahead
          </p>
        </div>
        <style>{`
          @keyframes bodyMapFadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes bodyMapPulse {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.08); }
          }
        `}</style>
      </div>
    );
  }

  // ============================
  // PHASE: INTERSTITIAL
  // ============================
  if (phase === 'interstitial') {
    const nextZone = exerciseQueue[currentExerciseIndex];
    return (
      <div style={styles.container}>
        <div key={fadeKey} style={{ ...styles.fadeIn, textAlign: 'center', padding: '60px 24px', maxWidth: 440, margin: '0 auto' }}>
          <div style={{
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--text-muted, #999)',
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 500,
            marginBottom: 12,
          }}>
            Next area
          </div>
          <h2 style={{ ...styles.heading, fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', marginBottom: 8 }}>
            {nextZone?.label}
          </h2>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 6,
            marginTop: 24,
          }}>
            {exerciseQueue.map((z, i) => (
              <div key={z.id} style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: i < currentExerciseIndex
                  ? 'var(--success, #5B9A65)'
                  : i === currentExerciseIndex
                    ? 'var(--clay, #C4856C)'
                    : 'rgba(196,133,108,0.2)',
                transition: 'all 0.3s ease',
              }} />
            ))}
          </div>
        </div>
        <style>{`
          @keyframes bodyMapFadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // ============================
  // PHASE: EXERCISE
  // ============================
  if (phase === 'exercise') {
    const zone = exerciseQueue[currentExerciseIndex];
    const displaySeconds = Math.ceil(timeRemaining);

    return (
      <div style={styles.container}>
        <div key={fadeKey} style={{ ...styles.fadeIn, textAlign: 'center', padding: '24px 20px', maxWidth: 440, margin: '0 auto' }}>
          {/* Progress indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 32,
          }}>
            <div style={{
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
              color: 'var(--text-muted, #999)',
              letterSpacing: '0.08em',
            }}>
              {currentExerciseIndex + 1} / {exerciseQueue.length}
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {exerciseQueue.map((z, i) => (
                <div key={z.id} style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: completedZones.includes(z.id)
                    ? 'var(--success, #5B9A65)'
                    : skippedZones.includes(z.id)
                      ? 'var(--text-muted, #999)'
                      : i === currentExerciseIndex
                        ? 'var(--clay, #C4856C)'
                        : 'rgba(196,133,108,0.2)',
                  transition: 'all 0.3s ease',
                }} />
              ))}
            </div>
          </div>

          {/* Zone name */}
          <div style={{
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--clay, #C4856C)',
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 600,
            marginBottom: 16,
          }}>
            {zone.label}
          </div>

          {/* Timer ring */}
          <div style={{
            position: 'relative',
            width: 180,
            height: 180,
            margin: '0 auto 28px',
          }}>
            <svg width="180" height="180" style={{
              position: 'absolute',
              top: 0,
              left: 0,
              transform: 'rotate(-90deg)',
            }}>
              {/* Background ring */}
              <circle
                cx="90" cy="90" r={ringRadius}
                fill="none"
                stroke="rgba(196,133,108,0.1)"
                strokeWidth="4"
              />
              {/* Progress ring */}
              <circle
                cx="90" cy="90" r={ringRadius}
                fill="none"
                stroke="var(--clay, #C4856C)"
                strokeWidth="4"
                strokeDasharray={ringCircumference}
                strokeDashoffset={ringOffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.15s linear' }}
              />
            </svg>

            {/* Timer text */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
            }}>
              <div style={{
                fontSize: 36,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 500,
                color: 'var(--text-primary, #2D2A26)',
                lineHeight: 1,
              }}>
                {displaySeconds}
              </div>
              {breathPhaseLabel && (
                <div style={{
                  fontSize: 12,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  color: 'var(--clay, #C4856C)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  animation: 'bodyMapPhaseIn 0.3s ease',
                }}>
                  {breathPhaseLabel}
                </div>
              )}
            </div>
          </div>

          {/* Instruction */}
          <p style={{
            fontSize: 16,
            lineHeight: 1.7,
            color: 'var(--text-secondary, #666)',
            fontFamily: "'DM Sans', sans-serif",
            maxWidth: 360,
            margin: '0 auto 36px',
          }}>
            {zone.instruction}
          </p>

          {/* Skip button */}
          <button
            onClick={skipExercise}
            style={styles.skipBtn}
          >
            Skip {'\u2192'}
          </button>
        </div>

        <style>{`
          @keyframes bodyMapFadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes bodyMapPhaseIn {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // ============================
  // PHASE: COMPLETE
  // ============================
  if (phase === 'complete') {
    const attendedZones = ZONES.filter(z => completedZones.includes(z.id));
    const skipped = ZONES.filter(z => skippedZones.includes(z.id));

    return (
      <div style={styles.container}>
        <div key={fadeKey} style={{ ...styles.fadeIn, padding: '40px 20px', maxWidth: 460, margin: '0 auto', textAlign: 'center' }}>
          {/* Body map with green zones */}
          <div style={{ position: 'relative', width: 180, height: 380, margin: '0 auto 28px' }}>
            <svg viewBox="0 0 180 380" width="180" height="380">
              {/* Body outline */}
              <path
                d={BODY_PATH}
                fill="none"
                stroke="rgba(91,154,101,0.35)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Completed zones in green */}
              {ZONES.filter(z => selectedZones.has(z.id)).map(zone => {
                const isCompleted = completedZones.includes(zone.id);
                const wasSkipped = skippedZones.includes(zone.id);
                return (
                  <g key={zone.id}>
                    {isCompleted && (
                      <ellipse
                        cx={zone.cx}
                        cy={zone.cy}
                        rx={zone.rx + 3}
                        ry={zone.ry + 3}
                        fill="rgba(91,154,101,0.1)"
                        style={{ animation: 'bodyMapGreenGlow 2.5s ease-in-out infinite' }}
                      />
                    )}
                    <ellipse
                      cx={zone.cx}
                      cy={zone.cy}
                      rx={zone.rx}
                      ry={zone.ry}
                      fill={isCompleted ? 'rgba(91,154,101,0.2)' : 'rgba(150,150,150,0.08)'}
                      stroke={isCompleted ? 'var(--success, #5B9A65)' : 'rgba(150,150,150,0.2)'}
                      strokeWidth={isCompleted ? 2 : 1}
                    />
                    {isCompleted && (
                      <text
                        x={zone.cx}
                        y={zone.cy + 1}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="var(--success, #5B9A65)"
                        fontSize="12"
                        fontFamily="'DM Sans', sans-serif"
                        fontWeight="600"
                      >
                        {'\u2713'}
                      </text>
                    )}
                    {wasSkipped && (
                      <text
                        x={zone.cx}
                        y={zone.cy + 1}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="var(--text-muted, #999)"
                        fontSize="8"
                        fontFamily="'DM Sans', sans-serif"
                      >
                        skipped
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <h2 style={{ ...styles.heading, marginBottom: 10 }}>
            Your body heard you.
          </h2>
          <p style={{ ...styles.subtext, marginBottom: 28 }}>
            These areas have been attended to.
          </p>

          {/* Completed areas list */}
          {attendedZones.length > 0 && (
            <div style={{
              display: 'grid',
              gap: 8,
              marginBottom: 16,
              textAlign: 'left',
            }}>
              {attendedZones.map((zone, i) => (
                <div key={zone.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  borderRadius: 14,
                  background: 'rgba(91,154,101,0.06)',
                  border: '1px solid rgba(91,154,101,0.12)',
                  animation: `bodyMapFadeIn 0.4s ease ${i * 0.06}s both`,
                }}>
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'rgba(91,154,101,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{
                      color: 'var(--success, #5B9A65)',
                      fontSize: 13,
                      fontWeight: 700,
                    }}>
                      {'\u2713'}
                    </span>
                  </div>
                  <span style={{
                    fontSize: 15,
                    color: 'var(--text-primary, #2D2A26)',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                  }}>
                    {zone.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Skipped areas (subtle) */}
          {skipped.length > 0 && (
            <div style={{
              marginBottom: 28,
              textAlign: 'left',
            }}>
              {skipped.map(zone => (
                <div key={zone.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '8px 16px',
                  opacity: 0.5,
                }}>
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'rgba(150,150,150,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{ color: 'var(--text-muted, #999)', fontSize: 11 }}>{'\u2014'}</span>
                  </div>
                  <span style={{
                    fontSize: 14,
                    color: 'var(--text-muted, #999)',
                    fontFamily: "'DM Sans', sans-serif",
                    textDecoration: 'line-through',
                  }}>
                    {zone.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          <button onClick={onComplete} style={styles.primaryBtn}>
            Continue {'\u2192'}
          </button>
        </div>

        <style>{`
          @keyframes bodyMapFadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes bodyMapGreenGlow {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.7; }
          }
        `}</style>
      </div>
    );
  }

  return null;
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
    animation: 'bodyMapFadeIn 0.5s ease',
  },
  heading: {
    fontFamily: "'Fraunces', serif",
    fontSize: 'clamp(1.4rem, 4vw, 1.9rem)',
    fontWeight: 500,
    color: 'var(--text-primary, #2D2A26)',
    lineHeight: 1.3,
    margin: '0 0 12px',
  },
  subtext: {
    fontSize: 16,
    color: 'var(--text-secondary, #666)',
    lineHeight: 1.7,
    margin: '0 0 28px',
    fontFamily: "'DM Sans', sans-serif",
  },
  primaryBtn: {
    padding: '16px 36px',
    borderRadius: 50,
    background: 'var(--clay, #C4856C)',
    color: '#fff',
    border: 'none',
    fontSize: 16,
    fontWeight: 600,
    fontFamily: "'Fraunces', serif",
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
    boxShadow: '0 4px 16px rgba(196,133,108,0.3)',
  },
  skipBtn: {
    padding: '10px 24px',
    borderRadius: 50,
    background: 'transparent',
    color: 'var(--text-muted, #999)',
    border: '1px solid var(--border, rgba(0,0,0,0.08))',
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};
