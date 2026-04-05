import BiophilicBackground from "../../components/BiophilicBackground";
import SOS from "../../components/SOS";
import EmailCapture from "../../components/EmailCapture";
import SiteFooter from "../../components/SiteFooter";
import Link from "next/link";

export const metadata = {
  title: "Burnout Recovery: Evidence-Based Protocol by a Psych NP",
  description: "Feeling burned out and can't recover? Practical, evidence-based steps to begin recovering energy and motivation.",
  alternates: { canonical: "https://aiforj.com/help/burnout-recovery" },
};

export default function Page() {
  const faq = [
    { q: "Is burnout the same as depression?", a: "They overlap but are distinct. Burnout is work-related exhaustion and cynicism; persistent depression needs clinical evaluation." },
    { q: "How quickly can I recover from burnout?", a: "Recovery varies; small consistent changes and boundary setting often produce gradual improvements over weeks to months." },
  ];

  return (
    <>
      <BiophilicBackground />
      <SOS />

      <main style={{ maxWidth: 780, margin: "84px auto 40px", padding: "0 20px" }}>
        <article>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28 }}>Burned Out and Can't Recover? Start Here.</h1>
          <p>Burnout is a state of chronic workplace stress. It can feel like exhaustion, detachment, and reduced capacity. Recovery takes structured rest, boundary-setting, and small behavioral steps.</p>
          <p>You're not alone — begin with manageable changes that protect your energy and rebuild resilience.</p>

          <h2>Here's what's happening</h2>
          <p>Prolonged stress alters motivation and reward systems. Reintroducing pleasurable, low-effort activities and repairing sleep and routines helps restore balance.</p>

          <h2>What helps</h2>
          <ul>
            <li><Link href="/techniques/behavioral-activation">Behavioral Activation</Link> — rebuild meaningful activity</li>
            <li><Link href="/techniques/values-clarification">Values Clarification</Link> — align actions with what matters</li>
            <li><Link href="/techniques/progressive-muscle-relaxation">Progressive Muscle Relaxation</Link> — reduce chronic tension</li>
          </ul>

          <h2>Go deeper</h2>
          <p>Start the <Link href="/blueprint">Blueprint</Link> to get a personalized recovery plan, or use the <Link href="/send">voice companion</Link> for structured micro-steps.</p>

          <EmailCapture />
        </article>
      </main>

      <SiteFooter />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "MedicalWebPage",
        "mainEntity": { "@type": "MedicalCondition", "name": "Burnout" },
        "description": "Evidence-based steps to begin recovering from burnout.",
      }) }} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faq.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }))
      }) }} />
    </>
  );
}
