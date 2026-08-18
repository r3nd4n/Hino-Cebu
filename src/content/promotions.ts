import {
  getGovernedClaims,
  getGovernedRoutes,
  type GovernedClaim,
  type GovernedRoute,
} from "./governance/claims";
import { getEligibleClaims, getEligibleRoutes } from "../lib/governance/eligibility";

export type Promotion = {
  routeId: string; claimIds: string[];
  slug: string; title: string; summary: string; startDate?: string; endDate?: string;
  applicableModels?: string[]; terms?: string[]; ctaLabel: string; ctaHref: string;
};

const promotionCatalog: readonly Promotion[] = [];

export function getEligiblePromotions(
  now = new Date(),
  records: readonly Promotion[] = promotionCatalog,
  routes: readonly GovernedRoute[] = getGovernedRoutes(),
  claims: readonly GovernedClaim[] = getGovernedClaims(),
) {
  const eligibleRouteIds = new Set(
    getEligibleRoutes(now, routes, claims)
      .filter(({ status }) => status.startsWith("eligible"))
      .map(({ routeId }) => routeId),
  );
  const eligibleClaimIds = new Set(getEligibleClaims("surface:promotions", now, claims).map(({ claimId }) => claimId));

  return records.filter((promotion) => {
    if (!eligibleRouteIds.has(promotion.routeId)) return false;
    if (promotion.claimIds.length === 0 || !promotion.claimIds.every((claimId) => eligibleClaimIds.has(claimId))) return false;
    if (promotion.startDate && (!Number.isFinite(Date.parse(promotion.startDate)) || new Date(promotion.startDate) > now)) return false;
    if (promotion.endDate && (!Number.isFinite(Date.parse(promotion.endDate)) || new Date(promotion.endDate) <= now)) return false;
    return true;
  });
}

export const activePromotions = getEligiblePromotions;
