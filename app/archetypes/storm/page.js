const metadata = {
  title: 'The Storm Emotional Archetype — Clinical Guide | AIForj',
  description: 'Discover what it means to be The Storm. Understand your stress response, thinking patterns, and evidence-based techniques matched to this archetype. Free guide from AIForj, clinically informed by a Licensed Healthcare Provider.',
};

const faq = [
  { q: 'What does it mean to be a Storm archetype?', a: 'A Storm experiences emotional intensity and rapid rises in arousal; this pattern can fuel creativity and passion but can also feel overwhelming.' },
  { q: 'What techniques work best for Storms?', a: 'Physiological sighs, TIPP skill, and thought defusion help regulate sudden intensity and maintain safety.' },
  { q: 'Can my archetype change over time?', a: 'Yes — learning targeted regulation skills can smooth intensity while preserving creativity.' },
];

export { metadata };

export default function Page() {
  return (
    <main className="container">
      <h1>The Storm: Understanding Emotional Intensity</h1>

      <section>
        <h2>What It Means to Be a Storm</h2>
        <p>
          You feel things deeply and with force. Your emotional system produces rapid, high-amplitude responses — passion, anger, grief, or joy — that can be powerful and catalytic. Clinically, Storm patterns are driven by high reactivity in limbic circuits and fast-moving autonomic shifts. This intensity is a source of creativity and authenticity but can overwhelm when safety or containment is missing.
        </p>
        <p>
          Polyvagal theory and affective neuroscience explain how quick shifts in autonomic state create intense experiences. CBT and emotion-regulation research show that targeted skills can help you channel intensity productively without erasing its value.
        </p>
      </section>

      <section>
        <h2>The Science Behind Your Pattern</h2>
        <p>
          Storm profiles show rapid amygdala activation, strong noradrenergic arousal, and sometimes limited prefrontal inhibitory control during peaks. Researchers like Van der Kolk describe how unresolved stress sensitize these circuits. Interventions that combine immediate somatic downregulation (physiological sigh) with cognitive tools (defusion) are evidence-based approaches to managing intensity.
        </p>
      </section>

      <section>
        <h2>Your Strengths</h2>
        <p>
          Your passion, authenticity, and creative intensity move people. You are often fearless in expression and can catalyze change when others are cautious.
        </p>
      </section>

      <section>
        <h2>Your Growth Edges</h2>
        <p>
          Growth includes learning rapid regulation tools, pacing intensity, and channeling emotion into structured outlets so it empowers rather than depletes you.
        </p>
      </section>

      <section>
        <h2>Your Personalized Technique Toolkit</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a className="card" href="/techniques/physiological-sigh">Physiological Sigh — immediate downshift for acute intensity</a>
          <a className="card" href="/techniques/tipp-skill">TIPP Skill — fast-acting regulation strategy</a>
          <a className="card" href="/techniques/thought-defusion">Thought Defusion — reduce fusion with intense thoughts</a>
        </div>
      </section>

      <section>
        <h2>What Other Storms Say (Illustrative)</h2>
        <blockquote>“When I feel it, I feel everything — sometimes it's beautiful, sometimes it's terrifying.”</blockquote>
        <blockquote>“My intensity has given me art, but it also burns me out.”</blockquote>
        <blockquote>“People call me dramatic; I call it alive.”</blockquote>
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
        "headline": "The Storm: Understanding the Emotional Cyclone",
        "author": { "@type": "Person", "name": "AIForj Team" },
        "datePublished": "2026-04-05",
        "publisher": { "@type": "Organization", "name": "AIForj", "logo": { "@type": "ImageObject", "url": "https://aiforj.com/aif.jpeg" } },
        "medicalSpecialty": "Psychiatry",
        "url": "https://aiforj.com/archetypes/storm"
      }) }} />
    </main>
  );
}
