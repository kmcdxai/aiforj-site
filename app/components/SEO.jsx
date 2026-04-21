export default function SEO() {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AIForj",
    url: "https://aiforj.com",
    logo: "https://aiforj.com/aif.jpeg",
    founder: {
      "@type": "Person",
      name: "Kevin",
      jobTitle: "Psychiatric Nurse Practitioner Candidate",
      url: "https://aiforj.com/about/founder"
    },
  };

  const site = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AIForj",
    url: "https://aiforj.com",
    description: "Clinically-informed emotional first-aid tools for anxiety, sadness, anger, overwhelm, and more."
  };

  const app = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AIForj",
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
    url: "https://aiforj.com",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock"
    },
    creator: {
      "@type": "Person",
      name: "Kevin",
      jobTitle: "Psychiatric Nurse Practitioner Candidate",
      url: "https://aiforj.com/about/founder"
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(site) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(app) }} />
    </>
  );
}
