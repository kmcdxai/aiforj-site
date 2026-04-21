import BiophilicBackground from "../../components/BiophilicBackground";
import SOS from "../../components/SOS";
import EmailCapture from "../../components/EmailCapture";
import HelpPageEnhancements from "../../components/HelpPageEnhancements";
import SiteFooter from "../../components/SiteFooter";
import AuthorByline from "../../../components/AuthorByline";
import Link from "next/link";
import { buildContentPageMetadata } from "../../../lib/pageMetadata";

export const metadata = buildContentPageMetadata({
  title: "Loneliness Support: Evidence-Based Tools | Free & Private",
  description: "Feeling lonely even around people? Ways to cope, reconnect, and care for yourself that are private and evidence-based.",
  path: "/help/lonely",
  kind: "help",
  slug: "lonely",
});

export default function Page() {
  const faq = [
    { q: "Is feeling lonely a sign something is wrong?", a: "Loneliness is a common response to social mismatch; it's a signal to adjust connection strategies or self-care." },
    { q: "What if I don't have anyone to reach out to?", a: "Start with small, structured social steps and values-based activities; professional support can also help build connections." },
  ];

  return (
    <>
      <BiophilicBackground />
      <SOS />

      <main style={{ maxWidth: 780, margin: "84px auto 40px", padding: "0 20px" }}>
        <article>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28 }}>Feeling Lonely Even Around People?</h1>
          <AuthorByline />
          <p>Loneliness is the painful sense of social disconnection. It can happen even when surrounded by others. It's a real feeling that deserves care and practical steps.</p>
          <p>Small, consistent actions and values-aligned connections reduce loneliness over time.</p>

          <h2>Here's what's happening</h2>
          <p>Loneliness signals unmet social needs and often narrows attention toward negative social expectations. Behavioral activation and targeted social steps rebuild connection opportunities.</p>

          <h2>What helps</h2>
          <ul>
            <li><Link href="/techniques/behavioral-activation">Behavioral Activation</Link> — small social actions</li>
            <li><Link href="/techniques/values-clarification">Values Clarification</Link> — find meaningful connection goals</li>
            <li><Link href="/techniques/self-compassion-break">Self-Compassion Break</Link> — soothe painful self-judgment</li>
          </ul>

          <h2>Go deeper</h2>
          <p>Use the <Link href="/blueprint">Blueprint</Link> to map social goals or the <Link href="/send">voice companion</Link> for guided outreach scripts.</p>

          <HelpPageEnhancements
            title="Feeling Lonely Even Around People?"
            description={metadata.description}
            url="https://aiforj.com/help/lonely"
            about="Loneliness"
            faq={faq}
          />

          <EmailCapture />
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
