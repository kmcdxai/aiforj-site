import BiophilicBackground from "../../components/BiophilicBackground";
import SOS from "../../components/SOS";
import EmailCapture from "../../components/EmailCapture";
import HelpPageEnhancements from "../../components/HelpPageEnhancements";
import SiteFooter from "../../components/SiteFooter";
import AuthorByline from "../../../components/AuthorByline";
import LeadMagnetCapture from "../../../components/LeadMagnetCapture.jsx";
import Link from "next/link";
import { buildContentPageMetadata } from "../../../lib/pageMetadata";

export const metadata = buildContentPageMetadata({
  title: "Panic Attack Help: Instant Free Techniques | Healthcare Professional-Designed",
  description: "Having a panic attack right now? Quick, clinician-designed steps to calm your body and mind — free and private.",
  path: "/help/panic-attack",
  kind: "help",
  slug: "panic-attack",
});

export default function Page() {
  const faq = [
    { q: "What should I do during a panic attack?", a: "Use grounding, paced breathing, and simple muscle relaxation to shift your nervous system. If you're in danger, call emergency services." },
    { q: "Will these techniques stop a panic attack every time?", a: "They often reduce intensity; repetition and practice increase effectiveness. If panic is frequent, seek professional care." },
  ];

  return (
    <>
      <BiophilicBackground />
      <SOS />

      <main style={{ maxWidth: 780, margin: "84px auto 40px", padding: "0 20px" }}>
        <article>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28 }}>Having a Panic Attack Right Now?</h1>
          <AuthorByline />
          <p style={{ color: "rgba(45,42,38,0.8)" }}>This feels overwhelming and real — your body is responding as if there's urgent danger. That flood of sensations is terrifying, but there are short, reliable steps that calm the body and help the thinking part of your brain come back online.</p>
          <p style={{ color: "rgba(45,42,38,0.75)" }}>You're not broken for feeling this. Panic is an intense alarm response; many people learn to interrupt it quickly with simple, repeated practices.</p>

          <h2 style={{ marginTop: 20 }}>Here's what's happening</h2>
          <p style={{ color: "rgba(45,42,38,0.75)" }}>A rapid stress response releases adrenaline and activates breathing and heart rate. That loop feeds itself — fast breathing makes the body feel worse, which heightens fear. Gentle behavioral steps interrupt the loop.</p>

          <h2 style={{ marginTop: 20 }}>What helps</h2>
          <ul>
            <li><Link href="/techniques/physiological-sigh">Physiological Sigh</Link> — immediate breath reset</li>
            <li><Link href="/techniques/box-breathing">Box Breathing</Link> — paced breathing you can do anywhere</li>
            <li><Link href="/techniques/tipp-skill">TIPP Sequence</Link> — quick body-focused grounding for higher distress</li>
          </ul>

          <LeadMagnetCapture
            title="“10 evidence-framed panic interrupts” — by Kevin, psychiatric NP candidate"
            description="Get the quick-reference panic interrupt guide by email, then try a guided intervention when you are ready."
            source="panic_lead_magnet"
            pdfPath="/lead-magnets/panic-interrupts.pdf"
          />

          <h2 style={{ marginTop: 20 }}>Go deeper</h2>
          <p>Take the <Link href="/blueprint">2-minute Blueprint</Link> to see which patterns fit you, or use the <Link href="/send">voice companion</Link> to guide you through a calm practice.</p>

          <HelpPageEnhancements
            title="Having a Panic Attack Right Now?"
            description={metadata.description}
            url="https://aiforj.com/help/panic-attack"
            about="Panic attack"
            faq={faq}
          />

          <EmailCapture />
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
