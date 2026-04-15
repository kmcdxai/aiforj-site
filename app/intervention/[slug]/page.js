import { TECHNIQUES } from "../../techniques/data";
import { getAllInterventions, getInterventionById } from "../../../data/interventions";
import { notFound } from "next/navigation";
import InterventionClient from "./InterventionClient";

function getRouteEntry(slug) {
  // `/intervention/*` should prefer the interactive intervention catalog when a
  // slug exists in both datasets (for example legacy technique content vs a
  // newer intervention with the same slug).
  return getInterventionById(slug) || TECHNIQUES.find((technique) => technique.slug === slug) || null;
}

export async function generateStaticParams() {
  const techniqueParams = TECHNIQUES.map((t) => ({ slug: t.slug }));
  const interventionParams = getAllInterventions().map((t) => ({ slug: t.id }));
  return Array.from(
    new Map([...techniqueParams, ...interventionParams].map((entry) => [entry.slug, entry])).values()
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const t = getRouteEntry(slug);
  if (!t) return {};

  const name = t.name || t.title;
  const title = t.metaTitle || `${name} | AIForj`;
  const description =
    t.metaDescription ||
    `${t.description} Use this guided AIForj tool to check in before and after, then save a shareable Mood Shift Receipt.`;
  const canonicalSlug = t.slug || t.id;
  const keywordList = Array.from(
    new Set(
      [
        ...(typeof t.keywords === "string" ? t.keywords.split(",").map((item) => item.trim()) : []),
        "emotional first aid",
        "guided mental health tool",
        "mood shift receipt",
        name,
      ].filter(Boolean)
    )
  );

  return {
    title,
    description,
    keywords: keywordList,
    alternates: {
      canonical: `https://aiforj.com/intervention/${canonicalSlug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://aiforj.com/intervention/${canonicalSlug}`,
      siteName: "AIForj",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function InterventionPage({ params }) {
  const { slug } = await params;
  const technique = getRouteEntry(slug);
  if (!technique) notFound();

  return <InterventionClient technique={technique} />;
}
