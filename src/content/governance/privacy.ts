import {
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

export function isPrivacyContractApproved(now = new Date()) {
  return isApprovalCurrent(privacyContract.approval, "privacy-legal", now)
    && privacyContract.topics.every(({ value }) => value.status === "approved");
}
