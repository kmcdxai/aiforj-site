import { TECHNIQUES } from "./data";
import Link from "next/link";

export const metadata = {
  title: "Evidence-Based Mental Health Techniques | AIForj",
  description:
    "Explore 15 clinician-built, interactive mental health techniques. CBT, DBT, ACT, and more. Free guided exercises you can do right now. Built by a Board Certified PMHNP.",
  alternates: {
    canonical: "https://aiforj.com/techniques",
  },
  openGraph: {
    title: "Evidence-Based Mental Health Techniques | AIForj",
    description:
      "15 interactive, clinician-built techniques for anxiety, stress, depression, and more. Free. Private. Science-backed.",
    url: "https://aiforj.com/techniques",
    siteName: "AIForj",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Evidence-Based Mental Health Techniques | AIForj",
    description:
      "15 interactive, clinician-built techniques for anxiety, stress, depression, and more. Free. Private.",
  },
};

export default function TechniquesPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#14263A",
        color: "#D8E8F0",
        fontFamily: "'IBM Plex Sans', sans-serif",
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
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              marginBottom: 32,
            }}
          >
            <img
              src="/aif.jpeg"
              alt="AIForj"
              width={36}
              height={36}
              style={{ borderRadius: "50%" }}
            />
            <span
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 18,
                fontWeight: 600,
                color: "#D8E8F0",
                letterSpacing: -0.5,
              }}
            >
              AIForj
            </span>
          </Link>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(28px, 5vw, 42px)",
              fontWeight: 400,
              color: "#D8E8F0",
              margin: "0 0 16px",
              lineHeight: 1.2,
            }}
          >
            Technique Library
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "rgba(216,232,240,0.6)",
              maxWidth: 560,
              margin: "0 auto",
              lineHeight: 1.6,
              fontWeight: 300,
            }}
          >
            15 evidence-based techniques you can do right now. Each one is
            interactive — not just reading, but doing. Built by a Board
            Certified PMHNP.
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
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(107,127,110,0.12)",
                borderRadius: 16,
                textDecoration: "none",
                transition: "all 0.25s ease",
                cursor: "pointer",
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
                    background: "rgba(107,127,110,0.15)",
                    borderRadius: 8,
                    color: "#6B7F6E",
                    fontWeight: 600,
                    letterSpacing: 0.5,
                  }}
                >
                  {t.modality}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "rgba(216,232,240,0.4)",
                  }}
                >
                  {t.time}
                </span>
              </div>
              <h2
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 17,
                  fontWeight: 500,
                  color: "#D8E8F0",
                  margin: "0 0 8px",
                  lineHeight: 1.3,
                }}
              >
                {t.title.split(":")[0]}
              </h2>
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(216,232,240,0.5)",
                  margin: 0,
                  lineHeight: 1.5,
                  fontWeight: 300,
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
                  color: "#6B7F6E",
                  fontWeight: 500,
                }}
              >
                Try it now →
              </span>
            </Link>
          ))}
        </div>

        <footer
          style={{
            textAlign: "center",
            marginTop: 64,
            paddingTop: 32,
            borderTop: "1px solid rgba(107,127,110,0.1)",
          }}
        >
          <p
            style={{
              fontSize: 12,
              color: "rgba(216,232,240,0.35)",
              lineHeight: 1.8,
            }}
          >
            If you're in crisis:{" "}
            <strong style={{ color: "rgba(216,232,240,0.5)" }}>
              988 Lifeline
            </strong>{" "}
            — call or text 988 |{" "}
            <strong style={{ color: "rgba(216,232,240,0.5)" }}>
              Crisis Text Line
            </strong>{" "}
            — text HOME to 741741
          </p>
          <p
            style={{
              fontSize: 11,
              color: "rgba(216,232,240,0.2)",
              marginTop: 12,
            }}
          >
            AIForj is a wellness companion — not a therapist or substitute for
            professional care.
            <br />
            Built by a Board Certified PMHNP-BC — Caring for the Whole Human
            <br />© 2026 AIForj.com
          </p>
        </footer>
      </div>
    </main>
  );
}
