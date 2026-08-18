import {
  getGovernedClaims,
  getGovernedRoutes,
  type GovernedClaim,
  type GovernedRoute,
} from "./governance/claims";
import { getEligibleClaims, getEligibleRoutes } from "../lib/governance/eligibility";

export type DeliveryStory = {
  routeId: string;
  claimIds: string[];
  slug: string;
  title: string;
  customer: string;
  summary: string;
  imageSrc?: string;
  imageAlt?: string;
};

const deliveryCatalog: readonly DeliveryStory[] = [];

export function getEligibleDeliveries(
  now = new Date(),
  records: readonly DeliveryStory[] = deliveryCatalog,
  routes: readonly GovernedRoute[] = getGovernedRoutes(),
  claims: readonly GovernedClaim[] = getGovernedClaims(),
) {
  const eligibleRouteIds = new Set(
    getEligibleRoutes(now, routes, claims)
      .filter(({ status }) => status.startsWith("eligible"))
      .map(({ routeId }) => routeId),
  );
  const eligibleClaimIds = new Set(
    getEligibleClaims("surface:customer-deliveries", now, claims).map(({ claimId }) => claimId),
  );

  return records.filter(({ routeId, claimIds }) => (
    eligibleRouteIds.has(routeId)
    && claimIds.length > 0
    && claimIds.every((claimId) => eligibleClaimIds.has(claimId))
  ));
}

export const deliveries = getEligibleDeliveries();
