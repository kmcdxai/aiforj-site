"use client";

import { useState } from "react";
import { buildCalmCardUrl } from "../../utils/calmCard";

const SHARE_TEXTS = {
  "box-breathing": "Just tried this 4-minute box breathing technique and it actually worked. Free, no app needed",
  "physiological-sigh": "Found the fastest way to calm down — one specific breathing pattern backed by Stanford research. 2 minutes",
  "54321-grounding": "This 5-4-3-2-1 grounding exercise pulled me out of an anxiety spiral in under 5 minutes",
  "thought-defusion": "Learned how to create distance from intrusive thoughts using this ACT technique. Game changer",
  "cognitive-restructuring": "Just challenged a negative thought pattern using this CBT technique. The evidence exercise is eye-opening",
  "progressive-muscle-relaxation": "Did this guided muscle relaxation exercise and my whole body feels different. 12 minutes well spent",
  "body-scan": "This body scan meditation is the real deal for stress and sleep. Completely free, guided, private",
  "tipp-skill": "TIPP skill from DBT — temperature, intense exercise, paced breathing, progressive relaxation. Works fast",
  "behavioral-activation": "When you can't find motivation, try this: do one tiny thing, rate your mood before and after. The gap is surprising",
  "cognitive-distortions": "Just identified my most common thinking trap. This cognitive distortions exercise is surprisingly revealing",
  "self-compassion-break": "Tried a 3-minute self-compassion break and it hit harder than I expected. Free guided exercise",
  "radical-acceptance": "This radical acceptance exercise from DBT helped me stop fighting what I can't control. 7 minutes",
  "vagal-toning": "These vagus nerve exercises actually shifted my nervous system in 4 minutes. Cold exposure + humming + stretches",
  "worry-time": "Scheduled worry time sounds weird but it works — contained my anxiety into 10 focused minutes then moved on",
  "values-clarification": "This values clarification exercise helped me see exactly where my life is misaligned. Worth 10 minutes",
};

export default function ShareResultCard({ technique }) {
  const [copied, setCopied] = useState(false);

  const techniqueShortName = technique.title.split(":")[0];
  const shareUrl = `https://aiforj.com/techniques/${technique.slug}`;
  const prewrittenText = SHARE_TEXTS[technique.slug] || `Just tried "${techniqueShortName}" and it helped`;
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
