import {
  getGovernedClaims,
  getGovernedRoutes,
  type GovernedClaim,
  type GovernedRoute,
} from "./governance/claims";
import { getEligibleClaims, getEligibleRoutes } from "../lib/governance/eligibility";

export type Guide = {
  routeId: string;
  claimIds: string[];
  slug: string;
  title: string;
  category: string;
  summary: string;
};

const guideCatalog: readonly Guide[] = [
  { routeId: "ROUTE-GUIDES", claimIds: ["CLAIM-GUIDE-CHOOSING"], slug: "choosing-a-truck-for-your-business", title: "Questions to Ask Before Choosing a Business Truck", category: "Buying guide", summary: "A practical starting list covering cargo, payload, body, routes, and operational support." },
  { routeId: "ROUTE-GUIDES", claimIds: ["CLAIM-GUIDE-MAINTENANCE"], slug: "planning-commercial-truck-maintenance", title: "Planning Commercial Truck Maintenance", category: "Maintenance guide", summary: "How records, inspections, and a confirmed service plan can support a more organized operation." },
  { routeId: "ROUTE-GUIDES", claimIds: ["CLAIM-GUIDE-DUTY-CLASS"], slug: "light-duty-vs-medium-duty", title: "Light-Duty or Medium-Duty: Where to Start", category: "Buying guide", summary: "Understand the operational questions that should guide an informed model-family conversation." },
];

export function getEligibleGuides(
  now = new Date(),
  records: readonly Guide[] = guideCatalog,
  routes: readonly GovernedRoute[] = getGovernedRoutes(),
  claims: readonly GovernedClaim[] = getGovernedClaims(),
) {
  const eligibleRouteIds = new Set(
    getEligibleRoutes(now, routes, claims)
      .filter(({ status }) => status.startsWith("eligible"))
      .map(({ routeId }) => routeId),
  );
  const eligibleClaimIds = new Set(getEligibleClaims("surface:guides", now, claims).map(({ claimId }) => claimId));

  return records.filter(({ routeId, claimIds }) => (
    eligibleRouteIds.has(routeId)
    && claimIds.length > 0
    && claimIds.every((claimId) => eligibleClaimIds.has(claimId))
  ));
}

export const guides = getEligibleGuides();
