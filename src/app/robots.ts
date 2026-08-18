import type { MetadataRoute } from "next";
import { getEligibleRoutes } from "@/lib/governance/eligibility";
import { getRuntimeConfig } from "@/lib/runtime-config";
import { absoluteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const config = getRuntimeConfig();
  const hasDiscoverableRoutes = getEligibleRoutes()
    .some(({ status }) => status.startsWith("eligible"));
  const crawlAllowed = config.target === "production"
    && config.crawlPolicy === "allowed"
    && hasDiscoverableRoutes;
  return {
    rules: crawlAllowed
      ? { userAgent: "*", allow: "/" }
      : { userAgent: "*", disallow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: config.siteOrigin,
  };
}
