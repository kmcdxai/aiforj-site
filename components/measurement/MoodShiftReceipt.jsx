"use client";

import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';

const SHIFT_MESSAGES = {
  positiveLarge: "That's a meaningful shift. This technique works for you.",
  positiveSmall: "Every point counts. You showed up for yourself.",
  neutral: "Sometimes showing up is the win. This one might not be your match — try a different technique next time.",
  negative: "It's okay — not every tool fits every moment. Your willingness to try still matters. Want to try a different approach?",
};

function getShiftMessage(shift) {
  if (shift >= 3) return SHIFT_MESSAGES.positiveLarge;
  if (shift > 0) return SHIFT_MESSAGES.positiveSmall;
  if (shift === 0) return SHIFT_MESSAGES.neutral;
  return SHIFT_MESSAGES.negative;
}

function getShiftEmoji(before, after) {
  const beforeRating = EMOJI_RATINGS.find(r => r.range.includes(before));
  const afterRating = EMOJI_RATINGS.find(r => r.range.includes(after));
  return { before: beforeRating?.emoji, after: afterRating?.emoji };
}

const EMOJI_RATINGS = [
  { emoji: '😣', label: 'Struggling', range: [1, 2] },
  { emoji: '😔', label: 'Tough', range: [3, 4] },
  { emoji: '😐', label: 'Okay', range: [5, 6] },
  { emoji: '🙂', label: 'Good', range: [7, 8] },
  { emoji: '😌', label: 'Great', range: [9, 10] },
];

