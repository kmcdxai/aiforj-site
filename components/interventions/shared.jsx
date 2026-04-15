"use client";

export const ANGER_ACCENT = '#C45B5B';
export const ANGER_LIGHT = 'rgba(196, 91, 91, 0.08)';
export const ANGER_BORDER = 'rgba(196, 91, 91, 0.22)';
export const ANGER_GLOW = 'rgba(196, 91, 91, 0.14)';

export function appendToStorage(key, value) {
  try {
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push(value);
    localStorage.setItem(key, JSON.stringify(existing));
    return true;
  } catch (_) {
    return false;
  }
}

export function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (_) {
    return false;
  }
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (_) {
    return false;
  }
}

export function formatSeconds(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function splitSentences(text = '') {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

export function StepDots({ currentStep, totalSteps, accent = ANGER_ACCENT, label }) {
  return (
    <div style={{ display: 'grid', gap: 10, marginBottom: 24 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              height: 8,
              borderRadius: 999,
              background: index < currentStep ? accent : 'rgba(44, 37, 32, 0.08)',
              transition: 'background 200ms ease',
            }}
          />
        ))}
      </div>
      {label ? (
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: 'var(--text-muted)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
}

export function InterventionShell({ children, maxWidth = 560, center = false }) {
  return (
    <div style={shellStyles.container}>
      <div
        style={{
          ...shellStyles.inner,
          maxWidth,
          minHeight: center ? '70vh' : 'auto',
          justifyContent: center ? 'center' : 'flex-start',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function PrimaryButton({ children, accent = ANGER_ACCENT, disabled, style, ...props }) {
  return (
    <button
      {...props}
      disabled={disabled}
      style={{
        ...shellStyles.primaryButton,
        background: accent,
        opacity: disabled ? 0.45 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, style, ...props }) {
  return (
    <button
      {...props}
      style={{
        ...shellStyles.secondaryButton,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function ChoiceCard({ children, selected, accent = ANGER_ACCENT, style, ...props }) {
  return (
    <button
      type="button"
      {...props}
      style={{
        ...shellStyles.choiceCard,
        borderColor: selected ? accent : 'var(--border)',
        background: selected ? `color-mix(in srgb, ${accent} 8%, white)` : 'var(--surface-elevated)',
        boxShadow: selected ? `0 10px 30px ${ANGER_GLOW}` : 'var(--shadow-sm)',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function FieldLabel({ children, hint }) {
  return (
    <div style={{ display: 'grid', gap: 6, marginBottom: 10 }}>
      <label style={shellStyles.label}>{children}</label>
      {hint ? <p style={shellStyles.hint}>{hint}</p> : null}
    </div>
  );
}

export const shellStyles = {
  container: {
    minHeight: '100vh',
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    fontFamily: "'DM Sans', sans-serif",
  },
  inner: {
    width: '100%',
    margin: '0 auto',
    padding: '32px 24px 96px',
    display: 'flex',
    flexDirection: 'column',
  },
  card: {
    background: 'var(--surface-elevated)',
    borderRadius: 24,
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow-md)',
    padding: '28px 24px',
  },
  heroCard: {
    background: 'linear-gradient(180deg, rgba(196, 91, 91, 0.1) 0%, rgba(255,255,255,0.9) 100%)',
    border: `1px solid ${ANGER_BORDER}`,
    boxShadow: `0 16px 40px ${ANGER_GLOW}`,
  },
  eyebrow: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    color: ANGER_ACCENT,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  heading: {
    fontFamily: "'Fraunces', serif",
    fontSize: 'clamp(28px, 4vw, 38px)',
    lineHeight: 1.15,
    margin: 0,
    color: 'var(--text-primary)',
  },
  subheading: {
    fontFamily: "'Fraunces', serif",
    fontSize: 22,
    lineHeight: 1.2,
    margin: 0,
    color: 'var(--text-primary)',
  },
  body: {
    fontSize: 16,
    lineHeight: 1.7,
    color: 'var(--text-secondary)',
    margin: 0,
  },
  label: {
    fontSize: 14,
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  hint: {
    margin: 0,
    fontSize: 13,
    lineHeight: 1.6,
    color: 'var(--text-muted)',
  },
  textInput: {
    width: '100%',
    borderRadius: 18,
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--text-primary)',
    fontSize: 16,
    padding: '15px 16px',
    outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
  },
  textarea: {
    width: '100%',
    borderRadius: 20,
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--text-primary)',
    fontSize: 16,
    padding: '16px 18px',
    outline: 'none',
    resize: 'vertical',
    minHeight: 132,
    lineHeight: 1.7,
    fontFamily: "'DM Sans', sans-serif",
  },
  primaryButton: {
    border: 'none',
    borderRadius: 999,
    color: '#fff',
    padding: '14px 22px',
    fontWeight: 700,
    fontSize: 15,
    lineHeight: 1,
    fontFamily: "'DM Sans', sans-serif",
    transition: 'transform 180ms ease, box-shadow 180ms ease',
    boxShadow: `0 10px 24px ${ANGER_GLOW}`,
  },
  secondaryButton: {
    border: '1px solid var(--border)',
    background: 'var(--surface-elevated)',
    color: 'var(--text-primary)',
    borderRadius: 999,
    padding: '14px 22px',
    fontWeight: 700,
    fontSize: 15,
    lineHeight: 1,
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
  },
  buttonRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  choiceCard: {
    width: '100%',
    textAlign: 'left',
    padding: '18px 18px',
    borderRadius: 20,
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    padding: '8px 12px',
    fontSize: 13,
    fontWeight: 700,
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
  },
  statCard: {
    padding: '18px 16px',
    borderRadius: 20,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
  },
};

export function rangeStyle(accent = ANGER_ACCENT) {
  return {
    width: '100%',
    accentColor: accent,
  };
}
