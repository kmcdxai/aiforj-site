import { TECHNIQUES } from "../data";
import { notFound } from "next/navigation";
import TechniqueClient from "./TechniqueClient";
import { articleOgImage } from "../../../lib/ogImages";

export async function generateStaticParams() {
  return TECHNIQUES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const t = TECHNIQUES.find((t) => t.slug === slug);
  if (!t) return {};
  const socialImage = articleOgImage({ kind: "technique", slug: t.slug, title: t.title });
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    keywords: t.keywords,
    alternates: {
      canonical: `https://aiforj.com/techniques/${t.slug}`,
    },
    openGraph: {
      title: t.metaTitle,
      description: t.metaDescription,
      url: `https://aiforj.com/techniques/${t.slug}`,
      siteName: "AIForj",
      type: "article",
      images: [{ url: socialImage, width: 1200, height: 630, alt: `${t.title} calm card` }],
    },
    twitter: {
      card: "summary_large_image",
      title: t.metaTitle,
      description: t.metaDescription,
      images: [socialImage],
    },
  };
}

export default async function TechniquePage({ params }) {
  const { slug } = await params;
  const technique = TECHNIQUES.find((t) => t.slug === slug);
  if (!technique) notFound();
  const related = technique.relatedSlugs
    .map((s) => TECHNIQUES.find((t) => t.slug === s))
    .filter(Boolean);

  return <TechniqueClient technique={technique} related={related} />;
}
