import BiophilicBackground from "../../components/BiophilicBackground";
import SOS from "../../components/SOS";
import EmailCapture from "../../components/EmailCapture";
import HelpPageEnhancements from "../../components/HelpPageEnhancements";
import SiteFooter from "../../components/SiteFooter";
import AuthorByline from "../../../components/AuthorByline";
import Link from "next/link";
import { buildContentPageMetadata } from "../../../lib/pageMetadata";

export const metadata = buildContentPageMetadata({
  title: "Work Anxiety Relief: 2-Minute Desk Techniques | Free",
  description: "Feeling anxious at work? Short, discreet techniques you can do at your desk to calm your system and stay present.",
  path: "/help/anxiety-at-work",
  kind: "help",
  slug: "anxiety-at-work",
});

export default function Page() {
  const faq = [
    { q: "What can I do quickly at my desk?", a: "Paced breathing, grounding, and micro-breaks help. Small actions repeatedly applied reduce physiological arousal." },
    { q: "Will employers notice these techniques?", a: "Many techniques are subtle; choose paced breathing or grounding that you can do unobtrusively." },
  ];

  return (
    <>
      <BiophilicBackground />
      <SOS />

      <main style={{ maxWidth: 780, margin: "84px auto 40px", padding: "0 20px" }}>
        <article>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28 }}>Anxiety at Work: Quick Resets You Can Do at Your Desk</h1>
          <AuthorByline />
          <p>Work stress can trigger a body-first anxiety response — sweaty palms, fast heart, and a mind that races. These sensations are common and treatable with short resets you can do without leaving your seat.</p>
          <p>You deserve practical tools that fit into your day and protect your focus and confidence.</p>

          <h2>Here's what's happening</h2>
          <p>Perceived threat at work activates arousal systems; attentional narrowing and rumination reduce problem-solving capacity. Brief behavioral anchors widen attention and reduce arousal.</p>

          <h2>What helps</h2>
          <ul>
            <li><Link href="/techniques/box-breathing">Box Breathing</Link> — discrete paced breathing</li>
            <li><Link href="/techniques/54321-grounding">5-4-3-2-1 Grounding</Link> — quick sensory anchor</li>
            <li><Link href="/techniques/cognitive-restructuring">Cognitive Restructuring</Link> — fast thought reframing for situational anxiety</li>
          </ul>

          <h2>Go deeper</h2>
          <p>Explore your stress pattern with the <Link href="/blueprint">Blueprint</Link> or try the <Link href="/send">voice companion</Link> to walk you through a desk reset.</p>

          <HelpPageEnhancements
            title="Anxiety at Work: Quick Resets You Can Do at Your Desk"
            description={metadata.description}
            url="https://aiforj.com/help/anxiety-at-work"
            about="Work-related anxiety"
            faq={faq}
          />

          <EmailCapture />
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
