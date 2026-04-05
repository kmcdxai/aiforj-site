import Navigation from "../../components/Navigation";
import BiophilicBackground from "../../components/BiophilicBackground";
import SOS from "../../components/SOS";
import EmailCapture from "../../components/EmailCapture";
import SiteFooter from "../../components/SiteFooter";
import Link from "next/link";

export const metadata = {
  title: "Grief Wave Support: Free Clinician-Designed Coping Tools",
  description: "Grief can arrive suddenly. Gentle, evidence-informed steps to ride the wave and care for yourself in the moment.",
  alternates: { canonical: "https://aiforj.com/help/grief" },
};

export default function Page() {
  const faq = [
    { q: "Is sudden grief normal?", a: "Yes — grief often comes in waves triggered by reminders. It's a normal, human response to loss and change." },
    { q: "When should I seek therapy for grief?", a: "If grief is persistent, disabling, or accompanied by self-harm thoughts, reach out for professional support." },
  ];

  return (
    <>
      <BiophilicBackground />
      <Navigation />
      <SOS />

      <main style={{ maxWidth: 780, margin: "84px auto 40px", padding: "0 20px" }}>
        <article>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28 }}>Grief Hit You Out of Nowhere?</h1>
          <p>Grief isn't only about funerals — it shows up for endings, disappointments, and changes. That flood of feeling is a deeply human response and it's okay to honor it gently.</p>
          <p>Small practices can reduce overwhelm and give you space to process.</p>

          <h2>Here's what's happening</h2>
          <p>Grief activates emotional memory and threat-detection systems, often producing physical sensations and intrusive thoughts. Slowing the body and naming emotions can reduce intensity.</p>

          <h2>What helps</h2>
          <ul>
            <li><Link href="/techniques/grief-wave">Grief Wave Practice</Link> — normalize the wave and ride it</li>
            <li><Link href="/techniques/self-compassion-break">Self-Compassion Break</Link> — soothe self-critical thoughts</li>
            <li><Link href="/techniques/behavioral-activation">Behavioral Activation</Link> — small, meaningful actions to reconnect</li>
          </ul>

          <h2>Go deeper</h2>
          <p>Try the <Link href="/blueprint">Blueprint</Link> for personalized coping strategies or the <Link href="/send">voice companion</Link> for a guided support script.</p>

          <EmailCapture />
        </article>
      </main>

      <SiteFooter />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "MedicalWebPage",
        "mainEntity": { "@type": "MedicalCondition", "name": "Grief" },
        "description": "Clinician-designed coping tools for sudden grief waves.",
      }) }} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faq.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }))
      }) }} />
    </>
  );
}
