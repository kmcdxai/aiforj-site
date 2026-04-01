"use client";

import { useState, useCallback } from "react";
import { TECHNIQUES } from "../techniques/data";
import SiteFooter from "../components/SiteFooter";

// Compact technique info for the grid
const TECHNIQUE_CARDS = TECHNIQUES.map((t) => ({
  slug: t.slug,
  name: t.title.split(":")[0].replace(" Technique", "").replace("The ", "").trim(),
  duration: t.time,
  description: t.subtitle,
}));

export default function SendClient() {
  const [selected, setSelected] = useState(null);
  const [fromName, setFromName] = useState("");
  const [message, setMessage] = useState("");
  const [generatedLink, setGeneratedLink] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(() => {
    if (!selected) return;
    const params = new URLSearchParams();
    if (fromName.trim()) params.set("from", fromName.trim());
    if (message.trim()) params.set("msg", message.trim());
    const qs = params.toString();
    const link = `https://aiforj.com/gift/${selected.slug}${qs ? "?" + qs : ""}`;
    setGeneratedLink(link);
    setCopied(false);

    // Log to IndexedDB count
    try {
      const key = "techniques_gifted";
      const current = parseInt(localStorage.getItem(key) || "0", 10);
      localStorage.setItem(key, String(current + 1));
    } catch {}
  }, [selected, fromName, message]);

  const handleCopy = () => {
    if (!generatedLink) return;
    navigator.clipboard?.writeText(generatedLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {});
  };

  const handleShare = () => {
    if (!generatedLink || !navigator.share) return;
    navigator.share({
      title: fromName ? `${fromName} sent you something calming` : "Someone sent you calm",
      text: message || "I thought this might help. It's a free guided technique — takes a few minutes.",
      url: generatedLink,
    }).catch(() => {});
  };

  const handleClose = () => {
    setSelected(null);
    setFromName("");
    setMessage("");
    setGeneratedLink(null);
    setCopied(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Hero */}
      <section style={{ padding: "40px 24px 48px", maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(1.75rem, 4.5vw, 2.5rem)", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 16px", lineHeight: 1.2 }}>
          Send Calm to Someone You Care About
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--text-secondary)", margin: 0, maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>
          Choose a technique. We'll create a personal link. When they open it, they'll see a warm message and a guided tool — from you.
        </p>
      </section>

      {/* Technique Grid */}
      <section style={{ padding: "0 24px 80px", maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {TECHNIQUE_CARDS.map((t) => (
            <button
              key={t.slug}
              onClick={() => setSelected(t)}
              style={{
                textAlign: "left",
                padding: "22px 20px",
                background: "var(--surface-elevated)",
                border: "1px solid rgba(45,42,38,0.06)",
                borderRadius: 16,
                cursor: "pointer",
                transition: "all 300ms cubic-bezier(0.16,1,0.3,1)",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
                e.currentTarget.style.borderColor = "var(--interactive)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                e.currentTarget.style.borderColor = "rgba(45,42,38,0.06)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 500, color: "var(--text-primary)" }}>
                  {t.name}
                </span>
                <span style={{ fontSize: 12, color: "var(--text-muted)", flexShrink: 0 }}>
                  {t.duration}
                </span>
              </div>
              <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                {t.description}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Modal */}
      {selected && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(45,42,38,0.5)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: 20,
            animation: "fadeIn 300ms ease-out",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <div
            style={{
              background: "var(--surface-elevated)",
              borderRadius: 24,
              padding: "36px 28px",
              maxWidth: 480,
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "var(--shadow-xl)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 500, color: "var(--text-primary)", margin: 0 }}>
                Send: {selected.name}
              </h2>
              <button onClick={handleClose} aria-label="Close" style={{ background: "none", border: "none", fontSize: 22, color: "var(--text-muted)", cursor: "pointer", padding: 4 }}>
                ×
              </button>
            </div>

            {!generatedLink ? (
              <>
                {/* Name input */}
                <label style={{ display: "block", marginBottom: 16 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)", display: "block", marginBottom: 6 }}>
                    Your name <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optional)</span>
                  </span>
                  <input
                    type="text"
                    value={fromName}
                    onChange={(e) => setFromName(e.target.value)}
                    placeholder="e.g., Sarah"
                    maxLength={50}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      fontSize: 15,
                      fontFamily: "'DM Sans', sans-serif",
                      background: "var(--surface)",
                      border: "1px solid rgba(45,42,38,0.1)",
                      borderRadius: 12,
                      color: "var(--text-primary)",
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "border-color 300ms",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "var(--interactive)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(45,42,38,0.1)"; }}
                  />
                </label>

                {/* Message input */}
                <label style={{ display: "block", marginBottom: 24 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)", display: "block", marginBottom: 6 }}>
                    Add a short message <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optional, {140 - message.length} chars left)</span>
                  </span>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value.slice(0, 140))}
                    placeholder="I thought this might help..."
                    maxLength={140}
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      fontSize: 15,
                      fontFamily: "'DM Sans', sans-serif",
                      background: "var(--surface)",
                      border: "1px solid rgba(45,42,38,0.1)",
                      borderRadius: 12,
                      color: "var(--text-primary)",
                      outline: "none",
                      resize: "none",
                      boxSizing: "border-box",
                      transition: "border-color 300ms",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "var(--interactive)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(45,42,38,0.1)"; }}
                  />
                </label>

                {/* Preview */}
                <div style={{ background: "var(--bg-primary)", borderRadius: 16, padding: "20px 18px", marginBottom: 24, border: "1px solid rgba(45,42,38,0.06)" }}>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 12px" }}>
                    Preview — what they'll see
                  </p>
                  <p style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 500, color: "var(--text-primary)", margin: "0 0 8px" }}>
                    Someone who cares about you sent you this
                  </p>
                  {fromName.trim() && (
                    <p style={{ fontSize: 14, color: "var(--interactive)", margin: "0 0 8px", fontWeight: 500 }}>
                      From {fromName.trim()}
                    </p>
                  )}
                  {message.trim() && (
                    <div style={{ padding: "12px 14px", background: "var(--accent-warm-light)", borderRadius: 12, marginBottom: 8, borderLeft: "3px solid var(--accent-warm)" }}>
                      <p style={{ fontSize: 14, color: "var(--text-primary)", margin: 0, fontStyle: "italic", lineHeight: 1.5 }}>
                        "{message.trim()}"
                      </p>
                    </div>
                  )}
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>
                    Then: guided {selected.name} ({selected.duration})
                  </p>
                </div>

                {/* Generate button */}
                <button
                  onClick={handleGenerate}
                  style={{
                    width: "100%",
                    padding: "16px",
                    fontSize: 16,
                    fontWeight: 600,
                    fontFamily: "'Fraunces', serif",
                    background: "linear-gradient(135deg, var(--interactive), var(--interactive-pressed))",
                    color: "#fff",
                    border: "none",
                    borderRadius: 14,
                    cursor: "pointer",
                    transition: "all 300ms cubic-bezier(0.16,1,0.3,1)",
                    boxShadow: "0 4px 16px rgba(125,155,130,0.25)",
                  }}
                >
                  Generate Link
                </button>
              </>
            ) : (
              <>
                {/* Generated link */}
                <div style={{ marginBottom: 24 }}>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "0 0 10px" }}>
                    Your link is ready:
                  </p>
                  <div style={{ padding: "12px 14px", background: "var(--surface)", borderRadius: 10, border: "1px solid rgba(45,42,38,0.08)", wordBreak: "break-all" }}>
                    <code style={{ fontSize: 13, color: "var(--interactive)", fontFamily: "'DM Sans', monospace" }}>
                      {generatedLink}
                    </code>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                  <button onClick={handleCopy} style={{
                    flex: 1,
                    padding: "14px",
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif",
                    background: copied ? "var(--accent-sage-light)" : "linear-gradient(135deg, var(--interactive), var(--interactive-pressed))",
                    color: copied ? "var(--interactive)" : "#fff",
                    border: copied ? "1px solid var(--interactive)" : "none",
                    borderRadius: 12,
                    cursor: "pointer",
                    transition: "all 300ms",
                  }}>
                    {copied ? "Copied!" : "Copy Link"}
                  </button>
                  {typeof navigator !== "undefined" && navigator.share && (
                    <button onClick={handleShare} style={{
                      flex: 1,
                      padding: "14px",
                      fontSize: 14,
                      fontWeight: 600,
                      fontFamily: "'DM Sans', sans-serif",
                      background: "var(--accent-warm-light)",
                      color: "var(--accent-warm)",
                      border: "1px solid var(--accent-warm)",
                      borderRadius: 12,
                      cursor: "pointer",
                    }}>
                      Share
                    </button>
                  )}
                </div>

                <button onClick={() => { setGeneratedLink(null); setSelected(null); setFromName(""); setMessage(""); }} style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: 13,
                  fontFamily: "'DM Sans', sans-serif",
                  background: "transparent",
                  color: "var(--text-muted)",
                  border: "1px solid rgba(45,42,38,0.08)",
                  borderRadius: 10,
                  cursor: "pointer",
                }}>
                  Send another technique
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Privacy notice */}
      <div style={{ padding: "20px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0, lineHeight: 1.6 }}>
          No data is stored. Links contain only the technique, name, and message — no tracking.
        </p>
      </div>

      <SiteFooter />
    </div>
  );
}
