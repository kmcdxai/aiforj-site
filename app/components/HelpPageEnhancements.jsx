import EditorialReviewCard from "./EditorialReviewCard";
import WhenToSeekHelpCard from "./WhenToSeekHelpCard";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildMedicalWebPageSchema,
} from "../../lib/contentSchemas";

export default function HelpPageEnhancements({
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
    section: "Help guide",
    about,
  });
  const medicalWebPageSchema = buildMedicalWebPageSchema({
    title,
    description,
    url,
    about,
  });
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", item: "https://aiforj.com" },
    { name: "Help", item: "https://aiforj.com/help" },
    { name: title, item: url },
  ]);

  return (
    <>
      <EditorialReviewCard kind="Help guide" />
      <WhenToSeekHelpCard />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalWebPageSchema) }}
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
