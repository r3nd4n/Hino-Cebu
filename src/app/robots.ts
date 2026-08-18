import type { MetadataRoute } from "next";
import { absoluteUrl, getSiteOrigin } from "@/lib/site-url";
export default function robots(): MetadataRoute.Robots { const productionOriginConfigured = Boolean(process.env.NEXT_PUBLIC_SITE_URL); return { rules: productionOriginConfigured ? { userAgent: "*", allow: "/" } : { userAgent: "*", disallow: "/" }, sitemap: absoluteUrl("/sitemap.xml"), host: getSiteOrigin() }; }
