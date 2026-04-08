/**
 * Button Component
 * Three variants: primary (sage), secondary (outlined), ghost (minimal)
 * Uses inline styles with CSS variables from globals.css
 */

export default function Button({
  children,
  variant = 'primary',
  disabled = false,
  className = '',
  ...props
}) {
  const baseStyle = {
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600,
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    transition: 'all var(--duration-default) var(--ease-out)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    opacity: disabled ? 0.5 : 1,
  };

  const variantStyles = {
    primary: {
      ...baseStyle,
      backgroundColor: 'var(--sage-deep)',
      color: 'white',
      padding: '12px 24px',
      fontSize: '15px',
    },
    secondary: {
      ...baseStyle,
      backgroundColor: 'transparent',
      border: '1.5px solid var(--sage-deep)',
      color: 'var(--sage-deep)',
      padding: '12px 24px',
      fontSize: '15px',
    },
    ghost: {
      ...baseStyle,
      backgroundColor: 'transparent',
      border: 'none',
      color: 'var(--ink-soft)',
      padding: '8px 16px',
      fontSize: '14px',
    },
  };

  const style = variantStyles[variant] || variantStyles.primary;

  return (
    <button
      style={style}
      className={className}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
