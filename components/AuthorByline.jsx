import Link from "next/link";
import { LAST_REVIEWED_DATE } from "../lib/contentSchemas";

const formatDate = (isoDate) =>
  new Date(`${isoDate}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default function AuthorByline({ lastReviewed = LAST_REVIEWED_DATE, variant = "light" }) {
  const isDark = variant === "dark";
  const textColor = isDark ? "rgba(232,240,248,0.86)" : "var(--text-primary)";
  const mutedColor = isDark ? "rgba(200,215,230,0.68)" : "var(--text-secondary)";
  const borderColor = isDark ? "rgba(91,143,168,0.22)" : "var(--border)";
  const background = isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.58)";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 16px",
        margin: "18px 0 24px",
        borderRadius: 18,
        background,
        border: `1px solid ${borderColor}`,
        boxShadow: isDark ? "none" : "var(--shadow-sm)",
      }}
    >
      <img
        src="/founder-avatar.svg"
        alt="Founder avatar"
        width={52}
        height={52}
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          flex: "0 0 auto",
          border: `2px solid ${isDark ? "rgba(91,143,168,0.32)" : "rgba(122,158,126,0.24)"}`,
          background: "var(--surface)",
        }}
      />
      <div style={{ display: "grid", gap: 3, minWidth: 0 }}>
        <p style={{ margin: 0, color: textColor, fontWeight: 700, lineHeight: 1.35 }}>
          By{" "}
          <Link href="/about/founder" style={{ color: isDark ? "#8BB8D4" : "var(--interactive)", textDecoration: "underline", textUnderlineOffset: 3 }}>
            Kevin
          </Link>
        </p>
        <p style={{ margin: 0, color: mutedColor, fontSize: 13, lineHeight: 1.55 }}>
          Licensed clinician · Psychiatric NP candidate
        </p>
        <p style={{ margin: 0, color: mutedColor, fontSize: 13, lineHeight: 1.55 }}>
          Clinically trained in CBT, DBT, ACT, IFS, polyvagal theory + more
        </p>
        <p style={{ margin: "2px 0 0", color: mutedColor, fontSize: 12, lineHeight: 1.45 }}>
          Last reviewed: {formatDate(lastReviewed)}
        </p>
      </div>
    </div>
  );
}
