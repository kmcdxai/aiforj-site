import BiophilicBackground from "../../components/BiophilicBackground";
import SOS from "../../components/SOS";
import EmailCapture from "../../components/EmailCapture";
import HelpPageEnhancements from "../../components/HelpPageEnhancements";
import SiteFooter from "../../components/SiteFooter";
import Link from "next/link";
import { buildContentPageMetadata } from "../../../lib/pageMetadata";

export const metadata = buildContentPageMetadata({
  title: "Morning Dread: What to Do When You Wake Up Anxious | AIForj",
  description:
    "Waking up with dread or anxiety? Evidence-informed steps to steady your body and keep the first hour of the day from spiraling.",
  path: "/help/morning-dread",
  kind: "help",
  slug: "morning-dread",
});

export default function Page() {
  const faq = [
    {
      q: "Why do I wake up anxious before anything has even happened?",
      a: "Morning anxiety is often a mix of physiology and habit. A naturally activating morning stress response, poor sleep, hunger, and anxious first thoughts can all stack together quickly.",
    },
    {
      q: "Does morning dread mean the whole day is doomed?",
      a: "No. Morning dread often feels predictive, but it usually says more about your nervous system state than about what the day will actually become.",
    },
  ];

  return (
    <>
      <BiophilicBackground />
      <SOS />

      <main style={{ maxWidth: 780, margin: "84px auto 40px", padding: "0 20px" }}>
        <article>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28 }}>
            Waking Up With Anxiety? Start Here.
          </h1>
          <p>
            Morning dread can hit before you are fully awake: a pit in your stomach, racing thoughts, and the sense that something is already wrong. That feeling is miserable, but it is also workable.
          </p>
          <p>
            The goal is not to win a debate with your mind before sunrise. It is to settle your body, reduce extra input, and help the first hour of the day feel less like an emergency.
          </p>

          <h2>Here's what's happening</h2>
          <p>
            The body naturally shifts into a more activated state after waking. When stress is already high, that normal morning ramp-up can feel like alarm. Checking your phone, lying still with anxious thoughts, or staying under-fueled can intensify the spiral.
          </p>

          <h2>What helps first</h2>
          <ul>
            <li>
              <Link href="/techniques/morning-dread">Morning Dread protocol</Link> — a full guided reset for anxious mornings
            </li>
            <li>
              <Link href="/techniques/physiological-sigh">Physiological Sigh</Link> — fast breath work before thoughts take over
            </li>
            <li>
              <Link href="/techniques/box-breathing">Box Breathing</Link> — paced breathing to lower activation
            </li>
          </ul>

          <h2>Go deeper</h2>
          <p>
            If mornings are where anxiety grabs you most often, take the <Link href="/blueprint">Blueprint</Link> to match the pattern more precisely, or use <Link href="/companion">Talk to Forj</Link> for a guided check-in before the day runs away from you.
          </p>

          <HelpPageEnhancements
            title="Waking Up With Anxiety? Start Here."
            description={metadata.description}
            url="https://aiforj.com/help/morning-dread"
            about="Morning anxiety and morning dread"
            faq={faq}
          />

          <EmailCapture />
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
