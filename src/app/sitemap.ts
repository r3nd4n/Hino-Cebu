import type { MetadataRoute } from "next";
import { getEligibleCampaignRoutes } from "@/content/campaigns";
import { getEligibleTrucks } from "@/content/trucks";
import { getEligibleRoutes } from "@/lib/governance/eligibility";
import { absoluteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const eligibleRoutes = getEligibleRoutes()
    .filter(({ status }) => status.startsWith("eligible"));
  const paths = new Set(eligibleRoutes.map(({ path }) => path));

  if (eligibleRoutes.length > 0) paths.add("/");
  for (const truck of getEligibleTrucks()) paths.add(`/trucks/${truck.slug}`);
  for (const campaign of getEligibleCampaignRoutes()) {
    if (campaign.index) paths.add(`/lp/${campaign.slug}`);
  }

  return Array.from(paths, (path) => ({
    url: absoluteUrl(path),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/trucks") ? 0.8 : 0.6,
  }));
}
