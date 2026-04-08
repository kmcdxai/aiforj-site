import { TECHNIQUES } from "../../techniques/data";
import { notFound } from "next/navigation";
import InterventionClient from "./InterventionClient";

export async function generateStaticParams() {
  return TECHNIQUES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const t = TECHNIQUES.find((t) => t.slug === slug);
  if (!t) return {};
  return {
    title: `${t.metaTitle} | Mood Measurement`,
    description: `Track your mood before and after using ${t.title}. See your progress and share your results.`,
    keywords: `${t.keywords}, mood tracking, mental health measurement`,
    alternates: {
      canonical: `https://aiforj.com/intervention/${t.slug}`,
    },
    openGraph: {
      title: `${t.title} | Mood Measurement`,
      description: `Track your mood before and after using ${t.title}. See your progress and share your results.`,
      url: `https://aiforj.com/intervention/${t.slug}`,
      siteName: "AIForj",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${t.title} | Mood Measurement`,
      description: `Track your mood before and after using ${t.title}. See your progress and share your results.`,
    },
  };
}

export default async function InterventionPage({ params }) {
  const { slug } = await params;
  const technique = TECHNIQUES.find((t) => t.slug === slug);
  if (!technique) notFound();

  return <InterventionClient technique={technique} />;
}
