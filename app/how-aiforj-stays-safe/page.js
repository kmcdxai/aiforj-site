import Link from "next/link";
import BiophilicBackground from "../components/BiophilicBackground";
import EvidenceDrawer from "../components/EvidenceDrawer";
import SiteFooter from "../components/SiteFooter";
import SOS from "../components/SOS";
import { getPageEvidence } from "../../data/evidence";
import { buildContentPageMetadata } from "../../lib/pageMetadata";

export const metadata = buildContentPageMetadata({
  title: "How AIForj Stays Safe | Scope, Privacy, and Crisis Boundaries",
  description:
    "How AIForj handles privacy, safety boundaries, crisis escalation, and scope of use for guided emotional first aid.",
  path: "/how-aiforj-stays-safe",
  socialTitle: "How AIForj Stays Safe",
});

export default function Page() {
  const pageEvidence = getPageEvidence("how-aiforj-stays-safe");

  return (
    <>
      <BiophilicBackground />
      <SOS />

      <main style={{ maxWidth: 820, margin: "84px auto 40px", padding: "0 20px" }}>
        <article>
          <p
            style={{
              fontSize: 12,
              letterSpacing: 2.4,
              textTransform: "uppercase",
              color: "var(--accent-sage)",
              fontWeight: 700,
              marginBottom: 14,
            }}
          >
            Safety and Scope
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
            How AIForj stays safe
          </h1>

          <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--text-secondary)", marginBottom: 16 }}>
            AIForj is built for emotional first aid: short, guided tools that can help you slow down, orient, and take a useful next step. It is not designed to diagnose conditions, adjust medication, replace therapy, or manage crises on its own.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--text-secondary)", marginBottom: 28 }}>
            That product boundary is intentional. Mental-health-adjacent AI tools can become risky when they overstate their authority, ask for too much sensitive data, or keep people in open-ended conversations that feel like care but are not accountable care.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--text-secondary)", marginBottom: 28 }}>
            For the plain-English version of AIForj’s data promises, including the anonymous metrics opt-in, read{" "}
            <Link href="/what-we-collect">What AIForj collects and what it never collects</Link>.
          </p>

          <section
            style={{
              padding: "22px 20px",
              borderRadius: 18,
              background: "rgba(107,127,110,0.06)",
              border: "1px solid rgba(107,127,110,0.12)",
              marginBottom: 28,
            }}
          >
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, margin: "0 0 12px", color: "var(--text-primary)" }}>
              What AIForj is for
            </h2>
            <ul style={{ margin: 0, paddingLeft: 18, color: "var(--text-secondary)", lineHeight: 1.8 }}>
              <li>Short self-guided tools for anxiety, overwhelm, grief, shame, burnout, and similar states</li>
              <li>Matching you to structured interventions in under a minute</li>
              <li>Helping you calm down, externalize thoughts, and choose a next step</li>
              <li>Pointing you toward crisis resources or human care when the need is bigger than a self-guided tool</li>
            </ul>
          </section>

          <section
            style={{
              padding: "22px 20px",
              borderRadius: 18,
              background: "rgba(255,255,255,0.55)",
              border: "1px solid rgba(45,42,38,0.08)",
              marginBottom: 28,
            }}
          >
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, margin: "0 0 12px", color: "var(--text-primary)" }}>
              What AIForj is not for
            </h2>
            <ul style={{ margin: 0, paddingLeft: 18, color: "var(--text-secondary)", lineHeight: 1.8 }}>
              <li>Diagnosing depression, bipolar disorder, PTSD, ADHD, or any other condition</li>
              <li>Telling you to start, stop, or change medication</li>
              <li>Replacing a therapist, psychiatrist, or emergency resource</li>
              <li>Handling imminent self-harm risk or other crises without a human handoff</li>
            </ul>
          </section>

          <section
            style={{
              display: "grid",
              gap: 18,
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              marginBottom: 28,
            }}
          >
            <div
              style={{
                padding: 20,
                borderRadius: 18,
                background: "rgba(255,255,255,0.55)",
                border: "1px solid rgba(45,42,38,0.08)",
              }}
            >
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, margin: "0 0 10px" }}>
                Local-first privacy
              </h3>
              <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Core tools are designed so that your entries stay on your device whenever possible. AIForj avoids building the product around surveillance advertising or unnecessary account walls.
              </p>
            </div>

            <div
              style={{
                padding: 20,
                borderRadius: 18,
                background: "rgba(255,255,255,0.55)",
                border: "1px solid rgba(45,42,38,0.08)",
              }}
            >
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, margin: "0 0 10px" }}>
                Structured over open-ended
              </h3>
              <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.75 }}>
                The product leans on short, bounded tools and guided flows instead of pretending to be an infinitely capable therapist in your pocket.
              </p>
            </div>

            <div
              style={{
                padding: 20,
                borderRadius: 18,
                background: "rgba(255,255,255,0.55)",
                border: "1px solid rgba(45,42,38,0.08)",
              }}
            >
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, margin: "0 0 10px" }}>
                Clear crisis handoff
              </h3>
              <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.75 }}>
                If you are in danger, feel unable to stay safe, or need immediate human support, AIForj should give way to 988, emergency services, or a licensed clinician.
              </p>
            </div>
          </section>

          <section
            style={{
              padding: "22px 20px",
              borderRadius: 18,
              background: "var(--accent-warm-light)",
              border: "1px solid rgba(196,149,106,0.16)",
              marginBottom: 28,
            }}
          >
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, margin: "0 0 12px", color: "var(--text-primary)" }}>
              When to get human help instead of staying with the app
            </h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 10 }}>
              Reach for human support now if you are worried you might hurt yourself, cannot keep yourself safe, are hearing or seeing things other people are not, need medication guidance, or your symptoms are disrupting eating, sleeping, work, school, or relationships in a sustained way.
            </p>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 0 }}>
              If you need non-crisis care, AIForj’s <Link href="/find-help">Find a Provider</Link> page is the right next step.
            </p>
          </section>

          <section
            style={{
              padding: "20px 18px",
              borderRadius: 18,
              background: "rgba(181,76,76,0.07)",
              border: "1px solid rgba(181,76,76,0.16)",
              marginBottom: 28,
            }}
          >
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, margin: "0 0 10px", color: "var(--text-primary)" }}>
              Crisis support
            </h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 8 }}>
              In the United States, call or text <strong style={{ color: "var(--crisis)" }}>988</strong>. You can also text <strong style={{ color: "var(--crisis)" }}>HOME</strong> to <strong style={{ color: "var(--crisis)" }}>741741</strong>.
            </p>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 0 }}>
              If there is immediate danger, call emergency services now.
            </p>
          </section>

          <EvidenceDrawer evidence={pageEvidence} />
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
