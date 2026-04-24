import FindHelpPage from "../components/FindHelpPage";

export const metadata = {
  title: "Find a Therapist, Psychiatrist, or Psychiatric Prescriber Near You — AIForj",
  description: "Free provider search bridge. Search by insurance, specialty, and location for psychiatrists, psychologists, psychiatric prescribers, counselors, and therapists. Get a calling script, questions to ask, and affordable options.",
  alternates: {
    canonical: "https://aiforj.com/find-help",
  },
  openGraph: {
    title: "Find a Therapist, Psychiatrist, or Psychiatric Prescriber — AIForj",
    description: "Search by insurance, specialty, and location. Get pre-filtered results, a calling script, and affordable options. Provider searches are not stored server-side by default.",
    url: "https://aiforj.com/find-help",
    siteName: "AIForj",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find a Therapist, Psychiatrist, or Psychiatric Prescriber — AIForj",
    description: "Search by insurance, specialty, and location. Pre-filtered results and calling script. Free.",
  },
};

export default function Page() {
  return <FindHelpPage />;
}
