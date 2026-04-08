/**
 * Textarea Component
 * Text area input with design-system styling
 * Perfect for journaling, reflection prompts, longer responses
 */

export default function Textarea({
  label,
  placeholder,
  error,
  disabled = false,
  rows = 6,
  className = '',
  ...props
}) {
  const textareaStyle = {
    display: 'block',
    width: '100%',
    padding: '12px 16px',
    fontSize: '15px',
    fontFamily: "'DM Sans', sans-serif",
    backgroundColor: 'var(--surface)',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)',
    transition: 'border-color var(--duration-default) var(--ease-out), box-shadow var(--duration-default) var(--ease-out)',
    minHeight: '120px',
    resize: 'vertical',
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'auto',
    ...(error && { borderColor: 'var(--error)' }),
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-primary)',
    marginBottom: '8px',
  };

  const errorStyle = {
    fontSize: '14px',
    color: 'var(--error)',
    marginTop: '4px',
  };

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label style={labelStyle}>
          {label}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        style={textareaStyle}
        className={className}
        onFocus={(e) => {
          if (!error) {
            e.currentTarget.style.borderColor = 'var(--sage)';
            e.currentTarget.style.boxShadow = '0 0 0 3px var(--sage-light)';
          }
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? 'var(--error)' : 'var(--border)';
          e.currentTarget.style.boxShadow = '';
        }}
        {...props}
      />
      {error && (
        <p style={errorStyle}>
          {error}
        </p>
      )}
    </div>
  );
}
