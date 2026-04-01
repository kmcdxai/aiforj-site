import SendClient from "./SendClient";

export const metadata = {
  title: "Send Calm to Someone You Care About — AIForj",
  description:
    "Choose a clinician-designed technique and send a personal link. When they open it, they'll see your message and a guided tool. Free and private.",
  openGraph: {
    title: "Send Calm to Someone You Care About",
    description:
      "Choose a clinician-designed technique and send a personal link. Free, private, evidence-based.",
    url: "https://aiforj.com/send",
    siteName: "AIForj",
    type: "website",
  },
};

export default function SendPage() {
  return <SendClient />;
}
