import Script from "next/script";
import { buildMarketingTagBootstrap } from "@/lib/marketing-consent";

export function MarketingTags() {
  const bootstrap = buildMarketingTagBootstrap({
    gtmId: process.env.NEXT_PUBLIC_GTM_ID,
    ga4Id: process.env.NEXT_PUBLIC_GA4_ID,
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
  });

  return bootstrap
    ? <Script id="marketing-consent-gate" strategy="afterInteractive">{bootstrap}</Script>
    : null;
}
