"use client";

import { useMemo, useState } from "react";
import { TECHNIQUES } from "../../app/techniques/data";
import { buildCalmCardUrl } from "../../utils/calmCard";

const STARTER_SLUGS = [
  "box-breathing",
  "physiological-sigh",
  "54321-grounding",
  "thought-defusion",
  "self-compassion-break",
  "behavioral-activation",
];

const DISCLAIMER_TEXT =
  "AIForj offers emotional first-aid tools for skill practice between visits. It is not a substitute for diagnosis, medication advice, emergency care, or crisis support. If this feels urgent or unsafe, contact 988 or local emergency services.";

function getTechniqueOptions() {
  const preferred = STARTER_SLUGS
    .map((slug) => TECHNIQUES.find((technique) => technique.slug === slug))
    .filter(Boolean);
  const remaining = TECHNIQUES.filter((technique) => !STARTER_SLUGS.includes(technique.slug));
  return [...preferred, ...remaining];
}

export default function ClinicianPackBuilder() {
  const options = useMemo(() => getTechniqueOptions(), []);
  const [practiceName, setPracticeName] = useState("");
  const [techniqueSlug, setTechniqueSlug] = useState(options[0]?.slug || "box-breathing");
  const [copied, setCopied] = useState("");

  const selectedTechnique = options.find((technique) => technique.slug === techniqueSlug) || options[0];
  const normalizedPracticeName = practiceName.replace(/\s+/g, " ").trim();
  const patientLink = `https://aiforj.com/techniques/${selectedTechnique?.slug}`;

  const copyText = async (value, key) => {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    window.setTimeout(() => setCopied((current) => (current === key ? "" : current)), 2200);
  };

  const downloadCard = (format) => {
    const link = document.createElement("a");
    link.href = buildCalmCardUrl({
      kind: "technique",
      slug: selectedTechnique.slug,
      format,
      download: true,
      brand: normalizedPracticeName,
    });
    link.download = `aiforj-clinician-${selectedTechnique.slug}-${format}.png`;
    link.click();
  };

  return (
    <section
      style={{
        display: "grid",
        gap: 18,
        padding: "clamp(24px, 4vw, 32px)",
        borderRadius: 24,
        background:
          "linear-gradient(135deg, rgba(196,149,106,0.12), rgba(255,255,255,0.82))",
        border: "1px solid rgba(45,42,38,0.08)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div>
        <p
          style={{
            margin: "0 0 8px",
            fontSize: 12,
            letterSpacing: 1.8,
            textTransform: "uppercase",
            color: "var(--amber-deep)",
            fontWeight: 700,
          }}
        >
          Working clinician pack
        </p>
        <h1
          style={{
            margin: "0 0 10px",
            fontFamily: "'Fraunces', serif",
            fontSize: "clamp(28px, 4vw, 40px)",
            lineHeight: 1.15,
            color: "var(--text-primary)",
          }}
        >
          Generate patient-safe handout links and branded calm cards
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: 16,
            lineHeight: 1.8,
            color: "var(--text-secondary)",
            maxWidth: 760,
          }}
        >
          Pick a technique, add your practice name if you want a gentle brand mark,
          and generate ready-to-share assets you can use between visits without
          creating a patient dashboard.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gap: 16,
          padding: "20px 18px",
          borderRadius: 18,
          background: "rgba(255,255,255,0.76)",
          border: "1px solid rgba(45,42,38,0.08)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
          }}
        >
          <label style={{ display: "grid", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
              Practice name
              <span style={{ fontWeight: 500, color: "var(--text-muted)" }}> (optional)</span>
            </span>
            <input
              type="text"
              value={practiceName}
              onChange={(event) => setPracticeName(event.target.value)}
              placeholder="Bright Harbor Therapy"
              maxLength={48}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 14,
                border: "1px solid rgba(45,42,38,0.12)",
                background: "#fff",
                color: "var(--text-primary)",
                fontSize: 15,
              }}
            />
          </label>

          <label style={{ display: "grid", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
              Handout technique
            </span>
            <select
              value={techniqueSlug}
              onChange={(event) => setTechniqueSlug(event.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 14,
                border: "1px solid rgba(45,42,38,0.12)",
                background: "#fff",
                color: "var(--text-primary)",
                fontSize: 15,
              }}
            >
              {options.map((technique) => (
                <option key={technique.slug} value={technique.slug}>
                  {technique.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.1fr) minmax(280px, 0.9fr)",
            gap: 18,
            alignItems: "start",
          }}
        >
          <div style={{ display: "grid", gap: 14 }}>
            <div
              style={{
                padding: "18px 16px",
                borderRadius: 16,
                background: "rgba(125,155,130,0.08)",
                border: "1px solid rgba(125,155,130,0.16)",
              }}
            >
              <div style={{ fontSize: 12, letterSpacing: 1.6, textTransform: "uppercase", color: "var(--accent-sage)", fontWeight: 700, marginBottom: 8 }}>
                Patient link
              </div>
              <div style={{ fontSize: 16, lineHeight: 1.6, color: "var(--text-primary)", wordBreak: "break-all" }}>
                {patientLink}
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
                <button type="button" className="btn-primary" onClick={() => copyText(patientLink, "link")}>
                  {copied === "link" ? "Copied link" : "Copy patient link"}
                </button>
                <a href={patientLink} className="btn-secondary" style={{ textDecoration: "none" }}>
                  Open tool →
                </a>
              </div>
            </div>

            <div
              style={{
                padding: "18px 16px",
                borderRadius: 16,
                background: "rgba(255,255,255,0.86)",
                border: "1px solid rgba(45,42,38,0.08)",
              }}
            >
              <div style={{ fontSize: 12, letterSpacing: 1.6, textTransform: "uppercase", color: "var(--amber-deep)", fontWeight: 700, marginBottom: 8 }}>
                Patient-safe disclaimer
              </div>
              <p style={{ margin: "0 0 14px", color: "var(--text-secondary)", lineHeight: 1.8 }}>
                {DISCLAIMER_TEXT}
              </p>
              <button type="button" className="btn-secondary" onClick={() => copyText(DISCLAIMER_TEXT, "disclaimer")}>
                {copied === "disclaimer" ? "Copied disclaimer" : "Copy disclaimer"}
              </button>
            </div>

            <div
              style={{
                padding: "18px 16px",
                borderRadius: 16,
                background: "rgba(255,255,255,0.86)",
                border: "1px solid rgba(45,42,38,0.08)",
              }}
            >
              <div style={{ fontSize: 12, letterSpacing: 1.6, textTransform: "uppercase", color: "var(--accent-teal)", fontWeight: 700, marginBottom: 10 }}>
                Download branded cards
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {["story", "feed", "square"].map((format) => (
                  <button
                    key={format}
                    type="button"
                    className="btn-secondary"
                    onClick={() => downloadCard(format)}
                  >
                    {format === "story" ? "Story card" : format === "feed" ? "Feed card" : "Square card"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: 10,
              padding: 14,
              borderRadius: 18,
              background: "rgba(255,255,255,0.76)",
              border: "1px solid rgba(45,42,38,0.08)",
            }}
          >
            <div style={{ fontSize: 12, letterSpacing: 1.6, textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>
              Card preview
            </div>
            <img
              src={buildCalmCardUrl({
                kind: "technique",
                slug: selectedTechnique.slug,
                format: "square",
                brand: normalizedPracticeName,
              })}
              alt={`${selectedTechnique.title} calm card preview`}
              style={{
                width: "100%",
                borderRadius: 18,
                border: "1px solid rgba(45,42,38,0.08)",
                boxShadow: "var(--shadow-sm)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
