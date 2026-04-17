import EditorialReviewCard from "./EditorialReviewCard";
import WhenToSeekHelpCard from "./WhenToSeekHelpCard";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
} from "../../lib/contentSchemas";

export default function ArchetypePageEnhancements({
  title,
  description,
  url,
  about,
  faq,
}) {
  const faqSchema = buildFaqSchema(faq);
  const articleSchema = buildArticleSchema({
    title,
    description,
    url,
    section: "Archetype guide",
    about,
  });
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", item: "https://aiforj.com" },
    { name: title, item: url },
  ]);

  return (
    <>
      <EditorialReviewCard kind="Archetype guide" />
      <WhenToSeekHelpCard />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
