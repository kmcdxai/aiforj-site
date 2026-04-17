import ArchetypePageEnhancements from "../../components/ArchetypePageEnhancements";
import { buildContentPageMetadata } from "../../../lib/pageMetadata";

const metadata = buildContentPageMetadata({
  title: 'The Architect Emotional Archetype — Clinical Guide | AIForj',
  description: 'Discover what it means to be The Architect. Understand your stress response, thinking patterns, and evidence-based techniques matched to this archetype. Free guide from AIForj, clinically informed by a Licensed Healthcare Provider.',
  path: "/archetypes/architect",
  kind: "archetype",
  slug: "architect",
});

const faq = [
  { q: 'What does it mean to be an Architect archetype?', a: 'An Architect is strategic and future-focused, using planning and problem solving as safety strategies.' },
  { q: 'What techniques work best for Architects?', a: 'Cognitive restructuring, values clarification, and behavioral activation help translate strategy into sustainable change.' },
  { q: 'Can my archetype change over time?', a: 'Yes — with reflective practice and behavioral experiments your pattern can evolve.' },
];

export { metadata };

export default function Page() {
  return (
    <main className="container">
      <h1>The Architect: Understanding the Strategic Escape Artist</h1>

      <section>
        <h2>What It Means to Be an Architect</h2>
        <p>
          You are a planner. When stress appears, you design solutions, lists, and routes away from danger. Clinically, this is a cognitive approach to safety — you use prediction and structure to reduce uncertainty. This adaptive pattern is powerful: it helps you solve problems quickly and keep life organized under pressure. It becomes a challenge when planning replaces feeling or when avoidance looks like control.
        </p>
        <p>
          CBT frameworks (Beck) and decision-science explain how thinking styles can become rigid strategies. Polyvagal concepts explain how cognitive control can mask low-level autonomic arousal. Recognizing the adaptive value of planning helps you keep strengths while practicing emotional processing alongside strategy.
        </p>
      </section>

      <section>
        <h2>The Science Behind Your Pattern</h2>
        <p>
          The Architect relies on prefrontal cortex engagement to anticipate and problem-solve, often downregulating limbic reactivity through cognitive control. This frontally-mediated strategy recruits executive networks (dlPFC) to manage threat signals, which is adaptive but can increase cognitive load over time. Trauma or unpredictability in formative years may have favored planning as a reliable safety behavior.
        </p>
      </section>

      <section>
        <h2>Your Strengths</h2>
        <p>
          Strategic thinking, good impulse control, and the ability to break problems into manageable parts are core strengths. You excel at preparing systems and contingencies that reduce risk.
        </p>
      </section>

      <section>
        <h2>Your Growth Edges</h2>
        <p>
          Growth for Architects includes practicing tolerating uncertainty, integrating emotional processing, and using behavioral experiments rather than solely cognitive strategies.
        </p>
      </section>

      <section>
        <h2>Your Personalized Technique Toolkit</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a className="card" href="/techniques/cognitive-restructuring">Cognitive Restructuring — shift rigid thinking patterns</a>
          <a className="card" href="/techniques/values-clarification">Values Clarification — anchor actions in personal meaning</a>
          <a className="card" href="/techniques/worry-time">Worry Time — contain future-focused rumination</a>
        </div>
      </section>

      <section>
        <h2>What Other Architects Say (Illustrative)</h2>
        <blockquote>“If I have a plan, I can sleep — structure is safety.”</blockquote>
        <blockquote>“I solve problems others avoid; it keeps anxiety manageable.”</blockquote>
        <blockquote>“Sometimes my plan is a way to avoid feeling.”</blockquote>
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
        title="The Architect: Understanding the Strategic Escape Artist"
        description={metadata.description}
        url="https://aiforj.com/archetypes/architect"
        about="Architect emotional archetype"
        faq={faq}
      />
    </main>
  );
}
