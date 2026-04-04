"use client";

import { useState, useEffect, useCallback } from "react";
import { useTheme } from "./ThemeProvider";
import SoundToggle from "./SoundToggle";

const NAV_LINKS = [
  { href: "/blueprint", label: "Blueprint" },
  { href: "/techniques", label: "Techniques" },
  { href: "/garden", label: "Garden" },
  { href: "/send", label: "Send Calm" },
  { href: "/tools", label: "Tools" },
];

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change (clicking a link)
  const handleLinkClick = useCallback(() => {
    setMenuOpen(false);
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Prevent body scroll when menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav
        className="site-nav"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 24px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? "var(--surface-elevated)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(45,42,38,0.06)" : "1px solid transparent",
          transition: "all 300ms cubic-bezier(0.16,1,0.3,1)",
          boxShadow: scrolled ? "var(--shadow-sm)" : "none",
          maxWidth: "100%",
        }}
      >
        {/* Logo */}
        <a
          href="/"
          onClick={handleLinkClick}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <img
            src="/aif.jpeg"
            alt="AIForj"
            style={{
              height: 32,
              width: "auto",
              borderRadius: 8,
              boxShadow: "var(--shadow-sm)",
            }}
          />
          <span
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 18,
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            Forj
          </span>
          <span
            style={{
              fontSize: 10,
              color: "var(--text-muted)",
              fontWeight: 400,
              marginLeft: -4,
            }}
          >
            by AIForj
          </span>
        </a>

        {/* Desktop links */}
        <div
          className="nav-desktop"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                padding: "6px 14px",
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text-secondary)",
                textDecoration: "none",
                borderRadius: 8,
                transition: "all 200ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--interactive)";
                e.currentTarget.style.background = "var(--accent-sage-light)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              {link.label}
            </a>
          ))}

          <div style={{ width: 1, height: 20, background: "rgba(45,42,38,0.1)", margin: "0 6px" }} />

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            style={{
              background: "none",
              border: "none",
              padding: "6px 10px",
              fontSize: 16,
              cursor: "pointer",
              borderRadius: 8,
              transition: "background 200ms",
              color: "var(--text-secondary)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-sage-light)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          <SoundToggle />

          <a
            href="/blueprint"
            style={{
              padding: "8px 18px",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "'Fraunces', serif",
              background: "var(--interactive)",
              color: "#fff",
              borderRadius: 24,
              textDecoration: "none",
              marginLeft: 4,
              transition: "all 200ms",
              boxShadow: "0 2px 8px rgba(125,155,130,0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--interactive-hover)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--interactive)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Take Blueprint
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          style={{
            display: "none",
            background: "none",
            border: "none",
            padding: 8,
            cursor: "pointer",
            flexDirection: "column",
            gap: 5,
            width: 44,
            height: 44,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              display: "block",
              width: 22,
              height: 2,
              background: "var(--text-primary)",
              borderRadius: 2,
              transition: "all 300ms cubic-bezier(0.16,1,0.3,1)",
              transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none",
            }}
          />
          <span
            style={{
              display: "block",
              width: 22,
              height: 2,
              background: "var(--text-primary)",
              borderRadius: 2,
              transition: "all 300ms cubic-bezier(0.16,1,0.3,1)",
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            style={{
              display: "block",
              width: 22,
              height: 2,
              background: "var(--text-primary)",
              borderRadius: 2,
              transition: "all 300ms cubic-bezier(0.16,1,0.3,1)",
              transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none",
            }}
          />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99,
            background: "rgba(45,42,38,0.4)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            animation: "fadeIn 200ms ease-out",
          }}
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile menu panel */}
      <div
        className="nav-mobile-panel"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(320px, 85vw)",
          zIndex: 101,
          background: "var(--surface-elevated)",
          boxShadow: "var(--shadow-xl)",
          padding: "80px 28px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 300ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={handleLinkClick}
            style={{
              padding: "14px 16px",
              fontSize: 16,
              fontWeight: 500,
              color: "var(--text-primary)",
              textDecoration: "none",
              borderRadius: 12,
              transition: "background 200ms",
            }}
          >
            {link.label}
          </a>
        ))}

        <div style={{ height: 1, background: "rgba(45,42,38,0.08)", margin: "8px 0" }} />

        <a
          href="/blueprint"
          onClick={handleLinkClick}
          style={{
            padding: "14px 20px",
            fontSize: 15,
            fontWeight: 600,
            fontFamily: "'Fraunces', serif",
            background: "var(--interactive)",
            color: "#fff",
            borderRadius: 14,
            textDecoration: "none",
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          Take Your Blueprint
        </a>

        <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 0" }}>
          <button
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            style={{
              background: "var(--surface)",
              border: "1px solid rgba(45,42,38,0.08)",
              padding: "8px 16px",
              fontSize: 14,
              cursor: "pointer",
              borderRadius: 10,
              color: "var(--text-secondary)",
            }}
          >
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>
          <SoundToggle />
        </div>

        {/* Footer links */}
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
          <a href="/find-help" onClick={handleLinkClick} style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>
            Find a Provider
          </a>
          <a href="/3am-spiral" onClick={handleLinkClick} style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>
            3AM Spiral Tool
          </a>
          <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "8px 0 0", opacity: 0.6 }}>
            Crisis: Call or text 988
          </p>
        </div>
      </div>

      {/* Spacer so content doesn't go under fixed nav */}
      <div style={{ height: 60 }} />
    </>
  );
}
