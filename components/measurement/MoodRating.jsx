"use client";

import { useState } from 'react';

const EMOJI_RATINGS = [
  { emoji: '😣', label: 'Struggling', range: [1, 2], color: 'var(--error)' },
  { emoji: '😔', label: 'Tough', range: [3, 4], color: 'var(--warning)' },
  { emoji: '😐', label: 'Okay', range: [5, 6], color: 'var(--text-secondary)' },
  { emoji: '🙂', label: 'Good', range: [7, 8], color: 'var(--success)' },
  { emoji: '😌', label: 'Great', range: [9, 10], color: 'var(--interactive)' },
];

export default function MoodRating({
  label,
  sublabel,
  emotion,
  onSubmit,
  context = 'pre',
  className = '',
}) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [fineTuneValue, setFineTuneValue] = useState(null);

  const selectedRating = selectedIndex !== null ? EMOJI_RATINGS[selectedIndex] : null;
  const finalRating = fineTuneValue !== null ? fineTuneValue : (selectedRating ? selectedRating.range[0] : null);

  const handleEmojiClick = (index) => {
    setSelectedIndex(index);
    setFineTuneValue(null); // Reset fine-tune when selecting new emoji
  };

  const handleSubmit = () => {
    if (finalRating !== null) {
      onSubmit(finalRating);
    }
  };

  const isPre = context === 'pre';

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', textAlign: 'center' }} className={className}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{
          fontFamily: "'Fraunces', serif",
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          fontWeight: 500,
          color: 'var(--text-primary)',
          margin: '0 0 8px',
          lineHeight: 1.3,
        }}>
          {label || (isPre ? 'Before we start — how are you feeling right now?' : 'How are you feeling now?')}
        </h2>
        {sublabel && (
          <p style={{
            fontSize: 16,
            color: 'var(--text-secondary)',
            margin: 0,
            lineHeight: 1.6,
          }}>
            {sublabel}
          </p>
        )}
        {!sublabel && (
          <p style={{
            fontSize: 16,
            color: 'var(--text-secondary)',
            margin: 0,
            lineHeight: 1.6,
          }}>
            {isPre ? 'This helps us see if the tool actually helped.' : 'Be honest — there\'s no wrong answer.'}
          </p>
        )}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 24,
        flexWrap: 'wrap',
      }}>
        {EMOJI_RATINGS.map((rating, index) => (
          <button
            key={index}
            onClick={() => handleEmojiClick(index)}
            style={{
              width: selectedIndex === index ? 64 : 48,
              height: selectedIndex === index ? 64 : 48,
              borderRadius: '50%',
              border: 'none',
              backgroundColor: selectedIndex === index ? rating.color + '20' : 'var(--surface)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: selectedIndex === index ? 28 : 24,
              transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
              transform: selectedIndex === index ? 'scale(1.1)' : 'scale(1)',
              boxShadow: selectedIndex === index ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
            }}
            aria-label={`Rate as ${rating.label}`}
          >
            {rating.emoji}
          </button>
        ))}
      </div>

      {selectedRating && (
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontSize: 18,
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 8,
          }}>
            {selectedRating.label}
          </div>

          {/* Fine-tune slider */}
          <div style={{ maxWidth: 200, margin: '0 auto' }}>
            <input
              type="range"
              min={selectedRating.range[0]}
              max={selectedRating.range[1]}
              value={fineTuneValue || selectedRating.range[0]}
              onChange={(e) => setFineTuneValue(Number(e.target.value))}
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                background: 'var(--parchment-deep)',
                outline: 'none',
                appearance: 'none',
                cursor: 'pointer',
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 12,
              color: 'var(--text-muted)',
              marginTop: 4,
            }}>
              <span>{selectedRating.range[0]}</span>
              <span>{selectedRating.range[1]}</span>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={finalRating === null}
        style={{
          padding: '14px 32px',
          borderRadius: 50,
          backgroundColor: 'var(--interactive)',
          color: '#fff',
          border: 'none',
          fontSize: 16,
          fontWeight: 600,
          fontFamily: "'Fraunces', serif",
          cursor: finalRating !== null ? 'pointer' : 'not-allowed',
          opacity: finalRating !== null ? 1 : 0.5,
          transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        }}
        onMouseEnter={(e) => {
          if (finalRating !== null) {
            e.currentTarget.style.backgroundColor = 'var(--interactive-hover)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--interactive)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {isPre ? 'Let\'s begin →' : 'See my results →'}
      </button>
    </div>
  );
}
