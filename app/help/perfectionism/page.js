import BiophilicBackground from "../../components/BiophilicBackground";
import SOS from "../../components/SOS";
import EmailCapture from "../../components/EmailCapture";
import HelpPageEnhancements from "../../components/HelpPageEnhancements";
import SiteFooter from "../../components/SiteFooter";
import Link from "next/link";
import { buildContentPageMetadata } from "../../../lib/pageMetadata";

export const metadata = buildContentPageMetadata({
  title: "Perfectionism Help: When Nothing Ever Feels Good Enough | AIForj",
  description:
    "Trapped by impossible standards? Evidence-informed steps to work through perfectionism, all-or-nothing thinking, and the fear of imperfect action.",
  path: "/help/perfectionism",
  kind: "help",
  slug: "perfectionism",
});

export default function Page() {
  const faq = [
    {
      q: "Is perfectionism the same thing as having high standards?",
      a: "No. High standards can be flexible and motivating. Perfectionism is rigid and punishing, and it often stops you from finishing or enjoying anything.",
    },
    {
      q: "Won't easing up make me less successful?",
      a: "Usually the opposite. Good enough work can be completed, improved, and repeated. Perfectionism often burns energy on fear, delay, and endless tweaking.",
    },
  ];

  return (
    <>
      <BiophilicBackground />
      <SOS />

      <main style={{ maxWidth: 780, margin: "84px auto 40px", padding: "0 20px" }}>
        <article>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28 }}>
            Nothing Ever Feels Good Enough?
          </h1>
          <p>
            Perfectionism can look impressive from the outside, but inside it often feels like pressure, delay, and never quite arriving. You keep raising the standard while your nervous system keeps treating anything less than flawless as failure.
          </p>
          <p>
            The way out is not abandoning care. It is learning to recognize when the standard has stopped helping and started controlling you.
          </p>

          <h2>Here's what's happening</h2>
          <p>
            Perfectionism is usually driven by all-or-nothing thinking, harsh self-evaluation, and fear of mistakes. That makes starting harder, finishing harder, and resting almost impossible because the finish line keeps moving.
          </p>

          <h2>What helps first</h2>
          <ul>
            <li>
              <Link href="/techniques/perfectionism">Perfectionism protocol</Link> — a guided exercise for impossible standards
            </li>
            <li>
              <Link href="/techniques/cognitive-distortions">Cognitive Distortions</Link> — identify the all-or-nothing frame underneath the pressure
            </li>
            <li>
              <Link href="/techniques/self-compassion-break">Self-Compassion Break</Link> — soften the self-attack that perfectionism feeds on
            </li>
          </ul>

          <h2>Go deeper</h2>
          <p>
            If perfectionism is linked to work stress, self-worth, or constant indecision, take the <Link href="/blueprint">Blueprint</Link> for a more complete map, or open <Link href="/companion">Talk to Forj</Link> when you need help finding the middle instead of another impossible bar.
          </p>

          <HelpPageEnhancements
            title="Nothing Ever Feels Good Enough?"
            description={metadata.description}
            url="https://aiforj.com/help/perfectionism"
            about="Perfectionism and all-or-nothing thinking"
            faq={faq}
          />

          <EmailCapture />
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
