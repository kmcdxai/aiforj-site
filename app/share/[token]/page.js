import Link from "next/link";
import { notFound } from "next/navigation";
import ShareCard from "../../../components/share/ShareCard";
import ShareOpenMetric from "../../../components/share/ShareOpenMetric";
import { getShareCardView, parseShareToken } from "../../../lib/shareToken";
import { buildContentPageMetadata } from "../../../lib/pageMetadata";

export async function generateMetadata({ params }) {
  const { token } = await params;
  const payload = parseShareToken(token);
  if (!payload) return {};
  const view = getShareCardView(payload);
  const image = `https://aiforj.com/api/og/calm-card?token=${encodeURIComponent(token)}`;

  return buildContentPageMetadata({
    title: `${view.title} | AIForj`,
    description: view.body,
    path: `/share/${token}`,
    socialTitle: view.title,
    socialDescription: view.body,
    type: "website",
    image,
  });
}

export default async function SharePage({ params }) {
  const { token } = await params;
  const payload = parseShareToken(token);
  if (!payload) notFound();
  const view = getShareCardView(payload);

  return (
    <main style={{ minHeight: "100vh", maxWidth: 760, margin: "84px auto 48px", padding: "0 20px", display: "grid", gap: 22, justifyItems: "center" }}>
      <ShareOpenMetric payload={payload} />
      <ShareCard payload={payload} />
      <section style={{ textAlign: "center", display: "grid", gap: 12, maxWidth: 560 }}>
        <h1 style={{ margin: 0 }}>{view.title}</h1>
        <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.8 }}>
          {view.body}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
          <Link href={view.path} className="btn-primary" style={{ textDecoration: "none", width: "min(100%, 260px)", textAlign: "center" }}>
            {view.cta}
          </Link>
          <Link href="/today" className="btn-secondary" style={{ textDecoration: "none", color: "var(--sage-deep)", width: "min(100%, 260px)", textAlign: "center" }}>
            Take today’s reset
          </Link>
        </div>
        <p style={{ margin: "8px 0 0", fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7 }}>
          Shared cards never include raw mood scores, journal text, chat text, crisis status, or provider-search details. AIForj is a wellness companion, not a substitute for professional care.
        </p>
      </section>
    </main>
  );
}
