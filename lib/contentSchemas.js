import { founderAuthor } from "./schemas/founder";

export const EDITORIAL_POLICY_URL = "https://aiforj.com/editorial-policy";
export const SAFETY_PAGE_URL = "https://aiforj.com/how-aiforj-stays-safe";
export const LAST_REVIEWED_DATE = "2026-04-16";

export const CONTENT_AUTHOR = founderAuthor;

export const CLINICAL_REVIEWER = founderAuthor;

export function buildFaqSchema(faq) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function buildBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

export function buildArticleSchema({
  title,
  description,
  url,
  section,
  about,
  dateModified = LAST_REVIEWED_DATE,
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    articleSection: section,
    author: CONTENT_AUTHOR,
    reviewedBy: CLINICAL_REVIEWER,
    dateModified,
    inLanguage: "en-US",
    publisher: {
      "@type": "Organization",
      name: "AIForj",
      url: "https://aiforj.com",
      logo: {
        "@type": "ImageObject",
        url: "https://aiforj.com/aif.jpeg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    about: {
      "@type": "Thing",
      name: about,
    },
  };
}

export function buildMedicalWebPageSchema({
  title,
  description,
  url,
  about,
  lastReviewed = LAST_REVIEWED_DATE,
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: title,
    headline: title,
    description,
    url,
    author: founderAuthor,
    reviewedBy: founderAuthor,
    lastReviewed,
    specialty: "Psychiatry",
    about: {
      "@type": "Thing",
      name: about,
    },
    medicalAudience: "Patient",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    // Add a separate clinicalReviewer only after a fully credentialed advisor is formally attached to AIForj.
  };
}
