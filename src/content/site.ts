import { governedClaimSchema, type GovernedClaim } from "./governance/claims";
import { evaluateApproval } from "../lib/governance/eligibility";
import { approvalSchema, type ApprovalLane } from "../lib/governance/schemas";

export type BranchField = "identity" | "address" | "phone" | "hours" | "directions";
export type BranchRecord = {
  recordId: "BRANCH-HINO-CEBU";
  revision: number;
  fields: Record<BranchField, GovernedClaim>;
};

export const siteConfig = {
  name: "Hino Cebu",
  legalName: "Hino Cebu",
  tagline: "Trucks, Parts, Service & Support for Cebu Business",
  description:
    "Explore Hino trucks, request parts or service support, and connect with Hino Cebu for business and fleet needs.",
  address: "377 P. Almendras Extension, Cebu City, Central Visayas",
  phoneDisplay: "+63 32 346 3322",
  phoneHref: "tel:+63323463322",
  directionsUrl: "https://www.google.com/maps/search/?api=1&query=377%20P.%20Almendras%20Extension%2C%20Cebu%20City%2C%20Central%20Visayas",
  email: "",
  hours: [] as string[],
  socials: [
    { label: "Hino Motors Philippines on Facebook", href: "https://www.facebook.com/HinoMotorsPH/" },
    { label: "Hino Motors Philippines on Instagram", href: "https://www.instagram.com/hinomotors_philippines/" },
    { label: "Hino Motors Philippines on YouTube", href: "https://www.youtube.com/@hinomotorsphilippinescorpo1650/videos/" },
  ] as { label: string; href: string }[],
  nav: [
    { label: "Trucks", href: "/trucks" },
    { label: "Find Your Truck", href: "/find-your-truck" },
    { label: "Parts", href: "/parts" },
    { label: "Service", href: "/service" },
    { label: "Fleet", href: "/fleet" },
    { label: "Financing", href: "/financing" },
    { label: "Promotions", href: "/promotions" },
    { label: "Hino Cebu", href: "/hino-cebu" },
  ],
} as const;

function pendingField(field: BranchField, value: string, ownerLane: ApprovalLane) {
  return governedClaimSchema.parse({
    claimId: `CLAIM-BRANCH-${field.toUpperCase()}`,
    revision: 1,
    activeRevision: 1,
    surfaceId: "surface:branch",
    category: field === "phone" || field === "directions" ? "contact-action" : field === "hours" ? "purpose" : "identity",
    value,
    ownerLane,
    locality: "cebu",
    approval: approvalSchema.parse({
      recordId: `GOV-BRANCH-${field.toUpperCase()}`,
      revision: 1,
      responsibleLane: ownerLane,
      departmentApproval: { status: "pending", lane: ownerLane },
      releaseConfirmation: { status: "pending", lane: "technical-release" },
    }),
  });
}

const branchRecord: BranchRecord = {
  recordId: "BRANCH-HINO-CEBU",
  revision: 1,
  fields: {
    identity: pendingField("identity", siteConfig.name, "brand-content"),
    address: pendingField("address", siteConfig.address, "brand-content"),
    phone: pendingField("phone", siteConfig.phoneDisplay, "sales"),
    hours: pendingField("hours", "Operating hours pending approval", "aftersales"),
    directions: pendingField("directions", siteConfig.directionsUrl, "brand-content"),
  },
};

export function getEligibleBranch(now = new Date(), record: BranchRecord = branchRecord) {
  return Object.fromEntries(Object.entries(record.fields).flatMap(([field, claim]) => (
    evaluateApproval(claim, now) ? [[field, claim.value]] : []
  ))) as Partial<Record<BranchField, string>>;
}

export function getEligibleContactActions(now = new Date(), record: BranchRecord = branchRecord) {
  const eligible = getEligibleBranch(now, record);
  const actions: { actionId: string; kind: "phone" | "directions"; label: string; href: string }[] = [];
  if (eligible.phone) {
    actions.push({
      actionId: "branch-phone",
      kind: "phone",
      label: "Call Hino Cebu",
      href: `tel:${eligible.phone.replace(/[^+\d]/g, "")}`,
    });
  }
  if (eligible.directions) {
    try {
      const url = new URL(eligible.directions);
      if (url.protocol === "https:" && ["google.com", "www.google.com", "maps.google.com"].includes(url.hostname)) {
        actions.push({ actionId: "branch-directions", kind: "directions", label: "Directions", href: url.toString() });
      }
    } catch {
      // Invalid or unapproved direction targets fail closed.
    }
  }
  return actions;
}

export const directionsHref = siteConfig.directionsUrl || "/contact#location";

export const contentSources = {
  nationalSite: "https://www.hino.com.ph/",
  privacy: "https://www.hino.com.ph/privacy-policy",
  products: "https://www.hino.com.ph/products",
  service: "https://www.hino.com.ph/services",
  parts: "https://www.hino.com.ph/Parts.aspx",
  financing: "https://www.hino.com.ph/hino-financial-service",
  reviewedAt: "2026-08-18",
} as const;
