import BiophilicBackground from "../../components/BiophilicBackground";
import SOS from "../../components/SOS";
import EmailCapture from "../../components/EmailCapture";
import HelpPageEnhancements from "../../components/HelpPageEnhancements";
import SiteFooter from "../../components/SiteFooter";
import Link from "next/link";
import { buildContentPageMetadata } from "../../../lib/pageMetadata";

export const metadata = buildContentPageMetadata({
  title: "Comparison Trap: How to Stop Spiraling After Scrolling | AIForj",
  description:
    "Comparing your life to everyone else's online? Evidence-informed steps to interrupt the comparison spiral and come back to your own life.",
  path: "/help/comparison-trap",
  kind: "help",
  slug: "comparison-trap",
});

export default function Page() {
  const faq = [
    {
      q: "Is it normal to feel worse after scrolling?",
      a: "Yes. Social feeds compress other people's highlights into a stream that is easy to mistake for whole lives, which makes upward comparison much more likely.",
    },
    {
      q: "Do I have to quit social media completely?",
      a: "Not always. Some people do feel better after quitting, but many improve by muting triggers, changing who they follow, and using structured interruptions when the spiral starts.",
    },
  ];

  return (
    <>
      <BiophilicBackground />
      <SOS />

      <main style={{ maxWidth: 780, margin: "84px auto 40px", padding: "0 20px" }}>
        <article>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28 }}>
            Stuck in the Comparison Trap After Scrolling?
          </h1>
          <p>
            Comparison spirals rarely start with a plan. You open an app, see someone else's success, and suddenly your own life feels smaller, slower, or behind.
          </p>
          <p>
            The quickest relief usually comes from interrupting the feed, naming the comparison clearly, and shifting attention back toward something that actually belongs to your life.
          </p>

          <h2>Here's what's happening</h2>
          <p>
            Social comparison is a normal human tendency, but curated feeds intensify it. Your brain compares their visible highlights to your internal, unfinished, real life. That gap often lands as shame, envy, or inadequacy rather than useful perspective.
          </p>

          <h2>What helps first</h2>
          <ul>
            <li>
              <Link href="/techniques/comparison-trap">Comparison Trap protocol</Link> — a guided interruption for the after-scrolling spiral
            </li>
            <li>
              <Link href="/techniques/self-compassion-break">Self-Compassion Break</Link> — soften the self-attack that follows comparison
            </li>
            <li>
              <Link href="/techniques/cognitive-distortions">Cognitive Distortions</Link> — identify the thinking error driving the spiral
            </li>
          </ul>

          <h2>Go deeper</h2>
          <p>
            Use the <Link href="/blueprint">Blueprint</Link> if comparison is showing up across multiple parts of life, or open <Link href="/companion">Talk to Forj</Link> when you need help disentangling envy from what you actually want.
          </p>

          <HelpPageEnhancements
            title="Stuck in the Comparison Trap After Scrolling?"
            description={metadata.description}
            url="https://aiforj.com/help/comparison-trap"
            about="Social media comparison and envy"
            faq={faq}
          />

          <EmailCapture />
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
