import type { Metadata } from "next";
import { absoluteUrl, getSiteOrigin } from "@/lib/site-url";
import { getEligibleBranch } from "@/content/site";
import { getEligibleRoutes } from "@/lib/governance/eligibility";
import { getRuntimeConfig } from "@/lib/runtime-config";

type MetadataInput = {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
};

export function createMetadata({ title, description, path, noIndex = false }: MetadataInput): Metadata {
  const config = getRuntimeConfig();
  const eligibleRoutes = getEligibleRoutes()
    .filter(({ status }) => status.startsWith("eligible"));
  const pathEligible = path === "/"
    ? eligibleRoutes.length > 0
    : eligibleRoutes.some((route) => (
      route.path === path
      || (route.path === "/trucks" && path.startsWith("/trucks/"))
    ));
  const indexAllowed = pathEligible
    && !noIndex
    && config.target === "production"
    && config.crawlPolicy === "allowed";

  if (!pathEligible) {
    return { robots: { index: false, follow: false, noarchive: true } };
  }

  const canonical = absoluteUrl(path);
  const branch = getEligibleBranch();
  return {
    metadataBase: new URL(getSiteOrigin()),
    title,
    description,
    alternates: { canonical },
    robots: indexAllowed
      ? { index: true, follow: true }
      : { index: false, follow: false, noarchive: true },
    openGraph: {
      type: "website",
      locale: "en_PH",
      ...(branch.identity ? { siteName: branch.identity } : {}),
      title,
      description,
      url: canonical,
      images: [{ url: absoluteUrl("/social-card.svg"), width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [absoluteUrl("/social-card.svg")] },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  const eligibleRoutes = getEligibleRoutes()
    .filter(({ status }) => status.startsWith("eligible"));
  const hasPublicHome = eligibleRoutes.length > 0;
  const eligibleItems = items.filter(({ path }) => (
    (path === "/" && hasPublicHome)
    || eligibleRoutes.some((route) => (
      route.path === path
      || (route.path === "/trucks" && path.startsWith("/trucks/"))
    ))
  ));

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: eligibleItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
