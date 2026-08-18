import { z } from "zod";

export const approvalLanes = [
  "sales",
  "aftersales",
  "privacy-legal",
  "brand-content",
  "technical-release",
] as const;

export const approvalLaneSchema = z.enum(approvalLanes);
export const evidenceReferenceSchema = z.strictObject({
  reference: z.string().regex(/^EVID-[A-Z0-9]+(?:-[A-Z0-9]+)*$/),
});

const pendingApprovalSchema = z.strictObject({
  status: z.enum(["pending", "proposal"]),
  lane: approvalLaneSchema,
});

const approvedDecisionSchema = z.strictObject({
  status: z.literal("approved"),
  lane: approvalLaneSchema,
  approverRole: z.string().regex(/^[a-z][a-z0-9-]{2,63}$/),
  approvedAt: z.iso.datetime(),
  reviewAt: z.iso.datetime(),
  evidence: evidenceReferenceSchema,
  invalidatedAt: z.iso.datetime().nullable(),
  invalidationCode: z.string().regex(/^[a-z][a-z0-9-]{2,63}$/).nullable(),
  supersededByRevision: z.number().int().positive().nullable(),
}).refine(
  ({ invalidatedAt, invalidationCode }) => Boolean(invalidatedAt) === Boolean(invalidationCode),
  { message: "Invalidation time and code must be recorded together." },
);

export const approvalDecisionSchema = z.union([
  pendingApprovalSchema,
  approvedDecisionSchema,
]);

export const approvalSchema = z.strictObject({
  recordId: z.string().regex(/^GOV-[A-Z0-9]+(?:-[A-Z0-9]+)*$/),
  revision: z.number().int().positive(),
  responsibleLane: approvalLaneSchema,
  departmentApproval: approvalDecisionSchema,
  releaseConfirmation: approvalDecisionSchema,
});

export type ApprovalLane = z.infer<typeof approvalLaneSchema>;
export type Approval = z.infer<typeof approvalSchema>;

export const policyValueSchema = z.strictObject({
  status: z.enum(["pending", "proposal", "approved"]),
  value: z.unknown().optional(),
  unit: z.string().regex(/^[a-z][a-z-]{1,31}$/).optional(),
  approval: approvalSchema.optional(),
});

const repositoryDecisionSchema = z.strictObject({
  key: z.string().regex(/^[a-z][a-z0-9-]{2,63}$/),
  value: policyValueSchema,
});

export const productionEstateSchema = z.strictObject({
  recordId: z.literal("GOV-PRODUCTION-ESTATE"),
  revision: z.number().int().positive(),
  approval: approvalSchema,
  decisions: z.array(repositoryDecisionSchema).length(6),
});

export const privacyContractSchema = z.strictObject({
  recordId: z.literal("GOV-PRIVACY-CONTRACT"),
  revision: z.number().int().positive(),
  approval: approvalSchema,
  topics: z.array(repositoryDecisionSchema).length(8),
});

const leadCapabilitySchema = z.strictObject({
  completeNormalizedInquiryPersistence: policyValueSchema,
  stableReference: policyValueSchema,
  reconciliation: policyValueSchema,
  recoveryAfterDeliveryFailure: policyValueSchema,
  retryReplay: policyValueSchema,
  retention: policyValueSchema,
});

export const leadOperatingContractSchema = z.strictObject({
  recordId: z.string().regex(/^GOV-LEAD-(SALES|PARTS|SERVICE|FLEET|FINANCING)$/),
  revision: z.number().int().positive(),
  leadType: z.enum(["sales", "parts", "service", "fleet", "financing"]),
  departmentOwnerLane: z.enum(["sales", "aftersales"]),
  centralOperationsOwnerRef: z.string().regex(/^OWNER-[A-Z0-9]+(?:-[A-Z0-9]+)*$/),
  policyStatus: z.enum(["pending", "proposal", "approved"]),
  approval: approvalSchema,
  capabilities: leadCapabilitySchema,
  responseWindow: policyValueSchema,
  escalationStages: z.tuple([
    z.strictObject({
      stage: z.literal("routing-failure"),
      ownerRef: z.string().regex(/^OWNER-[A-Z0-9]+(?:-[A-Z0-9]+)*$/),
      timing: z.literal("immediate"),
    }),
    z.strictObject({
      stage: z.literal("unacknowledged"),
      ownerRef: z.string().regex(/^OWNER-[A-Z0-9]+(?:-[A-Z0-9]+)*$/),
      backupOwnerRef: z.string().regex(/^OWNER-[A-Z0-9]+(?:-[A-Z0-9]+)*$/),
      threshold: policyValueSchema,
    }),
  ]),
  secondaryIntake: z.strictObject({
    status: z.enum(["pending", "proposal", "approved"]),
    mustBeContractEquivalent: z.literal(true),
    capabilities: leadCapabilitySchema,
  }),
});

