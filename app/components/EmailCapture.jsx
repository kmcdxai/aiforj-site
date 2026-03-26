"use client";

import { useState } from "react";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    try {
      const existing = JSON.parse(localStorage.getItem("aiforj_subscribers") || "[]");
      if (!existing.includes(email)) {
        existing.push(email);
        localStorage.setItem("aiforj_subscribers", JSON.stringify(existing));
      }
    } catch {}
    setSubmitted(true);
  };

  return (
    <section style={{
      width: "100%",
      maxWidth: 560,
      margin: "60px auto 0",
      padding: "40px 24px",
      textAlign: "center",
    }}>
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(107,127,110,0.15)",
        borderRadius: 20,
        padding: "36px 28px",
      }}>
        {submitted ? (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>✓</div>
            <p style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 17,
              fontWeight: 500,
              color: "#6B7F6E",
              margin: 0,
            }}>
              You're in. Watch your inbox.
            </p>
          </div>
        ) : (
          <>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(20px, 4vw, 26px)",
              fontWeight: 400,
              color: "#D8E8F0",
              margin: "0 0 8px",
              lineHeight: 1.3,
            }}>
              Get one 60-second technique every week
            </h3>
            <p style={{
              fontSize: 14,
              color: "rgba(216,232,240,0.55)",
              margin: "0 0 24px",
              fontWeight: 300,
            }}>
              Free. No spam. Unsubscribe anytime.
            </p>
            <form onSubmit={handleSubmit} style={{
              display: "flex",
              gap: 10,
              maxWidth: 400,
              margin: "0 auto",
              flexWrap: "wrap",
              justifyContent: "center",
            }}>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="your@email.com"
                aria-label="Email address"
                style={{
                  flex: "1 1 200px",
                  padding: "12px 18px",
                  fontSize: 15,
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(107,127,110,0.25)",
                  borderRadius: 12,
                  color: "#D8E8F0",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#6B7F6E"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(107,127,110,0.25)"; }}
              />
              <button type="submit" style={{
                padding: "12px 28px",
                fontSize: 15,
                fontWeight: 600,
                fontFamily: "'Sora', sans-serif",
                background: "linear-gradient(135deg, #6B7F6E, #5A6E5D)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                cursor: "pointer",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 4px 16px rgba(107,127,110,0.3)"; }}
              onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}
              >
                Subscribe
              </button>
            </form>
            {error && (
              <p style={{ fontSize: 13, color: "#d4746a", marginTop: 10, marginBottom: 0 }}>{error}</p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
