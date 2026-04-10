"use client";

import EmailCapture from "./EmailCapture";
import { emotionOptions } from "../start/emotionData";
import PremiumCheckoutButton from "../../components/monetization/PremiumCheckoutButton";

const GUMROAD_WORKBOOK_URL = "https://aiforj.gumroad.com/l/jmdqvd";

const HOW_IT_WORKS = [
  {
    title: "Tell us how you feel",
    description: "Choose from 12 emotional states. No judgment.",
    emoji: "⚡",
  },
  {
    title: "Get matched to the right tool",
    description: "Not just breathing. Thinking exercises, writing tools, body practices, decision frameworks, and more.",
    emoji: "🧭",
  },
  {
    title: "See your shift",
    description: "Measure your mood before and after. See proof that it works.",
    emoji: "📊",
  },
];

const MODALITIES = ["CBT", "DBT", "ACT", "Somatic", "Polyvagal", "Behavioral", "Psychoed", "Mindfulness", "Self-Compassion", "Problem-Solving", "Exposure", "Values", "Grounding", "Breathwork", "Journaling"];
const INTERACTIONS = ["Thinking", "Writing", "Body", "Decision", "Social", "Psychoeducation", "Planning"];

const TECHNIQUE_LINKS = [
  { href: "/techniques/physiological-sigh", label: "Physiological Sigh" },
  { href: "/techniques/54321-grounding", label: "5-4-3-2-1 Grounding" },
  { href: "/techniques/thought-defusion", label: "Thought Defusion" },
  { href: "/techniques/cognitive-restructuring", label: "CBT Thought Record" },
  { href: "/techniques/worry-time", label: "Scheduled Worry Time" },
  { href: "/techniques/behavioral-activation", label: "Behavioral Activation" },
];

const HELP_LINKS = [
  { href: "/help/panic-attack", label: "Panic attack help" },
  { href: "/help/cant-sleep", label: "Can't sleep" },
  { href: "/help/anxiety-at-work", label: "Anxiety at work" },
  { href: "/help/overthinking", label: "Overthinking" },
  { href: "/help/burnout-recovery", label: "Burnout recovery" },
  { href: "/help/self-worth", label: "Self-worth" },
];

function SectionHeader({ eyebrow, title, children }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 44 }}>
      <p className="text-label" style={{ color: "var(--sage-deep)", margin: "0 0 10px" }}>{eyebrow}</p>
      <h2 style={{ margin: "0 0 12px" }}>{title}</h2>
      {children && (
        <p style={{ color: "var(--text-secondary)", margin: "0 auto", maxWidth: 640 }}>{children}</p>
      )}
    </div>
  );
}

function WorkbookCard({ compact = false }) {
  return (
    <a href={GUMROAD_WORKBOOK_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
      <article className="card-hover" style={{
        padding: compact ? "22px" : "30px",
        borderRadius: 20,
        border: "1px solid rgba(212,168,67,0.24)",
        background: "linear-gradient(135deg, var(--amber-light), var(--surface-elevated))",
        boxShadow: "var(--shadow-md)",
        display: "grid",
        gap: 14,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 34 }}>📘</span>
          <div>
            <h3 style={{ margin: "0 0 4px" }}>CBT Thought Reframe Workbook</h3>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 14 }}>84 pages · 30 days of exercises · 10 cognitive distortions · $27</p>
          </div>
        </div>
        <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.65 }}>
          A practical companion for people who want a structured CBT workbook outside the app.
        </p>
        <span style={{ color: "var(--amber-deep)", fontWeight: 700 }}>Get the workbook →</span>
      </article>
    </a>
  );
}

