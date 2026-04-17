import ArchetypePageEnhancements from "../../components/ArchetypePageEnhancements";
import { buildContentPageMetadata } from "../../../lib/pageMetadata";

const metadata = buildContentPageMetadata({
  title: 'The Empath Emotional Archetype — Clinical Guide | AIForj',
  description: 'Discover what it means to be The Empath. Understand your stress response, thinking patterns, and evidence-based techniques matched to this archetype. Free guide from AIForj, clinically informed by a Licensed Healthcare Provider.',
  path: "/archetypes/empath",
  kind: "archetype",
  slug: "empath",
});

const faq = [
  { q: 'What does it mean to be an Empath archetype?', a: 'An Empath deeply senses others’ emotions and often prioritizes connection and care; it developed as an attunement strategy in supportive roles.' },
  { q: 'What techniques work best for Empaths?', a: 'Boundaries, body-based regulation (body scan), and self-compassion practices help prevent emotional overload.' },
  { q: 'Can my archetype change over time?', a: 'Yes — with skill-building and practice, patterns can shift to healthier balance while preserving strengths.' },
];

export { metadata };

export default function Page() {
  return (
    <main className="container">
      <h1>The Empath: Understanding the Emotional Absorber</h1>

      <section>
        <h2>What It Means to Be an Empath</h2>
        <p>
          You feel others deeply — their moods, tensions, and unspoken needs — often before words are spoken. That sensitivity makes you a natural healer and a compassionate companion. Clinically, empathic patterns reflect a highly attuned social nervous system: your polyvagal circuits prioritize social engagement and responsiveness. This capacity is an asset; it becomes a challenge when boundaries are porous and you carry other people’s distress as your own.
        </p>
        <p>
          CBT helps map the thinking patterns that let others’ emotions dominate your narrative, while polyvagal theory (Porges) helps explain why social cues drive your physiological state. Your emotional absorption was adaptive: tuning into others was valuable in your context. Therapy preserves your empathic gift while teaching regulation.
        </p>
      </section>

      <section>
        <h2>The Science Behind Your Pattern</h2>
        <p>
          Empathic reactivity involves mirror neuron systems, insular cortex sensitivity, and strong vagal social engagement. Porges’ work highlights how safety cues and social connectedness regulate heart rate variability. Cognitive frameworks (Beck) explain how over-responsibility beliefs maintain emotional enmeshment. Early caregiving environments that rewarded attunement reinforce this pattern as a reliable survival strategy.
        </p>
      </section>

      <section>
        <h2>Your Strengths</h2>
        <p>
          You offer deep listening, emotional insight, and an ability to comfort others. You often sense what others need before they ask and help people feel seen and understood.
        </p>
      </section>

      <section>
        <h2>Your Growth Edges</h2>
        <p>
          Growth edges include strengthening boundaries, practicing compassionate self-differentiation, and learning somatic practices that return you to your own body when you’ve taken on another’s state.
        </p>
      </section>

      <section>
        <h2>Your Personalized Technique Toolkit</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a className="card" href="/techniques/self-compassion-break">Self-Compassion Break — counteracts over-responsibility</a>
          <a className="card" href="/techniques/radical-acceptance">Radical Acceptance — reduces internal struggle with others’ states</a>
          <a className="card" href="/techniques/body-scan">Body Scan — return to your own sensations</a>
        </div>
      </section>

      <section>
        <h2>What Other Empaths Say (Illustrative)</h2>
        <blockquote>“I always know when someone is off; I just wish I could stop feeling it so deeply.”</blockquote>
        <blockquote>“People tell me I make them feel safer; that means everything to me.”</blockquote>
        <blockquote>“Sometimes I can’t tell where they end and I begin.”</blockquote>
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
        title="The Empath: Understanding the Emotional Absorber"
        description={metadata.description}
        url="https://aiforj.com/archetypes/empath"
        about="Empath emotional archetype"
        faq={faq}
      />
    </main>
  );
}
