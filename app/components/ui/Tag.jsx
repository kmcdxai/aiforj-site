/**
 * Tag / Badge Component
 * Modality and tier indicators with therapeutic color system
 * Maps to: CBT, DBT, ACT, Somatic, Behavioral, Psychoed, Free, Premium, Viral
 */

export default function Tag({
  children,
  variant = 'cbt',
  className = '',
  ...props
}) {
  const variantStyles = {
    cbt: { backgroundColor: 'var(--ocean-light)', color: 'var(--ocean-deep)' },
    dbt: { backgroundColor: 'var(--lavender-light)', color: 'var(--lavender-deep)' },
    act: { backgroundColor: 'var(--sage-light)', color: 'var(--sage-deep)' },
    somatic: { backgroundColor: 'var(--clay-light)', color: 'var(--clay-deep)' },
    behavioral: { backgroundColor: 'var(--amber-light)', color: 'var(--amber-deep)' },
    psychoed: { backgroundColor: 'var(--rose-light)', color: 'var(--rose-deep)' },
    free: { backgroundColor: 'var(--sage-light)', color: 'var(--sage-deep)' },
    premium: { backgroundColor: 'var(--amber-light)', color: 'var(--amber-deep)' },
    viral: { backgroundColor: '#fee2e2', color: '#7f1d1d' },
  };

  const style = {
    ...variantStyles[variant],
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
    transition: 'all var(--duration-default) var(--ease-out)',
  };

  return (
    <span 
      style={style}
      className={className}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
      }}
      {...props}
    >
      {children}
    </span>
  );
}
