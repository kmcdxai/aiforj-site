"use client";

import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import PremiumCheckoutButton from '../monetization/PremiumCheckoutButton';

const SHIFT_MESSAGES = {
  positiveLarge: "That\u2019s a meaningful shift. This technique works for you.",
  positiveSmall: "Every point counts. You showed up for yourself.",
  neutral: "Sometimes showing up is the win. This one might not be your match \u2014 try a different technique next time.",
  negative: "It\u2019s okay \u2014 not every tool fits every moment. Your willingness to try still matters.",
};

function getShiftMessage(shift) {
  if (shift >= 3) return SHIFT_MESSAGES.positiveLarge;
  if (shift > 0) return SHIFT_MESSAGES.positiveSmall;
  if (shift === 0) return SHIFT_MESSAGES.neutral;
  return SHIFT_MESSAGES.negative;
}

const EMOJI_RATINGS = [
  { emoji: '\u{1F623}', label: 'Struggling', range: [1, 2] },
  { emoji: '\u{1F614}', label: 'Tough', range: [3, 4] },
  { emoji: '\u{1F610}', label: 'Okay', range: [5, 6] },
  { emoji: '\u{1F642}', label: 'Good', range: [7, 8] },
  { emoji: '\u{1F60C}', label: 'Great', range: [9, 10] },
];

function getEmojiForRating(rating) {
  const found = EMOJI_RATINGS.find(r => rating >= r.range[0] && rating <= r.range[1]);
  return found || EMOJI_RATINGS[2];
}

