import { z } from "zod";
import {
  approvalLaneSchema,
  approvalSchema,
  type Approval,
  type ApprovalLane,
} from "../../lib/governance/schemas";

export const claimCategories = [
  "identity",
  "purpose",
  "request-semantics",
  "contact-action",
  "product-detail",
  "offer",
] as const;

export const claimCategorySchema = z.enum(claimCategories);
export type ClaimCategory = z.infer<typeof claimCategorySchema>;

export const governedClaimSchema = z.strictObject({
  claimId: z.string().regex(/^CLAIM-[A-Z0-9]+(?:-[A-Z0-9]+)*$/),
  revision: z.number().int().positive(),
  activeRevision: z.number().int().positive(),
  surfaceId: z.string().regex(/^surface:[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: claimCategorySchema,
  value: z.string().trim().min(1),
  ownerLane: approvalLaneSchema,
  locality: z.enum(["cebu", "national"]),
  approval: approvalSchema,
});

export type GovernedClaim = z.infer<typeof governedClaimSchema>;

export const governedRouteSchema = z.strictObject({
  routeId: z.string().regex(/^ROUTE-[A-Z0-9]+(?:-[A-Z0-9]+)*$/),
  path: z.string().regex(/^\/(?:[a-z0-9-]+\/?)*$/),
  surfaceId: z.string().regex(/^surface:[a-z0-9]+(?:-[a-z0-9]+)*$/),
  minimumTruth: z.strictObject({
    identity: z.string().regex(/^CLAIM-/),
    purpose: z.string().regex(/^CLAIM-/),
    requestSemantics: z.string().regex(/^CLAIM-/),
    contactAction: z.string().regex(/^CLAIM-/),
  }),
  optionalClaimIds: z.array(z.string().regex(/^CLAIM-/)),
  unavailablePage: z.boolean(),
});

export type GovernedRoute = z.infer<typeof governedRouteSchema>;

function pendingApproval(recordId: string, responsibleLane: ApprovalLane): Approval {
  return approvalSchema.parse({
    recordId,
    revision: 1,
    responsibleLane,
    departmentApproval: { status: "pending", lane: responsibleLane },
    releaseConfirmation: { status: "pending", lane: "technical-release" },
  });
}

function pendingClaim(
  claimId: string,
  surfaceId: string,
  category: ClaimCategory,
  value: string,
  ownerLane: ApprovalLane,
): GovernedClaim {
  return governedClaimSchema.parse({
    claimId,
    revision: 1,
    activeRevision: 1,
    surfaceId,
    category,
    value,
    ownerLane,
    locality: "cebu",
    approval: pendingApproval(`GOV-${claimId}`, ownerLane),
  });
}

const claimCatalog: readonly GovernedClaim[] = [
  pendingClaim("CLAIM-TRUCKS-IDENTITY", "surface:trucks", "identity", "Hino truck model families", "brand-content"),
  pendingClaim("CLAIM-TRUCKS-PURPOSE", "surface:trucks", "purpose", "Compare model families for business use", "sales"),
  pendingClaim("CLAIM-TRUCKS-REQUEST", "surface:trucks", "request-semantics", "Request a configuration consultation", "sales"),
  pendingClaim("CLAIM-TRUCKS-CONTACT", "surface:trucks", "contact-action", "Contact Hino Cebu sales", "sales"),
  pendingClaim("CLAIM-HINO-200-DETAIL", "surface:hino-200", "product-detail", "Hino 200 model-family details", "sales"),
  pendingClaim("CLAIM-HINO-300-DETAIL", "surface:hino-300", "product-detail", "Hino 300 model-family details", "sales"),
  pendingClaim("CLAIM-HINO-500-DETAIL", "surface:hino-500", "product-detail", "Hino 500 model-family details", "sales"),
  pendingClaim("CLAIM-CAMPAIGN-HINO-300", "surface:campaign-hino-300", "offer", "Hino 300 Cebu campaign wording", "sales"),
  pendingClaim("CLAIM-SERVICE-SALES", "surface:service-sales", "purpose", "Sales consultation", "sales"),
  pendingClaim("CLAIM-SERVICE-SERVICE", "surface:service-service", "purpose", "Service requests", "aftersales"),
  pendingClaim("CLAIM-SERVICE-PARTS", "surface:service-parts", "purpose", "Parts inquiries", "aftersales"),
  pendingClaim("CLAIM-SERVICE-FLEET", "surface:service-fleet", "purpose", "Financing and fleet inquiries", "sales"),
  pendingClaim("CLAIM-FINANCING-IDENTITY", "surface:financing", "identity", "Truck financing inquiry", "brand-content"),
  pendingClaim("CLAIM-FINANCING-PURPOSE", "surface:financing", "purpose", "Share acquisition requirements for review", "sales"),
  pendingClaim("CLAIM-FINANCING-REQUEST", "surface:financing", "request-semantics", "Request financing information", "sales"),
  pendingClaim("CLAIM-FINANCING-CONTACT", "surface:financing", "contact-action", "Use an approved Hino Cebu contact option", "sales"),
  pendingClaim("CLAIM-FLEET-IDENTITY", "surface:fleet", "identity", "Fleet inquiry", "brand-content"),
  pendingClaim("CLAIM-FLEET-PURPOSE", "surface:fleet", "purpose", "Share fleet requirements for review", "sales"),
  pendingClaim("CLAIM-FLEET-REQUEST", "surface:fleet", "request-semantics", "Request fleet information", "sales"),
  pendingClaim("CLAIM-FLEET-CONTACT", "surface:fleet", "contact-action", "Use an approved Hino Cebu contact option", "sales"),
  pendingClaim("CLAIM-QUOTE-IDENTITY", "surface:quote", "identity", "Truck sales inquiry", "brand-content"),
  pendingClaim("CLAIM-QUOTE-PURPOSE", "surface:quote", "purpose", "Share truck requirements for review", "sales"),
  pendingClaim("CLAIM-QUOTE-REQUEST", "surface:quote", "request-semantics", "Request sales information", "sales"),
  pendingClaim("CLAIM-QUOTE-CONTACT", "surface:quote", "contact-action", "Use an approved Hino Cebu contact option", "sales"),
];

const routeCatalog: readonly GovernedRoute[] = [
  governedRouteSchema.parse({
    routeId: "ROUTE-TRUCKS",
    path: "/trucks",
    surfaceId: "surface:trucks",
    minimumTruth: {
      identity: "CLAIM-TRUCKS-IDENTITY",
      purpose: "CLAIM-TRUCKS-PURPOSE",
      requestSemantics: "CLAIM-TRUCKS-REQUEST",
      contactAction: "CLAIM-TRUCKS-CONTACT",
    },
    optionalClaimIds: ["CLAIM-HINO-200-DETAIL", "CLAIM-HINO-300-DETAIL", "CLAIM-HINO-500-DETAIL"],
    unavailablePage: true,
  }),
  ...([
    { routeId: "ROUTE-FINANCING", path: "/financing", surfaceId: "surface:financing", prefix: "CLAIM-FINANCING" },
    { routeId: "ROUTE-FLEET", path: "/fleet", surfaceId: "surface:fleet", prefix: "CLAIM-FLEET" },
    { routeId: "ROUTE-QUOTE", path: "/quote", surfaceId: "surface:quote", prefix: "CLAIM-QUOTE" },
  ] as const).map(({ routeId, path, surfaceId, prefix }) => governedRouteSchema.parse({
    routeId,
    path,
    surfaceId,
    minimumTruth: {
      identity: `${prefix}-IDENTITY`,
      purpose: `${prefix}-PURPOSE`,
      requestSemantics: `${prefix}-REQUEST`,
      contactAction: `${prefix}-CONTACT`,
    },
    optionalClaimIds: [],
    unavailablePage: true,
  })),
];

export function getGovernedClaims() {
  return claimCatalog;
}

export function getGovernedRoutes() {
  return routeCatalog;
}

export function getClaimCatalogSize() {
  return claimCatalog.length;
}
