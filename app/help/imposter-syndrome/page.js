import BiophilicBackground from "../../components/BiophilicBackground";
import SOS from "../../components/SOS";
import EmailCapture from "../../components/EmailCapture";
import HelpPageEnhancements from "../../components/HelpPageEnhancements";
import SiteFooter from "../../components/SiteFooter";
import Link from "next/link";
import { buildContentPageMetadata } from "../../../lib/pageMetadata";

export const metadata = buildContentPageMetadata({
  title: "Imposter Syndrome Help: When Success Still Feels Fake | AIForj",
  description:
    "Feeling like a fraud even when the evidence says otherwise? Evidence-informed steps to challenge imposter syndrome without fake confidence.",
  path: "/help/imposter-syndrome",
  kind: "help",
  slug: "imposter-syndrome",
});

export default function Page() {
  const faq = [
    {
      q: "Is imposter syndrome a diagnosis?",
      a: "No. It is a common pattern of thinking where you cannot internalize evidence of your own competence, even when it is right in front of you.",
    },
    {
      q: "What helps when praise just bounces off me?",
      a: "A structured evidence review helps more than trying to force positive thinking. The key is accuracy, not hype: what did you actually do, earn, or learn?",
    },
  ];

  return (
    <>
      <BiophilicBackground />
      <SOS />

      <main style={{ maxWidth: 780, margin: "84px auto 40px", padding: "0 20px" }}>
        <article>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28 }}>
            Feeling Like a Fraud Even When You Have Proof?
          </h1>
          <p>
            Imposter syndrome makes success feel slippery. You get the role, the praise, the opportunity, and your mind still reaches for luck, mistake, or eventual exposure.
          </p>
          <p>
            Relief usually does not come from trying to “just believe in yourself.” It comes from slowing down enough to identify the distortion and look at your actual evidence without minimizing it.
          </p>

          <h2>Here's what's happening</h2>
          <p>
            Imposter thoughts tend to discount positives, over-weight mistakes, and compare your internal uncertainty to other people's visible confidence. The result is a mismatch between what the evidence shows and what your nervous system believes.
          </p>

          <h2>What helps first</h2>
          <ul>
            <li>
              <Link href="/techniques/imposter-syndrome">Imposter Syndrome protocol</Link> — a guided evidence review for fraud thoughts
            </li>
            <li>
              <Link href="/techniques/cognitive-restructuring">Cognitive Restructuring</Link> — challenge the thought with a more accurate frame
            </li>
            <li>
              <Link href="/techniques/self-compassion-break">Self-Compassion Break</Link> — lower the shame that keeps the story sticky
            </li>
          </ul>

          <h2>Go deeper</h2>
          <p>
            If self-doubt is starting to shape your choices, take the <Link href="/blueprint">Blueprint</Link> to see what emotional pattern is feeding it, or use <Link href="/companion">Talk to Forj</Link> to work through the thought in real time.
          </p>

          <HelpPageEnhancements
            title="Feeling Like a Fraud Even When You Have Proof?"
            description={metadata.description}
            url="https://aiforj.com/help/imposter-syndrome"
            about="Imposter syndrome and self-doubt"
            faq={faq}
          />

          <EmailCapture />
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