export default function MoodShiftReceipt({
  preRating,
  postRating,
  emotion,
  interventionName,
  interventionSlug,
  duration,
  onSendCalm,
  onTryDifferent,
  className = '',
}) {
  const [copied, setCopied] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const receiptRef = useRef(null);
  const downloadRef = useRef(null);

  const shift = postRating - preRating;
  const shiftMessage = getShiftMessage(shift);
  const beforeData = getEmojiForRating(preRating);
  const afterData = getEmojiForRating(postRating);
  const shiftColor = shift >= 3 ? 'var(--success)' : shift > 0 ? 'var(--interactive)' : shift === 0 ? 'var(--text-secondary)' : 'var(--warning)';
  const durationMinutes = Math.max(1, Math.ceil((duration || 0) / 60000));

  const shareText = `I went from ${beforeData.emoji} to ${afterData.emoji} in ${durationMinutes} minutes using ${interventionName} on AIForj. Try it: aiforj.com/start`;
  const sendCalmText = `Hey, I just tried this and it actually helped. Thought of you: aiforj.com/start`;

  const handleCopyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.warn('Failed to copy:', error);
    }
  };

  const handleDownloadImage = async () => {
    if (!downloadRef.current) return;
    setIsGeneratingImage(true);
    try {
      // Temporarily show the download-optimized card
      downloadRef.current.style.display = 'flex';
      const canvas = await html2canvas(downloadRef.current, {
        backgroundColor: '#FAF6F0',
        scale: 2,
        useCORS: true,
      });
      downloadRef.current.style.display = 'none';

      const link = document.createElement('a');
      link.download = `mood-shift-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.warn('Failed to generate image:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSendCalm = () => {
    if (onSendCalm) {
      onSendCalm();
    } else if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: 'AIForj \u2014 Send Calm',
        text: sendCalmText,
        url: 'https://aiforj.com/start',
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(sendCalmText).catch(() => {});
    }
  };

  // Confetti for positive shifts >= 3
  useEffect(() => {
    if (shift < 3) return;

    const dots = [];
    const colors = ['var(--sage)', 'var(--lavender)', 'var(--ocean)', 'var(--amber)', 'var(--rose)'];

    for (let i = 0; i < 24; i++) {
      const dot = document.createElement('div');
      const size = 6 + Math.random() * 6;
      dot.style.cssText = `
        position: fixed;
        top: -12px;
        left: ${Math.random() * 100}vw;
        width: ${size}px;
        height: ${size}px;
        background: ${colors[i % colors.length]};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        opacity: 0.7;
        z-index: 1000;
        pointer-events: none;
        animation: receiptConfetti ${2.5 + Math.random() * 2}s ease-out forwards;
        animation-delay: ${Math.random() * 0.8}s;
      `;
      document.body.appendChild(dot);
      dots.push(dot);
    }

    const style = document.createElement('style');
    style.textContent = `
      @keyframes receiptConfetti {
        0% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
        100% { transform: translateY(100vh) rotate(${360 + Math.random() * 360}deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    const cleanup = setTimeout(() => {
      dots.forEach(d => d.remove());
      style.remove();
    }, 5000);

    return () => {
      clearTimeout(cleanup);
      dots.forEach(d => d.remove());
      style.remove();
    };
  }, [shift]);

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: '24px 16px' }} className={className}>

      {/* ── Visible Receipt Card ── */}
      <div
        ref={receiptRef}
        style={{
          background: 'var(--surface-elevated)',
          borderRadius: 24,
          padding: '36px 28px 28px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
          border: '1px solid rgba(45,42,38,0.05)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          animation: 'receiptSlideUp 0.5s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* AIForj watermark */}
        <div style={{
          position: 'absolute',
          top: 16,
          right: 18,
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--text-muted)',
          opacity: 0.5,
          letterSpacing: '0.04em',
        }}>
          AIForj
        </div>

        {/* After emoji large */}
        <div style={{ fontSize: 56, marginBottom: 12, lineHeight: 1 }}>
          {afterData.emoji}
        </div>

        {/* Header */}
        <h2 style={{
          fontFamily: "'Fraunces', serif",
          fontSize: 'clamp(1.4rem, 3.5vw, 1.75rem)',
          fontWeight: 500,
          color: 'var(--text-primary)',
          margin: '0 0 24px',
        }}>
          Your Mood Shift
        </h2>

        {/* Visual shift: before → after */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          marginBottom: 16,
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 36, opacity: 0.5, marginBottom: 4 }}>{beforeData.emoji}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{preRating}/10</div>
          </div>
          <div style={{
            fontSize: 28,
            color: shiftColor,
            fontWeight: 300,
          }}>
            {'\u2192'}
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 44, marginBottom: 4 }}>{afterData.emoji}</div>
            <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>{postRating}/10</div>
          </div>
        </div>

        {/* Shift amount */}
        <div style={{
          fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
          fontWeight: 700,
          color: shiftColor,
          marginBottom: 12,
          fontFamily: "'Fraunces', serif",
        }}>
          {shift > 0 ? '+' : ''}{shift} {Math.abs(shift) === 1 ? 'point' : 'points'}
        </div>

        {/* Message */}
        <p style={{
          fontSize: 15,
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          margin: '0 0 20px',
          maxWidth: 320,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          {shiftMessage}
        </p>

        {/* Technique + metadata */}
        <div style={{
          padding: '14px 16px',
          background: 'var(--surface)',
          borderRadius: 14,
          marginBottom: 20,
        }}>
          <div style={{
            fontSize: 13,
            color: 'var(--text-muted)',
            marginBottom: 4,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            Using
          </div>
          <div style={{
            fontSize: 15,
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}>
            {interventionName}
          </div>
          <div style={{
            fontSize: 13,
            color: 'var(--text-muted)',
            marginTop: 6,
          }}>
            {durationMinutes} {durationMinutes === 1 ? 'minute' : 'minutes'} {'\u00b7'} {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        {/* Negative shift: suggest alternative */}
        {shift < 0 && (
          <div style={{
            padding: '14px 16px',
            background: 'rgba(212,168,67,0.08)',
            borderRadius: 14,
            marginBottom: 20,
            border: '1px solid rgba(212,168,67,0.15)',
          }}>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 10px', lineHeight: 1.6 }}>
              Want to try a different approach?
            </p>
            <button
              onClick={onTryDifferent || (() => { window.location.href = '/start'; })}
              style={{
                padding: '10px 20px',
                borderRadius: 50,
                background: 'var(--interactive)',
                border: 'none',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Try another technique {'\u2192'}
            </button>
          </div>
        )}

        {/* Credential */}
        <div style={{
          fontSize: 11,
          color: 'var(--text-muted)',
          opacity: 0.6,
          borderTop: '1px solid rgba(45,42,38,0.06)',
          paddingTop: 16,
        }}>
          Built by AIForj Team · Clinically informed by a Licensed Healthcare Provider
        </div>
      </div>

      {/* ── Hidden downloadable card (Instagram story aspect ratio) ── */}
      <div
        ref={downloadRef}
        style={{
          display: 'none',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: 540,
          height: 960,
          background: 'linear-gradient(180deg, #FAF6F0 0%, #F0E8DA 100%)',
          padding: '60px 48px',
          textAlign: 'center',
          position: 'fixed',
          left: '-9999px',
          top: 0,
          zIndex: -1,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, color: '#7A9E7E', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 40 }}>
          AIForj
        </div>
        <div style={{ fontSize: 72, marginBottom: 24 }}>{afterData.emoji}</div>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 500, color: '#2C2520', marginBottom: 40 }}>
          My Mood Shift
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginBottom: 24 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, opacity: 0.5 }}>{beforeData.emoji}</div>
            <div style={{ fontSize: 18, color: '#8A8078', marginTop: 8 }}>{preRating}/10</div>
          </div>
          <div style={{ fontSize: 36, color: '#7A9E7E' }}>{'\u2192'}</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 60 }}>{afterData.emoji}</div>
            <div style={{ fontSize: 18, color: '#2C2520', fontWeight: 600, marginTop: 8 }}>{postRating}/10</div>
          </div>
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, color: shift >= 0 ? '#5A8B5E' : '#C4856C', marginBottom: 20, fontFamily: "'Fraunces', serif" }}>
          {shift > 0 ? '+' : ''}{shift} {Math.abs(shift) === 1 ? 'point' : 'points'}
        </div>
        <div style={{ fontSize: 16, color: '#5C534A', lineHeight: 1.6, maxWidth: 380, marginBottom: 40 }}>
          {shiftMessage}
        </div>
        <div style={{ padding: '16px 24px', background: 'rgba(122,158,126,0.08)', borderRadius: 16 }}>
          <div style={{ fontSize: 14, color: '#8A8078', marginBottom: 4 }}>Using: {interventionName}</div>
          <div style={{ fontSize: 14, color: '#8A8078' }}>{durationMinutes} min {'\u00b7'} {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
        </div>
        <div style={{ marginTop: 'auto', paddingTop: 40, fontSize: 12, color: '#8A8078', opacity: 0.6 }}>
          Built by AIForj Team {'\u00b7'} Clinically informed by a Licensed Healthcare Provider {'\u00b7'} aiforj.com
        </div>
      </div>

      {/* ── Share Section ── */}
      <div style={{ marginTop: 28, textAlign: 'center' }}>
        <h3 style={{
          fontFamily: "'Fraunces', serif",
          fontSize: '1.2rem',
          fontWeight: 500,
          color: 'var(--text-primary)',
          margin: '0 0 16px',
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
              padding: '12px 22px',
              borderRadius: 50,
              background: copied ? 'var(--accent-sage-light)' : 'var(--surface)',
              border: '1px solid rgba(45,42,38,0.08)',
              color: copied ? 'var(--sage-deep)' : 'var(--text-primary)',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
              minWidth: 140,
            }}
          >
            {copied ? '\u2713 Copied!' : 'Copy to clipboard'}
          </button>

          <button
            onClick={handleDownloadImage}
            disabled={isGeneratingImage}
            style={{
              padding: '12px 22px',
              borderRadius: 50,
              background: 'var(--interactive)',
              border: 'none',
              color: '#fff',
              fontSize: 14,
              fontWeight: 500,
              cursor: isGeneratingImage ? 'not-allowed' : 'pointer',
              opacity: isGeneratingImage ? 0.6 : 1,
              transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
              minWidth: 140,
            }}
            onMouseEnter={(e) => {
              if (!isGeneratingImage) e.currentTarget.style.background = 'var(--interactive-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--interactive)';
            }}
          >
            {isGeneratingImage ? 'Generating...' : 'Download card'}
          </button>
        </div>
      </div>

      {/* ── Send Calm CTA ── */}
      <div style={{
        marginTop: 32,
        padding: '24px',
        background: 'var(--surface-elevated)',
        borderRadius: 20,
        textAlign: 'center',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        border: '1px solid rgba(45,42,38,0.05)',
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
          onClick={handleSendCalm}
          style={{
            padding: '14px 28px',
            borderRadius: 50,
            background: 'var(--interactive)',
            border: 'none',
            color: '#fff',
            fontSize: 16,
            fontWeight: 600,
            fontFamily: "'Fraunces', serif",
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
            boxShadow: '0 4px 16px rgba(122,158,126,0.25)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--interactive-hover)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(122,158,126,0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--interactive)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(122,158,126,0.25)';
          }}
        >
          Send Calm {'\u2192'}
        </button>
      </div>

      <div style={{
        marginTop: 18,
        padding: '22px',
        background: 'var(--surface)',
        borderRadius: 20,
        textAlign: 'center',
        border: '1px solid rgba(107,152,184,0.12)',
      }}>
        <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '1.05rem', margin: '0 0 8px', color: 'var(--text-primary)' }}>
          Watch this become part of your Mood Garden
        </h3>
        <p style={{ margin: '0 auto 14px', color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>
          Your completed sessions, mood shifts, and check-ins can grow into a private progress landscape on this device.
        </p>
        <a href="/garden" className="btn-secondary" style={{ textDecoration: 'none', color: 'var(--ocean-deep)', borderColor: 'var(--ocean)' }}>
          Open Mood Garden →
        </a>
      </div>

      <div style={{
        marginTop: 18,
        padding: '22px',
        background: 'var(--amber-light)',
        borderRadius: 20,
        textAlign: 'center',
        border: '1px solid rgba(212,168,67,0.22)',
      }}>
        <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '1.05rem', margin: '0 0 8px', color: 'var(--text-primary)' }}>
          Want more guided support?
        </h3>
        <p style={{ margin: '0 auto 14px', color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>
          Talk to Forj Premium adds deeper personalized sessions without blocking the free tools.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
          <PremiumCheckoutButton style={{ background: 'var(--amber-deep)' }}>
            Start Premium trial →
          </PremiumCheckoutButton>
          <a href="https://aiforj.gumroad.com/l/jmdqvd" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ textDecoration: 'none', color: 'var(--amber-deep)', borderColor: 'var(--amber)' }}>
            Get the CBT Workbook →
          </a>
        </div>
      </div>

      {/* ── Back to start ── */}
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <a
          href="/start"
          style={{
            fontSize: 14,
            color: 'var(--text-muted)',
            textDecoration: 'none',
            transition: 'color 0.2s ease',
          }}
        >
          {'\u2190'} Start a new check-in
        </a>
      </div>

      <style>{`
        @keyframes receiptSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
