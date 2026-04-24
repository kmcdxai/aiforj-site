import { ImageResponse } from "next/og";
import { getShareCardView, parseShareToken } from "../../../../lib/shareToken";

export const runtime = "edge";

const COLORS = {
  ink: "#2D2A26",
  muted: "#6C675D",
  shell: "#FFFDF8",
  parchment: "#F6EFE5",
  line: "rgba(45,42,38,0.12)",
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") || "";
  const payload = parseShareToken(token);
  const view = getShareCardView(payload || { type: "technique" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 64,
          background: `linear-gradient(135deg, ${COLORS.shell} 0%, ${COLORS.parchment} 64%, ${view.color}33 100%)`,
          color: COLORS.ink,
          fontFamily: "Arial",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -130,
            top: -160,
            width: 520,
            height: 520,
            borderRadius: 999,
            background: `${view.color}2B`,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -150,
            bottom: -180,
            width: 460,
            height: 460,
            borderRadius: 999,
            background: "rgba(196,149,106,0.17)",
            display: "flex",
          }}
        />

        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 52,
            borderRadius: 42,
            background: "rgba(255,255,255,0.76)",
            border: `2px solid ${COLORS.line}`,
            boxShadow: "0 30px 90px rgba(45,42,38,0.12)",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 18px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.74)",
                border: `1px solid ${COLORS.line}`,
                color: view.color,
                fontSize: 23,
                letterSpacing: 3.2,
                textTransform: "uppercase",
                fontWeight: 800,
              }}
            >
              <div style={{ width: 14, height: 14, borderRadius: 999, background: view.color, display: "flex" }} />
              {view.eyebrow}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 24, color: COLORS.muted }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: view.color, display: "flex" }} />
              AIForj.com
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 980 }}>
            <div style={{ display: "flex", fontSize: 78, lineHeight: 1.02, letterSpacing: -2.4, fontWeight: 800 }}>
              {view.title}
            </div>
            <div style={{ display: "flex", maxWidth: 820, fontSize: 31, lineHeight: 1.35, color: COLORS.muted }}>
              {view.body}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 24,
              paddingTop: 28,
              borderTop: `1px solid ${COLORS.line}`,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", fontSize: 28, fontWeight: 800 }}>Self-guided emotional first aid</div>
              <div style={{ display: "flex", fontSize: 21, color: COLORS.muted }}>
                Shared without raw mood scores, journal text, chat text, or provider details.
              </div>
            </div>
            <div
              style={{
                display: "flex",
                padding: "16px 20px",
                borderRadius: 18,
                background: `${view.color}1F`,
                color: view.color,
                fontSize: 24,
                fontWeight: 800,
              }}
            >
              {view.cta}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
