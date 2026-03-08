"use client";

import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    // Activate premium in localStorage
    localStorage.setItem('aiforj_premium', JSON.stringify(true));
    setActivated(true);

    // Redirect to main app after 3 seconds
    const timer = setTimeout(() => {
      window.location.href = '/';
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F5F2ED',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif",
      padding: 24,
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: 480,
        animation: 'fadeIn 0.8s ease',
      }}>
        <span style={{ fontSize: 64, display: 'block', marginBottom: 24 }}>✦</span>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 32,
          fontWeight: 400,
          color: '#2D3732',
          margin: '0 0 12px',
        }}>
          Welcome to Premium
        </h1>
        <p style={{
          fontSize: 16,
          color: '#6B7F6E',
          lineHeight: 1.6,
          margin: '0 0 32px',
        }}>
          Your AIForj Premium subscription is now active.
          AI insights, mood tracking, guided journaling — it's all yours.
        </p>
        <p style={{
          fontSize: 14,
          color: '#6B7F6E',
          opacity: 0.6,
        }}>
          {activated ? 'Redirecting you back to AIForj...' : 'Activating...'}
        </p>
        <a href="/" style={{
          display: 'inline-block',
          marginTop: 20,
          padding: '14px 40px',
          fontSize: 15,
          background: '#2D3732',
          color: '#F5F2ED',
          borderRadius: 50,
          textDecoration: 'none',
          letterSpacing: 1,
        }}>
          Start Using Premium →
        </a>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