export default function Homepage() {
  return (
    <main style={{ color: "var(--text-primary)", fontFamily: "'DM Sans', sans-serif" }}>
      <section id="top" style={{
        minHeight: "calc(100vh - 60px)",
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        padding: "56px 24px 72px",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(180deg, var(--parchment-deep), var(--parchment))",
      }}>
        <div className="breathe" style={{
          position: "absolute",
          inset: "10% auto auto 50%",
          transform: "translateX(-50%)",
          width: "min(680px, 86vw)",
          height: "min(520px, 70vw)",
          borderRadius: "42% 58% 55% 45% / 45% 45% 55% 55%",
          background: "radial-gradient(circle at 40% 40%, rgba(122,158,126,0.18), transparent 68%)",
          pointerEvents: "none",
        }} />
        <div className="fade-in-up" style={{ position: "relative", zIndex: 1, maxWidth: 820 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 14px",
            borderRadius: 999,
            background: "var(--sage-light)",
            color: "var(--sage-deep)",
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 24,
          }}>
            <img src="/aif.jpeg" alt="AIForj leaf mark" style={{ width: 24, height: 24, borderRadius: 6 }} />
            Built by Kevin Cooke, PMHNP-BC
          </div>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", maxWidth: 760, margin: "0 auto 20px", letterSpacing: 0 }}>
            Emotional first aid that actually works.
          </h1>
          <p style={{ fontSize: "clamp(17px, 2vw, 20px)", color: "var(--text-secondary)", maxWidth: 680, margin: "0 auto 34px", lineHeight: 1.75 }}>
            Not another breathing app. 100+ clinically-matched tools for anxiety, sadness, anger, overwhelm, and everything in between — matched to how you actually feel right now.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
            <a href="/start" className="btn-primary" style={{ textDecoration: "none", padding: "16px 30px", fontSize: 16 }}>
              Get support now — it's free →
            </a>
            <a href="#workbook" className="btn-secondary" style={{ textDecoration: "none", padding: "16px 26px", color: "var(--sage-deep)" }}>
              See the CBT workbook
            </a>
          </div>
          <p className="text-caption" style={{ margin: "18px auto 0", color: "var(--text-muted)" }}>
            No account needed. Your emotional data stays on this device. Takes 30 seconds.
          </p>
        </div>
      </section>

      <section id="how-it-works" style={{ padding: "84px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <SectionHeader eyebrow="How it works" title="Three steps to a calmer next minute" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
          {HOW_IT_WORKS.map((item, index) => (
            <article key={item.title} className="card" style={{ minHeight: 220 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--text-muted)", fontSize: 12, marginBottom: 18 }}>0{index + 1}</div>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--sage-light)", display: "grid", placeItems: "center", fontSize: 26, marginBottom: 18 }}>{item.emoji}</div>
              <h3 style={{ margin: "0 0 10px" }}>{item.title}</h3>
              <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 15 }}>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ padding: "84px 24px", background: "var(--surface)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionHeader eyebrow="Why AIForj" title="Clinical-grade support without clinical coldness">
            Built for moments when you need something more specific than “just breathe.”
          </SectionHeader>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 0.9fr)", gap: 28, alignItems: "start" }} className="home-value-grid">
            <article style={{ display: "grid", gap: 18 }}>
              {[
                ["15 therapeutic modalities, not just meditation", MODALITIES],
                ["7 types of interactions", INTERACTIONS],
              ].map(([title, list]) => (
                <div key={title} className="card" style={{ boxShadow: "var(--shadow-sm)" }}>
                  <h3 style={{ margin: "0 0 14px" }}>{title}</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {list.map((item) => <span key={item} className="tag tag-cbt">{item}</span>)}
                  </div>
                </div>
              ))}
            </article>
            <article className="card" style={{ boxShadow: "var(--shadow-sm)" }}>
              <h3 style={{ margin: "0 0 12px" }}>Built by Kevin Cooke, PMHNP-BC</h3>
              <p style={{ margin: "0 0 16px", color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Kevin is a Board Certified Psychiatric Mental Health Nurse Practitioner who built AIForj because clinical-grade emotional support shouldn't require a waitlist or a copay.
              </p>
              <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Your emotional check-ins are saved locally for your own history. They do not become a server-side profile.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section style={{ padding: "84px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionHeader eyebrow="Emotional states" title="Whatever you're feeling, there's a tool for it." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14 }}>
            {emotionOptions.map((emotion) => (
              <a key={emotion.id} href={`/start?emotion=${emotion.id}`} style={{
                padding: "20px 12px",
                minHeight: 126,
                display: "grid",
                placeItems: "center",
                textAlign: "center",
                gap: 10,
                borderRadius: 18,
                background: emotion.accentLight,
                border: "1px solid var(--border)",
                textDecoration: "none",
                color: "var(--text-primary)",
              }}>
                <span style={{ fontSize: 30 }}>{emotion.emoji}</span>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{emotion.label}</span>
              </a>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 34 }}>
            <a href="/start" className="btn-primary" style={{ textDecoration: "none" }}>Get started →</a>
          </div>
        </div>
      </section>

      <section style={{ padding: "84px 24px", background: "var(--surface)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionHeader eyebrow="Real numbers" title="The Phase 1 toolkit foundation">
            These are product architecture counts, not user claims.
          </SectionHeader>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
            {[
              ["100+", "interventions"],
              ["12", "emotional states"],
              ["15", "therapeutic modalities"],
              ["7", "interaction types"],
            ].map(([value, label]) => (
              <div key={label} style={{ textAlign: "center", padding: "30px 18px", background: "var(--surface-elevated)", border: "1px solid var(--border)", borderRadius: 18 }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(32px, 4vw, 46px)", color: "var(--sage-deep)", lineHeight: 1 }}>{value}</div>
                <div className="text-label" style={{ color: "var(--text-muted)", marginTop: 8 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="premium" style={{ padding: "84px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionHeader eyebrow="Go deeper" title="Free first aid stays free. Premium adds depth." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            <article className="card" style={{ background: "linear-gradient(135deg, var(--sage-light), var(--surface-elevated))" }}>
              <h3 style={{ margin: "0 0 10px" }}>Talk to Forj Premium</h3>
              <p style={{ color: "var(--text-secondary)", margin: "0 0 18px", lineHeight: 1.75 }}>
                Unlimited deeper sessions, progress tools, and personalized therapeutic guidance through the existing AIForj Premium subscription.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <PremiumCheckoutButton>Start 7-day free trial →</PremiumCheckoutButton>
                <a href="/companion" className="btn-secondary" style={{ textDecoration: "none", color: "var(--sage-deep)" }}>See Talk to Forj →</a>
              </div>
              <p className="text-caption" style={{ margin: "14px 0 0", color: "var(--text-muted)" }}>$9.99/month · Cancel anytime</p>
            </article>
            <div id="workbook">
              <WorkbookCard />
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "84px 24px", background: "var(--surface)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionHeader eyebrow="Technique library" title="Crawlable tools for real search intent">
            The SEO technique pages remain accessible for people who arrive with a specific need.
          </SectionHeader>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {[...TECHNIQUE_LINKS, ...HELP_LINKS].map((link) => (
              <a key={link.href} href={link.href} style={{ padding: "16px 18px", borderRadius: 14, background: "var(--surface-elevated)", border: "1px solid var(--border)", color: "var(--text-primary)", textDecoration: "none", fontWeight: 700 }}>
                {link.label} →
              </a>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <a href="/techniques" className="btn-secondary" style={{ textDecoration: "none", color: "var(--sage-deep)" }}>Browse all techniques →</a>
          </div>
        </div>
      </section>

      <section style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <EmailCapture />
        </div>
      </section>

      <footer style={{ padding: "54px 24px 34px", background: "var(--parchment-deep)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 34 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 28 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <img src="/aif.jpeg" alt="AIForj" style={{ width: 34, height: 34, borderRadius: 8 }} />
                <strong style={{ fontFamily: "'Fraunces', serif", fontSize: 20 }}>AIForj</strong>
              </div>
              <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7 }}>
                Built by Kevin Cooke, PMHNP-BC. Your emotional data never leaves your device.
              </p>
            </div>
            <nav style={{ display: "grid", gap: 8 }}>
              <strong className="text-label">Product</strong>
              <a href="/start">Start</a>
              <a href="/companion">Talk to Forj</a>
              <a href="/techniques">Techniques</a>
              <a href="/garden">Mood Garden</a>
            </nav>
            <nav style={{ display: "grid", gap: 8 }}>
              <strong className="text-label">Monetization</strong>
              <a href={GUMROAD_WORKBOOK_URL} target="_blank" rel="noopener noreferrer">CBT Workbook</a>
              <a href="/companion">Premium</a>
              <a href="#premium">Pricing</a>
            </nav>
            <nav style={{ display: "grid", gap: 8 }}>
              <strong className="text-label">Care</strong>
              <a href="/find-help">Find a Provider</a>
              <a href="https://988lifeline.org" target="_blank" rel="noopener noreferrer">988 Lifeline</a>
              <a href="/send">Send Calm</a>
            </nav>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", paddingTop: 20, borderTop: "1px solid var(--border)", color: "var(--text-muted)", fontSize: 13 }}>
            <span>AIForj is a wellness companion, not a substitute for professional care.</span>
            <span>© {new Date().getFullYear()} AIForj</span>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 820px) {
          .home-value-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
