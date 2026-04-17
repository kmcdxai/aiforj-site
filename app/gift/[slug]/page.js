import { TECHNIQUES } from "../../techniques/data";
import { notFound } from "next/navigation";
import GiftClient from "./GiftClient";
import { buildCalmCardUrl } from "../../../utils/calmCard";

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
  const socialImage = buildCalmCardUrl({ kind: "gift", slug, format: "og" });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://aiforj.com/gift/${slug}`,
      siteName: "AIForj",
      type: "website",
      images: [{ url: socialImage, width: 1200, height: 630, alt: `${shortName} gift calm card` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  };
}

export default async function GiftPage({ params }) {
  const { slug } = await params;
  const technique = TECHNIQUES.find((t) => t.slug === slug);
  if (!technique) notFound();

  return <GiftClient technique={technique} />;
}
