"use client";

import { useState } from "react";
import useScrollReveal from "../hooks/useScrollReveal";
import { track } from "../../lib/analytics";
import { workbookLink } from "../../lib/links";

function RevealSection({ children, style, ...props }) {
  const ref = useScrollReveal();
  return (
    <section ref={ref} className="reveal" style={style} {...props}>
      {children}
    </section>
  );
}

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
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)", display: "flex", flexDirection: "column" }}>

      {/* Back link */}
      <div style={{ padding: "20px 24px" }}>
        <a href="/" style={{ fontSize: 12, color: "var(--text-muted)", textDecoration: "none", fontFamily: "'DM Sans', sans-serif", display: "inline-flex", alignItems: "center", gap: 6, transition: "color 300ms cubic-bezier(0.16,1,0.3,1)" }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--interactive)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}>
          ← Back to AIForj
        </a>
      </div>

      {/* Hero */}
      <section style={{ flex: "0 0 auto", padding: "60px 24px 80px", maxWidth: 640, margin: "0 auto", width: "100%", textAlign: "center" }}>
        <span style={{ fontSize: 14, color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", display: "block", marginBottom: 16, letterSpacing: 0.5 }}>{smallText}</span>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 18px", lineHeight: 1.2 }}>{headline}</h1>
        <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.7, margin: "0 0 32px", fontFamily: "'DM Sans', sans-serif", maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>{subtext}</p>
        <a href="/" style={{ display: "inline-block", padding: "16px 40px", fontSize: 16, fontFamily: "'Fraunces', serif", background: "linear-gradient(135deg, var(--interactive), var(--interactive-pressed))", color: "#fff", border: "none", borderRadius: 50, cursor: "pointer", letterSpacing: 0.5, fontWeight: 700, textDecoration: "none", transition: "all 300ms cubic-bezier(0.16,1,0.3,1)", boxShadow: "0 4px 24px rgba(125,155,130,0.25)" }}>
          Start talking →
        </a>
        <div style={{ marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ fontSize: 13 }}>🔒</span>
          <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif" }}>Privacy-first and local-first where supported</span>
        </div>
      </section>

      {/* This might feel like... */}
      <RevealSection style={{ padding: "0 24px 64px", maxWidth: 640, margin: "0 auto", width: "100%" }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600, color: "var(--text-primary)", marginBottom: 20, textAlign: "center" }}>This might feel like...</h2>
        <div className="stagger" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
          {feelsLike.map((item, i) => (
            <div key={i} style={{ padding: "14px 18px", background: "var(--accent-sage-light)", border: "1px solid rgba(125,155,130,0.15)", borderRadius: 14 }}>
              <span style={{ fontSize: 14, color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>{item}</span>
            </div>
          ))}
        </div>
      </RevealSection>

      {/* What helps */}
      <RevealSection style={{ padding: "0 24px 64px", maxWidth: 640, margin: "0 auto", width: "100%" }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600, color: "var(--text-primary)", marginBottom: 20, textAlign: "center" }}>What helps</h2>
        <div className="stagger" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {whatHelps.map((item, i) => (
            <div key={i} style={{ padding: "18px 22px", background: "var(--surface)", border: "1px solid rgba(125,155,130,0.12)", borderRadius: 16 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--interactive)", fontFamily: "'Fraunces', serif" }}>{item.title}</span>
              <span style={{ fontSize: 14, color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif" }}> — {item.desc}</span>
            </div>
          ))}
        </div>
      </RevealSection>

      {/* Share */}
      <RevealSection style={{ padding: "0 24px 64px", maxWidth: 640, margin: "0 auto", width: "100%", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600, color: "var(--text-primary)", marginBottom: 16 }}>Know someone who needs this?</h2>
        <button onClick={handleShare} style={{ padding: "12px 28px", fontSize: 14, fontFamily: "'DM Sans', sans-serif", background: "var(--accent-sage-light)", border: "1px solid rgba(125,155,130,0.2)", borderRadius: 30, color: "var(--text-secondary)", cursor: "pointer", transition: "all 300ms cubic-bezier(0.16,1,0.3,1)" }}>
          {copied ? "Copied!" : "↗ Share this page"}
        </button>
        <p style={{ fontSize: 12, color: "var(--text-muted)", opacity: 0.5, marginTop: 10, fontFamily: "'DM Sans', sans-serif" }}>{shareText}</p>
      </RevealSection>

      {/* Workbook */}
      <RevealSection style={{ padding: "0 24px 48px", maxWidth: 640, margin: "0 auto", width: "100%" }}>
        <div style={{ padding: "28px 24px", background: "var(--surface)", border: "1px solid rgba(125,155,130,0.12)", borderRadius: 20, textAlign: "center" }}>
          <p style={{ fontSize: 15, color: "var(--text-primary)", margin: "0 0 10px", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>{workbookLine}</p>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 16px", fontFamily: "'DM Sans', sans-serif" }}>30 days of guided exercises · 10 cognitive distortions · $27</p>
          <a href={workbookLink("landing_page")} target="_blank" rel="noopener noreferrer" onClick={() => track("cbt_workbook_click", { source: "landing_page" })} style={{ display: "inline-block", padding: "10px 28px", fontSize: 13, fontFamily: "'Fraunces', serif", background: "var(--accent-sage-light)", border: "1px solid rgba(125,155,130,0.2)", borderRadius: 30, color: "var(--interactive)", textDecoration: "none", fontWeight: 600, transition: "all 300ms cubic-bezier(0.16,1,0.3,1)" }}>
            Get the Workbook →
          </a>
        </div>
      </RevealSection>

      {/* Premium */}
      <RevealSection style={{ padding: "0 24px 64px", maxWidth: 640, margin: "0 auto", width: "100%", textAlign: "center" }}>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "0 0 10px", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>{premiumLine}</p>
        <p style={{ fontSize: 12, color: "var(--text-muted)", opacity: 0.6, margin: "0 0 16px", fontFamily: "'DM Sans', sans-serif" }}>$9.99/month · 7-day free trial</p>
        <a href="/" style={{ fontSize: 13, color: "var(--interactive)", textDecoration: "none", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
          Try AIForj free →
        </a>
      </RevealSection>

      {/* Footer */}
      <footer style={{ padding: "32px 24px", textAlign: "center", background: "var(--bg-secondary)", borderTop: "1px solid rgba(45,42,38,0.06)", marginTop: "auto" }}>
        <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "0 0 8px", fontFamily: "'DM Sans', sans-serif" }}>
          Clinician-informed by Kevin, a psychiatric nurse practitioner candidate
        </p>
        <p style={{ fontSize: 11, color: "var(--text-muted)", opacity: 0.5, lineHeight: 1.7, margin: "0 0 8px", fontFamily: "'DM Sans', sans-serif" }}>
          AIForj is a wellness companion — not a therapist or substitute for professional care.
        </p>
        <p style={{ fontSize: 11, color: "var(--text-muted)", opacity: 0.5, lineHeight: 1.7, margin: "0 0 12px", fontFamily: "'DM Sans', sans-serif" }}>
          In crisis? Call or text <strong style={{ color: "var(--crisis)" }}>988</strong> · Text HOME to <strong style={{ color: "var(--crisis)" }}>741741</strong>
        </p>
        <p style={{ fontSize: 11, color: "var(--text-muted)", opacity: 0.3, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
          © 2026 AIForj. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
