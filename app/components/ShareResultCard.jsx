"use client";

import { useState, useRef, useCallback } from "react";

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

export default function ShareResultCard({ technique, elapsedMinutes }) {
  const [showCard, setShowCard] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const cardRef = useRef(null);

  const techniqueShortName = technique.title.split(":")[0];
  const shareUrl = `https://aiforj.com/techniques/${technique.slug}`;
  const prewrittenText = SHARE_TEXTS[technique.slug] || `Just tried "${techniqueShortName}" and it helped`;
  const fullShareText = `${prewrittenText} → ${shareUrl}`;

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

  const handleDownloadCard = async () => {
    setGenerating(true);
    setShowCard(true);
    // Wait for render
    await new Promise((r) => setTimeout(r, 100));
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#FDFAF6",
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = `aiforj-${technique.slug}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error("Could not generate card:", e);
    }
    setGenerating(false);
  };

  const timeDisplay = elapsedMinutes
    ? `${elapsedMinutes} min`
    : technique.time;

  return (
    <div style={{ textAlign: "center" }}>
      {/* Result Card (hidden until download, rendered offscreen for capture) */}
      {showCard && (
        <div
          style={{
            position: "absolute",
            left: "-9999px",
            top: 0,
          }}
        >
          <div
            ref={cardRef}
            style={{
              width: 600,
              height: 340,
              background: "linear-gradient(145deg, #FDFAF6 0%, #F5EFE7 50%, #FDFAF6 100%)",
              borderRadius: 24,
              padding: "40px 44px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              fontFamily: "'DM Sans', sans-serif",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative circles */}
            <div style={{ position: "absolute", top: -60, right: -60, width: 180, height: 180, borderRadius: "50%", background: "rgba(125,155,130,0.08)" }} />
            <div style={{ position: "absolute", bottom: -40, left: -40, width: 120, height: 120, borderRadius: "50%", background: "rgba(125,155,130,0.05)" }} />

            <div>
              <p style={{ fontSize: 14, color: "rgba(45,42,38,0.5)", margin: "0 0 12px", fontFamily: "'Fraunces', serif", fontWeight: 500 }}>
                I just completed
              </p>
              <h2 style={{ fontSize: 26, color: "#2D2A26", margin: "0 0 14px", fontFamily: "'Fraunces', serif", fontWeight: 600, lineHeight: 1.3 }}>
                {techniqueShortName}
              </h2>
              <p style={{ fontSize: 15, color: "rgba(45,42,38,0.7)", margin: 0, lineHeight: 1.5 }}>
                {technique.subtitle} &middot; {timeDisplay}
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <p style={{ fontSize: 13, color: "#7D9B82", margin: "0 0 4px", fontWeight: 500 }}>
                  Try it free
                </p>
                <p style={{ fontSize: 15, color: "rgba(45,42,38,0.6)", margin: 0 }}>
                  aiforj.com/techniques/{technique.slug}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18, fontFamily: "'Fraunces', serif", fontWeight: 700, color: "#7D9B82" }}>
                  AIForj
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

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
            onClick={handleDownloadCard}
            disabled={generating}
            style={{
              padding: "12px 28px",
              fontSize: 15,
              fontWeight: 500,
              fontFamily: "'Fraunces', serif",
              background: "transparent",
              color: "#7D9B82",
              border: "1px solid rgba(125,155,130,0.25)",
              borderRadius: 14,
              cursor: generating ? "wait" : "pointer",
              transition: "all 0.2s ease",
              opacity: generating ? 0.6 : 1,
            }}
          >
            {generating ? "Generating..." : "Download card"}
          </button>
        </div>
      </div>
    </div>
  );
}
