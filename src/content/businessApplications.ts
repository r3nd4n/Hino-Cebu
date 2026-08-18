import {
  getGovernedClaims,
  getGovernedRoutes,
  type GovernedClaim,
  type GovernedRoute,
} from "./governance/claims";
import { getEligibleClaims, getEligibleRoutes } from "../lib/governance/eligibility";

export type BusinessApplication = {
  routeId: string;
  claimIds: string[];
  title: string;
  description: string;
};

const businessApplicationCatalog: readonly BusinessApplication[] = [
  { routeId: "ROUTE-TRUCKS", claimIds: ["CLAIM-APPLICATION-LOGISTICS"], title: "Logistics", description: "Move goods across daily delivery and distribution routes." },
  { routeId: "ROUTE-TRUCKS", claimIds: ["CLAIM-APPLICATION-CONSTRUCTION"], title: "Construction", description: "Plan a truck and body around materials, equipment, and work sites." },
  { routeId: "ROUTE-TRUCKS", claimIds: ["CLAIM-APPLICATION-DELIVERY"], title: "Delivery", description: "Match urban routes, cargo, and stop frequency to a practical platform." },
  { routeId: "ROUTE-TRUCKS", claimIds: ["CLAIM-APPLICATION-FOOD-BEVERAGE"], title: "Food & Beverage", description: "Discuss dry, chilled, and route-distribution application needs." },
  { routeId: "ROUTE-TRUCKS", claimIds: ["CLAIM-APPLICATION-AGRICULTURE"], title: "Agriculture", description: "Review cargo, road conditions, and body requirements for farm operations." },
  { routeId: "ROUTE-TRUCKS", claimIds: ["CLAIM-APPLICATION-RETAIL-WHOLESALE"], title: "Retail / Wholesale", description: "Support replenishment and distribution across growing operations." },
  { routeId: "ROUTE-TRUCKS", claimIds: ["CLAIM-APPLICATION-FLEET"], title: "Fleet", description: "Plan acquisition or replacement around broader operational priorities." },
];

export function getEligibleBusinessApplications(
  now = new Date(),
  records: readonly BusinessApplication[] = businessApplicationCatalog,
  routes: readonly GovernedRoute[] = getGovernedRoutes(),
  claims: readonly GovernedClaim[] = getGovernedClaims(),
) {
  const eligibleRouteIds = new Set(
    getEligibleRoutes(now, routes, claims)
      .filter(({ status }) => status.startsWith("eligible"))
      .map(({ routeId }) => routeId),
  );
  const eligibleClaimIds = new Set(
    getEligibleClaims("surface:business-applications", now, claims).map(({ claimId }) => claimId),
  );

  return records.filter(({ routeId, claimIds }) => (
    eligibleRouteIds.has(routeId)
    && claimIds.length > 0
    && claimIds.every((claimId) => eligibleClaimIds.has(claimId))
  ));
}

export const businessApplications = getEligibleBusinessApplications();
