import {
  isApprovalCurrent,
  productionEstateSchema,
} from "../../lib/governance/schemas";

const approvedAt = "2026-08-21T16:00:00.000Z";
const reviewAt = "2027-08-21T16:00:00.000Z";
const stakeholderEvidence = { reference: "EVID-STAKEHOLDER-DIRECTIVE-20260822" };

const approvedDecision = (key: string, value: string, evidenceReference = stakeholderEvidence.reference) => ({
  key,
  value: {
    status: "approved" as const,
    value,
    approval: {
      recordId: `GOV-PRODUCTION-${key.toUpperCase()}`,
      revision: 1,
      responsibleLane: "technical-release" as const,
      departmentApproval: {
        status: "approved" as const,
        lane: "technical-release" as const,
        approverRole: "technical-release-owner",
        approvedAt,
        reviewAt,
        evidence: { reference: evidenceReference },
        invalidatedAt: null,
        invalidationCode: null,
        supersededByRevision: null,
      },
      releaseConfirmation: {
        status: "approved" as const,
        lane: "technical-release" as const,
        approverRole: "technical-release-owner",
        approvedAt,
        reviewAt,
        evidence: stakeholderEvidence,
        invalidatedAt: null,
        invalidationCode: null,
        supersededByRevision: null,
      },
    },
  },
});

const pendingDecision = (key: string, value?: string) => ({
  key,
  value: value === undefined
    ? { status: "pending" as const }
    : { status: "proposal" as const, value },
});

const approvedEnvelope = {
  recordId: "GOV-PRODUCTION-ESTATE",
  revision: 1,
  responsibleLane: "technical-release" as const,
  departmentApproval: {
    status: "approved" as const,
    lane: "technical-release" as const,
    approverRole: "technical-release-owner",
    approvedAt,
    reviewAt,
    evidence: stakeholderEvidence,
    invalidatedAt: null,
    invalidationCode: null,
    supersededByRevision: null,
  },
  releaseConfirmation: {
    status: "approved" as const,
    lane: "technical-release" as const,
    approverRole: "technical-release-owner",
    approvedAt,
    reviewAt,
    evidence: stakeholderEvidence,
    invalidatedAt: null,
    invalidationCode: null,
    supersededByRevision: null,
  },
};

export const productionEstateRecord = productionEstateSchema.parse({
  recordId: "GOV-PRODUCTION-ESTATE",
  revision: 1,
  approval: approvedEnvelope,
  decisions: [
    pendingDecision("production-domain", "https://hino-cebu.vercel.app"),
    pendingDecision("commercial-vercel-account", "hobby-preview-only"),
    approvedDecision("vercel-project", "hino-cebu", "EVID-VERCEL-PROJECT-20260822"),
    pendingDecision("dns-owner"),
    approvedDecision("deployment-owner", "OWNER-JCS-001", "EVID-VERCEL-PROJECT-20260822"),
    approvedDecision("rollback-owner", "OWNER-JCS-001", "EVID-VERCEL-PROJECT-20260822"),
  ],
});

export function isProductionEstateApproved(now = new Date()) {
  return isApprovalCurrent(productionEstateRecord.approval, "technical-release", now)
    && productionEstateRecord.decisions.every(({ value }) => value.status === "approved");
}
