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
  image?: EligibleSupportMedia;
};

export type EligibleSupportMedia = Readonly<{
  src: string;
  alt: string;
  sourceLabel: string;
  sourceUrl: string;
  publicCaveat: string;
}>;

const supportServiceCatalog: readonly SupportService[] = [
  { routeId: "ROUTE-TRUCKS", claimIds: ["CLAIM-SERVICE-SALES"], title: "Sales", description: "Compare model families and discuss the application your operation needs.", href: "/trucks", cta: "Explore trucks" },
  {
    routeId: "ROUTE-SERVICE",
    claimIds: ["CLAIM-SERVICE-IDENTITY", "CLAIM-SERVICE-PURPOSE", "CLAIM-SERVICE-REQUEST", "CLAIM-SERVICE-CONTACT"],
    title: "Service",
    description: "Send a service schedule request for review and confirmation by the branch team.",
    href: "/service",
    cta: "Request service",
    image: {
      src: "/images/official/quality-service.jpg",
      alt: "Hino service technicians inspecting a truck in an official Hino Motors Philippines image",
      sourceLabel: "Hino Motors Philippines — Quality Service",
      sourceUrl: "https://www.hino.com.ph/services",
      publicCaveat: "Official national service image for subject context; it does not depict Hino Cebu facilities, staff, or service availability.",
    },
  },
  {
    routeId: "ROUTE-PARTS",
    claimIds: ["CLAIM-PARTS-IDENTITY", "CLAIM-PARTS-PURPOSE", "CLAIM-PARTS-REQUEST", "CLAIM-PARTS-CONTACT"],
    title: "Genuine Parts",
    description: "Share model and part details so the parts team can review your inquiry.",
    href: "/parts",
    cta: "Request parts",
    image: {
      src: "/images/official/genuine-parts.png",
      alt: "Shelved parts boxes in an official Hino Motors Philippines parts image",
      sourceLabel: "Hino Motors Philippines — Genuine Parts",
      sourceUrl: "https://www.hino.com.ph/Parts.aspx",
      publicCaveat: "Official national parts image for subject context; it does not depict Hino Cebu stock, facilities, staff, or availability.",
    },
  },
  {
    routeId: "ROUTE-FINANCING",
    claimIds: ["CLAIM-FINANCING-IDENTITY", "CLAIM-FINANCING-PURPOSE", "CLAIM-FINANCING-REQUEST", "CLAIM-FINANCING-CONTACT"],
    title: "Financing",
    description: "Share acquisition requirements so the team can review your financing inquiry.",
    href: "/financing",
    cta: "Ask about financing",
    image: {
      src: "/images/official/financial-services.jpg",
      alt: "Two people reviewing documents in an official Hino Motors Philippines financial services image",
      sourceLabel: "Hino Motors Philippines — Hino Financial Services",
      sourceUrl: "https://www.hino.com.ph/hino-financial-service",
      publicCaveat: "Official national financing image for subject context; it does not state Hino Cebu terms, approval, or availability.",
    },
  },
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
