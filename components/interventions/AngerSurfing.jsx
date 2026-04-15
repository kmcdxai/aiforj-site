"use client";

import { useEffect, useMemo, useState } from 'react';
import {
  ANGER_ACCENT,
  InterventionShell,
  PrimaryButton,
  SecondaryButton,
  StepDots,
  appendToStorage,
  rangeStyle,
  shellStyles,
} from './shared';

function buildPath(points, width, height, padding) {
  if (!points.length) return '';
  return points
    .map((point, index) => {
      const x = padding + ((width - padding * 2) / 10) * index;
      const y = padding + ((height - padding * 2) / 9) * (10 - point.rating);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
}

export default function AngerSurfing({ onComplete }) {
  const [startingRating, setStartingRating] = useState(7);
  const [currentRating, setCurrentRating] = useState(7);
  const [points, setPoints] = useState([]);
  const [countdown, setCountdown] = useState(30);
  const [awaitingCheckIn, setAwaitingCheckIn] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started || awaitingCheckIn || points.length >= 11) return undefined;
    const timer = window.setTimeout(() => {
      setCountdown((current) => {
        if (current <= 1) {
          setAwaitingCheckIn(true);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [started, awaitingCheckIn, countdown, points.length]);

  const startSession = () => {
    setPoints([{ minute: 0, rating: startingRating }]);
    setCurrentRating(startingRating);
    setCountdown(30);
    setAwaitingCheckIn(false);
    setStarted(true);
  };

  const submitCheckIn = () => {
    const nextPoint = {
      minute: points.length * 0.5,
      rating: currentRating,
    };
    const nextPoints = [...points, nextPoint];
    setPoints(nextPoints);
    setAwaitingCheckIn(false);
    setCountdown(30);

    if (nextPoints.length >= 11) {
      appendToStorage('aiforj_anger_surfing', {
        points: nextPoints,
        createdAt: new Date().toISOString(),
      });
    }
  };

  const finished = points.length >= 11;
  const peak = useMemo(() => (points.length ? Math.max(...points.map((point) => point.rating)) : startingRating), [points, startingRating]);
  const endRating = points.length ? points[points.length - 1].rating : startingRating;

  return (
    <InterventionShell maxWidth={720}>
      <div style={shellStyles.card}>
        <StepDots currentStep={finished ? 3 : started ? 2 : 1} totalSteps={3} accent={ANGER_ACCENT} label="DBT Mindfulness" />

        {!started ? (
          <>
            <div style={shellStyles.eyebrow}>Anger Intensity Surfing</div>
            <h2 style={shellStyles.heading}>Anger feels permanent until you watch it move.</h2>
            <p style={{ ...shellStyles.body, marginTop: 12 }}>
              We will check in every 30 seconds for 5 minutes. The goal is not to force the anger down. The goal is to prove it behaves like a wave.
            </p>
            <div style={{ marginTop: 26 }}>
              <label style={shellStyles.label}>Rate your anger right now</label>
              <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={startingRating}
                  onChange={(event) => setStartingRating(Number(event.target.value))}
                  style={rangeStyle(ANGER_ACCENT)}
                />
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, color: ANGER_ACCENT }}>
                  {startingRating}/10
                </div>
              </div>
            </div>
            <div style={shellStyles.buttonRow}>
              <PrimaryButton onClick={startSession}>Start surfing</PrimaryButton>
            </div>
          </>
        ) : null}

        {started ? (
          <>
            <div style={shellStyles.eyebrow}>Wave in progress</div>
            <h2 style={shellStyles.heading}>Stay with the wave. Do not argue with it.</h2>
            <p style={{ ...shellStyles.body, marginTop: 12 }}>
              Check-in {Math.min(points.length + (awaitingCheckIn ? 1 : 0), 10)} of 10. Anger rises, peaks, and changes. Your only job is to notice.
            </p>

            <div style={{ ...shellStyles.card, padding: '18px 18px', background: 'var(--surface)', marginTop: 22 }}>
              <svg viewBox="0 0 540 260" style={{ width: '100%', height: 'auto' }} aria-label="Anger intensity graph">
                {Array.from({ length: 10 }).map((_, index) => {
                  const y = 20 + (220 / 9) * index;
                  return (
                    <line
                      key={index}
                      x1="40"
                      x2="500"
                      y1={y}
                      y2={y}
                      stroke="rgba(44, 37, 32, 0.08)"
                      strokeWidth="1"
                    />
                  );
                })}
                <path
                  d={buildPath(points, 540, 260, 40)}
                  fill="none"
                  stroke={ANGER_ACCENT}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {points.map((point, index) => {
                  const x = 40 + (460 / 10) * index;
                  const y = 40 + (180 / 9) * (10 - point.rating);
                  return <circle key={`${point.minute}-${index}`} cx={x} cy={y} r="6" fill={ANGER_ACCENT} />;
                })}
              </svg>
            </div>

            {!finished && !awaitingCheckIn ? (
              <div style={{ ...shellStyles.card, padding: '18px 20px', marginTop: 20, background: 'rgba(196, 91, 91, 0.06)' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, color: ANGER_ACCENT, marginBottom: 8 }}>
                  {countdown}s
                </div>
                <p style={{ ...shellStyles.body, margin: 0 }}>
                  Let the anger exist without feeding it. When the timer hits zero, rate it again.
                </p>
                <div style={{ ...shellStyles.buttonRow, marginTop: 18 }}>
                  <SecondaryButton onClick={() => { setAwaitingCheckIn(true); setCountdown(0); }}>
                    Rate now
                  </SecondaryButton>
                </div>
              </div>
            ) : null}

            {awaitingCheckIn && !finished ? (
              <div style={{ ...shellStyles.card, padding: '20px 20px', marginTop: 20 }}>
                <label style={shellStyles.label}>Rate your anger now</label>
                <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={currentRating}
                    onChange={(event) => setCurrentRating(Number(event.target.value))}
                    style={rangeStyle(ANGER_ACCENT)}
                  />
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, color: ANGER_ACCENT }}>
                    {currentRating}/10
                  </div>
                </div>
                <div style={shellStyles.buttonRow}>
                  <PrimaryButton onClick={submitCheckIn}>Save check-in</PrimaryButton>
                </div>
              </div>
            ) : null}

            {finished ? (
              <div style={{ display: 'grid', gap: 16, marginTop: 22 }}>
                <div style={{ ...shellStyles.card, padding: '20px 20px', background: 'rgba(196, 91, 91, 0.06)' }}>
                  <p style={{ ...shellStyles.body, margin: 0 }}>
                    Your anger went from <strong style={{ color: 'var(--text-primary)' }}>{startingRating}</strong> to <strong style={{ color: 'var(--text-primary)' }}>{endRating}</strong>.
                    It peaked at <strong style={{ color: 'var(--text-primary)' }}>{peak}</strong>.
                  </p>
                </div>
                <p style={shellStyles.body}>
                  {endRating < startingRating
                    ? 'Anger always peaks and passes. You just watched it happen in real time.'
                    : 'Some anger needs more than observation. That does not mean you failed. It means the wave needs another tool.'}
                </p>
                {endRating >= startingRating ? (
                  <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                    <SecondaryButton onClick={() => { window.location.href = '/intervention/tipp-skills?emotion=angry&intensity=7&time=quick'; }}>
                      Try TIPP skills
                    </SecondaryButton>
                    <SecondaryButton onClick={() => { window.location.href = '/intervention/anger-cognitive-reframe?emotion=angry&intensity=7&time=medium'; }}>
                      Try cognitive reframe
                    </SecondaryButton>
                  </div>
                ) : null}
                <div style={shellStyles.buttonRow}>
                  <PrimaryButton onClick={onComplete}>Finish surfing</PrimaryButton>
                </div>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </InterventionShell>
  );
}
