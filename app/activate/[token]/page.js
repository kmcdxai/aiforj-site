import ActivateClient from "./ActivateClient";

export const metadata = {
  title: "Activate Premium | AIForj",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ActivatePage({ params }) {
  return <ActivateClient token={params.token} />;
}
