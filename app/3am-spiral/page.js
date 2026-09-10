import ThreeAMSpiral from "../components/ThreeAMSpiral";
import ForceDarkTheme from "./ForceDarkTheme";

export const metadata = {
  title: "Can't Sleep? Mind Racing at 3AM? — Wellness companion | Free AI Wellness",
  description: "When your brain won't settle at 3am, Tredici helps you break the loop with breathing, thought dump, cognitive shuffle, body relaxation, and reality anchoring. Local-first and free.",
  alternates: {
    canonical: "https://aiforj.com/3am-spiral",
  },
  openGraph: {
    title: "Can't Sleep? Mind Racing at 3AM? — Wellness companion",
    description: "When your brain won't stop at 3am, this structured protocol helps break the spiral. Evidence-informed, local-first, and free.",
    url: "https://aiforj.com/3am-spiral",
    siteName: "Tredici",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Can't Sleep? Mind Racing at 3AM? — Wellness companion",
    description: "When your brain won't stop at 3am, this structured protocol helps break the spiral. Evidence-informed, local-first, and free.",
  },
};

export default function Page() {
  return (
    <>
      <ForceDarkTheme />
      <ThreeAMSpiral />
    </>
  );
}
