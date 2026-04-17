import BiophilicBackground from "../../components/BiophilicBackground";
import SOS from "../../components/SOS";
import EmailCapture from "../../components/EmailCapture";
import HelpPageEnhancements from "../../components/HelpPageEnhancements";
import SiteFooter from "../../components/SiteFooter";
import Link from "next/link";
import { buildContentPageMetadata } from "../../../lib/pageMetadata";

export const metadata = buildContentPageMetadata({
  title: "Can't Sleep? Clinician-Designed Tools for Racing Thoughts",
  description: "Mind won't turn off at night? Practical, evidence-informed steps to quiet racing thoughts and fall asleep faster.",
  path: "/help/cant-sleep",
  kind: "help",
  slug: "cant-sleep",
});

export default function Page() {
  const faq = [
    { q: "Why can't I stop thinking at night?", a: "The brain switches into problem-solving mode; stress and habits can keep it active. Gentle routines help shift the state toward rest." },
    { q: "Will these tips work every night?", a: "They reduce arousal for many people; consistency and sleep hygiene improve results over time." },
  ];

  return (
    <>
      <BiophilicBackground />
      <SOS />

      <main style={{ maxWidth: 780, margin: "84px auto 40px", padding: "0 20px" }}>
        <article>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28 }}>Can't Sleep? Mind Won't Turn Off?</h1>
          <p>Racing thoughts at night are common — your brain is replaying problems and scanning for threats. That restlessness is understandable, and there are small changes that help signal your body it's safe to rest.</p>
          <p>You're not failing; sleep systems are sensitive to stress and routine. The goal is to reduce arousal and give your body cues for sleep.</p>

          <h2>Here's what's happening</h2>
          <p>Heightened sympathetic activity and cognitive rumination keep sleep systems suppressed. Slower breathing, body relaxation, and stimulus control help re-engage restorative sleep mechanisms.</p>

          <h2>What helps</h2>
          <ul>
            <li><Link href="/techniques/body-scan">Body Scan</Link> — progressive attention to sensations to unwind tension</li>
            <li><Link href="/techniques/progressive-muscle-relaxation">Progressive Muscle Relaxation</Link> — reduces physical arousal</li>
            <li><Link href="/techniques/box-breathing">Box Breathing</Link> — slows heart rate and thinking</li>
          </ul>

          <h2>Go deeper</h2>
          <p>Try the <Link href="/blueprint">Blueprint</Link> for tailored nighttime routines or the <Link href="/send">voice companion</Link> to guide a sleep-winddown.</p>

          <HelpPageEnhancements
            title="Can't Sleep? Mind Won't Turn Off?"
            description={metadata.description}
            url="https://aiforj.com/help/cant-sleep"
            about="Insomnia and nighttime racing thoughts"
            faq={faq}
          />

          <EmailCapture />
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
