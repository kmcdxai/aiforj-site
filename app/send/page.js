import { buildContentPageMetadata } from "../../lib/pageMetadata";
import SendClient from "./SendClient";

export const metadata = buildContentPageMetadata({
  title: "Send Calm to Someone You Care About — AIForj",
  description:
    "Choose a clinician-designed technique and send a personal link. When they open it, they'll see your message and a guided tool. Free and private.",
  path: "/send",
  socialTitle: "Send Calm to Someone You Care About",
  socialDescription:
    "Choose a clinician-designed technique and send a personal link. Free, private, evidence-based.",
  type: "website",
});

export default function SendPage() {
  return <SendClient />;
}
