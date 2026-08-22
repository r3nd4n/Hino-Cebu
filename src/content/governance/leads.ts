import type { LeadType } from "../../lib/leads/types";
import {
  isApprovalCurrent,
  isApprovedPolicyValue,
  leadOperatingContractSchema,
} from "../../lib/governance/schemas";

const proposalCapabilities = {
  completeNormalizedInquiryPersistence: { status: "proposal" as const, value: "neon-postgres" },
  stableReference: { status: "proposal" as const, value: "database-generated-reference" },
  reconciliation: { status: "proposal" as const, value: "stored-status-history" },
  recoveryAfterDeliveryFailure: { status: "proposal" as const, value: "persist-before-resend-notification" },
  retryReplay: { status: "proposal" as const, value: "idempotent-notification-retry" },
  retention: { status: "proposal" as const },
};

export const leadProviderProposal = {
  durableStore: { status: "proposal", providerCode: "neon-postgres" },
  notificationTransport: {
    status: "proposal",
    providerCode: "resend",
    recipientStatus: "pending",
    sendingDomainStatus: "pending",
  },
  secondaryIntake: {
    status: "proposal",
    mode: "phone-to-neon",
    contactClaimId: "CLAIM-BRANCH-PHONE",
  },
} as const;

function createPendingLeadContract(leadType: LeadType) {
  const departmentOwnerLane = (["service", "parts"] as LeadType[]).includes(leadType)
    ? "aftersales" as const
    : "sales" as const;
  const recordId = `GOV-LEAD-${leadType.toUpperCase()}`;
  return leadOperatingContractSchema.parse({
    recordId,
    revision: 1,
    leadType,
    departmentOwnerLane,
    centralOperationsOwnerRef: "OWNER-JCS-001",
    policyStatus: "proposal",
    approval: {
      recordId,
      revision: 1,
      responsibleLane: departmentOwnerLane,
      departmentApproval: { status: "pending", lane: departmentOwnerLane },
      releaseConfirmation: { status: "pending", lane: "technical-release" },
    },
    capabilities: proposalCapabilities,
    responseWindow: { status: "proposal", value: 1, unit: "business-days" },
    escalationStages: [
      {
        stage: "routing-failure",
        ownerRef: "OWNER-JCS-001",
        timing: "immediate",
      },
      {
        stage: "unacknowledged",
        ownerRef: "OWNER-JCS-001",
        backupOwnerRef: `OWNER-${departmentOwnerLane.toUpperCase()}-BACKUP-PENDING`,
        threshold: { status: "proposal", value: 1, unit: "business-days" },
      },
    ],
    secondaryIntake: {
      status: "proposal",
      mustBeContractEquivalent: true,
      capabilities: proposalCapabilities,
    },
  });
}

export const leadOperatingContracts = (["sales", "parts", "service", "fleet", "financing"] as const)
  .map(createPendingLeadContract);

export type LeadOperatingContract = (typeof leadOperatingContracts)[number];

export function isLeadContractApproved(contract: LeadOperatingContract, now = new Date()) {
  if (contract.policyStatus !== "approved") return false;
  if (!isApprovalCurrent(contract.approval, contract.departmentOwnerLane, now)) return false;
  if (!Object.values(contract.capabilities).every((value) => (
    isApprovedPolicyValue(value, contract.departmentOwnerLane, now)
  ))) return false;
  if (!isApprovedPolicyValue(contract.responseWindow, contract.departmentOwnerLane, now)) return false;
  if (!isApprovedPolicyValue(contract.escalationStages[1].threshold, contract.departmentOwnerLane, now)) return false;
  if (contract.secondaryIntake.status !== "approved") return false;
  return Object.values(contract.secondaryIntake.capabilities).every((value) => (
    isApprovedPolicyValue(value, contract.departmentOwnerLane, now)
  ));
}
