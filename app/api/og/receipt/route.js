import { ImageResponse } from "next/og";

export const runtime = "edge";

function clampScore(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 5;
  return Math.max(1, Math.min(10, Math.round(number)));
}

function titleCase(value = "emotion") {
  return String(value || "emotion")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function stateLabel(emotion, from, to) {
  if (to < from) return `${titleCase(emotion)} → Calmer`;
  if (to > from) return `${titleCase(emotion)} → Steadier`;
  return `${titleCase(emotion)} → Noticed`;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const emotion = titleCase(searchParams.get("e") || "anxious");
  const from = clampScore(searchParams.get("from"));
  const to = clampScore(searchParams.get("to"));
  const modality = titleCase(searchParams.get("mod") || "ACT defusion");
  const duration = Math.max(1, Math.min(60, Number(searchParams.get("d") || 3) || 3));
  const delta = to - from;
  const beforeWidth = `${from * 10}%`;
  const afterWidth = `${to * 10}%`;
  const scoreBefore = `${from}/10`;
  const scoreAfter = `${to}/10`;
  const modalityLine = `${modality} · ${duration} min`;
  const shiftLine = `${delta > 0 ? "+" : ""}${delta} point shift`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 64,
          background: "linear-gradient(135deg, #faf6f0 0%, #eef4ea 55%, #f5e8cf 100%)",
          color: "#2d2a26",
          fontFamily: "Arial",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "2px solid rgba(45,42,38,0.08)",
            borderRadius: 42,
            padding: 52,
            background: "rgba(255,255,255,0.74)",
            boxShadow: "0 30px 90px rgba(45,42,38,0.12)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", fontSize: 24, letterSpacing: 4, textTransform: "uppercase", color: "#6f8f72", fontWeight: 800 }}>
                Mood Shift Receipt
              </div>
              <div style={{ display: "flex", fontSize: 76, lineHeight: 1.02, fontWeight: 800, letterSpacing: -2 }}>
                {stateLabel(emotion, from, to)}
              </div>
            </div>
            <div
              style={{
                width: 86,
                height: 86,
                borderRadius: 24,
                background: "#7d9b82",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 38,
                fontWeight: 900,
              }}
            >
              AI
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
              <div style={{ display: "flex", width: 170, fontSize: 30, fontWeight: 800 }}>Before</div>
              <div style={{ display: "flex", flex: 1, height: 34, borderRadius: 999, background: "rgba(45,42,38,0.08)", overflow: "hidden" }}>
                <div style={{ display: "flex", width: beforeWidth, height: "100%", background: "#c4956a", borderRadius: 999 }} />
              </div>
              <div style={{ display: "flex", width: 88, textAlign: "right", fontSize: 38, fontWeight: 900 }}>{scoreBefore}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
              <div style={{ display: "flex", width: 170, fontSize: 30, fontWeight: 800 }}>After</div>
              <div style={{ display: "flex", flex: 1, height: 34, borderRadius: 999, background: "rgba(45,42,38,0.08)", overflow: "hidden" }}>
                <div style={{ display: "flex", width: afterWidth, height: "100%", background: "#7d9b82", borderRadius: 999 }} />
              </div>
              <div style={{ display: "flex", width: 88, textAlign: "right", fontSize: 38, fontWeight: 900 }}>{scoreAfter}</div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", fontSize: 22, color: "#6c6259", fontWeight: 700 }}>
                {modalityLine}
              </div>
              <div style={{ display: "flex", fontSize: 34, fontWeight: 900, color: delta >= 0 ? "#5f8363" : "#a96d55" }}>
                {shiftLine}
              </div>
            </div>
            <div style={{ display: "flex", fontSize: 22, color: "#6c6259", fontWeight: 700, textAlign: "right" }}>
              Built by Kevin · Licensed clinician · Psychiatric NP candidate · aiforj.com
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
