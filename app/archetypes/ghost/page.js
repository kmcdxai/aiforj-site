const metadata = {
  title: 'The Ghost Emotional Archetype — Clinical Guide | AIForj',
  description: 'Discover what it means to be The Ghost. Understand your stress response, thinking patterns, and evidence-based techniques matched to this archetype. Free guide from AIForj, clinically informed by a Licensed Healthcare Provider.',
};

const faq = [
  { q: 'What does it mean to be a Ghost archetype?', a: 'A Ghost tends toward emotional shutdown and withdrawal; this pattern protects by reducing exposure to overwhelm.' },
  { q: 'What techniques work best for Ghosts?', a: 'Gentle somatic work, progressive muscle relaxation, and graded activation help rebuild connection to body and feeling.' },
  { q: 'Can my archetype change over time?', a: 'Yes — with stepped exposure and somatic practice, emotional engagement can return safely.' },
];

export { metadata };

export default function Page() {
  return (
    <main className="container">
      <h1>The Ghost: Understanding Emotional Shutdown</h1>

      <section>
        <h2>What It Means to Be a Ghost</h2>
        <p>
          You protect yourself by quieting emotion and withdrawing from overwhelming situations. Clinically, this is often a safe strategy when activation is too intense — reducing perceptual load and preventing harm. It is adaptive when escape or numbness was necessary to survive. The goal in therapy is not to eliminate this adaptation but to provide safe ways to reconnect with feeling when you choose to.
        </p>
        <p>
          Polyvagal theory helps explain shutdown as a dorsal vagal strategy: the body conserves energy and minimizes threat by withdrawing. CBT frameworks help identify beliefs that justify shutdown, while trauma research (Van der Kolk) shows how immobilization can be protective in chaotic environments.
        </p>
      </section>

      <section>
        <h2>The Science Behind Your Pattern</h2>
        <p>
          Shutdown involves dorsal vagal engagement, reduced heart rate variability, and blunted interoception. Neurobiological work shows how prolonged immobilization states impact limbic and brainstem regulation. Healing focuses on graded re-engagement and restoring interoceptive safety.
        </p>
      </section>

      <section>
        <h2>Your Strengths</h2>
        <p>
          You can remain calm during chaos, create a steady presence, and contain emotional storms. Your inner life is rich and reflective.
        </p>
      </section>

      <section>
        <h2>Your Growth Edges</h2>
        <p>
          Growth includes practicing gentle reactivation, building interoceptive awareness, and allowing gradual connection to feelings in safe contexts.
        </p>
      </section>

      <section>
        <h2>Your Personalized Technique Toolkit</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a className="card" href="/techniques/body-scan">Body Scan — reconnect gently to sensation</a>
          <a className="card" href="/techniques/progressive-muscle-relaxation">Progressive Muscle Relaxation — safe somatic practice</a>
          <a className="card" href="/techniques/behavioral-activation">Behavioral Activation — gently reintroduce engagement</a>
        </div>
      </section>

      <section>
        <h2>What Other Ghosts Say (Illustrative)</h2>
        <blockquote>“I learned to go quiet because feeling was too dangerous.”</blockquote>
        <blockquote>“Being still kept me safe; now I wonder how to move again.”</blockquote>
        <blockquote>“My inner world is deep, even if I don't always show it.”</blockquote>
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

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "The Ghost: Understanding Quiet Distress",
        "author": { "@type": "Person", "name": "AIForj Team" },
        "datePublished": "2026-04-05",
        "publisher": { "@type": "Organization", "name": "AIForj", "logo": { "@type": "ImageObject", "url": "https://aiforj.com/aif.jpeg" } },
        "medicalSpecialty": "Psychiatry",
        "url": "https://aiforj.com/archetypes/ghost"
      }) }} />
    </main>
  );
}
