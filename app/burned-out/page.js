import BurnedOutPage from "../components/BurnedOutPage";

export const metadata = {
  title: "Burned Out? Emotionally Exhausted? — Talk to Forj | Free AI Wellness",
  description: "Burnout isn't laziness. This protocol uses the Maslach framework to assess your burnout, audit your energy, reconnect your values, set boundaries, and start micro-recovery. 100% private. Free. Built by Kevin Cooke, PMHNP-BC.",
  alternates: {
    canonical: "https://aiforj.com/burned-out",
  },
  openGraph: {
    title: "Burned Out? Emotionally Exhausted? — Talk to Forj",
    description: "Burnout isn't laziness. Clinical burnout assessment + recovery protocol. Evidence-based. 100% private. Free. Built by Kevin Cooke, PMHNP-BC.",
    url: "https://aiforj.com/burned-out",
    siteName: "AIForj",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Burned Out? Emotionally Exhausted? — Talk to Forj",
    description: "Burnout isn't laziness. Clinical burnout assessment + recovery protocol. Evidence-based. 100% private. Free.",
  },
};

export default function Page() {
  return <BurnedOutPage />;
}
