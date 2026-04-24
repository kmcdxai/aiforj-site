import Link from "next/link";
import { TECHNIQUES } from "../../app/techniques/data";

function toolTitle(slug) {
  const technique = TECHNIQUES.find((item) => item.slug === slug);
  return technique?.title?.split(":")[0] || slug.replace(/-/g, " ");
}

export default function SeoLandingPage({ page }) {
  const isHighRisk = page.slug === "self-destructive";

  return (
    <main style={{ minHeight: "100vh", padding: "92px 20px 76px", background: "linear-gradient(180deg, var(--parchment), var(--surface))" }}>
      <article style={{ maxWidth: 920, margin: "0 auto", display: "grid", gap: 24 }}>
        <header style={{ textAlign: "center" }}>
          <p className="text-label" style={{ color: "var(--sage-deep)", margin: "0 0 12px" }}>{page.kind === "feelings" ? "Feeling guide" : "Moment guide"}</p>
          <h1 style={{ margin: "0 0 14px", fontSize: "clamp(38px, 7vw, 66px)" }}>{page.title}</h1>
          <p style={{ margin: "0 auto", maxWidth: 720, color: "var(--text-secondary)", fontSize: 18, lineHeight: 1.75 }}>{page.description}</p>
          <p style={{ margin: "12px 0 0", color: "var(--text-muted)", fontSize: 13 }}>Last reviewed: {page.reviewed}</p>
        </header>

        {isHighRisk && (
          <section style={{ padding: 22, borderRadius: 20, background: "rgba(196,91,91,0.08)", border: "1px solid rgba(196,91,91,0.22)" }}>
            <h2 style={{ margin: "0 0 10px" }}>If this is immediate</h2>
            <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.8 }}>
              If you might hurt yourself or someone else, call or text 988 in the U.S., text HOME to 741741, contact emergency services, or reach out to a trusted person who can stay with you right now.
            </p>
          </section>
        )}

        <section className="card" style={{ boxShadow: "var(--shadow-sm)" }}>
          <p className="text-label" style={{ color: "var(--sage-deep)", margin: "0 0 10px" }}>What this is</p>
          <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.85 }}>{page.intro}</p>
        </section>

        <section className="card" style={{ boxShadow: "var(--shadow-sm)" }}>
          <p className="text-label" style={{ color: "var(--sage-deep)", margin: "0 0 10px" }}>Try this now</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            {page.tools.map((slug) => (
              <Link key={slug} href={`/techniques/${slug}`} style={{ padding: "18px", borderRadius: 16, background: "var(--surface)", border: "1px solid var(--border)", textDecoration: "none", color: "var(--text-primary)", display: "grid", gap: 8 }}>
                <strong>{toolTitle(slug)}</strong>
                <span style={{ color: "var(--text-secondary)", lineHeight: 1.6, fontSize: 14 }}>Open a self-guided reset.</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="card" style={{ boxShadow: "var(--shadow-sm)" }}>
          <h2 style={{ margin: "0 0 10px" }}>When to seek human help</h2>
          <p style={{ margin: "0 0 14px", color: "var(--text-secondary)", lineHeight: 1.8 }}>
            AIForj can support self-guided emotional first aid, but it is not a substitute for professional care. Consider a licensed professional if this feeling is persistent, worsening, connected to trauma, affecting sleep/work/relationships, or making it hard to stay safe.
          </p>
          <Link href="/find-help" className="btn-secondary" style={{ textDecoration: "none", color: "var(--sage-deep)" }}>Find human help →</Link>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
          <Link href="/send" className="card" style={{ textDecoration: "none", color: "inherit", boxShadow: "var(--shadow-sm)" }}>
            <p className="text-label" style={{ color: "var(--sage-deep)", margin: "0 0 8px" }}>Send Calm</p>
            <h2 style={{ margin: "0 0 8px" }}>Send a reset, no pressure</h2>
            <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.7 }}>Share a calm link without exposing why someone might need it.</p>
          </Link>
          <Link href="/blueprint" className="card" style={{ textDecoration: "none", color: "inherit", boxShadow: "var(--shadow-sm)" }}>
            <p className="text-label" style={{ color: "var(--sage-deep)", margin: "0 0 8px" }}>Blueprint</p>
            <h2 style={{ margin: "0 0 8px" }}>Map your stress style</h2>
            <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.7 }}>A reflection pattern, not a diagnosis.</p>
          </Link>
        </section>

        <section style={{ padding: 22, borderRadius: 20, background: "var(--amber-light)", border: "1px solid rgba(196,149,106,0.18)" }}>
          <p className="text-label" style={{ color: "var(--amber-deep)", margin: "0 0 8px" }}>After the free reset</p>
          <h2 style={{ margin: "0 0 10px" }}>Want a deeper routine?</h2>
          <p style={{ margin: "0 0 14px", color: "var(--text-secondary)", lineHeight: 1.8 }}>Premium adds deeper structured sessions, Garden insights, custom routines, and exports. It does not block basic first aid.</p>
          <Link href="/companion" className="btn-primary" style={{ textDecoration: "none", background: "var(--amber-deep)" }}>Explore Premium →</Link>
        </section>

        <footer style={{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.7, textAlign: "center" }}>
          AIForj is a wellness companion, not a substitute for professional care.
        </footer>
      </article>
    </main>
  );
}
