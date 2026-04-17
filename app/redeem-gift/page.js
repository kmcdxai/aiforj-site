import { Suspense } from "react";
import BiophilicBackground from "../components/BiophilicBackground";
import SiteFooter from "../components/SiteFooter";
import SOS from "../components/SOS";
import RedeemGiftClient from "./RedeemGiftClient";
import { buildContentPageMetadata } from "../../lib/pageMetadata";

export const metadata = buildContentPageMetadata({
  title: "Redeem Your AIForj Premium Gift | AIForj",
  description:
    "Redeem a one-time AIForj Premium gift link and activate one month of Premium support on this device.",
  path: "/redeem-gift",
  socialTitle: "Redeem Your AIForj Premium Gift",
  socialDescription:
    "Activate your one-month Premium gift on this device.",
  type: "article",
});

export default function Page() {
  return (
    <>
      <BiophilicBackground />
      <SOS />
      <Suspense fallback={null}>
        <RedeemGiftClient />
      </Suspense>
      <SiteFooter />
    </>
  );
}
