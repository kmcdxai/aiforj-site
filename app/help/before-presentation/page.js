import BiophilicBackground from "../../components/BiophilicBackground";
import SOS from "../../components/SOS";
import EmailCapture from "../../components/EmailCapture";
import HelpPageEnhancements from "../../components/HelpPageEnhancements";
import SiteFooter from "../../components/SiteFooter";
import Link from "next/link";
import { buildContentPageMetadata } from "../../../lib/pageMetadata";

export const metadata = buildContentPageMetadata({
  title: "Pre-Presentation Anxiety: 60-Second Calm Technique | Free",
  description: "Nervous before a presentation or interview? Quick, 60-second techniques to steady your nerves and improve performance.",
  path: "/help/before-presentation",
  kind: "help",
  slug: "before-presentation",
});

export default function Page() {
  const faq = [
    { q: "What can I do immediately before speaking?", a: "Brief paced breathing, grounding, and posture adjustments reduce physiological arousal and increase confidence." },
    { q: "Will breathing help my voice and memory?", a: "Yes — calmer breathing supports clearer voice and working memory during presentations." },
  ];

  return (
    <>
      <BiophilicBackground />
      <SOS />

      <main style={{ maxWidth: 780, margin: "84px auto 40px", padding: "0 20px" }}>
        <article>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28 }}>Nervous Before a Presentation or Interview?</h1>
          <p>Performance nerves are normal. A few steadying actions can lower your heart rate, clear your mind, and help you speak with more confidence.</p>
          <p>Practice makes habits — the same quick steps repeated before each event will become reliable cues for calm.</p>

          <h2>Here's what's happening</h2>
          <p>Anticipatory anxiety sends arousal signals that interfere with cognitive control. Resetting breath and posture helps shift the system back to regulated focus.</p>

          <h2>What helps</h2>
          <ul>
            <li><Link href="/techniques/box-breathing">Box Breathing</Link> — 60-second centering</li>
            <li><Link href="/techniques/vagal-toning">Vagal Toning</Link> — quick voice and breath regulation</li>
            <li><Link href="/techniques/physiological-sigh">Physiological Sigh</Link> — immediate breath reset</li>
          </ul>

          <h2>Go deeper</h2>
          <p>Build a pre-performance routine with the <Link href="/blueprint">Blueprint</Link> or use the <Link href="/send">voice companion</Link> for a spoken warm-up.</p>

          <HelpPageEnhancements
            title="Nervous Before a Presentation or Interview?"
            description={metadata.description}
            url="https://aiforj.com/help/before-presentation"
            about="Performance anxiety"
            faq={faq}
          />

          <EmailCapture />
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
