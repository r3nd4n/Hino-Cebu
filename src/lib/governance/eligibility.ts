import {
  governedClaimSchema,
  governedRouteSchema,
  getGovernedClaims,
  getGovernedRoutes,
  type ClaimCategory,
  type GovernedClaim,
  type GovernedRoute,
} from "../../content/governance/claims";
import { isApprovalCurrent } from "./schemas";

export type EligibleClaim = Pick<GovernedClaim, "claimId" | "category" | "value">;
export type RouteEligibilityStatus = "eligible" | "eligible-reduced" | "withheld";

const minimumCategories = ["identity", "purpose", "request-semantics", "contact-action"] as const;

export function evaluateApproval(input: unknown, now = new Date()) {
  const result = governedClaimSchema.safeParse(input);
  if (!result.success) return false;
  const claim = result.data;
  if (claim.locality !== "cebu") return false;
  if (claim.revision !== claim.activeRevision) return false;
  return isApprovalCurrent(claim.approval, claim.ownerLane, now);
}

export function getEligibleClaims(
  surfaceId: string,
  now = new Date(),
  records: readonly GovernedClaim[] = getGovernedClaims(),
): EligibleClaim[] {
  return records.flatMap((input) => {
    const result = governedClaimSchema.safeParse(input);
    if (!result.success || result.data.surfaceId !== surfaceId || !evaluateApproval(result.data, now)) return [];
    const { claimId, category, value } = result.data;
    return [{ claimId, category, value }];
  });
}

export function getEligibleRoutes(
  now = new Date(),
  routes: readonly GovernedRoute[] = getGovernedRoutes(),
  claims: readonly GovernedClaim[] = getGovernedClaims(),
) {
  const claimsById = new Map(claims.map((claim) => [claim.claimId, claim]));

  return routes.flatMap((input) => {
    const parsed = governedRouteSchema.safeParse(input);
    if (!parsed.success) return [];
    const route = parsed.data;
    const isEligibleForRoute = (claimId: string, category?: ClaimCategory) => {
      const claim = claimsById.get(claimId);
      return Boolean(
        claim
        && claim.surfaceId === route.surfaceId
        && (!category || claim.category === category)
        && evaluateApproval(claim, now),
      );
    };
    const checks = {
      identity: isEligibleForRoute(route.minimumTruth.identity, "identity"),
      purpose: isEligibleForRoute(route.minimumTruth.purpose, "purpose"),
      requestSemantics: isEligibleForRoute(route.minimumTruth.requestSemantics, "request-semantics"),
      contactAction: isEligibleForRoute(route.minimumTruth.contactAction, "contact-action"),
    };
    const minimumEligible = Object.values(checks).every(Boolean);
    const withheldOptional = route.optionalClaimIds.filter((claimId) => !isEligibleForRoute(claimId));
    const status: RouteEligibilityStatus = !minimumEligible
      ? "withheld"
      : withheldOptional.length > 0
        ? "eligible-reduced"
        : "eligible";
    const retainedCategories = minimumCategories.filter((category) => checks[category === "request-semantics" ? "requestSemantics" : category === "contact-action" ? "contactAction" : category]);
    const withheldCategories = Array.from(new Set([
      ...minimumCategories.filter((category) => !retainedCategories.includes(category)),
      ...withheldOptional.map((claimId) => claimsById.get(claimId)?.category).filter((category): category is ClaimCategory => Boolean(category)),
    ]));

    return [{
      routeId: route.routeId,
      path: route.path,
      status,
      checks,
      retainedCategories,
      withheldCategories,
      serveUnavailablePage: status === "withheld" && route.unavailablePage,
    }];
  });
}
