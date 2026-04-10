"use client";

import { useState } from 'react';

export default function PremiumCheckoutButton({
  children = 'Start 7-day free trial',
  className = 'btn-primary',
  style = {},
  fallbackHref = '/companion',
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const startCheckout = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/create-checkout-session', { method: 'POST' });
      const data = await response.json();
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error(data?.error || 'Checkout unavailable');
    } catch (checkoutError) {
      console.warn('Unable to start checkout:', checkoutError);
      setError('Checkout did not start here. Opening Talk to Forj instead.');
      window.location.href = fallbackHref;
    } finally {
      setLoading(false);
    }
  };

  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <button
        type="button"
        onClick={startCheckout}
        disabled={loading}
        className={className}
        style={{ ...style, opacity: loading ? 0.7 : style.opacity }}
      >
        {loading ? 'Opening checkout...' : children}
      </button>
      {error && (
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{error}</span>
      )}
    </span>
  );
}
