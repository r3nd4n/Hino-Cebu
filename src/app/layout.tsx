import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyMobileActions } from "@/components/layout/StickyMobileActions";
import { AttributionCapture } from "@/components/marketing/AttributionCapture";
import { MarketingTags } from "@/components/marketing/MarketingTags";
import { JsonLd } from "@/components/ui/Shared";
import { siteConfig } from "@/content/site";
import { absoluteUrl, getSiteOrigin } from "@/lib/site-url";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
  title: { default: "Hino Cebu | Trucks, Parts & Service in Cebu City", template: "%s" },
  description: siteConfig.description,
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const businessSchema = {
    "@context": "https://schema.org", "@type": ["Organization", "AutoDealer"], name: siteConfig.name,
    url: absoluteUrl("/"), telephone: siteConfig.phoneDisplay,
    address: { "@type": "PostalAddress", streetAddress: "377 P. Almendras Extension", addressLocality: "Cebu City", addressRegion: "Central Visayas", addressCountry: "PH" },
  };
  return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to main content</a><Header /><main id="main-content">{children}</main><Footer /><StickyMobileActions /><Suspense><AttributionCapture /></Suspense><MarketingTags /><JsonLd data={businessSchema} /></body></html>;
}
