import { ImageResponse } from "next/og";

export const runtime = "edge";

const COLORS = {
  ink: "#2D2A26",
  muted: "#6C675D",
  sage: "#7A9E7E",
  sageDeep: "#54765A",
  parchment: "#F4EBDD",
  shell: "#FFFDF8",
  amber: "#C49A6C",
  line: "rgba(45,42,38,0.12)",
};

const avatarSvg = `<svg width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="320" height="320" rx="160" fill="#F0E8DA"/><circle cx="160" cy="160" r="126" fill="#FAF6F0" stroke="#7A9E7E" stroke-width="6"/><circle cx="160" cy="160" r="98" fill="#E8F0E8"/><path d="M206 91C226 119 223 151 197 176C174 198 142 201 116 185C136 179 154 169 171 152C188 135 199 115 206 91Z" fill="#7A9E7E"/><path d="M111 229V96H135V153L188 96H219L165 153L222 229H191L148 170L135 184V229H111Z" fill="#2C2520"/><path d="M122 236C154 219 181 194 202 162" stroke="#4A7A50" stroke-width="8" stroke-linecap="round"/></svg>`;

function safeText(value, fallback, maxLength = 120) {
  const text = String(value || fallback)
    .replace(/\s+/g, " ")
    .replace(/[<>]/g, "")
    .trim();

  return text.slice(0, maxLength) || fallback;
}

function labelForKind(kind) {
  return kind === "technique" ? "Technique article" : "Help guide";
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const kind = searchParams.get("kind") === "technique" ? "technique" : "help";
  const title = safeText(searchParams.get("title"), "AIForj emotional first aid");
  const avatarDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(avatarSvg)}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: `linear-gradient(135deg, ${COLORS.shell} 0%, ${COLORS.parchment} 68%, #EEF4EE 100%)`,
          color: COLORS.ink,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -120,
            width: 470,
            height: 470,
            borderRadius: 999,
            background: "rgba(122,158,126,0.16)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -150,
            left: -120,
            width: 390,
            height: 390,
            borderRadius: 999,
            background: "rgba(196,154,108,0.18)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "13px 18px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.74)",
              border: `1px solid ${COLORS.line}`,
              color: COLORS.sageDeep,
              fontSize: 22,
              letterSpacing: 3.4,
              textTransform: "uppercase",
            }}
          >
            <div style={{ width: 13, height: 13, borderRadius: 999, background: COLORS.sage, display: "flex" }} />
            {labelForKind(kind)}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              color: COLORS.muted,
              fontSize: 24,
            }}
          >
            <div style={{ width: 28, height: 28, borderRadius: 9, background: COLORS.sage, display: "flex" }} />
            AIForj.com
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 26,
            maxWidth: 980,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 68,
              lineHeight: 1.02,
              letterSpacing: -2.6,
              fontWeight: 700,
              maxWidth: 980,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              color: COLORS.muted,
              fontSize: 30,
              lineHeight: 1.35,
              maxWidth: 850,
            }}
          >
            Private emotional first-aid tools grounded in evidence-based modalities.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 28,
            borderTop: `1px solid ${COLORS.line}`,
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <img
              src={avatarDataUri}
              alt="Founder avatar"
              width={78}
              height={78}
              style={{
                borderRadius: 999,
                border: "3px solid rgba(122,158,126,0.28)",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", fontSize: 28, fontWeight: 700 }}>
                By Kevin · Psychiatric NP candidate
              </div>
              <div style={{ display: "flex", fontSize: 21, color: COLORS.muted }}>
                Clinically trained in CBT, DBT, ACT, IFS, polyvagal theory + more
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              padding: "14px 18px",
              borderRadius: 18,
              background: "rgba(255,255,255,0.68)",
              border: `1px solid ${COLORS.line}`,
              color: COLORS.sageDeep,
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            Private by design
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
