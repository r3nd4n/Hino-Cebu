import {
  getGovernedClaims,
  getGovernedRoutes,
  type GovernedClaim,
  type GovernedRoute,
} from "./governance/claims";
import { getEligibleRoutes } from "../lib/governance/eligibility";

export type Campaign = {
  routeId: string; claimIds: string[];
  slug: string; eyebrow: string; title: string; summary: string; benefits: string[];
  modelInterest: string; leadType: "sales" | "service" | "parts" | "financing"; index: boolean;
};

const campaignCatalog: readonly Campaign[] = [
  {
    routeId: "ROUTE-CAMPAIGN-HINO-300",
    claimIds: ["CLAIM-CAMPAIGN-HINO-300"],
    slug: "hino-300-cebu",
    eyebrow: "Hino 300 in Cebu",
    title: "Start the Hino 300 conversation for your business",
    summary: "Tell Hino Cebu how you plan to use your truck. The team can help review the model family and configuration without assuming final technical suitability.",
    benefits: ["Application-focused consultation", "Parts and service inquiry pathways", "Financing-intent support"],
    modelInterest: "Hino 300",
    leadType: "sales",
    index: false,
  },
];

export function getEligibleCampaignRoutes(
  now = new Date(),
  records: readonly Campaign[] = campaignCatalog,
  routes: readonly GovernedRoute[] = getGovernedRoutes(),
  claims: readonly GovernedClaim[] = getGovernedClaims(),
) {
  const finalRoutes = new Map(
    getEligibleRoutes(now, routes, claims).map((route) => [route.routeId, route]),
  );
  const routesById = new Map(routes.map((route) => [route.routeId, route]));

  return records.flatMap((campaign) => {
    const route = routesById.get(campaign.routeId);
    const finalRoute = finalRoutes.get(campaign.routeId);
    if (
      !route
      || !finalRoute
      || !finalRoute.status.startsWith("eligible")
      || route.path !== `/lp/${campaign.slug}`
      || campaign.claimIds.length === 0
      || !campaign.claimIds.every((claimId) => route.optionalClaimIds.includes(claimId))
    ) return [];

    return [{
      ...campaign,
      benefits: finalRoute.status === "eligible" ? campaign.benefits : [],
    }];
  });
}

export function getEligibleCampaignRoute(
  slug: string,
  now = new Date(),
  records: readonly Campaign[] = campaignCatalog,
  routes: readonly GovernedRoute[] = getGovernedRoutes(),
  claims: readonly GovernedClaim[] = getGovernedClaims(),
) {
  return getEligibleCampaignRoutes(now, records, routes, claims)
    .find((campaign) => campaign.slug === slug);
}

export const campaigns = getEligibleCampaignRoutes();
