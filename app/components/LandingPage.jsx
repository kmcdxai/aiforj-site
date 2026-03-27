"use client";

import { useState } from "react";

export default function LandingPage({
  smallText,
  headline,
  subtext,
  feelsLike,
  whatHelps,
  shareText,
  shareUrl,
  workbookLine,
  premiumLine,
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: headline, text: shareText, url: shareUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {});
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0F0D", color: "#E8EEEA", display: "flex", flexDirection: "column" }}>

      {/* Back link */}
      <div style={{ padding: "20px 24px" }}>
        <a href="/" style={{ fontSize: 12, color: "#B0C4B8", textDecoration: "none", fontFamily: "'IBM Plex Sans', sans-serif", display: "inline-flex", alignItems: "center", gap: 6, transition: "color 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.color = "#4FFFB0"} onMouseLeave={e => e.currentTarget.style.color = "#8B9E93"}>
          ← Back to AIForj
        </a>
      </div>

      {/* Hero */}
      <section style={{ flex: "0 0 auto", padding: "60px 24px 80px", maxWidth: 640, margin: "0 auto", width: "100%", textAlign: "center" }}>
        <span style={{ fontSize: 14, color: "#B0C4B8", fontFamily: "'IBM Plex Sans', sans-serif", display: "block", marginBottom: 16, letterSpacing: 0.5 }}>{smallText}</span>
        <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 700, color: "#E8EEEA", margin: "0 0 18px", lineHeight: 1.2 }}>{headline}</h1>
        <p style={{ fontSize: 16, color: "#B0C4B8", lineHeight: 1.7, margin: "0 0 32px", fontFamily: "'IBM Plex Sans', sans-serif", maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>{subtext}</p>
        <a href="/" style={{ display: "inline-block", padding: "16px 40px", fontSize: 16, fontFamily: "'Sora', sans-serif", background: "linear-gradient(135deg, #4FFFB0, #2DD4BF)", color: "#0A0F0D", border: "none", borderRadius: 50, cursor: "pointer", letterSpacing: 0.5, fontWeight: 700, textDecoration: "none", transition: "all 0.2s", boxShadow: "0 4px 24px rgba(79,255,176,0.2)" }}>
          Start talking →
        </a>
        <div style={{ marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ fontSize: 13 }}>🔒</span>
          <span style={{ fontSize: 12, color: "#B0C4B8", fontFamily: "'IBM Plex Sans', sans-serif" }}>100% private — nothing leaves your browser</span>
        </div>
      </section>

      {/* This might feel like... */}
      <section style={{ padding: "0 24px 64px", maxWidth: 640, margin: "0 auto", width: "100%" }}>
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 600, color: "#E8EEEA", marginBottom: 20, textAlign: "center" }}>This might feel like...</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
          {feelsLike.map((item, i) => (
            <div key={i} style={{ padding: "14px 18px", background: "rgba(79,255,176,0.04)", border: "1px solid rgba(79,255,176,0.08)", borderRadius: 14, backdropFilter: "blur(12px)" }}>
              <span style={{ fontSize: 14, color: "#B0C4B8", fontFamily: "'IBM Plex Sans', sans-serif", lineHeight: 1.6 }}>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* What helps */}
      <section style={{ padding: "0 24px 64px", maxWidth: 640, margin: "0 auto", width: "100%" }}>
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 600, color: "#E8EEEA", marginBottom: 20, textAlign: "center" }}>What helps</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {whatHelps.map((item, i) => (
            <div key={i} style={{ padding: "18px 22px", background: "rgba(79,255,176,0.04)", border: "1px solid rgba(79,255,176,0.1)", borderRadius: 16, backdropFilter: "blur(12px)" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#4FFFB0", fontFamily: "'Sora', sans-serif" }}>{item.title}</span>
              <span style={{ fontSize: 14, color: "#B0C4B8", fontFamily: "'IBM Plex Sans', sans-serif" }}> — {item.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Share */}
      <section style={{ padding: "0 24px 64px", maxWidth: 640, margin: "0 auto", width: "100%", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 600, color: "#E8EEEA", marginBottom: 16 }}>Know someone who needs this?</h2>
        <button onClick={handleShare} style={{ padding: "12px 28px", fontSize: 14, fontFamily: "'IBM Plex Sans', sans-serif", background: "rgba(79,255,176,0.06)", border: "1px solid rgba(79,255,176,0.15)", borderRadius: 30, color: "#B0C4B8", cursor: "pointer", transition: "all 0.2s" }}>
          {copied ? "Copied!" : "↗ Share this page"}
        </button>
        <p style={{ fontSize: 12, color: "#B0C4B8", opacity: 0.5, marginTop: 10, fontFamily: "'IBM Plex Sans', sans-serif" }}>{shareText}</p>
      </section>

      {/* Workbook */}
      <section style={{ padding: "0 24px 48px", maxWidth: 640, margin: "0 auto", width: "100%" }}>
        <div style={{ padding: "28px 24px", background: "rgba(79,255,176,0.04)", border: "1px solid rgba(79,255,176,0.1)", borderRadius: 20, backdropFilter: "blur(12px)", textAlign: "center" }}>
          <p style={{ fontSize: 15, color: "#E8EEEA", margin: "0 0 10px", lineHeight: 1.6, fontFamily: "'IBM Plex Sans', sans-serif" }}>{workbookLine}</p>
          <p style={{ fontSize: 13, color: "#B0C4B8", margin: "0 0 16px", fontFamily: "'IBM Plex Sans', sans-serif" }}>30 days of guided exercises · 10 cognitive distortions · $27</p>
          <a href="https://aiforj.gumroad.com/l/jmdqvd" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "10px 28px", fontSize: 13, fontFamily: "'Sora', sans-serif", background: "rgba(79,255,176,0.1)", border: "1px solid rgba(79,255,176,0.2)", borderRadius: 30, color: "#4FFFB0", textDecoration: "none", fontWeight: 600, transition: "all 0.2s" }}>
            Get the Workbook →
          </a>
        </div>
      </section>

      {/* Premium */}
      <section style={{ padding: "0 24px 64px", maxWidth: 640, margin: "0 auto", width: "100%", textAlign: "center" }}>
        <p style={{ fontSize: 14, color: "#B0C4B8", margin: "0 0 10px", lineHeight: 1.6, fontFamily: "'IBM Plex Sans', sans-serif" }}>{premiumLine}</p>
        <p style={{ fontSize: 12, color: "#B0C4B8", opacity: 0.6, margin: "0 0 16px", fontFamily: "'IBM Plex Sans', sans-serif" }}>$9.99/month · 7-day free trial</p>
        <a href="/" style={{ fontSize: 13, color: "#4FFFB0", textDecoration: "none", fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 500 }}>
          Try AIForj free →
        </a>
      </section>

      {/* Footer */}
      <footer style={{ padding: "32px 24px", textAlign: "center", background: "#080D0B", borderTop: "1px solid rgba(79,255,176,0.06)", marginTop: "auto" }}>
        <p style={{ fontSize: 12, color: "#B0C4B8", margin: "0 0 8px", fontFamily: "'IBM Plex Sans', sans-serif" }}>
          Built by a Board Certified Psychiatric Mental Health Nurse Practitioner
        </p>
        <p style={{ fontSize: 11, color: "#B0C4B8", opacity: 0.5, lineHeight: 1.7, margin: "0 0 8px", fontFamily: "'IBM Plex Sans', sans-serif" }}>
          AIForj is a wellness companion — not a therapist or substitute for professional care.
        </p>
        <p style={{ fontSize: 11, color: "#B0C4B8", opacity: 0.5, lineHeight: 1.7, margin: "0 0 12px", fontFamily: "'IBM Plex Sans', sans-serif" }}>
          In crisis? Call or text <strong style={{ color: "#4FFFB0", opacity: 0.8 }}>988</strong> · Text HOME to <strong style={{ color: "#4FFFB0", opacity: 0.8 }}>741741</strong>
        </p>
        <p style={{ fontSize: 11, color: "#B0C4B8", opacity: 0.3, margin: 0, fontFamily: "'IBM Plex Sans', sans-serif" }}>
          © 2026 AIForj. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
