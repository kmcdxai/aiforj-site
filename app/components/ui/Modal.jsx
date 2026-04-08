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

  const headerStyle = {\n    display: 'flex',\n    justifyContent: 'space-between',\n    alignItems: 'center',\n    marginBottom: '16px',\n  };\n\n  const titleStyle = {\n    fontSize: 'var(--font-h2)',\n    fontWeight: 600,\n    color: 'var(--text-primary)',\n  };\n\n  const closeButtonStyle = {\n    backgroundColor: 'transparent',\n    border: 'none',\n    fontSize: '24px',\n    lineHeight: 1,\n    color: 'var(--ink-muted)',\n    cursor: 'pointer',\n    padding: 0,\n  };\n\n  const bodyStyle = {\n    marginBottom: '24px',\n  };\n\n  const footerStyle = {\n    display: 'flex',\n    gap: '16px',\n    justifyContent: 'flex-end',\n  };

  return (\n    <div style={overlayStyle} onClick={onClose}>\n      <div\n        style={contentStyle}\n        className={className}\n        onClick={(e) => e.stopPropagation()}\n      >\n        {title && (\n          <div style={headerStyle}>\n            <h2 style={titleStyle}>\n              {title}\n            </h2>\n            <button\n              onClick={onClose}\n              style={closeButtonStyle}\n              onMouseEnter={(e) => {\n                e.currentTarget.style.color = 'var(--text-primary)';\n              }}\n              onMouseLeave={(e) => {\n                e.currentTarget.style.color = 'var(--ink-muted)';\n              }}\n              aria-label=\"Close modal\"\n            >\n              ✕\n            </button>\n          </div>\n        )}\n\n        <div style={bodyStyle}>\n          {children}\n        </div>\n\n        {footer && (\n          <div style={footerStyle}>\n            {footer}\n          </div>\n        )}\n      </div>\n    </div>\n  );\n}
