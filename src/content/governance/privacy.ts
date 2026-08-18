import {
  isApprovedPolicyValue,
  isApprovalCurrent,
  privacyContractSchema,
} from "../../lib/governance/schemas";

const pendingTopic = (key: string) => ({ key, value: { status: "pending" as const } });

export const privacyContract = privacyContractSchema.parse({
  recordId: "GOV-PRIVACY-CONTRACT",
  revision: 1,
  approval: {
    recordId: "GOV-PRIVACY-CONTRACT",
    revision: 1,
    responsibleLane: "privacy-legal",
    departmentApproval: { status: "pending", lane: "privacy-legal" },
    releaseConfirmation: { status: "pending", lane: "technical-release" },
  },
  topics: [
    pendingTopic("controller-identity"),
    pendingTopic("privacy-contact"),
    pendingTopic("processing-purposes"),
    pendingTopic("recipients-processors"),
    pendingTopic("retention-deletion"),
    pendingTopic("rights-process"),
    pendingTopic("incident-process"),
    pendingTopic("marketing-consent"),
  ],
});

export function getEligiblePrivacyTopics(
  now = new Date(),
  contract: typeof privacyContract = privacyContract,
) {
  if (!isApprovalCurrent(contract.approval, "privacy-legal", now)) return [];
  const topics = contract.topics.flatMap(({ key, value }) => (
    isApprovedPolicyValue(value, "privacy-legal", now) && typeof value.value === "string"
      ? [{ key, value: value.value }]
      : []
  ));
  return topics.length === privacyContract.topics.length ? topics : [];
}

export function isPrivacyContractApproved(now = new Date()) {
  return getEligiblePrivacyTopics(now).length === privacyContract.topics.length;
}