export default function MoodShiftReceipt({
  preRating,
  postRating,
  emotion,
  interventionName,
  duration,
  onSendCalm,
  className = '',
}) {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const receiptRef = useRef(null);

  const shift = postRating - preRating;
  const shiftMessage = getShiftMessage(shift);
  const { before: beforeEmoji, after: afterEmoji } = getShiftEmoji(preRating, postRating);
  const shiftColor = shift >= 3 ? 'var(--success)' : shift > 0 ? 'var(--interactive)' : 'var(--text-secondary)';

  const shareText = `I went from ${beforeEmoji} to ${afterEmoji} in ${Math.ceil(duration / 60)} minutes using ${interventionName} on AIForj. Try it: aiforj.com/start`;

  const handleCopyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      // Could add a toast notification here
      alert('Copied to clipboard!');
    } catch (error) {
      console.warn('Failed to copy:', error);
    }
  };

  const handleDownloadImage = async () => {
    if (!receiptRef.current) return;

    setIsGeneratingImage(true);
    try {
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: '#FAF6F0',
        scale: 2,
        width: 1080,
        height: 1920,
      });

      const link = document.createElement('a');
      link.download = `mood-shift-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.warn('Failed to generate image:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Add confetti animation for positive shifts
  useEffect(() => {
    if (shift >= 3) {
      // Simple confetti effect with CSS
      const style = document.createElement('style');
      style.textContent = `
        @keyframes confetti {
          0% { transform: translateY(-100vh) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(360deg); }
        }
        .confetti {
          position: fixed;
          top: -10px;
          width: 10px;
          height: 10px;
          background: ${shiftColor};
          border-radius: 50%;
          animation: confetti 3s linear infinite;
          z-index: 1000;
        }
      `;
      document.head.appendChild(style);

      const confetti = [];
      for (let i = 0; i < 20; i++) {
        const dot = document.createElement('div');
        dot.className = 'confetti';
        dot.style.left = Math.random() * 100 + 'vw';
        dot.style.animationDelay = Math.random() * 3 + 's';
        document.body.appendChild(dot);
        confetti.push(dot);
      }

      setTimeout(() => {
        confetti.forEach(dot => dot.remove());
        style.remove();
      }, 3000);
    }
  }, [shift, shiftColor]);

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }} className={className}>
      {/* Shareable Receipt Card */}
      <div
        ref={receiptRef}
        style={{
          background: 'var(--surface-elevated)',
          borderRadius: 'var(--radius-xl)',
          padding: '32px 24px',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid rgba(45,42,38,0.06)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle AIForj branding */}
        <div style={{
          position: 'absolute',
          top: 16,
          right: 16,
          fontSize: 10,
          color: 'var(--text-muted)',
          opacity: 0.6,
        }}>
          AIForj
        </div>

        {/* Emotion emoji */}
        <div style={{ fontSize: 48, marginBottom: 16 }}>
          {afterEmoji}
        </div>

        {/* Header */}
        <h2 style={{
          fontFamily: "'Fraunces', serif",
          fontSize: '1.5rem',
          fontWeight: 500,
          color: 'var(--text-primary)',
          margin: '0 0 24px',
        }}>
          Your Mood Shift
        </h2>

        {/* Visual shift */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          marginBottom: 16,
          fontSize: 32,
        }}>
          <span style={{ opacity: 0.6 }}>{beforeEmoji}</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: 24 }}>→</span>
          <span>{afterEmoji}</span>
        </div>

        {/* Shift amount */}
        <div style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: shiftColor,
          marginBottom: 8,
        }}>
          {shift > 0 ? '+' : ''}{shift} points
        </div>

        {/* Message */}
        <p style={{
          fontSize: 16,
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          margin: '0 0 20px',
        }}>
          {shiftMessage}
        </p>

        {/* Technique info */}
        <div style={{
          fontSize: 14,
          color: 'var(--text-muted)',
          marginBottom: 8,
        }}>
          Using: {interventionName}
        </div>

        <div style={{
          fontSize: 14,
          color: 'var(--text-muted)',
          marginBottom: 16,
        }}>
          {Math.ceil(duration / 60)} minutes • {new Date().toLocaleDateString()}
        </div>

        {/* Credential */}
        <div style={{
          fontSize: 12,
          color: 'var(--text-muted)',
          opacity: 0.7,
          borderTop: '1px solid rgba(45,42,38,0.06)',
          paddingTop: 16,
          marginTop: 16,
        }}>
          Clinically-informed tool by Kevin Cooke, PMHNP-BC
        </div>
      </div>

      {/* Share Section */}
      <div style={{ marginTop: 24 }}>
        <h3 style={{
          fontFamily: "'Fraunces', serif",
          fontSize: '1.25rem',
          fontWeight: 500,
          color: 'var(--text-primary)',
          margin: '0 0 16px',
          textAlign: 'center',
        }}>
          Share your shift
        </h3>

        <div style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          <button
            onClick={handleCopyShare}
            style={{
              padding: '12px 20px',
              borderRadius: 50,
              background: 'var(--surface)',
              border: '1px solid rgba(45,42,38,0.08)',
              color: 'var(--text-primary)',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--accent-sage-light)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--surface)';
            }}
          >
            Copy to clipboard
          </button>

          <button
            onClick={handleDownloadImage}
            disabled={isGeneratingImage}
            style={{
              padding: '12px 20px',
              borderRadius: 50,
              background: 'var(--interactive)',
              border: 'none',
              color: '#fff',
              fontSize: 14,
              fontWeight: 500,
              cursor: isGeneratingImage ? 'not-allowed' : 'pointer',
              opacity: isGeneratingImage ? 0.6 : 1,
              transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
            }}
            onMouseEnter={(e) => {
              if (!isGeneratingImage) {
                e.currentTarget.style.background = 'var(--interactive-hover)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--interactive)';
            }}
          >
            {isGeneratingImage ? 'Generating...' : 'Download card'}
          </button>
        </div>
      </div>

      {/* Send Calm CTA */}
      <div style={{
        marginTop: 32,
        padding: '24px',
        background: 'var(--surface-elevated)',
        borderRadius: 'var(--radius-lg)',
        textAlign: 'center',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid rgba(45,42,38,0.06)',
      }}>
        <p style={{
          fontSize: 16,
          color: 'var(--text-secondary)',
          margin: '0 0 16px',
          lineHeight: 1.6,
        }}>
          This helped you. Know someone who needs it?
        </p>

        <button
          onClick={onSendCalm}
          style={{
            padding: '12px 24px',
            borderRadius: 50,
            background: 'var(--interactive)',
            border: 'none',
            color: '#fff',
            fontSize: 15,
            fontWeight: 600,
            fontFamily: "'Fraunces', serif",
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--interactive-hover)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--interactive)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Send Calm →
        </button>
      </div>
    </div>
  );
}
