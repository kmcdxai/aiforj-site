/**
 * Progress Bar Component
 * Visual indicator for progress toward completion
 * Uses sage green with smooth transitions
 */

export default function ProgressBar({
  value = 0,
  max = 100,
  label,
  showPercentage = true,
  className = '',
  ...props
}) {
  const percentage = Math.min((value / max) * 100, 100);

  const containerStyle = {
    width: '100%',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-primary)',
  };

  const percentageStyle = {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--ink-muted)',
  };

  const barContainerStyle = {
    width: '100%',
    height: '6px',
    borderRadius: 'var(--radius-full)',
    backgroundColor: 'var(--parchment-deep)',
    overflow: 'hidden',
  };

  const barFillStyle = {
    height: '100%',
    backgroundColor: 'var(--sage)',
    borderRadius: 'var(--radius-full)',
    width: `${percentage}%`,
    transition: 'width var(--duration-slow) var(--ease-out)',
  };

  return (
    <div style={containerStyle} className={className} {...props}>
      {(label || showPercentage) && (
        <div style={headerStyle}>
          {label && (
            <span style={labelStyle}>
              {label}
            </span>
          )}
          {showPercentage && (
            <span style={percentageStyle}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div style={barContainerStyle}>
        <div style={barFillStyle} />
      </div>
    </div>
  );
}
