import { TECHNIQUES } from "./data";
import Link from "next/link";
import SiteFooter from "../components/SiteFooter";

export const metadata = {
  title: "Evidence-Based Mental Health Techniques | AIForj",
  description:
    "Explore 30 interactive emotional first-aid techniques for anxiety, stress, grief, burnout, and more. CBT, DBT, ACT, and somatic tools you can use right now. Clinician-informed and evidence-framed.",
  alternates: {
    canonical: "https://aiforj.com/techniques",
  },
  openGraph: {
    title: "Evidence-Based Mental Health Techniques | AIForj",
    description:
      "30 interactive techniques for anxiety, stress, depression, and more. Free. Private. Clinically informed.",
    url: "https://aiforj.com/techniques",
    siteName: "AIForj",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Evidence-Based Mental Health Techniques | AIForj",
    description:
      "30 interactive techniques for anxiety, stress, depression, and more. Free. Private.",
  },
};

export default function TechniquesPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "48px 24px 80px",
        }}
      >
        <header style={{ textAlign: "center", marginBottom: 48 }}>
          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "clamp(28px, 5vw, 42px)",
              fontWeight: 500,
              color: "var(--text-primary)",
              margin: "0 0 16px",
              lineHeight: 1.2,
            }}
          >
            Technique Library
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "var(--text-secondary)",
              maxWidth: 560,
              margin: "0 auto",
              lineHeight: 1.6,
              fontWeight: 400,
            }}
          >
            30 evidence-based techniques you can do right now. Each one is
            interactive — not just reading, but doing. Clinically informed by
            Kevin, a psychiatric nurse practitioner candidate.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          {TECHNIQUES.map((t) => (
            <Link
              key={t.slug}
              href={`/techniques/${t.slug}`}
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "24px 20px",
                background: "var(--surface-elevated)",
                border: "1px solid rgba(45,42,38,0.06)",
                borderRadius: 16,
                textDecoration: "none",
                transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
                cursor: "pointer",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    padding: "3px 10px",
                    background: "var(--accent-sage-light)",
                    borderRadius: 8,
                    color: "var(--accent-sage)",
                    fontWeight: 600,
                    letterSpacing: 0.5,
                  }}
                >
                  {t.modality}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                  }}
                >
                  {t.time}
                </span>
              </div>
              <h2
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 17,
                  fontWeight: 500,
                  color: "var(--text-primary)",
                  margin: "0 0 8px",
                  lineHeight: 1.3,
                }}
              >
                {t.title.split(":")[0]}
              </h2>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  margin: 0,
                  lineHeight: 1.5,
                  fontWeight: 400,
                  flex: 1,
                }}
              >
                {t.subtitle}
              </p>
              <span
                style={{
                  display: "inline-block",
                  marginTop: 14,
                  fontSize: 13,
                  color: "var(--interactive)",
                  fontWeight: 500,
                }}
              >
                Try it now →
              </span>
            </Link>
          ))}
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
