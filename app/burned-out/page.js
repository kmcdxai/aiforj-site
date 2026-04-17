import BurnedOutPage from "../components/BurnedOutPage";

export const metadata = {
  title: "Burned Out? Emotionally Exhausted? — Talk to Forj | Free AI Wellness",
  description: "Burnout isn't laziness. This guided burnout check-in helps you audit your energy, reconnect your values, set boundaries, and start micro-recovery. 100% private. Free. Built by AIForj Team and clinically informed by a Licensed Healthcare Provider.",
  alternates: {
    canonical: "https://aiforj.com/burned-out",
  },
  openGraph: {
    title: "Burned Out? Emotionally Exhausted? — Talk to Forj",
    description: "Burnout isn't laziness. Guided burnout check-in + recovery protocol. Evidence-informed. 100% private. Free. Built by AIForj Team and clinically informed by a Licensed Healthcare Provider.",
    url: "https://aiforj.com/burned-out",
    siteName: "AIForj",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Burned Out? Emotionally Exhausted? — Talk to Forj",
    description: "Burnout isn't laziness. Guided burnout check-in + recovery protocol. Evidence-informed. 100% private. Free.",
  },
};

export default function Page() {
  return <BurnedOutPage />;
}
