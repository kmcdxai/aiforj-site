import { TECHNIQUES } from "../../techniques/data";
import { notFound } from "next/navigation";
import GiftClient from "./GiftClient";

export async function generateStaticParams() {
  return TECHNIQUES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params;
  const sp = await searchParams;
  const t = TECHNIQUES.find((t) => t.slug === slug);
  if (!t) return {};

  const fromName = sp?.from || "";
  const title = fromName
    ? `${fromName} sent you something — open when you need calm`
    : "Someone sent you something — open when you need calm";
  const shortName = t.title.split(":")[0].replace(" Technique", "").replace("The ", "").trim();
  const description = `A ${shortName} technique, designed by a clinician. Free, private, ${t.time}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://aiforj.com/gift/${slug}`,
      siteName: "AIForj",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function GiftPage({ params }) {
  const { slug } = await params;
  const technique = TECHNIQUES.find((t) => t.slug === slug);
  if (!technique) notFound();

  return <GiftClient technique={technique} />;
}
