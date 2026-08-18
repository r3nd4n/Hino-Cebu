import type { MetadataRoute } from "next";
import { campaigns } from "@/content/campaigns";
import { trucks } from "@/content/trucks";
import { absoluteUrl } from "@/lib/site-url";
export default function sitemap(): MetadataRoute.Sitemap { const routes = ["", "/trucks", ...trucks.map((truck) => `/trucks/${truck.slug}`), "/find-your-truck", "/parts", "/service", "/fleet", "/financing", "/promotions", "/hino-cebu", "/hino-cebu/customer-deliveries", "/guides", "/contact", "/quote", "/privacy", "/terms", ...campaigns.filter((campaign) => campaign.index).map((campaign) => `/lp/${campaign.slug}`)]; return routes.map((route) => ({ url: absoluteUrl(route || "/"), changeFrequency: route === "" ? "weekly" : "monthly", priority: route === "" ? 1 : route.startsWith("/trucks") ? .8 : .6 })); }
