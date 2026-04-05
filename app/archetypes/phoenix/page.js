const metadata = {
  title: 'The Phoenix Emotional Archetype — Clinical Guide | AIForj',
  description: 'Discover what it means to be The Phoenix. Understand your stress response, thinking patterns, and evidence-based techniques matched to this archetype. Free guide by a Board Certified PMHNP.',
};

const faq = [
  { q: 'What does it mean to be a Phoenix archetype?', a: 'A Phoenix endures cycles of exhaustion and recovery, demonstrating resilience even after depletion.' },
  { q: 'What techniques work best for Phoenixes?', a: 'Behavioral activation, progressive muscle relaxation, and paced rest support sustainable recovery.' },
  { q: 'Can my archetype change over time?', a: 'Yes — with mindful pacing and consistent self-care, cycles of burnout can shift toward steady resilience.' },
];

export { metadata };

export default function Page() {
  return (
    <main className="container">
      <h1>The Phoenix: Understanding Resilient Exhaustion</h1>

      <section>
        <h2>What It Means to Be a Phoenix</h2>
        <p>
          You recover — again and again. Phoenixes tend to rise after collapse, holding deep reserves of resilience that let them rebuild. Clinically, this pattern reflects a nervous system that cycles between over-engagement and deep recovery; it’s adaptive where demands are cyclic or where caregiving requires repeated rises from stress. This strength can mask underlying depletion and create cycles that feel inevitable.
        </p>
        <p>
          Polyvagal and stress physiology research explains how repeated activation and recovery shape energy systems, while CBT models clarify the beliefs that push you to "keep going" despite fatigue. Clinically we honor your resilience while creating strategies to avoid unsustainable cycles.
        </p>
      </section>

      <section>
        <h2>The Science Behind Your Pattern</h2>
        <p>
          Repeated stress and recovery alter HPA axis reactivity and autonomic flexibility. Van der Kolk’s trauma work and stress physiology research show how repeated surges of cortisol and sympathetic activation followed by compensation affect energy regulation. Behavioral neuroscience highlights the role of reward and meaning — why you keep returning despite cost.
        </p>
      </section>

      <section>
        <h2>Your Strengths</h2>
        <p>
          You have extraordinary grit, the ability to rebuild after setbacks, and you inspire others by example. Your persistence is a central asset.
        </p>
      </section>

      <section>
        <h2>Your Growth Edges</h2>
        <p>
          Growth focuses on pacing, prioritizing restoration before collapse, and integrating rest as skillful behavior rather than a reward after suffering.
        </p>
      </section>

      <section>
        <h2>Your Personalized Technique Toolkit</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a className="card" href="/techniques/behavioral-activation">Behavioral Activation — rebuild reward and routine</a>
          <a className="card" href="/techniques/progressive-muscle-relaxation">Progressive Muscle Relaxation — physical downshift</a>
          <a className="card" href="/techniques/self-compassion-break">Self-Compassion — sustain recovery without self-blame</a>
        </div>
      </section>

      <section>
        <h2>What Other Phoenixes Say (Illustrative)</h2>
        <blockquote>“I always ash and then regrow — it's how I survive.”</blockquote>
        <blockquote>“People admire my comeback, but I wish I didn’t have to collapse first.”</blockquote>
        <blockquote>“Recovery feels earned but also exhausting.”</blockquote>
      </section>

      <section>
        <h2>Next Steps</h2>
        <ul>
          <li><a href="/blueprint">Haven't taken the Blueprint yet? Take it now →</a></li>
          <li><a href="/tools">Start your top technique now →</a></li>
          <li><a href="/garden">Track your growth →</a></li>
        </ul>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map(f => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a }
        }))
      }) }} />
    </main>
  );
}
