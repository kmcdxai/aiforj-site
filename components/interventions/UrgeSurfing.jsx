"use client";

import { useEffect, useMemo, useState } from 'react';
import CrisisBanner from './CrisisBanner';
import { InterventionShell, PrimaryButton, SecondaryButton, StepDots, appendToStorage, rangeStyle, shellStyles } from './shared';

const ACCENT = '#C47A8A';

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

export default function UrgeSurfing({ onComplete }) {
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
    const nextPoints = [...points, { minute: points.length * 0.5, rating: currentRating }];
    setPoints(nextPoints);
    setAwaitingCheckIn(false);
    setCountdown(30);
    if (nextPoints.length >= 11) {
      appendToStorage('aiforj_urge_surfing', {
        points: nextPoints,
        createdAt: new Date().toISOString(),
      });
    }
  };

  const finished = points.length >= 11;
  const endRating = points.length ? points[points.length - 1].rating : startingRating;
  const peak = useMemo(() => (points.length ? Math.max(...points.map((point) => point.rating)) : startingRating), [points, startingRating]);

  return (
    <InterventionShell maxWidth={760}>
      <div style={shellStyles.card}>
        <CrisisBanner />
        <StepDots currentStep={finished ? 3 : started ? 2 : 1} totalSteps={3} accent={ACCENT} label="Urge Surfing" />
        {!started ? (
          <>
            <h2 style={shellStyles.heading}>The urge is a wave. You do not have to act on it.</h2>
            <p style={{ ...shellStyles.body, marginTop: 12 }}>We will check in every 30 seconds for 5 minutes and watch what the urge actually does.</p>
            <div style={{ marginTop: 24 }}>
              <label style={shellStyles.label}>Rate your urge right now</label>
              <input type="range" min="1" max="10" value={startingRating} onChange={(event) => setStartingRating(Number(event.target.value))} style={{ ...rangeStyle(ACCENT), marginTop: 10 }} />
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 48, color: ACCENT, marginTop: 10 }}>{startingRating}/10</div>
            </div>
            <div style={shellStyles.buttonRow}>
              <PrimaryButton accent={ACCENT} onClick={startSession}>Start surfing</PrimaryButton>
            </div>
          </>
        ) : null}

        {started ? (
          <>
            <div style={{ ...shellStyles.card, padding: '18px 18px', background: 'var(--surface)', marginTop: 20 }}>
              <svg viewBox="0 0 540 260" style={{ width: '100%', height: 'auto' }}>
                {Array.from({ length: 10 }).map((_, index) => {
                  const y = 20 + (220 / 9) * index;
                  return <line key={index} x1="40" x2="500" y1={y} y2={y} stroke="rgba(44,37,32,0.08)" strokeWidth="1" />;
                })}
                <path d={buildPath(points, 540, 260, 40)} fill="none" stroke={ACCENT} strokeWidth="4" strokeLinecap="round" />
                {points.map((point, index) => {
                  const x = 40 + (460 / 10) * index;
                  const y = 40 + (180 / 9) * (10 - point.rating);
                  return <circle key={index} cx={x} cy={y} r="6" fill={ACCENT} />;
                })}
              </svg>
            </div>
            {!finished && !awaitingCheckIn ? (
              <div style={{ ...shellStyles.card, marginTop: 18, background: 'rgba(196, 122, 138, 0.08)' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, color: ACCENT }}>{countdown}s</div>
                <p style={{ ...shellStyles.body, marginTop: 10 }}>Stay with the wave. No need to fix it right now.</p>
                <div style={shellStyles.buttonRow}>
                  <SecondaryButton onClick={() => { setAwaitingCheckIn(true); setCountdown(0); }}>Rate now</SecondaryButton>
                </div>
              </div>
            ) : null}
            {awaitingCheckIn && !finished ? (
              <div style={{ ...shellStyles.card, marginTop: 18 }}>
                <label style={shellStyles.label}>Rate the urge now</label>
                <input type="range" min="1" max="10" value={currentRating} onChange={(event) => setCurrentRating(Number(event.target.value))} style={{ ...rangeStyle(ACCENT), marginTop: 10 }} />
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 42, color: ACCENT, marginTop: 10 }}>{currentRating}/10</div>
                <div style={shellStyles.buttonRow}>
                  <PrimaryButton accent={ACCENT} onClick={submitCheckIn}>Save check-in</PrimaryButton>
                </div>
              </div>
            ) : null}
            {finished ? (
              <>
                <div style={{ ...shellStyles.card, marginTop: 18, background: 'rgba(196, 122, 138, 0.08)' }}>
                  <p style={{ ...shellStyles.body, margin: 0 }}>Your urge went from {startingRating} to {endRating}. It peaked at {peak}.</p>
                </div>
                <p style={{ ...shellStyles.body, marginTop: 14 }}>
                  {endRating < startingRating
                    ? 'Urges peak and pass. You just proved it in real time.'
                    : "Some urges are stubborn. That's okay. Add another tool instead of acting on the urge."}
                </p>
                {endRating >= startingRating ? (
                  <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                    <SecondaryButton onClick={() => { window.location.href = '/intervention/tipp-skills?emotion=self-destructive&intensity=8&time=quick'; }}>Try TIPP Skills</SecondaryButton>
                    <SecondaryButton onClick={() => { window.location.href = '/intervention/delay-distract?emotion=self-destructive&intensity=8&time=quick'; }}>Try Delay &amp; Distract</SecondaryButton>
                  </div>
                ) : null}
                <div style={shellStyles.buttonRow}>
                  <PrimaryButton accent={ACCENT} onClick={onComplete}>Finish</PrimaryButton>
                </div>
              </>
            ) : null}
          </>
        ) : null}
      </div>
    </InterventionShell>
  );
}
