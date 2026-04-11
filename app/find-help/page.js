import FindHelpPage from "../components/FindHelpPage";

export const metadata = {
  title: "Find a Therapist, Psychiatrist, or Licensed Healthcare Provider Near You — AIForj",
  description: "Free provider finder tool. Search by insurance, specialty, and location for psychiatrists, psychologists, licensed healthcare providers, and therapists. Get a ready-to-use calling script, questions to ask, and affordable options if you're uninsured. 100% private. Built by AIForj Team and clinically informed by a Licensed Healthcare Provider.",
  alternates: {
    canonical: "https://aiforj.com/find-help",
  },
  openGraph: {
    title: "Find a Therapist, Psychiatrist, or Licensed Healthcare Provider — AIForj",
    description: "Search by insurance, specialty, and location. Get pre-filtered results, a calling script, and affordable options. 100% private. Free.",
    url: "https://aiforj.com/find-help",
    siteName: "AIForj",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find a Therapist, Psychiatrist, or Licensed Healthcare Provider — AIForj",
    description: "Search by insurance, specialty, and location. Pre-filtered results + calling script. 100% private. Free.",
  },
};

export default function Page() {
  return <FindHelpPage />;
}
