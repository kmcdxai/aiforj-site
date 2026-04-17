import Link from "next/link";
import BiophilicBackground from "../components/BiophilicBackground";
import SiteFooter from "../components/SiteFooter";
import SOS from "../components/SOS";

export const metadata = {
  title: "Editorial Policy | AIForj",
  description:
    "How AIForj creates, reviews, updates, and scopes emotional first-aid content.",
  alternates: {
    canonical: "https://aiforj.com/editorial-policy",
  },
};

export default function Page() {
  return (
    <>
      <BiophilicBackground />
      <SOS />

      <main style={{ maxWidth: 820, margin: "84px auto 40px", padding: "0 20px" }}>
        <article>
          <p
            style={{
              fontSize: 12,
              letterSpacing: 2.2,
              textTransform: "uppercase",
              color: "var(--accent-sage)",
              fontWeight: 700,
              marginBottom: 14,
            }}
          >
            Editorial Policy
          </p>

          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "clamp(28px, 5vw, 42px)",
              lineHeight: 1.15,
              marginBottom: 18,
              color: "var(--text-primary)",
            }}
          >
            How AIForj creates and reviews content
          </h1>

          <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--text-secondary)", marginBottom: 16 }}>
            AIForj is built for emotional first aid: short, structured tools and explanatory content meant to help people slow down, orient, and take a useful next step. We aim for plain language, truthful clinical scope, and privacy-first design.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--text-secondary)", marginBottom: 28 }}>
            That means we do not write as if AIForj is a diagnosis engine, medication adviser, or replacement for licensed care. When a need crosses that line, pages should clearly route people toward crisis resources or human providers.
          </p>

          <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, marginBottom: 12 }}>Who writes and reviews AIForj content</h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 10 }}>
              AIForj content is authored by the <strong style={{ color: "var(--text-primary)" }}>AIForj Team</strong>.
            </p>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 0 }}>
              Clinical framing is reviewed by a <strong style={{ color: "var(--text-primary)" }}>Licensed Healthcare Provider</strong>. Review is focused on scope, safety, wording, and whether a claim is being stated more strongly than the evidence allows.
            </p>
          </section>

          <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, marginBottom: 12 }}>How we use evidence</h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 10 }}>
              We prefer primary or authoritative sources when a page makes a scientific or clinical claim. That usually means PubMed-indexed studies, systematic reviews, professional associations, and organizations like the WHO or FTC when scope or privacy claims are involved.
            </p>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 0 }}>
              When the evidence is indirect, mixed, or still evolving, we say so. We try to avoid brittle neuroscience copy, exact percentages without clear sourcing, and hype that overstates certainty.
            </p>
          </section>

          <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, marginBottom: 12 }}>How pages are updated</h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 10 }}>
              Help and technique pages include a visible last-reviewed date. We update pages when:
            </p>
            <ul style={{ color: "var(--text-secondary)", lineHeight: 1.8, paddingLeft: 20, margin: "0 0 10px" }}>
              <li>copy overclaims what the evidence can support</li>
              <li>safety boundaries need to be clearer</li>
              <li>links, tools, or routed next steps change</li>
              <li>new evidence meaningfully changes how a page should be framed</li>
            </ul>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 0 }}>
              We optimize for accuracy and usefulness over novelty.
            </p>
          </section>

          <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, marginBottom: 12 }}>Clinical scope and safety</h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 10 }}>
              AIForj does not diagnose conditions, tell people to change medication, or present itself as crisis care. Our product and content are designed to be narrow on purpose.
            </p>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 0 }}>
              For a fuller explanation of privacy, AI boundaries, and crisis handoff, read{" "}
              <Link href="/how-aiforj-stays-safe" style={{ color: "var(--interactive)", textDecoration: "underline" }}>
                How AIForj stays safe
              </Link>
              {" "}and{" "}
              <Link href="/what-we-collect" style={{ color: "var(--interactive)", textDecoration: "underline" }}>
                What AIForj collects
              </Link>
              .
            </p>
          </section>

          <section style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, marginBottom: 12 }}>Corrections and feedback</h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 0 }}>
              If a page feels misleading, unclear, or too strong for the evidence, that is a product issue, not a minor wording issue. AIForj should be corrected toward clearer scope and more reliable guidance.
            </p>
          </section>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
