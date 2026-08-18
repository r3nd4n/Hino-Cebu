import type { Metadata } from "next";
import { Suspense } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { StickyMobileActions } from "@/components/layout/StickyMobileActions";
import { AttributionCapture } from "@/components/marketing/AttributionCapture";
import { MarketingTags } from "@/components/marketing/MarketingTags";
import { JsonLd } from "@/components/ui/Shared";
import { siteConfig, getEligibleBranch } from "@/content/site";
import { absoluteUrl, getSiteOrigin } from "@/lib/site-url";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
  title: { default: "Hino Cebu | Trucks, Parts & Service in Cebu City", template: "%s" },
  description: siteConfig.description,
  icons: { icon: "/favicon.svg" },
};

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const eligibleBranch = getEligibleBranch();
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "AutoDealer"],
    url: absoluteUrl("/"),
    ...(eligibleBranch.identity ? { name: eligibleBranch.identity } : {}),
    ...(eligibleBranch.phone ? { telephone: eligibleBranch.phone } : {}),
    ...(eligibleBranch.address ? {
      address: { "@type": "PostalAddress", streetAddress: eligibleBranch.address },
    } : {}),
  };

  return <><a className="skip-link" href="#main-content">Skip to main content</a><Header /><main id="main-content">{children}</main><Footer /><StickyMobileActions /><Suspense><AttributionCapture /></Suspense><MarketingTags /><JsonLd data={organizationSchema} /></>;
}
