import BiophilicBackground from "../../components/BiophilicBackground";
import SOS from "../../components/SOS";
import EmailCapture from "../../components/EmailCapture";
import HelpPageEnhancements from "../../components/HelpPageEnhancements";
import SiteFooter from "../../components/SiteFooter";
import AuthorByline from "../../../components/AuthorByline";
import WorkbookCrossSell from "../../../components/WorkbookCrossSell.jsx";
import Link from "next/link";
import { buildContentPageMetadata } from "../../../lib/pageMetadata";

export const metadata = buildContentPageMetadata({
  title: "After an Argument: Calm Down Techniques | AIForj",
  description: "Just had a big argument? Evidence-informed steps to calm your body and process emotions safely.",
  path: "/help/after-argument",
  kind: "help",
  slug: "after-argument",
});

export default function Page() {
  const faq = [
    { q: "How long will the upset last?", a: "Emotional arousal can last minutes to hours; active calming and reflection shorten the peak and aid repair." },
    { q: "When should I reach out after a fight?", a: "Wait until you're calmer and can communicate clearly; use grounding first if you're still reactive." },
  ];

  return (
    <>
      <BiophilicBackground />
      <SOS />

      <main style={{ maxWidth: 780, margin: "84px auto 40px", padding: "0 20px" }}>
        <article>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28 }}>Just Had a Big Argument? Here's What to Do Next</h1>
          <AuthorByline />
          <p>Right after an argument your body is still in alarm mode — you might feel hot, shaky, or emotionally flooded. Those sensations make it hard to think clearly or reconcile the relationship immediately.</p>
          <p>It's okay to step back and use short practices to calm your nervous system before responding or reconnecting.</p>

          <h2>Here's what's happening</h2>
          <p>Conflict activates fight/flight responses and emotional memory networks. Calming the body first reduces reactive language and supports repair-focused communication later.</p>

          <h2>What helps</h2>
          <ul>
            <li><Link href="/techniques/self-compassion-break">Self-Compassion Break</Link> — soothe harsh self-talk</li>
            <li><Link href="/techniques/radical-acceptance">Radical Acceptance</Link> — lower emotional resistance</li>
            <li><Link href="/techniques/cognitive-restructuring">Cognitive Restructuring</Link> — reframe unhelpful thoughts</li>
          </ul>

          <WorkbookCrossSell slug="after-argument" />

          <h2>Go deeper</h2>
          <p>Take the <Link href="/blueprint">Blueprint</Link> to learn your reactivity pattern, or use the <Link href="/send">voice companion</Link> for a guided cool-down.</p>

          <HelpPageEnhancements
            title="Just Had a Big Argument? Here's What to Do Next"
            description={metadata.description}
            url="https://aiforj.com/help/after-argument"
            about="Emotional dysregulation after conflict"
            faq={faq}
          />

          <EmailCapture />
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
