export default function SEO() {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AIForj",
    "url": "https://aiforj.com",
    "logo": "https://aiforj.com/aif.jpeg",
    "founder": {
      "@type": "Person",
      "name": "a Board-Certified Healthcare Professional",
      "jobTitle": "Board Certified Psychiatric Mental Health Nurse Practitioner"
    },
    "sameAs": ["https://x.com/AIForj"]
  };

  const site = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AIForj",
    "url": "https://aiforj.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://aiforj.com/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const medical = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "mainEntity": {
      "@type": "MedicalCondition",
      "name": "Mental Health"
    },
    "medicalSpecialty": "Psychiatry",
    "url": "https://aiforj.com"
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(site) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(medical) }} />
    </>
  );
}
