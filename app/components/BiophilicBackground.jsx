"use client";

import { useEffect, useState } from "react";

export default function BiophilicBackground() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) setVisible(false);
    const handler = (e) => setVisible(!e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {/* Organic shape 1 — warm sage, top-right */}
      <div
        style={{
          position: "absolute",
          top: "-15%",
          right: "-10%",
          width: "clamp(400px, 50vw, 800px)",
          height: "clamp(400px, 50vw, 800px)",
          borderRadius: "40% 60% 55% 45% / 50% 40% 60% 50%",
          background: "radial-gradient(ellipse, rgba(125,155,130,0.03) 0%, transparent 70%)",
          animation: "biophilicFloat1 65s ease-in-out infinite",
          filter: "blur(60px)",
        }}
      />

      {/* Organic shape 2 — warm amber, bottom-left */}
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          left: "-15%",
          width: "clamp(350px, 45vw, 700px)",
          height: "clamp(350px, 45vw, 700px)",
          borderRadius: "55% 45% 50% 50% / 45% 55% 45% 55%",
          background: "radial-gradient(ellipse, rgba(196,149,106,0.025) 0%, transparent 70%)",
          animation: "biophilicFloat2 78s ease-in-out infinite",
          filter: "blur(70px)",
        }}
      />

      {/* Organic shape 3 — teal, center-left, barely visible */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "10%",
          width: "clamp(300px, 35vw, 550px)",
          height: "clamp(300px, 35vw, 550px)",
          borderRadius: "50% 50% 45% 55% / 60% 40% 60% 40%",
          background: "radial-gradient(ellipse, rgba(107,155,158,0.02) 0%, transparent 70%)",
          animation: "biophilicFloat3 90s ease-in-out infinite",
          filter: "blur(80px)",
        }}
      />
    </div>
  );
}
