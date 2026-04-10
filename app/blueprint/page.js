import BlueprintClient from "./BlueprintClient";
import ArchetypesList from "./ArchetypesList";

export const metadata = {
  title: "Your Emotional Blueprint — AIForj",
  description:
    "A 2-minute clinician-designed assessment. Discover your stress archetype, thinking patterns, and which techniques match your brain. 100% private — nothing leaves your browser.",
  alternates: {
    canonical: "https://aiforj.com/blueprint",
  },
  openGraph: {
    title: "I just discovered my Emotional Blueprint — Take yours free",
    description:
      "A 2-minute clinician-designed assessment. Discover your stress archetype, thinking patterns, and which techniques match your brain.",
    url: "https://aiforj.com/blueprint",
    siteName: "AIForj",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "I just discovered my Emotional Blueprint — Take yours free",
    description:
      "A 2-minute clinician-designed assessment. Discover your stress archetype, thinking patterns, and which techniques match your brain.",
  },
};

const blueprintStructuredData = {
  "@context": "https://schema.org",
  "@type": "Quiz",
  name: "Emotional Blueprint Assessment",
  description: "A 2-minute clinician-designed assessment that reveals your stress archetype, thinking patterns, and which therapeutic techniques match your brain.",
  educationalLevel: "General",
  about: {
    "@type": "MedicalCondition",
    name: "Stress Response Patterns",
  },
  author: {
    "@type": "Person",
    name: "Kevin Cooke",
    jobTitle: "Board Certified Psychiatric Mental Health Nurse Practitioner",
  },
  publisher: {
    "@type": "Organization",
    name: "AIForj",
    url: "https://aiforj.com",
  },
  isAccessibleForFree: true,
  url: "https://aiforj.com/blueprint",
};

export default function BlueprintPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blueprintStructuredData) }}
      />
      <BlueprintClient />
      <ArchetypesList />
    </>
  );
}
