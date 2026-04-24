import { notFound } from "next/navigation";
import SeoLandingPage from "../../../components/content/SeoLandingPage";
import { MOMENT_PAGES, getSeoPage } from "../../../data/seoPages";
import { buildArticleSchema, buildBreadcrumbSchema, buildFaqSchema } from "../../../lib/contentSchemas";
import { buildContentPageMetadata } from "../../../lib/pageMetadata";

export function generateStaticParams() {
  return MOMENT_PAGES.map((page) => ({ slug: page.slug }));
}

export function generateMetadata({ params }) {
  const page = getSeoPage("moments", params.slug);
  if (!page) return {};
  return buildContentPageMetadata({
    title: `${page.title} | AIForj`,
    description: page.description,
    path: `/moments/${page.slug}`,
    kind: "help",
    slug: page.slug,
    type: "article",
  });
}

export default function MomentPage({ params }) {
  const page = getSeoPage("moments", params.slug);
  if (!page) notFound();
  const schemas = [
    buildArticleSchema({
      title: page.title,
      description: page.description,
      url: `https://aiforj.com/moments/${page.slug}`,
      section: "Moment guide",
      about: page.title,
    }),
    buildBreadcrumbSchema([
      { name: "Home", item: "https://aiforj.com" },
      { name: "Moments", item: "https://aiforj.com/moments" },
      { name: page.title, item: `https://aiforj.com/moments/${page.slug}` },
    ]),
    buildFaqSchema([
      { q: "Is this medical advice?", a: "No. AIForj offers self-guided wellness tools and does not diagnose, treat, prescribe, or replace professional care." },
      { q: "When should I get human help?", a: "Seek professional or emergency support if symptoms are severe, persistent, unsafe, or interfering with daily life." },
    ]),
  ];

  return (
    <>
      <SeoLandingPage page={page} />
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
    </>
  );
}
