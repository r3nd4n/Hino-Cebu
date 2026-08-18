import type { MetadataRoute } from "next";
import { getRuntimeConfig } from "@/lib/runtime-config";
import { absoluteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const config = getRuntimeConfig();
  const crawlAllowed = config.target === "production" && config.crawlPolicy === "allowed";
  return {
    rules: crawlAllowed
      ? { userAgent: "*", allow: "/" }
      : { userAgent: "*", disallow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: config.siteOrigin,
  };
}
