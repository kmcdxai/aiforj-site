import BlueprintClient from "./BlueprintClient";

export const metadata = {
  title: "Your Emotional Blueprint — AIForj",
  description:
    "A 2-minute clinician-designed assessment. Discover your stress archetype, thinking patterns, and which techniques match your brain. 100% private — nothing leaves your browser.",
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

export default function BlueprintPage() {
  return <BlueprintClient />;
}
