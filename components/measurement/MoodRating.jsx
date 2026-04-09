"use client";

import { useState } from 'react';

const EMOJI_RATINGS = [
  { emoji: '😣', label: 'Struggling', range: [1, 2], color: 'var(--error)', bgTint: 'rgba(196,122,138,0.12)' },
  { emoji: '😔', label: 'Tough', range: [3, 4], color: 'var(--warning)', bgTint: 'rgba(212,168,67,0.12)' },
  { emoji: '😐', label: 'Okay', range: [5, 6], color: 'var(--text-secondary)', bgTint: 'rgba(138,128,120,0.10)' },
  { emoji: '🙂', label: 'Good', range: [7, 8], color: 'var(--success)', bgTint: 'rgba(122,158,126,0.12)' },
  { emoji: '😌', label: 'Great', range: [9, 10], color: 'var(--interactive)', bgTint: 'rgba(122,158,126,0.18)' },
];

export { EMOJI_RATINGS };

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
  const [justSelected, setJustSelected] = useState(false);

  const selectedRating = selectedIndex !== null ? EMOJI_RATINGS[selectedIndex] : null;
  const finalRating = fineTuneValue !== null ? fineTuneValue : (selectedRating ? selectedRating.range[0] : null);

  const handleEmojiClick = (index) => {
    setSelectedIndex(index);
    setFineTuneValue(null);
    // Trigger bounce animation
    setJustSelected(true);
    setTimeout(() => setJustSelected(false), 400);
  };

  const handleSubmit = () => {
    if (finalRating !== null) {
      onSubmit(finalRating);
    }
  };

  const isPre = context === 'pre';

  return (
    <div style={{
      maxWidth: 440,
      margin: '0 auto',
      textAlign: 'center',
      padding: '40px 24px',
    }} className={className}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{
          fontFamily: "'Fraunces', serif",
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          fontWeight: 500,
          color: 'var(--text-primary)',
          margin: '0 0 10px',
          lineHeight: 1.3,
        }}>
          {label || (isPre ? 'Before we start \u2014 how are you feeling right now?' : 'How are you feeling now?')}
        </h2>
        <p style={{
          fontSize: 16,
          color: 'var(--text-secondary)',
          margin: 0,
          lineHeight: 1.6,
        }}>
          {sublabel || (isPre ? 'This helps us see if the tool actually helped.' : 'Be honest \u2014 there\u2019s no wrong answer.')}
        </p>
      </div>

      {/* Emoji Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 14,
        marginBottom: 28,
        flexWrap: 'wrap',
      }}>
        {EMOJI_RATINGS.map((rating, index) => {
          const isSelected = selectedIndex === index;
          return (
            <button
              key={index}
              onClick={() => handleEmojiClick(index)}
              style={{
                width: isSelected ? 64 : 52,
                height: isSelected ? 64 : 52,
                borderRadius: 18,
                border: isSelected ? `2px solid ${rating.color}` : '1.5px solid rgba(45,42,38,0.08)',
                backgroundColor: isSelected ? rating.bgTint : 'var(--surface)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isSelected ? 30 : 24,
                transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                transform: isSelected && justSelected ? 'scale(1.15)' : isSelected ? 'scale(1.05)' : 'scale(1)',
                boxShadow: isSelected ? '0 4px 16px rgba(0,0,0,0.08)' : '0 1px 4px rgba(0,0,0,0.04)',
                animation: isSelected && justSelected ? 'moodBounce 0.4s cubic-bezier(0.16,1,0.3,1)' : 'none',
              }}
              aria-label={`Rate as ${rating.label}`}
            >
              {rating.emoji}
            </button>
          );
        })}
      </div>

      {/* Selected Label + Fine Tune */}
      {selectedRating && (
        <div style={{
          marginBottom: 28,
          animation: 'fadeInUp 0.3s ease',
        }}>
          <div style={{
            fontSize: 18,
            fontWeight: 600,
            color: selectedRating.color,
            marginBottom: 12,
            fontFamily: "'Fraunces', serif",
          }}>
            {selectedRating.label}
          </div>

          {/* Fine-tune slider */}
          <div style={{
            maxWidth: 200,
            margin: '0 auto',
            padding: '12px 16px',
            background: 'var(--surface)',
            borderRadius: 16,
            border: '1px solid rgba(45,42,38,0.06)',
          }}>
            <div style={{
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--text-muted)',
              marginBottom: 8,
            }}>
              Fine-tune
            </div>
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
                WebkitAppearance: 'none',
                cursor: 'pointer',
                accentColor: selectedRating.color,
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 13,
              color: 'var(--text-muted)',
              marginTop: 6,
              fontWeight: 500,
            }}>
              <span>{selectedRating.range[0]}</span>
              <span style={{
                fontSize: 15,
                fontWeight: 700,
                color: selectedRating.color,
              }}>
                {fineTuneValue || selectedRating.range[0]}
              </span>
              <span>{selectedRating.range[1]}</span>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={finalRating === null}
        style={{
          padding: '16px 36px',
          borderRadius: 50,
          backgroundColor: finalRating !== null ? 'var(--interactive)' : 'var(--parchment-deep)',
          color: finalRating !== null ? '#fff' : 'var(--text-muted)',
          border: 'none',
          fontSize: 16,
          fontWeight: 600,
          fontFamily: "'Fraunces', serif",
          cursor: finalRating !== null ? 'pointer' : 'not-allowed',
          opacity: finalRating !== null ? 1 : 0.6,
          transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
          boxShadow: finalRating !== null ? '0 4px 16px rgba(122,158,126,0.3)' : 'none',
        }}
        onMouseEnter={(e) => {
          if (finalRating !== null) {
            e.currentTarget.style.backgroundColor = 'var(--interactive-hover)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(122,158,126,0.4)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = finalRating !== null ? 'var(--interactive)' : 'var(--parchment-deep)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = finalRating !== null ? '0 4px 16px rgba(122,158,126,0.3)' : 'none';
        }}
      >
        {isPre ? 'Let\u2019s begin \u2192' : 'See my results \u2192'}
      </button>

      {/* Bounce animation keyframes */}
      <style>{`
        @keyframes moodBounce {
          0% { transform: scale(1); }
          40% { transform: scale(1.2); }
          70% { transform: scale(0.95); }
          100% { transform: scale(1.05); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
