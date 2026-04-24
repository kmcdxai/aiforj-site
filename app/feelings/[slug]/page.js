import { notFound } from "next/navigation";
import SeoLandingPage from "../../../components/content/SeoLandingPage";
import { FEELING_PAGES, getSeoPage } from "../../../data/seoPages";
import { buildArticleSchema, buildBreadcrumbSchema, buildFaqSchema } from "../../../lib/contentSchemas";
import { buildContentPageMetadata } from "../../../lib/pageMetadata";

export function generateStaticParams() {
  return FEELING_PAGES.map((page) => ({ slug: page.slug }));
}

export function generateMetadata({ params }) {
  const page = getSeoPage("feelings", params.slug);
  if (!page) return {};
  return buildContentPageMetadata({
    title: `${page.title} Help | AIForj`,
    description: page.description,
    path: `/feelings/${page.slug}`,
    kind: "help",
    slug: page.slug,
    type: "article",
  });
}

export default function FeelingPage({ params }) {
  const page = getSeoPage("feelings", params.slug);
  if (!page) notFound();
  const schemas = [
    buildArticleSchema({
      title: `${page.title} help`,
      description: page.description,
      url: `https://aiforj.com/feelings/${page.slug}`,
      section: "Feeling guide",
      about: page.title,
    }),
    buildBreadcrumbSchema([
      { name: "Home", item: "https://aiforj.com" },
      { name: "Feelings", item: "https://aiforj.com/feelings" },
      { name: page.title, item: `https://aiforj.com/feelings/${page.slug}` },
    ]),
    buildFaqSchema([
      { q: `Is AIForj therapy for ${page.title.toLowerCase()}?`, a: "No. AIForj is a wellness companion for self-guided emotional first aid, not therapy, diagnosis, medication advice, or crisis care." },
      { q: "What if I cannot stay safe?", a: "Call or text 988 in the U.S., text HOME to 741741, contact emergency services, or reach a trusted person immediately." },
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
