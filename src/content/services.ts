import {
  getGovernedClaims,
  getGovernedRoutes,
  type GovernedClaim,
  type GovernedRoute,
} from "./governance/claims";
import { evaluateApproval, getEligibleRoutes } from "../lib/governance/eligibility";

export type SupportService = {
  routeId: string;
  claimIds: readonly string[];
  title: string;
  description: string;
  href: string;
  cta: string;
};

const supportServiceCatalog: readonly SupportService[] = [
  { routeId: "ROUTE-TRUCKS", claimIds: ["CLAIM-SERVICE-SALES"], title: "Sales", description: "Compare model families and discuss the application your operation needs.", href: "/trucks", cta: "Explore trucks" },
  { routeId: "ROUTE-SERVICE", claimIds: ["CLAIM-SERVICE-SERVICE"], title: "Service", description: "Send a service schedule request for review and confirmation by the branch team.", href: "/service", cta: "Request service" },
  { routeId: "ROUTE-PARTS", claimIds: ["CLAIM-SERVICE-PARTS"], title: "Genuine Parts", description: "Share model and part details so the parts team can review your inquiry.", href: "/parts", cta: "Request parts" },
  { routeId: "ROUTE-FLEET", claimIds: ["CLAIM-SERVICE-FLEET"], title: "Financing & Fleet", description: "Start a conversation about acquisition, financing intent, or fleet requirements.", href: "/fleet", cta: "Discuss fleet needs" },
] as const;

export function getEligibleSupportServices(
  now = new Date(),
  records: readonly SupportService[] = supportServiceCatalog,
  routes: readonly GovernedRoute[] = getGovernedRoutes(),
  claims: readonly GovernedClaim[] = getGovernedClaims(),
) {
  const eligibleRouteIds = new Set(
    getEligibleRoutes(now, routes, claims)
      .filter(({ status }) => status.startsWith("eligible"))
      .map(({ routeId }) => routeId),
  );
  const claimsById = new Map(claims.map((claim) => [claim.claimId, claim]));

  return records.filter(({ routeId, claimIds }) => (
    eligibleRouteIds.has(routeId)
    && claimIds.length > 0
    && claimIds.every((claimId) => {
      const claim = claimsById.get(claimId);
      return claim ? evaluateApproval(claim, now) : false;
    })
  ));
}

export const supportServices = getEligibleSupportServices();
