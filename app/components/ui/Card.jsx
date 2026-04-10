/**
 * Card Component
 * Elevated surface with subtle shadow and hover effects
 * Perfect for containing content in a distressed-user environment
 */

export default function Card({
  children,
  className = '',
  hoverable = true,
  style: customStyle = {},
  ...props
}) {
  const style = {
    backgroundColor: 'var(--surface-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px 28px',
    boxShadow: 'var(--shadow-md)',
    transition: 'transform var(--duration-default) var(--ease-out), box-shadow var(--duration-default) var(--ease-out)',
    ...customStyle,
  };

  return (
    <div 
      style={style}
      className={className}
      onMouseEnter={hoverable ? (e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      } : undefined}
      onMouseLeave={hoverable ? (e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      } : undefined}
      {...props}
    >
      {children}
    </div>
  );
}
