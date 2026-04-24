import BlueprintClient from "./BlueprintClient";
import ArchetypesList from "./ArchetypesList";

export const metadata = {
  title: "Your Emotional Blueprint — AIForj",
  description:
    "A 2-minute self-reflection assessment. Discover your stress archetype, thinking patterns, and which self-guided techniques may fit you. Local-first and not a diagnosis.",
  alternates: {
    canonical: "https://aiforj.com/blueprint",
  },
  openGraph: {
    title: "I just discovered my Emotional Blueprint — Take yours free",
    description:
      "A 2-minute self-reflection. Discover a stress archetype, thinking patterns, and self-guided techniques that may fit you.",
    url: "https://aiforj.com/blueprint",
    siteName: "AIForj",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "I just discovered my Emotional Blueprint — Take yours free",
    description:
      "A 2-minute self-reflection. Discover a stress archetype, thinking patterns, and self-guided techniques that may fit you.",
  },
};

const blueprintStructuredData = {
  "@context": "https://schema.org",
  "@type": "Quiz",
  name: "Emotional Blueprint Assessment",
  description: "A 2-minute self-reflection that suggests a stress archetype, thinking patterns, and self-guided tools that may fit you.",
  educationalLevel: "General",
  about: {
    "@type": "Thing",
    name: "Stress response patterns",
  },
  author: {
    "@type": "Person",
    name: "Kevin",
    jobTitle: "Psychiatric Nurse Practitioner Candidate",
    url: "https://aiforj.com/about/founder",
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
