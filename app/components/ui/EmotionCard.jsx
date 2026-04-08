/**
 * Emotion Card Component
 * 140x140px interactive card for emotion selection
 * Part of the Emotional Blueprint assessment and similar interactions
 */

export default function EmotionCard({
  emoji,
  label,
  isSelected = false,
  onClick,
  className = '',
  ...props
}) {
  const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '140px',
    height: '140px',
    padding: '16px',
    border: `2px solid ${isSelected ? 'var(--sage)' : 'transparent'}`,
    borderRadius: 'var(--radius-lg)',
    backgroundColor: isSelected ? 'var(--sage-light)' : 'var(--surface)',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all var(--duration-default) var(--ease-out)',
  };

  const emojiStyle = {
    fontSize: '32px',
    marginBottom: '8px',
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: isSelected ? 600 : 500,
    color: isSelected ? 'var(--sage-deep)' : 'var(--ink-soft)',
  };

  return (
    <div
      style={cardStyle}
      className={className}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'var(--sage-light)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = isSelected ? 'var(--sage)' : 'transparent';
        e.currentTarget.style.boxShadow = '';
      }}
      {...props}
    >
      <div style={emojiStyle}>
        {emoji}
      </div>
      <div style={labelStyle}>
        {label}
      </div>
    </div>
  );
}
