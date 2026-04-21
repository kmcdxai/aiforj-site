import Link from "next/link";
import BiophilicBackground from "../../components/BiophilicBackground";
import SiteFooter from "../../components/SiteFooter";
import AnalyticsBeacon from "../../../components/AnalyticsBeacon";
import { founderAuthor, founderKnowsAbout } from "../../../lib/schemas/founder";

const founderPerson = {
  "@context": "https://schema.org",
  ...founderAuthor,
};

export const metadata = {
  title: "About the founder — AIForj",
  description:
    "Meet Kevin, the licensed clinician and psychiatric nurse practitioner candidate building AIForj.",
  alternates: {
    canonical: "https://aiforj.com/about/founder",
  },
  openGraph: {
    title: "About the founder — AIForj",
    description:
      "Built by a licensed clinician and psychiatric nurse practitioner candidate and clinically grounded in evidence-based emotional first-aid tools.",
    url: "https://aiforj.com/about/founder",
    siteName: "AIForj",
    type: "profile",
    images: [{ url: "/founder-avatar.svg", width: 320, height: 320, alt: "Founder avatar" }],
  },
};

function SectionCard({ children, style }) {
  return (
    <section
      style={{
        background: "var(--surface-elevated)",
        border: "1px solid var(--border)",
        borderRadius: 28,
        boxShadow: "var(--shadow-md)",
        padding: "clamp(24px, 4vw, 38px)",
        ...style,
      }}
    >
      {children}
    </section>
  );
}

export default function FounderPage() {
  return (
    <>
      <AnalyticsBeacon event="about_founder_view" />
      <BiophilicBackground />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(founderPerson) }}
      />

      <main style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)" }}>
        <section
          style={{
            padding: "112px 24px 64px",
            background: "linear-gradient(180deg, var(--parchment-deep), var(--parchment))",
          }}
        >
          <div
            style={{
              maxWidth: 1080,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.1fr) minmax(220px, 0.55fr)",
              gap: 34,
              alignItems: "center",
            }}
            className="founder-hero-grid"
          >
            <div>
              <p className="text-label" style={{ color: "var(--sage-deep)", margin: "0 0 14px" }}>
                AIForj clinical foundation
              </p>
              <h1 style={{ margin: "0 0 14px", fontSize: "clamp(38px, 6vw, 68px)", letterSpacing: -0.5 }}>
                About the founder
              </h1>
              <p
                style={{
                  margin: "0 0 24px",
                  fontFamily: "'Fraunces', serif",
                  fontSize: "clamp(22px, 3vw, 34px)",
                  lineHeight: 1.25,
                  color: "var(--text-secondary)",
                }}
              >
                Built by a licensed clinician and psychiatric nurse practitioner candidate
              </p>
              <p style={{ margin: 0, maxWidth: 680, color: "var(--text-secondary)", lineHeight: 1.8, fontSize: 17 }}>
                AIForj is designed to make the first minute of emotional support more private, more specific, and more clinically grounded without pretending to replace real care.
              </p>
            </div>
            <div style={{ justifySelf: "center" }}>
              <img
                src="/founder-avatar.svg"
                alt="Geometric founder avatar for Kevin"
                style={{
                  width: "min(260px, 62vw)",
                  height: "auto",
                  borderRadius: "50%",
                  boxShadow: "var(--shadow-lg)",
                  border: "8px solid rgba(255,255,255,0.62)",
                  background: "var(--surface)",
                }}
              />
            </div>
          </div>
        </section>

        <section style={{ padding: "64px 24px", maxWidth: 1080, margin: "0 auto", display: "grid", gap: 24 }}>
          <SectionCard>
            <h2 style={{ margin: "0 0 18px" }}>Hi, I&apos;m Kevin.</h2>
            <div style={{ display: "grid", gap: 16, color: "var(--text-secondary)", lineHeight: 1.85, fontSize: 16 }}>
              <p style={{ margin: 0 }}>
                Licensed clinician and psychiatric nurse practitioner candidate, currently completing training and on track to graduate in March 2027.
              </p>
              <p style={{ margin: 0 }}>
                I am clinically trained in 16+ evidence-based modalities: CBT, DBT, ACT, IFS, polyvagal theory, somatic experiencing, CFT, narrative therapy, motivational interviewing, behavioral activation, schema therapy, trauma-informed care, mindfulness-based approaches, emotion-focused therapy, attachment-based work, and solution-focused brief therapy.
              </p>
              <p style={{ margin: 0 }}>
                I built AIForj because waitlists and copays should not stand between someone and the first 60 seconds of help. The interventions in AIForj are matched to specific emotional states based on the modalities with the strongest evidence for that state, not a universal technique applied everywhere.
              </p>
              <p style={{ margin: 0 }}>
                I am building this in the open. If you&apos;re a clinician with feedback, I want it. Email{" "}
                <a href="mailto:founder@aiforj.com" style={{ color: "var(--interactive)", fontWeight: 700 }}>
                  founder@aiforj.com
                </a>.
              </p>
            </div>
          </SectionCard>

          <SectionCard style={{ background: "linear-gradient(135deg, var(--sage-light), var(--surface-elevated))" }}>
            <h2 style={{ margin: "0 0 14px" }}>Why a candidate, not a board-certified NP?</h2>
            <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.85, fontSize: 16 }}>
              AIForj is informed by clinical training, not a substitute for it. The tools in this app are evidence-based interventions any well-trained clinician would recognize. I am completing PMHNP training and will sit for board certification in 2027. Until then, AIForj does not diagnose, treat, or replace professional care — and I&apos;d rather be transparent about where I am in training than overclaim a credential I haven&apos;t earned yet.
            </p>
          </SectionCard>

          <SectionCard>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 18, flexWrap: "wrap", alignItems: "end", marginBottom: 22 }}>
              <div>
                <p className="text-label" style={{ margin: "0 0 8px", color: "var(--sage-deep)" }}>
                  Clinical training
                </p>
                <h2 style={{ margin: 0 }}>16 evidence-based modalities</h2>
              </div>
              <span className="tag tag-cbt">Clinically trained in CBT, DBT, ACT, IFS + more</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 10 }}>
              {founderKnowsAbout.map((modality) => (
                <div
                  key={modality}
                  style={{
                    padding: "13px 14px",
                    borderRadius: 16,
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    color: "var(--text-secondary)",
                    fontWeight: 700,
                  }}
                >
                  {modality}
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard style={{ borderColor: "rgba(184,134,11,0.24)" }}>
            <h2 style={{ margin: "0 0 12px" }}>Safety note</h2>
            <p style={{ margin: "0 0 18px", color: "var(--text-secondary)", lineHeight: 1.8 }}>
              AIForj is a wellness companion, not a substitute for professional care. If you are in immediate danger or might hurt yourself, call emergency services now. In the U.S., call or text 988 for the Suicide and Crisis Lifeline.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="https://988lifeline.org" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textDecoration: "none" }}>
                988 Lifeline
              </a>
              <Link href="/find-help" className="btn-secondary" style={{ textDecoration: "none", color: "var(--sage-deep)" }}>
                Find a Provider
              </Link>
            </div>
          </SectionCard>
        </section>

        <style>{`
          @media (max-width: 820px) {
            .founder-hero-grid {
              grid-template-columns: 1fr !important;
              text-align: center;
            }
          }
        `}</style>
      </main>

      <SiteFooter />
    </>
  );
}
