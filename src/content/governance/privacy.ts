import {
  isApprovedPolicyValue,
  isApprovalCurrent,
  privacyContractSchema,
} from "../../lib/governance/schemas";

const approvedAt = "2026-08-21T16:00:00.000Z";
const reviewAt = "2027-08-21T16:00:00.000Z";
const stakeholderEvidence = { reference: "EVID-STAKEHOLDER-DIRECTIVE-20260822" };

const approvedDecision = (lane: "privacy-legal" | "technical-release") => ({
  status: "approved" as const,
  lane,
  approverRole: `${lane}-owner`,
  approvedAt,
  reviewAt,
  evidence: stakeholderEvidence,
  invalidatedAt: null,
  invalidationCode: null,
  supersededByRevision: null,
});

const proposalTopic = (key: string, value?: string) => ({
  key,
  value: value === undefined
    ? { status: "proposal" as const }
    : { status: "proposal" as const, value },
});

export const privacyContract = privacyContractSchema.parse({
  recordId: "GOV-PRIVACY-CONTRACT",
  revision: 1,
  approval: {
    recordId: "GOV-PRIVACY-CONTRACT",
    revision: 1,
    responsibleLane: "privacy-legal",
    departmentApproval: approvedDecision("privacy-legal"),
    releaseConfirmation: approvedDecision("technical-release"),
  },
  topics: [
    proposalTopic("controller-identity", "Hino Cebu website controller identity pending final commercial launch confirmation."),
    proposalTopic("privacy-contact", "Use the approved Hino Cebu branch contact until a dedicated privacy address is approved."),
    proposalTopic("processing-purposes", "Process inquiries to respond to truck, parts, service, fleet, and financing requests."),
    proposalTopic("recipients-processors", "Neon Postgres and Resend are proposed processors pending production configuration and review."),
    proposalTopic("retention-deletion"),
    proposalTopic("rights-process", "Submit privacy requests through an approved Hino Cebu contact channel."),
    proposalTopic("incident-process", "Escalate suspected privacy incidents to the technical release owner and privacy owner."),
    proposalTopic("marketing-consent", "Optional marketing tags remain disabled until a separate consent decision is approved."),
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
