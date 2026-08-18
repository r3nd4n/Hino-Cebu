import type { Metadata } from "next";
import { Suspense } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header, type ShellContactAction, type ShellNavigationItem } from "@/components/layout/Header";
import { StickyMobileActions } from "@/components/layout/StickyMobileActions";
import { AttributionCapture } from "@/components/marketing/AttributionCapture";
import { MarketingTags } from "@/components/marketing/MarketingTags";
import { JsonLd } from "@/components/ui/Shared";
import { siteConfig, getEligibleBranch, getEligibleContactActions } from "@/content/site";
import { getEligibleRoutes } from "@/lib/governance/eligibility";
import { absoluteUrl, getSiteOrigin } from "@/lib/site-url";

const navigationLabels: Readonly<Record<string, string>> = {
  "ROUTE-TRUCKS": "Trucks",
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
  title: { default: "Hino Cebu | Trucks, Parts & Service in Cebu City", template: "%s" },
  description: siteConfig.description,
  icons: { icon: "/favicon.svg" },
};

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const eligibleBranch = getEligibleBranch();
  const navigation: ShellNavigationItem[] = getEligibleRoutes().flatMap((route) => {
    const label = navigationLabels[route.routeId];
    if (route.status === "withheld" || !label) return [];
    return [{ navigationId: route.routeId, label, href: route.path }];
  });
  const contactActions: ShellContactAction[] = getEligibleContactActions().map((action) => ({
    actionId: action.actionId,
    kind: action.kind,
    label: action.label,
    href: action.href,
  }));
  const branch = {
    ...(eligibleBranch.identity ? { identity: eligibleBranch.identity } : {}),
    ...(eligibleBranch.address ? { address: eligibleBranch.address } : {}),
  };
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

  return <><a className="skip-link" href="#main-content">Skip to main content</a><Header navigation={navigation} contactActions={contactActions} branch={branch} /><main id="main-content">{children}</main><Footer navigation={navigation} contactActions={contactActions} branch={branch} /><StickyMobileActions navigation={navigation} contactActions={contactActions} /><Suspense><AttributionCapture /></Suspense><MarketingTags />{eligibleBranch.identity ? <JsonLd data={organizationSchema} /> : null}</>;
}
