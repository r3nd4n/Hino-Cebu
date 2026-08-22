import { governedClaimSchema, type GovernedClaim } from "./governance/claims";
import { evaluateApproval } from "../lib/governance/eligibility";
import {
  approvalSchema,
  isApprovalCurrent,
  type Approval,
  type ApprovalLane,
} from "../lib/governance/schemas";

export type BranchField = "identity" | "address" | "phone" | "hours" | "directions";
export type BranchRecord = {
  recordId: "BRANCH-HINO-CEBU";
  revision: number;
  fields: Record<BranchField, GovernedClaim>;
};

export type SocialPlatform = "facebook" | "youtube" | "instagram";
export type PublicSocialProfile =
  | { platform: SocialPlatform; label: string; status: "verified"; href: string }
  | { platform: SocialPlatform; label: string; status: "unverified" }
  | { platform: SocialPlatform; label: string; status: "withheld" };
export type SocialProfileStatus = "unverified" | "verified" | "withheld";

export type SocialProfileRecord = {
  platform: SocialPlatform;
  label: string;
} & (
  | { status: "unverified" | "withheld" }
  | { status: "verified"; pendingUrl: string; approval: Approval }
);

const socialProfileHosts: Readonly<Record<SocialPlatform, readonly string[]>> = {
  facebook: ["facebook.com", "www.facebook.com"],
  youtube: ["youtube.com", "www.youtube.com"],
  instagram: ["instagram.com", "www.instagram.com"],
};

const socialProfileRecords: readonly SocialProfileRecord[] = [
  { platform: "facebook", label: "Facebook", status: "unverified" },
  { platform: "youtube", label: "YouTube", status: "unverified" },
  { platform: "instagram", label: "Instagram", status: "unverified" },
];

export function getEligibleSocialProfiles(
  now = new Date(),
  records: readonly SocialProfileRecord[] = socialProfileRecords,
): PublicSocialProfile[] {
  return records.flatMap((record): PublicSocialProfile[] => {
    const { platform, label, status } = record;
    if (status === "verified") {
      if (!isApprovalCurrent(record.approval, "brand-content", now)) return [];
      try {
        const href = new URL(record.pendingUrl);
        if (href.protocol !== "https:" || !socialProfileHosts[platform].includes(href.hostname)) return [];
        return [{ platform, label, status: "verified", href: href.toString() }];
      } catch {
        return [];
      }
    }
    return [{ platform, label, status }];
  });
}

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
  hours: ["Monday–Saturday, 8:00 AM–5:00 PM", "Sunday, closed"],
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

const approvedAt = "2026-08-21T16:00:00.000Z";
const reviewAt = "2027-08-21T16:00:00.000Z";

function approvedField(
  field: BranchField,
  value: string,
  ownerLane: ApprovalLane,
  evidenceReference: string,
) {
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
      departmentApproval: {
        status: "approved",
        lane: ownerLane,
        approverRole: `${ownerLane}-owner`,
        approvedAt,
        reviewAt,
        evidence: { reference: evidenceReference },
        invalidatedAt: null,
        invalidationCode: null,
        supersededByRevision: null,
      },
      releaseConfirmation: {
        status: "approved",
        lane: "technical-release",
        approverRole: "technical-release-owner",
        approvedAt,
        reviewAt,
        evidence: { reference: "EVID-STAKEHOLDER-DIRECTIVE-20260822" },
        invalidatedAt: null,
        invalidationCode: null,
        supersededByRevision: null,
      },
    }),
  });
}

const branchRecord: BranchRecord = {
  recordId: "BRANCH-HINO-CEBU",
  revision: 1,
  fields: {
    identity: approvedField("identity", siteConfig.name, "brand-content", "EVID-BUSINESS-LISTING-20260818"),
    address: approvedField("address", siteConfig.address, "brand-content", "EVID-BUSINESS-LISTING-20260818"),
    phone: approvedField("phone", siteConfig.phoneDisplay, "sales", "EVID-BUSINESS-LISTING-20260818"),
    hours: approvedField("hours", siteConfig.hours.join("; "), "aftersales", "EVID-STAKEHOLDER-DIRECTIVE-20260822"),
    directions: approvedField("directions", siteConfig.directionsUrl, "brand-content", "EVID-BUSINESS-LISTING-20260818"),
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
