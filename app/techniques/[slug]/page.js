import { TECHNIQUES } from "../data";
import { notFound } from "next/navigation";
import TechniqueClient from "./TechniqueClient";

export async function generateStaticParams() {
  return TECHNIQUES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const t = TECHNIQUES.find((t) => t.slug === slug);
  if (!t) return {};
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
    },
    twitter: {
      card: "summary_large_image",
      title: t.metaTitle,
      description: t.metaDescription,
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
