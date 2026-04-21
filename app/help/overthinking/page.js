import BiophilicBackground from "../../components/BiophilicBackground";
import SOS from "../../components/SOS";
import EmailCapture from "../../components/EmailCapture";
import HelpPageEnhancements from "../../components/HelpPageEnhancements";
import SiteFooter from "../../components/SiteFooter";
import AuthorByline from "../../../components/AuthorByline";
import Link from "next/link";
import { buildContentPageMetadata } from "../../../lib/pageMetadata";

export const metadata = buildContentPageMetadata({
  title: "Stop Overthinking: Break the Loop in 3 Minutes | Healthcare Professional Tool",
  description: "Stuck in an overthinking spiral? Practical steps to interrupt rumination and regain focus in minutes.",
  path: "/help/overthinking",
  kind: "help",
  slug: "overthinking",
});

export default function Page() {
  const faq = [
    { q: "Why do I keep replaying the same thoughts?", a: "Rumination is a loop where attention keeps returning to the same content; behavioral shifts and refocusing reduce the loop." },
    { q: "How quickly can I break overthinking?", a: "Often within minutes using grounding, thought-defusion, and active refocusing; practice improves speed." },
  ];

  return (
    <>
      <BiophilicBackground />
      <SOS />

      <main style={{ maxWidth: 780, margin: "84px auto 40px", padding: "0 20px" }}>
        <article>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28 }}>Stuck in an Overthinking Spiral?</h1>
          <AuthorByline />
          <p>Overthinking keeps you locked on what-ifs and replayed scenes. It feels like mental noise that won't stop. That experience is common and there are practical ways to interrupt it.</p>
          <p>Small shifts in attention and simple behavioral steps weaken the habit over time.</p>

          <h2>Here's what's happening</h2>
          <p>Repeated negative thinking recruits memory and attention systems, creating persistent loops. Interrupting the attention pattern disengages the loop and restores cognitive flexibility.</p>

          <h2>What helps</h2>
          <ul>
            <li><Link href="/techniques/thought-defusion">Thought Defusion</Link> — externalize and observe thoughts</li>
            <li><Link href="/techniques/cognitive-restructuring">Cognitive Restructuring</Link> — challenge unhelpful thinking</li>
            <li><Link href="/techniques/worry-time">Worry Time</Link> — schedule worry to reduce daytime rumination</li>
          </ul>

          <h2>Go deeper</h2>
          <p>Use the <Link href="/blueprint">Blueprint</Link> to build a personalized anti-rumination routine or the <Link href="/send">voice companion</Link> for a guided interruption.</p>

          <HelpPageEnhancements
            title="Stuck in an Overthinking Spiral?"
            description={metadata.description}
            url="https://aiforj.com/help/overthinking"
            about="Rumination and overthinking"
            faq={faq}
          />

          <EmailCapture />
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
