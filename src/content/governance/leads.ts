import type { LeadType } from "../../lib/leads/types";
import {
  isApprovalCurrent,
  isApprovedPolicyValue,
  leadOperatingContractSchema,
} from "../../lib/governance/schemas";

const pendingCapabilities = {
  completeNormalizedInquiryPersistence: { status: "pending" as const },
  stableReference: { status: "pending" as const },
  reconciliation: { status: "pending" as const },
  recoveryAfterDeliveryFailure: { status: "pending" as const },
  retryReplay: { status: "pending" as const },
  retention: { status: "pending" as const },
};

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
    centralOperationsOwnerRef: "OWNER-CENTRAL-OPERATIONS-PENDING",
    policyStatus: "pending",
    approval: {
      recordId,
      revision: 1,
      responsibleLane: departmentOwnerLane,
      departmentApproval: { status: "pending", lane: departmentOwnerLane },
      releaseConfirmation: { status: "pending", lane: "technical-release" },
    },
    capabilities: pendingCapabilities,
    responseWindow: { status: "proposal", value: 1, unit: "business-days" },
    escalationStages: [
      {
        stage: "routing-failure",
        ownerRef: "OWNER-CENTRAL-OPERATIONS-PENDING",
        timing: "immediate",
      },
      {
        stage: "unacknowledged",
        ownerRef: `OWNER-${departmentOwnerLane.toUpperCase()}-PENDING`,
        backupOwnerRef: `OWNER-${departmentOwnerLane.toUpperCase()}-BACKUP-PENDING`,
        threshold: { status: "proposal", value: 1, unit: "business-days" },
      },
    ],
    secondaryIntake: {
      status: "pending",
      mustBeContractEquivalent: true,
      capabilities: pendingCapabilities,
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
