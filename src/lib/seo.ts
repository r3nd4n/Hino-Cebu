import type { Metadata } from "next";
import { absoluteUrl, getSiteOrigin } from "@/lib/site-url";
import { siteConfig } from "@/content/site";

type MetadataInput = {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
};

export function createMetadata({ title, description, path, noIndex = false }: MetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  return {
    metadataBase: new URL(getSiteOrigin()),
    title,
    description,
    alternates: { canonical },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "en_PH",
      siteName: siteConfig.name,
      title,
      description,
      url: canonical,
      images: [{ url: absoluteUrl("/social-card.svg"), width: 1200, height: 630, alt: siteConfig.tagline }],
    },
    twitter: { card: "summary_large_image", title, description, images: [absoluteUrl("/social-card.svg")] },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
