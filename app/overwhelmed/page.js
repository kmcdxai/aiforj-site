import OverwhelmedPage from "../components/OverwhelmedPage";

export const metadata = {
  title: "Feeling Overwhelmed? Too Much to Handle? — Talk to Forj | Free AI Wellness",
  description: "When everything is too much, this 5-step protocol helps you slow down and find ground. Breathe, externalize, triage, accept, commit. Evidence-based. 100% private. Free. Built by AIForj Team and clinically informed by a Licensed Healthcare Provider.",
  alternates: {
    canonical: "https://aiforj.com/overwhelmed",
  },
  openGraph: {
    title: "Feeling Overwhelmed? Too Much to Handle? — Talk to Forj",
    description: "When everything is too much, this protocol helps you slow down. Breathe, externalize, triage, accept, commit. Evidence-based. 100% private. Free.",
    url: "https://aiforj.com/overwhelmed",
    siteName: "AIForj",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Feeling Overwhelmed? Too Much to Handle? — Talk to Forj",
    description: "When everything is too much, this protocol helps you slow down. Evidence-based. 100% private. Free.",
  },
};

export default function Page() {
  return <OverwhelmedPage />;
}
