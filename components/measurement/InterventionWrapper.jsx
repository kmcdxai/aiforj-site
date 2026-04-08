"use client";

import { useState, useEffect } from 'react';
import MoodRating from './MoodRating';
import MoodShiftReceipt from './MoodShiftReceipt';
import { saveSession } from '../../utils/sessionHistory';

const PHASES = {
  PRE_RATING: 'pre-rating',
  INTERVENTION: 'intervention',
  POST_RATING: 'post-rating',
  RECEIPT: 'receipt',
};

export default function InterventionWrapper({
  children,
  emotion,
  interventionName,
  onSendCalm,
  className = '',
}) {
  const [phase, setPhase] = useState(PHASES.PRE_RATING);
  const [preRating, setPreRating] = useState(null);
  const [postRating, setPostRating] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  // Start timing when intervention begins
  useEffect(() => {
    if (phase === PHASES.INTERVENTION) {
      setStartTime(Date.now());
    }
  }, [phase]);

  const handlePreRatingSubmit = (rating) => {
    setPreRating(rating);
    setPhase(PHASES.INTERVENTION);
  };

  const handleInterventionComplete = () => {
    setEndTime(Date.now());
    setPhase(PHASES.POST_RATING);
  };

  const handlePostRatingSubmit = (rating) => {
    setPostRating(rating);
    setPhase(PHASES.RECEIPT);

    // Save session data
    const duration = endTime - startTime;
    const shift = rating - preRating;

    saveSession({
      emotion,
      interventionName,
      preRating,
      postRating: rating,
      shift,
      duration,
      timestamp: new Date().toISOString(),
    });
  };

  const handleSendCalm = () => {
    // Navigate to send page or open modal
    onSendCalm?.();
  };

  if (phase === PHASES.PRE_RATING) {
    return (
      <div className={className}>
        <MoodRating
          context="pre"
          emotion={emotion}
          onSubmit={handlePreRatingSubmit}
        />
      </div>
    );
  }

  if (phase === PHASES.INTERVENTION) {
    return (
      <div className={className}>
        {children}
        <div style={{
          position: 'fixed',
          bottom: 24,
          left: 24,
          right: 24,
          zIndex: 100,
        }}>
          <button
            onClick={handleInterventionComplete}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--interactive)',
              border: 'none',
              color: '#fff',
              fontSize: 16,
              fontWeight: 600,
              fontFamily: "'Fraunces', serif",
              cursor: 'pointer',
              boxShadow: 'var(--shadow-lg)',
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
            I'm done with this technique →
          </button>
        </div>
      </div>
    );
  }

  if (phase === PHASES.POST_RATING) {
    return (
      <div className={className}>
        <MoodRating
          context="post"
          emotion={emotion}
          onSubmit={handlePostRatingSubmit}
        />
      </div>
    );
  }

  if (phase === PHASES.RECEIPT) {
    const duration = endTime - startTime;
    return (
      <div className={className}>
        <MoodShiftReceipt
          preRating={preRating}
          postRating={postRating}
          emotion={emotion}
          interventionName={interventionName}
          duration={duration}
          onSendCalm={handleSendCalm}
        />
      </div>
    );
  }

  return null;
}
