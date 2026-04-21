import FindHelpPage from "../components/FindHelpPage";

export const metadata = {
  title: "Find a Therapist, Psychiatrist, or Psychiatric Prescriber Near You — AIForj",
  description: "Free provider finder tool. Search by insurance, specialty, and location for psychiatrists, psychologists, licensed healthcare providers, and therapists. Get a ready-to-use calling script, questions to ask, and affordable options if you're uninsured. 100% private. Built and clinically informed by Kevin, a clinician in psychiatric NP training.",
  alternates: {
    canonical: "https://aiforj.com/find-help",
  },
  openGraph: {
    title: "Find a Therapist, Psychiatrist, or Psychiatric Prescriber — AIForj",
    description: "Search by insurance, specialty, and location. Get pre-filtered results, a calling script, and affordable options. 100% private. Free.",
    url: "https://aiforj.com/find-help",
    siteName: "AIForj",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find a Therapist, Psychiatrist, or Psychiatric Prescriber — AIForj",
    description: "Search by insurance, specialty, and location. Pre-filtered results + calling script. 100% private. Free.",
  },
};

export default function Page() {
  return <FindHelpPage />;
}
