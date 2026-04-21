import ArchetypePageEnhancements from "../../components/ArchetypePageEnhancements";
import { buildContentPageMetadata } from "../../../lib/pageMetadata";

const metadata = buildContentPageMetadata({
  title: 'The Sentinel Emotional Archetype — Clinical Guide | AIForj',
  description: 'Discover what it means to be The Sentinel. Understand your stress response, thinking patterns, and evidence-based techniques matched to this archetype. Free guide from AIForj, clinically informed by Kevin, a licensed clinician and psychiatric nurse practitioner candidate.',
  path: "/archetypes/sentinel",
  kind: "archetype",
  slug: "sentinel",
});

const faq = [
  { q: 'What does it mean to be a Sentinel archetype?', a: 'A Sentinel is a protective pattern characterized by vigilance and readiness to respond to threat; it developed to keep you and others safe.' },
  { q: 'What techniques work best for Sentinels?', a: 'Grounding, vagal toning, and paced breathing help downregulate hypervigilance and restore safety signals.' },
  { q: 'Can my archetype change over time?', a: 'Yes — archetypes are adaptive profiles that can shift with life experience and targeted practice.' },
];

export { metadata };

export default function Page() {
  return (
    <main className="container">
      <h1>The Sentinel: Understanding the Hypervigilant Protector</h1>

      <section>
        <h2>What It Means to Be a Sentinel</h2>
        <p>
          You are someone who notices danger early, often years before others do. Your attention to detail and quiet alertness have likely kept you and your people safe in stressful situations. From a clinical perspective, Sentinel patterns reflect a nervous system tuned for threat detection — a high-sensitivity setting that evolved because vigilance was adaptive in your environment. This is not a disorder; it is an adaptive response that served a purpose. In therapy, we work with this strength while helping your nervous system learn when it can relax.
        </p>
        <p>
          Polyvagal theory (Porges) explains how your autonomic nervous system favors a state of high vigilance when safety signals are scarce. Cognitive models (Beck) show how threat-focused thinking can become habitual, and stress-response research explains how repeated activation strengthens this pattern. You’ll hear clinical language, but the core message is simple: your Sentinel response protected you. Now we teach it when to step back.
        </p>
      </section>

      <section>
        <h2>The Science Behind Your Pattern</h2>
        <p>
          Neuroscience points to a network anchored in the amygdala and brainstem threat circuits, with heightened insula and dorsal anterior cingulate activation during vigilance. Stephen Porges' polyvagal model explains how vagal tone and social safety cues modulate this response. Aaron Beck’s CBT framework shows how automatic threat-focused thoughts maintain hypervigilance. Traumatic or unpredictable early environments (Van der Kolk) often train the brain to expect danger — a survival adaptation that persists even when explicit threats have reduced.
        </p>
      </section>

      <section>
        <h2>Your Strengths</h2>
        <p>
          You have exceptional situational awareness, a talent for anticipating problems, and a natural protective instinct. You are reliable in crises, notice the small details others miss, and can prepare contingencies that keep people safe.
        </p>
      </section>

      <section>
        <h2>Your Growth Edges</h2>
        <p>
          Growth for a Sentinel is about learning to shift from constant readiness to flexible responsiveness. This means practicing safety cues, tolerating lowered vigilance, and retraining the body to accept restful states without guilt. These are growth edges, not flaws.
        </p>
      </section>

      <section>
        <h2>Your Personalized Technique Toolkit</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a className="card" href="/techniques/54321-grounding">54321 Grounding — resets attention and interrupts threat loops</a>
          <a className="card" href="/techniques/vagal-toning">Vagal Toning — restores parasympathetic balance</a>
          <a className="card" href="/techniques/box-breathing">Box Breathing — paced breathing to lower arousal</a>
        </div>
      </section>

      <section>
        <h2>What Other Sentinels Say (Illustrative)</h2>
        <blockquote>“I noticed the danger before anyone else — sometimes it’s lonely, but it’s kept us alive.”</blockquote>
        <blockquote>“People rely on my radar; I wish I could switch it off sometimes.”</blockquote>
        <blockquote>“Being prepared means I can sleep when everyone else sleeps.”</blockquote>
      </section>

      <section>
        <h2>Next Steps</h2>
        <ul>
          <li><a href="/blueprint">Haven't taken the Blueprint yet? Take it now →</a></li>
          <li><a href="/tools">Start your top technique now →</a></li>
          <li><a href="/garden">Track your growth →</a></li>
        </ul>
      </section>

      <ArchetypePageEnhancements
        title="The Sentinel: Understanding the Hypervigilant Protector"
        description={metadata.description}
        url="https://aiforj.com/archetypes/sentinel"
        about="Sentinel emotional archetype"
        faq={faq}
      />
    </main>
  );
}
