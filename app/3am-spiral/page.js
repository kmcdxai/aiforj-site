import ThreeAMSpiral from "../components/ThreeAMSpiral";

export const metadata = {
  title: "Can't Sleep? Mind Racing at 3AM? — Talk to Forj | Free AI Wellness",
  description: "When your brain won't shut up at 3am, Forj helps you break the loop. 5-step evidence-based protocol: breathing, thought dump, cognitive shuffle, body scan, reality anchoring. 100% private. Free. Built by a Board Certified PMHNP.",
  alternates: {
    canonical: "https://aiforj.com/3am-spiral",
  },
  openGraph: {
    title: "Can't Sleep? Mind Racing at 3AM? — Talk to Forj",
    description: "When your brain won't stop at 3am, this 5-step protocol breaks the spiral. Evidence-based. 100% private. Free. Built by a Board Certified PMHNP.",
    url: "https://aiforj.com/3am-spiral",
    siteName: "AIForj",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Can't Sleep? Mind Racing at 3AM? — Talk to Forj",
    description: "When your brain won't stop at 3am, this 5-step protocol breaks the spiral. Evidence-based. 100% private. Free.",
  },
};

export default function Page() {
  return <ThreeAMSpiral />;
}