const releaseAuthoritySchema = z.strictObject({
  recordId: z.literal("GOV-RELEASE-AUTHORITY"),
  revision: z.number().int().positive(),
  approval: approvalSchema,
  ordinaryRelease: z.strictObject({
    status: z.enum(["pending", "proposal", "approved"]),
    manualPromotionRequired: z.literal(true),
    protectedPreviewRequired: z.literal(true),
    technicalGatesRequired: z.literal(true),
    businessApprovalsRequired: z.literal(true),
  }),
  emergencyAuthority: z.strictObject({
    status: z.enum(["pending", "proposal", "approved"]),
    allowedRoles: z.tuple([z.literal("technical-release-owner"), z.literal("technical-release-backup")]),
    allowedTriggers: z.array(z.enum(["customer", "lead", "privacy", "security", "indexing", "availability"])).min(1),
    retrospectiveReviewRequired: z.literal(true),
  }),
  rollbackAuthority: z.strictObject({
    status: z.enum(["pending", "proposal", "approved"]),
    allowedRoles: z.tuple([z.literal("technical-release-owner"), z.literal("technical-release-backup")]),
    thresholds: z.array(policyValueSchema).min(1),
    immediateOwnerNotificationRequired: z.literal(true),
  }),
  closeout: z.strictObject({
    status: z.enum(["pending", "proposal", "approved"]),
    requiredFields: z.array(z.enum([
      "trigger",
      "authority",
      "affected-release-configuration",
      "customer-lead-impact",
      "evidence",
      "notifications",
      "recovery-result",
      "follow-up-owner",
      "configuration-drift-reconciled",
    ])).length(9),
  }),
});

export const ownerAlertSchema = z.strictObject({
  alertId: z.string().regex(/^ALERT-[A-Z0-9]+(?:-[A-Z0-9]+)*$/),
  governedRecordId: z.string().regex(/^GOV-[A-Z0-9]+(?:-[A-Z0-9]+)*$/),
  governedRecordRevision: z.number().int().positive(),
  responsibleLane: approvalLaneSchema,
  responsibleOwnerRef: z.string().regex(/^OWNER-[A-Z0-9]+(?:-[A-Z0-9]+)*$/),
  triggerCode: z.enum(["expired", "invalidated"]),
  triggeredAt: z.iso.datetime(),
  status: z.enum(["open", "acknowledged", "resolved"]),
  acknowledgedAt: z.iso.datetime().nullable(),
  acknowledgementEvidenceReference: evidenceReferenceSchema.nullable(),
  attemptState: z.enum(["not-attempted", "attempted", "confirmed", "failed"]),
  retryEscalationDisposition: z.enum(["retry", "escalate", "resolved"]),
});

export const governanceRegistrySchema = z.strictObject({
  productionEstate: productionEstateSchema,
  privacy: privacyContractSchema,
  leadContracts: z.array(leadOperatingContractSchema).length(5),
  releaseAuthority: releaseAuthoritySchema,
});

export function isApprovalCurrent(input: unknown, expectedLane: ApprovalLane, now = new Date()) {
  const result = approvalSchema.safeParse(input);
  if (!result.success) return false;
  const { departmentApproval, releaseConfirmation, responsibleLane } = result.data;
  if (responsibleLane !== expectedLane) return false;
  if (departmentApproval.status !== "approved" || departmentApproval.lane !== expectedLane) return false;
  if (releaseConfirmation.status !== "approved" || releaseConfirmation.lane !== "technical-release") return false;
  if (departmentApproval.invalidatedAt || departmentApproval.supersededByRevision) return false;
  if (releaseConfirmation.invalidatedAt || releaseConfirmation.supersededByRevision) return false;
  return new Date(departmentApproval.approvedAt) <= now
    && new Date(releaseConfirmation.approvedAt) <= now
    && new Date(departmentApproval.reviewAt) > now
    && new Date(releaseConfirmation.reviewAt) > now;
}

export function isApprovedPolicyValue(input: unknown, expectedLane: ApprovalLane, now = new Date()) {
  const result = policyValueSchema.safeParse(input);
  return result.success
    && result.data.status === "approved"
    && result.data.value !== undefined
    && isApprovalCurrent(result.data.approval, expectedLane, now);
}

export { releaseAuthoritySchema };
