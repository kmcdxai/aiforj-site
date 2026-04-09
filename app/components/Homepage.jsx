"use client";

import { useState } from "react";
import EmailCapture from "./EmailCapture";

const HOW_IT_WORKS = [
  {
    step: "01",
    emoji: "⚡",
    title: "Start with the feeling",
    description: "Choose from 12 emotions. No login, no sign-up, no judgment. Just tap the one that matches right now.",
    color: "var(--sage)",
    bg: "var(--sage-light)",
  },
  {
    step: "02",
    emoji: "🌬️",
    title: "Do a 90-second reset",
    description: "Get matched to a clinician-designed technique — breathing, grounding, or defusion — tailored to your emotion and intensity.",
    color: "var(--ocean)",
    bg: "var(--ocean-light)",
  },
  {
    step: "03",
    emoji: "📊",
    title: "See your shift",
    description: "Rate how you feel before and after. See your mood shift in real time and share a receipt with someone you trust.",
    color: "var(--lavender)",
    bg: "var(--lavender-light)",
  },
];

const TOOLS = [
  {
    title: "Guided Techniques",
    description: "Evidence-based exercises from CBT, DBT, ACT, and somatic therapy — each one under 5 minutes.",
    href: "/techniques",
    emoji: "🧘",
    tag: "15+ techniques",
  },
  {
    title: "Emotional Blueprint",
    description: "A 5-minute assessment that maps your emotional patterns and suggests your most effective tools.",
    href: "/blueprint",
    emoji: "🧬",
    tag: "Personalized",
  },
  {
    title: "Talk to Forj",
    description: "Voice-based AI companion with 15+ therapeutic modalities. Say what you feel, get a clinician-informed response.",
    href: "/companion",
    emoji: "🎙️",
    tag: "Voice AI",
  },
  {
    title: "Mood Garden",
    description: "Track your emotional patterns over time. Watch your garden grow as you build resilience.",
    href: "/garden",
    emoji: "🌱",
    tag: "Track progress",
  },
  {
    title: "Send Calm",
    description: "Send a friend a grounding technique when they need it most. No app required to receive.",
    href: "/send",
    emoji: "💌",
    tag: "Share",
  },
  {
    title: "3AM Spiral Tool",
    description: "Can't sleep? Thoughts racing at 3AM? This tool meets you exactly there.",
    href: "/3am-spiral",
    emoji: "🌙",
    tag: "Crisis-ready",
  },
];

const TRUST_SIGNALS = [
  {
    icon: "🩺",
    title: "Clinician-built",
    description: "Designed by a Board Certified Psychiatric Mental Health Nurse Practitioner (PMHNP-BC) with real clinical experience.",
  },
  {
    icon: "🔒",
    title: "100% private",
    description: "Nothing leaves your device. No accounts, no data collection, no third-party tracking. Your sessions stay yours.",
  },
  {
    icon: "📚",
    title: "Evidence-based",
    description: "Every technique draws from peer-reviewed research across CBT, DBT, ACT, somatic therapy, and more.",
  },
  {
    icon: "🆓",
    title: "Free to use",
    description: "Core tools are free forever. No paywall to calm down. No subscription to breathe.",
  },
];

