/**
 * Modal / Dialog Component
 * Centered overlay with backdrop blur and smooth entrance
 * Perfect for therapeutic interventions and user confirmations
 */

import { useEffect } from 'react';

export default function Modal({
  isOpen = false,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  className = '',
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeWidths = {
    sm: '100%',
    md: '100%',
    lg: '100%',
    maxWidth: { sm: '320px', md: '448px', lg: '512px' },
  };

  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(8px)',
    animation: 'fadeIn 300ms ease-out',
  };

  const contentStyle = {
    width: '90%',
    maxWidth: sizeWidths.maxWidth[size],
    backgroundColor: 'var(--surface-elevated)',
    borderRadius: 'var(--radius-xl)',
    padding: '32px',
    boxShadow: 'var(--shadow-lg)',
    animation: 'slideUp 300ms ease-out',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  };

  const titleStyle = {
    fontSize: 'var(--font-h2)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  };

  const closeButtonStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '24px',
    lineHeight: 1,
    color: 'var(--ink-muted)',
    cursor: 'pointer',
    padding: 0,
  };

  const bodyStyle = {
    marginBottom: '24px',
  };

  const footerStyle = {
    display: 'flex',
    gap: '16px',
    justifyContent: 'flex-end',
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div
        style={contentStyle}
        className={className}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div style={headerStyle}>
            <h2 style={titleStyle}>
              {title}
            </h2>
            <button
              onClick={onClose}
              style={closeButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--ink-muted)';
              }}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        )}

        <div style={bodyStyle}>
          {children}
        </div>

        {footer && (
          <div style={footerStyle}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
