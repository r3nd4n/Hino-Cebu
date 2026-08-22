import type { Metadata } from "next";
import { Suspense } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header, type ShellContactAction, type ShellNavigationItem } from "@/components/layout/Header";
import { StickyMobileActions } from "@/components/layout/StickyMobileActions";
import { AttributionCapture } from "@/components/marketing/AttributionCapture";
import { MarketingTags } from "@/components/marketing/MarketingTags";
import { JsonLd } from "@/components/ui/Shared";
import { siteConfig, getEligibleBranch, getEligibleContactActions, getEligibleSocialProfiles } from "@/content/site";
import { getEligibleRoutes } from "@/lib/governance/eligibility";
import { getPublicShellLegalNavigation, getPublicShellNavigation } from "@/lib/governance/public-shell";
import { absoluteUrl, getSiteOrigin } from "@/lib/site-url";

const canonicalNavigationLabels = new Set([
  "Trucks",
  "Find Your Truck",
  "Parts",
  "Service",
  "Hino Cebu",
  "Get a Quote",
]);

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
  title: { default: "Hino Cebu | Trucks, Parts & Service in Cebu City", template: "%s" },
  description: siteConfig.description,
  icons: { icon: "/favicon.svg" },
};

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const now = new Date();
  const eligibleRoutes = getEligibleRoutes(now);
  const eligibleBranch = getEligibleBranch(now);
  const navigation: ShellNavigationItem[] = getPublicShellNavigation(now)
    .filter(({ label, href }) => canonicalNavigationLabels.has(label) && (
      href === "/find-your-truck"
      || href === "/hino-cebu"
      || eligibleRoutes.some((route) => route.path === href && route.status !== "withheld")
    ));
  const contactActions: ShellContactAction[] = getEligibleContactActions(now).map((action) => ({
    actionId: action.actionId,
    kind: action.kind,
    label: action.label,
    href: action.href,
  }));
  const branch = {
    ...(eligibleBranch.identity ? { identity: eligibleBranch.identity } : {}),
    ...(eligibleBranch.address ? { address: eligibleBranch.address } : {}),
    ...(eligibleBranch.phone ? { phone: eligibleBranch.phone } : {}),
    ...(eligibleBranch.hours ? { hours: eligibleBranch.hours } : {}),
  };
  const legalNavigation = getPublicShellLegalNavigation(now);
  const socialProfiles = getEligibleSocialProfiles(now);
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

  return <><a className="skip-link" href="#main-content">Skip to main content</a><Header navigation={navigation} contactActions={contactActions} branch={branch} /><main id="main-content">{children}</main><Footer navigation={navigation} legalNavigation={legalNavigation} socialProfiles={socialProfiles} contactActions={contactActions} branch={branch} /><StickyMobileActions navigation={navigation} contactActions={contactActions} /><Suspense><AttributionCapture /></Suspense><MarketingTags />{eligibleBranch.identity ? <JsonLd data={organizationSchema} /> : null}</>;
}
