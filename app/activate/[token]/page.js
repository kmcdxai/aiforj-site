import ActivateClient from "./ActivateClient";

export const metadata = {
  title: "Activate Premium | Tredici",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ActivatePage({ params }) {
  return <ActivateClient token={params.token} />;
}
