import { Suspense } from "react";
import BiophilicBackground from "../components/BiophilicBackground";
import SiteFooter from "../components/SiteFooter";
import SOS from "../components/SOS";
import RedeemFamilyClient from "./RedeemFamilyClient";
import { buildContentPageMetadata } from "../../lib/pageMetadata";

export const metadata = buildContentPageMetadata({
  title: "Redeem Your Tredici Family Plan Seat | Tredici",
  description:
    "Claim one Tredici Premium household seat and activate it on this device.",
  path: "/redeem-family",
  socialTitle: "Redeem Your Tredici Family Plan Seat",
  socialDescription:
    "Activate one private family-plan Premium seat on this device.",
  type: "article",
});

export default function Page() {
  return (
    <>
      <BiophilicBackground />
      <SOS />
      <Suspense fallback={null}>
        <RedeemFamilyClient />
      </Suspense>
      <SiteFooter />
    </>
  );
}
