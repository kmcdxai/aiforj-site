"use client";

import { useState, useEffect, useCallback } from 'react';
import MoodRating from './MoodRating';
import MoodShiftReceipt from './MoodShiftReceipt';
import { saveSession } from '../../utils/sessionHistory';
import { saveSession as saveGardenSession } from '../../app/lib/db';

const PHASES = {
  PRE_RATING: 'pre-rating',
  INTERVENTION: 'intervention',
  POST_RATING: 'post-rating',
  RECEIPT: 'receipt',
};

export default function InterventionWrapper({
  children,
  emotion,
  intervention,
  onComplete,
  onSendCalm,
  className = '',
}) {
  const [phase, setPhase] = useState(PHASES.PRE_RATING);
  const [preRating, setPreRating] = useState(null);
  const [postRating, setPostRating] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const interventionName = intervention?.title || intervention?.name || 'Technique';
  const interventionSlug = intervention?.slug || '';

  useEffect(() => {
    if (phase === PHASES.INTERVENTION) {
      setStartTime(Date.now());
    }
  }, [phase]);

  const handlePreRatingSubmit = (rating) => {
    setPreRating(rating);
    setPhase(PHASES.INTERVENTION);
  };

  const handleInterventionComplete = useCallback(() => {
    setEndTime(Date.now());
    setPhase(PHASES.POST_RATING);
  }, []);

  const handlePostRatingSubmit = async (rating) => {
    setPostRating(rating);
    setPhase(PHASES.RECEIPT);

    const now = Date.now();
    const durationMs = now - (startTime || now);
    const durationSeconds = Math.max(1, Math.round(durationMs / 1000));
    const shift = rating - preRating;

    saveSession({
      emotion: emotion || 'unknown',
      intervention: interventionSlug,
      interventionName,
      preRating,
      postRating: rating,
      shift,
      duration: durationSeconds,
      timePreference: intervention?.timePreference || null,
      intensity: intervention?.intensity ?? null,
      timestamp: new Date().toISOString(),
    });

    try {
      await saveGardenSession({
        emotion: emotion || 'unknown',
        pathway: intervention?.timePreference || intervention?.tier || null,
        duration: durationSeconds,
        completedSteps: intervention?.time || intervention?.timeMinutes || null,
        techniqueUsed: interventionName,
        intervention: interventionSlug,
        interventionName,
        preRating,
        postRating: rating,
        shift,
        intensity: intervention?.intensity ?? null,
        timePreference: intervention?.timePreference || null,
        source: 'intervention-wrapper',
        timestamp: now,
      });
    } catch (error) {
      console.warn('Failed to mirror session into garden store:', error);
    }

    onComplete?.({ preRating, postRating: rating, shift, duration: durationMs });
  };

  const handleSendCalm = () => {
    if (onSendCalm) {
      onSendCalm();
    } else {
      window.location.href = `/send?technique=${interventionSlug}`;
    }
  };

  if (phase === PHASES.PRE_RATING) {
    return (
      <div className={className} style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <MoodRating
          context="pre"
          emotion={emotion}
          onSubmit={handlePreRatingSubmit}
        />
      </div>
    );
  }

  const isCustomComponent = typeof children === 'function';

  if (phase === PHASES.INTERVENTION) {
    return (
      <div className={className}>
        {isCustomComponent
          ? children({ onComplete: handleInterventionComplete })
          : children
        }
        {!isCustomComponent && (
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px 24px',
            paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
            zIndex: 100,
            background: 'linear-gradient(transparent, var(--bg-primary) 30%)',
          }}>
            <button
              onClick={handleInterventionComplete}
              style={{
                width: '100%',
                maxWidth: 440,
                margin: '0 auto',
                display: 'block',
                padding: '16px',
                borderRadius: 50,
                background: 'var(--interactive)',
                border: 'none',
                color: '#fff',
                fontSize: 16,
                fontWeight: 600,
                fontFamily: "'Fraunces', serif",
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(122,158,126,0.35)',
                transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--interactive-hover)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--interactive)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {"I\u2019m done with this technique \u2192"}
            </button>
          </div>
        )}
      </div>

    );
  }

  if (phase === PHASES.POST_RATING) {
    return (
      <div className={className} style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <MoodRating
          context="post"
          emotion={emotion}
          onSubmit={handlePostRatingSubmit}
        />
      </div>
    );
  }

  if (phase === PHASES.RECEIPT) {
    const duration = (endTime || Date.now()) - (startTime || Date.now());
    return (
      <div className={className}>
        <MoodShiftReceipt
          preRating={preRating}
          postRating={postRating}
          emotion={emotion}
          interventionName={interventionName}
          interventionSlug={interventionSlug}
          duration={duration}
          onSendCalm={handleSendCalm}
          onTryDifferent={() => { window.location.href = '/start'; }}
        />
      </div>
    );
  }

  return null;
}
