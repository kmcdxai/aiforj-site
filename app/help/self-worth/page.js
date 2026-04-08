import BiophilicBackground from "../../components/BiophilicBackground";
import SOS from "../../components/SOS";
import EmailCapture from "../../components/EmailCapture";
import SiteFooter from "../../components/SiteFooter";
import Link from "next/link";

export const metadata = {
  title: "Build Self-Worth: Free Clinician-Designed Exercises",
  description: "Struggling with self-worth? Evidence-based exercises to begin rebuilding confidence and self-compassion.",
  alternates: { canonical: "https://aiforj.com/help/self-worth" },
};

export default function Page() {
  const faq = [
    { q: "Can exercises really change self-worth?", a: "Yes — repeated behavioral experiments and self-compassion practices change how you relate to yourself over time." },
    { q: "Where should I start if I feel deeply low?", a: "Begin with small, achievable actions and compassionate self-talk; seek professional support if low mood persists." },
  ];

  return (
    <>
      <BiophilicBackground />
      <SOS />

      <main style={{ maxWidth: 780, margin: "84px auto 40px", padding: "0 20px" }}>
        <article>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28 }}>Struggling With Self-Worth?</h1>
          <p>Low self-worth feels like a persistent inner critic telling you you're not enough. That voice is learned, and with structured practice you can loosen its hold and build a kinder, truer sense of self.</p>
          <p>Small, evidence-based exercises change belief and behavior over time.</p>

          <h2>Here's what's happening</h2>
          <p>Negative self-schemas bias attention and memory toward failures. Behavioral experiments and compassionate practices create new evidence that updates self-beliefs.</p>

          <h2>What helps</h2>
          <ul>
            <li><Link href="/techniques/self-compassion-break">Self-Compassion Break</Link> — start soothing the inner critic</li>
            <li><Link href="/techniques/values-clarification">Values Clarification</Link> — find actions that build meaning and competence</li>
            <li><Link href="/techniques/cognitive-restructuring">Cognitive Restructuring</Link> — test negative beliefs with evidence</li>
          </ul>

          <h2>Go deeper</h2>
          <p>Try the <Link href="/blueprint">Blueprint</Link> to map a confidence-building plan or use the <Link href="/send">voice companion</Link> for guided practice.</p>

          <EmailCapture />
        </article>
      </main>

      <SiteFooter />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "MedicalWebPage",
        "mainEntity": { "@type": "MedicalCondition", "name": "Low self-worth / low self-esteem" },
        "description": "Exercises to begin rebuilding self-worth using evidence-based practices.",
      }) }} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faq.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }))
      }) }} />
    </>
  );
}
