"use client";

import { useState } from "react";
import { buildCalmCardUrl } from "../../utils/calmCard";

const SHARE_TEXTS = {
  "box-breathing": "I found this 4-minute reset useful. Free, no app needed",
  "physiological-sigh": "I found this 2-minute breathing reset useful.",
  "54321-grounding": "This short grounding reset helped me slow down.",
  "thought-defusion": "This helped me create a little distance from a thought.",
  "cognitive-restructuring": "This helped me look at a hard thought more clearly.",
  "progressive-muscle-relaxation": "This guided body reset felt worth the time.",
  "body-scan": "This body scan helped me pause for a few minutes.",
  "tipp-skill": "This quick reset helped me shift gears.",
  "behavioral-activation": "This tiny-step reset helped me start.",
  "cognitive-distortions": "This helped me notice a thought pattern.",
  "self-compassion-break": "This short self-compassion reset felt useful.",
  "radical-acceptance": "This helped me stop fighting the moment for a few minutes.",
  "vagal-toning": "This simple regulation reset helped me slow down.",
  "worry-time": "This helped me put worry in a smaller container.",
  "values-clarification": "This helped me reconnect with what matters.",
};

export default function ShareResultCard({ technique }) {
  const [copied, setCopied] = useState(false);

  const techniqueShortName = technique.title.split(":")[0];
  const shareUrl = `https://aiforj.com/techniques/${technique.slug}`;
  const prewrittenText = SHARE_TEXTS[technique.slug] || `I found this 2-minute reset useful.`;
  const fullShareText = `${prewrittenText} → ${shareUrl}`;
  const cardFormats = [
    { id: "story", label: "Story" },
    { id: "feed", label: "Feed" },
    { id: "square", label: "Square" },
  ];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: techniqueShortName,
          text: prewrittenText,
          url: shareUrl,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(fullShareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadCard = async (format = "square") => {
    const link = document.createElement("a");
    link.href = buildCalmCardUrl({
      kind: "technique",
      slug: technique.slug,
      format,
      download: true,
    });
    link.download = `aiforj-${technique.slug}-${format}.png`;
    link.click();
  };

  return (
    <div style={{ textAlign: "center" }}>
      {/* Visible Share Prompt */}
      <div style={{
        padding: "32px 24px",
        background: "rgba(125,155,130,0.06)",
        borderRadius: 18,
        border: "1px solid rgba(125,155,130,0.15)",
      }}>
        <p style={{
          fontSize: 18,
          color: "#2D2A26",
          fontFamily: "'Fraunces', serif",
          fontWeight: 500,
          margin: "0 0 8px",
        }}>
          This helped? Share it with someone who might need it.
        </p>
        <p style={{
          fontSize: 14,
          color: "rgba(45,42,38,0.6)",
          margin: "0 0 24px",
          lineHeight: 1.6,
          maxWidth: 440,
          marginLeft: "auto",
          marginRight: "auto",
        }}>
          "{prewrittenText}"
        </p>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={handleShare}
            style={{
              padding: "12px 28px",
              fontSize: 15,
              fontWeight: 600,
              fontFamily: "'Fraunces', serif",
              background: "linear-gradient(135deg, #7D9B82, #6B8C6B)",
              color: "#fff",
              border: "none",
              borderRadius: 14,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {copied ? "Copied!" : "Share"}
          </button>
          <button
            onClick={handleCopyLink}
            style={{
              padding: "12px 28px",
              fontSize: 15,
              fontWeight: 500,
              fontFamily: "'Fraunces', serif",
              background: "transparent",
              color: "#7D9B82",
              border: "1px solid rgba(125,155,130,0.25)",
              borderRadius: 14,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            Copy link
          </button>
          <button
            onClick={() => handleDownloadCard("square")}
            style={{
              padding: "12px 28px",
              fontSize: 15,
              fontWeight: 500,
              fontFamily: "'Fraunces', serif",
              background: "transparent",
              color: "#7D9B82",
              border: "1px solid rgba(125,155,130,0.25)",
              borderRadius: 14,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            Download card
          </button>
        </div>

        <div style={{ marginTop: 16, display: "flex", justifyContent: "center", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "rgba(45,42,38,0.55)" }}>Formats:</span>
          {cardFormats.map((format) => (
            <button
              key={format.id}
              onClick={() => handleDownloadCard(format.id)}
              style={{
                padding: "8px 14px",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                background: "#fff",
                color: "#7D9B82",
                border: "1px solid rgba(125,155,130,0.2)",
                borderRadius: 999,
                cursor: "pointer",
              }}
            >
              {format.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
