import {
  approvalSchema,
  isApprovalCurrent,
  ownerAlertSchema,
  releaseAuthoritySchema,
  type Approval,
} from "../../lib/governance/schemas";

const approvedAt = "2026-08-21T16:00:00.000Z";
const reviewAt = "2027-08-21T16:00:00.000Z";
const stakeholderEvidence = { reference: "EVID-STAKEHOLDER-DIRECTIVE-20260822" };

const approvedTechnicalDecision = {
  status: "approved" as const,
  lane: "technical-release" as const,
  approverRole: "technical-release-owner",
  approvedAt,
  reviewAt,
  evidence: stakeholderEvidence,
  invalidatedAt: null,
  invalidationCode: null,
  supersededByRevision: null,
};

export const releaseAuthorityRecord = releaseAuthoritySchema.parse({
  recordId: "GOV-RELEASE-AUTHORITY",
  revision: 1,
  approval: {
    recordId: "GOV-RELEASE-AUTHORITY",
    revision: 1,
    responsibleLane: "technical-release",
    departmentApproval: approvedTechnicalDecision,
    releaseConfirmation: approvedTechnicalDecision,
  },
  ordinaryRelease: {
    status: "proposal",
    manualPromotionRequired: true,
    protectedPreviewRequired: true,
    technicalGatesRequired: true,
    businessApprovalsRequired: true,
  },
  emergencyAuthority: {
    status: "proposal",
    allowedRoles: ["technical-release-owner", "technical-release-backup"],
    allowedTriggers: ["customer", "lead", "privacy", "security", "indexing", "availability"],
    retrospectiveReviewRequired: true,
  },
  rollbackAuthority: {
    status: "proposal",
    allowedRoles: ["technical-release-owner", "technical-release-backup"],
    thresholds: [
      { status: "proposal", value: 1, unit: "failed-critical-journeys" },
      { status: "proposal", value: 1, unit: "durability-breaches" },
    ],
    immediateOwnerNotificationRequired: true,
  },
  closeout: {
    status: "proposal",
    requiredFields: [
      "trigger",
      "authority",
      "affected-release-configuration",
      "customer-lead-impact",
      "evidence",
      "notifications",
      "recovery-result",
      "follow-up-owner",
      "configuration-drift-reconciled",
    ],
  },
});

export function isReleaseAuthorityApproved(now = new Date()) {
  return isApprovalCurrent(releaseAuthorityRecord.approval, "technical-release", now)
    && releaseAuthorityRecord.ordinaryRelease.status === "approved"
    && releaseAuthorityRecord.emergencyAuthority.status === "approved"
    && releaseAuthorityRecord.rollbackAuthority.status === "approved"
    && releaseAuthorityRecord.closeout.status === "approved";
}

export function createOwnerAlert(
  governedRecord: Approval,
  triggerCode: "expired" | "invalidated",
  triggeredAt = new Date(),
) {
  const record = approvalSchema.parse(governedRecord);
  if (!(["expired", "invalidated"] as string[]).includes(triggerCode)) {
    throw new Error("OWNER_ALERT_TRIGGER_UNSUPPORTED");
  }
  const lane = record.responsibleLane.toUpperCase();
  return ownerAlertSchema.parse({
    alertId: `ALERT-${record.recordId.slice(4)}-R${record.revision}-${triggerCode.toUpperCase()}`,
    governedRecordId: record.recordId,
    governedRecordRevision: record.revision,
    responsibleLane: record.responsibleLane,
    responsibleOwnerRef: `OWNER-${lane}-PENDING`,
    triggerCode,
    triggeredAt: triggeredAt.toISOString(),
    status: "open",
    acknowledgedAt: null,
    acknowledgementEvidenceReference: null,
    attemptState: "not-attempted",
    retryEscalationDisposition: "escalate",
  });
}

export function createOwnerAlertForGovernanceChange(
  governedRecord: Approval,
  now = new Date(),
) {
  const record = approvalSchema.parse(governedRecord);
  const departmentApproval = record.departmentApproval;
  if (departmentApproval.status !== "approved") return null;
  if (departmentApproval.invalidatedAt) return createOwnerAlert(record, "invalidated", now);
  if (new Date(departmentApproval.reviewAt) <= now) return createOwnerAlert(record, "expired", now);
  return null;
}
