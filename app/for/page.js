export const metadata = {
  title: "More Ways to Use AIForj",
  description: "Explore AIForj options for families, clinicians, and organizations while keeping emotional support private and on-device.",
  alternates: {
    canonical: "https://aiforj.com/for",
  },
};

const PATHWAYS = [
  {
    title: "For families",
    description:
      "Private Premium access for up to four people, with each person's emotional data staying on their own device.",
    href: "/family",
    cta: "See family plan →",
    accent: "rgba(107,155,158,0.14)",
  },
  {
    title: "For clinicians",
    description:
      "Privacy-first handout links, calm cards, and patient-safe between-visit support for private practice workflows.",
    href: "/clinician-pack",
    cta: "See clinician pack →",
    accent: "rgba(212,168,67,0.18)",
  },
  {
    title: "For organizations",
    description:
      "A wellness toolkit for teams, schools, and nonprofits that uses aggregate-only learning instead of individual dashboards.",
    href: "/organizations",
    cta: "See organization toolkit →",
    accent: "rgba(125,155,130,0.16)",
  },
];

export default function ForPage() {
  return (
    <main style={{ minHeight: "100vh", padding: "96px 24px 80px", background: "linear-gradient(180deg, var(--parchment), var(--surface))" }}>
      <section style={{ maxWidth: 1040, margin: "0 auto" }}>
        <a href="/" style={{ color: "var(--interactive)", fontWeight: 700, textDecoration: "none" }}>← Back to AIForj</a>
        <div style={{ textAlign: "center", margin: "48px auto 42px", maxWidth: 760 }}>
          <p className="text-label" style={{ color: "var(--sage-deep)", margin: "0 0 12px" }}>More ways to use AIForj</p>
          <h1 style={{ margin: "0 0 16px", fontSize: "clamp(38px, 6vw, 64px)" }}>Support for the people around you.</h1>
          <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 18, lineHeight: 1.75 }}>
            Start free for yourself anytime. If you are helping a family, practice, or organization, these paths keep the same privacy-first foundation and route you to the right setup.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 22 }}>
          {PATHWAYS.map((pathway) => (
            <article
              key={pathway.href}
              className="card-hover"
              style={{
                padding: 28,
                borderRadius: 24,
                background: `linear-gradient(135deg, ${pathway.accent}, var(--surface-elevated))`,
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-md)",
                display: "grid",
                gap: 16,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 28 }}>{pathway.title}</h2>
              <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.75 }}>{pathway.description}</p>
              <a href={pathway.href} className="btn-primary" style={{ justifySelf: "start", textDecoration: "none" }}>
                {pathway.cta}
              </a>
            </article>
          ))}
        </div>

        <div className="card" style={{ margin: "34px auto 0", maxWidth: 820, textAlign: "center", background: "var(--surface-elevated)" }}>
          <h2 style={{ margin: "0 0 10px" }}>Need support right now?</h2>
          <p style={{ margin: "0 0 18px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
            The core AIForj emotional first-aid flow stays free and does not require an account.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <a href="/start" className="btn-primary" style={{ textDecoration: "none" }}>Get support now →</a>
            <a href="/companion" className="btn-secondary" style={{ textDecoration: "none", color: "var(--sage-deep)" }}>Talk to Forj →</a>
          </div>
        </div>
      </section>
    </main>
  );
}
