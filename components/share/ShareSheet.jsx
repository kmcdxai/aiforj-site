"use client";

import { useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { createShareToken, getShareCardView } from "../../lib/shareToken";
import { trackSafeMetric } from "../../lib/metrics";
import ShareCard from "./ShareCard";

const CHANNELS = [
  { id: "sms", label: "SMS" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "email", label: "Email" },
  { id: "x", label: "X" },
  { id: "threads", label: "Threads" },
  { id: "facebook", label: "Facebook" },
  { id: "reddit", label: "Reddit" },
];

function openShareUrl(channel, text, url) {
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);
  const links = {
    sms: `sms:?&body=${encodedText}%20${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    email: `mailto:?subject=${encodeURIComponent("A calm reset")}&body=${encodedText}%0A%0A${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    threads: `https://www.threads.net/intent/post?text=${encodedText}%20${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedText}`,
  };

  if (channel === "sms" || channel === "email") {
    window.location.href = links[channel];
    return;
  }

  window.open(links[channel], "_blank", "noopener,noreferrer,width=720,height=640");
}

export default function ShareSheet({ payload, title = "Share this reset", compact = false }) {
  const cardRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const token = useMemo(() => createShareToken(payload), [payload]);
  const view = useMemo(() => getShareCardView(payload), [payload]);
  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/share/${token}`
    : `https://aiforj.com/share/${token}`;
  const shareText = payload?.type === "send_calm"
    ? "Sending you a calm link, no pressure."
    : payload?.type === "garden"
      ? "I planted a calm bloom today."
      : "I found this 2-minute reset useful.";

  const trackShareGenerated = (channel) => {
    trackSafeMetric({
      event: "share_card_generated",
      cardType: payload?.type || payload?.cardType || "technique",
      toolSlug: payload?.toolSlug,
      archetype: payload?.archetype,
      acquisitionSource: "shared_card",
    });
    if (channel) {
      trackSafeMetric({
        event: "share_link_opened",
        cardType: payload?.type || payload?.cardType || "technique",
        toolSlug: payload?.toolSlug,
        archetype: payload?.archetype,
        acquisitionSource: "shared_card",
      });
    }
  };

  const nativeShare = async () => {
    trackShareGenerated("native");
    if (navigator.share) {
      try {
        await navigator.share({ title: view.title, text: shareText, url: shareUrl });
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
      }
    }
    await copyLink();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      trackShareGenerated("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const downloadImage = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#F6EFE5",
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = `aiforj-calm-card-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      trackShareGenerated("download");
    } catch (error) {
      console.warn("Unable to download share card:", error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section
      style={{
        display: "grid",
        gap: compact ? 12 : 16,
        padding: compact ? 0 : "22px",
        borderRadius: compact ? 0 : 22,
        background: compact ? "transparent" : "rgba(255,255,255,0.62)",
        border: compact ? "none" : "1px solid rgba(45,42,38,0.08)",
      }}
    >
      <div>
        <h3 style={{ margin: "0 0 8px", fontSize: compact ? 20 : 24 }}>{title}</h3>
        <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.7 }}>
          Share the tool, not the private moment. No raw mood scores, journal text, chat text, or provider details are included.
        </p>
      </div>
      <div ref={cardRef}>
        <ShareCard payload={payload} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        <button type="button" onClick={nativeShare} className="btn-primary">Share</button>
        <button type="button" onClick={copyLink} className="btn-secondary">{copied ? "Copied" : "Copy link"}</button>
        <button type="button" onClick={downloadImage} disabled={downloading} className="btn-secondary">
          {downloading ? "Making image..." : "Download image"}
        </button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {CHANNELS.map((channel) => (
          <button
            key={channel.id}
            type="button"
            onClick={() => {
              trackShareGenerated(channel.id);
              openShareUrl(channel.id, shareText, shareUrl);
            }}
            style={{
              padding: "8px 12px",
              borderRadius: 999,
              border: "1px solid rgba(45,42,38,0.10)",
              background: "var(--surface)",
              color: "var(--text-secondary)",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            {channel.label}
          </button>
        ))}
      </div>
    </section>
  );
}
