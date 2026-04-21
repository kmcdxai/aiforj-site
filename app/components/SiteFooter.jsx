"use client";

import Link from "next/link";
import { track } from "../../lib/analytics";

export default function SiteFooter() {
  const handleNavClick = (link) => {
    if (link.href.includes("gumroad.com")) {
      track("cbt_workbook_click", { source: "footer" });
    }
    if (link.href === "/sponsor") {
      track("sponsor_click", { source: "footer" });
    }
  };

  return (
    <footer style={{
      padding: "48px 24px 32px",
      textAlign: "center",
      background: "var(--bg-secondary)",
      borderTop: "1px solid rgba(45,42,38,0.06)",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Crisis resources */}
      <div style={{
        marginBottom: 28,
        padding: "18px 24px",
        background: "var(--surface-elevated)",
        borderRadius: 16,
        display: "inline-block",
        boxShadow: "var(--shadow-sm)",
      }}>
        <p style={{ fontSize: 14, color: "var(--text-primary)", margin: "0 0 4px", fontWeight: 500 }}>
          In crisis? You're not alone.
        </p>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>
          Call or text <strong style={{ color: "var(--crisis)" }}>988</strong> · Text HOME to <strong style={{ color: "var(--crisis)" }}>741741</strong>
        </p>
      </div>

      <p style={{
        fontSize: 13,
        color: "var(--text-secondary)",
        lineHeight: 1.7,
        margin: "0 0 24px",
        maxWidth: 480,
        marginLeft: "auto",
        marginRight: "auto",
      }}>
        Forj is a wellness companion — not a therapist or substitute for professional care.{" "}
        <Link href="/how-aiforj-stays-safe" style={{ color: "var(--interactive)", textDecoration: "underline" }}>
          How AIForj stays safe
        </Link>
        {" "}·{" "}
        <Link href="/editorial-policy" style={{ color: "var(--interactive)", textDecoration: "underline" }}>
          Editorial policy
        </Link>
        {" "}·{" "}
        <Link href="/what-we-collect" style={{ color: "var(--interactive)", textDecoration: "underline" }}>
          What we collect
        </Link>
      </p>

      {/* Footer nav */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 20, marginBottom: 24 }}>
        {[
          { href: "/", label: "Home" },
          { href: "/start", label: "Start" },
          { href: "/help", label: "Help Guides" },
          { href: "/companion", label: "Talk to Forj" },
          { href: "/blueprint", label: "Blueprint" },
          { href: "/techniques", label: "Techniques" },
          { href: "/tools", label: "Guided Tools" },
          { href: "/send", label: "Send Calm" },
          { href: "/sponsor", label: "Sponsor a Friend" },
          { href: "/family", label: "Family Plan" },
          { href: "/clinician-pack", label: "Clinician Pack" },
          { href: "/organizations", label: "Organizations" },
          { href: "/why-aiforj", label: "Why AIForj" },
          { href: "/how-aiforj-stays-safe", label: "Safety" },
          { href: "/editorial-policy", label: "Editorial Policy" },
          { href: "/what-we-collect", label: "What We Collect" },
          { href: "/find-help", label: "Find a Provider" },
          { href: "https://aiforj.gumroad.com/l/jmdqvd", label: "CBT Workbook", external: true },
        ].map(link => (
          <Link key={link.label} href={link.href}
            {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            onClick={() => handleNavClick(link)}
            style={{ fontSize: 12, color: "var(--text-muted)", textDecoration: "none" }}>
            {link.label}
          </Link>
        ))}
      </div>

      {/* Landing pages */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 24 }}>
        {[
          { href: "/help", icon: "🧭", label: "Help Hub" },
          { href: "/3am-spiral", icon: "🌙", label: "3AM Spiral" },
          { href: "/overwhelmed", icon: "🌊", label: "Overwhelmed" },
          { href: "/burned-out", icon: "🪨", label: "Burned Out" },
        ].map(link => (
          <Link key={link.label} href={link.href}
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              textDecoration: "none",
              padding: "5px 14px",
              background: "var(--surface)",
              borderRadius: 20,
            }}>
            {link.icon} {link.label}
          </Link>
        ))}
      </div>

      <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "0 0 8px", lineHeight: 1.8 }}>
        Built and clinically informed by{" "}
        <Link href="/about/founder" style={{ color: "var(--interactive)", textDecoration: "underline" }}>
          a clinician in psychiatric NP training
        </Link>.
        {" "}Your emotional data never leaves your device.
      </p>
      <p style={{ fontSize: 11, color: "var(--text-muted)", opacity: 0.5, margin: 0 }}>
        © 2026 AIForj. All rights reserved.
      </p>
    </footer>
  );
}
