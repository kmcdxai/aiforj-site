"use client";

import EmailCapture from "./EmailCapture";
import { emotionOptions } from "../start/emotionData";
import useScrollReveal from "../hooks/useScrollReveal";
import PremiumCheckoutButton from "../../components/monetization/PremiumCheckoutButton";
import { FORJ_MODALITIES, FORJ_MODALITY_COUNT } from "../../lib/forjModalities";
import { track } from "../../lib/analytics";
import { workbookLink } from "../../lib/links";

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

const INTERACTIONS = ["Thinking", "Writing", "Body", "Decision", "Social", "Psychoeducation", "Planning"];
const HERO_PATHWAYS = [
  {
    eyebrow: "Guided check-in",
    title: "Start with /start",
    description:
      "Pick what you are feeling, how intense it is, and how much time you have. AIForj matches a tool in under 30 seconds.",
    href: "/start",
    cta: "Get support now →",
    badge: "Free",
  },
  {
    eyebrow: "Voice or text companion",
    title: "Talk to Forj",
    description:
      "If you want to talk it through instead of choosing a tool first, start a private conversation and let Forj adapt in real time.",
    href: "/companion",
    cta: "Open Talk to Forj →",
    badge: "Voice + text",
  },
];

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

function RevealSection({ as: Component = "section", children, className = "", style, ...props }) {
  const ref = useScrollReveal();

  return (
    <Component ref={ref} className={`reveal ${className}`.trim()} style={style} {...props}>
      {children}
    </Component>
  );
}

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
    <a href={workbookLink("home")} target="_blank" rel="noopener noreferrer" onClick={() => track("cbt_workbook_click", { source: "home" })} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
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