export default function Homepage() {
  const [hoveredTool, setHoveredTool] = useState(null);

  return (
    <div style={{ color: "var(--text-primary)", fontFamily: "'DM Sans', sans-serif" }}>

      {/* ═══ HERO ═══ */}
      <section style={{
        minHeight: "min(85vh, 720px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "40px 24px 60px",
        position: "relative",
      }}>
        {/* Soft decorative element */}
        <div style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(600px, 80vw)",
          height: "min(600px, 80vw)",
          borderRadius: "50%",
          background: "radial-gradient(circle, var(--sage-light) 0%, transparent 70%)",
          opacity: 0.4,
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 720 }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 16px",
            borderRadius: 20,
            background: "var(--sage-light)",
            color: "var(--sage-deep)",
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 24,
            animation: "fadeInUp 600ms ease-out",
          }}>
            <span>🩺</span>
            Built by a Board Certified PMHNP
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "clamp(2.2rem, 5.5vw, 3.8rem)",
            fontWeight: 400,
            lineHeight: 1.1,
            margin: "0 0 20px",
            color: "var(--text-primary)",
            animation: "fadeInUp 600ms ease-out 100ms both",
          }}>
            Feel better in<br />
            <span style={{ fontStyle: "italic", color: "var(--sage-deep)" }}>90 seconds</span>
          </h1>

          {/* Subtext */}
          <p style={{
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            color: "var(--text-secondary)",
            lineHeight: 1.7,
            maxWidth: 540,
            margin: "0 auto 36px",
            animation: "fadeInUp 600ms ease-out 200ms both",
          }}>
            Free, evidence-based therapeutic tools — designed by a clinician, powered by research, and 100% private. No login. No data leaves your device.
          </p>

          {/* CTAs */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 14,
            justifyContent: "center",
            animation: "fadeInUp 600ms ease-out 300ms both",
          }}>
            <a
              href="/start"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "16px 32px",
                borderRadius: 28,
                background: "var(--interactive)",
                color: "#fff",
                textDecoration: "none",
                fontSize: 16,
                fontWeight: 600,
                fontFamily: "'Fraunces', serif",
                boxShadow: "0 4px 20px rgba(122,158,126,0.3)",
                transition: "all 200ms",
              }}
            >
              Start with how you feel
              <span style={{ fontSize: 18 }}>→</span>
            </a>
            <a
              href="/blueprint"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "16px 32px",
                borderRadius: 28,
                background: "transparent",
                color: "var(--text-primary)",
                textDecoration: "none",
                fontSize: 16,
                fontWeight: 500,
                border: "1.5px solid var(--border)",
                transition: "all 200ms",
              }}
            >
              Take your Emotional Blueprint
            </a>
          </div>

          {/* Micro-trust */}
          <p style={{
            fontSize: 13,
            color: "var(--text-muted)",
            marginTop: 20,
            animation: "fadeInUp 600ms ease-out 400ms both",
          }}>
            No sign-up required &middot; Works on any device &middot; Takes 90 seconds
          </p>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section style={{
        padding: "80px 24px",
        maxWidth: 1080,
        margin: "0 auto",
      }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--sage-deep)", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 10px" }}>
            How it works
          </p>
          <h2 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
            fontWeight: 400,
            margin: 0,
            color: "var(--text-primary)",
          }}>
            Three steps to a calmer you
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
        }}>
          {HOW_IT_WORKS.map((item) => (
            <div
              key={item.step}
              style={{
                padding: 32,
                borderRadius: 24,
                background: "var(--surface-elevated)",
                border: "1px solid var(--border)",
                position: "relative",
                overflow: "hidden",
                transition: "transform 200ms, box-shadow 200ms",
              }}
            >
              <div style={{
                position: "absolute",
                top: -20,
                right: -10,
                fontSize: 80,
                fontWeight: 700,
                fontFamily: "'Fraunces', serif",
                color: item.bg,
                opacity: 0.6,
                lineHeight: 1,
              }}>
                {item.step}
              </div>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 18,
                background: item.bg,
                display: "grid",
                placeItems: "center",
                fontSize: 24,
                marginBottom: 20,
                position: "relative",
              }}>
                {item.emoji}
              </div>
              <h3 style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 20,
                fontWeight: 500,
                margin: "0 0 10px",
                color: "var(--text-primary)",
                position: "relative",
              }}>
                {item.title}
              </h3>
              <p style={{
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                margin: 0,
                fontSize: 15,
                position: "relative",
              }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ TOOL SHOWCASE ═══ */}
      <section style={{
        padding: "80px 24px",
        maxWidth: 1080,
        margin: "0 auto",
      }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--sage-deep)", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 10px" }}>
            Your toolkit
          </p>
          <h2 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
            fontWeight: 400,
            margin: "0 0 12px",
            color: "var(--text-primary)",
          }}>
            Everything you need, nothing you don't
          </h2>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 520, margin: "0 auto", lineHeight: 1.6 }}>
            Free tools built by a clinician for real moments — anxiety at 3AM, stress before a meeting, or just needing to breathe.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 16,
        }}>
          {TOOLS.map((tool, i) => (
            <a
              key={tool.title}
              href={tool.href}
              onMouseEnter={() => setHoveredTool(i)}
              onMouseLeave={() => setHoveredTool(null)}
              style={{
                display: "flex",
                gap: 16,
                padding: 24,
                borderRadius: 20,
                background: hoveredTool === i ? "var(--surface-elevated)" : "var(--surface)",
                border: "1px solid var(--border)",
                textDecoration: "none",
                color: "inherit",
                transition: "all 200ms",
                transform: hoveredTool === i ? "translateY(-2px)" : "none",
                boxShadow: hoveredTool === i ? "var(--shadow-md)" : "none",
              }}
            >
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "var(--sage-light)",
                display: "grid",
                placeItems: "center",
                fontSize: 22,
                flexShrink: 0,
              }}>
                {tool.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: "var(--text-primary)" }}>{tool.title}</h3>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: 6,
                    background: "var(--sage-light)",
                    color: "var(--sage-deep)",
                    whiteSpace: "nowrap",
                  }}>
                    {tool.tag}
                  </span>
                </div>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>{tool.description}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ═══ TRUST SIGNALS ═══ */}
      <section style={{
        padding: "80px 24px",
        background: "var(--surface)",
      }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--sage-deep)", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 10px" }}>
              Why AIForj
            </p>
            <h2 style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
              fontWeight: 400,
              margin: 0,
              color: "var(--text-primary)",
            }}>
              Built different, on purpose
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 24,
          }}>
            {TRUST_SIGNALS.map((item) => (
              <div
                key={item.title}
                style={{
                  padding: 28,
                  borderRadius: 20,
                  background: "var(--surface-elevated)",
                  border: "1px solid var(--border)",
                  textAlign: "center",
                }}
              >
                <div style={{
                  fontSize: 32,
                  marginBottom: 14,
                }}>
                  {item.icon}
                </div>
                <h3 style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 18,
                  fontWeight: 500,
                  margin: "0 0 8px",
                  color: "var(--text-primary)",
                }}>
                  {item.title}
                </h3>
                <p style={{
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  margin: 0,
                  fontSize: 14,
                }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ EMAIL CAPTURE ═══ */}
      <section style={{
        padding: "60px 24px 80px",
        maxWidth: 1080,
        margin: "0 auto",
      }}>
        <EmailCapture />
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{
        padding: "48px 24px 32px",
        borderTop: "1px solid var(--border)",
        background: "var(--surface)",
      }}>
        <div style={{
          maxWidth: 1080,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 32,
          marginBottom: 40,
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <img src="/aif.jpeg" alt="AIForj" style={{ height: 28, borderRadius: 6 }} />
              <span style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 600, color: "var(--text-primary)" }}>Forj</span>
            </div>
            <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>
              Free therapeutic tools built by a clinician. 100% private.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", margin: "0 0 14px" }}>Tools</h4>
            <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <a href="/start" style={{ fontSize: 14, color: "var(--text-secondary)", textDecoration: "none" }}>Start Check-In</a>
              <a href="/techniques" style={{ fontSize: 14, color: "var(--text-secondary)", textDecoration: "none" }}>Guided Techniques</a>
              <a href="/blueprint" style={{ fontSize: 14, color: "var(--text-secondary)", textDecoration: "none" }}>Emotional Blueprint</a>
              <a href="/companion" style={{ fontSize: 14, color: "var(--text-secondary)", textDecoration: "none" }}>Talk to Forj</a>
            </nav>
          </div>

          {/* More */}
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", margin: "0 0 14px" }}>More</h4>
            <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <a href="/garden" style={{ fontSize: 14, color: "var(--text-secondary)", textDecoration: "none" }}>Mood Garden</a>
              <a href="/weather" style={{ fontSize: 14, color: "var(--text-secondary)", textDecoration: "none" }}>Emotional Weather</a>
              <a href="/send" style={{ fontSize: 14, color: "var(--text-secondary)", textDecoration: "none" }}>Send Calm</a>
              <a href="/3am-spiral" style={{ fontSize: 14, color: "var(--text-secondary)", textDecoration: "none" }}>3AM Spiral Tool</a>
            </nav>
          </div>

          {/* Help */}
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", margin: "0 0 14px" }}>Help</h4>
            <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <a href="/find-help" style={{ fontSize: 14, color: "var(--text-secondary)", textDecoration: "none" }}>Find a Provider</a>
              <a href="/archetypes" style={{ fontSize: 14, color: "var(--text-secondary)", textDecoration: "none" }}>Emotional Archetypes</a>
              <a href="/tools" style={{ fontSize: 14, color: "var(--text-secondary)", textDecoration: "none" }}>All Tools</a>
            </nav>
          </div>
        </div>

        {/* Crisis bar */}
        <div style={{
          padding: "16px 24px",
          borderRadius: 14,
          background: "var(--amber-light)",
          border: "1px solid var(--amber)30",
          textAlign: "center",
          marginBottom: 24,
        }}>
          <p style={{ margin: 0, fontSize: 14, color: "var(--text-primary)" }}>
            If you are in crisis, call or text <strong style={{ color: "var(--crisis)" }}>988</strong> &middot; <a href="tel:988" style={{ color: "var(--crisis)", fontWeight: 600 }}>Call now</a> &middot; <a href="sms:988" style={{ color: "var(--crisis)", fontWeight: 600 }}>Text now</a>
          </p>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          paddingTop: 16,
          borderTop: "1px solid var(--border)",
        }}>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
            &copy; {new Date().getFullYear()} AIForj. Not a substitute for professional care.
          </p>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
            Built with care in the United States
          </p>
        </div>
      </footer>
    </div>
  );
}