function GardenShowcase() {
  return (
    <RevealSection style={{ padding: "84px 24px", background: "var(--surface)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionHeader eyebrow="Mood Garden" title="Progress you can actually see">
          Every completed tool, mood check-in, and streak quietly grows a private landscape on your device.
        </SectionHeader>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(320px, 0.95fr)", gap: 22, alignItems: "center" }} className="home-value-grid">
          <article className="card" style={{ display: "grid", gap: 16 }}>
            <h3 style={{ margin: 0 }}>A private progress layer, not another dashboard.</h3>
            <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.8 }}>
              Mood Garden turns your sessions into something tangible: the feelings you have worked with, the tools you return to, the shifts that actually help, and the rhythm you are building over time.
            </p>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                "Sessions plant new blooms tied to emotional states",
                "Mood check-ins deepen the picture without leaving your device",
                "Weekly insights and exports are there when you want reflection",
              ].map((line) => (
                <div key={line} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ color: "var(--sage-deep)", fontWeight: 700 }}>•</span>
                  <span style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>{line}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="/garden" className="btn-primary" style={{ textDecoration: "none" }}>Open Mood Garden →</a>
              <a href="/start" className="btn-secondary" style={{ textDecoration: "none", color: "var(--sage-deep)" }}>Plant your first session →</a>
            </div>
          </article>

          <article className="card" style={{ padding: 0, overflow: "hidden", background: "linear-gradient(180deg, rgba(232,240,232,0.9), rgba(250,246,240,0.96))" }}>
            <div style={{ padding: "24px 24px 12px", display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start" }}>
              <div>
                <p className="text-label" style={{ margin: "0 0 6px", color: "var(--sage-deep)" }}>Private landscape</p>
                <h3 style={{ margin: 0 }}>Mood Garden</h3>
              </div>
              <span className="tag tag-free">Local-only</span>
            </div>
            <div style={{ position: "relative", padding: "0 24px 24px" }}>
              <div style={{ borderRadius: 24, overflow: "hidden", border: "1px solid rgba(122,158,126,0.12)", background: "rgba(255,255,255,0.7)" }}>
                <div style={{ height: 220, position: "relative", background: "linear-gradient(180deg, rgba(224,237,245,0.9), rgba(250,246,240,0.98))" }}>
                  <div style={{ position: "absolute", top: 26, right: 38, width: 42, height: 42, borderRadius: "50%", background: "rgba(245,230,160,0.82)" }} />
                  <div style={{ position: "absolute", top: 44, left: 54, width: 68, height: 22, borderRadius: 999, background: "rgba(255,255,255,0.72)" }} />
                  <div style={{ position: "absolute", top: 30, left: 120, width: 52, height: 18, borderRadius: 999, background: "rgba(255,255,255,0.62)" }} />
                  <div style={{ position: "absolute", left: 22, right: 22, bottom: 18, height: 54, borderRadius: 24, background: "linear-gradient(180deg, #8B7355, #6B5335)" }} />
                  {[
                    { left: 70, stem: "#6B8C6B", bloom: "#9B8EC4", height: 72 },
                    { left: 122, stem: "#5B8C5A", bloom: "#7AAFC4", height: 54 },
                    { left: 182, stem: "#6B7F4A", bloom: "#C47A7A", height: 86 },
                    { left: 244, stem: "#5A7A5A", bloom: "#E8E4F0", height: 64 },
                    { left: 300, stem: "#6B8C5A", bloom: "#F5E6A0", height: 78 },
                  ].map((plant) => (
                    <div key={plant.left} style={{ position: "absolute", left: plant.left, bottom: 54, width: 30, height: plant.height }}>
                      <div style={{ position: "absolute", left: 14, bottom: 0, width: 3, height: plant.height - 20, borderRadius: 999, background: plant.stem }} />
                      <div style={{ position: "absolute", left: 4, top: 2, width: 22, height: 22, borderRadius: "50%", background: plant.bloom, boxShadow: `0 0 0 6px color-mix(in srgb, ${plant.bloom} 18%, transparent)` }} />
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 12 }}>
                {[
                  ["7", "day streak"],
                  ["+2.4", "avg shift"],
                  ["5", "blooms planted"],
                ].map(([value, label]) => (
                  <div key={label} style={{ padding: "12px 10px", borderRadius: 16, background: "rgba(255,255,255,0.86)", border: "1px solid rgba(45,42,38,0.06)", textAlign: "center" }}>
                    <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24, color: "var(--sage-deep)", lineHeight: 1 }}>{value}</div>
                    <div className="text-label" style={{ marginTop: 6, color: "var(--text-muted)" }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </RevealSection>
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
            flexWrap: "wrap",
            justifyContent: "center",
            padding: "7px 14px",
            borderRadius: 999,
            background: "var(--sage-light)",
            color: "var(--sage-deep)",
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 24,
            maxWidth: "min(100%, 560px)",
          }}>
            <img src="/aif.jpeg" alt="AIForj leaf mark" style={{ width: 24, height: 24, borderRadius: 6 }} />
            Built by{" "}
            <a href="/about/founder" style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: 3 }}>
              a clinician in psychiatric NP training
            </a>{" "}
            — clinically grounded in CBT, DBT, ACT, IFS, and 12 more evidence-based modalities.
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
            <a href="/companion" className="btn-secondary" style={{ textDecoration: "none", padding: "16px 26px", color: "var(--sage-deep)" }}>
              Talk to Forj →
            </a>
          </div>
          <div style={{ margin: "28px auto 0", maxWidth: 760 }}>
            <p className="text-label" style={{ margin: "0 0 12px", color: "var(--sage-deep)" }}>
              Two doors into the same house
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }} className="home-hero-pathways">
              {HERO_PATHWAYS.map((pathway) => (
                <a
                  key={pathway.href}
                  href={pathway.href}
                  className="card-hover"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    padding: "22px 20px",
                    borderRadius: 22,
                    background: "rgba(255,255,255,0.72)",
                    border: "1px solid rgba(45,42,38,0.08)",
                    boxShadow: "var(--shadow-sm)",
                    display: "grid",
                    gap: 10,
                    textAlign: "left",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                    <span className="text-label" style={{ color: "var(--sage-deep)" }}>{pathway.eyebrow}</span>
                    <span className="tag tag-free">{pathway.badge}</span>
                  </div>
                  <h3 style={{ margin: 0 }}>{pathway.title}</h3>
                  <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15 }}>
                    {pathway.description}
                  </p>
                  <span style={{ color: "var(--sage-deep)", fontWeight: 700 }}>{pathway.cta}</span>
                </a>
              ))}
            </div>
          </div>
          <p className="text-caption" style={{ margin: "18px auto 0", color: "var(--text-muted)" }}>
            No account needed. No data leaves your device. Takes 30 seconds.
          </p>
        </div>
      </section>

      <RevealSection id="how-it-works" style={{ padding: "84px 24px", maxWidth: 1100, margin: "0 auto" }}>
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
      </RevealSection>

      <RevealSection style={{ padding: "84px 24px", background: "var(--surface)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionHeader eyebrow="Why AIForj" title="Clinical-grade support without clinical coldness">
            Built for moments when you need something more specific than “just breathe.”
          </SectionHeader>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 0.9fr)", gap: 28, alignItems: "start" }} className="home-value-grid">
            <article style={{ display: "grid", gap: 18 }}>
              {[
                [`${FORJ_MODALITY_COUNT} therapeutic modalities, not just meditation`, FORJ_MODALITIES],
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
              <h3 style={{ margin: "0 0 12px" }}>Built by Kevin</h3>
              <p style={{ margin: "0 0 16px", color: "var(--text-secondary)", lineHeight: 1.75 }}>
                AIForj is built and clinically informed by Kevin, a licensed [CURRENT_LICENSE] and psychiatric nurse practitioner candidate completing training in March 2027.
              </p>
              <p style={{ margin: "0 0 16px", color: "var(--text-secondary)", lineHeight: 1.75 }}>
                It exists because emotionally grounded support should not require a waitlist or a copay.
              </p>
              <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.75 }}>
                <a href="/about/founder" style={{ color: "var(--interactive)", fontWeight: 700 }}>
                  About the founder →
                </a>
              </p>
            </article>
          </div>
        </div>
      </RevealSection>

      <RevealSection style={{ padding: "84px 24px" }}>
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
      </RevealSection>

      <RevealSection style={{ padding: "76px 24px", background: "var(--surface)" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <EmailCapture />
        </div>
      </RevealSection>

      <RevealSection style={{ padding: "84px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionHeader eyebrow="Coverage" title="A broad toolkit for real moments">
            100+ interventions across 12 emotional states, {FORJ_MODALITY_COUNT} therapeutic modalities, and 7 interaction types.
          </SectionHeader>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
            {[
              ["100+", "interventions"],
              ["12", "emotional states"],
              [String(FORJ_MODALITY_COUNT), "therapeutic modalities"],
              ["7", "interaction types"],
            ].map(([value, label]) => (
              <div key={label} style={{ textAlign: "center", padding: "30px 18px", background: "var(--surface-elevated)", border: "1px solid var(--border)", borderRadius: 18 }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(32px, 4vw, 46px)", color: "var(--sage-deep)", lineHeight: 1 }}>{value}</div>
                <div className="text-label" style={{ color: "var(--text-muted)", marginTop: 8 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      <GardenShowcase />

      <RevealSection id="premium" style={{ padding: "84px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionHeader eyebrow="Go deeper" title="Free first aid stays free. Premium adds depth." />
          <div style={{ display: "grid", gap: 24 }}>
            <article
              className="card"
              style={{
                maxWidth: 760,
                margin: "0 auto",
                width: "100%",
                background: "linear-gradient(135deg, var(--sage-light), var(--surface-elevated) 72%)",
                border: "1px solid rgba(125,155,130,0.28)",
                boxShadow: "var(--shadow-lg)",
                textAlign: "center",
              }}
            >
              <p className="text-label" style={{ color: "var(--sage-deep)", margin: "0 0 10px" }}>Best for deeper support</p>
              <h3 style={{ margin: "0 0 10px", fontSize: "clamp(28px, 4vw, 40px)" }}>AIForj Premium</h3>
              <p style={{ color: "var(--text-secondary)", margin: "0 auto 18px", lineHeight: 1.75, maxWidth: 620 }}>
                Unlimited deeper Talk to Forj sessions, premium progress tools, and more personalized therapeutic guidance while keeping emotional data private on your device.
              </p>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 34, color: "var(--sage-deep)", marginBottom: 18 }}>
                $9.99/mo
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
                <PremiumCheckoutButton medium="home">Start 7-day free trial →</PremiumCheckoutButton>
                <a href="/companion" className="btn-secondary" style={{ textDecoration: "none", color: "var(--sage-deep)" }}>See Talk to Forj →</a>
              </div>
              <p className="text-caption" style={{ margin: "14px 0 0", color: "var(--text-muted)" }}>Cancel anytime · Free first aid stays free</p>
            </article>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, maxWidth: 900, margin: "0 auto", width: "100%" }}>
              <div id="workbook">
                <WorkbookCard compact />
              </div>
              <article className="card" style={{ background: "linear-gradient(135deg, rgba(196,149,106,0.12), var(--surface-elevated))" }}>
                <h3 style={{ margin: "0 0 10px" }}>Sponsor a friend</h3>
                <p style={{ color: "var(--text-secondary)", margin: "0 0 18px", lineHeight: 1.75 }}>
                  Gift one month of Premium to someone you care about without putting first aid behind a paywall or requiring an account.
                </p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                  <a href="/sponsor" onClick={() => track("sponsor_click", { source: "home" })} className="btn-primary" style={{ textDecoration: "none", background: "var(--amber-deep)" }}>Gift a month →</a>
                  <a href="/what-we-collect" className="btn-secondary" style={{ textDecoration: "none", color: "var(--amber-deep)", borderColor: "var(--amber)" }}>Privacy details →</a>
                </div>
                <p className="text-caption" style={{ margin: "14px 0 0", color: "var(--text-muted)" }}>$9.99 one-time · one redeem link</p>
              </article>
            </div>

            <div style={{ textAlign: "center" }}>
              <a href="/for" style={{ color: "var(--interactive)", fontWeight: 700 }}>
                More ways to use AIForj →
              </a>
            </div>
          </div>
        </div>
      </RevealSection>

      <RevealSection style={{ padding: "84px 24px", background: "var(--surface)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionHeader eyebrow="Technique library" title="Explore techniques and guides">
            If you already know what you need, you can jump straight into a specific tool or support page.
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
      </RevealSection>

      <footer style={{ padding: "54px 24px 34px", background: "var(--parchment-deep)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 34 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 28 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <img src="/aif.jpeg" alt="AIForj" style={{ width: 34, height: 34, borderRadius: 8 }} />
                <strong style={{ fontFamily: "'Fraunces', serif", fontSize: 20 }}>AIForj</strong>
              </div>
              <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7 }}>
                Built and clinically informed by{" "}
                <a href="/about/founder" style={{ color: "var(--interactive)", fontWeight: 700 }}>
                  a clinician in psychiatric NP training
                </a>.
                {" "}Your emotional data never leaves your device.
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
              <strong className="text-label">Go deeper</strong>
              <a href={workbookLink("footer")} target="_blank" rel="noopener noreferrer" onClick={() => track("cbt_workbook_click", { source: "footer" })}>CBT Workbook</a>
              <a href="/companion">Premium</a>
              <a href="/family">Family plan</a>
              <a href="/clinician-pack">Clinician pack</a>
              <a href="/organizations">Organizations</a>
              <a href="#premium">Pricing</a>
            </nav>
            <nav style={{ display: "grid", gap: 8 }}>
              <strong className="text-label">Care</strong>
              <a href="/find-help">Find a Provider</a>
              <a href="https://988lifeline.org" target="_blank" rel="noopener noreferrer">988 Lifeline</a>
              <a href="/send">Send Calm</a>
              <a href="/why-aiforj">Why AIForj</a>
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
